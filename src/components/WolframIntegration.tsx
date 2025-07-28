import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Loader2, CheckCircle, AlertTriangle, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export const WolframIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [values, setValues] = useState({
    length: "",
    beam: "",
    draft: "",
    displacement: "",
    km: "",
    kg: "",
    gm: ""
  });

  // Wolfram API Key
  const WOLFRAM_API_KEY = 'G3KTLV-GL5URGJ7YG';

  const testWolframConnection = async () => {
    setIsLoading(true);
    try {
      const testQuery = "2+2";
      const response = await fetch(`https://api.wolframalpha.com/v2/query?appid=${WOLFRAM_API_KEY}&input=${encodeURIComponent(testQuery)}&format=plaintext&output=json`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.queryresult && data.queryresult.success) {
          toast.success("🧮 Wolfram Alpha bağlantısı başarılı!");
          return true;
        }
      }
      throw new Error('API test failed');
    } catch (error) {
      console.error('Wolfram test failed:', error);
      toast.error("Wolfram Alpha bağlantısı başarısız");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDisplacement = async () => {
    if (!values.length || !values.beam || !values.draft) {
      toast.error("Lütfen uzunluk, genişlik ve taslak değerlerini girin");
      return;
    }

    setIsLoading(true);
    try {
      const query = `${values.length} * ${values.beam} * ${values.draft} * 0.7 * 1.025`;
      const response = await fetch(`https://api.wolframalpha.com/v2/query?appid=${WOLFRAM_API_KEY}&input=${encodeURIComponent(query)}&format=plaintext&output=json`);
      
      if (!response.ok) {
        throw new Error(`Wolfram API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.queryresult && data.queryresult.pods) {
        const resultPod = data.queryresult.pods.find(pod => 
          pod.id === 'Result' || pod.title === 'Result' || pod.primary
        );
        
        if (resultPod && resultPod.subpods && resultPod.subpods[0]) {
          const calculation = resultPod.subpods[0].plaintext;
          setResult(`**Deplasman Hesabı:**

**Formül:** Δ = L × B × T × Cb × ρ
- **L**: ${values.length}m (uzunluk)
- **B**: ${values.beam}m (genişlik) 
- **T**: ${values.draft}m (taslak)
- **Cb**: 0.7 (blok katsayısı)
- **ρ**: 1.025 t/m³ (deniz suyu yoğunluğu)

**Wolfram Sonucu:** ${calculation}

*🧮 Wolfram Alpha ile hesaplandı*`);
          toast.success("✅ Deplasman hesabı tamamlandı!");
        } else {
          throw new Error('No calculation result found');
        }
      } else {
        throw new Error('Invalid Wolfram response');
      }
    } catch (error) {
      console.error('Wolfram calculation error:', error);
      toast.error("Hesaplama hatası: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateGM = async () => {
    if (!values.km || !values.kg) {
      toast.error("Lütfen KM ve KG değerlerini girin");
      return;
    }

    setIsLoading(true);
    try {
      const query = `${values.km} - ${values.kg}`;
      const response = await fetch(`https://api.wolframalpha.com/v2/query?appid=${WOLFRAM_API_KEY}&input=${encodeURIComponent(query)}&format=plaintext&output=json`);
      
      if (!response.ok) {
        throw new Error(`Wolfram API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.queryresult && data.queryresult.pods) {
        const resultPod = data.queryresult.pods.find(pod => 
          pod.id === 'Result' || pod.title === 'Result' || pod.primary
        );
        
        if (resultPod && resultPod.subpods && resultPod.subpods[0]) {
          const calculation = resultPod.subpods[0].plaintext;
          const gmValue = parseFloat(calculation);
          
          let stability = "";
          if (gmValue < 0.15) {
            stability = "⚠️ **TEHLİKELİ** - Stabilite yetersiz";
          } else if (gmValue <= 0.35) {
            stability = "✅ **İDEAL** - Güvenli stabilite";
          } else {
            stability = "⚡ **AŞIRI SERT** - Konfor problemi";
          }
          
          setResult(`**GM (Metasantrik Yükseklik) Hesabı:**

**Formül:** GM = KM - KG
- **KM**: ${values.km}m (metasantır mesafesi)
- **KG**: ${values.kg}m (ağırlık merkezi yüksekliği)

**Wolfram Sonucu:** GM = ${calculation}m

**Değerlendirme:** ${stability}

**IMO Kriterleri:**
- Minimum: GM ≥ 0.15m
- Optimal: 0.15m ≤ GM ≤ 0.35m
- Aşırı sert: GM > 0.35m

*🧮 Wolfram Alpha ile hesaplandı*`);
          toast.success("✅ GM hesabı tamamlandı!");
        } else {
          throw new Error('No calculation result found');
        }
      } else {
        throw new Error('Invalid Wolfram response');
      }
    } catch (error) {
      console.error('Wolfram calculation error:', error);
      toast.error("Hesaplama hatası: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setValues({
      length: "",
      beam: "",
      draft: "",
      displacement: "",
      km: "",
      kg: "",
      gm: ""
    });
    setResult("");
  };

  return (
    <Card className="shadow-lg border-l-4 border-l-orange-500 mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-orange-600" />
            <div>
              <CardTitle className="text-xl text-orange-800">Wolfram Alpha Maritime Calculator</CardTitle>
              <CardDescription className="text-sm">
                Gelişmiş matematik motoru ile maritime hesaplamalar
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={testWolframConnection}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Test API
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Deplasman Hesabı */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Deplasman Hesabı
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Uzunluk (L) - metre</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                placeholder="200"
                value={values.length}
                onChange={(e) => setValues({...values, length: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="beam">Genişlik (B) - metre</Label>
              <Input
                id="beam"
                type="number"
                step="0.1"
                placeholder="32"
                value={values.beam}
                onChange={(e) => setValues({...values, beam: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="draft">Taslak (T) - metre</Label>
              <Input
                id="draft"
                type="number"
                step="0.1"
                placeholder="12"
                value={values.draft}
                onChange={(e) => setValues({...values, draft: e.target.value})}
              />
            </div>
          </div>
          
          <Button 
            onClick={calculateDisplacement}
            disabled={isLoading || !values.length || !values.beam || !values.draft}
            className="w-full gap-2 bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Hesaplanıyor...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                Deplasman Hesapla
              </>
            )}
          </Button>
        </div>

        {/* GM Hesabı */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            GM (Stabilite) Hesabı
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="km">KM (Metasantır Mesafesi) - metre</Label>
              <Input
                id="km"
                type="number"
                step="0.01"
                placeholder="15.2"
                value={values.km}
                onChange={(e) => setValues({...values, km: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kg">KG (Ağırlık Merkezi) - metre</Label>
              <Input
                id="kg"
                type="number"
                step="0.01"
                placeholder="14.8"
                value={values.kg}
                onChange={(e) => setValues({...values, kg: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={calculateGM}
              disabled={isLoading || !values.km || !values.kg}
              className="flex-1 gap-2 bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Hesaplanıyor...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  GM Hesapla
                </>
              )}
            </Button>
            
            <Button 
              onClick={clearForm}
              variant="outline"
              className="gap-2"
            >
              Temizle
            </Button>
          </div>
        </div>

        {/* Sonuçlar */}
        {result && (
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-l-4 border-l-orange-400">
            <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Wolfram Alpha Sonucu:
            </h4>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-orange-50 p-3 rounded">
          <strong>📊 Wolfram Alpha API:</strong> G3KTLV-GL5URGJ7YG<br />
          <strong>🔗 Endpoint:</strong> https://api.wolframalpha.com/v2/query<br />
          <strong>✨ Özellikler:</strong> Gelişmiş matematik, sembolik hesaplama, doğrulama
        </div>
      </CardContent>
    </Card>
  );
};