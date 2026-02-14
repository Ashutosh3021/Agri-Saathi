import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ].filter(Boolean)
    
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

    const { email: rawEmail } = await req.json()
    
    // Normalize email to lowercase
    const email = rawEmail?.toLowerCase()?.trim()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Check if volunteer exists using Supabase
    console.log('🔍 Checking volunteer:', email)
    const { data: volunteer, error: findError } = await supabase
      .from('Volunteer')
      .select('*')
      .eq('email', email)
      .single()

    if (findError || !volunteer) {
      console.log('❌ Volunteer not found:', email)
      // Don't reveal whether email exists for security
      return NextResponse.json(
        { error: 'Invalid email or account not found' },
        { status: 404 }
      )
    }

    // Check if email is verified
    if (!volunteer.email_verified) {
      console.log('⚠️ Email not verified:', email)
      return NextResponse.json(
        { 
          error: 'Please verify your email first. Check your inbox for the verification link.',
          code: 'EMAIL_NOT_VERIFIED'
        },
        { status: 403 }
      )
    }

    // Check account status
    if (volunteer.status === 'suspended') {
      console.log('⛔ Account suspended:', email)
      return NextResponse.json(
        { error: 'Your account has been suspended. Contact support.' },
        { status: 403 }
      )
    }

    if (volunteer.status === 'inactive' || volunteer.status === 'pending') {
      console.log('⏳ Account pending:', email)
      return NextResponse.json(
        { error: 'Your account is pending approval. Please wait for admin verification.' },
        { status: 403 }
      )
    }

    // Send magic link
    console.log('📧 Sending magic link to:', email)
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      }
    })

    if (error) {
      console.error('❌ Magic link error:', error)
      
      // Handle specific error cases
      if (error.status === 429 || error.message?.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Too many emails sent. Please try again later.' },
          { status: 429 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to send login link. Please try again.' },
        { status: 500 }
      )
    }

    // Update last login attempt time
    await supabase
      .from('Volunteer')
      .update({ last_login_attempt: new Date().toISOString() })
      .eq('email', email)

    console.log('✅ Magic link sent to:', email)

    return NextResponse.json({
      success: true,
      message: 'Login link sent! Check your email.'
    })

  } catch (error) {
    console.error('❌ Error sending magic link:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
