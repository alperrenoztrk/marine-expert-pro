import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Brain, Send, Loader2, Lightbulb, Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const quickPrompts = [
  "Konteyner yükleme planlaması için optimizasyon önerileri",
  "Tehlikeli yük taşımacılığında IMDG Code gereksinimleri",
  "Tahıl yüklemesi öncesi hazırlık ve stabilite kontrolleri",
  "Reefer konteyner sıcaklık ve nem ayarları tablosu",
  "Bulk kargo trim ve yükleme sırası nasıl hesaplanır?",
  "Lashing ve securing gereksinimleri için CSS Code önerileri",
];

export default function CargoAssistantPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async (q: string) => {
    if (!q.trim()) {
      toast.error("Lütfen bir soru yazın");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const systemPrompt = `Sen denizcilik sektöründe kargo operasyonları ve yük yönetimi konusunda uzman bir asistansın.
IMDG Code, CSS Code, tahıl stabilitesi, konteyner operasyonları, bulk/break-bulk yükleme konularında derin bilgiye sahipsin.
Soruları Türkçe olarak, teknik doğrulukla ve pratik örneklerle yanıtla.
Stabilite ve güvenlik konularını vurgula.
Yanıtlarını maddeler halinde, anlaşılır ve operasyonel açıdan uygulanabilir şekilde ver.`;

      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: q }
          ]
        }
      });

      if (error) throw error;

      setResponse(data?.text || "Yanıt alınamadı");
      setQuestion("");
    } catch (err) {
      console.error("Assistant error:", err);
      toast.error("Yanıt alınırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl mb-4">
            <Brain className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent mb-3">
            Kargo & Operasyon Asistanı
          </h1>
          <p className="text-muted-foreground">AI destekli yükleme sırası ve trim danışmanlığı</p>
        </div>

        <div className="space-y-6">
          {/* Quick Prompts */}
          <Card className="border-border/60 bg-card/85 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Hızlı Sorular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-3 whitespace-normal text-left"
                    onClick={() => {
                      setQuestion(prompt);
                      askQuestion(prompt);
                    }}
                    disabled={loading}
                  >
                    {prompt.substring(0, 50)}...
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Question Input */}
          <Card className="border-border/60 bg-card/85 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sorunuzu Yazın</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Kargo operasyonları, yükleme planlaması, stabilite hakkında sorularınızı yazın..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <Button
                onClick={() => askQuestion(question)}
                disabled={loading || !question.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Yanıt hazırlanıyor...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Sor
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Response */}
          {response && (
            <Card className="border-border/60 bg-card/85 backdrop-blur-sm animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-amber-600" />
                  Yanıt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                    {response}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
