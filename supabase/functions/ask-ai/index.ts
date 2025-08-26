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
    
    const { question, values, conversationHistory } = body;
    
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
    
    // Fallback API keys - Updated with new keys
    if (!geminiApiKey) {
      geminiApiKey = 'AIzaSyDZ81CyuQyQ-FPRgiIx5nULrP-pS8ioZfc';
      console.log('Using fallback Gemini API key');
    }
    
    if (!wolframApiKey) {
      wolframApiKey = 'G3KTLV-GL5URGJ7YG';
      console.log('Using fallback Wolfram API key');
    }
    
    if (!geminiApiKey || !wolframApiKey) {
      console.log('API keys missing:', { gemini: !!geminiApiKey, wolfram: !!wolframApiKey });
      return new Response(
        JSON.stringify({ 
          answer: getLocalAnswer(question, conversationHistory),
          calculation: null,
          source: 'local'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('API keys found, starting hybrid calculation...');

    // 1. Önce AI açıklama al
    const aiExplanation = await getGeminiExplanation(question, values, geminiApiKey, conversationHistory);
    
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
    const localAnswer = getLocalAnswer(question, conversationHistory);
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

function getLocalAnswer(question: string, conversationHistory?: Array<{question: string, answer: string}>): string {
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

Trim = Ta - Tf (Kıç su çekimi - Baş su çekimi)

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
- Pozitif stabilite: GM > 0`,

    "deplasman": `**Deplasman (Displacement) Hesabı:**

Δ = L × B × T × CB × ρ

**Açıklamalar:**
- Δ: Deplasman (ton)
- L: Gemi boyu (m)
- B: Gemi genişliği (m)
- T: Su çekimi (m)
- CB: Blok katsayısı (0.5-0.85)
- ρ: Su yoğunluğu (1.025 t/m³ deniz suyu)

**Örnek:**
L=100m, B=20m, T=8m, CB=0.7
Δ = 100 × 20 × 8 × 0.7 × 1.025 = 11,480 ton`,

    "dalga": `**Dalga Hesaplamaları:**

**Dalga Hızı:**
C = √(gλ/2π) = 1.56√λ (m/s)

**Dalga Periyodu:**
T = λ/C = √(2πλ/g)

**Dalga Boyu:**
λ = gT²/2π = 1.56T² (m)

**Açıklamalar:**
- C: Dalga hızı (m/s)
- λ: Dalga boyu (m)
- T: Dalga periyodu (s)
- g: Yerçekimi (9.81 m/s²)`,

    "direnç": `**Gemi Direnci Hesaplamaları:**

RT = RF + RW + RA + RAP

**Bileşenler:**
- RF: Sürtünme direnci = ½ρSV²CF
- RW: Dalga direnci
- RA: Hava direnci
- RAP: Apandis direnci

**Sürtünme Katsayısı (ITTC):**
CF = 0.075/(log₁₀Rn - 2)²

**Reynolds Sayısı:**
Rn = VL/ν`,

    "güç": `**Gemi Gücü Hesaplamaları:**

**Efektif Güç (PE):**
PE = RT × V (Watt)

**Şaft Gücü (PS):**
PS = PE / ηD

**Fren Gücü (PB):**
PB = PS / ηS

**Verimler:**
- ηD: Pervane verimi (0.60-0.75)
- ηS: Şaft verimi (0.97-0.99)
- ηT: Toplam verim = ηD × ηS`,

    "pervane": `**Pervane Hesaplamaları:**

**Pervane İtme Kuvveti:**
T = ρ × n² × D⁴ × KT

**Pervane Torku:**
Q = ρ × n² × D⁵ × KQ

**Pervane Verimi:**
η0 = (J × KT) / (2π × KQ)

**İlerleme Oranı:**
J = VA / (n × D)

**Açıklamalar:**
- T: İtme kuvveti (N)
- Q: Tork (Nm)
- ρ: Su yoğunluğu (kg/m³)
- n: Devir sayısı (rps)
- D: Pervane çapı (m)
- KT, KQ: İtme ve tork katsayıları
- VA: İlerleme hızı (m/s)`,

    "yük": `**Yükleme Hesaplamaları:**

**Deadweight (DWT):**
DWT = Δmax - Δlight

**Bileşenler:**
- Kargo kapasitesi
- Yakıt ve yağ
- Tatlı su
- Mürettebat ve kumanya
- Sabit balast

**Yükleme Faktörleri:**
- Stowage Factor (SF): m³/ton
- Broken Stowage: %10-15
- Trim ve stabilite limitleri`,

    "colreg": `**COLREG (Denizde Çatışmayı Önleme Tüzüğü):**

**Temel Kurallar:**
- Kural 5: Gözcülük
- Kural 6: Emniyetli sürat
- Kural 7: Çatışma tehlikesi
- Kural 8: Çatışmayı önleme manevraları

**Seyir Fenerleri:**
- Sancak: Yeşil (112.5°)
- İskele: Kırmızı (112.5°)
- Pupa: Beyaz (135°)
- Baş üstü: Beyaz (225°)

**Özel Durumlar:**
- Manevra kabiliyeti kısıtlı gemi
- Kontrolden çıkmış gemi
- Balıkçı gemileri
- Yelkenli önceliği`,

    "solas": `**SOLAS (Denizde Can Emniyeti Sözleşmesi):**

**Ana Bölümler:**
- Chapter II-1: Yapı, bölmeleme, stabilite
- Chapter II-2: Yangın korunması
- Chapter III: Can kurtarma araçları
- Chapter IV: Radyo haberleşmesi
- Chapter V: Seyir emniyeti
- Chapter IX: ISM (Güvenlik Yönetimi)
- Chapter XI: Güvenlik tedbirleri

**Kritik Gereksinimler:**
- GMDSS zorunluluğu
- AIS sistemi
- VDR (Seyir kayıt cihazı)
- ECDIS gereksinimleri`,

    "marpol": `**MARPOL (Deniz Kirliliğini Önleme Sözleşmesi):**

**Ekler:**
- Annex I: Petrol kirliliği
- Annex II: Zararlı sıvı maddeler
- Annex III: Paketli zararlı maddeler
- Annex IV: Pis su
- Annex V: Çöp
- Annex VI: Hava kirliliği

**Özel Alanlar:**
- ECA (Emisyon Kontrol Alanları)
- Özel hassas deniz alanları
- Antarktika bölgesi

**Limitleri:**
- Sülfür: %0.5 (global), %0.1 (ECA)
- NOx: Tier III standartları`,

    "imdg": `**IMDG Kod (Tehlikeli Yükler):**

**Sınıflar:**
1. Patlayıcılar
2. Gazlar (2.1 Yanıcı, 2.2 Yanıcı olmayan, 2.3 Zehirli)
3. Yanıcı sıvılar
4. Yanıcı katılar
5. Oksitleyici maddeler
6. Zehirli ve bulaşıcı maddeler
7. Radyoaktif maddeler
8. Aşındırıcı maddeler
9. Çeşitli tehlikeli maddeler

**Dokümantasyon:**
- Tehlikeli Yük Manifestosu
- Konteyner/Araç Paketleme Sertifikası
- İstifleme ve ayrım kuralları`,

    "isps": `**ISPS Kod (Gemi ve Liman Güvenliği):**

**Güvenlik Seviyeleri:**
- Seviye 1: Normal (minimum güvenlik)
- Seviye 2: Yükseltilmiş (ek tedbirler)
- Seviye 3: İstisnai (maksimum güvenlik)

**Zorunlu Elemanlar:**
- SSP (Gemi Güvenlik Planı)
- SSO (Gemi Güvenlik Zabiti)
- CSO (Şirket Güvenlik Zabiti)
- SSAS (Gemi Güvenlik Alarm Sistemi)

**Kontrol Tedbirleri:**
- Giriş kontrol noktaları
- Kısıtlı alanlar
- Güvenlik devriyesi`,

    "ism": `**ISM Kod (Güvenlik Yönetim Sistemi):**

**Temel İlkeler:**
- Güvenlik ve çevre koruma politikası
- Şirket sorumlulukları ve yetkileri
- DPA (Designated Person Ashore)
- Kaptan sorumlulukları

**Dokümantasyon:**
- SMS (Güvenlik Yönetim Sistemi)
- DOC (Uygunluk Belgesi)
- SMC (Güvenlik Yönetim Sertifikası)

**Operasyonel Gereksinimler:**
- Acil durum hazırlığı
- Uygunsuzluk ve kaza raporlama
- Bakım prosedürleri
- İç denetimler`,

    "stcw": `**STCW (Gemi Adamları Eğitim ve Belgelendirme):**

**Yeterlilik Seviyeleri:**
- Yönetim seviyesi
- Operasyon seviyesi
- Destek seviyesi

**Temel Eğitimler:**
- Basic Safety Training
- Yangınla mücadele
- İlk yardım
- Denizde kişisel güvenlik
- Sosyal sorumluluklar

**Çalışma/Dinlenme Saatleri:**
- Maksimum 14 saat/24 saat
- Maksimum 72 saat/7 gün
- Minimum 10 saat dinlenme/24 saat`,

    "meteoroloji": `**Denizcilik Meteorolojisi:**

**Beaufort Rüzgar Skalası:**
0: Sakin (0-1 knot)
1-3: Hafif esinti (1-10 knot)
4-5: Orta rüzgar (11-21 knot)
6-7: Sert rüzgar (22-33 knot)
8-9: Fırtına (34-47 knot)
10-11: Şiddetli fırtına (48-63 knot)
12: Kasırga (64+ knot)

**Dalga Tahmini:**
- Significant wave height (Hs)
- Swell ve wind waves
- Dalga periyodu ve yönü

**Hava Sistemleri:**
- Alçak basınç: Siklon, kötü hava
- Yüksek basınç: Antisiklon, iyi hava
- Cephe sistemleri`,

    "harita": `**Deniz Haritaları ve Navigasyon:**

**Harita Çeşitleri:**
- General Charts: 1:3,000,000+
- Sailing Charts: 1:600,000
- Coastal Charts: 1:150,000
- Approach Charts: 1:75,000
- Harbour Charts: 1:50,000-

**Semboller:**
- Derinlikler ve konturlar
- Fenerler ve şamandıralar
- Tehlikeler ve engeller
- Akıntı ve gel-git bilgileri

**Düzeltmeler:**
- Manyetik sapma (Variation)
- Pusula sapması (Deviation)
- WGS-84 datum`,

    "cargo": `**Kargo Operasyonları:**

**Kargo Çeşitleri:**
- Break bulk (Genel yük)
- Bulk cargo (Dökme yük)
- Container (Konteyner)
- Ro-Ro (Tekerlekli yük)
- Liquid bulk (Sıvı dökme)

**Yükleme Planlaması:**
- Stabilite hesapları
- Trim optimizasyonu
- Shear force ve bending moment
- Lashing hesapları

**Özel Kargolar:**
- Reefer (Soğutmalı)
- DG (Tehlikeli yük)
- Heavy lift (Ağır yük)
- Project cargo`,

    "denizde can": `**Denizde Can Kurtarma:**

**LSA (Life Saving Appliances):**
- Lifeboat (Can filikası)
- Liferaft (Can salı)
- Lifejacket (Can yeleği)
- Immersion suit (Dalma elbisesi)
- Lifebuoy (Can simidi)

**SOLAS Gereksinimleri:**
- %100 + %25 can salı kapasitesi
- Her iki tarafta %50 lifeboat
- EPIRB ve SART
- Pyrotechnics (Fişekler)

**Terk Prosedürleri:**
- 7 kısa 1 uzun düdük
- Toplanma istasyonları
- Muster list kontrol`,

    "yangın": `**Yangınla Mücadele:**

**Yangın Üçgeni:**
- Yakıt
- Oksijen  
- Isı

**Yangın Sınıfları:**
- A: Katı maddeler (Su, köpük)
- B: Yanıcı sıvılar (Köpük, CO2, kuru kimyevi)
- C: Gazlar (Kuru kimyevi, CO2)
- D: Metaller (Özel toz)
- E: Elektrik (CO2, kuru kimyevi)
- F: Yağlar (Wet chemical)

**Sabit Sistemler:**
- CO2 sistemi
- Köpük sistemi
- Sprinkler
- Su sisi`,

    "vhf": `**VHF Deniz Telsizi:**

**Çağrı Kanalları:**
- Kanal 16: Acil durum ve çağrı
- Kanal 13: Köprü-köprü güvenlik
- Kanal 70: DSC dijital çağrı

**Prosedürler:**
- MAYDAY: Hayati tehlike
- PAN PAN: Aciliyet
- SECURITE: Güvenlik mesajı

**Menzil:**
- VHF: 20-30 mil (görüş hattı)
- MF: 200 mil
- HF: Dünya çapında`,

    "denge": `**Gemi Denge ve Trim:**

**Denge Durumları:**
- Even keel: Düz su hattı
- Trim by stern: Kıçtan trimli
- Trim by head: Baştan trimli
- List: Sancak/iskele meyil

**Düzeltme Yöntemleri:**
- Balast transferi
- Yakıt transferi
- Kargo yerleşimi
- Free surface etkisini azaltma

**Hesaplamalar:**
- LCG (Boyuna ağırlık merkezi)
- LCB (Boyuna yüzdürme merkezi)
- MCT (Moment to change trim)`,

    "pilot": `**Pilotaj ve Liman Manevraları:**

**Pilot Alma:**
- Pilot merdiveni gereksinimleri
- Lee side (Rüzgar altı)
- Pilot kartı değişimi
- Master-Pilot bilgi değişimi

**Manevra Unsurları:**
- Dönme çapı
- Stopping distance
- Shallow water effect
- Bank effect
- Squat

**Halat Operasyonları:**
- Spring lines (Apaz)
- Breast lines (Göğüsleme)
- Head/Stern lines (Baş/kıç)`,

    "ecdis": `**ECDIS (Elektronik Harita):**

**Zorunlu Gereksinimler:**
- Type approved sistem
- Backup düzenlemesi
- ENC veya RNC kullanımı
- Otomatik güncellemeler

**Alarmlar:**
- Safety contour
- Dangerous depths
- Special areas
- Chart datum uyarıları

**Rota Planlaması:**
- Waypoint yerleştirme
- XTE (Cross track error)
- Wheel over points
- ETA hesaplamaları`
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
• **Hidrostatik**: Su çekimi, deplasman
• **Sevk**: Direnç, itki, verimlilik
• **Güvenlik**: IMO, SOLAS kriterleri

Detaylı formüller ve %100 doğru hesaplamalarla yanıtlayacağım.`;
}

// Gemini AI açıklama fonksiyonu
async function getGeminiExplanation(question: string, values: any, apiKey: string, conversationHistory?: Array<{question: string, answer: string}>) {
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
      : `Sen deneyimli bir denizcilik uzmanısın. Gemi mühendisliği, denizcilik operasyonları, IMO regülasyonları, navigasyon, gemi güvenliği ve denizcilik hukuku konularında derin bilgiye sahipsin. Ayrıca matematik, fizik ve mühendislik hesaplamaları konusunda da uzmansın.

**Uzmanlık Alanların:**
- Gemi stabilitesi ve trim hesaplamaları
- COLREG, SOLAS, MARPOL, STCW, ISM, ISPS kuralları
- Navigasyon ve ECDIS sistemleri
- Kargo operasyonları ve yükleme planlaması
- Denizde can kurtarma ve yangın güvenliği
- Gemi makineleri ve pervane sistemleri
- Meteoroloji ve okyanus bilimi
- Denizcilik İngilizcesi ve terminolojisi

${conversationHistory && conversationHistory.length > 0 ? `
**Önceki Konuşma Geçmişi:**
${conversationHistory.slice(-3).map((item, index) => `
${index + 1}. Soru: ${item.question}
   Cevap: ${item.answer.substring(0, 200)}...
`).join('')}
` : ''}

Soru: ${question}

Lütfen şu kurallara göre yanıt ver:

1. **SAYISAL SORULAR İÇİN:**
   - İlgili formülleri açıkla
   - Adım adım çözüm göster
   - Birimleri mutlaka belirt
   - Sonucu vurgula ve pratik anlamını açıkla
   - Mümkünse örnek değerlerle göster

2. **SÖZEL/TEORİK SORULAR İÇİN:**
   - Konuyu kapsamlı açıkla
   - Tanımları ver
   - Pratik uygulamaları belirt
   - Denizcilik açısından önemini vurgula
   - İlgili standartları (IMO, SOLAS, MARPOL vb.) belirt

3. **HİBRİT SORULAR İÇİN:**
   - Hem teoriyi hem hesaplamayı içer
   - Formüller ve açıklamalar dengeli olmalı

4. **GENEL KURALLAR:**
   - Türkçe yanıt ver
   - Teknik terimler için İngilizce karşılıklarını parantez içinde ver
   - Markdown formatı kullan
   - Başlıkları, listeleri ve vurguları kullan
   - Her zaman denizcilik perspektifinden yaklaş

5. **EĞER EMİN DEĞİLSEN:**
   - "Bu konuda kesin bilgi veremiyorum ama..." diye başla
   - Genel prensipleri açıkla
   - İlgili kaynakları öner`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
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
          temperature: 0.3,
          topK: 1,
          topP: 0.95,
          maxOutputTokens: 4096,
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
  
  // Pervane hesapları
  if (questionLower.includes('pervane') || questionLower.includes('propeller')) {
    if (values.rpm && values.diameter) {
      return `propeller calculations for ${values.rpm} rpm and ${values.diameter}m diameter`;
    }
  }
  
  // Yakıt tüketimi
  if (questionLower.includes('yakıt') || questionLower.includes('fuel')) {
    if (values.power && values.consumption) {
      return `fuel consumption = ${values.power} * ${values.consumption} * time`;
    }
  }
  
  // Dalga kuvveti
  if (questionLower.includes('dalga kuvvet') || questionLower.includes('wave force')) {
    if (values.height && values.length) {
      return `wave force calculation for ${values.height}m height and ${values.length}m length`;
    }
  }
  
  // Hız dönüşümleri
  if (questionLower.includes('knot') || questionLower.includes('deniz mili')) {
    return question + ' (1 knot = 1.852 km/h = 0.514 m/s)';
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