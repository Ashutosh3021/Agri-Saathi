import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

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

    const volunteer = await prisma.volunteer.findUnique({
      where: { authUserId: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        district: true,
        state: true,
        totalCoins: true,
        totalScans: true,
        avgRating: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        lastLogin: true,
      }
    })

    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 })
    }

    return NextResponse.json({ volunteer })
  } catch (error) {
    console.error('Error fetching volunteer:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
