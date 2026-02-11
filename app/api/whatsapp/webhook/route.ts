import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendWhatsAppMessage, downloadWhatsAppMedia } from '@/lib/whatsapp'
import { uploadImage } from '@/lib/storage'
import { callPestDetection } from '@/lib/ml-client'
import { awardCoins, COIN_RULES } from '@/lib/coins'

/**
 * GET /api/whatsapp/webhook
 * Verifies webhook token from Meta/AiSensy during initial setup
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log('Webhook verified successfully')
      return new NextResponse(challenge, { status: 200 })
    }

    return NextResponse.json(
      { error: 'Verification failed', code: 'VERIFY_FAILED' },
      { status: 403 }
    )
  } catch (error) {
    console.error('Webhook verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed', code: 'VERIFY_ERROR' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/whatsapp/webhook
 * Handles incoming WhatsApp messages (images, text, button replies)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate signature
    const signature = request.headers.get('X-Hub-Signature-256')
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature', code: 'MISSING_SIGNATURE' }, { status: 401 })
    }

    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', process.env.WHATSAPP_APP_SECRET!)
      .update(JSON.stringify(body))
      .digest('hex')

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return NextResponse.json({ error: 'Invalid signature', code: 'INVALID_SIGNATURE' }, { status: 401 })
    }

    // Extract message data
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const message = value?.messages?.[0]

    if (!message) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const phone = message.from
    const messageType = message.type

    // Find or create farmer
    let farmer = await prisma.farmer.findUnique({
      where: { phone },
    })

    if (!farmer) {
      farmer = await prisma.farmer.create({
        data: {
          phone,
          name: null,
          location: null,
          state: null,
        },
      })
    }

    // Handle different message types
    if (messageType === 'image') {
      await handleImageMessage(message, phone, farmer.id)
    } else if (messageType === 'interactive' && message.interactive?.button_reply) {
      await handleButtonReply(message, phone)
    } else if (messageType === 'text') {
      await handleTextMessage(message, phone, farmer)
    }

    // Always return 200 OK immediately
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook processing error:', error)
    // Still return 200 to prevent retries
    return NextResponse.json({ success: true }, { status: 200 })
  }
}

async function handleImageMessage(message: any, phone: string, farmerId: string) {
  try {
    // Download image from WhatsApp
    const mediaId = message.image.id
    const imageBuffer = await downloadWhatsAppMedia(mediaId)

    // Upload to Supabase Storage
    const timestamp = Date.now()
    const path = `whatsapp/${farmerId}/${timestamp}.jpg`
    const publicUrl = await uploadImage(imageBuffer, path)

    // Call pest detection ML service
    const result = await callPestDetection(imageBuffer)

    // Save scan to database
    const scan = await prisma.scan.create({
      data: {
        farmerId,
        imageUrl: publicUrl,
        diseaseDetected: result.disease,
        confidence: result.confidence,
        cropType: result.crop,
        severity: result.severity,
        quickFix: result.quick_fix,
        permanentFix: result.permanent_fix,
        scanType: 'whatsapp',
        volunteerId: null,
        rawModelOutput: result as any,
      },
    })

    // Format response in Hindi
    const severityMap: Record<string, string> = {
      low: 'Kam',
      medium: 'Madhyam',
      high: 'Adhik',
    }

    const responseMessage = `🌿 *Bimari Mili: ${result.disease}*\nVishwas: ${Math.round(result.confidence * 100)}%\nGambhirta: ${severityMap[result.severity] || result.severity}\n\n⚡ *Turant Upay:*\n${result.quick_fix}\n\n🌱 *Sthayi Samadhan:*\n${result.permanent_fix}\n\n📞 Aur madad ke liye reply karein.`

    // Send diagnosis message
    await sendWhatsAppMessage(phone, {
      type: 'text',
      text: { body: responseMessage },
    })

    // Send rating buttons
    await sendWhatsAppMessage(phone, {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: 'Kya aapko yeh madad upyogi lagi? Rating dein:',
        },
        action: {
          buttons: [
            { type: 'reply', reply: { id: `rating_${scan.id}_5`, title: '⭐⭐⭐⭐⭐' } },
            { type: 'reply', reply: { id: `rating_${scan.id}_4`, title: '⭐⭐⭐⭐' } },
            { type: 'reply', reply: { id: `rating_${scan.id}_3`, title: '⭐⭐⭐' } },
          ],
        },
      },
    })
  } catch (error) {
    console.error('Error handling image message:', error)
    await sendWhatsAppMessage(phone, {
      type: 'text',
      text: { body: 'Maaf kijiye, image process karne mein samasya hui. Kripya dobara koshish karein.' },
    })
  }
}

async function handleButtonReply(message: any, phone: string) {
  try {
    const buttonId = message.interactive.button_reply.id
    
    if (buttonId.startsWith('rating_')) {
      const parts = buttonId.split('_')
      const scanId = parts[1]
      const rating = parseInt(parts[2])

      // Update scan with farmer rating
      const scan = await prisma.scan.update({
        where: { id: scanId },
        data: { farmerRating: rating },
      })

      // Award coins to volunteer if exists
      if (scan.volunteerId) {
        const bonus = rating === 5 ? COIN_RULES.rating_5_bonus : rating === 4 ? COIN_RULES.rating_4_bonus : 0
        if (bonus > 0) {
          await awardCoins(
            scan.volunteerId,
            bonus,
            'rating_bonus',
            scan.id,
            `Bonus for ${rating}-star rating`
          )
        }
      }

      await sendWhatsAppMessage(phone, {
        type: 'text',
        text: { body: 'Aapki rating ke liye dhanyawad! 🙏' },
      })
    }
  } catch (error) {
    console.error('Error handling button reply:', error)
  }
}

async function handleTextMessage(message: any, phone: string, farmer: any) {
  const text = message.text.body.trim()

  if (!farmer.name) {
    // Save farmer's name
    await prisma.farmer.update({
      where: { id: farmer.id },
      data: { name: text },
    })

    await sendWhatsAppMessage(phone, {
      type: 'text',
      text: { body: `Namaste ${text}! Aapka naam save ho gaya. Kripya apna location bataiye (gaon/jila/rajya).` },
    })
  } else if (!farmer.location) {
    // Save farmer's location
    await prisma.farmer.update({
      where: { id: farmer.id },
      data: { location: text },
    })

    await sendWhatsAppMessage(phone, {
      type: 'text',
      text: { body: 'Dhanyawad! Ab aap kisi bhi fasal ki photo bhej sakte hain aur diagnosis pa sakte hain.' },
    })
  } else {
    // Send main menu
    await sendWhatsAppMessage(phone, {
      type: 'interactive',
      interactive: {
        type: 'list',
        body: {
          text: 'Main menu - Kya aapko chahiye?',
        },
        action: {
          button: 'Options',
          sections: [
            {
              title: 'Services',
              rows: [
                { id: 'scan_crop', title: 'Fasal ki jaanch', description: 'Fasal ki photo bhejne ke liye' },
                { id: 'history', title: 'Purana itihaas', description: 'Apni purani reports dekhein' },
                { id: 'soil_test', title: 'Mitti ki jaanch', description: 'Mitti report banana' },
                { id: 'help', title: 'Madad', description: 'Support team se baat karein' },
              ],
            },
          ],
        },
      },
    })
  }
}
