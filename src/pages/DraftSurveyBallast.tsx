import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Droplets, Calculator, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DraftSurveyBallast() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    beforeBallast: {
      forward: "",
      midship: "",
      aft: ""
    },
    afterBallast: {
      forward: "",
      midship: "",
      aft: ""
    },
    vesselParticulars: {
      tpc: "",
      density: "1.025"
    },
    ballastTanks: {
      forepeak: "",
      afterpeak: "",
      no1Hold: "",
      no2Hold: "",
      no3Hold: "",
      no4Hold: ""
    }
  });

  const [result, setResult] = useState<{
    draftChange: number;
    ballastWeight: number;
    ballastVolume: number;
    tankDistribution: any;
  } | null>(null);

  const calculate = () => {
    const { beforeBallast, afterBallast, vesselParticulars, ballastTanks } = inputs;
    
    if (!beforeBallast.forward || !beforeBallast.midship || !beforeBallast.aft ||
        !afterBallast.forward || !afterBallast.midship || !afterBallast.aft ||
        !vesselParticulars.tpc) {
      toast({ title: "Hata", description: "Lütfen tüm gerekli alanları doldurun", variant: "destructive" });
      return;
    }

    // Draft değişimi hesaplama
    const beforeMean = (parseFloat(beforeBallast.forward) + 4*parseFloat(beforeBallast.midship) + parseFloat(beforeBallast.aft)) / 6;
    const afterMean = (parseFloat(afterBallast.forward) + 4*parseFloat(afterBallast.midship) + parseFloat(afterBallast.aft)) / 6;
    const draftChange = afterMean - beforeMean;
    
    // TPC ile balast ağırlığı
    const tpc = parseFloat(vesselParticulars.tpc);
    const ballastWeight = draftChange * 100 * tpc;
    
    // Balast hacmi
    const density = parseFloat(vesselParticulars.density);
    const ballastVolume = ballastWeight / density;

    // Tank dağılımı
    const tankDistribution = {
      forepeak: parseFloat(ballastTanks.forepeak || "0"),
      afterpeak: parseFloat(ballastTanks.afterpeak || "0"),
      no1Hold: parseFloat(ballastTanks.no1Hold || "0"),
      no2Hold: parseFloat(ballastTanks.no2Hold || "0"),
      no3Hold: parseFloat(ballastTanks.no3Hold || "0"),
      no4Hold: parseFloat(ballastTanks.no4Hold || "0")
    };

    setResult({
      draftChange,
      ballastWeight,
      ballastVolume,
      tankDistribution
    });

    toast({ title: "Hesaplama Tamamlandı", description: "Balast ölçümü hesaplandı" });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Balast Ölçümü</h1>
          <p className="text-muted-foreground">Balast alma/verme işlemi draft analizi</p>
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
            <CardTitle className="text-red-600 dark:text-red-400">Balast Öncesi Su Çekimleri (m)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="before-forward">Baş Su Çekimi</Label>
              <Input
                id="before-forward"
                type="number"
                step="0.01"
                value={inputs.beforeBallast.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeBallast: { ...prev.beforeBallast, forward: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="before-midship">Orta Su Çekimi</Label>
              <Input
                id="before-midship"
                type="number"
                step="0.01"
                value={inputs.beforeBallast.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeBallast: { ...prev.beforeBallast, midship: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="before-aft">Kıç Su Çekimi</Label>
              <Input
                id="before-aft"
                type="number"
                step="0.01"
                value={inputs.beforeBallast.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  beforeBallast: { ...prev.beforeBallast, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-400">Balast Sonrası Su Çekimleri (m)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="after-forward">Baş Su Çekimi</Label>
              <Input
                id="after-forward"
                type="number"
                step="0.01"
                value={inputs.afterBallast.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterBallast: { ...prev.afterBallast, forward: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="after-midship">Orta Su Çekimi</Label>
              <Input
                id="after-midship"
                type="number"
                step="0.01"
                value={inputs.afterBallast.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterBallast: { ...prev.afterBallast, midship: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="after-aft">Kıç Su Çekimi</Label>
              <Input
                id="after-aft"
                type="number"
                step="0.01"
                value={inputs.afterBallast.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  afterBallast: { ...prev.afterBallast, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Balast Tank Dağılımı (m³)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="forepeak">Forepeak Tank</Label>
              <Input
                id="forepeak"
                type="number"
                value={inputs.ballastTanks.forepeak}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  ballastTanks: { ...prev.ballastTanks, forepeak: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="afterpeak">Afterpeak Tank</Label>
              <Input
                id="afterpeak"
                type="number"
                value={inputs.ballastTanks.afterpeak}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  ballastTanks: { ...prev.ballastTanks, afterpeak: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="no1Hold">No.1 Ambar</Label>
              <Input
                id="no1Hold"
                type="number"
                value={inputs.ballastTanks.no1Hold}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  ballastTanks: { ...prev.ballastTanks, no1Hold: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="no2Hold">No.2 Ambar</Label>
              <Input
                id="no2Hold"
                type="number"
                value={inputs.ballastTanks.no2Hold}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  ballastTanks: { ...prev.ballastTanks, no2Hold: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="no3Hold">No.3 Ambar</Label>
              <Input
                id="no3Hold"
                type="number"
                value={inputs.ballastTanks.no3Hold}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  ballastTanks: { ...prev.ballastTanks, no3Hold: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="no4Hold">No.4 Ambar</Label>
              <Input
                id="no4Hold"
                type="number"
                value={inputs.ballastTanks.no4Hold}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  ballastTanks: { ...prev.ballastTanks, no4Hold: e.target.value }
                }))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={calculate} className="w-full" size="lg">
        <Calculator className="h-4 w-4 mr-2" />
        Balast Hesapla
      </Button>

      {result && (
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Balast Hesaplama Sonuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Su Çekimi Değişimi:</strong> {result.draftChange.toFixed(3)} m</p>
                <p><strong>Balast Ağırlığı:</strong> {result.ballastWeight.toFixed(2)} ton</p>
              </div>
              <div className="space-y-2">
                <p><strong>Balast Hacmi:</strong> {result.ballastVolume.toFixed(2)} m³</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}