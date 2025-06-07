
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock responses for testing when DeepSeek is unavailable
const getMockResponse = (message: string, language: string) => {
  const responses = {
    en: {
      waste: "For electronic waste disposal, please take your devices to authorized e-waste collection centers. Many electronics stores also offer recycling programs. Avoid throwing electronics in regular trash as they contain harmful materials.",
      compost: "Composting is an excellent way to reduce organic waste! Start with fruit peels, vegetable scraps, and coffee grounds. Avoid meat, dairy, and oily foods. Turn the pile regularly and keep it moist but not soggy.",
      carbon: "To reduce your carbon footprint: 1) Use public transport or bike when possible, 2) Reduce energy consumption at home, 3) Choose local and seasonal foods, 4) Recycle and reuse materials, 5) Consider renewable energy options.",
      marketplace: "Our marketplace connects waste generators with processors. You can list recyclable materials, find buyers for waste streams, and discover sustainable alternatives. Browse categories like metals, plastics, organic waste, and more.",
      compliance: "Key compliance requirements include: proper waste segregation, maintaining disposal records, following local regulations, and reporting hazardous materials. Check with your local environmental authority for specific requirements in your area.",
      default: "I'm here to help with waste management questions! Ask me about waste classification, disposal methods, sustainability practices, compliance requirements, or how to use our platform features."
    },
    hi: {
      waste: "इलेक्ट्रॉनिक कचरे के निपटान के लिए, कृपया अपने उपकरणों को अधिकृत ई-वेस्ट संग्रह केंद्रों में ले जाएं। कई इलेक्ट्रॉनिक्स स्टोर भी रीसाइक्लिंग कार्यक्रम प्रदान करते हैं।",
      compost: "कंपोस्टिंग जैविक कचरे को कम करने का एक उत्कृष्ट तरीका है! फलों के छिलके, सब्जी के टुकड़े और कॉफी ग्राउंड्स से शुरुआत करें।",
      carbon: "अपना कार्बन फुटप्रिंट कम करने के लिए: 1) जब संभव हो तो सार्वजनिक परिवहन या साइकिल का उपयोग करें, 2) घर पर ऊर्जा की खपत कम करें।",
      marketplace: "हमारा मार्केटप्लेस कचरा उत्पादकों को प्रोसेसर से जोड़ता है। आप रीसाइक्लिंग सामग्री सूचीबद्ध कर सकते हैं।",
      compliance: "मुख्य अनुपालन आवश्यकताओं में शामिल हैं: उचित कचरा पृथक्करण, निपटान रिकॉर्ड बनाए रखना।",
      default: "मैं कचरा प्रबंधन के सवालों में मदद के लिए यहाँ हूँ! मुझसे कचरा वर्गीकरण, निपटान विधियों के बारे में पूछें।"
    },
    es: {
      waste: "Para la eliminación de residuos electrónicos, lleve sus dispositivos a centros de recolección de e-waste autorizados.",
      compost: "¡El compostaje es una excelente manera de reducir los residuos orgánicos! Comience con cáscaras de frutas y restos de verduras.",
      carbon: "Para reducir su huella de carbono: 1) Use transporte público o bicicleta cuando sea posible.",
      marketplace: "Nuestro mercado conecta a los generadores de residuos con los procesadores.",
      compliance: "Los requisitos clave de cumplimiento incluyen: segregación adecuada de residuos.",
      default: "¡Estoy aquí para ayudar con preguntas sobre gestión de residuos!"
    }
  };

  const lang = language.startsWith('hi') ? 'hi' : language.startsWith('es') ? 'es' : 'en';
  const langResponses = responses[lang] || responses.en;

  // Simple keyword matching for mock responses
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('electronic') || lowerMessage.includes('e-waste') || lowerMessage.includes('dispose')) {
    return langResponses.waste;
  } else if (lowerMessage.includes('compost') || lowerMessage.includes('organic')) {
    return langResponses.compost;
  } else if (lowerMessage.includes('carbon') || lowerMessage.includes('footprint') || lowerMessage.includes('reduce')) {
    return langResponses.carbon;
  } else if (lowerMessage.includes('marketplace') || lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
    return langResponses.marketplace;
  } else if (lowerMessage.includes('compliance') || lowerMessage.includes('regulation') || lowerMessage.includes('report')) {
    return langResponses.compliance;
  } else {
    return langResponses.default;
  }
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
      console.log('DeepSeek API key not configured, using mock response');
      const mockResponse = getMockResponse(message, language);
      
      return new Response(JSON.stringify({ 
        message: `[DEMO MODE] ${mockResponse}`,
        usage: { mock: true }
      }), {
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
      
      // If it's a quota/billing error, fall back to mock response
      if (response.status === 429 || response.status === 402) {
        console.log('DeepSeek quota exceeded, using mock response');
        const mockResponse = getMockResponse(message, language);
        
        return new Response(JSON.stringify({ 
          message: `[DEMO MODE - DeepSeek quota exceeded] ${mockResponse}`,
          usage: { mock: true, error: 'quota_exceeded' }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`DeepSeek API error: ${response.status}`);
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
    
    // Final fallback to mock response
    try {
      const { message, language = 'en' } = await req.json();
      const mockResponse = getMockResponse(message || 'help', language);
      
      return new Response(JSON.stringify({ 
        message: `[DEMO MODE - Error fallback] ${mockResponse}`,
        usage: { mock: true, error: 'fallback' }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      // Ultimate fallback
      return new Response(JSON.stringify({ 
        message: "[DEMO MODE] I'm here to help with waste management questions! Please try asking about waste disposal, composting, or sustainability practices.",
        usage: { mock: true, error: 'ultimate_fallback' }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
});
