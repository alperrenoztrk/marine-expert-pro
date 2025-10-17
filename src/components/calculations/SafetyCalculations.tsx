import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Anchor, Shield, AlertTriangle, CheckCircle, LifeBuoy, Flame, Droplets, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SafetyData {
  // Ship Dimensions
  shipLength: number; // Length overall (m)
  shipBeam: number; // Beam (m)
  shipDepth: number; // Depth (m)
  displacement: number; // Displacement (tonnes)
  
  // Anchoring Data
  windSpeed: number; // Wind speed (knots)
  currentSpeed: number; // Current speed (knots)
  waterDepth: number; // Water depth (m)
  seaState: number; // Sea state (0-9)
  holdingGround: 'good' | 'fair' | 'poor'; // Holding ground quality
  anchorWeight: number; // Anchor weight (kg)
  chainDiameter: number; // Chain diameter (mm)
  
  // Mooring Data
  mooringLineCount: number; // Number of mooring lines
  mooringLineBreakingStrength: number; // Breaking strength (tonnes)
  workingLoadLimit: number; // WLL (tonnes)
  tidalRange: number; // Tidal range (m)
  
  // Fire Fighting
  firePumpCapacity: number; // Fire pump capacity (m³/h)
  firePumpPressure: number; // Fire pump pressure (bar)
  fireMainDiameter: number; // Fire main diameter (mm)
  fireHoseLength: number; // Fire hose length (m)
  fireExtinguisherCount: number; // Number of fire extinguishers
  
  // Life Saving Appliances
  lifeBoatCapacity: number; // Lifeboat capacity (persons)
  lifeBoatCount: number; // Number of lifeboats
  lifeRaftCapacity: number; // Life raft capacity (persons)
  lifeRaftCount: number; // Number of life rafts
  totalPersonsOnBoard: number; // Total POB
  
  // Freeboard
  summerDraft: number; // Summer draft (m)
  winterDraft: number; // Winter draft (m)
  tropicalDraft: number; // Tropical draft (m)
  freshWaterDraft: number; // Fresh water draft (m)
  
  // Davit & Crane Data
  davitSWL: number; // Davit Safe Working Load (tonnes)
  craneSWL: number; // Crane Safe Working Load (tonnes)
  liftingGearCertificateDate: string; // Last certificate date
  
  // Emergency Equipment
  emergencyGeneratorCapacity: number; // Emergency generator (kW)
  batteryCapacity: number; // Emergency battery (Ah)
  emergencyLightingDuration: number; // Duration (hours)
}

interface SafetyResult {
  // Anchoring Results
  recommendedChainLength: number; // Recommended chain length (m)
  minimumChainLength: number; // Minimum chain length (m)
  anchorHoldingPower: number; // Holding power (tonnes)
  windForce: number; // Wind force on ship (tonnes)
  currentForce: number; // Current force (tonnes)
  totalEnvironmentalForce: number; // Total force (tonnes)
  safetyFactor: number; // Safety factor
  anchoringStatus: 'safe' | 'marginal' | 'unsafe';
  
  // Mooring Results
  mooringLineLoad: number; // Load per line (tonnes)
  mooringLineSafety: number; // Safety factor
  mooringStatus: 'safe' | 'overloaded';
  recommendedLineCount: number; // Recommended number of lines
  
  // Fire Fighting Results
  fireWaterFlow: number; // Available water flow (L/min)
  firePumpEfficiency: number; // Pump efficiency (%)
  fireReach: number; // Fire hose reach (m)
  fireCoverage: string; // Fire coverage assessment
  fireReadiness: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Life Saving Results
  totalLifeboatCapacity: number; // Total lifeboat capacity
  totalLifeRaftCapacity: number; // Total life raft capacity
  totalLifeSavingCapacity: number; // Total LSA capacity
  lsaCompliance: boolean; // LSA compliance
  evacuationTime: number; // Estimated evacuation time (minutes)
  lsaStatus: 'compliant' | 'non_compliant';
  
