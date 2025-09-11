import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Ship, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { StableTalesEngine } from "./StableTalesCalculationEngine";
import { StableTalesInput, YukBilgisi, TankBilgisi } from "./StableTalesTypes";

export const StableTalesCalculator = () => {
  const [vesselData, setVesselData] = useState({
    deplasman: 25000,
    km: 8.5,
    kg: 7.2,
    gemi_adi: "M/V Example Ship"
  });

  const [results, setResults] = useState<any>(null);
  const [gzCurve, setGzCurve] = useState<Array<{ aci: number; gz: number; kn: number }>>([]);
  const [yukler, setYukler] = useState<YukBilgisi[]>([]);
  const [tanklar, setTanklar] = useState<TankBilgisi[]>([]);

  // Yük ekleme
  const addYuk = () => {
    setYukler(prev => [...prev, {
      agirlik: 1000,
      kg: 5.0,
      yatay_mesafe: 2.0,
      dikey_mesafe: 1.0
    }]);
  };

  // Tank ekleme
  const addTank = () => {
    setTanklar(prev => [...prev, {
      uzunluk: 10,
      genislik: 8,
      yukseklik: 6,
      doluluk_orani: 0.5,
      sivı_yogunlugu: 1.025
    }]);
  };

  const calculateStability = () => {
    try {
      const input: StableTalesInput = {
        deplasman: vesselData.deplasman,
        km: vesselData.km,
        kg: vesselData.kg,
        yukler: yukler.length > 0 ? yukler : undefined,
        tanklar: tanklar.length > 0 ? tanklar : undefined
      };

      const calculationResults = StableTalesEngine.kapsamliHesaplama(input);
      setResults(calculationResults);

      // GZ eğrisi oluştur
      const engine = new StableTalesEngine(vesselData.deplasman, vesselData.km, vesselData.kg);
      const curveData = [];
      
      for (let aci = 0; aci <= 90; aci += 5) {
        const aci_rad = aci * (Math.PI / 180);
        const gz = calculationResults.gm * Math.sin(aci_rad);
        const kn = vesselData.kg * Math.sin(aci_rad) + gz; // Simplified KN calculation
        
        curveData.push({
          aci,
          gz: Math.max(0, gz),
          kn: kn
        });
      }
      
      setGzCurve(curveData);
      
      // Status mesajı
      if (calculationResults.solas_uygunluk.genel_uygunluk) {
        toast.success("✅ Tüm SOLAS kriterleri sağlandı!");
      } else {
        toast.error("❌ Bazı SOLAS kriterleri sağlanmadı!");
      }
      
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error("Hesaplama sırasında bir hata oluştu!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Gemi Temel Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5" />
            Gemi Temel Bilgileri
          </CardTitle>
          <CardDescription>
            Stabilite hesaplamaları için temel gemi verileri
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>Gemi Adı</Label>
            <Input
              type="text"
              value={vesselData.gemi_adi}
              onChange={(e) => setVesselData(prev => ({ ...prev, gemi_adi: e.target.value }))}
            />
          </div>
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
        </CardContent>
      </Card>

      {/* Yükler ve Tanklar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yükler */}
        <Card>
          <CardHeader>
            <CardTitle>Yük Bilgileri</CardTitle>
            <Button onClick={addYuk} size="sm">Yük Ekle</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {yukler.map((yuk, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-medium">Yük {index + 1}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Ağırlık (ton)</Label>
                    <Input
                      type="number"
                      value={yuk.agirlik}
                      onChange={(e) => {
                        const newYukler = [...yukler];
                        newYukler[index].agirlik = Number(e.target.value);
                        setYukler(newYukler);
                      }}
                    />
                  </div>
                  <div>
                    <Label>KG (m)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={yuk.kg}
                      onChange={(e) => {
                        const newYukler = [...yukler];
                        newYukler[index].kg = Number(e.target.value);
                        setYukler(newYukler);
                      }}
                    />
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setYukler(prev => prev.filter((_, i) => i !== index))}
                >
                  Kaldır
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tanklar */}
        <Card>
          <CardHeader>
            <CardTitle>Tank Bilgileri</CardTitle>
            <Button onClick={addTank} size="sm">Tank Ekle</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {tanklar.map((tank, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-medium">Tank {index + 1}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Uzunluk (m)</Label>
                    <Input
                      type="number"
                      value={tank.uzunluk}
                      onChange={(e) => {
                        const newTanklar = [...tanklar];
                        newTanklar[index].uzunluk = Number(e.target.value);
                        setTanklar(newTanklar);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Genişlik (m)</Label>
                    <Input
                      type="number"
                      value={tank.genislik}
                      onChange={(e) => {
                        const newTanklar = [...tanklar];
                        newTanklar[index].genislik = Number(e.target.value);
                        setTanklar(newTanklar);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Doluluk Oranı</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={tank.doluluk_orani}
                      onChange={(e) => {
                        const newTanklar = [...tanklar];
                        newTanklar[index].doluluk_orani = Number(e.target.value);
                        setTanklar(newTanklar);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Sıvı Yoğunluğu (t/m³)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={tank.sivı_yogunlugu}
                      onChange={(e) => {
                        const newTanklar = [...tanklar];
                        newTanklar[index].sivı_yogunlugu = Number(e.target.value);
                        setTanklar(newTanklar);
                      }}
                    />
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTanklar(prev => prev.filter((_, i) => i !== index))}
                >
                  Kaldır
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Hesaplama Butonu */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={calculateStability} className="w-full" size="lg">
            <Calculator className="mr-2 h-5 w-5" />
            Stabilite Analizi Yap
          </Button>
        </CardContent>
      </Card>

      {/* Sonuçlar */}
      {results && (
        <div className="space-y-6">
          {/* Temel Sonuçlar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.solas_uygunluk.genel_uygunluk ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                Stabilite Analizi Sonuçları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{results.gm.toFixed(3)}</p>
                  <p className="text-sm text-muted-foreground">GM (m)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{results.gz.toFixed(3)}</p>
                  <p className="text-sm text-muted-foreground">GZ (m)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{results.meyil_acisi.toFixed(1)}°</p>
                  <p className="text-sm text-muted-foreground">Meyil Açısı</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{results.yalpa_periyodu.toFixed(1)}s</p>
                  <p className="text-sm text-muted-foreground">Yalpa Periyodu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SOLAS Kriterleri */}
          <Card>
            <CardHeader>
              <CardTitle>SOLAS Kriterleri Kontrolü</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(results.solas_uygunluk).filter(([key]) => key !== 'genel_uygunluk').map(([key, kriter]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{key.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {kriter.deger.toFixed(3)} / {kriter.kriter.toFixed(3)}
                      </p>
                    </div>
                    <Badge variant={kriter.uygun ? "default" : "destructive"}>
                      {kriter.uygun ? "✓" : "✗"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* GZ Eğrisi */}
          {gzCurve.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>GZ Eğrisi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gzCurve}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="aci" 
                        label={{ value: 'Meyil Açısı (°)', position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis 
                        label={{ value: 'GZ (m)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `${value.toFixed(3)} ${name === 'gz' ? 'm' : ''}`, 
                          name === 'gz' ? 'GZ' : 'KN'
                        ]}
                        labelFormatter={(value) => `Açı: ${value}°`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gz" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="GZ"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="kn" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="KN"
                      />
                      <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};