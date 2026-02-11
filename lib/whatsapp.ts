const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY!
const WHATSAPP_API_URL = 'https://backend.aisensy.com/campaign/t1/api/v2' // AiSensy

export async function sendWhatsAppMessage(phone: string, message: WhatsAppMessage) {
  const response = await fetch(WHATSAPP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${WHATSAPP_API_KEY}`,
    },
    body: JSON.stringify({
      apiKey: WHATSAPP_API_KEY,
      campaignName: 'agri_sathi_response',
      destination: phone,
      ...message,
    }),
  })
  return response.json()
}

export async function downloadWhatsAppMedia(mediaId: string): Promise<Buffer> {
  // Step 1: Get media URL
  const urlResponse = await fetch(
    `https://graph.facebook.com/v18.0/${mediaId}`,
    { headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` } }
  )
  const { url } = await urlResponse.json()

  // Step 2: Download media
  const mediaResponse = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` }
  })
  const arrayBuffer = await mediaResponse.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export interface WhatsAppMessage {
  type: 'text' | 'interactive'
  text?: { body: string }
  interactive?: object
}
