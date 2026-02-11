import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { awardCoins } from '@/lib/coins'

/**
 * POST /api/volunteer/redeem
 * Creates a coin redemption request for the authenticated volunteer
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { coinsToRedeem, method, methodDetails } = body

    if (!coinsToRedeem || !method || !methodDetails) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    // Validate coins to redeem
    if (coinsToRedeem <= 0) {
      return NextResponse.json(
        { error: 'Invalid coin amount', code: 'INVALID_AMOUNT' },
        { status: 400 }
      )
    }

    // Check if volunteer has enough coins
    if (coinsToRedeem > volunteer.totalCoins) {
      return NextResponse.json(
        { error: 'Insufficient coins', code: 'INSUFFICIENT_COINS' },
        { status: 400 }
      )
    }

    // Verify minimum redemption amounts
    const minimumCoins = method === 'coupon' ? 400 : 500
    if (coinsToRedeem < minimumCoins) {
      return NextResponse.json(
        { error: `Minimum ${minimumCoins} coins required for ${method} redemption`, code: 'MINIMUM_NOT_MET' },
        { status: 400 }
      )
    }

    // Validate method
    if (!['upi', 'paytm', 'coupon'].includes(method)) {
      return NextResponse.json(
        { error: 'Invalid redemption method', code: 'INVALID_METHOD' },
        { status: 400 }
      )
    }

    // Calculate INR value (1 coin = 0.10 INR)
    const amountInr = coinsToRedeem / 10

    // Create redemption record
    const redemption = await prisma.redemption.create({
      data: {
        volunteerId: volunteer.id,
        coinsRedeemed: coinsToRedeem,
        amountInr,
        method,
        methodDetails,
        status: 'pending',
      },
    })

    // Deduct coins from volunteer
    const newBalance = await awardCoins(
      volunteer.id,
      -coinsToRedeem,
      'redemption',
      redemption.id,
      `Redemption request via ${method}`
    )

    return NextResponse.json({
      success: true,
      redemptionId: redemption.id,
      amountInr,
      newBalance,
    }, { status: 201 })
  } catch (error) {
    console.error('Redemption error:', error)
    return NextResponse.json(
      { error: 'Failed to process redemption', code: 'REDEMPTION_ERROR' },
      { status: 500 }
    )
  }
}
