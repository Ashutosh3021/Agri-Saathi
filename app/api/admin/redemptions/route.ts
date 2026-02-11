import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/redemptions
 * Returns all redemption requests with optional status filter
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 50
    const skip = (page - 1) * pageSize

    // Build where clause
    const whereClause: any = {}
    if (status) {
      whereClause.status = status
    }

    // Get redemptions with volunteer details
    const redemptions = await prisma.redemption.findMany({
      where: whereClause,
      include: {
        volunteer: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    })

    const total = await prisma.redemption.count({ where: whereClause })

    return NextResponse.json({
      redemptions: redemptions.map(r => ({
        id: r.id,
        volunteerId: r.volunteerId,
        volunteerName: r.volunteer?.name || 'Unknown',
        volunteerPhone: r.volunteer?.phone,
        coinsRedeemed: r.coinsRedeemed,
        amountInr: r.amountInr,
        method: r.method,
        methodDetails: r.methodDetails,
        status: r.status,
        adminNote: r.adminNote,
        processedAt: r.processedAt,
        createdAt: r.createdAt,
      })),
      pagination: {
        page,
        pageSize,
        total,
      },
    })
  } catch (error) {
    console.error('Admin redemptions fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch redemptions', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/redemptions
 * Updates redemption status (approve/reject) with optional admin note
 */
export async function PATCH(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { id, status, adminNote } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be approved or rejected', code: 'INVALID_STATUS' },
        { status: 400 }
      )
    }

    // Get existing redemption
    const existingRedemption = await prisma.redemption.findUnique({
      where: { id },
    })

    if (!existingRedemption) {
      return NextResponse.json(
        { error: 'Redemption not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Check if already processed
    if (existingRedemption.status !== 'pending') {
      return NextResponse.json(
        { error: 'Redemption already processed', code: 'ALREADY_PROCESSED' },
        { status: 400 }
      )
    }

    // Update redemption
    const updateData: any = {
      status,
      adminNote: adminNote || undefined,
    }

    // Set processedAt if approving
    if (status === 'approved') {
      updateData.processedAt = new Date()
    }

    const updatedRedemption = await prisma.redemption.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      redemption: updatedRedemption,
    })
  } catch (error) {
    console.error('Admin redemption update error:', error)
    return NextResponse.json(
      { error: 'Failed to update redemption', code: 'UPDATE_ERROR' },
      { status: 500 }
    )
  }
}
