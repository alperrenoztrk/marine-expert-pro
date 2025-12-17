import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Wrench, Send, Loader2, Lightbulb, AlertTriangle, Fuel, Thermometer } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";



const quickPrompts = [
  {
    icon: AlertTriangle,
    label: "Yüksek Egzoz Sıcaklığı",
    prompt: "Ana makinede bir silindirin egzoz sıcaklığı diğerlerinden 50°C yüksek. Olası nedenler ve kontrol edilmesi gereken noktalar nelerdir?",
  },
  {
    icon: Fuel,
    label: "SFOC Artışı",
    prompt: "Son haftalarda SFOC değerlerimiz %5 arttı. Bu artışın olası nedenleri ve alınabilecek önlemler nelerdir?",
  },
  {
    icon: Thermometer,
    label: "Soğutma Problemi",
    prompt: "HT soğutma suyu sıcaklığı normalin üzerinde seyrediyor. Olası nedenler ve kontrol prosedürü nedir?",
  },
  {
    icon: Wrench,
    label: "Titreşim Analizi",
    prompt: "Ana makinede anormal titreşim algılandı. Sistematik arıza tespit yaklaşımı ve kontrol edilecek noktalar nelerdir?",
  },
];

export default function MachineAssistant() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: "user", content: text };
    setConversation((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          messages: [
            {
              role: "system",
              content: `Sen denizcilik alanında uzman bir makine mühendisisin. Gemi makineleri, yakıt sistemleri, soğutma sistemleri, bakım yönetimi ve arıza tespiti konularında derin bilgiye sahipsin. 
              
Yanıtlarında:
- Pratik ve uygulanabilir öneriler sun
- Güvenlik konularını ön planda tut
- MARPOL, SOLAS ve ISM gereksinimlerine uygun tavsiyelerde bulun
- Teknik terimleri açıkla
- Sistematik arıza tespit yaklaşımı uygula
- Gerektiğinde klas ve üretici gereksinimlerine atıfta bulun

Türkçe yanıt ver.`,
            },
            ...conversation,
            userMessage,
          ],
        },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("Çok fazla istek. Lütfen biraz bekleyin.");
          setConversation((prev) => prev.slice(0, -1));
          return;
        }
        throw error;
      }

      const assistantContent = data?.text || "Yanıt alınamadı";
      setConversation((prev) => [...prev, { role: "assistant", content: assistantContent }]);
    } catch (error) {
      console.error("AI error:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      setConversation((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/calculations">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-card/50">
              <ArrowLeft className="h-4 w-4" />
              Hesaplama Merkezi
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-slate-600 via-zinc-600 to-slate-800 bg-clip-text text-transparent mb-3">
            Makine Asistanı
          </h1>
          <p className="text-muted-foreground">
            Arıza tespiti, bakım önerileri ve teknik danışmanlık
          </p>
        </div>

        {/* Quick Prompts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {quickPrompts.map((qp) => (
            <Button
              key={qp.label}
              variant="outline"
              className="h-auto py-3 px-4 flex flex-col items-center gap-2 bg-white/80 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => sendMessage(qp.prompt)}
              disabled={isLoading}
            >
              <qp.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="text-xs text-center">{qp.label}</span>
            </Button>
          ))}
        </div>

        {/* Conversation */}
        <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wrench className="h-5 w-5 text-slate-600" />
              Konuşma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
              {conversation.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Makine sistemi sorularınızı sorun veya yukarıdaki hızlı seçenekleri kullanın.</p>
                </div>
              ) : (
                conversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-50 dark:bg-blue-900/20 ml-8"
                        : "bg-slate-50 dark:bg-slate-800/50 mr-8"
                    }`}
                  >
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      {msg.role === "user" ? "Siz" : "Makine Asistanı"}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                  </div>
                ))
              )}
              {isLoading && conversation[conversation.length - 1]?.role !== "assistant" && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Yanıt hazırlanıyor...</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Makine sistemi ile ilgili sorunuzu yazın..."
                className="resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(message);
                  }
                }}
              />
              <Button
                onClick={() => sendMessage(message)}
                disabled={!message.trim() || isLoading}
                className="px-4"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800">
          <CardContent className="pt-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              İyi Bir Soru İçin
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Problemi ve semptomları detaylı açıklayın</li>
              <li>• İlgili parametre değerlerini paylaşın (sıcaklık, basınç, vb.)</li>
              <li>• Ne zaman başladığını ve hangi koşullarda olduğunu belirtin</li>
              <li>• Yapılan son bakım veya değişiklikleri ekleyin</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
