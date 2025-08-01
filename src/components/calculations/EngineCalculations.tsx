import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Settings, Fuel, Gauge, Activity, Zap, AlertTriangle, CheckCircle, TrendingUp, BarChart3, Thermometer, Droplets, Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EngineData {
  // Main Engine Parameters
  mcrPower: number; // Maximum Continuous Rating (kW)
  currentLoad: number; // Current load (%)
  engineRPM: number; // Engine RPM
  nominalRPM: number; // Nominal RPM
  cylinderNumber: number; // Number of cylinders
  engineType: 'two-stroke' | 'four-stroke'; // Engine type
  
  // Fuel System
  fuelType: 'HFO' | 'MDO' | 'MGO' | 'LNG' | 'Methanol'; // Current fuel type
  fuelDensity: number; // Fuel density (kg/m³)
  fuelViscosity: number; // Fuel viscosity (cSt)
  fuelTemperature: number; // Fuel temperature (°C)
  fuelSulfurContent: number; // Fuel sulfur content (%)
  lowerCalorificValue: number; // Lower calorific value (MJ/kg)
  
  // SFOC Data
  sfocAt100: number; // SFOC at 100% load (g/kWh)
  sfocAt85: number; // SFOC at 85% load (g/kWh)
  sfocAt75: number; // SFOC at 75% load (g/kWh)
  sfocAt50: number; // SFOC at 50% load (g/kWh)
  
  // Power Measurements
  indicatedPower: number; // Indicated power (kW)
  mechanicalEfficiency: number; // Mechanical efficiency (%)
  generatorEfficiency: number; // Generator efficiency (%)
  
  // Cooling System
  seawaterInletTemp: number; // Seawater inlet temperature (°C)
  seawaterOutletTemp: number; // Seawater outlet temperature (°C)
  freshwaterInletTemp: number; // Freshwater inlet temperature (°C)
  freshwaterOutletTemp: number; // Freshwater outlet temperature (°C)
  coolingWaterFlow: number; // Cooling water flow rate (m³/h)
  
  // Heat Exchanger
  heatLoad: number; // Heat load to be removed (kW)
  logMeanTempDiff: number; // Log mean temperature difference (°C)
  overallHeatTransferCoeff: number; // Overall heat transfer coefficient (W/m²K)
  foulingFactor: number; // Fouling factor (m²K/W)
  
  // HFO/MDO Changeover
  changeoverFromHFO: boolean; // Changeover from HFO
  changeoverToMDO: boolean; // Changeover to MDO
  pipelineVolume: number; // Pipeline volume (L)
  changeoverFlowRate: number; // Changeover flow rate (L/min)
  preheatingTime: number; // Preheating time (minutes)
  
  // Tank Calculations
  bilgeTankLength: number; // Bilge tank length (m)
  bilgeTankWidth: number; // Bilge tank width (m)
  bilgeTankHeight: number; // Bilge tank height (m)
  sludgeTankDiameter: number; // Sludge tank diameter (m)
  sludgeTankHeight: number; // Sludge tank height (m)
  
  // Environmental Conditions
  ambientTemperature: number; // Ambient temperature (°C)
  ambientPressure: number; // Ambient pressure (bar)
  humidity: number; // Relative humidity (%)
  
  // Operating Hours
  dailyRunningHours: number; // Daily running hours
  totalRunningHours: number; // Total running hours
}

interface EngineResult {
  // Fuel Consumption
  currentSFOC: number; // Current SFOC (g/kWh)
  hourlyConsumption: number; // Hourly fuel consumption (kg/h)
  dailyConsumption: number; // Daily fuel consumption (tonnes)
  specificFuelConsumption: number; // Specific fuel consumption (kg/kWh)
  
  // Engine Efficiency
  indicatedThermalEfficiency: number; // Indicated thermal efficiency (%)
  brakeSpecificFuelConsumption: number; // Brake specific fuel consumption (g/kWh)
  mechanicalPowerLoss: number; // Mechanical power loss (kW)
  overallEfficiency: number; // Overall efficiency (%)
  
  // Power Calculations
  shaftPower: number; // Shaft power (kW)
  brakePower: number; // Brake power (kW)
  indicatedMeanEffectivePressure: number; // IMEP (bar)
  brakeSpecificFuelPressure: number; // BMEP (bar)
  powerOutput: number; // Current power output (kW)
  electricalPower: number; // Electrical power output (kW)
  
