import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wasteType, quantity, unit = 'kg', entryId } = await req.json();

    if (!wasteType || !quantity) {
      return new Response(JSON.stringify({ error: 'wasteType and quantity are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'AI API key not configured', story: '' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are an environmental impact writer for WasteConnect, an Indian sustainability platform. A user just logged ${quantity} ${unit} of ${wasteType} waste.

Write exactly 2 sentences that:
- Quantify a real environmental benefit (trees saved, CO2 reduced, water saved)
- Use specific numbers calculated from the quantity provided
- Are motivational and personal, using 'you' and 'your'
- Reference Indian environmental context where relevant
- Are encouraging and celebrate the user's contribution

Return ONLY the 2 sentences. No headings, no bullet points.`;

    console.log('Calling Google Gemini API...');

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0.7 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({
        error: `Gemini API error: ${geminiRes.status}`,
        story: '',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await geminiRes.json();
    const story = aiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    console.log('Impact story generated:', story.substring(0, 80) + '...');

    // Persist story back to Supabase
    if (entryId && story) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { error: updateError } = await supabase
        .from('waste_data_logs')
        .update({ impact_story: story })
        .eq('id', entryId);

      if (updateError) {
        console.error('Failed to persist impact story:', updateError);
      }
    }

    return new Response(JSON.stringify({ story }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-impact-story:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate impact story.',
      story: '',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
