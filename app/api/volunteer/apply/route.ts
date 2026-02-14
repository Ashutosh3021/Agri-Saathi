import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// In-memory rate limiting (simple implementation - consider Redis for production)
const rateLimit = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 3

function isRateLimited(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimit.get(identifier)
  
  if (!record) {
    rateLimit.set(identifier, { count: 1, timestamp: now })
    return false
  }
  
  // Reset if window expired
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(identifier, { count: 1, timestamp: now })
    return false
  }
  
  // Check if exceeded
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }
  
  // Increment count
  record.count++
  return false
}

// Sanitize input to prevent SQL injection and XSS
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/['";]/g, '') // Remove quotes and semicolons
    .slice(0, 500) // Limit length
}

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { 
      name: rawName, 
      phone: rawPhone, 
      email: rawEmail, 
      district: rawDistrict, 
      state: rawState, 
      motivation: rawMotivation 
    } = body
    
    // Normalize and sanitize inputs
    const name = sanitizeInput(rawName || '')
    const phone = sanitizeInput(rawPhone || '').replace(/\D/g, '').slice(0, 15) // Only digits
    const email = rawEmail?.toLowerCase()?.trim()
    const district = sanitizeInput(rawDistrict || '')
    const state = sanitizeInput(rawState || '')
    const motivation = sanitizeInput(rawMotivation || '')

    console.log('📨 Received volunteer application:', { name, email, phone, district, state })

    // Validate required fields
    if (!email || !name || !phone || !district || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate name (at least 2 characters, letters and spaces only)
    if (!/^[a-zA-Z\s]{2,50}$/.test(name)) {
      return NextResponse.json(
        { error: 'Name must be 2-50 characters and contain only letters and spaces' },
        { status: 400 }
      )
    }

    // Validate email format strictly
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate phone (exactly 10 digits for Indian numbers)
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Phone number must be exactly 10 digits' },
        { status: 400 }
      )
    }

    // Validate district (at least 2 characters)
    if (district.length < 2 || district.length > 100) {
      return NextResponse.json(
        { error: 'District must be 2-100 characters' },
        { status: 400 }
      )
    }

    // Validate state
    if (state.length < 2 || state.length > 100) {
      return NextResponse.json(
        { error: 'State must be 2-100 characters' },
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

    console.log('📊 Total users found:', existingUsers.users.length)
    console.log('📧 Looking for email:', email)

    // Normalize both emails to lowercase for comparison
    // Also check if user is not deleted (some Supabase configs soft-delete users)
    const existingUser = existingUsers.users.find(u => 
      u.email?.toLowerCase() === email && !u.deleted_at
    )
    if (existingUser) {
      console.log('⚠️ Email already registered:', existingUser.id, 'Deleted:', !!existingUser.deleted_at)
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      )
    }

    // Check if phone already exists in Volunteer table
    const { data: existingPhone } = await supabase
      .from('Volunteer')
      .select('id')
      .eq('phone', phone)
      .single()
    
    if (existingPhone) {
      return NextResponse.json(
        { error: 'This phone number is already registered' },
        { status: 409 }
      )
    }

    // Create Supabase Auth user
    console.log('✅ Creating Supabase auth user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: false,
      user_metadata: { 
        name, 
        role: 'volunteer',
        phone,
        district,
        state
      }
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
    
    let volunteerData: string
    try {
      const { data, error: sqlError } = await supabase.rpc('create_volunteer', {
        p_auth_user_id: authData.user.id,
        p_email: email,
        p_name: name,
        p_phone: phone,
        p_district: district,
        p_state: state,
        p_motivation: motivation || null
      })

      if (sqlError) {
        throw sqlError
      }
      
      volunteerData = data as string
    } catch (sqlError: any) {
      console.error('❌ SQL error:', sqlError)
      
      // Clean up auth user on failure
      await supabase.auth.admin.deleteUser(authData.user.id)
      
      // Check if it's a missing function error
      if (sqlError.message?.includes('function') || sqlError.message?.includes('undefined')) {
        return NextResponse.json(
          { 
            error: 'Database function not found',
            details: 'Please run the create_volunteer function SQL in Supabase',
            code: 'MISSING_FUNCTION'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to save volunteer data',
          details: sqlError.message
        },
        { status: 500 }
      )
    }

    console.log('✅ Volunteer record created:', volunteerData)

    // Send magic link email with better error handling
    console.log('📧 Sending magic link email...')
    let emailSent = false
    let emailErrorMsg = ''
    
    try {
      const { error: emailError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
          data: { volunteer_id: volunteerData }
        }
      })

      if (emailError) {
        // Check for rate limit
        if (emailError.status === 429 || emailError.message?.includes('rate limit')) {
          emailErrorMsg = 'Email rate limit exceeded. Please try again in 1 hour.'
        } else {
          emailErrorMsg = emailError.message
        }
        console.error('❌ Magic link email error:', emailError)
      } else {
        emailSent = true
        console.log('✅ Magic link email sent')
      }
    } catch (emailError: any) {
      emailErrorMsg = emailError.message || 'Failed to send email'
      console.error('❌ Email sending exception:', emailError)
    }

    // Return appropriate response based on email status
    if (!emailSent) {
      // User was created but email failed - they can still log in later
      return NextResponse.json({
        success: true,
        warning: true,
        message: 'Account created successfully but verification email could not be sent. Please contact support or try logging in later.',
        emailError: emailErrorMsg,
        volunteerId: volunteerData
      }, { status: 200 })
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
