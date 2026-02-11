import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImage } from '@/lib/storage'
import { callPestDetection } from '@/lib/ml-client'
import { awardCoins, COIN_RULES } from '@/lib/coins'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

/**
 * POST /api/drone/scan
 * Handles drone scan uploads: verifies device, saves image, detects pest,
 * saves scan record, awards coins, and notifies farmer via WhatsApp
 */
export async function POST(request: NextRequest) {
  try {
    // Verify device token
    const deviceToken = request.headers.get('X-Device-Token')
    if (!deviceToken) {
      return NextResponse.json(
        { error: 'Missing device token', code: 'MISSING_TOKEN' },
        { status: 401 }
      )
    }

    // Validate device exists
    const device = await prisma.droneDevice.findUnique({
      where: { deviceToken },
    })

    if (!device) {
      return NextResponse.json(
        { error: 'Invalid device token', code: 'INVALID_TOKEN' },
        { status: 401 }
      )
    }

    // Parse multipart form data
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const volunteerId = formData.get('volunteer_id') as string
    const farmerId = formData.get('farmer_id') as string

    if (!imageFile || !volunteerId || !farmerId) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    // Verify volunteer exists
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId },
    })

    if (!volunteer) {
      return NextResponse.json(
        { error: 'Volunteer not found', code: 'VOLUNTEER_NOT_FOUND' },
        { status: 404 }
      )
    }

    // Verify farmer exists
    const farmer = await prisma.farmer.findUnique({
      where: { id: farmerId },
    })

    if (!farmer) {
      return NextResponse.json(
        { error: 'Farmer not found', code: 'FARMER_NOT_FOUND' },
        { status: 404 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)

    // Upload image to Supabase Storage
    const timestamp = Date.now()
    const path = `drone/${farmerId}/${timestamp}.jpg`
    const publicUrl = await uploadImage(imageBuffer, path)

    // Call pest detection ML service
    const result = await callPestDetection(imageBuffer)

    // Save scan to database
    const scan = await prisma.scan.create({
      data: {
        farmerId,
        volunteerId,
        imageUrl: publicUrl,
        diseaseDetected: result.disease,
        confidence: result.confidence,
        cropType: result.crop,
        severity: result.severity,
        quickFix: result.quick_fix,
        permanentFix: result.permanent_fix,
        scanType: 'drone',
        rawModelOutput: result as any,
      },
    })

    // Award coins to volunteer
    await awardCoins(
      volunteerId,
      COIN_RULES.drone_scan,
      'scan_complete',
      scan.id,
      'Drone scan completed'
    )

    // Send diagnosis to farmer's WhatsApp
    if (farmer.phone) {
      const severityMap: Record<string, string> = {
        low: 'Kam',
        medium: 'Madhyam',
        high: 'Adhik',
      }

      const whatsappMessage = `🌿 *Drone Jaanch Report*\n\n*Bimari:* ${result.disease}\n*Vishwas:* ${Math.round(result.confidence * 100)}%\n*Gambhirta:* ${severityMap[result.severity] || result.severity}\n\n⚡ *Turant Upay:*\n${result.quick_fix}\n\n🌱 *Sthayi Samadhan:*\n${result.permanent_fix}\n\nJaanch ki gayi: ${new Date().toLocaleDateString('hi-IN')}`

      await sendWhatsAppMessage(farmer.phone, {
        type: 'text',
        text: { body: whatsappMessage },
      })
    }

    return NextResponse.json({
      success: true,
      scanId: scan.id,
      result,
    }, { status: 201 })
  } catch (error) {
    console.error('Drone scan error:', error)
    return NextResponse.json(
      { error: 'Failed to process drone scan', code: 'DRONE_SCAN_ERROR' },
      { status: 500 }
    )
  }
}
