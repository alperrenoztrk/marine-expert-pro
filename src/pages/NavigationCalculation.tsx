import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CoordinateInput } from "@/components/ui/coordinate-input";
import { Calculator } from "lucide-react";
import { OfflineLimitedNotice } from "@/components/OfflineLimitedNotice";
import { supabase } from "@/integrations/supabase/safeClient";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { tidePorts } from "@/data/tidePorts";
import {
  calculateGreatCircle,
  generateGreatCircleWaypoints,
  calculateRhumbLine,
  calculatePlaneSailing,
  calculateEtaHours,
  solveSpeedDistanceTime,
  knotsToKmh,
  kmhToKnots,
  knotsToMs,
  msToKnots,
  calculateEtaUtc,
  hoursToHhMm,
  calculateRemaining,
  solveCurrentTriangle,
  calculateCompassTotalError,
  convertTVMDCFromCompass,
  convertTVMDCFromTrue,
  computeArpaCpaTcpa,
  calculateSightReduction,
  calculateMiddleLatitudeSailing,
  chartCmToNm,
  chartNmToCm,
  calculateDeadReckoning,
  calculateFixFromTwoBearings,
  calculateRunningFix,
  calculateFixFromThreeBearings,
  calculateFixFromBearingAndDistance,
  calculateFixFromTwoDistances,
  computeTargetMotionFromTwoRadarPlots,
  assessColregSituation,
  calculateDoublingAngle,
  calculateFourPointBearing,
  calculateSevenPointBearing,
  calculateDistance,
  calculateTide,
  calculateHeightOfTideAtTime,
  calculateTidalStream,
  estimateSquatBarrass,
  calculateUKC,
  calculateTurning,
  calculateWeather,
  calculateCelestial,
  calculateCrossTrackDistance,
  calculateLookAheadDistance,
  correctSextantAltitude,
  computeSunInterceptSight,
  generateDailySunAlmanac,
  generateSightReductionTable,
  longitudeDegToTimeMinutes,
  utcToZoneTime,
  zoneTimeToUtc,
  utcToLocalMeanTime,
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
import { parseSignedAngleEW } from "@/utils/angleParsing";

type TideForecastSuggestion = { id: string; name: string; region: string };
type TideForecastEvent = {
  type: "high" | "low";
  timeLabel: string;
  dateLabel: string;
  heightM: number;
  timeUtcIso?: string;
};

type CalcId =
  | "gc"
  | "rhumb"
  | "plane"
  | "eta"
  | "midlat"
  | "chart"
  | "position"
  | "current"
  | "compass"
  | "cpa"
  | "radar"
  | "colreg"
  | "sight"
  | "astro"
  | "bearings"
  | "fix"
  | "distance"
  | "tides"
  | "safety"
  | "passage"
  | "ecdis"
  | "turning"
  | "weather"
  | "celestial"
  | "emergency";

const CALC_TITLES: Record<CalcId, string> = {
  gc: "Büyük Daire (Great Circle)",
  rhumb: "Rhumb Line (Mercator)",
  plane: "Plane Sailing",
  eta: "Temel Seyir (Zaman–Mesafe–Hız)",
  midlat: "Middle Latitude Sailing",
  chart: "Chart Ölçeği (cm ↔ NM)",
  position: "DR / Enlem–Boylam",
  current: "Akıntı Üçgeni (CTS)",
  compass: "Pusula Dönüşümleri",
  cpa: "CPA / TCPA",
  radar: "Radar Plot (Hedef Rota/Hız)",
  colreg: "COLREG Durum & Manevra",
  sight: "Sight Reduction",
  astro: "Astronomik Seyir (Almanac + LOP)",
  bearings: "Kerteriz Hesaplamaları",
  fix: "Fixing Position",
  distance: "Mesafe Hesaplamaları",
  tides: "Gelgit + UKC",
  safety: "Seyir Emniyeti (Squat/UKC)",
  passage: "Passage Plan (Leg ETA)",
  ecdis: "ECDIS (XTD / Look-ahead)",
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
    lon2: emptyDMS(false),
    wpStepNm: "60",
    wpSegments: ""
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

  // Temel seyir (1️⃣): d/t/v, unit conversions, ETD->ETA, remaining
  const [basicInputs, setBasicInputs] = useState({
    distanceNm: "",
    speedKn: "",
    timeHours: "",
    convertValue: "",
    convertFrom: "kn" as "kn" | "kmh" | "ms",
    convertTo: "kmh" as "kn" | "kmh" | "ms",
    etdUtc: "",
    plannedTotalNm: "",
    dmgNm: "",
    sogKn: "",
    // Time conversions (kitap: GMT/LMT/ZT ilişkileri)
    timeUtc: "",
    zoneOffsetHours: "0",
    lonForLmt: "",
  });
  const [basicResults, setBasicResults] = useState<any>(null);

  const [midlatInputs, setMidlatInputs] = useState({
    lat1: emptyDMS(true),
    lon1: emptyDMS(false),
    lat2: emptyDMS(true),
    lon2: emptyDMS(false),
  });
  const [midlatResults, setMidlatResults] = useState<any>(null);

  const [chartInputs, setChartInputs] = useState({ lengthCm: "", scale: "", distanceNm: "" });
  const [chartResults, setChartResults] = useState<any>(null);

  const [positionInputs, setPositionInputs] = useState({
    startLat: emptyDMS(true),
    startLon: emptyDMS(false),
    courseTrue: "",
    distanceNm: "",
  });
  const [positionResults, setPositionResults] = useState<any>(null);

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

  const [astroInputs, setAstroInputs] = useState({
    apLat: emptyDMS(true),
    apLon: emptyDMS(false),
    dateUtc: "",
    hsDeg: "",
    icMin: "",
    heM: "",
    pressureHPa: "",
    tempC: "",
    tableLat: emptyDMS(true),
    tableDec: emptyDMS(true),
    lhaStart: "0",
    lhaEnd: "90",
    lhaStep: "1",
    almanacDateUtc: "",
  });
  const [astroResults, setAstroResults] = useState<any>(null);

  const [bearingInputs, setBearingInputs] = useState({ angle: "", run: "", type: "doubling" as "doubling" | "four" | "seven" });
  const [bearingResults, setBearingResults] = useState<any>(null);

  const [distanceInputs, setDistanceInputs] = useState({ height: "", type: "dip" as "dip" | "radar" | "light", lightHeight: "" });
  const [distanceResults, setDistanceResults] = useState<any>(null);

  const [tideInputs, setTideInputs] = useState({ hour: "", range: "" });
  const [tideTableInputs, setTideTableInputs] = useState({ lowTide: "", highTide: "", lowTideTime: "06:00" });
  const [tideTable, setTideTable] = useState<Array<{ time: string; height: number; change: number; status: string }>>([]);
  const [tideResults, setTideResults] = useState<any>(null);

  const [tideForecastQuery, setTideForecastQuery] = useState("");
  const [tideForecastSuggestions, setTideForecastSuggestions] = useState<TideForecastSuggestion[]>([]);
  const [tideForecastLoading, setTideForecastLoading] = useState(false);
  const [tideForecastError, setTideForecastError] = useState<string | null>(null);
  const [tideForecastData, setTideForecastData] = useState<{
    locationUrl: string;
    timezoneLabel: string;
    rangeM: number | null;
    events: TideForecastEvent[];
    selected: TideForecastSuggestion;
  } | null>(null);

  const [tideHotInputs, setTideHotInputs] = useState({
    lwTimeUtc: "",
    lwHeightM: "",
    hwTimeUtc: "",
    hwHeightM: "",
    queryTimeUtc: "",
  });
  const [tideHotResults, setTideHotResults] = useState<any>(null);
  const isOnline = useOnlineStatus();
  const localPortMatches = useMemo(() => {
    const q = tideForecastQuery.trim().toLowerCase();
    const list = q
      ? tidePorts.filter((port) =>
          `${port.name} ${port.region ?? ""} ${port.country ?? ""}`.toLowerCase().includes(q)
        )
      : tidePorts;
    return list.slice(0, 8);
  }, [tideForecastQuery]);

  const handleLocalPortSelect = (portName: string) => {
    setTideForecastQuery(portName);
    if (isOnline) {
      void searchTideForecast(portName);
    }
  };

  const [ukcInputs, setUkcInputs] = useState({
    chartedDepthM: "",
    draftM: "",
    safetyMarginM: "",
    speedKn: "",
    blockCoeff: "0.70",
    environment: "open" as "open" | "confined",
  });
  const [ukcResults, setUkcResults] = useState<any>(null);

  const [tidalStreamInputs, setTidalStreamInputs] = useState({
    stage: "flood" as "flood" | "ebb",
    hourFromSlack: "3",
    springMaxRateKn: "",
    neapMaxRateKn: "",
    springRangeM: "",
    neapRangeM: "",
    actualRangeM: "",
    floodSetDeg: "",
    ebbSetDeg: "",
  });
  const [tidalStreamResults, setTidalStreamResults] = useState<any>(null);

  const [safetyInputs, setSafetyInputs] = useState({
    chartedDepthM: "",
    tideM: "",
    draftM: "",
    speedKn: "",
    blockCoeff: "0.70",
    environment: "open" as "open" | "confined",
    safetyMarginM: "",
  });
  const [safetyResults, setSafetyResults] = useState<any>(null);

  const [fixInputs, setFixInputs] = useState({
    obj1Lat: emptyDMS(true),
    obj1Lon: emptyDMS(false),
    brg1: "",
    obj2Lat: emptyDMS(true),
    obj2Lon: emptyDMS(false),
    brg2: "",
    obj3Lat: emptyDMS(true),
    obj3Lon: emptyDMS(false),
    brg3: "",

    // Bearing + distance (mevki dairesi + kerteriz)
    bdObjLat: emptyDMS(true),
    bdObjLon: emptyDMS(false),
    bdBearingToObj: "",
    bdDistanceNm: "",

    // Two distances (two circles)
    ddObj1Lat: emptyDMS(true),
    ddObj1Lon: emptyDMS(false),
    ddDist1Nm: "",
    ddObj2Lat: emptyDMS(true),
    ddObj2Lon: emptyDMS(false),
    ddDist2Nm: "",
    ddApproxLat: emptyDMS(true),
    ddApproxLon: emptyDMS(false),

    runObjOldLat: emptyDMS(true),
    runObjOldLon: emptyDMS(false),
    runBrg1: "",
    runObjNewLat: emptyDMS(true),
    runObjNewLon: emptyDMS(false),
    runBrg2: "",
    runCourse: "",
    runDistance: "",
  });
  const [fixResults, setFixResults] = useState<any>(null);

  const [radarInputs2, setRadarInputs2] = useState({
    bearing1: "",
    range1: "",
    time1Utc: "",
    bearing2: "",
    range2: "",
    time2Utc: "",
    ownCourse: "",
    ownSpeed: "",
  });
  const [radarResults2, setRadarResults2] = useState<any>(null);

  const [colregInputs, setColregInputs] = useState({
    relativeBearing: "",
  });
  const [colregResults, setColregResults] = useState<any>(null);

  const [passageInputs, setPassageInputs] = useState({
    etdUtc: "",
    leg1Dist: "",
    leg1Sog: "",
    leg2Dist: "",
    leg2Sog: "",
    leg3Dist: "",
    leg3Sog: "",
    leg4Dist: "",
    leg4Sog: "",
  });
  const [passageResults, setPassageResults] = useState<any>(null);

  const [ecdisInputs, setEcdisInputs] = useState({
    startLat: emptyDMS(true),
    startLon: emptyDMS(false),
    endLat: emptyDMS(true),
    endLon: emptyDMS(false),
    posLat: emptyDMS(true),
    posLon: emptyDMS(false),
    sogKn: "",
    lookAheadMin: "",
  });
  const [ecdisResults, setEcdisResults] = useState<any>(null);

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

  // Load saved values from localStorage on mount
  useEffect(() => {
    const loadSavedInputs = () => {
      try {
        const saved = localStorage.getItem(`nav-calc-${id}`);
        if (saved) {
          const data = JSON.parse(saved);
          
          // Restore inputs based on calculation type
          switch (id) {
            case "gc":
              if (data.gcInputs) setGcInputs(data.gcInputs);
              break;
            case "rhumb":
              if (data.rhumbInputs) setRhumbInputs(data.rhumbInputs);
              break;
            case "plane":
              if (data.planeInputs) setPlaneInputs(data.planeInputs);
              break;
            case "eta":
              if (data.etaInputs) setEtaInputs(data.etaInputs);
              if (data.basicInputs) setBasicInputs(data.basicInputs);
              break;
            case "midlat":
              if (data.midlatInputs) setMidlatInputs(data.midlatInputs);
              break;
            case "chart":
              if (data.chartInputs) setChartInputs(data.chartInputs);
              break;
            case "position":
              if (data.positionInputs) setPositionInputs(data.positionInputs);
              break;
            case "current":
              if (data.currentInputs) setCurrentInputs(data.currentInputs);
              break;
            case "compass":
              if (data.compassInputs) setCompassInputs(data.compassInputs);
              break;
            case "cpa":
              if (data.cpaInputs) setCpaInputs(data.cpaInputs);
              break;
            case "radar":
              if (data.radarInputs2) setRadarInputs2(data.radarInputs2);
              break;
            case "colreg":
              if (data.colregInputs) setColregInputs(data.colregInputs);
              break;
            case "sight":
              if (data.sightInputs) setSightInputs(data.sightInputs);
              break;
            case "astro":
              if (data.astroInputs) setAstroInputs(data.astroInputs);
              break;
            case "bearings":
              if (data.bearingInputs) setBearingInputs(data.bearingInputs);
              break;
            case "fix":
              if (data.fixInputs) setFixInputs(data.fixInputs);
              break;
            case "distance":
              if (data.distanceInputs) setDistanceInputs(data.distanceInputs);
              break;
            case "tides":
              if (data.tideInputs) setTideInputs(data.tideInputs);
              if (data.tideTableInputs) setTideTableInputs(data.tideTableInputs);
              if (data.tideHotInputs) setTideHotInputs(data.tideHotInputs);
              if (data.ukcInputs) setUkcInputs(data.ukcInputs);
              break;
            case "safety":
              if (data.safetyInputs) setSafetyInputs(data.safetyInputs);
              break;
            case "passage":
              if (data.passageInputs) setPassageInputs(data.passageInputs);
              break;
            case "ecdis":
              if (data.ecdisInputs) setEcdisInputs(data.ecdisInputs);
              break;
            case "turning":
              if (data.turningInputs) setTurningInputs(data.turningInputs);
              break;
            case "weather":
              if (data.weatherInputs) setWeatherInputs(data.weatherInputs);
              break;
            case "celestial":
              if (data.celestialInputs) setCelestialInputs(data.celestialInputs);
              break;
            case "emergency":
              if (data.emergencyInputs) setEmergencyInputs(data.emergencyInputs);
              break;
          }
        }
      } catch (error) {
        console.error("Error loading saved inputs:", error);
      }
    };
    
    loadSavedInputs();
  }, [id]);

  // Save inputs to localStorage whenever they change
  useEffect(() => {
    try {
      const dataToSave: any = {};
      
      switch (id) {
        case "gc":
          dataToSave.gcInputs = gcInputs;
          break;
        case "rhumb":
          dataToSave.rhumbInputs = rhumbInputs;
          break;
        case "plane":
          dataToSave.planeInputs = planeInputs;
          break;
        case "eta":
          dataToSave.etaInputs = etaInputs;
          dataToSave.basicInputs = basicInputs;
          break;
        case "midlat":
          dataToSave.midlatInputs = midlatInputs;
          break;
        case "chart":
          dataToSave.chartInputs = chartInputs;
          break;
        case "position":
          dataToSave.positionInputs = positionInputs;
          break;
        case "current":
          dataToSave.currentInputs = currentInputs;
          break;
        case "compass":
          dataToSave.compassInputs = compassInputs;
          break;
        case "cpa":
          dataToSave.cpaInputs = cpaInputs;
          break;
        case "radar":
          dataToSave.radarInputs2 = radarInputs2;
          break;
        case "colreg":
          dataToSave.colregInputs = colregInputs;
          break;
        case "sight":
          dataToSave.sightInputs = sightInputs;
          break;
        case "astro":
          dataToSave.astroInputs = astroInputs;
          break;
        case "bearings":
          dataToSave.bearingInputs = bearingInputs;
          break;
        case "fix":
          dataToSave.fixInputs = fixInputs;
          break;
        case "distance":
          dataToSave.distanceInputs = distanceInputs;
          break;
        case "tides":
          dataToSave.tideInputs = tideInputs;
          dataToSave.tideTableInputs = tideTableInputs;
          dataToSave.tideHotInputs = tideHotInputs;
          dataToSave.ukcInputs = ukcInputs;
          break;
        case "safety":
          dataToSave.safetyInputs = safetyInputs;
          break;
        case "passage":
          dataToSave.passageInputs = passageInputs;
          break;
        case "ecdis":
          dataToSave.ecdisInputs = ecdisInputs;
          break;
        case "turning":
          dataToSave.turningInputs = turningInputs;
          break;
        case "weather":
          dataToSave.weatherInputs = weatherInputs;
          break;
        case "celestial":
          dataToSave.celestialInputs = celestialInputs;
          break;
        case "emergency":
          dataToSave.emergencyInputs = emergencyInputs;
          break;
      }
      
      localStorage.setItem(`nav-calc-${id}`, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving inputs:", error);
    }
  }, [id, gcInputs, rhumbInputs, planeInputs, etaInputs, basicInputs, midlatInputs, chartInputs, positionInputs,
      currentInputs, compassInputs, cpaInputs, radarInputs2, colregInputs, sightInputs, astroInputs,
      bearingInputs, fixInputs, distanceInputs, tideInputs, tideTableInputs, tideHotInputs, ukcInputs,
      tidalStreamInputs, safetyInputs, passageInputs, ecdisInputs,
      turningInputs, weatherInputs, celestialInputs, emergencyInputs]);

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
          const stepNm = gcInputs.wpStepNm.trim() ? parseFloat(gcInputs.wpStepNm) : undefined;
          const segments = gcInputs.wpSegments.trim() ? parseInt(gcInputs.wpSegments, 10) : undefined;
          const waypoints = generateGreatCircleWaypoints({
            start: { latDeg: dmsToDecimal(gcInputs.lat1), lonDeg: dmsToDecimal(gcInputs.lon1) },
            end: { latDeg: dmsToDecimal(gcInputs.lat2), lonDeg: dmsToDecimal(gcInputs.lon2) },
            stepNm: stepNm && isFinite(stepNm) && stepNm > 0 ? stepNm : undefined,
            segments: segments && isFinite(segments) && segments > 0 ? segments : undefined,
          });
          setGcResults({ ...result, waypoints });
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
        case "midlat": {
          const input: PlaneSailingInput = {
            lat1Deg: dmsToDecimal(midlatInputs.lat1),
            lon1Deg: dmsToDecimal(midlatInputs.lon1),
            lat2Deg: dmsToDecimal(midlatInputs.lat2),
            lon2Deg: dmsToDecimal(midlatInputs.lon2),
          };
          const result = calculateMiddleLatitudeSailing(input);
          setMidlatResults(result);
          break;
        }
        case "chart": {
          const lengthCm = chartInputs.lengthCm ? parseFloat(chartInputs.lengthCm) : undefined;
          const scale = chartInputs.scale ? parseFloat(chartInputs.scale) : undefined;
          const distanceNm = chartInputs.distanceNm ? parseFloat(chartInputs.distanceNm) : undefined;
          const out: any = {};
          if (lengthCm !== undefined && scale !== undefined) {
            out.nmFromCm = chartCmToNm(lengthCm, scale);
          }
          if (distanceNm !== undefined && scale !== undefined) {
            out.cmFromNm = chartNmToCm(distanceNm, scale);
          }
          setChartResults(out);
          break;
        }
        case "position": {
          const startLat = dmsToDecimal(positionInputs.startLat);
          const startLon = dmsToDecimal(positionInputs.startLon);
          const courseTrueDeg = parseFloat(positionInputs.courseTrue);
          const distanceNm = parseFloat(positionInputs.distanceNm);
          const dest = calculateDeadReckoning({
            start: { latDeg: startLat, lonDeg: startLon },
            courseTrueDeg,
            distanceNm,
          });
          setPositionResults(dest);
          break;
        }
        case "eta": {
          const toNum = (v: string) => (v.trim() === "" ? undefined : parseFloat(v));
          const sdt = solveSpeedDistanceTime({
            distanceNm: toNum(basicInputs.distanceNm),
            speedKn: toNum(basicInputs.speedKn),
            timeHours: toNum(basicInputs.timeHours),
          });
          const hhmm = hoursToHhMm(sdt.timeHours);

          // Unit conversion
          const cv = toNum(basicInputs.convertValue);
          let converted: number | null = null;
          if (cv !== undefined) {
            const from = basicInputs.convertFrom;
            const to = basicInputs.convertTo;
            const asKn =
              from === "kn" ? cv :
              from === "kmh" ? kmhToKnots(cv) :
              msToKnots(cv);
            converted =
              to === "kn" ? asKn :
              to === "kmh" ? knotsToKmh(asKn) :
              knotsToMs(asKn);
          }

          // ETD->ETA (UTC, datetime-local is treated as UTC by adding Z)
          let etaUtcIso: string | null = null;
          if (basicInputs.etdUtc.trim() !== "" && isFinite(sdt.distanceNm) && isFinite(sdt.speedKn) && sdt.speedKn > 0) {
            const etd = new Date(`${basicInputs.etdUtc}Z`);
            if (!isNaN(etd.getTime())) {
              etaUtcIso = calculateEtaUtc({ distanceNm: sdt.distanceNm, speedKn: sdt.speedKn, etdUtc: etd }).toISOString();
            }
          }

          // Remaining
          let remaining: any = null;
          const plannedTotal = toNum(basicInputs.plannedTotalNm);
          const dmg = toNum(basicInputs.dmgNm);
          const sog = toNum(basicInputs.sogKn);
          if (plannedTotal !== undefined && dmg !== undefined && sog !== undefined) {
            remaining = calculateRemaining({ plannedTotalDistanceNm: plannedTotal, distanceMadeGoodNm: dmg, currentSogKn: sog });
          }

          // Time conversions (UTC -> Zone Time, UTC -> LMT, longitude <-> minutes)
          let timeConv: any = null;
          try {
            if (basicInputs.timeUtc.trim() !== "") {
              const tUtc = new Date(`${basicInputs.timeUtc}Z`);
              const zoneH = basicInputs.zoneOffsetHours.trim() ? parseFloat(basicInputs.zoneOffsetHours) : 0;
              const lon = basicInputs.lonForLmt.trim() ? parseFloat(basicInputs.lonForLmt) : 0;
              const zone = utcToZoneTime(tUtc, zoneH);
              const lmt = utcToLocalMeanTime(tUtc, lon);
              const lonMin = longitudeDegToTimeMinutes(lon);
              timeConv = {
                utcIso: tUtc.toISOString(),
                zoneOffsetHours: zoneH,
                zoneIso: zone.toISOString(),
                lonDeg: lon,
                lonMinutes: lonMin,
                lmtIso: lmt.toISOString(),
              };
            }
          } catch (e) {
            timeConv = null;
          }

          setBasicResults({
            solved: sdt,
            timeHhMm: hhmm,
            converted,
            etaUtcIso,
            remaining,
            timeConv,
          });
          setEtaResults({
            hours: sdt.timeHours,
            hoursMinutes: `${hhmm.hh}h ${hhmm.mm}m`,
          });
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
          const variation = parseSignedAngleEW(compassInputs.variation);
          const deviation = parseSignedAngleEW(compassInputs.deviation);
          const result = calculateCompassTotalError(variation, deviation);
          const compass = parseFloat(compassInputs.compass);
          const tvmdcFromCompass = convertTVMDCFromCompass({
            courseDeg: compass,
            variationDeg: Number.isFinite(variation) ? variation : 0,
            deviationDeg: Number.isFinite(deviation) ? deviation : 0,
          });
          const tvmdcFromTrue = convertTVMDCFromTrue({
            courseDeg: tvmdcFromCompass.trueDeg,
            variationDeg: Number.isFinite(variation) ? variation : 0,
            deviationDeg: Number.isFinite(deviation) ? deviation : 0,
          });
          setCompassResults({
            ...tvmdcFromCompass,
            check: tvmdcFromTrue,
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
        case "radar": {
          const t1 = new Date(`${radarInputs2.time1Utc}Z`);
          const t2 = new Date(`${radarInputs2.time2Utc}Z`);
          const result = computeTargetMotionFromTwoRadarPlots({
            plot1: {
              bearingTrueDeg: parseFloat(radarInputs2.bearing1),
              rangeNm: parseFloat(radarInputs2.range1),
              timeUtc: t1,
            },
            plot2: {
              bearingTrueDeg: parseFloat(radarInputs2.bearing2),
              rangeNm: parseFloat(radarInputs2.range2),
              timeUtc: t2,
            },
            ownCourseTrueDeg: parseFloat(radarInputs2.ownCourse),
            ownSpeedKn: parseFloat(radarInputs2.ownSpeed),
          });
          setRadarResults2(result);
          break;
        }
        case "colreg": {
          const rb = parseFloat(colregInputs.relativeBearing);
          const result = assessColregSituation(rb);
          setColregResults(result);
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
        case "astro": {
          const dateUtc = new Date(`${astroInputs.dateUtc}Z`);
          const almanacDate = astroInputs.almanacDateUtc.trim() ? new Date(`${astroInputs.almanacDateUtc}T00:00Z`) : dateUtc;

          const hsDeg = parseFloat(astroInputs.hsDeg);
          const icMin = astroInputs.icMin.trim() ? parseFloat(astroInputs.icMin) : 0;
          const heM = astroInputs.heM.trim() ? parseFloat(astroInputs.heM) : 0;
          const pressureHPa = astroInputs.pressureHPa.trim() ? parseFloat(astroInputs.pressureHPa) : 1010;
          const tempC = astroInputs.tempC.trim() ? parseFloat(astroInputs.tempC) : 10;

          const corr = correctSextantAltitude({
            hsDeg,
            indexCorrectionMin: icMin,
            heightOfEyeM: heM,
            pressureHPa,
            temperatureC: tempC,
          });

          const intercept = computeSunInterceptSight({
            assumedPosition: {
              latDeg: dmsToDecimal(astroInputs.apLat),
              lonDeg: dmsToDecimal(astroInputs.apLon),
            },
            dateUtc,
            hoDeg: corr.hoDeg,
            body: "sun",
          });

          const almanacRows = generateDailySunAlmanac(almanacDate);
          const table = generateSightReductionTable(
            dmsToDecimal(astroInputs.tableLat),
            dmsToDecimal(astroInputs.tableDec),
            parseFloat(astroInputs.lhaStart),
            parseFloat(astroInputs.lhaEnd),
            parseFloat(astroInputs.lhaStep)
          );

          setAstroResults({ correction: corr, intercept, almanacRows, table });
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
        case "fix": {
          const out: any = {};
          const hasNonZero = (d: DMSCoordinate) => d.degrees !== 0 || d.minutes !== 0 || d.seconds !== 0;

          try {
            out.fix = calculateFixFromTwoBearings({
              object1: { latDeg: dmsToDecimal(fixInputs.obj1Lat), lonDeg: dmsToDecimal(fixInputs.obj1Lon) },
              bearingToObject1TrueDeg: parseFloat(fixInputs.brg1),
              object2: { latDeg: dmsToDecimal(fixInputs.obj2Lat), lonDeg: dmsToDecimal(fixInputs.obj2Lon) },
              bearingToObject2TrueDeg: parseFloat(fixInputs.brg2),
            });
          } catch (e) {
            // ignore partial
          }

          try {
            out.running = calculateRunningFix({
              objectOld: { latDeg: dmsToDecimal(fixInputs.runObjOldLat), lonDeg: dmsToDecimal(fixInputs.runObjOldLon) },
              bearing1TrueDeg: parseFloat(fixInputs.runBrg1),
              objectNew: { latDeg: dmsToDecimal(fixInputs.runObjNewLat), lonDeg: dmsToDecimal(fixInputs.runObjNewLon) },
              bearing2TrueDeg: parseFloat(fixInputs.runBrg2),
              runCourseTrueDeg: parseFloat(fixInputs.runCourse),
              runDistanceNm: parseFloat(fixInputs.runDistance),
            });
          } catch (e) {
            // ignore partial
          }

          try {
            out.three = calculateFixFromThreeBearings({
              object1: { latDeg: dmsToDecimal(fixInputs.obj1Lat), lonDeg: dmsToDecimal(fixInputs.obj1Lon) },
              bearingToObject1TrueDeg: parseFloat(fixInputs.brg1),
              object2: { latDeg: dmsToDecimal(fixInputs.obj2Lat), lonDeg: dmsToDecimal(fixInputs.obj2Lon) },
              bearingToObject2TrueDeg: parseFloat(fixInputs.brg2),
              object3: { latDeg: dmsToDecimal(fixInputs.obj3Lat), lonDeg: dmsToDecimal(fixInputs.obj3Lon) },
              bearingToObject3TrueDeg: parseFloat(fixInputs.brg3),
            });
          } catch (e) {
            // ignore partial
          }

          try {
            out.bearingDistance = calculateFixFromBearingAndDistance({
              object: { latDeg: dmsToDecimal(fixInputs.bdObjLat), lonDeg: dmsToDecimal(fixInputs.bdObjLon) },
              bearingToObjectTrueDeg: parseFloat(fixInputs.bdBearingToObj),
              distanceToObjectNm: parseFloat(fixInputs.bdDistanceNm),
            });
          } catch (e) {
            // ignore partial
          }

          try {
            out.twoDistances = calculateFixFromTwoDistances({
              object1: { latDeg: dmsToDecimal(fixInputs.ddObj1Lat), lonDeg: dmsToDecimal(fixInputs.ddObj1Lon) },
              distanceToObject1Nm: parseFloat(fixInputs.ddDist1Nm),
              object2: { latDeg: dmsToDecimal(fixInputs.ddObj2Lat), lonDeg: dmsToDecimal(fixInputs.ddObj2Lon) },
              distanceToObject2Nm: parseFloat(fixInputs.ddDist2Nm),
              approximate: hasNonZero(fixInputs.ddApproxLat) || hasNonZero(fixInputs.ddApproxLon) ? { latDeg: dmsToDecimal(fixInputs.ddApproxLat), lonDeg: dmsToDecimal(fixInputs.ddApproxLon) } : undefined,
            });
          } catch (e) {
            // ignore partial
          }

          setFixResults(out);
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

          // Height of Tide at time (HW/LW)
          try {
            if (tideHotInputs.lwTimeUtc && tideHotInputs.hwTimeUtc && tideHotInputs.queryTimeUtc) {
              const hot = calculateHeightOfTideAtTime({
                lowWaterTimeUtc: new Date(`${tideHotInputs.lwTimeUtc}Z`),
                lowWaterHeightM: parseFloat(tideHotInputs.lwHeightM),
                highWaterTimeUtc: new Date(`${tideHotInputs.hwTimeUtc}Z`),
                highWaterHeightM: parseFloat(tideHotInputs.hwHeightM),
                queryTimeUtc: new Date(`${tideHotInputs.queryTimeUtc}Z`),
              });
              setTideHotResults(hot);

              const squatM = estimateSquatBarrass({
                speedKn: ukcInputs.speedKn ? parseFloat(ukcInputs.speedKn) : 0,
                blockCoefficient: ukcInputs.blockCoeff ? parseFloat(ukcInputs.blockCoeff) : 0.7,
                environment: ukcInputs.environment,
              });
              const ukc = calculateUKC({
                chartedDepthM: parseFloat(ukcInputs.chartedDepthM),
                heightOfTideM: hot.heightM,
                draftM: parseFloat(ukcInputs.draftM),
                squatM,
                safetyMarginM: ukcInputs.safetyMarginM ? parseFloat(ukcInputs.safetyMarginM) : 0,
              });
              setUkcResults({ squatM, ...ukc });
            }
          } catch (e) {
            // ignore HOT/UKC errors
          }

          // Tidal stream (spring/neap scaled, simple curve)
          try {
            const ts = calculateTidalStream({
              stage: tidalStreamInputs.stage,
              hourFromSlack: parseFloat(tidalStreamInputs.hourFromSlack),
              springMaxRateKn: parseFloat(tidalStreamInputs.springMaxRateKn),
              neapMaxRateKn: parseFloat(tidalStreamInputs.neapMaxRateKn),
              springRangeM: parseFloat(tidalStreamInputs.springRangeM),
              neapRangeM: parseFloat(tidalStreamInputs.neapRangeM),
              actualRangeM: parseFloat(tidalStreamInputs.actualRangeM),
              floodSetDeg: tidalStreamInputs.floodSetDeg.trim() ? parseFloat(tidalStreamInputs.floodSetDeg) : undefined,
              ebbSetDeg: tidalStreamInputs.ebbSetDeg.trim() ? parseFloat(tidalStreamInputs.ebbSetDeg) : undefined,
            });
            setTidalStreamResults(ts);
          } catch (e) {
            // ignore tidal stream errors
          }
          break;
        }
        case "safety": {
          const squatM = estimateSquatBarrass({
            speedKn: parseFloat(safetyInputs.speedKn),
            blockCoefficient: safetyInputs.blockCoeff ? parseFloat(safetyInputs.blockCoeff) : 0.7,
            environment: safetyInputs.environment,
          });
          const ukc = calculateUKC({
            chartedDepthM: parseFloat(safetyInputs.chartedDepthM),
            heightOfTideM: parseFloat(safetyInputs.tideM),
            draftM: parseFloat(safetyInputs.draftM),
            squatM,
            safetyMarginM: safetyInputs.safetyMarginM ? parseFloat(safetyInputs.safetyMarginM) : 0,
          });
          setSafetyResults({ squatM, ...ukc });
          break;
        }
        case "passage": {
          const etd = new Date(`${passageInputs.etdUtc}Z`);
          const legs = [
            { dist: passageInputs.leg1Dist, sog: passageInputs.leg1Sog, name: "Leg 1" },
            { dist: passageInputs.leg2Dist, sog: passageInputs.leg2Sog, name: "Leg 2" },
            { dist: passageInputs.leg3Dist, sog: passageInputs.leg3Sog, name: "Leg 3" },
            { dist: passageInputs.leg4Dist, sog: passageInputs.leg4Sog, name: "Leg 4" },
          ].filter((l) => l.dist.trim() !== "" && l.sog.trim() !== "");

          let t = etd.getTime();
          const rows = legs.map((l) => {
            const d = parseFloat(l.dist);
            const sog = parseFloat(l.sog);
            const hours = d / sog;
            const startIso = new Date(t).toISOString();
            t += hours * 60 * 60 * 1000;
            const etaIso = new Date(t).toISOString();
            return { name: l.name, distanceNm: d, sogKn: sog, durationHours: hours, startIso, etaIso };
          });
          setPassageResults({ rows, etdIso: etd.toISOString(), totalDistanceNm: rows.reduce((a, r) => a + r.distanceNm, 0) });
          break;
        }
        case "ecdis": {
          const xtd = calculateCrossTrackDistance({
            legStart: { latDeg: dmsToDecimal(ecdisInputs.startLat), lonDeg: dmsToDecimal(ecdisInputs.startLon) },
            legEnd: { latDeg: dmsToDecimal(ecdisInputs.endLat), lonDeg: dmsToDecimal(ecdisInputs.endLon) },
            position: { latDeg: dmsToDecimal(ecdisInputs.posLat), lonDeg: dmsToDecimal(ecdisInputs.posLon) },
          });
          const look = calculateLookAheadDistance(parseFloat(ecdisInputs.sogKn), parseFloat(ecdisInputs.lookAheadMin));
          setEcdisResults({ xtd, look });
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

  const searchTideForecast = async (queryOverride?: string) => {
    const q = (queryOverride ?? tideForecastQuery).trim();
    if (!q) return;
    if (!isOnline) {
      setTideForecastError("Offline modda gelgit tahmin servisi kullanılamaz.");
      return;
    }
    setTideForecastLoading(true);
    setTideForecastError(null);
    setTideForecastSuggestions([]);
    setTideForecastData(null);
    try {
      const { data, error } = await supabase.functions.invoke("tide-forecast", {
        body: { query: q },
      });
      if (error) throw error;
      const suggestions = (data?.suggestions || []) as TideForecastSuggestion[];
      setTideForecastSuggestions(suggestions);
      if (!suggestions.length) setTideForecastError("Eşleşme bulunamadı.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      setTideForecastError(msg);
    } finally {
      setTideForecastLoading(false);
    }
  };

  function isoToDatetimeLocalValue(iso: string): string {
    // "YYYY-MM-DDTHH:mm"
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
  }

  const selectTideForecastSuggestion = async (s: TideForecastSuggestion) => {
    if (!isOnline) {
      setTideForecastError("Offline modda gelgit tahmin servisi kullanılamaz.");
      return;
    }
    setTideForecastLoading(true);
    setTideForecastError(null);
    setTideForecastData(null);
    try {
      const { data, error } = await supabase.functions.invoke("tide-forecast", {
        body: { query: s.name, loc_id: s.id },
      });
      if (error) throw error;
      const payload = data as {
        locationUrl: string;
        timezoneLabel: string;
        rangeM: number | null;
        events: TideForecastEvent[];
      };

      setTideForecastData({ ...payload, selected: s });

      // Auto-fill the simple range input if available
      if (typeof payload.rangeM === "number" && Number.isFinite(payload.rangeM)) {
        setTideInputs((prev) => ({ ...prev, range: payload.rangeM.toFixed(2) }));
      }

      // If we have both a low and a high tide, prefill the tide table inputs
      const lows = payload.events.filter((e) => e.type === "low");
      const highs = payload.events.filter((e) => e.type === "high");
      const low = lows[0];
      const high = highs[0];
      if (low && high) {
        setTideTableInputs((prev) => ({
          ...prev,
          lowTide: String(low.heightM),
          highTide: String(high.heightM),
          lowTideTime: prev.lowTideTime, // keep user preference (timezone differences)
        }));

        // If timezone is GMT/UTC (timeUtcIso present), also prefill HOT inputs
        if (low.timeUtcIso && high.timeUtcIso) {
          setTideHotInputs((prev) => ({
            ...prev,
            lwTimeUtc: isoToDatetimeLocalValue(low.timeUtcIso!),
            lwHeightM: String(low.heightM),
            hwTimeUtc: isoToDatetimeLocalValue(high.timeUtcIso!),
            hwHeightM: String(high.heightM),
            queryTimeUtc: isoToDatetimeLocalValue(new Date().toISOString()),
          }));
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      setTideForecastError(msg);
    } finally {
      setTideForecastLoading(false);
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
            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Waypoint üretimi (opsiyonel)</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gc-wp-step">Step (NM) (örn. 60)</Label>
                  <Input id="gc-wp-step" type="number" value={gcInputs.wpStepNm} onChange={(e) => setGcInputs({ ...gcInputs, wpStepNm: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="gc-wp-seg">Segments (alternatif)</Label>
                  <Input id="gc-wp-seg" type="number" value={gcInputs.wpSegments} onChange={(e) => setGcInputs({ ...gcInputs, wpSegments: e.target.value })} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Step girilirse mesafeye göre waypoint sayısı seçilir; segments girilirse sabit sayıda parçaya bölünür.</div>
            </div>
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
      case "midlat":
        return (
          <div className="space-y-4">
            <CoordinateInput
              id="ml-lat1"
              label="Başlangıç Enlemi"
              value={midlatInputs.lat1}
              onChange={(val) => setMidlatInputs({ ...midlatInputs, lat1: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="ml-lon1"
              label="Başlangıç Boylamı"
              value={midlatInputs.lon1}
              onChange={(val) => setMidlatInputs({ ...midlatInputs, lon1: val })}
              isLatitude={false}
            />
            <CoordinateInput
              id="ml-lat2"
              label="Hedef Enlemi"
              value={midlatInputs.lat2}
              onChange={(val) => setMidlatInputs({ ...midlatInputs, lat2: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="ml-lon2"
              label="Hedef Boylamı"
              value={midlatInputs.lon2}
              onChange={(val) => setMidlatInputs({ ...midlatInputs, lon2: val })}
              isLatitude={false}
            />
          </div>
        );
      case "chart":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chart-cm">Haritada Uzunluk (cm)</Label>
                <Input
                  id="chart-cm"
                  type="number"
                  placeholder="3.5"
                  value={chartInputs.lengthCm}
                  onChange={(e) => setChartInputs({ ...chartInputs, lengthCm: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="chart-scale">Ölçek Paydası (1:xxxx)</Label>
                <Input
                  id="chart-scale"
                  type="number"
                  placeholder="50000"
                  value={chartInputs.scale}
                  onChange={(e) => setChartInputs({ ...chartInputs, scale: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chart-nm">Mesafe (NM)</Label>
                <Input
                  id="chart-nm"
                  type="number"
                  placeholder="12"
                  value={chartInputs.distanceNm}
                  onChange={(e) => setChartInputs({ ...chartInputs, distanceNm: e.target.value })}
                />
              </div>
              <div className="text-xs text-muted-foreground flex items-end">
                1 NM = 185200 cm, cm↔NM dönüşümü için ölçek zorunludur.
              </div>
            </div>
          </div>
        );
      case "position":
        return (
          <div className="space-y-4">
            <CoordinateInput
              id="dr-lat"
              label="Başlangıç Enlemi"
              value={positionInputs.startLat}
              onChange={(val) => setPositionInputs({ ...positionInputs, startLat: val })}
              isLatitude={true}
            />
            <CoordinateInput
              id="dr-lon"
              label="Başlangıç Boylamı"
              value={positionInputs.startLon}
              onChange={(val) => setPositionInputs({ ...positionInputs, startLon: val })}
              isLatitude={false}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dr-course">Kurs (True, °)</Label>
                <Input id="dr-course" type="number" value={positionInputs.courseTrue} onChange={(e) => setPositionInputs({ ...positionInputs, courseTrue: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="dr-distance">Mesafe (NM)</Label>
                <Input id="dr-distance" type="number" value={positionInputs.distanceNm} onChange={(e) => setPositionInputs({ ...positionInputs, distanceNm: e.target.value })} />
              </div>
            </div>
          </div>
        );
      case "eta":
        return (
          <div className="space-y-4">
            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Hız – Mesafe – Zaman</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="b-distance">Mesafe (NM)</Label>
                  <Input id="b-distance" type="number" value={basicInputs.distanceNm} onChange={(e) => setBasicInputs({ ...basicInputs, distanceNm: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="b-speed">Hız (kn)</Label>
                  <Input id="b-speed" type="number" value={basicInputs.speedKn} onChange={(e) => setBasicInputs({ ...basicInputs, speedKn: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="b-time">Zaman (saat)</Label>
                  <Input id="b-time" type="number" value={basicInputs.timeHours} onChange={(e) => setBasicInputs({ ...basicInputs, timeHours: e.target.value })} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">3 değerden 2’sini girin, diğeri hesaplanır.</div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Knot ↔ km/h ↔ m/s</div>
              <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="b-conv-value">Değer</Label>
                  <Input id="b-conv-value" type="number" value={basicInputs.convertValue} onChange={(e) => setBasicInputs({ ...basicInputs, convertValue: e.target.value })} />
                </div>
                <div>
                  <Label>From</Label>
                  <Select value={basicInputs.convertFrom} onValueChange={(v) => setBasicInputs({ ...basicInputs, convertFrom: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kn">kn</SelectItem>
                      <SelectItem value="kmh">km/h</SelectItem>
                      <SelectItem value="ms">m/s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>To</Label>
                  <Select value={basicInputs.convertTo} onValueChange={(v) => setBasicInputs({ ...basicInputs, convertTo: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kn">kn</SelectItem>
                      <SelectItem value="kmh">km/h</SelectItem>
                      <SelectItem value="ms">m/s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">ETD → ETA (UTC)</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="b-etd">ETD (UTC)</Label>
                  <Input id="b-etd" type="datetime-local" value={basicInputs.etdUtc} onChange={(e) => setBasicInputs({ ...basicInputs, etdUtc: e.target.value })} />
                </div>
                <div className="text-xs text-muted-foreground flex items-end">
                  Mesafe/Hız yukarıdan kullanılır.
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Remaining Time / Remaining Distance</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="b-total">Planlanan Toplam (NM)</Label>
                  <Input id="b-total" type="number" value={basicInputs.plannedTotalNm} onChange={(e) => setBasicInputs({ ...basicInputs, plannedTotalNm: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="b-dmg">DMG (NM)</Label>
                  <Input id="b-dmg" type="number" value={basicInputs.dmgNm} onChange={(e) => setBasicInputs({ ...basicInputs, dmgNm: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="b-sog">SOG (kn)</Label>
                  <Input id="b-sog" type="number" value={basicInputs.sogKn} onChange={(e) => setBasicInputs({ ...basicInputs, sogKn: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Zaman Dönüşümleri (UTC ↔ ZT ↔ LMT)</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="t-utc">UTC (datetime)</Label>
                  <Input id="t-utc" type="datetime-local" value={basicInputs.timeUtc} onChange={(e) => setBasicInputs({ ...basicInputs, timeUtc: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="t-zone">Zone Offset (hours)</Label>
                  <Input id="t-zone" type="number" value={basicInputs.zoneOffsetHours} onChange={(e) => setBasicInputs({ ...basicInputs, zoneOffsetHours: e.target.value })} />
                </div>
                <div className="col-span-3">
                  <Label htmlFor="t-lon">Longitude for LMT (deg, East + / West -)</Label>
                  <Input id="t-lon" type="number" value={basicInputs.lonForLmt} onChange={(e) => setBasicInputs({ ...basicInputs, lonForLmt: e.target.value })} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">LMT ≈ UTC + (Boylam × 4 dakika). Eğitim amaçlıdır.</div>
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
              <Label htmlFor="comp-variation">Varyasyon (°) (örn: 2E / 2W)</Label>
              <Input
                id="comp-variation"
                type="text"
                inputMode="decimal"
                placeholder="2W"
                value={compassInputs.variation}
                onChange={(e) => setCompassInputs({ ...compassInputs, variation: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="comp-deviation">Deviasyon (°) (örn: 1E / 1W)</Label>
              <Input
                id="comp-deviation"
                type="text"
                inputMode="decimal"
                placeholder="1E"
                value={compassInputs.deviation}
                onChange={(e) => setCompassInputs({ ...compassInputs, deviation: e.target.value })}
              />
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
      case "radar":
        return (
          <div className="space-y-4">
            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Plot 1 (UTC)</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="r1-bearing">Bearing T (°)</Label>
                  <Input id="r1-bearing" type="number" value={radarInputs2.bearing1} onChange={(e) => setRadarInputs2({ ...radarInputs2, bearing1: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="r1-range">Range (NM)</Label>
                  <Input id="r1-range" type="number" value={radarInputs2.range1} onChange={(e) => setRadarInputs2({ ...radarInputs2, range1: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="r1-time">Time (UTC)</Label>
                  <Input id="r1-time" type="datetime-local" value={radarInputs2.time1Utc} onChange={(e) => setRadarInputs2({ ...radarInputs2, time1Utc: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Plot 2 (UTC)</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="r2-bearing">Bearing T (°)</Label>
                  <Input id="r2-bearing" type="number" value={radarInputs2.bearing2} onChange={(e) => setRadarInputs2({ ...radarInputs2, bearing2: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="r2-range">Range (NM)</Label>
                  <Input id="r2-range" type="number" value={radarInputs2.range2} onChange={(e) => setRadarInputs2({ ...radarInputs2, range2: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="r2-time">Time (UTC)</Label>
                  <Input id="r2-time" type="datetime-local" value={radarInputs2.time2Utc} onChange={(e) => setRadarInputs2({ ...radarInputs2, time2Utc: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30">
              <div className="text-sm font-semibold mb-3">Own Ship</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="r-own-course">Course T (°)</Label>
                  <Input id="r-own-course" type="number" value={radarInputs2.ownCourse} onChange={(e) => setRadarInputs2({ ...radarInputs2, ownCourse: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="r-own-speed">Speed (kn)</Label>
                  <Input id="r-own-speed" type="number" value={radarInputs2.ownSpeed} onChange={(e) => setRadarInputs2({ ...radarInputs2, ownSpeed: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        );
      case "colreg":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="colreg-rb">Relative Bearing (°) (0=pruva, 90=sancak beam)</Label>
              <Input id="colreg-rb" type="number" value={colregInputs.relativeBearing} onChange={(e) => setColregInputs({ ...colregInputs, relativeBearing: e.target.value })} />
            </div>
            <div className="text-xs text-muted-foreground">Bu ekran hızlı sınıflama içindir; nihai COLREG kararı AIS/ARPA/ışıklar ve çevre şartlarıyla teyit edilmelidir.</div>
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
      case "astro":
        return (
          <div className="space-y-4">
            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Nautical Almanac (Sun) – UTC</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="astro-date">Sight zamanı (UTC)</Label>
                  <Input id="astro-date" type="datetime-local" value={astroInputs.dateUtc} onChange={(e) => setAstroInputs({ ...astroInputs, dateUtc: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="astro-alm-date">Günlük Almanac tarihi (UTC)</Label>
                  <Input id="astro-alm-date" type="date" value={astroInputs.almanacDateUtc} onChange={(e) => setAstroInputs({ ...astroInputs, almanacDateUtc: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Assumed Position (AP)</div>
              <CoordinateInput id="astro-ap-lat" label="AP Enlem" value={astroInputs.apLat} onChange={(val) => setAstroInputs({ ...astroInputs, apLat: val })} isLatitude={true} />
              <CoordinateInput id="astro-ap-lon" label="AP Boylam" value={astroInputs.apLon} onChange={(val) => setAstroInputs({ ...astroInputs, apLon: val })} isLatitude={false} />
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Sextant (Hs → Ho)</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="astro-hs">Hs (°)</Label>
                  <Input id="astro-hs" type="number" value={astroInputs.hsDeg} onChange={(e) => setAstroInputs({ ...astroInputs, hsDeg: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="astro-ic">IC (′) (index correction)</Label>
                  <Input id="astro-ic" type="number" value={astroInputs.icMin} onChange={(e) => setAstroInputs({ ...astroInputs, icMin: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="astro-he">Height of eye (m)</Label>
                  <Input id="astro-he" type="number" value={astroInputs.heM} onChange={(e) => setAstroInputs({ ...astroInputs, heM: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="astro-p">Pressure (hPa)</Label>
                  <Input id="astro-p" type="number" value={astroInputs.pressureHPa} onChange={(e) => setAstroInputs({ ...astroInputs, pressureHPa: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="astro-t">Temp (°C)</Label>
                  <Input id="astro-t" type="number" value={astroInputs.tempC} onChange={(e) => setAstroInputs({ ...astroInputs, tempC: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Sight Reduction Table (Hc/Zn)</div>
              <CoordinateInput id="astro-tab-lat" label="Lat (° ′) (table)" value={astroInputs.tableLat} onChange={(val) => setAstroInputs({ ...astroInputs, tableLat: val })} isLatitude={true} />
              <CoordinateInput id="astro-tab-dec" label="Dec (° ′) (table)" value={astroInputs.tableDec} onChange={(val) => setAstroInputs({ ...astroInputs, tableDec: val })} isLatitude={true} />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="astro-lha-start">LHA start (°)</Label>
                  <Input id="astro-lha-start" type="number" value={astroInputs.lhaStart} onChange={(e) => setAstroInputs({ ...astroInputs, lhaStart: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="astro-lha-end">LHA end (°)</Label>
                  <Input id="astro-lha-end" type="number" value={astroInputs.lhaEnd} onChange={(e) => setAstroInputs({ ...astroInputs, lhaEnd: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="astro-lha-step">Step (°)</Label>
                  <Input id="astro-lha-step" type="number" value={astroInputs.lhaStep} onChange={(e) => setAstroInputs({ ...astroInputs, lhaStep: e.target.value })} />
                </div>
              </div>
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
      case "fix":
        return (
          <div className="space-y-6">
            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">İki Kerterizle Fix</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <CoordinateInput id="fix-obj1-lat" label="Object 1 Lat" value={fixInputs.obj1Lat} onChange={(val) => setFixInputs({ ...fixInputs, obj1Lat: val })} isLatitude={true} />
                  <CoordinateInput id="fix-obj1-lon" label="Object 1 Lon" value={fixInputs.obj1Lon} onChange={(val) => setFixInputs({ ...fixInputs, obj1Lon: val })} isLatitude={false} />
                  <div>
                    <Label htmlFor="fix-brg1">Bearing to Object 1 (True, °)</Label>
                    <Input id="fix-brg1" type="number" value={fixInputs.brg1} onChange={(e) => setFixInputs({ ...fixInputs, brg1: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-3">
                  <CoordinateInput id="fix-obj2-lat" label="Object 2 Lat" value={fixInputs.obj2Lat} onChange={(val) => setFixInputs({ ...fixInputs, obj2Lat: val })} isLatitude={true} />
                  <CoordinateInput id="fix-obj2-lon" label="Object 2 Lon" value={fixInputs.obj2Lon} onChange={(val) => setFixInputs({ ...fixInputs, obj2Lon: val })} isLatitude={false} />
                  <div>
                    <Label htmlFor="fix-brg2">Bearing to Object 2 (True, °)</Label>
                    <Input id="fix-brg2" type="number" value={fixInputs.brg2} onChange={(e) => setFixInputs({ ...fixInputs, brg2: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Üç Kerterizle Fix (Least Squares)</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-3">
                  <CoordinateInput id="fix-obj3-lat" label="Object 3 Lat" value={fixInputs.obj3Lat} onChange={(val) => setFixInputs({ ...fixInputs, obj3Lat: val })} isLatitude={true} />
                  <CoordinateInput id="fix-obj3-lon" label="Object 3 Lon" value={fixInputs.obj3Lon} onChange={(val) => setFixInputs({ ...fixInputs, obj3Lon: val })} isLatitude={false} />
                  <div>
                    <Label htmlFor="fix-brg3">Bearing to Object 3 (True, °)</Label>
                    <Input id="fix-brg3" type="number" value={fixInputs.brg3} onChange={(e) => setFixInputs({ ...fixInputs, brg3: e.target.value })} />
                  </div>
                </div>
                <div className="col-span-2 text-xs text-muted-foreground">
                  Üç LOP aynı noktada kesişmeyebilir. Bu durumda en iyi uyumlu (least squares) fix ve residual (NM) üretilir.
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">1 Kerteriz + 1 Mesafe (Kerteriz + Mevki Dairesi)</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <CoordinateInput id="bd-obj-lat" label="Object Lat" value={fixInputs.bdObjLat} onChange={(val) => setFixInputs({ ...fixInputs, bdObjLat: val })} isLatitude={true} />
                  <CoordinateInput id="bd-obj-lon" label="Object Lon" value={fixInputs.bdObjLon} onChange={(val) => setFixInputs({ ...fixInputs, bdObjLon: val })} isLatitude={false} />
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="bd-brg">Bearing to Object (True, °)</Label>
                    <Input id="bd-brg" type="number" value={fixInputs.bdBearingToObj} onChange={(e) => setFixInputs({ ...fixInputs, bdBearingToObj: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="bd-dist">Distance to Object (NM)</Label>
                    <Input id="bd-dist" type="number" value={fixInputs.bdDistanceNm} onChange={(e) => setFixInputs({ ...fixInputs, bdDistanceNm: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">2 Mesafe ile Fix (İki Mevki Dairesi Kesişimi)</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <CoordinateInput id="dd-obj1-lat" label="Object 1 Lat" value={fixInputs.ddObj1Lat} onChange={(val) => setFixInputs({ ...fixInputs, ddObj1Lat: val })} isLatitude={true} />
                  <CoordinateInput id="dd-obj1-lon" label="Object 1 Lon" value={fixInputs.ddObj1Lon} onChange={(val) => setFixInputs({ ...fixInputs, ddObj1Lon: val })} isLatitude={false} />
                  <div>
                    <Label htmlFor="dd-d1">Distance to Object 1 (NM)</Label>
                    <Input id="dd-d1" type="number" value={fixInputs.ddDist1Nm} onChange={(e) => setFixInputs({ ...fixInputs, ddDist1Nm: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-3">
                  <CoordinateInput id="dd-obj2-lat" label="Object 2 Lat" value={fixInputs.ddObj2Lat} onChange={(val) => setFixInputs({ ...fixInputs, ddObj2Lat: val })} isLatitude={true} />
                  <CoordinateInput id="dd-obj2-lon" label="Object 2 Lon" value={fixInputs.ddObj2Lon} onChange={(val) => setFixInputs({ ...fixInputs, ddObj2Lon: val })} isLatitude={false} />
                  <div>
                    <Label htmlFor="dd-d2">Distance to Object 2 (NM)</Label>
                    <Input id="dd-d2" type="number" value={fixInputs.ddDist2Nm} onChange={(e) => setFixInputs({ ...fixInputs, ddDist2Nm: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">Opsiyonel: Yaklaşık mevki girersen iki kesişimden uygun olan seçilir.</div>
                  <CoordinateInput id="dd-apx-lat" label="Approx Lat (optional)" value={fixInputs.ddApproxLat} onChange={(val) => setFixInputs({ ...fixInputs, ddApproxLat: val })} isLatitude={true} />
                  <CoordinateInput id="dd-apx-lon" label="Approx Lon (optional)" value={fixInputs.ddApproxLon} onChange={(val) => setFixInputs({ ...fixInputs, ddApproxLon: val })} isLatitude={false} />
                </div>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Running Fix (Taşınmış Kerteriz)</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <CoordinateInput id="run-obj1-lat" label="Object (t1) Lat" value={fixInputs.runObjOldLat} onChange={(val) => setFixInputs({ ...fixInputs, runObjOldLat: val })} isLatitude={true} />
                  <CoordinateInput id="run-obj1-lon" label="Object (t1) Lon" value={fixInputs.runObjOldLon} onChange={(val) => setFixInputs({ ...fixInputs, runObjOldLon: val })} isLatitude={false} />
                  <div>
                    <Label htmlFor="run-brg1">Bearing (t1) True (°)</Label>
                    <Input id="run-brg1" type="number" value={fixInputs.runBrg1} onChange={(e) => setFixInputs({ ...fixInputs, runBrg1: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-3">
                  <CoordinateInput id="run-obj2-lat" label="Object (t2) Lat" value={fixInputs.runObjNewLat} onChange={(val) => setFixInputs({ ...fixInputs, runObjNewLat: val })} isLatitude={true} />
                  <CoordinateInput id="run-obj2-lon" label="Object (t2) Lon" value={fixInputs.runObjNewLon} onChange={(val) => setFixInputs({ ...fixInputs, runObjNewLon: val })} isLatitude={false} />
                  <div>
                    <Label htmlFor="run-brg2">Bearing (t2) True (°)</Label>
                    <Input id="run-brg2" type="number" value={fixInputs.runBrg2} onChange={(e) => setFixInputs({ ...fixInputs, runBrg2: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="run-course">Run Course True (°)</Label>
                  <Input id="run-course" type="number" value={fixInputs.runCourse} onChange={(e) => setFixInputs({ ...fixInputs, runCourse: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="run-distance">Run Distance (NM)</Label>
                  <Input id="run-distance" type="number" value={fixInputs.runDistance} onChange={(e) => setFixInputs({ ...fixInputs, runDistance: e.target.value })} />
                </div>
              </div>
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

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <OfflineLimitedNotice
                title="Offline modda sınırlı içerik"
                description="Liman listesi yerel paketlidir. Gelgit tahmin verisi ve otomatik doldurma için internet gerekir."
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold">Liman ara (Yerel veri)</div>
                <div className="text-xs text-muted-foreground">Offline uyumlu • Paketli liman listesi</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <Label htmlFor="tide-forecast-query">Liman / şehir</Label>
                  <Input
                    id="tide-forecast-query"
                    placeholder="Örn: London, Rotterdam, İzmir..."
                    value={tideForecastQuery}
                    onChange={(e) => setTideForecastQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        searchTideForecast();
                      }
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="button" className="w-full" onClick={searchTideForecast} disabled={tideForecastLoading || !tideForecastQuery.trim() || !isOnline}>
                    {tideForecastLoading ? "Aranıyor..." : isOnline ? "Ara" : "Offline"}
                  </Button>
                </div>
              </div>
              {localPortMatches.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Yerel liman önerileri:</div>
                  <div className="flex flex-wrap gap-2">
                    {localPortMatches.map((port) => (
                      <Button
                        key={port.id}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleLocalPortSelect(port.name)}
                      >
                        {port.name}
                        {port.region ? ` • ${port.region}` : ""}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {tideForecastError && (
                <div className="text-sm text-red-600">{tideForecastError}</div>
              )}

              {tideForecastSuggestions.length > 0 && !tideForecastData && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Eşleşmeler (seç):</div>
                  <div className="flex flex-wrap gap-2">
                    {tideForecastSuggestions.map((s) => (
                      <Button
                        key={s.id}
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => selectTideForecastSuggestion(s)}
                        disabled={tideForecastLoading || !isOnline}
                      >
                        {s.name}{s.region ? ` — ${s.region}` : ""}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {tideForecastData && (
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-semibold">Seçilen:</span> {tideForecastData.selected.name}
                    {tideForecastData.selected.region ? ` — ${tideForecastData.selected.region}` : ""}
                    <span className="text-muted-foreground"> ({tideForecastData.timezoneLabel})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a href={tideForecastData.locationUrl} target="_blank" rel="noreferrer">Sayfayı aç</a>
                    </Button>
                    {typeof tideForecastData.rangeM === "number" && Number.isFinite(tideForecastData.rangeM) && (
                      <div className="text-xs text-muted-foreground flex items-center">
                        Range ≈ <span className="font-mono ml-1">{tideForecastData.rangeM.toFixed(2)} m</span>
                      </div>
                    )}
                  </div>

                  {tideForecastData.timezoneLabel.trim().toUpperCase() !== "GMT" &&
                    tideForecastData.timezoneLabel.trim().toUpperCase() !== "UTC" && (
                      <div className="text-xs text-muted-foreground">
                        Not: Saatler <strong>{tideForecastData.timezoneLabel}</strong> olarak geliyor. “HW/LW → Height of Tide (UTC)” alanlarına otomatik yazım sadece GMT/UTC’de yapılır.
                      </div>
                    )}

                  {tideForecastData.events.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Olay</th>
                            <th className="text-left p-2">Tarih</th>
                            <th className="text-left p-2">Saat</th>
                            <th className="text-left p-2">Yükseklik (m)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tideForecastData.events.slice(0, 8).map((ev, i) => (
                            <tr key={i} className="border-b">
                              <td className="p-2">{ev.type === "high" ? "High" : "Low"}</td>
                              <td className="p-2">{ev.dateLabel}</td>
                              <td className="p-2 font-mono">{ev.timeLabel}</td>
                              <td className="p-2 font-mono">{ev.heightM.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
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

            <div className="rounded border p-3 bg-muted/30">
              <div className="text-sm font-semibold mb-2">Dünya limanları için tide tables</div>
              <div className="text-xs text-muted-foreground mb-3">
                Liman adına göre hazır gelgit çizelgesi/tablolarına ulaşmak için:
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href="https://www.worldtides.info" target="_blank" rel="noreferrer">
                    WorldTides
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href="https://www.tide-forecast.com" target="_blank" rel="noreferrer">
                    Tide-Forecast
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">HW / LW → Height of Tide (UTC)</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hot-lw-time">LW Time (UTC)</Label>
                  <Input id="hot-lw-time" type="datetime-local" value={tideHotInputs.lwTimeUtc} onChange={(e) => setTideHotInputs({ ...tideHotInputs, lwTimeUtc: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="hot-lw-h">LW Height (m)</Label>
                  <Input id="hot-lw-h" type="number" value={tideHotInputs.lwHeightM} onChange={(e) => setTideHotInputs({ ...tideHotInputs, lwHeightM: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="hot-hw-time">HW Time (UTC)</Label>
                  <Input id="hot-hw-time" type="datetime-local" value={tideHotInputs.hwTimeUtc} onChange={(e) => setTideHotInputs({ ...tideHotInputs, hwTimeUtc: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="hot-hw-h">HW Height (m)</Label>
                  <Input id="hot-hw-h" type="number" value={tideHotInputs.hwHeightM} onChange={(e) => setTideHotInputs({ ...tideHotInputs, hwHeightM: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="hot-q-time">Query Time (UTC)</Label>
                  <Input id="hot-q-time" type="datetime-local" value={tideHotInputs.queryTimeUtc} onChange={(e) => setTideHotInputs({ ...tideHotInputs, queryTimeUtc: e.target.value })} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Rule of Twelfths eğrisi ile yaklaşık “height of tide” üretir.</div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">UKC (Squat + Tide + Draft)</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ukc-depth">Charted Depth (m)</Label>
                  <Input id="ukc-depth" type="number" value={ukcInputs.chartedDepthM} onChange={(e) => setUkcInputs({ ...ukcInputs, chartedDepthM: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ukc-draft">Draft (m)</Label>
                  <Input id="ukc-draft" type="number" value={ukcInputs.draftM} onChange={(e) => setUkcInputs({ ...ukcInputs, draftM: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ukc-speed">Speed (kn)</Label>
                  <Input id="ukc-speed" type="number" value={ukcInputs.speedKn} onChange={(e) => setUkcInputs({ ...ukcInputs, speedKn: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ukc-cb">Block Coefficient (Cb)</Label>
                  <Input id="ukc-cb" type="number" value={ukcInputs.blockCoeff} onChange={(e) => setUkcInputs({ ...ukcInputs, blockCoeff: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ukc-env">Environment</Label>
                  <Select value={ukcInputs.environment} onValueChange={(v) => setUkcInputs({ ...ukcInputs, environment: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="confined">Confined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ukc-safety">Safety Margin (m)</Label>
                  <Input id="ukc-safety" type="number" value={ukcInputs.safetyMarginM} onChange={(e) => setUkcInputs({ ...ukcInputs, safetyMarginM: e.target.value })} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Height of Tide sonucu yukarıdaki HW/LW hesaplamasından alınır.</div>
            </div>

            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Gelgit Akıntısı (Tidal Stream) – Pratik</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ts-stage">Stage</Label>
                  <Select value={tidalStreamInputs.stage} onValueChange={(v) => setTidalStreamInputs({ ...tidalStreamInputs, stage: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flood">Flood</SelectItem>
                      <SelectItem value="ebb">Ebb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ts-hour">Hour from slack (0..6)</Label>
                  <Input id="ts-hour" type="number" value={tidalStreamInputs.hourFromSlack} onChange={(e) => setTidalStreamInputs({ ...tidalStreamInputs, hourFromSlack: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ts-spring-rate">Spring max rate (kn)</Label>
                  <Input id="ts-spring-rate" type="number" value={tidalStreamInputs.springMaxRateKn} onChange={(e) => setTidalStreamInputs({ ...tidalStreamInputs, springMaxRateKn: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ts-neap-rate">Neap max rate (kn)</Label>
                  <Input id="ts-neap-rate" type="number" value={tidalStreamInputs.neapMaxRateKn} onChange={(e) => setTidalStreamInputs({ ...tidalStreamInputs, neapMaxRateKn: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ts-spring-range">Spring range (m)</Label>
                  <Input id="ts-spring-range" type="number" value={tidalStreamInputs.springRangeM} onChange={(e) => setTidalStreamInputs({ ...tidalStreamInputs, springRangeM: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ts-neap-range">Neap range (m)</Label>
                  <Input id="ts-neap-range" type="number" value={tidalStreamInputs.neapRangeM} onChange={(e) => setTidalStreamInputs({ ...tidalStreamInputs, neapRangeM: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="ts-actual-range">Actual range (m)</Label>
                  <Input id="ts-actual-range" type="number" value={tidalStreamInputs.actualRangeM} onChange={(e) => setTidalStreamInputs({ ...tidalStreamInputs, actualRangeM: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ts-flood-set">Flood set (°T) (optional)</Label>
                  <Input id="ts-flood-set" type="number" value={tidalStreamInputs.floodSetDeg} onChange={(e) => setTidalStreamInputs({ ...tidalStreamInputs, floodSetDeg: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="ts-ebb-set">Ebb set (°T) (optional)</Label>
                  <Input id="ts-ebb-set" type="number" value={tidalStreamInputs.ebbSetDeg} onChange={(e) => setTidalStreamInputs({ ...tidalStreamInputs, ebbSetDeg: e.target.value })} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Basit model: spring/neap skalası + slack→max→slack sinüs eğrisi (eğitim amaçlı).</div>
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
      case "safety":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="safe-depth">Charted Depth (m)</Label>
                <Input id="safe-depth" type="number" value={safetyInputs.chartedDepthM} onChange={(e) => setSafetyInputs({ ...safetyInputs, chartedDepthM: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="safe-tide">Tide (m)</Label>
                <Input id="safe-tide" type="number" value={safetyInputs.tideM} onChange={(e) => setSafetyInputs({ ...safetyInputs, tideM: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="safe-draft">Draft (m)</Label>
                <Input id="safe-draft" type="number" value={safetyInputs.draftM} onChange={(e) => setSafetyInputs({ ...safetyInputs, draftM: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="safe-speed">Speed (kn)</Label>
                <Input id="safe-speed" type="number" value={safetyInputs.speedKn} onChange={(e) => setSafetyInputs({ ...safetyInputs, speedKn: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="safe-cb">Cb</Label>
                <Input id="safe-cb" type="number" value={safetyInputs.blockCoeff} onChange={(e) => setSafetyInputs({ ...safetyInputs, blockCoeff: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="safe-env">Environment</Label>
                <Select value={safetyInputs.environment} onValueChange={(v) => setSafetyInputs({ ...safetyInputs, environment: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="confined">Confined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="safe-margin">Safety Margin (m)</Label>
                <Input id="safe-margin" type="number" value={safetyInputs.safetyMarginM} onChange={(e) => setSafetyInputs({ ...safetyInputs, safetyMarginM: e.target.value })} />
              </div>
            </div>
          </div>
        );
      case "passage":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pp-etd">ETD (UTC)</Label>
              <Input id="pp-etd" type="datetime-local" value={passageInputs.etdUtc} onChange={(e) => setPassageInputs({ ...passageInputs, etdUtc: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pp-l1d">Leg 1 Distance (NM)</Label>
                <Input id="pp-l1d" type="number" value={passageInputs.leg1Dist} onChange={(e) => setPassageInputs({ ...passageInputs, leg1Dist: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="pp-l1s">Leg 1 SOG (kn)</Label>
                <Input id="pp-l1s" type="number" value={passageInputs.leg1Sog} onChange={(e) => setPassageInputs({ ...passageInputs, leg1Sog: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="pp-l2d">Leg 2 Distance (NM)</Label>
                <Input id="pp-l2d" type="number" value={passageInputs.leg2Dist} onChange={(e) => setPassageInputs({ ...passageInputs, leg2Dist: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="pp-l2s">Leg 2 SOG (kn)</Label>
                <Input id="pp-l2s" type="number" value={passageInputs.leg2Sog} onChange={(e) => setPassageInputs({ ...passageInputs, leg2Sog: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="pp-l3d">Leg 3 Distance (NM)</Label>
                <Input id="pp-l3d" type="number" value={passageInputs.leg3Dist} onChange={(e) => setPassageInputs({ ...passageInputs, leg3Dist: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="pp-l3s">Leg 3 SOG (kn)</Label>
                <Input id="pp-l3s" type="number" value={passageInputs.leg3Sog} onChange={(e) => setPassageInputs({ ...passageInputs, leg3Sog: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="pp-l4d">Leg 4 Distance (NM)</Label>
                <Input id="pp-l4d" type="number" value={passageInputs.leg4Dist} onChange={(e) => setPassageInputs({ ...passageInputs, leg4Dist: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="pp-l4s">Leg 4 SOG (kn)</Label>
                <Input id="pp-l4s" type="number" value={passageInputs.leg4Sog} onChange={(e) => setPassageInputs({ ...passageInputs, leg4Sog: e.target.value })} />
              </div>
            </div>
          </div>
        );
      case "ecdis":
        return (
          <div className="space-y-4">
            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Leg</div>
              <CoordinateInput id="ecdis-slat" label="Start Lat" value={ecdisInputs.startLat} onChange={(val) => setEcdisInputs({ ...ecdisInputs, startLat: val })} isLatitude={true} />
              <CoordinateInput id="ecdis-slon" label="Start Lon" value={ecdisInputs.startLon} onChange={(val) => setEcdisInputs({ ...ecdisInputs, startLon: val })} isLatitude={false} />
              <CoordinateInput id="ecdis-elat" label="End Lat" value={ecdisInputs.endLat} onChange={(val) => setEcdisInputs({ ...ecdisInputs, endLat: val })} isLatitude={true} />
              <CoordinateInput id="ecdis-elon" label="End Lon" value={ecdisInputs.endLon} onChange={(val) => setEcdisInputs({ ...ecdisInputs, endLon: val })} isLatitude={false} />
            </div>
            <div className="rounded border p-3 bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">Position</div>
              <CoordinateInput id="ecdis-plat" label="Pos Lat" value={ecdisInputs.posLat} onChange={(val) => setEcdisInputs({ ...ecdisInputs, posLat: val })} isLatitude={true} />
              <CoordinateInput id="ecdis-plon" label="Pos Lon" value={ecdisInputs.posLon} onChange={(val) => setEcdisInputs({ ...ecdisInputs, posLon: val })} isLatitude={false} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ecdis-sog">SOG (kn)</Label>
                <Input id="ecdis-sog" type="number" value={ecdisInputs.sogKn} onChange={(e) => setEcdisInputs({ ...ecdisInputs, sogKn: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="ecdis-look">Look-ahead (min)</Label>
                <Input id="ecdis-look" type="number" value={ecdisInputs.lookAheadMin} onChange={(e) => setEcdisInputs({ ...ecdisInputs, lookAheadMin: e.target.value })} />
              </div>
            </div>
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
              {Array.isArray(gcResults.waypoints) && gcResults.waypoints.length > 0 && (
                <div className="rounded border p-3 bg-muted/30 mt-3">
                  <div className="text-sm font-semibold mb-2">Great Circle Waypoints</div>
                  <div className="text-xs text-muted-foreground mb-2">Toplam: {gcResults.waypoints.length} nokta (ilk 12 gösterilir)</div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">#</th>
                          <th className="text-left p-2">Lat</th>
                          <th className="text-left p-2">Lon</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gcResults.waypoints.slice(0, 12).map((p: any, i: number) => (
                          <tr key={i} className="border-b">
                            <td className="p-2 font-mono">{i + 1}</td>
                            <td className="p-2 font-mono">{formatDecimalAsDMS(p.latDeg, true, true)}</td>
                            <td className="p-2 font-mono">{formatDecimalAsDMS(p.lonDeg, false, true)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
      case "midlat":
        return (
          midlatResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nMean Lat: ${midlatResults.meanLatDeg.toFixed(4)}°\ndLat: ${midlatResults.dLatMin.toFixed(2)}′\ndLong: ${midlatResults.dLongMin.toFixed(2)}′\nDeparture: ${midlatResults.departureMin.toFixed(2)}′\nKurs: ${midlatResults.courseDeg.toFixed(1)}°\nMesafe: ${midlatResults.distanceNm.toFixed(2)} NM`}</pre>
          )
        );
      case "chart":
        return (
          chartResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\n${chartResults.nmFromCm !== undefined ? `cm → NM: ${chartResults.nmFromCm.toFixed(3)} NM\n` : ""}${chartResults.cmFromNm !== undefined ? `NM → cm: ${chartResults.cmFromNm.toFixed(2)} cm` : ""}`}</pre>
          )
        );
      case "position":
        return (
          positionResults && (
            <pre className="font-mono text-sm leading-6">{`DR Sonucu:\nLat: ${formatDecimalAsDMS(positionResults.latDeg, true)}\nLon: ${formatDecimalAsDMS(positionResults.lonDeg, false)}`}</pre>
          )
        );
      case "eta":
        return (
          basicResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nMesafe: ${basicResults.solved.distanceNm.toFixed(2)} NM\nHız: ${basicResults.solved.speedKn.toFixed(2)} kn\nZaman: ${basicResults.solved.timeHours.toFixed(3)} h (${basicResults.timeHhMm.hh}h ${basicResults.timeHhMm.mm}m)\n${basicResults.converted !== null ? `\nDönüşüm: ${basicResults.converted.toFixed(4)}` : ""}${basicResults.etaUtcIso ? `\nETA (UTC): ${basicResults.etaUtcIso}` : ""}${basicResults.remaining ? `\n\nKalan Mesafe: ${basicResults.remaining.remainingDistanceNm.toFixed(2)} NM\nKalan Süre: ${basicResults.remaining.remainingTimeHours.toFixed(2)} h` : ""}${basicResults.timeConv ? `\n\nZaman Dönüşümü:\nUTC: ${basicResults.timeConv.utcIso}\nZT (UTC${basicResults.timeConv.zoneOffsetHours >= 0 ? "+" : ""}${basicResults.timeConv.zoneOffsetHours}): ${basicResults.timeConv.zoneIso}\nBoylam: ${basicResults.timeConv.lonDeg.toFixed(2)}° => ${basicResults.timeConv.lonMinutes.toFixed(1)} dakika\nLMT: ${basicResults.timeConv.lmtIso}` : ""}`}</pre>
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
            <pre className="font-mono text-sm leading-6">{`Sonuç (TVMDC):\nCompass: ${compassResults.compassDeg.toFixed(1)}°\nMagnetic: ${compassResults.magneticDeg.toFixed(1)}°\nTrue: ${compassResults.trueDeg.toFixed(1)}°\nCompass Error (Var+Dev): ${compassResults.compassErrorDeg.toFixed(1)}°\nToplam Hata: ${compassResults.totalError.toFixed(1)}°`}</pre>
          )
        );
      case "cpa":
        return (
          cpaResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nCPA Mesafesi: ${cpaResults.cpaNm.toFixed(2)} nm\nTCPA: ${cpaResults.tcpaMin.toFixed(1)} dk`}</pre>
          )
        );
      case "radar":
        return (
          radarResults2 && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nRelative Course: ${radarResults2.relativeCourseDeg.toFixed(1)}°\nRelative Speed: ${radarResults2.relativeSpeedKn.toFixed(2)} kn\n\nTarget Course (T): ${radarResults2.targetCourseTrueDeg.toFixed(1)}°\nTarget Speed: ${radarResults2.targetSpeedKn.toFixed(2)} kn\n\nCPA: ${radarResults2.cpaNm.toFixed(2)} NM\nTCPA: ${radarResults2.tcpaMin.toFixed(1)} min`}</pre>
          )
        );
      case "colreg":
        return (
          colregResults && (
            <pre className="font-mono text-sm leading-6">{`COLREG Quick Check:\nSituation: ${colregResults.situation}\nGive-way: ${colregResults.isGiveWay === null ? "—" : colregResults.isGiveWay ? "Yes" : "No"}\nNote: ${colregResults.note}`}</pre>
          )
        );
      case "sight":
        return (
          sightResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nHesaplanan Yükseklik: ${sightResults.hcDeg.toFixed(2)}°\nAzimut: ${sightResults.azimuthDeg.toFixed(1)}°`}</pre>
          )
        );
      case "astro":
        return (
          astroResults && (
            <div className="space-y-3">
              <pre className="font-mono text-sm leading-6">{`Sextant Correction:\nHa: ${astroResults.correction.haDeg.toFixed(4)}°\nHo: ${astroResults.correction.hoDeg.toFixed(4)}°\nDip: ${astroResults.correction.dipMin.toFixed(2)}′\nRefraction: ${astroResults.correction.refractionMin.toFixed(2)}′\n\nSun Almanac / Sight:\nGHA: ${astroResults.intercept.ghaDeg.toFixed(2)}°\nDec: ${astroResults.intercept.decDeg.toFixed(2)}°\nLHA: ${astroResults.intercept.lhaDeg.toFixed(2)}°\nHc: ${astroResults.intercept.hcDeg.toFixed(2)}°\nZn: ${astroResults.intercept.znDeg.toFixed(1)}°\nIntercept: ${astroResults.intercept.interceptNm.toFixed(2)} NM (${astroResults.intercept.towardAway})`}</pre>
              <div className="rounded border p-3 bg-muted/30">
                <div className="text-sm font-semibold mb-2">Daily Sun Almanac (UTC, hourly)</div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">UTC</th>
                        <th className="text-left p-2">GHA Sun</th>
                        <th className="text-left p-2">Dec Sun</th>
                        <th className="text-left p-2">GHA Aries</th>
                      </tr>
                    </thead>
                    <tbody>
                      {astroResults.almanacRows.slice(0, 24).map((r: any) => (
                        <tr key={r.utcHour} className="border-b">
                          <td className="p-2 font-mono">{String(r.utcHour).padStart(2, "0")}:00</td>
                          <td className="p-2 font-mono">{r.ghaSunDeg.toFixed(2)}°</td>
                          <td className="p-2 font-mono">{r.decSunDeg.toFixed(2)}°</td>
                          <td className="p-2 font-mono">{r.ghaAriesDeg.toFixed(2)}°</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="rounded border p-3 bg-muted/30">
                <div className="text-sm font-semibold mb-2">Sight Reduction Table (sample)</div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">LHA</th>
                        <th className="text-left p-2">Hc</th>
                        <th className="text-left p-2">Zn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {astroResults.table.slice(0, 60).map((row: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="p-2 font-mono">{row.lhaDeg.toFixed(0)}°</td>
                          <td className="p-2 font-mono">{row.hcDeg.toFixed(2)}°</td>
                          <td className="p-2 font-mono">{row.znDeg.toFixed(1)}°</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-xs text-muted-foreground mt-2">Not: HO-249/HO-229 tablo mantığı burada algoritmik üretilmiştir.</div>
              </div>
            </div>
          )
        );
      case "bearings":
        return (
          bearingResults && (
            <pre className="font-mono text-sm leading-6">{`Sonuç:\nMesafe Off: ${bearingResults.distanceOffNm.toFixed(2)} nm`}</pre>
          )
        );
      case "fix":
        return (
          fixResults && (
            <pre className="font-mono text-sm leading-6">{`${fixResults.fix ? `İki Kerteriz Fix:\nLat: ${formatDecimalAsDMS(fixResults.fix.fix.latDeg, true)}\nLon: ${formatDecimalAsDMS(fixResults.fix.fix.lonDeg, false)}\nIntersection angle: ${fixResults.fix.intersectionAngleDeg.toFixed(1)}°\n\n` : ""}${fixResults.three ? `Üç Kerteriz Fix (LS):\nLat: ${formatDecimalAsDMS(fixResults.three.fix.latDeg, true)}\nLon: ${formatDecimalAsDMS(fixResults.three.fix.lonDeg, false)}\nResidual: ${fixResults.three.residualNm.toFixed(2)} NM\nBest intersection angle: ${fixResults.three.bestIntersectionAngleDeg.toFixed(1)}°\n\n` : ""}${fixResults.bearingDistance ? `1 Kerteriz + 1 Mesafe:\nLat: ${formatDecimalAsDMS(fixResults.bearingDistance.fix.latDeg, true)}\nLon: ${formatDecimalAsDMS(fixResults.bearingDistance.fix.lonDeg, false)}\n\n` : ""}${fixResults.twoDistances ? `2 Mesafe Fix:\nLat: ${formatDecimalAsDMS(fixResults.twoDistances.fix.latDeg, true)}\nLon: ${formatDecimalAsDMS(fixResults.twoDistances.fix.lonDeg, false)}\nCandidates: ${fixResults.twoDistances.candidates.length}\n\n` : ""}${fixResults.running ? `Running Fix:\nLat: ${formatDecimalAsDMS(fixResults.running.fix.latDeg, true)}\nLon: ${formatDecimalAsDMS(fixResults.running.fix.lonDeg, false)}\nIntersection angle: ${fixResults.running.intersectionAngleDeg.toFixed(1)}°` : ""}`}</pre>
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
          (tideResults || tideHotResults || ukcResults || tidalStreamResults) && (
            <pre className="font-mono text-sm leading-6">{`Rule of Twelfths:\nYükseklik: ${tideResults?.heightM?.toFixed?.(2) ?? "—"} m\n\nHW/LW → Height of Tide:\n${tideHotResults ? `Height: ${tideHotResults.heightM.toFixed(2)} m\nStage: ${tideHotResults.stage}\n` : "—\n"}\nUKC:\n${ukcResults ? `Squat: ${ukcResults.squatM.toFixed(2)} m\nUKC: ${ukcResults.ukcM.toFixed(2)} m\nSafe: ${ukcResults.isSafe ? "Yes" : "No"}` : "—"}\n\nTidal Stream:\n${tidalStreamResults ? `Set: ${tidalStreamResults.setDeg.toFixed(0)}°\nRate: ${tidalStreamResults.rateKn.toFixed(2)} kn\nMax: ${tidalStreamResults.maxRateKn.toFixed(2)} kn\nFactor: ${(tidalStreamResults.springNeapFactor * 100).toFixed(0)}%` : "—"}`}</pre>
          )
        );
      case "safety":
        return (
          safetyResults && (
            <pre className="font-mono text-sm leading-6">{`Squat: ${safetyResults.squatM.toFixed(2)} m\nUKC: ${safetyResults.ukcM.toFixed(2)} m\nSafe: ${safetyResults.isSafe ? "Yes" : "No"}`}</pre>
          )
        );
      case "passage":
        return (
          passageResults && (
            <div className="rounded border p-3 bg-muted/30">
              <div className="text-sm font-semibold mb-2">Leg ETA (UTC)</div>
              <div className="text-xs text-muted-foreground mb-2">ETD: <span className="font-mono">{passageResults.etdIso}</span></div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Leg</th>
                      <th className="text-left p-2">Dist (NM)</th>
                      <th className="text-left p-2">SOG (kn)</th>
                      <th className="text-left p-2">Dur (h)</th>
                      <th className="text-left p-2">Start</th>
                      <th className="text-left p-2">ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passageResults.rows.map((r: any) => (
                      <tr key={r.name} className="border-b">
                        <td className="p-2">{r.name}</td>
                        <td className="p-2 font-mono">{r.distanceNm.toFixed(2)}</td>
                        <td className="p-2 font-mono">{r.sogKn.toFixed(2)}</td>
                        <td className="p-2 font-mono">{r.durationHours.toFixed(2)}</td>
                        <td className="p-2 font-mono">{r.startIso}</td>
                        <td className="p-2 font-mono">{r.etaIso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-muted-foreground mt-2">Toplam mesafe: <span className="font-mono">{passageResults.totalDistanceNm.toFixed(2)} NM</span></div>
            </div>
          )
        );
      case "ecdis":
        return (
          ecdisResults && (
            <pre className="font-mono text-sm leading-6">{`XTD: ${ecdisResults.xtd.xtdNm.toFixed(3)} NM\nSide: ${ecdisResults.xtd.side}\nAlong-track: ${ecdisResults.xtd.alongTrackNm.toFixed(2)} NM\n\nLook-ahead distance: ${ecdisResults.look.lookAheadDistanceNm.toFixed(2)} NM`}</pre>
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
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calculator className="h-4 w-4" /> {title}
          </div>
        </div>

        <Card className="shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-3">
            <CardTitle className="flex-1">{title}</CardTitle>
            {id === "tides" && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/navigation/tide-tutorial")}>
                  Hesabın Yapılışı
                </Button>
              </div>
            )}
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