  // HFO/MDO Changeover
  changeoverTime: number; // Total changeover time (minutes)
  fuelWasteVolume: number; // Fuel waste volume (L)
  changeoverCost: number; // Changeover cost estimate ($)
  changeoverStatus: 'ready' | 'in_progress' | 'completed';
  
  // Cooling System Calculations
  heatRejectionRate: number; // Heat rejection rate (kW)
  coolingCapacityRequired: number; // Required cooling capacity (kW)
  seawaterPumpPower: number; // Seawater pump power (kW)
  coolingEfficiency: number; // Cooling system efficiency (%)
  
  // MARPOL Annex VI Emissions
  noxEmissionRate: number; // NOx emission rate (g/kWh)
  noxDailyEmission: number; // Daily NOx emission (kg)
  soxEmissionRate: number; // SOx emission rate (g/kWh)
  soxDailyEmission: number; // Daily SOx emission (kg)
  co2EmissionRate: number; // CO2 emission rate (g/kWh)
  co2DailyEmission: number; // Daily CO2 emission (kg)
  pmEmissionRate: number; // PM emission rate (g/kWh)
  eeoi: number; // Energy Efficiency Operational Indicator
  cii: number; // Carbon Intensity Indicator
  
  // Heat Exchanger
  heatExchangerArea: number; // Required heat exchanger area (m²)
  numberOfTubes: number; // Number of tubes required
  tubeLength: number; // Tube length (m)
  pressureDrop: number; // Pressure drop (kPa)
  effectiveness: number; // Heat exchanger effectiveness (%)
  
  // Tank Calculations
  bilgeTankCapacity: number; // Bilge tank capacity (m³)
  sludgeTankCapacity: number; // Sludge tank capacity (m³)
  bilgeGenerationRate: number; // Bilge generation rate (L/day)
  sludgeGenerationRate: number; // Sludge generation rate (L/day)
  
  // Compliance Status
  noxCompliance: 'compliant' | 'non_compliant' | 'marginal';
  soxCompliance: 'compliant' | 'non_compliant' | 'marginal';
  marpolTier: 'I' | 'II' | 'III';
  ecaCompliance: boolean; // ECA (Emission Control Area) compliance
  
  recommendations: string[];
  warnings: string[];
}

