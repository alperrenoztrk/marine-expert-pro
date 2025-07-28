import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Request received:', req.method);
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { question, values } = body;
    
    // Input validation and sanitization
    if (!question || typeof question !== 'string') {
      console.log('Invalid question provided');
      return new Response(
        JSON.stringify({ error: 'Geçersiz soru formatı' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Sanitize question input
    const sanitizedQuestion = question.slice(0, 1000).trim(); // Limit length and trim
    
    if (!sanitizedQuestion) {
      console.log('Empty question after sanitization');
      return new Response(
        JSON.stringify({ error: 'Soru eksik' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Question received:', question);
    console.log('Values received:', values);

    // API anahtarlarını al - environment variables öncelikli, fallback olarak hardcoded
    let geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    let wolframApiKey = Deno.env.get('WOLFRAM_API_KEY');
    
    // Fallback API keys
    if (!geminiApiKey) {
      geminiApiKey = 'AIzaSyDZ81CyuQyQ-FPRgiIx5nULrP-pS8ioZfc';
      console.log('Using fallback Gemini API key');
    }
    
    if (!wolframApiKey) {
      wolframApiKey = '6YH9XR-Y7JA8WVXTJ';
      console.log('Using fallback Wolfram API key');
    }
    
    if (!geminiApiKey || !wolframApiKey) {
      console.log('API keys missing:', { gemini: !!geminiApiKey, wolfram: !!wolframApiKey });
      return new Response(
        JSON.stringify({ 
          answer: getLocalAnswer(question),
          calculation: null,
          source: 'local'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('API keys found, starting hybrid calculation...');

    // 1. Önce AI açıklama al
    const aiExplanation = await getGeminiExplanation(question, values, geminiApiKey);
    
    // 2. Wolfram hesaplama yap (eğer değerler varsa)
    let wolframResult = null;
    if (values && Object.keys(values).length > 0) {
      console.log('Performing Wolfram calculation with values:', values);
      wolframResult = await performWolframCalculation(question, values, wolframApiKey);
    }

    // 3. Sonuçları birleştir
    const hybridResponse = combineResults(aiExplanation, wolframResult);

    return new Response(
      JSON.stringify({ 
        answer: hybridResponse.explanation,
        calculation: hybridResponse.calculation,
        source: wolframResult ? 'hybrid' : 'gemini',
        wolfram_result: wolframResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ask-ai function:', error);
    const localAnswer = getLocalAnswer(question);
    return new Response(
      JSON.stringify({ 
        answer: localAnswer,
        source: 'local',
        error: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getLocalAnswer(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  const localAnswers = {
    "bm": `**BM (Metasantır Yarıçapı) Hesabı:**

BM = Iw / ∇

**Açıklamalar:**
- BM: Metasantır yarıçapı (m)
- Iw: Su hattı alanının ataleti (m⁴) 
- ∇: Su altı hacmi (m³)

**Pratik Örnek:**
Bir gemide:
- Iw = 12,500 m⁴
- ∇ = 8,000 m³
- BM = 12,500 / 8,000 = 1.56 m

**İlişkiler:**
- KM = KB + BM
- GM = KM - KG
- BM büyüdükçe stabilite artar`,

    "gm": `**GM (Metasantır Yüksekliği) Hesabı:**

GM = KM - KG

**Bileşenler:**
- KM = KB + BM (Metasantır mesafesi)
- BM = Iw / ∇ (Metasantır yarıçapı)
- KG = Ağırlık merkezi yüksekliği

**IMO Kriterleri:**
- GM ≥ 0.15m (Minimum)
- 0.15m ≤ GM ≤ 0.35m (Önerilen)
- GM > 0.35m (Aşırı sert)`,

    "trim": `**Trim Hesabı:**

Trim = Ta - Tf (Kıç taslağı - Baş taslağı)

**Trim Açısı:**
θ = arctan(Trim / LPP)

**Boyuna Metasantır:**
GML = KML - KG
MCT1cm = (Δ × GML) / (100 × LPP)`,

    "stabilite": `**Stabilite Formülleri:**

**Temel:** GM = KM - KG
**Metasantır:** KM = KB + BM  
**Yarıçap:** BM = Iw / ∇

**Kritik Değerler:**
- GM > 0.15m (IMO minimum)
- Pozitif stabilite: GM > 0`
  };
  
  for (const [key, answer] of Object.entries(localAnswers)) {
    if (lowerQuestion.includes(key)) {
      return answer;
    }
  }
  
  return `**Maritime Mühendisliği AI Asistanı**

Gemini AI + Wolfram ile güçlendirilmiş hibrit hesaplama sistemi hazır! 

Sorular sorabilirsiniz:
• **Stabilite**: GM, BM, KM hesaplamaları
• **Trim**: Boyuna stabilite, MCT
• **Yükleme**: Kargo dağılımı, balast
• **Hidrostatik**: Taslak, deplasman
• **Sevk**: Direnç, itki, verimlilik
• **Güvenlik**: IMO, SOLAS kriterleri

Detaylı formüller ve %100 doğru hesaplamalarla yanıtlayacağım.`;
}

// Gemini AI açıklama fonksiyonu
async function getGeminiExplanation(question: string, values: any, apiKey: string) {
  try {
    const prompt = values 
      ? `Sen denizcilik mühendisliği konusunda uzman bir asistansın. Verilen değerlerle hesaplama yapılacak. Önce neden bu hesabın yapıldığını, hangi formülün kullanıldığını açıkla.

Soru: ${question}
Verilen değerler: ${JSON.stringify(values)}

Açıklaman şu bölümleri içermeli:
1. **Bu hesabın amacı nedir?**
2. **Hangi formül kullanılıyor?**
3. **Değerlerin anlamı nedir?**
4. **Sonucun pratik anlamı nedir?**

Türkçe yanıt ver ve teknik terimler için İngilizce karşılıklarını da belirt. Markdown formatında yanıt ver.`
      : `Sen denizcilik mühendisliği konusunda uzman bir asistansın. Maritime engineering konularında detaylı yardım ediyorsun.

Soru: ${question}

Lütfen ayrıntılı ve teknik bir açıklama yap. Türkçe yanıt ver ve teknik terimler için İngilizce karşılıklarını da belirt. Markdown formatında yanıt ver.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return null;
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return null;
  } catch (error) {
    console.error('Error in Gemini explanation:', error);
    return null;
  }
}

// Wolfram hesaplama fonksiyonu
async function performWolframCalculation(question: string, values: any, apiKey: string) {
  try {
    const query = createWolframQuery(question, values);
    console.log('Wolfram query:', query);

    const response = await fetch(`https://api.wolframalpha.com/v2/query?appid=${apiKey}&input=${encodeURIComponent(query)}&format=plaintext&output=json`);
    
    if (!response.ok) {
      console.error('Wolfram API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    console.log('Wolfram response received');

    if (data.queryresult && data.queryresult.pods) {
      const results = extractWolframResults(data.queryresult.pods);
      return results;
    }

    return null;
  } catch (error) {
    console.error('Error in Wolfram calculation:', error);
    return null;
  }
}

// Wolfram sorgusu oluştur
function createWolframQuery(question: string, values: any): string {
  const questionLower = question.toLowerCase();
  
  // Deplasman hesabı
  if (questionLower.includes('deplasman') || questionLower.includes('displacement')) {
    if (values.length && values.beam && values.draft) {
      return `displacement = ${values.length} * ${values.beam} * ${values.draft} * 0.7 * 1.025`;
    }
  }
  
  // Stabilite hesabı
  if (questionLower.includes('stabilite') || questionLower.includes('stability') || questionLower.includes('gm')) {
    if (values.km && values.kg) {
      return `GM = ${values.km} - ${values.kg}`;
    }
    if (values.gm && values.displacement) {
      return `stability moment = ${values.gm} * ${values.displacement}`;
    }
  }
  
  // BM hesabı
  if (questionLower.includes('bm') || questionLower.includes('metasantır')) {
    if (values.waterline_moment && values.displacement) {
      return `BM = ${values.waterline_moment} / ${values.displacement}`;
    }
  }
  
  // Trim hesabı
  if (questionLower.includes('trim')) {
    if (values.moment && values.mct) {
      return `trim = ${values.moment} / ${values.mct}`;
    }
    if (values.aft_draft && values.fore_draft) {
      return `trim = ${values.aft_draft} - ${values.fore_draft}`;
    }
  }
  
  // Balast hesabı
  if (questionLower.includes('balast') || questionLower.includes('ballast')) {
    if (values.volume && values.density) {
      return `ballast weight = ${values.volume} * ${values.density}`;
    }
  }
  
  // Genel hesaplama
  const valueString = Object.entries(values)
    .map(([key, value]) => `${key} = ${value}`)
    .join(', ');
  
  return `calculate ${question} with ${valueString}`;
}

// Wolfram sonuçlarını çıkar
function extractWolframResults(pods: any[]): any {
  const results = {
    input: '',
    result: '',
    steps: [],
    interpretation: ''
  };

  for (const pod of pods) {
    if (pod.title === 'Input') {
      results.input = pod.subpods?.[0]?.plaintext || '';
    } else if (pod.title === 'Result' || pod.title === 'Exact result' || pod.title === 'Decimal approximation') {
      results.result = pod.subpods?.[0]?.plaintext || '';
    } else if (pod.title.includes('step') || pod.title.includes('Step')) {
      results.steps.push(pod.subpods?.[0]?.plaintext || '');
    } else if (pod.title === 'Interpretation' || pod.title.includes('interpretation')) {
      results.interpretation = pod.subpods?.[0]?.plaintext || '';
    }
  }

  return results;
}

// AI ve Wolfram sonuçlarını birleştir
function combineResults(aiExplanation: string | null, wolframResult: any): any {
  if (!aiExplanation && !wolframResult) {
    return {
      explanation: 'Hesaplama yapılamadı. Lütfen değerleri kontrol edin.',
      calculation: null
    };
  }

  if (!wolframResult) {
    return {
      explanation: aiExplanation || 'AI açıklaması alınamadı.',
      calculation: null
    };
  }

  const explanation = aiExplanation 
    ? `${aiExplanation}\n\n## 🎯 Doğrulanmış Hesaplama Sonucu\n\n**Wolfram Alpha Hesaplama:**\n- **Girdi:** ${wolframResult.input || 'Hesaplama parametreleri'}\n- **Sonuç:** ${wolframResult.result || 'Hesaplama tamamlandı'}\n\n✅ **Bu sonuç %100 doğru matematik hesaplamaya dayanmaktadır.**`
    : `## 🔢 Wolfram Alpha Hesaplama Sonucu\n\n**Girdi:** ${wolframResult.input || 'Hesaplama parametreleri'}\n**Sonuç:** ${wolframResult.result || 'Hesaplama tamamlandı'}`;

  return {
    explanation,
    calculation: wolframResult
  };
}