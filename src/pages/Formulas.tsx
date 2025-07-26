import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Brain, ArrowLeft, MessageCircle, Send, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AutoLanguageSelector } from "@/components/AutoLanguageSelector";
import { useAutoLanguageDetection } from "@/hooks/useAutoLanguageDetection";
import { useAdManager } from "@/hooks/useAdManager";
import { AdBannerInline } from "@/components/ads/AdBanner";
import { NativeAd, MaritimeSoftwareAd } from "@/components/ads/NativeAd";

const Formulas = () => {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const { translateContent } = useAutoLanguageDetection();
  const { shouldShowAd, trackInteraction } = useAdManager();

  const askAI = async () => {
    if (!question.trim()) {
      toast.error("Lütfen bir soru yazın");
      return;
    }

    setIsLoading(true);
    trackInteraction('ai_question_asked');
    
    try {
      // Supabase Edge Function çağrısı
      const { data, error } = await supabase.functions.invoke('ask-ai', {
        body: { 
          question: question.trim()
        }
      });

      if (error) {
        throw new Error(`Edge Function Error: ${error.message}`);
      }

      if (data?.answer) {
        // AI yanıtını kullanıcının diline çevir
        const translatedAnswer = await translateContent(data.answer);
        setAiResponse(translatedAnswer);
        setResponseCount(prev => prev + 1);
        
        if (data.source === 'hybrid') {
          toast.success("AI + Wolfram hibrit hesaplama tamamlandı! ✅");
        } else if (data.source === 'gemini') {
          toast.success("Gemini AI'dan yanıt alındı!");
        } else {
          toast.success("Yanıt alındı");
        }
      } else {
        throw new Error('Boş yanıt alındı');
      }
    } catch (error) {
      console.error('AI Error:', error);
      toast.error("AI'ya bağlanamadı. Lütfen tekrar deneyin.");
      
      // Fallback yerel yanıtlar
      const localAnswers = {
        "trim": `**Trim Hesabı:**

Trim = Ta - Tf (Kıç taslağı - Baş taslağı)

**Trim Açısı:**
θ = arctan(Trim / LPP)

**Boyuna Metasantır:**
GML = KML - KG
MCT1cm = (Δ × GML) / (100 × LPP)

**Değerlendirme:**
- |θ| < 0.5°: Normal
- 0.5° ≤ |θ| < 2.0°: Kabul edilebilir  
- |θ| ≥ 2.0°: Aşırı trim`,

        "gm": `**GM (Metasantır Yüksekliği) Hesabı:**

GM = KM - KG

**Bileşenler:**
- KM = KB + BM (Metasantır mesafesi)
- BM = Iw / ∇ (Metasantır yarıçapı)
- KG = Ağırlık merkezi yüksekliği

**IMO Kriterleri:**
- GM ≥ 0.15m (Minimum)
- 0.15m ≤ GM ≤ 0.35m (Önerilen)
- GM > 0.35m (Aşırı sert)`,

        "stabilite": `**Stabilite Formülleri:**

**Temel:** GM = KM - KG
**Metasantır:** KM = KB + BM  
**Yarıçap:** BM = Iw / ∇

**Kritik Değerler:**
- GM > 0.15m (IMO minimum)
- Pozitif stabilite: GM > 0
- Aşırı stabilite: GM > 0.35m

**Serbest Yüzey Düzeltmesi:**
GM(düzeltilmiş) = GM(katı) - ΣFSC`
      };
      
      const lowerQuestion = question.toLowerCase();
      let localAnswer = "";
      
      Object.keys(localAnswers).forEach(key => {
        if (lowerQuestion.includes(key)) {
          localAnswer = localAnswers[key];
        }
      });
      
      if (localAnswer) {
        const translatedLocalAnswer = await translateContent(localAnswer + "\n\n*Yerel yanıt gösteriliyor.*");
        setAiResponse(translatedLocalAnswer);
        setResponseCount(prev => prev + 1);
      } else {
        const defaultResponse = `**Maritime Mühendisliği AI Asistanı**

Maritime mühendisliği konularında size yardımcı olmaya hazırım! 

Soru örnekleri:
• **Stabilite**: GM, BM, KM hesaplamaları
• **Trim**: Boyuna stabilite, MCT
• **Yükleme**: Kargo dağılımı, balast
• **Hidrostatik**: Taslak, deplasman
• **Sevk**: Direnç, itki, verimlilik
• **Güvenlik**: IMO, SOLAS kriterleri

Detaylı formüller ve örneklerle yanıtlayacağım.`;
        
        const translatedDefaultResponse = await translateContent(defaultResponse);
        setAiResponse(translatedDefaultResponse);
        setResponseCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "GM hesaplama formülü",
    "Trim açısı nasıl bulunur?",
    "Stabilite kriterleri nelerdir?",
    "Büyük daire seyir hesabı",
    "SFOC nasıl hesaplanır?",
    "Balast suyu dağılımı",
    "Metasantır yarıçapı formülü",
    "IMO stabilite standartları"
  ];

  const handleSuggestedQuestion = (suggestion: string) => {
    setQuestion(suggestion);
    trackInteraction('suggested_question_clicked');
  };

  return (
    <MobileLayout>
      {/* Language Selector ve Geri Dönüş */}
      <div className="flex justify-between items-center mb-4 px-1">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-sm">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline" data-translatable>Hesaplayıcıya Dön</span>
            <span className="xs:hidden" data-translatable>Geri</span>
          </Link>
        </Button>
        <AutoLanguageSelector />
      </div>

      {/* Header Section - Mobil optimize */}
      <div className="text-center mb-6 px-2">
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
          <h1 
            className="text-xl sm:text-2xl font-bold text-foreground leading-tight break-words"
            data-translatable
          >
            Asistana Sor
          </h1>
        </div>
        <p 
          className="text-xs sm:text-sm text-muted-foreground px-2 leading-relaxed"
          data-translatable
        >
          Maritime mühendisliği konularında AI asistanınız
        </p>
      </div>

      {/* Üst reklam - Sayfa yüklendiğinde */}
      {shouldShowAd('top-page') && (
        <div className="mb-6">
          <MaritimeSoftwareAd />
        </div>
      )}

      {/* AI Soru-Cevap Bölümü - Mobil optimize */}
      <div className="space-y-3 sm:space-y-4">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <CardTitle className="text-base sm:text-lg leading-tight" data-translatable>
                Maritime AI Asistanı
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm leading-relaxed px-1">
              <span data-translatable>
                Denizcilik hesaplamaları, stabilite, trim, navigasyon ve tüm maritime konularda sorularınızı sorun
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-3 sm:space-y-4">
              <Textarea
                placeholder="Sorunuzu buraya yazın...

Örnek sorular:
• GM nasıl hesaplanır?
• Trim açısı formülü nedir?
• Stabilite kriterleri nelerdir?
• Büyük daire seyir hesabı
• SFOC hesaplama yöntemi
• Balast suyu hesaplamaları"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[120px] sm:min-h-[160px] text-sm resize-none"
                disabled={isLoading}
                data-translatable-placeholder
              />
              
              <Button 
                onClick={askAI}
                disabled={isLoading || !question.trim()}
                className="w-full gap-2 text-sm sm:text-base h-10 sm:h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden xs:inline" data-translatable>AI Düşünüyor...</span>
                    <span className="xs:hidden" data-translatable>Düşünüyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span data-translatable>AI'ya Sor</span>
                  </>
                )}
              </Button>
            </div>

            {aiResponse && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Brain className="w-4 h-4 flex-shrink-0" />
                  <span data-translatable>AI Yanıtı:</span>
                </h4>
                <div className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {aiResponse}
                </div>
              </div>
            )}

            {/* AI yanıt sonrası reklam - Her 2 yanıttan sonra */}
            {aiResponse && responseCount > 0 && responseCount % 2 === 0 && shouldShowAd('after-calculation') && (
              <div className="mt-4 pt-4 border-t">
                <AdBannerInline />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Önerilen Sorular - Mobil optimize */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg" data-translatable>
              Sık Sorulan Konular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {suggestedQuestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto py-2 sm:py-3 px-3 text-xs sm:text-sm leading-relaxed"
                  onClick={() => handleSuggestedQuestion(suggestion)}
                  disabled={isLoading}
                >
                  <span data-translatable>{suggestion}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sayfa sonu reklamı */}
        {shouldShowAd('bottom-page') && (
          <div className="mt-6 pt-4 border-t">
            <NativeAd />
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Formulas;