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

      'mercator-sailing': `**Mercator Sailing:**
🔸 **DMP:** 7915.7 × log₁₀(tan(45° + φ₂/2) ÷ tan(45° + φ₁/2))
🔸 **Departure:** DLong × cos φ_m × 60
🔸 **Kurs:** C = arctan(Dep ÷ DMP)`,

      'eta-calculation': `**ETA Hesaplaması:**
🔸 **Temel:** T = D ÷ V (saat)
🔸 **Akıntılı:** SOG = √(V² + C² + 2×V×C×cos α)
🔸 **Hava faktörleri:** Lehte: 0.90-0.95, Aleyhte: 1.10-1.25`,

      'current': `**Akıntı Hesaplamaları:**
🔸 **CTS:** TR ± CA (Current Allowance)
🔸 **Current Triangle:** SOG² = V² + C² - 2×V×C×cos(180°-α)
🔸 **CA:** arcsin((C × sin β) ÷ V)`,

      'radar': `**Radar (CPA/TCPA):**
🔸 **CPA:** Range × sin(Rel_Bearing - Rel_Course)
🔸 **TCPA:** Range × cos(Rel_Bearing - Rel_Course) ÷ Rel_Speed
🔸 **Risk:** CPA < 0.5nm VE TCPA < 6dk`,

      'tidal': `**Gelgit:**
🔸 **Yükseklik:** h = Range/2 × [1 - cos(π×t/6)]
🔸 **12'de Bir:** 1.sa: R/12, 2.sa: 3R/12, 3.sa: 5R/12
🔸 **Harmonik:** h(t) = Z₀ + Σ[Aₙ × cos(ωₙt + φₙ)]`,

      'celestial': `**Göksel Seyir:**
🔸 **Hc:** arcsin[sin L × sin d + cos L × cos d × cos LHA]
🔸 **Azimuth:** arccos[(sin d - sin L × sin Hc) ÷ (cos L × cos Hc)]
🔸 **Intercept:** Ho - Hc (towards if +, away if -)
🔸 **GHA Star:** GHA_Aries + SHA_Star`,

      'compass': `**Pusula:**
🔸 **Ana formül:** True = Compass + Variation + Deviation
🔸 **TVMDC:** T = M + Var, M = C + Dev
🔸 **Kural:** Doğu +, Batı -`
    };

    return formulas[context] || `**Seyir Formülleri:**
Bu hesaplama için özel formüller yükleniyor...

Genel navigasyon formülleri:
• Great Circle: d = arccos(sin φ₁ × sin φ₂ + cos φ₁ × cos φ₂ × cos Δλ)
• Mercator: C = arctan(Dep ÷ DMP)
• CPA: Range × sin(Rel_Bearing - Rel_Course)`;
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