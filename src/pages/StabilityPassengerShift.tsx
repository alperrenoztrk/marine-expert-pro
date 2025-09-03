import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityPassengerShiftPage(){
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    passengerWeight: "",
    shiftDistance: "",
    displacement: "",
    gm: "",
    verticalShift: ""
  });
  
  const [result, setResult] = useState<{
    listAngle: number;
    kgChange: number;
    newGM: number;
  } | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/stability/transverse');
  };

  const calculatePassengerShift = () => {
    const w = parseFloat(inputs.passengerWeight); // ton
    const d = parseFloat(inputs.shiftDistance); // m
    const Delta = parseFloat(inputs.displacement); // ton
    const GM = parseFloat(inputs.gm); // m
    const h = parseFloat(inputs.verticalShift) || 0; // m

    if (isNaN(w) || isNaN(d) || isNaN(Delta) || isNaN(GM)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }

    if (GM <= 0) {
      toast({ title: "Hata", description: "GM pozitif olmalıdır", variant: "destructive" });
      return;
    }

    // Enine şift: tan φ = w*d/(Δ*GM)
    const listAngle = Math.atan((w * d) / (Delta * GM)) * (180 / Math.PI);
    
    // Düşey şift: GG_1 = w*h/Δ
    const kgChange = (w * h) / Delta;
    
    // Yeni GM: GM_new = GM - GG_1
    const newGM = GM - kgChange;

    setResult({ listAngle, kgChange, newGM });
    toast({ 
      title: "Yolcu/Ekip Şifti Hesaplandı", 
      description: `List Açısı: ${listAngle.toFixed(2)}°` 
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
            <Users className="h-5 w-5" />
            Yolcu/Ekip Şifti Hesaplama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Yolcu/Ekip Ağırlık Şifti</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Yolcu veya ekip üyelerinin gemi üzerindeki hareketi sonucu oluşan list açısını hesaplar.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="passenger-weight">Toplam Ağırlık (w) [ton]</Label>
                <Input
                  id="passenger-weight"
                  type="number"
                  placeholder="50"
                  value={inputs.passengerWeight}
                  onChange={(e) => setInputs(prev => ({ ...prev, passengerWeight: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Yolcu/ekip toplam ağırlığı</p>
              </div>
              
              <div>
                <Label htmlFor="shift-distance">Enine Şift Mesafesi (d) [m]</Label>
                <Input
                  id="shift-distance"
                  type="number"
                  placeholder="10"
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
                <Label htmlFor="vertical-shift">Düşey Şift (h) [m] (opsiyonel)</Label>
                <Input
                  id="vertical-shift"
                  type="number"
                  placeholder="2"
                  value={inputs.verticalShift}
                  onChange={(e) => setInputs(prev => ({ ...prev, verticalShift: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">Yukarı/aşağı hareket</p>
              </div>
            </div>
            
            <Button onClick={calculatePassengerShift} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              Şift Etkisini Hesapla
            </Button>
          </div>

          {result && (
            <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Hesaplama Sonuçları</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{result.listAngle.toFixed(2)}°</div>
                  <div className="text-sm text-gray-600">List Açısı</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.kgChange.toFixed(4)}</div>
                  <div className="text-sm text-gray-600">KG Değişimi [m]</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{result.newGM.toFixed(3)}</div>
                  <div className="text-sm text-gray-600">Yeni GM [m]</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-blue-500">
                <h5 className="font-medium mb-2">Formüller:</h5>
                <div className="text-sm space-y-1">
                  <div><strong>tan φ = w × d / (Δ × GM)</strong> [°]</div>
                  <div><strong>GG₁ = w × h / Δ</strong> [m]</div>
                  <div><strong>GM_new = GM - GG₁</strong> [m]</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Pratik Örnekler</h4>
            <div className="text-sm space-y-2">
              <div><strong>Yolcu Gemisi:</strong> 100 yolcu × 80 kg = 8 ton, 15m şift</div>
              <div><strong>Feribot:</strong> 50 araç × 1.5 ton = 75 ton, 8m şift</div>
              <div><strong>Kruvaziyer:</strong> 2000 yolcu × 80 kg = 160 ton, 20m şift</div>
              <div><strong>Ekip Hareketi:</strong> 20 kişi × 80 kg = 1.6 ton, 5m şift</div>
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