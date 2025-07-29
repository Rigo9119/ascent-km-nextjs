import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Read-only client for Server Components (like layout.tsx)
export async function createSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // Do nothing - read-only for Server Components
        },
      },
    }
  )
}

// Writable client for Server Actions and Route Handlers
export async function createSupabaseServerAction() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore errors in Server Components
          }
        },
      },
    }
  )
}

// Helper function to get user (read-only)
export async function getUser() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}