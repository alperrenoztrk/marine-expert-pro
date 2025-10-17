import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Waves, TrendingUp, BarChart3, Activity, AlertTriangle, CheckCircle, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HydrodynamicsData {
  // Ship Principal Dimensions
  shipLength: number; // Length between perpendiculars (m)
  shipBeam: number; // Beam (m)
  shipDraft: number; // Draft (m)
  displacement: number; // Displacement (tonnes)
  blockCoefficient: number; // Block coefficient (Cb)
  prismaticCoefficient: number; // Prismatic coefficient (Cp)
  wateplaneCoefficient: number; // Waterplane coefficient (Cwp)
  
  // Ship Speed & Power
  shipSpeed: number; // Ship speed (knots)
  enginePower: number; // Engine power (kW)
  propellerDiameter: number; // Propeller diameter (m)
  propellerRPM: number; // Propeller RPM
  
  // Wave & Environmental Conditions
  waveHeight: number; // Significant wave height (m)
  waveLength: number; // Wave length (m)
  wavePeriod: number; // Wave period (s)
  waveDirection: number; // Wave direction relative to ship (degrees)
  windSpeed: number; // Wind speed (knots)
  
  // Hull Form Parameters
  entranceAngle: number; // Entrance angle (degrees)
  lcbPosition: number; // LCB position (% from midships)
  wetSurfaceArea: number; // Wetted surface area (m²)
  
  // Motion & Stability
  radiusOfGyration: number; // Radius of gyration (m)
  metacentricHeight: number; // GM (m)
  naturalRollPeriod: number; // Natural roll period (s)
  dampingCoefficient: number; // Damping coefficient
  heaveAmplitude: number; // Heave amplitude (m)
  pitchAmplitude: number; // Pitch amplitude (degrees)
  
  // Propulsion System
  propellerPitch: number; // Propeller pitch (m)
  numberOfBlades: number; // Number of propeller blades
  expandedAreaRatio: number; // Expanded area ratio (EAR)
  thrust: number; // Thrust (kN)
}

interface HydrodynamicsResult {
  // Froude Number & Resistance
  froudeNumber: number; // Froude number
  reynoldsNumber: number; // Reynolds number
  totalResistance: number; // Total resistance (kN)
  waveResistance: number; // Wave resistance (kN)
  viscousResistance: number; // Viscous resistance (kN)
  formFactor: number; // Form factor (1+k)
  residualResistance: number; // Residual resistance (kN)
  
  // Propulsion Efficiency
  propellerEfficiency: number; // Propeller efficiency (%)
  hullEfficiency: number; // Hull efficiency (%)
  relativeRotativeEfficiency: number; // Relative rotative efficiency (%)
  totalPropulsiveEfficiency: number; // Total propulsive efficiency (%)
  thrustDeduction: number; // Thrust deduction factor
  wakeDeduction: number; // Wake deduction factor
  
  // Ship Motions
  rollAmplitude: number; // Roll amplitude (degrees)
  pitchAmplitude: number; // Pitch amplitude (degrees)
  heaveAmplitude: number; // Heave amplitude (m)
  rollPeriod: number; // Roll period (s)
  pitchPeriod: number; // Pitch period (s)
  heavePeriod: number; // Heave period (s)
  
  // Motion Criteria
  rollAcceleration: number; // Roll acceleration (degrees/s²)
  verticalAcceleration: number; // Vertical acceleration (m/s²)
  lateralAcceleration: number; // Lateral acceleration (m/s²)
  slamming: boolean; // Slamming occurrence
  slammingProbability: number; // Slamming probability (%)
  
  // Seakeeping Assessment
  seakeepingIndex: number; // Seakeeping index (0-10)
  comfortLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'severe';
  operabilityIndex: number; // Operability index (%)
  
  // Wave Analysis
  encounterFrequency: number; // Wave encounter frequency (rad/s)
  waveImpactForce: number; // Wave impact force (kN)
  addedResistance: number; // Added resistance in waves (kN)
  speedLoss: number; // Speed loss in waves (%)
  
