import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context, takenCount, totalCount, streak, mood } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = `You are a gentle, supportive wellness companion for Medify, a medication adherence app. 
Your tone is warm, encouraging, and emotionally intelligent. You never give medical advice but provide emotional support and motivation.
Keep responses brief (2-3 sentences max) and personalized.`;

    let userPrompt = "";

    if (context === "daily_summary") {
      userPrompt = `The user has taken ${takenCount} out of ${totalCount} medications today. 
Their current streak is ${streak} days. 
${mood ? `Their mood today: ${mood}` : ""}
Provide encouraging words based on their progress.`;
    } else if (context === "streak_milestone") {
      userPrompt = `The user just reached a ${streak}-day streak! Celebrate this achievement warmly.`;
    } else if (context === "missed_dose") {
      userPrompt = `The user missed a dose today. Provide gentle, non-judgmental encouragement to get back on track.`;
    } else if (context === "low_mood") {
      userPrompt = `The user reported feeling ${mood}. Offer compassionate support without being clinical.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in ai-encouragement function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});