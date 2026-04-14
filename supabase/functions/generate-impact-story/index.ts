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

    const ollamaUrl = Deno.env.get('OLLAMA_API_URL') || 'http://localhost:11434';
    const ollamaModel = Deno.env.get('OLLAMA_MODEL') || 'gemma4';

    // Build the AI prompt
    const prompt = `You are an environmental impact writer for WasteConnect, an Indian sustainability platform. A user just logged ${quantity} ${unit} of ${wasteType} waste.

Write exactly 2 sentences that:
- Quantify a real environmental benefit (trees saved, CO2 reduced, water saved)
- Use specific numbers calculated from the quantity provided
- Are motivational and personal, using 'you' and 'your'
- Reference Indian environmental context where relevant
- Are encouraging and celebrate the user's contribution

Return ONLY the 2 sentences. No headings, no bullet points.`;

    console.log(`Calling Ollama at ${ollamaUrl} with model ${ollamaModel}...`);

    const ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      const errorText = await ollamaRes.text();
      console.error('Ollama API error:', errorText);
      return new Response(JSON.stringify({
        error: `Ollama API error: ${ollamaRes.status}`,
        story: '', // Return empty story so frontend can handle gracefully
      }), {
        status: 200, // Still 200 so frontend doesn't crash
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await ollamaRes.json();
    const story = aiData.message?.content?.trim() || '';

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
      error: 'Failed to generate impact story. The AI service may be unavailable.',
      story: '',
    }), {
      status: 200, // Return 200 with empty story for graceful degradation
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