  // Freeboard Results
  minimumFreeboard: number; // Minimum required freeboard (mm)
  actualFreeboard: number; // Actual freeboard (mm)
  freeboardCompliance: boolean; // Freeboard compliance
  loadLineZone: 'Summer' | 'Winter' | 'Tropical' | 'Fresh Water';
  
  // Lifting Equipment
  davitCertificateStatus: 'valid' | 'due_soon' | 'expired';
  craneCertificateStatus: 'valid' | 'due_soon' | 'expired';
  liftingEquipmentCompliance: boolean;
  
  // Emergency Power
  emergencyPowerDuration: number; // Emergency power duration (hours)
  batteryBackupTime: number; // Battery backup time (hours)
  emergencySystemStatus: 'adequate' | 'marginal' | 'inadequate';
  
  recommendations: string[];
  warnings: string[];
}

export const SafetyCalculations = () => {
  const { toast } = useToast();
  const [data, setData] = useState<SafetyData>({
    shipLength: 180, shipBeam: 30, shipDepth: 18, displacement: 25000,
    windSpeed: 25, currentSpeed: 2, waterDepth: 25, seaState: 4,
    holdingGround: 'good', anchorWeight: 7500, chainDiameter: 68,
    mooringLineCount: 6, mooringLineBreakingStrength: 85,
    workingLoadLimit: 17, tidalRange: 3.5,
    firePumpCapacity: 150, firePumpPressure: 7,
    fireMainDiameter: 150, fireHoseLength: 60,
    fireExtinguisherCount: 25,
    lifeBoatCapacity: 65, lifeBoatCount: 4,
    lifeRaftCapacity: 25, lifeRaftCount: 6,
    totalPersonsOnBoard: 24,
    summerDraft: 8.5, winterDraft: 8.2, tropicalDraft: 8.7,
    freshWaterDraft: 8.65,
    davitSWL: 2.5, craneSWL: 35,
    liftingGearCertificateDate: "2024-06-15",
    emergencyGeneratorCapacity: 350,
    batteryCapacity: 200, emergencyLightingDuration: 3
  });

  const [result, setResult] = useState<SafetyResult | null>(null);
  

  // Anchoring calculations
  const calculateAnchoring = () => {
    // --- Environmental forces (more realistic) ---
    const windSpeedMs = data.windSpeed * 0.514444; // m/s
    const currentSpeedMs = data.currentSpeed * 0.514444; // m/s

    // Aerodynamic drag: F = 0.5 * rho_air * C_D * A * V^2
    const rhoAir = 1.225; // kg/m³
    const windCd = 1.1; // broadside coefficient (approx.)
    const projectedAreaAboveWater = data.shipLength * (data.shipDepth * 0.65); // m², superstructure + hull above WL
    const windForceN = 0.5 * rhoAir * windCd * projectedAreaAboveWater * Math.pow(windSpeedMs, 2);
    const windForce = windForceN / 9810; // tonnes

    // Hydrodynamic drag: F = 0.5 * rho_water * C_D * A * V^2
    const rhoWater = 1025; // kg/m³ (seawater)
    const currentCd = 0.7; // hull drag coefficient (approx.)
    const draft = data.summerDraft; // m
    const projectedAreaUnderwater = data.shipLength * draft * 0.7; // m² (effective area)
    const currentForceN = 0.5 * rhoWater * currentCd * projectedAreaUnderwater * Math.pow(currentSpeedMs, 2);
    const currentForce = currentForceN / 9810; // tonnes

    // Wave drift amplification (approx.): up to ~27% at sea state 9
    const waveAmplification = 1 + 0.03 * Math.max(0, Math.min(9, data.seaState));
    const totalForce = (windForce + currentForce) * waveAmplification; // tonnes

    // --- Scope and chain length (industry rules of thumb) ---
    const waveHeight = Math.max(0, data.seaState) * 0.5; // m, coarse mapping
    const tideMargin = Math.max(0, data.tidalRange) * 0.5; // use half the tidal range for margin
    const effectiveDepth = Math.max(1, data.waterDepth + tideMargin + 0.5 * waveHeight); // m

    // Base scope by wind
    let baseScope: number;
    if (data.windSpeed <= 10) baseScope = 3;
    else if (data.windSpeed <= 20) baseScope = 5;
    else if (data.windSpeed <= 30) baseScope = 7;
    else baseScope = 10;

    // Adjust by sea state and holding ground
    const seaStateFactor = 1 + 0.03 * Math.max(0, Math.min(9, data.seaState));
    const groundFactor = data.holdingGround === 'good' ? 1.0 : data.holdingGround === 'fair' ? 1.10 : 1.25;
    const recommendedScope = Math.max(3, Math.min(12, baseScope * seaStateFactor * groundFactor));

    const recommendedChainLength = recommendedScope * effectiveDepth; // m
    const minimumChainLength = 3 * effectiveDepth; // m (absolute minimum ~3:1)

    // --- Holding: anchor + chain friction on seabed ---
    // Anchor holding (depends on ground). SHHP/HHP-style factors (approx.)
    const baseHoldingFactor = data.holdingGround === 'good' ? 10 : data.holdingGround === 'fair' ? 7 : 4; // per tonne of anchor
    const anchorHoldingPower = (data.anchorWeight / 1000) * baseHoldingFactor; // tonnes

    // Reduce anchor effectiveness if scope < 5 (chain lift increases shank angle)
    const scopeRatio = recommendedChainLength / effectiveDepth;
    const anchorEffectivenessFactor = Math.min(1, scopeRatio / 5);
    const anchorEffectiveHolding = anchorHoldingPower * anchorEffectivenessFactor; // tonnes

    // Chain friction capacity on seabed: F = mu * W' * L_seabed
    // Stud-link chain mass per m ≈ 0.022 * d^2 (kg/m), d in mm
    const chainMassPerMeter = 0.022 * Math.pow(data.chainDiameter, 2); // kg/m (air)
    const inWaterWeightPerMeterN = chainMassPerMeter * 9.81 * 0.86; // N/m
    const inWaterWeightPerMeterTonnes = inWaterWeightPerMeterN / 9810; // tonnes/m
    const mu = data.holdingGround === 'good' ? 0.30 : data.holdingGround === 'fair' ? 0.25 : 0.20;
    // Approximate suspended length ≈ 1.3 * depth; remainder lies on seabed
    const seabedLength = Math.max(0, recommendedChainLength - 1.3 * effectiveDepth); // m
    const chainFrictionCapacity = mu * inWaterWeightPerMeterTonnes * seabedLength; // tonnes

    const totalHoldingCapacity = anchorEffectiveHolding + chainFrictionCapacity; // tonnes
    const safetyFactor = totalHoldingCapacity / Math.max(0.001, totalForce);

    let anchoringStatus: 'safe' | 'marginal' | 'unsafe';
    if (safetyFactor >= 2.0) anchoringStatus = 'safe';
    else if (safetyFactor >= 1.5) anchoringStatus = 'marginal';
    else anchoringStatus = 'unsafe';

    return {
      windForce,
      currentForce,
      totalForce,
      anchorHoldingPower: totalHoldingCapacity, // report combined capacity (anchor + chain)
      recommendedChainLength,
      minimumChainLength,
      safetyFactor,
      anchoringStatus
    };
  };

  // Mooring calculations
  const calculateMooring = () => {
    const mooringLineLoad = data.displacement / data.mooringLineCount; // Simplified load distribution
    const mooringLineSafety = data.workingLoadLimit / mooringLineLoad;
    
    const mooringStatus: 'safe' | 'overloaded' = mooringLineSafety >= 2.0 ? 'safe' : 'overloaded';
    const recommendedLineCount = Math.ceil(data.displacement / data.workingLoadLimit);
    
    return {
      mooringLineLoad,
      mooringLineSafety,
      mooringStatus,
      recommendedLineCount
    };
  };

  // Fire fighting calculations
  const calculateFireFighting = () => {
    const fireWaterFlow = (data.firePumpCapacity * 1000) / 60; // L/min
    const firePumpEfficiency = Math.min(95, 100 - (data.firePumpPressure - 7) * 2); // Efficiency drops with higher pressure
    
    // Fire hose reach calculation
    const pressureLoss = (data.fireHoseLength / 30) * 0.5; // bar loss per 30m
    const nozzlePressure = Math.max(2, data.firePumpPressure - pressureLoss);
    const fireReach = Math.sqrt(nozzlePressure) * 8; // Approximate reach formula
    
    let fireReadiness: 'excellent' | 'good' | 'fair' | 'poor';
    if (fireWaterFlow >= 200 && data.fireExtinguisherCount >= 20) fireReadiness = 'excellent';
    else if (fireWaterFlow >= 150 && data.fireExtinguisherCount >= 15) fireReadiness = 'good';
    else if (fireWaterFlow >= 100 && data.fireExtinguisherCount >= 10) fireReadiness = 'fair';
    else fireReadiness = 'poor';
    
    const fireCoverage = fireReach >= data.shipLength ? "Complete ship coverage" : "Partial coverage - additional hoses needed";
    
    return {
      fireWaterFlow,
      firePumpEfficiency,
      fireReach,
      fireCoverage,
      fireReadiness
    };
  };

  // Life saving appliances calculations
  const calculateLSA = () => {
    const totalLifeboatCapacity = data.lifeBoatCapacity * data.lifeBoatCount;
    const totalLifeRaftCapacity = data.lifeRaftCapacity * data.lifeRaftCount;
    const totalLifeSavingCapacity = totalLifeboatCapacity + totalLifeRaftCapacity;
    
    // SOLAS requirement: 100% capacity on each side
    const requiredCapacity = data.totalPersonsOnBoard * 2;
    const lsaCompliance = totalLifeSavingCapacity >= requiredCapacity;
    
    // Evacuation time estimation (SOLAS: 30 minutes maximum)
    const evacuationTime = Math.max(15, data.totalPersonsOnBoard / 4); // 4 persons per minute average
    
    const lsaStatus: 'compliant' | 'non_compliant' = lsaCompliance && evacuationTime <= 30 ? 'compliant' : 'non_compliant';
    
    return {
      totalLifeboatCapacity,
      totalLifeRaftCapacity,
      totalLifeSavingCapacity,
      lsaCompliance,
      evacuationTime,
      lsaStatus
    };
  };

  // Freeboard calculations
  const calculateFreeboard = () => {
    // Simplified freeboard calculation (actual calculation is complex and depends on ship type)
    const baseFreeboard = data.shipLength * 0.05; // Basic freeboard in meters
    const minimumFreeboard = baseFreeboard * 1000; // Convert to mm
    
    // Actual freeboard based on current draft
    const actualFreeboard = (data.shipDepth - data.summerDraft) * 1000; // mm
    
    const freeboardCompliance = actualFreeboard >= minimumFreeboard;
    
    // Load line zone determination (simplified)
    let loadLineZone: 'Summer' | 'Winter' | 'Tropical' | 'Fresh Water';
    if (data.summerDraft === Math.min(data.summerDraft, data.winterDraft, data.tropicalDraft)) {
      loadLineZone = 'Summer';
    } else if (data.winterDraft === Math.min(data.summerDraft, data.winterDraft, data.tropicalDraft)) {
      loadLineZone = 'Winter';
    } else if (data.tropicalDraft === Math.max(data.summerDraft, data.winterDraft, data.tropicalDraft)) {
      loadLineZone = 'Tropical';
    } else {
      loadLineZone = 'Fresh Water';
    }
    
    return {
      minimumFreeboard,
      actualFreeboard,
      freeboardCompliance,
      loadLineZone
    };
  };

  // Certificate status check
  const checkCertificates = () => {
    const today = new Date();
    const certDate = new Date(data.liftingGearCertificateDate);
    const daysDiff = Math.floor((today.getTime() - certDate.getTime()) / (1000 * 3600 * 24));
    
    let davitCertificateStatus: 'valid' | 'due_soon' | 'expired';
    let craneCertificateStatus: 'valid' | 'due_soon' | 'expired';
    
    if (daysDiff > 365) {
      davitCertificateStatus = 'expired';
      craneCertificateStatus = 'expired';
    } else if (daysDiff > 330) {
      davitCertificateStatus = 'due_soon';
      craneCertificateStatus = 'due_soon';
    } else {
      davitCertificateStatus = 'valid';
      craneCertificateStatus = 'valid';
    }
    
    const liftingEquipmentCompliance = davitCertificateStatus === 'valid' && craneCertificateStatus === 'valid';
    
    return {
      davitCertificateStatus,
      craneCertificateStatus,
      liftingEquipmentCompliance
    };
  };

  // Emergency power calculations
  const calculateEmergencyPower = () => {
    // Emergency generator duration (typical fuel consumption)
    const fuelConsumptionRate = data.emergencyGeneratorCapacity * 0.25; // L/h approximate
    const fuelTankCapacity = 500; // Approximate emergency fuel tank (L)
    const emergencyPowerDuration = fuelTankCapacity / fuelConsumptionRate;
    
    // Battery backup calculation
    const totalLoad = 20; // kW typical emergency load
    const batteryBackupTime = (data.batteryCapacity * 24) / (totalLoad * 1000); // hours
    
    let emergencySystemStatus: 'adequate' | 'marginal' | 'inadequate';
    if (emergencyPowerDuration >= 36 && batteryBackupTime >= 3) {
      emergencySystemStatus = 'adequate';
    } else if (emergencyPowerDuration >= 18 && batteryBackupTime >= 1) {
      emergencySystemStatus = 'marginal';
    } else {
      emergencySystemStatus = 'inadequate';
    }
    
    return {
      emergencyPowerDuration,
      batteryBackupTime,
      emergencySystemStatus
    };
  };

  const calculate = () => {
    try {
      const anchoring = calculateAnchoring();
      const mooring = calculateMooring();
      const fireFighting = calculateFireFighting();
      const lsa = calculateLSA();
      const freeboard = calculateFreeboard();
      const certificates = checkCertificates();
      const emergencyPower = calculateEmergencyPower();
      
      const recommendations = [];
      const warnings = [];
      
      // Anchoring recommendations
      if (anchoring.anchoringStatus === 'unsafe') {
        warnings.push("Anchoring conditions unsafe - seek shelter or increase anchor scope");
      } else if (anchoring.anchoringStatus === 'marginal') {
        recommendations.push("Consider increasing anchor scope for better holding");
      }
      
      // Mooring recommendations
      if (mooring.mooringStatus === 'overloaded') {
        warnings.push("Mooring lines overloaded - add additional lines");
      }
      
      // Fire fighting recommendations
      if (fireFighting.fireReadiness === 'poor') {
        warnings.push("Fire fighting capability inadequate - check equipment");
      }
      
      // LSA warnings
      if (!lsa.lsaCompliance) {
        warnings.push("Life saving appliances not compliant with SOLAS requirements");
      }
      
      // Freeboard warnings
      if (!freeboard.freeboardCompliance) {
        warnings.push("Insufficient freeboard - vessel may be overloaded");
      }
      
      // Certificate warnings
      if (certificates.davitCertificateStatus === 'expired') {
        warnings.push("Davit certificate expired - equipment out of service");
      }
      
      if (emergencyPower.emergencySystemStatus === 'inadequate') {
        warnings.push("Emergency power system inadequate for SOLAS requirements");
      }

      const calculatedResult: SafetyResult = {
        recommendedChainLength: anchoring.recommendedChainLength,
        minimumChainLength: anchoring.minimumChainLength,
        anchorHoldingPower: anchoring.anchorHoldingPower,
        windForce: anchoring.windForce,
        currentForce: anchoring.currentForce,
        totalEnvironmentalForce: anchoring.totalForce,
        safetyFactor: anchoring.safetyFactor,
        anchoringStatus: anchoring.anchoringStatus,
        mooringLineLoad: mooring.mooringLineLoad,
        mooringLineSafety: mooring.mooringLineSafety,
        mooringStatus: mooring.mooringStatus,
        recommendedLineCount: mooring.recommendedLineCount,
        fireWaterFlow: fireFighting.fireWaterFlow,
        firePumpEfficiency: fireFighting.firePumpEfficiency,
        fireReach: fireFighting.fireReach,
        fireCoverage: fireFighting.fireCoverage,
        fireReadiness: fireFighting.fireReadiness,
        totalLifeboatCapacity: lsa.totalLifeboatCapacity,
        totalLifeRaftCapacity: lsa.totalLifeRaftCapacity,
        totalLifeSavingCapacity: lsa.totalLifeSavingCapacity,
        lsaCompliance: lsa.lsaCompliance,
        evacuationTime: lsa.evacuationTime,
        lsaStatus: lsa.lsaStatus,
        minimumFreeboard: freeboard.minimumFreeboard,
        actualFreeboard: freeboard.actualFreeboard,
        freeboardCompliance: freeboard.freeboardCompliance,
        loadLineZone: freeboard.loadLineZone,
        davitCertificateStatus: certificates.davitCertificateStatus,
        craneCertificateStatus: certificates.craneCertificateStatus,
        liftingEquipmentCompliance: certificates.liftingEquipmentCompliance,
        emergencyPowerDuration: emergencyPower.emergencyPowerDuration,
        batteryBackupTime: emergencyPower.batteryBackupTime,
        emergencySystemStatus: emergencyPower.emergencySystemStatus,
        recommendations,
        warnings
      };

      setResult(calculatedResult);
      toast({
        title: "Hesaplama Tamamlandı",
        description: "Güverte ve güvenlik hesaplamaları başarıyla tamamlandı.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hesaplama sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const updateData = (field: keyof SafetyData, value: number | string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Güverte ve Güvenlik Hesaplamaları
          </CardTitle>
          <CardDescription>
            Demir tableleri, yangın sistemi, can kurtarma araçları, freeboard ve güvenlik ekipmanları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="anchoring" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="anchoring">Demir</TabsTrigger>
              <TabsTrigger value="fire">Yangın</TabsTrigger>
              <TabsTrigger value="lifesaving">Can Kurtarma</TabsTrigger>
              <TabsTrigger value="freeboard">Freeboard</TabsTrigger>
              <TabsTrigger value="emergency">Acil Durum</TabsTrigger>
            </TabsList>

            <TabsContent value="anchoring" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="windSpeed">Rüzgar Hızı (knot)</Label>
                  <Input
                    id="windSpeed"
                    type="number"
                    value={data.windSpeed}
                    onChange={(e) => updateData('windSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentSpeed">Akıntı Hızı (knot)</Label>
                  <Input
                    id="currentSpeed"
                    type="number"
                    step="0.1"
                    value={data.currentSpeed}
                    onChange={(e) => updateData('currentSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterDepth">Su Derinliği (m)</Label>
                  <Input
                    id="waterDepth"
                    type="number"
                    value={data.waterDepth}
                    onChange={(e) => updateData('waterDepth', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seaState">Deniz Durumu (0-9)</Label>
                  <Input
                    id="seaState"
                    type="number"
                    min="0"
                    max="9"
                    value={data.seaState}
                    onChange={(e) => updateData('seaState', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anchorWeight">Demir Ağırlığı (kg)</Label>
                  <Input
                    id="anchorWeight"
                    type="number"
                    value={data.anchorWeight}
                    onChange={(e) => updateData('anchorWeight', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chainDiameter">Zincir Çapı (mm)</Label>
                  <Input
                    id="chainDiameter"
                    type="number"
                    value={data.chainDiameter}
                    onChange={(e) => updateData('chainDiameter', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fire" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firePumpCapacity">Yangın Pompası Kapasitesi (m³/h)</Label>
                  <Input
                    id="firePumpCapacity"
                    type="number"
                    value={data.firePumpCapacity}
                    onChange={(e) => updateData('firePumpCapacity', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firePumpPressure">Yangın Pompası Basıncı (bar)</Label>
                  <Input
                    id="firePumpPressure"
                    type="number"
                    step="0.1"
                    value={data.firePumpPressure}
                    onChange={(e) => updateData('firePumpPressure', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fireMainDiameter">Ana Yangın Hattı Çapı (mm)</Label>
                  <Input
                    id="fireMainDiameter"
                    type="number"
                    value={data.fireMainDiameter}
                    onChange={(e) => updateData('fireMainDiameter', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fireHoseLength">Yangın Hortumu Uzunluğu (m)</Label>
                  <Input
                    id="fireHoseLength"
                    type="number"
                    value={data.fireHoseLength}
                    onChange={(e) => updateData('fireHoseLength', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fireExtinguisherCount">Yangın Söndürücü Sayısı</Label>
                  <Input
                    id="fireExtinguisherCount"
                    type="number"
                    value={data.fireExtinguisherCount}
                    onChange={(e) => updateData('fireExtinguisherCount', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lifesaving" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lifeBoatCapacity">Can Botu Kapasitesi (kişi)</Label>
                  <Input
                    id="lifeBoatCapacity"
                    type="number"
                    value={data.lifeBoatCapacity}
                    onChange={(e) => updateData('lifeBoatCapacity', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lifeBoatCount">Can Botu Sayısı</Label>
                  <Input
                    id="lifeBoatCount"
                    type="number"
                    value={data.lifeBoatCount}
                    onChange={(e) => updateData('lifeBoatCount', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lifeRaftCapacity">Can Salı Kapasitesi (kişi)</Label>
                  <Input
                    id="lifeRaftCapacity"
                    type="number"
                    value={data.lifeRaftCapacity}
                    onChange={(e) => updateData('lifeRaftCapacity', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lifeRaftCount">Can Salı Sayısı</Label>
                  <Input
                    id="lifeRaftCount"
                    type="number"
                    value={data.lifeRaftCount}
                    onChange={(e) => updateData('lifeRaftCount', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalPersonsOnBoard">Toplam Kişi Sayısı</Label>
                  <Input
                    id="totalPersonsOnBoard"
                    type="number"
                    value={data.totalPersonsOnBoard}
                    onChange={(e) => updateData('totalPersonsOnBoard', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="freeboard" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="summerDraft">Yaz Su Çekimi (m)</Label>
                  <Input
                    id="summerDraft"
                    type="number"
                    step="0.1"
                    value={data.summerDraft}
                    onChange={(e) => updateData('summerDraft', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="winterDraft">Kış Su Çekimi (m)</Label>
                  <Input
                    id="winterDraft"
                    type="number"
                    step="0.1"
                    value={data.winterDraft}
                    onChange={(e) => updateData('winterDraft', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tropicalDraft">Tropikal Su Çekimi (m)</Label>
                  <Input
                    id="tropicalDraft"
                    type="number"
                    step="0.1"
                    value={data.tropicalDraft}
                    onChange={(e) => updateData('tropicalDraft', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freshWaterDraft">Tatlı Su Çekimi (m)</Label>
                  <Input
                    id="freshWaterDraft"
                    type="number"
                    step="0.1"
                    value={data.freshWaterDraft}
                    onChange={(e) => updateData('freshWaterDraft', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyGeneratorCapacity">Acil Jeneratör Kapasitesi (kW)</Label>
                  <Input
                    id="emergencyGeneratorCapacity"
                    type="number"
                    value={data.emergencyGeneratorCapacity}
                    onChange={(e) => updateData('emergencyGeneratorCapacity', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batteryCapacity">Akü Kapasitesi (Ah)</Label>
                  <Input
                    id="batteryCapacity"
                    type="number"
                    value={data.batteryCapacity}
                    onChange={(e) => updateData('batteryCapacity', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="davitSWL">Davit SWL (ton)</Label>
                  <Input
                    id="davitSWL"
                    type="number"
                    step="0.1"
                    value={data.davitSWL}
                    onChange={(e) => updateData('davitSWL', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="craneSWL">Vinç SWL (ton)</Label>
                  <Input
                    id="craneSWL"
                    type="number"
                    step="0.1"
                    value={data.craneSWL}
                    onChange={(e) => updateData('craneSWL', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button onClick={calculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Hesapla
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Anchor className="h-5 w-5" />
                Demir Hesaplamaları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Önerilen Zincir Uzunluğu</Label>
                  <p className="text-2xl font-bold text-info">{result.recommendedChainLength.toFixed(0)} m</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Minimum Zincir Uzunluğu</Label>
                  <p className="text-2xl font-bold text-green-600">{result.minimumChainLength.toFixed(0)} m</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Güvenlik Faktörü</Label>
                  <p className="text-lg font-semibold">{result.safetyFactor.toFixed(1)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Demir Durumu</Label>
                  <Badge variant={
                    result.anchoringStatus === 'safe' ? 'default' :
                    result.anchoringStatus === 'marginal' ? 'secondary' : 'destructive'
                  }>
                    {result.anchoringStatus === 'safe' ? 'Güvenli' :
                     result.anchoringStatus === 'marginal' ? 'Şartlı' : 'Güvensiz'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Toplam Çevresel Kuvvet</Label>
                  <p className="text-lg font-semibold">{result.totalEnvironmentalForce.toFixed(1)} ton</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Demir Tutma Gücü</Label>
                  <p className="text-lg font-semibold">{result.anchorHoldingPower.toFixed(1)} ton</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Yangın Sistemi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Su Akışı</Label>
                  <p className="text-2xl font-bold text-red-600">{result.fireWaterFlow.toFixed(0)} L/dk</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Pompa Verimi</Label>
                  <p className="text-2xl font-bold text-orange-600">{result.firePumpEfficiency.toFixed(1)}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hortum Erişimi</Label>
                  <p className="text-lg font-semibold">{result.fireReach.toFixed(1)} m</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hazırlık Durumu</Label>
                  <Badge variant={
                    result.fireReadiness === 'excellent' ? 'default' :
                    result.fireReadiness === 'good' ? 'secondary' :
                    result.fireReadiness === 'fair' ? 'outline' : 'destructive'
                  }>
                    {result.fireReadiness === 'excellent' ? 'Mükemmel' :
                     result.fireReadiness === 'good' ? 'İyi' :
                     result.fireReadiness === 'fair' ? 'Orta' : 'Yetersiz'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Yangın Kapsamı</Label>
                <p className="text-sm">{result.fireCoverage}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="h-5 w-5" />
                Can Kurtarma Araçları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Toplam Can Botu Kapasitesi</Label>
                  <p className="text-2xl font-bold text-info">{result.totalLifeboatCapacity} kişi</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Toplam Can Salı Kapasitesi</Label>
                  <p className="text-2xl font-bold text-green-600">{result.totalLifeRaftCapacity} kişi</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tahliye Süresi</Label>
                  <p className="text-lg font-semibold">{result.evacuationTime.toFixed(0)} dakika</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">SOLAS Uygunluğu</Label>
                  <Badge variant={result.lsaCompliance ? 'default' : 'destructive'}>
                    {result.lsaCompliance ? 'Uygun' : 'Uygun Değil'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Freeboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Minimum Freeboard</Label>
                  <p className="text-2xl font-bold text-info">{result.minimumFreeboard.toFixed(0)} mm</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Mevcut Freeboard</Label>
                  <p className="text-2xl font-bold text-green-600">{result.actualFreeboard.toFixed(0)} mm</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Yük Çizgisi Bölgesi</Label>
                  <p className="text-lg font-semibold">{result.loadLineZone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Freeboard Uygunluğu</Label>
                  <Badge variant={result.freeboardCompliance ? 'default' : 'destructive'}>
                    {result.freeboardCompliance ? 'Uygun' : 'Uygun Değil'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Uyarılar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-700">{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Öneriler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};