import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Scale, Calculator, Package, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DraftSurveyCargo() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    beforeLoading: {
      forward: "",
      midship: "",
      aft: ""
    },
    afterLoading: {
      forward: "",
      midship: "",
      aft: ""
    },
    vesselParticulars: {
      lbp: "",
      breadth: "",
      tpc: "",
      density: "1.025"
    },
    constants: {
      ballast: "",
      fuel: "",
      freshWater: "",
      stores: ""
    }
  });

  const [result, setResult] = useState<{
    draftChange: number;
    displacementChange: number;
    cargoWeight: number;
    cargoVolume: number;
  } | null>(null);

  const calculate = () => {
    const { beforeLoading, afterLoading, vesselParticulars, constants } = inputs;
    
    if (!beforeLoading.forward || !beforeLoading.midship || !beforeLoading.aft ||
        !afterLoading.forward || !afterLoading.midship || !afterLoading.aft ||
        !vesselParticulars.tpc) {
      toast({ title: "Hata", description: "Lütfen tüm gerekli alanları doldurun", variant: "destructive" });
      return;
    }

    // Draft değişimi hesaplama
    const beforeMean = (parseFloat(beforeLoading.forward) + 4*parseFloat(beforeLoading.midship) + parseFloat(beforeLoading.aft)) / 6;
    const afterMean = (parseFloat(afterLoading.forward) + 4*parseFloat(afterLoading.midship) + parseFloat(afterLoading.aft)) / 6;
    const draftChange = afterMean - beforeMean;
    
    // TPC ile deplasman değişimi
    const tpc = parseFloat(vesselParticulars.tpc);
    const displacementChange = draftChange * 100 * tpc;
    
    // Sabit ağırlık değişimleri
    const ballastChange = parseFloat(constants.ballast || "0");
    const fuelChange = parseFloat(constants.fuel || "0");
    const freshWaterChange = parseFloat(constants.freshWater || "0");
    const storesChange = parseFloat(constants.stores || "0");
    
    const constantsTotal = ballastChange + fuelChange + freshWaterChange + storesChange;
    
    // Net kargo ağırlığı
    const cargoWeight = displacementChange - constantsTotal;
    
    // Kargo hacmi (varsayılan yoğunluk 1.5 ton/m³)
    const cargoVolume = cargoWeight / 1.5;

    setResult({
      draftChange,
      displacementChange,
      cargoWeight,
      cargoVolume
    });

    toast({ title: "Hesaplama Tamamlandı", description: "Kargo tonajı hesaplandı" });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Kargo Ölçümü</h1>
          <p className="text-muted-foreground">Kargo yükleme öncesi ve sonrası draft karşılaştırması</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Gemi Özellikleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="lbp">LBP (m)</Label>
              <Input
                id="lbp"
                type="number"
                value={inputs.vesselParticulars.lbp}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  vesselParticulars: { ...prev.vesselParticulars, lbp: e.target.value }
                }))}
                placeholder="Uzunluk"
              />
            </div>
            <div>
              <Label htmlFor="breadth">Genişlik (m)</Label>
              <Input
                id="breadth"
                type="number"
                value={inputs.vesselParticulars.breadth}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  vesselParticulars: { ...prev.vesselParticulars, breadth: e.target.value }
                }))}
                placeholder="Genişlik"
              />
            </div>
            <div>
              <Label htmlFor="tpc">TPC (ton/cm)</Label>
              <Input
                id="tpc"
                type="number"
                step="0.01"
                value={inputs.vesselParticulars.tpc}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  vesselParticulars: { ...prev.vesselParticulars, tpc: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="density">Yoğunluk (ton/m³)</Label>
              <Input
                id="density"
                type="number"
                step="0.001"
                value={inputs.vesselParticulars.density}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  vesselParticulars: { ...prev.vesselParticulars, density: e.target.value }
                }))}
                placeholder="1.025"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Yükleme Öncesi Draftlar (m)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="before-forward">Baş Draft</Label>
              <Input
                id="before-forward"
                type="number"
                step="0.01"
                value={inputs.beforeLoading.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeLoading: { ...prev.beforeLoading, forward: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="before-midship">Orta Draft</Label>
              <Input
                id="before-midship"
                type="number"
                step="0.01"
                value={inputs.beforeLoading.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeLoading: { ...prev.beforeLoading, midship: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="before-aft">Kıç Draft</Label>
              <Input
                id="before-aft"
                type="number"
                step="0.01"
                value={inputs.beforeLoading.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeLoading: { ...prev.beforeLoading, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">Yükleme Sonrası Draftlar (m)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="after-forward">Baş Draft</Label>
              <Input
                id="after-forward"
                type="number"
                step="0.01"
                value={inputs.afterLoading.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterLoading: { ...prev.afterLoading, forward: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="after-midship">Orta Draft</Label>
              <Input
                id="after-midship"
                type="number"
                step="0.01"
                value={inputs.afterLoading.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterLoading: { ...prev.afterLoading, midship: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="after-aft">Kıç Draft</Label>
              <Input
                id="after-aft"
                type="number"
                step="0.01"
                value={inputs.afterLoading.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterLoading: { ...prev.afterLoading, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sabit Değişkenler (ton)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="ballast-change">Balast Değişimi</Label>
              <Input
                id="ballast-change"
                type="number"
                value={inputs.constants.ballast}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  constants: { ...prev.constants, ballast: e.target.value }
                }))}
                placeholder="0 (+ alınan, - verilen)"
              />
            </div>
            <div>
              <Label htmlFor="fuel-change">Yakıt Değişimi</Label>
              <Input
                id="fuel-change"
                type="number"
                value={inputs.constants.fuel}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  constants: { ...prev.constants, fuel: e.target.value }
                }))}
                placeholder="0 (+ alınan, - tüketilen)"
              />
            </div>
            <div>
              <Label htmlFor="freshwater-change">Tatlı Su Değişimi</Label>
              <Input
                id="freshwater-change"
                type="number"
                value={inputs.constants.freshWater}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  constants: { ...prev.constants, freshWater: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="stores-change">Erzak Değişimi</Label>
              <Input
                id="stores-change"
                type="number"
                value={inputs.constants.stores}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  constants: { ...prev.constants, stores: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={calculate} className="w-full" size="lg">
        <Calculator className="h-4 w-4 mr-2" />
        Kargo Tonajını Hesapla
      </Button>

      {result && (
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Kargo Hesaplama Sonuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Su çekimi değişimi:</strong> {result.draftChange.toFixed(3)} m</p>
                <p><strong>Deplasman Değişimi:</strong> {result.displacementChange.toFixed(2)} ton</p>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  <strong>Net Kargo:</strong> {result.cargoWeight.toFixed(2)} ton
                </p>
                <p><strong>Kargo Hacmi:</strong> {result.cargoVolume.toFixed(2)} m³</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded">
              <p className="text-sm text-muted-foreground">
                * Hesaplamada 6 ordinat kuralı kullanılmıştır
              </p>
              <p className="text-sm text-muted-foreground">
                * Kargo hacmi varsayılan 1.5 ton/m³ yoğunluk ile hesaplanmıştır
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}