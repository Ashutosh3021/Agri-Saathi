import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if volunteer exists using Supabase instead of Prisma
    const { data: volunteer, error: findError } = await supabase
      .from('Volunteer')
      .select('*')
      .eq('email', email)
      .single()

    if (findError || !volunteer) {
      return NextResponse.json(
        { error: 'This email is not registered. Please apply first.' },
        { status: 404 }
      )
    }

    if (!volunteer.email_verified) {
      return NextResponse.json(
        { error: 'Please verify your email first. Check your inbox for the verification link.' },
        { status: 403 }
      )
    }

    if (volunteer.status === 'suspended') {
      return NextResponse.json(
        { error: 'Your account has been suspended. Contact support.' },
        { status: 403 }
      )
    }

    // Send magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      }
    })

    if (error) {
      console.error('Magic link error:', error)
      return NextResponse.json(
        { error: 'Failed to send login link. Please try again.' },
        { status: 500 }
      )
    }

    // Update last login attempt time using Supabase
    await supabase
      .from('Volunteer')
      .update({ last_login_attempt: new Date().toISOString() })
      .eq('email', email)

    return NextResponse.json({
      success: true,
      message: 'Login link sent! Check your email.'
    })

  } catch (error) {
    console.error('Error sending magic link:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
