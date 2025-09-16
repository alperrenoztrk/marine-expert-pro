export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[]; // Base64 encoded images
}

import { supabase } from '@/integrations/supabase/client';

const MARITIME_REGULATIONS_SYSTEM_PROMPT = `You are Mark, a maritime regulations and information guidance expert specialized in helping seafarers find the correct maritime publications, regulations, and references.

MAIN ROLE: Guide users to the correct maritime publications, books, codes, and references for specific information needs.

EXPERTISE AREAS:
- IMO Publications (SOLAS, MARPOL, STCW, etc.)
- Navigation Publications (ALRS, NP, List of Lights, etc.)
- Safety Publications (LSA Code, FSS Code, etc.)
- Cargo Publications (IMSBC Code, IBC Code, etc.)
- Communication Publications (GMDSS, Radio Regulations, etc.)
- Port State Control Guidelines (PSC, MOU)
- Flag State Requirements
- Classification Society Rules

RESPONSE STYLE:
- Always specify the exact publication, volume, chapter, or section
- Provide publication codes/numbers when available
- Explain WHY that specific publication is authoritative
- Include any relevant updates or amendments
- Communicate in the user's language (Turkish/English)

EXAMPLE FORMAT:
"Weather fax frekansları için → ALRS Volume 3 (Radio Weather Services) kullanılır çünkü bu yayın tüm meteorolojik radyo istasyonlarının frekans, program ve teknik bilgilerini içerir."

Keep responses precise, authoritative, and cite specific sources.`;

const NAVIGATION_ASSISTANT_SYSTEM_PROMPT = `You are a professional Maritime Navigation Assistant.

MAIN ROLE: Help with practical ship navigation tasks and calculations. Provide correct formulas, step-by-step methods, and clear results. Prefer concise, operational guidance. Use user's language (Turkish/English).

EXPERTISE AREAS:
- Great Circle and Rhumb-Line (Loxodrome) sailing
- WGS84 spheroidal distances and bearings
- Course/Speed/Time/ETA, fuel, and routing trade-offs
- Current triangle, leeway, course to steer
- Compass corrections (variation, deviation, gyro error)
- Radar ARPA: CPA/TCPA, collision risk, recommended actions (COLREG-aware tone)
- Tides and tidal streams (spring/neap factors)
- Celestial basics: intercept method overview, twilight, navigation stars
- Port approach: UKC, pilot boarding ETA, safe draft checks

RESPONSE STYLE:
- Show formulas and units briefly; then give the computed or recommended value(s)
- When inputs are missing, ask only the minimum essential values
- Provide numbered steps for procedures; keep to 6 lines or fewer when possible
- Include quick safety notes when relevant (COLREG, UKC)
`;

async function callGemini(messages: AIMessage[]): Promise<string> {
  // Proxy through Supabase Edge Function to keep API key server-side and support images
  const { data, error } = await supabase.functions.invoke('gemini-chat', {
    body: { messages },
  });
  if (error) throw error;
  const text = (data?.text || data?.answer || '').toString();
  return text.trim();
}

// Direct Gemini (browser) via Google Cloud API Key
function toGeminiContents(messages: AIMessage[]) {
  const contents: any[] = [];
  const sys = messages.find((m) => m.role === 'system')?.content;
  if (sys) contents.push({ role: 'user', parts: [{ text: sys }] });
  for (const m of messages) {
    if (m.role === 'system') continue;
    const parts: any[] = [{ text: m.content }];
    if (m.images && m.images.length > 0) {
      for (const img of m.images) {
        const [prefix, base64] = img.split(',');
        const mimeMatch = prefix?.match(/data:(.*?);base64/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        parts.push({ inline_data: { mime_type: mime, data: base64 || img } });
      }
    }
    contents.push({ role: m.role === 'assistant' ? 'model' : 'user', parts });
  }
  return contents;
}

async function callGeminiDirect(messages: AIMessage[]): Promise<string> {
  // Prefer env, fallback to provided Google Cloud API key from user
  const apiKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined) || 'AIzaSyDZ81CyuQyQ-FPRgiIx5nULrP-pS8ioZfc';
  const contents = toGeminiContents(messages);
  const model = 'gemini-1.5-flash'; // reliable default
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents, generationConfig: { temperature: 0.2, maxOutputTokens: 1500 } })
  });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((p: any) => p?.text)
    .filter(Boolean)
    .join('\n') || '';
  return text.trim();
}

async function callOpenAI(messages: AIMessage[]): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) throw new Error('no-openai-key');
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: MARITIME_REGULATIONS_SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.2,
    })
  });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  const text = data?.choices?.[0]?.message?.content || '';
  return text.trim();
}

