import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/volunteer/scans
 * Returns paginated scan history for the authenticated volunteer
 */
export async function GET(request: NextRequest) {
  try {
    // Get Supabase user from session
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Find volunteer by user_id
    const volunteer = await prisma.volunteer.findUnique({
      where: { userId: user.id },
    })

    if (!volunteer) {
      return NextResponse.json(
        { error: 'Volunteer not found', code: 'VOLUNTEER_NOT_FOUND' },
        { status: 404 }
      )
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 10
    const skip = (page - 1) * pageSize

    // Build where clause
    const whereClause: any = { volunteerId: volunteer.id }
    
    if (type !== 'all') {
      whereClause.scanType = type
    }

    // Get total count
    const total = await prisma.scan.count({ where: whereClause })

    // Get scans with farmer details
    const scans = await prisma.scan.findMany({
      where: whereClause,
      include: {
        farmer: {
          select: {
            name: true,
            location: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    })

    return NextResponse.json({
      scans: scans.map(scan => ({
        id: scan.id,
        disease: scan.diseaseDetected,
        confidence: scan.confidence,
        severity: scan.severity,
        scanType: scan.scanType,
        imageUrl: scan.imageUrl,
        farmerRating: scan.farmerRating,
        createdAt: scan.createdAt,
        farmer: {
          name: scan.farmer?.name || 'Unknown',
          location: scan.farmer?.location || 'Unknown',
          phone: scan.farmer?.phone || '',
        },
      })),
      total,
    })
  } catch (error) {
    console.error('Scans fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scans', code: 'SCANS_ERROR' },
      { status: 500 }
    )
  }
}
