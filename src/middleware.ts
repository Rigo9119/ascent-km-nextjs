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
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
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

  // Auth routes - redirect to dashboard if already authenticated (except onboarding for users without profiles)
  if (request.nextUrl.pathname.startsWith('/auth') && user) {
    // Allow access to onboarding page for users who haven't completed their profile
    if (request.nextUrl.pathname === '/auth/onboarding') {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()

        // Allow onboarding if no profile exists or username is empty
        if (!profile || !profile.username) {
          return response // Allow access to onboarding
        }
      } catch (error) {
        // If error fetching profile (likely doesn't exist), allow onboarding
        console.log(error)
        return response
      }
    }

    // For all other auth routes or users with completed profiles trying to access onboarding
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
