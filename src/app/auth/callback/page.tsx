'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSbBrowserClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createSbBrowserClient()

      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth')
          return
        }

        if (data.session?.user) {
          // Check if user was created in the last minute (likely a new signup)
          const userCreatedAt = new Date(data.session.user.created_at)
          const oneMinuteAgo = new Date(Date.now() - 60 * 1000)

          const isNewUser = userCreatedAt > oneMinuteAgo || data.session.user.user_metadata?.is_new_user

          if (isNewUser) {
            router.push('/auth/onboarding')
          } else {
            router.push('/')
          }
        } else {
          router.push('/auth')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/auth')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}
