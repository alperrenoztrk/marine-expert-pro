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
      'route': `**Rota Planlama Formülleri:**

🔸 **Toplam Mesafe:** Σ d_i (tüm leg mesafeleri toplamı)
🔸 **Ortalama Hız:** V_avg = Toplam_Mesafe / Toplam_Zaman  
🔸 **Seyir Süresi:** T = D / V (saat cinsinden)
🔸 **Yakıt Tüketimi:** F = D × FC × SF 
   - D: Mesafe (nm), FC: Yakıt oranı (ton/nm), SF: Hız faktörü

**Optimizasyon:**
- Great Circle: En kısa mesafe
- Rhumb Line: Sabit kurs
- Weather Routing: %10-15 yakıt tasarrufu`,

      'great-circle': `**Büyük Daire Hesaplamaları:**

🔸 **Mesafe (nm):** 
   d = 60 × arccos(sin φ₁ × sin φ₂ + cos φ₁ × cos φ₂ × cos Δλ)

🔸 **Başlangıç Kursu (°T):**
   C₁ = arctan2(sin Δλ × cos φ₂, cos φ₁ × sin φ₂ - sin φ₁ × cos φ₂ × cos Δλ)

🔸 **Vertex Enlemi:**
   φ_v = arccos(cos C₁ × cos φ₁)

🔸 **Ara Nokta Hesaplama:**
   φ = arcsin(sin φ₁ × cos σ + cos φ₁ × sin σ × cos C₁)
   λ = λ₁ + arctan2(sin C₁ × sin σ × cos φ₁, cos σ - sin φ₁ × sin φ)

**Semboller:** φ = Enlem, λ = Boylam, σ = Açısal mesafe`,

      'mercator-sailing': `**Mercator Seyri (Rhumb Line):**

🔸 **DMP (Meridyen Parçası Farkı):**
   DMP = 7915.7 × log₁₀(tan(45° + φ₂/2) ÷ tan(45° + φ₁/2))

🔸 **Departure:**
   Dep = DLong × cos φ_m (φ_m = orta enlem)

🔸 **Mesafe:**
   D = DLat ÷ cos C (kurs doğu-batı değilse)
   D = Dep ÷ sin C (kurs kuzey-güney değilse)

🔸 **Kurs:**
   C = arctan(Dep ÷ DMP)

**Avantaj:** Sabit kurs, kolay navigasyon
**Dezavantaj:** Great Circle'dan daha uzun`,

      'eta-calculation': `**Varış Zamanı Hesaplaması:**

🔸 **Temel ETA:**
   T = D ÷ V (saat cinsinden)
   Saat = floor(T), Dakika = (T - Saat) × 60

🔸 **Akıntılı Seyir:**
   SOG = √(V² + C² + 2×V×C×cos α)
   ETA = D ÷ SOG

🔸 **Hava Durumu Düzeltmesi:**
   ETA_düzeltilmiş = ETA × Hava_Faktörü

**Hava Faktörleri:**
- Rüzgâr lehte: 0.90-0.95
- Rüzgâr aleyhte: 1.10-1.25  
- Deniz durumu kötü: 1.15-1.30
- Fırtına: 1.40-1.60`,

      'dr-plotting': `**Dead Reckoning (Kestirme Konum):**

🔸 **DR Koordinatları:**
   Lat_DR = Lat₀ + (D × cos C) ÷ 60
   Long_DR = Long₀ + (D × sin C) ÷ (60 × cos Lat_orta)

🔸 **Estimated Position (EP):**
   EP_Lat = DR_Lat + (Set × cos Drift_Yönü) ÷ 60
   EP_Long = DR_Long + (Set × sin Drift_Yönü) ÷ (60 × cos Lat)

🔸 **Set ve Drift:**
   Set = Akıntı mesafesi (nm)
   Drift = Akıntı yönü (°T)

**DR Güvenilirliği:**
- 0-4 saat: %95 doğru
- 4-8 saat: %85 doğru  
- 8+ saat: Fix gerekli`,

      'plane-sailing': `**Düzlem Seyri:**

🔸 **Departure:**
   Dep = DLong × cos Lat_orta × 60 (nm)

🔸 **Difference of Latitude:**
   DLat = (Lat₂ - Lat₁) × 60 (nm)

🔸 **Distance:**
   D = √(Dep² + DLat²)

🔸 **Course:**
   C = arctan(Dep ÷ DLat)
   
**Kuadrant Düzeltmeleri:**
- NE: C = arctan(Dep/DLat)
- SE: C = 180° - arctan(Dep/DLat)  
- SW: C = 180° + arctan(Dep/DLat)
- NW: C = 360° - arctan(Dep/DLat)

**Kısıt:** Max 600 nm, orta enlemler`,

      'current': `**Akıntı Hesaplamaları:**

🔸 **Course To Steer (CTS):**
   CTS = TR ± CA (Current Allowance)

🔸 **Current Triangle:**
   SOG² = V² + C² - 2×V×C×cos(180°-α)
   CMG = arcsin((C × sin α) ÷ SOG)

🔸 **Current Allowance:**
   CA = arcsin((C × sin β) ÷ V)
   
**Semboller:**
- V: Gemi hızı, C: Akıntı hızı
- α: Akıntı set'i ile TR arası açı
- β: Akıntı set'i ile CTS arası açı
- TR: Track Required
- CMG: Course Made Good

**Pratik Kural:** CA ≈ (C ÷ V) × sin α × 57.3`,

      'compass': `**Pusula Düzeltmeleri:**

🔸 **Ana Formül:**
   True = Compass + Variation + Deviation

🔸 **TVMDC Sistemi:**
   T = M + Var (Doğu +, Batı -)
   M = C + Dev (Doğu +, Batı -)

🔸 **Gyro Compass:**
   True Course = Gyro Course + Gyro Error

🔸 **Bearing Düzeltmeleri:**
   True Bearing = Compass Bearing + Total Error

**Hafıza Kuralı:** "True Virgins Make Dull Company"
**Error Kuralı:** Doğu error'ları topla, Batı error'larını çıkar

**Deviation Tablosu kullanımı zorunlu**`,

      'radar': `**Radar Navigasyon (CPA/TCPA):**

🔸 **Relative Motion:**
   Rel_Speed = √[(Vt×sin Rt)² + (Vo - Vt×cos Rt)²]
   Rel_Course = arctan2(Vt×sin Rt, Vo - Vt×cos Rt)

🔸 **CPA (Closest Point of Approach):**
   CPA = Range × sin(Rel_Bearing - Rel_Course)

🔸 **TCPA (Time to CPA):**
   TCPA = Range × cos(Rel_Bearing - Rel_Course) ÷ Rel_Speed

🔸 **Risk Assessment:**
   Risk = CPA < 0.5nm VE TCPA < 6dk

**COLREG Limitleri:**
- CPA < 0.5nm: Acil eylem gerekli
- CPA < 1nm: Dikkatli takip
- TCPA < 6dk: Son müdahale şansı`,

      'tides': `**Gelgit Hesaplamaları:**

🔸 **Yükseklik (Cosine Rule):**
   h = Range/2 × [1 - cos(π×t/6)]
   
🔸 **12'de Bir Kuralı:**
   1. saat: Range/12, 2. saat: 3×Range/12
   3. saat: 5×Range/12, 4. saat: 5×Range/12
   5. saat: 3×Range/12, 6. saat: Range/12

🔸 **Tidal Stream:**
   Stream Rate = Max_Rate × cos(π×(t-HW)/6)

🔸 **Secondary Port:**
   Time Diff = ±ΔT, Height = Factor × Standard_Height

**t:** HW/LW'den geçen saat
**Range:** MHWS - MLWS`,

      'celestial': `**Celestial Navigation:**

🔸 **Sight Reduction (Computed Altitude):**
   Hc = arcsin(sin L × sin d + cos L × cos d × cos LHA)

🔸 **Azimuth:**
   Z = arccos((sin d - sin L × sin Hc) ÷ (cos L × cos Hc))

🔸 **Intercept:**
   Int = Ho - Hc (Towards/Away)

🔸 **Position Line:**
   Bearing = Az ± 90°

**Semboller:**
- L: Gözlemci enlemi
- d: Declination  
- LHA: Local Hour Angle = GHA ± Long
- Ho: Gözlenen yükseklik (sextant + düzeltmeler)
- Hc: Hesaplanan yükseklik

**Sight Reduction Tables: Pub.249 veya Pub.229**`,

      'weather': `**Meteoroloji Hesaplamaları:**

🔸 **Rüzgâr Hızı (Beaufort):**
   V(m/s) = 0.836 × B^(3/2)
   V(knot) = 1.625 × B^(3/2)

🔸 **Dalga Yüksekliği:**
   H = 0.22 × V² / g (derin deniz)
   H = 0.016 × V × F^0.5 (sığ deniz)

🔸 **Rüzgâr Basıncı:**
   P = 0.613 × V² (N/m²)

🔸 **Hız Kaybı (Baş Rüzgâr):**
   ΔV = k × H² × cos θ / L_vessel

**Rüzgâr Etki Faktörleri:**
- Baş: %15-25 hız kaybı
- Kuyruk: %5-10 hız artışı  
- Yan: Leeway 2-5°

**Beaufort Skalası: 0-12, her derece ~3 knot fark**`
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
          // Clear previous messages and show only the new calculation formulas
          return [
            { role: 'assistant', content: 'Hazır. Soru sorabilirsiniz.' },
            { role: 'assistant', content: formulas }
          ];
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

