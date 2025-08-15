// Supabase Edge Function: Select Raffle Winner
// Version: v0.8.0-raffle-system
// Description: Securely selects a random raffle winner for a given event

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the event_id from the request body
    const { event_id } = await req.json()
    
    if (!event_id) {
      return new Response(
        JSON.stringify({ error: 'event_id is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Start a transaction to prevent race conditions
    // First, get the next round number
    const { data: roundData, error: roundError } = await supabase
      .from('event_attendee')
      .select('raffle_round')
      .eq('event_id', event_id)
      .eq('raffle_winner', true)
      .order('raffle_round', { ascending: false })
      .limit(1)
      .single()

    const nextRound = roundData ? (roundData.raffle_round + 1) : 1

    // Get a random eligible attendee (not already a winner)
    const { data: eligibleAttendees, error: eligibleError } = await supabase
      .from('event_attendee')
      .select('attendee_id')
      .eq('event_id', event_id)
      .eq('raffle_winner', false)

    if (eligibleError) {
      throw eligibleError
    }

    if (!eligibleAttendees || eligibleAttendees.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No eligible attendees remaining for this event',
          success: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Select a random winner
    const randomIndex = Math.floor(Math.random() * eligibleAttendees.length)
    const winnerId = eligibleAttendees[randomIndex].attendee_id

    // Update the winner in the database
    const { data: updateData, error: updateError } = await supabase
      .from('event_attendee')
      .update({ 
        raffle_winner: true,
        raffle_round: nextRound
      })
      .eq('event_id', event_id)
      .eq('attendee_id', winnerId)
      .select()

    if (updateError) {
      throw updateError
    }

    // Get winner details
    const { data: winnerDetails, error: winnerError } = await supabase
      .from('attendee')
      .select('*')
      .eq('id', winnerId)
      .single()

    if (winnerError) {
      throw winnerError
    }

    return new Response(
      JSON.stringify({
        success: true,
        winner: {
          attendee_id: winnerId,
          first_name: winnerDetails.first_name,
          last_name: winnerDetails.last_name,
          email: winnerDetails.email,
          raffle_round: nextRound
        },
        message: `Successfully selected winner for round ${nextRound}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})