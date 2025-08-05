'use client'

import { createContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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

  const supabase = createSupabaseClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        setError(error.message)
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

          // Check if user has completed onboarding by checking if they have a profile
          if (session?.user) {
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
      setError(message)
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
      setError(message)
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
        setError('Please check your email and click the confirmation link to complete signup.')
        return
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
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
    signOut,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
