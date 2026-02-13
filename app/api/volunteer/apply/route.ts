import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, email, district, state, motivation } = body

    console.log('📨 Received volunteer application:', { name, email, phone, district, state })

    // Validate required fields
    if (!email || !name || !phone || !district || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate phone is 10 digits
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Phone number must be exactly 10 digits' },
        { status: 400 }
      )
    }

    // Check if email exists in auth
    console.log('🔍 Checking if email exists in auth...')
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Error listing users:', listError)
      return NextResponse.json(
        { error: 'Failed to check existing users', details: listError.message },
        { status: 500 }
      )
    }

    const emailExists = existingUsers.users.some(u => u.email === email)
    if (emailExists) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      )
    }

    // Create Supabase Auth user
    console.log('✅ Creating Supabase auth user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: false,
      user_metadata: { name, role: 'volunteer' }
    })

    if (authError || !authData.user) {
      console.error('❌ Supabase auth error:', authError)
      return NextResponse.json(
        { error: 'Failed to create account', details: authError?.message },
        { status: 500 }
      )
    }

    console.log('✅ Supabase user created:', authData.user.id)

    // Try to create volunteer record using raw SQL via RPC
    console.log('💾 Creating volunteer record via SQL...')
    
    const { data: volunteerData, error: sqlError } = await supabase.rpc('create_volunteer', {
      p_auth_user_id: authData.user.id,
      p_email: email,
      p_name: name,
      p_phone: phone,
      p_district: district,
      p_state: state,
      p_motivation: motivation || null
    })

    if (sqlError) {
      console.error('❌ SQL error:', sqlError)
      
      // Clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json(
        { 
          error: 'Failed to save volunteer data',
          details: sqlError.message,
          hint: 'Please run the create_volunteer function in Supabase SQL Editor'
        },
        { status: 500 }
      )
    }

    console.log('✅ Volunteer record created:', volunteerData)

    // Send magic link email
    console.log('📧 Sending magic link email...')
    const { error: emailError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
        data: { volunteer_id: volunteerData }
      }
    })

    if (emailError) {
      console.error('⚠️ Magic link email error:', emailError)
    } else {
      console.log('✅ Magic link email sent')
    }

    return NextResponse.json({
      success: true,
      message: 'Application received! Check your email for a verification link.',
      volunteerId: volunteerData
    })

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: 'Something went wrong', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
