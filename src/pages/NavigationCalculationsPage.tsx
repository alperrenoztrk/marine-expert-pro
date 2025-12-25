import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { CalculationCard } from "@/components/ui/calculation-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Calculator, BookOpen } from "lucide-react";
import { useState } from "react";
import { parseSignedAngleEW } from "@/utils/angleParsing";
import { 
  calculateGreatCircle, 
  calculateRhumbLine, 
  calculatePlaneSailing,
  calculateEtaHours,
  solveCurrentTriangle,
  calculateCompassTotalError,
  computeArpaCpaTcpa,
  calculateSightReduction,
  calculateDoublingAngle,
  calculateFourPointBearing,
  calculateSevenPointBearing,
  calculateDistance,
  calculateTide,
  calculateTurning,
  calculateWeather,
  calculateCelestial,
  calculateEmergency,
  type PlaneSailingInput,
  type CurrentTriangleInput,
  type ARPAInput,
  type SightReductionInput,
  type DistanceCalculationInput,
  type TideInput,
  type TurningCalculationInput,
  type WeatherCalculationInput,
  type CelestialInput,
  type EmergencyInput
} from "@/components/calculations/navigationMath";

export default function NavigationCalculationsPage() {
  // State for all calculations
  const [gcInputs, setGcInputs] = useState({ lat1: "", lon1: "", lat2: "", lon2: "" });
  const [rhumbInputs, setRhumbInputs] = useState({ lat1: "", lon1: "", lat2: "", lon2: "" });
  const [planeInputs, setPlaneInputs] = useState({ lat1: "", lon1: "", lat2: "", lon2: "" });
  const [etaInputs, setEtaInputs] = useState({ distance: "", speed: "" });
  const [currentInputs, setCurrentInputs] = useState({ course: "", speed: "", set: "", drift: "" });
  const [compassInputs, setCompassInputs] = useState({ compass: "", variation: "", deviation: "" });
  const [cpaInputs, setCpaInputs] = useState({ bearing: "", distance: "", targetCourse: "", targetSpeed: "", ownCourse: "", ownSpeed: "" });
  const [sightInputs, setSightInputs] = useState({ lat: "", dec: "", lha: "" });
  const [bearingInputs, setBearingInputs] = useState({ angle: "", run: "", type: "doubling" });
  const [distanceInputs, setDistanceInputs] = useState({ height: "", type: "dip", lightHeight: "" });
  const [tideInputs, setTideInputs] = useState({ hour: "", range: "" });
  const [tideTableInputs, setTideTableInputs] = useState({ lowTide: "", highTide: "", lowTideTime: "06:00" });
  const [tideTable, setTideTable] = useState<any[]>([]);
  const [turningInputs, setTurningInputs] = useState({ length: "", courseChange: "", speed: "" });
  const [weatherInputs, setWeatherInputs] = useState({ beaufort: "", windSpeed: "", windArea: "", shipSpeed: "" });
  const [celestialInputs, setCelestialInputs] = useState({ lat: "", dec: "", type: "meridian" });
  const [emergencyInputs, setEmergencyInputs] = useState({ type: "square", trackSpacing: "", radius: "", distance: "", rescueSpeed: "", driftSpeed: "" });

  // Results state
  const [gcResults, setGcResults] = useState<any>(null);
  const [rhumbResults, setRhumbResults] = useState<any>(null);
  const [planeResults, setPlaneResults] = useState<any>(null);
  const [etaResults, setEtaResults] = useState<any>(null);
  const [currentResults, setCurrentResults] = useState<any>(null);
  const [compassResults, setCompassResults] = useState<any>(null);
  const [cpaResults, setCpaResults] = useState<any>(null);
  const [sightResults, setSightResults] = useState<any>(null);
  const [bearingResults, setBearingResults] = useState<any>(null);
  const [distanceResults, setDistanceResults] = useState<any>(null);
  const [tideResults, setTideResults] = useState<any>(null);
  const [turningResults, setTurningResults] = useState<any>(null);
  const [weatherResults, setWeatherResults] = useState<any>(null);
  const [celestialResults, setCelestialResults] = useState<any>(null);
  const [emergencyResults, setEmergencyResults] = useState<any>(null);

  const sections = [
    { id: "gc", title: "Büyük Daire (Great Circle)" },
    { id: "rhumb", title: "Rhumb Line (Mercator)" },
    { id: "plane", title: "Plane Sailing" },
    { id: "time-eta", title: "Zaman ve ETA" },
    { id: "current", title: "Akıntı Üçgeni (CTS)" },
    { id: "compass", title: "Pusula Dönüşümleri" },
    { id: "cpa", title: "CPA / TCPA" },
    { id: "sight", title: "Sight Reduction" },
    { id: "position", title: "Konum Tespiti" },
    { id: "bearings", title: "Kerteriz Hesaplamaları" },
    { id: "distance", title: "Mesafe Hesaplamaları" },
    { id: "tides", title: "Gelgit Hesaplamaları" },
    { id: "radar", title: "Radar Hesaplamaları" },
    { id: "pilotage", title: "Kıyı Seyri" },
    { id: "turning", title: "Dönüş Hesaplamaları" },
    { id: "weather", title: "Hava Durumu" },
    { id: "celestial", title: "Göksel Navigasyon" },
    { id: "emergency", title: "Acil Durum" }
  ];

  // Calculation handlers
  const handleGreatCircle = () => {
    try {
      const result = calculateGreatCircle(
        parseFloat(gcInputs.lat1), parseFloat(gcInputs.lon1),
        parseFloat(gcInputs.lat2), parseFloat(gcInputs.lon2)
      );
      setGcResults(result);
    } catch (error) {
      console.error("Great Circle calculation error:", error);
    }
  };

  const handleRhumbLine = () => {
    try {
      const result = calculateRhumbLine(
        parseFloat(rhumbInputs.lat1), parseFloat(rhumbInputs.lon1),
        parseFloat(rhumbInputs.lat2), parseFloat(rhumbInputs.lon2)
      );
      setRhumbResults(result);
    } catch (error) {
      console.error("Rhumb Line calculation error:", error);
    }
  };

  const handlePlaneSailing = () => {
    try {
      const input: PlaneSailingInput = {
        lat1Deg: parseFloat(planeInputs.lat1),
        lon1Deg: parseFloat(planeInputs.lon1),
        lat2Deg: parseFloat(planeInputs.lat2),
        lon2Deg: parseFloat(planeInputs.lon2)
      };
      const result = calculatePlaneSailing(input);
      setPlaneResults(result);
    } catch (error) {
      console.error("Plane Sailing calculation error:", error);
    }
  };

  const handleETA = () => {
    try {
      const hours = calculateEtaHours(parseFloat(etaInputs.distance), parseFloat(etaInputs.speed));
      setEtaResults({ hours, hoursMinutes: `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m` });
    } catch (error) {
      console.error("ETA calculation error:", error);
    }
  };

  const handleCurrent = () => {
    try {
      const input: CurrentTriangleInput = {
        courseDeg: parseFloat(currentInputs.course),
        speedKn: parseFloat(currentInputs.speed),
        setDeg: parseFloat(currentInputs.set),
        driftKn: parseFloat(currentInputs.drift)
      };
      const result = solveCurrentTriangle(input);
      setCurrentResults(result);
    } catch (error) {
      console.error("Current Triangle calculation error:", error);
    }
  };

  const handleCompass = () => {
    try {
      const variation = parseSignedAngleEW(compassInputs.variation);
      const deviation = parseSignedAngleEW(compassInputs.deviation);
      const result = calculateCompassTotalError(
        variation,
        deviation
      );
      const compass = parseFloat(compassInputs.compass);
      setCompassResults({
        magnetic: compass + (Number.isFinite(deviation) ? deviation : 0),
        true: compass + (Number.isFinite(variation) ? variation : 0) + (Number.isFinite(deviation) ? deviation : 0),
        totalError: result.totalErrorDeg
      });
    } catch (error) {
      console.error("Compass calculation error:", error);
    }
  };

  const handleCPA = () => {
    try {
      const input: ARPAInput = {
        targetBearingDeg: parseFloat(cpaInputs.bearing),
        targetDistanceNm: parseFloat(cpaInputs.distance),
        targetCourseDeg: parseFloat(cpaInputs.targetCourse),
        targetSpeedKn: parseFloat(cpaInputs.targetSpeed),
        ownCourseDeg: parseFloat(cpaInputs.ownCourse) || 0,
        ownSpeedKn: parseFloat(cpaInputs.ownSpeed) || 0
      };
      const result = computeArpaCpaTcpa(input);
      setCpaResults(result);
    } catch (error) {
      console.error("CPA calculation error:", error);
    }
  };

  const handleSightReduction = () => {
    try {
      const input: SightReductionInput = {
        latDeg: parseFloat(sightInputs.lat),
        decDeg: parseFloat(sightInputs.dec),
        lhaDeg: parseFloat(sightInputs.lha)
      };
      const result = calculateSightReduction(input);
      setSightResults(result);
    } catch (error) {
      console.error("Sight Reduction calculation error:", error);
    }
  };

  const handleBearing = () => {
    try {
      const angle = parseFloat(bearingInputs.angle);
      const run = parseFloat(bearingInputs.run);
      
      let result;
      switch (bearingInputs.type) {
        case "doubling":
          result = calculateDoublingAngle(angle, run);
          break;
        case "four":
          result = calculateFourPointBearing(run);
          break;
        case "seven":
          result = calculateSevenPointBearing(run);
          break;
        default:
          result = { distanceOffNm: 0 };
      }
      setBearingResults(result);
    } catch (error) {
      console.error("Bearing calculation error:", error);
    }
  };

  const handleDistance = () => {
    try {
      const input: DistanceCalculationInput = {
        heightM: parseFloat(distanceInputs.height),
        type: distanceInputs.type as 'dip' | 'radar' | 'light',
        lightHeightM: distanceInputs.lightHeight ? parseFloat(distanceInputs.lightHeight) : undefined
      };
      const result = calculateDistance(input);
      setDistanceResults(result);
    } catch (error) {
      console.error("Distance calculation error:", error);
    }
  };

  const handleTide = () => {
    try {
      const input: TideInput = {
        hour: parseInt(tideInputs.hour),
        tidalRangeM: parseFloat(tideInputs.range)
      };
      const result = calculateTide(input);
      setTideResults(result);
    } catch (error) {
      console.error("Tide calculation error:", error);
    }
  };

  const generateTideTable = () => {
    try {
      const lowTide = parseFloat(tideTableInputs.lowTide);
      const highTide = parseFloat(tideTableInputs.highTide);
      const tidalRange = highTide - lowTide;
      const [hours, minutes] = tideTableInputs.lowTideTime.split(':').map(Number);
      
      const table: any[] = [];
      const ruleOfTwelfths = [0, 1/12, 3/12, 6/12, 9/12, 11/12, 12/12];
      
      // Generate 12 hours of tide data
      for (let i = 0; i < 12; i++) {
        const time = new Date();
        time.setHours(hours + i, minutes, 0, 0);
        const timeStr = time.toTimeString().slice(0, 5);
        
        // Determine cycle position (0-6 hours in each half cycle)
        const cycleHour = i % 6;
        const isRising = Math.floor(i / 6) % 2 === 0;
        
        let height: number;
        let status: string;
        
        if (isRising) {
          // Rising tide (low to high)
          height = lowTide + (tidalRange * ruleOfTwelfths[cycleHour]);
          status = cycleHour === 0 ? 'Alçak Su' : cycleHour === 6 ? 'Yüksek Su' : 'Yükseliyor';
        } else {
          // Falling tide (high to low)
          height = highTide - (tidalRange * ruleOfTwelfths[cycleHour]);
          status = cycleHour === 0 ? 'Yüksek Su' : cycleHour === 6 ? 'Alçak Su' : 'Alçalıyor';
        }
        
        const prevHeight = i > 0 ? table[i-1].height : height;
        const change = height - prevHeight;
        
        table.push({
          time: timeStr,
          height: height,
          change: change,
          status: status
        });
      }
      
      setTideTable(table);
    } catch (error) {
      console.error("Tide table generation error:", error);
    }
  };

  const handleTurning = () => {
    try {
      const input: TurningCalculationInput = {
        shipLengthM: parseFloat(turningInputs.length),
        courseChangeDeg: parseFloat(turningInputs.courseChange),
        speedKn: parseFloat(turningInputs.speed)
      };
      const result = calculateTurning(input);
      setTurningResults(result);
    } catch (error) {
      console.error("Turning calculation error:", error);
    }
  };

  const handleWeather = () => {
    try {
      const input: WeatherCalculationInput = {
        beaufortNumber: weatherInputs.beaufort ? parseInt(weatherInputs.beaufort) : undefined,
        windSpeedKn: weatherInputs.windSpeed ? parseFloat(weatherInputs.windSpeed) : undefined,
        windAreaM2: weatherInputs.windArea ? parseFloat(weatherInputs.windArea) : undefined,
        shipSpeedKn: weatherInputs.shipSpeed ? parseFloat(weatherInputs.shipSpeed) : undefined
      };
      const result = calculateWeather(input);
      setWeatherResults(result);
    } catch (error) {
      console.error("Weather calculation error:", error);
    }
  };

  const handleCelestial = () => {
    try {
      const input: CelestialInput = {
        latDeg: parseFloat(celestialInputs.lat),
        decDeg: parseFloat(celestialInputs.dec),
        type: celestialInputs.type as 'meridian' | 'amplitude' | 'sunrise'
      };
      const result = calculateCelestial(input);
      setCelestialResults(result);
    } catch (error) {
      console.error("Celestial calculation error:", error);
    }
  };

  const handleEmergency = () => {
    try {
      const input: EmergencyInput = {
        searchType: emergencyInputs.type as 'square' | 'sector',
        trackSpacingNm: emergencyInputs.trackSpacing ? parseFloat(emergencyInputs.trackSpacing) : undefined,
        initialRadiusNm: emergencyInputs.radius ? parseFloat(emergencyInputs.radius) : undefined,
        distanceNm: emergencyInputs.distance ? parseFloat(emergencyInputs.distance) : undefined,
        rescueSpeedKn: emergencyInputs.rescueSpeed ? parseFloat(emergencyInputs.rescueSpeed) : undefined,
        driftSpeedKn: emergencyInputs.driftSpeed ? parseFloat(emergencyInputs.driftSpeed) : undefined
      };
      const result = calculateEmergency(input);
      setEmergencyResults(result);
    } catch (error) {
      console.error("Emergency calculation error:", error);
    }
  };

  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Seyir"
        title="Seyir Hesaplamaları"
        subtitle="Tüm navigasyon hesaplamalarını tek panelde toplayan arayüz"
      >
        <div className="space-y-6" data-no-translate>
        <div className="text-sm text-muted-foreground flex items-center gap-2 justify-end">
          <BookOpen className="h-4 w-4" />
          Hesaplama Rehberi
        </div>

        <CalculationCard className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" /> Seyir Hesaplamaları – İçindekiler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`}>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    {s.title}
                  </Button>
                </a>
              ))}
            </div>
          </CardContent>
        </CalculationCard>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="gc" className="scroll-mt-24">Büyük Daire (Great Circle)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gc-lat1">Başlangıç Enlemi (φ₁)</Label>
                  <Input
                    id="gc-lat1"
                    type="number"
                    placeholder="40.7589"
                    value={gcInputs.lat1}
                    onChange={(e) => setGcInputs({...gcInputs, lat1: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="gc-lon1">Başlangıç Boylamı (λ₁)</Label>
                  <Input
                    id="gc-lon1"
                    type="number"
                    placeholder="29.9511"
                    value={gcInputs.lon1}
                    onChange={(e) => setGcInputs({...gcInputs, lon1: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="gc-lat2">Hedef Enlemi (φ₂)</Label>
                  <Input
                    id="gc-lat2"
                    type="number"
                    placeholder="41.0082"
                    value={gcInputs.lat2}
                    onChange={(e) => setGcInputs({...gcInputs, lat2: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="gc-lon2">Hedef Boylamı (λ₂)</Label>
                  <Input
                    id="gc-lon2"
                    type="number"
                    placeholder="28.9784"
                    value={gcInputs.lon2}
                    onChange={(e) => setGcInputs({...gcInputs, lon2: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleGreatCircle} className="w-full mt-4">Hesapla</Button>
            </div>
            {gcResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
Mesafe: ${gcResults.distance.toFixed(2)} nm
İlk Kerteriz (θ₀): ${gcResults.initialCourse.toFixed(1)}°`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="rhumb" className="scroll-mt-24">Rhumb Line (Mercator)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rl-lat1">Başlangıç Enlemi</Label>
                  <Input
                    id="rl-lat1"
                    type="number"
                    placeholder="40.7589"
                    value={rhumbInputs.lat1}
                    onChange={(e) => setRhumbInputs({...rhumbInputs, lat1: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="rl-lon1">Başlangıç Boylamı</Label>
                  <Input
                    id="rl-lon1"
                    type="number"
                    placeholder="29.9511"
                    value={rhumbInputs.lon1}
                    onChange={(e) => setRhumbInputs({...rhumbInputs, lon1: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="rl-lat2">Hedef Enlemi</Label>
                  <Input
                    id="rl-lat2"
                    type="number"
                    placeholder="41.0082"
                    value={rhumbInputs.lat2}
                    onChange={(e) => setRhumbInputs({...rhumbInputs, lat2: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="rl-lon2">Hedef Boylamı</Label>
                  <Input
                    id="rl-lon2"
                    type="number"
                    placeholder="28.9784"
                    value={rhumbInputs.lon2}
                    onChange={(e) => setRhumbInputs({...rhumbInputs, lon2: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleRhumbLine} className="w-full mt-4">Hesapla</Button>
            </div>
            {rhumbResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
Mesafe: ${rhumbResults.distance.toFixed(2)} nm
Sabit Kerteriz: ${rhumbResults.course.toFixed(1)}°`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="plane" className="scroll-mt-24">Plane Sailing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ps-lat1">Başlangıç Enlemi</Label>
                  <Input
                    id="ps-lat1"
                    type="number"
                    placeholder="40.7589"
                    value={planeInputs.lat1}
                    onChange={(e) => setPlaneInputs({...planeInputs, lat1: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ps-lon1">Başlangıç Boylamı</Label>
                  <Input
                    id="ps-lon1"
                    type="number"
                    placeholder="29.9511"
                    value={planeInputs.lon1}
                    onChange={(e) => setPlaneInputs({...planeInputs, lon1: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ps-lat2">Hedef Enlemi</Label>
                  <Input
                    id="ps-lat2"
                    type="number"
                    placeholder="41.0082"
                    value={planeInputs.lat2}
                    onChange={(e) => setPlaneInputs({...planeInputs, lat2: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ps-lon2">Hedef Boylamı</Label>
                  <Input
                    id="ps-lon2"
                    type="number"
                    placeholder="28.9784"
                    value={planeInputs.lon2}
                    onChange={(e) => setPlaneInputs({...planeInputs, lon2: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handlePlaneSailing} className="w-full mt-4">Hesapla</Button>
            </div>
            {planeResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
dLat: ${planeResults.dLatNm.toFixed(2)} nm
Departure: ${planeResults.departureNm.toFixed(2)} nm
Kerteriz: ${planeResults.courseDeg.toFixed(1)}°
Mesafe: ${planeResults.distanceNm.toFixed(2)} nm`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="time-eta" className="scroll-mt-24">Zaman ve ETA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eta-distance">Mesafe (nm)</Label>
                  <Input
                    id="eta-distance"
                    type="number"
                    placeholder="100"
                    value={etaInputs.distance}
                    onChange={(e) => setEtaInputs({...etaInputs, distance: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="eta-speed">Hız (knot)</Label>
                  <Input
                    id="eta-speed"
                    type="number"
                    placeholder="12"
                    value={etaInputs.speed}
                    onChange={(e) => setEtaInputs({...etaInputs, speed: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleETA} className="w-full mt-4">Hesapla</Button>
            </div>
            {etaResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
Süre: ${etaResults.hoursMinutes}
Saat: ${etaResults.hours.toFixed(2)} saat`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="current" className="scroll-mt-24">Akıntı Üçgeni (CTS)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ct-course">İstenen Rota (°)</Label>
                  <Input
                    id="ct-course"
                    type="number"
                    placeholder="045"
                    value={currentInputs.course}
                    onChange={(e) => setCurrentInputs({...currentInputs, course: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ct-speed">Gemi Sürati (kn)</Label>
                  <Input
                    id="ct-speed"
                    type="number"
                    placeholder="12"
                    value={currentInputs.speed}
                    onChange={(e) => setCurrentInputs({...currentInputs, speed: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ct-set">Akıntı İstikameti (°)</Label>
                  <Input
                    id="ct-set"
                    type="number"
                    placeholder="090"
                    value={currentInputs.set}
                    onChange={(e) => setCurrentInputs({...currentInputs, set: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ct-drift">Akıntı Sürati (kn)</Label>
                  <Input
                    id="ct-drift"
                    type="number"
                    placeholder="2"
                    value={currentInputs.drift}
                    onChange={(e) => setCurrentInputs({...currentInputs, drift: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleCurrent} className="w-full mt-4">Hesapla</Button>
            </div>
            {currentResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
CTS (Course to Steer): ${currentResults.courseToSteerDeg.toFixed(1)}°
SOG (Speed over Ground): ${currentResults.speedOverGroundKn.toFixed(2)} kn`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="compass" className="scroll-mt-24">Pusula Dönüşümleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="comp-compass">Pusula Okuyuşu (°)</Label>
                  <Input
                    id="comp-compass"
                    type="number"
                    placeholder="045"
                    value={compassInputs.compass}
                    onChange={(e) => setCompassInputs({...compassInputs, compass: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="comp-variation">Varyasyon (° E(+) W(-))</Label>
                  <Input
                    id="comp-variation"
                    type="text"
                    inputMode="decimal"
                    placeholder="2.5"
                    value={compassInputs.variation}
                    onChange={(e) => setCompassInputs({...compassInputs, variation: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="comp-deviation">Deviasyon (° E(+) W(-))</Label>
                  <Input
                    id="comp-deviation"
                    type="text"
                    inputMode="decimal"
                    placeholder="-1.5"
                    value={compassInputs.deviation}
                    onChange={(e) => setCompassInputs({...compassInputs, deviation: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleCompass} className="w-full mt-4">Hesapla</Button>
            </div>
            {compassResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
Manyetik Kerteriz: ${compassResults.magnetic.toFixed(1)}°
Gerçek Kerteriz: ${compassResults.true.toFixed(1)}°
Toplam Hata: ${compassResults.totalError.toFixed(1)}°`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="cpa" className="scroll-mt-24">CPA / TCPA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpa-bearing">Hedef Kerterizi (°)</Label>
                  <Input
                    id="cpa-bearing"
                    type="number"
                    placeholder="045"
                    value={cpaInputs.bearing}
                    onChange={(e) => setCpaInputs({...cpaInputs, bearing: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cpa-distance">Hedef Mesafesi (nm)</Label>
                  <Input
                    id="cpa-distance"
                    type="number"
                    placeholder="5"
                    value={cpaInputs.distance}
                    onChange={(e) => setCpaInputs({...cpaInputs, distance: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cpa-tcourse">Hedef Rotası (°)</Label>
                  <Input
                    id="cpa-tcourse"
                    type="number"
                    placeholder="270"
                    value={cpaInputs.targetCourse}
                    onChange={(e) => setCpaInputs({...cpaInputs, targetCourse: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cpa-tspeed">Hedef Sürati (kn)</Label>
                  <Input
                    id="cpa-tspeed"
                    type="number"
                    placeholder="15"
                    value={cpaInputs.targetSpeed}
                    onChange={(e) => setCpaInputs({...cpaInputs, targetSpeed: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cpa-ocourse">Kendi Rotamız (°)</Label>
                  <Input
                    id="cpa-ocourse"
                    type="number"
                    placeholder="000"
                    value={cpaInputs.ownCourse}
                    onChange={(e) => setCpaInputs({...cpaInputs, ownCourse: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cpa-ospeed">Kendi Süratimiz (kn)</Label>
                  <Input
                    id="cpa-ospeed"
                    type="number"
                    placeholder="12"
                    value={cpaInputs.ownSpeed}
                    onChange={(e) => setCpaInputs({...cpaInputs, ownSpeed: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleCPA} className="w-full mt-4">Hesapla</Button>
            </div>
            {cpaResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
CPA Mesafesi: ${cpaResults.cpaDistanceNm.toFixed(2)} nm
TCPA: ${cpaResults.tcpaHours.toFixed(2)} saat (${(cpaResults.tcpaHours * 60).toFixed(0)} dk)`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="sight" className="scroll-mt-24">Sight Reduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="sight-lat">Tahmini Enlem (°)</Label>
                  <Input
                    id="sight-lat"
                    type="number"
                    placeholder="41.0"
                    value={sightInputs.lat}
                    onChange={(e) => setSightInputs({...sightInputs, lat: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="sight-dec">Deklinasyon (°)</Label>
                  <Input
                    id="sight-dec"
                    type="number"
                    placeholder="23.5"
                    value={sightInputs.dec}
                    onChange={(e) => setSightInputs({...sightInputs, dec: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="sight-lha">LHA (°)</Label>
                  <Input
                    id="sight-lha"
                    type="number"
                    placeholder="45"
                    value={sightInputs.lha}
                    onChange={(e) => setSightInputs({...sightInputs, lha: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleSightReduction} className="w-full mt-4">Hesapla</Button>
            </div>
            {sightResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
Hesaplanan Yükseklik: ${sightResults.calculatedAltitudeDeg.toFixed(2)}°
Azimut: ${sightResults.azimuthDeg.toFixed(1)}°`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="position" className="scroll-mt-24">Konum Tespiti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="text-center text-muted-foreground">
                <p>Bu bölüm geliştirilmektedir.</p>
                <p>İki ve üç kerteriz kesişimi hesaplamaları eklenecek.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="bearings" className="scroll-mt-24">Kerteriz Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="bearing-type">Hesaplama Türü</Label>
                  <Select value={bearingInputs.type} onValueChange={(value) => setBearingInputs({...bearingInputs, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doubling">Doubling Angle on Bow</SelectItem>
                      <SelectItem value="four">Four Point Bearing</SelectItem>
                      <SelectItem value="seven">Special Angle Bearing (22.5°-45°)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {bearingInputs.type === "doubling" && (
                  <div>
                    <Label htmlFor="bearing-angle">İlk Açı (°)</Label>
                    <Input
                      id="bearing-angle"
                      type="number"
                      placeholder="30"
                      value={bearingInputs.angle}
                      onChange={(e) => setBearingInputs({...bearingInputs, angle: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="bearing-run">Koşulan Mesafe (nm)</Label>
                  <Input
                    id="bearing-run"
                    type="number"
                    placeholder="2"
                    value={bearingInputs.run}
                    onChange={(e) => setBearingInputs({...bearingInputs, run: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleBearing} className="w-full mt-4">Hesapla</Button>
            </div>
            {bearingResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
Mesafe Off: ${bearingResults.distanceOffNm.toFixed(2)} nm`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="distance" className="scroll-mt-24">Mesafe Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="distance-type">Hesaplama Türü</Label>
                  <Select value={distanceInputs.type} onValueChange={(value) => setDistanceInputs({...distanceInputs, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dip">Dip (Horizon) Distance</SelectItem>
                      <SelectItem value="radar">Radar Horizon</SelectItem>
                      <SelectItem value="light">Light Visibility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="distance-height">Yükseklik (m)</Label>
                  <Input
                    id="distance-height"
                    type="number"
                    placeholder="15"
                    value={distanceInputs.height}
                    onChange={(e) => setDistanceInputs({...distanceInputs, height: e.target.value})}
                  />
                </div>
                {distanceInputs.type === "light" && (
                  <div>
                    <Label htmlFor="distance-light">Işık Yüksekliği (m)</Label>
                    <Input
                      id="distance-light"
                      type="number"
                      placeholder="50"
                      value={distanceInputs.lightHeight}
                      onChange={(e) => setDistanceInputs({...distanceInputs, lightHeight: e.target.value})}
                    />
                  </div>
                )}
              </div>
              <Button onClick={handleDistance} className="w-full mt-4">Hesapla</Button>
            </div>
            {distanceResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
Mesafe: ${distanceResults.distanceNm.toFixed(2)} nm`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="tides" className="scroll-mt-24">Gelgit Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tide-hour">Saat (1-6)</Label>
                  <Input
                    id="tide-hour"
                    type="number"
                    min="1"
                    max="6"
                    placeholder="3"
                    value={tideInputs.hour}
                    onChange={(e) => setTideInputs({...tideInputs, hour: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="tide-range">Gelgit Aralığı (m)</Label>
                  <Input
                    id="tide-range"
                    type="number"
                    placeholder="4.2"
                    value={tideInputs.range}
                    onChange={(e) => setTideInputs({...tideInputs, range: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleTide} className="w-full mt-4">Hesapla</Button>
            </div>
            {tideResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç (Rule of Twelfths):
${tideResults.hour}. Saatte Değişim: ${tideResults.changeM.toFixed(2)} m
Toplam Değişim: ${tideResults.totalChangeM.toFixed(2)} m
Yüzde: ${tideResults.percentageComplete.toFixed(1)}%`}</pre>
              </div>
            )}

            {/* Tide Table */}
            <div className="bg-muted/30 rounded p-3 mt-4">
              <h4 className="font-semibold mb-3">Gelgit Tablosu</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tide-low">Alçak Su (m)</Label>
                    <Input
                      id="tide-low"
                      type="number"
                      placeholder="1.2"
                      value={tideTableInputs.lowTide}
                      onChange={(e) => setTideTableInputs({...tideTableInputs, lowTide: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tide-high">Yüksek Su (m)</Label>
                    <Input
                      id="tide-high"
                      type="number"
                      placeholder="5.4"
                      value={tideTableInputs.highTide}
                      onChange={(e) => setTideTableInputs({...tideTableInputs, highTide: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tide-time">Alçak Su Zamanı</Label>
                    <Input
                      id="tide-time"
                      type="time"
                      value={tideTableInputs.lowTideTime}
                      onChange={(e) => setTideTableInputs({...tideTableInputs, lowTideTime: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={generateTideTable} className="w-full">Gelgit Tablosu Oluştur</Button>
              </div>
            </div>

            {tideTable.length > 0 && (
              <div className="bg-muted/30 rounded p-3">
                <h4 className="font-semibold mb-3">12 Saatlik Gelgit Tablosu</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Saat</th>
                        <th className="text-left p-2">Yükseklik (m)</th>
                        <th className="text-left p-2">Değişim</th>
                        <th className="text-left p-2">Durumu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tideTable.map((entry, index) => (
                        <tr key={index} className={`border-b ${entry.status === 'Yüksek Su' || entry.status === 'Alçak Su' ? 'bg-primary/10' : ''}`}>
                          <td className="p-2 font-mono">{entry.time}</td>
                          <td className="p-2 font-mono">{entry.height.toFixed(2)}</td>
                          <td className="p-2 font-mono">{entry.change > 0 ? '+' : ''}{entry.change.toFixed(2)}</td>
                          <td className={`p-2 ${entry.status === 'Yükseliyor' ? 'text-green-600' : entry.status === 'Alçalıyor' ? 'text-red-600' : 'text-blue-600'}`}>
                            {entry.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="radar" className="scroll-mt-24">Radar Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="text-center text-muted-foreground">
                <p>Bu bölüm geliştirilmektedir.</p>
                <p>ARPA vektörleri ve radar menzili hesaplamaları eklenecek.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="pilotage" className="scroll-mt-24">Kıyı Seyri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="text-center text-muted-foreground">
                <p>Bu bölüm geliştirilmektedir.</p>
                <p>Clearing bearing ve danger angle hesaplamaları eklenecek.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="turning" className="scroll-mt-24">Dönüş Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="turn-length">Gemi Boyu (m)</Label>
                  <Input
                    id="turn-length"
                    type="number"
                    placeholder="200"
                    value={turningInputs.length}
                    onChange={(e) => setTurningInputs({...turningInputs, length: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="turn-change">Rota Değişikliği (°)</Label>
                  <Input
                    id="turn-change"
                    type="number"
                    placeholder="90"
                    value={turningInputs.courseChange}
                    onChange={(e) => setTurningInputs({...turningInputs, courseChange: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="turn-speed">Sürat (knot)</Label>
                  <Input
                    id="turn-speed"
                    type="number"
                    placeholder="12"
                    value={turningInputs.speed}
                    onChange={(e) => setTurningInputs({...turningInputs, speed: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleTurning} className="w-full mt-4">Hesapla</Button>
            </div>
            {turningResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
Tactical Diameter: ${turningResults.tacticalDiameterM.toFixed(0)} m
Advance: ${turningResults.advanceM.toFixed(0)} m
Transfer: ${turningResults.transferM.toFixed(0)} m
ROT: ${turningResults.rotDegPerMin.toFixed(1)} °/min`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="weather" className="scroll-mt-24">Hava Durumu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weather-beaufort">Beaufort Sayısı</Label>
                  <Input
                    id="weather-beaufort"
                    type="number"
                    min="0"
                    max="12"
                    placeholder="5"
                    value={weatherInputs.beaufort}
                    onChange={(e) => setWeatherInputs({...weatherInputs, beaufort: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="weather-windspeed">Rüzgar Hızı (knot)</Label>
                  <Input
                    id="weather-windspeed"
                    type="number"
                    placeholder="25"
                    value={weatherInputs.windSpeed}
                    onChange={(e) => setWeatherInputs({...weatherInputs, windSpeed: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="weather-area">Rüzgar Alanı (m²)</Label>
                  <Input
                    id="weather-area"
                    type="number"
                    placeholder="1000"
                    value={weatherInputs.windArea}
                    onChange={(e) => setWeatherInputs({...weatherInputs, windArea: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="weather-shipspeed">Gemi Sürati (knot)</Label>
                  <Input
                    id="weather-shipspeed"
                    type="number"
                    placeholder="12"
                    value={weatherInputs.shipSpeed}
                    onChange={(e) => setWeatherInputs({...weatherInputs, shipSpeed: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleWeather} className="w-full mt-4">Hesapla</Button>
            </div>
            {weatherResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
${weatherResults.beaufortWindSpeedKn ? `Beaufort Rüzgar Hızı: ${weatherResults.beaufortWindSpeedKn.toFixed(1)} knot\n` : ''}${weatherResults.waveHeightM ? `Dalga Yüksekliği: ${weatherResults.waveHeightM.toFixed(1)} m\n` : ''}${weatherResults.leewayAngleDeg ? `Leeway Açısı: ${weatherResults.leewayAngleDeg.toFixed(1)}°\n` : ''}${weatherResults.windForceN ? `Rüzgar Kuvveti: ${weatherResults.windForceN.toFixed(0)} N` : ''}`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="celestial" className="scroll-mt-24">Göksel Navigasyon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="celestial-type">Hesaplama Türü</Label>
                  <Select value={celestialInputs.type} onValueChange={(value) => setCelestialInputs({...celestialInputs, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meridian">Meridian Passage</SelectItem>
                      <SelectItem value="amplitude">Amplitude</SelectItem>
                      <SelectItem value="sunrise">Sunrise Bearing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="celestial-lat">Enlem (°)</Label>
                  <Input
                    id="celestial-lat"
                    type="number"
                    placeholder="41.0"
                    value={celestialInputs.lat}
                    onChange={(e) => setCelestialInputs({...celestialInputs, lat: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="celestial-dec">Deklinasyon (°)</Label>
                  <Input
                    id="celestial-dec"
                    type="number"
                    placeholder="23.5"
                    value={celestialInputs.dec}
                    onChange={(e) => setCelestialInputs({...celestialInputs, dec: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleCelestial} className="w-full mt-4">Hesapla</Button>
            </div>
            {celestialResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
${celestialInputs.type === 'meridian' ? `Meridian Latitude: ${celestialResults.latitudeDeg?.toFixed(2)}°` : ''}${celestialInputs.type === 'amplitude' ? `Amplitude: ${celestialResults.amplitudeDeg?.toFixed(2)}°` : ''}${celestialInputs.type === 'sunrise' ? `Sunrise Bearing: ${celestialResults.sunriseBearingDeg?.toFixed(1)}°` : ''}`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="emergency" className="scroll-mt-24">Acil Durum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="emergency-type">Arama Türü</Label>
                  <Select value={emergencyInputs.type} onValueChange={(value) => setEmergencyInputs({...emergencyInputs, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square Search</SelectItem>
                      <SelectItem value="sector">Sector Search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {emergencyInputs.type === "square" && (
                  <div>
                    <Label htmlFor="emergency-spacing">Track Spacing (nm)</Label>
                    <Input
                      id="emergency-spacing"
                      type="number"
                      placeholder="1"
                      value={emergencyInputs.trackSpacing}
                      onChange={(e) => setEmergencyInputs({...emergencyInputs, trackSpacing: e.target.value})}
                    />
                  </div>
                )}
                {emergencyInputs.type === "sector" && (
                  <div>
                    <Label htmlFor="emergency-radius">İlk Yarıçap (nm)</Label>
                    <Input
                      id="emergency-radius"
                      type="number"
                      placeholder="2"
                      value={emergencyInputs.radius}
                      onChange={(e) => setEmergencyInputs({...emergencyInputs, radius: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="emergency-distance">Mesafe (nm)</Label>
                  <Input
                    id="emergency-distance"
                    type="number"
                    placeholder="10"
                    value={emergencyInputs.distance}
                    onChange={(e) => setEmergencyInputs({...emergencyInputs, distance: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency-rescue">Kurtarma Sürati (knot)</Label>
                  <Input
                    id="emergency-rescue"
                    type="number"
                    placeholder="12"
                    value={emergencyInputs.rescueSpeed}
                    onChange={(e) => setEmergencyInputs({...emergencyInputs, rescueSpeed: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency-drift">Sürüklenme Sürati (knot)</Label>
                  <Input
                    id="emergency-drift"
                    type="number"
                    placeholder="2"
                    value={emergencyInputs.driftSpeed}
                    onChange={(e) => setEmergencyInputs({...emergencyInputs, driftSpeed: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleEmergency} className="w-full mt-4">Hesapla</Button>
            </div>
            {emergencyResults && (
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Sonuç:
${emergencyResults.searchLegNm ? `Search Leg: ${emergencyResults.searchLegNm.toFixed(2)} nm\n` : ''}${emergencyResults.nextRadiusNm ? `Next Radius: ${emergencyResults.nextRadiusNm.toFixed(2)} nm\n` : ''}${emergencyResults.rescueTimeHours ? `Rescue Time: ${emergencyResults.rescueTimeHours.toFixed(2)} hours` : ''}`}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button asChild variant="default" className="gap-2">
            <a href="#gc">
              <Calculator className="h-4 w-4" /> Başa Dön
            </a>
          </Button>
        </div>

        <Separator />
        </div>
      </CalculationGridScreen>
    </MobileLayout>
  );
}
