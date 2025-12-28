import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ship, 
  Calculator, 
  Scale, 
  Waves, 
  Target, 
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Move3d
} from "lucide-react";
import { Ship3DVisualization } from "./Ship3DVisualization";

// GM Calculator Component
export const GMCalculator = () => {
  const [keel, setKeel] = useState<number>(6);
  const [buoyancyCenter, setBuoyancyCenter] = useState<number>(3.5);
  const [metacenter, setMetacenter] = useState<number>(7.2);
  const [gravityCenter, setGravityCenter] = useState<number>(5.8);
  
  const bm = metacenter - buoyancyCenter;
  const kg = gravityCenter;
  const km = metacenter;
  const gm = km - kg;
  
  const getStabilityStatus = () => {
    if (gm > 1.5) return { status: "Çok İyi", color: "bg-green-500" };
    if (gm > 0.5) return { status: "Normal", color: "bg-blue-500" };
    if (gm > 0) return { status: "Düşük", color: "bg-yellow-500" };
    return { status: "Kritik!", color: "bg-red-500" };
  };

  const stabilityStatus = getStabilityStatus();

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-5 w-5 text-primary" />
          GM Hesaplama Aracı
        </CardTitle>
        <CardDescription className="text-xs">Metasantrik yüksekliği interaktif olarak hesaplayın</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Keel Noktası (K) - metre</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[keel]}
                  onValueChange={(v) => setKeel(v[0])}
                  min={0}
                  max={10}
                  step={0.1}
                  className="flex-1"
                />
                <span className="w-10 text-right font-mono text-sm">{keel.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs">Buoyancy Center (B) - metre</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[buoyancyCenter]}
                  onValueChange={(v) => setBuoyancyCenter(v[0])}
                  min={0}
                  max={10}
                  step={0.1}
                  className="flex-1"
                />
                <span className="w-10 text-right font-mono text-sm">{buoyancyCenter.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs">Metacenter (M) - metre</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[metacenter]}
                  onValueChange={(v) => setMetacenter(v[0])}
                  min={0}
                  max={12}
                  step={0.1}
                  className="flex-1"
                />
                <span className="w-10 text-right font-mono text-sm">{metacenter.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs">Gravity Center (G) - metre</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[gravityCenter]}
                  onValueChange={(v) => setGravityCenter(v[0])}
                  min={0}
                  max={10}
                  step={0.1}
                  className="flex-1"
                />
                <span className="w-10 text-right font-mono text-sm">{gravityCenter.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 space-y-3">
            <h4 className="font-semibold text-sm">Hesaplama Sonuçları</h4>
            
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">KM:</span>
                <span className="font-mono font-bold">{km.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">KG:</span>
                <span className="font-mono font-bold">{kg.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">BM:</span>
                <span className="font-mono font-bold">{bm.toFixed(2)} m</span>
              </div>
              <hr className="my-2 border-border/50" />
              <div className="flex justify-between items-center">
                <span className="font-bold">GM:</span>
                <span className="font-mono font-bold text-lg text-primary">{gm.toFixed(2)} m</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={stabilityStatus.color}>{stabilityStatus.status}</Badge>
              <span className="text-xs text-muted-foreground">
                {gm > 0 ? "Gemi stabil" : "Gemi unstabil!"}
              </span>
            </div>
            
            <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/30">
              <p><strong>Formül:</strong> GM = KM - KG</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Free Surface Effect Calculator
export const FreeSurfaceCalculator = () => {
  const [tankLength, setTankLength] = useState<number>(20);
  const [tankBreadth, setTankBreadth] = useState<number>(15);
  const [liquidDensity, setLiquidDensity] = useState<number>(1.025);
  const [displacement, setDisplacement] = useState<number>(15000);
  
  const fse = (tankLength * Math.pow(tankBreadth, 3) * liquidDensity) / (12 * displacement);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Waves className="h-5 w-5 text-primary" />
          Serbest Yüzey Etkisi (FSE)
        </CardTitle>
        <CardDescription className="text-xs">Tank boyutlarına göre FSE değerini hesaplayın</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Tank Uzunluğu (l) - m</Label>
            <Input
              type="number"
              value={tankLength}
              onChange={(e) => setTankLength(parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">Tank Genişliği (b) - m</Label>
            <Input
              type="number"
              value={tankBreadth}
              onChange={(e) => setTankBreadth(parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">Sıvı Yoğunluğu (ρ) - t/m³</Label>
            <Input
              type="number"
              step="0.001"
              value={liquidDensity}
              onChange={(e) => setLiquidDensity(parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">Deplassman (Δ) - ton</Label>
            <Input
              type="number"
              value={displacement}
              onChange={(e) => setDisplacement(parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Serbest Yüzey Etkisi</p>
            <p className="text-2xl font-bold text-primary">{fse.toFixed(4)} m</p>
          </div>
          
          <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                Bu tank nedeniyle GM {fse.toFixed(4)} m azalır
              </p>
            </div>
          </div>
          
          <p className="text-[10px] text-muted-foreground mt-2">
            <strong>Formül:</strong> FSE = (l × b³ × ρ) / (12 × Δ)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Weight Shift Calculator
export const WeightShiftCalculator = () => {
  const [weight, setWeight] = useState<number>(50);
  const [distance, setDistance] = useState<number>(10);
  const [displacement, setDisplacement] = useState<number>(12000);
  const [originalGM, setOriginalGM] = useState<number>(0.8);
  
  const gg1 = (weight * distance) / displacement;
  const heelAngleRad = Math.atan(gg1 / originalGM);
  const heelAngleDeg = heelAngleRad * (180 / Math.PI);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Scale className="h-5 w-5 text-primary" />
          Ağırlık Kaydırma
        </CardTitle>
        <CardDescription className="text-xs">Ağırlık kaydırmanın meyil etkisini hesaplayın</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Ağırlık (w) - ton</Label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">Mesafe (d) - m</Label>
            <Input
              type="number"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">Deplassman (W) - ton</Label>
            <Input
              type="number"
              value={displacement}
              onChange={(e) => setDisplacement(parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">Mevcut GM - m</Label>
            <Input
              type="number"
              step="0.1"
              value={originalGM}
              onChange={(e) => setOriginalGM(parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">G Kayması (GG₁):</span>
            <span className="font-mono font-bold text-primary">{gg1.toFixed(4)} m</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Meyil Açısı (θ):</span>
            <span className="font-mono font-bold text-primary">{heelAngleDeg.toFixed(2)}°</span>
          </div>
          
          <div className={`mt-2 rounded p-2 ${heelAngleDeg > 5 ? 'bg-red-500/10 border border-red-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
            <div className="flex items-center gap-2">
              {heelAngleDeg > 5 ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              <span className={`text-xs ${heelAngleDeg > 5 ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                {heelAngleDeg > 5 ? 'Yüksek meyil!' : 'Kabul edilebilir'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// IMO Criteria Checker
export const IMOCriteriaChecker = () => {
  const [area30, setArea30] = useState<number>(0.06);
  const [area40, setArea40] = useState<number>(0.1);
  const [area3040, setArea3040] = useState<number>(0.035);
  const [gz30, setGz30] = useState<number>(0.22);
  const [gm0, setGm0] = useState<number>(0.18);
  
  const criteria = [
    { name: "0°-30° Alan", value: area30, min: 0.055, unit: "m·rad", passed: area30 >= 0.055 },
    { name: "0°-40° Alan", value: area40, min: 0.09, unit: "m·rad", passed: area40 >= 0.09 },
    { name: "30°-40° Alan", value: area3040, min: 0.03, unit: "m·rad", passed: area3040 >= 0.03 },
    { name: "GZ @ 30°", value: gz30, min: 0.2, unit: "m", passed: gz30 >= 0.2 },
    { name: "GM₀", value: gm0, min: 0.15, unit: "m", passed: gm0 >= 0.15 },
  ];
  
  const allPassed = criteria.every(c => c.passed);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-5 w-5 text-primary" />
          IMO Kriter Kontrolü
        </CardTitle>
        <CardDescription className="text-xs">GZ değerlerini girin ve IMO kriterlerini kontrol edin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px]">0°-30° Alan</Label>
            <Input
              type="number"
              step="0.001"
              value={area30}
              onChange={(e) => setArea30(parseFloat(e.target.value) || 0)}
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">0°-40° Alan</Label>
            <Input
              type="number"
              step="0.001"
              value={area40}
              onChange={(e) => setArea40(parseFloat(e.target.value) || 0)}
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">30°-40° Alan</Label>
            <Input
              type="number"
              step="0.001"
              value={area3040}
              onChange={(e) => setArea3040(parseFloat(e.target.value) || 0)}
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">GZ @ 30°</Label>
            <Input
              type="number"
              step="0.01"
              value={gz30}
              onChange={(e) => setGz30(parseFloat(e.target.value) || 0)}
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">GM₀</Label>
            <Input
              type="number"
              step="0.01"
              value={gm0}
              onChange={(e) => setGm0(parseFloat(e.target.value) || 0)}
              className="h-7 text-xs"
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          {criteria.map((c, i) => (
            <div key={i} className={`flex items-center justify-between p-1.5 rounded text-xs ${c.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <div className="flex items-center gap-1.5">
                {c.passed ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                )}
                <span>{c.name}</span>
              </div>
              <span className="font-mono">{c.value.toFixed(3)} (≥{c.min})</span>
            </div>
          ))}
        </div>
        
        <div className={`p-2 rounded ${allPassed ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
          <div className="flex items-center gap-2">
            {allPassed ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs font-bold ${allPassed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {allPassed ? 'Tüm kriterler sağlanıyor' : 'Bazı kriterler sağlanmıyor!'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Interactive Ship Visualization
export const ShipVisualization = () => {
  const [heelAngle, setHeelAngle] = useState<number>(0);
  const [trimAngle, setTrimAngle] = useState<number>(0);
  
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Ship className="h-5 w-5 text-primary" />
          İnteraktif Gemi Simülasyonu
        </CardTitle>
        <CardDescription className="text-xs">Meyil ve trim etkilerini görsel olarak inceleyin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Meyil (Heel): {heelAngle}°</Label>
              <Slider
                value={[heelAngle]}
                onValueChange={(v) => setHeelAngle(v[0])}
                min={-45}
                max={45}
                step={1}
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs">Trim: {trimAngle}°</Label>
              <Slider
                value={[trimAngle]}
                onValueChange={(v) => setTrimAngle(v[0])}
                min={-10}
                max={10}
                step={0.5}
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => { setHeelAngle(0); setTrimAngle(0); }}
              className="w-full h-7 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Sıfırla
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center min-h-[140px]">
            <div className="relative w-40 h-40 border-2 border-dashed border-muted-foreground/30 rounded-full flex items-center justify-center">
              {/* Water line */}
              <div className="absolute w-full h-0.5 bg-blue-500/50" style={{ top: '50%' }} />
              
              {/* Ship */}
              <div 
                className="relative transition-transform duration-300"
                style={{ 
                  transform: `rotate(${heelAngle}deg) skewY(${trimAngle}deg)`,
                }}
              >
                <div className="w-24 h-12 bg-gradient-to-b from-muted to-muted-foreground/20 rounded-t-lg border-2 border-foreground/20">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1.5 h-6 bg-foreground/30 rounded" />
                </div>
                <div className="w-24 h-6 bg-gradient-to-b from-red-500/60 to-red-700/60 rounded-b-3xl border-2 border-t-0 border-foreground/20" />
              </div>
              
              <div className="absolute top-1 right-1 text-[10px] font-mono bg-background/80 px-1 rounded">
                {heelAngle}°
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`p-2 rounded ${Math.abs(heelAngle) > 15 ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
            <p className="font-semibold">Meyil</p>
            <p className="text-muted-foreground">
              {Math.abs(heelAngle) <= 5 ? 'Normal' : 
               Math.abs(heelAngle) <= 15 ? 'Dikkat' : 'Tehlikeli!'}
            </p>
          </div>
          <div className={`p-2 rounded ${Math.abs(trimAngle) > 5 ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
            <p className="font-semibold">Trim</p>
            <p className="text-muted-foreground">
              {trimAngle > 0 ? 'Baş Trim' : trimAngle < 0 ? 'Kıç Trim' : 'Düz'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Interactive Tools Panel
export const InteractiveStabilityTools = () => {
  return (
    <Tabs defaultValue="simulation" className="w-full">
      <TabsList className="grid w-full grid-cols-5 h-auto">
        <TabsTrigger value="simulation" className="text-xs py-1.5 px-1">
          <Ship className="h-3 w-3 mr-1 hidden sm:inline" />
          Simülasyon
        </TabsTrigger>
        <TabsTrigger value="gm" className="text-xs py-1.5 px-1">
          <Calculator className="h-3 w-3 mr-1 hidden sm:inline" />
          GM
        </TabsTrigger>
        <TabsTrigger value="fse" className="text-xs py-1.5 px-1">
          <Waves className="h-3 w-3 mr-1 hidden sm:inline" />
          FSE
        </TabsTrigger>
        <TabsTrigger value="weight" className="text-xs py-1.5 px-1">
          <Scale className="h-3 w-3 mr-1 hidden sm:inline" />
          Ağırlık
        </TabsTrigger>
        <TabsTrigger value="imo" className="text-xs py-1.5 px-1">
          <Target className="h-3 w-3 mr-1 hidden sm:inline" />
          IMO
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="simulation" className="mt-3">
        <Ship3DVisualization />
      </TabsContent>
      
      <TabsContent value="gm" className="mt-3">
        <GMCalculator />
      </TabsContent>
      
      <TabsContent value="fse" className="mt-3">
        <FreeSurfaceCalculator />
      </TabsContent>
      
      <TabsContent value="weight" className="mt-3">
        <WeightShiftCalculator />
      </TabsContent>
      
      <TabsContent value="imo" className="mt-3">
        <IMOCriteriaChecker />
      </TabsContent>
    </Tabs>
  );
};

export default InteractiveStabilityTools;
