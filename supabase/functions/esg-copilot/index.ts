import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const buildSystemPrompt = (context: object) => `
You are an expert ESG analyst and sustainability consultant for WasteConnect,
India's leading waste management and green finance platform.

You have access to the user's real-time platform data for the past 90 days:
---DATA-CONTEXT-START---
${JSON.stringify(context, null, 2)}
---DATA-CONTEXT-END---

CAPABILITIES:
- Answer specific questions using the data above (never say 'I don't have access')
- Generate GRI 306, SASB EM-MM, TCFD, or CSRD report sections using real numbers
- Identify trends, anomalies, and risks from the data
- Provide actionable recommendations with quantified impact estimates
- All financial values in Indian Rupees (INR ₹), measurements in metric units

CONSTRAINTS:
- Never fabricate numbers not present in the data context
- If data is insufficient, say so explicitly and suggest what additional data is needed
- For report generation, follow the exact GRI/SASB disclosure structure
- Keep responses concise unless a full report section is explicitly requested
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages array is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ollamaUrl = Deno.env.get('OLLAMA_API_URL') || 'http://localhost:11434';
    const ollamaModel = Deno.env.get('OLLAMA_MODEL') || 'gemma4';

    const systemPrompt = buildSystemPrompt(context || {});

    console.log(`ESG Copilot: Calling Ollama at ${ollamaUrl} with model ${ollamaModel}, ${messages.length} messages`);

    const ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!ollamaRes.ok) {
      const errorText = await ollamaRes.text();
      console.error('Ollama API error:', errorText);
      return new Response(JSON.stringify({
        error: `AI service unavailable (${ollamaRes.status}). Please try again later.`,
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Stream the Ollama response directly back to the browser
    return new Response(ollamaRes.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in esg-copilot:', error);

    return new Response(JSON.stringify({
      error: 'An error occurred while processing your request. The AI service may be unavailable.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
