import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Calculator, Waves, Anchor, AlertTriangle, CheckCircle } from "lucide-react";

interface WeightItem {
  weight: number;
  kg: number;
}

export default function AthwartshipStabilityCalculations() {
  // Shared ship data - synchronized across all tabs
  const [km, setKm] = useState<number>(10.5);
  const [kg, setKg] = useState<number>(8.2);
  const [waterplaneInertia, setWaterplaneInertia] = useState<number>(180000);
  const [displacement, setDisplacement] = useState<number>(15000);
  const [heelAngle, setHeelAngle] = useState<number>(10);
  
  // Weight distribution for KG calculation
  const [weightItems, setWeightItems] = useState<WeightItem[]>([
    { weight: 8000, kg: 6.5 },
    { weight: 7000, kg: 12.0 }
  ]);
  
  // Free surface effect
  const [tankInertia, setTankInertia] = useState<number>(2500);
  
  // Results calculations
  const calculations = useMemo(() => {
    // 1. GM Calculation - Primary formula
    const gm_primary = km - kg;
    
    // 2. GM Calculation - Alternative formula
    const gm_alternative = (waterplaneInertia / displacement) - kg;
    
    // 3. BM Calculation
    const bm = waterplaneInertia / displacement;
    
    // 4. KG from weight distribution
    const totalWeight = weightItems.reduce((sum, item) => sum + item.weight, 0);
    const totalMoment = weightItems.reduce((sum, item) => sum + (item.weight * item.kg), 0);
    const calculatedKG = totalWeight > 0 ? totalMoment / totalWeight : 0;
    
    // 5. GZ for small angles
    const heelRadians = heelAngle * Math.PI / 180;
    const gz_small = gm_primary * Math.sin(heelRadians);
    
    // 6. Righting Moment
    const rightingMoment = displacement * gz_small;
    
    // 7. Free Surface Effect
    const freeSurfaceEffect = tankInertia / displacement;
    const gm_corrected = gm_primary - freeSurfaceEffect;
    
    // 8. Stability assessments
    const assessGM = (gmValue: number) => {
      if (gmValue < 0.15) return { status: "critical", message: "KRİTİK - IMO minimum altında" };
      if (gmValue < 0.5) return { status: "warning", message: "UYARI - Düşük stabilite" };
      if (gmValue > 2.0) return { status: "caution", message: "DİKKAT - Çok sert stabilite" };
      return { status: "good", message: "İYİ - Uygun stabilite" };
    };
    
    return {
      gm_primary,
      gm_alternative,
      bm,
      calculatedKG,
      gz_small,
      rightingMoment,
      freeSurfaceEffect,
      gm_corrected,
      assessment: assessGM(gm_primary),
      correctedAssessment: assessGM(gm_corrected)
    };
  }, [km, kg, waterplaneInertia, displacement, heelAngle, weightItems, tankInertia]);

  const addWeightItem = () => {
    setWeightItems([...weightItems, { weight: 1000, kg: 10 }]);
  };

  const removeWeightItem = (index: number) => {
    setWeightItems(weightItems.filter((_, i) => i !== index));
  };

  const updateWeightItem = (index: number, field: keyof WeightItem, value: number) => {
    const updated = [...weightItems];
    updated[index][field] = value;
    setWeightItems(updated);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "caution": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "caution": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Enine Stabilite Hesaplamaları
          </CardTitle>
          <CardDescription>
            Gemi stabilite parametrelerinin kapsamlı hesaplanması ve analizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Temel Hesaplar</TabsTrigger>
              <TabsTrigger value="kg">KG Hesabı</TabsTrigger>
              <TabsTrigger value="gz">GZ & RM</TabsTrigger>
              <TabsTrigger value="corrections">Düzeltmeler</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">1. Metasentrik Yükseklik (GM)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="km">KM (m)</Label>
                        <Input
                          id="km"
                          type="number"
                          step="0.1"
                          value={km}
                          onChange={(e) => setKm(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="kg">KG (m)</Label>
                        <Input
                          id="kg"
                          type="number"
                          step="0.1"
                          value={kg}
                          onChange={(e) => setKg(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="font-mono text-sm bg-muted p-3 rounded">
                        <div className="font-semibold mb-2">Ana Formül:</div>
                        <div>GM = KM - KG</div>
                        <div>GM = {km} - {kg} = <span className="font-bold text-blue-600">{calculations.gm_primary.toFixed(3)} m</span></div>
                      </div>
                      
                      <div className={`flex items-center gap-2 p-3 rounded border ${getStatusColor(calculations.assessment.status)}`}>
                        {getStatusIcon(calculations.assessment.status)}
                        <span className="font-medium">{calculations.assessment.message}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">4. Metasentrik Yarıçap (BM)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="inertia">Su Hattı Ataleti I (m⁴)</Label>
                        <Input
                          id="inertia"
                          type="number"
                          step="1000"
                          value={waterplaneInertia}
                          onChange={(e) => setWaterplaneInertia(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="displacement">Deplasman ∇ (m³)</Label>
                        <Input
                          id="displacement"
                          type="number"
                          step="100"
                          value={displacement}
                          onChange={(e) => setDisplacement(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="font-mono text-sm bg-muted p-3 rounded">
                        <div className="font-semibold mb-2">BM Formülü:</div>
                        <div>BM = I / ∇</div>
                        <div>BM = {waterplaneInertia} / {displacement} = <span className="font-bold text-blue-600">{calculations.bm.toFixed(3)} m</span></div>
                      </div>
                      
                      <div className="font-mono text-sm bg-blue-50 p-3 rounded border border-blue-200">
                        <div className="font-semibold mb-2">Alternatif GM Formülü:</div>
                        <div>GM = (I/∇) - KG = BM - KG</div>
                        <div>GM = {calculations.bm.toFixed(3)} - {kg} = <span className="font-bold text-blue-600">{calculations.gm_alternative.toFixed(3)} m</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="kg" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">5. KG Hesabı (Dikey Ağırlık Merkezi)</CardTitle>
                  <CardDescription>
                    Yüklerin gemi üzerindeki konumuna göre toplam KG hesaplanması
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {weightItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 items-end">
                        <div>
                          <Label>Ağırlık (ton)</Label>
                          <Input
                            type="number"
                            step="100"
                            value={item.weight}
                            onChange={(e) => updateWeightItem(index, 'weight', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>KG (m)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={item.kg}
                            onChange={(e) => updateWeightItem(index, 'kg', Number(e.target.value))}
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeWeightItem(index)}
                          disabled={weightItems.length <= 1}
                        >
                          Kaldır
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button onClick={addWeightItem} variant="outline" size="sm">
                    Yük Ekle
                  </Button>
                  
                  <Separator />
                  
                  <div className="font-mono text-sm bg-muted p-4 rounded">
                    <div className="font-semibold mb-2">KG Formülü:</div>
                    <div className="mb-2">KG = Σ(wᵢ × KGᵢ) / Σwᵢ</div>
                    
                    <div className="space-y-1 text-xs">
                      <div>Toplam Ağırlık: {weightItems.reduce((sum, item) => sum + item.weight, 0)} ton</div>
                      <div>Toplam Moment: {weightItems.reduce((sum, item) => sum + (item.weight * item.kg), 0).toFixed(1)} ton.m</div>
                    </div>
                    
                    <div className="mt-2 text-lg">
                      <span className="font-bold text-blue-600">KG = {calculations.calculatedKG.toFixed(3)} m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gz" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">2. Doğrultucu Kol (GZ)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="heel">Yatma Açısı φ (derece)</Label>
                      <Input
                        id="heel"
                        type="number"
                        step="1"
                        value={heelAngle}
                        onChange={(e) => setHeelAngle(Number(e.target.value))}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="font-mono text-sm bg-muted p-3 rounded">
                      <div className="font-semibold mb-2">Küçük Açılar İçin:</div>
                      <div>GZ ≈ GM × sin(φ)</div>
                      <div>GZ = {calculations.gm_primary.toFixed(3)} × sin({heelAngle}°)</div>
                      <div className="font-bold text-blue-600">GZ = {calculations.gz_small.toFixed(3)} m</div>
                    </div>
                    
                    <Alert>
                      <Waves className="h-4 w-4" />
                      <AlertTitle>Not</AlertTitle>
                      <AlertDescription>
                        Büyük açılar için GZ değeri hidrostatik eğrilerden bulunmalıdır.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">3. Doğrultucu Moment (RM)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="font-mono text-sm bg-muted p-3 rounded">
                      <div className="font-semibold mb-2">RM Formülü:</div>
                      <div>RM = Δ × GZ</div>
                      <div>RM = {displacement} × {calculations.gz_small.toFixed(3)}</div>
                      <div className="font-bold text-blue-600">RM = {calculations.rightingMoment.toFixed(1)} ton.m</div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Δ (Delta):</strong> Deplasman (ton cinsinden)</p>
                      <p>Geminin rüzgâr, dalga vb. kuvvetlere karşı koyma momentidir.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="corrections" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">7. Serbest Yüzey Düzeltmesi</CardTitle>
                  <CardDescription>
                    Tanklardaki serbest sıvının GM'ye etkisi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tankInertia">Tank Serbest Yüzey Ataleti If (m⁴)</Label>
                    <Input
                      id="tankInertia"
                      type="number"
                      step="100"
                      value={tankInertia}
                      onChange={(e) => setTankInertia(Number(e.target.value))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="font-mono text-sm bg-muted p-3 rounded">
                      <div className="font-semibold mb-2">Serbest Yüzey Etkisi:</div>
                      <div>FSE = Σ(If) / ∇</div>
                      <div>FSE = {tankInertia} / {displacement} = <span className="font-bold text-orange-600">{calculations.freeSurfaceEffect.toFixed(3)} m</span></div>
                    </div>
                    
                    <div className="font-mono text-sm bg-blue-50 p-3 rounded border border-blue-200">
                      <div className="font-semibold mb-2">Düzeltilmiş GM:</div>
                      <div>GM_düzeltilmiş = GM - FSE</div>
                      <div>GM_düzeltilmiş = {calculations.gm_primary.toFixed(3)} - {calculations.freeSurfaceEffect.toFixed(3)}</div>
                      <div className="font-bold text-blue-600">GM_düzeltilmiş = {calculations.gm_corrected.toFixed(3)} m</div>
                    </div>
                    
                    <div className={`flex items-center gap-2 p-3 rounded border ${getStatusColor(calculations.correctedAssessment.status)}`}>
                      {getStatusIcon(calculations.correctedAssessment.status)}
                      <span className="font-medium">{calculations.correctedAssessment.message}</span>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Önemli</AlertTitle>
                    <AlertDescription>
                      Serbest yüzey etkisi özellikle kısmi dolu tanklarda kritik öneme sahiptir. 
                      Tank tamamen dolu veya boş olduğunda bu etki minimumdur.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            Stabilite Özeti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-sm text-muted-foreground">GM (Temel)</div>
              <div className="font-bold text-lg">{calculations.gm_primary.toFixed(3)} m</div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-sm text-muted-foreground">GM (Düzeltilmiş)</div>
              <div className="font-bold text-lg">{calculations.gm_corrected.toFixed(3)} m</div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-sm text-muted-foreground">GZ ({heelAngle}°)</div>
              <div className="font-bold text-lg">{calculations.gz_small.toFixed(3)} m</div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-sm text-muted-foreground">RM</div>
              <div className="font-bold text-lg">{(calculations.rightingMoment/1000).toFixed(1)} MNm</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}