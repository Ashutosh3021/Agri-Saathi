import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/farmer/register
 * Internal endpoint to upsert farmer by phone (called from WhatsApp webhook)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify internal key for security
    const internalKey = request.headers.get('X-Internal-Key')
    if (internalKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { phone, name, location, state } = body

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required', code: 'MISSING_PHONE' },
        { status: 400 }
      )
    }

    // Check if farmer exists
    const existingFarmer = await prisma.farmer.findUnique({
      where: { phone },
    })

    if (existingFarmer) {
      // Update existing farmer
      const updatedFarmer = await prisma.farmer.update({
        where: { id: existingFarmer.id },
        data: {
          name: name || existingFarmer.name,
          location: location || existingFarmer.location,
          state: state || existingFarmer.state,
        },
      })

      return NextResponse.json({
        farmer: updatedFarmer,
        isNew: false,
      }, { status: 200 })
    } else {
      // Create new farmer
      const newFarmer = await prisma.farmer.create({
        data: {
          phone,
          name: name || null,
          location: location || null,
          state: state || null,
        },
      })

      return NextResponse.json({
        farmer: newFarmer,
        isNew: true,
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Farmer registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register farmer', code: 'REGISTRATION_ERROR' },
      { status: 500 }
    )
  }
}
