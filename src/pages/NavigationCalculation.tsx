import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CoordinateInput } from "@/components/ui/coordinate-input";
import { ArrowLeft, Calculator } from "lucide-react";
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
  type EmergencyInput,
} from "@/components/calculations/navigationMath";
import { emptyDMS, dmsToDecimal, formatDecimalAsDMS, type DMSCoordinate } from "@/utils/coordinateUtils";

type CalcId =
  | "gc"
  | "rhumb"
  | "plane"
  | "eta"
  | "current"
  | "compass"
  | "cpa"
  | "sight"
  | "bearings"
  | "distance"
  | "tides"
  | "turning"
  | "weather"
  | "celestial"
  | "emergency";

const CALC_TITLES: Record<CalcId, string> = {
  gc: "Büyük Daire (Great Circle)",
  rhumb: "Rhumb Line (Mercator)",
  plane: "Plane Sailing",
  eta: "Zaman ve ETA",
  current: "Akıntı Üçgeni (CTS)",
  compass: "Pusula Dönüşümleri",
  cpa: "CPA / TCPA",
  sight: "Sight Reduction",
  bearings: "Kerteriz Hesaplamaları",
  distance: "Mesafe Hesaplamaları",
  tides: "Gelgit Hesaplamaları",
  turning: "Dönüş Hesaplamaları",
  weather: "Hava Durumu",
  celestial: "Göksel Navigasyon",
  emergency: "Acil Durum",
};

