import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ClipboardCopy, Bot, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/safeClient";
import { navigationTopicsContent } from "@/data/navigationTopicsContent";
import { stabilityTopicsData } from "@/data/stabilityTopicsContent";

const SYSTEM_PROMPT = `Sen Marine Expert uygulamasının "Konu Anlatımı Denetleyicisi"sin.

GÖREVİN:
- Uygulamadaki tüm konu anlatımlarının mevcut durumunu denetle.
- Eksikleri, yapılması gerekenleri ve güncelleme önerilerini çıkar.
- Her zaman denizcilik kaynaklarını ve resmi yayınları baz al.
- Kullanıcı tarafından verilen referans metnini/bağlantı özetini birincil ölçüt kabul et.

ÖNEM ÖNCELİĞİ:
1) Doğruluk (formüller, kurallar, standartlar)
2) Görsellik (tablo/grafik/şema kalitesi)
3) Animasyon kalitesi (net, öğretici)
4) Yapay zeka izi minimum (kısa, net, operasyonel rapor dili)

RAPOR FORMATI (Türkçe):
- Genel Özet (3-5 madde)
- Konu Bazlı Bulgular (her konu için: Durum, Eksikler, Yapılacaklar, Kaynak Dayanağı)
- Hızlı Aksiyon Listesi (P0/P1/P2)
- Kaynak Uyum Notu (kullandığın kaynak başlıkları)

Kurallar:
- Eğer kaynak belirtilemiyorsa "Kaynak gerekli" notu düş.
- Şişirme/kişisel üslup yok, sadece operasyonel aksiyonlar.`;

const toSnippet = (text: string, maxLength = 380) =>
  text.replace(/\s+/g, " ").trim().slice(0, maxLength);

export const ContentAuditController = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState("");
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [referenceNotes, setReferenceNotes] = useState("");

  const contentSnapshot = useMemo(() => {
    const navigationTopics = navigationTopicsContent.map((topic) => ({
      id: topic.id,
      title: topic.title,
      pages: topic.pages.map((page) => ({
        title: page.title,
        summary: page.summary,
        bullets: page.bullets,
        imageAlt: page.imageAlt,
        motionCue: page.motionCue,
        references: page.references,
        updatedAt: page.updatedAt,
      })),
      calculationLinks: topic.calculationLinks,
    }));

    const stabilityTopics = stabilityTopicsData.map((topic) => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      subtopics: topic.subtopics.map((subtopic) => ({
        title: subtopic.title,
        contentSnippet: toSnippet(subtopic.content),
        contentLength: subtopic.content.length,
        keyPoints: subtopic.keyPoints,
        warnings: subtopic.warnings,
        practicalTips: subtopic.practicalTips,
        formulas: subtopic.formulas,
        examples: subtopic.examples,
      })),
    }));

    return {
      generatedAt: new Date().toISOString(),
      navigation: {
        topics: navigationTopics,
        topicCount: navigationTopics.length,
        pageCount: navigationTopics.reduce((sum, topic) => sum + topic.pages.length, 0),
      },
      stability: {
        topics: stabilityTopics,
        topicCount: stabilityTopics.length,
        subtopicCount: stabilityTopics.reduce((sum, topic) => sum + topic.subtopics.length, 0),
      },
    };
  }, []);

  const auditPayload = useMemo(() => JSON.stringify(contentSnapshot, null, 2), [contentSnapshot]);

  const runAudit = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);

    try {
      const userPrompt = `Marine Expert içerik anlık durumu (JSON):\n${auditPayload}\n\nReferans Notları (varsa):\n${referenceNotes || "Belirtilmedi"}`;

      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        },
      });

      if (error) throw error;
      const text = (data?.text || data?.answer || "").toString().trim();

      if (!text) {
        throw new Error("AI yanıtı boş geldi.");
      }

      setReport(text);
      setLastRunAt(new Date().toLocaleString("tr-TR"));
      toast.success("Denetim raporu güncellendi.");
    } catch (err) {
      console.error(err);
      toast.error("Denetim raporu oluşturulamadı.");
    } finally {
      setIsRunning(false);
    }
  }, [auditPayload, isRunning, referenceNotes]);

  useEffect(() => {
    if (!autoRefresh) return;
    const intervalMs = 1000 * 60 * 15;
    const id = window.setInterval(() => {
      runAudit();
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [autoRefresh, runAudit]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      toast.success("Rapor kopyalandı.");
    } catch (error) {
      console.error(error);
      toast.error("Kopyalama başarısız.");
    }
  };

  return (
    <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          <span data-translatable>AI Konu Anlatımı Denetleyicisi</span>
        </CardTitle>
        <CardDescription>
          <span data-translatable>Konu anlatımlarını denizcilik kaynaklarına göre analiz eder.</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
            <div className="text-xs text-muted-foreground">Seyir Konuları</div>
            <div className="mt-1 text-lg font-semibold text-foreground">{contentSnapshot.navigation.topicCount} başlık</div>
            <div className="text-xs text-muted-foreground">{contentSnapshot.navigation.pageCount} sayfa</div>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
            <div className="text-xs text-muted-foreground">Stabilite Konuları</div>
            <div className="mt-1 text-lg font-semibold text-foreground">{contentSnapshot.stability.topicCount} başlık</div>
            <div className="text-xs text-muted-foreground">{contentSnapshot.stability.subtopicCount} alt başlık</div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Referans Notları</Label>
          <Textarea
            value={referenceNotes}
            onChange={(event) => setReferenceNotes(event.target.value)}
            placeholder="Örn: IMO Model Course 7.03 - Bölüm 2, ECDIS kullanım adımları; ALRS Vol.1 - rota güvenliği..."
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground">
            Harici kaynak bağlantıları veya özetlerini buraya ekleyin. Denetleyici bu notları birincil ölçüt kabul eder.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={runAudit} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Denetim Çalışıyor
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Analizi Yenile
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <span className="text-sm text-muted-foreground">15 dakikada bir otomatik güncelle</span>
          </div>
          {lastRunAt && (
            <Badge variant="secondary">Son rapor: {lastRunAt}</Badge>
          )}
        </div>

        <div className="rounded-lg border border-border/50 bg-background/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Bot className="h-4 w-4" />
              Denetim Raporu
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!report}>
              <ClipboardCopy className="mr-2 h-4 w-4" />
              Kopyala
            </Button>
          </div>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {report || "Henüz rapor oluşturulmadı. 'Analizi Yenile' ile başlatın."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
