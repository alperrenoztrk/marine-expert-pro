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
      CWP: number; // Waterplane coefficient at station
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
  const [trimData, setTrimData] = useState<Partial<TrimData>>({
    CB: 0.75,
    waterplaneCoeff: 0.85,
    waveHeight: 2.0,
    windSpeed: 25,
    currentSpeed: 2,
    maxAllowableTrim: 1.5,
    surveyType: 'initial',
    waterDensity: 1025,
    airTemperature: 15,
    waterTemperature: 12,
    tankType: 'cargo',
    frameSpacing: 0.6,
    trimCorrection: true,
    heelCorrection: false,
  });
  const [result, setResult] = useState<TrimResult | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Calculate current trim
  const calculateCurrentTrim = (draftAft: number, draftForward: number): number => {
    return draftAft - draftForward; // Positive = trim by stern
  };

  // Calculate mean draft
  const calculateMeanDraft = (draftForward: number, draftAft: number): number => {
    return (draftForward + draftAft) / 2;
  };

  // Calculate Draft Survey
  const calculateDraftSurvey = (data: TrimData) => {
    const meanDraft = calculateMeanDraft(data.draftForward, data.draftAft);
    const currentTrim = calculateCurrentTrim(data.draftAft, data.draftForward);
    
    // Displacement from hydrostatic tables (simplified calculation)
    const grossDisplacement = data.displacement || (data.L * data.B * meanDraft * data.CB * (data.waterDensity / 1000));
    
    // Density correction
    const standardDensity = 1025;
    const densityCorrection = grossDisplacement * ((data.waterDensity - standardDensity) / standardDensity);
    
    // Trim correction for displacement
    const trimCorrectionFactor = Math.abs(currentTrim) * 0.02; // 2% per meter trim
    const trimCorrection = grossDisplacement * trimCorrectionFactor;
    
    // Net displacement
    const netDisplacement = grossDisplacement + densityCorrection;
    
    // Calculate cargo weight
    const ballastWeight = data.ballastWeight || 0;
    const fuelWeight = data.fuelWeight || 0;
    const freshWaterWeight = data.freshWaterWeight || 0;
    const lightWeight = grossDisplacement * 0.15; // Assume 15% light weight
    
    const cargoWeight = netDisplacement - lightWeight - ballastWeight - fuelWeight - freshWaterWeight;
    
    // Draft accuracy assessment
    const draftAccuracy = Math.max(
      Math.abs(data.draftForward - data.draftMidships) * 100,
      Math.abs(data.draftAft - data.draftMidships) * 100
    );
    
    // Survey reliability
    let surveyReliability: 'excellent' | 'good' | 'fair' | 'poor';
    if (draftAccuracy <= 2) surveyReliability = 'excellent';
    else if (draftAccuracy <= 5) surveyReliability = 'good';
    else if (draftAccuracy <= 10) surveyReliability = 'fair';
    else surveyReliability = 'poor';
    
    // Deadweight utilization
    const assumedDeadweight = grossDisplacement * 0.85; // Assume 85% DWT ratio
    const deadweightUtilization = (cargoWeight + ballastWeight + fuelWeight + freshWaterWeight) / assumedDeadweight * 100;
    
    return {
      grossDisplacement,
      netDisplacement,
      cargoWeight,
      densityCorrection,
      trimCorrection,
      draftAccuracy,
      surveyReliability,
      deadweightUtilization
    };
  };

  // Calculate Trim Effects on Draft Differences
  const calculateTrimEffects = (data: TrimData, currentTrim: number) => {
    const L = data.L;
    const LCF = data.LCF;
    
    // Forward lever arm from LCF
    const forwardLever = L - LCF;
    // Aft lever arm from LCF
    const aftLever = LCF;
    // Midships lever arm from LCF
    const midshipsLever = Math.abs(L/2 - LCF);
    
    // Draft changes due to trim (in cm)
    const forwardDraftChange = -(currentTrim * forwardLever / L) * 100;
    const aftDraftChange = (currentTrim * aftLever / L) * 100;
    const midshipsDraftChange = (currentTrim * midshipsLever / L) * 100 * (L/2 > LCF ? -1 : 1);
    
    // Maximum draft difference
    const maximumDraftDifference = Math.abs(currentTrim * 100);
    
    // Distribution factor
    const distributionFactor = L / (2 * Math.max(forwardLever, aftLever));
    
    // New hydrostatic properties (simplified)
    const LCF_new = LCF + (currentTrim * 0.01); // Small adjustment
    const MCT_new = data.MCT * (1 + Math.abs(currentTrim) * 0.001);
    const TPC_new = data.TPC * (1 + Math.abs(currentTrim) * 0.0005);
    
    return {
      forwardDraftChange,
      aftDraftChange,
      midshipsDraftChange,
      maximumDraftDifference,
      distributionFactor,
      hydrostatic: {
        LCF_new,
        MCT_new,
        TPC_new
      }
    };
  };

  // Calculate Bonjean Curves
  const calculateBonjeanCurves = (data: TrimData) => {
    const stationPosition = (data.stationNumber / 20) * data.L; // Station position from AP
    const waterlineHeight = data.waterlineHeight;
    
    // Simplified Bonjean curve calculation (normally from ship's curves)
    // Cross-sectional area at station
    const maxBeam = data.B;
    const stationBeam = maxBeam * Math.sin((data.stationNumber / 20) * Math.PI); // Simplified ship form
    const area = stationBeam * waterlineHeight * 0.85; // With shape coefficient
    
    // First moment of area
    const centroid = waterlineHeight / 2; // Simplified centroid
    const firstMoment = area * centroid;
    
    // Volume contribution (per frame spacing)
    const frameSpacing = data.frameSpacing;
    const volume = area * frameSpacing;
    
    // Displacement contribution
    const displacement = volume * (data.waterDensity / 1000);
    
    // LCB contribution
    const LCB_station = stationPosition;
    
    // Coefficients at station
    const CP = area / (maxBeam * waterlineHeight); // Prismatic coefficient contribution
    const CM = stationBeam / maxBeam; // Midship coefficient at station
    const CWP = stationBeam / maxBeam; // Waterplane coefficient
    
    return {
      area,
      firstMoment,
      centroid,
      volume,
      displacement,
      LCB_station,
      coefficients: {
        CP,
        CM,
        CWP
      }
    };
  };

  // Calculate Sounding Table Volume
  const calculateSoundingTable = (data: TrimData) => {
    const soundingDepth = data.soundingDepth / 100; // Convert cm to m
    const tankLength = data.tankLength;
    const tankWidth = data.tankWidth;
    const tankHeight = data.tankHeight;
    
    // Basic tank volume calculation
    let tankVolume = tankLength * tankWidth * soundingDepth;
    
    // Apply corrections
    let correctedVolume = tankVolume;
    
    // Trim correction
    let trimCorrection = 1.0;
    if (data.trimCorrection && result) {
      const trimAngle = Math.atan(result.currentTrim / data.L);
      trimCorrection = 1 + (Math.sin(trimAngle) * 0.1); // Simplified correction
      correctedVolume *= trimCorrection;
    }
    
    // Heel correction
    let heelCorrection = 1.0;
    if (data.heelCorrection && result) {
      const heelAngle = result.listAngle * Math.PI / 180;
      heelCorrection = 1 + (Math.sin(heelAngle) * 0.05); // Simplified correction
      correctedVolume *= heelCorrection;
    }
    
    // Density correction for liquid weight
    let liquidDensity = 1000; // Default water density
    switch (data.tankType) {
      case 'fuel':
        liquidDensity = 850; // Typical fuel density
        break;
      case 'ballast':
        liquidDensity = data.waterDensity;
        break;
      case 'freshwater':
        liquidDensity = 1000;
        break;
      case 'cargo':
        liquidDensity = 1500; // Typical cargo density
        break;
    }
    
    const liquidWeight = correctedVolume * (liquidDensity / 1000); // Convert to tonnes
    
    // Free volume
    const totalTankVolume = tankLength * tankWidth * tankHeight;
    const freeVolume = totalTankVolume - correctedVolume;
    
    // Fill percentage
    const fillPercentage = (correctedVolume / totalTankVolume) * 100;
    
    // Centers of gravity
    const vcg = soundingDepth / 2; // Vertical CG of liquid
    const lcg = tankLength / 2; // Longitudinal CG (simplified)
    const tcg = tankWidth / 2; // Transverse CG (simplified)
    
    // Temperature correction (for fuel/cargo)
    let temperatureCorrection = 1.0;
    if (data.tankType === 'fuel' || data.tankType === 'cargo') {
      const refTemp = 15; // Reference temperature
      const tempDiff = data.waterTemperature - refTemp;
      temperatureCorrection = 1 + (tempDiff * 0.0007); // Typical expansion coefficient
    }
    
    const densityCorrection = liquidDensity / 1000;
    
    return {
      tankVolume,
      liquidWeight,
      freeVolume,
      fillPercentage,
      correctedVolume,
      vcg,
      lcg,
      tcg,
      corrections: {
        trimCorrection,
        heelCorrection,
        densityCorrection,
        temperatureCorrection
      }
    };
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
    const bonjeanCurves = calculateBonjeanCurves(data);
    
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
    
    setResult(result);
    
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="displacement">Deplasman [ton]</Label>
                  <Input
                    id="displacement"
                    type="number"
                    value={trimData.displacement || ''}
                    onChange={(e) => setTrimData({...trimData, displacement: parseFloat(e.target.value)})}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="LCF">LCF (Kıçtan) [m]</Label>
                  <Input
                    id="LCF"
                    type="number"
                    value={trimData.LCF || ''}
                    onChange={(e) => setTrimData({...trimData, LCF: parseFloat(e.target.value)})}
                    placeholder="68"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="LCB">LCB (Kıçtan) [m]</Label>
                  <Input
                    id="LCB"
                    type="number"
                    value={trimData.LCB || ''}
                    onChange={(e) => setTrimData({...trimData, LCB: parseFloat(e.target.value)})}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="CB">Blok Katsayısı (CB)</Label>
                  <Input
                    id="CB"
                    type="number"
                    step="0.01"
                    value={trimData.CB || ''}
                    onChange={(e) => setTrimData({...trimData, CB: parseFloat(e.target.value)})}
                    placeholder="0.75"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="draftForward">Baş Draft [m]</Label>
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
                  <Label htmlFor="draftMidships">Orta Draft [m]</Label>
                  <Input
                    id="draftMidships"
                    type="number"
                    step="0.01"
                    value={trimData.draftMidships || ''}
                    onChange={(e) => setTrimData({...trimData, draftMidships: parseFloat(e.target.value)})}
                    placeholder="7.65"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="draftAft">Kıç Draft [m]</Label>
                  <Input
                    id="draftAft"
                    type="number"
                    step="0.01"
                    value={trimData.draftAft || ''}
                    onChange={(e) => setTrimData({...trimData, draftAft: parseFloat(e.target.value)})}
                    placeholder="7.80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="TPC">TPC [ton/cm]</Label>
                  <Input
                    id="TPC"
                    type="number"
                    step="0.1"
                    value={trimData.TPC || ''}
                    onChange={(e) => setTrimData({...trimData, TPC: parseFloat(e.target.value)})}
                    placeholder="25.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="MCT">MCT [ton.m/cm]</Label>
                  <Input
                    id="MCT"
                    type="number"
                    value={trimData.MCT || ''}
                    onChange={(e) => setTrimData({...trimData, MCT: parseFloat(e.target.value)})}
                    placeholder="180"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAllowableTrim">Max İzin Verilen Trim [m]</Label>
                  <Input
                    id="maxAllowableTrim"
                    type="number"
                    step="0.1"
                    value={trimData.maxAllowableTrim || ''}
                    onChange={(e) => setTrimData({...trimData, maxAllowableTrim: parseFloat(e.target.value)})}
                    placeholder="1.5"
                  />
                </div>
              </div>

              <Button onClick={calculateTrim} className="flex items-center gap-2 w-full">
                <Calculator className="h-4 w-4" />
                Kapsamlı Trim ve Draft Analizi Yap
              </Button>
            </TabsContent>

            <TabsContent value="draft-survey" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Draft Survey Hesaplamaları
                  </CardTitle>
                  <CardDescription>
                    IMO Code of Practice for Draft Survey standartlarına uygun hesaplamalar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="surveyType">Survey Tipi</Label>
                      <Select 
                        value={trimData.surveyType} 
                        onValueChange={(value: 'initial' | 'final' | 'bunker') => setTrimData({...trimData, surveyType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Survey tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="initial">İlk Survey</SelectItem>
                          <SelectItem value="final">Son Survey</SelectItem>
                          <SelectItem value="bunker">Bunker Survey</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="waterDensity">Su Yoğunluğu [kg/m³]</Label>
                      <Input
                        id="waterDensity"
                        type="number"
                        value={trimData.waterDensity || ''}
                        onChange={(e) => setTrimData({...trimData, waterDensity: parseFloat(e.target.value)})}
                        placeholder="1025"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="freeboardForward">Baş Freeboard [m]</Label>
                      <Input
                        id="freeboardForward"
                        type="number"
                        step="0.01"
                        value={trimData.freeboardForward || ''}
                        onChange={(e) => setTrimData({...trimData, freeboardForward: parseFloat(e.target.value)})}
                        placeholder="3.50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="freeboardMidships">Orta Freeboard [m]</Label>
                      <Input
                        id="freeboardMidships"
                        type="number"
                        step="0.01"
                        value={trimData.freeboardMidships || ''}
                        onChange={(e) => setTrimData({...trimData, freeboardMidships: parseFloat(e.target.value)})}
                        placeholder="3.35"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="freeboardAft">Kıç Freeboard [m]</Label>
                      <Input
                        id="freeboardAft"
                        type="number"
                        step="0.01"
                        value={trimData.freeboardAft || ''}
                        onChange={(e) => setTrimData({...trimData, freeboardAft: parseFloat(e.target.value)})}
                        placeholder="3.20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ballastWeight">Ballast Ağırlığı [ton]</Label>
                      <Input
                        id="ballastWeight"
                        type="number"
                        value={trimData.ballastWeight || ''}
                        onChange={(e) => setTrimData({...trimData, ballastWeight: parseFloat(e.target.value)})}
                        placeholder="2500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelWeight">Yakıt Ağırlığı [ton]</Label>
                      <Input
                        id="fuelWeight"
                        type="number"
                        value={trimData.fuelWeight || ''}
                        onChange={(e) => setTrimData({...trimData, fuelWeight: parseFloat(e.target.value)})}
                        placeholder="800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="freshWaterWeight">Tatlı Su Ağırlığı [ton]</Label>
                      <Input
                        id="freshWaterWeight"
                        type="number"
                        value={trimData.freshWaterWeight || ''}
                        onChange={(e) => setTrimData({...trimData, freshWaterWeight: parseFloat(e.target.value)})}
                        placeholder="200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="airTemperature">Hava Sıcaklığı [°C]</Label>
                      <Input
                        id="airTemperature"
                        type="number"
                        value={trimData.airTemperature || ''}
                        onChange={(e) => setTrimData({...trimData, airTemperature: parseFloat(e.target.value)})}
                        placeholder="15"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle>Draft Survey Sonuçları</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold">{result.draftSurvey.grossDisplacement.toFixed(0)} ton</div>
                        <div className="text-sm text-muted-foreground">Brüt Deplasman</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold">{result.draftSurvey.netDisplacement.toFixed(0)} ton</div>
                        <div className="text-sm text-muted-foreground">Net Deplasman</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold">{result.draftSurvey.cargoWeight.toFixed(0)} ton</div>
                        <div className="text-sm text-muted-foreground">Kargo Ağırlığı</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold">{result.draftSurvey.deadweightUtilization.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">DWT Kullanımı</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">{result.draftSurvey.draftAccuracy.toFixed(1)} cm</div>
                        <div className="text-sm text-muted-foreground">Draft Hassasiyeti</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">
                          <Badge variant={result.draftSurvey.surveyReliability === 'excellent' ? 'default' : 
                                         result.draftSurvey.surveyReliability === 'good' ? 'secondary' : 'destructive'}>
                            {result.draftSurvey.surveyReliability.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Survey Güvenilirliği</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="trim-effects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trim Etkisiyle Draft Farkları
                  </CardTitle>
                  <CardDescription>
                    Trim değişiminin farklı noktalardaki draft değerlerine etkisi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.trimEffects.forwardDraftChange.toFixed(1)} cm</div>
                          <div className="text-sm text-muted-foreground">Baş Draft Değişimi</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.trimEffects.midshipsDraftChange.toFixed(1)} cm</div>
                          <div className="text-sm text-muted-foreground">Orta Draft Değişimi</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.trimEffects.aftDraftChange.toFixed(1)} cm</div>
                          <div className="text-sm text-muted-foreground">Kıç Draft Değişimi</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.trimEffects.maximumDraftDifference.toFixed(1)} cm</div>
                          <div className="text-sm text-muted-foreground">Maksimum Draft Farkı</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.trimEffects.distributionFactor.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Dağılım Faktörü</div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-3">Yeni Hidrostatik Özellikler</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">{result.trimEffects.hydrostatic.LCF_new.toFixed(2)} m</div>
                            <div className="text-sm text-muted-foreground">Yeni LCF</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">{result.trimEffects.hydrostatic.MCT_new.toFixed(1)} ton.m/cm</div>
                            <div className="text-sm text-muted-foreground">Yeni MCT</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">{result.trimEffects.hydrostatic.TPC_new.toFixed(1)} ton/cm</div>
                            <div className="text-sm text-muted-foreground">Yeni TPC</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bonjean" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Bonjean Curves Kullanımı
                  </CardTitle>
                  <CardDescription>
                    Gemi kesit özelliklerinin hesaplanması ve hidrostatik analiz
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stationNumber">İstasyon Numarası (0-20)</Label>
                      <Input
                        id="stationNumber"
                        type="number"
                        min="0"
                        max="20"
                        value={trimData.stationNumber || ''}
                        onChange={(e) => setTrimData({...trimData, stationNumber: parseFloat(e.target.value)})}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="waterlineHeight">Su Çizgisi Yüksekliği [m]</Label>
                      <Input
                        id="waterlineHeight"
                        type="number"
                        step="0.1"
                        value={trimData.waterlineHeight || ''}
                        onChange={(e) => setTrimData({...trimData, waterlineHeight: parseFloat(e.target.value)})}
                        placeholder="8.0"
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
                        placeholder="0.6"
                      />
                    </div>
                  </div>

                  {result && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.bonjeanCurves.area.toFixed(2)} m²</div>
                          <div className="text-sm text-muted-foreground">Kesit Alanı</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.bonjeanCurves.firstMoment.toFixed(1)} m³</div>
                          <div className="text-sm text-muted-foreground">İlk Moment</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.bonjeanCurves.centroid.toFixed(2)} m</div>
                          <div className="text-sm text-muted-foreground">Ağırlık Merkezi</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.bonjeanCurves.volume.toFixed(1)} m³</div>
                          <div className="text-sm text-muted-foreground">Hacim</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{result.bonjeanCurves.coefficients.CP.toFixed(3)}</div>
                          <div className="text-sm text-muted-foreground">CP Katsayısı</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{result.bonjeanCurves.coefficients.CM.toFixed(3)}</div>
                          <div className="text-sm text-muted-foreground">CM Katsayısı</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{result.bonjeanCurves.coefficients.CWP.toFixed(3)}</div>
                          <div className="text-sm text-muted-foreground">CWP Katsayısı</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sounding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5" />
                    Sounding Tabloları ile Hacim Hesabı
                  </CardTitle>
                  <CardDescription>
                    Tank hacim hesaplamaları ve trim/heel düzeltmeleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tankType">Tank Tipi</Label>
                      <Select 
                        value={trimData.tankType} 
                        onValueChange={(value: 'cargo' | 'ballast' | 'fuel' | 'freshwater') => setTrimData({...trimData, tankType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tank tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cargo">Kargo Tankı</SelectItem>
                          <SelectItem value="ballast">Ballast Tankı</SelectItem>
                          <SelectItem value="fuel">Yakıt Tankı</SelectItem>
                          <SelectItem value="freshwater">Tatlı Su Tankı</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tankNumber">Tank Numarası</Label>
                      <Input
                        id="tankNumber"
                        type="number"
                        value={trimData.tankNumber || ''}
                        onChange={(e) => setTrimData({...trimData, tankNumber: parseFloat(e.target.value)})}
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="soundingDepth">Sounding Derinliği [cm]</Label>
                      <Input
                        id="soundingDepth"
                        type="number"
                        value={trimData.soundingDepth || ''}
                        onChange={(e) => setTrimData({...trimData, soundingDepth: parseFloat(e.target.value)})}
                        placeholder="650"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tankLength">Tank Boyu [m]</Label>
                      <Input
                        id="tankLength"
                        type="number"
                        value={trimData.tankLength || ''}
                        onChange={(e) => setTrimData({...trimData, tankLength: parseFloat(e.target.value)})}
                        placeholder="15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tankWidth">Tank Genişliği [m]</Label>
                      <Input
                        id="tankWidth"
                        type="number"
                        value={trimData.tankWidth || ''}
                        onChange={(e) => setTrimData({...trimData, tankWidth: parseFloat(e.target.value)})}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tankHeight">Tank Yüksekliği [m]</Label>
                      <Input
                        id="tankHeight"
                        type="number"
                        value={trimData.tankHeight || ''}
                        onChange={(e) => setTrimData({...trimData, tankHeight: parseFloat(e.target.value)})}
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="trimCorrection"
                        checked={trimData.trimCorrection}
                        onChange={(e) => setTrimData({...trimData, trimCorrection: e.target.checked})}
                      />
                      <Label htmlFor="trimCorrection">Trim Düzeltmesi Uygula</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="heelCorrection"
                        checked={trimData.heelCorrection}
                        onChange={(e) => setTrimData({...trimData, heelCorrection: e.target.checked})}
                      />
                      <Label htmlFor="heelCorrection">Heel Düzeltmesi Uygula</Label>
                    </div>
                  </div>

                  {result && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.soundingTable.tankVolume.toFixed(1)} m³</div>
                          <div className="text-sm text-muted-foreground">Tank Hacmi</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.soundingTable.correctedVolume.toFixed(1)} m³</div>
                          <div className="text-sm text-muted-foreground">Düzeltilmiş Hacim</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.soundingTable.liquidWeight.toFixed(0)} ton</div>
                          <div className="text-sm text-muted-foreground">Sıvı Ağırlığı</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{result.soundingTable.fillPercentage.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Doluluk Oranı</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{result.soundingTable.vcg.toFixed(2)} m</div>
                          <div className="text-sm text-muted-foreground">VCG (Dikey AG)</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{result.soundingTable.lcg.toFixed(2)} m</div>
                          <div className="text-sm text-muted-foreground">LCG (Boyuna AG)</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{result.soundingTable.tcg.toFixed(2)} m</div>
                          <div className="text-sm text-muted-foreground">TCG (Enine AG)</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Düzeltme Faktörleri</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">{result.soundingTable.corrections.trimCorrection.toFixed(3)}</div>
                            <div className="text-sm text-muted-foreground">Trim Düzeltmesi</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">{result.soundingTable.corrections.heelCorrection.toFixed(3)}</div>
                            <div className="text-sm text-muted-foreground">Heel Düzeltmesi</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">{result.soundingTable.corrections.densityCorrection.toFixed(3)}</div>
                            <div className="text-sm text-muted-foreground">Yoğunluk Düzeltmesi</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">{result.soundingTable.corrections.temperatureCorrection.toFixed(3)}</div>
                            <div className="text-sm text-muted-foreground">Sıcaklık Düzeltmesi</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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
              {result && (
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
                          <div className={`text-2xl font-bold ${getPerformanceColor(result.speedLoss, 'percentage')}`}>
                            {result.speedLoss.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Hız Kaybı</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(result.fuelConsumptionIncrease, 'percentage')}`}>
                            {result.fuelConsumptionIncrease.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Yakıt Artışı</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(result.maneuverabilityIndex, 'index')}`}>
                            {result.maneuverabilityIndex.toFixed(1)}/10
                          </div>
                          <div className="text-sm text-muted-foreground">Manevra İndeksi</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(result.seakeepingIndex, 'index')}`}>
                            {result.seakeepingIndex.toFixed(1)}/10
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
              {result && (
                <div className="space-y-6">
                  {/* Primary Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Kapsamlı Analiz Sonuçları
                        <Badge className={getStatusColor(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription>Detaylı trim, draft survey ve tank analizi</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Primary Results */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">
                            {result.currentTrim > 0 ? '+' : ''}{result.currentTrim.toFixed(3)}m
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Mevcut Trim {result.currentTrim > 0 ? '(Stern)' : '(Head)'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">
                            {result.newTrimBy > 0 ? '+' : ''}{result.newTrimBy.toFixed(3)}m
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Yeni Trim {result.newTrimBy > 0 ? '(Stern)' : '(Head)'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{result.trimChange.toFixed(1)}cm</div>
                          <div className="text-sm text-muted-foreground">Trim Değişimi</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{result.bodilyChange.toFixed(1)}cm</div>
                          <div className="text-sm text-muted-foreground">Batma/Çıkma</div>
                        </div>
                      </div>

                      <Separator />

                      {/* Draft Information */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{result.newDraftForward.toFixed(3)}m</div>
                          <div className="text-sm text-muted-foreground">Yeni Baş Draft</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{result.newDraftMidships.toFixed(3)}m</div>
                          <div className="text-sm text-muted-foreground">Yeni Orta Draft</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{result.newDraftAft.toFixed(3)}m</div>
                          <div className="text-sm text-muted-foreground">Yeni Kıç Draft</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-lg font-bold">{result.newMeanDraft.toFixed(3)}m</div>
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
                          {Object.entries(result.imoCompliance).map(([key, value]) => (
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
                      {(result.recommendations.length > 0 || result.warnings.length > 0) && (
                        <div className="space-y-4">
                          {result.recommendations.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 text-info">Öneriler</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {result.recommendations.map((rec, index) => (
                                  <li key={index} className="text-sm">{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {result.warnings.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 text-red-600">Uyarılar</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {result.warnings.map((warning, index) => (
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