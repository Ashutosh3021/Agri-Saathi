// Supabase Edge Function: Refresh Leaderboard Ranks
// This function recalculates national, state, and district rankings
// using PostgreSQL window functions via RPC

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization')
    const expectedAuth = `Bearer ${Deno.env.get('CRON_SECRET')}`
    
    if (!authHeader || authHeader !== expectedAuth) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', code: 'UNAUTHORIZED' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Use the single RPC function to refresh all ranks at once
    const { data, error } = await supabase.rpc('refresh_all_leaderboard_ranks')

    if (error) {
      console.error('Error refreshing leaderboard ranks:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to refresh leaderboard ranks', 
          code: 'REFRESH_ERROR',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        updated: data?.[0]?.updated_count || 0,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Leaderboard refresh error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
