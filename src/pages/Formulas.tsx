import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Brain, ArrowLeft, MessageCircle, Send, Loader2, CheckCircle, AlertTriangle, Lightbulb, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AutoLanguageSelector } from "@/components/AutoLanguageSelector";
import { useAutoLanguageDetection } from "@/hooks/useAutoLanguageDetection";
import { useAdManager } from "@/hooks/useAdManager";
import { AdBannerInline } from "@/components/ads/AdBanner";
import { NativeAd, MaritimeSoftwareAd } from "@/components/ads/NativeAd";
import { UnifiedMaritimeAssistant } from "@/components/UnifiedMaritimeAssistant";

const Formulas = () => {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [geminiApiStatus, setGeminiApiStatus] = useState<'unknown' | 'working' | 'error'>('unknown');
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string}>>([]);
  const { translateContent } = useAutoLanguageDetection();
  const { shouldShowAd, trackInteraction } = useAdManager();

  // localStorage'dan konuşma geçmişini yükle
  useEffect(() => {
    const savedHistory = localStorage.getItem('aiConversationHistory');
    if (savedHistory) {
      try {
        setConversationHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load conversation history:', e);
      }
    }
  }, []);

  // Konuşma geçmişi değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (conversationHistory.length > 0) {
      localStorage.setItem('aiConversationHistory', JSON.stringify(conversationHistory));
    }
  }, [conversationHistory]);

  // Check Gemini API status on mount
  useEffect(() => {
    checkGeminiApiStatus();
  }, []);

  const checkGeminiApiStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ask-ai', {
        body: { question: "test" }
      });
      
      if (error) {
        setGeminiApiStatus('error');
      } else if (data?.source === 'gemini' || data?.source === 'hybrid') {
        setGeminiApiStatus('working');
      } else {
        setGeminiApiStatus('error');
      }
    } catch (error) {
      setGeminiApiStatus('error');
    }
  };

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
          question: question.trim(),
          conversationHistory: conversationHistory // Konuşma geçmişini gönder
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
        
        // Konuşma geçmişine ekle
        setConversationHistory(prev => [...prev, {
          question: question.trim(),
          answer: translatedAnswer
        }]);
        
        // Update API status based on response
        if (data.source === 'gemini' || data.source === 'hybrid') {
          setGeminiApiStatus('working');
        }
        
        toast.success("AI yanıtı alındı!");
        setQuestion(""); // Soruyu temizle
      } else {
        throw new Error("AI yanıtı alınamadı");
      }
    } catch (error) {
      console.error("AI soru-cevap hatası:", error);
      setGeminiApiStatus('error');
      toast.error(`AI hatası: ${error.message}`);
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

      {/* Unified Maritime Assistant */}
      <UnifiedMaritimeAssistant />

      {/* Legacy Gemini Section - Hidden */}
      <div className="space-y-3 sm:space-y-4 hidden">
        <Card className="shadow-[var(--shadow-card)] border-l-4 border-l-primary/20">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <CardTitle className="text-base sm:text-lg leading-tight" data-translatable>
                  Gemini AI Asistanı (Gelişmiş)
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {geminiApiStatus === 'working' && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Aktif</span>
                  </div>
                )}
                {geminiApiStatus === 'error' && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-medium">API Key Gerekli</span>
                  </div>
                )}
              </div>
            </div>
            <CardDescription className="text-xs sm:text-sm leading-relaxed px-1">
              <span data-translatable>
                {geminiApiStatus === 'working' 
                  ? "Google Gemini AI ile gelişmiş maritime mühendisliği analizi."
                  : "Lovable Environment Variables'da GEMINI_API_KEY ekleyin."
                }
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

        {/* Konuşma Geçmişi */}
        {conversationHistory.length > 0 && (
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <span data-translatable>Konuşma Geçmişi</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setConversationHistory([]);
                  localStorage.removeItem('aiConversationHistory');
                  toast.success("Konuşma geçmişi temizlendi");
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {conversationHistory.slice(-5).map((item, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-3">
                    <div className="text-sm font-medium text-primary">
                      Soru: {item.question}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
              {conversationHistory.length > 5 && (
                <div className="mt-3 text-xs text-muted-foreground text-center">
                  Son 5 konuşma gösteriliyor
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Önerilen Sorular - Mobil optimize */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span data-translatable>Örnek Sorular</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Sayısal Sorular:</h4>
                <div className="grid gap-1">
                  <button 
                    onClick={() => setQuestion("100 metre boyunda, 20 metre genişliğinde ve 8 metre su çekimi olan bir geminin deplasmanını hesapla")}
                    className="text-left text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    • Deplasman hesaplama
                  </button>
                  <button 
                    onClick={() => setQuestion("50 knot hızı km/saat cinsinden nedir?")}
                    className="text-left text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    • Birim dönüşümü
                  </button>
                  <button 
                    onClick={() => setQuestion("5 metre yüksekliğindeki dalganın periyodu nedir?")}
                    className="text-left text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    • Dalga hesaplaması
                  </button>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Denizcilik Soruları:</h4>
                <div className="grid gap-1">
                  <button 
                    onClick={() => setQuestion("COLREG Kural 13 ne der?")}
                    className="text-left text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    • COLREG kuralları
                  </button>
                  <button 
                    onClick={() => setQuestion("MARPOL Annex VI emisyon limitleri nedir?")}
                    className="text-left text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    • MARPOL gereksinimleri
                  </button>
                  <button 
                    onClick={() => setQuestion("Beaufort 7 rüzgar hızı ve dalga yüksekliği?")}
                    className="text-left text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    • Meteoroloji
                  </button>
                  <button 
                    onClick={() => setQuestion("IMDG Kod Sınıf 3 tehlikeli yükler nelerdir?")}
                    className="text-left text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    • Tehlikeli yük
                  </button>
                  <button 
                    onClick={() => setQuestion("VHF kanal 16'nın kullanım amacı nedir?")}
                    className="text-left text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    • Haberleşme
                  </button>
                  <button 
                    onClick={() => setQuestion("Pilot merdiveni gereksinimleri nelerdir?")}
                    className="text-left text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    • Operasyonel güvenlik
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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