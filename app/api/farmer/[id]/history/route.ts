import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/farmer/[id]/history
 * Returns paginated scan and soil reading history for a specific farmer
 * Requires X-Internal-Key header for internal service access
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify internal key for security
    const internalKey = request.headers.get('X-Internal-Key')
    if (internalKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const farmerId = params.id

    if (!farmerId) {
      return NextResponse.json(
        { error: 'Farmer ID is required', code: 'MISSING_ID' },
        { status: 400 }
      )
    }

    // Parse pagination parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 20
    const skip = (page - 1) * pageSize

    // Verify farmer exists
    const farmer = await prisma.farmer.findUnique({
      where: { id: farmerId },
    })

    if (!farmer) {
      return NextResponse.json(
        { error: 'Farmer not found', code: 'FARMER_NOT_FOUND' },
        { status: 404 }
      )
    }

    // Get scans
    const scans = await prisma.scan.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' },
      include: {
        volunteer: {
          select: {
            name: true,
          },
        },
      },
      skip,
      take: pageSize,
    })

    // Get soil readings
    const soilReadings = await prisma.soilReading.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' },
      include: {
        volunteer: {
          select: {
            name: true,
          },
        },
      },
      skip,
      take: pageSize,
    })

    // Get totals
    const totalScans = await prisma.scan.count({ where: { farmerId } })
    const totalSoilReadings = await prisma.soilReading.count({ where: { farmerId } })

    return NextResponse.json({
      farmer: {
        id: farmer.id,
        name: farmer.name,
        phone: farmer.phone,
        location: farmer.location,
        state: farmer.state,
      },
      scans: scans.map(scan => ({
        id: scan.id,
        type: 'scan',
        disease: scan.diseaseDetected,
        confidence: scan.confidence,
        severity: scan.severity,
        scanType: scan.scanType,
        imageUrl: scan.imageUrl,
        farmerRating: scan.farmerRating,
        createdAt: scan.createdAt,
        volunteerName: scan.volunteer?.name || 'WhatsApp',
      })),
      soilReadings: soilReadings.map(reading => ({
        id: reading.id,
        type: 'soil',
        nitrogen: reading.nitrogen,
        phosphorus: reading.phosphorus,
        potassium: reading.potassium,
        moisture: reading.moisture,
        ph: reading.ph,
        recommendation: reading.recommendation,
        createdAt: reading.createdAt,
        volunteerName: reading.volunteer?.name || 'Device',
      })),
      pagination: {
        page,
        pageSize,
        totalScans,
        totalSoilReadings,
      },
    })
  } catch (error) {
    console.error('Farmer history fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch farmer history', code: 'HISTORY_ERROR' },
      { status: 500 }
    )
  }
}
