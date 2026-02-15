import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie')
    const cookiesToRemove: { name: string; options?: CookieOptions }[] = []
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 })
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            if (!cookieHeader) return undefined
            const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`))
            return match ? decodeURIComponent(match[1]) : undefined
          },
          set(name: string, value: string, options: CookieOptions) {
            // Not needed for signout
          },
          remove(name: string, options: CookieOptions) {
            cookiesToRemove.push({ name, options })
          },
        },
      }
    )

    await supabase.auth.signOut()

    const response = NextResponse.json({ success: true })
    
    // Clear all auth cookies
    cookiesToRemove.forEach(({ name, options }) => {
      response.cookies.set(name, '', {
        ...options,
        path: '/',
        maxAge: 0,
      })
    })

    return response

  } catch (error) {
    return NextResponse.json({ error: 'Signout failed' }, { status: 500 })
  }
}
