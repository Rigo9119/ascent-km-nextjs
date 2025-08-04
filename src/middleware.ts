import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes - redirect to auth if not authenticated
  const protectedPaths = ['/profile', '/settings']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !user) {
    const url = new URL('/auth', request.url)
    return NextResponse.redirect(url)
  }

  // Auth routes - redirect to dashboard if already authenticated (except onboarding for new users)
  if (request.nextUrl.pathname.startsWith('/auth') && user) {
    // Allow access to onboarding page for new users (created within last 5 minutes or has is_new_user metadata)
    if (request.nextUrl.pathname === '/auth/onboarding') {
      const userCreatedAt = new Date(user.created_at)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const isRecentUser = userCreatedAt > fiveMinutesAgo
      const hasNewUserMetadata = user.user_metadata?.is_new_user
      
      if (hasNewUserMetadata || isRecentUser) {
        return response // Allow access to onboarding
      }
    }
    
    // For all other auth routes or non-new users trying to access onboarding
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
