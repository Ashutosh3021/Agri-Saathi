import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/volunteer/coins
 * Returns coin balance and transaction history for the authenticated volunteer
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

    // Get last 20 coin transactions
    const transactions = await prisma.coinTransaction.findMany({
      where: { volunteerId: volunteer.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({
      transactions: transactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        transactionType: tx.transactionType,
        referenceId: tx.referenceId,
        description: tx.description,
        balanceAfter: tx.balanceAfter,
        createdAt: tx.createdAt,
      })),
      balance: volunteer.totalCoins,
    })
  } catch (error) {
    console.error('Coins fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coin transactions', code: 'COINS_ERROR' },
      { status: 500 }
    )
  }
}
