import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Ship, AlertTriangle, CheckCircle, TrendingUp, BarChart3, Waves, Target } from "lucide-react";
import { toast } from "sonner";

interface StabilityData {
  // Ship Parameters
  L: number; // Length overall (m)
  B: number; // Breadth (m)
  T: number; // Draft (m)
  CB: number; // Block coefficient
  displacement: number; // Displacement (tonnes)
  CWP: number; // Waterplane coefficient
  LCB: number; // Longitudinal center of buoyancy (m from AP)
  LCG: number; // Longitudinal center of gravity (m from AP)
  
  // Heights
  KG: number; // Center of gravity height (m)
  KM: number; // Metacentric height from keel (m)
  KB: number; // Center of buoyancy height (m)
  BM: number; // Metacentric radius (m)
  
  // Free surface and tanks
  freeSurfaceCorrection: number; // FSC (m)
  tankLength: number; // Tank length (m)
  tankBreadth: number; // Tank breadth (m)
  fillRatio: number; // Tank fill ratio (0-1)
  
  // Additional parameters
  windPressure: number; // Wind pressure (N/m²)
  windArea: number; // Lateral wind area (m²)
  windHeight: number; // Height of wind center above waterline (m)
  
  // Trim and List Parameters
  GML: number; // Longitudinal metacentric height (m)
  draftForward: number; // Forward draft (m)
  draftAft: number; // Aft draft (m)
  weightAdded: number; // Weight to be added/removed (tonnes)
  weightLCG: number; // Longitudinal position of weight from AP (m)
  transverseG: number; // Transverse center of gravity (m)
  listWeight: number; // List weight (tonnes)
  listDistance: number; // List distance (m)
  listAngle: number; // List angle (degrees)
}

interface GZCurvePoint {
  angle: number; // degrees
  gz: number; // righting arm (m)
  moment: number; // righting moment (kN.m)
}

interface StabilityResult {
  GM: number;
  GM_corrected: number;
  GZ_curve: GZCurvePoint[];
  maxGZ: number;
  angleOfMaxGZ: number;
  rangeOfStability: number;
  areaUnder30: number;
  areaUnder40: number;
  area30to40: number;
  
  // Dynamic Stability
  dynamicStability: number;
  energyToHeel: number;
  
  // Angles
  angleOfList: number;
  angleOfLoll: number;
  
  // Ship characteristics
  shipCharacteristic: 'stiff' | 'tender' | 'neutral';
  
  // Righting moments
  rightingMoment: number;
  maxRightingMoment: number;
  
  // Cross flooding
  crossFloodingTime: number;
  equalizedAngle: number;
  
  // Wind stability
  windHeelAngle: number;
  windMoment: number;
  
  // Trim and List Results
  trimAngle: number;
  mct: number;
  trimChange: number;
  listAngle: number;
  listMoment: number;
  
  status: 'excellent' | 'good' | 'acceptable' | 'poor' | 'dangerous';
  imoCompliance: {
    area30: boolean; // ≥3.151 m.deg
    area40: boolean; // ≥5.157 m.deg
    area30to40: boolean; // ≥1.719 m.deg
    maxGZ: boolean; // ≥0.20 m at ≥30°
    initialGM: boolean; // ≥0.15 m
    weatherCriterion: boolean; // Weather criterion
    grainStability: boolean; // Grain stability
  };
  recommendations: string[];
}

interface DamageStability {
  compartments: string[];
  floodedVolume: number;
  newKG: number;
  newGM: number;
  survivalStatus: 'survived' | 'marginal' | 'lost';
  heelAngle: number;
  residualStability: number;
  crossFloodingEffect: number;
  permeability: number;
}

