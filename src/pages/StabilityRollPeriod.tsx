import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BarChart3, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityRollPeriodPage(){
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    breadth: "",
    gmCorr: "",
    radiusOfGyration: "",
    measuredPeriod: ""
  });
  
  const [result, setResult] = useState<{
    calculatedPeriod: number;
    gmFromPeriod: number;
    assessment: string;
    naturalFrequency: number;
  } | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/stability/transverse');
  };

  const calculateRollPeriod = () => {
    const B = parseFloat(inputs.breadth); // m
    const gmCorr = parseFloat(inputs.gmCorr); // m
    const k = parseFloat(inputs.radiusOfGyration) || 0.35 * B; // m (default k ≈ 0.35B)
    const measuredT = parseFloat(inputs.measuredPeriod) || 0; // s

    if (isNaN(B) || isNaN(gmCorr)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }

    if (gmCorr <= 0) {
      toast({ title: "Hata", description: "GM_corr pozitif olmalıdır", variant: "destructive" });
      return;
    }

    // Yalpa periyodu: T = 2π × k / √(g × GM_corr)
    const calculatedPeriod = 2 * Math.PI * k / Math.sqrt(9.81 * gmCorr);
    
    // Doğal frekans: f = 1/T
    const naturalFrequency = 1 / calculatedPeriod;
    
    // Ölçülen periyottan GM hesaplama (eğer verilmişse)
    let gmFromPeriod = 0;
    if (measuredT > 0) {
      gmFromPeriod = Math.pow((2 * Math.PI * k) / measuredT, 2) / 9.81;
    }
    
    // Değerlendirme
    let assessment = "";
    if (calculatedPeriod < 8) {
      assessment = "Hızlı yalpa - rahatsız edici";
    } else if (calculatedPeriod < 12) {
      assessment = "Normal yalpa periyodu";
    } else if (calculatedPeriod < 16) {
      assessment = "Yavaş yalpa - dikkatli olun";
    } else {
      assessment = "Çok yavaş yalpa - tehlikeli olabilir";
    }

    setResult({ calculatedPeriod, gmFromPeriod, assessment, naturalFrequency });
    toast({ 
      title: "Yalpa Periyodu Hesaplandı", 
      description: `T: ${calculatedPeriod.toFixed(2)} saniye - ${assessment}` 
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Yalpa Periyodu Hesaplama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Yalpa Periyodu ve GM İlişkisi</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Gemi yalpa periyodu ile GM değeri arasındaki ilişkiyi hesaplar.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="breadth">Genişlik (B) [m]</Label>
                <Input
                  id="breadth"
                  type="number"
                  placeholder="20"
                  value={inputs.breadth}
                  onChange={(e) => setInputs(prev => ({ ...prev, breadth: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="gmcorr">GM_corr [m]</Label>
                <Input
                  id="gmcorr"
                  type="number"
                  placeholder="1.1"
                  value={inputs.gmCorr}
                  onChange={(e) => setInputs(prev => ({ ...prev, gmCorr: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Serbest yüzey düzeltmeli GM</p>
              </div>
              
              <div>
                <Label htmlFor="radius-gyration">Atalet Yarıçapı (k) [m]</Label>
                <Input
                  id="radius-gyration"
                  type="number"
                  placeholder="Otomatik (0.35×B)"
                  value={inputs.radiusOfGyration}
                  onChange={(e) => setInputs(prev => ({ ...prev, radiusOfGyration: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Boş bırakılırsa k=0.35×B kullanılır</p>
              </div>
              
              <div>
                <Label htmlFor="measured-period">Ölçülen Periyot (T) [s] (opsiyonel)</Label>
                <Input
                  id="measured-period"
                  type="number"
                  placeholder="10"
                  value={inputs.measuredPeriod}
                  onChange={(e) => setInputs(prev => ({ ...prev, measuredPeriod: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">GM hesaplamak için kullanılır</p>
              </div>
            </div>
            
            <Button onClick={calculateRollPeriod} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              Yalpa Periyodu Hesapla
            </Button>
          </div>

          {result && (
            <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Hesaplama Sonuçları</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{result.calculatedPeriod.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Yalpa Periyodu [s]</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.naturalFrequency.toFixed(3)}</div>
                  <div className="text-sm text-gray-600">Doğal Frekans [Hz]</div>
                </div>
                {result.gmFromPeriod > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{result.gmFromPeriod.toFixed(3)}</div>
                    <div className="text-sm text-gray-600">GM (Periyottan) [m]</div>
                  </div>
                )}
                <div className="text-center">
                  <div className={`text-lg font-bold ${result.calculatedPeriod < 12 ? 'text-green-600' : result.calculatedPeriod < 16 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {result.assessment}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-blue-500">
                <h5 className="font-medium mb-2">Formüller:</h5>
                <div className="text-sm space-y-1">
                  <div><strong>T = 2π × k / √(g × GM_corr)</strong> [s]</div>
                  <div><strong>f = 1/T</strong> [Hz]</div>
                  {result.gmFromPeriod > 0 && (
                    <div><strong>GM = (2π × k / T)² / g</strong> [m]</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Yalpa Periyodu Değerlendirme</h4>
            <div className="text-sm space-y-2">
              <div><strong>T &lt; 8 saniye:</strong> Hızlı yalpa - rahatsız edici, deniz tutması</div>
              <div><strong>T 8-12 saniye:</strong> Normal yalpa periyodu - kabul edilebilir</div>
              <div><strong>T 12-16 saniye:</strong> Yavaş yalpa - dikkatli olun</div>
              <div><strong>T &gt; 16 saniye:</strong> Çok yavaş yalpa - tehlikeli olabilir</div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Atalet Yarıçapı (k) Tahminleri</h4>
            <div className="text-sm space-y-1">
              <div><strong>Küçük tekne:</strong> k ≈ 0.30 × B</div>
              <div><strong>Orta boy gemi:</strong> k ≈ 0.35 × B</div>
              <div><strong>Büyük gemi:</strong> k ≈ 0.40 × B</div>
              <div><strong>Yolcu gemisi:</strong> k ≈ 0.45 × B</div>
              <div><strong>Konteyner gemisi:</strong> k ≈ 0.50 × B</div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Pratik Örnekler</h4>
            <div className="text-sm space-y-2">
              <div><strong>Yat (B=8m, GM=0.8m):</strong> T ≈ 8.5 saniye</div>
              <div><strong>Feribot (B=20m, GM=1.2m):</strong> T ≈ 12.5 saniye</div>
              <div><strong>Kargo gemisi (B=32m, GM=1.5m):</strong> T ≈ 15.8 saniye</div>
              <div><strong>Kruvaziyer (B=40m, GM=2.0m):</strong> T ≈ 14.2 saniye</div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-red-700">Dikkat Edilecek Noktalar</h4>
            <div className="text-sm space-y-1 text-red-600">
              <div>• Çok hızlı yalpa deniz tutmasına neden olur</div>
              <div>• Çok yavaş yalpa tehlikeli olabilir</div>
              <div>• Serbest yüzey etkisi yalpa periyodunu etkiler</div>
              <div>• Yalpa periyodu GM ile ters orantılıdır</div>
              <div>• Ölçüm sırasında gemi düz olmalıdır</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stabilite Asistanı */}
      <div className="mt-6">
        <StabilityAssistantPopup />
      </div>
    </div>
  );
}