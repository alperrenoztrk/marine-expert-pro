import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/safeClient";

interface AssistantInterfaceProps {
  title: string;
  subtitle: string;
  badge: string;
  quickPrompts: string[];
  systemPrompt: string;
  placeholder?: string;
  icon: LucideIcon;
  accentGradient?: string;
  iconColor?: string;
}

export function AssistantInterface({
  title,
  subtitle,
  badge,
  quickPrompts,
  systemPrompt,
  placeholder = "Sorunuzu yazın...",
  icon: Icon,
  accentGradient = "from-emerald-600 via-green-600 to-teal-600",
  iconColor = "text-emerald-600",
}: AssistantInterfaceProps) {
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
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
            <Icon className={`h-10 w-10 ${iconColor}`} />
          </div>
          <div className="text-sm text-muted-foreground mb-1">{badge}</div>
          <h1 className={`text-4xl font-extrabold bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent mb-3`}>
            {title}
          </h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        <div className="space-y-6">
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
                    key={`${prompt}-${index}`}
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

          <Card className="border-border/60 bg-card/85 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sorunuzu Yazın</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={placeholder}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <Button
                onClick={() => askQuestion(question)}
                disabled={loading || !question.trim()}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Yanıt hazırlanıyor...
                  </>
                ) : (
                  <>
                    Gönder
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {response && (
            <Card className="border-border/60 bg-card/85 backdrop-blur-sm animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-emerald-600" />
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