export const EngineCalculations = () => {
  const { toast } = useToast();
  const [data, setData] = useState<EngineData>({
    mcrPower: 15000, currentLoad: 75, engineRPM: 120, nominalRPM: 127,
    cylinderNumber: 6, engineType: 'two-stroke', fuelType: 'HFO',
    fuelDensity: 950, fuelViscosity: 380, fuelTemperature: 150,
    fuelSulfurContent: 0.5, lowerCalorificValue: 40.2,
    sfocAt100: 190, sfocAt85: 185, sfocAt75: 175, sfocAt50: 195,
    indicatedPower: 12000, mechanicalEfficiency: 90, generatorEfficiency: 95,
    seawaterInletTemp: 25, seawaterOutletTemp: 35, freshwaterInletTemp: 65,
    freshwaterOutletTemp: 75, coolingWaterFlow: 800, heatLoad: 5500,
    logMeanTempDiff: 35, overallHeatTransferCoeff: 2500, foulingFactor: 0.0002,
    changeoverFromHFO: false, changeoverToMDO: false, pipelineVolume: 1200,
    changeoverFlowRate: 60, preheatingTime: 45, bilgeTankLength: 8,
    bilgeTankWidth: 4, bilgeTankHeight: 2.5, sludgeTankDiameter: 2.5,
    sludgeTankHeight: 3, ambientTemperature: 28, ambientPressure: 1.01325,
    humidity: 65, dailyRunningHours: 24, totalRunningHours: 25000
  });

  const [result, setResult] = useState<EngineResult | null>(null);

  // Calculate SFOC based on engine load using interpolation
  const calculateSFOC = (load: number): number => {
    if (load <= 50) {
      return data.sfocAt50 + (data.sfocAt50 * 0.15 * (1 - load/50));
    } else if (load <= 75) {
      const ratio = (load - 50) / 25;
      return data.sfocAt50 + (data.sfocAt75 - data.sfocAt50) * ratio;
    } else if (load <= 85) {
      const ratio = (load - 75) / 10;
      return data.sfocAt75 + (data.sfocAt85 - data.sfocAt75) * ratio;
    } else if (load <= 100) {
      const ratio = (load - 85) / 15;
      return data.sfocAt85 + (data.sfocAt100 - data.sfocAt85) * ratio;
    } else {
      // Penalty for overload
      const excess = load - 100;
      return data.sfocAt100 * (1 + 0.03 * excess);
    }
  };

  // Calculate NOx emissions according to MARPOL Annex VI
  const calculateNOxEmissions = (enginePower: number, engineRPM: number): { rate: number; tier: 'I' | 'II' | 'III' } => {
    // MARPOL Annex VI NOx limits
    let limit_tier_I: number;
    let limit_tier_II: number;
    let limit_tier_III: number;
    
    if (engineRPM < 130) {
      limit_tier_I = 45;
      limit_tier_II = 37.8;
      limit_tier_III = 3.4;
    } else if (engineRPM >= 130 && engineRPM < 2000) {
      limit_tier_I = 45 * Math.pow(engineRPM / 130, -0.2);
      limit_tier_II = 37.8 * Math.pow(engineRPM / 130, -0.2);
      limit_tier_III = 3.4;
    } else {
      limit_tier_I = 9.8;
      limit_tier_II = 7.7;
      limit_tier_III = 1.96;
    }
    
    // Typical NOx emission for current engine (estimated)
    const baseNOx = data.engineType === 'two-stroke' ? 
      12 + (data.currentLoad / 100) * 3 : 
      8 + (data.currentLoad / 100) * 2;
    
    let tier: 'I' | 'II' | 'III';
    if (baseNOx <= limit_tier_III) tier = 'III';
    else if (baseNOx <= limit_tier_II) tier = 'II';
    else tier = 'I';
    
    return { rate: baseNOx, tier };
  };

  // Calculate SOx emissions based on fuel sulfur content
  const calculateSOxEmissions = (fuelConsumption: number): number => {
    // SOx = 2 × S × FC (MARPOL formula)
    // Where S = sulfur content (%), FC = fuel consumption (kg/h)
    return 2 * (data.fuelSulfurContent / 100) * fuelConsumption;
  };

  // Calculate CO2 emissions
  const calculateCO2Emissions = (fuelConsumption: number): number => {
    // CO2 emission factor for marine fuel oil (kg CO2/kg fuel)
    const co2Factor = data.fuelType === 'HFO' ? 3.151 : 
                     data.fuelType === 'MDO' ? 3.206 :
                     data.fuelType === 'MGO' ? 3.206 :
                     data.fuelType === 'LNG' ? 2.750 : 1.375; // Methanol
    
    return fuelConsumption * co2Factor;
  };

  // Calculate heat exchanger area
  const calculateHeatExchangerArea = (): { area: number; tubes: number; length: number } => {
    // Q = U × A × LMTD
    // A = Q / (U × LMTD)
    const cleanHeatTransferCoeff = 1 / (1/data.overallHeatTransferCoeff - data.foulingFactor);
    const area = (data.heatLoad * 1000) / (cleanHeatTransferCoeff * data.logMeanTempDiff);
    
    // Assuming tube diameter 25mm, pitch 32mm
    const tubeArea = Math.PI * 0.025 * 4; // 4m tube length
    const numberOfTubes = Math.ceil(area / tubeArea);
    const tubeLength = area / (numberOfTubes * Math.PI * 0.025);
    
    return { area, tubes: numberOfTubes, length: tubeLength };
  };

  // Calculate tank capacities
  const calculateTankCapacities = () => {
    const bilgeCapacity = data.bilgeTankLength * data.bilgeTankWidth * data.bilgeTankHeight;
    const sludgeCapacity = Math.PI * Math.pow(data.sludgeTankDiameter/2, 2) * data.sludgeTankHeight;
    
    // Typical generation rates
    const bilgeGeneration = (data.mcrPower / 1000) * 0.5; // L/day per MW
    const estimatedConsumption = (data.mcrPower * 0.185 * 24) / 1000; // Estimated daily consumption in tonnes
    const sludgeGeneration = (estimatedConsumption * 1000) * 0.01; // 1% of fuel consumption
    
    return { bilgeCapacity, sludgeCapacity, bilgeGeneration, sludgeGeneration };
  };

  const calculate = () => {
    try {
      const currentSFOC = calculateSFOC(data.currentLoad);
      const powerOutput = (data.mcrPower * data.currentLoad) / 100;
      
      // Fuel consumption calculations
      const hourlyConsumption = (powerOutput * currentSFOC) / 1000; // kg/h
      const dailyConsumption = (hourlyConsumption * data.dailyRunningHours) / 1000; // tonnes
      
      // Power calculations
      const shaftPower = powerOutput;
      const brakePower = (data.indicatedPower * data.mechanicalEfficiency) / 100;
      const electricalPower = (brakePower * data.generatorEfficiency) / 100;
      
      // Efficiency calculations
      const indicatedThermalEfficiency = (data.indicatedPower * 3600) / (hourlyConsumption * data.lowerCalorificValue * 1000) * 100;
      const overallEfficiency = (electricalPower * 3600) / (hourlyConsumption * data.lowerCalorificValue * 1000) * 100;
      
      // Emissions calculations
      const noxCalc = calculateNOxEmissions(powerOutput, data.engineRPM);
      const noxDailyEmission = (noxCalc.rate * powerOutput * data.dailyRunningHours) / 1000; // kg/day
      
      const soxEmissionRate = calculateSOxEmissions(1) / powerOutput * 1000; // g/kWh
      const soxDailyEmission = calculateSOxEmissions(hourlyConsumption) * data.dailyRunningHours; // kg/day
      
      const co2EmissionRate = (calculateCO2Emissions(1) / powerOutput) * 1000000; // g/kWh
      const co2DailyEmission = calculateCO2Emissions(hourlyConsumption) * data.dailyRunningHours; // kg/day
      
      // Cooling system calculations
      const heatRejectionRate = powerOutput * 0.4; // Typical 40% heat rejection
      const coolingCapacityRequired = heatRejectionRate * 1.2; // 20% safety margin
      
      // Heat exchanger calculations
      const heatExchanger = calculateHeatExchangerArea();
      
      // Tank calculations
      const tanks = calculateTankCapacities();
      
      // HFO/MDO changeover calculations
      const changeoverTime = data.preheatingTime + (data.pipelineVolume / data.changeoverFlowRate);
      const fuelWasteVolume = data.pipelineVolume * 1.1; // 10% safety margin
      
      // Compliance checks
      const noxCompliance: 'compliant' | 'non_compliant' | 'marginal' = 
        noxCalc.rate <= 3.4 ? 'compliant' : 
        noxCalc.rate <= 7.7 ? 'marginal' : 'non_compliant';
      
      const soxCompliance: 'compliant' | 'non_compliant' | 'marginal' = 
        data.fuelSulfurContent <= 0.1 ? 'compliant' :
        data.fuelSulfurContent <= 0.5 ? 'marginal' : 'non_compliant';
      
      const ecaCompliance = data.fuelSulfurContent <= 0.1 && noxCalc.rate <= 3.4;
      
      // EEOI calculation (kg CO2/nm)
      const eeoi = (co2DailyEmission * 1000) / (14.5 * 24); // Assuming 14.5 knots speed
      
      // Recommendations and warnings
      const recommendations = [];
      const warnings = [];
      
      if (data.currentLoad < 70) {
        recommendations.push("Motor yükünü artırarak yakıt verimliliğini iyileştirin");
      }
      
      if (data.currentLoad > 90) {
        warnings.push("Motor yükü çok yüksek - hasar riski var");
      }
      
      if (currentSFOC > 200) {
        recommendations.push("Motor bakımı yaparak yakıt verimliliğini artırın");
      }
      
      if (data.fuelSulfurContent > 0.5) {
        warnings.push("Yakıt kükürt içeriği MARPOL limitini aşıyor");
      }
      
      if (noxCalc.rate > 7.7) {
        warnings.push("NOx emisyonu MARPOL Tier II limitini aşıyor");
      }
      
      if (!ecaCompliance) {
        warnings.push("ECA bölgesi gereksinimlerini karşılamıyor");
      }

      const calculatedResult: EngineResult = {
        currentSFOC,
        hourlyConsumption,
        dailyConsumption,
        specificFuelConsumption: currentSFOC / 1000,
        indicatedThermalEfficiency,
        brakeSpecificFuelConsumption: currentSFOC,
        mechanicalPowerLoss: data.indicatedPower - brakePower,
        overallEfficiency,
        shaftPower,
        brakePower,
        indicatedMeanEffectivePressure: (data.indicatedPower * 60) / (data.cylinderNumber * data.engineRPM * 0.1),
        brakeSpecificFuelPressure: (brakePower * 60) / (data.cylinderNumber * data.engineRPM * 0.1),
        powerOutput,
        electricalPower,
        changeoverTime,
        fuelWasteVolume,
        changeoverCost: fuelWasteVolume * 0.8, // $0.8/L estimate
        changeoverStatus: 'ready',
        heatRejectionRate,
        coolingCapacityRequired,
        seawaterPumpPower: (data.coolingWaterFlow * 10) / 3600, // Rough estimate
        coolingEfficiency: 85,
        noxEmissionRate: noxCalc.rate,
        noxDailyEmission,
        soxEmissionRate,
        soxDailyEmission,
        co2EmissionRate,
        co2DailyEmission,
        pmEmissionRate: 0.4, // Typical PM emission
        eeoi,
        cii: eeoi * 1.2, // Simplified CII calculation
        heatExchangerArea: heatExchanger.area,
        numberOfTubes: heatExchanger.tubes,
        tubeLength: heatExchanger.length,
        pressureDrop: 15, // Typical pressure drop
        effectiveness: 80,
        bilgeTankCapacity: tanks.bilgeCapacity,
        sludgeTankCapacity: tanks.sludgeCapacity,
        bilgeGenerationRate: tanks.bilgeGeneration,
        sludgeGenerationRate: tanks.sludgeGeneration,
        noxCompliance,
        soxCompliance,
        marpolTier: noxCalc.tier,
        ecaCompliance,
        recommendations,
        warnings
      };

      setResult(calculatedResult);
      toast({
        title: "Hesaplama Tamamlandı",
        description: "Makine hesaplamaları MARPOL regülasyonlarına uygun olarak tamamlandı.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hesaplama sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const updateData = (field: keyof EngineData, value: number | string | boolean) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gelişmiş Makine Hesaplamaları
          </CardTitle>
          <CardDescription>
            MARPOL Annex VI uyumlu emisyon, verimlilik, ısı değiştiricisi ve tank hesaplamaları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="engine" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="engine">Ana Makine</TabsTrigger>
              <TabsTrigger value="fuel">Yakıt Sistemi</TabsTrigger>
              <TabsTrigger value="cooling">Soğutma</TabsTrigger>
              <TabsTrigger value="changeover">Geçiş</TabsTrigger>
              <TabsTrigger value="heat">Isı Değiştirici</TabsTrigger>
              <TabsTrigger value="tanks">Tanklar</TabsTrigger>
            </TabsList>

            <TabsContent value="engine" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mcrPower">MCR Gücü (kW)</Label>
                  <Input
                    id="mcrPower"
                    type="number"
                    value={data.mcrPower}
                    onChange={(e) => updateData('mcrPower', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentLoad">Mevcut Yük (%)</Label>
                  <Input
                    id="currentLoad"
                    type="number"
                    value={data.currentLoad}
                    onChange={(e) => updateData('currentLoad', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineRPM">Motor RPM</Label>
                  <Input
                    id="engineRPM"
                    type="number"
                    value={data.engineRPM}
                    onChange={(e) => updateData('engineRPM', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nominalRPM">Nominal RPM</Label>
                  <Input
                    id="nominalRPM"
                    type="number"
                    value={data.nominalRPM}
                    onChange={(e) => updateData('nominalRPM', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cylinderNumber">Silindir Sayısı</Label>
                  <Input
                    id="cylinderNumber"
                    type="number"
                    value={data.cylinderNumber}
                    onChange={(e) => updateData('cylinderNumber', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineType">Motor Tipi</Label>
                  <Select value={data.engineType} onValueChange={(value) => updateData('engineType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="two-stroke">İki Zamanlı</SelectItem>
                      <SelectItem value="four-stroke">Dört Zamanlı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="indicatedPower">İndike Güç (kW)</Label>
                  <Input
                    id="indicatedPower"
                    type="number"
                    value={data.indicatedPower}
                    onChange={(e) => updateData('indicatedPower', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mechanicalEfficiency">Mekanik Verim (%)</Label>
                  <Input
                    id="mechanicalEfficiency"
                    type="number"
                    value={data.mechanicalEfficiency}
                    onChange={(e) => updateData('mechanicalEfficiency', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fuel" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Yakıt Tipi</Label>
                  <Select value={data.fuelType} onValueChange={(value) => updateData('fuelType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HFO">Heavy Fuel Oil (HFO)</SelectItem>
                      <SelectItem value="MDO">Marine Diesel Oil (MDO)</SelectItem>
                      <SelectItem value="MGO">Marine Gas Oil (MGO)</SelectItem>
                      <SelectItem value="LNG">Liquefied Natural Gas (LNG)</SelectItem>
                      <SelectItem value="Methanol">Methanol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelDensity">Yakıt Yoğunluğu (kg/m³)</Label>
                  <Input
                    id="fuelDensity"
                    type="number"
                    value={data.fuelDensity}
                    onChange={(e) => updateData('fuelDensity', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelSulfurContent">Kükürt İçeriği (%)</Label>
                  <Input
                    id="fuelSulfurContent"
                    type="number"
                    step="0.01"
                    value={data.fuelSulfurContent}
                    onChange={(e) => updateData('fuelSulfurContent', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowerCalorificValue">Alt Isıl Değer (MJ/kg)</Label>
                  <Input
                    id="lowerCalorificValue"
                    type="number"
                    step="0.1"
                    value={data.lowerCalorificValue}
                    onChange={(e) => updateData('lowerCalorificValue', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sfocAt100">SFOC @ 100% (g/kWh)</Label>
                  <Input
                    id="sfocAt100"
                    type="number"
                    value={data.sfocAt100}
                    onChange={(e) => updateData('sfocAt100', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sfocAt85">SFOC @ 85% (g/kWh)</Label>
                  <Input
                    id="sfocAt85"
                    type="number"
                    value={data.sfocAt85}
                    onChange={(e) => updateData('sfocAt85', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sfocAt75">SFOC @ 75% (g/kWh)</Label>
                  <Input
                    id="sfocAt75"
                    type="number"
                    value={data.sfocAt75}
                    onChange={(e) => updateData('sfocAt75', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sfocAt50">SFOC @ 50% (g/kWh)</Label>
                  <Input
                    id="sfocAt50"
                    type="number"
                    value={data.sfocAt50}
                    onChange={(e) => updateData('sfocAt50', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cooling" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seawaterInletTemp">Deniz Suyu Giriş Sıcaklığı (°C)</Label>
                  <Input
                    id="seawaterInletTemp"
                    type="number"
                    value={data.seawaterInletTemp}
                    onChange={(e) => updateData('seawaterInletTemp', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seawaterOutletTemp">Deniz Suyu Çıkış Sıcaklığı (°C)</Label>
                  <Input
                    id="seawaterOutletTemp"
                    type="number"
                    value={data.seawaterOutletTemp}
                    onChange={(e) => updateData('seawaterOutletTemp', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freshwaterInletTemp">Tatlı Su Giriş Sıcaklığı (°C)</Label>
                  <Input
                    id="freshwaterInletTemp"
                    type="number"
                    value={data.freshwaterInletTemp}
                    onChange={(e) => updateData('freshwaterInletTemp', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freshwaterOutletTemp">Tatlı Su Çıkış Sıcaklığı (°C)</Label>
                  <Input
                    id="freshwaterOutletTemp"
                    type="number"
                    value={data.freshwaterOutletTemp}
                    onChange={(e) => updateData('freshwaterOutletTemp', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coolingWaterFlow">Soğutma Suyu Debisi (m³/h)</Label>
                  <Input
                    id="coolingWaterFlow"
                    type="number"
                    value={data.coolingWaterFlow}
                    onChange={(e) => updateData('coolingWaterFlow', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="changeover" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pipelineVolume">Boru Hattı Hacmi (L)</Label>
                  <Input
                    id="pipelineVolume"
                    type="number"
                    value={data.pipelineVolume}
                    onChange={(e) => updateData('pipelineVolume', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="changeoverFlowRate">Geçiş Debi (L/min)</Label>
                  <Input
                    id="changeoverFlowRate"
                    type="number"
                    value={data.changeoverFlowRate}
                    onChange={(e) => updateData('changeoverFlowRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preheatingTime">Ön Isıtma Süresi (dakika)</Label>
                  <Input
                    id="preheatingTime"
                    type="number"
                    value={data.preheatingTime}
                    onChange={(e) => updateData('preheatingTime', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="heat" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heatLoad">Isı Yükü (kW)</Label>
                  <Input
                    id="heatLoad"
                    type="number"
                    value={data.heatLoad}
                    onChange={(e) => updateData('heatLoad', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logMeanTempDiff">Ortalama Sıcaklık Farkı (°C)</Label>
                  <Input
                    id="logMeanTempDiff"
                    type="number"
                    value={data.logMeanTempDiff}
                    onChange={(e) => updateData('logMeanTempDiff', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overallHeatTransferCoeff">Isı Transfer Katsayısı (W/m²K)</Label>
                  <Input
                    id="overallHeatTransferCoeff"
                    type="number"
                    value={data.overallHeatTransferCoeff}
                    onChange={(e) => updateData('overallHeatTransferCoeff', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foulingFactor">Kirlenme Faktörü (m²K/W)</Label>
                  <Input
                    id="foulingFactor"
                    type="number"
                    step="0.00001"
                    value={data.foulingFactor}
                    onChange={(e) => updateData('foulingFactor', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tanks" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bilgeTankLength">Pis Su Tankı Uzunluk (m)</Label>
                  <Input
                    id="bilgeTankLength"
                    type="number"
                    value={data.bilgeTankLength}
                    onChange={(e) => updateData('bilgeTankLength', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bilgeTankWidth">Pis Su Tankı Genişlik (m)</Label>
                  <Input
                    id="bilgeTankWidth"
                    type="number"
                    value={data.bilgeTankWidth}
                    onChange={(e) => updateData('bilgeTankWidth', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bilgeTankHeight">Pis Su Tankı Yükseklik (m)</Label>
                  <Input
                    id="bilgeTankHeight"
                    type="number"
                    value={data.bilgeTankHeight}
                    onChange={(e) => updateData('bilgeTankHeight', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sludgeTankDiameter">Sintine Tankı Çap (m)</Label>
                  <Input
                    id="sludgeTankDiameter"
                    type="number"
                    value={data.sludgeTankDiameter}
                    onChange={(e) => updateData('sludgeTankDiameter', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sludgeTankHeight">Sintine Tankı Yükseklik (m)</Label>
                  <Input
                    id="sludgeTankHeight"
                    type="number"
                    value={data.sludgeTankHeight}
                    onChange={(e) => updateData('sludgeTankHeight', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button onClick={calculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Gelişmiş Hesaplama Yap
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Fuel Consumption & Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Yakıt Tüketimi ve Verimlilik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Mevcut SFOC</Label>
                  <p className="text-2xl font-bold text-info">{result.currentSFOC.toFixed(1)} g/kWh</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Saatlik Tüketim</Label>
                  <p className="text-2xl font-bold text-green-600">{result.hourlyConsumption.toFixed(1)} kg/h</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Günlük Tüketim</Label>
                  <p className="text-2xl font-bold text-orange-600">{result.dailyConsumption.toFixed(1)} ton</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Toplam Verim</Label>
                  <p className="text-2xl font-bold text-purple-600">{result.overallEfficiency.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Power Calculations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Güç Hesaplamaları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Şaft Gücü</Label>
                  <p className="text-lg font-semibold">{result.shaftPower.toFixed(0)} kW</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fren Gücü</Label>
                  <p className="text-lg font-semibold">{result.brakePower.toFixed(0)} kW</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Elektrik Gücü</Label>
                  <p className="text-lg font-semibold">{result.electricalPower.toFixed(0)} kW</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">İndike Termal Verim</Label>
                  <p className="text-lg font-semibold">{result.indicatedThermalEfficiency.toFixed(1)}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">IMEP</Label>
                  <p className="text-lg font-semibold">{result.indicatedMeanEffectivePressure.toFixed(1)} bar</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">BMEP</Label>
                  <p className="text-lg font-semibold">{result.brakeSpecificFuelPressure.toFixed(1)} bar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MARPOL Emissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                MARPOL Annex VI Emisyonlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">NOx Emisyonu</Label>
                  <p className="text-lg font-semibold">{result.noxEmissionRate.toFixed(2)} g/kWh</p>
                  <Badge variant={result.noxCompliance === 'compliant' ? 'default' : 
                                 result.noxCompliance === 'marginal' ? 'secondary' : 'destructive'}>
                    {result.noxCompliance === 'compliant' ? 'Uygun' :
                     result.noxCompliance === 'marginal' ? 'Sınırda' : 'Uygun Değil'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">SOx Emisyonu</Label>
                  <p className="text-lg font-semibold">{result.soxEmissionRate.toFixed(2)} g/kWh</p>
                  <Badge variant={result.soxCompliance === 'compliant' ? 'default' : 
                                 result.soxCompliance === 'marginal' ? 'secondary' : 'destructive'}>
                    {result.soxCompliance === 'compliant' ? 'Uygun' :
                     result.soxCompliance === 'marginal' ? 'Sınırda' : 'Uygun Değil'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">CO₂ Emisyonu</Label>
                  <p className="text-lg font-semibold">{(result.co2DailyEmission/1000).toFixed(1)} ton/gün</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">MARPOL Tier</Label>
                  <Badge variant="outline">Tier {result.marpolTier}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">ECA Uyumluluk</Label>
                  <Badge variant={result.ecaCompliance ? 'default' : 'destructive'}>
                    {result.ecaCompliance ? 'Uyumlu' : 'Uyumlu Değil'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">EEOI</Label>
                  <p className="text-lg font-semibold">{result.eeoi.toFixed(2)} kg CO₂/nm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HFO/MDO Changeover */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                HFO/MDO Geçiş Hesaplamaları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Toplam Geçiş Süresi</Label>
                  <p className="text-lg font-semibold">{result.changeoverTime.toFixed(0)} dakika</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Atık Yakıt Hacmi</Label>
                  <p className="text-lg font-semibold">{result.fuelWasteVolume.toFixed(0)} L</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tahmini Maliyet</Label>
                  <p className="text-lg font-semibold">${result.changeoverCost.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cooling System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Soğutma Sistemi Hesaplamaları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Isı Atım Oranı</Label>
                  <p className="text-lg font-semibold">{result.heatRejectionRate.toFixed(0)} kW</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Gerekli Soğutma Kapasitesi</Label>
                  <p className="text-lg font-semibold">{result.coolingCapacityRequired.toFixed(0)} kW</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Soğutma Verimi</Label>
                  <p className="text-lg font-semibold">{result.coolingEfficiency.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Heat Exchanger */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Isı Değiştirici Hesaplamaları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Gerekli Alan</Label>
                  <p className="text-lg font-semibold">{result.heatExchangerArea.toFixed(1)} m²</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Boru Sayısı</Label>
                  <p className="text-lg font-semibold">{result.numberOfTubes}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Boru Uzunluğu</Label>
                  <p className="text-lg font-semibold">{result.tubeLength.toFixed(1)} m</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Basınç Düşümü</Label>
                  <p className="text-lg font-semibold">{result.pressureDrop.toFixed(0)} kPa</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Etkinlik</Label>
                  <p className="text-lg font-semibold">{result.effectiveness.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tank Calculations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Tank Kapasitesi Hesaplamaları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Pis Su Tankı Kapasitesi</Label>
                  <p className="text-lg font-semibold">{result.bilgeTankCapacity.toFixed(1)} m³</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sintine Tankı Kapasitesi</Label>
                  <p className="text-lg font-semibold">{result.sludgeTankCapacity.toFixed(1)} m³</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Pis Su Üretimi</Label>
                  <p className="text-lg font-semibold">{result.bilgeGenerationRate.toFixed(1)} L/gün</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sintine Üretimi</Label>
                  <p className="text-lg font-semibold">{result.sludgeGenerationRate.toFixed(1)} L/gün</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
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

          {/* Recommendations */}
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