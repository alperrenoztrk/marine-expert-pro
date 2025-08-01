import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, Activity, Target, BarChart3, Waves, Ship, Droplets, Compass, Ruler } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrimData {
  // Ship Parameters
  L: number; // Length between perpendiculars (m)
  B: number; // Breadth (m)
  displacement: number; // Current displacement (tonnes)
  LCF: number; // Longitudinal Center of Flotation from AP (m)
  LCB: number; // Longitudinal Center of Buoyancy from AP (m)
  MCT: number; // Moment to Change Trim 1 cm (tonne.m/cm)
  TPC: number; // Tonnes per Centimeter immersion
  GML: number; // Longitudinal metacentric height (m)
  volume: number; // Underwater volume (m³)
  waterplaneArea: number; // Waterplane area (m²)
  
  // Current condition
  draftForward: number; // Forward draft (m)
  draftAft: number; // Aft draft (m)
  draftMidships: number; // Midships draft (m)
  
  // Weight operations
  weightAdded: number; // Weight to be added/removed (tonnes)
  weightLCG: number; // Longitudinal position of weight from AP (m)
  
  // Additional parameters
  CB: number; // Block coefficient
  waterplaneCoeff: number; // Waterplane coefficient
  trimMomentArm: number; // Trim moment arm (m)
  maxAllowableTrim: number; // Max allowable trim (m)
  
  // Draft Survey Parameters
  surveyType: 'initial' | 'final' | 'bunker'; // Survey type
  freeboardForward: number; // Freeboard forward (m)
  freeboardAft: number; // Freeboard aft (m)
  freeboardMidships: number; // Freeboard midships (m)
  airTemperature: number; // Air temperature (°C)
  waterTemperature: number; // Water temperature (°C)
  waterDensity: number; // Water density (kg/m³)
  ballastWeight: number; // Ballast weight (tonnes)
  fuelWeight: number; // Fuel weight (tonnes)
  freshWaterWeight: number; // Fresh water weight (tonnes)
  
  // Sounding Table Parameters
  tankType: 'cargo' | 'ballast' | 'fuel' | 'freshwater'; // Tank type
  tankNumber: number; // Tank number
  soundingDepth: number; // Sounding depth (cm)
  tankLength: number; // Tank length (m)
  tankWidth: number; // Tank width (m)
  tankHeight: number; // Tank height (m)
  trimCorrection: boolean; // Apply trim correction
  heelCorrection: boolean; // Apply heel correction
  
  // Bonjean Curves Parameters
  stationNumber: number; // Station number (0-20)
  waterlineHeight: number; // Waterline height (m)
  frameSpacing: number; // Frame spacing (m)
  
  // Environmental factors
  waveHeight: number; // Significant wave height (m)
  windSpeed: number; // Wind speed (knots)
  currentSpeed: number; // Current speed (knots)
  crossSectionalArea: number; // Cross-sectional area (m²)
  stationPosition: number; // Station position (m)
  moment: number; // Moment (m³)
  tankArea: number; // Tank area (m²)
  liquidHeight: number; // Liquid height (m)
  liquidDensity: number; // Liquid density (kg/m³)
  
  // Trim Effects on Draft Differences
  weightChange: number; // Weight change (tonnes)
  weightDistance: number; // Distance from AP (m)
  trimChange: number; // Trim change (cm)
  draftDifference: number; // Draft difference (m)
  newDraft: number; // New draft (m)
  originalDraft: number; // Original draft (m)
  draftChange: number; // Draft change (m)
  measurementPoint: number; // Measurement point (m)
}

interface TrimResult {
  // Basic Trim Results
  currentTrim: number; // Current trim (m)
  trimMoment: number; // Trim moment (tonne.m)
  trimChange: number; // Change in trim (cm)
  newTrimBy: number; // New trim condition (m)
  newDraftForward: number; // New forward draft (m)
  newDraftAft: number; // New aft draft (m)
  newDraftMidships: number; // New midships draft (m)
  newMeanDraft: number; // New mean draft (m)
  bodilyChange: number; // Change due to bodily sinkage (cm)
  
  // Draft Survey Results
  draftSurvey: {
    grossDisplacement: number; // Gross displacement (tonnes)
    netDisplacement: number; // Net displacement (tonnes)
    cargoWeight: number; // Calculated cargo weight (tonnes)
    densityCorrection: number; // Density correction (tonnes)
    trimCorrection: number; // Trim correction (tonnes)
    draftAccuracy: number; // Draft reading accuracy (cm)
    surveyReliability: 'excellent' | 'good' | 'fair' | 'poor';
    deadweightUtilization: number; // Deadweight utilization (%)
  };
  
  // Trim Effects on Draft Differences
  trimEffects: {
    forwardDraftChange: number; // Forward draft change due to trim (cm)
    aftDraftChange: number; // Aft draft change due to trim (cm)
    midshipsDraftChange: number; // Midships draft change due to trim (cm)
    maximumDraftDifference: number; // Maximum draft difference (cm)
    distributionFactor: number; // Trim distribution factor
    hydrostatic: {
      LCF_new: number; // New LCF position (m)
      MCT_new: number; // New MCT value (tonne.m/cm)
      TPC_new: number; // New TPC value (tonnes/cm)
    };
  };
  
  // Bonjean Curves Results
  bonjeanCurves: {
    area: number; // Cross-sectional area at station (m²)
    firstMoment: number; // First moment of area (m³)
    centroid: number; // Centroid height from baseline (m)
    volume: number; // Volume to waterline (m³)
    displacement: number; // Displacement to waterline (tonnes)
    LCB_station: number; // LCB contribution from station (m)
    coefficients: {
      CP: number; // Prismatic coefficient
      CM: number; // Midship coefficient  
      CWP: number; // Waterplane coefficient
    };
  };
  
  // Sounding Table Results
  soundingTable: {
    tankVolume: number; // Tank volume at sounding (m³)
    liquidWeight: number; // Liquid weight (tonnes)
    freeVolume: number; // Free volume remaining (m³)
    fillPercentage: number; // Tank fill percentage
    correctedVolume: number; // Trim/heel corrected volume (m³)
    vcg: number; // Vertical center of gravity of liquid (m)
    lcg: number; // Longitudinal center of gravity of liquid (m)
    tcg: number; // Transverse center of gravity of liquid (m)
    corrections: {
      trimCorrection: number; // Trim correction factor
      heelCorrection: number; // Heel correction factor
      densityCorrection: number; // Density correction factor
      temperatureCorrection: number; // Temperature correction factor
    };
  };
  
  // Enhanced calculations (existing)
  trimPercentage: number;
  hydrostaticStability: number;
  longitudinalStressIndex: number;
  shearForceDistribution: number;
  bendingMomentCoeff: number;
  
  // Performance impacts (existing)
  speedLoss: number;
  fuelConsumptionIncrease: number;
  maneuverabilityIndex: number;
  seakeepingIndex: number;
  
