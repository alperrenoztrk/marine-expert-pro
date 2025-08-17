import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Activity, Calculator, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DraftSurveyIntermediate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    initialDrafts: {
      forward: "",
      midship: "",
      aft: ""
    },
    intermediateDrafts: {
      forward: "",
      midship: "",
      aft: ""
    },
    vesselParticulars: {
      tpc: "",
      density: "1.025"
    },
    timeData: {
      initialTime: "",
      intermediateTime: "",
      estimatedCompletion: ""
    }
  });

  const [result, setResult] = useState<{
    draftChange: number;
    cargoHandled: number;
    handlingRate: number;
    estimatedCompletion: string;
    projectedFinalDraft: number;
  } | null>(null);

  const calculate = () => {
    const { initialDrafts, intermediateDrafts, vesselParticulars, timeData } = inputs;
    
    if (!initialDrafts.forward || !initialDrafts.midship || !initialDrafts.aft ||
        !intermediateDrafts.forward || !intermediateDrafts.midship || !intermediateDrafts.aft ||
        !vesselParticulars.tpc) {
      toast({ title: "Hata", description: "Lütfen tüm gerekli alanları doldurun", variant: "destructive" });
      return;
    }

    // Draft değişimleri
    const initialMean = (parseFloat(initialDrafts.forward) + 4*parseFloat(initialDrafts.midship) + parseFloat(initialDrafts.aft)) / 6;
    const intermediateMean = (parseFloat(intermediateDrafts.forward) + 4*parseFloat(intermediateDrafts.midship) + parseFloat(intermediateDrafts.aft)) / 6;
    const draftChange = Math.abs(intermediateMean - initialMean);
    
    // Kargo miktarı
    const tpc = parseFloat(vesselParticulars.tpc);
    const cargoHandled = draftChange * 100 * tpc;
    
    // Zaman hesaplamaları
    const initialTime = new Date(`2024-01-01T${timeData.initialTime}:00`);
    const intermediateTime = new Date(`2024-01-01T${timeData.intermediateTime}:00`);
    const timeDiffHours = (intermediateTime.getTime() - initialTime.getTime()) / (1000 * 60 * 60);
    
    // İşlem hızı (ton/saat)
    const handlingRate = timeDiffHours > 0 ? cargoHandled / timeDiffHours : 0;
    
    // Tahmini tamamlanma süresi
    const estimatedTotalCargo = parseFloat(timeData.estimatedCompletion || "0");
    const remainingCargo = estimatedTotalCargo - cargoHandled;
    const remainingHours = handlingRate > 0 ? remainingCargo / handlingRate : 0;
    
    const completionTime = new Date(intermediateTime.getTime() + (remainingHours * 60 * 60 * 1000));
    const estimatedCompletion = completionTime.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Tahmini son draft
    const projectedFinalDraft = initialMean + (intermediateMean > initialMean ? 
      (estimatedTotalCargo / (100 * tpc)) / 100 : 
      -(estimatedTotalCargo / (100 * tpc)) / 100);

    setResult({
      draftChange,
      cargoHandled,
      handlingRate,
      estimatedCompletion,
      projectedFinalDraft
    });

    toast({ title: "Hesaplama Tamamlandı", description: "Ara draft analizi yapıldı" });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Ara Draft Ölçümü</h1>
          <p className="text-muted-foreground">Yükleme/boşaltma sırasında ara durum analizi</p>
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
            <CardTitle className="text-blue-600 dark:text-blue-400">Başlangıç Draftları (m)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="initial-forward">Baş Draft</Label>
              <Input
                id="initial-forward"
                type="number"
                step="0.01"
                value={inputs.initialDrafts.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  initialDrafts: { ...prev.initialDrafts, forward: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="initial-midship">Orta Draft</Label>
              <Input
                id="initial-midship"
                type="number"
                step="0.01"
                value={inputs.initialDrafts.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  initialDrafts: { ...prev.initialDrafts, midship: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="initial-aft">Kıç Draft</Label>
              <Input
                id="initial-aft"
                type="number"
                step="0.01"
                value={inputs.initialDrafts.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  initialDrafts: { ...prev.initialDrafts, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600 dark:text-orange-400">Mevcut Draftlar (m)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="intermediate-forward">Baş Draft</Label>
              <Input
                id="intermediate-forward"
                type="number"
                step="0.01"
                value={inputs.intermediateDrafts.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  intermediateDrafts: { ...prev.intermediateDrafts, forward: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="intermediate-midship">Orta Draft</Label>
              <Input
                id="intermediate-midship"
                type="number"
                step="0.01"
                value={inputs.intermediateDrafts.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  intermediateDrafts: { ...prev.intermediateDrafts, midship: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="intermediate-aft">Kıç Draft</Label>
              <Input
                id="intermediate-aft"
                type="number"
                step="0.01"
                value={inputs.intermediateDrafts.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  intermediateDrafts: { ...prev.intermediateDrafts, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zaman Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="initial-time">Başlangıç Saati</Label>
              <Input
                id="initial-time"
                type="time"
                value={inputs.timeData.initialTime}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  timeData: { ...prev.timeData, initialTime: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="intermediate-time">Mevcut Saat</Label>
              <Input
                id="intermediate-time"
                type="time"
                value={inputs.timeData.intermediateTime}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  timeData: { ...prev.timeData, intermediateTime: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="estimated-completion">Tahmini Toplam Kargo (ton)</Label>
              <Input
                id="estimated-completion"
                type="number"
                value={inputs.timeData.estimatedCompletion}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  timeData: { ...prev.timeData, estimatedCompletion: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={calculate} className="w-full" size="lg">
        <Calculator className="h-4 w-4 mr-2" />
        Ara Durum Analizi Yap
      </Button>

      {result && (
        <Card className="bg-purple-50 dark:bg-purple-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Ara Draft Analiz Sonuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Draft Değişimi:</strong> {result.draftChange.toFixed(3)} m</p>
                <p><strong>İşlenen Kargo:</strong> {result.cargoHandled.toFixed(2)} ton</p>
                <p><strong>İşlem Hızı:</strong> {result.handlingRate.toFixed(1)} ton/saat</p>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  <strong>Tahmini Bitiş:</strong> {result.estimatedCompletion}
                </p>
                <p><strong>Tahmini Son Draft:</strong> {result.projectedFinalDraft.toFixed(3)} m</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded">
              <p className="text-sm text-muted-foreground">
                * Mevcut işlem hızına göre tahmini bitiş saati hesaplanmıştır
              </p>
              <p className="text-sm text-muted-foreground">
                * Hava şartları ve operasyonel faktörler değişimi etkileyebilir
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}