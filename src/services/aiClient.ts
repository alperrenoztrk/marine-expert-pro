export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const STABILITY_SYSTEM_PROMPT = `You are Stability Assistant, a maritime naval-architecture expert specialized in hydrostatics and stability.
- Communicate in the user's language (inputs may be Turkish).
- Guide the user step-by-step for ship stability calculations (GM, GZ, TPC, Trim/List, Draft Survey, IMO intact stability criteria, weather criterion).
- For GM: ask for KB, BM, KG if known; or for geometry to estimate KB and BM; then compute GM = KB + BM - KG.
- For TPC: ask Awp and water density (ρ), then TPC = Awp * ρ / 100.
- For IMO intact stability checks: request GZ curve or use approximations; explain required thresholds (area 0–30≥0.055 mrad, 0–40≥0.09 mrad, max GZ≥0.20 m, initial GM≥0.15 m; note ship-type variations).
- For cargo/tanker/ro-ro/passenger, remind relevant special checks (grain, FSC, weather criterion).
- Always explicitly list the inputs you need and provide example values.
- Keep responses concise, actionable, and in bullet points when asking for inputs.`;

async function callGemini(messages: AIMessage[]): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) throw new Error('no-gemini-key');
  // Map chat history to Gemini contents
  // Prepend system as first user part (Gemini lacks system role)
  const contents: any[] = [];
  const sys = messages.find(m=>m.role==='system')?.content || STABILITY_SYSTEM_PROMPT;
  contents.push({ role: 'user', parts: [{ text: sys }] });
  for (const m of messages) {
    if (m.role === 'system') continue;
    contents.push({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] });
  }
  const body = { contents };
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}` , {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any)=> p.text).join('\n') || '';
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
        { role: 'system', content: STABILITY_SYSTEM_PROMPT },
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

export async function callStabilityAssistant(messages: AIMessage[]): Promise<string> {
  try {
    // Prefer Gemini
    const gemKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (gemKey) {
      return await callGemini(messages);
    }
    // Fallback to OpenAI
    const openaiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;
    if (openaiKey) {
      return await callOpenAI(messages);
    }
    // Local heuristic fallback
    const last = messages.filter(m=>m.role==='user').pop()?.content.toLowerCase() || '';
    if (last.includes('gm')) {
      return [
        'GM hesabı için gerekli veriler:',
        '- KB (m), BM (m), KG (m)',
        '- Yoksa: L, B, T ile KB≈T/2, BM≈B²/(12T) varsayımları',
        'Lütfen KB, BM, KG veya L,B,T değerlerini paylaşın.'
      ].join('\n');
    }
    if (last.includes('tpc')) {
      return [
        'TPC = Awp × ρ / 100',
        'Gerekli veriler: Awp (m²), ρ (ton/m³, deniz suyu ≈ 1.025)'
      ].join('\n');
    }
    return 'Hangi hesaplamayı yapmak istersiniz? (GM, GZ, TPC, Trim/List, Draft Survey, IMO kontrol)';
  } catch (e) {
    console.error('AI error', e);
    return 'Asistan şu anda meşgul. Lütfen daha sonra tekrar deneyin veya gerekli verileri manuel girin (örn. GM için KB, BM, KG).';
  }
}