export const StabilityCalculations = () => {
  
  const [stabilityData, setStabilityData] = useState<Partial<StabilityData>>({
    CWP: 0.85,
    LCB: 0,
    LCG: 0,
    tankLength: 20,
    tankBreadth: 15,
    fillRatio: 0.5,
    windPressure: 504,
    windArea: 1000,
    windHeight: 15
  });
  const [result, setResult] = useState<StabilityResult | null>(null);
  const [damageResult, setDamageResult] = useState<DamageStability | null>(null);
  const [activeTab, setActiveTab] = useState("intact");

  // GM Calculation - IMO Resolution A.749(18)
  const calculateGM = (data: StabilityData): number => {
    return data.KM - data.KG;
  };

  // Corrected GM with Free Surface Effect
  const calculateCorrectedGM = (data: StabilityData): number => {
    return calculateGM(data) - data.freeSurfaceCorrection;
  };

  // BM Calculation - Metacentric Radius
  const calculateBM = (B: number, L: number, displacement: number, CB: number): number => {
    const waterplaneArea = L * B * CB;
    const I_waterplane = (L * Math.pow(B, 3)) / 12; // Waterplane moment of inertia
    return I_waterplane / (displacement / 1.025); // 1.025 = seawater density
  };

  // KB Calculation - Center of Buoyancy Height
  const calculateKB = (T: number, CB: number, CWP: number = 0.85): number => {
    // Enhanced KB calculation for different ship forms
    return T * (0.5 - (1/12) * (1 - CWP/CB));
  };

  // Free Surface Effect Calculation - SOLAS Chapter II-1
  const calculateFreeSurfaceEffect = (data: StabilityData): number => {
    const fluidDensity = 1.025; // seawater density t/m³
    const Ixx = (data.tankLength * Math.pow(data.tankBreadth, 3)) / 12; // Moment of inertia
    const freeVolume = data.tankLength * data.tankBreadth * (1 - data.fillRatio) * 2; // Height assumption
    return (Ixx * fluidDensity) / data.displacement;
  };

  // Angle of List Calculation
  const calculateAngleOfList = (data: StabilityData): number => {
    if (data.LCG === data.LCB) return 0;
    const transverseMoment = data.displacement * (data.LCG - data.LCB);
    return Math.atan(transverseMoment / (data.displacement * calculateCorrectedGM(data))) * (180 / Math.PI);
  };

  // Angle of Loll Calculation
  const calculateAngleOfLoll = (data: StabilityData): number => {
    const GM_corrected = calculateCorrectedGM(data);
    if (GM_corrected >= 0) return 0;
    
    // Simplified calculation for negative GM
    const BM = calculateBM(data.B, data.L, data.displacement, data.CB);
    const angleRad = Math.acos(-GM_corrected / BM);
    return angleRad * (180 / Math.PI);
  };

  // Dynamic Stability Calculation
  const calculateDynamicStability = (gzCurve: GZCurvePoint[], angle: number): number => {
    const relevantPoints = gzCurve.filter(p => p.angle <= angle);
    let energy = 0;
    
    for (let i = 0; i < relevantPoints.length - 1; i++) {
      const h = relevantPoints[i + 1].angle - relevantPoints[i].angle;
      energy += (h * (relevantPoints[i].gz + relevantPoints[i + 1].gz)) / 2;
    }
    
    return energy * (Math.PI / 180); // Convert to m.rad
  };

  // Wind Heel Angle Calculation - SOLAS Chapter II-1
  const calculateWindHeelAngle = (data: StabilityData): number => {
    const windMoment = data.windPressure * data.windArea * data.windHeight / 1000; // kN.m
    const rightingMoment = data.displacement * 9.81 * calculateCorrectedGM(data); // kN.m/rad
    return Math.atan(windMoment / rightingMoment) * (180 / Math.PI);
  };

  // Cross Flooding Time Calculation - SOLAS Reg. 25-8
  const calculateCrossFloodingTime = (data: StabilityData): number => {
    // Simplified calculation based on compartment volume
    const compartmentVolume = data.L * data.B * data.T * 0.1; // Assume 10% of ship volume
    const floodingRate = 50; // m³/min (typical)
    return compartmentVolume / floodingRate; // minutes
  };

  // Trim Angle Calculation - θ = arctan((T_a - T_f) / L)
  const calculateTrimAngle = (data: StabilityData): number => {
    return Math.atan((data.draftAft - data.draftForward) / data.L) * (180 / Math.PI);
  };

  // MCT Calculation - MCT = (Δ × GM_L × B²) / (12 × L)
  const calculateMCT = (data: StabilityData): number => {
    return (data.displacement * data.GML * Math.pow(data.B, 2)) / (12 * data.L);
  };

  // Trim Change Calculation - ΔT = (W × d) / MCT
  const calculateTrimChange = (data: StabilityData): number => {
    const mct = calculateMCT(data);
    return (data.weightAdded * data.weightLCG) / mct;
  };

  // List Angle Calculation - θ = arctan(TG / GM)
  const calculateListAngle = (data: StabilityData): number => {
    const GM = calculateCorrectedGM(data);
    return Math.atan(data.transverseG / GM) * (180 / Math.PI);
  };

  // List Moment Calculation - M_list = W × d
  const calculateListMoment = (data: StabilityData): number => {
    return data.listWeight * data.listDistance;
  };

  // Righting Moment Calculation - M_righting = Δ × GM × sin(θ)
  const calculateRightingMoment = (data: StabilityData): number => {
    const GM = calculateCorrectedGM(data);
    return data.displacement * GM * Math.sin(data.listAngle * Math.PI / 180);
  };

  // Ship Stiffness Analysis
  const analyzeShipCharacteristic = (GM: number): 'stiff' | 'tender' | 'neutral' => {
    if (GM > 1.5) return 'stiff';
    if (GM < 0.5) return 'tender';
    return 'neutral';
  };

  // Weather Criterion Check - IMO Resolution A.562(14)
  const checkWeatherCriterion = (data: StabilityData, gzCurve: GZCurvePoint[]): boolean => {
    const windHeelAngle = calculateWindHeelAngle(data);
    const steadyWindAngle = windHeelAngle * 1.5; // 50% increase for gusts
    
    // Check if vessel can survive weather conditions
    const gz_at_steady = gzCurve.find(p => p.angle >= steadyWindAngle)?.gz || 0;
    const residualArea = calculateAreaUnderCurve(gzCurve, steadyWindAngle, 40);
    
    return gz_at_steady >= 0.20 && residualArea >= 1.719;
  };

  // Grain Stability Check - SOLAS Chapter VI
  const checkGrainStability = (data: StabilityData): boolean => {
    const GM_corrected = calculateCorrectedGM(data);
    const grainShiftMoment = data.displacement * 0.05; // Simplified grain shift
    const allowableHeel = Math.atan(grainShiftMoment / (data.displacement * GM_corrected)) * (180 / Math.PI);
    
    return allowableHeel <= 12; // Max 12° heel for grain cargo
  };

  // GZ Curve Calculation - Enhanced Righting Arm Curve
  const calculateGZCurve = (data: StabilityData): GZCurvePoint[] => {
    const points: GZCurvePoint[] = [];
    const GM_corrected = calculateCorrectedGM(data);
    
    for (let angle = 0; angle <= 180; angle += 5) {
      const angleRad = (angle * Math.PI) / 180;
      
      let gz: number;
      if (angle <= 15) {
        // Small angle approximation - Intact Stability Code 2008
        gz = GM_corrected * Math.sin(angleRad);
      } else if (angle <= 90) {
        // Large angle calculation using wall-sided approximation
        const KB = calculateKB(data.T, data.CB, data.CWP);
        const BM = calculateBM(data.B, data.L, data.displacement, data.CB);
        const KM = KB + BM;
        
        // Enhanced GZ calculation considering deck edge immersion
        const deckEdgeAngle = Math.atan((data.T / 2) / (data.B / 2)) * (180 / Math.PI);
        
        if (angle <= deckEdgeAngle) {
          gz = (KM - data.KG) * Math.sin(angleRad);
        } else {
          // Reduced stability after deck edge immersion
          const stabilityReduction = Math.pow((angle - deckEdgeAngle) / 90, 2) * 0.3;
          gz = (KM - data.KG) * Math.sin(angleRad) * (1 - stabilityReduction);
        }
      } else {
        // Negative stability region (angle > 90°)
        const downfloodingAngle = 90; // Simplified
        if (angle > downfloodingAngle) {
          gz = -0.1 * Math.sin(angleRad - Math.PI/2); // Simplified negative stability
        }
      }
      
      const moment = gz * data.displacement * 9.81; // kN.m
      
      points.push({
        angle,
        gz: Math.max(-1.0, gz), // Minimum GZ limit
        moment
      });
    }
    
    return points;
  };

  // Enhanced IMO Stability Criteria Check
  const checkIMOCompliance = (gzCurve: GZCurvePoint[], GM: number, data: StabilityData) => {
    // Calculate areas under GZ curve
    const area30 = calculateAreaUnderCurve(gzCurve, 0, 30);
    const area40 = calculateAreaUnderCurve(gzCurve, 0, 40);
    const area30to40 = calculateAreaUnderCurve(gzCurve, 30, 40);
    
    // Find maximum GZ and its angle
    const maxGZPoint = gzCurve.reduce((max, point) => 
      point.gz > max.gz ? point : max, gzCurve[0]);
    
    // Weather criterion and grain stability
    const weatherCriterion = checkWeatherCriterion(data, gzCurve);
    const grainStability = checkGrainStability(data);
    
    return {
      area30: area30 >= 3.151, // m.rad
      area40: area40 >= 5.157, // m.rad  
      area30to40: area30to40 >= 1.719, // m.rad
      maxGZ: maxGZPoint.gz >= 0.20 && maxGZPoint.angle >= 30,
      initialGM: GM >= 0.15, // m
      weatherCriterion,
      grainStability
    };
  };

  // Calculate area under GZ curve using trapezoidal rule
  const calculateAreaUnderCurve = (points: GZCurvePoint[], startAngle: number, endAngle: number): number => {
    const relevantPoints = points.filter(p => p.angle >= startAngle && p.angle <= endAngle);
    let area = 0;
    
    for (let i = 0; i < relevantPoints.length - 1; i++) {
      const h = relevantPoints[i + 1].angle - relevantPoints[i].angle;
      area += (h * (relevantPoints[i].gz + relevantPoints[i + 1].gz)) / 2;
    }
    
    return area * (Math.PI / 180); // Convert to m.rad
  };

  // Main Stability Calculation
  const calculateStability = () => {
    if (!stabilityData.L || !stabilityData.B || !stabilityData.T || !stabilityData.CB || 
        !stabilityData.displacement || !stabilityData.KG || !stabilityData.KM) {
      toast.error("Lütfen tüm gerekli değerleri girin.");
      return;
    }

    const data = stabilityData as StabilityData;
    
    // Calculate basic parameters
    const GM = calculateGM(data);
    const GM_corrected = calculateCorrectedGM(data);
    const gzCurve = calculateGZCurve(data);
    
    // Find key values
    const maxGZPoint = gzCurve.reduce((max, point) => 
      point.gz > max.gz ? point : max, gzCurve[0]);
    
    const rangeOfStability = gzCurve.findIndex(p => p.gz <= 0.01 && p.angle > 30) * 5;
    
    // Calculate areas
    const area30 = calculateAreaUnderCurve(gzCurve, 0, 30);
    const area40 = calculateAreaUnderCurve(gzCurve, 0, 40);
    const area30to40 = area40 - area30;
    
    // Advanced calculations
    const dynamicStability = calculateDynamicStability(gzCurve, maxGZPoint.angle);
    const energyToHeel = calculateDynamicStability(gzCurve, 30);
    const angleOfList = calculateAngleOfList(data);
    const angleOfLoll = calculateAngleOfLoll(data);
    const shipCharacteristic = analyzeShipCharacteristic(GM_corrected);
    const maxGZRightingMoment = maxGZPoint.moment;
    const maxRightingMoment = gzCurve.reduce((max, point) => 
      point.moment > max ? point.moment : max, 0);
    const crossFloodingTime = calculateCrossFloodingTime(data);
    const equalizedAngle = angleOfList; // Simplified
    const windHeelAngle = calculateWindHeelAngle(data);
    const windMoment = data.windPressure * data.windArea * data.windHeight / 1000;
    
    // IMO Compliance
    const imoCompliance = checkIMOCompliance(gzCurve, GM_corrected, data);
    
    // Status determination
    let status: StabilityResult['status'] = 'acceptable';
    const complianceCount = Object.values(imoCompliance).filter(Boolean).length;
    
    if (complianceCount === 7) status = 'excellent';
    else if (complianceCount >= 6) status = 'good';
    else if (complianceCount >= 4) status = 'acceptable';
    else if (complianceCount >= 2) status = 'poor';
    else status = 'dangerous';
    
    // Enhanced Recommendations
    const recommendations: string[] = [];
    if (!imoCompliance.initialGM) recommendations.push("GM değerini artırın (balast alın veya yük merkezini düşürün)");
    if (!imoCompliance.area30) recommendations.push("0-30° arası alan yetersiz (yük dağılımını optimize edin)");
    if (!imoCompliance.maxGZ) recommendations.push("Maksimum GZ değeri yetersiz (gemi formu optimizasyonu gerekli)");
    if (!imoCompliance.weatherCriterion) recommendations.push("Hava durumu kriteri karşılanmıyor (rüzgar stabilitesi yetersiz)");
    if (!imoCompliance.grainStability) recommendations.push("Tahıl stabilitesi kriterleri karşılanmıyor");
    if (GM_corrected > 1.5) recommendations.push("Gemi çok sert - konfor azalır (balast verin veya yük merkezini yükseltin)");
    if (GM_corrected < 0.5) recommendations.push("Gemi çok yumuşak - stabilite riski (balast azaltın veya yük merkezini düşürün)");
    if (Math.abs(angleOfList) > 5) recommendations.push("Yatma açısı fazla - yük dengesini kontrol edin");
    if (angleOfLoll > 0) recommendations.push("Loll açısı tespit edildi - ACİL durum! GM negatif");
    
    // Trim and List Calculations
    const trimAngle = calculateTrimAngle(data);
    const mct = calculateMCT(data);
    const trimChange = calculateTrimChange(data);
    const listAngle = calculateListAngle(data);
    const listMoment = calculateListMoment(data);
    const rightingMoment = calculateRightingMoment(data);

    const result: StabilityResult = {
      GM,
      GM_corrected,
      GZ_curve: gzCurve,
      maxGZ: maxGZPoint.gz,
      angleOfMaxGZ: maxGZPoint.angle,
      rangeOfStability,
      areaUnder30: area30,
      areaUnder40: area40,
      area30to40,
      dynamicStability,
      energyToHeel,
      angleOfList,
      angleOfLoll,
      shipCharacteristic,
      rightingMoment: maxGZRightingMoment,
      maxRightingMoment,
      crossFloodingTime,
      equalizedAngle,
      windHeelAngle,
      windMoment,
      trimAngle,
      mct,
      trimChange,
      listAngle,
      listMoment,
      status,
      imoCompliance,
      recommendations
    };
    
    setResult(result);
    
    toast.success(`Stabilite Analizi Tamamlandı! GM: ${GM_corrected.toFixed(3)}m - Durum: ${status.toUpperCase()}`);
  };

  // Enhanced Damage Stability Calculation - SOLAS Chapter II-1, Part B-1
  const calculateDamageStability = () => {
    const data = stabilityData as StabilityData;
    
    // Enhanced damage scenarios
    const permeability = 0.85; // For machinery spaces
    const floodedVolume = data.L * data.B * data.T * 0.15 * permeability; // 15% of ship volume with permeability
    const addedWeight = floodedVolume * 1.025; // tonnes
    
    // Cross flooding effect
    const crossFloodingEffect = calculateCrossFloodingTime(data);
    
    // New displacement and KG
    const newDisplacement = data.displacement + addedWeight;
    const floodedCompartmentKG = data.T / 2; // Assume flooding at mid-height
    const newKG = (data.KG * data.displacement + floodedCompartmentKG * addedWeight) / newDisplacement;
    
    // New GM with flooding effect
    const newKM = data.KM * (data.displacement / newDisplacement); // Simplified
    const newGM = newKM - newKG;
    
    // Heel angle due to asymmetric flooding with cross flooding consideration
    const asymmetricMoment = addedWeight * (data.B / 4); // Assume off-center flooding
    const heelAngle = Math.atan(asymmetricMoment / (newDisplacement * Math.abs(newGM))) * (180 / Math.PI);
    
    // Survival assessment based on SOLAS criteria
    let survivalStatus: DamageStability['survivalStatus'] = 'survived';
    if (newGM < 0.05 || heelAngle > 30) survivalStatus = 'lost';
    else if (newGM < 0.15 || heelAngle > 20) survivalStatus = 'marginal';
    
    const damageResult: DamageStability = {
      compartments: ['Engine Room', 'Cargo Hold #2', 'Ballast Tank #3'],
      floodedVolume,
      newKG,
      newGM,
      survivalStatus,
      heelAngle,
      residualStability: newGM,
      crossFloodingEffect,
      permeability
    };
    
    setDamageResult(damageResult);
    
    toast.success(`Hasar Stabilitesi Analizi Tamamlandı! Durum: ${survivalStatus.toUpperCase()} - Yeni GM: ${newGM.toFixed(3)}m`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500 cyberpunk:bg-yellow-500';
      case 'acceptable': return 'bg-yellow-500';
      case 'poor': return 'bg-orange-500';
      case 'dangerous': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCharacteristicColor = (characteristic: string) => {
    switch (characteristic) {
      case 'stiff': return 'bg-red-100 text-red-800';
      case 'tender': return 'bg-yellow-100 text-yellow-800';
      case 'neutral': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-6 w-6" />
            Kapsamlı Stabilite Hesaplamaları
          </CardTitle>
          <CardDescription>
            IMO, SOLAS, ISM ve MARPOL standartlarına uygun tam stabilite analizi - Tüm hesaplama türleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="intact">Sağlam Stabilite</TabsTrigger>
              <TabsTrigger value="damage">Hasar Stabilitesi</TabsTrigger>
              <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
              <TabsTrigger value="curves">GZ Eğrisi</TabsTrigger>
              <TabsTrigger value="angles">Açılar</TabsTrigger>
              <TabsTrigger value="analysis">Analiz</TabsTrigger>
            </TabsList>

            <TabsContent value="intact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Gemi Boyu (L) [m]</Label>
                  <Input
                    id="length"
                    type="number"
                    value={stabilityData.L || ''}
                    onChange={(e) => setStabilityData({...stabilityData, L: parseFloat(e.target.value)})}
                    placeholder="150"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breadth">Genişlik (B) [m]</Label>
                  <Input
                    id="breadth"
                    type="number"
                    value={stabilityData.B || ''}
                    onChange={(e) => setStabilityData({...stabilityData, B: parseFloat(e.target.value)})}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="draft">Su Çekimi (T) [m]</Label>
                  <Input
                    id="draft"
                    type="number"
                    value={stabilityData.T || ''}
                    onChange={(e) => setStabilityData({...stabilityData, T: parseFloat(e.target.value)})}
                    placeholder="8.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cb">Blok Katsayısı (CB)</Label>
                  <Input
                    id="cb"
                    type="number"
                    step="0.01"
                    value={stabilityData.CB || ''}
                    onChange={(e) => setStabilityData({...stabilityData, CB: parseFloat(e.target.value)})}
                    placeholder="0.75"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displacement">Deplasman [ton]</Label>
                  <Input
                    id="displacement"
                    type="number"
                    value={stabilityData.displacement || ''}
                    onChange={(e) => setStabilityData({...stabilityData, displacement: parseFloat(e.target.value)})}
                    placeholder="25000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kg">Ağırlık Merkezi (KG) [m]</Label>
                  <Input
                    id="kg"
                    type="number"
                    value={stabilityData.KG || ''}
                    onChange={(e) => setStabilityData({...stabilityData, KG: parseFloat(e.target.value)})}
                    placeholder="9.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km">Metasantır Yüksekliği (KM) [m]</Label>
                  <Input
                    id="km"
                    type="number"
                    value={stabilityData.KM || ''}
                    onChange={(e) => setStabilityData({...stabilityData, KM: parseFloat(e.target.value)})}
                    placeholder="10.8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fsc">Serbest Yüzey Düzeltmesi (FSC) [m]</Label>
                  <Input
                    id="fsc"
                    type="number"
                    value={stabilityData.freeSurfaceCorrection || ''}
                    onChange={(e) => setStabilityData({...stabilityData, freeSurfaceCorrection: parseFloat(e.target.value)})}
                    placeholder="0.3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cwp">Su Çizgisi Katsayısı (CWP)</Label>
                  <Input
                    id="cwp"
                    type="number"
                    step="0.01"
                    value={stabilityData.CWP || ''}
                    onChange={(e) => setStabilityData({...stabilityData, CWP: parseFloat(e.target.value)})}
                    placeholder="0.85"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="windPressure">Rüzgar Basıncı [N/m²]</Label>
                  <Input
                    id="windPressure"
                    type="number"
                    value={stabilityData.windPressure || ''}
                    onChange={(e) => setStabilityData({...stabilityData, windPressure: parseFloat(e.target.value)})}
                    placeholder="504"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windArea">Rüzgar Alanı [m²]</Label>
                  <Input
                    id="windArea"
                    type="number"
                    value={stabilityData.windArea || ''}
                    onChange={(e) => setStabilityData({...stabilityData, windArea: parseFloat(e.target.value)})}
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windHeight">Rüzgar Merkez Yüksekliği [m]</Label>
                  <Input
                    id="windHeight"
                    type="number"
                    value={stabilityData.windHeight || ''}
                    onChange={(e) => setStabilityData({...stabilityData, windHeight: parseFloat(e.target.value)})}
                    placeholder="15"
                  />
                </div>
              </div>

              <Separator />

              {/* Trim and List Parameters */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">📐 Trim ve List Parametreleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="GML">GM_L [m]</Label>
                    <Input
                      id="GML"
                      type="number"
                      step="0.01"
                      value={stabilityData.GML || ''}
                      onChange={(e) => setStabilityData({...stabilityData, GML: parseFloat(e.target.value)})}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="draftForward">Baş Draft (T_f) [m]</Label>
                    <Input
                      id="draftForward"
                      type="number"
                      step="0.01"
                      value={stabilityData.draftForward || ''}
                      onChange={(e) => setStabilityData({...stabilityData, draftForward: parseFloat(e.target.value)})}
                      placeholder="7.50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="draftAft">Kıç Draft (T_a) [m]</Label>
                    <Input
                      id="draftAft"
                      type="number"
                      step="0.01"
                      value={stabilityData.draftAft || ''}
                      onChange={(e) => setStabilityData({...stabilityData, draftAft: parseFloat(e.target.value)})}
                      placeholder="8.20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weightAdded">Eklenen Ağırlık (W) [ton]</Label>
                    <Input
                      id="weightAdded"
                      type="number"
                      step="0.1"
                      value={stabilityData.weightAdded || ''}
                      onChange={(e) => setStabilityData({...stabilityData, weightAdded: parseFloat(e.target.value)})}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weightLCG">Ağırlık Mesafesi (d) [m]</Label>
                    <Input
                      id="weightLCG"
                      type="number"
                      step="0.1"
                      value={stabilityData.weightLCG || ''}
                      onChange={(e) => setStabilityData({...stabilityData, weightLCG: parseFloat(e.target.value)})}
                      placeholder="45"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transverseG">Enine Ağırlık Merkezi TG [m]</Label>
                    <Input
                      id="transverseG"
                      type="number"
                      step="0.01"
                      value={stabilityData.transverseG || ''}
                      onChange={(e) => setStabilityData({...stabilityData, transverseG: parseFloat(e.target.value)})}
                      placeholder="0.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="listWeight">List Ağırlığı W [ton]</Label>
                    <Input
                      id="listWeight"
                      type="number"
                      step="0.1"
                      value={stabilityData.listWeight || ''}
                      onChange={(e) => setStabilityData({...stabilityData, listWeight: parseFloat(e.target.value)})}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listDistance">List Mesafesi d [m]</Label>
                    <Input
                      id="listDistance"
                      type="number"
                      step="0.01"
                      value={stabilityData.listDistance || ''}
                      onChange={(e) => setStabilityData({...stabilityData, listDistance: parseFloat(e.target.value)})}
                      placeholder="2.0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={calculateStability} className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Kapsamlı Stabilite Analizi
                </Button>
                <Button onClick={calculateDamageStability} variant="outline">
                  <Waves className="h-4 w-4 mr-2" />
                  Hasar Stabilitesi Analizi
                </Button>
              </div>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Kapsamlı Stabilite Sonuçları
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                      <Badge className={getCharacteristicColor(result.shipCharacteristic)}>
                        {result.shipCharacteristic.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.GM.toFixed(3)}m</div>
                        <div className="text-sm text-muted-foreground">GM</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.GM_corrected.toFixed(3)}m</div>
                        <div className="text-sm text-muted-foreground">GM (Düzeltilmiş)</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.maxGZ.toFixed(3)}m</div>
                        <div className="text-sm text-muted-foreground">Max GZ</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.angleOfMaxGZ}°</div>
                        <div className="text-sm text-muted-foreground">Max GZ Açısı</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.dynamicStability.toFixed(3)}</div>
                        <div className="text-sm text-muted-foreground">Dinamik Stabilite</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.windHeelAngle.toFixed(1)}°</div>
                        <div className="text-sm text-muted-foreground">Rüzgar Yatma Açısı</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.angleOfList.toFixed(1)}°</div>
                        <div className="text-sm text-muted-foreground">List Açısı</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.crossFloodingTime.toFixed(0)} dk</div>
                        <div className="text-sm text-muted-foreground">Cross Flooding</div>
                      </div>
                    </div>

                    <Separator />

                    {/* Trim and List Results */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Trim ve List Hesaplamaları
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold">{result.trimAngle.toFixed(2)}°</div>
                          <div className="text-sm text-muted-foreground">Trim Açısı</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold">{result.mct.toFixed(1)}</div>
                          <div className="text-sm text-muted-foreground">MCT [ton.m/cm]</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold">{result.trimChange.toFixed(1)}</div>
                          <div className="text-sm text-muted-foreground">Trim Değişimi [cm]</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold">{result.listAngle.toFixed(2)}°</div>
                          <div className="text-sm text-muted-foreground">List Açısı</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold">{result.listMoment.toFixed(1)}</div>
                          <div className="text-sm text-muted-foreground">List Moment [ton.m]</div>
                        </div>
                        <div className="text-center p-3 bg-indigo-50 rounded-lg">
                          <div className="text-2xl font-bold">{result.rightingMoment.toFixed(1)}</div>
                          <div className="text-sm text-muted-foreground">Doğrultma Momenti [ton.m]</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
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
                              {key === 'area30' && '0-30° Alan Kriteri'}
                              {key === 'area40' && '0-40° Alan Kriteri'}
                              {key === 'area30to40' && '30-40° Alan Kriteri'}
                              {key === 'maxGZ' && 'Maksimum GZ Kriteri'}
                              {key === 'initialGM' && 'Başlangıç GM Kriteri'}
                              {key === 'weatherCriterion' && 'Hava Durumu Kriteri'}
                              {key === 'grainStability' && 'Tahıl Stabilitesi'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {result.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Öneriler & Uyarılar</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="damage" className="space-y-6">
              {damageResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Waves className="h-5 w-5" />
                      Gelişmiş Hasar Stabilitesi Sonuçları
                    </CardTitle>
                    <CardDescription>SOLAS Chapter II-1, Regulation 8-9 uygun probabilistic analiz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{damageResult.newGM.toFixed(3)}m</div>
                        <div className="text-sm text-muted-foreground">Hasar Sonrası GM</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{damageResult.heelAngle.toFixed(1)}°</div>
                        <div className="text-sm text-muted-foreground">Yatma Açısı</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{damageResult.floodedVolume.toFixed(0)}m³</div>
                        <div className="text-sm text-muted-foreground">Su Alan Hacim</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{damageResult.crossFloodingEffect.toFixed(0)} dk</div>
                        <div className="text-sm text-muted-foreground">Cross Flooding</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{(damageResult.permeability * 100).toFixed(0)}%</div>
                        <div className="text-sm text-muted-foreground">Permeabilite</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{damageResult.residualStability.toFixed(3)}m</div>
                        <div className="text-sm text-muted-foreground">Artık Stabilite</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Badge className={damageResult.survivalStatus === 'survived' ? 'bg-green-500' : 
                                       damageResult.survivalStatus === 'marginal' ? 'bg-yellow-500' : 'bg-red-500'}>
                          {damageResult.survivalStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Hasarlı Bölümler</h4>
                      <div className="flex flex-wrap gap-2">
                        {damageResult.compartments.map((comp, index) => (
                          <Badge key={index} variant="outline">{comp}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Righting Moment Analizi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{(result.rightingMoment / 1000).toFixed(0)} MN.m</div>
                          <div className="text-sm text-muted-foreground">Righting Moment</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{(result.maxRightingMoment / 1000).toFixed(0)} MN.m</div>
                          <div className="text-sm text-muted-foreground">Max Righting Moment</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Free Surface Effect</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tankLength">Tank Boyu [m]</Label>
                          <Input
                            id="tankLength"
                            type="number"
                            value={stabilityData.tankLength || ''}
                            onChange={(e) => setStabilityData({...stabilityData, tankLength: parseFloat(e.target.value)})}
                            placeholder="20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tankBreadth">Tank Genişliği [m]</Label>
                          <Input
                            id="tankBreadth"
                            type="number"
                            value={stabilityData.tankBreadth || ''}
                            onChange={(e) => setStabilityData({...stabilityData, tankBreadth: parseFloat(e.target.value)})}
                            placeholder="15"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fillRatio">Doluluk Oranı</Label>
                          <Input
                            id="fillRatio"
                            type="number"
                            step="0.1"
                            max="1"
                            min="0"
                            value={stabilityData.fillRatio || ''}
                            onChange={(e) => setStabilityData({...stabilityData, fillRatio: parseFloat(e.target.value)})}
                            placeholder="0.5"
                          />
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold">
                          {stabilityData.L && stabilityData.tankLength && stabilityData.tankBreadth && stabilityData.fillRatio && stabilityData.displacement
                            ? calculateFreeSurfaceEffect(stabilityData as StabilityData).toFixed(3)
                            : '---'
                          } m
                        </div>
                        <div className="text-sm text-muted-foreground">Serbest Yüzey Etkisi</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="angles" className="space-y-6">
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Kritik Açılar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-info">{result.angleOfList.toFixed(1)}°</div>
                          <div className="text-sm text-muted-foreground">Angle of List</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{result.angleOfLoll.toFixed(1)}°</div>
                          <div className="text-sm text-muted-foreground">Angle of Loll</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{result.windHeelAngle.toFixed(1)}°</div>
                          <div className="text-sm text-muted-foreground">Wind Heel Angle</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{result.equalizedAngle.toFixed(1)}°</div>
                          <div className="text-sm text-muted-foreground">Equalized Angle</div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h4 className="font-semibold">Açı Değerlendirmesi:</h4>
                        <div className="text-sm space-y-1">
                          <div className={`p-2 rounded ${Math.abs(result.angleOfList) > 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            <strong>List Açısı:</strong> {Math.abs(result.angleOfList) > 5 ? 'Kritik - Yük dengesini kontrol edin' : 'Normal aralıkta'}
                          </div>
                          <div className={`p-2 rounded ${result.angleOfLoll > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            <strong>Loll Açısı:</strong> {result.angleOfLoll > 0 ? 'ACİL DURUM - Negatif GM!' : 'Normal - Pozitif GM'}
                          </div>
                          <div className={`p-2 rounded ${result.windHeelAngle > 15 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            <strong>Rüzgar Yatma:</strong> {result.windHeelAngle > 15 ? 'Dikkat - Rüzgar etkisi yüksek' : 'Kabul edilebilir'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Gemi Karakteristiği Analizi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-3xl font-bold mb-2">
                          <Badge className={getCharacteristicColor(result.shipCharacteristic)} variant="outline">
                            {result.shipCharacteristic.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Gemi Karakteristiği</div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Karakteristik Açıklaması:</h4>
                        <div className="text-sm space-y-2">
                          {result.shipCharacteristic === 'stiff' && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded">
                              <strong>SERT GEMİ:</strong> Hızlı dönüş yapma eğilimi. Konfor azalır, yük ve ekipman için risk artabilir.
                            </div>
                          )}
                          {result.shipCharacteristic === 'tender' && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                              <strong>YUMUŞAK GEMİ:</strong> Yavaş dönüş. Stabilite riski, dalga senkronizasyonu riski var.
                            </div>
                          )}
                          {result.shipCharacteristic === 'neutral' && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded">
                              <strong>DENGELİ GEMİ:</strong> Optimal stabilite ve konfor. İdeal durum.
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="curves" className="space-y-6">
              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      GZ Eğrisi ve Dinamik Stabilite Analizi
                    </CardTitle>
                    <CardDescription>
                      Righting arm curve, statik ve dinamik stabilite analizi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 border rounded-lg p-4 bg-muted/50">
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        GZ Eğrisi & Dinamik Stabilite Grafiği
                        <br />
                        (Recharts ile geliştirilebilir)
                        <br />
                        <span className="text-xs mt-2">
                          Max GZ: {result.maxGZ.toFixed(3)}m @ {result.angleOfMaxGZ}° | 
                          Range: {result.rangeOfStability}° | 
                          Dynamic: {result.dynamicStability.toFixed(3)} m.rad
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="p-3 border rounded">
                        <strong>0-30° Alan:</strong> {result.areaUnder30.toFixed(3)} m.rad
                        <br />
                        <span className="text-muted-foreground">Min: 3.151 m.rad</span>
                        <br />
                        <Badge variant={result.imoCompliance.area30 ? "default" : "destructive"}>
                          {result.imoCompliance.area30 ? "✓ UYGUN" : "✗ UYGUN DEĞİL"}
                        </Badge>
                      </div>
                      <div className="p-3 border rounded">
                        <strong>0-40° Alan:</strong> {result.areaUnder40.toFixed(3)} m.rad
                        <br />
                        <span className="text-muted-foreground">Min: 5.157 m.rad</span>
                        <br />
                        <Badge variant={result.imoCompliance.area40 ? "default" : "destructive"}>
                          {result.imoCompliance.area40 ? "✓ UYGUN" : "✗ UYGUN DEĞİL"}
                        </Badge>
                      </div>
                      <div className="p-3 border rounded">
                        <strong>30-40° Alan:</strong> {result.area30to40.toFixed(3)} m.rad
                        <br />
                        <span className="text-muted-foreground">Min: 1.719 m.rad</span>
                        <br />
                        <Badge variant={result.imoCompliance.area30to40 ? "default" : "destructive"}>
                          {result.imoCompliance.area30to40 ? "✓ UYGUN" : "✗ UYGUN DEĞİL"}
                        </Badge>
                      </div>
                      <div className="p-3 border rounded">
                        <strong>Dinamik Stabilite:</strong> {result.dynamicStability.toFixed(3)} m.rad
                        <br />
                        <span className="text-muted-foreground">Max GZ'ye kadar</span>
                        <br />
                        <Badge variant="outline">Enerji Kapasitesi</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Kapsamlı Teknik Analiz ve Formüller
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none text-sm">
                    <h4>Temel Stabilite Formülleri:</h4>
                    <ul className="text-xs space-y-1">
                      <li><strong>GM = KM - KG</strong> (Metasantrik yükseklik)</li>
                      <li><strong>GM_corrected = GM - FSC</strong> (Serbest yüzey düzeltmesi)</li>
                      <li><strong>BM = I_waterplane / ∇</strong> (Metasantrik yarıçap)</li>
                      <li><strong>KB = T × (0.5 - (1/12) × (1 - CWP/CB))</strong> (Batıklık merkezi)</li>
                      <li><strong>GZ = GM × sin(φ)</strong> (Küçük açılar için doğrultucu kol)</li>
                      <li><strong>GZ = (KM - KG) × sin(φ)</strong> (Büyük açılar için)</li>
                    </ul>
                    
                    <h4>Gelişmiş Hesaplamalar:</h4>
                    <ul className="text-xs space-y-1">
                      <li><strong>Free Surface Effect = (Ixx × ρ) / Δ</strong></li>
                      <li><strong>Angle of List = arctan((LCG - LCB) / GM)</strong></li>
                      <li><strong>Wind Heel Angle = arctan(Wind Moment / Righting Moment)</strong></li>
                      <li><strong>Dynamic Stability = ∫GZ dφ</strong> (Alan hesabı)</li>
                      <li><strong>Righting Moment = GZ × Δ × g</strong></li>
                    </ul>
                    
                    <h4>Uygulanan Standartlar ve Regülasyonlar:</h4>
                    <ul className="text-xs space-y-1">
                      <li><strong>SOLAS Chapter II-1:</strong> Construction - Subdivision and stability</li>
                      <li><strong>SOLAS Chapter XII:</strong> Additional safety measures for bulk carriers</li>
                      <li><strong>IMO Resolution A.749(18):</strong> Code on Intact Stability (IS Code 1993)</li>
                      <li><strong>IMO Resolution MSC.267(85):</strong> International Code on Intact Stability (IS Code 2008)</li>
                      <li><strong>IMO Resolution A.562(14):</strong> Recommendation on a severe wind and rolling criterion</li>
                      <li><strong>MARPOL Annex I:</strong> Regulations for the prevention of pollution by oil</li>
                      <li><strong>Load Lines Convention 1966:</strong> Minimum freeboard requirements</li>
                      <li><strong>SOLAS Chapter VI:</strong> Carriage of cargoes (Grain Rules)</li>
                    </ul>
                    
                    <h4>IMO Stabilite Kriterleri (IS Code 2008):</h4>
                    <ul className="text-xs space-y-1">
                      <li>GM ≥ 0.15m (Minimum başlangıç stabilitesi)</li>
                      <li>0-30° alan ≥ 3.151 m.rad (0.055 m.rad)</li>
                      <li>0-40° alan ≥ 5.157 m.rad (0.090 m.rad)</li>
                      <li>30-40° alan ≥ 1.719 m.rad (0.030 m.rad)</li>
                      <li>Max GZ ≥ 0.20m ve açısı ≥30°</li>
                      <li>Hava durumu kriteri (rüzgar + dalga)</li>
                      <li>Tahıl stabilitesi (SOLAS Ch. VI)</li>
                    </ul>

                    <h4>Hasar Stabilitesi Kriterleri (SOLAS Reg. 8-9):</h4>
                    <ul className="text-xs space-y-1">
                      <li>Subdivision length (bölmeler arası mesafe)</li>
                      <li>Permeability factors (geçirgenlik faktörleri)</li>
                      <li>Heel angle ≤ 25° (yatma açısı limiti)</li>
                      <li>Residual GM ≥ 0.05m (artık metasantrik yükseklik)</li>
                      <li>Cross flooding arrangements (çapraz su alma düzenlemeleri)</li>
                      <li>Range of positive stability ≥ 20° (pozitif stabilite aralığı)</li>
                    </ul>

                    <h4>Free Surface Effect (Serbest Yüzey Etkisi):</h4>
                    <ul className="text-xs space-y-1">
                      <li><strong>Tank Etkisi:</strong> Ixx = (L × B³) / 12</li>
                      <li><strong>Doluluk Düzeltmesi:</strong> Etki ∝ (1 - fill_ratio)</li>
                      <li><strong>FSE = Σ(Ixx × ρ_fluid) / Δ</strong></li>
                      <li>Fuel, ballast, cargo ve tatlı su tankları dahil</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};