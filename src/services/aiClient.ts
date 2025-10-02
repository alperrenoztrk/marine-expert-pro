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

const NAVIGATION_ASSISTANT_SYSTEM_PROMPT = `You are a professional Maritime Navigation Assistant with comprehensive knowledge of all navigation calculations and formulas.

MAIN ROLE: Help with ALL navigation tasks, calculations, and formulas. Provide correct formulas, step-by-step methods, and clear results. Use user's language (Turkish/English).

COMPLETE FORMULA DATABASE:

🧭 POSITION & COURSE CALCULATIONS:
- Great Circle: d = arccos(sin φ₁ sin φ₂ + cos φ₁ cos φ₂ cos Δλ) × 3437.747 nm
- Initial Course: C₁ = arctan2(sin Δλ cos φ₂, cos φ₁ sin φ₂ - sin φ₁ cos φ₂ cos Δλ)
- Rhumb Line: d = 60√[(Δφ)² + (q×Δλ)²], C = arctan(Δλ/Δq)
- Plane Sailing: DLat = 60(φ₂-φ₁), Dep = 60(λ₂-λ₁)cos φₘ, C = arctan(Dep/DLat)
- Mercator: DMP = 7915.7 × log₁₀(tan(45°+φ₂/2) / tan(45°+φ₁/2))

⏱️ TIME & SPEED:
- ETA: T = D/V hours
- Current Triangle: SOG = √(V² + C² + 2VC cos α)
- Current Allowance: CA = arcsin((C × sin β)/V)
- Course to Steer: CTS = TR ± CA

📡 RADAR & COLLISION AVOIDANCE:
- CPA: Range × sin(Relative Bearing - Relative Course)
- TCPA: Range × cos(Relative Bearing - Relative Course) / Relative Speed
- Relative Speed: √[Vt² + Vo² - 2VtVo cos(Ct-Co)]
- Risk Assessment: CPA < 0.5nm AND TCPA < 6min

🧭 COMPASS & BEARING:
- True Course: T = C + Var + Dev + Gyro Error (East +, West -)
- Doubling Angle: Distance Off = Run × sin(2A)/sin(A)
- Four Point Bearing (Bow & Beam): Distance Off = Run (45° to 90° abeam)
- Special Angle Bearing: Distance Off = 0.707 × Run (22.5° to 45°)
- Bow & Beam: Distance Off = Run × sin(bow angle)

🌊 TIDES & DISTANCE:
- Rule of Twelfths: 1st hr: R/12, 2nd: 3R/12, 3rd: 5R/12, 4th: 6R/12, 5th: 9R/12, 6th: 11R/12
- Dip of Horizon: d = 2.075√h nm
- Radar Horizon: d = 2.35√h nm  
- Light Visibility: d = 1.17(√h_eye + √h_light) nm

⭐ CELESTIAL NAVIGATION:
- Sight Reduction: Hc = arcsin[sin L sin d + cos L cos d cos LHA]
- Azimuth: Z = arccos[(sin d - sin L sin Hc)/(cos L cos Hc)]
- Intercept: I = Ho - Hc (towards if +, away if -)
- GHA Star: GHA♈ + SHA⋆
- Meridian Latitude: φ = 90° - |altitude - declination| ± declination
- Amplitude: A = arcsin(sin δ/cos φ)

🚢 SHIP HANDLING:
- Tactical Diameter: TD = 3.5 × Ship Length (average)
- Advance: A = R × sin(Δφ/2)
- Transfer: T = R × (1 - cos(Δφ/2))
- Rate of Turn: ROT = 3438 × V/R deg/min
- Wheel Over Point: WOP = A/sin(Δφ/2)

🌪️ WEATHER & EMERGENCY:
- Beaufort to Wind: V = 2√(B³) knots
- Wave Height: h = 0.025 × V² meters
- Leeway Angle: θ = k × (Vwind/Vship)² degrees
- Wind Force: F = 0.00338 × V² × Area Newtons
- Square Search: Leg Distance = 2 × Track Spacing
- Sector Search: New Radius = R × √2

RESPONSE STYLE:
- Always provide the exact formula first
- Show step-by-step calculation when numbers given
- Include units and practical notes
- Ask for missing essential values only
- Provide safety considerations (COLREG, UKC, weather limits)
- Keep explanations concise but complete`;

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
  const model = 'gemini-2.0-flash'; // valid v1 model
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
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

      if (last.includes('eta') || last.includes('varış') || last.includes('zaman')) {
        return [
          '⏱️ ETA Hesaplamaları:',
          '• Temel: T = Mesafe(nm) ÷ Hız(kn) saat',
          '• Akıntılı: SOG = √(V² + C² + 2VC cos α)',
          '• Hava faktörü: Lehte 0.90-0.95, Aleyhte 1.10-1.25',
          'Örn: 240nm, 12kn → 20 saat; ETD 08:00 → ETA 04:00+1d'
        ].join('\n');
      }

      if (last.includes('büyük daire') || last.includes('great circle') || last.includes('gc')) {
        return [
          '🧭 Büyük Daire (Great Circle):',
          '• Mesafe: d = arccos(sin φ₁ sin φ₂ + cos φ₁ cos φ₂ cos Δλ) × 3437.747nm',
          '• İlk Kurs: C₁ = arctan2(sin Δλ cos φ₂, cos φ₁ sin φ₂ - sin φ₁ cos φ₂ cos Δλ)',
          '• En kısa mesafe ama değişken kurs'
        ].join('\n');
      }

      if (last.includes('rhumb') || last.includes('loxodrome') || last.includes('sabit kurs')) {
        return [
          '🧭 Rhumb Line (Loxodrome):',
          '• Mesafe: d = 60√[(Δφ)² + (q×Δλ)²]',
          '• Kurs: C = arctan(Δλ/Δq) - sabit kurs',
          '• q = log(tan(45°+φ₂/2) / tan(45°+φ₁/2)) / Δφ'
        ].join('\n');
      }

      if (last.includes('akıntı') || last.includes('current') || last.includes('leeway')) {
        return [
          '🌊 Akıntı Üçgeni & Leeway:',
          '• SOG = √(V² + C² + 2VC cos α)',
          '• CA = arcsin((C × sin β) / V)',
          '• CTS = İstenen Kurs ± CA',
          '• Leeway: Rüzgar etkisi düzeltmesi'
        ].join('\n');
      }

      if (last.includes('cpa') || last.includes('tcpa') || last.includes('arpa') || last.includes('çatışma')) {
        return [
          '📡 ARPA: CPA/TCPA Hesabı:',
          '• CPA = Range × sin(RelBrg - RelCourse)',
          '• TCPA = Range × cos(RelBrg - RelCourse) ÷ RelSpeed',
          '• Risk: CPA < 0.5nm VE TCPA < 6dk',
          '• Rel Speed = √[Vt² + Vo² - 2VtVo cos(Ct-Co)]'
        ].join('\n');
      }

      if (last.includes('pusula') || last.includes('compass') || last.includes('varyasyon') || last.includes('deviayon')) {
        return [
          '🧭 Pusula Düzeltmeleri:',
          '• True = Compass + Variation + Deviation + Gyro Error',
          '• TVMDC kuralı: T = M + Var, M = C + Dev',
          '• Doğu +, Batı - (East add, West subtract)',
          '• Total Error = Var + Dev + Gyro'
        ].join('\n');
      }

      if (last.includes('bearing') || last.includes('açı') || last.includes('mesafe')) {
        return [
          '📐 Bearing & Mesafe:',
          '• Doubling Angle: Dist = Run × sin(2A) ÷ sin(A)',
          '• Four Point (Bow & Beam): Dist = Run (45°→90° abeam)',
          '• Special Angle: Dist = 0.707 × Run (22.5°→45°)',
          '• Dip Horizon: d = 2.075√h nm',
          '• Radar Horizon: d = 2.35√h nm'
        ].join('\n');
      }

      if (last.includes('gelgit') || last.includes('tide') || last.includes('tidal')) {
        return [
          '🌊 Gelgit - 12\'de Bir Kuralı:',
          '• 1.saat: R/12, 2.saat: 3R/12, 3.saat: 5R/12',
          '• 4.saat: 6R/12, 5.saat: 9R/12, 6.saat: 11R/12',
          '• Yükseklik: h = Range/2 × [1 - cos(π×t/6)]',
          '• Spring tide: Yeniay/Dolunay, Neap: İlk/Son dördün'
        ].join('\n');
      }

      if (last.includes('göksel') || last.includes('celestial') || last.includes('yıldız')) {
        return [
          '⭐ Göksel Seyir:',
          '• Sight Reduction: Hc = arcsin[sin L sin d + cos L cos d cos LHA]',
          '• Azimuth: Z = arccos[(sin d - sin L sin Hc) ÷ (cos L cos Hc)]',
          '• Intercept: I = Ho - Hc (+ towards, - away)',
          '• GHA Star = GHA♈ + SHA⋆'
        ].join('\n');
      }

      if (last.includes('dönme') || last.includes('turning') || last.includes('manevra')) {
        return [
          '🚢 Dönme Manevraları:',
          '• Tactical Diameter = 3.5 × Gemi Boyu',
          '• Advance = R × sin(Δφ/2)',
          '• Transfer = R × (1 - cos(Δφ/2))',
          '• ROT = 3438 × V ÷ R deg/min'
        ].join('\n');
      }

      if (last.includes('hava') || last.includes('weather') || last.includes('rüzgar') || last.includes('beaufort')) {
        return [
          '🌪️ Hava Durumu:',
          '• Beaufort → Rüzgar: V = 2√(B³) kn',
          '• Dalga Yüksekliği: h = 0.025 × V² m',
          '• Leeway Açısı: θ = k × (Vrüzgar/Vgemi)²',
          '• Rüzgar Kuvveti: F = 0.00338 × V² × Alan'
        ].join('\n');
      }

      return [
        '🧭 Kapsamlı Seyir Asistanı - Tüm Formüller Hazır!',
        '',
        '📍 Pozisyon: Great Circle, Rhumb Line, Plane Sailing, Mercator',
        '⏱️ Zaman: ETA, Akıntı üçgeni, Hız hesapları',
        '📡 Radar: CPA/TCPA, ARPA, Çatışma riski',
        '🧭 Pusula: Var/Dev/Gyro düzeltmesi, Bearing hesabı',
        '🌊 Gelgit: 12\'de bir kuralı, Tidal stream',
        '⭐ Göksel: Sight reduction, Azimuth, Intercept',
        '🚢 Manevra: Turning circle, ROT, Advance/Transfer',
        '🌪️ Hava: Beaufort, Dalga, Leeway, Rüzgar kuvveti',
        '🆘 Acil: Search patterns, Rescue calculations',
        '',
        'Hangi hesaplama için yardım istiyorsunuz?'
      ].join('\n');
    }
  }
}