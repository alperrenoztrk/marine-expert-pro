import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Settings, Fuel, Gauge, Activity, Zap, AlertTriangle, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface EngineData {
  // Main Engine Parameters
  mcrPower: number; // Maximum Continuous Rating (kW)
  currentLoad: number; // Current load (%)
  engineRPM: number; // Engine RPM
  fuelType: 'HFO' | 'MDO' | 'MGO' | 'LNG' | 'Methanol'; // Fuel type
  
  // Fuel Consumption
  sfocAt85: number; // SFOC at 85% load (g/kWh)
  sfocAt75: number; // SFOC at 75% load (g/kWh)
  dailyRunningHours: number; // Daily running hours
  fuelDensity: number; // Fuel density (kg/m³)
  
  // Fuel Tank Data
  fuelTankCapacity: number; // Total fuel tank capacity (m³)
  currentFuelLevel: number; // Current fuel level (%)
  bunkerRequired: number; // Additional bunker required (tonnes)
  
  // Auxiliary Engines
  auxEngineCount: number; // Number of auxiliary engines
  auxEnginePower: number; // Power per aux engine (kW)
  auxEngineLoad: number; // Average load on aux engines (%)
  auxSFOC: number; // Aux engine SFOC (g/kWh)
  
  // Cylinder Oil
  cylinderOilRate: number; // Cylinder oil feed rate (g/kWh)
  cylinderOilDensity: number; // Cylinder oil density (kg/L)
  cylinderOilTankCapacity: number; // Cylinder oil tank capacity (L)
  cylinderOilLevel: number; // Current level (%)
  
  // System Oil
  systemOilCapacity: number; // System oil capacity (L)
  systemOilLevel: number; // Current level (%)
  systemOilChangeInterval: number; // Change interval (hours)
  systemOilRunningHours: number; // Hours since last change
  
  // Fuel Changeover
  changeoverFromHFO: boolean; // Changeover from HFO
  changeoverToMDO: boolean; // Changeover to MDO
  changeoverTime: number; // Changeover time (minutes)
  pipelineVolume: number; // Pipeline volume (L)
  
  // Voyage Data
  voyageDistance: number; // Voyage distance (nm)
  averageSpeed: number; // Average speed (knots)
  seaMargin: number; // Sea margin (%)
  weatherMargin: number; // Weather margin (%)
  
  // Environmental
  fuelSulfurContent: number; // Fuel sulfur content (%)
  waterContent: number; // Water content in fuel (%)
  temperature: number; // Fuel temperature (°C)
  viscosity: number; // Fuel viscosity (cSt)
}

interface EngineResult {
  // Fuel Consumption Results
  currentSFOC: number; // Current SFOC (g/kWh)
  hourlyConsumption: number; // Hourly fuel consumption (kg/h)
  dailyConsumption: number; // Daily fuel consumption (tonnes)
  voyageConsumption: number; // Total voyage consumption (tonnes)
  
  // Fuel Efficiency
  efficiencyRating: 'excellent' | 'good' | 'fair' | 'poor';
  fuelSavingPotential: number; // Potential fuel saving (%)
  optimalLoad: number; // Optimal load for efficiency (%)
  
  // Auxiliary Engine Consumption
  auxHourlyConsumption: number; // Aux engines hourly consumption (kg/h)
  auxDailyConsumption: number; // Aux engines daily consumption (tonnes)
  totalConsumption: number; // Total daily consumption (tonnes)
  
  // Cylinder Oil Calculations
  cylinderOilHourly: number; // Hourly cylinder oil consumption (L/h)
  cylinderOilDaily: number; // Daily cylinder oil consumption (L)
  cylinderOilRemaining: number; // Remaining cylinder oil (L)
  cylinderOilDaysLeft: number; // Days of cylinder oil left
  
  // System Oil Status
  systemOilChangeRemaining: number; // Hours to next change
  systemOilStatus: 'good' | 'due_soon' | 'overdue';
  
  // Fuel Tank Status
  currentFuelWeight: number; // Current fuel weight (tonnes)
  fuelRemaining: number; // Fuel remaining (tonnes)
  daysOfFuelLeft: number; // Days of fuel remaining
  bunkerPlan: string; // Bunker planning advice
  