  // Regulatory compliance (existing)
  imoCompliance: {
    loadLineConvention: boolean;
    solasStability: boolean;
    trimLimitation: boolean;
    strengthStandard: boolean;
    operationalGuidance: boolean;
  };
  
  status: 'excellent' | 'good' | 'acceptable' | 'warning' | 'excessive' | 'dangerous';
  recommendations: string[];
  warnings: string[];
  
  // List calculations (existing)
  listAngle: number;
  maxPermissibleList: number;
  listCorrection: number;
  heelMoment: number;
  rightingMoment: number;
  stabilityMargin: number;
}

interface TrimCalculationsProps {
  onCalculationComplete?: (calculationType: string, inputData: any, resultData: any) => void;
}

export const TrimCalculations = ({ onCalculationComplete }: TrimCalculationsProps = {}) => {
  const { toast } = useToast();
  const [trimData, setTrimData] = useState<TrimData>({
    L: 140,
    B: 22,
    displacement: 15000,
    LCF: 68,
    LCB: 70,
    MCT: 180,
    TPC: 25.5,
    GML: 150,
    volume: 15000,
    waterplaneArea: 2500,
    draftForward: 7.50,
    draftAft: 7.80,
    draftMidships: 7.65,
    weightAdded: 500,
    weightLCG: 10,
    CB: 0.75,
    waterplaneCoeff: 0.85,
    trimMomentArm: 5,
    maxAllowableTrim: 1.5,
    surveyType: 'initial',
    freeboardForward: 2.5,
    freeboardAft: 2.2,
    freeboardMidships: 2.35,
    airTemperature: 25,
    waterTemperature: 20,
    waterDensity: 1025,
    ballastWeight: 2000,
    fuelWeight: 800,
    freshWaterWeight: 200,
    tankType: 'cargo',
    tankNumber: 1,
    soundingDepth: 500,
    tankLength: 20,
    tankWidth: 15,
    tankHeight: 12,
    trimCorrection: true,
    heelCorrection: true,
    stationNumber: 10,
    waterlineHeight: 8,
    frameSpacing: 7,
    waveHeight: 2,
    windSpeed: 15,
    currentSpeed: 3,
    crossSectionalArea: 150,
    stationPosition: 70,
    moment: 150,
    tankArea: 50,
    liquidHeight: 2.5,
    liquidDensity: 1025,
    weightChange: 500,
    weightDistance: 10,
    trimChange: 25,
    draftDifference: 0.125,
    newDraft: 0,
    originalDraft: 8.0,
    draftChange: 0.125,
    measurementPoint: 70
  });

  const [trimResult, setTrimResult] = useState<TrimResult | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [basicTrimResults, setBasicTrimResults] = useState<{
    trimAngle: number;
    mct: number;
    trimChange: number;
  } | null>(null);

  const [draftSurveyResults, setDraftSurveyResults] = useState<{
    meanDraft: number;
    displacement: number;
    tpc: number;
  } | null>(null);

  const [bonjeanResults, setBonjeanResults] = useState<{
    volume: number;
    lcb: number;
    moment: number;
  } | null>(null);

  const [soundingResults, setSoundingResults] = useState<{
    volume: number;
    weight: number;
    moment: number;
  } | null>(null);

  const [trimEffectsResults, setTrimEffectsResults] = useState<{
    trimChange: number;
    draftDifference: number;
    newDraft: number;
  } | null>(null);

  // Calculate current trim
  const calculateCurrentTrim = (draftAft: number, draftForward: number): number => {
    return draftAft - draftForward; // Positive = trim by stern
  };

  // Calculate mean draft
  const calculateMeanDraft = (draftForward: number, draftAft: number): number => {
    return (draftForward + draftAft) / 2;
  };

  // Calculate Draft Survey
  const calculateDraftSurvey = () => {
    // Formül 1: Ortalama Draft - T_mean = (T_f + 4×T_m + T_a) / 6
    const meanDraft = (trimData.draftForward + 4 * trimData.draftMidships + trimData.draftAft) / 6;
    
    // Formül 2: Displacement - Δ = V × ρ_sw
    const displacement = (trimData.volume * trimData.waterDensity) / 1000; // Convert to tonnes
    
    // Formül 3: TPC - TPC = (A_wp × ρ_sw) / 100
    const tpc = (trimData.waterplaneArea * trimData.waterDensity) / 100000; // Convert to tonnes/cm
    
    setDraftSurveyResults({
      meanDraft: meanDraft,
      displacement: displacement,
      tpc: tpc
    });
    
    toast.success("Draft survey hesaplamaları tamamlandı!");
  };

  // Calculate Trim Effects on Draft Differences
  const calculateTrimEffects = () => {
    // Formül 1: Trim Değişimi - ΔT = (W × d) / MCT
    const trimChange = (trimData.weightChange * trimData.weightDistance) / trimData.MCT;
    
    // Formül 2: Draft Farkı - ΔD = ΔT × (x/L)
    const draftDifference = (trimData.trimChange * trimData.measurementPoint) / trimData.L;
    
    // Formül 3: Yeni Draft - D_new = D_old + ΔD
    const newDraft = trimData.originalDraft + trimData.draftChange;
    
    setTrimEffectsResults({
      trimChange: trimChange,
      draftDifference: draftDifference,
      newDraft: newDraft
    });
    
    toast.success("Trim etkileri hesaplamaları tamamlandı!");
  };

  // Calculate Bonjean Curves
  const calculateBonjeanCurves = () => {
    const stationPosition = trimData.stationPosition;
    const crossSectionalArea = trimData.crossSectionalArea;
    const frameSpacing = trimData.frameSpacing;
    
    // Calculate volume
    const volume = crossSectionalArea * frameSpacing;
    
    // Calculate LCB
    const lcb = (crossSectionalArea * stationPosition) / volume;
    
    // Calculate moment
    const moment = (crossSectionalArea * stationPosition * stationPosition) / volume;
    
    setBonjeanResults({
      volume: volume,
      lcb: lcb,
      moment: moment
    });
    
    toast.success("Bonjean Curves hesaplamaları tamamlandı!");
  };

  // Calculate Sounding Table Volume
  const calculateSoundingTable = () => {
    const volume = trimData.tankArea * trimData.liquidHeight;
    const weight = volume * trimData.liquidDensity;
    const moment = volume * trimData.liquidHeight / 2;
    
    setSoundingResults({
      volume: volume,
      weight: weight,
      moment: moment
    });
    
    toast.success("Sounding Table hesaplamaları tamamlandı!");
  };

  // Calculate trim moment
  const calculateTrimMoment = (weight: number, distance: number, LCF: number): number => {
    return weight * (distance - LCF);
  };

  // Calculate change in trim due to weight addition/removal
  const calculateTrimChange = (trimMoment: number, MCT: number): number => {
    return trimMoment / MCT; // Result in cm
  };

  // Calculate bodily sinkage/rise
  const calculateBodilyChange = (weight: number, TPC: number): number => {
    return weight / TPC; // Result in cm
  };

  // Enhanced trim performance analysis
  const calculatePerformanceImpact = (trimValue: number, L: number, speed: number = 15): {
    speedLoss: number;
    fuelIncrease: number;
    maneuverability: number;
    seakeeping: number;
  } => {
    const trimRatio = Math.abs(trimValue) / L;
    
    // Speed loss calculation based on trim ratio
    const speedLoss = Math.min(trimRatio * 100 * 2.5, 15); // Max 15% speed loss
    
    // Fuel consumption increase
    const fuelIncrease = Math.min(trimRatio * 100 * 3, 20); // Max 20% increase
    
    // Maneuverability index (10 = excellent, 1 = poor)
    let maneuverability = 10 - (trimRatio * 100 * 4);
    maneuverability = Math.max(1, Math.min(10, maneuverability));
    
    // Seakeeping index
    let seakeeping = 10 - (trimRatio * 100 * 3);
    if (trimValue > 0) seakeeping -= 1; // Stern trim reduces seakeeping more
    seakeeping = Math.max(1, Math.min(10, seakeeping));
    
    return {
      speedLoss,
      fuelIncrease,
      maneuverability,
      seakeeping
    };
  };

  // Calculate list angle and corrections
  const calculateListAnalysis = (data: TrimData): {
    listAngle: number;
    maxPermissibleList: number;
    listCorrection: number;
    heelMoment: number;
    rightingMoment: number;
    stabilityMargin: number;
  } => {
    // Simplified list calculations for demonstration
    const asymmetricWeight = (data.weightAdded || 0) * 0.1; // Assume 10% asymmetric loading
    const heelMoment = asymmetricWeight * (data.B || 25) / 2;
    const GM = 1.5; // Assumed GM for calculation
    const rightingMoment = data.displacement * GM;
    
    const listAngle = Math.atan(heelMoment / rightingMoment) * (180 / Math.PI);
    const maxPermissibleList = 5; // 5 degrees max permissible
    const listCorrection = Math.abs(listAngle) > 2 ? heelMoment / (data.B || 25) : 0;
    const stabilityMargin = rightingMoment / heelMoment;
    
    return {
      listAngle,
      maxPermissibleList,
      listCorrection,
      heelMoment,
      rightingMoment,
      stabilityMargin
    };
  };

  // Calculate new drafts after weight operation
  const calculateNewDrafts = (
    currentDraftF: number,
    currentDraftA: number,
    currentDraftM: number,
    bodilyChange: number,
    trimChange: number,
    L: number,
    LCF: number
  ) => {
    const bodilyChangeM = bodilyChange / 100; // Convert to meters
    const trimChangeM = trimChange / 100; // Convert to meters
    
    // New mean draft
    const newMeanDraft = calculateMeanDraft(currentDraftF, currentDraftA) + bodilyChangeM;
    
    // Trim moment lever arms
    const leverAft = LCF;
    const leverForward = L - LCF;
    const leverMidships = Math.abs(L/2 - LCF);
    
    // New drafts
    const newDraftAft = currentDraftA + bodilyChangeM + (trimChangeM * leverAft / L);
    const newDraftForward = currentDraftF + bodilyChangeM - (trimChangeM * leverForward / L);
    const newDraftMidships = currentDraftM + bodilyChangeM + (trimChangeM * leverMidships / L) * (L/2 > LCF ? -1 : 1);
    
    return {
      newDraftForward,
      newDraftAft,
      newDraftMidships,
      newMeanDraft
    };
  };

  // Calculate TPC (Tonnes per Centimeter) - enhanced
  const calculateTPC = (L: number, B: number, CB: number = 0.75, CWP: number = 0.85): number => {
    const waterplaneArea = L * B * CWP;
    return (waterplaneArea * 1.025) / 100; // 1.025 = seawater density
  };

  // Calculate MCT (Moment to Change Trim 1 cm) - enhanced
  const calculateMCT = (displacement: number, L: number, BML: number = 150): number => {
    // BML = Longitudinal metacentric height (typical range 100-200m)
    return (displacement * BML) / 100;
  };

  // Enhanced status determination
  const determineStatus = (trimValue: number, L: number, data: TrimData): TrimResult['status'] => {
    const trimRatio = Math.abs(trimValue) / L;
    
    if (trimRatio <= 0.005) return 'excellent'; // ≤ 0.5%
    if (trimRatio <= 0.01) return 'good'; // ≤ 1%
    if (trimRatio <= 0.015) return 'acceptable'; // ≤ 1.5%
    if (trimRatio <= 0.02) return 'warning'; // ≤ 2%
    if (trimRatio <= 0.025) return 'excessive'; // ≤ 2.5%
    return 'dangerous'; // > 2.5%
  };

  // Generate comprehensive recommendations
  const generateRecommendations = (result: TrimResult, data: TrimData): {
    recommendations: string[];
    warnings: string[];
  } => {
    const recommendations: string[] = [];
    const warnings: string[] = [];
    
    // Draft Survey recommendations
    if (result.draftSurvey.draftAccuracy > 5) {
      warnings.push("Draft okuma hassasiyeti düşük - ölçümleri tekrarlayın");
    }
    
    if (result.draftSurvey.surveyReliability === 'poor') {
      warnings.push("Draft survey güvenilirliği düşük - hava koşullarını bekleyin");
    }
    
    if (result.draftSurvey.deadweightUtilization > 95) {
      warnings.push("Deadweight kullanımı çok yüksek - yük dağılımını kontrol edin");
    }
    
    // Trim-based recommendations
    if (Math.abs(result.newTrimBy) > (data.L || 140) * 0.015) {
      recommendations.push("Trim değeri yüksek - balast transferi ile düzeltme yapın");
      if (result.newTrimBy > 0) {
        recommendations.push("Kıç trim (stern) - baş ballast tanklarına su alın");
      } else {
        recommendations.push("Baş trim (head) - kıç ballast tanklarına su alın");
      }
    }
    
    // Sounding table recommendations
    if (result.soundingTable.fillPercentage > 95) {
      warnings.push("Tank doluluk oranı çok yüksek - taşma riski");
    }
    
    if (result.soundingTable.corrections.trimCorrection > 1.05) {
      recommendations.push("Trim düzeltme faktörü yüksek - tank hesaplamalarını gözden geçirin");
    }
    
    // Bonjean curves recommendations
    if (result.bonjeanCurves.coefficients.CP < 0.6) {
      recommendations.push("Prismatic katsayı düşük - performans optimizasyonu gerekli");
    }
    
    // Performance recommendations
    if (result.speedLoss > 5) {
      recommendations.push(`Hız kaybı %${result.speedLoss.toFixed(1)} - trim optimizasyonu yapın`);
    }
    
    if (result.fuelConsumptionIncrease > 8) {
      recommendations.push(`Yakıt tüketimi %${result.fuelConsumptionIncrease.toFixed(1)} artmış - even keel'e yakın duruma getirin`);
    }
    
    // List recommendations
    if (Math.abs(result.listAngle) > 2) {
      recommendations.push(`List açısı ${result.listAngle.toFixed(1)}° - ${result.listCorrection.toFixed(0)} ton balast transferi yapın`);
    }
    
    // Stability warnings
    if (result.stabilityMargin < 5) {
      warnings.push("Stabilite marjı düşük - ağırlık dağılımını gözden geçirin");
    }
    
    // Regulatory warnings
    if (!result.imoCompliance.loadLineConvention) {
      warnings.push("IMO Load Line Convention limitlerini aşıyor");
    }
    
    if (!result.imoCompliance.solasStability) {
      warnings.push("SOLAS stabilite gereksinimlerini karşılamıyor");
    }
    
    return { recommendations, warnings };
  };

  // Main trim calculation - enhanced with new features
  const calculateTrim = () => {
    if (!trimData.L || !trimData.displacement || !trimData.draftForward || 
        !trimData.draftAft || !trimData.LCF) {
      toast({
        title: "Eksik Veri",
        description: "Lütfen gerekli değerleri girin.",
        variant: "destructive",
      });
      return;
    }

    const data = trimData as TrimData;
    
    // Calculate current condition
    const currentTrim = calculateCurrentTrim(data.draftAft, data.draftForward);
    const currentMeanDraft = calculateMeanDraft(data.draftForward, data.draftAft);
    
    // Calculate or use provided TPC and MCT
    const TPC = data.TPC || calculateTPC(data.L, data.B || 25, data.CB, data.waterplaneCoeff);
    const MCT = data.MCT || calculateMCT(data.displacement, data.L);
    
    // Weight operation calculations
    const weightAdded = data.weightAdded || 0;
    const weightLCG = data.weightLCG || data.LCF;
    
    const trimMoment = calculateTrimMoment(weightAdded, weightLCG, data.LCF);
    const trimChange = calculateTrimChange(trimMoment, MCT);
    const bodilyChange = calculateBodilyChange(weightAdded, TPC);
    
    // Calculate new drafts including midships
    const { newDraftForward, newDraftAft, newDraftMidships, newMeanDraft } = calculateNewDrafts(
      data.draftForward,
      data.draftAft,
      data.draftMidships || currentMeanDraft,
      bodilyChange,
      trimChange,
      data.L,
      data.LCF
    );
    
    const newTrimBy = newDraftAft - newDraftForward;
    
    // Enhanced calculations
    const trimPercentage = (Math.abs(newTrimBy) / data.L) * 100;
    const hydrostaticStability = MCT / (data.displacement * 0.01);
    const longitudinalStressIndex = Math.abs(newTrimBy) / (data.L * 0.02) * 100;
    const shearForceDistribution = Math.abs(trimMoment) / (data.displacement * data.L) * 100;
    const bendingMomentCoeff = (trimMoment * data.L) / (data.displacement * Math.pow(data.L, 2)) * 1000;
    
    // Performance impact analysis
    const performance = calculatePerformanceImpact(newTrimBy, data.L);
    
    // List analysis
    const listAnalysis = calculateListAnalysis(data);
    
    // Status determination
    const status = determineStatus(newTrimBy, data.L, data);
    
    // IMO Compliance check
    const imoCompliance = {
      loadLineConvention: Math.abs(newTrimBy) <= data.L * 0.02, // Max 2% of length
      solasStability: Math.abs(newTrimBy) <= data.L * 0.015, // Max 1.5% for stability
      trimLimitation: Math.abs(newTrimBy) <= (data.maxAllowableTrim || 1.5),
      strengthStandard: longitudinalStressIndex <= 80, // Max 80% of design limit
      operationalGuidance: trimPercentage <= 1.5 // Operational guidance
    };
    
    // NEW CALCULATIONS
    // Draft Survey calculations
    const draftSurvey = calculateDraftSurvey(data);
    
    // Trim effects on draft differences
    const trimEffects = calculateTrimEffects(data, currentTrim);
    
    // Bonjean curves calculations
    const bonjeanCurves = calculateBonjeanCurves();
    
    // Sounding table calculations (temporary result for corrections)
    const tempResult = {
      currentTrim,
      listAngle: listAnalysis.listAngle
    } as TrimResult;
    
    const soundingTable = calculateSoundingTable(data);
    
    const result: TrimResult = {
      currentTrim,
      trimMoment,
      trimChange,
      newTrimBy,
      newDraftForward,
      newDraftAft,
      newDraftMidships,
      newMeanDraft,
      bodilyChange,
      
      // NEW: Draft Survey Results
      draftSurvey,
      
      // NEW: Trim Effects
      trimEffects,
      
      // NEW: Bonjean Curves
      bonjeanCurves,
      
      // NEW: Sounding Table
      soundingTable,
      
      // Existing enhanced calculations
      trimPercentage,
      hydrostaticStability,
      longitudinalStressIndex,
      shearForceDistribution,
      bendingMomentCoeff,
      speedLoss: performance.speedLoss,
      fuelConsumptionIncrease: performance.fuelIncrease,
      maneuverabilityIndex: performance.maneuverability,
      seakeepingIndex: performance.seakeeping,
      imoCompliance,
      status,
      ...listAnalysis,
      recommendations: [],
      warnings: []
    };
    
    // Generate recommendations and warnings
    const advice = generateRecommendations(result, data);
    result.recommendations = advice.recommendations;
    result.warnings = advice.warnings;
    
    setTrimResult(result);
    
    // Call onCalculationComplete if provided
    if (onCalculationComplete) {
      onCalculationComplete('trim_draft_survey', data, result);
    }
    
    const statusMessages = {
      excellent: "Mükemmel trim ve draft durumu!",
      good: "İyi trim ve draft durumu",
      acceptable: "Kabul edilebilir trim",
      warning: "Trim uyarısı",
      excessive: "Aşırı trim!",
      dangerous: "Tehlikeli trim durumu!"
    };
    
    toast({
      title: "Kapsamlı Trim ve Draft Analizi Tamamlandı!",
      description: `${statusMessages[status]} - Yeni trim: ${newTrimBy > 0 ? 'Stern' : 'Head'} ${Math.abs(newTrimBy).toFixed(3)}m`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500 cyberpunk:bg-yellow-500';
      case 'acceptable': return 'bg-yellow-500';
      case 'warning': return 'bg-orange-500';
      case 'excessive': return 'bg-red-500';
      case 'dangerous': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (value: number, type: 'index' | 'percentage') => {
    if (type === 'index') {
      if (value >= 8) return 'text-green-600';
      if (value >= 6) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value <= 3) return 'text-green-600';
      if (value <= 8) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const calculateBasicTrim = () => {
    // Formül 1: Trim Açısı - θ = arctan((T_a - T_f) / L)
    const trimAngle = Math.atan((trimData.draftAft - trimData.draftForward) / trimData.L) * (180 / Math.PI);
    
    // Formül 2: MCT - MCT = (Δ × GM_L × B²) / (12 × L)
    const mct = (trimData.displacement * trimData.GML * Math.pow(trimData.B, 2)) / (12 * trimData.L);
    
    // Formül 3: Trim Değişimi - ΔT = (W × d) / MCT
    const trimChange = (trimData.weightAdded * trimData.weightLCG) / mct;
    
    setBasicTrimResults({
      trimAngle: trimAngle,
      mct: mct,
      trimChange: trimChange
    });
    
    toast.success("Temel trim hesaplamaları tamamlandı!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-lg">
              <TabsTrigger value="basic" className="flex-1 min-w-[120px] text-xs">Temel Trim</TabsTrigger>
              <TabsTrigger value="draft-survey" className="flex-1 min-w-[120px] text-xs">Draft Survey</TabsTrigger>
              <TabsTrigger value="trim-effects" className="flex-1 min-w-[120px] text-xs">Trim Etkileri</TabsTrigger>
              <TabsTrigger value="bonjean" className="flex-1 min-w-[120px] text-xs">Bonjean</TabsTrigger>
              <TabsTrigger value="sounding" className="flex-1 min-w-[120px] text-xs">Sounding</TabsTrigger>
              <TabsTrigger value="operations" className="flex-1 min-w-[120px] text-xs">Yük İşlemleri</TabsTrigger>
              <TabsTrigger value="performance" className="flex-1 min-w-[120px] text-xs">Performans</TabsTrigger>
              <TabsTrigger value="analysis" className="flex-1 min-w-[120px] text-xs">Analiz</TabsTrigger>
            </TabsList>
            
            {/* 2 satır boşluk */}
            <div className="mt-12"></div>

            <TabsContent value="basic" className="space-y-6">
              {/* Formül 1: Trim Açısı - θ = arctan((T_a - T_f) / L) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">📐 Trim Açısı Hesaplama</h3>
                <p className="text-sm text-gray-600">θ = arctan((T_a - T_f) / L)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="draftAft">Kıç Draft (T_a) [m]</Label>
                    <Input
                      id="draftAft"
                      type="number"
                      step="0.01"
                      value={trimData.draftAft || ''}
                      onChange={(e) => setTrimData({...trimData, draftAft: parseFloat(e.target.value)})}
                      placeholder="8.20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="draftForward">Baş Draft (T_f) [m]</Label>
                    <Input
                      id="draftForward"
                      type="number"
                      step="0.01"
                      value={trimData.draftForward || ''}
                      onChange={(e) => setTrimData({...trimData, draftForward: parseFloat(e.target.value)})}
                      placeholder="7.50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="L">Dikmeler Arası Boy (L) [m]</Label>
                    <Input
                      id="L"
                      type="number"
                      value={trimData.L || ''}
                      onChange={(e) => setTrimData({...trimData, L: parseFloat(e.target.value)})}
                      placeholder="140"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 2: MCT - MCT = (Δ × GM_L × B²) / (12 × L) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700">⚖️ MCT Hesaplama</h3>
                <p className="text-sm text-gray-600">MCT = (Δ × GM_L × B²) / (12 × L)</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displacement">Deplasman (Δ) [ton]</Label>
                    <Input
                      id="displacement"
                      type="number"
                      value={trimData.displacement || ''}
                      onChange={(e) => setTrimData({...trimData, displacement: parseFloat(e.target.value)})}
                      placeholder="15000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="GML">GM_L [m]</Label>
                    <Input
                      id="GML"
                      type="number"
                      step="0.01"
                      value={trimData.GML || ''}
                      onChange={(e) => setTrimData({...trimData, GML: parseFloat(e.target.value)})}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="B">Genişlik (B) [m]</Label>
                    <Input
                      id="B"
                      type="number"
                      value={trimData.B || ''}
                      onChange={(e) => setTrimData({...trimData, B: parseFloat(e.target.value)})}
                      placeholder="22"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="L_MCT">Dikmeler Arası Boy (L) [m]</Label>
                    <Input
                      id="L_MCT"
                      type="number"
                      value={trimData.L || ''}
                      onChange={(e) => setTrimData({...trimData, L: parseFloat(e.target.value)})}
                      placeholder="140"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 3: Trim Değişimi - ΔT = (W × d) / MCT */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">🔄 Trim Değişimi Hesaplama</h3>
                <p className="text-sm text-gray-600">ΔT = (W × d) / MCT</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weightAdded">Ağırlık (W) [ton]</Label>
                    <Input
                      id="weightAdded"
                      type="number"
                      value={trimData.weightAdded || ''}
                      onChange={(e) => setTrimData({...trimData, weightAdded: parseFloat(e.target.value)})}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weightLCG">Mesafe (d) [m]</Label>
                    <Input
                      id="weightLCG"
                      type="number"
                      step="0.01"
                      value={trimData.weightLCG || ''}
                      onChange={(e) => setTrimData({...trimData, weightLCG: parseFloat(e.target.value)})}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="MCT">MCT [tonne.m/cm]</Label>
                    <Input
                      id="MCT"
                      type="number"
                      step="0.01"
                      value={trimData.MCT || ''}
                      onChange={(e) => setTrimData({...trimData, MCT: parseFloat(e.target.value)})}
                      placeholder="200"
                    />
                  </div>
                </div>
              </div>

              {/* Hesaplama Butonu */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={calculateBasicTrim} 
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Hesapla
                </Button>
              </div>

              {/* Sonuçlar */}
              {basicTrimResults && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">📊 Hesaplama Sonuçları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Trim Açısı (θ)</Label>
                      <div className="text-lg font-bold text-blue-600">
                        {basicTrimResults.trimAngle.toFixed(4)}°
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">MCT</Label>
                      <div className="text-lg font-bold text-green-600">
                        {basicTrimResults.mct.toFixed(2)} tonne.m/cm
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Trim Değişimi (ΔT)</Label>
                      <div className="text-lg font-bold text-purple-600">
                        {basicTrimResults.trimChange.toFixed(2)} cm
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="draft-survey" className="space-y-6">
              {/* Formül 1: Ortalama Draft - T_mean = (T_f + 4×T_m + T_a) / 6 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">📏 Ortalama Draft Hesaplama</h3>
                <p className="text-sm text-gray-600">T_mean = (T_f + 4×T_m + T_a) / 6</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="draftForward_survey">Baş Draft (T_f) [m]</Label>
                    <Input
                      id="draftForward_survey"
                      type="number"
                      step="0.01"
                      value={trimData.draftForward || ''}
                      onChange={(e) => setTrimData({...trimData, draftForward: parseFloat(e.target.value)})}
                      placeholder="7.50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="draftMidships_survey">Orta Draft (T_m) [m]</Label>
                    <Input
                      id="draftMidships_survey"
                      type="number"
                      step="0.01"
                      value={trimData.draftMidships || ''}
                      onChange={(e) => setTrimData({...trimData, draftMidships: parseFloat(e.target.value)})}
                      placeholder="7.65"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="draftAft_survey">Kıç Draft (T_a) [m]</Label>
                    <Input
                      id="draftAft_survey"
                      type="number"
                      step="0.01"
                      value={trimData.draftAft || ''}
                      onChange={(e) => setTrimData({...trimData, draftAft: parseFloat(e.target.value)})}
                      placeholder="7.80"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 2: Displacement - Δ = V × ρ_sw */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700">⚖️ Displacement Hesaplama</h3>
                <p className="text-sm text-gray-600">Δ = V × ρ_sw</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume">Su Altı Hacim (V) [m³]</Label>
                    <Input
                      id="volume"
                      type="number"
                      step="0.1"
                      value={trimData.volume || ''}
                      onChange={(e) => setTrimData({...trimData, volume: parseFloat(e.target.value)})}
                      placeholder="15000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waterDensity">Su Yoğunluğu (ρ_sw) [kg/m³]</Label>
                    <Input
                      id="waterDensity"
                      type="number"
                      step="0.1"
                      value={trimData.waterDensity || ''}
                      onChange={(e) => setTrimData({...trimData, waterDensity: parseFloat(e.target.value)})}
                      placeholder="1025"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 3: TPC - TPC = (A_wp × ρ_sw) / 100 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">📊 TPC Hesaplama</h3>
                <p className="text-sm text-gray-600">TPC = (A_wp × ρ_sw) / 100</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="waterplaneArea">Su Hattı Alanı (A_wp) [m²]</Label>
                    <Input
                      id="waterplaneArea"
                      type="number"
                      step="0.1"
                      value={trimData.waterplaneArea || ''}
                      onChange={(e) => setTrimData({...trimData, waterplaneArea: parseFloat(e.target.value)})}
                      placeholder="2500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waterDensity_tpc">Su Yoğunluğu (ρ_sw) [kg/m³]</Label>
                    <Input
                      id="waterDensity_tpc"
                      type="number"
                      step="0.1"
                      value={trimData.waterDensity || ''}
                      onChange={(e) => setTrimData({...trimData, waterDensity: parseFloat(e.target.value)})}
                      placeholder="1025"
                    />
                  </div>
                </div>
              </div>

              {/* Hesaplama Butonu */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={calculateDraftSurvey} 
                  className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Hesapla
                </Button>
              </div>

              {/* Sonuçlar */}
              {draftSurveyResults && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">📊 Draft Survey Sonuçları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ortalama Draft (T_mean)</Label>
                      <div className="text-lg font-bold text-blue-600">
                        {draftSurveyResults.meanDraft.toFixed(3)} m
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Displacement (Δ)</Label>
                      <div className="text-lg font-bold text-green-600">
                        {draftSurveyResults.displacement.toFixed(0)} ton
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">TPC</Label>
                      <div className="text-lg font-bold text-purple-600">
                        {draftSurveyResults.tpc.toFixed(2)} ton/cm
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trim-effects" className="space-y-6">
              {/* Formül 1: Trim Değişimi - ΔT = (W × d) / MCT */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">📐 Trim Değişimi Hesaplama</h3>
                <p className="text-sm text-gray-600">ΔT = (W × d) / MCT</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weightChange">Ağırlık Değişimi W [ton]</Label>
                    <Input
                      id="weightChange"
                      type="number"
                      step="0.1"
                      value={trimData.weightChange || ''}
                      onChange={(e) => setTrimData({...trimData, weightChange: parseFloat(e.target.value)})}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weightDistance">Ağırlık Mesafesi d [m]</Label>
                    <Input
                      id="weightDistance"
                      type="number"
                      step="0.1"
                      value={trimData.weightDistance || ''}
                      onChange={(e) => setTrimData({...trimData, weightDistance: parseFloat(e.target.value)})}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="MCT_trim">MCT [tonne.m/cm]</Label>
                    <Input
                      id="MCT_trim"
                      type="number"
                      step="0.01"
                      value={trimData.MCT || ''}
                      onChange={(e) => setTrimData({...trimData, MCT: parseFloat(e.target.value)})}
                      placeholder="200"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 2: Draft Farkı - ΔD = ΔT × (x/L) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700">🌊 Draft Farkı Hesaplama</h3>
                <p className="text-sm text-gray-600">ΔD = ΔT × (x/L)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trimChange">Trim Değişimi ΔT [cm]</Label>
                    <Input
                      id="trimChange"
                      type="number"
                      step="0.01"
                      value={trimData.trimChange || ''}
                      onChange={(e) => setTrimData({...trimData, trimChange: parseFloat(e.target.value)})}
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="measurementPoint">Ölçüm Noktası x [m]</Label>
                    <Input
                      id="measurementPoint"
                      type="number"
                      step="0.1"
                      value={trimData.measurementPoint || ''}
                      onChange={(e) => setTrimData({...trimData, measurementPoint: parseFloat(e.target.value)})}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="L_trim">Dikmeler Arası Boy L [m]</Label>
                    <Input
                      id="L_trim"
                      type="number"
                      value={trimData.L || ''}
                      onChange={(e) => setTrimData({...trimData, L: parseFloat(e.target.value)})}
                      placeholder="140"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 3: Yeni Draft - D_new = D_old + ΔD */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">📊 Yeni Draft Hesaplama</h3>
                <p className="text-sm text-gray-600">D_new = D_old + ΔD</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="originalDraft">Orijinal Draft D_old [m]</Label>
                    <Input
                      id="originalDraft"
                      type="number"
                      step="0.01"
                      value={trimData.originalDraft || ''}
                      onChange={(e) => setTrimData({...trimData, originalDraft: parseFloat(e.target.value)})}
                      placeholder="8.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="draftChange">Draft Değişimi ΔD [m]</Label>
                    <Input
                      id="draftChange"
                      type="number"
                      step="0.001"
                      value={trimData.draftChange || ''}
                      onChange={(e) => setTrimData({...trimData, draftChange: parseFloat(e.target.value)})}
                      placeholder="0.125"
                    />
                  </div>
                </div>
              </div>

              {/* Hesaplama Butonu */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={calculateTrimEffects} 
                  className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Hesapla
                </Button>
              </div>

              {/* Sonuçlar */}
              {trimEffectsResults && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">📊 Trim Etkileri Sonuçları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Trim Değişimi (ΔT)</Label>
                      <div className="text-lg font-bold text-blue-600">
                        {trimEffectsResults.trimChange.toFixed(2)} cm
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Draft Farkı (ΔD)</Label>
                      <div className="text-lg font-bold text-green-600">
                        {trimEffectsResults.draftDifference.toFixed(3)} m
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Yeni Draft (D_new)</Label>
                      <div className="text-lg font-bold text-purple-600">
                        {trimEffectsResults.newDraft.toFixed(3)} m
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bonjean" className="space-y-6">
              {/* Formül 1: Su Altı Hacim - V = ∫ A(x) dx */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">🌊 Su Altı Hacim Hesaplama</h3>
                <p className="text-sm text-gray-600">V = ∫ A(x) dx</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stationNumber">Station Numarası</Label>
                    <Input
                      id="stationNumber"
                      type="number"
                      min="0"
                      max="20"
                      value={trimData.stationNumber || ''}
                      onChange={(e) => setTrimData({...trimData, stationNumber: parseInt(e.target.value)})}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crossSectionalArea">Kesit Alanı A(x) [m²]</Label>
                    <Input
                      id="crossSectionalArea"
                      type="number"
                      step="0.01"
                      value={trimData.crossSectionalArea || ''}
                      onChange={(e) => setTrimData({...trimData, crossSectionalArea: parseFloat(e.target.value)})}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frameSpacing">Frame Aralığı [m]</Label>
                    <Input
                      id="frameSpacing"
                      type="number"
                      step="0.1"
                      value={trimData.frameSpacing || ''}
                      onChange={(e) => setTrimData({...trimData, frameSpacing: parseFloat(e.target.value)})}
                      placeholder="7"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 2: LCB Hesabı - LCB = ∫ x × A(x) dx / V */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700">⚖️ LCB Hesabı</h3>
                <p className="text-sm text-gray-600">LCB = ∫ x × A(x) dx / V</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stationPosition">Station Pozisyonu x [m]</Label>
                    <Input
                      id="stationPosition"
                      type="number"
                      step="0.1"
                      value={trimData.stationPosition || ''}
                      onChange={(e) => setTrimData({...trimData, stationPosition: parseFloat(e.target.value)})}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crossSectionalArea_lcb">Kesit Alanı A(x) [m²]</Label>
                    <Input
                      id="crossSectionalArea_lcb"
                      type="number"
                      step="0.01"
                      value={trimData.crossSectionalArea || ''}
                      onChange={(e) => setTrimData({...trimData, crossSectionalArea: parseFloat(e.target.value)})}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volume_lcb">Hacim V [m³]</Label>
                    <Input
                      id="volume_lcb"
                      type="number"
                      step="0.1"
                      value={trimData.volume || ''}
                      onChange={(e) => setTrimData({...trimData, volume: parseFloat(e.target.value)})}
                      placeholder="15000"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 3: Moment - M = ∫ x² × A(x) dx */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">📊 Moment Hesaplama</h3>
                <p className="text-sm text-gray-600">M = ∫ x² × A(x) dx</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stationPosition_moment">Station Pozisyonu x [m]</Label>
                    <Input
                      id="stationPosition_moment"
                      type="number"
                      step="0.1"
                      value={trimData.stationPosition || ''}
                      onChange={(e) => setTrimData({...trimData, stationPosition: parseFloat(e.target.value)})}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crossSectionalArea_moment">Kesit Alanı A(x) [m²]</Label>
                    <Input
                      id="crossSectionalArea_moment"
                      type="number"
                      step="0.01"
                      value={trimData.crossSectionalArea || ''}
                      onChange={(e) => setTrimData({...trimData, crossSectionalArea: parseFloat(e.target.value)})}
                      placeholder="150"
                    />
                  </div>
                </div>
              </div>

              {/* Hesaplama Butonu */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={calculateBonjeanCurves} 
                  className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Hesapla
                </Button>
              </div>

              {/* Sonuçlar */}
              {bonjeanResults && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">📊 Bonjean Curves Sonuçları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Su Altı Hacim (V)</Label>
                      <div className="text-lg font-bold text-blue-600">
                        {bonjeanResults.volume.toFixed(1)} m³
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">LCB</Label>
                      <div className="text-lg font-bold text-green-600">
                        {bonjeanResults.lcb.toFixed(2)} m
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Moment (M)</Label>
                      <div className="text-lg font-bold text-purple-600">
                        {bonjeanResults.moment.toFixed(1)} m³
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sounding" className="space-y-6">
              {/* Formül 1: Su Altı Hacim - V = A × h */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">🌊 Su Altı Hacim Hesaplama</h3>
                <p className="text-sm text-gray-600">V = A × h</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tankArea">Tank Alanı A [m²]</Label>
                    <Input
                      id="tankArea"
                      type="number"
                      step="0.01"
                      value={trimData.tankArea || ''}
                      onChange={(e) => setTrimData({...trimData, tankArea: parseFloat(e.target.value)})}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liquidHeight">Sıvı Yüksekliği h [m]</Label>
                    <Input
                      id="liquidHeight"
                      type="number"
                      step="0.01"
                      value={trimData.liquidHeight || ''}
                      onChange={(e) => setTrimData({...trimData, liquidHeight: parseFloat(e.target.value)})}
                      placeholder="2.5"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 2: Ağırlık - W = V × ρ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700">⚖️ Ağırlık Hesaplama</h3>
                <p className="text-sm text-gray-600">W = V × ρ</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume_weight">Hacim V [m³]</Label>
                    <Input
                      id="volume_weight"
                      type="number"
                      step="0.1"
                      value={trimData.volume || ''}
                      onChange={(e) => setTrimData({...trimData, volume: parseFloat(e.target.value)})}
                      placeholder="125"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liquidDensity">Sıvı Yoğunluğu ρ [kg/m³]</Label>
                    <Input
                      id="liquidDensity"
                      type="number"
                      step="0.1"
                      value={trimData.liquidDensity || ''}
                      onChange={(e) => setTrimData({...trimData, liquidDensity: parseFloat(e.target.value)})}
                      placeholder="1025"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tankType">Tank Tipi</Label>
                    <Select
                      value={trimData.tankType || ''}
                      onValueChange={(value) => setTrimData({...trimData, tankType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tank tipi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fuel">Yakıt Tankı</SelectItem>
                        <SelectItem value="ballast">Balast Tankı</SelectItem>
                        <SelectItem value="freshwater">Tatlı Su Tankı</SelectItem>
                        <SelectItem value="cargo">Kargo Tankı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 3: Moment - M = V × h/2 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">📊 Moment Hesaplama</h3>
                <p className="text-sm text-gray-600">M = V × h/2</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume_moment">Hacim V [m³]</Label>
                    <Input
                      id="volume_moment"
                      type="number"
                      step="0.1"
                      value={trimData.volume || ''}
                      onChange={(e) => setTrimData({...trimData, volume: parseFloat(e.target.value)})}
                      placeholder="125"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liquidHeight_moment">Sıvı Yüksekliği h [m]</Label>
                    <Input
                      id="liquidHeight_moment"
                      type="number"
                      step="0.01"
                      value={trimData.liquidHeight || ''}
                      onChange={(e) => setTrimData({...trimData, liquidHeight: parseFloat(e.target.value)})}
                      placeholder="2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Hesaplama Butonu */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={calculateSoundingTable} 
                  className="px-8 py-2 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Hesapla
                </Button>
              </div>

              {/* Sonuçlar */}
              {soundingResults && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">📊 Sounding Table Sonuçları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Su Altı Hacim (V)</Label>
                      <div className="text-lg font-bold text-blue-600">
                        {soundingResults.volume.toFixed(1)} m³
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ağırlık (W)</Label>
                      <div className="text-lg font-bold text-green-600">
                        {soundingResults.weight.toFixed(1)} ton
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Moment (M)</Label>
                      <div className="text-lg font-bold text-purple-600">
                        {soundingResults.moment.toFixed(1)} ton.m
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weightAdded">Eklenen/Çıkarılan Ağırlık [ton]</Label>
                  <Input
                    id="weightAdded"
                    type="number"
                    value={trimData.weightAdded || ''}
                    onChange={(e) => setTrimData({...trimData, weightAdded: parseFloat(e.target.value)})}
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightLCG">Ağırlık Pozisyonu (Kıçtan) [m]</Label>
                  <Input
                    id="weightLCG"
                    type="number"
                    value={trimData.weightLCG || ''}
                    onChange={(e) => setTrimData({...trimData, weightLCG: parseFloat(e.target.value)})}
                    placeholder="45"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trimMomentArm">Trim Moment Kolu [m]</Label>
                  <Input
                    id="trimMomentArm"
                    type="number"
                    value={trimData.trimMomentArm || ''}
                    onChange={(e) => setTrimData({...trimData, trimMomentArm: parseFloat(e.target.value)})}
                    placeholder="70"
                  />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Gelişmiş Yük İşlemi Örnekleri</CardTitle>
                  <CardDescription>Farklı yük işlemi senaryoları ve etkileri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2">Ballast İşlemleri:</h5>
                      <ul className="space-y-1">
                        <li><strong>Baş Ballast Alma:</strong> Pozitif ağırlık, baş tank pozisyonu</li>
                        <li><strong>Kıç Ballast Alma:</strong> Pozitif ağırlık, kıç tank pozisyonu</li>
                        <li><strong>Ballast Verme:</strong> Negatif ağırlık, ilgili tank pozisyonu</li>
                        <li><strong>Ballast Transferi:</strong> Eş zamanlı alma/verme</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Kargo İşlemleri:</h5>
                      <ul className="space-y-1">
                        <li><strong>Hold Yükleme:</strong> Pozitif ağırlık, hold pozisyonu</li>
                        <li><strong>Deck Kargo:</strong> Yüksek ağırlık merkezi</li>
                        <li><strong>Konteyner Yükleme:</strong> Aşamalı yükleme</li>
                        <li><strong>Yakıt/Su Tüketimi:</strong> Negatif ağırlık, sürekli</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              {trimResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Performans Etkileri
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(trimResult.speedLoss, 'percentage')}`}>
                            {trimResult.speedLoss.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Hız Kaybı</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(trimResult.fuelConsumptionIncrease, 'percentage')}`}>
                            {trimResult.fuelConsumptionIncrease.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Yakıt Artışı</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(trimResult.maneuverabilityIndex, 'index')}`}>
                            {trimResult.maneuverabilityIndex.toFixed(1)}/10
                          </div>
                          <div className="text-sm text-muted-foreground">Manevra İndeksi</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(trimResult.seakeepingIndex, 'index')}`}>
                            {trimResult.seakeepingIndex.toFixed(1)}/10
                          </div>
                          <div className="text-sm text-muted-foreground">Denizcilik İndeksi</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Çevresel Faktörler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="waveHeight">Dalga Yüksekliği [m]</Label>
                          <Input
                            id="waveHeight"
                            type="number"
                            step="0.5"
                            value={trimData.waveHeight || ''}
                            onChange={(e) => setTrimData({...trimData, waveHeight: parseFloat(e.target.value)})}
                            placeholder="2.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="windSpeed">Rüzgar Hızı [knot]</Label>
                          <Input
                            id="windSpeed"
                            type="number"
                            value={trimData.windSpeed || ''}
                            onChange={(e) => setTrimData({...trimData, windSpeed: parseFloat(e.target.value)})}
                            placeholder="25"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentSpeed">Akıntı Hızı [knot]</Label>
                          <Input
                            id="currentSpeed"
                            type="number"
                            value={trimData.currentSpeed || ''}
                            onChange={(e) => setTrimData({...trimData, currentSpeed: parseFloat(e.target.value)})}
                            placeholder="2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              {trimResult && (
                <div className="space-y-6">
                  {/* Primary Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Kapsamlı Analiz Sonuçları
                        <Badge className={getStatusColor(trimResult.status)}>
                          {trimResult.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription>Detaylı trim, draft survey ve tank analizi</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Primary Results */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">
                            {trimResult.currentTrim > 0 ? '+' : ''}{trimResult.currentTrim.toFixed(3)}m
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Mevcut Trim {trimResult.currentTrim > 0 ? '(Stern)' : '(Head)'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">
                            {trimResult.newTrimBy > 0 ? '+' : ''}{trimResult.newTrimBy.toFixed(3)}m
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Yeni Trim {trimResult.newTrimBy > 0 ? '(Stern)' : '(Head)'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{trimResult.trimChange.toFixed(1)}cm</div>
                          <div className="text-sm text-muted-foreground">Trim Değişimi</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{trimResult.bodilyChange.toFixed(1)}cm</div>
                          <div className="text-sm text-muted-foreground">Batma/Çıkma</div>
                        </div>
                      </div>

                      <Separator />

                      {/* Draft Information */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{trimResult.newDraftForward.toFixed(3)}m</div>
                          <div className="text-sm text-muted-foreground">Yeni Baş Draft</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{trimResult.newDraftMidships.toFixed(3)}m</div>
                          <div className="text-sm text-muted-foreground">Yeni Orta Draft</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{trimResult.newDraftAft.toFixed(3)}m</div>
                          <div className="text-sm text-muted-foreground">Yeni Kıç Draft</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{trimResult.newMeanDraft.toFixed(3)}m</div>
                          <div className="text-sm text-muted-foreground">Yeni Ortalama Draft</div>
                        </div>
                      </div>

                      {/* IMO Compliance */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          IMO/SOLAS Uygunluk Analizi
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(trimResult.imoCompliance).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              {value ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">
                                {key === 'loadLineConvention' && 'IMO Load Line Convention'}
                                {key === 'solasStability' && 'SOLAS Stabilite Kriterleri'}
                                {key === 'trimLimitation' && 'Trim Limitasyon Kriteri'}
                                {key === 'strengthStandard' && 'Gemi Dayanım Standartları'}
                                {key === 'operationalGuidance' && 'Operasyonel Kılavuz Uyumu'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations and Warnings */}
                      {(trimResult.recommendations.length > 0 || trimResult.warnings.length > 0) && (
                        <div className="space-y-4">
                          {trimResult.recommendations.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 text-info">Öneriler</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {trimResult.recommendations.map((rec, index) => (
                                  <li key={index} className="text-sm">{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {trimResult.warnings.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 text-red-600">Uyarılar</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {trimResult.warnings.map((warning, index) => (
                                  <li key={index} className="text-sm text-red-600">{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};