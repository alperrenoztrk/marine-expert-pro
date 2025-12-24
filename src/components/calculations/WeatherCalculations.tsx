import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cloud, Compass, Wind, Droplets, Sun, Thermometer, Eye, Info, CloudRain, AlertTriangle, Navigation, Calculator, Waves, Activity, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CloudCard } from "@/components/ui/cloud-card";
import { cloudTypes, cloudTypesByLevel } from "@/components/calculations/cloud-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";

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

export const WeatherCalculations = ({ initialTab }: { initialTab?: string } = {}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("wind");
  const { data: wx, requestOnce, loading: wxLoading } = useCurrentWeather({ watchPosition: false, reverseGeocode: false });
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

  const populateFromWeather = async () => {
    const res = await requestOnce();
    const w = res || wx;
    if (!w) {
      toast({ title: "Anlık hava alınamadı", description: "Konum izni veya ağ bağlantısını kontrol edin.", variant: "destructive" });
      return;
    }
    updateData('windSpeed', Math.round((w.windSpeedKt ?? 0) * 10) / 10);
    updateData('windDirection', Math.round(w.windDirectionDeg ?? 0));
    updateData('temperature', Math.round((w.temperatureC ?? 0) * 10) / 10);
    updateData('barometricPressure', Math.round(w.pressureHpa ?? 0));
    toast({ title: "Anlık veriler uygulandı", description: "Rüzgar, sıcaklık ve basınç güncellendi." });
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
          <div className="mt-2">
            <Button size="sm" variant="outline" onClick={populateFromWeather} disabled={wxLoading}>
              {wxLoading ? 'Alınıyor…' : 'Anlık havayı kullan'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={initialTab || "wind"} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="wind">Rüzgar</TabsTrigger>
              <TabsTrigger value="waves">Dalgalar</TabsTrigger>
              <TabsTrigger value="current">Akıntı</TabsTrigger>
              <TabsTrigger value="ship">Gemi</TabsTrigger>
              <TabsTrigger value="environment">Çevre</TabsTrigger>
              <TabsTrigger value="clouds">Bulutlar</TabsTrigger>
            </TabsList>

            {activeTab !== "clouds" && (
              <>
                <TabsContent value="wind" className="space-y-4">
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
                      <Label htmlFor="windDirection">Rüzgar Yönü (°)</Label>
                      <Input
                        id="windDirection"
                        type="number"
                        min="0"
                        max="360"
                        value={data.windDirection}
                        onChange={(e) => updateData('windDirection', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
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
                        onChange={(e) => updateData('shipHeading', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipSpeed">Gemi Hızı (knot)</Label>
                      <Input
                        id="shipSpeed"
                        type="number"
                        value={data.shipSpeed}
                        onChange={(e) => updateData('shipSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
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
                      <Label htmlFor="wavePeriod">Dalga Periyodu (saniye)</Label>
                      <Input
                        id="wavePeriod"
                        type="number"
                        value={data.wavePeriod}
                        onChange={(e) => updateData('wavePeriod', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
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
                        onChange={(e) => updateData('waveDirection', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
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
                        onChange={(e) => updateData('currentSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
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
                        onChange={(e) => updateData('currentDirection', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentDepth">Ölçüm Derinliği (m)</Label>
                      <Input
                        id="currentDepth"
                        type="number"
                        value={data.currentDepth}
                        onChange={(e) => updateData('currentDepth', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
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
                        onChange={(e) => updateData('shipLength', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipBeam">Gemi Genişliği (m)</Label>
                      <Input
                        id="shipBeam"
                        type="number"
                        value={data.shipBeam}
                        onChange={(e) => updateData('shipBeam', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipDraft">Gemi Su Çekimi (m)</Label>
                      <Input
                        id="shipDraft"
                        type="number"
                        step="0.1"
                        value={data.shipDraft}
                        onChange={(e) => updateData('shipDraft', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipFreeboard">Gemi Freeboard (m)</Label>
                      <Input
                        id="shipFreeboard"
                        type="number"
                        step="0.1"
                        value={data.shipFreeboard}
                        onChange={(e) => updateData('shipFreeboard', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipDisplacement">Gemi Deplasmanı (ton)</Label>
                      <Input
                        id="shipDisplacement"
                        type="number"
                        value={data.shipDisplacement}
                        onChange={(e) => updateData('shipDisplacement', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
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
                        step="0.1"
                        value={data.airDensity}
                        onChange={(e) => updateData('airDensity', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="waterDensity">Su Yoğunluğu (kg/m³)</Label>
                      <Input
                        id="waterDensity"
                        type="number"
                        step="0.1"
                        value={data.waterDensity}
                        onChange={(e) => updateData('waterDensity', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Hava Sıcaklığı (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        value={data.temperature}
                        onChange={(e) => updateData('temperature', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barometricPressure">Barometrik Basınç (mbar)</Label>
                      <Input
                        id="barometricPressure"
                        type="number"
                        value={data.barometricPressure}
                        onChange={(e) => updateData('barometricPressure', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leewayAngle">Leeway Açısı (°)</Label>
                      <Input
                        id="leewayAngle"
                        type="number"
                        step="0.1"
                        value={data.leewayAngle}
                        onChange={(e) => updateData('leewayAngle', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rudderAngle">Dümen Açısı (°)</Label>
                      <Input
                        id="rudderAngle"
                        type="number"
                        value={data.rudderAngle}
                        onChange={(e) => updateData('rudderAngle', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </TabsContent>
              </>
            )}

            <TabsContent value="clouds" className="space-y-6">

              {/* Uydu Kanalları Bilgilendirme */}
              <Alert className="border-2 border-purple-300 dark:border-purple-600 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 from-cyan-900/30 via-purple-900/30 to-blue-900/30">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600 dark:bg-purple-500 bg-cyan-500 rounded-full p-2 mt-1">
                    <Info className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="font-bold text-purple-900 dark:text-purple-100 text-cyan-300 flex items-center gap-2">
                      🛰️ Meteorolojik Uydu Kanalları (CH Kodları)
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-200 text-cyan-400">
                      Her bulut kartında gösterilen <span className="font-semibold">CH kodları</span>, EUMETSAT MSG uydu sisteminin 
                      spektral bantlarıdır. Bu kanallar farklı dalga boylarında atmosferi gözlemleyerek bulut tiplerinin 
                      tespitini sağlar.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mt-2">
                      <div className="bg-white/50 dark:bg-gray-800/50 bg-slate-800/50 rounded p-2">
                        <span className="font-semibold text-purple-700 dark:text-purple-300 text-cyan-400">📡 VIS (Görünür):</span> Ch1, Ch2, Ch12 - Gündüz görüntüleme
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 bg-slate-800/50 rounded p-2">
                        <span className="font-semibold text-purple-700 dark:text-purple-300 text-cyan-400">🌡️ IR (Kızılötesi):</span> Ch4, Ch7, Ch9, Ch10, Ch11 - Gece/gündüz
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 bg-slate-800/50 rounded p-2">
                        <span className="font-semibold text-purple-700 dark:text-purple-300 text-cyan-400">💧 WV (Su Buharı):</span> Ch5, Ch6 - Atmosferik nem
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 bg-slate-800/50 rounded p-2">
                        <span className="font-semibold text-purple-700 dark:text-purple-300 text-cyan-400">🎯 MGM Kodları:</span> CL (Alçak), CM (Orta), CH (Yüksek)
                      </div>
                    </div>
                  </div>
                </div>
              </Alert>

              <Separator />

              {/* Tehlikeli Bulutlar */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-red-700 flex items-center gap-2 text-cyan-400">
                  <AlertTriangle className="h-5 w-5" />
                  Yüksek Riskli Bulutlar
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cloudTypes.filter(c => c.danger === 'high').map(cloud => (
                    <CloudCard key={cloud.id} cloud={cloud} />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Alçak Bulutlar */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-700 flex items-center gap-2 text-cyan-400">
                  <Cloud className="h-5 w-5" />
                  Alçak Bulutlar (0-2 km)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cloudTypesByLevel.low.filter(c => c.danger !== 'high').map(cloud => (
                    <CloudCard key={cloud.id} cloud={cloud} />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Orta Bulutlar */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-green-700 flex items-center gap-2 text-cyan-400">
                  <Cloud className="h-5 w-5" />
                  Orta Bulutlar (2-7 km)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cloudTypesByLevel.middle.filter(c => c.danger !== 'high').map(cloud => (
                    <CloudCard key={cloud.id} cloud={cloud} />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Yüksek Bulutlar */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-purple-700 flex items-center gap-2 text-cyan-400">
                  <Cloud className="h-5 w-5" />
                  Yüksek Bulutlar (5-13 km)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cloudTypesByLevel.high.map(cloud => (
                    <CloudCard key={cloud.id} cloud={cloud} />
                  ))}
                </div>
              </div>


            </TabsContent>
          </Tabs>

          {activeTab !== "clouds" && (
            <div className="mt-6">
              <Button onClick={calculate} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                Meteoroloji & Oşinografi Hesapla
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {result && activeTab !== "clouds" && (
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
                  <p className="text-2xl font-bold text-info">{result.beaufortScale}</p>
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