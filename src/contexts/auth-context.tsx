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
          // Check if this is a new user (signup) by checking metadata or recent creation
          const userCreatedAt = new Date(session?.user?.created_at || '')
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
          const isRecentUser = userCreatedAt > fiveMinutesAgo
          const hasNewUserMetadata = session?.user?.user_metadata?.is_new_user
          
          console.log('SIGNED_IN event:', {
            userEmail: session?.user?.email,
            userCreatedAt,
            isRecentUser,
            hasNewUserMetadata,
            metadata: session?.user?.user_metadata
          })
          
          if (hasNewUserMetadata || isRecentUser) {
            console.log('Redirecting to onboarding')
            router.push('/auth/onboarding')
          } else {
            console.log('Redirecting to home')
            router.push('/')
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
  }, [supabase.auth, router])

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
        console.log('Email confirmation required for user:', data.user.email)
        setError('Please check your email and click the confirmation link to complete signup.')
        return
      }
      
      // If signup is successful and user is immediately signed in, redirect will happen via auth state change
      if (data.session?.user) {
        console.log('User signed up and session created immediately:', data.session.user.email)
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
