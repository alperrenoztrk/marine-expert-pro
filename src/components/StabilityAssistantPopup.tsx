import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, MessageCircle, Loader2 } from "lucide-react";
import { callStabilityAssistant, type AIMessage } from "@/services/aiClient";

export default function StabilityAssistantPopup(){
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    { role: 'assistant', content: 'Bir şeye mi ihtiyacınız var? Örn: "GM hesabı yapmak istiyorum" veya "TPC hesapla"' }
  ]);

  const send = async () => {
    if (!input.trim()) return;
    const next = [...messages, { role: 'user', content: input } as AIMessage];
    setMessages(next);
    setInput("");
    setBusy(true);
    const reply = await callStabilityAssistant(next);
    setMessages([...next, { role: 'assistant', content: reply }]);
    setBusy(false);
  };

  return (
    <div>
      <div className="fixed bottom-4 right-4 z-40">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full h-12 w-12 p-0 shadow-lg" title="Stabilite Asistanı">
              <Brain className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Stabilite Asistanı</DialogTitle>
              <DialogDescription>Stabilite hesaplamaları için rehber (GM, GZ, TPC, Trim/List, IMO)</DialogDescription>
            </DialogHeader>
            <div className="border rounded p-2 h-60 bg-muted">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-2">
                  {messages.map((m, i)=> (
                    <div key={i} className={`text-sm ${m.role==='user'?'text-right':''}`}>
                      <div className={`inline-block px-2 py-1 rounded ${m.role==='user'?'bg-blue-600 text-white':'bg-white'}`}>{m.content}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex gap-2 items-end">
              <Textarea value={input} onChange={(e)=> setInput(e.target.value)} placeholder="Örn: GM hesabı yapmak istiyorum" className="min-h-[60px]" />
              <Button onClick={send} disabled={busy}>{busy? <Loader2 className="h-4 w-4 animate-spin" /> : 'Gönder'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}