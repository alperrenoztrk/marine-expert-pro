import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudRain, Wind, Waves, Compass, Navigation, Activity, Calculator, TrendingUp, Cloud, Eye, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MeteoOceanData {
  // Wind Parameters
  windSpeed: number; // Wind speed (knots)
  windDirection: number; // Wind direction (degrees, 0-360)
  shipHeading: number; // Ship heading (degrees, 0-360)
  shipSpeed: number; // Ship speed (knots)
  
  // Wave Parameters
  waveHeight: number; // Significant wave height (m)
  wavePeriod: number; // Wave period (seconds)
  waveDirection: number; // Wave direction (degrees, 0-360)
  
  // Current Parameters
  currentSpeed: number; // Current speed (knots)
  currentDirection: number; // Current direction (degrees, 0-360)
  currentDepth: number; // Depth where current measured (m)
  
  // Ship Parameters
  shipLength: number; // Ship length (m)
  shipBeam: number; // Ship beam (m)
  shipDraft: number; // Ship draft (m)
  shipFreeboard: number; // Ship freeboard (m)
  shipDisplacement: number; // Ship displacement (tonnes)
  
  // Environmental Parameters
  airDensity: number; // Air density (kg/m³)
  waterDensity: number; // Water density (kg/m³)
  temperature: number; // Air temperature (°C)
  barometricPressure: number; // Barometric pressure (mbar)
  
  // Additional Parameters
  leewayAngle: number; // Estimated leeway angle (degrees)
  rudderAngle: number; // Rudder angle (degrees)
}

interface MeteoOceanResult {
  // Beaufort & Douglas Scales
  beaufortScale: number; // Beaufort scale (0-12)
  beaufortDescription: string; // Description
  douglasScale: number; // Douglas sea scale (0-9)
  douglasDescription: string; // Sea state description
  seaConditions: string; // Detailed sea conditions
  
  // Wind Effects
  relativeWindSpeed: number; // Relative wind speed (knots)
  relativeWindDirection: number; // Relative wind direction (degrees)
  windForce: number; // Wind force on ship (N)
  windMoment: number; // Wind moment (Nm)
  windHeelAngle: number; // Estimated heel angle due to wind (degrees)
  
  // Current Effects
  currentDrift: number; // Current drift distance (nm/h)
  currentSetDirection: number; // Set direction (degrees)
  leewayDrift: number; // Leeway drift (nm/h)
  totalDrift: number; // Total drift (nm/h)
  driftDirection: number; // Total drift direction (degrees)
  
  // Combined Forces
  windForceX: number; // Wind force X component (N)
  windForceY: number; // Wind force Y component (N)
  currentForceX: number; // Current force X component (N)
  currentForceY: number; // Current force Y component (N)
  totalForceX: number; // Total force X component (N)
  totalForceY: number; // Total force Y component (N)
  totalForceMagnitude: number; // Total force magnitude (N)
  totalForceDirection: number; // Total force direction (degrees)
  
  // Navigation Corrections
  compassCourse: number; // Compass course to steer (degrees)
  groundTrack: number; // Actual ground track (degrees)
  speedOverGround: number; // Speed over ground (knots)
  courseError: number; // Course error due to environmental factors (degrees)
  
  // Stability & Safety
  stabilityIndex: number; // Stability index (0-100)
  safetyRecommendation: 'safe' | 'caution' | 'dangerous' | 'extreme';
  waveSlamming: boolean; // Wave slamming risk
  greenWaterRisk: boolean; // Green water over deck risk
  
  // Operational Recommendations
  recommendedSpeed: number; // Recommended speed (knots)
  recommendedHeading: number; // Recommended heading (degrees)
  alternativeRoute: string; // Alternative route recommendation
  
  warnings: string[];
  recommendations: string[];
}

