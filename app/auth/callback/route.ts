import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables for auth callback')
}

// Admin client for database operations
const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || ''
)

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    // Handle Supabase auth errors
    if (error) {
      console.error('❌ Supabase auth error:', error, errorDescription)
      return NextResponse.redirect(
        `${requestUrl.origin}/Volunteers?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`
      )
    }

    if (!code) {
      console.error('❌ No code provided in callback')
      return NextResponse.redirect(`${requestUrl.origin}/Volunteers?error=no_code`)
    }

    // Track cookies that need to be set
    const cookiesToSet: { name: string; value: string; options?: CookieOptions }[] = []
    
    const supabase = createServerClient(
      supabaseUrl || '',
      supabaseAnonKey || '',
      {
        cookies: {
          get(name: string) {
            // Get cookie from request headers
            const cookieHeader = request.headers.get('cookie')
            if (!cookieHeader) return undefined
            const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`))
            return match ? decodeURIComponent(match[1]) : undefined
          },
          set(name: string, value: string, options: CookieOptions) {
            // Track cookie to be set with secure options for production
            const cookieOptions: CookieOptions = {
              ...options,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              httpOnly: true
            }
            cookiesToSet.push({ name, value, options: cookieOptions })
          },
          remove(name: string, options: CookieOptions) {
            // Track cookie to be removed
            const cookieOptions: CookieOptions = {
              ...options,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              httpOnly: true
            }
            cookiesToSet.push({ name, value: '', options: cookieOptions })
          },
        },
      }
    )
    
    // Exchange code for session
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError || !data.user) {
      console.error('❌ Auth callback error:', sessionError)
      return NextResponse.redirect(
        `${requestUrl.origin}/Volunteers?error=auth_failed&message=${encodeURIComponent(sessionError?.message || '')}`
      )
    }

    console.log('✅ Auth callback: User authenticated', data.user.id)
    
    // Check user role from metadata
    const role = data.user.user_metadata?.role
    console.log('👤 User role:', role)
    
    // Update volunteer record - only for volunteers
    if (role === 'volunteer') {
      try {
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
          // Don't fail - user is still authenticated
        } else {
          console.log('✅ Volunteer record updated:', updateData)
        }
      } catch (updateErr) {
        console.error('❌ Error updating volunteer record:', updateErr)
        // Continue - user is authenticated even if update fails
      }

      // Create redirect response
      const redirectResponse = NextResponse.redirect(`${requestUrl.origin}/Volunteers/Dashboard`)
      
      // Set all tracked cookies on the redirect response
      cookiesToSet.forEach(({ name, value, options }) => {
        redirectResponse.cookies.set(name, value, options)
      })
      
      return redirectResponse
    }
    
    // Redirect admin to admin dashboard
    if (role === 'admin') {
      console.log('👑 Redirecting admin to dashboard')
      const redirectResponse = NextResponse.redirect(`${requestUrl.origin}/admin`)
      
      // Set all tracked cookies on the redirect response
      cookiesToSet.forEach(({ name, value, options }) => {
        redirectResponse.cookies.set(name, value, options)
      })
      
      return redirectResponse
    }
    
    // Default redirect for other roles
    console.log('🔄 Default redirect to home')
    const redirectResponse = NextResponse.redirect(`${requestUrl.origin}/`)
    
    // Set all tracked cookies on the redirect response
    cookiesToSet.forEach(({ name, value, options }) => {
      redirectResponse.cookies.set(name, value, options)
    })
    
    return redirectResponse

  } catch (error) {
    console.error('❌ Unexpected error in auth callback:', error)
    const requestUrl = new URL(request.url)
    return NextResponse.redirect(
      `${requestUrl.origin}/Volunteers?error=callback_error&message=${encodeURIComponent(error instanceof Error ? error.message : '')}`
    )
  }
}
