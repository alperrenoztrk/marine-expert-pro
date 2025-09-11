import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Anchor, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { StableTalesEngine } from "./StableTalesCalculationEngine";
import { HavuzKritikData } from "./StableTalesTypes";

export const DrydockStabilityCalc = () => {
  const [vesselData, setVesselData] = useState({
    deplasman: 25000,
    km: 8.5,
    kg: 7.2,
    loa: 180,
    boa: 32
  });

  const [drydockData, setDrydockData] = useState<HavuzKritikData>({
    havuz_uzunlugu: 200,
    destek_noktalari: [20, 50, 80, 110, 140, 170],
    kritik_gm: undefined,
    kren_momenti: undefined
  });

  const [results, setResults] = useState<any>(null);

  const addSupportPoint = () => {
    setDrydockData(prev => ({
      ...prev,
      destek_noktalari: [...prev.destek_noktalari, 100]
    }));
  };

  const removeSupportPoint = (index: number) => {
    setDrydockData(prev => ({
      ...prev,
      destek_noktalari: prev.destek_noktalari.filter((_, i) => i !== index)
    }));
  };

  const calculateDrydock = () => {
    try {
      const engine = new StableTalesEngine(vesselData.deplasman, vesselData.km, vesselData.kg);
      
      const kritik_gm = engine.havuzda_kritik_gm(drydockData);
      const mevcut_gm = engine.hesapla_gm();
      
      // Calculate support reactions and moments
      const destekAraliklari = [];
      for (let i = 0; i < drydockData.destek_noktalari.length - 1; i++) {
        destekAraliklari.push(drydockData.destek_noktalari[i + 1] - drydockData.destek_noktalari[i]);
      }
      
      const ortalama_aralik = destekAraliklari.reduce((a, b) => a + b, 0) / destekAraliklari.length;
      const maksimum_aralik = Math.max(...destekAraliklari);
      
      // Calculate critical heeling moment
      const kren_momenti = vesselData.deplasman * kritik_gm * 9.81; // kN.m
      
      // Safety assessment
      let güvenlik_durumu = 'Güvenli';
      let güvenlik_rengi = 'default';
      let öneriler: string[] = [];
      
      if (mevcut_gm >= kritik_gm * 1.5) {
        güvenlik_durumu = 'Çok Güvenli';
        güvenlik_rengi = 'default';
        öneriler.push('Havuz operasyonu güvenle gerçekleştirilebilir');
      } else if (mevcut_gm >= kritik_gm) {
        güvenlik_durumu = 'Güvenli';
        güvenlik_rengi = 'secondary';
        öneriler.push('Dikkatli operasyon önerilir');
      } else {
        güvenlik_durumu = 'Riskli';
        güvenlik_rengi = 'destructive';
        öneriler.push('ACİL: GM artırıcı önlemler alınmalı!');
        öneriler.push('Ballast ayarlaması gerekli');
      }

      if (maksimum_aralik > vesselData.loa / 4) {
        öneriler.push('Uyarı: Destek aralıkları çok geniş, ek destek gerekli');
      }

      const calculatedResults = {
        kritik_gm,
        mevcut_gm,
        güvenlik_marjı: mevcut_gm - kritik_gm,
        kren_momenti,
        ortalama_aralik,
        maksimum_aralik,
        destek_sayisi: drydockData.destek_noktalari.length,
        güvenlik_durumu,
        güvenlik_rengi,
        öneriler,
        gm_orani: mevcut_gm / kritik_gm
      };

      setResults(calculatedResults);
      setDrydockData(prev => ({ ...prev, kritik_gm, kren_momenti }));

      if (mevcut_gm >= kritik_gm) {
        toast.success(`Havuz operasyonu güvenli: GM = ${mevcut_gm.toFixed(3)}m`);
      } else {
        toast.error(`Kritik GM yetersiz: ${kritik_gm.toFixed(3)}m gerekli!`);
      }

    } catch (error) {
      console.error("Drydock calculation error:", error);
      toast.error("Havuz hesaplaması sırasında bir hata oluştu!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Gemi Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            Kuru Havuz Stabilite Analizi
          </CardTitle>
          <CardDescription>
            Kuru havuzda geminin kritik GM değeri ve destek noktaları analizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <Label>LOA (m)</Label>
              <Input
                type="number"
                value={vesselData.loa}
                onChange={(e) => setVesselData(prev => ({ ...prev, loa: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>BOA (m)</Label>
              <Input
                type="number"
                value={vesselData.boa}
                onChange={(e) => setVesselData(prev => ({ ...prev, boa: Number(e.target.value) }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Havuz ve Destek Noktaları */}
      <Card>
        <CardHeader>
          <CardTitle>Havuz Konfigürasyonu</CardTitle>
          <Button onClick={addSupportPoint} size="sm">Destek Noktası Ekle</Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Havuz Uzunluğu (m)</Label>
            <Input
              type="number"
              value={drydockData.havuz_uzunlugu}
              onChange={(e) => setDrydockData(prev => ({ ...prev, havuz_uzunlugu: Number(e.target.value) }))}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Destek Noktaları (Pupa'dan itibaren mesafe - m)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {drydockData.destek_noktalari.map((nokta, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mesafe (m)"
                    value={nokta}
                    onChange={(e) => {
                      const newNoktalari = [...drydockData.destek_noktalari];
                      newNoktalari[index] = Number(e.target.value);
                      setDrydockData(prev => ({ ...prev, destek_noktalari: newNoktalari }));
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeSupportPoint(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={calculateDrydock} className="w-full mt-4">
            <Calculator className="mr-2 h-4 w-4" />
            Havuz Stabilite Analizi Yap
          </Button>
        </CardContent>
      </Card>

      {/* Sonuçlar */}
      {results && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.güvenlik_durumu === 'Çok Güvenli' || results.güvenlik_durumu === 'Güvenli' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                Havuz Operasyon Analizi Sonuçları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{results.kritik_gm.toFixed(3)}</p>
                  <p className="text-sm text-muted-foreground">Kritik GM (m)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{results.mevcut_gm.toFixed(3)}</p>
                  <p className="text-sm text-muted-foreground">Mevcut GM (m)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{results.güvenlik_marjı.toFixed(3)}</p>
                  <p className="text-sm text-muted-foreground">Güvenlik Marjı (m)</p>
                </div>
                <div className="text-center">
                  <Badge variant={results.güvenlik_rengi === 'destructive' ? 'destructive' : results.güvenlik_rengi === 'secondary' ? 'secondary' : 'default'}>
                    {results.güvenlik_durumu}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Güvenlik Durumu</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium mb-2">Destek Analizi</h5>
                  <p className="text-sm">Destek Sayısı: <strong>{results.destek_sayisi}</strong></p>
                  <p className="text-sm">Ortalama Aralık: <strong>{results.ortalama_aralik.toFixed(1)}m</strong></p>
                  <p className="text-sm">Max Aralık: <strong>{results.maksimum_aralik.toFixed(1)}m</strong></p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium mb-2">Stabilite Değerleri</h5>
                  <p className="text-sm">GM Oranı: <strong>{results.gm_orani.toFixed(2)}</strong></p>
                  <p className="text-sm">Kren Momenti: <strong>{results.kren_momenti.toFixed(0)} kN.m</strong></p>
                  <p className="text-sm">Min GM Oranı: <strong>1.00</strong></p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium mb-2">Havuz Parametreleri</h5>
                  <p className="text-sm">Havuz Uzunluğu: {drydockData.havuz_uzunlugu}m</p>
                  <p className="text-sm">Gemi LOA: {vesselData.loa}m</p>
                  <p className="text-sm">BOA: {vesselData.boa}m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Öneriler ve Uyarılar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.öneriler.map((öneri: string, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="text-sm">{öneri}</p>
                </div>
              ))}

              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium mb-2">Kritik GM Formülü:</h5>
                <p className="font-mono text-sm mb-2">
                  GM_kritik = 0.05 + (ortalama_destek_aralığı / 100)
                </p>
                <p className="text-xs text-muted-foreground">
                  Bu basitleştirilmiş formüldür. Gerçek hesaplama için yapısal analiz gereklidir.
                </p>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Havuz Güvenlik Protokolü:
                </h5>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• GM < Kritik GM ise havuz operasyonu YASAKLI</li>
                  <li>• Destek noktaları eşit aralıklarla yerleştirilmeli</li>
                  <li>• Su boşaltma işlemi dikkatli yapılmalı</li>
                  <li>• Sürekli stabilite monitörleme şart</li>
                  <li>• Acil durum planı hazır bulundurulmalı</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};