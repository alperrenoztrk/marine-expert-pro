import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gauge, Calculator, Fuel, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DraftSurveyBunker() {
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    beforeBunkering: {
      forward: "",
      midship: "",
      aft: ""
    },
    afterBunkering: {
      forward: "",
      midship: "",
      aft: ""
    },
    fuelSpecs: {
      density: "0.950",
      temperature: "15",
      viscosity: ""
    },
    vesselData: {
      tpc: "",
      lbp: "",
      breadth: ""
    }
  });

  const [result, setResult] = useState<{
    draftChange: number;
    displacementChange: number;
    bunkerWeight: number;
    bunkerVolume: number;
    fuelDensityCorrection: number;
  } | null>(null);

  const calculate = () => {
    const { beforeBunkering, afterBunkering, fuelSpecs, vesselData } = inputs;
    
    if (!beforeBunkering.forward || !beforeBunkering.midship || !beforeBunkering.aft ||
        !afterBunkering.forward || !afterBunkering.midship || !afterBunkering.aft ||
        !vesselData.tpc || !fuelSpecs.density) {
      toast({ title: "Hata", description: "Lütfen tüm gerekli alanları doldurun", variant: "destructive" });
      return;
    }

    // Draft değişimi hesaplama
    const beforeMean = (parseFloat(beforeBunkering.forward) + 4*parseFloat(beforeBunkering.midship) + parseFloat(beforeBunkering.aft)) / 6;
    const afterMean = (parseFloat(afterBunkering.forward) + 4*parseFloat(afterBunkering.midship) + parseFloat(afterBunkering.aft)) / 6;
    const draftChange = afterMean - beforeMean;
    
    // TPC ile deplasman değişimi
    const tpc = parseFloat(vesselData.tpc);
    const displacementChange = draftChange * 100 * tpc;
    
    // Yakıt yoğunluk düzeltmesi
    const fuelDensity = parseFloat(fuelSpecs.density);
    const temperature = parseFloat(fuelSpecs.temperature || "15");
    const tempCorrection = 1 - (0.0006 * (temperature - 15)); // Sıcaklık düzeltme faktörü
    const correctedDensity = fuelDensity * tempCorrection;
    
    // Bunker ağırlığı
    const bunkerWeight = displacementChange;
    
    // Bunker hacmi (15°C'de)
    const bunkerVolume = bunkerWeight / correctedDensity;

    setResult({
      draftChange,
      displacementChange,
      bunkerWeight,
      bunkerVolume,
      fuelDensityCorrection: correctedDensity
    });

    toast({ title: "Hesaplama Tamamlandı", description: "Bunker tonajı hesaplandı" });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bunker Ölçümü</h1>
          <p className="text-muted-foreground">Yakıt alımı öncesi ve sonrası draft karşılaştırması</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Gemi Özellikleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tpc">TPC (ton/cm)</Label>
              <Input
                id="tpc"
                type="number"
                step="0.01"
                value={inputs.vesselData.tpc}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  vesselData: { ...prev.vesselData, tpc: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="lbp">LBP (m)</Label>
              <Input
                id="lbp"
                type="number"
                value={inputs.vesselData.lbp}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  vesselData: { ...prev.vesselData, lbp: e.target.value }
                }))}
                placeholder="Uzunluk"
              />
            </div>
            <div>
              <Label htmlFor="breadth">Genişlik (m)</Label>
              <Input
                id="breadth"
                type="number"
                value={inputs.vesselData.breadth}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  vesselData: { ...prev.vesselData, breadth: e.target.value }
                }))}
                placeholder="Genişlik"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Yakıt Özellikleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="density">Yakıt Yoğunluğu (ton/m³)</Label>
              <Input
                id="density"
                type="number"
                step="0.001"
                value={inputs.fuelSpecs.density}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  fuelSpecs: { ...prev.fuelSpecs, density: e.target.value }
                }))}
                placeholder="0.950"
              />
            </div>
            <div>
              <Label htmlFor="temperature">Sıcaklık (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={inputs.fuelSpecs.temperature}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  fuelSpecs: { ...prev.fuelSpecs, temperature: e.target.value }
                }))}
                placeholder="15"
              />
            </div>
            <div>
              <Label htmlFor="viscosity">Viskozite (cSt) - Opsiyonel</Label>
              <Input
                id="viscosity"
                type="number"
                value={inputs.fuelSpecs.viscosity}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  fuelSpecs: { ...prev.fuelSpecs, viscosity: e.target.value }
                }))}
                placeholder="Viskozite"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Bunker Öncesi Draftlar (m)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="before-forward">Baş Draft</Label>
              <Input
                id="before-forward"
                type="number"
                step="0.01"
                value={inputs.beforeBunkering.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeBunkering: { ...prev.beforeBunkering, forward: e.target.value }
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
                value={inputs.beforeBunkering.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeBunkering: { ...prev.beforeBunkering, midship: e.target.value }
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
                value={inputs.beforeBunkering.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeBunkering: { ...prev.beforeBunkering, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">Bunker Sonrası Draftlar (m)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="after-forward">Baş Draft</Label>
              <Input
                id="after-forward"
                type="number"
                step="0.01"
                value={inputs.afterBunkering.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterBunkering: { ...prev.afterBunkering, forward: e.target.value }
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
                value={inputs.afterBunkering.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterBunkering: { ...prev.afterBunkering, midship: e.target.value }
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
                value={inputs.afterBunkering.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterBunkering: { ...prev.afterBunkering, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={calculate} className="w-full" size="lg">
        <Calculator className="h-4 w-4 mr-2" />
        Bunker Tonajını Hesapla
      </Button>

      {result && (
        <Card className="bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Bunker Hesaplama Sonuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Su çekimi değişimi:</strong> {result.draftChange.toFixed(3)} m</p>
                <p><strong>Deplasman Değişimi:</strong> {result.displacementChange.toFixed(2)} ton</p>
                <p><strong>Düzeltilmiş Yoğunluk:</strong> {result.fuelDensityCorrection.toFixed(3)} ton/m³</p>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  <strong>Bunker Ağırlığı:</strong> {result.bunkerWeight.toFixed(2)} ton
                </p>
                <p className="text-lg font-semibold">
                  <strong>Bunker Hacmi:</strong> {result.bunkerVolume.toFixed(2)} m³
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded">
              <p className="text-sm text-muted-foreground">
                * Sıcaklık düzeltmesi uygulanmıştır (0.06%/°C)
              </p>
              <p className="text-sm text-muted-foreground">
                * Hacim 15°C'de hesaplanmıştır
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}