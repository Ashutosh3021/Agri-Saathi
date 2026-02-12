import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, district, state, motivation } = body

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Must be 10 digits.' },
        { status: 400 }
      )
    }

    if (!name || !district || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Application received. We will contact you within 24 hours.'
    })
  } catch (error) {
    console.error('Error in volunteer apply:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
