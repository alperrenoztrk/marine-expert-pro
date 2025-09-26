import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { callNavigationAssistant } from "@/services/aiClient";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavigationAssistantProps {
  variant?: 'floating' | 'inline';
  calculationContext?: string;
}

export default function NavigationAssistantPopup({ variant = 'floating', calculationContext }: NavigationAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [busy, setBusy] = useState(false);

  const getContextualFormulas = (context: string): string => {
    const formulas: Record<string, string> = {
      'great-circle': `**Great Circle Sailing:**
🔸 **Mesafe:** d = arccos(sin φ₁ × sin φ₂ + cos φ₁ × cos φ₂ × cos Δλ) × 3437.747 nm
🔸 **İlk Kurs:** C₁ = arctan2(sin Δλ × cos φ₂, cos φ₁ × sin φ₂ - sin φ₁ × cos φ₂ × cos Δλ)
🔸 **Vertex:** φ_vertex = arccos(cos φ₁ × sin C₁)`,

      'rhumb-line': `**Rhumb Line (Loxodrome) Sailing:**
🔸 **Mesafe:** d = 60 × √[(Δφ)² + (q × Δλ)²]
🔸 **Kurs:** C = arctan(Δλ ÷ Δq) - sabit kurs
🔸 **q:** log(tan(45° + φ₂/2) ÷ tan(45° + φ₁/2)) ÷ Δφ`,

      'mercator-sailing': `**Mercator Sailing:**
🔸 **DMP:** 7915.7 × log₁₀(tan(45° + φ₂/2) ÷ tan(45° + φ₁/2))
🔸 **Departure:** DLong × cos φ_m × 60
🔸 **Kurs:** C = arctan(Dep ÷ DMP)`,

      'plane-sailing': `**Plane Sailing:**
🔸 **DLat:** 60 × (φ₂ - φ₁) dakika
🔸 **Departure:** 60 × (λ₂ - λ₁) × cos φ_m dakika
🔸 **Kurs:** C = arctan(Dep ÷ DLat)
🔸 **Mesafe:** √(DLat² + Dep²) nm`,

      'eta-calculation': `**ETA Hesaplaması:**
🔸 **Temel:** T = D ÷ V (saat)
🔸 **Akıntılı:** SOG = √(V² + C² + 2×V×C×cos α)
🔸 **Hava faktörleri:** Lehte: 0.90-0.95, Aleyhte: 1.10-1.25
🔸 **Yakıt tüketimi:** FC = D × SFC × (1 + weather factor)`,

      'current': `**Akıntı Hesaplamaları:**
🔸 **CTS:** TR ± CA (Current Allowance)
🔸 **Current Triangle:** SOG² = V² + C² - 2×V×C×cos(180°-α)
🔸 **CA:** arcsin((C × sin β) ÷ V)
🔸 **Set/Drift:** Akıntının yön ve hızı
🔸 **Leeway:** Rüzgar etkisi düzeltmesi`,

      'radar': `**Radar ARPA (CPA/TCPA):**
🔸 **CPA:** Range × sin(Rel_Bearing - Rel_Course) nm
🔸 **TCPA:** Range × cos(Rel_Bearing - Rel_Course) ÷ Rel_Speed dakika
🔸 **Risk:** CPA < 0.5nm VE TCPA < 6dk
🔸 **Rel. Speed:** √[(Vt)² + (Vo)² - 2×Vt×Vo×cos(Ct-Co)]
🔸 **COLREG Action:** Erken, büyük, net manevra`,

      'tidal': `**Gelgit Hesaplamaları:**
🔸 **12'de Bir Kuralı:** 1.sa: R/12, 2.sa: 3R/12, 3.sa: 5R/12, 4.sa: 6R/12, 5.sa: 9R/12, 6.sa: 11R/12
🔸 **Yükseklik:** h = Range/2 × [1 - cos(π×t/6)]
🔸 **Harmonik:** h(t) = Z₀ + Σ[Aₙ × cos(ωₙt + φₙ)]
🔸 **Tidal Stream:** Akıntı hızı ve yönü gelgitten etkilenir`,

      'celestial': `**Göksel Seyir:**
🔸 **Sight Reduction:** Hc = arcsin[sin L × sin d + cos L × cos d × cos LHA]
🔸 **Azimuth:** Z = arccos[(sin d - sin L × sin Hc) ÷ (cos L × cos Hc)]
🔸 **Intercept:** I = Ho - Hc (towards if +, away if -)
🔸 **GHA Star:** GHA♈ + SHA⋆
🔸 **Meridian Latitude:** φ = 90° - |alt - dec| ± dec
🔸 **Amplitude:** A = arcsin(sin δ ÷ cos φ)`,

      'compass': `**Pusula Hesaplamaları:**
🔸 **Ana formül:** True = Compass + Variation + Deviation + Gyro Error
🔸 **TVMDC:** T = M + Var, M = C + Dev
🔸 **Kural:** Doğu +, Batı -
🔸 **Total Error:** TE = Var + Dev + Gyro Error`,

      'bearing': `**Bearing Hesaplamaları:**
🔸 **Doubling Angle:** Distance Off = Run × sin(2A) ÷ sin(A)
🔸 **Four Point:** Distance Off = Run × √2 (45° açı)
🔸 **Seven Point:** Distance Off = Run (30°→60°)
🔸 **Bow & Beam:** Distance Off = Run × sin(bow angle)`,

      'distance': `**Mesafe Hesaplamaları:**
🔸 **Dip of Horizon:** d = 2.075 × √h nm
🔸 **Radar Horizon:** d = 2.35 × √h nm
🔸 **Light Visibility:** d = 1.17 × (√h_eye + √h_light) nm
🔸 **Geographic Range:** Yeryuvarlığı etkisi`,

      'turning': `**Dönme Manevraları:**
🔸 **Tactical Diameter:** TD = 3.5 × L (ortalama)
🔸 **Advance:** A = R × sin(Δφ/2)
🔸 **Transfer:** T = R × (1 - cos(Δφ/2))
🔸 **ROT:** Rate of Turn = 3438 × V ÷ R deg/min
🔸 **Wheel Over Point:** WOP = A ÷ sin(Δφ/2)`,

      'weather': `**Hava Durumu Hesaplamaları:**
🔸 **Beaufort → Wind:** V = 2√(B³) kn
🔸 **Wave Height:** h = 0.025 × V² m
🔸 **Leeway Angle:** θ = k × (Vw/Vs)² degrees
🔸 **Wind Force:** F = 0.00338 × V² × A Newton
🔸 **Weather Factor:** 0.90-1.25`,

      'emergency': `**Acil Durum Arama:**
🔸 **Square Search:** Leg = 2 × Track Spacing
🔸 **Sector Search:** New Radius = R × √2
🔸 **Rescue Time:** t = Distance ÷ (Rescue Speed + Drift)
🔸 **VHF Range:** Radio horizon formula
🔸 **Datum Point:** Drift hesabı ile güncellenir`
    };

    return formulas[context] || `**Tüm Seyir Formülleri:**

**🧭 POZİSYON & ROTA:**
• Great Circle: d = arccos(sin φ₁ sin φ₂ + cos φ₁ cos φ₂ cos Δλ)
• Rhumb Line: C = arctan(Δλ ÷ Δq) - sabit kurs
• Plane Sailing: C = arctan(Dep ÷ DLat)

**⏱️ ZAMAN & HIZ:**
• ETA = Distance ÷ Speed
• Current Triangle: SOG = √(V² + C² + 2VC cos α)

**📡 RADAR & ÇATIŞMA:**
• CPA = Range × sin(RelBrg - RelCourse)
• TCPA = Range × cos(RelBrg - RelCourse) ÷ RelSpeed

**🧭 PUSULA & BEARING:**
• True = Compass + Var + Dev + Gyro
• Four Point: Dist = Run × √2

**🌊 GELGİT & MESAFE:**
• 12'de Bir: 1/12, 3/12, 5/12, 6/12...
• Dip: d = 2.075√h nm

**⭐ GÖKSEL & DÖNME:**
• Hc = arcsin(sin L sin d + cos L cos d cos LHA)
• Tactical Diameter = 3.5 × L

**🌪️ HAVA & ACİL:**
• Beaufort: V = 2√(B³) kn  
• Search: Square/Sector patterns`;
  };

  // Clear messages and show only current calculation formulas
  useEffect(() => {
    if (calculationContext) {
      const formulas = getContextualFormulas(calculationContext);
      setMessages([{ role: 'assistant', content: formulas }]);
    }
  }, [calculationContext]);

  // Load messages from localStorage on mount
  useEffect(() => {
    if (!calculationContext) {
      const savedMessages = localStorage.getItem('navigation-assistant-messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([{ role: 'assistant', content: 'Merhaba! Seyir hesaplamaları için nasıl yardımcı olabilirim?' }]);
      }
    }
  }, [calculationContext]);

  // Save messages to localStorage
  useEffect(() => {
    if (!calculationContext && messages.length > 0) {
      localStorage.setItem('navigation-assistant-messages', JSON.stringify(messages));
    }
  }, [messages, calculationContext]);

  const appendAssistant = (content: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
  };

  const appendUser = (content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
  };

  const send = async () => {
    if (!input.trim() || busy) return;
    
    const userMessage = input.trim();
    setInput("");
    setBusy(true);
    
    appendUser(userMessage);
    
    try {
      const response = await callNavigationAssistant([
        ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { role: 'user', content: userMessage }
      ]);
      appendAssistant(response);
    } catch (error) {
      appendAssistant("Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (variant === 'inline') {
    return (
      <div className="w-full">
        <div className="h-[400px] border rounded-lg p-4">
          <ScrollArea className="h-[300px] mb-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <pre className="whitespace-pre-wrap text-sm font-sans">{message.content}</pre>
                  </div>
                </div>
              ))}
              {busy && (
                <div className="text-left">
                  <div className="inline-block p-3 rounded-lg bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Textarea
              placeholder="Seyir hesaplamaları hakkında soru sorun..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-h-[40px] max-h-[100px]"
              disabled={busy}
            />
            <Button onClick={send} disabled={busy || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Seyir Asistanı</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <div key={index} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <pre className="whitespace-pre-wrap text-sm font-sans">{message.content}</pre>
                </div>
              </div>
            ))}
            {busy && (
              <div className="text-left">
                <div className="inline-block p-3 rounded-lg bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Textarea
            placeholder="Seyir hesaplamaları hakkında soru sorun..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 min-h-[40px] max-h-[100px]"
            disabled={busy}
          />
          <Button onClick={send} disabled={busy || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}