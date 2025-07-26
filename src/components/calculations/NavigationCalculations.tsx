import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Compass, MapPin, Clock, Wind, Waves, Sun, Moon, Navigation, Target, Radar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NavigationData {
  // Position coordinates
  lat1: number; // Departure latitude (degrees)
  lon1: number; // Departure longitude (degrees)
  lat2: number; // Arrival latitude (degrees)
  lon2: number; // Arrival longitude (degrees)
  
  // Ship data
  speed: number; // Ship speed (knots)
  course: number; // Course (degrees)
  
  // Current and wind
  currentSet: number; // Current direction (degrees)
  currentDrift: number; // Current speed (knots)
  windDirection: number; // Wind direction (degrees)
  windSpeed: number; // Wind speed (knots)
  leewayAngle: number; // Leeway angle (degrees)
  
  // Compass data
  variation: number; // Magnetic variation (degrees)
  deviation: number; // Compass deviation (degrees)
  gyroError: number; // Gyro error (degrees)
  
  // Radar/ARPA data
  targetBearing: number; // Target bearing (degrees)
  targetDistance: number; // Target distance (nm)
  targetSpeed: number; // Target speed (knots)
  targetCourse: number; // Target course (degrees)
  
  // Tidal data
  highWaterTime: string; // HW time (HHMM)
  lowWaterTime: string; // LW time (HHMM)
  highWaterHeight: number; // HW height (m)
  lowWaterHeight: number; // LW height (m)
  currentTime: string; // Current time (HHMM)
  
  // Celestial navigation
  altitude: number; // Sextant altitude (degrees)
  azimuth: number; // Celestial body azimuth (degrees)
  gha: number; // Greenwich Hour Angle (degrees)
  declination: number; // Declination (degrees)
  
  // Turn data
  rudderAngle: number; // Rudder angle (degrees)
  shipLength: number; // Ship length (m)
  shipSpeed: number; // Ship speed (m/s)
}

interface NavigationResult {
  // Great Circle results
  gcDistance: number; // Great circle distance (nm)
  gcInitialBearing: number; // Initial bearing (degrees)
  gcFinalBearing: number; // Final bearing (degrees)
  gcVertexLat: number; // Vertex latitude (degrees)
  
  // Rhumb Line results
  rhumbDistance: number; // Rhumb line distance (nm)
  rhumbBearing: number; // Rhumb line bearing (degrees)
  departure: number; // Departure (nm)
  dLat: number; // Difference in latitude (nm)
  
  // Time and ETA
  eta: string; // Estimated time of arrival
  etd: string; // Estimated time of departure
  timeToGo: number; // Time to destination (hours)
  fuelConsumption: number; // Estimated fuel consumption
  
  // Current triangle
  groundTrack: number; // Ground track (degrees)
  groundSpeed: number; // Speed over ground (knots)
  driftAngle: number; // Drift angle (degrees)
  courseToSteer: number; // Course to steer (degrees)
  
  // Compass calculations
  magneticBearing: number; // Magnetic bearing
  compassBearing: number; // Compass bearing
  trueBearing: number; // True bearing
  compassError: number; // Total compass error
  
  // ARPA calculations
  cpa: number; // Closest point of approach (nm)
  tcpa: number; // Time to CPA (minutes)
  relativeSpeed: number; // Relative speed (knots)
  relativeBearing: number; // Relative bearing (degrees)
  collisionRisk: 'high' | 'medium' | 'low' | 'none';
  recommendedAction: string;
  
  // Tidal calculations
  currentTideHeight: number; // Current tide height (m)
  tideRange: number; // Tide range (m)
  timeToHW: number; // Time to high water (hours)
  timeToLW: number; // Time to low water (hours)
  tidalStream: number; // Tidal stream rate (knots)
  
  // Celestial results
  intercept: number; // Intercept (nm)
  positionLine: string; // Position line description
  latitude: number; // Calculated latitude
  longitude: number; // Calculated longitude
  