export default function NavigationCalculationPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = (params.id as CalcId) || ("gc" as CalcId);

  const title = useMemo(() => CALC_TITLES[id] ?? "Hesaplama", [id]);

  // Shared state buckets (each section maintains its own minimal state)
  const [gcInputs, setGcInputs] = useState({ 
    lat1: emptyDMS(true), 
    lon1: emptyDMS(false), 
    lat2: emptyDMS(true), 
    lon2: emptyDMS(false) 
  });
  const [gcResults, setGcResults] = useState<any>(null);

  const [rhumbInputs, setRhumbInputs] = useState({ 
    lat1: emptyDMS(true), 
    lon1: emptyDMS(false), 
    lat2: emptyDMS(true), 
    lon2: emptyDMS(false) 
  });
  const [rhumbResults, setRhumbResults] = useState<any>(null);

  const [planeInputs, setPlaneInputs] = useState({ 
    lat1: emptyDMS(true), 
    lon1: emptyDMS(false), 
    lat2: emptyDMS(true), 
    lon2: emptyDMS(false) 
  });
  const [planeResults, setPlaneResults] = useState<any>(null);

  const [etaInputs, setEtaInputs] = useState({ distance: "", speed: "" });
  const [etaResults, setEtaResults] = useState<any>(null);

  const [currentInputs, setCurrentInputs] = useState({ course: "", speed: "", set: "", drift: "" });
  const [currentResults, setCurrentResults] = useState<any>(null);

  const [compassInputs, setCompassInputs] = useState({ compass: "", variation: "", deviation: "" });
  const [compassResults, setCompassResults] = useState<any>(null);

  const [cpaInputs, setCpaInputs] = useState({ bearing: "", distance: "", targetCourse: "", targetSpeed: "", ownCourse: "", ownSpeed: "" });
  const [cpaResults, setCpaResults] = useState<any>(null);

  const [sightInputs, setSightInputs] = useState({ 
    lat: emptyDMS(true), 
    dec: emptyDMS(true), 
    lha: "" 
  });
  const [sightResults, setSightResults] = useState<any>(null);

  const [bearingInputs, setBearingInputs] = useState({ angle: "", run: "", type: "doubling" as "doubling" | "four" | "seven" });
  const [bearingResults, setBearingResults] = useState<any>(null);

  const [distanceInputs, setDistanceInputs] = useState({ height: "", type: "dip" as "dip" | "radar" | "light", lightHeight: "" });
  const [distanceResults, setDistanceResults] = useState<any>(null);

  const [tideInputs, setTideInputs] = useState({ hour: "", range: "" });
  const [tideTableInputs, setTideTableInputs] = useState({ lowTide: "", highTide: "", lowTideTime: "06:00" });
  const [tideTable, setTideTable] = useState<Array<{ time: string; height: number; change: number; status: string }>>([]);
  const [tideResults, setTideResults] = useState<any>(null);

  const [turningInputs, setTurningInputs] = useState({ length: "", courseChange: "", speed: "" });
  const [turningResults, setTurningResults] = useState<any>(null);

  const [weatherInputs, setWeatherInputs] = useState({ beaufort: "", windSpeed: "", windArea: "", shipSpeed: "" });
  const [weatherResults, setWeatherResults] = useState<any>(null);

  const [celestialInputs, setCelestialInputs] = useState({ 
    lat: emptyDMS(true), 
    dec: emptyDMS(true), 
    type: "meridian" as "meridian" | "amplitude" | "sunrise" 
  });
  const [celestialResults, setCelestialResults] = useState<any>(null);

  const [emergencyInputs, setEmergencyInputs] = useState({ type: "square" as "square" | "sector", trackSpacing: "", radius: "", distance: "", rescueSpeed: "", driftSpeed: "" });
  const [emergencyResults, setEmergencyResults] = useState<any>(null);

  const onCalculate = () => {
    try {
      switch (id) {
        case "gc": {
          const result = calculateGreatCircle(
            dmsToDecimal(gcInputs.lat1),
            dmsToDecimal(gcInputs.lon1),
            dmsToDecimal(gcInputs.lat2),
            dmsToDecimal(gcInputs.lon2)
          );
          setGcResults(result);
          break;
        }
        case "rhumb": {
          const result = calculateRhumbLine(
            dmsToDecimal(rhumbInputs.lat1),
            dmsToDecimal(rhumbInputs.lon1),
            dmsToDecimal(rhumbInputs.lat2),
            dmsToDecimal(rhumbInputs.lon2)
          );
          setRhumbResults(result);
          break;
        }
        case "plane": {
          const input: PlaneSailingInput = {
            lat1Deg: dmsToDecimal(planeInputs.lat1),
            lon1Deg: dmsToDecimal(planeInputs.lon1),
            lat2Deg: dmsToDecimal(planeInputs.lat2),
            lon2Deg: dmsToDecimal(planeInputs.lon2),
          };
          const result = calculatePlaneSailing(input);
          setPlaneResults(result);
          break;
        }
        case "eta": {
          const hours = calculateEtaHours(parseFloat(etaInputs.distance), parseFloat(etaInputs.speed));
          setEtaResults({ hours, hoursMinutes: `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m` });
          break;
        }
        case "current": {
          const input: CurrentTriangleInput = {
            courseDeg: parseFloat(currentInputs.course),
            speedKn: parseFloat(currentInputs.speed),
            setDeg: parseFloat(currentInputs.set),
            driftKn: parseFloat(currentInputs.drift),
          };
          const result = solveCurrentTriangle(input);
          setCurrentResults(result);
          break;
        }
        case "compass": {
          const result = calculateCompassTotalError(
            parseFloat(compassInputs.variation),
            parseFloat(compassInputs.deviation)
          );
          const compass = parseFloat(compassInputs.compass);
          setCompassResults({
            magnetic: compass + parseFloat(compassInputs.deviation || "0"),
            true: compass + parseFloat(compassInputs.variation || "0") + parseFloat(compassInputs.deviation || "0"),
            totalError: result.totalErrorDeg,
          });
          break;
        }
        case "cpa": {
          const input: ARPAInput = {
            targetBearingDeg: parseFloat(cpaInputs.bearing),
            targetDistanceNm: parseFloat(cpaInputs.distance),
            targetCourseDeg: parseFloat(cpaInputs.targetCourse),
            targetSpeedKn: parseFloat(cpaInputs.targetSpeed),
            ownCourseDeg: parseFloat(cpaInputs.ownCourse) || 0,
            ownSpeedKn: parseFloat(cpaInputs.ownSpeed) || 0,
          };
          const result = computeArpaCpaTcpa(input);
          setCpaResults(result);
          break;
        }
        case "sight": {
          const input: SightReductionInput = {
            latDeg: dmsToDecimal(sightInputs.lat),
            decDeg: dmsToDecimal(sightInputs.dec),
            lhaDeg: parseFloat(sightInputs.lha),
          };
          const result = calculateSightReduction(input);
          setSightResults(result);
          break;
        }
        case "bearings": {
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
          break;
        }
        case "distance": {
          const input: DistanceCalculationInput = {
            heightM: parseFloat(distanceInputs.height),
            type: distanceInputs.type,
            lightHeightM: distanceInputs.lightHeight ? parseFloat(distanceInputs.lightHeight) : undefined,
          } as DistanceCalculationInput;
          const result = calculateDistance(input);
          setDistanceResults(result);
          break;
        }
        case "tides": {
          const input: TideInput = {
            hour: parseInt(tideInputs.hour),
            tidalRangeM: parseFloat(tideInputs.range),
          };
          const result = calculateTide(input);
          setTideResults(result);
          break;
        }
        case "turning": {
          const input: TurningCalculationInput = {
            shipLengthM: parseFloat(turningInputs.length),
            courseChangeDeg: parseFloat(turningInputs.courseChange),
            speedKn: parseFloat(turningInputs.speed),
          };
          const result = calculateTurning(input);
          setTurningResults(result);
          break;
        }
        case "weather": {
          const input: WeatherCalculationInput = {
            beaufortNumber: weatherInputs.beaufort ? parseInt(weatherInputs.beaufort) : undefined,
            windSpeedKn: weatherInputs.windSpeed ? parseFloat(weatherInputs.windSpeed) : undefined,
            windAreaM2: weatherInputs.windArea ? parseFloat(weatherInputs.windArea) : undefined,
            shipSpeedKn: weatherInputs.shipSpeed ? parseFloat(weatherInputs.shipSpeed) : undefined,
          };
          const result = calculateWeather(input);
          setWeatherResults(result);
          break;
        }
        case "celestial": {
          const input: CelestialInput = {
            latDeg: dmsToDecimal(celestialInputs.lat),
            decDeg: dmsToDecimal(celestialInputs.dec),
            type: celestialInputs.type,
          };
          const result = calculateCelestial(input);
          setCelestialResults(result);
          break;
        }
        case "emergency": {
          const input: EmergencyInput = {
            searchType: emergencyInputs.type,
            trackSpacingNm: emergencyInputs.trackSpacing ? parseFloat(emergencyInputs.trackSpacing) : undefined,
            initialRadiusNm: emergencyInputs.radius ? parseFloat(emergencyInputs.radius) : undefined,
            distanceNm: emergencyInputs.distance ? parseFloat(emergencyInputs.distance) : undefined,
            rescueSpeedKn: emergencyInputs.rescueSpeed ? parseFloat(emergencyInputs.rescueSpeed) : undefined,
            driftSpeedKn: emergencyInputs.driftSpeed ? parseFloat(emergencyInputs.driftSpeed) : undefined,
          };
          const result = calculateEmergency(input);
          setEmergencyResults(result);
          break;
        }
      }
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const generateTideTable = () => {
    try {
      const lowTide = parseFloat(tideTableInputs.lowTide);
      const highTide = parseFloat(tideTableInputs.highTide);
      if (!isFinite(lowTide) || !isFinite(highTide)) return;
      const tidalRange = highTide - lowTide;

      const [hh, mm] = tideTableInputs.lowTideTime.split(":").map((v) => parseInt(v, 10));
      const base = new Date();
      base.setHours(isFinite(hh) ? hh : 0, isFinite(mm) ? mm : 0, 0, 0);

      const fractions = [0, 1 / 12, 3 / 12, 6 / 12, 9 / 12, 11 / 12, 12 / 12];

      const rows: Array<{ time: string; height: number; change: number; status: string }> = [];
      for (let i = 0; i < 12; i++) {
        const time = new Date(base.getTime() + i * 60 * 60 * 1000);
        const timeStr = time.toTimeString().slice(0, 5);

        const cycleHour = i % 6; // 0..5
        const isRising = Math.floor(i / 6) % 2 === 0; // first 6 hours rising, next 6 falling

        let height: number;
        let status: string;
        if (isRising) {
          height = lowTide + tidalRange * fractions[cycleHour];
          status = cycleHour === 0 ? "Alçak Su" : cycleHour === 5 ? "Yüksek Su" : "Yükseliyor";
        } else {
          height = highTide - tidalRange * fractions[cycleHour];
          status = cycleHour === 0 ? "Yüksek Su" : cycleHour === 5 ? "Alçak Su" : "Alçalıyor";
        }

        const prevHeight = i > 0 ? rows[i - 1].height : height;
        rows.push({ time: timeStr, height, change: height - prevHeight, status });
      }

      setTideTable(rows);
    } catch (e) {
      // noop
    }
  };

  const renderInputs = () => {
    switch (id) {
      case "gc":
        return (
          <div className="space-y-4">
            <CoordinateInput
              id="gc-lat1"
              label="Başlangıç Enlemi (φ₁)"
              value={gcInputs.lat1}
              onChange={(val) => setGcInputs({ ...gcInputs, lat1: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="gc-lon1"
              label="Başlangıç Boylamı (λ₁)"
              value={gcInputs.lon1}
              onChange={(val) => setGcInputs({ ...gcInputs, lon1: val })}
              isLatitude={false}
            />
            <CoordinateInput
              id="gc-lat2"
              label="Hedef Enlemi (φ₂)"
              value={gcInputs.lat2}
              onChange={(val) => setGcInputs({ ...gcInputs, lat2: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="gc-lon2"
              label="Hedef Boylamı (λ₂)"
              value={gcInputs.lon2}
              onChange={(val) => setGcInputs({ ...gcInputs, lon2: val })}
              isLatitude={false}
            />
          </div>
        );
      case "rhumb":
        return (
          <div className="space-y-4">
            <CoordinateInput
              id="rl-lat1"
              label="Başlangıç Enlemi"
              value={rhumbInputs.lat1}
              onChange={(val) => setRhumbInputs({ ...rhumbInputs, lat1: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="rl-lon1"
              label="Başlangıç Boylamı"
              value={rhumbInputs.lon1}
              onChange={(val) => setRhumbInputs({ ...rhumbInputs, lon1: val })}
              isLatitude={false}
            />
            <CoordinateInput
              id="rl-lat2"
              label="Hedef Enlemi"
              value={rhumbInputs.lat2}
              onChange={(val) => setRhumbInputs({ ...rhumbInputs, lat2: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="rl-lon2"
              label="Hedef Boylamı"
              value={rhumbInputs.lon2}
              onChange={(val) => setRhumbInputs({ ...rhumbInputs, lon2: val })}
              isLatitude={false}
            />
          </div>
        );
      case "plane":
        return (
          <div className="space-y-4">
            <CoordinateInput
              id="ps-lat1"
              label="Başlangıç Enlemi"
              value={planeInputs.lat1}
              onChange={(val) => setPlaneInputs({ ...planeInputs, lat1: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="ps-lon1"
              label="Başlangıç Boylamı"
              value={planeInputs.lon1}
              onChange={(val) => setPlaneInputs({ ...planeInputs, lon1: val })}
              isLatitude={false}
            />
            <CoordinateInput
              id="ps-lat2"
              label="Hedef Enlemi"
              value={planeInputs.lat2}
              onChange={(val) => setPlaneInputs({ ...planeInputs, lat2: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="ps-lon2"
              label="Hedef Boylamı"
              value={planeInputs.lon2}
              onChange={(val) => setPlaneInputs({ ...planeInputs, lon2: val })}
              isLatitude={false}
            />
          </div>
        );
      case "eta":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eta-distance">Mesafe (nm)</Label>
              <Input id="eta-distance" type="number" placeholder="" value={etaInputs.distance} onChange={(e) => setEtaInputs({ ...etaInputs, distance: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="eta-speed">Hız (knot)</Label>
              <Input id="eta-speed" type="number" placeholder="" value={etaInputs.speed} onChange={(e) => setEtaInputs({ ...etaInputs, speed: e.target.value })} />
            </div>
          </div>
        );
      case "current":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ct-course">İstenen Rota (°)</Label>
              <Input id="ct-course" type="number" placeholder="045" value={currentInputs.course} onChange={(e) => setCurrentInputs({ ...currentInputs, course: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ct-speed">Gemi Sürati (kn)</Label>
              <Input id="ct-speed" type="number" placeholder="" value={currentInputs.speed} onChange={(e) => setCurrentInputs({ ...currentInputs, speed: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ct-set">Akıntı İstikameti (°)</Label>
              <Input id="ct-set" type="number" placeholder="090" value={currentInputs.set} onChange={(e) => setCurrentInputs({ ...currentInputs, set: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ct-drift">Akıntı Sürati (kn)</Label>
              <Input id="ct-drift" type="number" placeholder="2" value={currentInputs.drift} onChange={(e) => setCurrentInputs({ ...currentInputs, drift: e.target.value })} />
            </div>
          </div>
        );
      case "compass":
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="comp-compass">Pusula Okuyuşu (°)</Label>
              <Input id="comp-compass" type="number" placeholder="" value={compassInputs.compass} onChange={(e) => setCompassInputs({ ...compassInputs, compass: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="comp-variation">Varyasyon (° E(+) W(-))</Label>
              <Input id="comp-variation" type="number" placeholder="" value={compassInputs.variation} onChange={(e) => setCompassInputs({ ...compassInputs, variation: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="comp-deviation">Deviasyon (° E(+) W(-))</Label>
              <Input id="comp-deviation" type="number" placeholder="" value={compassInputs.deviation} onChange={(e) => setCompassInputs({ ...compassInputs, deviation: e.target.value })} />
            </div>
          </div>
        );
      case "cpa":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cpa-bearing">Hedef Kerterizi (°)</Label>
              <Input id="cpa-bearing" type="number" placeholder="" value={cpaInputs.bearing} onChange={(e) => setCpaInputs({ ...cpaInputs, bearing: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cpa-distance">Hedef Mesafesi (nm)</Label>
              <Input id="cpa-distance" type="number" placeholder="" value={cpaInputs.distance} onChange={(e) => setCpaInputs({ ...cpaInputs, distance: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cpa-tcourse">Hedef Rotası (°)</Label>
              <Input id="cpa-tcourse" type="number" placeholder="" value={cpaInputs.targetCourse} onChange={(e) => setCpaInputs({ ...cpaInputs, targetCourse: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cpa-tspeed">Hedef Sürati (kn)</Label>
              <Input id="cpa-tspeed" type="number" placeholder="" value={cpaInputs.targetSpeed} onChange={(e) => setCpaInputs({ ...cpaInputs, targetSpeed: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cpa-ocourse">Kendi Rotamız (°)</Label>
              <Input id="cpa-ocourse" type="number" placeholder="" value={cpaInputs.ownCourse} onChange={(e) => setCpaInputs({ ...cpaInputs, ownCourse: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cpa-ospeed">Kendi Süratimiz (kn)</Label>
              <Input id="cpa-ospeed" type="number" placeholder="" value={cpaInputs.ownSpeed} onChange={(e) => setCpaInputs({ ...cpaInputs, ownSpeed: e.target.value })} />
            </div>
          </div>
        );
      case "sight":
        return (
          <div className="space-y-4">
            <CoordinateInput
              id="sight-lat"
              label="Tahmini Enlem"
              value={sightInputs.lat}
              onChange={(val) => setSightInputs({ ...sightInputs, lat: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="sight-dec"
              label="Deklinasyon"
              value={sightInputs.dec}
              onChange={(val) => setSightInputs({ ...sightInputs, dec: val })}
              isLatitude={true}
            />
            <div>
              <Label htmlFor="sight-lha" data-translatable>LHA (°)</Label>
              <Input id="sight-lha" type="number" placeholder="" value={sightInputs.lha} onChange={(e) => setSightInputs({ ...sightInputs, lha: e.target.value })} />
            </div>
          </div>
        );
      case "bearings":
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="bearing-type">Hesaplama Türü</Label>
              <Select value={bearingInputs.type} onValueChange={(value) => setBearingInputs({ ...bearingInputs, type: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doubling">Doubling Angle on Bow</SelectItem>
                  <SelectItem value="four">Four Point Bearing</SelectItem>
                  <SelectItem value="seven">Special Angle Bearing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {bearingInputs.type === "doubling" && (
              <div>
                <Label htmlFor="bearing-angle">İlk Açı (°)</Label>
                <Input id="bearing-angle" type="number" placeholder="" value={bearingInputs.angle} onChange={(e) => setBearingInputs({ ...bearingInputs, angle: e.target.value })} />
              </div>
            )}
            <div>
              <Label htmlFor="bearing-run">Koşulan Mesafe (nm)</Label>
              <Input id="bearing-run" type="number" placeholder="" value={bearingInputs.run} onChange={(e) => setBearingInputs({ ...bearingInputs, run: e.target.value })} />
            </div>
          </div>
        );
      case "distance":
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="distance-type">Hesaplama Türü</Label>
              <Select value={distanceInputs.type} onValueChange={(value) => setDistanceInputs({ ...distanceInputs, type: value as any })}>
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
              <Input id="distance-height" type="number" placeholder="" value={distanceInputs.height} onChange={(e) => setDistanceInputs({ ...distanceInputs, height: e.target.value })} />
            </div>
            {distanceInputs.type === "light" && (
              <div>
                <Label htmlFor="distance-light">Işık Yüksekliği (m)</Label>
                <Input id="distance-light" type="number" placeholder="" value={distanceInputs.lightHeight} onChange={(e) => setDistanceInputs({ ...distanceInputs, lightHeight: e.target.value })} />
              </div>
            )}
          </div>
        );
      case "tides":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tide-hour">Saat (1-6)</Label>
                <Input id="tide-hour" type="number" min={1} max={6} placeholder="" value={tideInputs.hour} onChange={(e) => setTideInputs({ ...tideInputs, hour: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="tide-range">Gelgit Aralığı (m)</Label>
                <Input id="tide-range" type="number" placeholder="" value={tideInputs.range} onChange={(e) => setTideInputs({ ...tideInputs, range: e.target.value })} />
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30">
              <h4 className="font-semibold mb-3">Gelgit Tablosu</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tt-low">Alçak Su (m)</Label>
                  <Input id="tt-low" type="number" placeholder="" value={tideTableInputs.lowTide} onChange={(e) => setTideTableInputs({ ...tideTableInputs, lowTide: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="tt-high">Yüksek Su (m)</Label>
                  <Input id="tt-high" type="number" placeholder="" value={tideTableInputs.highTide} onChange={(e) => setTideTableInputs({ ...tideTableInputs, highTide: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="tt-time">Alçak Su Zamanı</Label>
                  <Input id="tt-time" type="time" value={tideTableInputs.lowTideTime} onChange={(e) => setTideTableInputs({ ...tideTableInputs, lowTideTime: e.target.value })} />
                </div>
              </div>
              <div className="mt-3">
                <Button variant="secondary" className="w-full" type="button" onClick={generateTideTable}>Gelgit Tablosu Oluştur</Button>
              </div>
            </div>

            {tideTable.length > 0 && (
              <div className="rounded border p-3 bg-muted/30">
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
                      {tideTable.map((row, i) => (
                        <tr key={i} className={`border-b ${row.status === 'Yüksek Su' || row.status === 'Alçak Su' ? 'bg-primary/10' : ''}`}>
                          <td className="p-2 font-mono">{row.time}</td>
                          <td className="p-2 font-mono">{row.height.toFixed(2)}</td>
                          <td className="p-2 font-mono">{row.change > 0 ? '+' : ''}{row.change.toFixed(2)}</td>
                          <td className={`p-2 ${row.status === 'Yükseliyor' ? 'text-green-600' : row.status === 'Alçalıyor' ? 'text-red-600' : 'text-blue-600'}`}>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      case "turning":
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="turn-length">Gemi Boyu (m)</Label>
              <Input id="turn-length" type="number" placeholder="200" value={turningInputs.length} onChange={(e) => setTurningInputs({ ...turningInputs, length: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="turn-change">Rota Değişikliği (°)</Label>
              <Input id="turn-change" type="number" placeholder="90" value={turningInputs.courseChange} onChange={(e) => setTurningInputs({ ...turningInputs, courseChange: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="turn-speed">Sürat (knot)</Label>
              <Input id="turn-speed" type="number" placeholder="" value={turningInputs.speed} onChange={(e) => setTurningInputs({ ...turningInputs, speed: e.target.value })} />
            </div>
          </div>
        );
      case "weather":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weather-beaufort">Beaufort Sayısı</Label>
              <Input id="weather-beaufort" type="number" min={0} max={12} placeholder="" value={weatherInputs.beaufort} onChange={(e) => setWeatherInputs({ ...weatherInputs, beaufort: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="weather-windspeed">Rüzgar Hızı (knot)</Label>
              <Input id="weather-windspeed" type="number" placeholder="" value={weatherInputs.windSpeed} onChange={(e) => setWeatherInputs({ ...weatherInputs, windSpeed: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="weather-area">Rüzgar Alanı (m²)</Label>
              <Input id="weather-area" type="number" placeholder="" value={weatherInputs.windArea} onChange={(e) => setWeatherInputs({ ...weatherInputs, windArea: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="weather-ship">Gemi Sürati (knot)</Label>
              <Input id="weather-ship" type="number" placeholder="" value={weatherInputs.shipSpeed} onChange={(e) => setWeatherInputs({ ...weatherInputs, shipSpeed: e.target.value })} />
            </div>
          </div>
        );
      case "celestial":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="celestial-type" data-translatable>Hesaplama Türü</Label>
              <Select value={celestialInputs.type} onValueChange={(value) => setCelestialInputs({ ...celestialInputs, type: value as any })}>
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
            <CoordinateInput
              id="celestial-lat"
              label="Enlem"
              value={celestialInputs.lat}
              onChange={(val) => setCelestialInputs({ ...celestialInputs, lat: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="celestial-dec"
              label="Deklinasyon"
              value={celestialInputs.dec}
              onChange={(val) => setCelestialInputs({ ...celestialInputs, dec: val })}
              isLatitude={true}
            />
          </div>
        );
      case "emergency":
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="emergency-type">Arama Türü</Label>
              <Select value={emergencyInputs.type} onValueChange={(value) => setEmergencyInputs({ ...emergencyInputs, type: value as any })}>
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
                <Input id="emergency-spacing" type="number" placeholder="" value={emergencyInputs.trackSpacing} onChange={(e) => setEmergencyInputs({ ...emergencyInputs, trackSpacing: e.target.value })} />
              </div>
            )}
            {emergencyInputs.type === "sector" && (
              <div>
                <Label htmlFor="emergency-radius">İlk Yarıçap (nm)</Label>
                <Input id="emergency-radius" type="number" placeholder="" value={emergencyInputs.radius} onChange={(e) => setEmergencyInputs({ ...emergencyInputs, radius: e.target.value })} />
              </div>
            )}
            <div>
              <Label htmlFor="emergency-distance">Mesafe (nm)</Label>
              <Input id="emergency-distance" type="number" placeholder="" value={emergencyInputs.distance} onChange={(e) => setEmergencyInputs({ ...emergencyInputs, distance: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="emergency-rescue">Kurtarma Sürati (knot)</Label>
              <Input id="emergency-rescue" type="number" placeholder="" value={emergencyInputs.rescueSpeed} onChange={(e) => setEmergencyInputs({ ...emergencyInputs, rescueSpeed: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="emergency-drift">Sürüklenme Sürati (knot)</Label>
              <Input id="emergency-drift" type="number" placeholder="" value={emergencyInputs.driftSpeed} onChange={(e) => setEmergencyInputs({ ...emergencyInputs, driftSpeed: e.target.value })} />
            </div>
          </div>
        );
    }
  };

  const renderResults = () => {
    switch (id) {
      case "gc":
        return (
          gcResults && (
            <div className="space-y-2">
              <div className="font-semibold text-primary" data-translatable>Büyük Daire Seyri Sonuçları:</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground" data-translatable>Mesafe:</span>
                  <div className="font-mono font-semibold">{gcResults.distance.toFixed(2)} nm</div>
                  <div className="text-xs text-muted-foreground">({gcResults.distanceDeg.toFixed(4)}°)</div>
                </div>
                <div>
                  <span className="text-muted-foreground" data-translatable>İlk Kerteriz:</span>
                  <div className="font-mono font-semibold">{gcResults.initialCourse.toFixed(1)}°</div>
                </div>
                <div>
                  <span className="text-muted-foreground" data-translatable>Varış Kerterizi:</span>
                  <div className="font-mono font-semibold">{gcResults.finalCourse.toFixed(1)}°</div>
                </div>
                {gcResults.vertexLat !== null && (
                  <div>
                    <span className="text-muted-foreground" data-translatable>Vertex Enlemi:</span>
                    <div className="font-mono font-semibold">{formatDecimalAsDMS(gcResults.vertexLat, true)}</div>
                  </div>
                )}
              </div>
            </div>
          )
        );
      case "rhumb":
        return (
          rhumbResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nMesafe: ${rhumbResults.distance.toFixed(2)} nm\nSabit Kerteriz: ${rhumbResults.course.toFixed(1)}°`}</pre>
          )
        );
      case "plane":
        return (
          planeResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\ndLat: ${planeResults.dLatMin.toFixed(2)} dk\nDeparture: ${planeResults.depMin.toFixed(2)} dk\nKerteriz: ${planeResults.courseDeg.toFixed(1)}°\nMesafe: ${planeResults.distanceNm.toFixed(2)} nm`}</pre>
          )
        );
      case "eta":
        return (
          etaResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nSüre: ${etaResults.hoursMinutes}\nSaat: ${etaResults.hours.toFixed(2)} saat`}</pre>
          )
        );
      case "current":
        return (
          currentResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nCTS: ${currentResults.courseToSteerDeg.toFixed(1)}°\nSOG: ${currentResults.groundSpeedKn.toFixed(2)} kn`}</pre>
          )
        );
      case "compass":
        return (
          compassResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nManyetik Kerteriz: ${compassResults.magnetic.toFixed(1)}°\nGerçek Kerteriz: ${compassResults.true.toFixed(1)}°\nToplam Hata: ${compassResults.totalError.toFixed(1)}°`}</pre>
          )
        );
      case "cpa":
        return (
          cpaResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nCPA Mesafesi: ${cpaResults.cpaNm.toFixed(2)} nm\nTCPA: ${cpaResults.tcpaMin.toFixed(1)} dk`}</pre>
          )
        );
      case "sight":
        return (
          sightResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nHesaplanan Yükseklik: ${sightResults.hcDeg.toFixed(2)}°\nAzimut: ${sightResults.azimuthDeg.toFixed(1)}°`}</pre>
          )
        );
      case "bearings":
        return (
          bearingResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nMesafe Off: ${bearingResults.distanceOffNm.toFixed(2)} nm`}</pre>
          )
        );
      case "distance":
        return (
          distanceResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nMesafe: ${distanceResults.distanceNm.toFixed(2)} nm`}</pre>
          )
        );
      case "tides":
        return (
          tideResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç (Rule of Twelfths):\nYükseklik: ${tideResults.heightM.toFixed(2)} m`}</pre>
          )
        );
      case "turning":
        return (
          turningResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nTactical Diameter: ${turningResults.tacticalDiameterM.toFixed(0)} m\nAdvance: ${turningResults.advanceM.toFixed(0)} m\nTransfer: ${turningResults.transferM.toFixed(0)} m\nROT: ${turningResults.rotDegPerMin.toFixed(1)} °/min`}</pre>
          )
        );
      case "weather":
        return (
          weatherResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\n${weatherResults.windSpeedKn ? `Beaufort Rüzgar Hızı: ${weatherResults.windSpeedKn.toFixed(1)} knot\n` : ''}${weatherResults.waveHeightM ? `Dalga Yüksekliği: ${weatherResults.waveHeightM.toFixed(1)} m\n` : ''}${weatherResults.leewayAngleDeg ? `Leeway Açısı: ${weatherResults.leewayAngleDeg.toFixed(1)}°\n` : ''}${weatherResults.windForceN ? `Rüzgar Kuvveti: ${weatherResults.windForceN.toFixed(0)} N` : ''}`}</pre>
          )
        );
      case "celestial":
        return (
          celestialResults && (
            <div className="space-y-2">
              <div className="font-semibold text-primary" data-translatable>Göksel Navigasyon Sonuçları:</div>
              <div className="space-y-1 text-sm">
                {celestialInputs.type === 'meridian' && celestialResults.latitudeDeg !== undefined && (
                  <div>
                    <span className="text-muted-foreground" data-translatable>Meridian Enlem:</span>
                    <div className="font-mono font-semibold">{formatDecimalAsDMS(celestialResults.latitudeDeg, true)}</div>
                  </div>
                )}
                {celestialInputs.type === 'amplitude' && celestialResults.amplitudeDeg !== undefined && (
                  <div>
                    <span className="text-muted-foreground" data-translatable>Amplitude:</span>
                    <div className="font-mono font-semibold">{celestialResults.amplitudeDeg.toFixed(2)}°</div>
                  </div>
                )}
                {celestialInputs.type === 'sunrise' && celestialResults.bearingDeg !== undefined && (
                  <div>
                    <span className="text-muted-foreground" data-translatable>Doğuş Kerterizi:</span>
                    <div className="font-mono font-semibold">{celestialResults.bearingDeg.toFixed(1)}°</div>
                  </div>
                )}
              </div>
            </div>
          )
        );
      case "emergency":
        return (
          emergencyResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\n${emergencyResults.legDistanceNm ? `Search Leg: ${emergencyResults.legDistanceNm.toFixed(2)} nm\n` : ''}${emergencyResults.newRadiusNm ? `Next Radius: ${emergencyResults.newRadiusNm.toFixed(2)} nm\n` : ''}${emergencyResults.timeToRescueHours ? `Rescue Time: ${emergencyResults.timeToRescueHours.toFixed(2)} hours` : ''}`}</pre>
          )
        );
    }
  };

  return (
    <MobileLayout>
      <div className="space-y-4" data-no-translate>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" /> Geri
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calculator className="h-4 w-4" /> {title}
          </div>
        </div>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 space-y-4">
              {renderInputs()}
              <Button onClick={onCalculate} className="w-full">Hesapla</Button>
            </div>
            {renderResults()}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/navigation")}>Listeye Dön</Button>
          <Button variant="default" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="gap-2">
            <Calculator className="h-4 w-4" /> Başa Dön
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
