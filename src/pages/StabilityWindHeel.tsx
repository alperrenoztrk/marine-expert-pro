import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wind, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityWindHeelPage(){
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    windPressure: "",
    lateralArea: "",
    leverArm: "",
    displacement: "",
    gm: ""
  });
  
  const [result, setResult] = useState<{
    heelingMoment: number;
    heelingArm: number;
    heelAngle: number;
  } | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/stability/transverse');
  };

  const calculateWindHeel = () => {
    const q = parseFloat(inputs.windPressure); // Pa
    const A = parseFloat(inputs.lateralArea); // m²
    const z = parseFloat(inputs.leverArm); // m
    const Delta = parseFloat(inputs.displacement); // ton
    const GM = parseFloat(inputs.gm); // m

    if (isNaN(q) || isNaN(A) || isNaN(z) || isNaN(Delta) || isNaN(GM)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }

    if (GM <= 0) {
      toast({ title: "Hata", description: "GM pozitif olmalıdır", variant: "destructive" });
      return;
    }

    // Rüzgar heeling momenti: M_wind = q * A * z / 1000 (kN·m)
    const heelingMoment = (q * A * z) / 1000;
    
    // Heeling arm: h_wind = M_wind / (Δ * g)
    const heelingArm = heelingMoment / (Delta * 9.81);
    
    // Heel açısı: tan φ = h_wind / GM
    const heelAngle = Math.atan(heelingArm / GM) * (180 / Math.PI);

    setResult({ heelingMoment, heelingArm, heelAngle });
    toast({ 
      title: "Rüzgar Etkisi Hesaplandı", 
      description: `Heel Açısı: ${heelAngle.toFixed(2)}°` 
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
            <Wind className="h-5 w-5" />
            Rüzgar Etkisi Hesaplama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Rüzgar Heeling Moment Hesaplama</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Rüzgar basıncı, yanal alan ve kaldıraç kolu kullanarak heeling moment ve heel açısını hesaplar.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="wind-pressure">Rüzgar Basıncı (q) [Pa]</Label>
                <Input
                  id="wind-pressure"
                  type="number"
                  placeholder="300"
                  value={inputs.windPressure}
                  onChange={(e) => setInputs(prev => ({ ...prev, windPressure: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Örnek: 300 Pa (Beaufort 6-7)</p>
              </div>
              
              <div>
                <Label htmlFor="lateral-area">Yanal Alan (A) [m²]</Label>
                <Input
                  id="lateral-area"
                  type="number"
                  placeholder="400"
                  value={inputs.lateralArea}
                  onChange={(e) => setInputs(prev => ({ ...prev, lateralArea: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Gemi yanal projeksiyon alanı</p>
              </div>
              
              <div>
                <Label htmlFor="lever-arm">Kaldıraç Kolu (z) [m]</Label>
                <Input
                  id="lever-arm"
                  type="number"
                  placeholder="8"
                  value={inputs.leverArm}
                  onChange={(e) => setInputs(prev => ({ ...prev, leverArm: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Yanal alan merkezinden su hattına</p>
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
                <Label htmlFor="gm">GM [m]</Label>
                <Input
                  id="gm"
                  type="number"
                  placeholder="1.2"
                  value={inputs.gm}
                  onChange={(e) => setInputs(prev => ({ ...prev, gm: e.target.value }))}
                />
              </div>
            </div>
            
            <Button onClick={calculateWindHeel} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              Rüzgar Etkisini Hesapla
            </Button>
          </div>

          {result && (
            <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Hesaplama Sonuçları</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{result.heelingMoment.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Heeling Moment [kN·m]</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.heelingArm.toFixed(4)}</div>
                  <div className="text-sm text-gray-600">Heeling Arm [m]</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{result.heelAngle.toFixed(2)}°</div>
                  <div className="text-sm text-gray-600">Heel Açısı</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-blue-500">
                <h5 className="font-medium mb-2">Formüller:</h5>
                <div className="text-sm space-y-1">
                  <div><strong>M_wind = q × A × z / 1000</strong> [kN·m]</div>
                  <div><strong>h_wind = M_wind / (Δ × g)</strong> [m]</div>
                  <div><strong>φ = arctan(h_wind / GM)</strong> [°]</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Rüzgar Basıncı Referansları</h4>
            <div className="text-sm space-y-1">
              <div><strong>Beaufort 4:</strong> ~50 Pa (Hafif rüzgar)</div>
              <div><strong>Beaufort 6:</strong> ~200 Pa (Güçlü rüzgar)</div>
              <div><strong>Beaufort 8:</strong> ~400 Pa (Fırtına)</div>
              <div><strong>Beaufort 10:</strong> ~800 Pa (Şiddetli fırtına)</div>
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