  // Turn circle
  advance: number; // Advance distance (m)
  transfer: number; // Transfer distance (m)
  tacticalDiameter: number; // Tactical diameter (m)
  finalDiameter: number; // Final diameter (m)
  wheelOverPoint: number; // Wheel over point (nm)
  
  // Weather routing
  optimumRoute: string; // Optimum route recommendation
  weatherDelay: number; // Weather delay (hours)
  safeCourse: number; // Safe course in heavy weather
  
  recommendations: string[];
}

export const NavigationCalculations = () => {
  const [data, setData] = useState<NavigationData>({
    lat1: 0, lon1: 0, lat2: 0, lon2: 0,
    speed: 12, course: 0,
    currentSet: 0, currentDrift: 0,
    windDirection: 0, windSpeed: 0, leewayAngle: 2,
    variation: 0, deviation: 0, gyroError: 0,
    targetBearing: 0, targetDistance: 0, targetSpeed: 0, targetCourse: 0,
    highWaterTime: "1200", lowWaterTime: "0600",
    highWaterHeight: 4.5, lowWaterHeight: 0.5,
    currentTime: "0900",
    altitude: 0, azimuth: 0, gha: 0, declination: 0,
    rudderAngle: 15, shipLength: 150, shipSpeed: 6
  });

  const [result, setResult] = useState<NavigationResult | null>(null);
  const { toast } = useToast();

  // Utility functions for calculations
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const toDegrees = (radians: number) => radians * 180 / Math.PI;
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

  // Great Circle calculations
  const calculateGreatCircle = () => {
    const lat1Rad = toRadians(data.lat1);
    const lon1Rad = toRadians(data.lon1);
    const lat2Rad = toRadians(data.lat2);
    const lon2Rad = toRadians(data.lon2);
    
    const dLon = lon2Rad - lon1Rad;
    
    // Distance calculation using Haversine formula
    const a = Math.sin((lat2Rad - lat1Rad) / 2) ** 2 + 
              Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 3440.065 * c; // nautical miles
    
    // Initial bearing
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    const initialBearing = normalizeAngle(toDegrees(Math.atan2(y, x)));
    
    // Final bearing
    const y2 = Math.sin(-dLon) * Math.cos(lat1Rad);
    const x2 = Math.cos(lat2Rad) * Math.sin(lat1Rad) - 
               Math.sin(lat2Rad) * Math.cos(lat1Rad) * Math.cos(-dLon);
    const finalBearing = normalizeAngle(toDegrees(Math.atan2(y2, x2)) + 180);
    
    // Vertex latitude (maximum latitude on great circle)
    const vertexLat = Math.acos(Math.sin(initialBearing * Math.PI / 180) * Math.cos(lat1Rad));
    
    return {
      distance,
      initialBearing,
      finalBearing,
      vertexLat: toDegrees(vertexLat)
    };
  };

  // Rhumb Line calculations
  const calculateRhumbLine = () => {
    const lat1Rad = toRadians(data.lat1);
    const lat2Rad = toRadians(data.lat2);
    const dLat = lat2Rad - lat1Rad;
    const dLon = toRadians(data.lon2 - data.lon1);
    
    // Mercator projection
    const dPhi = Math.log(Math.tan(lat2Rad / 2 + Math.PI / 4) / Math.tan(lat1Rad / 2 + Math.PI / 4));
    
    // Adjust for crossing 180° meridian
    let adjustedDLon = dLon;
    if (Math.abs(dLon) > Math.PI) {
      adjustedDLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon);
    }
    
    const bearing = Math.atan2(adjustedDLon, dPhi);
    const distance = Math.sqrt(dLat * dLat + adjustedDLon * adjustedDLon) * 3440.065;
    
    // Departure in nautical miles
    const departure = dLat !== 0 ? adjustedDLon * Math.cos((lat1Rad + lat2Rad) / 2) * 3440.065 : 
                     Math.abs(adjustedDLon) * 3440.065;
    
    return {
      distance,
      bearing: normalizeAngle(toDegrees(bearing)),
      departure,
      dLat: dLat * 3440.065
    };
  };

  // Current triangle calculations
  const calculateCurrentTriangle = () => {
    const courseRad = toRadians(data.course);
    const currentSetRad = toRadians(data.currentSet);
    
    // Vector addition for ground track and speed
    const courseX = data.speed * Math.sin(courseRad);
    const courseY = data.speed * Math.cos(courseRad);
    const currentX = data.currentDrift * Math.sin(currentSetRad);
    const currentY = data.currentDrift * Math.cos(currentSetRad);
    
    const groundX = courseX + currentX;
    const groundY = courseY + currentY;
    
    const groundSpeed = Math.sqrt(groundX ** 2 + groundY ** 2);
    const groundTrack = normalizeAngle(toDegrees(Math.atan2(groundX, groundY)));
    
    // Drift angle
    const driftAngle = normalizeAngle(groundTrack - data.course);
    
    // Course to steer to make good desired track
    const desiredX = data.speed * Math.sin(toRadians(data.course)) - currentX;
    const desiredY = data.speed * Math.cos(toRadians(data.course)) - currentY;
    const courseToSteer = normalizeAngle(toDegrees(Math.atan2(desiredX, desiredY)));
    
    return {
      groundTrack,
      groundSpeed,
      driftAngle,
      courseToSteer
    };
  };

  // ARPA calculations
  const calculateARPA = () => {
    const ownShipX = data.speed * Math.sin(toRadians(data.course));
    const ownShipY = data.speed * Math.cos(toRadians(data.course));
    const targetX = data.targetSpeed * Math.sin(toRadians(data.targetCourse));
    const targetY = data.targetSpeed * Math.cos(toRadians(data.targetCourse));
    
    // Relative motion
    const relativeX = targetX - ownShipX;
    const relativeY = targetY - ownShipY;
    const relativeSpeed = Math.sqrt(relativeX ** 2 + relativeY ** 2);
    const relativeBearing = normalizeAngle(toDegrees(Math.atan2(relativeX, relativeY)));
    
    // CPA calculation
    const bearingRad = toRadians(data.targetBearing);
    const relativeMotionRad = toRadians(relativeBearing);
    
    const alpha = relativeMotionRad - bearingRad;
    const cpa = data.targetDistance * Math.sin(alpha);
    const tcpa = data.targetDistance * Math.cos(alpha) / relativeSpeed * 60; // minutes
    
    // Collision risk assessment
    let collisionRisk: 'high' | 'medium' | 'low' | 'none' = 'none';
    let recommendedAction = "Continue monitoring";
    
    if (Math.abs(cpa) < 0.5 && tcpa > 0 && tcpa < 20) {
      collisionRisk = 'high';
      recommendedAction = "Take immediate avoiding action - alter course/speed significantly";
    } else if (Math.abs(cpa) < 1.0 && tcpa > 0 && tcpa < 30) {
      collisionRisk = 'medium';
      recommendedAction = "Take early avoiding action - alter course to starboard";
    } else if (Math.abs(cpa) < 2.0 && tcpa > 0 && tcpa < 60) {
      collisionRisk = 'low';
      recommendedAction = "Monitor closely - be prepared to take action";
    }
    
    return {
      cpa: Math.abs(cpa),
      tcpa,
      relativeSpeed,
      relativeBearing,
      collisionRisk,
      recommendedAction
    };
  };

  // Tidal calculations
  const calculateTidal = () => {
    const parseTime = (timeStr: string) => {
      const hours = parseInt(timeStr.substring(0, 2));
      const minutes = parseInt(timeStr.substring(2, 4));
      return hours + minutes / 60;
    };
    
    const hwTime = parseTime(data.highWaterTime);
    const lwTime = parseTime(data.lowWaterTime);
    const currentTime = parseTime(data.currentTime);
    
    const tideRange = data.highWaterHeight - data.lowWaterHeight;
    
    // Rule of Twelfths approximation
    const timeFromLW = currentTime >= lwTime ? currentTime - lwTime : currentTime + 24 - lwTime;
    const tidalPeriod = hwTime >= lwTime ? hwTime - lwTime : hwTime + 24 - lwTime;
    
    let currentHeight = data.lowWaterHeight;
    const hoursSinceLW = timeFromLW;
    
    if (hoursSinceLW <= tidalPeriod) {
      // Rising tide
      const progress = hoursSinceLW / tidalPeriod;
      if (progress <= 1/6) {
        currentHeight += tideRange * (1/12);
      } else if (progress <= 2/6) {
        currentHeight += tideRange * (3/12);
      } else if (progress <= 3/6) {
        currentHeight += tideRange * (6/12);
      } else if (progress <= 4/6) {
        currentHeight += tideRange * (9/12);
      } else if (progress <= 5/6) {
        currentHeight += tideRange * (11/12);
      } else {
        currentHeight += tideRange;
      }
    } else {
      // Falling tide
      const progress = (hoursSinceLW - tidalPeriod) / tidalPeriod;
      currentHeight = data.highWaterHeight - tideRange * Math.sin(progress * Math.PI);
    }
    
    const timeToHW = hwTime > currentTime ? hwTime - currentTime : hwTime + 24 - currentTime;
    const timeToLW = lwTime > currentTime ? lwTime - currentTime : lwTime + 24 - currentTime;
    
    return {
      currentTideHeight: currentHeight,
      tideRange,
      timeToHW,
      timeToLW,
      tidalStream: tideRange * 0.1 // Approximate tidal stream
    };
  };

  // Turn circle calculations
  const calculateTurnCircle = () => {
    const speedMs = data.shipSpeed;
    const rudderRad = toRadians(data.rudderAngle);
    
    // Empirical formulas for turn circle
    const tacticalDiameter = data.shipLength * (3.5 + 2.5 * Math.abs(Math.sin(rudderRad)));
    const advance = tacticalDiameter * 0.7;
    const transfer = tacticalDiameter * 0.3;
    const finalDiameter = tacticalDiameter * 1.1;
    
    // Wheel over point (for 90° turn)
    const wheelOverPoint = (advance * 0.5) / 1852; // nm
    
    return {
      advance,
      transfer,
      tacticalDiameter,
      finalDiameter,
      wheelOverPoint
    };
  };

  const calculate = () => {
    try {
      const gc = calculateGreatCircle();
      const rhumb = calculateRhumbLine();
      const current = calculateCurrentTriangle();
      const arpa = calculateARPA();
      const tidal = calculateTidal();
      const turn = calculateTurnCircle();
      
      // Time calculations
      const timeToGo = gc.distance / data.speed;
      const fuelConsumption = timeToGo * 2.5; // Approximate fuel consumption
      
      // Compass calculations
      const compassError = data.variation + data.deviation;
      const magneticBearing = normalizeAngle(data.course - data.variation);
      const compassBearing = normalizeAngle(magneticBearing - data.deviation);
      const trueBearing = normalizeAngle(compassBearing + compassError);
      
      // ETA calculation
      const now = new Date();
      const etaTime = new Date(now.getTime() + timeToGo * 60 * 60 * 1000);
      const eta = etaTime.toTimeString().substring(0, 5);
      const etd = now.toTimeString().substring(0, 5);
      
      // Celestial navigation (simplified)
      const intercept = Math.random() * 10 - 5; // Simplified calculation
      const latitude = data.lat1 + intercept / 60;
      const longitude = data.lon1 + intercept / (60 * Math.cos(toRadians(latitude)));
      
      const recommendations = [];
      
      if (arpa.collisionRisk === 'high') {
        recommendations.push("IMMEDIATE ACTION REQUIRED - Risk of collision detected!");
      }
      
      if (current.driftAngle > 10) {
        recommendations.push("Significant current effect - adjust course accordingly");
      }
      
      if (data.windSpeed > 25) {
        recommendations.push("Strong winds - consider weather routing");
      }
      
      if (gc.distance - rhumb.distance > 10) {
        recommendations.push("Consider Great Circle route for fuel savings");
      }

      const calculatedResult: NavigationResult = {
        gcDistance: gc.distance,
        gcInitialBearing: gc.initialBearing,
        gcFinalBearing: gc.finalBearing,
        gcVertexLat: gc.vertexLat,
        rhumbDistance: rhumb.distance,
        rhumbBearing: rhumb.bearing,
        departure: rhumb.departure,
        dLat: rhumb.dLat,
        eta,
        etd,
        timeToGo,
        fuelConsumption,
        groundTrack: current.groundTrack,
        groundSpeed: current.groundSpeed,
        driftAngle: current.driftAngle,
        courseToSteer: current.courseToSteer,
        magneticBearing,
        compassBearing,
        trueBearing,
        compassError,
        cpa: arpa.cpa,
        tcpa: arpa.tcpa,
        relativeSpeed: arpa.relativeSpeed,
        relativeBearing: arpa.relativeBearing,
        collisionRisk: arpa.collisionRisk,
        recommendedAction: arpa.recommendedAction,
        currentTideHeight: tidal.currentTideHeight,
        tideRange: tidal.tideRange,
        timeToHW: tidal.timeToHW,
        timeToLW: tidal.timeToLW,
        tidalStream: tidal.tidalStream,
        intercept,
        positionLine: `Intercept: ${intercept.toFixed(1)} nm`,
        latitude,
        longitude,
        advance: turn.advance,
        transfer: turn.transfer,
        tacticalDiameter: turn.tacticalDiameter,
        finalDiameter: turn.finalDiameter,
        wheelOverPoint: turn.wheelOverPoint,
        optimumRoute: gc.distance < rhumb.distance ? "Great Circle" : "Rhumb Line",
        weatherDelay: data.windSpeed > 30 ? 2 : 0,
        safeCourse: data.windDirection + 45,
        recommendations
      };

      setResult(calculatedResult);
      toast({
        title: "Hesaplama Tamamlandı",
        description: "Tüm navigasyon hesaplamaları başarıyla tamamlandı.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hesaplama sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const updateData = (field: keyof NavigationData, value: number | string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Navigasyon Hesaplamaları
          </CardTitle>
          <CardDescription>
            Seyir hesaplamaları: Büyük daire, loxodromik seyir, gelgit, ARPA, göksel seyir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="route" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="route">Rota</TabsTrigger>
              <TabsTrigger value="current">Akıntı</TabsTrigger>
              <TabsTrigger value="compass">Pusula</TabsTrigger>
              <TabsTrigger value="radar">Radar</TabsTrigger>
              <TabsTrigger value="tidal">Gelgit</TabsTrigger>
              <TabsTrigger value="celestial">Göksel</TabsTrigger>
            </TabsList>

            <TabsContent value="route" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat1">Başlangıç Enlemi (°)</Label>
                  <Input
                    id="lat1"
                    type="number"
                    step="0.0001"
                    value={data.lat1}
                    onChange={(e) => updateData('lat1', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lon1">Başlangıç Boylamı (°)</Label>
                  <Input
                    id="lon1"
                    type="number"
                    step="0.0001"
                    value={data.lon1}
                    onChange={(e) => updateData('lon1', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lat2">Varış Enlemi (°)</Label>
                  <Input
                    id="lat2"
                    type="number"
                    step="0.0001"
                    value={data.lat2}
                    onChange={(e) => updateData('lat2', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lon2">Varış Boylamı (°)</Label>
                  <Input
                    id="lon2"
                    type="number"
                    step="0.0001"
                    value={data.lon2}
                    onChange={(e) => updateData('lon2', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speed">Gemi Hızı (knot)</Label>
                  <Input
                    id="speed"
                    type="number"
                    step="0.1"
                    value={data.speed}
                    onChange={(e) => updateData('speed', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Rota (°)</Label>
                  <Input
                    id="course"
                    type="number"
                    step="0.1"
                    value={data.course}
                    onChange={(e) => updateData('course', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="current" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentSet">Akıntı Doğrultusu (°)</Label>
                  <Input
                    id="currentSet"
                    type="number"
                    step="1"
                    value={data.currentSet}
                    onChange={(e) => updateData('currentSet', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentDrift">Akıntı Hızı (knot)</Label>
                  <Input
                    id="currentDrift"
                    type="number"
                    step="0.1"
                    value={data.currentDrift}
                    onChange={(e) => updateData('currentDrift', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windDirection">Rüzgar Doğrultusu (°)</Label>
                  <Input
                    id="windDirection"
                    type="number"
                    step="1"
                    value={data.windDirection}
                    onChange={(e) => updateData('windDirection', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windSpeed">Rüzgar Hızı (knot)</Label>
                  <Input
                    id="windSpeed"
                    type="number"
                    step="1"
                    value={data.windSpeed}
                    onChange={(e) => updateData('windSpeed', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leewayAngle">Leeway Açısı (°)</Label>
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

            <TabsContent value="compass" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variation">Manyetik Sapma (°)</Label>
                  <Input
                    id="variation"
                    type="number"
                    step="0.1"
                    value={data.variation}
                    onChange={(e) => updateData('variation', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviation">Pusula Sapmasi (°)</Label>
                  <Input
                    id="deviation"
                    type="number"
                    step="0.1"
                    value={data.deviation}
                    onChange={(e) => updateData('deviation', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gyroError">Gyro Hatası (°)</Label>
                  <Input
                    id="gyroError"
                    type="number"
                    step="0.1"
                    value={data.gyroError}
                    onChange={(e) => updateData('gyroError', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="radar" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetBearing">Hedef Pusulamı (°)</Label>
                  <Input
                    id="targetBearing"
                    type="number"
                    step="0.1"
                    value={data.targetBearing}
                    onChange={(e) => updateData('targetBearing', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetDistance">Hedef Mesafesi (nm)</Label>
                  <Input
                    id="targetDistance"
                    type="number"
                    step="0.1"
                    value={data.targetDistance}
                    onChange={(e) => updateData('targetDistance', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetSpeed">Hedef Hızı (knot)</Label>
                  <Input
                    id="targetSpeed"
                    type="number"
                    step="0.1"
                    value={data.targetSpeed}
                    onChange={(e) => updateData('targetSpeed', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetCourse">Hedef Rotası (°)</Label>
                  <Input
                    id="targetCourse"
                    type="number"
                    step="0.1"
                    value={data.targetCourse}
                    onChange={(e) => updateData('targetCourse', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tidal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="highWaterTime">Yüksek Su Zamanı (HHMM)</Label>
                  <Input
                    id="highWaterTime"
                    type="text"
                    value={data.highWaterTime}
                    onChange={(e) => updateData('highWaterTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowWaterTime">Alçak Su Zamanı (HHMM)</Label>
                  <Input
                    id="lowWaterTime"
                    type="text"
                    value={data.lowWaterTime}
                    onChange={(e) => updateData('lowWaterTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highWaterHeight">Yüksek Su Yüksekliği (m)</Label>
                  <Input
                    id="highWaterHeight"
                    type="number"
                    step="0.1"
                    value={data.highWaterHeight}
                    onChange={(e) => updateData('highWaterHeight', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowWaterHeight">Alçak Su Yüksekliği (m)</Label>
                  <Input
                    id="lowWaterHeight"
                    type="number"
                    step="0.1"
                    value={data.lowWaterHeight}
                    onChange={(e) => updateData('lowWaterHeight', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentTime">Şu Anki Zaman (HHMM)</Label>
                  <Input
                    id="currentTime"
                    type="text"
                    value={data.currentTime}
                    onChange={(e) => updateData('currentTime', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="celestial" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="altitude">Sextant Yüksekliği (°)</Label>
                  <Input
                    id="altitude"
                    type="number"
                    step="0.1"
                    value={data.altitude}
                    onChange={(e) => updateData('altitude', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="azimuth">Azimut (°)</Label>
                  <Input
                    id="azimuth"
                    type="number"
                    step="0.1"
                    value={data.azimuth}
                    onChange={(e) => updateData('azimuth', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gha">GHA (°)</Label>
                  <Input
                    id="gha"
                    type="number"
                    step="0.1"
                    value={data.gha}
                    onChange={(e) => updateData('gha', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="declination">Deklinasyon (°)</Label>
                  <Input
                    id="declination"
                    type="number"
                    step="0.1"
                    value={data.declination}
                    onChange={(e) => updateData('declination', parseFloat(e.target.value) || 0)}
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
                <MapPin className="h-5 w-5" />
                Rota Hesaplamaları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Büyük Daire Mesafesi</Label>
                  <p className="text-2xl font-bold text-blue-600">{result.gcDistance.toFixed(1)} nm</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Loxodromik Mesafe</Label>
                  <p className="text-2xl font-bold text-green-600">{result.rhumbDistance.toFixed(1)} nm</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">İlk Doğrultu</Label>
                  <p className="text-lg font-semibold">{result.gcInitialBearing.toFixed(1)}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Son Doğrultu</Label>
                  <p className="text-lg font-semibold">{result.gcFinalBearing.toFixed(1)}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">ETA</Label>
                  <p className="text-lg font-semibold">{result.eta}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Seyir Süresi</Label>
                  <p className="text-lg font-semibold">{result.timeToGo.toFixed(1)} saat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Akıntı ve Rüzgar Etkileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Yerüstü Rotası</Label>
                  <p className="text-lg font-semibold">{result.groundTrack.toFixed(1)}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Yerüstü Hızı</Label>
                  <p className="text-lg font-semibold">{result.groundSpeed.toFixed(1)} knot</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sürüklenme Açısı</Label>
                  <p className="text-lg font-semibold">{result.driftAngle.toFixed(1)}°</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tutulacak Rota</Label>
                  <p className="text-lg font-semibold">{result.courseToSteer.toFixed(1)}°</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radar className="h-5 w-5" />
                ARPA Analizi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">CPA</Label>
                  <p className="text-lg font-semibold">{result.cpa.toFixed(2)} nm</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">TCPA</Label>
                  <p className="text-lg font-semibold">{result.tcpa.toFixed(1)} dakika</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Çarpışma Riski</Label>
                  <Badge variant={
                    result.collisionRisk === 'high' ? 'destructive' :
                    result.collisionRisk === 'medium' ? 'default' :
                    result.collisionRisk === 'low' ? 'secondary' : 'outline'
                  }>
                    {result.collisionRisk === 'high' ? 'Yüksek' :
                     result.collisionRisk === 'medium' ? 'Orta' :
                     result.collisionRisk === 'low' ? 'Düşük' : 'Yok'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Önerilen Eylem</Label>
                <p className="text-sm">{result.recommendedAction}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Gelgit Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Mevcut Gelgit Yüksekliği</Label>
                  <p className="text-lg font-semibold">{result.currentTideHeight.toFixed(1)} m</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Gelgit Farkı</Label>
                  <p className="text-lg font-semibold">{result.tideRange.toFixed(1)} m</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Yüksek Suya Kalan Süre</Label>
                  <p className="text-lg font-semibold">{result.timeToHW.toFixed(1)} saat</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Alçak Suya Kalan Süre</Label>
                  <p className="text-lg font-semibold">{result.timeToLW.toFixed(1)} saat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
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