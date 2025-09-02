'use client'

import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useAuth } from '@/hooks/use-auth'
import Image from 'next/image'
import LoginForm from '@/components/forms/login-form'

function AuthContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'login'
  const { signInWithProvider, isLoading, error, clearError } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className='w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg'>
        {error && (
          <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-md flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-600 hover:text-red-800">
              ×
            </button>
          </div>
        )}
        <div>
          <h2 className="text-3xl font-bold">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
          <p className="mt-2 text-sm text-gray-600 hidden">Or continue with</p>
          <div className="mt-3 flex flex-col justify-center gap-3 hidden">
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => signInWithProvider('google')}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} className="h-5 w-5" />
              Google
            </Button>

            <Button
              type="button"
              disabled={isLoading}
              onClick={() => signInWithProvider('kakao')}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#FEE500] px-4 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-yellow-300 disabled:opacity-50"
            >
              <Image src="/kakao.svg" alt="Kakao" width={20} height={20} className="h-5 w-5" />
              Kakao
            </Button>
          </div>
          <div className="relative mt-6 hidden">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <p className="bg-white px-2 text-gray-500">Or continue with email</p>
            </div>
          </div>
        </div>
        <LoginForm mode={mode} />
      </div>
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
