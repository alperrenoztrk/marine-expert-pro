import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, AlertTriangle, CheckCircle, Waves } from "lucide-react";
import { toast } from "sonner";
import { StableTalesEngine } from "./StableTalesCalculationEngine";
import { YaraliStabiliteData } from "./StableTalesTypes";

export const DamageStabilityCalc = () => {
  const [vesselData, setVesselData] = useState({
    deplasman: 25000,
    km: 8.5,
    kg: 7.2,
    gm_baslangic: 1.3,
    tpc: 20,
    lbp: 170
  });

  const [damageData, setDamageData] = useState<YaraliStabiliteData>({
    su_alan_bolme: {
      hacim: 500,
      kg: 4.0,
      gecirimlilik: 0.85
    },
    baslangic_draft: 8.5,
    yeni_draft: undefined,
    gm_kalici: undefined
  });

  const [results, setResults] = useState<any>(null);

  const calculateDamage = () => {
    try {
      const engine = new StableTalesEngine(vesselData.deplasman, vesselData.km, vesselData.kg);
      
      const yeni_draft = engine.yarali_stabilite_draft_degisimi(damageData);
      
      // Calculate flooded water weight
      const su_agirligi = damageData.su_alan_bolme.hacim * damageData.su_alan_bolme.gecirimlilik * 1.025;
      
      // Calculate new displacement and KG
      const yeni_deplasman = vesselData.deplasman + su_agirligi;
      const yeni_kg = (vesselData.deplasman * vesselData.kg + su_agirligi * damageData.su_alan_bolme.kg) / yeni_deplasman;
      
      // Calculate new KM (simplified - assumes similar draft)
      const draft_artisi = yeni_draft - damageData.baslangic_draft;
      const yeni_km = vesselData.km + (draft_artisi * 0.1); // Simplified correction
      
      // Calculate residual GM
      const gm_kalici = yeni_km - yeni_kg;
      
      // Free surface effect from damaged compartment
      const fsm_hasar = (damageData.su_alan_bolme.hacim * 0.1) / yeni_deplasman; // Simplified FSM
      const gm_kalici_corrected = gm_kalici - fsm_hasar;
      
      // Calculate heel angle (simplified)
      const asymmetric_moment = su_agirligi * 2.0; // Assumed offset
      const meyil_acisi = Math.atan(asymmetric_moment / (yeni_deplasman * gm_kalici_corrected)) * (180 / Math.PI);
      
      // Safety assessment
      let hayatta_kalma_durumu = 'Güvenli';
      let güvenlik_rengi = 'default';
      let öneriler: string[] = [];
      
      if (gm_kalici_corrected >= 0.05 && Math.abs(meyil_acisi) <= 7) {
        hayatta_kalma_durumu = 'Güvenli';
        güvenlik_rengi = 'default';
        öneriler.push('Gemi kararlı durumda, operasyonel kapasiteyi koruyabilir');
      } else if (gm_kalici_corrected >= 0.01 && Math.abs(meyil_acisi) <= 12) {
        hayatta_kalma_durumu = 'Sınırda';
        güvenlik_rengi = 'secondary';
        öneriler.push('Dikkatli operasyon gerekli, ek balast önerilir');
      } else {
        hayatta_kalma_durumu = 'Tehlikeli';
        güvenlik_rengi = 'destructive';
        öneriler.push('ACİL: Derhal balast ayarlaması yapın!');
        öneriler.push('Tüm personeli güvenli bölgelere taşıyın');
      }

      if (draft_artisi > 1.0) {
        öneriler.push('Uyarı: Draft artışı çok yüksek, ek pompalama gerekli');
      }

      const calculatedResults = {
        yeni_draft,
        gm_kalici: gm_kalici_corrected,
        yeni_deplasman,
        yeni_kg,
        yeni_km,
        su_agirligi,
        meyil_acisi,
        draft_artisi,
        fsm_hasar,
        hayatta_kalma_durumu,
        güvenlik_rengi,
        öneriler,
        hayatta_kalma_orani: Math.max(0, Math.min(100, (gm_kalici_corrected / 0.05) * 100))
      };

      setResults(calculatedResults);
      setDamageData(prev => ({ ...prev, yeni_draft, gm_kalici: gm_kalici_corrected }));

      if (gm_kalici_corrected > 0.05) {
        toast.success(`Hasar analizi: GM = ${gm_kalici_corrected.toFixed(3)}m - Güvenli`);
      } else {
        toast.error(`Kritik hasar: GM = ${gm_kalici_corrected.toFixed(3)}m - Tehlikeli!`);
      }

    } catch (error) {
      console.error("Damage calculation error:", error);
      toast.error("Hasar hesaplaması sırasında bir hata oluştu!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Gemi Temel Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5" />
            Hasarlı Stabilite Analizi
          </CardTitle>
          <CardDescription>
            Su alan bölme sonrası stabilite durumu ve hayatta kalma analizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
            <div>
              <Label>TPC (ton/cm)</Label>
              <Input
                type="number"
                step="0.1"
                value={vesselData.tpc}
                onChange={(e) => setVesselData(prev => ({ ...prev, tpc: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>LBP (m)</Label>
              <Input
                type="number"
                value={vesselData.lbp}
                onChange={(e) => setVesselData(prev => ({ ...prev, lbp: Number(e.target.value) }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hasar Parametreleri */}
      <Card>
        <CardHeader>
          <CardTitle>Hasar Bölme Parametreleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Su Alan Bölme Bilgileri</h4>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label>Bölme Hacmi (m³)</Label>
                  <Input
                    type="number"
                    value={damageData.su_alan_bolme.hacim}
                    onChange={(e) => setDamageData(prev => ({
                      ...prev,
                      su_alan_bolme: { ...prev.su_alan_bolme, hacim: Number(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label>Bölme KG (m)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={damageData.su_alan_bolme.kg}
                    onChange={(e) => setDamageData(prev => ({
                      ...prev,
                      su_alan_bolme: { ...prev.su_alan_bolme, kg: Number(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label>Geçirimlilik (0-1)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={damageData.su_alan_bolme.gecirimlilik}
                    onChange={(e) => setDamageData(prev => ({
                      ...prev,
                      su_alan_bolme: { ...prev.su_alan_bolme, gecirimlilik: Number(e.target.value) }
                    }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Bölmenin su ile dolma oranı (0.85 tipik değer)
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Başlangıç Durumu</h4>
              <div>
                <Label>Başlangıç Draft (m)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={damageData.baslangic_draft}
                  onChange={(e) => setDamageData(prev => ({ ...prev, baslangic_draft: Number(e.target.value) }))}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Hasar öncesi gemi draftu
                </p>
              </div>
            </div>
          </div>

          <Button onClick={calculateDamage} className="w-full mt-6">
            <Calculator className="mr-2 h-4 w-4" />
            Hasarlı Stabilite Analizi Yap
          </Button>
        </CardContent>
      </Card>

      {/* Sonuçlar */}
      {results && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.hayatta_kalma_durumu === 'Güvenli' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                Hasarlı Stabilite Analizi Sonuçları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{results.gm_kalici.toFixed(3)}</p>
                  <p className="text-sm text-muted-foreground">Kalıcı GM (m)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{results.yeni_draft.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Yeni Draft (m)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{Math.abs(results.meyil_acisi).toFixed(1)}°</p>
                  <p className="text-sm text-muted-foreground">Meyil Açısı</p>
                </div>
                <div className="text-center">
                  <Badge variant={results.güvenlik_rengi === 'destructive' ? 'destructive' : results.güvenlik_rengi === 'secondary' ? 'secondary' : 'default'}>
                    {results.hayatta_kalma_durumu}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Hayatta Kalma</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium mb-2">Deplasman Değişimi</h5>
                  <p className="text-sm">Başlangıç: <strong>{vesselData.deplasman} ton</strong></p>
                  <p className="text-sm">Yeni: <strong>{results.yeni_deplasman.toFixed(0)} ton</strong></p>
                  <p className="text-sm">Su Ağırlığı: <strong>{results.su_agirligi.toFixed(0)} ton</strong></p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium mb-2">Ağırlık Merkezi</h5>
                  <p className="text-sm">Başlangıç KG: <strong>{vesselData.kg.toFixed(2)}m</strong></p>
                  <p className="text-sm">Yeni KG: <strong>{results.yeni_kg.toFixed(2)}m</strong></p>
                  <p className="text-sm">Yeni KM: <strong>{results.yeni_km.toFixed(2)}m</strong></p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium mb-2">Stabilite Durumu</h5>
                  <p className="text-sm">Draft Artışı: <strong>{results.draft_artisi.toFixed(2)}m</strong></p>
                  <p className="text-sm">FSM Etkisi: <strong>{results.fsm_hasar.toFixed(3)}m</strong></p>
                  <p className="text-sm">Hayatta Kalma: <strong>{results.hayatta_kalma_orani.toFixed(0)}%</strong></p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acil Durum Önerileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.öneriler.map((öneri: string, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="text-sm">{öneri}</p>
                </div>
              ))}

              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium mb-2">Hasarlı Stabilite Kriterleri:</h5>
                <ul className="text-sm space-y-1">
                  <li>• Kalıcı GM ≥ 0.05m (Minimum güvenlik sınırı)</li>
                  <li>• Meyil açısı ≤ 7° (Operasyonel limit)</li>
                  <li>• Meyil açısı ≤ 12° (Hayatta kalma limiti)</li>
                  <li>• Su alma hızı kontrol altında tutulmalı</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Acil Durum Protokolü:
                </h5>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• GM < 0.05m ise derhal balast ayarlaması yapın</li>
                  <li>• Su alma hızını azaltmak için yamaları hazırlayın</li>
                  <li>• Asimetrik ballast ile meyil açısını düzeltin</li>
                  <li>• Acil durumda personeli güvenli bölgelere taşıyın</li>
                  <li>• Kıyı emniyetini bilgilendirin</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};