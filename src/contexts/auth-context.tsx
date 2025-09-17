'use client'

import { createContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createSbBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { translateAuthError } from '@/lib/utils/translate-auth-errors'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  signInWithProvider: (provider: 'google' | 'kakao') => Promise<void>
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createSbBrowserClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        setError(translateAuthError(error.message))
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }

      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        if (event === 'SIGNED_IN') {
          setError(null)

          // Only redirect on actual sign-in, not on page load when user is already signed in
          const currentPath = window.location.pathname;
          const isOnAuthPage = currentPath.startsWith('/auth');

          // Check if user has completed onboarding by checking if they have a profile
          if (session?.user && isOnAuthPage) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', session.user.id)
                .single()

              // If no profile exists or username is empty, redirect to onboarding
              if (!profile || !profile.username) {
                router.push('/auth/onboarding')
              } else {
                router.push('/')
              }
            } catch (error) {
              // If error fetching profile (likely doesn't exist), go to onboarding
              console.log(error)
              router.push('/auth/onboarding')
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setError(null)
          router.push('/auth')
        } else if (event === 'TOKEN_REFRESHED') {
          setError(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router, supabase])

  const signInWithProvider = async (provider: 'google' | 'kakao') => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(translateAuthError(message))
      setIsLoading(false)
    }
  }

  const signInWithPassword = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(translateAuthError(message))
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            is_new_user: true
          }
        }
      })

      if (error) throw error

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // User was created but needs to confirm email
        setError(translateAuthError('Please check your email and click the confirmation link to complete signup.'))
        return
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(translateAuthError(message))
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      // Success message
      setError('Revisa tu correo electrónico. Te hemos enviado un enlace para restablecer tu contraseña.')

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(translateAuthError(message))
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      setIsLoading(true)

      // Force immediate state update
      setUser(null)
      setSession(null)

      // Try to sign out from Supabase with timeout
      try {
        const signOutPromise = supabase.auth.signOut({ scope: 'local' })
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('SignOut timeout')), 5000)
        })

        await Promise.race([signOutPromise, timeoutPromise])
      } catch (supabaseError) {
        // Continue with local logout even if Supabase fails
      }

      // Navigate to auth page
      router.push('/auth')

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(translateAuthError(message))

      // Force clear state and navigate anyway
      setUser(null)
      setSession(null)
      router.push('/auth')
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    signInWithProvider,
    signInWithPassword,
    signUp,
    resetPassword,
    signOut,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
