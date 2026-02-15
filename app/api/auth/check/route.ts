import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie')
    
    if (!cookieHeader) {
      return NextResponse.json({ 
        authenticated: false, 
        error: 'No cookies found',
        cookies: null 
      })
    }

    // Check for Supabase auth cookies
    const hasSupabaseCookie = cookieHeader.includes('sb-')
    
    if (!hasSupabaseCookie) {
      return NextResponse.json({ 
        authenticated: false, 
        error: 'No Supabase cookies found',
        cookies: cookieHeader.split(';').map(c => c.trim().split('=')[0])
      })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        authenticated: false, 
        error: 'Server config error' 
      })
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`))
            return match ? decodeURIComponent(match[1]) : undefined
          },
          set() {},
          remove() {},
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ 
        authenticated: false, 
        error: error?.message || 'No user found',
        user: null
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      authenticated: false, 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown'
    })
  }
}
