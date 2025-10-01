import { ComprehensiveMaritimeCalculations } from "./ComprehensiveMaritimeCalculations";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Ship, Shield, AlertTriangle, Waves, CheckCircle, BarChart3, Target, Zap, Anchor, Brain } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Separator } from "@/components/ui/separator";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";
import { useToast } from "@/hooks/use-toast";
import { HydrostaticCalculations } from "../../services/hydrostaticCalculations";
import DraftSurveyMenu from "./DraftSurveyMenu";
import {
  ShipGeometry,
  WeightDistribution,
  TankData,
  CompartmentAnalysis,
  StabilityAnalysis,
  DraftSurvey,
  BonjeanSet,
  CrossCurves
} from "../../types/hydrostatic";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";


type StabilitySection = 'hydrostatic' | 'stability' | 'trimlist' | 'analysis' | 'bonjean' | 'draft' | 'damage';
type StabilityCalc = 'displacement' | 'draft' | 'tpc' | 'gm' | 'gz' | 'trim' | 'list' | 'loll';

export const HydrostaticsStabilityCalculations = ({ singleMode = false, section, calc }: { singleMode?: boolean; section?: StabilitySection; calc?: StabilityCalc }) => {
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

  // Bonjean entegrasyonu
  const [bonjeanText, setBonjeanText] = useState<string>("");
  const [bonjeanSet, setBonjeanSet] = useState<BonjeanSet | undefined>(undefined);

  // Cross curves (KN) entegrasyonu
  const [crossCurvesText, setCrossCurvesText] = useState<string>("");
  const [crossCurvesSet, setCrossCurvesSet] = useState<CrossCurves | undefined>(undefined);

  // Draft survey
  const [draftSurveyInputs, setDraftSurveyInputs] = useState<{ forwardDraft: string; midshipDraft: string; aftDraft: string }>({ forwardDraft: "", midshipDraft: "", aftDraft: "" });
  const [draftSurveyResult, setDraftSurveyResult] = useState<DraftSurvey | null>(null);

  // Hasar stabilitesi giriş satırı
  const [newCompartment, setNewCompartment] = useState<{ compartment: string; floodedVolume: string; newKG: string }>({ compartment: "", floodedVolume: "", newKG: "" });

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

  // Weather criterion girdileri ve sonucu
  const [weatherInputs, setWeatherInputs] = useState<{ pressure: string; area: string; lever: string }>({ pressure: "", area: "", lever: "" });
  const [weatherResult, setWeatherResult] = useState<{ ok: boolean; phiEq: number } | null>(null);

  // Missing state variables
  const [gzInputs, setGzInputs] = useState({ gm: "", angle: "" });
  const [gzResult, setGzResult] = useState<number | null>(null);
  
  const [trimInputs, setTrimInputs] = useState({ ta: "", tf: "", length: "" });
  const [trimResult, setTrimResult] = useState<number | null>(null);
  
  const [listInputs, setListInputs] = useState({ weight: "", distance: "", displacement: "", gm: "" });
  const [listResult, setListResult] = useState<number | null>(null);
  
  const [tpcInputs, setTpcInputs] = useState({ waterplaneArea: "", density: "1.025" });
  const [tpcResult, setTpcResult] = useState<number | null>(null);
  
  const [lollInputs, setLollInputs] = useState({ kg: "", km: "" });
  const [lollResult, setLollResult] = useState<number | null>(null);
  
  const [displacementInputs, setDisplacementInputs] = useState({ volume: "", waterDensity: "1.025" });
  const [displacementResult, setDisplacementResult] = useState<number | null>(null);
  
  const [draftInputs, setDraftInputs] = useState({ volume: "", waterplaneArea: "" });
  const [draftResult, setDraftResult] = useState<number | null>(null);

  // Perform comprehensive analysis when inputs change
  useEffect(() => {
    if (geometry && kg && weightDistribution && tanks) {
      try {
        const options: { crossCurves?: CrossCurves; bonjean?: BonjeanSet } = {};
        if (crossCurvesSet) options.crossCurves = crossCurvesSet;
        if (bonjeanSet) options.bonjean = bonjeanSet;
        const result = HydrostaticCalculations.performStabilityAnalysis(
          geometry,
          kg,
          weightDistribution,
          tanks,
          floodedCompartments,
          grainShiftMoment,
          grainHeelAngle,
          (crossCurvesSet || bonjeanSet) ? options : undefined
        );
        setAnalysis(result);
      } catch (error) {
        console.error('Analysis error:', error);
      }
    }
  }, [geometry, kg, weightDistribution, tanks, floodedCompartments, grainShiftMoment, grainHeelAngle, crossCurvesSet, bonjeanSet]);

  // Calculation functions
  
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

  // 2. Yeni KG Hesaplama
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

  // TRANSVERSE STABILITY CALCULATIONS

  // 1. Hidrostatik Temeller
  const [hydrostaticInputs, setHydrostaticInputs] = useState({
    length: "", breadth: "", draft: "", blockCoeff: "", waterplaneCoeff: ""
  });
  const [hydrostaticResults, setHydrostaticResults] = useState<{
    displacement: number; volume: number; waterplaneArea: number; kb: number; bmt: number; kmt: number;
  } | null>(null);

  const calculateHydrostaticFoundations = () => {
    const L = parseFloat(hydrostaticInputs.length);
    const B = parseFloat(hydrostaticInputs.breadth);
    const T = parseFloat(hydrostaticInputs.draft);
    const Cb = parseFloat(hydrostaticInputs.blockCoeff);
    const Cw = parseFloat(hydrostaticInputs.waterplaneCoeff);

    if (isNaN(L) || isNaN(B) || isNaN(T) || isNaN(Cb) || isNaN(Cw)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }

    const volume = L * B * T * Cb; // ∇ (m³)
    const displacement = volume * 1.025; // Δ (ton) - assuming seawater density
    const waterplaneArea = L * B * Cw; // WPA (m²)
    const kb = T * (0.53 + 0.085 * Cb); // KB approximation
    const iT = (L * Math.pow(B, 3) * Cw) / 12; // I_T approximation
    const bmt = iT / volume; // BM_T = I_T / ∇
    const kmt = kb + bmt; // KM_T = KB + BM_T

    setHydrostaticResults({ displacement, volume, waterplaneArea, kb, bmt, kmt });
    toast({ title: "Hidrostatik Temeller Hesaplandı", description: `Δ: ${displacement.toFixed(1)} ton, ∇: ${volume.toFixed(1)} m³` });
  };

  // 2. Ağırlık Merkezi ve GM
  const [weightCenterInputs, setWeightCenterInputs] = useState({
    kmt: "", kg: "", totalMoment: "", totalWeight: ""
  });
  const [weightCenterResults, setWeightCenterResults] = useState<{ kg: number; gmt: number } | null>(null);

  const calculateWeightCenterGM = () => {
    const KMT = parseFloat(weightCenterInputs.kmt);
    const KG = parseFloat(weightCenterInputs.kg);
    const totalMoment = parseFloat(weightCenterInputs.totalMoment);
    const totalWeight = parseFloat(weightCenterInputs.totalWeight);

    if (!isNaN(KMT) && !isNaN(KG)) {
      const GMT = KMT - KG; // GM_T = KM_T - KG
      setWeightCenterResults({ kg: KG, gmt: GMT });
      toast({ title: "GM Hesaplandı", description: `GM_T: ${GMT.toFixed(3)} m` });
    } else if (!isNaN(totalMoment) && !isNaN(totalWeight) && totalWeight > 0) {
      const newKG = totalMoment / totalWeight; // KG = Σ(wi * KGi) / Σwi
      setWeightCenterResults({ kg: newKG, gmt: 0 });
      toast({ title: "KG Hesaplandı", description: `KG: ${newKG.toFixed(3)} m` });
    } else {
      toast({ title: "Hata", description: "Lütfen geçerli değerler girin", variant: "destructive" });
    }
  };

  // 3. Ağırlık Şifti
  const [weightShiftInputs, setWeightShiftInputs] = useState({
    weight: "", distance: "", displacement: "", gmt: "", verticalShift: ""
  });
  const [weightShiftResults, setWeightShiftResults] = useState<{ listAngle: number; kgChange: number } | null>(null);

  const calculateWeightShift = () => {
    const w = parseFloat(weightShiftInputs.weight);
    const d = parseFloat(weightShiftInputs.distance);
    const Delta = parseFloat(weightShiftInputs.displacement);
    const GMT = parseFloat(weightShiftInputs.gmt);
    const h = parseFloat(weightShiftInputs.verticalShift);

    if (!isNaN(w) && !isNaN(d) && !isNaN(Delta) && !isNaN(GMT)) {
      // Enine şift: tan φ ≈ w*d/(Δ*GM_T)
      const listAngle = Math.atan((w * d) / (Delta * GMT)) * (180 / Math.PI);
      let kgChange = 0;
      
      if (!isNaN(h)) {
        // Düşey şift: GG_1 = w*h/Δ
        kgChange = (w * h) / Delta;
      }

      setWeightShiftResults({ listAngle, kgChange });
      toast({ title: "Ağırlık Şifti Hesaplandı", description: `List Açısı: ${listAngle.toFixed(2)}°` });
    } else {
      toast({ title: "Hata", description: "Lütfen geçerli değerler girin", variant: "destructive" });
    }
  };

  // 4. Serbest Yüzey Etkisi
  const [freeSurfaceInputs2, setFreeSurfaceInputs2] = useState({
    tankLength: "", tankBreadth: "", tankVolume: "", fluidDensity: "0.85", volume: ""
  });
  const [freeSurfaceResults, setFreeSurfaceResults] = useState<{ fsc: number; gmCorrected: number } | null>(null);

  const calculateFreeSurfaceEffect = () => {
    const l = parseFloat(freeSurfaceInputs2.tankLength);
    const b = parseFloat(freeSurfaceInputs2.tankBreadth);
    const rhoTank = parseFloat(freeSurfaceInputs2.fluidDensity);
    const volume = parseFloat(freeSurfaceInputs2.volume);

    if (isNaN(l) || isNaN(b) || isNaN(rhoTank) || isNaN(volume)) {
      toast({ title: "Hata", description: "Lütfen geçerli değerler girin", variant: "destructive" });
      return;
    }

    const iF = (l * Math.pow(b, 3)) / 12; // Tank serbest yüzey ikinci momenti
    const fsc = (rhoTank / 1.025) * (iF / volume); // FSC = (ρ_tank/ρ_sea) * i_f/∇
    
    setFreeSurfaceResults({ fsc, gmCorrected: 0 });
    toast({ title: "Serbest Yüzey Etkisi Hesaplandı", description: `FSC: ${fsc.toFixed(4)} m` });
  };

  // 5. GZ ve Dinamik Stabilite
  const [gzDynamicInputs, setGzDynamicInputs] = useState({
    gmCorr: "", angle: "", kn: "", kg: ""
  });
  const [gzDynamicResults, setGzDynamicResults] = useState<{ gz: number; rightingMoment: number } | null>(null);

  const calculateGZDynamic = () => {
    const gmCorr = parseFloat(gzDynamicInputs.gmCorr);
    const angle = parseFloat(gzDynamicInputs.angle);
    const kn = parseFloat(gzDynamicInputs.kn);
    const kg = parseFloat(gzDynamicInputs.kg);

    if (!isNaN(gmCorr) && !isNaN(angle)) {
      // Küçük açılar için: GZ ≈ GM_corr * sin φ
      const angleRad = (angle * Math.PI) / 180;
      const gz = gmCorr * Math.sin(angleRad);
      const rightingMoment = (geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient * 1.025) * gz;
      
      setGzDynamicResults({ gz, rightingMoment });
      toast({ title: "GZ Hesaplandı", description: `GZ: ${gz.toFixed(4)} m` });
    } else if (!isNaN(kn) && !isNaN(kg) && !isNaN(angle)) {
      // Genel açılar için: GZ(φ) = KN(φ) - KG sin φ
      const angleRad = (angle * Math.PI) / 180;
      const gz = kn - kg * Math.sin(angleRad);
      const rightingMoment = (geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient * 1.025) * gz;
      
      setGzDynamicResults({ gz, rightingMoment });
      toast({ title: "GZ (KN Yöntemi) Hesaplandı", description: `GZ: ${gz.toFixed(4)} m` });
    } else {
      toast({ title: "Hata", description: "Lütfen geçerli değerler girin", variant: "destructive" });
    }
  };

  // 6. Rüzgar Etkisi
  const [windEffectInputs, setWindEffectInputs] = useState({
    windPressure: "", lateralArea: "", leverArm: "", displacement: ""
  });
  const [windEffectResults, setWindEffectResults] = useState<{ heelingMoment: number; heelingArm: number } | null>(null);

  const calculateWindEffect = () => {
    const q = parseFloat(windEffectInputs.windPressure); // Pa
    const A = parseFloat(windEffectInputs.lateralArea); // m²
    const z = parseFloat(windEffectInputs.leverArm); // m
    const Delta = parseFloat(windEffectInputs.displacement); // ton

    if (isNaN(q) || isNaN(A) || isNaN(z) || isNaN(Delta)) {
      toast({ title: "Hata", description: "Lütfen geçerli değerler girin", variant: "destructive" });
      return;
    }

    const heelingMoment = (q * A * z) / 1000; // kN·m (Pa to kN/m² conversion)
    const heelingArm = heelingMoment / (Delta * 9.81); // m

    setWindEffectResults({ heelingMoment, heelingArm });
    toast({ title: "Rüzgar Etkisi Hesaplandı", description: `Heeling Moment: ${heelingMoment.toFixed(2)} kN·m` });
  };

  // 7. İnklinasyon Deneyi
  const [inclinationInputs, setInclinationInputs] = useState({
    testWeight: "", shiftDistance: "", displacement: "", observedAngle: ""
  });
  const [inclinationResults, setInclinationResults] = useState<{ gmt: number } | null>(null);

  const calculateInclinationTest = () => {
    const w = parseFloat(inclinationInputs.testWeight);
    const l = parseFloat(inclinationInputs.shiftDistance);
    const Delta = parseFloat(inclinationInputs.displacement);
    const phi = parseFloat(inclinationInputs.observedAngle);

    if (isNaN(w) || isNaN(l) || isNaN(Delta) || isNaN(phi)) {
      toast({ title: "Hata", description: "Lütfen geçerli değerler girin", variant: "destructive" });
      return;
    }

    const phiRad = (phi * Math.PI) / 180;
    const gmt = (w * l) / (Delta * Math.tan(phiRad)); // GM_T = w*l/(Δ*tan φ)

    setInclinationResults({ gmt });
    toast({ title: "İnklinasyon Deneyi Sonucu", description: `GM_T: ${gmt.toFixed(3)} m` });
  };

  // 8. Yalpa Periyodu
  const [rollPeriodInputs2, setRollPeriodInputs2] = useState({
    breadth: "", gmCorr: "", radiusOfGyration: ""
  });
  const [rollPeriodResults, setRollPeriodResults] = useState<{ period: number } | null>(null);

  const calculateRollPeriod = () => {
    const B = parseFloat(rollPeriodInputs2.breadth);
    const gmCorr = parseFloat(rollPeriodInputs2.gmCorr);
    const k = parseFloat(rollPeriodInputs2.radiusOfGyration) || 0.35 * B; // Default k ≈ 0.35B

    if (isNaN(B) || isNaN(gmCorr) || gmCorr <= 0) {
      toast({ title: "Hata", description: "Lütfen geçerli değerler girin", variant: "destructive" });
      return;
    }

    const T = 2 * Math.PI * k / Math.sqrt(9.81 * gmCorr); // T = 2π * k / √(g*GM_corr)

    setRollPeriodResults({ period: T });
    toast({ title: "Yalpa Periyodu Hesaplandı", description: `T: ${T.toFixed(2)} saniye` });
  };

  // 9. Angle of Loll
  const [lollInputs2, setLollInputs2] = useState({
    gm: "", bmt: ""
  });
  const [lollResults, setLollResults] = useState<{ lollAngle: number } | null>(null);

  const calculateAngleOfLoll = () => {
    const GM = parseFloat(lollInputs2.gm);
    const BMT = parseFloat(lollInputs2.bmt);

    if (isNaN(GM) || isNaN(BMT) || GM >= 0) {
      toast({ title: "Hata", description: "GM negatif olmalı (GM < 0)", variant: "destructive" });
      return;
    }

    const lollAngle = Math.atan(Math.sqrt(-2 * GM / BMT)) * (180 / Math.PI); // tan φ_loll ≈ √(-2*GM/BM_T)

    setLollResults({ lollAngle });
    toast({ title: "Angle of Loll Hesaplandı", description: `Loll Açısı: ${lollAngle.toFixed(2)}°` });
  };

  const calculateDisplacement = () => {
    const volume = parseFloat(displacementInputs.volume);
    const waterDensity = parseFloat(displacementInputs.waterDensity);
    
    if (isNaN(volume) || isNaN(waterDensity)) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const displacement = volume * waterDensity;
    setDisplacementResult(displacement);
    toast({ title: "Hesaplama Tamamlandı", description: `Deplasman: ${displacement.toFixed(2)} ton` });
  };

  const calculateDraft = () => {
    const volume = parseFloat(draftInputs.volume);
    const waterplaneArea = parseFloat(draftInputs.waterplaneArea);
    
    if (isNaN(volume) || isNaN(waterplaneArea) || waterplaneArea === 0) {
      toast({ title: "Hata", description: "Lütfen geçerli sayısal değerler girin", variant: "destructive" });
      return;
    }
    
    const draft = volume / waterplaneArea;
    setDraftResult(draft);
    toast({ title: "Hesaplama Tamamlandı", description: `Draft: ${draft.toFixed(3)} m` });
  };

  return (
    <div className="space-y-6">
      {/* Kapsamlı Denizcilik Hesaplamaları */}
      <ComprehensiveMaritimeCalculations showLongitudinal={section !== 'stability' && section !== 'trimlist'} showDraftSurvey={section !== 'stability' && section !== 'trimlist'} />
      
      {/* Stabilite Asistanı */}
      <Card className="shadow border border-blue-200/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Brain className="h-5 w-5" />
            Stabilite Asistanı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StabilityAssistantPopup variant="inline" />
        </CardContent>
      </Card>

      {/* Hidrostatik Hesaplamalar */}
      {(!singleMode || section === 'hydrostatic') && (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Waves className="h-5 w-5" />
            Hidrostatik Hesaplamalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Deplasman Hesaplama */}
          {(!singleMode || !calc || calc==='displacement') && (
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
          )}

          {/* Draft Hesaplama */}
          {(!singleMode || !calc || calc==='draft') && (
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
          )}

          {/* TPC Hesaplama */}
          {(!singleMode || !calc || calc==='tpc') && (
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
          )}
        </CardContent>
      </Card>
      )}

      {(!singleMode || section === 'stability') && (
      <>
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
          {(!singleMode || !calc || calc==='gm') && (
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
          )}

          {/* GZ Hesaplama */}
          {(!singleMode || !calc || calc==='gz') && (
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
                <Label htmlFor="gz-angle">Açı (°)</Label>
                <Input
                  id="gz-angle"
                  type="number"
                  placeholder="φ"
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
          )}
        </CardContent>
      </Card>
      </>
      )}

      {(!singleMode || section === 'trimlist') && (
      <>
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
          {(!singleMode || !calc || calc==='trim') && (
          <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Trim Açısı (Trim = arctan((Ta - Tf) / L))</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor="ta">Ta - Kıç Su Çekimi (m)</Label>
                <Input
                  id="ta"
                  type="number"
                  placeholder="Ta"
                  value={trimInputs.ta}
                  onChange={(e) => setTrimInputs(prev => ({ ...prev, ta: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tf">Tf - Baş Su Çekimi (m)</Label>
                <Input
                  id="tf"
                  type="number"
                  placeholder="Tf"
                  value={trimInputs.tf}
                  onChange={(e) => setTrimInputs(prev => ({ ...prev, tf: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="length">L - Uzunluk (m)</Label>
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
          )}

          {/* List Hesaplama */}
          {(!singleMode || !calc || calc==='list') && (
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
                <Label htmlFor="list-distance">Mesafe (m)</Label>
                <Input
                  id="list-distance"
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
          )}

          {/* Loll Açısı Hesaplama */}
          {(!singleMode || !calc || calc==='loll') && (
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
          )}
        </CardContent>
      </Card>
      </>
      )}

      {/* TRANSVERSE STABILITY CALCULATIONS */}
      {(!singleMode || section === 'stability') && (
      <>
      <Separator />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Shield className="h-5 w-5" />
            Enine Stabilite Hesaplamaları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* 2. Ağırlık Merkezi ve GM */}
          {(!singleMode || section === 'stability' || calc === 'gm') && (
          <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">2. Ağırlık Merkezi ve GM</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="weight-kmt">KM_T [m]</Label>
                <Input
                  id="weight-kmt"
                  type="number"
                  placeholder="8.5"
                  value={weightCenterInputs.kmt}
                  onChange={(e) => setWeightCenterInputs(prev => ({ ...prev, kmt: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="weight-kg">KG [m]</Label>
                <Input
                  id="weight-kg"
                  type="number"
                  placeholder="5.2"
                  value={weightCenterInputs.kg}
                  onChange={(e) => setWeightCenterInputs(prev => ({ ...prev, kg: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="weight-moment">Toplam Moment [t·m]</Label>
                <Input
                  id="weight-moment"
                  type="number"
                  placeholder="18000"
                  value={weightCenterInputs.totalMoment}
                  onChange={(e) => setWeightCenterInputs(prev => ({ ...prev, totalMoment: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="weight-total">Toplam Ağırlık [t]</Label>
                <Input
                  id="weight-total"
                  type="number"
                  placeholder="3500"
                  value={weightCenterInputs.totalWeight}
                  onChange={(e) => setWeightCenterInputs(prev => ({ ...prev, totalWeight: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={calculateWeightCenterGM} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              GM ve KG Hesapla
            </Button>
            {weightCenterResults && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-600 rounded border-l-4 border-green-500">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>KG:</strong> {weightCenterResults.kg.toFixed(3)} m</div>
                  <div><strong>GM_T:</strong> {weightCenterResults.gmt.toFixed(3)} m</div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* 3. Ağırlık Şifti */}
          {(!singleMode || section === 'stability' || calc === 'list') && (
          <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">3. Ağırlık Ekleme/Çıkarma/Şift</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="shift-weight">Ağırlık (w) [t]</Label>
                <Input
                  id="shift-weight"
                  type="number"
                  placeholder="100"
                  value={weightShiftInputs.weight}
                  onChange={(e) => setWeightShiftInputs(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="shift-distance">Enine Mesafe (d) [m]</Label>
                <Input
                  id="shift-distance"
                  type="number"
                  placeholder="5"
                  value={weightShiftInputs.distance}
                  onChange={(e) => setWeightShiftInputs(prev => ({ ...prev, distance: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="shift-displacement">Deplasman (Δ) [t]</Label>
                <Input
                  id="shift-displacement"
                  type="number"
                  placeholder="3500"
                  value={weightShiftInputs.displacement}
                  onChange={(e) => setWeightShiftInputs(prev => ({ ...prev, displacement: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="shift-gmt">GM_T [m]</Label>
                <Input
                  id="shift-gmt"
                  type="number"
                  placeholder="1.2"
                  value={weightShiftInputs.gmt}
                  onChange={(e) => setWeightShiftInputs(prev => ({ ...prev, gmt: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="shift-vertical">Düşey Şift (h) [m]</Label>
                <Input
                  id="shift-vertical"
                  type="number"
                  placeholder="2"
                  value={weightShiftInputs.verticalShift}
                  onChange={(e) => setWeightShiftInputs(prev => ({ ...prev, verticalShift: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={calculateWeightShift} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              Ağırlık Şifti Hesapla
            </Button>
            {weightShiftResults && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-600 rounded border-l-4 border-orange-500">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>List Açısı:</strong> {weightShiftResults.listAngle.toFixed(2)}°</div>
                  <div><strong>KG Değişimi:</strong> {weightShiftResults.kgChange.toFixed(4)} m</div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* 4. Serbest Yüzey Etkisi */}
          <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">4. Serbest Yüzey Etkisi (FSC)</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="fs-length">Tank Uzunluğu [m]</Label>
                <Input
                  id="fs-length"
                  type="number"
                  placeholder="10"
                  value={freeSurfaceInputs2.tankLength}
                  onChange={(e) => setFreeSurfaceInputs2(prev => ({ ...prev, tankLength: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="fs-breadth">Tank Genişliği [m]</Label>
                <Input
                  id="fs-breadth"
                  type="number"
                  placeholder="8"
                  value={freeSurfaceInputs2.tankBreadth}
                  onChange={(e) => setFreeSurfaceInputs2(prev => ({ ...prev, tankBreadth: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="fs-density">Akışkan Yoğunluğu [t/m³]</Label>
                <Input
                  id="fs-density"
                  type="number"
                  placeholder="0.85"
                  value={freeSurfaceInputs2.fluidDensity}
                  onChange={(e) => setFreeSurfaceInputs2(prev => ({ ...prev, fluidDensity: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="fs-volume">Gemi Hacmi (∇) [m³]</Label>
                <Input
                  id="fs-volume"
                  type="number"
                  placeholder="2400"
                  value={freeSurfaceInputs2.volume}
                  onChange={(e) => setFreeSurfaceInputs2(prev => ({ ...prev, volume: e.target.value }))}
                />
              </div>
              <Button onClick={calculateFreeSurfaceEffect} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                FSC Hesapla
              </Button>
            </div>
            {freeSurfaceResults && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-600 rounded border-l-4 border-amber-500">
                <div className="text-sm">
                  <div><strong>FSC:</strong> {freeSurfaceResults.fsc.toFixed(4)} m</div>
                  <div className="text-xs mt-1 text-amber-600 dark:text-amber-400">
                    GM_corr = GM_T - ΣFSC
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. GZ ve Dinamik Stabilite */}
          {(!singleMode || section === 'stability' || calc === 'gz') && (
          <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">5. GZ ve Moment Hesaplamaları</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="gz-gmcorr">GM_corr [m]</Label>
                <Input
                  id="gz-gmcorr"
                  type="number"
                  placeholder="1.1"
                  value={gzDynamicInputs.gmCorr}
                  onChange={(e) => setGzDynamicInputs(prev => ({ ...prev, gmCorr: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="gz-angle">Açı (φ) [°]</Label>
                <Input
                  id="gz-angle"
                  type="number"
                  placeholder="15"
                  value={gzDynamicInputs.angle}
                  onChange={(e) => setGzDynamicInputs(prev => ({ ...prev, angle: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="gz-kn">KN [m] (opsiyonel)</Label>
                <Input
                  id="gz-kn"
                  type="number"
                  placeholder="1.2"
                  value={gzDynamicInputs.kn}
                  onChange={(e) => setGzDynamicInputs(prev => ({ ...prev, kn: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="gz-kg">KG [m] (KN için)</Label>
                <Input
                  id="gz-kg"
                  type="number"
                  placeholder="5.2"
                  value={gzDynamicInputs.kg}
                  onChange={(e) => setGzDynamicInputs(prev => ({ ...prev, kg: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={calculateGZDynamic} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              GZ Hesapla
            </Button>
            {gzDynamicResults && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-600 rounded border-l-4 border-purple-500">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>GZ:</strong> {gzDynamicResults.gz.toFixed(4)} m</div>
                  <div><strong>Righting Moment:</strong> {(gzDynamicResults.rightingMoment/1000).toFixed(1)} kN·m</div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* 6. Rüzgar Etkisi */}
          <div className="bg-cyan-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">6. Rüzgar Etkisi</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="wind-pressure">Rüzgar Basıncı (q) [Pa]</Label>
                <Input
                  id="wind-pressure"
                  type="number"
                  placeholder="300"
                  value={windEffectInputs.windPressure}
                  onChange={(e) => setWindEffectInputs(prev => ({ ...prev, windPressure: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="wind-area">Yanal Alan (A) [m²]</Label>
                <Input
                  id="wind-area"
                  type="number"
                  placeholder="400"
                  value={windEffectInputs.lateralArea}
                  onChange={(e) => setWindEffectInputs(prev => ({ ...prev, lateralArea: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="wind-lever">Kol (z) [m]</Label>
                <Input
                  id="wind-lever"
                  type="number"
                  placeholder="8"
                  value={windEffectInputs.leverArm}
                  onChange={(e) => setWindEffectInputs(prev => ({ ...prev, leverArm: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="wind-displacement">Deplasman [t]</Label>
                <Input
                  id="wind-displacement"
                  type="number"
                  placeholder="3500"
                  value={windEffectInputs.displacement}
                  onChange={(e) => setWindEffectInputs(prev => ({ ...prev, displacement: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={calculateWindEffect} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              Rüzgar Etkisi Hesapla
            </Button>
            {windEffectResults && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-600 rounded border-l-4 border-cyan-500">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Heeling Moment:</strong> {windEffectResults.heelingMoment.toFixed(1)} kN·m</div>
                  <div><strong>Heeling Arm:</strong> {windEffectResults.heelingArm.toFixed(4)} m</div>
                </div>
              </div>
            )}
          </div>

          {/* 7. İnklinasyon Deneyi */}
          <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">7. İnklinasyon Deneyi</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="incl-weight">Test Ağırlığı (w) [t]</Label>
                <Input
                  id="incl-weight"
                  type="number"
                  placeholder="5"
                  value={inclinationInputs.testWeight}
                  onChange={(e) => setInclinationInputs(prev => ({ ...prev, testWeight: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="incl-distance">Şift Mesafesi (l) [m]</Label>
                <Input
                  id="incl-distance"
                  type="number"
                  placeholder="8"
                  value={inclinationInputs.shiftDistance}
                  onChange={(e) => setInclinationInputs(prev => ({ ...prev, shiftDistance: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="incl-displacement">Deplasman (Δ) [t]</Label>
                <Input
                  id="incl-displacement"
                  type="number"
                  placeholder="3500"
                  value={inclinationInputs.displacement}
                  onChange={(e) => setInclinationInputs(prev => ({ ...prev, displacement: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="incl-angle">Gözlenen Açı (φ) [°]</Label>
                <Input
                  id="incl-angle"
                  type="number"
                  placeholder="2.5"
                  value={inclinationInputs.observedAngle}
                  onChange={(e) => setInclinationInputs(prev => ({ ...prev, observedAngle: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={calculateInclinationTest} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              GM Ölç (İnklinasyon)
            </Button>
            {inclinationResults && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-600 rounded border-l-4 border-indigo-500">
                <div className="text-sm">
                  <div><strong>GM_T:</strong> {inclinationResults.gmt.toFixed(3)} m</div>
                  <div className="text-xs mt-1 text-indigo-600 dark:text-indigo-400">
                    GM_T = w·l/(Δ·tan φ)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 8. Yalpa Periyodu */}
          <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">8. Yalpa Periyodu</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="roll-breadth">Genişlik (B) [m]</Label>
                <Input
                  id="roll-breadth"
                  type="number"
                  placeholder="20"
                  value={rollPeriodInputs2.breadth}
                  onChange={(e) => setRollPeriodInputs2(prev => ({ ...prev, breadth: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="roll-gmcorr">GM_corr [m]</Label>
                <Input
                  id="roll-gmcorr"
                  type="number"
                  placeholder="1.1"
                  value={rollPeriodInputs2.gmCorr}
                  onChange={(e) => setRollPeriodInputs2(prev => ({ ...prev, gmCorr: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="roll-k">Atalet Yarıçapı (k) [m]</Label>
                <Input
                  id="roll-k"
                  type="number"
                  placeholder="Otomatik (0.35×B)"
                  value={rollPeriodInputs2.radiusOfGyration}
                  onChange={(e) => setRollPeriodInputs2(prev => ({ ...prev, radiusOfGyration: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={calculateRollPeriod} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              Yalpa Periyodu Hesapla
            </Button>
            {rollPeriodResults && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-600 rounded border-l-4 border-teal-500">
                <div className="text-sm">
                  <div><strong>Yalpa Periyodu:</strong> {rollPeriodResults.period.toFixed(2)} saniye</div>
                  <div className="text-xs mt-1 text-teal-600 dark:text-teal-400">
                    T = 2π·k/√(g·GM_corr)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 9. Angle of Loll */}
          {(!singleMode || calc === 'loll') && (
          <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">9. Angle of Loll</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loll2-gm">GM (negatif) [m]</Label>
                <Input
                  id="loll2-gm"
                  type="number"
                  placeholder="-0.5"
                  value={lollInputs2.gm}
                  onChange={(e) => setLollInputs2(prev => ({ ...prev, gm: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="loll2-bmt">BM_T [m]</Label>
                <Input
                  id="loll2-bmt"
                  type="number"
                  placeholder="3.2"
                  value={lollInputs2.bmt}
                  onChange={(e) => setLollInputs2(prev => ({ ...prev, bmt: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={calculateAngleOfLoll} className="w-full mt-4">
              <Calculator className="w-4 h-4 mr-2" />
              Loll Açısını Hesapla
            </Button>
            {lollResults && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-600 rounded border-l-4 border-red-500">
                <div className="text-sm">
                  <div><strong>Loll Açısı:</strong> {lollResults.lollAngle.toFixed(2)}°</div>
                  <div className="text-xs mt-1 text-red-600 dark:text-red-400">
                    tan φ_loll ≈ √(-2·GM/BM_T)
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

        </CardContent>
      </Card>
      </>
      )}

      {(!singleMode || section === 'analysis') && (
      <>
      <Separator />
      {/* Kapsamlı Stabilite Analizi */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <BarChart3 className="h-5 w-5" />
            Kapsamlı Stabilite Analizi
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
                    <Label htmlFor="draft">Su Çekimi (m)</Label>
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
                      <span>WPA:</span>
                      <span className="font-medium">{analysis.hydrostatic.waterplaneArea.toFixed(2)} m²</span>
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
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    IMO Kriterleri
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Alan (0-30°):</span>
                      <span className={`font-medium ${analysis.imoCriteria.area0to30 >= 0.055 ? 'text-green-700' : 'text-red-700'}`}>
                        {analysis.imoCriteria.area0to30.toFixed(3)} mrad
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alan (0-40°):</span>
                      <span className={`font-medium ${analysis.imoCriteria.area0to40 >= 0.09 ? 'text-green-700' : 'text-red-700'}`}>
                        {analysis.imoCriteria.area0to40.toFixed(3)} mrad
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maksimum GZ:</span>
                      <span className={`font-medium ${analysis.imoCriteria.maxGz >= 0.20 ? 'text-green-700' : 'text-red-700'}`}>
                        {analysis.imoCriteria.maxGz.toFixed(3)} m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Başlangıç GM:</span>
                      <span className={`font-medium ${analysis.imoCriteria.initialGM >= 0.15 ? 'text-green-700' : 'text-red-700'}`}>
                        {analysis.imoCriteria.initialGM.toFixed(3)} m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weather Criterion:</span>
                      <span className={`font-medium ${analysis.imoCriteria.weatherCriterion ? 'text-green-700' : 'text-red-700'}`}>
                        {analysis.imoCriteria.weatherCriterion ? 'Sağlandı' : 'Sağlanmadı'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Surface Correction ve Düzeltilmiş GM */}
              <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Anchor className="h-4 w-4" />
                  Free Surface Correction (FSC)
                </h4>
                <div className="overflow-x-auto text-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left opacity-70">
                        <th className="py-1 pr-4">Tank</th>
                        <th className="py-1 pr-4">FSM (proxy)</th>
                        <th className="py-1 pr-4">Düzeltme (m)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.freeSurfaceCorrections.map((f,i)=> (
                        <tr key={i} className="border-t border-amber-200/40">
                          <td className="py-1 pr-4">{f.tankName}</td>
                          <td className="py-1 pr-4">{(f.freeSurfaceMoment ?? 0).toFixed(4)}</td>
                          <td className="py-1 pr-4">{(f.correction ?? 0).toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div className="flex justify-between"><span>Toplam FSC</span><span className="font-mono">{HydrostaticCalculations.calculateTotalFSC(analysis.freeSurfaceCorrections).toFixed(4)} m</span></div>
                  <div className="flex justify-between"><span>Başlangıç GM</span><span className="font-mono">{analysis.stability.gm.toFixed(3)} m</span></div>
                  <div className="flex justify-between"><span>Düzeltilmiş GM</span><span className="font-mono">{HydrostaticCalculations.calculateCorrectedGM(analysis.stability.gm, HydrostaticCalculations.calculateTotalFSC(analysis.freeSurfaceCorrections)).toFixed(3)} m</span></div>
                </div>
              </div>

              {/* Dinamik Stabilite ve GZ Eğrisi */}
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Dinamik Stabilite ve GZ Eğrisi</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Maksimum Sağlama Momenti:</span>
                    <span className="font-medium">{Math.max(...analysis.dynamicStability.gzCurve.map(p => p.rightingMoment)).toFixed(0)} kN·m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vanishing Angle:</span>
                    <span className="font-medium">{analysis.stability.vanishingAngle.toFixed(1)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stabilite Kalitesi:</span>
                    <span className="font-medium">{analysis.dynamicStability.stabilityQuality.toFixed(3)}</span>
                  </div>
                </div>
              </div>

              {/* GZ Eğrisi Grafiği ve Metrix */}
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">GZ Eğrisi ve Sağlama Momenti</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <LineChart data={analysis.dynamicStability.gzCurve} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="angle" label={{ value: '°', position: 'insideBottomRight', offset: -4 }} />
                      <YAxis yAxisId="left" label={{ value: 'GZ (m)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'RM (kN·m)', angle: -90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="gz" name="GZ (m)" stroke="#10b981" dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="rightingMoment" name="Sağlama Momenti (kN·m)" stroke="#6366f1" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                  <div className="flex justify-between"><span>Max GZ</span><span className="font-mono">{analysis.stability.maxGz.toFixed(3)} m</span></div>
                  <div className="flex justify-between"><span>Max GZ Açısı</span><span className="font-mono">{analysis.stability.maxGzAngle.toFixed(1)}°</span></div>
                  <div className="flex justify-between"><span>Area 0-30°</span><span className="font-mono">{HydrostaticCalculations.calculateAreaUnderGZCurveAdaptive(analysis.stability.gz, analysis.stability.angles, 0, 30).toFixed(3)} mrad</span></div>
                  <div className="flex justify-between"><span>Area 0-40°</span><span className="font-mono">{HydrostaticCalculations.calculateAreaUnderGZCurveAdaptive(analysis.stability.gz, analysis.stability.angles, 0, 40).toFixed(3)} mrad</span></div>
                </div>
              </div>

              {/* Cross Curves (KN) ve Weather Criterion */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Cross Curves (KN) CSV</h4>
                  <p className="text-xs mb-2 opacity-80">Format: angle,kn satırları</p>
                  <textarea
                    className="w-full h-32 p-2 rounded bg-white dark:bg-gray-700"
                    placeholder={"0,0\n10,0.1\n20,0.3\n30,0.55"}
                    value={crossCurvesText}
                    onChange={(e)=>setCrossCurvesText(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button variant="default" onClick={() => {
                      try {
                        const parsed = HydrostaticCalculations.parseCrossCurvesCSV(crossCurvesText);
                        if (parsed.angles?.length > 0 && parsed.kn?.length === parsed.angles.length) {
                          setCrossCurvesSet(parsed);
                          toast({ title: 'KN yüklendi', description: `${parsed.angles.length} açı okundu` });
                        } else {
                          toast({ title: 'Hata', description: 'Geçersiz KN CSV', variant: 'destructive' });
                        }
                      } catch (e) {
                        toast({ title: 'Hata', description: 'CSV parse edilemedi', variant: 'destructive' });
                      }
                    }}>Uygula</Button>
                    <Button variant="outline" onClick={() => { setCrossCurvesText(''); setCrossCurvesSet(undefined); }}>Temizle</Button>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Weather Criterion (Basitleştirilmiş)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                    <div>
                      <Label>Baskı P (N/m²)</Label>
                      <Input type="number" value={weatherInputs.pressure} onChange={(e)=> setWeatherInputs(p=>({...p, pressure:e.target.value}))} />
                    </div>
                    <div>
                      <Label>Alan A (m²)</Label>
                      <Input type="number" value={weatherInputs.area} onChange={(e)=> setWeatherInputs(p=>({...p, area:e.target.value}))} />
                    </div>
                    <div>
                      <Label>Kaldıraç h (m)</Label>
                      <Input type="number" value={weatherInputs.lever} onChange={(e)=> setWeatherInputs(p=>({...p, lever:e.target.value}))} />
                    </div>
                    <Button className="w-full mt-2 md:mt-0" onClick={() => {
                      const pressure = parseFloat(weatherInputs.pressure);
                      const area = parseFloat(weatherInputs.area);
                      const lever = parseFloat(weatherInputs.lever);
                      if (analysis && ![pressure, area, lever].some(isNaN)) {
                        const res = HydrostaticCalculations.checkWeatherCriterion(analysis.stability, {
                          pressureNPerM2: pressure,
                          areaM2: area,
                          leverM: lever,
                          displacementT: analysis.hydrostatic.displacement
                        });
                        setWeatherResult(res);
                        toast({ title: 'Weather Criterion', description: res.ok ? 'Sağlandı' : 'Sağlanmadı' });
                      } else {
                        toast({ title: 'Hata', description: 'Geçerli değerler girin', variant: 'destructive' });
                      }
                    }}>Değerlendir</Button>
                  </div>
                  {weatherResult && (
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sonuç:</span>
                        <span className={`font-medium ${weatherResult.ok ? 'text-green-700' : 'text-red-700'}`}>{weatherResult.ok ? 'Sağlandı' : 'Sağlanmadı'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Denge Açısı φ_eq:</span>
                        <span className="font-medium">{weatherResult.phiEq.toFixed(1)}°</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </>
      )}

      {(!singleMode || section === 'bonjean') && (
      <>
      <Separator />
      {/* Bonjean Entegrasyonu */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <BarChart3 className="h-5 w-5" />
            Bonjean Eğrileri / Kesit Entegrasyonu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="bonjean-json">Bonjean JSON (sections[], stationSpacing)</Label>
            <textarea
              id="bonjean-json"
              className="w-full h-40 p-2 rounded bg-white dark:bg-gray-700"
              placeholder='{"sections": [{"station":0,"area":..,"moment":..},...], "stationSpacing": 5}'
              value={bonjeanText}
              onChange={(e) => setBonjeanText(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => {
              try {
                const parsed = JSON.parse(bonjeanText);
                if (parsed?.sections && Array.isArray(parsed.sections) && typeof parsed.stationSpacing === 'number') {
                  setBonjeanSet(parsed);
                  toast({ title: 'Bonjean uygulandı', description: `İstasyon sayısı: ${parsed.sections.length}` });
                } else {
                  toast({ title: 'Hata', description: 'Geçersiz Bonjean JSON', variant: 'destructive' });
                }
              } catch (e) {
                toast({ title: 'Hata', description: 'JSON parse edilemedi', variant: 'destructive' });
              }
            }}>Uygula</Button>
            <Button variant="outline" onClick={() => { setBonjeanText(''); setBonjeanSet(undefined); }}>Temizle</Button>
          </div>
        </CardContent>
      </Card>
      </>
      )}

      {(!singleMode || section === 'draft') && (
      <>
      <Separator />
      {/* Comprehensive Draft Survey */}
      <DraftSurveyMenu />
      </>
      )}

      {(!singleMode || section === 'damage') && (
      <>
      <Separator />
      {/* Hasar Stabilitesi */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
            <AlertTriangle className="h-5 w-5" />
            Hasar Stabilitesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <Input placeholder="Bölme adı" value={newCompartment.compartment} onChange={(e)=> setNewCompartment(p=>({...p, compartment:e.target.value}))} />
              <Input placeholder="Suya gömülen hacim [m³]" value={newCompartment.floodedVolume} onChange={(e)=> setNewCompartment(p=>({...p, floodedVolume:e.target.value}))} />
              <Input placeholder="Yeni KG [m]" value={newCompartment.newKG} onChange={(e)=> setNewCompartment(p=>({...p, newKG:e.target.value}))} />
              <Button onClick={()=>{
                const fv = parseFloat(newCompartment.floodedVolume);
                const nk = parseFloat(newCompartment.newKG);
                if(isNaN(fv) || isNaN(nk) || !newCompartment.compartment){
                  toast({ title:'Hata', description:'Geçerli bölme/veri girin', variant:'destructive' }); return;
                }
                const comp: CompartmentAnalysis = { compartment: newCompartment.compartment, floodedVolume: fv, newKG: nk, residualGM: 0, downfloodingAngle: 0 };
                setFloodedCompartments(prev=> [...prev, comp]);
                setNewCompartment({ compartment:"", floodedVolume:"", newKG:"" });
              }}>Bölme Ekle</Button>
            </div>

            {analysis && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-rose-50 dark:bg-gray-700 p-4 rounded">
                <div className="flex justify-between"><span>Residual GM</span><span className="font-mono">{analysis.damageStability.residualGM.toFixed(3)} m</span></div>
                <div className="flex justify-between"><span>Downflooding Angle</span><span className="font-mono">{analysis.damageStability.downfloodingAngle.toFixed(1)}°</span></div>
                <div className="flex justify-between"><span>Survival Factor</span><span className="font-mono">{analysis.damageStability.survivalFactor.toFixed(3)}</span></div>
                <div className="flex justify-between"><span>Cross Flooding Time</span><span className="font-mono">{analysis.damageStability.crossFloodingTime.toFixed(0)} dk</span></div>
                <div className="flex justify-between"><span>Flooded Volume</span><span className="font-mono">{analysis.damageStability.floodedVolume.toFixed(1)} m³</span></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
};