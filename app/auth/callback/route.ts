import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Admin client for database operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      console.log('✅ Auth callback: User authenticated', data.user.id)
      
      // Update volunteer record using Supabase (not Prisma)
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from('Volunteer')
        .update({
          email_verified: true,
          status: 'active',
          is_active: true,
          last_login: new Date().toISOString()
        })
        .eq('auth_user_id', data.user.id)
        .select()

      if (updateError) {
        console.error('❌ Failed to update volunteer:', updateError)
        // Still redirect even if update fails - user is authenticated
      } else {
        console.log('✅ Volunteer record updated:', updateData)
      }

      // Redirect to volunteer dashboard
      return NextResponse.redirect(`${requestUrl.origin}/Volunteers/Dashboard`)
    } else {
      console.error('❌ Auth callback error:', error)
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${requestUrl.origin}/Volunteers?error=auth_failed`)
}
