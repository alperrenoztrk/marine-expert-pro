import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Ship, Shield, AlertTriangle, Waves, CheckCircle, BarChart3, Target, Zap, Anchor } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ComprehensiveMaritimeCalculations = ({ showLongitudinal = true, showDraftSurvey = true }: { showLongitudinal?: boolean; showDraftSurvey?: boolean }) => {
  const { toast } = useToast();

  // 1. Hogging/Sagging Detection
  const [hoggingSaggingInputs, setHoggingSaggingInputs] = useState({
    draftForward: "", draftAft: "", draftMidship: ""
  });
  const [hoggingSaggingResult, setHoggingSaggingResult] = useState<{type: string, difference: number} | null>(null);

  // 2. KG Hesapları

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

  // 1. Giriş – Ortalama Draft
  const [meanDraftInputs, setMeanDraftInputs] = useState({ draftForward: "", draftAft: "" });
  const [meanDraftResult, setMeanDraftResult] = useState<number | null>(null);

  // 2. Enine – Temel bağıntılar ve ek formüller
  const [kmFromKgGmInputs, setKmFromKgGmInputs] = useState({ kg: "", gm: "" });
  const [kmFromKgGmResult, setKmFromKgGmResult] = useState<number | null>(null);

  const [kmFromKbBmInputs, setKmFromKbBmInputs] = useState({ kb: "", bm: "" });
  const [kmFromKbBmResult, setKmFromKbBmResult] = useState<number | null>(null);

  const [gmFromKmKgInputs, setGmFromKmKgInputs] = useState({ km: "", kg: "" });
  const [gmFromKmKgResult, setGmFromKmKgResult] = useState<number | null>(null);

  const [momentInputs, setMomentInputs] = useState({ weight: "", kgDistance: "" });
  const [momentResult, setMomentResult] = useState<number | null>(null);

  const [deltaGMShiftInputs, setDeltaGMShiftInputs] = useState({ weight: "", distance: "", displacement: "" });
  const [deltaGMShiftResult, setDeltaGMShiftResult] = useState<number | null>(null);

  const [heelWyInputs, setHeelWyInputs] = useState({ weight: "", lever: "", displacement: "", gm: "" });
  const [heelWyResults, setHeelWyResults] = useState<{ gz: number; angle: number } | null>(null);

  // 3. Boyuna – ek formüller
  const [lcgSimpleInputs, setLcgSimpleInputs] = useState({ totalMoment: "", totalWeight: "" });
  const [lcgSimpleResult, setLcgSimpleResult] = useState<number | null>(null);

  const [trimBgInputs, setTrimBgInputs] = useState({ displacement: "", bg: "", mct: "" });
  const [trimBgResult, setTrimBgResult] = useState<number | null>(null);

  const [draftHalfTrimInputs, setDraftHalfTrimInputs] = useState({ deltaTrim: "" });
  const [draftHalfTrimResults, setDraftHalfTrimResults] = useState<{ dF: number; dA: number } | null>(null);

  // 5. Diğer – duba/tank ve yoğunluk kaynaklı draft
  const [volumeMassInputs, setVolumeMassInputs] = useState({ length: "", breadth: "", height: "", rho: "" });
  const [volumeMassResults, setVolumeMassResults] = useState<{ V: number; m: number } | null>(null);

  const [densityDraftInputs, setDensityDraftInputs] = useState({ fwa: "", rho: "" });
  const [densityDraftResult, setDensityDraftResult] = useState<number | null>(null);

  // 6. SOLAS – ek formüller
  const [ghmInputs, setGhmInputs] = useState({ vhm: "", sf: "" });
  const [ghmResult, setGhmResult] = useState<number | null>(null);

  const [simpson13Inputs, setSimpson13Inputs] = useState({ h: "", y0: "", y1: "", y2: "", y3: "", y4: "" });
  const [simpson13Result, setSimpson13Result] = useState<number | null>(null);

  const [simpson38Inputs, setSimpson38Inputs] = useState({ h: "", y0: "", y1: "", y2: "", y3: "" });
  const [simpson38Result, setSimpson38Result] = useState<number | null>(null);

  const [fsmGroupInputs, setFsmGroupInputs] = useState({ length: "", breadth: "", volume: "", rhoFluid: "", rhoSea: "1.025", n: "1" });
  const [fsmGroupResult, setFsmGroupResult] = useState<number | null>(null);

  const [damagedDraftInputs, setDamagedDraftInputs] = useState({ weight: "", length: "", breadth: "", damagedLength: "" });
  const [damagedDraftResult, setDamagedDraftResult] = useState<number | null>(null);

  // 7. Yük – maksimum yük miktarı
  const [maxCargoInputs, setMaxCargoInputs] = useState({ holdVolume: "", stowageFactor: "" });
  const [maxCargoResult, setMaxCargoResult] = useState<number | null>(null);

  // 8. Pratik – draft okuma ve ortalama draftlar
  const [metricDraftInputs, setMetricDraftInputs] = useState({ baseMeters: "", position: "alt" as "alt" | "orta" | "üst" });
  const [metricDraftResult, setMetricDraftResult] = useState<number | null>(null);

  const [imperialDraftInputs, setImperialDraftInputs] = useState({ baseFeet: "", position: "alt" as "alt" | "orta" | "üst" });
  const [imperialDraftResult, setImperialDraftResult] = useState<{ feet: number; inches: number } | null>(null);

  const [avgDraftsInputs, setAvgDraftsInputs] = useState({
    portForward: "", portMidship: "", portAft: "",
    starboardForward: "", starboardMidship: "", starboardAft: ""
  });
  const [avgDraftsResults, setAvgDraftsResults] = useState<{ dF: number; dM: number; dA: number } | null>(null);

  // 2a. Enine Ek: GG1, Sarkaç, Dikey Kaldırma, Havuz Tepkisi P, FSM (dikdörtgen), Duba Draft Değişimi
  const [gg1Inputs, setGg1Inputs] = useState({ weight: "", distance: "", displacement: "" });
  const [gg1Result, setGg1Result] = useState<number | null>(null);

  const [pendulumInputs, setPendulumInputs] = useState({ pendulumLength: "", deflection: "" });
  const [pendulumResult, setPendulumResult] = useState<number | null>(null);

  const [craneVerticalInputs, setCraneVerticalInputs] = useState({ weight: "", hookHeight: "", loadHeight: "", displacement: "" });
  const [craneVerticalResult, setCraneVerticalResult] = useState<number | null>(null);

  const [drydockReactionInputs, setDrydockReactionInputs] = useState({ mct1cm: "", trimCm: "", t: "", km: "", displacement: "" });
  const [drydockReactionResult, setDrydockReactionResult] = useState<{ P: number; gmCritical?: number } | null>(null);

  const [fsmRectInputs, setFsmRectInputs] = useState({ length: "", breadth: "", rho: "1.025", displacement: "" });
  const [fsmRectResult, setFsmRectResult] = useState<{ fsm: number; deltaKG?: number } | null>(null);

  const [pontoonInputs, setPontoonInputs] = useState({ weight: "", length: "", breadth: "", damagedArea: "", rho: "1.025" });
  const [pontoonResult, setPontoonResult] = useState<number | null>(null);

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

  // Enine Ek Fonksiyonlar
  const calculateGG1 = () => {
    const w = parseFloat(gg1Inputs.weight);
    const d = parseFloat(gg1Inputs.distance);
    const delta = parseFloat(gg1Inputs.displacement);
    if (isNaN(w) || isNaN(d) || isNaN(delta) || delta === 0) {
      toast({ title: "Hata", description: "Geçerli w, d, Δ girin", variant: "destructive" });
      return;
    }
    const gg1 = (w * d) / delta;
    setGg1Result(gg1);
    toast({ title: "Hesaplama Tamamlandı", description: `GG₁ = ${gg1.toFixed(4)} m` });
  };

  const calculatePendulumAngle = () => {
    const L = parseFloat(pendulumInputs.pendulumLength);
    const x = parseFloat(pendulumInputs.deflection);
    if (isNaN(L) || isNaN(x) || L === 0) {
      toast({ title: "Hata", description: "Geçerli sarkaç boyu ve sapma girin", variant: "destructive" });
      return;
    }
    const angle = Math.atan(x / L) * (180 / Math.PI);
    setPendulumResult(angle);
    toast({ title: "Hesaplama Tamamlandı", description: `Meyil Açısı ≈ ${angle.toFixed(2)}°` });
  };

  const calculateCraneVertical = () => {
    const w = parseFloat(craneVerticalInputs.weight);
    const hHook = parseFloat(craneVerticalInputs.hookHeight);
    const hLoad = parseFloat(craneVerticalInputs.loadHeight);
    const delta = parseFloat(craneVerticalInputs.displacement);
    if (isNaN(w) || isNaN(hHook) || isNaN(hLoad) || isNaN(delta) || delta === 0) {
      toast({ title: "Hata", description: "Geçerli w, h_cunda, h_yük, Δ girin", variant: "destructive" });
      return;
    }
    const deltaKG = (w * (hHook - hLoad)) / delta; // meters
    setCraneVerticalResult(deltaKG);
    toast({ title: "Hesaplama Tamamlandı", description: `ΔKG (dikey kaldırma) = ${deltaKG.toFixed(4)} m` });
  };

  const calculateDrydockReaction = () => {
    const mct1cm = parseFloat(drydockReactionInputs.mct1cm); // t·m/cm
    const trimCm = parseFloat(drydockReactionInputs.trimCm); // cm
    const t = parseFloat(drydockReactionInputs.t); // m
    const km = parseFloat(drydockReactionInputs.km);
    const delta = parseFloat(drydockReactionInputs.displacement);
    if (isNaN(mct1cm) || isNaN(trimCm) || isNaN(t) || t === 0) {
      toast({ title: "Hata", description: "Geçerli MCT1cm, Trim(cm), t girin", variant: "destructive" });
      return;
    }
    const P = (mct1cm * trimCm) / t; // tonnes
    let gmCritical: number | undefined = undefined;
    if (!isNaN(km) && !isNaN(delta) && delta > 0) {
      gmCritical = (P * km) / delta;
    }
    setDrydockReactionResult({ P, gmCritical });
    toast({ title: "Hesaplama Tamamlandı", description: `P = ${P.toFixed(2)} ton${gmCritical != null ? `, GM_k = ${gmCritical.toFixed(3)} m` : ''}` });
  };

  const calculateFSMRect = () => {
    const L = parseFloat(fsmRectInputs.length);
    const B = parseFloat(fsmRectInputs.breadth);
    const rho = parseFloat(fsmRectInputs.rho);
    const delta = parseFloat(fsmRectInputs.displacement);
    if (isNaN(L) || isNaN(B) || isNaN(rho)) {
      toast({ title: "Hata", description: "Geçerli L, B, ρ girin", variant: "destructive" });
      return;
    }
    const fsm = (L * Math.pow(B, 3) / 12) * rho; // tonne·m
    const result: { fsm: number; deltaKG?: number } = { fsm };
    if (!isNaN(delta) && delta > 0) {
      result.deltaKG = fsm / delta; // meters
    }
    setFsmRectResult(result);
    toast({ title: "Hesaplama Tamamlandı", description: `FSM = ${fsm.toFixed(2)} t·m${result.deltaKG != null ? `, ΔKG = ${result.deltaKG.toFixed(4)} m` : ''}` });
  };

  const calculatePontoonDraftChange = () => {
    const w = parseFloat(pontoonInputs.weight); // tonnes
    const L = parseFloat(pontoonInputs.length);
    const B = parseFloat(pontoonInputs.breadth);
    const Ad = parseFloat(pontoonInputs.damagedArea);
    const rho = parseFloat(pontoonInputs.rho);
    if ([w, L, B, Ad, rho].some((v) => isNaN(v))) {
      toast({ title: "Hata", description: "Geçerli w, L, B, yaralı alan ve ρ girin", variant: "destructive" });
      return;
    }
    const effectiveArea = Math.max(0, (L * B) - Ad);
    if (effectiveArea === 0 || rho === 0) {
      toast({ title: "Hata", description: "Etkin alan ve yoğunluk sıfır olamaz", variant: "destructive" });
      return;
    }
    const deltaDraft = w / (effectiveArea * rho); // meters
    setPontoonResult(deltaDraft);
    toast({ title: "Hesaplama Tamamlandı", description: `Δd = ${deltaDraft.toFixed(3)} m` });
  };

  // 1. Ortalama Draft
  const calculateMeanDraft = () => {
    const dF = parseFloat(meanDraftInputs.draftForward);
    const dA = parseFloat(meanDraftInputs.draftAft);
    if (isNaN(dF) || isNaN(dA)) {
      toast({ title: "Hata", description: "Geçerli dF ve dA girin", variant: "destructive" });
      return;
    }
    const dM = (dF + dA) / 2;
    setMeanDraftResult(dM);
    toast({ title: "Hesaplama Tamamlandı", description: `dM = ${dM.toFixed(3)} m` });
  };

  // 2. Temel bağıntılar ve ekler
  const calculateKmFromKgGm = () => {
    const kg = parseFloat(kmFromKgGmInputs.kg);
    const gm = parseFloat(kmFromKgGmInputs.gm);
    if (isNaN(kg) || isNaN(gm)) { toast({ title: "Hata", description: "Geçerli KG ve GM girin", variant: "destructive" }); return; }
    const km = kg + gm;
    setKmFromKgGmResult(km);
    toast({ title: "KM Hesaplandı", description: `KM = ${km.toFixed(3)} m` });
  };

  const calculateKmFromKbBm = () => {
    const kb = parseFloat(kmFromKbBmInputs.kb);
    const bm = parseFloat(kmFromKbBmInputs.bm);
    if (isNaN(kb) || isNaN(bm)) { toast({ title: "Hata", description: "Geçerli KB ve BM girin", variant: "destructive" }); return; }
    const km = kb + bm;
    setKmFromKbBmResult(km);
    toast({ title: "KM Hesaplandı", description: `KM = ${km.toFixed(3)} m` });
  };

  const calculateGmFromKmKg = () => {
    const km = parseFloat(gmFromKmKgInputs.km);
    const kg = parseFloat(gmFromKmKgInputs.kg);
    if (isNaN(km) || isNaN(kg)) { toast({ title: "Hata", description: "Geçerli KM ve KG girin", variant: "destructive" }); return; }
    const gm = km - kg;
    setGmFromKmKgResult(gm);
    toast({ title: "GM Hesaplandı", description: `GM = ${gm.toFixed(3)} m` });
  };

  const calculateMoment = () => {
    const weight = parseFloat(momentInputs.weight);
    const kgDistance = parseFloat(momentInputs.kgDistance);
    if (isNaN(weight) || isNaN(kgDistance)) { toast({ title: "Hata", description: "Geçerli ağırlık ve KG mesafesi girin", variant: "destructive" }); return; }
    const moment = weight * kgDistance;
    setMomentResult(moment);
    toast({ title: "Moment Hesaplandı", description: `Moment = ${moment.toFixed(2)} t·m` });
  };

  const calculateDeltaGMShift = () => {
    const w = parseFloat(deltaGMShiftInputs.weight);
    const d = parseFloat(deltaGMShiftInputs.distance);
    const Delta = parseFloat(deltaGMShiftInputs.displacement);
    if ([w, d, Delta].some(isNaN) || Delta === 0) { toast({ title: "Hata", description: "Geçerli w, d, Δ girin", variant: "destructive" }); return; }
    const deltaGM = (w * d) / Delta;
    setDeltaGMShiftResult(deltaGM);
    toast({ title: "ΔGM Hesaplandı", description: `ΔGM = ${deltaGM.toFixed(4)} m` });
  };

  const calculateHeelFromWY = () => {
    const w = parseFloat(heelWyInputs.weight);
    const y = parseFloat(heelWyInputs.lever);
    const Delta = parseFloat(heelWyInputs.displacement);
    const gm = parseFloat(heelWyInputs.gm);
    if ([w, y, Delta, gm].some(isNaN) || Delta === 0 || gm === 0) { toast({ title: "Hata", description: "Geçerli w, y, Δ, GM girin", variant: "destructive" }); return; }
    const gz = (w * y) / Delta;
    const angle = Math.atan(gz / gm) * (180 / Math.PI);
    setHeelWyResults({ gz, angle });
    toast({ title: "Hesaplama Tamamlandı", description: `GZ = ${gz.toFixed(4)} m, θ = ${angle.toFixed(2)}°` });
  };

  // 3. Boyuna ekleri
  const calculateLcgSimple = () => {
    const totalMoment = parseFloat(lcgSimpleInputs.totalMoment);
    const totalWeight = parseFloat(lcgSimpleInputs.totalWeight);
    if (isNaN(totalMoment) || isNaN(totalWeight) || totalWeight === 0) { toast({ title: "Hata", description: "Geçerli moment ve toplam ağırlık girin", variant: "destructive" }); return; }
    const lcg = totalMoment / totalWeight;
    setLcgSimpleResult(lcg);
    toast({ title: "LCG Hesaplandı", description: `LCG = ${lcg.toFixed(2)} m` });
  };

  const calculateTrimFromBg = () => {
    const Delta = parseFloat(trimBgInputs.displacement);
    const bg = parseFloat(trimBgInputs.bg);
    const mct = parseFloat(trimBgInputs.mct);
    if ([Delta, bg, mct].some(isNaN) || mct === 0) { toast({ title: "Hata", description: "Geçerli Δ, BG, MCT girin", variant: "destructive" }); return; }
    const trimCm = (Delta * bg) / mct;
    setTrimBgResult(trimCm);
    toast({ title: "Trim Hesaplandı", description: `Trim = ${trimCm.toFixed(2)} cm` });
  };

  const calculateHalfTrimDrafts = () => {
    const deltaTrim = parseFloat(draftHalfTrimInputs.deltaTrim);
    if (isNaN(deltaTrim)) { toast({ title: "Hata", description: "Geçerli trim (cm) girin", variant: "destructive" }); return; }
    const dF = -deltaTrim / 2;
    const dA = +deltaTrim / 2;
    setDraftHalfTrimResults({ dF, dA });
    toast({ title: "Dağılım", description: `ΔdF = ${dF.toFixed(1)} cm, ΔdA = ${dA.toFixed(1)} cm` });
  };

  // 5. Diğer
  const calculateVolumeMass = () => {
    const L = parseFloat(volumeMassInputs.length);
    const B = parseFloat(volumeMassInputs.breadth);
    const H = parseFloat(volumeMassInputs.height);
    const rho = parseFloat(volumeMassInputs.rho);
    if ([L, B, H, rho].some(isNaN)) { toast({ title: "Hata", description: "Geçerli L, B, H, ρ girin", variant: "destructive" }); return; }
    const V = L * B * H;
    const m = V * rho;
    setVolumeMassResults({ V, m });
    toast({ title: "Hesaplama Tamamlandı", description: `V = ${V.toFixed(3)} m³, m = ${m.toFixed(2)} t` });
  };

  const calculateDensityDraftChange = () => {
    const fwa = parseFloat(densityDraftInputs.fwa);
    const rho = parseFloat(densityDraftInputs.rho);
    if (isNaN(fwa) || isNaN(rho)) { toast({ title: "Hata", description: "Geçerli FWA ve ρ girin", variant: "destructive" }); return; }
    const deltaT = (fwa * (1025 - rho * 1000)) / 25;
    setDensityDraftResult(deltaT);
    toast({ title: "Draft Değişimi", description: `ΔT ≈ ${deltaT.toFixed(1)} mm` });
  };

  // 6. SOLAS
  const calculateGHM = () => {
    const vhm = parseFloat(ghmInputs.vhm);
    const sf = parseFloat(ghmInputs.sf);
    if (isNaN(vhm) || isNaN(sf) || sf === 0) { toast({ title: "Hata", description: "Geçerli VHM ve SF girin", variant: "destructive" }); return; }
    const ghm = vhm / sf;
    setGhmResult(ghm);
    toast({ title: "GHM Hesaplandı", description: `GHM = ${ghm.toFixed(2)} t·m` });
  };

  const calculateSimpson13 = () => {
    const { h, y0, y1, y2, y3, y4 } = simpson13Inputs;
    const hh = parseFloat(h); const Y0 = parseFloat(y0); const Y1 = parseFloat(y1); const Y2 = parseFloat(y2); const Y3 = parseFloat(y3); const Y4 = parseFloat(y4);
    if ([hh, Y0, Y1, Y2, Y3, Y4].some(isNaN)) { toast({ title: "Hata", description: "Geçerli h ve y değerleri girin", variant: "destructive" }); return; }
    const A = (hh / 3) * (Y0 + 4 * Y1 + 2 * Y2 + 4 * Y3 + Y4);
    setSimpson13Result(A);
    toast({ title: "Simpson 1/3", description: `A = ${A.toFixed(4)}` });
  };

  const calculateSimpson38 = () => {
    const { h, y0, y1, y2, y3 } = simpson38Inputs;
    const hh = parseFloat(h); const Y0 = parseFloat(y0); const Y1 = parseFloat(y1); const Y2 = parseFloat(y2); const Y3 = parseFloat(y3);
    if ([hh, Y0, Y1, Y2, Y3].some(isNaN)) { toast({ title: "Hata", description: "Geçerli h ve y değerleri girin", variant: "destructive" }); return; }
    const A = (3 * hh / 8) * (Y0 + 3 * Y1 + 3 * Y2 + Y3);
    setSimpson38Result(A);
    toast({ title: "Simpson 3/8", description: `A = ${A.toFixed(4)}` });
  };

  const calculateFSMGroup = () => {
    const L = parseFloat(fsmGroupInputs.length);
    const B = parseFloat(fsmGroupInputs.breadth);
    const V = parseFloat(fsmGroupInputs.volume);
    const rhoFluid = parseFloat(fsmGroupInputs.rhoFluid);
    const rhoSea = parseFloat(fsmGroupInputs.rhoSea);
    const n = parseFloat(fsmGroupInputs.n);
    if ([L, B, V, rhoFluid, rhoSea, n].some(isNaN) || V === 0 || rhoSea === 0 || n === 0) {
      toast({ title: "Hata", description: "Geçerli L, B, V, ρ_sıvı, ρ_deniz, n girin", variant: "destructive" }); return; }
    const deltaKG = ((L * Math.pow(B, 3)) / (12 * V)) * (rhoFluid / rhoSea) * (1 / (n * n));
    setFsmGroupResult(deltaKG);
    toast({ title: "Serbest Yüzey", description: `ΔKG = ${deltaKG.toFixed(4)} m` });
  };

  const calculateDamagedDraft = () => {
    const w = parseFloat(damagedDraftInputs.weight);
    const L = parseFloat(damagedDraftInputs.length);
    const B = parseFloat(damagedDraftInputs.breadth);
    const Ld = parseFloat(damagedDraftInputs.damagedLength);
    if ([w, L, B, Ld].some(isNaN)) { toast({ title: "Hata", description: "Geçerli w, L, B, L_yaralı girin", variant: "destructive" }); return; }
    const effectiveArea = (L * B) - (Ld * B);
    if (effectiveArea <= 0) { toast({ title: "Hata", description: "Etkin alan > 0 olmalı", variant: "destructive" }); return; }
    const deltaT = w / effectiveArea; // m (assuming ρ≈1 t/m³)
    setDamagedDraftResult(deltaT);
    toast({ title: "Yaralı Stabilite", description: `ΔT = ${deltaT.toFixed(3)} m` });
  };

  // 7. Yük – maksimum yük miktarı
  const calculateMaxCargo = () => {
    const Vh = parseFloat(maxCargoInputs.holdVolume);
    const SF = parseFloat(maxCargoInputs.stowageFactor);
    if (isNaN(Vh) || isNaN(SF) || SF === 0) { toast({ title: "Hata", description: "Geçerli V_ambar ve SF girin", variant: "destructive" }); return; }
    const wmax = Vh / SF;
    setMaxCargoResult(wmax);
    toast({ title: "Maksimum Yük", description: `w_max = ${wmax.toFixed(2)} ton` });
  };

  // 8. Pratik
  const calculateMetricDraftReading = () => {
    const base = parseFloat(metricDraftInputs.baseMeters);
    if (isNaN(base)) { toast({ title: "Hata", description: "Geçerli taban draft (m) girin", variant: "destructive" }); return; }
    let value = base;
    if (metricDraftInputs.position === "orta") value = base + 0.05;
    if (metricDraftInputs.position === "üst") value = base + 0.10;
    setMetricDraftResult(value);
    toast({ title: "Draft Okuma (Metre)", description: `${value.toFixed(2)} m` });
  };

  const calculateImperialDraftReading = () => {
    const baseFt = parseFloat(imperialDraftInputs.baseFeet);
    if (isNaN(baseFt)) { toast({ title: "Hata", description: "Geçerli taban draft (ft) girin", variant: "destructive" }); return; }
    let inches = 0;
    if (imperialDraftInputs.position === "orta") inches = 3;
    if (imperialDraftInputs.position === "üst") inches = 6;
    const totalInches = baseFt * 12 + inches;
    const feet = Math.floor(totalInches / 12);
    const remInches = totalInches - feet * 12;
    setImperialDraftResult({ feet, inches: remInches });
    toast({ title: "Draft Okuma (Kraliyet)", description: `${feet} ft ${remInches.toFixed(0)} in` });
  };

  const calculateAverageDrafts = () => {
    const pf = parseFloat(avgDraftsInputs.portForward);
    const pm = parseFloat(avgDraftsInputs.portMidship);
    const pa = parseFloat(avgDraftsInputs.portAft);
    const sf = parseFloat(avgDraftsInputs.starboardForward);
    const sm = parseFloat(avgDraftsInputs.starboardMidship);
    const sa = parseFloat(avgDraftsInputs.starboardAft);
    if ([pf, pm, pa, sf, sm, sa].some(isNaN)) { toast({ title: "Hata", description: "Geçerli tüm draftları girin", variant: "destructive" }); return; }
    const dF = (pf + sf) / 2;
    const dM = (pm + sm) / 2;
    const dA = (pa + sa) / 2;
    setAvgDraftsResults({ dF, dM, dA });
    toast({ title: "Ortalama Draftlar", description: `dF=${dF.toFixed(3)}, dM=${dM.toFixed(3)}, dA=${dA.toFixed(3)} m` });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hogging" className="w-full">
        <TabsList className={`grid w-full ${showLongitudinal && showDraftSurvey ? 'grid-cols-8' : showLongitudinal || showDraftSurvey ? 'grid-cols-7' : 'grid-cols-6'}`}>
          <TabsTrigger value="hogging">1. Giriş</TabsTrigger>
          <TabsTrigger value="transverse">2. Enine Denge Hesapları</TabsTrigger>
          {showLongitudinal && (
            <TabsTrigger value="longitudinal">3. Boyuna Denge Hesapları</TabsTrigger>
          )}
          {showDraftSurvey && (
            <TabsTrigger value="draft">4. Draft Survey</TabsTrigger>
          )}
          <TabsTrigger value="density">5. Duba ve Yoğunluk Hesapları</TabsTrigger>
          <TabsTrigger value="solas">6. SOLAS Stabilite Kriterleri</TabsTrigger>
          <TabsTrigger value="load">7. Yük Hesapları</TabsTrigger>
          <TabsTrigger value="practical">8. Pratik Hesaplar</TabsTrigger>
        </TabsList>

        {/* 1. Giriş - Hogging ve Sagging Tespiti */}
        <TabsContent value="hogging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Ship className="h-5 w-5" />
                1. Hogging ve Sagging Tespiti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Hogging/Sagging = (dF + dA)/2 ile dM karşılaştırılır</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Geminin vasat draftının baş/kıç draft ortalamasından büyük (Hogging) veya küçük (Sagging) olup olmadığını belirler.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">{hoggingSaggingResult.type}: {hoggingSaggingResult.difference.toFixed(3)} m</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {hoggingSaggingResult.type === "Hogging" ? "Geminin ortası yukarı eğilimli" : "Geminin ortası aşağı eğilimli"}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Ortalama Draft (dM) = (dF + dA) / 2</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Baş Draft (dF) - m</Label>
                    <Input type="number" value={meanDraftInputs.draftForward} onChange={(e)=> setMeanDraftInputs(p=>({...p, draftForward: e.target.value}))} />
                  </div>
                  <div>
                    <Label>Kıç Draft (dA) - m</Label>
                    <Input type="number" value={meanDraftInputs.draftAft} onChange={(e)=> setMeanDraftInputs(p=>({...p, draftAft: e.target.value}))} />
                  </div>
                  <Button onClick={calculateMeanDraft} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {meanDraftResult !== null && (
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">dM = {meanDraftResult.toFixed(3)} m</p>
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
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                2. Enine Denge Hesapları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Yeni KG Hesaplama */}
              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Yeni KG = Toplam Moment / Toplam Ağırlık</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Yükleme/tahliye sonrası ağırlık merkezinin yeni konumunu hesaplar.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">Yeni KG = {newKGResult.toFixed(3)} m</p>
                  </div>
                )}
              </div>

              {/* Meyil Açısı Hesaplama */}
              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Meyil Açısı (θ) = tan⁻¹(GZ/GM) veya tan⁻¹(Yatırıcı Moment / Δ×GM)</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Geminin yatma açısını derece cinsinden bulur.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">Meyil Açısı = {heelAngleResult.toFixed(2)}°</p>
                  </div>
                )}
              </div>

              {/* GG₁ (Yük Hareketi / Yükleme-Tahliye) */}
              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">GG₁ = w × d / Δ</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Ağırlık hareketi veya yükleme/tahliye sonrası G kaymasını hesaplar.</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <Label>Ağırlık w (ton)</Label>
                    <Input type="number" placeholder="w" value={gg1Inputs.weight} onChange={(e)=> setGg1Inputs(p=>({...p, weight:e.target.value}))} />
                  </div>
                  <div>
                    <Label>Mesafe d (m)</Label>
                    <Input type="number" placeholder="d" value={gg1Inputs.distance} onChange={(e)=> setGg1Inputs(p=>({...p, distance:e.target.value}))} />
                  </div>
                  <div>
                    <Label>Deplasman Δ (ton)</Label>
                    <Input type="number" placeholder="Δ" value={gg1Inputs.displacement} onChange={(e)=> setGg1Inputs(p=>({...p, displacement:e.target.value}))} />
                  </div>
                  <Button onClick={calculateGG1} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {gg1Result !== null && (
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">GG₁ = {gg1Result.toFixed(4)} m</p>
                  </div>
                )}
              </div>

              {/* Sarkaç ile Meyil Açısı */}
              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">tan φ ≈ sin φ = Sapma / Sarkaç Boyu</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Sarkaç sapmasından meyil açısını tahmin eder.</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Sarkaç Boyu (m)</Label>
                    <Input type="number" placeholder="Boy" value={pendulumInputs.pendulumLength} onChange={(e)=> setPendulumInputs(p=>({...p, pendulumLength:e.target.value}))} />
                  </div>
                  <div>
                    <Label>Sapma (m)</Label>
                    <Input type="number" placeholder="Sapma" value={pendulumInputs.deflection} onChange={(e)=> setPendulumInputs(p=>({...p, deflection:e.target.value}))} />
                  </div>
                  <Button onClick={calculatePendulumAngle} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {pendulumResult !== null && (
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">φ ≈ {pendulumResult.toFixed(2)}°</p>
                  </div>
                )}
              </div>

              {/* Bumba ile Kaldırma Sonrası GM Değişimi */}
              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Bumba GM Değişimi = w × Yük Kolu / Δ</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Vinç/bumba operasyonları sonrası GM'deki değişimi hesaplar.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">GM Değişimi = {craneGMResult.toFixed(3)} m</p>
                  </div>
                )}
              </div>

              {/* Dikey Kaldırmada ΔKG (Vinç/Bumba) */}
              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">ΔKG = w × (h_cunda − h_yük) / Δ</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Yükün dikey kaldırılması sırasında KG artışını hesaplar.</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <Label>Ağırlık w (ton)</Label>
                    <Input type="number" placeholder="w" value={craneVerticalInputs.weight} onChange={(e)=> setCraneVerticalInputs(p=>({...p, weight:e.target.value}))} />
                  </div>
                  <div>
                    <Label>h_cunda (m)</Label>
                    <Input type="number" placeholder="Kanca yüksekliği" value={craneVerticalInputs.hookHeight} onChange={(e)=> setCraneVerticalInputs(p=>({...p, hookHeight:e.target.value}))} />
                  </div>
                  <div>
                    <Label>h_yük (m)</Label>
                    <Input type="number" placeholder="Yükün başlangıç yüksekliği" value={craneVerticalInputs.loadHeight} onChange={(e)=> setCraneVerticalInputs(p=>({...p, loadHeight:e.target.value}))} />
                  </div>
                  <div>
                    <Label>Deplasman Δ (ton)</Label>
                    <Input type="number" placeholder="Δ" value={craneVerticalInputs.displacement} onChange={(e)=> setCraneVerticalInputs(p=>({...p, displacement:e.target.value}))} />
                  </div>
                  <Button onClick={calculateCraneVertical} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {craneVerticalResult !== null && (
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">ΔKG = {craneVerticalResult.toFixed(4)} m</p>
                  </div>
                )}
              </div>

              {/* Dikdörtgen Tank FSM ve ΔKG */}
              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">FSM = (L × B³ / 12) × ρ; ΔKG = FSM / Δ</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Serbest yüzey etkisinden kaynaklı GM küçülmesini hesaplar.</p>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div>
                    <Label>L (m)</Label>
                    <Input type="number" placeholder="L" value={fsmRectInputs.length} onChange={(e)=> setFsmRectInputs(p=>({...p, length:e.target.value}))} />
                  </div>
                  <div>
                    <Label>B (m)</Label>
                    <Input type="number" placeholder="B" value={fsmRectInputs.breadth} onChange={(e)=> setFsmRectInputs(p=>({...p, breadth:e.target.value}))} />
                  </div>
                  <div>
                    <Label>ρ (ton/m³)</Label>
                    <Input type="number" placeholder="1.025" value={fsmRectInputs.rho} onChange={(e)=> setFsmRectInputs(p=>({...p, rho:e.target.value}))} />
                  </div>
                  <div>
                    <Label>Δ (ton) - opsiyonel</Label>
                    <Input type="number" placeholder="Δ" value={fsmRectInputs.displacement} onChange={(e)=> setFsmRectInputs(p=>({...p, displacement:e.target.value}))} />
                  </div>
                  <Button onClick={calculateFSMRect} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {fsmRectResult && (
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">FSM = {fsmRectResult.fsm.toFixed(2)} t·m{fsmRectResult.deltaKG != null ? `; ΔKG = ${fsmRectResult.deltaKG.toFixed(4)} m` : ''}</p>
                  </div>
                )}
              </div>

              {/* Temel Bağıntılar ve Ek Formüller */}
              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Temel Bağıntılar</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>KG (m)</Label>
                    <Input type="number" value={kmFromKgGmInputs.kg} onChange={(e)=> setKmFromKgGmInputs(p=>({...p, kg: e.target.value}))} />
                  </div>
                  <div>
                    <Label>GM (m)</Label>
                    <Input type="number" value={kmFromKgGmInputs.gm} onChange={(e)=> setKmFromKgGmInputs(p=>({...p, gm: e.target.value}))} />
                  </div>
                  <Button onClick={calculateKmFromKgGm} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />KM = KG + GM
                  </Button>
                </div>
                {kmFromKgGmResult !== null && (<div className="mt-2 text-sm">KM = <span className="font-mono">{kmFromKgGmResult.toFixed(3)} m</span></div>)}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mt-4">
                  <div>
                    <Label>KB (m)</Label>
                    <Input type="number" value={kmFromKbBmInputs.kb} onChange={(e)=> setKmFromKbBmInputs(p=>({...p, kb: e.target.value}))} />
                  </div>
                  <div>
                    <Label>BM (m)</Label>
                    <Input type="number" value={kmFromKbBmInputs.bm} onChange={(e)=> setKmFromKbBmInputs(p=>({...p, bm: e.target.value}))} />
                  </div>
                  <Button onClick={calculateKmFromKbBm} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />KM = KB + BM
                  </Button>
                </div>
                {kmFromKbBmResult !== null && (<div className="mt-2 text-sm">KM = <span className="font-mono">{kmFromKbBmResult.toFixed(3)} m</span></div>)}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mt-4">
                  <div>
                    <Label>KM (m)</Label>
                    <Input type="number" value={gmFromKmKgInputs.km} onChange={(e)=> setGmFromKmKgInputs(p=>({...p, km: e.target.value}))} />
                  </div>
                  <div>
                    <Label>KG (m)</Label>
                    <Input type="number" value={gmFromKmKgInputs.kg} onChange={(e)=> setGmFromKmKgInputs(p=>({...p, kg: e.target.value}))} />
                  </div>
                  <Button onClick={calculateGmFromKmKg} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />GM = KM − KG
                  </Button>
                </div>
                {gmFromKmKgResult !== null && (<div className="mt-2 text-sm">GM = <span className="font-mono">{gmFromKmKgResult.toFixed(3)} m</span></div>)}
              </div>

              <div className="bg-muted/40 border border-border p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Moment ve ΔGM</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Ağırlık (t)</Label>
                    <Input type="number" value={momentInputs.weight} onChange={(e)=> setMomentInputs(p=>({...p, weight: e.target.value}))} />
                  </div>
                  <div>
                    <Label>KG Mesafesi (m)</Label>
                    <Input type="number" value={momentInputs.kgDistance} onChange={(e)=> setMomentInputs(p=>({...p, kgDistance: e.target.value}))} />
                  </div>
                  <Button onClick={calculateMoment} className="w-full"><Calculator className="w-4 h-4 mr-2" />Moment = w×KG</Button>
                </div>
                {momentResult !== null && (<div className="mt-2 text-sm">Moment = <span className="font-mono">{momentResult.toFixed(2)} t·m</span></div>)}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mt-4">
                  <div>
                    <Label>w (t)</Label>
                    <Input type="number" value={deltaGMShiftInputs.weight} onChange={(e)=> setDeltaGMShiftInputs(p=>({...p, weight: e.target.value}))} />
                  </div>
                  <div>
                    <Label>d (m)</Label>
                    <Input type="number" value={deltaGMShiftInputs.distance} onChange={(e)=> setDeltaGMShiftInputs(p=>({...p, distance: e.target.value}))} />
                  </div>
                  <div>
                    <Label>Δ (t)</Label>
                    <Input type="number" value={deltaGMShiftInputs.displacement} onChange={(e)=> setDeltaGMShiftInputs(p=>({...p, displacement: e.target.value}))} />
                  </div>
                  <Button onClick={calculateDeltaGMShift} className="w-full"><Calculator className="w-4 h-4 mr-2" />ΔGM = w×d/Δ</Button>
                </div>
                {deltaGMShiftResult !== null && (<div className="mt-2 text-sm">ΔGM = <span className="font-mono">{deltaGMShiftResult.toFixed(4)} m</span></div>)}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mt-4">
                  <div>
                    <Label>w (t)</Label>
                    <Input type="number" value={heelWyInputs.weight} onChange={(e)=> setHeelWyInputs(p=>({...p, weight: e.target.value}))} />
                  </div>
                  <div>
                    <Label>y (m)</Label>
                    <Input type="number" value={heelWyInputs.lever} onChange={(e)=> setHeelWyInputs(p=>({...p, lever: e.target.value}))} />
                  </div>
                  <div>
                    <Label>Δ (t)</Label>
                    <Input type="number" value={heelWyInputs.displacement} onChange={(e)=> setHeelWyInputs(p=>({...p, displacement: e.target.value}))} />
                  </div>
                  <div>
                    <Label>GM (m)</Label>
                    <Input type="number" value={heelWyInputs.gm} onChange={(e)=> setHeelWyInputs(p=>({...p, gm: e.target.value}))} />
                  </div>
                  <Button onClick={calculateHeelFromWY} className="w-full"><Calculator className="w-4 h-4 mr-2" />GZ ve θ</Button>
                </div>
                {heelWyResults && (
                  <div className="mt-2 text-sm">GZ = <span className="font-mono">{heelWyResults.gz.toFixed(4)} m</span>; θ = <span className="font-mono">{heelWyResults.angle.toFixed(2)}°</span></div>
                )}
              </div>
              
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Boyuna Denge Hesapları */}
        {showLongitudinal && (
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
                <p className="text-sm text-muted-foreground mb-3">Amaç: Yükleme/tahliye sonrası trim değişimini santimetre cinsinden bulur.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">Trim Değişimi = {trimChangeResult.toFixed(2)} cm</p>
                  </div>
                )}
              </div>

              {/* Paralel Batma/Çıkma */}
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Paralel Batma = Yüklenen Yük / TPC</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Geminin TPC değerine göre draft artış/azalışını hesaplar.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">Paralel Batma = {parallelSinkageResult.toFixed(2)} cm</p>
                  </div>
                )}
              </div>

              {/* Draft Düzeltmesi */}
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Draft Düzeltmesi = Trim × Mesafe / LBP</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Draft markalarının dikmelerle uyumsuzluğunda gerçek draftı bulur.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">Draft Düzeltmesi = {draftCorrectionResult.toFixed(3)} m</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        )}

        {/* 4. Draft Survey */}
        {showDraftSurvey && (
        <TabsContent value="draft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <Waves className="h-5 w-5" />
                4. Draft Survey Hesapları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
...
            </CardContent>
          </Card>
        </TabsContent>
        )}

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
                <p className="text-sm text-muted-foreground mb-3">Amaç: Geminin su altı hacminin dolgunluğunu ölçer.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">Cb = {blockCoefficientResult.toFixed(3)}</p>
                  </div>
                )}
              </div>

              {/* FWA */}
              <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">FWA = Δ / (4 × TPC)</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Tatlı suda draft artışını milimetre cinsinden hesaplar.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">FWA = {fwaResult.toFixed(1)} mm</p>
                  </div>
                )}
              </div>

              {/* Yoğunluk Değişiminde Deplasman */}
              <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Yeni Deplasman = Δ × ρyeni / ρeski</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Farklı yoğunluktaki sularda deplasman değişimini bulur.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">Yeni Deplasman = {densityChangeResult.toFixed(2)} ton</p>
                  </div>
                )}
              </div>

              {/* Duba – Yaralı Stabilite: Draft Değişimi */}
              <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Δd = w / [(Boy × En − Yaralı Alan) × ρ]</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Yaralı yüzeyli duba örneğinde draft değişimini hesaplar.</p>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div>
                    <Label>w (ton)</Label>
                    <Input type="number" placeholder="Ağırlık" value={pontoonInputs.weight} onChange={(e)=> setPontoonInputs(p=>({...p, weight:e.target.value}))} />
                  </div>
                  <div>
                    <Label>Boy (m)</Label>
                    <Input type="number" placeholder="Boy" value={pontoonInputs.length} onChange={(e)=> setPontoonInputs(p=>({...p, length:e.target.value}))} />
                  </div>
                  <div>
                    <Label>En (m)</Label>
                    <Input type="number" placeholder="En" value={pontoonInputs.breadth} onChange={(e)=> setPontoonInputs(p=>({...p, breadth:e.target.value}))} />
                  </div>
                  <div>
                    <Label>Yaralı Alan (m²)</Label>
                    <Input type="number" placeholder="Alan" value={pontoonInputs.damagedArea} onChange={(e)=> setPontoonInputs(p=>({...p, damagedArea:e.target.value}))} />
                  </div>
                  <div>
                    <Label>ρ (ton/m³)</Label>
                    <Input type="number" placeholder="1.025" value={pontoonInputs.rho} onChange={(e)=> setPontoonInputs(p=>({...p, rho:e.target.value}))} />
                  </div>
                  <Button onClick={calculatePontoonDraftChange} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Hesapla
                  </Button>
                </div>
                {pontoonResult !== null && (
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-primary">
                    <p className="font-mono text-lg">Δd = {pontoonResult.toFixed(3)} m</p>
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
                <p className="text-sm text-muted-foreground mb-3">Amaç: Tahıl yükünün kayma açısını kontrol eder (SOLAS limit: 12°).</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-destructive">
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
                <p className="text-sm text-muted-foreground mb-3">Amaç: Belirli bir meyil açısındaki doğrultucu moment kolunu hesaplar.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-destructive">
                    <p className="font-mono text-lg">GZ = {gzLeverResult.toFixed(4)} m</p>
                  </div>
                )}
              </div>

              {/* Serbest Yüzey Etkisi */}
              <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">FSM = L × B³ / (12 × V)</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Tanklardaki sıvı hareketinin GM'de yarattığı azalmayı hesaplar.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-destructive">
                    <p className="font-mono text-lg">FSM = {freeSurfaceResult.toFixed(4)} m</p>
                  </div>
                )}
              </div>

              {/* Yalpa Periyodu */}
              <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">T = Cb × B / √GM</h4>
                <p className="text-sm text-muted-foreground mb-3">Amaç: Geminin doğal yalpa süresini saniye cinsinden bulur.</p>
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
                  <div className="mt-3 p-3 bg-card rounded border border-border border-l-4 border-l-destructive">
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
                <p className="text-sm text-muted-foreground mb-3">Amaç: Ambar tabanına uygulanabilecek maksimum yük basıncını belirler.</p>
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
                <p className="text-sm text-muted-foreground mb-3">Amaç: Sıcaklık değişimi ile yoğunluk değişimini hesaplar.</p>
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

        {/* 8. Pratik Hesaplar */}
        <TabsContent value="practical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                8. Pratik Hesaplar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Draft Okuma (Metrik)</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <Label>Taban Değer (m)</Label>
                    <Input type="number" value={metricDraftInputs.baseMeters} onChange={(e)=> setMetricDraftInputs(p=>({...p, baseMeters: e.target.value}))} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Pozisyon</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant={metricDraftInputs.position==='alt'? 'default':'outline'} onClick={()=> setMetricDraftInputs(p=>({...p, position:'alt'}))}>Alt</Button>
                      <Button variant={metricDraftInputs.position==='orta'? 'default':'outline'} onClick={()=> setMetricDraftInputs(p=>({...p, position:'orta'}))}>Orta (+5cm)</Button>
                      <Button variant={metricDraftInputs.position==='üst'? 'default':'outline'} onClick={()=> setMetricDraftInputs(p=>({...p, position:'üst'}))}>Üst (+10cm)</Button>
                    </div>
                  </div>
                  <Button onClick={calculateMetricDraftReading} className="w-full md:col-span-2"><Calculator className="w-4 h-4 mr-2" />Hesapla</Button>
                </div>
                {metricDraftResult !== null && (<div className="mt-2 text-sm">Okuma = <span className="font-mono">{metricDraftResult.toFixed(2)} m</span></div>)}
              </div>

              <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Draft Okuma (Kraliyet)</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <Label>Taban Değer (ft)</Label>
                    <Input type="number" value={imperialDraftInputs.baseFeet} onChange={(e)=> setImperialDraftInputs(p=>({...p, baseFeet: e.target.value}))} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Pozisyon</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant={imperialDraftInputs.position==='alt'? 'default':'outline'} onClick={()=> setImperialDraftInputs(p=>({...p, position:'alt'}))}>Alt</Button>
                      <Button variant={imperialDraftInputs.position==='orta'? 'default':'outline'} onClick={()=> setImperialDraftInputs(p=>({...p, position:'orta'}))}>Orta (+3in)</Button>
                      <Button variant={imperialDraftInputs.position==='üst'? 'default':'outline'} onClick={()=> setImperialDraftInputs(p=>({...p, position:'üst'}))}>Üst (+6in)</Button>
                    </div>
                  </div>
                  <Button onClick={calculateImperialDraftReading} className="w-full md:col-span-2"><Calculator className="w-4 h-4 mr-2" />Hesapla</Button>
                </div>
                {imperialDraftResult && (<div className="mt-2 text-sm">Okuma = <span className="font-mono">{imperialDraftResult.feet} ft {imperialDraftResult.inches.toFixed(0)} in</span></div>)}
              </div>

              <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Ortalama Draftlar</h4>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                  <div><Label>Baş Port</Label><Input type="number" value={avgDraftsInputs.portForward} onChange={(e)=> setAvgDraftsInputs(p=>({...p, portForward: e.target.value}))} /></div>
                  <div><Label>Vasat Port</Label><Input type="number" value={avgDraftsInputs.portMidship} onChange={(e)=> setAvgDraftsInputs(p=>({...p, portMidship: e.target.value}))} /></div>
                  <div><Label>Kıç Port</Label><Input type="number" value={avgDraftsInputs.portAft} onChange={(e)=> setAvgDraftsInputs(p=>({...p, portAft: e.target.value}))} /></div>
                  <div><Label>Baş Starboard</Label><Input type="number" value={avgDraftsInputs.starboardForward} onChange={(e)=> setAvgDraftsInputs(p=>({...p, starboardForward: e.target.value}))} /></div>
                  <div><Label>Vasat Starboard</Label><Input type="number" value={avgDraftsInputs.starboardMidship} onChange={(e)=> setAvgDraftsInputs(p=>({...p, starboardMidship: e.target.value}))} /></div>
                  <div><Label>Kıç Starboard</Label><Input type="number" value={avgDraftsInputs.starboardAft} onChange={(e)=> setAvgDraftsInputs(p=>({...p, starboardAft: e.target.value}))} /></div>
                </div>
                <div className="flex justify-end mt-3"><Button onClick={calculateAverageDrafts}><Calculator className="w-4 h-4 mr-2" />Hesapla</Button></div>
                {avgDraftsResults && (
                  <div className="mt-2 text-sm">
                    dF = <span className="font-mono">{avgDraftsResults.dF.toFixed(3)} m</span>; dM = <span className="font-mono">{avgDraftsResults.dM.toFixed(3)} m</span>; dA = <span className="font-mono">{avgDraftsResults.dA.toFixed(3)} m</span>
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