const ML_SERVICE_URL = process.env.ML_SERVICE_URL!
const ML_INTERNAL_KEY = process.env.ML_INTERNAL_KEY!

export async function callPestDetection(imageBuffer: Buffer): Promise<PestDetectionResult> {
  const formData = new FormData()
  const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
  formData.append('image', blob, 'image.jpg')

  const response = await fetch(`${ML_SERVICE_URL}/predict/pest`, {
    method: 'POST',
    headers: { 'X-Internal-Key': ML_INTERNAL_KEY },
    body: formData,
  })

  if (!response.ok) throw new Error(`ML service error: ${response.status}`)
  return response.json()
}

export async function callSoilPrediction(data: SoilInputData): Promise<SoilPredictionResult> {
  const response = await fetch(`${ML_SERVICE_URL}/predict/soil`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Key': ML_INTERNAL_KEY,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error(`ML service error: ${response.status}`)
  return response.json()
}

export interface PestDetectionResult {
  disease: string
  confidence: number
  crop: string
  quick_fix: string
  permanent_fix: string
  severity: 'low' | 'medium' | 'high'
  treatment_id: string
}

export interface SoilInputData {
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
  selected_crop?: string
}

export interface SoilPredictionResult {
  recommended_crops: Array<{ crop: string; suitability: number; rank: number }>
  selected_crop_analysis: {
    crop: string
    is_suitable: boolean
    potential_issues: string[]
    soil_improvements: string[]
  }
  current_soil_health: 'poor' | 'moderate' | 'good'
  weather_risk: 'low' | 'medium' | 'high'
}
