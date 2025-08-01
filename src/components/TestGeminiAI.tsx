import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const TestGeminiAI = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testLocalGemini = async () => {
    if (!question.trim()) {
      toast.error("Lütfen bir soru yazın");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate Gemini API response for testing
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call delay
      
      const mockResponses = {
        "gm": `**GM (Metasantrik Yükseklik) Hesaplaması:**

GM = KM - KG

**Açıklama:**
- GM: Metasantrik yükseklik (m)
- KM: Metasantır mesafesi (m) 
- KG: Ağırlık merkezi yüksekliği (m)

**Maritime Önemi:**
GM, geminin kararlılığını belirleyen kritik parametredir. Pozitif GM değeri geminin dengeli olduğunu gösterir.

**IMO Kriterleri:**
- GM ≥ 0.15m (Minimum)
- 0.15m ≤ GM ≤ 0.35m (Önerilen)
- GM > 0.35m (Aşırı sert)

*Bu yerel yanıt simülasyonudur. Gerçek Gemini API entegrasyonu için API anahtarı gerekiyor.*`,

        "stabilite": `**Gemi Stabilitesi Hesaplamaları:**

**Temel Formüller:**
1. GM = KM - KG (Metasantrik yükseklik)
2. GZ = GM × sin(φ) (Doğrultucu kol - küçük açılar)
3. BM = I / ∇ (Metasantrik yarıçap)

**Stabilite Kriterleri:**
- Pozitif GM gerekli
- IMO standartlarına uyum
- GZ eğrisi analizi

**Pratik Uygulama:**
Maritime mühendisliğinde gemi güvenliği için kritik hesaplamalardır.`,

        "default": `**Maritime Mühendisliği AI Asistanı**

Denizcilik hesaplamaları hakkında soru sorabilirsiniz:

📊 **Hesaplama Konuları:**
• Stabilite (GM, GZ, BM hesaplamaları)
• Trim ve List hesaplamaları  
• Navigasyon hesaplamaları
• Hidrodinamik analiz
• Yapısal hesaplamalar

🤖 **AI Özellikler:**
• Detaylı formül açıklamaları
• IMO standartları referansı
• Pratik örnekler
• Türkçe dil desteği

*Test modu: Gerçek Gemini API entegrasyonu için geçerli API anahtarı gerekiyor.*`
      };

      const lowerQuestion = question.toLowerCase();
      let answer = "";
      
      if (lowerQuestion.includes("gm") || lowerQuestion.includes("metasantrik")) {
        answer = mockResponses.gm;
      } else if (lowerQuestion.includes("stabilite") || lowerQuestion.includes("kararlılık")) {
        answer = mockResponses.stabilite;
      } else {
        answer = mockResponses.default;
      }

      setResponse(answer);
      toast.success("Test yanıtı oluşturuldu!");
      
    } catch (error) {
      console.error('Test error:', error);
      toast.error("Test sırasında hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Gemini AI Test Modu
        </CardTitle>
        <CardDescription>
          Maritime AI asistanını test edin (simülasyon modu)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Textarea
            placeholder="Maritime mühendisliği sorusu yazın...

Örnek sorular:
• GM hesaplaması nedir?
• Stabilite kriterleri nelerdir?
• Trim hesabı nasıl yapılır?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[120px]"
            disabled={isLoading}
          />
          
          <Button 
            onClick={testLocalGemini}
            disabled={isLoading || !question.trim()}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI Düşünüyor...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Test AI Yanıtı
              </>
            )}
          </Button>
        </div>

        {response && (
          <Card className="bg-info-muted border-info/20">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-info-muted-foreground mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Test Yanıtı:
              </h4>
              <div className="text-sm text-info-muted-foreground whitespace-pre-wrap leading-relaxed">
                {response}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded p-3">
          <strong>⚠️ Test Modu:</strong> Bu simülasyon modudur. Gerçek Gemini API için:
          <br />
          1. <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-info underline">Google AI Studio</a>'dan API anahtarı alın
          <br />
          2. Lovable Environment Variables'a GEMINI_API_KEY ekleyin
          <br />
          3. Supabase Edge Function deploy edin
        </div>
      </CardContent>
    </Card>
  );
};