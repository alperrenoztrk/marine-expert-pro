import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Compass, Loader2 } from "lucide-react";
import { callNavigationAssistant, type AIMessage } from "@/services/aiClient";
import { useToast } from "@/hooks/use-toast";

interface NavigationAssistantProps {
  variant?: 'floating' | 'inline';
  calculationContext?: string;
}

export default function NavigationAssistantPopup({ variant = 'floating', calculationContext }: NavigationAssistantProps){
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const { toast } = useToast();

  // Formula content for different calculation contexts
  const getContextualFormulas = (context: string) => {
    const formulas: Record<string, string> = {
      'route': `**Genel Rota Planlama Formülleri:**

🔸 **Toplam Mesafe:** Σ d_i (tüm leg mesafeleri)
🔸 **Ortalama Hız:** v_avg = toplam_mesafe / toplam_zaman
🔸 **Yakıt Tüketimi:** fuel = mesafe × tüketim_oranı × hız_faktörü

**Rota Optimizasyonu:**
- Weather routing ile %10-15 yakıt tasarrufu
- Great Circle vs Rhumb Line karşılaştırması`,

      'great-circle': `**Büyük Daire (Great Circle) Formülleri:**

🔸 **Mesafe:** d = arccos(sin φ₁ × sin φ₂ + cos φ₁ × cos φ₂ × cos Δλ) × R
🔸 **Başlangıç Kursu:** θ₁ = arctan2(sin Δλ × cos φ₂, cos φ₁ × sin φ₂ - sin φ₁ × cos φ₂ × cos Δλ)
🔸 **Vertex Enlem:** φ_v = arcsin(cos θ₁ × sin φ₁)

**Semboller:**
- φ₁, φ₂: enleme (latitude) 
- λ₁, λ₂: boylam (longitude)
- Δλ = λ₂ - λ₁
- R = Dünya yarıçapı (3440 nm)`,

      'mercator-sailing': `**Rhumb Line (Mercator) Formülleri:**

🔸 **Mesafe:** d = Δφ / cos θ  (eğer kurs E-W değilse)
🔸 **Sabit Kurs:** θ = arctan(Δλ / Δm)
🔸 **Meridyen Parçaları:** Δm = 7915.7 × log₁₀(tan(45° + φ₂/2) / tan(45° + φ₁/2))
🔸 **Departure:** dep = Δλ × cos φ_m

**Not:** Rhumb line sabit kursta seyir, Great Circle'dan daha uzun mesafe`,

      'eta-calculation': `**ETA Hesaplama Formülleri:**

🔸 **Temel ETA:** t = d / v
🔸 **Saat:Dakika:** t_h = floor(t), t_m = (t - t_h) × 60
🔸 **Akıntılı ETA:** t = d / SOG (Speed Over Ground)
🔸 **Hava Durumu Etkisi:** ETA_adj = ETA × weather_factor

**Weather Factor:**
- Rüzgâr lehte: 0.9-0.95
- Rüzgâr aleyhte: 1.1-1.2
- Fırtına: 1.3-1.5`,

      'dr-plotting': `**Dead Reckoning (DR) Formülleri:**

🔸 **DR Konum:** lat_dr = lat₀ + (d × cos θ) / 60
🔸 **DR Konum:** lon_dr = lon₀ + (d × sin θ) / (60 × cos lat_m)
🔸 **Estimated Position:** EP = DR + set/drift düzeltmesi

**DR Güvenilirlik:**
- 4 saatte %90 doğruluk
- 8 saatte %70 doğruluk
- Fix alındıktan sonra DR sıfırla`,

      'plane-sailing': `**Plane Sailing Formülleri:**

🔸 **Departure:** dep = (lon₂ - lon₁) × cos lat_m × 60
🔸 **D.Lat:** d_lat = (lat₂ - lat₁) × 60
🔸 **Distance:** d = √(dep² + d_lat²)
🔸 **Course:** θ = arctan(dep / d_lat)

**Kısıtlamalar:**
- 600 nm'den kısa mesafeler için
- Orta enlemlerde kullanılır`,

      'current': `**Akıntı Üçgeni (CTS) Formülleri:**

🔸 **Hız Üçgeni:** V² = V₁² + V₂² + 2×V₁×V₂×cos α
🔸 **Kurs Düzeltmesi:** CTS = θ ± drift_angle
🔸 **Course Made Good:** CMG = arctan2(V_drift×sin α, V_ship + V_drift×cos α)
🔸 **Speed Over Ground:** SOG = √(V_ship² + V_drift² + 2×V_ship×V_drift×cos α)

**Semboller:**
- CTS: Course To Steer
- CMG: Course Made Good  
- α: akıntı ile kurs arası açı`,

      'compass': `**Pusula Düzeltme Formülleri:**

🔸 **True → Magnetic:** M = T - Variation
🔸 **Magnetic → Compass:** C = M - Deviation  
🔸 **Toplam Düzeltme:** T = C + Var + Dev
🔸 **Gyro Compass:** T = Gyro + Gyro_Error

**TVMDC Kuralı:**
- **T**rue (Gerçek)
- **V**ariation (Varyasyon)
- **M**agnetic (Manyetik)  
- **D**eviation (Sapma)
- **C**ompass (Pusula)`,

      'radar': `**CPA/TCPA (ARPA) Formülleri:**

🔸 **Relative Motion:** V_rel = √[(V_t×sin θ)² + (V_o - V_t×cos θ)²]
🔸 **CPA:** CPA = D × sin(relative_bearing) 
🔸 **TCPA:** TCPA = D × cos(relative_bearing) / V_rel
🔸 **Risk Assessment:** Risk = CPA < 2nm ve TCPA < 20dk

**COLREG Kuralları:**
- CPA < 0.5 nm: Acil eylem
- CPA < 1 nm: Erken eylem
- TCPA < 6 dk: Son fırsat`,

      'tides': `**Gelgit Hesaplama Formülleri:**

🔸 **12'de Bir Kuralı:** h = (t/6)² × Range (ilk 3 saat)
🔸 **Cosine Metodu:** h = (Range/2) × [1 - cos(π×t/6)]
🔸 **Tidal Stream:** V_t = V_max × cos(π×t/6)

**Semboller:**
- h: gelgit yüksekliği
- t: HW/LW'den geçen saat
- Range: gelgit aralığı`,

      'celestial': `**Sight Reduction Formülleri:**

🔸 **Computed Altitude:** Hc = arcsin(sin L × sin d + cos L × cos d × cos LHA)
🔸 **Azimut:** Z = arctan2(sin LHA, cos L × tan d - sin L × cos LHA)
🔸 **Intercept:** Int = Ho - Hc
🔸 **Position Line:** Konum çizgisi = Az ± 90°

**Semboller:**
- L: observer latitude
- d: declination  
- LHA: Local Hour Angle
- Ho: observed altitude`,

      'weather': `**Hava Durumu Hesaplamaları:**

🔸 **Beaufort Scale:** V = 1.87 × B^(3/2) (m/s)
🔸 **Wave Height:** H = 0.22 × V² / g (deep water)
🔸 **Wind Force:** F = 0.613 × V² × A (Newton)
🔸 **Speed Loss:** ΔV = k × H² / L (baş rüzgâr)

**Rüzgâr Etkileri:**
- Baş rüzgâr: %10-20 hız kaybı
- Kuyruk rüzgâr: %5-10 hız artışı
- Yan rüzgâr: Leeway açısı`
    };

    return formulas[context] || null;
  };

  // Memory: persist chat
  useEffect(()=>{
    const saved = localStorage.getItem('navigationAssistantChat');
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch {}
    } else {
      setMessages([{ role: 'assistant', content: 'Hazır. Soru sorabilirsiniz.' }]);
    }
  },[]); 

  // Auto-show formulas when calculation context changes
  useEffect(()=>{
    if (calculationContext) {
      const formulas = getContextualFormulas(calculationContext);
      if (formulas) {
        setMessages(prev => {
          // Don't add if last message is already the same formula
          if (prev.length > 0 && prev[prev.length - 1].content === formulas) {
            return prev;
          }
          return [...prev, { role: 'assistant', content: formulas }];
        });
      }
    }
  }, [calculationContext]);
  useEffect(()=>{
    try { localStorage.setItem('navigationAssistantChat', JSON.stringify(messages)); } catch {}
  },[messages]);

  const appendAssistant = (text: string) => setMessages(prev=> [...prev, { role: 'assistant', content: text }]);
  const appendUser = (text: string) => setMessages(prev=> [...prev, { role: 'user', content: text }]);

  const send = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");
    appendUser(userText);
    setBusy(true);
    try {
      const reply = await callNavigationAssistant([...messages, { role: 'user', content: userText }]);
      appendAssistant(reply);
    } catch (e) {
      appendAssistant('Asistan şu anda yanıt veremiyor. İnternet anahtarı veya sunucu hatası olabilir.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className={variant==='floating' ? "fixed bottom-4 right-4 z-40" : "relative z-0"}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {variant==='floating' ? (
              <Button className="rounded-full h-12 w-12 p-0 shadow-lg" title="Seyir Asistanı">
                <Compass className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="outline" className="gap-2"><Compass className="h-4 w-4" /> Seyir Asistanı</Button>
            )}
          </DialogTrigger>
          <DialogContent className="left-0 top-0 translate-x-0 translate-y-0 max-w-none w-screen h-screen sm:rounded-none p-0">
            <div className="flex flex-col h-full">
              <div className="border-b p-3">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-sm"><Compass className="h-4 w-4" /> Seyir Asistanı</DialogTitle>
                </DialogHeader>
              </div>
              <div className="flex-1 overflow-auto p-3">
                {/* Chat */}
                <div className="border rounded p-2 h-[60vh] bg-muted/30">
                  <ScrollArea className="h-full">
                    <div className="space-y-2">
                      {messages.map((m, i)=> (
                        <div key={i} className={`text-sm ${m.role==='user'?'text-right':''}`}>
                          <div className={`inline-block px-2 py-1 rounded max-w-[80%] ${m.role==='user'?'bg-primary text-primary-foreground':'bg-background border'}`}>
                            {m.content}
                          </div>
                        </div>
                      ))}
                      {busy && <div className="text-center text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>}
                    </div>
                  </ScrollArea>
                </div>

                {/* Input */}
                <div className="flex gap-2 mt-2">
                  <Textarea 
                    value={input} 
                    onChange={(e)=> setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                    placeholder="Soru sorun..." 
                    className="min-h-[40px] flex-1" 
                  />
                  <Button onClick={send} disabled={busy} size="sm">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : '→'}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

