import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  try {
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
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Use Supabase directly instead of Prisma
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: volunteer, error: dbError } = await supabaseAdmin
      .from('Volunteer')
      .select('id, name, email, phone, district, state, total_coins, total_scans, avg_rating, status, email_verified, created_at, last_login')
      .eq('auth_user_id', session.user.id)
      .single()

    if (dbError || !volunteer) {
      console.error('Database error:', dbError)
      // Return user metadata as fallback
      return NextResponse.json({
        volunteer: {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'Volunteer',
          email: session.user.email,
          phone: session.user.user_metadata?.phone || '',
          district: session.user.user_metadata?.district || '',
          state: session.user.user_metadata?.state || '',
          total_coins: 0,
          total_scans: 0,
          avg_rating: 0,
          status: 'active',
          email_verified: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        },
        warning: 'Using fallback data'
      })
    }

    return NextResponse.json({ volunteer })
  } catch (error) {
    console.error('Error fetching volunteer:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
