import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Compass, Navigation, MapPin, Clock, Waves, Calculator, Radar, Sun, AlertTriangle } from "lucide-react";
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="w-5 h-5" />
          Seyir Hesaplamaları
        </CardTitle>
        <CardDescription>
          Formüllerle birebir eşleşen navigasyon hesaplamaları
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="great-circle" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="great-circle">Büyük Daire</TabsTrigger>
            <TabsTrigger value="rhumb-line">Rhumb Line</TabsTrigger>
            <TabsTrigger value="plane-sailing">Plane Sailing</TabsTrigger>
            <TabsTrigger value="time-eta">Zaman & ETA</TabsTrigger>
            <TabsTrigger value="current">Akıntı Üçgeni</TabsTrigger>
          </TabsList>

          <TabsContent value="great-circle" className="space-y-4">
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
            <Button onClick={handleGreatCircle} className="w-full">Hesapla</Button>
            {gcResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Mesafe:</strong> {gcResults.distance.toFixed(2)} nm</p>
                <p><strong>İlk Kerteriz (θ₀):</strong> {gcResults.initialCourse.toFixed(1)}°</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rhumb-line" className="space-y-4">
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
            <Button onClick={handleRhumbLine} className="w-full">Hesapla</Button>
            {rhumbResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Mesafe:</strong> {rhumbResults.distance.toFixed(2)} nm</p>
                <p><strong>Sabit Kerteriz:</strong> {rhumbResults.course.toFixed(1)}°</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="plane-sailing" className="space-y-4">
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
            <Button onClick={handlePlaneSailing} className="w-full">Hesapla</Button>
            {planeResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>dLat:</strong> {planeResults.dLatMin.toFixed(2)} dakika</p>
                <p><strong>Departure:</strong> {planeResults.depMin.toFixed(2)} dakika</p>
                <p><strong>Kurs:</strong> {planeResults.courseDeg.toFixed(1)}°</p>
                <p><strong>Mesafe:</strong> {planeResults.distanceNm.toFixed(2)} nm</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="time-eta" className="space-y-4">
            <div className="grid gap-4">
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
            <Button onClick={handleETA} className="w-full">Hesapla</Button>
            {etaResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Süre:</strong> {etaResults.hours.toFixed(2)} saat</p>
                <p><strong>Süre:</strong> {etaResults.hoursMinutes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="current" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current-course">İstenen Rota (TR) °</Label>
                <Input
                  id="current-course"
                  type="number"
                  placeholder="090"
                  value={currentInputs.course}
                  onChange={(e) => setCurrentInputs({...currentInputs, course: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="current-speed">Gemi Hızı (V) kn</Label>
                <Input
                  id="current-speed"
                  type="number"
                  placeholder="12"
                  value={currentInputs.speed}
                  onChange={(e) => setCurrentInputs({...currentInputs, speed: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="current-set">Akıntı Yönü (Set) °</Label>
                <Input
                  id="current-set"
                  type="number"
                  placeholder="045"
                  value={currentInputs.set}
                  onChange={(e) => setCurrentInputs({...currentInputs, set: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="current-drift">Akıntı Hızı (c) kn</Label>
                <Input
                  id="current-drift"
                  type="number"
                  placeholder="2"
                  value={currentInputs.drift}
                  onChange={(e) => setCurrentInputs({...currentInputs, drift: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleCurrent} className="w-full">Hesapla</Button>
            {currentResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Yönlendirilecek Kurs (CTS):</strong> {currentResults.courseToSteerDeg.toFixed(1)}°</p>
                <p><strong>Yer Üzeri Hız (SOG):</strong> {currentResults.groundSpeedKn.toFixed(1)} kn</p>
                <p><strong>Sürüklenme Açısı:</strong> {currentResults.driftAngleDeg.toFixed(1)}°</p>
                <p><strong>Uygulanabilir:</strong> {currentResults.feasible ? "Evet" : "Hayır"}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Additional tabs for other calculations */}
        <Tabs defaultValue="compass" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="compass">Pusula</TabsTrigger>
            <TabsTrigger value="cpa-tcpa">CPA/TCPA</TabsTrigger>
            <TabsTrigger value="sight-reduction">Sight Reduction</TabsTrigger>
            <TabsTrigger value="bearings">Kerteriz</TabsTrigger>
            <TabsTrigger value="distances">Mesafe</TabsTrigger>
          </TabsList>

          <TabsContent value="compass" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="compass">Pusula Kerterizi (Cc)</Label>
                <Input
                  id="compass"
                  type="number"
                  placeholder="090"
                  value={compassInputs.compass}
                  onChange={(e) => setCompassInputs({...compassInputs, compass: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="variation">Manyetik İnhiraf (Var)</Label>
                <Input
                  id="variation"
                  type="number"
                  placeholder="3.5"
                  value={compassInputs.variation}
                  onChange={(e) => setCompassInputs({...compassInputs, variation: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="deviation">Pusula Hatası (Dev)</Label>
                <Input
                  id="deviation"
                  type="number"
                  placeholder="-1.2"
                  value={compassInputs.deviation}
                  onChange={(e) => setCompassInputs({...compassInputs, deviation: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleCompass} className="w-full">Hesapla</Button>
            {compassResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Manyetik Kerteriz (Cm):</strong> {compassResults.magnetic.toFixed(1)}°</p>
                <p><strong>Gerçek Kerteriz (Ct):</strong> {compassResults.true.toFixed(1)}°</p>
                <p><strong>Toplam Hata:</strong> {compassResults.totalError.toFixed(1)}°</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cpa-tcpa" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hedef Kerterizi (°)</Label>
                <Input
                  type="number"
                  placeholder="045"
                  value={cpaInputs.bearing}
                  onChange={(e) => setCpaInputs({...cpaInputs, bearing: e.target.value})}
                />
              </div>
              <div>
                <Label>Hedef Mesafesi (nm)</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={cpaInputs.distance}
                  onChange={(e) => setCpaInputs({...cpaInputs, distance: e.target.value})}
                />
              </div>
              <div>
                <Label>Hedef Kursu (°)</Label>
                <Input
                  type="number"
                  placeholder="270"
                  value={cpaInputs.targetCourse}
                  onChange={(e) => setCpaInputs({...cpaInputs, targetCourse: e.target.value})}
                />
              </div>
              <div>
                <Label>Hedef Hızı (kn)</Label>
                <Input
                  type="number"
                  placeholder="15"
                  value={cpaInputs.targetSpeed}
                  onChange={(e) => setCpaInputs({...cpaInputs, targetSpeed: e.target.value})}
                />
              </div>
              <div>
                <Label>Kendi Kursumuz (°)</Label>
                <Input
                  type="number"
                  placeholder="000"
                  value={cpaInputs.ownCourse}
                  onChange={(e) => setCpaInputs({...cpaInputs, ownCourse: e.target.value})}
                />
              </div>
              <div>
                <Label>Kendi Hızımız (kn)</Label>
                <Input
                  type="number"
                  placeholder="12"
                  value={cpaInputs.ownSpeed}
                  onChange={(e) => setCpaInputs({...cpaInputs, ownSpeed: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleCPA} className="w-full">Hesapla</Button>
            {cpaResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>CPA Mesafesi:</strong> {cpaResults.cpaNm.toFixed(2)} nm</p>
                <p><strong>TCPA:</strong> {cpaResults.tcpaMin.toFixed(1)} dakika</p>
                <p><strong>Göreceli Hız:</strong> {cpaResults.relativeSpeedKn.toFixed(1)} kn</p>
                <p><strong>Göreceli Kerteriz:</strong> {cpaResults.relativeBearingDeg.toFixed(1)}°</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sight-reduction" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Gözlemci Enlemi (φ)</Label>
                <Input
                  type="number"
                  placeholder="41.0"
                  value={sightInputs.lat}
                  onChange={(e) => setSightInputs({...sightInputs, lat: e.target.value})}
                />
              </div>
              <div>
                <Label>Gök Cisminin Deklinasyonu (δ)</Label>
                <Input
                  type="number"
                  placeholder="23.5"
                  value={sightInputs.dec}
                  onChange={(e) => setSightInputs({...sightInputs, dec: e.target.value})}
                />
              </div>
              <div>
                <Label>Yerel Saat Açısı (LHA)</Label>
                <Input
                  type="number"
                  placeholder="45"
                  value={sightInputs.lha}
                  onChange={(e) => setSightInputs({...sightInputs, lha: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleSightReduction} className="w-full">Hesapla</Button>
            {sightResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Hesaplanan Yükseklik (Hc):</strong> {sightResults.hcDeg.toFixed(2)}°</p>
                <p><strong>Azimut (Z):</strong> {sightResults.azimuthDeg.toFixed(1)}°</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bearings" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Kerteriz Tipi</Label>
                <Select value={bearingInputs.type} onValueChange={(value) => setBearingInputs({...bearingInputs, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doubling">Doubling the Angle</SelectItem>
                    <SelectItem value="four">Four Point Bearing</SelectItem>
                    <SelectItem value="seven">Seven Point Bearing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {bearingInputs.type === "doubling" && (
                <div>
                  <Label>İlk Açı (°)</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={bearingInputs.angle}
                    onChange={(e) => setBearingInputs({...bearingInputs, angle: e.target.value})}
                  />
                </div>
              )}
              <div>
                <Label>Koşulan Mesafe (nm)</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={bearingInputs.run}
                  onChange={(e) => setBearingInputs({...bearingInputs, run: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleBearing} className="w-full">Hesapla</Button>
            {bearingResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Mesafe:</strong> {bearingResults.distanceOffNm.toFixed(2)} nm</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="distances" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Mesafe Tipi</Label>
                <Select value={distanceInputs.type} onValueChange={(value) => setDistanceInputs({...distanceInputs, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dip">Dip (Horizon) Distance</SelectItem>
                    <SelectItem value="radar">Radar Horizon</SelectItem>
                    <SelectItem value="light">Işık Görünürlüğü</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Göz/Radar Yüksekliği (m)</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={distanceInputs.height}
                  onChange={(e) => setDistanceInputs({...distanceInputs, height: e.target.value})}
                />
              </div>
              {distanceInputs.type === "light" && (
                <div>
                  <Label>Işık Yüksekliği (m)</Label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={distanceInputs.lightHeight}
                    onChange={(e) => setDistanceInputs({...distanceInputs, lightHeight: e.target.value})}
                  />
                </div>
              )}
            </div>
            <Button onClick={handleDistance} className="w-full">Hesapla</Button>
            {distanceResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Mesafe:</strong> {distanceResults.distanceNm.toFixed(2)} nm</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Third set of tabs */}
        <Tabs defaultValue="tides" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tides">Gelgit</TabsTrigger>
            <TabsTrigger value="turning">Dönüş</TabsTrigger>
            <TabsTrigger value="weather">Hava</TabsTrigger>
            <TabsTrigger value="celestial">Göksel</TabsTrigger>
            <TabsTrigger value="emergency">Acil Durum</TabsTrigger>
          </TabsList>

          <TabsContent value="tides" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Saat (1-6)</Label>
                <Input
                  type="number"
                  min="1"
                  max="6"
                  placeholder="3"
                  value={tideInputs.hour}
                  onChange={(e) => setTideInputs({...tideInputs, hour: e.target.value})}
                />
              </div>
              <div>
                <Label>Gelgit Farkı (m)</Label>
                <Input
                  type="number"
                  placeholder="4.2"
                  value={tideInputs.range}
                  onChange={(e) => setTideInputs({...tideInputs, range: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleTide} className="w-full">Hesapla (Rule of Twelfths)</Button>
            {tideResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Gelgit Yüksekliği:</strong> {tideResults.heightM.toFixed(2)} m</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="turning" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Gemi Boyu (m)</Label>
                <Input
                  type="number"
                  placeholder="200"
                  value={turningInputs.length}
                  onChange={(e) => setTurningInputs({...turningInputs, length: e.target.value})}
                />
              </div>
              <div>
                <Label>Kurs Değişikliği (°)</Label>
                <Input
                  type="number"
                  placeholder="90"
                  value={turningInputs.courseChange}
                  onChange={(e) => setTurningInputs({...turningInputs, courseChange: e.target.value})}
                />
              </div>
              <div>
                <Label>Hız (kn)</Label>
                <Input
                  type="number"
                  placeholder="12"
                  value={turningInputs.speed}
                  onChange={(e) => setTurningInputs({...turningInputs, speed: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleTurning} className="w-full">Hesapla</Button>
            {turningResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Tactical Diameter:</strong> {turningResults.tacticalDiameterM.toFixed(0)} m</p>
                <p><strong>Advance:</strong> {turningResults.advanceM.toFixed(0)} m</p>
                <p><strong>Transfer:</strong> {turningResults.transferM.toFixed(0)} m</p>
                <p><strong>ROT:</strong> {turningResults.rotDegPerMin.toFixed(1)} °/min</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="weather" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Beaufort Numarası</Label>
                <Input
                  type="number"
                  min="0"
                  max="12"
                  placeholder="6"
                  value={weatherInputs.beaufort}
                  onChange={(e) => setWeatherInputs({...weatherInputs, beaufort: e.target.value})}
                />
              </div>
              <div>
                <Label>Rüzgar Hızı (kn)</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={weatherInputs.windSpeed}
                  onChange={(e) => setWeatherInputs({...weatherInputs, windSpeed: e.target.value})}
                />
              </div>
              <div>
                <Label>Gemi Hızı (kn)</Label>
                <Input
                  type="number"
                  placeholder="12"
                  value={weatherInputs.shipSpeed}
                  onChange={(e) => setWeatherInputs({...weatherInputs, shipSpeed: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleWeather} className="w-full">Hesapla</Button>
            {weatherResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                {weatherResults.windSpeedKn && <p><strong>Rüzgar Hızı:</strong> {weatherResults.windSpeedKn.toFixed(1)} kn</p>}
                {weatherResults.waveHeightM && <p><strong>Dalga Yüksekliği:</strong> {weatherResults.waveHeightM.toFixed(1)} m</p>}
                {weatherResults.leewayAngleDeg && <p><strong>Sürüklenme Açısı:</strong> {weatherResults.leewayAngleDeg.toFixed(1)}°</p>}
              </div>
            )}
          </TabsContent>

          <TabsContent value="celestial" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Hesaplama Tipi</Label>
                <Select value={celestialInputs.type} onValueChange={(value) => setCelestialInputs({...celestialInputs, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meridian">Meridian Passage</SelectItem>
                    <SelectItem value="amplitude">Amplitude</SelectItem>
                    <SelectItem value="sunrise">Sunrise/Sunset Bearing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Enlem (°)</Label>
                <Input
                  type="number"
                  placeholder="41.0"
                  value={celestialInputs.lat}
                  onChange={(e) => setCelestialInputs({...celestialInputs, lat: e.target.value})}
                />
              </div>
              <div>
                <Label>Deklinasyon (°)</Label>
                <Input
                  type="number"
                  placeholder="23.5"
                  value={celestialInputs.dec}
                  onChange={(e) => setCelestialInputs({...celestialInputs, dec: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleCelestial} className="w-full">Hesapla</Button>
            {celestialResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                {celestialResults.latitudeDeg && <p><strong>Enlem:</strong> {celestialResults.latitudeDeg.toFixed(2)}°</p>}
                {celestialResults.amplitudeDeg && <p><strong>Amplitude:</strong> {celestialResults.amplitudeDeg.toFixed(1)}°</p>}
                {celestialResults.bearingDeg && <p><strong>Kerteriz:</strong> {celestialResults.bearingDeg.toFixed(1)}°</p>}
              </div>
            )}
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Arama Tipi</Label>
                <Select value={emergencyInputs.type} onValueChange={(value) => setEmergencyInputs({...emergencyInputs, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square Search</SelectItem>
                    <SelectItem value="sector">Sector Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {emergencyInputs.type === "square" && (
                <div>
                  <Label>Track Spacing (nm)</Label>
                  <Input
                    type="number"
                    placeholder="2"
                    value={emergencyInputs.trackSpacing}
                    onChange={(e) => setEmergencyInputs({...emergencyInputs, trackSpacing: e.target.value})}
                  />
                </div>
              )}
              {emergencyInputs.type === "sector" && (
                <div>
                  <Label>İlk Yarıçap (nm)</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={emergencyInputs.radius}
                    onChange={(e) => setEmergencyInputs({...emergencyInputs, radius: e.target.value})}
                  />
                </div>
              )}
            </div>
            <Button onClick={handleEmergency} className="w-full">Hesapla</Button>
            {emergencyResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                {emergencyResults.legDistanceNm && <p><strong>Leg Mesafesi:</strong> {emergencyResults.legDistanceNm.toFixed(1)} nm</p>}
                {emergencyResults.newRadiusNm && <p><strong>Yeni Yarıçap:</strong> {emergencyResults.newRadiusNm.toFixed(1)} nm</p>}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};