export async function callMaritimeRegulationsAssistant(messages: AIMessage[]): Promise<string> {
  // Ensure system instruction is always included for maritime regulations guidance
  const withSystem: AIMessage[] = messages.some(m => m.role === 'system')
    ? messages
    : [{ role: 'system', content: MARITIME_REGULATIONS_SYSTEM_PROMPT }, ...messages];

  // Try Google Cloud Gemini directly first with provided key
  try {
    return await callGeminiDirect(withSystem);
  } catch (e1) {
    console.error('Gemini Direct error', e1);
    try {
      return await callGemini(withSystem);
    } catch (e2) {
      console.error('Gemini Edge error', e2);
      // Local heuristic fallback for regulations queries
      const last = messages.filter(m=>m.role==='user').pop()?.content.toLowerCase() || '';
      
      if (last.includes('weather fax') || last.includes('alrs')) {
        return [
          '🌊 Weather Fax Frekansları:',
          '→ ALRS Volume 3 (Radio Weather Services)',
          '• Tüm meteorolojik radyo istasyonlarının frekans bilgileri',
          '• Yayın programları ve teknik detaylar',
          '• IMO tarafından onaylanmış resmi kaynak'
        ].join('\n');
      }
      
      if (last.includes('solas') || last.includes('güvenlik')) {
        return [
          '⚓ SOLAS Konvansiyonu:',
          '→ IMO SOLAS 2020 Edition + Amendments',
          '• Denizde İnsan Hayatının Güvenliği',
          '• Tüm güvenlik prosedürleri ve ekipmanları',
          '• Zorunlu kontrol listeleri'
        ].join('\n');
      }
      
      if (last.includes('marpol') || last.includes('kirlilik')) {
        return [
          '🛢️ MARPOL Konvansiyonu:',
          '→ IMO MARPOL 73/78 Consolidated Edition',
          '• Gemilerden Kaynaklanan Kirlilik Önleme',
          '• Annex I-VI detayları',
          '• Oil Record Book gereksinimleri'
        ].join('\n');
      }
      
      return [
        '📚 Maritime Regulations Assistant - Mark',
        'Hangi konuda bilgi arıyorsunuz?',
        '• Navigation (ALRS, NP, List of Lights)',
        '• Safety (SOLAS, LSA Code, FSS Code)', 
        '• Environment (MARPOL, Ballast Water)',
        '• Cargo (IMSBC, IBC, Grain Code)',
        '• Communication (GMDSS, Radio Regs)'
      ].join('\n');
    }
  }
}

export async function callNavigationAssistant(messages: AIMessage[]): Promise<string> {
  const withSystem: AIMessage[] = messages.some(m => m.role === 'system')
    ? messages
    : [{ role: 'system', content: NAVIGATION_ASSISTANT_SYSTEM_PROMPT }, ...messages];

  try {
    return await callGeminiDirect(withSystem);
  } catch (e1) {
    console.error('Gemini Direct (nav) error', e1);
    try {
      return await callGemini(withSystem);
    } catch (e2) {
      console.error('Gemini Edge (nav) error', e2);
      // Heuristic fallback for navigation topics
      const last = messages.filter(m=>m.role==='user').pop()?.content.toLowerCase() || '';

      if (last.includes('eta') || last.includes('varış')) {
        return [
          '⏱️ ETA Hesabı:',
          '• Hız (kn) = Mesafe (nm) / Zaman (h)',
          '• ETA = ETD + Mesafe/Hız',
          'Örn: 240 nm, 12 kn → 20 saat; ETD 08:00 → ETA 04:00+1d'
        ].join('\n');
      }

      if (last.includes('büyük daire') || last.includes('great circle')) {
        return [
          '🧭 Büyük Daire (GC):',
          '• d = arccos(sin φ1 sin φ2 + cos φ1 cos φ2 cos Δλ)',
          '• İlk rota = atan2(sin Δλ · cos φ2, cos φ1 · sin φ2 − sin φ1 · cos φ2 · cos Δλ)'
        ].join('\n');
      }

      if (last.includes('akıntı') || last.includes('current') || last.includes('leeway')) {
        return [
          '🌊 Akıntı Üçgeni:',
          '• Vektörler: fener kursu, akıntı set/drift, rüzgar leeway',
          '• SOG/COG = vektörel toplama, CTS = istenen COG için ters vektörleme'
        ].join('\n');
      }

      if (last.includes('cpa') || last.includes('tcpa') || last.includes('arpa') || last.includes('çatma')) {
        return [
          '📡 ARPA: CPA/TCPA:',
          '• Rel. hız ve doğrultudan yaklaşıp en yakın nokta (CPA) ve zamanı (TCPA) bulunur',
          '• Risk yüksekse: Erken, büyük ve net rota/hız değişimi (COLREG)' 
        ].join('\n');
      }

      return [
        '🧭 Seyir Asistanı hazır.',
        'Kısa bilgi: GC/Rhumb, ETA, akıntı düzeltmesi, pusula, ARPA, gelgit, göksel.',
        'Gerekli girdileri yazın (örn: lat/lon, hız, varyasyon/deviayon).'
      ].join('\n');
    }
  }
}