import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Activity } from "lucide-react";
import { toast } from "sonner";
import { StableTalesEngine } from "./StableTalesCalculationEngine";
import { SarkacMeyilData } from "./StableTalesTypes";

export const PendulumStabilityCalc = () => {
  const [sarkacData, setSarkacData] = useState<SarkacMeyilData>({
    sarkac_uzunlugu: 1.0,
    sapma: 0.1,
    meyil_acisi: undefined
  });

  const [results, setResults] = useState<any>(null);

  const calculatePendulum = () => {
    try {
      const engine = new StableTalesEngine(1000, 8.0, 6.0); // Dummy values for engine
      const meyil_acisi = engine.sarkac_ile_meyil_acisi(sarkacData);
      
      const calculatedResults = {
        meyil_acisi,
        sarkac_uzunlugu: sarkacData.sarkac_uzunlugu,
        sapma: sarkacData.sapma,
        hata_marji: Math.abs(Math.sin(meyil_acisi * Math.PI / 180) - sarkacData.sapma / sarkacData.sarkac_uzunlugu) * 100,
        dogruluk: meyil_acisi < 15 ? 'Yüksek' : meyil_acisi < 30 ? 'Orta' : 'Düşük'
      };
      
      setResults(calculatedResults);
      setSarkacData(prev => ({ ...prev, meyil_acisi }));
      
      toast.success(`Sarkaç metodu ile meyil açısı: ${meyil_acisi.toFixed(2)}°`);
      
    } catch (error) {
      console.error("Pendulum calculation error:", error);
      toast.error("Sarkaç hesaplaması sırasında bir hata oluştu!");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sarkaç Metodu ile Meyil Açısı Ölçümü
          </CardTitle>
          <CardDescription>
            Gemi üzerindeki sarkaç sapmasından meyil açısını hesaplayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Sarkaç Uzunluğu (m)</Label>
              <Input
                type="number"
                step="0.01"
                value={sarkacData.sarkac_uzunlugu}
                onChange={(e) => setSarkacData(prev => ({ 
                  ...prev, 
                  sarkac_uzunlugu: Number(e.target.value) 
                }))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Sarkaç ipinin uzunluğu (genellikle 0.5-2.0 m arası)
              </p>
            </div>
            
            <div>
              <Label>Sapma Miktarı (m)</Label>
              <Input
                type="number"
                step="0.001"
                value={sarkacData.sapma}
                onChange={(e) => setSarkacData(prev => ({ 
                  ...prev, 
                  sapma: Number(e.target.value) 
                }))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Sarkaç ağırlığının düşeyden sapma miktarı
              </p>
            </div>
          </div>

          <Button onClick={calculatePendulum} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Meyil Açısını Hesapla
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sarkaç Metodu Sonuçları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{results.meyil_acisi.toFixed(2)}°</p>
                  <p className="text-sm text-muted-foreground">Meyil Açısı</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{results.hata_marji.toFixed(2)}%</p>
                  <p className="text-sm text-muted-foreground">Hata Marjı</p>
                </div>
                <div className="text-center">
                  <Badge variant={
                    results.dogruluk === 'Yüksek' ? 'default' : 
                    results.dogruluk === 'Orta' ? 'secondary' : 'destructive'
                  }>
                    {results.dogruluk}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Doğruluk</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{(results.sapma / results.sarkac_uzunlugu).toFixed(3)}</p>
                  <p className="text-sm text-muted-foreground">Sin(θ) Değeri</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ölçüm Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Kullanılan Formül:</h4>
                <p className="font-mono text-sm">θ = arcsin(sapma / sarkaç_uzunluğu)</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Girilen Değerler</h5>
                  <p>Sarkaç Uzunluğu: {sarkacData.sarkac_uzunlugu} m</p>
                  <p>Sapma: {sarkacData.sapma} m</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Doğruluk Kriterleri</h5>
                  <p>0-15°: Yüksek doğruluk</p>
                  <p>15-30°: Orta doğruluk</p>
                  <p>30°+: Düşük doğruluk</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Uygulama Notları:
                </h5>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Sarkaç ölçümü sakin deniz durumunda yapılmalıdır</li>
                  <li>• Rüzgar etkisi minimize edilmelidir</li>
                  <li>• Birden fazla ölçüm alarak ortalama hesaplanmalıdır</li>
                  <li>• Sarkaç uzunluğu càlışma alanına uygun seçilmelidir</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};