import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calculator, BookOpen } from "lucide-react";
import { useState } from "react";
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
} from "./calculations/navigationMath";

export const NavigationCalculationsCard = () => {
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

  // Define sections matching the formulas page
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
      const result = calculateCompassTotalError(
        parseFloat(compassInputs.variation),
        parseFloat(compassInputs.deviation)
      );
      const compass = parseFloat(compassInputs.compass);
      setCompassResults({
        magnetic: compass + parseFloat(compassInputs.deviation),
        true: compass + parseFloat(compassInputs.variation) + parseFloat(compassInputs.deviation),
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
    <div className="space-y-4" data-no-translate>
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        Hesaplama Rehberi
      </div>

      <Card className="shadow-lg">
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
      </Card>

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
dLat: ${planeResults.dLatMin.toFixed(2)} dk
Dep: ${planeResults.depMin.toFixed(2)} dk
Kurs: ${planeResults.courseDeg.toFixed(1)}°
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
                <Label htmlFor="eta-speed">Hız (kn)</Label>
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
Zaman: ${etaResults.hoursMinutes}
(${etaResults.hours.toFixed(2)} saat)`}</pre>
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
                <Label htmlFor="current-course">İstenen Rota (°)</Label>
                <Input
                  id="current-course"
                  type="number"
                  placeholder="090"
                  value={currentInputs.course}
                  onChange={(e) => setCurrentInputs({...currentInputs, course: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="current-speed">Gemi Hızı (kn)</Label>
                <Input
                  id="current-speed"
                  type="number"
                  placeholder="12"
                  value={currentInputs.speed}
                  onChange={(e) => setCurrentInputs({...currentInputs, speed: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="current-set">Akıntı Yönü (°)</Label>
                <Input
                  id="current-set"
                  type="number"
                  placeholder="180"
                  value={currentInputs.set}
                  onChange={(e) => setCurrentInputs({...currentInputs, set: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="current-drift">Akıntı Hızı (kn)</Label>
                <Input
                  id="current-drift"
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
Yönlendirilecek Kurs: ${currentResults.courseToSteerDeg.toFixed(1)}°
Yer Üstü Hızı: ${currentResults.groundSpeedKn.toFixed(1)} kn
Drift Açısı: ${currentResults.driftAngleDeg.toFixed(1)}°
Uygulanabilir: ${currentResults.feasible ? 'Evet' : 'Hayır'}`}</pre>
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="compass-reading">Pusula Okuması (°)</Label>
                <Input
                  id="compass-reading"
                  type="number"
                  placeholder="090"
                  value={compassInputs.compass}
                  onChange={(e) => setCompassInputs({...compassInputs, compass: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="compass-variation">Varyasyon (°)</Label>
                <Input
                  id="compass-variation"
                  type="number"
                  placeholder="2"
                  value={compassInputs.variation}
                  onChange={(e) => setCompassInputs({...compassInputs, variation: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="compass-deviation">Deviasyon (°)</Label>
                <Input
                  id="compass-deviation"
                  type="number"
                  placeholder="1"
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
            <div className="grid grid-cols-3 gap-4">
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
                <Label htmlFor="cpa-distance">Mesafe (nm)</Label>
                <Input
                  id="cpa-distance"
                  type="number"
                  placeholder="5"
                  value={cpaInputs.distance}
                  onChange={(e) => setCpaInputs({...cpaInputs, distance: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cpa-target-course">Hedef Kursu (°)</Label>
                <Input
                  id="cpa-target-course"
                  type="number"
                  placeholder="270"
                  value={cpaInputs.targetCourse}
                  onChange={(e) => setCpaInputs({...cpaInputs, targetCourse: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cpa-target-speed">Hedef Hızı (kn)</Label>
                <Input
                  id="cpa-target-speed"
                  type="number"
                  placeholder="10"
                  value={cpaInputs.targetSpeed}
                  onChange={(e) => setCpaInputs({...cpaInputs, targetSpeed: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cpa-own-course">Kendi Kursumuz (°)</Label>
                <Input
                  id="cpa-own-course"
                  type="number"
                  placeholder="090"
                  value={cpaInputs.ownCourse}
                  onChange={(e) => setCpaInputs({...cpaInputs, ownCourse: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cpa-own-speed">Kendi Hızımız (kn)</Label>
                <Input
                  id="cpa-own-speed"
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
CPA: ${cpaResults.cpaNm.toFixed(2)} nm
TCPA: ${cpaResults.tcpaMin.toFixed(1)} dk
Rel. Hız: ${cpaResults.relativeSpeedKn.toFixed(1)} kn
Rel. Kerteriz: ${cpaResults.relativeBearingDeg.toFixed(1)}°`}</pre>
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sight-lat">Enlem (°)</Label>
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
Hesaplanan Yükseklik (Hc): ${sightResults.hcDeg.toFixed(2)}°
Azimut: ${sightResults.azimuthDeg.toFixed(1)}°`}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardHeader>
          <CardTitle id="bearings" className="scroll-mt-24">Kerteriz Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="bg-muted/30 rounded p-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bearing-type">Yöntem</Label>
                <Select value={bearingInputs.type} onValueChange={(value) => setBearingInputs({...bearingInputs, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doubling">Açı İkiye Katlama</SelectItem>
                    <SelectItem value="four">Four Point</SelectItem>
                    <SelectItem value="seven">Seven Point</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bearing-angle">Açı (°)</Label>
                <Input
                  id="bearing-angle"
                  type="number"
                  placeholder="30"
                  value={bearingInputs.angle}
                  onChange={(e) => setBearingInputs({...bearingInputs, angle: e.target.value})}
                  disabled={bearingInputs.type !== "doubling"}
                />
              </div>
              <div>
                <Label htmlFor="bearing-run">Alınan Yol (nm)</Label>
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
Mesafe: ${bearingResults.distanceOffNm.toFixed(2)} nm`}</pre>
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="distance-type">Tür</Label>
                <Select value={distanceInputs.type} onValueChange={(value) => setDistanceInputs({...distanceInputs, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dip">Ufuk (Dip)</SelectItem>
                    <SelectItem value="radar">Radar Ufku</SelectItem>
                    <SelectItem value="light">Işık Görünürlüğü</SelectItem>
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
              <div>
                <Label htmlFor="distance-light-height">Işık Yüksekliği (m)</Label>
                <Input
                  id="distance-light-height"
                  type="number"
                  placeholder="20"
                  value={distanceInputs.lightHeight}
                  onChange={(e) => setDistanceInputs({...distanceInputs, lightHeight: e.target.value})}
                  disabled={distanceInputs.type !== "light"}
                />
              </div>
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
                <Select value={tideInputs.hour} onValueChange={(value) => setTideInputs({...tideInputs, hour: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Saat seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1. Saat</SelectItem>
                    <SelectItem value="2">2. Saat</SelectItem>
                    <SelectItem value="3">3. Saat</SelectItem>
                    <SelectItem value="4">4. Saat</SelectItem>
                    <SelectItem value="5">5. Saat</SelectItem>
                    <SelectItem value="6">6. Saat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tide-range">Gelgit Aralığı (m)</Label>
                <Input
                  id="tide-range"
                  type="number"
                  placeholder="3"
                  value={tideInputs.range}
                  onChange={(e) => setTideInputs({...tideInputs, range: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleTide} className="w-full mt-4">Hesapla</Button>
          </div>
          {tideResults && (
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Sonuç:
Gelgit Yüksekliği: ${tideResults.heightM.toFixed(2)} m`}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardHeader>
          <CardTitle id="turning" className="scroll-mt-24">Dönüş Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="bg-muted/30 rounded p-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="turning-length">Gemi Boyu (m)</Label>
                <Input
                  id="turning-length"
                  type="number"
                  placeholder="200"
                  value={turningInputs.length}
                  onChange={(e) => setTurningInputs({...turningInputs, length: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="turning-course-change">Kurs Değişimi (°)</Label>
                <Input
                  id="turning-course-change"
                  type="number"
                  placeholder="90"
                  value={turningInputs.courseChange}
                  onChange={(e) => setTurningInputs({...turningInputs, courseChange: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="turning-speed">Hız (kn)</Label>
                <Input
                  id="turning-speed"
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
Taktik Çap: ${turningResults.tacticalDiameterM.toFixed(0)} m
Advance: ${turningResults.advanceM.toFixed(0)} m
Transfer: ${turningResults.transferM.toFixed(0)} m
Dönüş Oranı: ${turningResults.rotDegPerMin.toFixed(1)} °/dk
WOP: ${turningResults.wheelOverPointM.toFixed(0)} m`}</pre>
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
                <Label htmlFor="weather-beaufort">Beaufort Numarası</Label>
                <Input
                  id="weather-beaufort"
                  type="number"
                  placeholder="5"
                  value={weatherInputs.beaufort}
                  onChange={(e) => setWeatherInputs({...weatherInputs, beaufort: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="weather-wind-speed">Rüzgar Hızı (kn)</Label>
                <Input
                  id="weather-wind-speed"
                  type="number"
                  placeholder="25"
                  value={weatherInputs.windSpeed}
                  onChange={(e) => setWeatherInputs({...weatherInputs, windSpeed: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="weather-wind-area">Rüzgar Alanı (m²)</Label>
                <Input
                  id="weather-wind-area"
                  type="number"
                  placeholder="1000"
                  value={weatherInputs.windArea}
                  onChange={(e) => setWeatherInputs({...weatherInputs, windArea: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="weather-ship-speed">Gemi Hızı (kn)</Label>
                <Input
                  id="weather-ship-speed"
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
${weatherResults.windSpeedKn ? `Rüzgar Hızı: ${weatherResults.windSpeedKn.toFixed(1)} kn\n` : ''}${weatherResults.waveHeightM ? `Dalga Yüksekliği: ${weatherResults.waveHeightM.toFixed(1)} m\n` : ''}${weatherResults.leewayAngleDeg ? `Leeway Açısı: ${weatherResults.leewayAngleDeg.toFixed(1)}°\n` : ''}${weatherResults.windForceN ? `Rüzgar Kuvveti: ${weatherResults.windForceN.toFixed(0)} N` : ''}`}</pre>
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="celestial-type">Tür</Label>
                <Select value={celestialInputs.type} onValueChange={(value) => setCelestialInputs({...celestialInputs, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meridian">Meridian Passage</SelectItem>
                    <SelectItem value="amplitude">Amplitude</SelectItem>
                    <SelectItem value="sunrise">Gündoğumu Kerterizi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="celestial-lat">Enlem (°)</Label>
                <Input
                  id="celestial-lat"
                  type="number"
                  placeholder="41"
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
${celestialResults.latitudeDeg ? `Enlem: ${celestialResults.latitudeDeg.toFixed(2)}°\n` : ''}${celestialResults.amplitudeDeg ? `Amplitude: ${celestialResults.amplitudeDeg.toFixed(2)}°\n` : ''}${celestialResults.bearingDeg ? `Kerteriz: ${celestialResults.bearingDeg.toFixed(1)}°` : ''}`}</pre>
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergency-type">Arama Tipi</Label>
                <Select value={emergencyInputs.type} onValueChange={(value) => setEmergencyInputs({...emergencyInputs, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Kare Arama</SelectItem>
                    <SelectItem value="sector">Sektör Arama</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="emergency-track-spacing">İz Aralığı (nm)</Label>
                <Input
                  id="emergency-track-spacing"
                  type="number"
                  placeholder="1"
                  value={emergencyInputs.trackSpacing}
                  onChange={(e) => setEmergencyInputs({...emergencyInputs, trackSpacing: e.target.value})}
                  disabled={emergencyInputs.type !== "square"}
                />
              </div>
              <div>
                <Label htmlFor="emergency-radius">Başlangıç Yarıçapı (nm)</Label>
                <Input
                  id="emergency-radius"
                  type="number"
                  placeholder="2"
                  value={emergencyInputs.radius}
                  onChange={(e) => setEmergencyInputs({...emergencyInputs, radius: e.target.value})}
                  disabled={emergencyInputs.type !== "sector"}
                />
              </div>
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
                <Label htmlFor="emergency-rescue-speed">Kurtarma Hızı (kn)</Label>
                <Input
                  id="emergency-rescue-speed"
                  type="number"
                  placeholder="15"
                  value={emergencyInputs.rescueSpeed}
                  onChange={(e) => setEmergencyInputs({...emergencyInputs, rescueSpeed: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="emergency-drift-speed">Sürüklenme Hızı (kn)</Label>
                <Input
                  id="emergency-drift-speed"
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
${emergencyResults.legDistanceNm ? `Bacak Mesafesi: ${emergencyResults.legDistanceNm.toFixed(2)} nm\n` : ''}${emergencyResults.newRadiusNm ? `Yeni Yarıçap: ${emergencyResults.newRadiusNm.toFixed(2)} nm\n` : ''}${emergencyResults.timeToRescueHours ? `Kurtarma Zamanı: ${emergencyResults.timeToRescueHours.toFixed(2)} saat` : ''}`}</pre>
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
  );
};