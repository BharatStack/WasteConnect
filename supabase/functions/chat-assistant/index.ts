
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, language = 'en' } = await req.json();
    const deepSeekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

    if (!deepSeekApiKey) {
      console.error('DeepSeek API key not configured');
      return new Response(JSON.stringify({ 
        error: 'DeepSeek API key not configured. Please add your API key in the project settings.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create system prompt for waste management assistant
    const systemPrompt = `You are an AI assistant for WasteConnect, a comprehensive waste management platform. You help users with:

1. Waste classification and disposal guidance
2. Sustainable practices and environmental impact
3. Government compliance and regulations
4. Marketplace transactions for waste materials
5. Route optimization for waste collection
6. Analytics and reporting

Context about the user and their query:
${context || 'No additional context provided'}

Please provide helpful, accurate information about waste management. Keep responses concise and actionable. If you need more information to provide a complete answer, ask specific follow-up questions.

Respond in ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : language === 'es' ? 'Spanish' : 'English'}.`;

    console.log('Making request to DeepSeek API...');

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepSeekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API error:', errorData);
      
      return new Response(JSON.stringify({ 
        error: `DeepSeek API error: ${response.status}. Please check your API key and try again.`,
        details: errorData
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('Assistant response generated successfully via DeepSeek');

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      usage: data.usage || {} 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'An error occurred while processing your request. Please try again.',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
