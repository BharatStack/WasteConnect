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

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'AI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = buildSystemPrompt(context || {});

    // Convert messages to Gemini format
    const geminiContents = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    console.log(`ESG Copilot: Calling Gemini API with ${messages.length} messages`);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({
        error: `AI service unavailable (${geminiRes.status}). Please try again later.`,
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await geminiRes.json();
    const responseText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return new Response(JSON.stringify({
      message: { content: responseText },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in esg-copilot:', error);
    return new Response(JSON.stringify({
      error: 'An error occurred while processing your request.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
