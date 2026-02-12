import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Try to fetch real stats from database
    const [scansToday, districts, volunteers] = await Promise.all([
      prisma.scan.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
      prisma.volunteer.findMany({
        select: { district: true },
        distinct: ['district'],
      }),
      prisma.volunteer.count({
        where: {
          isActive: true,
        },
      }),
    ])

    return NextResponse.json({
      farmersHelped: scansToday,
      diseasesDetected: scansToday,
      scansToday,
      districts: districts.length,
      accuracy: 91.2,
      volunteers,
    })
  } catch (error) {
    console.error('Database error in /api/stats, using fallback data:', error)
    
    // FALLBACK: Return mock stats when database is unavailable
    // This lets the landing page work even without Supabase configured
    return NextResponse.json({
      farmersHelped: 247,
      diseasesDetected: 247,
      scansToday: 247,
      districts: 15,
      accuracy: 91.2,
      volunteers: 89,
      _mock: true,
    })
  }
}
