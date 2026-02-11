import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/stats
 * Returns platform statistics including scans today, accuracy, districts, and volunteers
 */
export async function GET(request: NextRequest) {
  try {
    // Calculate today's midnight
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get scans today count
    const scansToday = await prisma.scan.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    })

    // Hardcoded accuracy for now
    // TODO: Pull from model health logs
    const accuracy = 0.91

    // Get distinct districts count from volunteers
    const districtsResult = await prisma.volunteer.groupBy({
      by: ['district'],
      where: {
        district: {
          not: null,
        },
      },
    })
    const districts = districtsResult.length

    // Get active volunteers count
    const volunteers = await prisma.volunteer.count({
      where: {
        isActive: true,
      },
    })

    return NextResponse.json({
      scansToday,
      accuracy,
      districts,
      volunteers,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics', code: 'STATS_ERROR' },
      { status: 500 }
    )
  }
}
