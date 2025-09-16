import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, MessageCircle, Loader2, Compass, MapPin, Waves, Wind, Radar, Clock, Copy, ClipboardPaste, Anchor } from "lucide-react";
import { callNavigationAssistant, type AIMessage } from "@/services/aiClient";
import { useToast } from "@/hooks/use-toast";

type AssistantMode = 'idle' | 'route' | 'current' | 'compass' | 'arpa' | 'tidal' | 'eta';

export default function NavigationAssistantPopup({ variant = 'floating' as 'floating' | 'inline' }){
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [mode, setMode] = useState<AssistantMode>('idle');
  const { toast } = useToast();

  // Quick-form states
  const [etaDistance, setEtaDistance] = useState<string>("");
  const [etaSpeed, setEtaSpeed] = useState<string>("");

  const [varDeg, setVarDeg] = useState<string>("");
  const [devDeg, setDevDeg] = useState<string>("");
  const [gyroErr, setGyroErr] = useState<string>("");

  const [setDeg, setSetDeg] = useState<string>("");
  const [driftKn, setDriftKn] = useState<string>("");
  const [shipCourse, setShipCourse] = useState<string>("");
  const [shipSpeed, setShipSpeed] = useState<string>("");
  const [leeway, setLeeway] = useState<string>("2");

  const [targetBrg, setTargetBrg] = useState<string>("");
  const [targetDist, setTargetDist] = useState<string>("");
  const [targetSpd, setTargetSpd] = useState<string>("");
  const [targetCrs, setTargetCrs] = useState<string>("");

  // Memory: persist chat
  useEffect(()=>{
    const saved = localStorage.getItem('navigationAssistantChat');
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch {}
    } else {
      setMessages([{ role: 'assistant', content: 'Seyir Asistanı hazır. Örn: "ETA 240 nm 12 kn" veya hızlı butonları kullanın.' }]);
    }
  },[]);
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

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Kopyalandı', description: 'Metin panoya kopyalandı.' });
    } catch (e) {
      toast({ title: 'Kopyalama başarısız', description: 'Tarayıcı izinlerini kontrol edin.', variant: 'destructive' });
    }
  };
  const pasteIntoInput = async () => {
    try {
      const t = await navigator.clipboard.readText();
      setInput(prev => prev ? `${prev}${prev.endsWith(' ') ? '' : ' '}${t}` : t);
    } catch (e) {
      toast({ title: 'Yapıştırma başarısız', description: 'Panoya erişim izni gerekli olabilir.', variant: 'destructive' });
    }
  };
  const lastAssistant = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return messages[i].content;
    }
    return '';
  };

  // Quick intents
  const startETA = () => {
    setMode('eta');
    appendAssistant('ETA için mesafe (nm) ve hız (kn) girin.');
  };
  const computeETA = () => {
    const d = parseFloat(etaDistance);
    const s = parseFloat(etaSpeed);
    if ([d,s].some(isNaN) || s <= 0) { appendAssistant('Geçerli mesafe ve hız girin.'); return; }
    const hours = d / s;
    appendAssistant(`ETA ≈ ${hours.toFixed(1)} saat sonra. (d=${d} nm, v=${s} kn)`);
  };

  const startCompass = () => {
    setMode('compass');
    appendAssistant('Pusula düzeltmeleri için varyasyon, deviasyon, gyro hatası girin.');
  };
  const computeCompass = () => {
    const v = parseFloat(varDeg) || 0;
    const dv = parseFloat(devDeg) || 0;
    const g = parseFloat(gyroErr) || 0;
    const tce = v + dv + g; // simplistic aggregate
    appendAssistant(`Toplam pusula hatası (yaklaşık) ≈ ${tce.toFixed(1)}°. (Var=${v}, Dev=${dv}, Gyro=${g})`);
  };

  const startCurrent = () => {
    setMode('current');
    appendAssistant('Akıntı üçgeni için kurs, hız, set (°) ve drift (kn) girin.');
  };
  const computeCurrent = () => {
    const crs = parseFloat(shipCourse);
    const spd = parseFloat(shipSpeed);
    const setd = parseFloat(setDeg);
    const drf = parseFloat(driftKn);
    const lw = parseFloat(leeway) || 0;
    if ([crs,spd,setd,drf].some(isNaN) || spd <= 0) { appendAssistant('Geçerli kurs, hız, set ve drift girin.'); return; }
    appendAssistant(`Akıntı düzeltmesi için CTS yaklaşık hesaplanacak. (CRS=${crs}°, S=${spd} kn, Set=${setd}°, Drift=${drf} kn, Leeway≈${lw}°)`);
  };

  const startARPA = () => {
    setMode('arpa');
    appendAssistant('CPA/TCPA için hedefin kerterizi, mesafesi, kursu ve hızı gerekli.');
  };
  const computeARPA = () => {
    const brg = parseFloat(targetBrg);
    const dst = parseFloat(targetDist);
    const crs = parseFloat(targetCrs);
    const spd = parseFloat(targetSpd);
    if ([brg,dst,crs,spd].some(isNaN) || dst <= 0) { appendAssistant('Geçerli brg, mesafe, kurs, hız girin.'); return; }
    appendAssistant(`ARPA analizi başlatıldı (yaklaşık). BRG=${brg}°, D=${dst} nm, CRS=${crs}°, S=${spd} kn.`);
  };

  const startTidal = () => {
    setMode('tidal');
    appendAssistant('Gelgit için HW/LW saatleri ve yükseklikleri, spring/neap bilgisi gerekebilir.');
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
              <div className="border-b p-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Seyir Asistanı</DialogTitle>
                </DialogHeader>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {/* Quick intents */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Button variant={mode==='eta'? 'default':'outline'} size="sm" onClick={startETA}><Clock className="h-4 w-4 mr-1" /> ETA</Button>
                  <Button variant={mode==='route'? 'default':'outline'} size="sm" onClick={()=>setMode('route')}><MapPin className="h-4 w-4 mr-1" /> Rota</Button>
                  <Button variant={mode==='current'? 'default':'outline'} size="sm" onClick={startCurrent}><Waves className="h-4 w-4 mr-1" /> Akıntı</Button>
                  <Button variant={mode==='compass'? 'default':'outline'} size="sm" onClick={startCompass}><Compass className="h-4 w-4 mr-1" /> Pusula</Button>
                  <Button variant={mode==='arpa'? 'default':'outline'} size="sm" onClick={startARPA}><Radar className="h-4 w-4 mr-1" /> ARPA</Button>
                  <Button variant={mode==='tidal'? 'default':'outline'} size="sm" onClick={startTidal}><Anchor className="h-4 w-4 mr-1" /> Gelgit</Button>
                </div>

                {/* Chat window */}
                <div className="border rounded p-2 h-[50vh] bg-muted">
                  <ScrollArea className="h-full pr-2">
                    <div className="space-y-2">
                      {messages.map((m, i)=> (
                        <div key={i} className={`text-sm ${m.role==='user'?'text-right':''}`}>
                          <div className={`inline-flex items-center gap-2`}>
                            <div className={`inline-block px-2 py-1 rounded ${m.role==='user'?'bg-blue-600 text-white':'bg-white'}`}>{m.content}</div>
                            <button aria-label="Kopyala" onClick={()=> copyText(m.content)} className="text-xs text-muted-foreground hover:text-foreground">
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Guided forms */}
                {mode==='eta' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3 items-end">
                    <div><Label>Mesafe (nm)</Label><Input value={etaDistance} onChange={(e)=> setEtaDistance(e.target.value)} /></div>
                    <div><Label>Hız (kn)</Label><Input value={etaSpeed} onChange={(e)=> setEtaSpeed(e.target.value)} /></div>
                    <div className="md:col-span-2"><Button onClick={computeETA}>Hesapla</Button></div>
                  </div>
                )}

                {mode==='compass' && (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mt-3 items-end">
                    <div><Label>Varyasyon (°)</Label><Input value={varDeg} onChange={(e)=> setVarDeg(e.target.value)} /></div>
                    <div><Label>Deviasyon (°)</Label><Input value={devDeg} onChange={(e)=> setDevDeg(e.target.value)} /></div>
                    <div><Label>Gyro Hatası (°)</Label><Input value={gyroErr} onChange={(e)=> setGyroErr(e.target.value)} /></div>
                    <div className="md:col-span-3"><Button onClick={computeCompass}>Düzelt</Button></div>
                  </div>
                )}

                {mode==='current' && (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mt-3 items-end">
                    <div><Label>Kurs (°)</Label><Input value={shipCourse} onChange={(e)=> setShipCourse(e.target.value)} /></div>
                    <div><Label>Hız (kn)</Label><Input value={shipSpeed} onChange={(e)=> setShipSpeed(e.target.value)} /></div>
                    <div><Label>Set (°)</Label><Input value={setDeg} onChange={(e)=> setSetDeg(e.target.value)} /></div>
                    <div><Label>Drift (kn)</Label><Input value={driftKn} onChange={(e)=> setDriftKn(e.target.value)} /></div>
                    <div><Label>Leeway (°)</Label><Input value={leeway} onChange={(e)=> setLeeway(e.target.value)} /></div>
                    <div><Button onClick={computeCurrent}>Hesapla</Button></div>
                  </div>
                )}

                {mode==='arpa' && (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mt-3 items-end">
                    <div><Label>Kerteriz (°)</Label><Input value={targetBrg} onChange={(e)=> setTargetBrg(e.target.value)} /></div>
                    <div><Label>Mesafe (nm)</Label><Input value={targetDist} onChange={(e)=> setTargetDist(e.target.value)} /></div>
                    <div><Label>Hedef Kurs (°)</Label><Input value={targetCrs} onChange={(e)=> setTargetCrs(e.target.value)} /></div>
                    <div><Label>Hedef Hız (kn)</Label><Input value={targetSpd} onChange={(e)=> setTargetSpd(e.target.value)} /></div>
                    <div className="md:col-span-2"><Button onClick={computeARPA}>Hesapla</Button></div>
                  </div>
                )}

                {/* Freeform input */}
                <div className="flex gap-2 items-end mt-3">
                  <Textarea value={input} onChange={(e)=> setInput(e.target.value)} placeholder="Örn: 41N 029E → 36N 033E GC mesafesi?" className="min-h-[60px]" />
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={pasteIntoInput} className="gap-1"><ClipboardPaste className="h-4 w-4" /> Yapıştır</Button>
                    <Button variant="outline" size="sm" onClick={()=> copyText(lastAssistant())} disabled={!lastAssistant()} className="gap-1"><Copy className="h-4 w-4" /> Son Yanıtı Kopyala</Button>
                  </div>
                  <Button onClick={send} disabled={busy}>{busy? <Loader2 className="h-4 w-4 animate-spin" /> : 'Gönder'}</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

