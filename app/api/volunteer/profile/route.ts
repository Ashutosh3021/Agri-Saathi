import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/volunteer/profile
 * Returns volunteer profile data including recent scans and leaderboard rank
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

    // Get last 5 scans with farmer details
    const recentScans = await prisma.scan.findMany({
      where: { volunteerId: volunteer.id },
      include: {
        farmer: {
          select: {
            name: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Get national rank from leaderboard cache
    const leaderboardEntry = await prisma.leaderboardCache.findUnique({
      where: { volunteerId: volunteer.id },
      select: { nationalRank: true },
    })

    const rank = leaderboardEntry?.nationalRank || 0

    return NextResponse.json({
      volunteer: {
        id: volunteer.id,
        name: volunteer.name,
        phone: volunteer.phone,
        district: volunteer.district,
        state: volunteer.state,
        totalCoins: volunteer.totalCoins,
        totalScans: volunteer.totalScans,
        avgRating: volunteer.avgRating,
        isActive: volunteer.isActive,
        createdAt: volunteer.createdAt,
      },
      recentScans: recentScans.map(scan => ({
        id: scan.id,
        disease: scan.diseaseDetected,
        confidence: scan.confidence,
        severity: scan.severity,
        scanType: scan.scanType,
        createdAt: scan.createdAt,
        farmerName: scan.farmer?.name || 'Unknown',
        farmerLocation: scan.farmer?.location || 'Unknown',
      })),
      rank,
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile', code: 'PROFILE_ERROR' },
      { status: 500 }
    )
  }
}
