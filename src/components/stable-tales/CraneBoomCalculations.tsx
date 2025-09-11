import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Construction, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { StableTalesEngine } from "./StableTalesCalculationEngine";
import { BumbaKrenData } from "./StableTalesTypes";

export const CraneBoomCalculations = () => {
  const [vesselData, setVesselData] = useState({
    deplasman: 25000,
    km: 8.5,
    kg: 7.2,
    gm_baslangic: 1.3
  });

  const [craneData, setCraneData] = useState<BumbaKrenData>({
    yuk_agirligi: 50,
    yukseklik_cunda: 25,
    yuk_yuksekligi: 5,
    gm_degisimi: undefined
  });

  const [results, setResults] = useState<any>(null);

  const calculateCraneEffect = () => {
    try {
      const engine = new StableTalesEngine(vesselData.deplasman, vesselData.km, vesselData.kg);
      
      const gm_degisimi = engine.bumba_kren_gm_degisimi(
        craneData.yuk_agirligi,
        craneData.yukseklik_cunda,
        craneData.yuk_yuksekligi
      );

      const yeni_gm = vesselData.gm_baslangic + gm_degisimi;
      const yeni_kg = vesselData.kg - gm_degisimi; // Simplified
      
      // Calculate stability status
      let stabilityStatus = 'excellent';
      let stabilityColor = 'default';
      let recommendations: string[] = [];

      if (yeni_gm >= 0.5) {
        stabilityStatus = 'Mükemmel';
        stabilityColor = 'default';
        recommendations.push('Stabilite durumu güvenli');
      } else if (yeni_gm >= 0.15) {
        stabilityStatus = 'İyi';
        stabilityColor = 'secondary';
        recommendations.push('Dikkatli operasyon önerilir');
      } else if (yeni_gm >= 0.05) {
        stabilityStatus = 'Riskli';
        stabilityColor = 'destructive';
        recommendations.push('ACİL: Operasyonu durdurun!');
      } else {
        stabilityStatus = 'Tehlikeli';
        stabilityColor = 'destructive';
        recommendations.push('DANGER: Negatif GM - Operasyon yasaklandı!');
      }

      // Calculate virtual height effect
      const virtual_kg_artis = Math.pow(craneData.yukseklik_cunda - craneData.yuk_yuksekligi, 2) * 
                               craneData.yuk_agirligi / (vesselData.deplasman + craneData.yuk_agirligi);
      
      const calculatedResults = {
        gm_degisimi,
        yeni_gm,
        yeni_kg,
        virtual_kg_artis,
        stabilityStatus,
        stabilityColor,
        recommendations,
        güvenlik_marjı: yeni_gm - 0.15, // Minimum required GM
        operasyon_durumu: yeni_gm > 0.15 ? 'Güvenli' : 'Güvenli Değil'
      };

      setResults(calculatedResults);
      setCraneData(prev => ({ ...prev, gm_degisimi }));

      if (yeni_gm > 0.15) {
        toast.success(`Kren operasyonu güvenli: GM = ${yeni_gm.toFixed(3)}m`);
      } else {
        toast.error(`Tehlikeli GM: ${yeni_gm.toFixed(3)}m - Operasyonu durdurun!`);
      }

    } catch (error) {
      console.error("Crane calculation error:", error);
      toast.error("Kren hesaplaması sırasında bir hata oluştu!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Gemi Temel Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Kren/Bumba Operasyon Analizi
          </CardTitle>
          <CardDescription>
            Yükleme sırasında kren ve bumba operasyonlarının stabiliteye etkisi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Deplasman (ton)</Label>
              <Input
                type="number"
                value={vesselData.deplasman}
                onChange={(e) => setVesselData(prev => ({ ...prev, deplasman: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>KM (m)</Label>
              <Input
                type="number"
                step="0.01"
                value={vesselData.km}
                onChange={(e) => setVesselData(prev => ({ ...prev, km: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>KG (m)</Label>
              <Input
                type="number"
                step="0.01"
                value={vesselData.kg}
                onChange={(e) => setVesselData(prev => ({ ...prev, kg: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Başlangıç GM (m)</Label>
              <Input
                type="number"
                step="0.01"
                value={vesselData.gm_baslangic}
                onChange={(e) => setVesselData(prev => ({ ...prev, gm_baslangic: Number(e.target.value) }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kren/Bumba Parametreleri */}
      <Card>
        <CardHeader>
          <CardTitle>Kren/Bumba Operasyon Parametreleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Yük Ağırlığı (ton)</Label>
              <Input
                type="number"
                step="0.1"
                value={craneData.yuk_agirligi}
                onChange={(e) => setCraneData(prev => ({ ...prev, yuk_agirligi: Number(e.target.value) }))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Kaldırılan yükün ağırlığı
              </p>
            </div>
            
            <div>
              <Label>Kancayı Yüksekliği (m)</Label>
              <Input
                type="number"
                step="0.1"
                value={craneData.yukseklik_cunda}
                onChange={(e) => setCraneData(prev => ({ ...prev, yukseklik_cunda: Number(e.target.value) }))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Kren kancasının keel üzerindeki yüksekliği
              </p>
            </div>
            
            <div>
              <Label>Yük Yüksekliği (m)</Label>
              <Input
                type="number"
                step="0.1"
                value={craneData.yuk_yuksekligi}
                onChange={(e) => setCraneData(prev => ({ ...prev, yuk_yuksekligi: Number(e.target.value) }))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Yükün nihai yerleştirileceği yükseklik
              </p>
            </div>
          </div>

          <Button onClick={calculateCraneEffect} className="w-full mt-4">
            <Calculator className="mr-2 h-4 w-4" />
            Kren Operasyonu Analizi Yap
          </Button>
        </CardContent>
      </Card>

      {/* Sonuçlar */}
      {results && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.operasyon_durumu === 'Güvenli' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                Kren Operasyon Analizi Sonuçları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{results.yeni_gm.toFixed(3)}</p>
                  <p className="text-sm text-muted-foreground">Yeni GM (m)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{results.gm_degisimi.toFixed(3)}</p>
                  <p className="text-sm text-muted-foreground">GM Değişimi (m)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{results.virtual_kg_artis.toFixed(3)}</p>
                  <p className="text-sm text-muted-foreground">Virtual KG Artışı (m)</p>
                </div>
                <div className="text-center">
                  <Badge variant={results.stabilityColor === 'destructive' ? 'destructive' : results.stabilityColor === 'secondary' ? 'secondary' : 'default'}>
                    {results.stabilityStatus}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Stabilite Durumu</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium mb-2">Güvenlik Değerlendirmesi</h5>
                  <p className="text-sm">Operasyon Durumu: <strong>{results.operasyon_durumu}</strong></p>
                  <p className="text-sm">Güvenlik Marjı: <strong>{results.güvenlik_marjı.toFixed(3)}m</strong></p>
                  <p className="text-sm">Minimum GM: <strong>0.150m</strong></p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium mb-2">Operasyon Parametreleri</h5>
                  <p className="text-sm">Yük: {craneData.yuk_agirligi} ton</p>
                  <p className="text-sm">Kanca Yüksekliği: {craneData.yukseklik_cunda}m</p>
                  <p className="text-sm">Yük Yüksekliği: {craneData.yuk_yuksekligi}m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Öneriler ve Uyarılar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.recommendations.map((rec: string, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="text-sm">{rec}</p>
                </div>
              ))}

              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium mb-2">Kullanılan Formül:</h5>
                <p className="font-mono text-sm mb-2">
                  ΔGM = -W × (h_kanca - h_yük)² / (Δ + W)
                </p>
                <p className="text-xs text-muted-foreground">
                  Burada: W = Yük ağırlığı, h_kanca = Kanca yüksekliği, h_yük = Yük yüksekliği, Δ = Deplasman
                </p>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Güvenlik Protokolü:
                </h5>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• GM &lt; 0.15m ise operasyon DURDURULMALIDIR</li>
                  <li>• Operasyon öncesi ballast ayarlaması yapılmalıdır</li>
                  <li>• Hava koşulları değerlendirilmelidir</li>
                  <li>• Sürekli stabilite monitörleme gereklidir</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};