export const WeatherCalculations = () => {
  const { toast } = useToast();
  const [data, setData] = useState<MeteoOceanData>({
    windSpeed: 25, windDirection: 270, shipHeading: 45, shipSpeed: 12,
    waveHeight: 3.5, wavePeriod: 8, waveDirection: 285,
    currentSpeed: 1.5, currentDirection: 180, currentDepth: 50,
    shipLength: 180, shipBeam: 25, shipDraft: 8.5, shipFreeboard: 12,
    shipDisplacement: 15000, airDensity: 1.225, waterDensity: 1025,
    temperature: 15, barometricPressure: 1013, leewayAngle: 3, rudderAngle: 0
  });

  const [result, setResult] = useState<MeteoOceanResult | null>(null);

  // Calculate Beaufort Scale from wind speed
  const calculateBeaufortScale = (windSpeed: number): { scale: number; description: string } => {
    if (windSpeed < 1) return { scale: 0, description: "Calm" };
    if (windSpeed <= 3) return { scale: 1, description: "Light air" };
    if (windSpeed <= 7) return { scale: 2, description: "Light breeze" };
    if (windSpeed <= 12) return { scale: 3, description: "Gentle breeze" };
    if (windSpeed <= 18) return { scale: 4, description: "Moderate breeze" };
    if (windSpeed <= 24) return { scale: 5, description: "Fresh breeze" };
    if (windSpeed <= 31) return { scale: 6, description: "Strong breeze" };
    if (windSpeed <= 38) return { scale: 7, description: "Near gale" };
    if (windSpeed <= 46) return { scale: 8, description: "Gale" };
    if (windSpeed <= 54) return { scale: 9, description: "Strong gale" };
    if (windSpeed <= 63) return { scale: 10, description: "Storm" };
    if (windSpeed <= 72) return { scale: 11, description: "Violent storm" };
    return { scale: 12, description: "Hurricane" };
  };

  // Calculate Douglas Sea Scale from wave height
  const calculateDouglasScale = (waveHeight: number): { scale: number; description: string; conditions: string } => {
    if (waveHeight < 0.1) return { scale: 0, description: "Calm (glassy)", conditions: "Deniz ayna gibi" };
    if (waveHeight <= 0.5) return { scale: 1, description: "Calm (rippled)", conditions: "Hafif dalgacıklar" };
    if (waveHeight <= 1.25) return { scale: 2, description: "Smooth (wavelets)", conditions: "Küçük dalgalar" };
    if (waveHeight <= 2.5) return { scale: 3, description: "Slight", conditions: "Hafif deniz" };
    if (waveHeight <= 4) return { scale: 4, description: "Moderate", conditions: "Orta deniz" };
    if (waveHeight <= 6) return { scale: 5, description: "Rough", conditions: "Kabaca deniz" };
    if (waveHeight <= 9) return { scale: 6, description: "Very rough", conditions: "Çok kabaca deniz" };
    if (waveHeight <= 14) return { scale: 7, description: "High", conditions: "Yüksek deniz" };
    if (waveHeight <= 20) return { scale: 8, description: "Very high", conditions: "Çok yüksek deniz" };
    return { scale: 9, description: "Phenomenal", conditions: "Olağanüstü deniz" };
  };

  // Calculate relative wind
  const calculateRelativeWind = (windSpeed: number, windDir: number, shipSpeed: number, shipHeading: number) => {
    // Convert to radians
    const windDirRad = (windDir * Math.PI) / 180;
    const shipHeadingRad = (shipHeading * Math.PI) / 180;
    
    // Wind vector components
    const windX = windSpeed * Math.sin(windDirRad);
    const windY = windSpeed * Math.cos(windDirRad);
    
    // Ship vector components
    const shipX = shipSpeed * Math.sin(shipHeadingRad);
    const shipY = shipSpeed * Math.cos(shipHeadingRad);
    
    // Relative wind components
    const relWindX = windX - shipX;
    const relWindY = windY - shipY;
    
    // Relative wind speed and direction
    const relWindSpeed = Math.sqrt(relWindX * relWindX + relWindY * relWindY);
    let relWindDir = Math.atan2(relWindX, relWindY) * 180 / Math.PI;
    if (relWindDir < 0) relWindDir += 360;
    
    return { speed: relWindSpeed, direction: relWindDir };
  };

  // Calculate wind force on ship
  const calculateWindForce = (windSpeed: number, shipLength: number, shipBeam: number, shipFreeboard: number) => {
    // Wind force calculation: F = 0.5 * ρ * V² * A * Cd
    const windArea = shipLength * shipFreeboard; // Lateral wind area (simplified)
    const dragCoefficient = 0.8; // Typical ship drag coefficient
    const force = 0.5 * data.airDensity * Math.pow(windSpeed * 0.514, 2) * windArea * dragCoefficient; // Convert knots to m/s
    
    // Wind moment calculation (assuming center of effort at half freeboard)
    const leverArm = shipFreeboard / 2;
    const moment = force * leverArm;
    
    return { force, moment };
  };

  // Calculate current effects
  const calculateCurrentEffects = (currentSpeed: number, currentDir: number, shipSpeed: number, shipHeading: number) => {
    // Current vector components
    const currentDirRad = (currentDir * Math.PI) / 180;
    const currentX = currentSpeed * Math.sin(currentDirRad);
    const currentY = currentSpeed * Math.cos(currentDirRad);
    
    // Ship vector components
    const shipHeadingRad = (shipHeading * Math.PI) / 180;
    const shipX = shipSpeed * Math.sin(shipHeadingRad);
    const shipY = shipSpeed * Math.cos(shipHeadingRad);
    
    // Resultant vector (ship + current)
    const resultantX = shipX + currentX;
    const resultantY = shipY + currentY;
    
    const speedOverGround = Math.sqrt(resultantX * resultantX + resultantY * resultantY);
    let groundTrack = Math.atan2(resultantX, resultantY) * 180 / Math.PI;
    if (groundTrack < 0) groundTrack += 360;
    
    // Current drift
    const driftDistance = currentSpeed; // nm/h
    
    return { speedOverGround, groundTrack, driftDistance };
  };

  // Calculate leeway
  const calculateLeeway = (windSpeed: number, windDir: number, shipHeading: number, shipSpeed: number, leewayAngle: number) => {
    // Leeway factor (depends on wind angle relative to ship)
    const relativeWindAngle = Math.abs(windDir - shipHeading);
    const adjustedRelativeAngle = relativeWindAngle > 180 ? 360 - relativeWindAngle : relativeWindAngle;
    
    // Maximum leeway at beam winds (90 degrees)
    const leewayFactor = Math.sin((adjustedRelativeAngle * Math.PI) / 180);
    const leewaySpeed = (windSpeed / 20) * leewayFactor * (leewayAngle / 5); // Simplified formula
    
    return leewaySpeed;
  };

  const calculate = () => {
    try {
      // Beaufort and Douglas scales
      const beaufort = calculateBeaufortScale(data.windSpeed);
      const douglas = calculateDouglasScale(data.waveHeight);
      
      // Relative wind calculation
      const relWind = calculateRelativeWind(data.windSpeed, data.windDirection, data.shipSpeed, data.shipHeading);
      
      // Wind force calculation
      const windForce = calculateWindForce(relWind.speed, data.shipLength, data.shipBeam, data.shipFreeboard);
      
      // Current effects
      const currentEffects = calculateCurrentEffects(data.currentSpeed, data.currentDirection, data.shipSpeed, data.shipHeading);
      
      // Leeway calculation
      const leewaySpeed = calculateLeeway(data.windSpeed, data.windDirection, data.shipHeading, data.shipSpeed, data.leewayAngle);
      
      // Wind force components
      const windAngleRad = (relWind.direction * Math.PI) / 180;
      const windForceX = windForce.force * Math.sin(windAngleRad);
      const windForceY = windForce.force * Math.cos(windAngleRad);
      
      // Current force components (simplified)
      const currentForceX = data.currentSpeed * 1000 * Math.sin((data.currentDirection * Math.PI) / 180);
      const currentForceY = data.currentSpeed * 1000 * Math.cos((data.currentDirection * Math.PI) / 180);
      
      // Total force components
      const totalForceX = windForceX + currentForceX;
      const totalForceY = windForceY + currentForceY;
      const totalForceMagnitude = Math.sqrt(totalForceX * totalForceX + totalForceY * totalForceY);
      let totalForceDirection = Math.atan2(totalForceX, totalForceY) * 180 / Math.PI;
      if (totalForceDirection < 0) totalForceDirection += 360;
      
      // Course corrections
      const courseError = Math.atan2(data.currentSpeed * Math.sin((data.currentDirection - data.shipHeading) * Math.PI / 180), 
                                   data.shipSpeed + data.currentSpeed * Math.cos((data.currentDirection - data.shipHeading) * Math.PI / 180)) * 180 / Math.PI;
      
      // Stability assessment
      const stabilityIndex = Math.max(0, 100 - (beaufort.scale * 8) - (douglas.scale * 10));
      
      let safetyRecommendation: 'safe' | 'caution' | 'dangerous' | 'extreme';
      if (beaufort.scale <= 4 && douglas.scale <= 3) safetyRecommendation = 'safe';
      else if (beaufort.scale <= 7 && douglas.scale <= 5) safetyRecommendation = 'caution';
      else if (beaufort.scale <= 10 && douglas.scale <= 7) safetyRecommendation = 'dangerous';
      else safetyRecommendation = 'extreme';
      
      // Wave slamming risk
      const waveSlamming = data.waveHeight > (data.shipLength / 20) && data.shipSpeed > 8;
      const greenWaterRisk = data.waveHeight > data.shipFreeboard * 0.8;
      
      // Recommendations
      const recommendations = [];
      const warnings = [];
      
      if (beaufort.scale >= 8) {
        warnings.push("Fırtına koşulları - hız azaltın");
        recommendations.push("Hızı %30 azaltın ve güvenli liman arayın");
      }
      
      if (douglas.scale >= 6) {
        warnings.push("Çok kabaca deniz koşulları");
        recommendations.push("Dalga yönüne göre rota ayarlayın");
      }
      
      if (waveSlamming) {
        warnings.push("Dalga çarpma riski");
        recommendations.push("Baş taraftan dalgalara dikkat edin");
      }
      
      if (greenWaterRisk) {
        warnings.push("Güverte üzerine su alma riski");
        recommendations.push("Güverte personelini uyarın");
      }
      
      if (Math.abs(courseError) > 10) {
        recommendations.push("Akıntı etkisi nedeniyle rota düzeltmesi yapın");
      }
      
      // Heel angle estimation (simplified)
      const windHeelAngle = (windForce.moment / (data.shipDisplacement * 1000 * 9.81 * data.shipBeam / 2)) * 180 / Math.PI;
      
      const calculatedResult: MeteoOceanResult = {
        beaufortScale: beaufort.scale,
        beaufortDescription: beaufort.description,
        douglasScale: douglas.scale,
        douglasDescription: douglas.description,
        seaConditions: douglas.conditions,
        relativeWindSpeed: relWind.speed,
        relativeWindDirection: relWind.direction,
        windForce: windForce.force,
        windMoment: windForce.moment,
        windHeelAngle: Math.abs(windHeelAngle),
        currentDrift: data.currentSpeed,
        currentSetDirection: data.currentDirection,
        leewayDrift: leewaySpeed,
        totalDrift: Math.sqrt(Math.pow(data.currentSpeed, 2) + Math.pow(leewaySpeed, 2)),
        driftDirection: Math.atan2(leewaySpeed * Math.sin((data.windDirection * Math.PI) / 180), 
                                  data.currentSpeed * Math.sin((data.currentDirection * Math.PI) / 180)) * 180 / Math.PI,
        windForceX,
        windForceY,
        currentForceX,
        currentForceY,
        totalForceX,
        totalForceY,
        totalForceMagnitude,
        totalForceDirection,
        compassCourse: data.shipHeading - courseError,
        groundTrack: currentEffects.groundTrack,
        speedOverGround: currentEffects.speedOverGround,
        courseError,
        stabilityIndex,
        safetyRecommendation,
        waveSlamming,
        greenWaterRisk,
        recommendedSpeed: Math.max(3, data.shipSpeed * (1 - beaufort.scale * 0.05)),
        recommendedHeading: data.shipHeading + (courseError > 0 ? -5 : 5),
        alternativeRoute: beaufort.scale >= 8 ? "Güvenli liman ara" : "Rota optimizasyonu öneriliyor",
        warnings,
        recommendations
      };

      setResult(calculatedResult);
      toast({
        title: "Hesaplama Tamamlandı",
        description: "Meteoroloji ve oşinografi hesaplamaları tamamlandı.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hesaplama sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const updateData = (field: keyof MeteoOceanData, value: number | string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            Meteoroloji ve Oşinografi Hesaplamaları
          </CardTitle>
          <CardDescription>
            Beaufort & Douglas skalaları, rüzgar/akıntı etkileri ve gemi üzerine etki eden kuvvetler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wind" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="wind">Rüzgar</TabsTrigger>
              <TabsTrigger value="waves">Dalgalar</TabsTrigger>
              <TabsTrigger value="current">Akıntı</TabsTrigger>
              <TabsTrigger value="ship">Gemi</TabsTrigger>
              <TabsTrigger value="environment">Çevre</TabsTrigger>
              <TabsTrigger value="clouds">Bulutlar</TabsTrigger>
            </TabsList>

            <TabsContent value="wind" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="windSpeed">Rüzgar Hızı (knot)</Label>
                  <Input
                    id="windSpeed"
                    type="number"
                    value={data.windSpeed}
                    onChange={(e) => updateData('windSpeed', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windDirection">Rüzgar Yönü (°)</Label>
                  <Input
                    id="windDirection"
                    type="number"
                    min="0"
                    max="360"
                    value={data.windDirection}
                    onChange={(e) => updateData('windDirection', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipHeading">Gemi Başı (°)</Label>
                  <Input
                    id="shipHeading"
                    type="number"
                    min="0"
                    max="360"
                    value={data.shipHeading}
                    onChange={(e) => updateData('shipHeading', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipSpeed">Gemi Hızı (knot)</Label>
                  <Input
                    id="shipSpeed"
                    type="number"
                    value={data.shipSpeed}
                    onChange={(e) => updateData('shipSpeed', parseFloat(e.target.value) || 0)}
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
                    onChange={(e) => updateData('waveHeight', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wavePeriod">Dalga Periyodu (saniye)</Label>
                  <Input
                    id="wavePeriod"
                    type="number"
                    value={data.wavePeriod}
                    onChange={(e) => updateData('wavePeriod', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waveDirection">Dalga Yönü (°)</Label>
                  <Input
                    id="waveDirection"
                    type="number"
                    min="0"
                    max="360"
                    value={data.waveDirection}
                    onChange={(e) => updateData('waveDirection', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="current" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentSpeed">Akıntı Hızı (knot)</Label>
                  <Input
                    id="currentSpeed"
                    type="number"
                    step="0.1"
                    value={data.currentSpeed}
                    onChange={(e) => updateData('currentSpeed', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentDirection">Akıntı Yönü (°)</Label>
                  <Input
                    id="currentDirection"
                    type="number"
                    min="0"
                    max="360"
                    value={data.currentDirection}
                    onChange={(e) => updateData('currentDirection', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentDepth">Ölçüm Derinliği (m)</Label>
                  <Input
                    id="currentDepth"
                    type="number"
                    value={data.currentDepth}
                    onChange={(e) => updateData('currentDepth', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leewayAngle">Sürüklenme Açısı (°)</Label>
                  <Input
                    id="leewayAngle"
                    type="number"
                    step="0.1"
                    value={data.leewayAngle}
                    onChange={(e) => updateData('leewayAngle', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ship" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipLength">Gemi Boyu (m)</Label>
                  <Input
                    id="shipLength"
                    type="number"
                    value={data.shipLength}
                    onChange={(e) => updateData('shipLength', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipBeam">Gemi Genişliği (m)</Label>
                  <Input
                    id="shipBeam"
                    type="number"
                    value={data.shipBeam}
                    onChange={(e) => updateData('shipBeam', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipDraft">Gemi Drafı (m)</Label>
                  <Input
                    id="shipDraft"
                    type="number"
                    step="0.1"
                    value={data.shipDraft}
                    onChange={(e) => updateData('shipDraft', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipFreeboard">Serbest Borda (m)</Label>
                  <Input
                    id="shipFreeboard"
                    type="number"
                    step="0.1"
                    value={data.shipFreeboard}
                    onChange={(e) => updateData('shipFreeboard', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipDisplacement">Deplasman (ton)</Label>
                  <Input
                    id="shipDisplacement"
                    type="number"
                    value={data.shipDisplacement}
                    onChange={(e) => updateData('shipDisplacement', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="environment" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="airDensity">Hava Yoğunluğu (kg/m³)</Label>
                  <Input
                    id="airDensity"
                    type="number"
                    step="0.001"
                    value={data.airDensity}
                    onChange={(e) => updateData('airDensity', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterDensity">Su Yoğunluğu (kg/m³)</Label>
                  <Input
                    id="waterDensity"
                    type="number"
                    value={data.waterDensity}
                    onChange={(e) => updateData('waterDensity', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Hava Sıcaklığı (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={data.temperature}
                    onChange={(e) => updateData('temperature', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barometricPressure">Basınç (mbar)</Label>
                  <Input
                    id="barometricPressure"
                    type="number"
                    value={data.barometricPressure}
                    onChange={(e) => updateData('barometricPressure', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clouds" className="space-y-6">
              {/* Cloud Classification Guide */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Bulut Sınıflandırması ve CH Kodları</h3>
                <p className="text-gray-600">Denizciler için bulut tipleri, irtifaları ve önemi</p>
              </div>

              {/* Low Clouds (0-2000m) */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Cloud className="h-5 w-5" />
                    Alçak Bulutlar (0-2000m) - CH 0-3
                  </CardTitle>
                  <CardDescription>
                    Deniz seviyesine yakın, görüş mesafesini etkileyen bulutlar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                                                              {/* Cumulus - CH 1 */}
                     <div className="space-y-3">
                       <div className="flex items-center gap-2">
                         <Badge variant="secondary" className="bg-blue-100 text-blue-800">CH 1</Badge>
                         <h4 className="font-semibold">Cumulus (Cu)</h4>
                       </div>
                       <div className="h-32 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                         <div className="text-center">
                           <div className="text-4xl mb-2">☁️</div>
                           <div className="text-xs text-gray-600">Pamuk benzeri bulutlar</div>
                         </div>
                       </div>
                       <div className="text-sm space-y-1">
                         <p><strong>Denizcilik Önemi:</strong> Güzel hava, düşük rüzgar</p>
                         <p><strong>Görüş:</strong> İyi (10+ nm)</p>
                         <p><strong>Rüzgar:</strong> Hafif-orta (5-15 knot)</p>
                         <p><strong>Yağış:</strong> Yok/çok az</p>
                       </div>
                     </div>

                    {/* Cumulonimbus - CH 3 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="bg-red-100 text-red-800">CH 3</Badge>
                        <h4 className="font-semibold">Cumulonimbus (Cb)</h4>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Cumulonimbus_cloud.jpg/300px-Cumulonimbus_cloud.jpg" 
                         alt="Cumulonimbus - Anvil top thunderstorm"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> ⚠️ Fırtına, şimşek tehlikesi</p>
                        <p><strong>Görüş:</strong> Çok kötü (&lt;1 nm)</p>
                        <p><strong>Rüzgar:</strong> Çok güçlü (35+ knot)</p>
                        <p><strong>Yağış:</strong> Şiddetli yağmur/dolu</p>
                      </div>
                    </div>

                    {/* Stratocumulus - CH 2 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-400 text-gray-700">CH 2</Badge>
                        <h4 className="font-semibold">Stratocumulus (Sc)</h4>
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Stratocumulus_undulatus_asperatus.jpg/300px-Stratocumulus_undulatus_asperatus.jpg" 
                         alt="Stratocumulus - Low layered clouds"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> Değişken hava koşulları</p>
                        <p><strong>Görüş:</strong> Orta (3-8 nm)</p>
                        <p><strong>Rüzgar:</strong> Orta (10-20 knot)</p>
                        <p><strong>Yağış:</strong> Hafif yağmur</p>
                      </div>
                    </div>

                    {/* Stratus - CH 0 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-500 text-gray-600">CH 0</Badge>
                        <h4 className="font-semibold">Stratus (St)</h4>
                        <Eye className="h-4 w-4 text-gray-600" />
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Stratus_clouds_over_Copenhagen.jpg/300px-Stratus_clouds_over_Copenhagen.jpg" 
                         alt="Stratus - Low fog and mist"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> ⚠️ Sis, görüş problemi</p>
                        <p><strong>Görüş:</strong> Çok kötü (&lt;0.5 nm)</p>
                        <p><strong>Rüzgar:</strong> Hafif (0-10 knot)</p>
                        <p><strong>Yağış:</strong> Çisenti/hafif yağmur</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medium Clouds (2000-6000m) */}
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Cloud className="h-5 w-5" />
                    Orta Bulutlar (2000-6000m) - CH 4-5
                  </CardTitle>
                  <CardDescription>
                    Orta irtifada, hava değişikliklerinin habercisi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Altocumulus - CH 4 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">CH 4</Badge>
                        <h4 className="font-semibold">Altocumulus (Ac)</h4>
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Altocumulus_clouds.jpg/300px-Altocumulus_clouds.jpg" 
                         alt="Altocumulus - Mid-level patchy clouds"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> Hava değişikliği yaklaşıyor</p>
                        <p><strong>Görüş:</strong> İyi (8-15 nm)</p>
                        <p><strong>Rüzgar:</strong> Orta (10-25 knot)</p>
                        <p><strong>Yağış:</strong> 24 saat içinde yağış olası</p>
                      </div>
                    </div>

                    {/* Altostratus - CH 5 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-green-500 text-green-700">CH 5</Badge>
                        <h4 className="font-semibold">Altostratus (As)</h4>
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Altostratus_clouds.jpg/300px-Altostratus_clouds.jpg" 
                         alt="Altostratus - Gray mid-level layer"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> Sistematik yağış yaklaşıyor</p>
                        <p><strong>Görüş:</strong> Orta (5-10 nm)</p>
                        <p><strong>Rüzgar:</strong> Güçlü (15-30 knot)</p>
                        <p><strong>Yağış:</strong> 12-24 saat içinde kesin</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* High Clouds (6000-12000m) */}
              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Cloud className="h-5 w-5" />
                    Yüksek Bulutlar (6000-12000m) - CH 6-9
                  </CardTitle>
                  <CardDescription>
                    Yüksek irtifada, uzak hava sistemlerinin habercisi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Cirrus - CH 8 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">CH 8</Badge>
                        <h4 className="font-semibold">Cirrus (Ci)</h4>
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Cirrus_clouds2.jpg/300px-Cirrus_clouds2.jpg" 
                         alt="Cirrus - High wispy ice clouds"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> 48-72 saat sonra hava bozulması</p>
                        <p><strong>Görüş:</strong> Mükemmel (15+ nm)</p>
                        <p><strong>Rüzgar:</strong> Hafif (5-15 knot)</p>
                        <p><strong>Yağış:</strong> Yok, ama yaklaşıyor</p>
                      </div>
                    </div>

                    {/* Cirrocumulus - CH 9 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-purple-500 text-purple-700">CH 9</Badge>
                        <h4 className="font-semibold">Cirrocumulus (Cc)</h4>
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Cirrocumulus_clouds.jpg/300px-Cirrocumulus_clouds.jpg" 
                         alt="Cirrocumulus - Mackerel sky pattern"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> "Balık pulu" - hava değişimi</p>
                        <p><strong>Görüş:</strong> İyi (10-20 nm)</p>
                        <p><strong>Rüzgar:</strong> Artan (15-25 knot)</p>
                        <p><strong>Yağış:</strong> 24-48 saat içinde</p>
                      </div>
                    </div>

                    {/* Cirrostratus - CH 6-7 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-purple-600 text-purple-800">CH 6-7</Badge>
                        <h4 className="font-semibold">Cirrostratus (Cs)</h4>
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/22_degree_halo_and_sun_dog.jpg/300px-22_degree_halo_and_sun_dog.jpg" 
                         alt="Cirrostratus - Sun halo formation"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> Güneş/ay halesi - fırtına yaklaşıyor</p>
                        <p><strong>Görüş:</strong> İyi ama azalan (8-15 nm)</p>
                        <p><strong>Rüzgar:</strong> Güçlenir (20-35 knot)</p>
                        <p><strong>Yağış:</strong> 12-36 saat içinde kesin</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Clouds */}
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    Özel Durum Bulutları - Diğer CH Kodları
                  </CardTitle>
                  <CardDescription>
                    Denizciler için özel önem taşıyan bulut formasyonları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Mammatus */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="bg-red-100 text-red-800">Özel</Badge>
                        <h4 className="font-semibold">Mammatus</h4>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Mammatus_clouds_over_Nebraska.jpg/300px-Mammatus_clouds_over_Nebraska.jpg" 
                         alt="Mammatus - Pouch-like cloud formations"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> ⚠️ Şiddetli türbülans</p>
                        <p><strong>Görüş:</strong> Değişken (1-5 nm)</p>
                        <p><strong>Rüzgar:</strong> Çok değişken (0-50 knot)</p>
                        <p><strong>Tehlike:</strong> Ani rüzgar değişimi</p>
                      </div>
                    </div>

                    {/* Wall Cloud */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="bg-red-200 text-red-900">Özel</Badge>
                        <h4 className="font-semibold">Wall Cloud (Duvar Bulutu)</h4>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Wall_cloud_at_Erick_Oklahoma.jpg/300px-Wall_cloud_at_Erick_Oklahoma.jpg" 
                         alt="Wall Cloud - Tornado precursor formation"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> ⚠️ Tornado/waterspout tehlikesi</p>
                        <p><strong>Görüş:</strong> Çok kötü (&lt;1 nm)</p>
                        <p><strong>Rüzgar:</strong> Döner, şiddetli (40+ knot)</p>
                        <p><strong>Tehlike:</strong> Su hortumu olasılığı</p>
                      </div>
                    </div>

                    {/* Shelf Cloud */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">Özel</Badge>
                        <h4 className="font-semibold">Shelf Cloud (Raf Bulutu)</h4>
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Shelf_cloud.jpg/300px-Shelf_cloud.jpg" 
                         alt="Shelf Cloud - Squall line leading edge"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> Squall line yaklaşıyor</p>
                        <p><strong>Görüş:</strong> Hızla azalan (5→&lt;1 nm)</p>
                        <p><strong>Rüzgar:</strong> Ani artış (15→40 knot)</p>
                        <p><strong>Yağış:</strong> Aniden başlar, şiddetli</p>
                      </div>
                    </div>

                    {/* Lenticular */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-blue-500 text-blue-700">Özel</Badge>
                        <h4 className="font-semibold">Lenticular (Mercek)</h4>
                      </div>
                                             <img 
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Lenticular_cloud.jpg/300px-Lenticular_cloud.jpg" 
                         alt="Lenticular - Mountain wave clouds"
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <div className="text-sm space-y-1">
                        <p><strong>Denizcilik Önemi:</strong> Güçlü rüzgar dalgaları</p>
                        <p><strong>Görüş:</strong> İyi (10+ nm)</p>
                        <p><strong>Rüzgar:</strong> Çok güçlü üst rüzgarlar</p>
                        <p><strong>Not:</strong> Dağlık kıyılarda dikkat</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CH Code Reference */}
              <Card className="border-indigo-200 bg-indigo-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-800">
                    <Navigation className="h-5 w-5" />
                    CH Kod Referansı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2">Alçak Bulutlar (CL)</h5>
                      <ul className="space-y-1">
                        <li>CH 0: Stratus nebulosis</li>
                        <li>CH 1: Cumulus humilis</li>
                        <li>CH 2: Stratocumulus</li>
                        <li>CH 3: Cumulonimbus</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Orta Bulutlar (CM)</h5>
                      <ul className="space-y-1">
                        <li>CH 4: Altocumulus</li>
                        <li>CH 5: Altostratus</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Yüksek Bulutlar (CH)</h5>
                      <ul className="space-y-1">
                        <li>CH 6: Cirrus fibratus</li>
                        <li>CH 7: Cirrus spissatus</li>
                        <li>CH 8: Cirrocumulus</li>
                        <li>CH 9: Cirrostratus</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button onClick={calculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Meteoroloji & Oşinografi Hesapla
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Beaufort & Douglas Scales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Beaufort & Douglas Skalaları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Beaufort Ölçeği</Label>
                  <p className="text-2xl font-bold text-blue-600">{result.beaufortScale}</p>
                  <p className="text-sm text-muted-foreground">{result.beaufortDescription}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Douglas Deniz Ölçeği</Label>
                  <p className="text-2xl font-bold text-green-600">{result.douglasScale}</p>
                  <p className="text-sm text-muted-foreground">{result.douglasDescription}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Deniz Durumu</Label>
                  <p className="text-sm">{result.seaConditions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wind Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Rüzgar Etkileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Bağıl Rüzgar Hızı</Label>
                  <p className="text-lg font-semibold">{result.relativeWindSpeed.toFixed(1)} knot</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Bağıl Rüzgar Yönü</Label>
                  <p className="text-lg font-semibold">{result.relativeWindDirection.toFixed(0)}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rüzgar Kuvveti</Label>
                  <p className="text-lg font-semibold">{(result.windForce/1000).toFixed(1)} kN</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rüzgar Momenti</Label>
                  <p className="text-lg font-semibold">{(result.windMoment/1000).toFixed(0)} kNm</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Yatış Açısı</Label>
                  <p className="text-lg font-semibold">{result.windHeelAngle.toFixed(1)}°</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current & Drift Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Akıntı ve Sürüklenme Etkileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Akıntı Sürüklenmesi</Label>
                  <p className="text-lg font-semibold">{result.currentDrift.toFixed(2)} nm/h</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rüzgar Sürüklenmesi</Label>
                  <p className="text-lg font-semibold">{result.leewayDrift.toFixed(2)} nm/h</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Toplam Sürüklenme</Label>
                  <p className="text-lg font-semibold">{result.totalDrift.toFixed(2)} nm/h</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Yer Üstü Hız</Label>
                  <p className="text-lg font-semibold">{result.speedOverGround.toFixed(1)} knot</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Gerçek İz</Label>
                  <p className="text-lg font-semibold">{result.groundTrack.toFixed(0)}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rota Hatası</Label>
                  <p className="text-lg font-semibold">{result.courseError.toFixed(1)}°</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Force Composition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Kuvvet Bileşimi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Toplam Kuvvet</Label>
                  <p className="text-lg font-semibold">{(result.totalForceMagnitude/1000).toFixed(1)} kN</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Kuvvet Yönü</Label>
                  <p className="text-lg font-semibold">{result.totalForceDirection.toFixed(0)}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stabilite İndeksi</Label>
                  <p className="text-lg font-semibold">{result.stabilityIndex.toFixed(0)}/100</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rüzgar Kuvveti X</Label>
                  <p className="text-sm">{(result.windForceX/1000).toFixed(1)} kN</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rüzgar Kuvveti Y</Label>
                  <p className="text-sm">{(result.windForceY/1000).toFixed(1)} kN</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Güvenlik Durumu</Label>
                  <Badge variant={result.safetyRecommendation === 'safe' ? 'default' : 
                                 result.safetyRecommendation === 'caution' ? 'secondary' :
                                 result.safetyRecommendation === 'dangerous' ? 'destructive' : 'destructive'}>
                    {result.safetyRecommendation === 'safe' ? 'Güvenli' :
                     result.safetyRecommendation === 'caution' ? 'Dikkatli' :
                     result.safetyRecommendation === 'dangerous' ? 'Tehlikeli' : 'Çok Tehlikeli'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Corrections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5" />
                Seyir Düzeltmeleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Pusula Rotası</Label>
                  <p className="text-lg font-semibold">{result.compassCourse.toFixed(0)}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Önerilen Hız</Label>
                  <p className="text-lg font-semibold">{result.recommendedSpeed.toFixed(1)} knot</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Önerilen Baş</Label>
                  <p className="text-lg font-semibold">{result.recommendedHeading.toFixed(0)}°</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Alternatif Rota</Label>
                <p className="text-sm">{result.alternativeRoute}</p>
              </div>
            </CardContent>
          </Card>

          {/* Safety Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Güvenlik Göstergeleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Dalga Çarpma Riski</Label>
                  <Badge variant={result.waveSlamming ? 'destructive' : 'default'}>
                    {result.waveSlamming ? 'Yüksek Risk' : 'Düşük Risk'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Güverte Su Alma</Label>
                  <Badge variant={result.greenWaterRisk ? 'destructive' : 'default'}>
                    {result.greenWaterRisk ? 'Risk Var' : 'Risk Yok'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-red-500" />
                  Uyarılar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Wind className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
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
                  <Navigation className="h-5 w-5 text-green-500" />
                  Öneriler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Navigation className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
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