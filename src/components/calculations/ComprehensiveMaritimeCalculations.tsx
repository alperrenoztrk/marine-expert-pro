import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Ship, Shield, AlertTriangle, Waves, CheckCircle, BarChart3, Target, Zap, Anchor } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ComprehensiveMaritimeCalculations = () => {
  const { toast } = useToast();

  // 1. Hogging/Sagging Detection
  const [hoggingSaggingInputs, setHoggingSaggingInputs] = useState({
    draftForward: "", draftAft: "", draftMidship: ""
  });
  const [hoggingSaggingResult, setHoggingSaggingResult] = useState<{type: string, difference: number} | null>(null);

  // 2. GM ve KG Hesapları
  const [gmInputs, setGmInputs] = useState({
    kb: "", bm: "", kg: ""
  });
  const [gmResult, setGmResult] = useState<number | null>(null);

  const [newKGInputs, setNewKGInputs] = useState({
    totalMoment: "", totalWeight: ""
  });
  const [newKGResult, setNewKGResult] = useState<number | null>(null);

  const [heelAngleInputs, setHeelAngleInputs] = useState({
    gz: "", gm: "", heelingMoment: "", displacement: ""
  });
  const [heelAngleResult, setHeelAngleResult] = useState<number | null>(null);

  const [craneGMInputs, setCraneGMInputs] = useState({
    weight: "", leverArm: "", displacement: ""
  });
  const [craneGMResult, setCraneGMResult] = useState<number | null>(null);

  const [drydockGMInputs, setDrydockGMInputs] = useState({
    pressure: "", km: "", displacement: ""
  });
  const [drydockGMResult, setDrydockGMResult] = useState<number | null>(null);

  // 3. Boyuna Denge Hesapları
  const [trimChangeInputs, setTrimChangeInputs] = useState({
    totalMoment: "", mct: ""
  });
  const [trimChangeResult, setTrimChangeResult] = useState<number | null>(null);

  const [parallelSinkageInputs, setParallelSinkageInputs] = useState({
    loadedWeight: "", tpc: ""
  });
  const [parallelSinkageResult, setParallelSinkageResult] = useState<number | null>(null);

  const [draftCorrectionInputs, setDraftCorrectionInputs] = useState({
    trim: "", distance: "", lbp: ""
  });
  const [draftCorrectionResult, setDraftCorrectionResult] = useState<number | null>(null);

  // 4. Draft Survey
  const [mmmDraftInputs, setMmmDraftInputs] = useState({
    draftForward: "", draftAft: "", draftMidship: ""
  });
  const [mmmDraftResult, setMmmDraftResult] = useState<number | null>(null);

  const [trimCorrection1Inputs, setTrimCorrection1Inputs] = useState({
    trim: "", lcf: "", tpc: "", lbp: ""
  });
  const [trimCorrection1Result, setTrimCorrection1Result] = useState<number | null>(null);

  const [trimCorrection2Inputs, setTrimCorrection2Inputs] = useState({
    trim: "", mct: "", lbp: ""
  });
  const [trimCorrection2Result, setTrimCorrection2Result] = useState<number | null>(null);

  const [densityCorrectionInputs, setDensityCorrectionInputs] = useState({
    displacement: "", actualDensity: "1.025"
  });
  const [densityCorrectionResult, setDensityCorrectionResult] = useState<number | null>(null);

  // 5. Duba ve Yoğunluk Hesapları
  const [blockCoefficientInputs, setBlockCoefficientInputs] = useState({
    volume: "", length: "", breadth: "", draft: ""
  });
  const [blockCoefficientResult, setBlockCoefficientResult] = useState<number | null>(null);

  const [fwaInputs, setFwaInputs] = useState({
    displacement: "", tpc: ""
  });
  const [fwaResult, setFwaResult] = useState<number | null>(null);

  const [densityChangeInputs, setDensityChangeInputs] = useState({
    displacement: "", newDensity: "", oldDensity: "1.025"
  });
  const [densityChangeResult, setDensityChangeResult] = useState<number | null>(null);

  // 6. SOLAS Stabilite Kriterleri
  const [grainHeelInputs, setGrainHeelInputs] = useState({
    ghm: "", displacement: "", gm: ""
  });
  const [grainHeelResult, setGrainHeelResult] = useState<number | null>(null);

  const [gzLeverInputs, setGzLeverInputs] = useState({
    kn: "", kg: "", angle: ""
  });
  const [gzLeverResult, setGzLeverResult] = useState<number | null>(null);

  const [freeSurfaceInputs, setFreeSurfaceInputs] = useState({
    length: "", breadth: "", volume: ""
  });
  const [freeSurfaceResult, setFreeSurfaceResult] = useState<number | null>(null);

  const [rollPeriodInputs, setRollPeriodInputs] = useState({
    cb: "", breadth: "", gm: ""
  });
  const [rollPeriodResult, setRollPeriodResult] = useState<number | null>(null);

  // 7. Yük Hesapları
  const [loadHeightInputs, setLoadHeightInputs] = useState({
    sf: "", pl: ""
  });
  const [loadHeightResult, setLoadHeightResult] = useState<number | null>(null);

  const [temperatureDensityInputs, setTemperatureDensityInputs] = useState({
    oldDensity: "", oldTemperature: "", newTemperature: "", coefficient: "0.0007"
  });
  const [temperatureDensityResult, setTemperatureDensityResult] = useState<number | null>(null);

  // Calculation Functions

  // 1. Hogging/Sagging Detection
  const calculateHoggingSagging = () => {
    const dF = parseFloat(hoggingSaggingInputs.draftForward);
    const dA = parseFloat(hoggingSaggingInputs.draftAft);
    const dM = parseFloat(hoggingSaggingInputs.draftMidship);
    
    if (isNaN(dF) || isNaN(dA) || isNaN(dM)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const meanDraft = (dF + dA) / 2;
    const difference = dM - meanDraft;
    const type = difference > 0 ? "Hogging" : "Sagging";
    
    setHoggingSaggingResult({ type, difference: Math.abs(difference) });
    toast({ title: "Hesaplama Tamamlandı", description: `${type}: ${Math.abs(difference).toFixed(3)} m` });
  };

  // 2. GM Calculation
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

  // New KG Calculation
  const calculateNewKG = () => {
    const totalMoment = parseFloat(newKGInputs.totalMoment);
    const totalWeight = parseFloat(newKGInputs.totalWeight);
    
    if (isNaN(totalMoment) || isNaN(totalWeight) || totalWeight === 0) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const newKG = totalMoment / totalWeight;
    setNewKGResult(newKG);
    toast({ title: "Hesaplama Tamamlandı", description: `Yeni KG: ${newKG.toFixed(3)} m` });
  };

  // Heel Angle Calculation
  const calculateHeelAngle = () => {
    const gz = parseFloat(heelAngleInputs.gz);
    const gm = parseFloat(heelAngleInputs.gm);
    const heelingMoment = parseFloat(heelAngleInputs.heelingMoment);
    const displacement = parseFloat(heelAngleInputs.displacement);
    
    if (gz && gm) {
      const angle = Math.atan(gz / gm) * (180 / Math.PI);
      setHeelAngleResult(angle);
      toast({ title: "Hesaplama Tamamlandı", description: `Meyil Açısı: ${angle.toFixed(2)}°` });
    } else if (heelingMoment && displacement && gm) {
      const angle = Math.atan(heelingMoment / (displacement * gm)) * (180 / Math.PI);
      setHeelAngleResult(angle);
      toast({ title: "Hesaplama Tamamlandı", description: `Meyil Açısı: ${angle.toFixed(2)}°` });
    } else {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
    }
  };

  // Crane GM Change
  const calculateCraneGM = () => {
    const weight = parseFloat(craneGMInputs.weight);
    const leverArm = parseFloat(craneGMInputs.leverArm);
    const displacement = parseFloat(craneGMInputs.displacement);
    
    if (isNaN(weight) || isNaN(leverArm) || isNaN(displacement)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const gmChange = (weight * leverArm) / displacement;
    setCraneGMResult(gmChange);
    toast({ title: "Hesaplama Tamamlandı", description: `GM Değişimi: ${gmChange.toFixed(3)} m` });
  };

  // Drydock Critical GM
  const calculateDrydockGM = () => {
    const pressure = parseFloat(drydockGMInputs.pressure);
    const km = parseFloat(drydockGMInputs.km);
    const displacement = parseFloat(drydockGMInputs.displacement);
    
    if (isNaN(pressure) || isNaN(km) || isNaN(displacement)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const criticalGM = (pressure * km) / displacement;
    setDrydockGMResult(criticalGM);
    toast({ title: "Hesaplama Tamamlandı", description: `Kritik GM: ${criticalGM.toFixed(3)} m` });
  };

  // 3. Trim Change
  const calculateTrimChange = () => {
    const totalMoment = parseFloat(trimChangeInputs.totalMoment);
    const mct = parseFloat(trimChangeInputs.mct);
    
    if (isNaN(totalMoment) || isNaN(mct)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const trimChange = totalMoment / mct;
    setTrimChangeResult(trimChange);
    toast({ title: "Hesaplama Tamamlandı", description: `Trim Değişimi: ${trimChange.toFixed(2)} cm` });
  };

  // Parallel Sinkage
  const calculateParallelSinkage = () => {
    const loadedWeight = parseFloat(parallelSinkageInputs.loadedWeight);
    const tpc = parseFloat(parallelSinkageInputs.tpc);
    
    if (isNaN(loadedWeight) || isNaN(tpc)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const sinkage = loadedWeight / tpc;
    setParallelSinkageResult(sinkage);
    toast({ title: "Hesaplama Tamamlandı", description: `Paralel Batma: ${sinkage.toFixed(2)} cm` });
  };

  // Draft Correction
  const calculateDraftCorrection = () => {
    const trim = parseFloat(draftCorrectionInputs.trim);
    const distance = parseFloat(draftCorrectionInputs.distance);
    const lbp = parseFloat(draftCorrectionInputs.lbp);
    
    if (isNaN(trim) || isNaN(distance) || isNaN(lbp)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const correction = (trim * distance) / lbp;
    setDraftCorrectionResult(correction);
    toast({ title: "Hesaplama Tamamlandı", description: `Draft Düzeltmesi: ${correction.toFixed(3)} m` });
  };

  // 4. MMM Draft
  const calculateMMMDraft = () => {
    const dF = parseFloat(mmmDraftInputs.draftForward);
    const dA = parseFloat(mmmDraftInputs.draftAft);
    const dM = parseFloat(mmmDraftInputs.draftMidship);
    
    if (isNaN(dF) || isNaN(dA) || isNaN(dM)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const mmm = (dF + dA + 6 * dM) / 8;
    setMmmDraftResult(mmm);
    toast({ title: "Hesaplama Tamamlandı", description: `MMM Draft: ${mmm.toFixed(3)} m` });
  };

  // Trim Correction 1
  const calculateTrimCorrection1 = () => {
    const trim = parseFloat(trimCorrection1Inputs.trim);
    const lcf = parseFloat(trimCorrection1Inputs.lcf);
    const tpc = parseFloat(trimCorrection1Inputs.tpc);
    const lbp = parseFloat(trimCorrection1Inputs.lbp);
    
    if (isNaN(trim) || isNaN(lcf) || isNaN(tpc) || isNaN(lbp)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const correction = (trim * lcf * tpc * 100) / lbp;
    setTrimCorrection1Result(correction);
    toast({ title: "Hesaplama Tamamlandı", description: `1. Trim Düzeltmesi: ${correction.toFixed(2)} ton` });
  };

  // Trim Correction 2
  const calculateTrimCorrection2 = () => {
    const trim = parseFloat(trimCorrection2Inputs.trim);
    const mct = parseFloat(trimCorrection2Inputs.mct);
    const lbp = parseFloat(trimCorrection2Inputs.lbp);
    
    if (isNaN(trim) || isNaN(mct) || isNaN(lbp)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const correction = (Math.pow(trim, 2) * mct * 50) / lbp;
    setTrimCorrection2Result(correction);
    toast({ title: "Hesaplama Tamamlandı", description: `2. Trim Düzeltmesi: ${correction.toFixed(2)} ton` });
  };

  // Density Correction
  const calculateDensityCorrection = () => {
    const displacement = parseFloat(densityCorrectionInputs.displacement);
    const actualDensity = parseFloat(densityCorrectionInputs.actualDensity);
    
    if (isNaN(displacement) || isNaN(actualDensity)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const correction = displacement * (actualDensity / 1.025 - 1);
    setDensityCorrectionResult(correction);
    toast({ title: "Hesaplama Tamamlandı", description: `Yoğunluk Düzeltmesi: ${correction.toFixed(2)} ton` });
  };

  // 5. Block Coefficient
  const calculateBlockCoefficient = () => {
    const volume = parseFloat(blockCoefficientInputs.volume);
    const length = parseFloat(blockCoefficientInputs.length);
    const breadth = parseFloat(blockCoefficientInputs.breadth);
    const draft = parseFloat(blockCoefficientInputs.draft);
    
    if (isNaN(volume) || isNaN(length) || isNaN(breadth) || isNaN(draft)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const cb = volume / (length * breadth * draft);
    setBlockCoefficientResult(cb);
    toast({ title: "Hesaplama Tamamlandı", description: `Blok Katsayısı (Cb): ${cb.toFixed(3)}` });
  };

  // FWA
  const calculateFWA = () => {
    const displacement = parseFloat(fwaInputs.displacement);
    const tpc = parseFloat(fwaInputs.tpc);
    
    if (isNaN(displacement) || isNaN(tpc)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const fwa = displacement / (4 * tpc);
    setFwaResult(fwa);
    toast({ title: "Hesaplama Tamamlandı", description: `FWA: ${fwa.toFixed(1)} mm` });
  };

  // Density Change
  const calculateDensityChange = () => {
    const displacement = parseFloat(densityChangeInputs.displacement);
    const newDensity = parseFloat(densityChangeInputs.newDensity);
    const oldDensity = parseFloat(densityChangeInputs.oldDensity);
    
    if (isNaN(displacement) || isNaN(newDensity) || isNaN(oldDensity)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const newDisplacement = displacement * (newDensity / oldDensity);
    setDensityChangeResult(newDisplacement);
    toast({ title: "Hesaplama Tamamlandı", description: `Yeni Deplasman: ${newDisplacement.toFixed(2)} ton` });
  };

  // 6. Grain Heel Angle
  const calculateGrainHeel = () => {
    const ghm = parseFloat(grainHeelInputs.ghm);
    const displacement = parseFloat(grainHeelInputs.displacement);
    const gm = parseFloat(grainHeelInputs.gm);
    
    if (isNaN(ghm) || isNaN(displacement) || isNaN(gm)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const angle = (57.3 * ghm) / (displacement * gm);
    setGrainHeelResult(angle);
    const status = angle <= 12 ? "SOLAS Uygun" : "SOLAS Uygun Değil";
    toast({ title: "Hesaplama Tamamlandı", description: `Kümelenme Açısı: ${angle.toFixed(1)}° - ${status}` });
  };

  // GZ Lever
  const calculateGZLever = () => {
    const kn = parseFloat(gzLeverInputs.kn);
    const kg = parseFloat(gzLeverInputs.kg);
    const angle = parseFloat(gzLeverInputs.angle);
    
    if (isNaN(kn) || isNaN(kg) || isNaN(angle)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const angleRad = (angle * Math.PI) / 180;
    const gz = kn - kg * Math.sin(angleRad);
    setGzLeverResult(gz);
    toast({ title: "Hesaplama Tamamlandı", description: `GZ: ${gz.toFixed(4)} m` });
  };

  // Free Surface Effect
  const calculateFreeSurface = () => {
    const length = parseFloat(freeSurfaceInputs.length);
    const breadth = parseFloat(freeSurfaceInputs.breadth);
    const volume = parseFloat(freeSurfaceInputs.volume);
    
    if (isNaN(length) || isNaN(breadth) || isNaN(volume)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const fsm = (length * Math.pow(breadth, 3)) / (12 * volume);
    setFreeSurfaceResult(fsm);
    toast({ title: "Hesaplama Tamamlandı", description: `FSM: ${fsm.toFixed(4)} m` });
  };

  // Roll Period
  const calculateRollPeriod = () => {
    const cb = parseFloat(rollPeriodInputs.cb);
    const breadth = parseFloat(rollPeriodInputs.breadth);
    const gm = parseFloat(rollPeriodInputs.gm);
    
    if (isNaN(cb) || isNaN(breadth) || isNaN(gm)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const period = (cb * breadth) / Math.sqrt(gm);
    setRollPeriodResult(period);
    toast({ title: "Hesaplama Tamamlandı", description: `Yalpa Periyodu: ${period.toFixed(2)} saniye` });
  };

  // 7. Load Height
  const calculateLoadHeight = () => {
    const sf = parseFloat(loadHeightInputs.sf);
    const pl = parseFloat(loadHeightInputs.pl);
    
    if (isNaN(sf) || isNaN(pl)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const height = sf * pl;
    setLoadHeightResult(height);
    toast({ title: "Hesaplama Tamamlandı", description: `Müsaade Edilen Yük Yüksekliği: ${height.toFixed(2)} m` });
  };

  // Temperature Density Change
  const calculateTemperatureDensity = () => {
    const oldDensity = parseFloat(temperatureDensityInputs.oldDensity);
    const oldTemp = parseFloat(temperatureDensityInputs.oldTemperature);
    const newTemp = parseFloat(temperatureDensityInputs.newTemperature);
    const coefficient = parseFloat(temperatureDensityInputs.coefficient);
    
    if (isNaN(oldDensity) || isNaN(oldTemp) || isNaN(newTemp) || isNaN(coefficient)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const newDensity = oldDensity - ((newTemp - oldTemp) * coefficient);
    setTemperatureDensityResult(newDensity);
    toast({ title: "Hesaplama Tamamlandı", description: `Yeni Yoğunluk: ${newDensity.toFixed(4)} ton/m³` });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hogging" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="hogging">1. Giriş</TabsTrigger>
          <TabsTrigger value="transverse">2. Enine</TabsTrigger>
          <TabsTrigger value="longitudinal">3. Boyuna</TabsTrigger>
          <TabsTrigger value="draft">4. Draft Survey</TabsTrigger>
          <TabsTrigger value="density">5. Duba</TabsTrigger>
          <TabsTrigger value="solas">6. SOLAS</TabsTrigger>
          <TabsTrigger value="load">7. Yük</TabsTrigger>
        </TabsList>

        {/* 1. Giriş - Hogging ve Sagging Tespiti */}
        <TabsContent value="hogging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Ship className="h-5 w-5" />
                1. Hogging ve Sagging Tespiti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Hogging/Sagging = (dF + dA)/2 ile dM karşılaştırılır</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Baş Draft (dF) - m</Label>
                    <Input
                      type="number"
                      placeholder="Baş draft"
                      value={hoggingSaggingInputs.draftForward}
                      onChange={(e) => setHoggingSaggingInputs(prev => ({ ...prev, draftForward: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Kıç Draft (dA) - m</Label>
                    <Input
                      type="number"
                      placeholder="Kıç draft"
                      value={hoggingSaggingInputs.draftAft}
                      onChange={(e) => setHoggingSaggingInputs(prev => ({ ...prev, draftAft: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Vasat Draft (dM) - m</Label>
                    <Input
                      type="number"
                      placeholder="Vasat draft"
                      value={hoggingSaggingInputs.draftMidship}
                      onChange={(e) => setHoggingSaggingInputs(prev => ({ ...prev, draftMidship: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateHoggingSagging} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {hoggingSaggingResult && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-blue-500">
                    <p className="font-mono text-lg">{hoggingSaggingResult.type}: {hoggingSaggingResult.difference.toFixed(3)} m</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {hoggingSaggingResult.type === "Hogging" ? "Geminin ortası yukarı eğilimli" : "Geminin ortası aşağı eğilimli"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Enine Denge Hesapları */}
        <TabsContent value="transverse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Shield className="h-5 w-5" />
                2. Enine Denge Hesapları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* GM Hesaplama */}
              <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">GM = KM - KG</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>KB (m)</Label>
                    <Input
                      type="number"
                      placeholder="KB"
                      value={gmInputs.kb}
                      onChange={(e) => setGmInputs(prev => ({ ...prev, kb: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>BM (m)</Label>
                    <Input
                      type="number"
                      placeholder="BM"
                      value={gmInputs.bm}
                      onChange={(e) => setGmInputs(prev => ({ ...prev, bm: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>KG (m)</Label>
                    <Input
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
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {gmResult > 0 ? "✅ Pozitif GM - Stabil" : "❌ Negatif GM - Stabil değil"}
                    </p>
                  </div>
                )}
              </div>

              {/* Yeni KG Hesaplama */}
              <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Yeni KG = Toplam Moment / Toplam Ağırlık</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>Toplam Moment (ton.m)</Label>
                    <Input
                      type="number"
                      placeholder="Toplam moment"
                      value={newKGInputs.totalMoment}
                      onChange={(e) => setNewKGInputs(prev => ({ ...prev, totalMoment: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Toplam Ağırlık (ton)</Label>
                    <Input
                      type="number"
                      placeholder="Toplam ağırlık"
                      value={newKGInputs.totalWeight}
                      onChange={(e) => setNewKGInputs(prev => ({ ...prev, totalWeight: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateNewKG} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {newKGResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-green-500">
                    <p className="font-mono text-lg">Yeni KG = {newKGResult.toFixed(3)} m</p>
                  </div>
                )}
              </div>

              {/* Meyil Açısı Hesaplama */}
              <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Meyil Açısı (θ) = tan⁻¹(GZ/GM) veya tan⁻¹(Yatırıcı Moment / Δ×GM)</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <Label>GZ (m) - opsiyonel</Label>
                    <Input
                      type="number"
                      placeholder="GZ"
                      value={heelAngleInputs.gz}
                      onChange={(e) => setHeelAngleInputs(prev => ({ ...prev, gz: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>GM (m)</Label>
                    <Input
                      type="number"
                      placeholder="GM"
                      value={heelAngleInputs.gm}
                      onChange={(e) => setHeelAngleInputs(prev => ({ ...prev, gm: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Yatırıcı Moment (ton.m)</Label>
                    <Input
                      type="number"
                      placeholder="Yatırıcı moment"
                      value={heelAngleInputs.heelingMoment}
                      onChange={(e) => setHeelAngleInputs(prev => ({ ...prev, heelingMoment: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Deplasman (ton)</Label>
                    <Input
                      type="number"
                      placeholder="Deplasman"
                      value={heelAngleInputs.displacement}
                      onChange={(e) => setHeelAngleInputs(prev => ({ ...prev, displacement: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateHeelAngle} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {heelAngleResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-green-500">
                    <p className="font-mono text-lg">Meyil Açısı = {heelAngleResult.toFixed(2)}°</p>
                  </div>
                )}
              </div>

              {/* Bumba ile Kaldırma Sonrası GM Değişimi */}
              <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Bumba GM Değişimi = w × Yük Kolu / Δ</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Ağırlık (w) - ton</Label>
                    <Input
                      type="number"
                      placeholder="Ağırlık"
                      value={craneGMInputs.weight}
                      onChange={(e) => setCraneGMInputs(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Yük Kolu (m)</Label>
                    <Input
                      type="number"
                      placeholder="Yük kolu"
                      value={craneGMInputs.leverArm}
                      onChange={(e) => setCraneGMInputs(prev => ({ ...prev, leverArm: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Deplasman (Δ) - ton</Label>
                    <Input
                      type="number"
                      placeholder="Deplasman"
                      value={craneGMInputs.displacement}
                      onChange={(e) => setCraneGMInputs(prev => ({ ...prev, displacement: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateCraneGM} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {craneGMResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-green-500">
                    <p className="font-mono text-lg">GM Değişimi = {craneGMResult.toFixed(3)} m</p>
                  </div>
                )}
              </div>

              {/* Havuzlamada Kritik GM */}
              <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Kritik GM = P × KM / Δ</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Basınç (P) - ton</Label>
                    <Input
                      type="number"
                      placeholder="Basınç"
                      value={drydockGMInputs.pressure}
                      onChange={(e) => setDrydockGMInputs(prev => ({ ...prev, pressure: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>KM (m)</Label>
                    <Input
                      type="number"
                      placeholder="KM"
                      value={drydockGMInputs.km}
                      onChange={(e) => setDrydockGMInputs(prev => ({ ...prev, km: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Deplasman (Δ) - ton</Label>
                    <Input
                      type="number"
                      placeholder="Deplasman"
                      value={drydockGMInputs.displacement}
                      onChange={(e) => setDrydockGMInputs(prev => ({ ...prev, displacement: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateDrydockGM} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {drydockGMResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-green-500">
                    <p className="font-mono text-lg">Kritik GM = {drydockGMResult.toFixed(3)} m</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Boyuna Denge Hesapları */}
        <TabsContent value="longitudinal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <BarChart3 className="h-5 w-5" />
                3. Boyuna Denge Hesapları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Trim Değişimi */}
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Trim Değişimi = Toplam Moment / MCT</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>Toplam Moment (ton.m)</Label>
                    <Input
                      type="number"
                      placeholder="Toplam moment"
                      value={trimChangeInputs.totalMoment}
                      onChange={(e) => setTrimChangeInputs(prev => ({ ...prev, totalMoment: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>MCT (ton.m/cm)</Label>
                    <Input
                      type="number"
                      placeholder="MCT"
                      value={trimChangeInputs.mct}
                      onChange={(e) => setTrimChangeInputs(prev => ({ ...prev, mct: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateTrimChange} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {trimChangeResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-purple-500">
                    <p className="font-mono text-lg">Trim Değişimi = {trimChangeResult.toFixed(2)} cm</p>
                  </div>
                )}
              </div>

              {/* Paralel Batma/Çıkma */}
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Paralel Batma = Yüklenen Yük / TPC</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>Yüklenen Yük (ton)</Label>
                    <Input
                      type="number"
                      placeholder="Yüklenen yük"
                      value={parallelSinkageInputs.loadedWeight}
                      onChange={(e) => setParallelSinkageInputs(prev => ({ ...prev, loadedWeight: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>TPC (ton/cm)</Label>
                    <Input
                      type="number"
                      placeholder="TPC"
                      value={parallelSinkageInputs.tpc}
                      onChange={(e) => setParallelSinkageInputs(prev => ({ ...prev, tpc: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateParallelSinkage} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {parallelSinkageResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-purple-500">
                    <p className="font-mono text-lg">Paralel Batma = {parallelSinkageResult.toFixed(2)} cm</p>
                  </div>
                )}
              </div>

              {/* Draft Düzeltmesi */}
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Draft Düzeltmesi = Trim × Mesafe / LBP</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Trim (m)</Label>
                    <Input
                      type="number"
                      placeholder="Trim"
                      value={draftCorrectionInputs.trim}
                      onChange={(e) => setDraftCorrectionInputs(prev => ({ ...prev, trim: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Mesafe (m)</Label>
                    <Input
                      type="number"
                      placeholder="Mesafe"
                      value={draftCorrectionInputs.distance}
                      onChange={(e) => setDraftCorrectionInputs(prev => ({ ...prev, distance: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>LBP (m)</Label>
                    <Input
                      type="number"
                      placeholder="LBP"
                      value={draftCorrectionInputs.lbp}
                      onChange={(e) => setDraftCorrectionInputs(prev => ({ ...prev, lbp: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateDraftCorrection} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {draftCorrectionResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-purple-500">
                    <p className="font-mono text-lg">Draft Düzeltmesi = {draftCorrectionResult.toFixed(3)} m</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Draft Survey */}
        <TabsContent value="draft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <Waves className="h-5 w-5" />
                4. Draft Survey Hesapları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* MMM Draft */}
              <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">MMM = (dF + dA + 6dM) / 8</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Baş Draft (dF) - m</Label>
                    <Input
                      type="number"
                      placeholder="Baş draft"
                      value={mmmDraftInputs.draftForward}
                      onChange={(e) => setMmmDraftInputs(prev => ({ ...prev, draftForward: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Kıç Draft (dA) - m</Label>
                    <Input
                      type="number"
                      placeholder="Kıç draft"
                      value={mmmDraftInputs.draftAft}
                      onChange={(e) => setMmmDraftInputs(prev => ({ ...prev, draftAft: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Vasat Draft (dM) - m</Label>
                    <Input
                      type="number"
                      placeholder="Vasat draft"
                      value={mmmDraftInputs.draftMidship}
                      onChange={(e) => setMmmDraftInputs(prev => ({ ...prev, draftMidship: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateMMMDraft} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {mmmDraftResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-orange-500">
                    <p className="font-mono text-lg">MMM Draft = {mmmDraftResult.toFixed(3)} m</p>
                  </div>
                )}
              </div>

              {/* 1. Trim Düzeltmesi */}
              <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">1. Trim Düzeltmesi = Trim × LCF × TPC × 100 / LBP</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <Label>Trim (m)</Label>
                    <Input
                      type="number"
                      placeholder="Trim"
                      value={trimCorrection1Inputs.trim}
                      onChange={(e) => setTrimCorrection1Inputs(prev => ({ ...prev, trim: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>LCF (m)</Label>
                    <Input
                      type="number"
                      placeholder="LCF"
                      value={trimCorrection1Inputs.lcf}
                      onChange={(e) => setTrimCorrection1Inputs(prev => ({ ...prev, lcf: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>TPC (ton/cm)</Label>
                    <Input
                      type="number"
                      placeholder="TPC"
                      value={trimCorrection1Inputs.tpc}
                      onChange={(e) => setTrimCorrection1Inputs(prev => ({ ...prev, tpc: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>LBP (m)</Label>
                    <Input
                      type="number"
                      placeholder="LBP"
                      value={trimCorrection1Inputs.lbp}
                      onChange={(e) => setTrimCorrection1Inputs(prev => ({ ...prev, lbp: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateTrimCorrection1} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {trimCorrection1Result !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-orange-500">
                    <p className="font-mono text-lg">1. Trim Düzeltmesi = {trimCorrection1Result.toFixed(2)} ton</p>
                  </div>
                )}
              </div>

              {/* 2. Trim Düzeltmesi */}
              <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">2. Trim Düzeltmesi = Trim² × MCT × 50 / LBP</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Trim (m)</Label>
                    <Input
                      type="number"
                      placeholder="Trim"
                      value={trimCorrection2Inputs.trim}
                      onChange={(e) => setTrimCorrection2Inputs(prev => ({ ...prev, trim: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>MCT (ton.m/cm)</Label>
                    <Input
                      type="number"
                      placeholder="MCT"
                      value={trimCorrection2Inputs.mct}
                      onChange={(e) => setTrimCorrection2Inputs(prev => ({ ...prev, mct: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>LBP (m)</Label>
                    <Input
                      type="number"
                      placeholder="LBP"
                      value={trimCorrection2Inputs.lbp}
                      onChange={(e) => setTrimCorrection2Inputs(prev => ({ ...prev, lbp: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateTrimCorrection2} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {trimCorrection2Result !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-orange-500">
                    <p className="font-mono text-lg">2. Trim Düzeltmesi = {trimCorrection2Result.toFixed(2)} ton</p>
                  </div>
                )}
              </div>

              {/* Yoğunluk Düzeltmesi */}
              <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Yoğunluk Düzeltmesi = Δ × (ρgerçek/1.025 - 1)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>Deplasman (Δ) - ton</Label>
                    <Input
                      type="number"
                      placeholder="Deplasman"
                      value={densityCorrectionInputs.displacement}
                      onChange={(e) => setDensityCorrectionInputs(prev => ({ ...prev, displacement: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Gerçek Yoğunluk (ton/m³)</Label>
                    <Input
                      type="number"
                      placeholder="1.025"
                      value={densityCorrectionInputs.actualDensity}
                      onChange={(e) => setDensityCorrectionInputs(prev => ({ ...prev, actualDensity: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateDensityCorrection} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {densityCorrectionResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-orange-500">
                    <p className="font-mono text-lg">Yoğunluk Düzeltmesi = {densityCorrectionResult.toFixed(2)} ton</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Duba ve Yoğunluk Hesapları */}
        <TabsContent value="density" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                <Target className="h-5 w-5" />
                5. Duba ve Yoğunluk Hesapları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Blok Katsayısı */}
              <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Cb = V / (L × B × d)</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <Label>Hacim (V) - m³</Label>
                    <Input
                      type="number"
                      placeholder="Hacim"
                      value={blockCoefficientInputs.volume}
                      onChange={(e) => setBlockCoefficientInputs(prev => ({ ...prev, volume: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Uzunluk (L) - m</Label>
                    <Input
                      type="number"
                      placeholder="Uzunluk"
                      value={blockCoefficientInputs.length}
                      onChange={(e) => setBlockCoefficientInputs(prev => ({ ...prev, length: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Genişlik (B) - m</Label>
                    <Input
                      type="number"
                      placeholder="Genişlik"
                      value={blockCoefficientInputs.breadth}
                      onChange={(e) => setBlockCoefficientInputs(prev => ({ ...prev, breadth: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Draft (d) - m</Label>
                    <Input
                      type="number"
                      placeholder="Draft"
                      value={blockCoefficientInputs.draft}
                      onChange={(e) => setBlockCoefficientInputs(prev => ({ ...prev, draft: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateBlockCoefficient} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {blockCoefficientResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-teal-500">
                    <p className="font-mono text-lg">Cb = {blockCoefficientResult.toFixed(3)}</p>
                  </div>
                )}
              </div>

              {/* FWA */}
              <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">FWA = Δ / (4 × TPC)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>Deplasman (Δ) - ton</Label>
                    <Input
                      type="number"
                      placeholder="Deplasman"
                      value={fwaInputs.displacement}
                      onChange={(e) => setFwaInputs(prev => ({ ...prev, displacement: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>TPC (ton/cm)</Label>
                    <Input
                      type="number"
                      placeholder="TPC"
                      value={fwaInputs.tpc}
                      onChange={(e) => setFwaInputs(prev => ({ ...prev, tpc: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateFWA} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {fwaResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-teal-500">
                    <p className="font-mono text-lg">FWA = {fwaResult.toFixed(1)} mm</p>
                  </div>
                )}
              </div>

              {/* Yoğunluk Değişiminde Deplasman */}
              <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Yeni Deplasman = Δ × ρyeni / ρeski</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Deplasman (Δ) - ton</Label>
                    <Input
                      type="number"
                      placeholder="Deplasman"
                      value={densityChangeInputs.displacement}
                      onChange={(e) => setDensityChangeInputs(prev => ({ ...prev, displacement: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Yeni Yoğunluk (ton/m³)</Label>
                    <Input
                      type="number"
                      placeholder="Yeni yoğunluk"
                      value={densityChangeInputs.newDensity}
                      onChange={(e) => setDensityChangeInputs(prev => ({ ...prev, newDensity: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Eski Yoğunluk (ton/m³)</Label>
                    <Input
                      type="number"
                      placeholder="1.025"
                      value={densityChangeInputs.oldDensity}
                      onChange={(e) => setDensityChangeInputs(prev => ({ ...prev, oldDensity: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateDensityChange} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {densityChangeResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-teal-500">
                    <p className="font-mono text-lg">Yeni Deplasman = {densityChangeResult.toFixed(2)} ton</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. SOLAS Stabilite Kriterleri */}
        <TabsContent value="solas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="h-5 w-5" />
                6. SOLAS Stabilite Kriterleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Kümelenme Açısı */}
              <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">θ = 57.3 × GHM / (Δ × GM) - SOLAS Limit: 12°</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>GHM (ton.m)</Label>
                    <Input
                      type="number"
                      placeholder="GHM"
                      value={grainHeelInputs.ghm}
                      onChange={(e) => setGrainHeelInputs(prev => ({ ...prev, ghm: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Deplasman (Δ) - ton</Label>
                    <Input
                      type="number"
                      placeholder="Deplasman"
                      value={grainHeelInputs.displacement}
                      onChange={(e) => setGrainHeelInputs(prev => ({ ...prev, displacement: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>GM (m)</Label>
                    <Input
                      type="number"
                      placeholder="GM"
                      value={grainHeelInputs.gm}
                      onChange={(e) => setGrainHeelInputs(prev => ({ ...prev, gm: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateGrainHeel} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {grainHeelResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-red-500">
                    <p className="font-mono text-lg">Kümelenme Açısı = {grainHeelResult.toFixed(1)}°</p>
                    <p className="text-sm mt-1">
                      {grainHeelResult <= 12 ? "✅ SOLAS Uygun" : "❌ SOLAS Uygun Değil - 12°'yi Aşıyor"}
                    </p>
                  </div>
                )}
              </div>

              {/* GZ Kolu */}
              <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">GZ = KN - KG × sin θ</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>KN (m)</Label>
                    <Input
                      type="number"
                      placeholder="KN"
                      value={gzLeverInputs.kn}
                      onChange={(e) => setGzLeverInputs(prev => ({ ...prev, kn: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>KG (m)</Label>
                    <Input
                      type="number"
                      placeholder="KG"
                      value={gzLeverInputs.kg}
                      onChange={(e) => setGzLeverInputs(prev => ({ ...prev, kg: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Açı (θ) - derece</Label>
                    <Input
                      type="number"
                      placeholder="Açı"
                      value={gzLeverInputs.angle}
                      onChange={(e) => setGzLeverInputs(prev => ({ ...prev, angle: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateGZLever} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {gzLeverResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-red-500">
                    <p className="font-mono text-lg">GZ = {gzLeverResult.toFixed(4)} m</p>
                  </div>
                )}
              </div>

              {/* Serbest Yüzey Etkisi */}
              <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">FSM = L × B³ / (12 × V)</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Uzunluk (L) - m</Label>
                    <Input
                      type="number"
                      placeholder="Uzunluk"
                      value={freeSurfaceInputs.length}
                      onChange={(e) => setFreeSurfaceInputs(prev => ({ ...prev, length: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Genişlik (B) - m</Label>
                    <Input
                      type="number"
                      placeholder="Genişlik"
                      value={freeSurfaceInputs.breadth}
                      onChange={(e) => setFreeSurfaceInputs(prev => ({ ...prev, breadth: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Hacim (V) - m³</Label>
                    <Input
                      type="number"
                      placeholder="Hacim"
                      value={freeSurfaceInputs.volume}
                      onChange={(e) => setFreeSurfaceInputs(prev => ({ ...prev, volume: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateFreeSurface} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {freeSurfaceResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-red-500">
                    <p className="font-mono text-lg">FSM = {freeSurfaceResult.toFixed(4)} m</p>
                  </div>
                )}
              </div>

              {/* Yalpa Periyodu */}
              <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">T = Cb × B / √GM</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Cb</Label>
                    <Input
                      type="number"
                      placeholder="Blok katsayısı"
                      value={rollPeriodInputs.cb}
                      onChange={(e) => setRollPeriodInputs(prev => ({ ...prev, cb: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Genişlik (B) - m</Label>
                    <Input
                      type="number"
                      placeholder="Genişlik"
                      value={rollPeriodInputs.breadth}
                      onChange={(e) => setRollPeriodInputs(prev => ({ ...prev, breadth: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>GM (m)</Label>
                    <Input
                      type="number"
                      placeholder="GM"
                      value={rollPeriodInputs.gm}
                      onChange={(e) => setRollPeriodInputs(prev => ({ ...prev, gm: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateRollPeriod} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {rollPeriodResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-red-500">
                    <p className="font-mono text-lg">Yalpa Periyodu = {rollPeriodResult.toFixed(2)} saniye</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. Yük Hesapları */}
        <TabsContent value="load" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <Anchor className="h-5 w-5" />
                7. Yük Hesapları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Müsaade Edilen Yük Yüksekliği */}
              <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Yükseklik = SF × PL</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>SF (Güvenlik Faktörü)</Label>
                    <Input
                      type="number"
                      placeholder="SF"
                      value={loadHeightInputs.sf}
                      onChange={(e) => setLoadHeightInputs(prev => ({ ...prev, sf: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>PL (Yük Limiti)</Label>
                    <Input
                      type="number"
                      placeholder="PL"
                      value={loadHeightInputs.pl}
                      onChange={(e) => setLoadHeightInputs(prev => ({ ...prev, pl: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateLoadHeight} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {loadHeightResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-indigo-500">
                    <p className="font-mono text-lg">Müsaade Edilen Yük Yüksekliği = {loadHeightResult.toFixed(2)} m</p>
                  </div>
                )}
              </div>

              {/* Sıcaklıkla Yoğunluk Değişimi */}
              <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Dyeni = Deski - [(Tyeni - Teski) × Katsayı]</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <Label>Eski Yoğunluk (ton/m³)</Label>
                    <Input
                      type="number"
                      placeholder="Eski yoğunluk"
                      value={temperatureDensityInputs.oldDensity}
                      onChange={(e) => setTemperatureDensityInputs(prev => ({ ...prev, oldDensity: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Eski Sıcaklık (°C)</Label>
                    <Input
                      type="number"
                      placeholder="Eski sıcaklık"
                      value={temperatureDensityInputs.oldTemperature}
                      onChange={(e) => setTemperatureDensityInputs(prev => ({ ...prev, oldTemperature: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Yeni Sıcaklık (°C)</Label>
                    <Input
                      type="number"
                      placeholder="Yeni sıcaklık"
                      value={temperatureDensityInputs.newTemperature}
                      onChange={(e) => setTemperatureDensityInputs(prev => ({ ...prev, newTemperature: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Katsayı</Label>
                    <Input
                      type="number"
                      placeholder="0.0007"
                      value={temperatureDensityInputs.coefficient}
                      onChange={(e) => setTemperatureDensityInputs(prev => ({ ...prev, coefficient: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateTemperatureDensity} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {temperatureDensityResult !== null && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-indigo-500">
                    <p className="font-mono text-lg">Yeni Yoğunluk = {temperatureDensityResult.toFixed(4)} ton/m³</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};