  // Changeover Calculations
  changeoverFuelRequired: number; // Fuel required for changeover (L)
  changeoverWasteTime: number; // Time to waste pipeline (minutes)
  changeoverTotalTime: number; // Total changeover time (minutes)
  
  // Voyage Planning
  voyageTime: number; // Total voyage time (hours)
  totalFuelRequired: number; // Total fuel required (tonnes)
  recommendedBunker: number; // Recommended bunker quantity (tonnes)
  fuelCostEstimate: number; // Estimated fuel cost ($)
  
  // Environmental Impact
  co2Emissions: number; // CO2 emissions (kg/day)
  sox_emissions: number; // SOx emissions (kg/day)
  nox_emissions: number; // NOx emissions (kg/day)
  energyEfficiency: number; // Energy efficiency index
  
  // Engine Performance
  thermalEfficiency: number; // Thermal efficiency (%)
  powerOutput: number; // Current power output (kW)
  specificPowerOutput: number; // Specific power output (kW/L)
  engineLoad_status: 'underloaded' | 'optimal' | 'overloaded';
  
  recommendations: string[];
  warnings: string[];
}

export const EngineCalculations = () => {
  const [data, setData] = useState<EngineData>({
    mcrPower: 15000, currentLoad: 75, engineRPM: 120,
    fuelType: 'HFO', sfocAt85: 185, sfocAt75: 175,
    dailyRunningHours: 24, fuelDensity: 950,
    fuelTankCapacity: 1200, currentFuelLevel: 65,
    bunkerRequired: 500, auxEngineCount: 3,
    auxEnginePower: 800, auxEngineLoad: 60, auxSFOC: 220,
    cylinderOilRate: 1.2, cylinderOilDensity: 0.95,
    cylinderOilTankCapacity: 5000, cylinderOilLevel: 70,
    systemOilCapacity: 12000, systemOilLevel: 85,
    systemOilChangeInterval: 1000, systemOilRunningHours: 750,
    changeoverFromHFO: false, changeoverToMDO: false,
    changeoverTime: 45, pipelineVolume: 800,
    voyageDistance: 3500, averageSpeed: 14.5,
    seaMargin: 15, weatherMargin: 10,
    fuelSulfurContent: 0.5, waterContent: 0.1,
    temperature: 40, viscosity: 380
  });

  const [result, setResult] = useState<EngineResult | null>(null);
  

  // SFOC calculation based on load
  const calculateSFOC = (load: number): number => {
    // Interpolate SFOC based on load curve
    if (load <= 75) {
      const ratio = load / 75;
      return data.sfocAt75 + (data.sfocAt75 * 0.1 * (1 - ratio)); // Higher SFOC at lower loads
    } else if (load <= 85) {
      const ratio = (load - 75) / 10;
      return data.sfocAt75 + (data.sfocAt85 - data.sfocAt75) * ratio;
    } else {
      // Higher loads increase SFOC exponentially
      const excess = load - 85;
      return data.sfocAt85 * (1 + 0.02 * excess);
    }
  };

  // Engine efficiency calculation
  const calculateEfficiency = (load: number): number => {
    // Typical engine efficiency curve
    const optimalLoad = 75; // Most efficient at 75% load
    const maxEfficiency = 50; // 50% thermal efficiency at optimal
    
    const deviation = Math.abs(load - optimalLoad);
    const efficiency = maxEfficiency * (1 - deviation * 0.003);
    return Math.max(efficiency, 25); // Minimum 25% efficiency
  };

  // Fuel consumption calculations
  const calculateFuelConsumption = () => {
    const currentSFOC = calculateSFOC(data.currentLoad);
    const powerOutput = (data.mcrPower * data.currentLoad) / 100;
    
    // Main engine consumption
    const hourlyConsumption = (powerOutput * currentSFOC) / 1000; // kg/h
    const dailyConsumption = (hourlyConsumption * data.dailyRunningHours) / 1000; // tonnes
    
    // Auxiliary engines consumption
    const auxPowerTotal = data.auxEngineCount * data.auxEnginePower * (data.auxEngineLoad / 100);
    const auxHourlyConsumption = (auxPowerTotal * data.auxSFOC) / 1000; // kg/h
    const auxDailyConsumption = (auxHourlyConsumption * 24) / 1000; // tonnes
    
    return {
      currentSFOC,
      hourlyConsumption,
      dailyConsumption,
      auxHourlyConsumption,
      auxDailyConsumption,
      powerOutput
    };
  };

  // Cylinder oil calculations
  const calculateCylinderOil = () => {
    const powerOutput = (data.mcrPower * data.currentLoad) / 100;
    const hourlyOilConsumption = (powerOutput * data.cylinderOilRate) / 1000 / data.cylinderOilDensity; // L/h
    const dailyOilConsumption = hourlyOilConsumption * data.dailyRunningHours;
    const currentOilVolume = (data.cylinderOilTankCapacity * data.cylinderOilLevel) / 100;
    const daysLeft = currentOilVolume / dailyOilConsumption;
    
    return {
      hourlyOilConsumption,
      dailyOilConsumption,
      currentOilVolume,
      daysLeft
    };
  };

  // Fuel changeover calculations
  const calculateChangeover = () => {
    const changeoverVolume = data.pipelineVolume; // Volume to be displaced
    const wasteTime = Math.ceil(changeoverVolume / 50); // Assuming 50 L/min displacement rate
    const totalTime = data.changeoverTime + wasteTime;
    
    return {
      fuelRequired: changeoverVolume,
      wasteTime,
      totalTime
    };
  };

  // Environmental calculations
  const calculateEmissions = (dailyConsumption: number) => {
    // Emission factors (kg/tonne fuel)
    const co2Factor = 3200; // kg CO2 per tonne fuel
    const soxFactor = data.fuelSulfurContent * 20; // SOx based on sulfur content
    const noxFactor = 57; // kg NOx per tonne fuel (typical for marine engines)
    
    return {
      co2: dailyConsumption * co2Factor,
      sox: dailyConsumption * soxFactor,
      nox: dailyConsumption * noxFactor
    };
  };

  const calculate = () => {
    try {
      const fuelCalc = calculateFuelConsumption();
      const oilCalc = calculateCylinderOil();
      const changeoverCalc = calculateChangeover();
      
      // Total consumption
      const totalDailyConsumption = fuelCalc.dailyConsumption + fuelCalc.auxDailyConsumption;
      
      // Fuel tank calculations
      const currentFuelWeight = (data.fuelTankCapacity * data.currentFuelLevel / 100) * (data.fuelDensity / 1000);
      const daysOfFuelLeft = currentFuelWeight / totalDailyConsumption;
      
      // Voyage calculations
      const voyageTime = data.voyageDistance / data.averageSpeed;
      const voyageConsumption = (totalDailyConsumption * voyageTime) / 24;
      const totalMargin = 1 + (data.seaMargin + data.weatherMargin) / 100;
      const totalFuelRequired = voyageConsumption * totalMargin;
      
      // Efficiency ratings
      const thermalEfficiency = calculateEfficiency(data.currentLoad);
      let efficiencyRating: 'excellent' | 'good' | 'fair' | 'poor';
      
      if (fuelCalc.currentSFOC <= 180) efficiencyRating = 'excellent';
      else if (fuelCalc.currentSFOC <= 200) efficiencyRating = 'good';
      else if (fuelCalc.currentSFOC <= 220) efficiencyRating = 'fair';
      else efficiencyRating = 'poor';
      
      // Engine load status
      let engineLoadStatus: 'underloaded' | 'optimal' | 'overloaded';
      if (data.currentLoad < 65) engineLoadStatus = 'underloaded';
      else if (data.currentLoad <= 85) engineLoadStatus = 'optimal';
      else engineLoadStatus = 'overloaded';
      
      // System oil status
      const oilChangeRemaining = data.systemOilChangeInterval - data.systemOilRunningHours;
      let systemOilStatus: 'good' | 'due_soon' | 'overdue';
      if (oilChangeRemaining < 0) systemOilStatus = 'overdue';
      else if (oilChangeRemaining < 100) systemOilStatus = 'due_soon';
      else systemOilStatus = 'good';
      
      // Environmental calculations
      const emissions = calculateEmissions(totalDailyConsumption);
      
      // Recommendations
      const recommendations = [];
      const warnings = [];
      
      if (data.currentLoad < 70) {
        recommendations.push("Increase engine load to improve fuel efficiency");
      }
      
      if (data.currentLoad > 90) {
        warnings.push("Engine load exceeds recommended maximum - risk of damage");
      }
      
      if (fuelCalc.currentSFOC > 200) {
        recommendations.push("Consider engine maintenance to improve fuel efficiency");
      }
      
      if (daysOfFuelLeft < 3) {
        warnings.push("Low fuel level - bunker planning required urgently");
      }
      
      if (oilCalc.daysLeft < 2) {
        warnings.push("Cylinder oil level critically low - replenish immediately");
      }
      
      if (systemOilStatus === 'overdue') {
        warnings.push("System oil change overdue - schedule maintenance");
      }
      
      if (data.fuelSulfurContent > 0.5) {
        recommendations.push("High sulfur fuel - ensure scrubber operation or switch to low sulfur");
      }

      const calculatedResult: EngineResult = {
        currentSFOC: fuelCalc.currentSFOC,
        hourlyConsumption: fuelCalc.hourlyConsumption,
        dailyConsumption: fuelCalc.dailyConsumption,
        voyageConsumption,
        efficiencyRating,
        fuelSavingPotential: Math.max(0, (fuelCalc.currentSFOC - 175) / fuelCalc.currentSFOC * 100),
        optimalLoad: 75,
        auxHourlyConsumption: fuelCalc.auxHourlyConsumption,
        auxDailyConsumption: fuelCalc.auxDailyConsumption,
        totalConsumption: totalDailyConsumption,
        cylinderOilHourly: oilCalc.hourlyOilConsumption,
        cylinderOilDaily: oilCalc.dailyOilConsumption,
        cylinderOilRemaining: oilCalc.currentOilVolume,
        cylinderOilDaysLeft: oilCalc.daysLeft,
        systemOilChangeRemaining: oilChangeRemaining,
        systemOilStatus,
        currentFuelWeight,
        fuelRemaining: currentFuelWeight,
        daysOfFuelLeft,
        bunkerPlan: daysOfFuelLeft < 5 ? "Urgent bunker required" : "Fuel sufficient for current voyage",
        changeoverFuelRequired: changeoverCalc.fuelRequired,
        changeoverWasteTime: changeoverCalc.wasteTime,
        changeoverTotalTime: changeoverCalc.totalTime,
        voyageTime,
        totalFuelRequired,
        recommendedBunker: Math.max(0, totalFuelRequired - currentFuelWeight + 100), // 100T safety margin
        fuelCostEstimate: totalFuelRequired * 600, // $600/tonne estimate
        co2Emissions: emissions.co2,
        sox_emissions: emissions.sox,
        nox_emissions: emissions.nox,
        energyEfficiency: thermalEfficiency,
        thermalEfficiency,
        powerOutput: fuelCalc.powerOutput,
        specificPowerOutput: fuelCalc.powerOutput / (data.mcrPower / 1000),
        engineLoad_status: engineLoadStatus,
        recommendations,
        warnings
      };

      setResult(calculatedResult);
      toast({
        title: "Hesaplama Tamamlandı",
        description: "Makine ve yakıt hesaplamaları başarıyla tamamlandı.",
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
            Makine ve Yakıt Hesaplamaları
          </CardTitle>
          <CardDescription>
            SFOC, günlük tüketim, silindir yağı, bunker planlaması ve emisyon hesaplamaları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="engine" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="engine">Ana Makine</TabsTrigger>
              <TabsTrigger value="fuel">Yakıt</TabsTrigger>
              <TabsTrigger value="oil">Yağlar</TabsTrigger>
              <TabsTrigger value="auxiliary">Yardımcı</TabsTrigger>
              <TabsTrigger value="voyage">Sefer</TabsTrigger>
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
                    step="1"
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
                  <Label htmlFor="dailyRunningHours">Günlük Çalışma Saati</Label>
                  <Input
                    id="dailyRunningHours"
                    type="number"
                    step="0.1"
                    value={data.dailyRunningHours}
                    onChange={(e) => updateData('dailyRunningHours', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fuel" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sfocAt85">SFOC @ 85% (g/kWh)</Label>
                  <Input
                    id="sfocAt85"
                    type="number"
                    step="0.1"
                    value={data.sfocAt85}
                    onChange={(e) => updateData('sfocAt85', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sfocAt75">SFOC @ 75% (g/kWh)</Label>
                  <Input
                    id="sfocAt75"
                    type="number"
                    step="0.1"
                    value={data.sfocAt75}
                    onChange={(e) => updateData('sfocAt75', parseFloat(e.target.value) || 0)}
                  />
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
                  <Label htmlFor="fuelTankCapacity">Yakıt Tankı Kapasitesi (m³)</Label>
                  <Input
                    id="fuelTankCapacity"
                    type="number"
                    value={data.fuelTankCapacity}
                    onChange={(e) => updateData('fuelTankCapacity', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentFuelLevel">Mevcut Yakıt Seviyesi (%)</Label>
                  <Input
                    id="currentFuelLevel"
                    type="number"
                    step="1"
                    value={data.currentFuelLevel}
                    onChange={(e) => updateData('currentFuelLevel', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelSulfurContent">Kükürt İçeriği (%)</Label>
                  <Input
                    id="fuelSulfurContent"
                    type="number"
                    step="0.1"
                    value={data.fuelSulfurContent}
                    onChange={(e) => updateData('fuelSulfurContent', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="oil" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cylinderOilRate">Silindir Yağı Oranı (g/kWh)</Label>
                  <Input
                    id="cylinderOilRate"
                    type="number"
                    step="0.1"
                    value={data.cylinderOilRate}
                    onChange={(e) => updateData('cylinderOilRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cylinderOilTankCapacity">Silindir Yağı Tank Kapasitesi (L)</Label>
                  <Input
                    id="cylinderOilTankCapacity"
                    type="number"
                    value={data.cylinderOilTankCapacity}
                    onChange={(e) => updateData('cylinderOilTankCapacity', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cylinderOilLevel">Silindir Yağı Seviyesi (%)</Label>
                  <Input
                    id="cylinderOilLevel"
                    type="number"
                    step="1"
                    value={data.cylinderOilLevel}
                    onChange={(e) => updateData('cylinderOilLevel', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemOilCapacity">Sistem Yağı Kapasitesi (L)</Label>
                  <Input
                    id="systemOilCapacity"
                    type="number"
                    value={data.systemOilCapacity}
                    onChange={(e) => updateData('systemOilCapacity', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemOilLevel">Sistem Yağı Seviyesi (%)</Label>
                  <Input
                    id="systemOilLevel"
                    type="number"
                    step="1"
                    value={data.systemOilLevel}
                    onChange={(e) => updateData('systemOilLevel', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemOilRunningHours">Çalışma Saati (Son Değişimden)</Label>
                  <Input
                    id="systemOilRunningHours"
                    type="number"
                    value={data.systemOilRunningHours}
                    onChange={(e) => updateData('systemOilRunningHours', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="auxiliary" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="auxEngineCount">Yardımcı Motor Sayısı</Label>
                  <Input
                    id="auxEngineCount"
                    type="number"
                    value={data.auxEngineCount}
                    onChange={(e) => updateData('auxEngineCount', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auxEnginePower">Motor Gücü (kW)</Label>
                  <Input
                    id="auxEnginePower"
                    type="number"
                    value={data.auxEnginePower}
                    onChange={(e) => updateData('auxEnginePower', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auxEngineLoad">Ortalama Yük (%)</Label>
                  <Input
                    id="auxEngineLoad"
                    type="number"
                    step="1"
                    value={data.auxEngineLoad}
                    onChange={(e) => updateData('auxEngineLoad', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auxSFOC">Yardımcı Motor SFOC (g/kWh)</Label>
                  <Input
                    id="auxSFOC"
                    type="number"
                    step="1"
                    value={data.auxSFOC}
                    onChange={(e) => updateData('auxSFOC', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="voyage" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="voyageDistance">Sefer Mesafesi (nm)</Label>
                  <Input
                    id="voyageDistance"
                    type="number"
                    value={data.voyageDistance}
                    onChange={(e) => updateData('voyageDistance', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="averageSpeed">Ortalama Hız (knot)</Label>
                  <Input
                    id="averageSpeed"
                    type="number"
                    step="0.1"
                    value={data.averageSpeed}
                    onChange={(e) => updateData('averageSpeed', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seaMargin">Deniz Marjı (%)</Label>
                  <Input
                    id="seaMargin"
                    type="number"
                    step="1"
                    value={data.seaMargin}
                    onChange={(e) => updateData('seaMargin', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weatherMargin">Hava Marjı (%)</Label>
                  <Input
                    id="weatherMargin"
                    type="number"
                    step="1"
                    value={data.weatherMargin}
                    onChange={(e) => updateData('weatherMargin', parseFloat(e.target.value) || 0)}
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
                <Fuel className="h-5 w-5" />
                Yakıt Tüketimi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Mevcut SFOC</Label>
                  <p className="text-2xl font-bold text-blue-600">{result.currentSFOC.toFixed(1)} g/kWh</p>
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
                  <Label className="text-sm font-medium">Verimlilik</Label>
                  <Badge variant={
                    result.efficiencyRating === 'excellent' ? 'default' :
                    result.efficiencyRating === 'good' ? 'secondary' :
                    result.efficiencyRating === 'fair' ? 'outline' : 'destructive'
                  }>
                    {result.efficiencyRating === 'excellent' ? 'Mükemmel' :
                     result.efficiencyRating === 'good' ? 'İyi' :
                     result.efficiencyRating === 'fair' ? 'Orta' : 'Kötü'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Motor Durumu</Label>
                  <Badge variant={
                    result.engineLoad_status === 'optimal' ? 'default' :
                    result.engineLoad_status === 'underloaded' ? 'secondary' : 'destructive'
                  }>
                    {result.engineLoad_status === 'optimal' ? 'Optimal' :
                     result.engineLoad_status === 'underloaded' ? 'Az Yüklü' : 'Aşırı Yüklü'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Termal Verim</Label>
                  <p className="text-lg font-semibold">{result.thermalEfficiency.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Yakıt Tank Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Mevcut Yakıt</Label>
                  <p className="text-2xl font-bold text-blue-600">{result.currentFuelWeight.toFixed(1)} ton</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Kalan Gün</Label>
                  <p className="text-2xl font-bold text-orange-600">{result.daysOfFuelLeft.toFixed(1)} gün</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sefer İçin Gerekli</Label>
                  <p className="text-lg font-semibold">{result.totalFuelRequired.toFixed(1)} ton</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Önerilen Bunker</Label>
                  <p className="text-lg font-semibold">{result.recommendedBunker.toFixed(1)} ton</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Bunker Planı</Label>
                <p className="text-sm">{result.bunkerPlan}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Yağ Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Silindir Yağı Günlük</Label>
                  <p className="text-lg font-semibold">{result.cylinderOilDaily.toFixed(1)} L/gün</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Silindir Yağı Kalan</Label>
                  <p className="text-lg font-semibold">{result.cylinderOilDaysLeft.toFixed(1)} gün</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sistem Yağı Durumu</Label>
                  <Badge variant={
                    result.systemOilStatus === 'good' ? 'default' :
                    result.systemOilStatus === 'due_soon' ? 'secondary' : 'destructive'
                  }>
                    {result.systemOilStatus === 'good' ? 'İyi' :
                     result.systemOilStatus === 'due_soon' ? 'Yakında' : 'Gecikmiş'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Değişime Kalan</Label>
                  <p className="text-lg font-semibold">{result.systemOilChangeRemaining} saat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Emisyonlar (Günlük)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">CO₂ Emisyonu</Label>
                  <p className="text-lg font-semibold">{(result.co2Emissions / 1000).toFixed(1)} ton</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">SOₓ Emisyonu</Label>
                  <p className="text-lg font-semibold">{result.sox_emissions.toFixed(1)} kg</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">NOₓ Emisyonu</Label>
                  <p className="text-lg font-semibold">{result.nox_emissions.toFixed(1)} kg</p>
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