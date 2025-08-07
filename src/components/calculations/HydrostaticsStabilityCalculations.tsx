import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Ship, Shield, AlertTriangle, Waves, CheckCircle, BarChart3, Target, Zap, Anchor } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { HydrostaticCalculations } from "../../services/hydrostaticCalculations";
import {
  ShipGeometry,
  WeightDistribution,
  TankData,
  CompartmentAnalysis,
  StabilityAnalysis
} from "../../types/hydrostatic";

export const HydrostaticsStabilityCalculations = () => {
  const { toast } = useToast();
  
  // Comprehensive hydrostatic calculation states
  const [geometry, setGeometry] = useState<ShipGeometry>({
    length: 100,
    breadth: 20,
    depth: 10,
    draft: 6,
    blockCoefficient: 0.7,
    waterplaneCoefficient: 0.8,
    midshipCoefficient: 0.9,
    prismaticCoefficient: 0.65,
    verticalPrismaticCoefficient: 0.75
  });

  const [kg, setKg] = useState<number>(5);
  const [weightDistribution, setWeightDistribution] = useState<WeightDistribution[]>([
    { item: 'Hull', weight: 1000, lcg: 50, vcg: 5, tcg: 0, moment: 50000 },
    { item: 'Machinery', weight: 500, lcg: 30, vcg: 3, tcg: 0, moment: 15000 },
    { item: 'Cargo', weight: 2000, lcg: 60, vcg: 8, tcg: 0, moment: 120000 }
  ]);

  const [tanks, setTanks] = useState<TankData[]>([
    {
      name: 'Fuel Tank 1',
      capacity: 100,
      currentVolume: 50,
      lcg: 20,
      vcg: 2,
      tcg: 5,
      freeSurfaceEffect: 0.1,
      fluidDensity: 0.85
    },
    {
      name: 'Ballast Tank 1',
      capacity: 200,
      currentVolume: 100,
      lcg: 80,
      vcg: 1,
      tcg: -3,
      freeSurfaceEffect: 0.05,
      fluidDensity: 1.025
    }
  ]);

  const [floodedCompartments, setFloodedCompartments] = useState<CompartmentAnalysis[]>([]);
  const [grainShiftMoment, setGrainShiftMoment] = useState<number>(0);
  const [grainHeelAngle, setGrainHeelAngle] = useState<number>(0);

  const [analysis, setAnalysis] = useState<StabilityAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<string>('hydrostatic');

  // State for different calculation sections
  const [displacementInputs, setDisplacementInputs] = useState({
    volume: "", waterDensity: "1.025"
  });
  const [displacementResult, setDisplacementResult] = useState<number | null>(null);

  const [draftInputs, setDraftInputs] = useState({
    volume: "", waterplaneArea: ""
  });
  const [draftResult, setDraftResult] = useState<number | null>(null);

  const [gmInputs, setGmInputs] = useState({
    kb: "", bm: "", kg: ""
  });
  const [gmResult, setGmResult] = useState<number | null>(null);

  const [gzInputs, setGzInputs] = useState({
    gm: "", angle: ""
  });
  const [gzResult, setGzResult] = useState<number | null>(null);

  const [trimInputs, setTrimInputs] = useState({
    ta: "", tf: "", length: ""
  });
  const [trimResult, setTrimResult] = useState<number | null>(null);

  const [listInputs, setListInputs] = useState({
    weight: "", distance: "", displacement: "", gm: ""
  });
  const [listResult, setListResult] = useState<number | null>(null);

  const [tpcInputs, setTpcInputs] = useState({
    waterplaneArea: "", density: "1.025"
  });
  const [tpcResult, setTpcResult] = useState<number | null>(null);

  const [lollInputs, setLollInputs] = useState({
    kg: "", km: ""
  });
  const [lollResult, setLollResult] = useState<number | null>(null);

  // Perform comprehensive analysis when inputs change
  useEffect(() => {
    if (geometry && kg && weightDistribution && tanks) {
      try {
        const result = HydrostaticCalculations.performStabilityAnalysis(
          geometry,
          kg,
          weightDistribution,
          tanks,
          floodedCompartments,
          grainShiftMoment,
          grainHeelAngle
        );
        setAnalysis(result);
      } catch (error) {
        console.error('Analysis error:', error);
      }
    }
  }, [geometry, kg, weightDistribution, tanks, floodedCompartments, grainShiftMoment, grainHeelAngle]);

  // Calculation functions
  const calculateDisplacement = () => {
    const v = parseFloat(displacementInputs.volume);
    const rho = parseFloat(displacementInputs.waterDensity);
    
    if (isNaN(v) || isNaN(rho)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const displacement = v * rho;
    setDisplacementResult(displacement);
    toast({ title: "Hesaplama Tamamlandı", description: `Deplasman: ${displacement.toFixed(2)} ton` });
  };

  const calculateDraft = () => {
    const v = parseFloat(draftInputs.volume);
    const awp = parseFloat(draftInputs.waterplaneArea);
    
    if (isNaN(v) || isNaN(awp)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const draft = v / awp;
    setDraftResult(draft);
    toast({ title: "Hesaplama Tamamlandı", description: `Draft: ${draft.toFixed(3)} m` });
  };

  const calculateGM = () => {
    const kb = parseFloat(gmInputs.kb);
    const bm = parseFloat(gmInputs.bm);
    const kg = parseFloat(gmInputs.kg);
    
    if (isNaN(kb) || isNaN(bm) || isNaN(kg)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const gm = kb + bm - kg;
    setGmResult(gm);
    const stability = gm > 0 ? "Pozitif (Stabil)" : "Negatif (Stabil değil)";
    toast({ title: "Hesaplama Tamamlandı", description: `GM: ${gm.toFixed(3)} m - ${stability}` });
  };

  const calculateGZ = () => {
    const gm = parseFloat(gzInputs.gm);
    const angle = parseFloat(gzInputs.angle);
    
    if (isNaN(gm) || isNaN(angle)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const angleRad = (angle * Math.PI) / 180;
    const gz = gm * Math.sin(angleRad);
    setGzResult(gz);
    toast({ title: "Hesaplama Tamamlandı", description: `GZ: ${gz.toFixed(4)} m` });
  };

  const calculateTrim = () => {
    const ta = parseFloat(trimInputs.ta);
    const tf = parseFloat(trimInputs.tf);
    const l = parseFloat(trimInputs.length);
    
    if (isNaN(ta) || isNaN(tf) || isNaN(l)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const trimAngle = Math.atan((ta - tf) / l) * (180 / Math.PI);
    setTrimResult(trimAngle);
    toast({ title: "Hesaplama Tamamlandı", description: `Trim Açısı: ${trimAngle.toFixed(4)}°` });
  };

  const calculateList = () => {
    const w = parseFloat(listInputs.weight);
    const d = parseFloat(listInputs.distance);
    const displacement = parseFloat(listInputs.displacement);
    const gm = parseFloat(listInputs.gm);
    
    if (isNaN(w) || isNaN(d) || isNaN(displacement) || isNaN(gm)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const listAngle = Math.atan((w * d) / (displacement * gm)) * (180 / Math.PI);
    setListResult(listAngle);
    toast({ title: "Hesaplama Tamamlandı", description: `List Açısı: ${listAngle.toFixed(4)}°` });
  };

  const calculateTPC = () => {
    const awp = parseFloat(tpcInputs.waterplaneArea);
    const rho = parseFloat(tpcInputs.density);
    
    if (isNaN(awp) || isNaN(rho)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const tpc = (awp * rho) / 100;
    setTpcResult(tpc);
    toast({ title: "Hesaplama Tamamlandı", description: `TPC: ${tpc.toFixed(2)} ton/cm` });
  };

  const calculateLoll = () => {
    const kg = parseFloat(lollInputs.kg);
    const km = parseFloat(lollInputs.km);
    
    if (isNaN(kg) || isNaN(km)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    if (kg >= km) {
      toast({ title: "Hata", description: "KG >= KM durumunda açı hesaplanamaz", variant: "destructive" });
      return;
    }
    
    const lollAngle = Math.acos(kg / km) * (180 / Math.PI);
    setLollResult(lollAngle);
    toast({ title: "Hesaplama Tamamlandı", description: `Loll Açısı: ${lollAngle.toFixed(2)}°` });
  };

  return (
    <div className="space-y-6">
      {/* Hidrostatik Hesaplamalar */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Waves className="h-5 w-5" />
            Hidrostatik Hesaplamalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Deplasman Hesaplama */}
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Deplasman Hesaplama (Δ = V × ρsw)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="volume">Hacim (m³)</Label>
                <Input
                  id="volume"
                  type="number"
                  placeholder="Hacim"
                  value={displacementInputs.volume}
                  onChange={(e) => setDisplacementInputs(prev => ({ ...prev, volume: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="density">Su Yoğunluğu (ton/m³)</Label>
                <Input
                  id="density"
                  type="number"
                  placeholder="1.025"
                  value={displacementInputs.waterDensity}
                  onChange={(e) => setDisplacementInputs(prev => ({ ...prev, waterDensity: e.target.value }))}
                />
              </div>
              <Button onClick={calculateDisplacement} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Hesapla
              </Button>
            </div>
            {displacementResult !== null && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-blue-500">
                <p className="font-mono text-lg">Deplasman = {displacementResult.toFixed(2)} ton</p>
              </div>
            )}
          </div>

          {/* Draft Hesaplama */}
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Draft Hesaplama (T = V / Awp)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="draft-volume">Hacim (m³)</Label>
                <Input
                  id="draft-volume"
                  type="number"
                  placeholder="Hacim"
                  value={draftInputs.volume}
                  onChange={(e) => setDraftInputs(prev => ({ ...prev, volume: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="waterplane">Su Hattı Alanı (m²)</Label>
                <Input
                  id="waterplane"
                  type="number"
                  placeholder="Awp"
                  value={draftInputs.waterplaneArea}
                  onChange={(e) => setDraftInputs(prev => ({ ...prev, waterplaneArea: e.target.value }))}
                />
              </div>
              <Button onClick={calculateDraft} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Hesapla
              </Button>
            </div>
            {draftResult !== null && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-blue-500">
                <p className="font-mono text-lg">Draft = {draftResult.toFixed(3)} m</p>
              </div>
            )}
          </div>

          {/* TPC Hesaplama */}
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">TPC Hesaplama (TPC = Awp × ρsw / 100)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="tpc-awp">Su Hattı Alanı (m²)</Label>
                <Input
                  id="tpc-awp"
                  type="number"
                  placeholder="Awp"
                  value={tpcInputs.waterplaneArea}
                  onChange={(e) => setTpcInputs(prev => ({ ...prev, waterplaneArea: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tpc-density">Su Yoğunluğu (ton/m³)</Label>
                <Input
                  id="tpc-density"
                  type="number"
                  placeholder="1.025"
                  value={tpcInputs.density}
                  onChange={(e) => setTpcInputs(prev => ({ ...prev, density: e.target.value }))}
                />
              </div>
              <Button onClick={calculateTPC} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Hesapla
              </Button>
            </div>
            {tpcResult !== null && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-blue-500">
                <p className="font-mono text-lg">TPC = {tpcResult.toFixed(2)} ton/cm</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Stabilite Hesaplamalar */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Shield className="h-5 w-5" />
            Stabilite Hesaplamalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* GM Hesaplama */}
          <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">GM Hesaplama (GM = KB + BM - KG)</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor="kb">KB (m)</Label>
                <Input
                  id="kb"
                  type="number"
                  placeholder="KB"
                  value={gmInputs.kb}
                  onChange={(e) => setGmInputs(prev => ({ ...prev, kb: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="bm">BM (m)</Label>
                <Input
                  id="bm"
                  type="number"
                  placeholder="BM"
                  value={gmInputs.bm}
                  onChange={(e) => setGmInputs(prev => ({ ...prev, bm: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="kg">KG (m)</Label>
                <Input
                  id="kg"
                  type="number"
                  placeholder="KG"
                  value={gmInputs.kg}
                  onChange={(e) => setGmInputs(prev => ({ ...prev, kg: e.target.value }))}
                />
              </div>
              <Button onClick={calculateGM} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Hesapla
              </Button>
            </div>
            {gmResult !== null && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-green-500">
                <p className="font-mono text-lg">GM = {gmResult.toFixed(3)} m</p>
                <p className="text-sm mt-1">
                  {gmResult > 0 ? 
                    <span className="text-green-600 dark:text-green-400">✓ Pozitif stabilite</span> : 
                    <span className="text-red-600 dark:text-red-400">⚠ Negatif stabilite</span>
                  }
                </p>
              </div>
            )}
          </div>

          {/* GZ Hesaplama */}
          <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">GZ Hesaplama (GZ = GM × sin(φ))</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="gz-gm">GM (m)</Label>
                <Input
                  id="gz-gm"
                  type="number"
                  placeholder="GM"
                  value={gzInputs.gm}
                  onChange={(e) => setGzInputs(prev => ({ ...prev, gm: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="angle">Açı (derece)</Label>
                <Input
                  id="angle"
                  type="number"
                  placeholder="Φ"
                  value={gzInputs.angle}
                  onChange={(e) => setGzInputs(prev => ({ ...prev, angle: e.target.value }))}
                />
              </div>
              <Button onClick={calculateGZ} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Hesapla
              </Button>
            </div>
            {gzResult !== null && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-green-500">
                <p className="font-mono text-lg">GZ = {gzResult.toFixed(4)} m</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Trim ve List Hesaplamalar */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <Ship className="h-5 w-5" />
            Trim ve List Hesaplamalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Trim Hesaplama */}
          <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Trim Açısı (Trim = arctan((Ta - Tf) / L))</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor="ta">Ta - Arka Draft (m)</Label>
                <Input
                  id="ta"
                  type="number"
                  placeholder="Ta"
                  value={trimInputs.ta}
                  onChange={(e) => setTrimInputs(prev => ({ ...prev, ta: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tf">Tf - Ön Draft (m)</Label>
                <Input
                  id="tf"
                  type="number"
                  placeholder="Tf"
                  value={trimInputs.tf}
                  onChange={(e) => setTrimInputs(prev => ({ ...prev, tf: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="length">Uzunluk (m)</Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="L"
                  value={trimInputs.length}
                  onChange={(e) => setTrimInputs(prev => ({ ...prev, length: e.target.value }))}
                />
              </div>
              <Button onClick={calculateTrim} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Hesapla
              </Button>
            </div>
            {trimResult !== null && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-orange-500">
                <p className="font-mono text-lg">Trim Açısı = {trimResult.toFixed(4)}°</p>
              </div>
            )}
          </div>

          {/* List Hesaplama */}
          <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">List Açısı (List = arctan(W × d / (Δ × GM)))</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <Label htmlFor="list-weight">Ağırlık (ton)</Label>
                <Input
                  id="list-weight"
                  type="number"
                  placeholder="W"
                  value={listInputs.weight}
                  onChange={(e) => setListInputs(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="distance">Mesafe (m)</Label>
                <Input
                  id="distance"
                  type="number"
                  placeholder="d"
                  value={listInputs.distance}
                  onChange={(e) => setListInputs(prev => ({ ...prev, distance: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="list-displacement">Deplasman (ton)</Label>
                <Input
                  id="list-displacement"
                  type="number"
                  placeholder="Δ"
                  value={listInputs.displacement}
                  onChange={(e) => setListInputs(prev => ({ ...prev, displacement: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="list-gm">GM (m)</Label>
                <Input
                  id="list-gm"
                  type="number"
                  placeholder="GM"
                  value={listInputs.gm}
                  onChange={(e) => setListInputs(prev => ({ ...prev, gm: e.target.value }))}
                />
              </div>
              <Button onClick={calculateList} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Hesapla
              </Button>
            </div>
            {listResult !== null && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-orange-500">
                <p className="font-mono text-lg">List Açısı = {listResult.toFixed(4)}°</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Kritik Açılar */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertTriangle className="h-5 w-5" />
            Kritik Açı Hesaplamalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Loll Açısı Hesaplama */}
          <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Loll Açısı (φloll = arccos(KG / KM))</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="loll-kg">KG (m)</Label>
                <Input
                  id="loll-kg"
                  type="number"
                  placeholder="KG"
                  value={lollInputs.kg}
                  onChange={(e) => setLollInputs(prev => ({ ...prev, kg: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="loll-km">KM (m)</Label>
                <Input
                  id="loll-km"
                  type="number"
                  placeholder="KM"
                  value={lollInputs.km}
                  onChange={(e) => setLollInputs(prev => ({ ...prev, km: e.target.value }))}
                />
              </div>
              <Button onClick={calculateLoll} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Hesapla
              </Button>
            </div>
            {lollResult !== null && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-red-500">
                <p className="font-mono text-lg">Loll Açısı = {lollResult.toFixed(2)}°</p>
                <p className="text-sm mt-1 text-red-600 dark:text-red-400">⚠ GM {'<'} 0 durumunda geçerli</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Kapsamlı Hidrostatik ve Stabilite Analizi */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <BarChart3 className="h-5 w-5" />
            Kapsamlı Hidrostatik ve Stabilite Analizi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis && (
            <div className="space-y-6">
              {/* Gemi Geometrisi */}
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Ship className="h-4 w-4" />
                  Gemi Geometrisi
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="length">Uzunluk (m)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={geometry.length}
                      onChange={(e) => setGeometry({ ...geometry, length: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="breadth">Genişlik (m)</Label>
                    <Input
                      id="breadth"
                      type="number"
                      value={geometry.breadth}
                      onChange={(e) => setGeometry({ ...geometry, breadth: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="depth">Derinlik (m)</Label>
                    <Input
                      id="depth"
                      type="number"
                      value={geometry.depth}
                      onChange={(e) => setGeometry({ ...geometry, depth: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="draft">Draft (m)</Label>
                    <Input
                      id="draft"
                      type="number"
                      value={geometry.draft}
                      onChange={(e) => setGeometry({ ...geometry, draft: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* KG Ayarlaması */}
              <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  KG Ayarlaması
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="kg">KG (m)</Label>
                    <Input
                      id="kg"
                      type="number"
                      value={kg}
                      onChange={(e) => setKg(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Hidrostatik Sonuçlar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Waves className="h-4 w-4" />
                    Hidrostatik Sonuçlar
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Deplasman:</span>
                      <span className="font-medium">{analysis.hydrostatic.displacement.toFixed(2)} t</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hacim Deplasmanı:</span>
                      <span className="font-medium">{analysis.hydrostatic.volumeDisplacement.toFixed(2)} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Su Hattı Alanı:</span>
                      <span className="font-medium">{analysis.hydrostatic.waterplaneArea.toFixed(2)} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Batık Hacim:</span>
                      <span className="font-medium">{analysis.hydrostatic.immersedVolume.toFixed(2)} m³</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Merkez Noktaları
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>LCB:</span>
                      <span className="font-medium">{analysis.centers.lcb.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VCB:</span>
                      <span className="font-medium">{analysis.centers.vcb.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LCF:</span>
                      <span className="font-medium">{analysis.centers.lcf.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>KB:</span>
                      <span className="font-medium">{analysis.centers.kb.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>KM:</span>
                      <span className="font-medium">{analysis.centers.km.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>BM:</span>
                      <span className="font-medium">{analysis.centers.bm.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>KG:</span>
                      <span className="font-medium">{analysis.centers.kg.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GM:</span>
                      <span className="font-medium">{analysis.centers.gm.toFixed(3)} m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stabilite Analizi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Stabilite Verileri
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>GM:</span>
                      <span className="font-medium">{analysis.stability.gm.toFixed(3)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maksimum GZ:</span>
                      <span className="font-medium">{analysis.stability.maxGz.toFixed(3)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maksimum GZ Açısı:</span>
                      <span className="font-medium">{analysis.stability.maxGzAngle.toFixed(1)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kaybolma Açısı:</span>
                      <span className="font-medium">{analysis.stability.vanishingAngle.toFixed(1)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Güverte Kenar Açısı:</span>
                      <span className="font-medium">{analysis.stability.deckEdgeAngle.toFixed(1)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Su Alma Açısı:</span>
                      <span className="font-medium">{analysis.stability.downfloodingAngle.toFixed(1)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eşitlenme Açısı:</span>
                      <span className="font-medium">{analysis.stability.equalizedAngle.toFixed(1)}°</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    IMO Kriterleri
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>0-30° Alan:</span>
                      <span className={`font-medium ${analysis.imoCriteria.area0to30 >= 0.055 ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.imoCriteria.area0to30.toFixed(3)} m-rad
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>0-40° Alan:</span>
                      <span className={`font-medium ${analysis.imoCriteria.area0to40 >= 0.090 ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.imoCriteria.area0to40.toFixed(3)} m-rad
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>30-40° Alan:</span>
                      <span className={`font-medium ${analysis.imoCriteria.area30to40 >= 0.030 ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.imoCriteria.area30to40.toFixed(3)} m-rad
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maksimum GZ:</span>
                      <span className={`font-medium ${analysis.imoCriteria.maxGz >= 0.20 ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.imoCriteria.maxGz.toFixed(3)} m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Başlangıç GM:</span>
                      <span className={`font-medium ${analysis.imoCriteria.initialGM >= 0.15 ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.imoCriteria.initialGM.toFixed(3)} m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>IMO Uygunluğu:</span>
                      <span className={`font-medium ${analysis.imoCriteria.compliance ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.imoCriteria.compliance ? 'Uygun' : 'Uygun Değil'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dinamik Stabilite */}
              <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Dinamik Stabilite
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Yalpa Periyodu:</span>
                    <span className="font-medium">{analysis.dynamicStability.rollingPeriod.toFixed(2)} s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doğal Periyot:</span>
                    <span className="font-medium">{analysis.dynamicStability.naturalPeriod.toFixed(2)} s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stabilite İndeksi:</span>
                    <span className="font-medium">{analysis.dynamicStability.stabilityIndex.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Güvenlik Marjı:</span>
                    <span className="font-medium">{analysis.dynamicStability.safetyMargin.toFixed(1)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rezonans Kontrolü:</span>
                    <span className={`font-medium ${analysis.dynamicStability.resonanceCheck ? 'text-red-600' : 'text-green-600'}`}>
                      {analysis.dynamicStability.resonanceCheck ? 'Rezonans Riski' : 'Güvenli'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stabilite Aralığı:</span>
                    <span className="font-medium">{analysis.dynamicStability.stabilityRange.toFixed(1)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stabilite Kalitesi:</span>
                    <span className="font-medium">{analysis.dynamicStability.stabilityQuality.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GM Standartları:</span>
                    <span className="font-medium">{analysis.dynamicStability.gmStandards.toFixed(3)} m</span>
                  </div>
                </div>
              </div>

              {/* GZ Eğrisi Görselleştirme */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  GZ Eğrisi (0-30°)
                </h4>
                <div className="h-48 bg-white dark:bg-gray-600 rounded flex items-end justify-center p-4">
                  <div className="flex items-end space-x-1">
                    {analysis.stability.gz.slice(0, 31).map((gz, index) => (
                      <div
                        key={index}
                        className="bg-blue-500 rounded-t"
                        style={{
                          width: '4px',
                          height: `${(gz / analysis.stability.maxGz) * 160}px`
                        }}
                        title={`${index}°: ${gz.toFixed(3)}m`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-center text-sm text-gray-600">
                  GZ Değerleri (0-30°)
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};