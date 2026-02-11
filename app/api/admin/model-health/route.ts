import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/model-health
 * Returns ML model health status and statistics
 * Requires admin role
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Check admin role from user metadata
    const userRole = user.user_metadata?.role
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Fetch ML service health
    let pestModelHealth = {
      status: 'unknown',
      accuracy: 0,
      avgInferenceMs: 0,
      predictionsToday: 0,
    }
    
    let soilModelHealth = {
      status: 'unknown',
      accuracy: 0,
      avgInferenceMs: 0,
      predictionsToday: 0,
    }

    try {
      const mlServiceUrl = process.env.ML_SERVICE_URL
      if (mlServiceUrl) {
        const response = await fetch(`${mlServiceUrl}/health`, {
          headers: { 'X-Internal-Key': process.env.ML_INTERNAL_KEY || '' },
        })
        
        if (response.ok) {
          const healthData = await response.json()
          pestModelHealth = healthData.pestModel || pestModelHealth
          soilModelHealth = healthData.soilModel || soilModelHealth
        }
      }
    } catch (error) {
      console.warn('Failed to fetch ML health:', error)
    }

    // Calculate today's statistics from database
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const scansToday = await prisma.scan.count({
      where: {
        createdAt: { gte: today },
      },
    })

    const soilReadingsToday = await prisma.soilReading.count({
      where: {
        createdAt: { gte: today },
      },
    })

    // Calculate average confidence for today's scans
    const scansWithConfidence = await prisma.scan.findMany({
      where: {
        createdAt: { gte: today },
        confidence: { not: null },
      },
      select: { confidence: true },
    })

    const avgConfidence = scansWithConfidence.length > 0
      ? scansWithConfidence.reduce((sum, s) => sum + (s.confidence || 0), 0) / scansWithConfidence.length
      : 0

    return NextResponse.json({
      pestModel: {
        ...pestModelHealth,
        predictionsToday: scansToday,
      },
      soilModel: {
        ...soilModelHealth,
        predictionsToday: soilReadingsToday,
      },
      todayStats: {
        scansToday,
        soilReadingsToday,
        avgConfidence: Math.round(avgConfidence * 100) / 100,
      },
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Model health fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model health', code: 'HEALTH_ERROR' },
      { status: 500 }
    )
  }
}
