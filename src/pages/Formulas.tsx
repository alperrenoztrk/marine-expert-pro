import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Brain, ArrowLeft, MessageCircle, Send, Loader2, CheckCircle, AlertTriangle, Lightbulb, Trash2, Printer, Copy, Share2 } from "lucide-react";
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
        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-sm flex items-center"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline" data-translatable>Ana Sayfa</span>
            <span className="xs:hidden" data-translatable>Geri</span>
          </Link>
        </Button>
      </div>

      {/* Header Section - Mobil optimize */}
      <div className="text-center mb-6 px-2">
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
          <h1 
            className="text-xl sm:text-2xl font-bold text-foreground leading-tight break-words nature-title"
            data-translatable
          >
            Mark'a Sor
          </h1>
        </div>
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
        <Card className="shadow-[var(--shadow-card)]">
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
              <div className="mt-6">
                <div style={{
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
                  border: '2px solid #3b82f6',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(40px)'
                  }}></div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          padding: '10px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Brain style={{ width: '24px', height: '24px', color: '#2563eb' }} />
                        </div>
                        <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
                          AI Yanıtı
                        </h4>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(aiResponse);
                            toast.success("Yanıt kopyalandı!");
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title="Kopyala"
                        >
                          <Copy style={{ width: '18px', height: '18px', color: '#2563eb' }} />
                        </button>
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            if (printWindow) {
                              printWindow.document.write(`
                                <html>
                                  <head>
                                    <title>AI Yanıtı - Maritime Calculator</title>
                                    <style>
                                      body { font-family: system-ui; padding: 40px; max-width: 800px; margin: 0 auto; }
                                      h1 { color: #0066cc; }
                                      .question { background: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                                      .answer { line-height: 1.6; }
                                      @media print { body { padding: 20px; } }
                                    </style>
                                  </head>
                                  <body>
                                    <h1>Maritime Calculator - AI Yanıtı</h1>
                                    <div class="question">
                                      <strong>Soru:</strong> ${question}
                                    </div>
                                    <div class="answer">
                                      ${aiResponse.replace(/\n/g, '<br>')}
                                    </div>
                                    <hr style="margin-top: 40px;">
                                    <p style="text-align: center; color: #666; font-size: 12px;">
                                      ${new Date().toLocaleString('tr-TR')} - Maritime Calculator
                                    </p>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                              printWindow.print();
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title="Yazdır"
                        >
                          <Printer style={{ width: '18px', height: '18px', color: '#2563eb' }} />
                        </button>
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'Maritime Calculator - AI Yanıtı',
                                text: `Soru: ${question}\n\nCevap: ${aiResponse}`
                              }).catch(() => {});
                            } else {
                              navigator.clipboard.writeText(`Soru: ${question}\n\nCevap: ${aiResponse}`);
                              toast.success("Paylaşım metni kopyalandı!");
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title="Paylaş"
                        >
                          <Share2 style={{ width: '18px', height: '18px', color: '#2563eb' }} />
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#1f2937' }}>
                      {aiResponse.split('\n').map((line, index) => {
                        // Başlıkları vurgula
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <h3 key={index} style={{ 
                              fontSize: '18px', 
                              fontWeight: 'bold', 
                              color: '#1e40af', 
                              marginTop: '16px', 
                              marginBottom: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{ 
                                width: '4px', 
                                height: '20px', 
                                background: '#3b82f6', 
                                borderRadius: '2px' 
                              }}></span>
                              {line.replace(/\*\*/g, '')}
                            </h3>
                          );
                        }
                        
                        // Alt başlıklar (bold text)
                        if (line.includes('**') && !line.startsWith('**')) {
                          const parts = line.split('**');
                          return (
                            <p key={index} className="mb-2">
                              {parts.map((part, i) => 
                                i % 2 === 1 ? <strong key={i} className="text-primary font-semibold">{part}</strong> : part
                              )}
                            </p>
                          );
                        }
                        
                        // Liste elemanları
                        if (line.startsWith('- ') || line.startsWith('• ')) {
                          return (
                            <div key={index} className="flex items-start gap-2 ml-2">
                              <span className="text-primary mt-1.5">•</span>
                              <span className="flex-1">{line.substring(2)}</span>
                            </div>
                          );
                        }
                        
                        // Numaralı liste
                        if (/^\d+\./.test(line)) {
                          const [num, ...content] = line.split('.');
                          return (
                            <div key={index} className="flex items-start gap-3 ml-2">
                              <span className="text-primary font-semibold min-w-[20px]">{num}.</span>
                              <span className="flex-1">{content.join('.').trim()}</span>
                            </div>
                          );
                        }
                        
                        // Kod blokları (backtick ile)
                        if (line.includes('`')) {
                          const parts = line.split('`');
                          return (
                            <p key={index} className="mb-2">
                              {parts.map((part, i) => 
                                 i % 2 === 1 ? (
                                   <code key={i} className="bg-card border border-primary/20 px-2 py-1 rounded text-sm font-mono text-card-foreground">
                                     {part}
                                   </code>
                                 ) : part
                              )}
                            </p>
                          );
                        }
                        
                        // Formül satırları (= içeren)
                        if (line.includes('=') && (line.includes('×') || line.includes('+') || line.includes('-') || line.includes('/'))) {
                          return (
                            <div key={index} className="bg-card border-2 border-primary/30 p-3 rounded-lg font-mono text-sm shadow-sm">
                              <code className="text-card-foreground">{line}</code>
                            </div>
                          );
                        }
                        
                        // Normal paragraf
                        if (line.trim()) {
                          return (
                            <p key={index} className="mb-2">
                              {line}
                            </p>
                          );
                        }
                        
                        return <div key={index} className="h-2"></div>;
                      })}
                    </div>
                  </div>
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
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {conversationHistory.slice(-5).map((item, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-3 border border-primary/10 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-primary mt-0.5" />
                      <div className="text-sm font-medium text-primary flex-1">
                        {item.question}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="text-xs text-muted-foreground line-clamp-3 flex-1">
                        {item.answer.replace(/\*\*/g, '').replace(/\n/g, ' ')}
                      </div>
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