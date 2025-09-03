import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Anchor, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } = "react";
import { useToast } from "@/hooks/use-toast";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityTurningHeelPage(){
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    speed: "",
    turningRadius: "",
    displacement: "",
    gm: "",
    breadth: ""
  });
  
  const [result, setResult] = useState<{
    centripetalForce: number;
    heelingMoment: number;
    heelAngle: number;
    angularVelocity: number;
  } | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/stability/transverse');
  };

  const calculateTurningHeel = () => {
    const V = parseFloat(inputs.speed); // m/s
    const R = parseFloat(inputs.turningRadius); // m
    const Delta = parseFloat(inputs.displacement); // ton
    const GM = parseFloat(inputs.gm); // m
    const B = parseFloat(inputs.breadth); // m

    if (isNaN(V) || isNaN(R) || isNaN(Delta) || isNaN(GM) || isNaN(B)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }

    if (GM <= 0) {
      toast({ title: "Hata", description: "GM pozitif olmalıdır", variant: "destructive" });
      return;
    }

    if (R <= 0) {
      toast({ title: "Hata", description: "Dönüş yarıçapı pozitif olmalıdır", variant: "destructive" });
      return;
    }

    // Açısal hız: ω = V / R [rad/s]
    const angularVelocity = V / R;
    
    // Santrifüj kuvvet: F_c = m × ω² × R = Δ × V² / R [N]
    const centripetalForce = (Delta * 1000) * (V * V) / R; // N
    
    // Heeling moment: M = F_c × B/2 [N·m]
    const heelingMoment = centripetalForce * (B / 2);
    
    // Heel açısı: tan φ = M / (Δ × g × GM)
    const heelAngle = Math.atan(heelingMoment / (Delta * 1000 * 9.81 * GM)) * (180 / Math.PI);

    setResult({ centripetalForce, heelingMoment, heelAngle, angularVelocity });
    toast({ 
      title: "Dönüş Santrifüj Yalpası Hesaplandı", 
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
            <Anchor className="h-5 w-5" />
            Dönüş Santrifüj Yalpası Hesaplama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Dönüş Etkisi</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Gemi dönüş yaparken santrifüj kuvvet nedeniyle oluşan heel açısını hesaplar.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="speed">Hız (V) [m/s]</Label>
                <Input
                  id="speed"
                  type="number"
                  placeholder="10"
                  value={inputs.speed}
                  onChange={(e) => setInputs(prev => ({ ...prev, speed: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Gemi hızı (1 knot ≈ 0.514 m/s)</p>
              </div>
              
              <div>
                <Label htmlFor="turning-radius">Dönüş Yarıçapı (R) [m]</Label>
                <Input
                  id="turning-radius"
                  type="number"
                  placeholder="200"
                  value={inputs.turningRadius}
                  onChange={(e) => setInputs(prev => ({ ...prev, turningRadius: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Dönüş çemberinin yarıçapı</p>
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
            </div>
            
            <Button onClick={calculateTurningHeel} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              Dönüş Etkisini Hesapla
            </Button>
          </div>

          {result && (
            <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Hesaplama Sonuçları</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{(result.centripetalForce/1000).toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Santrifüj Kuvvet [kN]</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{(result.heelingMoment/1000).toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Heeling Moment [kN·m]</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{result.heelAngle.toFixed(2)}°</div>
                  <div className="text-sm text-gray-600">Heel Açısı</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{result.angularVelocity.toFixed(3)}</div>
                  <div className="text-sm text-gray-600">Açısal Hız [rad/s]</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-blue-500">
                <h5 className="font-medium mb-2">Formüller:</h5>
                <div className="text-sm space-y-1">
                  <div><strong>ω = V / R</strong> [rad/s]</div>
                  <div><strong>F_c = Δ × V² / R</strong> [N]</div>
                  <div><strong>M = F_c × B/2</strong> [N·m]</div>
                  <div><strong>tan φ = M / (Δ × g × GM)</strong> [°]</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Pratik Örnekler</h4>
            <div className="text-sm space-y-2">
              <div><strong>Küçük Tekne:</strong> 10 knot, R=50m → ~5° heel</div>
              <div><strong>Yat:</strong> 15 knot, R=100m → ~8° heel</div>
              <div><strong>Feribot:</strong> 8 knot, R=200m → ~3° heel</div>
              <div><strong>Kargo Gemisi:</strong> 12 knot, R=500m → ~2° heel</div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-red-700">Güvenlik Uyarıları</h4>
            <div className="text-sm space-y-1 text-red-600">
              <div>• Dönüş sırasında heel açısı 15°'yi geçmemelidir</div>
              <div>• Yüksek hızlarda dönüş yapmaktan kaçının</div>
              <div>• Dar dönüş yarıçapları tehlikeli olabilir</div>
              <div>• Yolcu gemilerinde daha dikkatli olun</div>
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