  // Structural Loads
  bending_moment: number; // Sagging/hogging moment (kN.m)
  shearForce: number; // Shear force (kN)
  torsionalMoment: number; // Torsional moment (kN.m)
  
  // Performance Analysis
  effectivePower: number; // Effective power (kW)
  deliveredPower: number; // Delivered power (kW)
  thrustPower: number; // Thrust power (kW)
  
  recommendations: string[];
  warnings: string[];
}

export const HydrodynamicsCalculations = ({ initialTab }: { initialTab?: string } = {}) => {
  const { toast } = useToast();
  const [data, setData] = useState<HydrodynamicsData>({
    shipLength: 180, shipBeam: 32, shipDraft: 12, displacement: 25000,
    blockCoefficient: 0.82, prismaticCoefficient: 0.85, wateplaneCoefficient: 0.88,
    shipSpeed: 14.5, enginePower: 15000, propellerDiameter: 6.5, propellerRPM: 120,
    waveHeight: 3.5, waveLength: 100, wavePeriod: 8, waveDirection: 180, windSpeed: 25,
    entranceAngle: 22, lcbPosition: 2.5, wetSurfaceArea: 8500,
    radiusOfGyration: 7.2, metacentricHeight: 1.8, naturalRollPeriod: 12, dampingCoefficient: 0.15,
    heaveAmplitude: 1.2, pitchAmplitude: 3.5,
    propellerPitch: 4.2, numberOfBlades: 4, expandedAreaRatio: 0.65, thrust: 850
  });

  const [result, setResult] = useState<HydrodynamicsResult | null>(null);
  

  const g = 9.81; // Gravity acceleration
  const rho = 1025; // Seawater density (kg/m³)
  const nu = 1.19e-6; // Kinematic viscosity of seawater (m²/s)

  // Froude and Reynolds numbers
  const calculateDimensionlessNumbers = () => {
    const speedMS = data.shipSpeed * 0.514; // Convert knots to m/s
    const froudeNumber = speedMS / Math.sqrt(g * data.shipLength);
    const reynoldsNumber = speedMS * data.shipLength / nu;
    
    return { froudeNumber, reynoldsNumber };
  };

  // Resistance calculations
  const calculateResistance = () => {
    const speedMS = data.shipSpeed * 0.514;
    const { froudeNumber, reynoldsNumber } = calculateDimensionlessNumbers();
    
    // Viscous resistance calculation (ITTC-57 formula)
    const cf = 0.075 / Math.pow(Math.log10(reynoldsNumber) - 2, 2);
    const formFactor = 1 + 0.93 * Math.pow(data.blockCoefficient / data.prismaticCoefficient, 0.92) * 
                      Math.pow(0.95 - data.prismaticCoefficient, -0.521) * 
                      Math.pow(1 - data.prismaticCoefficient + 0.0225 * data.lcbPosition, 0.6906);
    
    const viscousResistance = 0.5 * rho * data.wetSurfaceArea * Math.pow(speedMS, 2) * cf * formFactor / 1000;
    
    // Wave resistance (Holtrop-Mennen method approximation)
    const c1 = 2223105 * Math.pow(data.prismaticCoefficient, 3.78613) * 
               Math.pow(data.shipDraft / data.shipBeam, 1.07961) * 
               Math.pow(90 - data.entranceAngle, -1.37565);
    
    const c2 = Math.pow(data.shipLength / data.shipBeam, 0.8) * 
               Math.pow(data.shipLength / data.shipDraft, 0.678) * 
               Math.pow(data.blockCoefficient, 0.167);
    
    const waveResistance = c1 * c2 * rho * g * data.displacement / 1000 * 
                          Math.pow(froudeNumber, 2) * Math.exp(-0.034 * Math.pow(froudeNumber, -3.29));
    
    const totalResistance = viscousResistance + waveResistance;
    
    return {
      viscousResistance,
      waveResistance,
      totalResistance,
      formFactor,
      residualResistance: waveResistance
    };
  };

  // Propulsion efficiency calculations
  const calculatePropulsion = () => {
    const speedMS = data.shipSpeed * 0.514;
    
    // Wake fraction and thrust deduction (approximate values)
    const wakeDeduction = 0.25 * data.blockCoefficient + 0.15; // Simplified formula
    const thrustDeduction = 0.15 * data.blockCoefficient + 0.1;
    
    // Advance coefficient
    const advanceSpeed = speedMS * (1 - wakeDeduction);
    const advanceCoeff = advanceSpeed / (data.propellerRPM / 60 * data.propellerDiameter);
    
    // Propeller efficiency (Wageningen B-series approximation)
    const pitchRatio = data.propellerPitch / data.propellerDiameter;
    const kt = 0.2 + 0.3 * advanceCoeff - 0.1 * Math.pow(advanceCoeff, 2);
    const kq = 0.025 + 0.015 * advanceCoeff;
    
    const propellerEfficiency = (kt / kq) * (advanceCoeff / (2 * Math.PI)) * 100;
    
    // Hull efficiency
    const hullEfficiency = (1 - thrustDeduction) / (1 - wakeDeduction) * 100;
    
    // Relative rotative efficiency (approximate)
    const relativeRotativeEfficiency = 0.98 * 100; // Typically 98%
    
    // Total propulsive efficiency
    const totalPropulsiveEfficiency = (propellerEfficiency * hullEfficiency * relativeRotativeEfficiency) / 10000;
    
    return {
      propellerEfficiency,
      hullEfficiency,
      relativeRotativeEfficiency,
      totalPropulsiveEfficiency,
      thrustDeduction,
      wakeDeduction
    };
  };

  // Ship motions in waves
  const calculateMotions = () => {
    const omega = 2 * Math.PI / data.wavePeriod; // Wave frequency
    const k = Math.pow(omega, 2) / g; // Wave number
    const encounterFrequency = omega - Math.pow(omega, 2) * data.shipSpeed * 0.514 / g * 
                               Math.cos(data.waveDirection * Math.PI / 180);
    
    // Roll motion
    const rollNaturalFreq = 2 * Math.PI / data.naturalRollPeriod;
    const rollRAO = data.waveHeight / (1 + Math.pow(encounterFrequency / rollNaturalFreq, 2));
    const rollAmplitude = rollRAO * Math.atan(data.metacentricHeight / data.radiusOfGyration) * 180 / Math.PI;
    
    // Pitch motion (simplified)
    const pitchNaturalFreq = Math.sqrt(g / data.shipLength);
    const pitchAmplitude = data.waveHeight * k * data.shipLength / 4 * 180 / Math.PI;
    
    // Heave motion
    const heaveAmplitude = data.waveHeight * 0.7; // Simplified heave response
    
    // Motion periods
    const rollPeriod = 2 * Math.PI / encounterFrequency;
    const pitchPeriod = data.wavePeriod * 0.8; // Approximate
    const heavePeriod = data.wavePeriod;
    
    // Accelerations
    const rollAcceleration = Math.pow(encounterFrequency, 2) * rollAmplitude;
    const verticalAcceleration = Math.pow(encounterFrequency, 2) * heaveAmplitude;
    const lateralAcceleration = Math.pow(encounterFrequency, 2) * rollAmplitude * data.shipBeam / 2 / 180 * Math.PI;
    
    return {
      rollAmplitude,
      pitchAmplitude,
      heaveAmplitude,
      rollPeriod,
      pitchPeriod,
      heavePeriod,
      rollAcceleration,
      verticalAcceleration,
      lateralAcceleration,
      encounterFrequency
    };
  };

  // Slamming and pounding analysis
  const calculateSlamming = () => {
    const { froudeNumber } = calculateDimensionlessNumbers();
    const speedMS = data.shipSpeed * 0.514;
    
    // Relative motion criteria for slamming
    const relativeMotion = data.heaveAmplitude + data.pitchAmplitude * data.shipLength / 2 / 180 * Math.PI;
    const emergenceRatio = relativeMotion / data.shipDraft;
    
    // Slamming probability (simplified Ochi method)
    const slammingParameter = speedMS * data.waveHeight / Math.pow(data.shipLength, 2);
    const slammingProbability = Math.min(100, slammingParameter * 50);
    const slamming = slammingProbability > 5;
    
    // Wave impact force
    const waveImpactForce = 0.5 * rho * Math.pow(speedMS, 2) * data.shipBeam * data.waveHeight;
    
    return {
      slamming,
      slammingProbability,
      waveImpactForce
    };
  };

  // Added resistance and speed loss
  const calculateAddedResistance = () => {
    const { froudeNumber } = calculateDimensionlessNumbers();
    const k = Math.pow(2 * Math.PI / data.wavePeriod, 2) / g;
    
    // Added resistance in waves (simplified Gerritsma-Beukelman method)
    const addedResistanceCoeff = 8 * Math.pow(k * data.waveHeight, 2) * Math.pow(data.shipBeam, 2) / 
                                Math.pow(data.shipLength, 2) * Math.sin(data.waveDirection * Math.PI / 180);
    
    const addedResistance = addedResistanceCoeff * 0.5 * rho * g * Math.pow(data.waveHeight, 2) * 
                           data.shipBeam * data.shipLength / data.shipLength / 1000;
    
    // Speed loss estimation
    const speedLoss = (addedResistance / data.enginePower) * 100;
    
    return {
      addedResistance,
      speedLoss
    };
  };

  // Structural loads
  const calculateStructuralLoads = () => {
    const waveSlope = 2 * Math.PI * data.waveHeight / data.waveLength;
    const dynamicPressure = 0.5 * rho * Math.pow(data.shipSpeed * 0.514, 2);
    
    // Bending moment (sagging/hogging)
    const bendingMoment = rho * g * data.displacement * 1000 * data.shipLength * waveSlope * 0.1;
    
    // Shear force
    const shearForce = bendingMoment / (data.shipLength / 2);
    
    // Torsional moment
    const torsionalMoment = dynamicPressure * data.shipBeam * Math.pow(data.shipLength, 2) * waveSlope * 0.05;
    
    return {
      bendingMoment,
      shearForce,
      torsionalMoment
    };
  };

  const calculate = () => {
    try {
      const dimensionless = calculateDimensionlessNumbers();
      const resistance = calculateResistance();
      const propulsion = calculatePropulsion();
      const motions = calculateMotions();
      const slamming = calculateSlamming();
      const addedRes = calculateAddedResistance();
      const loads = calculateStructuralLoads();
      
      // Power calculations
      const speedMS = data.shipSpeed * 0.514;
      const effectivePower = resistance.totalResistance * speedMS;
      const thrustPower = effectivePower / (propulsion.hullEfficiency / 100);
      const deliveredPower = thrustPower / (propulsion.propellerEfficiency / 100);
      
      // Seakeeping assessment
      let seakeepingIndex = 10;
      if (motions.rollAmplitude > 20) seakeepingIndex -= 2;
      if (motions.verticalAcceleration > 0.3 * g) seakeepingIndex -= 2;
      if (slamming.slammingProbability > 10) seakeepingIndex -= 3;
      if (addedRes.speedLoss > 15) seakeepingIndex -= 2;
      seakeepingIndex = Math.max(0, seakeepingIndex);
      
      let comfortLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'severe';
      if (seakeepingIndex >= 8) comfortLevel = 'excellent';
      else if (seakeepingIndex >= 6) comfortLevel = 'good';
      else if (seakeepingIndex >= 4) comfortLevel = 'fair';
      else if (seakeepingIndex >= 2) comfortLevel = 'poor';
      else comfortLevel = 'severe';
      
      const operabilityIndex = Math.max(0, 100 - addedRes.speedLoss * 2 - slamming.slammingProbability);
      
      // Recommendations and warnings
      const recommendations = [];
      const warnings = [];
      
      if (dimensionless.froudeNumber > 0.32) {
        warnings.push("High Froude number - increased wave resistance and fuel consumption");
      }
      
      if (motions.rollAmplitude > 25) {
        warnings.push("Excessive roll motion - consider course/speed alteration");
      }
      
      if (slamming.slamming) {
        warnings.push("Slamming detected - reduce speed or alter course");
      }
      
      if (addedRes.speedLoss > 20) {
        warnings.push("Significant speed loss in waves - consider weather routing");
      }
      
      if (propulsion.totalPropulsiveEfficiency < 50) {
        recommendations.push("Low propulsive efficiency - check propeller condition");
      }
      
      if (loads.bendingMoment > data.displacement * 1000 * g * data.shipLength * 0.1) {
        warnings.push("High bending moments - monitor structural stress");
      }

      const calculatedResult: HydrodynamicsResult = {
        froudeNumber: dimensionless.froudeNumber,
        reynoldsNumber: dimensionless.reynoldsNumber,
        totalResistance: resistance.totalResistance,
        waveResistance: resistance.waveResistance,
        viscousResistance: resistance.viscousResistance,
        formFactor: resistance.formFactor,
        residualResistance: resistance.residualResistance,
        propellerEfficiency: propulsion.propellerEfficiency,
        hullEfficiency: propulsion.hullEfficiency,
        relativeRotativeEfficiency: propulsion.relativeRotativeEfficiency,
        totalPropulsiveEfficiency: propulsion.totalPropulsiveEfficiency,
        thrustDeduction: propulsion.thrustDeduction,
        wakeDeduction: propulsion.wakeDeduction,
        rollAmplitude: motions.rollAmplitude,
        pitchAmplitude: motions.pitchAmplitude,
        heaveAmplitude: motions.heaveAmplitude,
        rollPeriod: motions.rollPeriod,
        pitchPeriod: motions.pitchPeriod,
        heavePeriod: motions.heavePeriod,
        rollAcceleration: motions.rollAcceleration,
        verticalAcceleration: motions.verticalAcceleration,
        lateralAcceleration: motions.lateralAcceleration,
        slamming: slamming.slamming,
        slammingProbability: slamming.slammingProbability,
        seakeepingIndex,
        comfortLevel,
        operabilityIndex,
        encounterFrequency: motions.encounterFrequency,
        waveImpactForce: slamming.waveImpactForce,
        addedResistance: addedRes.addedResistance,
        speedLoss: addedRes.speedLoss,
        bending_moment: loads.bendingMoment,
        shearForce: loads.shearForce,
        torsionalMoment: loads.torsionalMoment,
        effectivePower,
        deliveredPower,
        thrustPower,
        recommendations,
        warnings
      };

      setResult(calculatedResult);
      toast({
        title: "Hesaplama Tamamlandı",
        description: "Hidrodinamik hesaplamalar başarıyla tamamlandı.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hesaplama sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const updateData = (field: keyof HydrodynamicsData, value: number | string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5" />
            Hidrodinamik Hesaplamalar
          </CardTitle>
          <CardDescription>
            Froude sayısı, gemi direnci, pervane verimi, gemi hareketleri ve dalga analizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={initialTab || "ship"} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ship">Gemi</TabsTrigger>
              <TabsTrigger value="propulsion">Sevk</TabsTrigger>
              <TabsTrigger value="waves">Dalgalar</TabsTrigger>
              <TabsTrigger value="motion">Hareket</TabsTrigger>
            </TabsList>

            <TabsContent value="ship" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipLength">Gemi Boyu (m)</Label>
                  <Input
                    id="shipLength"
                    type="number"
                    step="0.1"
                    value={data.shipLength}
                    onChange={(e) => updateData('shipLength', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipBeam">Gemi Eni (m)</Label>
                  <Input
                    id="shipBeam"
                    type="number"
                    step="0.1"
                    value={data.shipBeam}
                    onChange={(e) => updateData('shipBeam', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipDraft">Su Çekimi (m)</Label>
                  <Input
                    id="shipDraft"
                    type="number"
                    step="0.1"
                    value={data.shipDraft}
                    onChange={(e) => updateData('shipDraft', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displacement">Deplasман (ton)</Label>
                  <Input
                    id="displacement"
                    type="number"
                    value={data.displacement}
                    onChange={(e) => updateData('displacement', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blockCoefficient">Blok Katsayısı (Cb)</Label>
                  <Input
                    id="blockCoefficient"
                    type="number"
                    step="0.01"
                    value={data.blockCoefficient}
                    onChange={(e) => updateData('blockCoefficient', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipSpeed">Gemi Hızı (knot)</Label>
                  <Input
                    id="shipSpeed"
                    type="number"
                    step="0.1"
                    value={data.shipSpeed}
                    onChange={(e) => updateData('shipSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="propulsion" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enginePower">Motor Gücü (kW)</Label>
                  <Input
                    id="enginePower"
                    type="number"
                    value={data.enginePower}
                    onChange={(e) => updateData('enginePower', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propellerDiameter">Pervane Çapı (m)</Label>
                  <Input
                    id="propellerDiameter"
                    type="number"
                    step="0.1"
                    value={data.propellerDiameter}
                    onChange={(e) => updateData('propellerDiameter', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propellerRPM">Pervane RPM</Label>
                  <Input
                    id="propellerRPM"
                    type="number"
                    value={data.propellerRPM}
                    onChange={(e) => updateData('propellerRPM', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propellerPitch">Pervane Adımı (m)</Label>
                  <Input
                    id="propellerPitch"
                    type="number"
                    step="0.1"
                    value={data.propellerPitch}
                    onChange={(e) => updateData('propellerPitch', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfBlades">Kanat Sayısı</Label>
                  <Input
                    id="numberOfBlades"
                    type="number"
                    value={data.numberOfBlades}
                    onChange={(e) => updateData('numberOfBlades', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thrust">İtki Kuvveti (kN)</Label>
                  <Input
                    id="thrust"
                    type="number"
                    value={data.thrust}
                    onChange={(e) => updateData('thrust', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="waves" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waveHeight">Dalga Yüksekliği (m)</Label>
                  <Input
                    id="waveHeight"
                    type="number"
                    step="0.1"
                    value={data.waveHeight}
                    onChange={(e) => updateData('waveHeight', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waveLength">Dalga Boyu (m)</Label>
                  <Input
                    id="waveLength"
                    type="number"
                    value={data.waveLength}
                    onChange={(e) => updateData('waveLength', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wavePeriod">Dalga Periyodu (s)</Label>
                  <Input
                    id="wavePeriod"
                    type="number"
                    step="0.1"
                    value={data.wavePeriod}
                    onChange={(e) => updateData('wavePeriod', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waveDirection">Dalga Doğrultusu (°)</Label>
                  <Input
                    id="waveDirection"
                    type="number"
                    value={data.waveDirection}
                    onChange={(e) => updateData('waveDirection', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windSpeed">Rüzgar Hızı (knot)</Label>
                  <Input
                    id="windSpeed"
                    type="number"
                    value={data.windSpeed}
                    onChange={(e) => updateData('windSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="motion" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metacentricHeight">GM (m)</Label>
                  <Input
                    id="metacentricHeight"
                    type="number"
                    step="0.1"
                    value={data.metacentricHeight}
                    onChange={(e) => updateData('metacentricHeight', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="naturalRollPeriod">Doğal Yalpa Periyodu (s)</Label>
                  <Input
                    id="naturalRollPeriod"
                    type="number"
                    step="0.1"
                    value={data.naturalRollPeriod}
                    onChange={(e) => updateData('naturalRollPeriod', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radiusOfGyration">Atalet Yarıçapı (m)</Label>
                  <Input
                    id="radiusOfGyration"
                    type="number"
                    step="0.1"
                    value={data.radiusOfGyration}
                    onChange={(e) => updateData('radiusOfGyration', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dampingCoefficient">Sönümleme Katsayısı</Label>
                  <Input
                    id="dampingCoefficient"
                    type="number"
                    step="0.01"
                    value={data.dampingCoefficient}
                    onChange={(e) => updateData('dampingCoefficient', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
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
                <TrendingUp className="h-5 w-5" />
                Direnç ve Verimlilik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Froude Sayısı</Label>
                  <p className="text-2xl font-bold text-info">{result.froudeNumber.toFixed(3)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Toplam Direnç</Label>
                  <p className="text-2xl font-bold text-red-600">{result.totalResistance.toFixed(1)} kN</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dalga Direnci</Label>
                  <p className="text-2xl font-bold text-orange-700">{result.waveResistance.toFixed(1)} kN</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Pervane Verimi</Label>
                  <p className="text-lg font-semibold">{result.propellerEfficiency.toFixed(1)}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Gövde Verimi</Label>
                  <p className="text-lg font-semibold">{result.hullEfficiency.toFixed(1)}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Toplam Sevk Verimi</Label>
                  <p className="text-lg font-semibold">{result.totalPropulsiveEfficiency.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Gemi Hareketleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Yalpa Genliği</Label>
                  <p className="text-2xl font-bold text-purple-600">{result.rollAmplitude.toFixed(1)}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tangage Genliği</Label>
                  <p className="text-2xl font-bold text-green-700">{result.pitchAmplitude.toFixed(1)}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dalıp Çıkma</Label>
                  <p className="text-2xl font-bold text-info">{result.heaveAmplitude.toFixed(1)} m</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Düşey İvme</Label>
                  <p className="text-lg font-semibold">{result.verticalAcceleration.toFixed(2)} m/s²</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Yanal İvme</Label>
                  <p className="text-lg font-semibold">{result.lateralAcceleration.toFixed(2)} m/s²</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Slamming</Label>
                  <Badge variant={result.slamming ? 'destructive' : 'default'}>
                    {result.slamming ? 'Var' : 'Yok'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Denizcilik Performansı
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Denizcilik İndeksi</Label>
                  <p className="text-2xl font-bold text-info">{result.seakeepingIndex.toFixed(1)}/10</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Konfor Seviyesi</Label>
                  <Badge variant={
                    result.comfortLevel === 'excellent' ? 'default' :
                    result.comfortLevel === 'good' ? 'secondary' :
                    result.comfortLevel === 'fair' ? 'outline' :
                    result.comfortLevel === 'poor' ? 'destructive' : 'destructive'
                  }>
                    {result.comfortLevel === 'excellent' ? 'Mükemmel' :
                     result.comfortLevel === 'good' ? 'İyi' :
                     result.comfortLevel === 'fair' ? 'Orta' :
                     result.comfortLevel === 'poor' ? 'Kötü' : 'Çok Kötü'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Operabilite İndeksi</Label>
                  <p className="text-lg font-semibold">{result.operabilityIndex.toFixed(1)}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hız Kaybı</Label>
                  <p className="text-lg font-semibold">{result.speedLoss.toFixed(1)}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">İlave Direnç</Label>
                  <p className="text-lg font-semibold">{result.addedResistance.toFixed(1)} kN</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Slamming Olasılığı</Label>
                  <p className="text-lg font-semibold">{result.slammingProbability.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Güç Hesaplamaları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Efektif Güç</Label>
                  <p className="text-2xl font-bold text-green-700">{result.effectivePower.toFixed(0)} kW</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">İtki Gücü</Label>
                  <p className="text-2xl font-bold text-info">{result.thrustPower.toFixed(0)} kW</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Teslim Edilen Güç</Label>
                  <p className="text-2xl font-bold text-orange-700">{result.deliveredPower.toFixed(0)} kW</p>
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