import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityInclinationTestPage(){
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    testWeight: "",
    shiftDistance: "",
    displacement: "",
    observedAngle: ""
  });
  
  const [result, setResult] = useState<{
    gmt: number;
    rightingMoment: number;
    stabilityAssessment: string;
  } | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/stability/transverse');
  };

  const calculateInclinationTest = () => {
    const w = parseFloat(inputs.testWeight); // ton
    const l = parseFloat(inputs.shiftDistance); // m
    const Delta = parseFloat(inputs.displacement); // ton
    const phi = parseFloat(inputs.observedAngle); // degrees

    if (isNaN(w) || isNaN(l) || isNaN(Delta) || isNaN(phi)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }

    if (Delta <= 0) {
      toast({ title: "Hata", description: "Deplasman pozitif olmalıdır", variant: "destructive" });
      return;
    }

    if (phi <= 0) {
      toast({ title: "Hata", description: "Gözlenen açı pozitif olmalıdır", variant: "destructive" });
      return;
    }

    // GM hesaplama: GM_T = w*l/(Δ*tan φ)
    const phiRad = (phi * Math.PI) / 180;
    const gmt = (w * l) / (Delta * Math.tan(phiRad));
    
    // Sağlama momenti: RM = Δ * g * GM_T * sin φ
    const rightingMoment = Delta * 1000 * 9.81 * gmt * Math.sin(phiRad);
    
    // Stabilite değerlendirmesi
    let stabilityAssessment = "";
    if (gmt > 0.5) {
      stabilityAssessment = "Mükemmel stabilite";
    } else if (gmt > 0.3) {
      stabilityAssessment = "İyi stabilite";
    } else if (gmt > 0.15) {
      stabilityAssessment = "Kabul edilebilir stabilite";
    } else if (gmt > 0) {
      stabilityAssessment = "Zayıf stabilite - dikkatli olun";
    } else {
      stabilityAssessment = "Tehlikeli - negatif stabilite";
    }

    setResult({ gmt, rightingMoment, stabilityAssessment });
    toast({ 
      title: "İnklinasyon Deneyi Sonucu", 
      description: `GM_T: ${gmt.toFixed(3)} m - ${stabilityAssessment}` 
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
            <Shield className="h-5 w-5" />
            İnklinasyon Deneyi Hesaplama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">İnklinasyon Deneyi</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Bilinen ağırlık şifti ile gemi GM değerini ölçmek için kullanılan deney.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test-weight">Test Ağırlığı (w) [ton]</Label>
                <Input
                  id="test-weight"
                  type="number"
                  placeholder="5"
                  value={inputs.testWeight}
                  onChange={(e) => setInputs(prev => ({ ...prev, testWeight: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Genellikle 2-10 ton arası</p>
              </div>
              
              <div>
                <Label htmlFor="shift-distance">Şift Mesafesi (l) [m]</Label>
                <Input
                  id="shift-distance"
                  type="number"
                  placeholder="8"
                  value={inputs.shiftDistance}
                  onChange={(e) => setInputs(prev => ({ ...prev, shiftDistance: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Sancak-iskele arası mesafe</p>
              </div>
              
              <div>
                <Label htmlFor="displacement">Deplasman (Δ) [ton]</Label>
                <Input
                  id="displacement"
                  type="number"
                  placeholder="3500"
                  value={inputs.displacement}
                  onChange={(e) => setInputs(prev => ({ ...prev, displacement: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="observed-angle">Gözlenen Açı (φ) [°]</Label>
                <Input
                  id="observed-angle"
                  type="number"
                  placeholder="2.5"
                  value={inputs.observedAngle}
                  onChange={(e) => setInputs(prev => ({ ...prev, observedAngle: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Pendulum veya clinometer ile ölçülen</p>
              </div>
            </div>
            
            <Button onClick={calculateInclinationTest} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              GM Ölç (İnklinasyon)
            </Button>
          </div>

          {result && (
            <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Deney Sonuçları</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{result.gmt.toFixed(3)}</div>
                  <div className="text-sm text-gray-600">GM_T [m]</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{(result.rightingMoment/1000).toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Sağlama Momenti [kN·m]</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${result.gmt > 0.15 ? 'text-green-600' : result.gmt > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {result.stabilityAssessment}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-blue-500">
                <h5 className="font-medium mb-2">Formül:</h5>
                <div className="text-sm">
                  <div><strong>GM_T = w × l / (Δ × tan φ)</strong></div>
                  <div className="text-xs mt-1 text-gray-500">
                    Bu formül küçük açılar için geçerlidir (φ &lt; 10°)
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">İnklinasyon Deneyi Prosedürü</h4>
            <div className="text-sm space-y-2">
              <div><strong>1. Hazırlık:</strong> Gemi düz, rüzgarsız hava, sakin su</div>
              <div><strong>2. Ağırlık:</strong> Bilinen ağırlık gemi merkezinde</div>
              <div><strong>3. Ölçüm:</strong> Ağırlık şift edilir, açı ölçülür</div>
              <div><strong>4. Hesaplama:</strong> GM = w×l/(Δ×tan φ)</div>
              <div><strong>5. Doğrulama:</strong> Birden fazla ölçüm yapın</div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">GM Değerlendirme Kriterleri</h4>
            <div className="text-sm space-y-1">
              <div><strong>GM &gt; 0.5 m:</strong> Mükemmel stabilite</div>
              <div><strong>GM 0.3-0.5 m:</strong> İyi stabilite</div>
              <div><strong>GM 0.15-0.3 m:</strong> Kabul edilebilir stabilite</div>
              <div><strong>GM 0-0.15 m:</strong> Zayıf stabilite</div>
              <div><strong>GM &lt; 0 m:</strong> Tehlikeli - negatif stabilite</div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-red-700">Dikkat Edilecek Noktalar</h4>
            <div className="text-sm space-y-1 text-red-600">
              <div>• Deney sırasında gemi hareket etmemelidir</div>
              <div>• Rüzgar ve akıntı etkisi minimum olmalıdır</div>
              <div>• Tanklarda serbest yüzey olmamalıdır</div>
              <div>• Açı ölçümü hassas olmalıdır (±0.1°)</div>
              <div>• Birden fazla ölçüm yaparak doğrulayın</div>
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