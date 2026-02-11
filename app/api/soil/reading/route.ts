import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getWeatherData } from '@/lib/weather'
import { callSoilPrediction } from '@/lib/ml-client'
import { awardCoins, COIN_RULES } from '@/lib/coins'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

/**
 * POST /api/soil/reading
 * Receives soil data from IoT device, fetches weather, calls ML prediction,
 * saves reading, awards coins, and sends WhatsApp notification
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
    const device = await prisma.soilDevice.findUnique({
      where: { deviceToken },
    })

    if (!device) {
      return NextResponse.json(
        { error: 'Invalid device token', code: 'INVALID_TOKEN' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      device_id,
      farmer_id,
      nitrogen,
      phosphorus,
      potassium,
      moisture,
      temperature,
      humidity,
      ph,
      selected_crop,
      volunteer_id,
    } = body

    if (!device_id || !farmer_id) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    // Get farmer details
    const farmer = await prisma.farmer.findUnique({
      where: { id: farmer_id },
    })

    if (!farmer) {
      return NextResponse.json(
        { error: 'Farmer not found', code: 'FARMER_NOT_FOUND' },
        { status: 404 }
      )
    }

    // Get weather data if location available
    let weatherData = { temperature: 25, humidity: 60, rainfall: 0 }
    if (farmer.lat && farmer.lng) {
      try {
        weatherData = await getWeatherData(Number(farmer.lat), Number(farmer.lng))
      } catch (error) {
        console.warn('Failed to fetch weather data, using defaults:', error)
      }
    }

    // Prepare data for ML prediction
    const soilInputData = {
      nitrogen: nitrogen ?? 0,
      phosphorus: phosphorus ?? 0,
      potassium: potassium ?? 0,
      temperature: temperature ?? weatherData.temperature,
      humidity: humidity ?? weatherData.humidity,
      ph: ph ?? 7.0,
      rainfall: weatherData.rainfall,
      selected_crop: selected_crop || undefined,
    }

    // Call ML prediction
    const recommendation = await callSoilPrediction(soilInputData)

    // Save soil reading to database
    const soilReading = await prisma.soilReading.create({
      data: {
        farmerId: farmer_id,
        deviceId: device_id,
        volunteerId: volunteer_id || null,
        nitrogen: soilInputData.nitrogen,
        phosphorus: soilInputData.phosphorus,
        potassium: soilInputData.potassium,
        moisture: moisture ?? 0,
        temperature: soilInputData.temperature,
        humidity: soilInputData.humidity,
        ph: soilInputData.ph,
        rainfall: soilInputData.rainfall,
        selectedCrop: selected_crop || null,
        recommendation: {
          recommended_crops: recommendation.recommended_crops,
          current_soil_health: recommendation.current_soil_health,
          weather_risk: recommendation.weather_risk,
          selected_crop_analysis: recommendation.selected_crop_analysis,
        },
      },
    })

    // Award coins to volunteer if provided
    if (volunteer_id) {
      try {
        await awardCoins(
          volunteer_id,
          COIN_RULES.soil_scan,
          'scan_complete',
          soilReading.id,
          'Soil scan completed'
        )
      } catch (error) {
        console.warn('Failed to award coins:', error)
      }
    }

    // Send WhatsApp notification to farmer
    if (farmer.phone) {
      const cropRecommendations = recommendation.recommended_crops
        .slice(0, 3)
        .map((crop, idx) => `${idx + 1}. ${crop.crop} (${Math.round(crop.suitability * 100)}% suitability)`)
        .join('\n')

      const whatsappMessage = `🌱 *Mitti Report*\n\n*Soil Health:* ${recommendation.current_soil_health}\n*Weather Risk:* ${recommendation.weather_risk}\n\n*Recommended Crops:*\n${cropRecommendations}\n\n${selected_crop ? `*Analysis for ${selected_crop}:* ${recommendation.selected_crop_analysis.is_suitable ? 'Suitable' : 'Not Suitable'}` : ''}`

      await sendWhatsAppMessage(farmer.phone, {
        type: 'text',
        text: { body: whatsappMessage },
      })
    }

    return NextResponse.json({
      success: true,
      recommendation,
    }, { status: 200 })
  } catch (error) {
    console.error('Soil reading error:', error)
    return NextResponse.json(
      { error: 'Failed to process soil reading', code: 'SOIL_READING_ERROR' },
      { status: 500 }
    )
  }
}
