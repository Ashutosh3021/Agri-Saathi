import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/ml/health
 * Proxies to ML service health endpoint
 * Returns ML service status
 */
export async function GET(request: NextRequest) {
  try {
    const mlServiceUrl = process.env.ML_SERVICE_URL
    
    if (!mlServiceUrl) {
      return NextResponse.json(
        { error: 'ML service URL not configured', code: 'NOT_CONFIGURED' },
        { status: 500 }
      )
    }

    const response = await fetch(`${mlServiceUrl}/health`, {
      headers: { 'X-Internal-Key': process.env.ML_INTERNAL_KEY || '' },
    })

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'ML service unavailable', 
          code: 'SERVICE_UNAVAILABLE',
          status: response.status 
        },
        { status: 503 }
      )
    }

    const healthData = await response.json()

    return NextResponse.json({
      status: 'healthy',
      mlService: healthData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('ML health check error:', error)
    return NextResponse.json(
      { error: 'Failed to reach ML service', code: 'CONNECTION_ERROR' },
      { status: 503 }
    )
  }
}
