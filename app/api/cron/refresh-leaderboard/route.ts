import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/cron/refresh-leaderboard
 * Recalculates leaderboard rankings (national, state, district)
 * Called by Vercel cron every 5 minutes
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('Authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
    
    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Recalculate national ranks using raw SQL
    await prisma.$executeRaw`
      WITH ranked AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY "totalCoins" DESC) as rank
        FROM "LeaderboardCache"
      )
      UPDATE "LeaderboardCache"
      SET "nationalRank" = ranked.rank
      FROM ranked
      WHERE "LeaderboardCache".id = ranked.id
    `

    // Recalculate state ranks
    await prisma.$executeRaw`
      WITH state_ranked AS (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY state ORDER BY "totalCoins" DESC) as rank
        FROM "LeaderboardCache"
        WHERE state IS NOT NULL AND state != ''
      )
      UPDATE "LeaderboardCache"
      SET "stateRank" = state_ranked.rank
      FROM state_ranked
      WHERE "LeaderboardCache".id = state_ranked.id
    `

    // Recalculate district ranks
    await prisma.$executeRaw`
      WITH district_ranked AS (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY district ORDER BY "totalCoins" DESC) as rank
        FROM "LeaderboardCache"
        WHERE district IS NOT NULL AND district != ''
      )
      UPDATE "LeaderboardCache"
      SET "districtRank" = district_ranked.rank
      FROM district_ranked
      WHERE "LeaderboardCache".id = district_ranked.id
    `

    // Get count of updated records
    const updatedCount = await prisma.leaderboardCache.count()

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Leaderboard refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh leaderboard', code: 'REFRESH_ERROR' },
      { status: 500 }
    )
  }
}
