import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  text: string;
  from: string;
  to: string;
}

interface MicrosoftTranslationResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Translation request received:', req.method);
    
    const body: TranslationRequest = await req.json();
    console.log('Translation request body:', body);
    
    const { text, from, to } = body;
    
    if (!text || !from || !to) {
      console.log('Missing required parameters');
      return new Response(
        JSON.stringify({ error: 'Text, from, and to parameters are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Microsoft Translator API anahtarını al
    const translatorKey = Deno.env.get('MICROSOFT_TRANSLATOR_KEY');
    const translatorRegion = Deno.env.get('MICROSOFT_TRANSLATOR_REGION') || 'global';
    
    if (!translatorKey) {
      console.log('Microsoft Translator API key not found');
      
      // Fallback: Temel çeviri sözlüğü (en yaygın terimler için)
      const fallbackTranslation = getFallbackTranslation(text, from, to);
      if (fallbackTranslation) {
        return new Response(
          JSON.stringify({ 
            translatedText: fallbackTranslation,
            source: 'fallback'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          translatedText: text,
          error: 'Translation service unavailable'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calling Microsoft Translator API...');

    // Microsoft Translator API çağrısı
    const translatorResponse = await fetch(
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${from}&to=${to}`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': translatorKey,
          'Ocp-Apim-Subscription-Region': translatorRegion,
          'Content-Type': 'application/json',
          'X-ClientTraceId': crypto.randomUUID(),
        },
        body: JSON.stringify([{ text }])
      }
    );

    if (!translatorResponse.ok) {
      const errorText = await translatorResponse.text();
      console.error('Microsoft Translator API error:', translatorResponse.status, errorText);
      
      // Fallback çeviri dene
      const fallbackTranslation = getFallbackTranslation(text, from, to);
      return new Response(
        JSON.stringify({ 
          translatedText: fallbackTranslation || text,
          source: 'fallback',
          error: 'Translation service error'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const translationData: MicrosoftTranslationResponse[] = await translatorResponse.json();
    console.log('Translation successful');

    if (translationData && translationData[0] && translationData[0].translations && translationData[0].translations[0]) {
      const translatedText = translationData[0].translations[0].text;
      
      return new Response(
        JSON.stringify({ 
          translatedText,
          source: 'microsoft',
          originalText: text,
          fromLanguage: from,
          toLanguage: to
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Eğer response boşsa fallback kullan
    const fallbackTranslation = getFallbackTranslation(text, from, to);
    return new Response(
      JSON.stringify({ 
        translatedText: fallbackTranslation || text,
        source: 'fallback'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in translate function:', error);
    
    return new Response(
      JSON.stringify({ 
        translatedText: req.method === 'POST' ? (await req.json()).text || 'Translation failed' : 'Translation failed',
        error: 'Internal server error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Fallback çeviri sözlüğü (temel maritime terimler)
function getFallbackTranslation(text: string, from: string, to: string): string | null {
  const maritimeTerms: { [key: string]: { [key: string]: string } } = {
    // Türkçe -> İngilizce
    'tr_en': {
      'Denizcilik Hesaplayıcısı': 'Maritime Calculator',
      'Asistana Sor': 'Ask Assistant',
      'Stabilite': 'Stability',
      'Seyir': 'Navigation',
      'Hidrodinamik': 'Hydrodynamics',
      'Makine': 'Engine',
      'Kargo': 'Cargo',
      'Balast': 'Ballast',
      'Trim': 'Trim',
      'Yapısal': 'Structural',
      'Güvenlik': 'Safety',
      'Emisyon': 'Emission',
      'GM hesaplama formülü': 'GM calculation formula',
      'Trim açısı nasıl bulunur?': 'How to find trim angle?',
      'Stabilite kriterleri nelerdir?': 'What are stability criteria?',
      'Büyük daire seyir hesabı': 'Great circle navigation calculation',
      'SFOC nasıl hesaplanır?': 'How to calculate SFOC?',
      'Balast suyu dağılımı': 'Ballast water distribution',
      'Metasantır yarıçapı formülü': 'Metacentric radius formula',
      'IMO stabilite standartları': 'IMO stability standards',
      'Hesaplayıcıya Dön': 'Back to Calculator',
      'Maritime AI Asistanı': 'Maritime AI Assistant',
      'Sık Sorulan Konular': 'Frequently Asked Topics'
    },
    // İngilizce -> Türkçe  
    'en_tr': {
      'Maritime Calculator': 'Denizcilik Hesaplayıcısı',
      'Ask Assistant': 'Asistana Sor',
      'Stability': 'Stabilite',
      'Navigation': 'Seyir',
      'Hydrodynamics': 'Hidrodinamik',
      'Engine': 'Makine',
      'Cargo': 'Kargo',
      'Ballast': 'Balast',
      'Trim': 'Trim',
      'Structural': 'Yapısal',
      'Safety': 'Güvenlik',
      'Emission': 'Emisyon',
      'Back to Calculator': 'Hesaplayıcıya Dön',
      'Maritime AI Assistant': 'Maritime AI Asistanı',
      'Frequently Asked Topics': 'Sık Sorulan Konular'
    }
  };

  const translationKey = `${from}_${to}`;
  const termDict = maritimeTerms[translationKey];
  
  if (termDict && termDict[text]) {
    return termDict[text];
  }

  // Kısmi eşleşme kontrolü
  if (termDict) {
    for (const [original, translated] of Object.entries(termDict)) {
      if (text.toLowerCase().includes(original.toLowerCase())) {
        return text.replace(new RegExp(original, 'gi'), translated);
      }
    }
  }

  return null;
}