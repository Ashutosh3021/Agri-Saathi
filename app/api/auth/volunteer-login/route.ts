import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// In-memory rate limiting for login attempts
const loginRateLimit = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes in milliseconds
const MAX_LOGIN_ATTEMPTS = 5

function isRateLimited(identifier: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now()
  const record = loginRateLimit.get(identifier)
  
  if (!record) {
    loginRateLimit.set(identifier, { count: 1, timestamp: now })
    return { limited: false }
  }
  
  // Reset if window expired
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    loginRateLimit.set(identifier, { count: 1, timestamp: now })
    return { limited: false }
  }
  
  // Check if exceeded
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - (now - record.timestamp)) / 1000 / 60)
    return { limited: true, retryAfter }
  }
  
  // Increment count
  record.count++
  return { limited: false }
}

export async function POST(req: Request) {
  try {
    // Validate origin for CSRF protection
    const origin = req.headers.get('origin')
    
    // In production, strictly validate origin
    if (process.env.NODE_ENV === 'production' && origin) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL
      if (appUrl && !origin.startsWith(appUrl)) {
        console.warn('⚠️ Invalid origin:', origin)
        return NextResponse.json(
          { error: 'Invalid request origin' },
          { status: 403 }
        )
      }
    }

    // Get client IP for rate limiting
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    
    // Check rate limit
    const rateLimitCheck = isRateLimited(ip)
    if (rateLimitCheck.limited) {
      return NextResponse.json(
        { 
          error: `Too many login attempts. Please try again in ${rateLimitCheck.retryAfter} minutes.`,
          retryAfter: rateLimitCheck.retryAfter
        },
        { status: 429 }
      )
    }

    const { email: rawEmail, password } = await req.json()
    
    // Normalize email to lowercase
    const email = rawEmail?.toLowerCase()?.trim()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Create server client for authentication
    const cookieStore: { name: string; value: string; options?: CookieOptions }[] = []
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            // Get cookie from request headers
            const cookieHeader = req.headers.get('cookie')
            if (!cookieHeader) return undefined
            const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`))
            return match ? decodeURIComponent(match[1]) : undefined
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.push({ name, value, options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.push({ name, value: '', options })
          },
        },
      }
    )

    // Attempt to sign in with email and password
    console.log('🔐 Attempting login for:', email)
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error('❌ Login error:', signInError)
      
      // Handle specific error cases
      if (signInError.message?.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
      
      if (signInError.message?.includes('Email not confirmed')) {
        return NextResponse.json(
          { 
            error: 'Please verify your email first.',
            code: 'EMAIL_NOT_VERIFIED'
          },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { error: 'Login failed. Please try again.' },
        { status: 500 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Login failed. Please try again.' },
        { status: 500 }
      )
    }

    // Check if user is a volunteer
    const role = data.user.user_metadata?.role
    if (role !== 'volunteer') {
      // Sign out if not a volunteer
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: 'This login is only for volunteers' },
        { status: 403 }
      )
    }

    console.log('✅ Volunteer logged in:', data.user.id)
    console.log('🍪 Session tokens:', {
      access_token: data.session?.access_token ? 'present' : 'missing',
      refresh_token: data.session?.refresh_token ? 'present' : 'missing',
    })

    // Update last login in database using admin client
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    try {
      await supabaseAdmin
        .from('Volunteer')
        .update({ 
          last_login: new Date().toISOString(),
          last_login_attempt: new Date().toISOString()
        })
        .eq('auth_user_id', data.user.id)
      console.log('✅ Last login updated')
    } catch (err) {
      console.error('❌ Failed to update last login:', err)
    }

    console.log('🍪 Setting cookies:', cookieStore.map(c => c.name))
    console.log('🍪 Cookie details:', cookieStore.map(c => ({ 
      name: c.name, 
      hasValue: !!c.value,
      options: c.options 
    })))

    // Create success response with cookies
    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: role,
      }
    })

    // Set all cookies from the cookie store
    // Use the exact options from Supabase SSR
    cookieStore.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })

    console.log('✅ Login response ready with', cookieStore.length, 'cookies')
    return response

  } catch (error) {
    console.error('❌ Error in volunteer login:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
