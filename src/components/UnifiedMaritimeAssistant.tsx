import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ship, Loader2, MessageCircle, Calculator, Send, BarChart3, Compass } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/safeClient";

export const UnifiedMaritimeAssistant = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string, timestamp: number}>>([]);

  const getGeminiResponse = async (prompt: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          messages: [
            { 
              role: "system", 
              content: `Sen "Mark" adlı bir Denizcilik Regülasyon Rehberi asistanısın. Gemilerde hangi bilgiye nereden ulaşılması gerektiğini, hangi kitabın/cildin/tablonun kullanılacağını ve pratik erişim yolunu tarif edersin.

Önceliklerin:
- IS Code, SOLAS, MARPOL, COLREG, IAMSAR, STCW, LOAD LINE, IMDG Code, Grain Code, ALRS (Admiralty List of Radio Signals), NP/NP5011, NP100 vb. kaynaklara yönlendir.
- Soruya "Hangi kaynaktan, hangi cilt/bölüm/başlık?" şeklinde net yanıt ver.
- Gerekirse sayfa/bölüm örnekleri (ör: ALRS Vol 3, Radiofacsimile/WeatherFax Schedules) belirt.
- Yanıtta kısalık ve netlik: önce Kaynak/Cilt, sonra erişim yöntemi ve notlar.

Yanıtını şu şablonda ver:
- **Kaynak**: (kitap/kod adı, cilt/bölüm)
- **Erişim**: (nereden/nasıl bulunur; dizin, konu başlığı, tablo/ek örneği)
- **Not**: (kısa uyarı/istisna/ilgili başka kaynak)

Türkçe, düzenli ve kısa yanıtla.`
            },
            { role: "user", content: prompt }
          ]
        }
      });

      if (error) throw error;
      return data?.text || "Yanıt alınamadı";
    } catch (error) {
      console.error('AI API failed:', error);
      throw error;
    }
  };

  // Auto-calculate if question contains numbers
  const detectCalculation = (text: string) => {
    const patterns = {
      displacement: /(?:deplasman|displacement).*?(\d+(?:\.\d+)?).*?(\d+(?:\.\d+)?).*?(\d+(?:\.\d+)?)/i,
      gm: /(?:gm|stabilite).*?km[:\s=]*(\d+(?:\.\d+)?).*?kg[:\s=]*(\d+(?:\.\d+)?)/i,
      distance: /(?:mesafe|distance).*?(\d+(?:\.\d+)?).*?(\d+(?:\.\d+)?).*?(\d+(?:\.\d+)?).*?(\d+(?:\.\d+)?)/i,
      power: /(?:güç|power|hp|kw).*?(\d+(?:\.\d+)?)/i,
      speed: /(?:hız|speed|knot).*?(\d+(?:\.\d+)?)/i
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        return { type, values: match.slice(1).map(v => parseFloat(v)).filter(v => !isNaN(v)) };
      }
    }
    return null;
  };

  const performWolframCalculation = async (query: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("wolfram-calc", {
        body: { query }
      });
      
      if (error) return null;
      return data?.result || null;
    } catch (error) {
      console.error('Wolfram calculation failed:', error);
      return null;
    }
  };

  const getLocalKnowledge = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    const mapping: Array<{ test: RegExp; answer: string }> = [
      {
        test: /(weather\s*fax|radiofax|weatherfax|fax\s*mesaj|hava\s*faks|radiofacsimile|facsimile)/i,
        answer: `- **Kaynak**: Admiralty List of Radio Signals (ALRS) — Cilt 3 (Vol. 3): Maritime Safety Information Services — Radiofacsimile (Weather Fax) yayınları
- **Erişim**: ALRS Vol 3 içinde “Radiofacsimile/Weather Fax Schedules” başlığı; istasyon listesi ve frekanslar. Dizin: "Radiofacsimile" veya "Weather" → ilgili tablo/ek.
- **Not**: Bazı bölgeler için NAVAREA duyuruları ve Deniz Meteoroloji yayın planları (sched) de kontrol edilir.`
      },
      {
        test: /(navtex)/i,
        answer: `- **Kaynak**: ALRS — Cilt 3 (Vol. 3): Maritime Safety Information — NAVTEX yayın istasyonları ve frekanslar
- **Erişim**: “NAVTEX Stations” tablosu; istasyon kimliği, MSC frekansları (518/490/4209.5 kHz), program saatleri
- **Not**: NAVAREA/METAREA bülten kesitlerini ve yerel dil yayınlarını kontrol edin.`
      },
      {
        test: /(vhf|port operations|liman\s*iletişim|pilotage)/i,
        answer: `- **Kaynak**: ALRS — Cilt 6 (Vol. 6): Pilotage, Port Operations and Services
- **Erişim**: Liman bazlı VHF kanalları, manevra/rehberlik/servis bilgileri. Dizin: Liman adı → VHF Kanal/Telsiz Çağrı işaretleri.
- **Not**: Deniz Rehberi/NP (Sailing Directions) ilgili cilt ile tamamlayın.`
      },
      {
        test: /(distress|gmdss|tehlike|acil|epirb|sart|dsC)/i,
        answer: `- **Kaynak**: ALRS — Cilt 5 (Vol. 5): Global Maritime Distress and Safety System (GMDSS)
- **Erişim**: Tehlike/Emniyet prosedürleri, DSC, EPIRB, SART, Inmarsat/MF/HF çağrıları, MMSI ve MRCC iletişim bilgileri
- **Not**: IAMSAR Cilt 3 operasyon rehberi ile birlikte kullanın.`
      },
      {
        test: /(advisory|warning|msi|metarea|navarea)/i,
        answer: `- **Kaynak**: ALRS — Cilt 3 (Vol. 3): Maritime Safety Information Services (NAVAREA/METAREA)
- **Erişim**: NAVAREA koordinatörleri, yayın kanalları/sıklıkları, MSI dağıtım yolları
- **Not**: NAVTEX/RADIOFAX planları ve SafetyNET ile birlikte kontrol edin.`
      },
      {
        test: /(colreg|ışıklar|seyir\s*fenerleri|ışık karakteri)/i,
        answer: `- **Kaynak**: COLREG ve Admiralty List of Lights (Aids to Navigation) — Bölgesel ciltler
- **Erişim**: Fener/şamandıra ışık karakterleri, sektörel aralıklar. Dizin: Coğrafi bölge/ışık numarası
- **Not**: Elektronik Harita (ENC) ve NP5011 (Semboller ve Kısaltmalar) ile teyit edin.`
      },
      {
        test: /(load\s*line|fribord|serbest\s*bord|assignments)/i,
        answer: `- **Kaynak**: International Load Line Convention + Bayrak Devleti kılavuzları
- **Erişim**: Serbest borda işaretleri ve hesap metodolojisi; sınıflandırma cemiyeti kuralları
- **Not**: Stabilite Kitapçığı ve Freeboard Calculation dosyalarıyla uyum şart.`
      }
    ];

    for (const m of mapping) {
      if (m.test.test(question)) return m.answer;
    }

    const knowledge = {
      "gm": `**GM (Metasantrik Yükseklik) Hesaplaması**

**Formül:** GM = KM - KG

**Bileşenler:**
- **KM**: Metasantır mesafesi (keel'den metasantıra)
- **KG**: Ağırlık merkezi yüksekliği (keel'den CoG'a)

**IMO Kriterleri:**
- **Minimum**: GM ≥ 0.15m
- **Optimal**: 0.15m ≤ GM ≤ 0.35m  
- **Aşırı sert**: GM > 0.35m

**Praktik Değerlendirme:**
- GM < 0.15m: ⚠️ Tehlikeli
- GM = 0.15-0.35m: ✅ İdeal
- GM > 0.35m: ⚡ Aşırı sert`,

      "stabilite": `**Gemi Stabilitesi Hesaplamaları**

**Temel Formüller:**
1. **GM = KM - KG** (Metasantrik yükseklik)
2. **GZ = GM × sin(φ)** (Doğrultucu kol)
3. **BM = I / ∇** (Metasantrik yarıçap)

**IMO IS Code 2008 Kriterleri:**
- 0-30° alan: ≥ 3.151 m.derece
- 0-40° alan: ≥ 5.157 m.derece
- 30-40° alan: ≥ 1.719 m.derece
- Max GZ: ≥ 0.20m, açısı ≥ 30°`,

      "deplasman": `**Deplasman Hesaplaması**

**Formül:** Δ = L × B × T × Cb × ρ

**Bileşenler:**
- **L**: Gemi uzunluğu (m)
- **B**: Gemi genişliği (m)
- **T**: Su çekimi (m)
- **Cb**: Blok katsayısı (0.6-0.8)
- **ρ**: Su yoğunluğu (1.025 t/m³)`,

      "trim": `**Trim Hesaplamaları**

**Trim:** Ta - Tf (Kıç su çekimi - Baş su çekimi)
**Trim Açısı:** θ = arctan(Trim / LPP)
**MCT:** MCT1cm = (Δ × GML) / (100 × LPP)`
    };

    for (const [key, answer] of Object.entries(knowledge)) {
      if (lowerQuestion.includes(key)) {
        return answer;
      }
    }

    return `**Asistan**

Size maritime mühendisliği konularında yardımcı olmaya hazırım!

**Uzmanlık Alanları:**
• **Stabilite**: GM, GZ, metasantır hesaplamaları
• **Seyir**: Mesafe, hız, rota hesaplamaları  
• **Hidrodinamik**: Direnç, güç, itme analizi
• **Yapısal**: Mukavemet, gerilme hesaplamaları
• **Güvenlik**: IMO, SOLAS kriterleri
• **Ekonomik**: Maliyet, yakıt optimizasyonu

Detaylı bir soru sorun, size hesaplama ve açıklamalar sunayım!`;
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast.error("Lütfen bir soru yazın");
      return;
    }

    setIsLoading(true);
    const currentQuestion = question.trim();
    setQuestion("");

    try {
      let answer = "";
      let wolframResult = "";

      // Check if question needs calculation
      const calculation = detectCalculation(currentQuestion);
      
      if (calculation) {
        // Background Wolfram calculation
        let wolframQuery = "";
        
        switch (calculation.type) {
          case 'displacement':
            if (calculation.values.length >= 3) {
              wolframQuery = `${calculation.values[0]} * ${calculation.values[1]} * ${calculation.values[2]} * 0.7 * 1.025`;
            }
            break;
          case 'gm':
            if (calculation.values.length >= 2) {
              wolframQuery = `${calculation.values[0]} - ${calculation.values[1]}`;
            }
            break;
          case 'power':
            if (calculation.values.length >= 1) {
              wolframQuery = `${calculation.values[0]} hp to kw`;
            }
            break;
        }

        if (wolframQuery) {
          const wolframCalc = await performWolframCalculation(wolframQuery);
          if (wolframCalc) {
            wolframResult = `\n\n**Hesaplama Sonucu:** ${wolframCalc}`;
          }
        }
      }

      // Try Gemini first, fallback to local
      try {
        answer = await getGeminiResponse(currentQuestion);
        toast.success("Yanıt hazırlandı");
      } catch (error) {
        console.warn('Gemini failed, using local knowledge:', error);
        answer = getLocalKnowledge(currentQuestion);
        toast.info("Yerel bilgi bankası kullanıldı");
      }

      // Combine answers
      const finalAnswer = answer + wolframResult;
      setResponse(finalAnswer);
      
      // Add to conversation history
      const newEntry = {
        question: currentQuestion,
        answer: finalAnswer,
        timestamp: Date.now()
      };
      setConversationHistory(prev => [newEntry, ...prev.slice(0, 4)]); // Keep last 5

    } catch (error) {
      console.error('Assistant error:', error);
      toast.error("Yanıt alınamadı");
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "GM hesaplaması nasıl yapılır?",
    "Trim açısı formülü nedir?",
    "Kararlılık kriterleri nelerdir?",
    "SFOC hesaplama yöntemi",
    "Büyük daire seyir hesabı"
  ];

  const handleQuickQuestion = (q: string) => {
    setQuestion(q);
  };

  return (
          <Card className="shadow-lg mb-6">
      <CardContent className="space-y-4">
        {/* Quick Questions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground mt-4">Hızlı Sorular:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickQuestions.map((q, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto py-2 text-xs"
                onClick={() => handleQuickQuestion(q)}
                disabled={isLoading}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>

        {/* Question Input */}
        <div className="space-y-3">
          <Textarea
            placeholder="Denizcilikle ilgili sorularınızı buraya yazınız...

Örnekler:
• 'GM hesaplaması nasıl yapılır?'
• 'KM 15.2m, KG 14.8m olan geminin GM değeri?'
• 'Kararlılık kriterleri nelerdir?'"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
          
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !question.trim()}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Hesaplanıyor...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Sor
              </>
            )}
          </Button>
        </div>

        {/* Response */}
        {response && (
          <div className="p-4 bg-card border border-primary/20 rounded-lg shadow-sm">
            <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Uzman Değerlendirme:
            </h4>
            <div className="text-sm text-card-foreground whitespace-pre-wrap leading-relaxed space-y-2">
              {response.split('\n').map((line, index) => {
                // Formül satırları için özel stil
                if (line.includes('=') && (line.includes('×') || line.includes('+') || line.includes('-') || line.includes('/'))) {
                  return (
                    <div key={index} className="bg-muted border border-primary/30 p-3 rounded-lg font-mono text-sm">
                      <code className="text-foreground">{line}</code>
                    </div>
                  );
                }
                // Başlık satırları
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <h5 key={index} className="font-semibold text-primary mt-3 mb-1">
                      {line.replace(/\*\*/g, '')}
                    </h5>
                  );
                }
                // Normal satırlar
                return line.trim() ? (
                  <p key={index} className="mb-1">{line}</p>
                ) : (
                  <div key={index} className="h-2"></div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Questions */}
        {conversationHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Son Sorular:</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {conversationHistory.slice(0, 3).map((entry, index) => (
                <div key={index} className="text-xs p-2 bg-muted rounded border-l-2 border-primary/30">
                  <div className="font-medium text-foreground">S: {entry.question}</div>
                  <div className="text-muted-foreground mt-1 truncate">
                    A: {entry.answer.substring(0, 80)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};