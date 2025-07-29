'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'login'

  return (
    <div className="container mx-auto py-8">
      {mode === 'sign-up' ? (
        <div>
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p>Sign up form will go here</p>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold">Login</h1>
          <p>Login form will go here</p>
        </div>
      )}
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}