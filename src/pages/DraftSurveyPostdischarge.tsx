import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, TrendingDown, Calculator, Package } from "lucide-react";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DraftSurveyPostdischarge() {
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    beforeDischarge: {
      forward: "",
      midship: "",
      aft: ""
    },
    afterDischarge: {
      forward: "",
      midship: "",
      aft: ""
    },
    vesselParticulars: {
      tpc: "",
      density: "1.025"
    },
    cargoRemaining: {
      estimatedRemaining: "",
      actualRemaining: ""
    }
  });

  const [result, setResult] = useState<{
    draftChange: number;
    dischargedWeight: number;
    dischargeEfficiency: number;
    remainingCargo: number;
  } | null>(null);

  const calculate = () => {
    const { beforeDischarge, afterDischarge, vesselParticulars, cargoRemaining } = inputs;
    
    if (!beforeDischarge.forward || !beforeDischarge.midship || !beforeDischarge.aft ||
        !afterDischarge.forward || !afterDischarge.midship || !afterDischarge.aft ||
        !vesselParticulars.tpc) {
      toast({ title: "Hata", description: "Lütfen tüm gerekli alanları doldurun", variant: "destructive" });
      return;
    }

    // Draft değişimi hesaplama
    const beforeMean = (parseFloat(beforeDischarge.forward) + 4*parseFloat(beforeDischarge.midship) + parseFloat(beforeDischarge.aft)) / 6;
    const afterMean = (parseFloat(afterDischarge.forward) + 4*parseFloat(afterDischarge.midship) + parseFloat(afterDischarge.aft)) / 6;
    const draftChange = beforeMean - afterMean; // Boşaltma sonrası azalma
    
    // TPC ile boşaltılan ağırlık
    const tpc = parseFloat(vesselParticulars.tpc);
    const dischargedWeight = draftChange * 100 * tpc;
    
    // Kalan kargo kontrolü
    const estimatedRemaining = parseFloat(cargoRemaining.estimatedRemaining || "0");
    const actualRemaining = parseFloat(cargoRemaining.actualRemaining || "0");
    
    // Boşaltma verimliliği
    const dischargeEfficiency = ((dischargedWeight / (dischargedWeight + actualRemaining)) * 100);

    setResult({
      draftChange,
      dischargedWeight,
      dischargeEfficiency,
      remainingCargo: actualRemaining
    });

    toast({ title: "Hesaplama Tamamlandı", description: "Boşaltma sonrası analiz yapıldı" });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
<div>
          <h1 className="text-2xl font-bold">Boşaltma Sonrası Kontrol</h1>
          <p className="text-muted-foreground">Kargo boşaltma işlemi sonucu analizi</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gemi Özellikleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="density">Su Yoğunluğu (ton/m³)</Label>
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
            <CardTitle className="text-orange-600 dark:text-orange-400">Boşaltma Öncesi Draftlar (m)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="before-forward">Baş Draft</Label>
              <Input
                id="before-forward"
                type="number"
                step="0.01"
                value={inputs.beforeDischarge.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeDischarge: { ...prev.beforeDischarge, forward: e.target.value }
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
                value={inputs.beforeDischarge.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeDischarge: { ...prev.beforeDischarge, midship: e.target.value }
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
                value={inputs.beforeDischarge.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeDischarge: { ...prev.beforeDischarge, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">Boşaltma Sonrası Draftlar (m)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="after-forward">Baş Draft</Label>
              <Input
                id="after-forward"
                type="number"
                step="0.01"
                value={inputs.afterDischarge.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterDischarge: { ...prev.afterDischarge, forward: e.target.value }
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
                value={inputs.afterDischarge.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterDischarge: { ...prev.afterDischarge, midship: e.target.value }
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
                value={inputs.afterDischarge.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterDischarge: { ...prev.afterDischarge, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kalan Kargo Kontrolü (ton)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimated-remaining">Tahmini Kalan</Label>
              <Input
                id="estimated-remaining"
                type="number"
                value={inputs.cargoRemaining.estimatedRemaining}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  cargoRemaining: { ...prev.cargoRemaining, estimatedRemaining: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="actual-remaining">Gerçek Kalan</Label>
              <Input
                id="actual-remaining"
                type="number"
                value={inputs.cargoRemaining.actualRemaining}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  cargoRemaining: { ...prev.cargoRemaining, actualRemaining: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={calculate} className="w-full" size="lg">
        <Calculator className="h-4 w-4 mr-2" />
        Boşaltma Analizi Yap
      </Button>

      {result && (
        <Card className="bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Boşaltma Sonrası Analiz Sonuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Draft Azalması:</strong> {result.draftChange.toFixed(3)} m</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  <strong>Boşaltılan Kargo:</strong> {result.dischargedWeight.toFixed(2)} ton
                </p>
              </div>
              <div className="space-y-2">
                <p><strong>Boşaltma Verimliliği:</strong> {result.dischargeEfficiency.toFixed(1)}%</p>
                <p><strong>Kalan Kargo:</strong> {result.remainingCargo.toFixed(2)} ton</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded">
              <p className="text-sm text-muted-foreground">
                * Draft değişimi ile boşaltılan miktar hesaplanmıştır
              </p>
              <p className="text-sm text-muted-foreground">
                * {result.dischargeEfficiency >= 95 ? "Boşaltma verimliliği mükemmel" : 
                   result.dischargeEfficiency >= 90 ? "Boşaltma verimliliği iyi" : 
                   "Boşaltma verimliliği geliştirilmeli"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}