import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/volunteer/leaderboard
 * Returns paginated leaderboard with filtering by national/state/district
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

    // Get current volunteer for filter context
    const currentVolunteer = await prisma.volunteer.findUnique({
      where: { userId: user.id },
    })

    if (!currentVolunteer) {
      return NextResponse.json(
        { error: 'Volunteer not found', code: 'VOLUNTEER_NOT_FOUND' },
        { status: 404 }
      )
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get('filter') || 'national'
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const pageSize = 20
    const skip = (page - 1) * pageSize

    // Build where clause based on filter
    let whereClause: any = {}
    
    if (filter === 'state' && currentVolunteer.state) {
      whereClause.state = currentVolunteer.state
    } else if (filter === 'district' && currentVolunteer.district) {
      whereClause.district = currentVolunteer.district
    }

    // Add name search if provided
    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    // Get total count
    const total = await prisma.leaderboardCache.count({ where: whereClause })

    // Get leaderboard entries with appropriate ranking
    const volunteers = await prisma.leaderboardCache.findMany({
      where: whereClause,
      orderBy: { totalCoins: 'desc' },
      skip,
      take: pageSize,
    })

    // Add rank to each entry
    const volunteersWithRank = volunteers.map((v, index) => ({
      ...v,
      rank: skip + index + 1,
    }))

    // Always include current user's row
    let currentUserRank = 0
    const currentUserEntry = await prisma.leaderboardCache.findUnique({
      where: { volunteerId: currentVolunteer.id },
    })

    if (currentUserEntry) {
      // Calculate rank based on filter
      if (filter === 'national') {
        currentUserRank = currentUserEntry.nationalRank || 0
      } else if (filter === 'state' && currentVolunteer.state) {
        const stateRank = await prisma.leaderboardCache.count({
          where: {
            state: currentVolunteer.state,
            totalCoins: { gt: currentUserEntry.totalCoins },
          },
        })
        currentUserRank = stateRank + 1
      } else if (filter === 'district' && currentVolunteer.district) {
        const districtRank = await prisma.leaderboardCache.count({
          where: {
            district: currentVolunteer.district,
            totalCoins: { gt: currentUserEntry.totalCoins },
          },
        })
        currentUserRank = districtRank + 1
      }

      // Check if current user is already in the list
      const userInList = volunteersWithRank.some(v => v.volunteerId === currentVolunteer.id)
      
      if (!userInList && page === 1) {
        volunteersWithRank.push({
          ...currentUserEntry,
          rank: currentUserRank,
        })
      }
    }

    return NextResponse.json({
      volunteers: volunteersWithRank,
      total,
      currentUserRank,
    })
  } catch (error) {
    console.error('Leaderboard fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', code: 'LEADERBOARD_ERROR' },
      { status: 500 }
    )
  }
}
