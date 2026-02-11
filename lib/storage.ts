import { createClient } from '@/lib/supabase/server'

export async function uploadImage(buffer: Buffer, path: string): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from('scan-images')
    .upload(path, buffer, { contentType: 'image/jpeg', upsert: false })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from('scan-images')
    .getPublicUrl(data.path)

  return publicUrl
}
