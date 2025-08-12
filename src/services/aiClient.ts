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

export async function callStabilityAssistant(messages: AIMessage[]): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
    if (!apiKey) {
      // Fallback simple heuristic response
      const last = messages.filter(m=>m.role==='user').pop()?.content.toLowerCase() || '';
      if (last.includes('gm')) {
        return [
          'GM hesabı için gerekli veriler:',
          '- KB (m), BM (m), KG (m)',
          '- Yoksa: L, B, T ile KB≈T/2, BM≈B^2/(12T) varsayımlarını kullanabiliriz',
          'Lütfen KB, BM, KG veya L,B,T değerlerini paylaşın.'
        ].join('\n');
      }
      if (last.includes('tpc')) {
        return [
          'TPC = Awp × ρ / 100',
          'Gerekli veriler:',
          '- Awp: su hattı alanı (m²)',
          '- ρ: su yoğunluğu (ton/m³, deniz suyu ≈ 1.025)'
        ].join('\n');
      }
      return 'Hangi hesaplamayı yapmak istersiniz? (GM, GZ, TPC, Trim/List, Draft Survey, IMO kontrol)';
    }

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
  } catch (e) {
    console.error('AI error', e);
    return 'Asistan şu anda meşgul. Lütfen daha sonra tekrar deneyin veya gerekli verileri manuel girin (örn. GM için KB, BM, KG).';
  }
}