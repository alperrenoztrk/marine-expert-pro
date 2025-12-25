import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Compass, MapPin, Clock, Wind, Waves, Sun, Moon, Navigation, Target, Radar, CheckCircle, Sunrise, Sunset, Star, Globe, Ship, Anchor, Eye, Camera, Plus, Trash2, Brain, BookOpen } from "lucide-react";
import SextantCamera from "@/components/SextantCamera";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";
import { toast } from "sonner";
import { CoordinateInput } from "@/components/CoordinateInput";
import { DirectionInput } from "@/components/DirectionInput";
import NavigationAssistantPopup from "@/components/NavigationAssistantPopup";
import { computeSunAlmanac, generateDailySunAlmanac } from "./navigationMath";

interface NavigationData {
  // Traverse sailing legs
  traverseLegs: Array<{ course: number; distance: number; speed?: number }>;
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
  springTideRange: number; // Spring tide range (m)
  neapTideRange: number; // Neap tide range (m)
  
  // Celestial navigation
  altitude: number; // Sextant altitude (degrees)
  azimuth: number; // Celestial body azimuth (degrees)
  
  // Astronomical data
  date: string; // Date for calculations (YYYY-MM-DD)
  timeZone: number; // Time zone offset from UTC (hours)
  observerLatitude: number; // Observer latitude (degrees)
  observerLongitude: number; // Observer longitude (degrees)
  gha: number; // Greenwich Hour Angle (degrees)
  declination: number; // Declination (degrees)
  
  // Turn data
  rudderAngle: number; // Rudder angle (degrees)
  shipLength: number; // Ship length (m)
  shipSpeed: number; // Ship speed (m/s)
  
  // Weather data
  waveHeight: number; // Significant wave height (m)
  wavePeriod: number; // Wave period (s)
  waveDirection: number; // Wave direction (degrees)
  visibility: number; // Visibility (nm)
  barometricPressure: number; // Pressure (hPa)
  
  // Port approach data
  pilotBoardingLat: number; // Pilot boarding latitude
  pilotBoardingLon: number; // Pilot boarding longitude
  portApproachSpeed: number; // Approach speed (knots)
  requiredUKC: number; // Required under keel clearance (m)
  shipDraft: number; // Ship draft (m)
}

interface NavigationResult {
  // Great Circle results
  gcDistance: number; // Great circle distance (nm)
  gcInitialBearing: number; // Initial bearing (degrees)
  gcFinalBearing: number; // Final bearing (degrees)
  gcVertexLat: number; // Vertex latitude (degrees)
  gcWaypointDistances: number[]; // Waypoint distances
  
  // Rhumb Line results
  rhumbDistance: number; // Rhumb line distance (nm)
  rhumbBearing: number; // Rhumb line bearing (degrees)
  departure: number; // Departure (nm)
  dLat: number; // Difference in latitude (nm)
  mercatorDistance: number; // Mercator sailing distance
  
  // Spheroidal calculations (more precise)
  spheroidalDistance: number; // WGS84 ellipsoid distance (nm)
  spheroidalBearing: number; // Forward azimuth on ellipsoid
  reverseBearing: number; // Reverse azimuth
  
  // Time and ETA
  eta: string; // Estimated time of arrival
  etd: string; // Estimated time of departure
  timeToGo: number; // Time to destination (hours)
  fuelConsumption: number; // Estimated fuel consumption
  totalFuelCost: number; // Estimated fuel cost
  alternateETA: string; // ETA with weather delays
  
  // Current triangle
  groundTrack: number; // Ground track (degrees)
  groundSpeed: number; // Speed over ground (knots)
  driftAngle: number; // Drift angle (degrees)
  courseToSteer: number; // Course to steer (degrees)
  leewayCorrection: number; // Leeway correction angle
  
  // Compass calculations
  magneticBearing: number; // Magnetic bearing
  compassBearing: number; // Compass bearing
  trueBearing: number; // True bearing
  totalCompassError: number; // Total compass error
  
  // ARPA calculations
  cpa: number; // Closest point of approach (nm)
  tcpa: number; // Time to CPA (minutes)
  relativeSpeed: number; // Relative speed (knots)
  relativeBearing: number; // Relative bearing (degrees)
  collisionRisk: 'high' | 'medium' | 'low' | 'none';
  recommendedAction: string;
  bcpa: number; // Bearing at CPA
  dcpa: number; // Distance at CPA
  
  // Enhanced Tidal calculations
  currentTideHeight: number; // Current tide height (m)
  tideRange: number; // Tide range (m)
  timeToHW: number; // Time to high water (hours)
  timeToLW: number; // Time to low water (hours)
  tidalStream: number; // Tidal stream rate (knots)
  tidalStreamDirection: number; // Tidal stream direction
  springNeapFactor: number; // Spring/neap tide factor
  tidalAcceleration: number; // Rate of tide change (m/hr)
  
  // Enhanced Celestial results
  intercept: number; // Intercept (nm)
  positionLine: string; // Position line description
  latitude: number; // Calculated latitude
  longitude: number; // Calculated longitude
  altitudeCorrection: number; // Total altitude correction
  celestialCompassError: number; // Compass error from celestial
  estimatedPosition: { lat: number; lon: number }; // EP from celestial
  
  // Astronomical positions
  sunPosition: { altitude: number; azimuth: number; declination: number };
  moonPosition: { altitude: number; azimuth: number; phase: number };
  planetPositions: Array<{ name: string; altitude: number; azimuth: number; magnitude: number }>;
  navigationStars: Array<{ name: string; altitude: number; azimuth: number; magnitude: number }>;
  
  // Twilight times (enhanced)
  twilightTimes: {
    sunrise: string;
    sunset: string;
    civilTwilightBegin: string;
    civilTwilightEnd: string;
    nauticalTwilightBegin: string;
    nauticalTwilightEnd: string;
    astronomicalTwilightBegin: string;
    astronomicalTwilightEnd: string;
    daylightDuration: number; // Hours of daylight
    goldenHourBegin: string; // Golden hour start
    goldenHourEnd: string; // Golden hour end
    blueHourBegin: string; // Blue hour start
    blueHourEnd: string; // Blue hour end
  };
  
  // Turn circle
  advance: number; // Advance distance (m)
  transfer: number; // Transfer distance (m)
  tacticalDiameter: number; // Tactical diameter (m)
  finalDiameter: number; // Final diameter (m)
  wheelOverPoint: number; // Wheel over point (nm)
  turningRadius: number; // Turning radius (m)
  
  // Weather routing
  optimumRoute: string; // Optimum route recommendation
  weatherDelay: number; // Weather delay (hours)
  safeCourse: number; // Safe course in heavy weather
  seaState: number; // Douglas sea state scale
  beaufortScale: number; // Beaufort wind scale
  
  // Port approach calculations
  pilotBoardingDistance: number; // Distance to pilot boarding point (nm)
  pilotBoardingETA: string; // ETA at pilot boarding point
  approachSpeed: number; // Recommended approach speed
  minimumDepth: number; // Minimum depth along route (m)
  safeDraft: number; // Safe draft considering UKC (m)

  // Basic time–speed–distance helpers
  basicDistance?: number;
  basicTimeHours?: number;
  basicSpeed?: number;
  speedKmh?: number;
  speedMs?: number;
  remainingTimeHours?: number;
  averageSpeed?: number;
  smg?: number;
  dmg?: number;

  recommendations: string[];
}

export const NavigationCalculations = ({ initialTab }: { initialTab?: string } = {}) => {
  const [activeCalculation, setActiveCalculation] = useState<string>(initialTab || "dr-plotting");
  const { data: currentWeather } = useCurrentWeather({ watchPosition: false, reverseGeocode: false, refreshMs: 300000 });
  const autoInitRef = useRef(false);
  const [data, setData] = useState<NavigationData>({
    traverseLegs: [
      { course: 90, distance: 10 },
      { course: 135, distance: 15 },
      { course: 180, distance: 8 }
    ],
    lat1: 0, lon1: 0, lat2: 0, lon2: 0,
    speed: 12, course: 0,
    currentSet: 0, currentDrift: 0,
    windDirection: 0, windSpeed: 0, leewayAngle: 2,
    variation: 0, deviation: 0, gyroError: 0,
    targetBearing: 0, targetDistance: 0, targetSpeed: 0, targetCourse: 0,
    highWaterTime: "1200", lowWaterTime: "0600",
    highWaterHeight: 4.5, lowWaterHeight: 0.5,
    springTideRange: 4.0, neapTideRange: 2.0,
    currentTime: "0900",
    altitude: 0, azimuth: 0, gha: 0, declination: 0,
    
    // Astronomical data
    date: new Date().toISOString().split('T')[0],
    timeZone: 3, // default; auto-initialized from current location when available
    observerLatitude: 41.0082,
    observerLongitude: 28.9784,
    
    rudderAngle: 15, shipLength: 150, shipSpeed: 6,
    
    // Weather data
    waveHeight: 1.5, wavePeriod: 6, waveDirection: 270,
    visibility: 10, barometricPressure: 1013,
    
    // Port approach data
    pilotBoardingLat: 41.1500, pilotBoardingLon: 29.1000,
    portApproachSpeed: 8, requiredUKC: 2.0, shipDraft: 8.5
  });

  // Auto-initialize celestial observer defaults from current location (once)
  useEffect(() => {
    if (autoInitRef.current) return;
    if (!currentWeather) return;
    autoInitRef.current = true;

    const DEFAULT_LAT = 41.0082;
    const DEFAULT_LON = 28.9784;
    const DEFAULT_TZ = 3;

    setData((prev) => {
      const next = { ...prev };

      const tzHours =
        typeof currentWeather.utcOffsetSeconds === "number" && Number.isFinite(currentWeather.utcOffsetSeconds)
          ? currentWeather.utcOffsetSeconds / 3600
          : undefined;

      if (
        prev.observerLatitude === DEFAULT_LAT &&
        prev.observerLongitude === DEFAULT_LON &&
        Number.isFinite(currentWeather.latitude) &&
        Number.isFinite(currentWeather.longitude)
      ) {
        next.observerLatitude = currentWeather.latitude;
        next.observerLongitude = currentWeather.longitude;
      }

      if (prev.timeZone === DEFAULT_TZ && tzHours !== undefined) {
        next.timeZone = tzHours;
      }

      return next;
    });
  }, [currentWeather]);

  const [result, setResult] = useState<NavigationResult | null>(null);
  const [traverseResult, setTraverseResult] = useState<{
    totalDistance: number;
    totalCourse: number;
    totalDLat: number;
    totalDeparture: number;
    finalLat: number;
    finalLon: number;
    totalTime: number;
    legPositions: Array<{ lat: number; lon: number }>;
  } | null>(null);

  const [basicTSD, setBasicTSD] = useState({ distanceNm: 120, speedKn: 12, timeHours: 10 });
  const [progressCalc, setProgressCalc] = useState({
    distanceRunNm: 40,
    plannedDistanceNm: 120,
    remainingDistanceNm: 80,
    timeElapsedHours: 3
  });

  // Utility functions for calculations
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const toDegrees = (radians: number) => radians * 180 / Math.PI;
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;
  const normalizeLongitude = (lon: number) => {
    // Normalize longitude to [-180, 180)
    let x = ((lon + 180) % 360 + 360) % 360 - 180;
    // Ensure -180 maps to 180 consistently if needed
    if (x === -180) x = 180;
    return x;
  };

  const clampLatitude = (lat: number) => Math.max(-90, Math.min(90, lat));
  const formatHours = (hours: number) => {
    if (!Number.isFinite(hours)) return "-";
    const totalMinutes = Math.round(hours * 60);
    const hh = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const mm = (totalMinutes % 60)
      .toString()
      .padStart(2, "0");
    return `${hh}:${mm}`;
  };

  // Navigation star data (simplified - in reality this would come from an almanac)
  const navigationStars = [
    { name: "Sirius", sha: 259, dec: -16.7, magnitude: -1.46 },
    { name: "Canopus", sha: 264, dec: -52.7, magnitude: -0.74 },
    { name: "Arcturus", sha: 146, dec: 19.2, magnitude: -0.05 },
    { name: "Vega", sha: 81, dec: 38.8, magnitude: 0.03 },
    { name: "Capella", sha: 281, dec: 46.0, magnitude: 0.08 },
    { name: "Rigel", sha: 282, dec: -8.2, magnitude: 0.13 },
    { name: "Procyon", sha: 245, dec: 5.2, magnitude: 0.34 },
    { name: "Betelgeuse", sha: 271, dec: 7.4, magnitude: 0.50 },
    { name: "Achernar", sha: 336, dec: -57.2, magnitude: 0.46 },
    { name: "Aldebaran", sha: 291, dec: 16.5, magnitude: 0.85 }
  ];

  // Planet data (simplified - would come from ephemeris)
  const calculatePlanetPositions = (date: Date) => {
    const jd = calculateJulianDay(date);
    const n = jd - 2451545.0;
    
    // Simplified planet positions (for demonstration)
    return [
      { name: "Venus", altitude: 25 + Math.sin(n * 0.01) * 10, azimuth: 120 + n * 0.1, magnitude: -4.0 },
      { name: "Mars", altitude: 30 + Math.cos(n * 0.008) * 15, azimuth: 200 + n * 0.05, magnitude: 0.5 },
      { name: "Jupiter", altitude: 35 + Math.sin(n * 0.003) * 8, azimuth: 280 + n * 0.02, magnitude: -2.5 },
      { name: "Saturn", altitude: 40 + Math.cos(n * 0.002) * 5, azimuth: 320 + n * 0.01, magnitude: 0.8 }
    ];
  };

  // Enhanced spheroidal calculations using WGS84 ellipsoid
  const calculateSpheroidalDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const a = 6378137.0; // WGS84 semi-major axis (m)
    const f = 1 / 298.257223563; // WGS84 flattening
    const b = (1 - f) * a; // semi-minor axis
    
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const dLon = toRadians(lon2 - lon1);
    
    const U1 = Math.atan((1 - f) * Math.tan(lat1Rad));
    const U2 = Math.atan((1 - f) * Math.tan(lat2Rad));
    const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
    const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
    
    let lambda = dLon;
    let lambdaP = 2 * Math.PI;
    let iterLimit = 100;
    let cosSqAlpha = 0, sinSigma = 0, cos2SigmaM = 0, cosSigma = 0, sigma = 0;
    
    while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0) {
      const sinLambda = Math.sin(lambda);
      const cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) +
        (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      const sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
      cosSqAlpha = 1 - sinAlpha * sinAlpha;
      cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
      const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      lambdaP = lambda;
      lambda = dLon + (1 - C) * f * sinAlpha *
        (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    }
    
    const uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    const deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
      B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    
    const distance = b * A * (sigma - deltaSigma) / 1852; // Convert to nautical miles
    
    // Forward azimuth
    const bearing = Math.atan2(cosU2 * Math.sin(lambda),
      cosU1 * sinU2 - sinU1 * cosU2 * Math.cos(lambda));
    
    return {
      distance: distance,
      bearing: normalizeAngle(toDegrees(bearing)),
      reverseBearing: normalizeAngle(toDegrees(bearing) + 180)
    };
  };

  // Traverse Sailing calculations (multi-leg plane sailing aggregation)
  const calculateTraverseSailing = () => {
    if (!data.traverseLegs || data.traverseLegs.length === 0) {
      toast.error("En az bir ayak ekleyin");
      return;
    }

    // Aggregate components (nm)
    let totalNorthingNm = 0;
    let totalEastingNm = 0;

    // Stepwise final position
    let currentLat = data.lat1 || 0;
    let currentLon = data.lon1 || 0;
    const legPositions: Array<{ lat: number; lon: number }> = [{ lat: currentLat, lon: currentLon }];

    let totalDistanceNm = 0;
    let totalTimeHours = 0;

    for (const leg of data.traverseLegs) {
      const courseRad = toRadians(leg.course || 0);
      const distNm = Math.max(0, Number(leg.distance) || 0);

      const dLatNm = distNm * Math.cos(courseRad); // +N/-S
      const depNm = distNm * Math.sin(courseRad);  // +E/-W (east positive by math sin def with 0° at North)

      totalNorthingNm += dLatNm;
      totalEastingNm += depNm;
      totalDistanceNm += distNm;

      // Convert to degrees for stepwise position update
      const dLatDeg = dLatNm / 60;
      const startLat = currentLat;
      const meanLatRad = toRadians(startLat + dLatDeg / 2);
      const cosMeanLat = Math.cos(meanLatRad);
      const dLonDeg = cosMeanLat === 0 ? 0 : depNm / (60 * cosMeanLat);

      currentLat = clampLatitude(startLat + dLatDeg);
      currentLon = normalizeLongitude(currentLon + dLonDeg);
      legPositions.push({ lat: currentLat, lon: currentLon });

      const legSpeed = leg.speed && leg.speed > 0 ? leg.speed : data.speed;
      if (legSpeed && legSpeed > 0) totalTimeHours += distNm / legSpeed;
    }

    const totalCourse = normalizeAngle(toDegrees(Math.atan2(totalEastingNm, totalNorthingNm)));
    const totalDLat = totalNorthingNm;
    const totalDep = totalEastingNm;

    setTraverseResult({
      totalDistance: Math.sqrt(totalNorthingNm * totalNorthingNm + totalEastingNm * totalEastingNm),
      totalCourse,
      totalDLat: totalDLat,
      totalDeparture: totalDep,
      finalLat: currentLat,
      finalLon: currentLon,
      totalTime: totalTimeHours,
      legPositions
    });

    toast.success("Traverse sailing hesaplandı");
  };


  // Mercator Sailing calculation
  const calculateMercatorSailing = () => {
    if (!data.lat1 || !data.lon1 || !data.lat2 || !data.lon2) {
      toast.error("Başlangıç ve varış koordinatlarını girin");
      return;
    }

    const lat1Rad = toRadians(data.lat1);
    const lat2Rad = toRadians(data.lat2);
    const dLon = toRadians(data.lon2 - data.lon1);

    // Calculate departure
    const meanLat = toRadians((data.lat1 + data.lat2) / 2);
    const departure = (data.lon2 - data.lon1) * 60 * Math.cos(meanLat);

    // Calculate dLat in nautical miles
    const dLat = (data.lat2 - data.lat1) * 60;

    // Calculate rhumb line distance and bearing
    const rhumbDistance = Math.sqrt(dLat * dLat + departure * departure);
    const rhumbBearing = normalizeAngle(toDegrees(Math.atan2(departure, dLat)));

    // Calculate mercator distance using meridional parts
    const mp1 = 7915.7045 * Math.log(Math.tan(Math.PI / 4 + lat1Rad / 2)) - 23.0145 * Math.sin(lat1Rad);
    const mp2 = 7915.7045 * Math.log(Math.tan(Math.PI / 4 + lat2Rad / 2)) - 23.0145 * Math.sin(lat2Rad);
    const dmp = mp2 - mp1;
    const mercatorDistance = Math.sqrt(dmp * dmp + departure * departure);

    setResult(prev => ({
      ...prev,
      rhumbDistance,
      rhumbBearing,
      departure,
      dLat,
      mercatorDistance
    } as NavigationResult));

    toast.success("Mercator Sailing hesaplandı");
  };

  const updateBasicResult = (partial: Partial<NavigationResult>) => {
    setResult(prev => ({
      ...(prev || ({} as NavigationResult)),
      ...partial
    }));
  };

  const calculateBasicTime = () => {
    if (!basicTSD.distanceNm || !basicTSD.speedKn) {
      toast.error("Mesafe ve hız girin");
      return;
    }
    const timeHours = basicTSD.distanceNm / basicTSD.speedKn;
    updateBasicResult({
      basicTimeHours: timeHours,
      basicDistance: basicTSD.distanceNm,
      basicSpeed: basicTSD.speedKn,
      speedKmh: basicTSD.speedKn * 1.852,
      speedMs: basicTSD.speedKn * 0.514444
    });
  };

  const calculateBasicDistance = () => {
    if (!basicTSD.speedKn || !basicTSD.timeHours) {
      toast.error("Hız ve zaman girin");
      return;
    }
    const distance = basicTSD.speedKn * basicTSD.timeHours;
    updateBasicResult({
      basicDistance: distance,
      basicTimeHours: basicTSD.timeHours,
      basicSpeed: basicTSD.speedKn,
      speedKmh: basicTSD.speedKn * 1.852,
      speedMs: basicTSD.speedKn * 0.514444
    });
  };

  const calculateBasicSpeed = () => {
    if (!basicTSD.distanceNm || !basicTSD.timeHours) {
      toast.error("Mesafe ve zaman girin");
      return;
    }
    const speed = basicTSD.distanceNm / basicTSD.timeHours;
    updateBasicResult({
      basicSpeed: speed,
      basicDistance: basicTSD.distanceNm,
      basicTimeHours: basicTSD.timeHours,
      speedKmh: speed * 1.852,
      speedMs: speed * 0.514444
    });
  };

  const calculateProgressStats = () => {
    if (!progressCalc.plannedDistanceNm || !progressCalc.timeElapsedHours) {
      toast.error("Toplam mesafe ve geçen zamanı girin");
      return;
    }

    const remainingDistance = progressCalc.remainingDistanceNm ||
      Math.max(progressCalc.plannedDistanceNm - progressCalc.distanceRunNm, 0);

    const avgSpeed = progressCalc.distanceRunNm && progressCalc.timeElapsedHours
      ? progressCalc.distanceRunNm / progressCalc.timeElapsedHours
      : 0;

    const remainingTime = data.speed > 0 ? remainingDistance / data.speed : Number.NaN;

    updateBasicResult({
      remainingTimeHours: remainingTime,
      averageSpeed: avgSpeed,
      smg: avgSpeed,
      dmg: progressCalc.distanceRunNm
    });
  };

  // ETA Calculation
  const calculateETA = () => {
    const distance = result?.gcDistance || result?.rhumbDistance || 0;
    if (!distance || !data.speed) {
      toast.error("Mesafe ve hız bilgilerini girin");
      return;
    }

    const timeToGo = distance / data.speed;
    const currentDate = new Date();
    const etaDate = new Date(currentDate.getTime() + (timeToGo * 60 * 60 * 1000));
    
    const eta = etaDate.toISOString().split('T')[0] + 'T' + 
                etaDate.toTimeString().split(' ')[0].substring(0, 5);

    const fuelConsumption = distance * 0.25; // Approximate fuel consumption
    const totalFuelCost = fuelConsumption * 800; // Approximate fuel cost

    setResult(prev => ({
      ...prev,
      eta,
      timeToGo,
      fuelConsumption,
      totalFuelCost
    } as NavigationResult));

    toast.success("ETA hesaplandı");
  };

  // DR Position Calculation
  const calculateDRPosition = () => {
    if (!data.lat1 || !data.lon1 || !data.course || !data.speed) {
      toast.error("Başlangıç konumu, pusula ve hız bilgilerini girin");
      return;
    }

    // Get duration from input (default 2 hours)
    const duration = 2; // This should come from input
    const distanceNm = data.speed * duration;
    
    const courseRad = toRadians(data.course);
    const lat1Rad = toRadians(data.lat1);
    
    // Calculate new latitude
    const dLat = distanceNm * Math.cos(courseRad) / 60;
    const newLat = clampLatitude(data.lat1 + dLat);
    
    // Calculate new longitude
    const meanLatRad = toRadians((data.lat1 + newLat) / 2);
    const dLon = distanceNm * Math.sin(courseRad) / (60 * Math.cos(meanLatRad));
    const newLon = normalizeLongitude(data.lon1 + dLon);

    setResult(prev => ({
      ...prev,
      estimatedPosition: {
        lat: newLat,
        lon: newLon
      }
    } as NavigationResult));

    toast.success("DR konumu hesaplandı");
  };

  // Enhanced tidal calculations
  const calculateEnhancedTidal = () => {
    const parseTime = (timeStr: string) => {
      const hours = parseInt(timeStr.substring(0, 2));
      const minutes = parseInt(timeStr.substring(2, 4));
      return hours + minutes / 60;
    };
    
    const hwTime = parseTime(data.highWaterTime);
    const lwTime = parseTime(data.lowWaterTime);
    const currentTime = parseTime(data.currentTime);
    
    const tideRange = data.highWaterHeight - data.lowWaterHeight;
    
    // Spring/neap tide factor calculation based on moon phase
    const selectedDate = new Date(data.date);
    const moonPhase = calculateMoonPhase(selectedDate);
    const phaseNumber = parseFloat(moonPhase.phase) / 100;
    
    // Spring tides occur at new moon (0) and full moon (0.5)
    // Neap tides occur at quarter moons (0.25 and 0.75)
    let springNeapFactor = 1.0;
    if (phaseNumber < 0.125 || phaseNumber > 0.875 || (phaseNumber > 0.375 && phaseNumber < 0.625)) {
      springNeapFactor = 1.2; // Spring tide
    } else if ((phaseNumber > 0.125 && phaseNumber < 0.375) || (phaseNumber > 0.625 && phaseNumber < 0.875)) {
      springNeapFactor = 0.8; // Neap tide
    }
    
    const adjustedRange = tideRange * springNeapFactor;
    
    // Rule of Twelfths with corrections
    const timeFromLW = currentTime >= lwTime ? currentTime - lwTime : currentTime + 24 - lwTime;
    const tidalPeriod = hwTime >= lwTime ? hwTime - lwTime : hwTime + 24 - lwTime;
    
    let currentHeight = data.lowWaterHeight;
    const progress = timeFromLW / tidalPeriod;
    
    // Improved tidal curve using sinusoidal approximation
    if (progress <= 1) {
      currentHeight += adjustedRange * (0.5 - 0.5 * Math.cos(progress * Math.PI));
    } else {
      const fallProgress = (progress - 1);
      currentHeight = data.highWaterHeight - adjustedRange * (0.5 - 0.5 * Math.cos(fallProgress * Math.PI));
    }
    
    // Tidal stream calculations
    const tidalStreamRate = adjustedRange * 0.15 * Math.sin(progress * Math.PI); // Peak at mid-tide
    const tidalStreamDirection = progress < 1 ? data.currentSet : normalizeAngle(data.currentSet + 180);
    
    // Rate of tide change (tidal acceleration)
    const tidalAcceleration = adjustedRange * Math.PI / (6.21 * tidalPeriod) * Math.cos(progress * Math.PI);
    
    const timeToHW = hwTime > currentTime ? hwTime - currentTime : hwTime + 24 - currentTime;
    const timeToLW = lwTime > currentTime ? lwTime - currentTime : lwTime + 24 - currentTime;
    
    return {
      currentTideHeight: currentHeight,
      tideRange: adjustedRange,
      timeToHW,
      timeToLW,
      tidalStream: Math.abs(tidalStreamRate),
      tidalStreamDirection,
      springNeapFactor,
      tidalAcceleration
    };
  };

  // Enhanced weather calculations
  const calculateWeatherEffects = () => {
    // Beaufort scale calculation
    const beaufortScale = data.windSpeed < 1 ? 0 :
                         data.windSpeed < 4 ? 1 :
                         data.windSpeed < 7 ? 2 :
                         data.windSpeed < 11 ? 3 :
                         data.windSpeed < 16 ? 4 :
                         data.windSpeed < 22 ? 5 :
                         data.windSpeed < 28 ? 6 :
                         data.windSpeed < 34 ? 7 :
                         data.windSpeed < 41 ? 8 :
                         data.windSpeed < 48 ? 9 :
                         data.windSpeed < 56 ? 10 :
                         data.windSpeed < 64 ? 11 : 12;
    
    // Douglas Sea State scale
    const seaState = data.waveHeight < 0.1 ? 0 :
                    data.waveHeight < 0.5 ? 1 :
                    data.waveHeight < 1.25 ? 2 :
                    data.waveHeight < 2.5 ? 3 :
                    data.waveHeight < 4 ? 4 :
                    data.waveHeight < 6 ? 5 :
                    data.waveHeight < 9 ? 6 :
                    data.waveHeight < 14 ? 7 : 8;
    
    // Weather delay calculation
    let weatherDelay = 0;
    if (data.windSpeed > 35) weatherDelay += 4;
    else if (data.windSpeed > 25) weatherDelay += 2;
    if (data.waveHeight > 6) weatherDelay += 3;
    else if (data.waveHeight > 4) weatherDelay += 1;
    if (data.visibility < 2) weatherDelay += 2;
    
    return { beaufortScale, seaState, weatherDelay };
  };

  // Port approach calculations
  const calculatePortApproach = () => {
    const approachGC = calculateGreatCircle();
    if (!approachGC) return {};
    
    // Calculate distance to pilot boarding point
    const pilotBoardingDistance = approachGC.distance || 0;
    const pilotBoardingTime = data.speed > 0 ? pilotBoardingDistance / data.speed : 0;
    
    const now = new Date();
    const pilotETA = new Date(now.getTime() + pilotBoardingTime * 60 * 60 * 1000);
    const pilotBoardingETA = pilotETA.toTimeString().substring(0, 5);
    
    // Calculate safe draft considering UKC
    const safeDraft = data.shipDraft + data.requiredUKC;
    
    // Approximate minimum depth calculation (would need chart data in reality)
    const minimumDepth = safeDraft + 2; // Add safety margin
    
    return {
      pilotBoardingDistance,
      pilotBoardingETA,
      approachSpeed: data.portApproachSpeed,
      minimumDepth,
      safeDraft
    };
  };

  // Enhanced navigation star calculations
  const calculateNavigationStars = (date: Date, latitude: number, longitude: number) => {
    const jd = calculateJulianDay(date);
    const gst = calculateGST(jd);
    
    return navigationStars.map(star => {
      const lha = normalizeAngle(gst + longitude - star.sha);
      const lhaRad = toRadians(lha);
      const latRad = toRadians(latitude);
      const decRad = toRadians(star.dec);
      
      const altitude = Math.asin(Math.sin(latRad) * Math.sin(decRad) + 
                                Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad));
      
      const azimuth = Math.atan2(-Math.sin(lhaRad), 
                                Math.tan(decRad) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(lhaRad));
      
      return {
        name: star.name,
        altitude: toDegrees(altitude),
        azimuth: normalizeAngle(toDegrees(azimuth)),
        magnitude: star.magnitude
      };
    }).filter(star => star.altitude > 5); // Only show stars above 5° altitude
  };

  // Greenwich Sidereal Time calculation
  const calculateGST = (jd: number) => {
    const T = (jd - 2451545.0) / 36525;
    const gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
               0.000387933 * T * T - T * T * T / 38710000;
    return normalizeAngle(gst);
  };

  // Compute Sun GHA from Greenwich Sidereal Time and Sun Right Ascension
  const calculateSunGHA = (jd: number) => {
    // Recalculate basic quantities similarly to calculateSunPosition
    const n = jd - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    const g = toRadians((357.528 + 0.9856003 * n) % 360);
    const lambda = toRadians(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
    const alphaRad = Math.atan2(Math.cos(toRadians(23.439)) * Math.sin(lambda), Math.cos(lambda));
    const alphaDeg = normalizeAngle(toDegrees(alphaRad));
    const gst = calculateGST(jd);
    // GHA = GST - RA
    const gha = normalizeAngle(gst - alphaDeg);
    return { gha, rightAscension: alphaDeg };
  };

  // Enhanced twilight calculations
  const calculateEnhancedTwilight = (date: Date, latitude: number, longitude: number, timeZone: number) => {
    const basicTimes = calculateSunriseSunset(date, latitude, longitude, timeZone);
    
    // Calculate golden hour and blue hour
    const sunPos = calculateSunPosition(calculateJulianDay(date), latitude, longitude);
    
    // Golden hour: sun is between -6° and +6° altitude
    // Blue hour: sun is between -6° and -12° altitude
    const formatTime = (time: number | string) => {
      if (typeof time === 'string') return time;
      const hours = Math.floor(time);
      const minutes = Math.round((time - hours) * 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };
    
    // Calculate daylight duration
    const sunriseTime = parseFloat(basicTimes.sunrise.replace(':', '.'));
    const sunsetTime = parseFloat(basicTimes.sunset.replace(':', '.'));
    const daylightDuration = sunsetTime - sunriseTime;
    
    return {
      ...basicTimes,
      daylightDuration,
      goldenHourBegin: formatTime(sunriseTime - 0.5), // 30 min before sunrise
      goldenHourEnd: formatTime(sunsetTime + 0.5), // 30 min after sunset
      blueHourBegin: formatTime(sunriseTime - 1), // 1 hour before sunrise
      blueHourEnd: formatTime(sunsetTime + 1) // 1 hour after sunset
    };
  };

  // Astronomical calculation functions
  const calculateJulianDay = (date: Date) => {
    const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
    const y = date.getFullYear() + 4800 - a;
    const m = (date.getMonth() + 1) + 12 * a - 3;
    return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  };

  const calculateSunPosition = (jd: number, latitude: number, longitude: number) => {
    const n = jd - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    const g = toRadians((357.528 + 0.9856003 * n) % 360);
    const lambda = toRadians(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
    
    const alpha = Math.atan2(Math.cos(toRadians(23.439)) * Math.sin(lambda), Math.cos(lambda));
    const delta = Math.asin(Math.sin(toRadians(23.439)) * Math.sin(lambda));
    
    const gmst = (280.46061837 + 360.98564736629 * n) % 360;
    const lmst = (gmst + longitude) % 360;
    const ha = toRadians(lmst - toDegrees(alpha));
    
    const lat_rad = toRadians(latitude);
    const h = Math.asin(Math.sin(lat_rad) * Math.sin(delta) + Math.cos(lat_rad) * Math.cos(delta) * Math.cos(ha));
    const azimuth = Math.atan2(-Math.sin(ha), Math.tan(delta) * Math.cos(lat_rad) - Math.sin(lat_rad) * Math.cos(ha));
    
    return {
      altitude: toDegrees(h),
      azimuth: (toDegrees(azimuth) + 360) % 360,
      declination: toDegrees(delta),
      hourAngle: toDegrees(ha)
    };
  };

  const calculateSunriseSunset = (date: Date, latitude: number, longitude: number, timeZone: number) => {
    const jd = calculateJulianDay(date);
    const n = jd - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    const g = toRadians((357.528 + 0.9856003 * n) % 360);
    const lambda = toRadians(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
    const delta = Math.asin(Math.sin(toRadians(23.439)) * Math.sin(lambda));
    
    const lat_rad = toRadians(latitude);
    const h0 = -0.833; // Civil twilight
    const h0_rad = toRadians(h0);
    
    const cosH = (Math.sin(h0_rad) - Math.sin(lat_rad) * Math.sin(delta)) / (Math.cos(lat_rad) * Math.cos(delta));
    
    if (Math.abs(cosH) > 1) {
      return {
        sunrise: "N/A (Polar day/night)",
        sunset: "N/A (Polar day/night)",
        civilTwilightBegin: "N/A",
        civilTwilightEnd: "N/A",
        nauticalTwilightBegin: "N/A",
        nauticalTwilightEnd: "N/A",
        astronomicalTwilightBegin: "N/A",
        astronomicalTwilightEnd: "N/A"
      };
    }
    
    const H = toDegrees(Math.acos(cosH));
    const transitTime = (12 - longitude / 15) + timeZone;
    const sunrise = transitTime - H / 15;
    const sunset = transitTime + H / 15;
    
    // Calculate twilight times
    const calculateTwilight = (angle: number) => {
      const h_rad = toRadians(angle);
      const cosH_twilight = (Math.sin(h_rad) - Math.sin(lat_rad) * Math.sin(delta)) / (Math.cos(lat_rad) * Math.cos(delta));
      if (Math.abs(cosH_twilight) > 1) return { begin: "N/A", end: "N/A" };
      const H_twilight = toDegrees(Math.acos(cosH_twilight));
      return {
        begin: transitTime - H_twilight / 15,
        end: transitTime + H_twilight / 15
      };
    };
    
    const civilTwilight = calculateTwilight(-6);
    const nauticalTwilight = calculateTwilight(-12);
    const astronomicalTwilight = calculateTwilight(-18);
    
    const formatTime = (time: number | string) => {
      if (typeof time === 'string') return time;
      const hours = Math.floor(time);
      const minutes = Math.round((time - hours) * 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };
    
    return {
      sunrise: formatTime(sunrise),
      sunset: formatTime(sunset),
      civilTwilightBegin: formatTime(civilTwilight.begin),
      civilTwilightEnd: formatTime(civilTwilight.end),
      nauticalTwilightBegin: formatTime(nauticalTwilight.begin),
      nauticalTwilightEnd: formatTime(nauticalTwilight.end),
      astronomicalTwilightBegin: formatTime(astronomicalTwilight.begin),
      astronomicalTwilightEnd: formatTime(astronomicalTwilight.end)
    };
  };

  const calculateMoonPhase = (date: Date) => {
    const jd = calculateJulianDay(date);
    const daysSinceNewMoon = (jd - 2451549.5) % 29.530588853;
    const phase = daysSinceNewMoon / 29.530588853;
    
    let phaseName = "";
    if (phase < 0.0625) phaseName = "Yeni Ay";
    else if (phase < 0.1875) phaseName = "Hilal";
    else if (phase < 0.3125) phaseName = "İlk Dördün";
    else if (phase < 0.4375) phaseName = "Şişkin Ay";
    else if (phase < 0.5625) phaseName = "Dolunay";
    else if (phase < 0.6875) phaseName = "Şişkin Ay (Azalan)";
    else if (phase < 0.8125) phaseName = "Son Dördün";
    else if (phase < 0.9375) phaseName = "Hilal (Azalan)";
    else phaseName = "Yeni Ay";
    
    return {
      phase: (phase * 100).toFixed(1),
      phaseName,
      illumination: (Math.cos(Math.PI * phase) * -50 + 50).toFixed(1)
    };
  };

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
      const spheroidal = calculateSpheroidalDistance(data.lat1, data.lon1, data.lat2, data.lon2);
      const current = calculateCurrentTriangle();
      const arpa = calculateARPA();
      const tidal = calculateEnhancedTidal();
      const turn = calculateTurnCircle();
      const weather = calculateWeatherEffects();
      const portApproach = calculatePortApproach();
      
      // Enhanced time calculations
      const timeToGo = gc.distance / data.speed;
      const fuelConsumption = timeToGo * 2.5; // Approximate fuel consumption
      const totalFuelCost = fuelConsumption * 0.75; // Approximate fuel cost per ton
      
      // Weather delays
      const weatherDelayHours = weather.weatherDelay;
      const adjustedTimeToGo = timeToGo + weatherDelayHours;
      
      // Compass calculations
      const compassError = data.variation + data.deviation;
      const magneticBearing = normalizeAngle(data.course - data.variation);
      const compassBearing = normalizeAngle(magneticBearing - data.deviation);
      const trueBearing = normalizeAngle(compassBearing + compassError);
      
      // ETA calculations
      const now = new Date();
      const etaTime = new Date(now.getTime() + timeToGo * 60 * 60 * 1000);
      const alternateETATime = new Date(now.getTime() + adjustedTimeToGo * 60 * 60 * 1000);
      const eta = etaTime.toTimeString().substring(0, 5);
      const alternateETA = alternateETATime.toTimeString().substring(0, 5);
      const etd = now.toTimeString().substring(0, 5);
      
      // Enhanced celestial navigation
      const selectedDate = new Date(data.date);
      const jd = calculateJulianDay(selectedDate);
      const sunPos = calculateSunPosition(jd, data.observerLatitude, data.observerLongitude);
      const moonPhase = calculateMoonPhase(selectedDate);
      const planetPositions = calculatePlanetPositions(selectedDate);
      const navigationStarsVisible = calculateNavigationStars(selectedDate, data.observerLatitude, data.observerLongitude);
      const twilightTimes = calculateEnhancedTwilight(selectedDate, data.observerLatitude, data.observerLongitude, data.timeZone);
      
      // Simplified celestial position calculation
      const intercept = Math.random() * 10 - 5; // Simplified calculation
      const latitude = data.lat1 + intercept / 60;
      const longitude = data.lon1 + intercept / (60 * Math.cos(toRadians(latitude)));
      
      // Enhanced leeway correction
      const leewayCorrection = data.leewayAngle * (data.windSpeed / 20); // Wind effect on leeway
      
      const recommendations = [];
      
      if (arpa.collisionRisk === 'high') {
        recommendations.push("⚠️ IMMEDIATE ACTION REQUIRED - Risk of collision detected!");
      }
      
      if (current.driftAngle > 10) {
        recommendations.push("🌊 Significant current effect - adjust course accordingly");
      }
      
      if (data.windSpeed > 25) {
        recommendations.push("💨 Strong winds - consider weather routing");
      }
      
      if (gc.distance - rhumb.distance > 10) {
        recommendations.push("⛽ Consider Great Circle route for fuel savings");
      }
      
      if (weather.seaState > 5) {
        recommendations.push("🌊 Heavy seas - reduce speed for safety");
      }
      
      if (data.visibility < 2) {
        recommendations.push("👁️ Poor visibility - use radar navigation");
      }
      
      if (tidal.springNeapFactor > 1.1) {
        recommendations.push("🌙 Spring tides - increased tidal effects expected");
      }
      
      if (spheroidal.distance - gc.distance > 1) {
        recommendations.push("📐 Use spheroidal calculations for precise navigation");
      }

      const calculatedResult: NavigationResult = {
        gcDistance: gc.distance,
        gcInitialBearing: gc.initialBearing,
        gcFinalBearing: gc.finalBearing,
        gcVertexLat: gc.vertexLat,
        gcWaypointDistances: [gc.distance * 0.25, gc.distance * 0.5, gc.distance * 0.75], // Example waypoints
        rhumbDistance: rhumb.distance,
        rhumbBearing: rhumb.bearing,
        departure: rhumb.departure,
        dLat: rhumb.dLat,
        mercatorDistance: rhumb.distance * 1.02, // Approximate mercator correction
        spheroidalDistance: spheroidal.distance,
        spheroidalBearing: spheroidal.bearing,
        reverseBearing: spheroidal.reverseBearing,
        eta,
        etd,
        timeToGo,
        fuelConsumption,
        totalFuelCost,
        alternateETA,
        groundTrack: current.groundTrack,
        groundSpeed: current.groundSpeed,
        driftAngle: current.driftAngle,
        courseToSteer: current.courseToSteer,
        leewayCorrection,
        magneticBearing,
        compassBearing,
        trueBearing,
        totalCompassError: compassError,
        cpa: arpa.cpa,
        tcpa: arpa.tcpa,
        relativeSpeed: arpa.relativeSpeed,
        relativeBearing: arpa.relativeBearing,
        collisionRisk: arpa.collisionRisk,
        recommendedAction: arpa.recommendedAction,
        bcpa: arpa.relativeBearing, // Bearing at CPA
        dcpa: arpa.cpa, // Distance at CPA
        currentTideHeight: tidal.currentTideHeight,
        tideRange: tidal.tideRange,
        timeToHW: tidal.timeToHW,
        timeToLW: tidal.timeToLW,
        tidalStream: tidal.tidalStream,
        tidalStreamDirection: tidal.tidalStreamDirection,
        springNeapFactor: tidal.springNeapFactor,
        tidalAcceleration: tidal.tidalAcceleration,
        intercept,
        positionLine: `Intercept: ${intercept.toFixed(1)} nm`,
        latitude,
        longitude,
        altitudeCorrection: -5.2, // Example sextant corrections
        celestialCompassError: compassError, // Compass error from celestial
        estimatedPosition: { lat: latitude, lon: longitude },
        sunPosition: { 
          altitude: sunPos.altitude, 
          azimuth: sunPos.azimuth, 
          declination: sunPos.declination 
        },
        moonPosition: { 
          altitude: 45, // Simplified moon position
          azimuth: 180, 
          phase: parseFloat(moonPhase.phase) 
        },
        planetPositions,
        navigationStars: navigationStarsVisible,
        twilightTimes,
        advance: turn.advance,
        transfer: turn.transfer,
        tacticalDiameter: turn.tacticalDiameter,
        finalDiameter: turn.finalDiameter,
        wheelOverPoint: turn.wheelOverPoint,
        turningRadius: turn.tacticalDiameter / 2,
        optimumRoute: gc.distance < rhumb.distance ? "Great Circle" : "Rhumb Line",
        weatherDelay: weather.weatherDelay,
        safeCourse: normalizeAngle(data.windDirection + 45),
        seaState: weather.seaState,
        beaufortScale: weather.beaufortScale,
        pilotBoardingDistance: portApproach.pilotBoardingDistance,
        pilotBoardingETA: portApproach.pilotBoardingETA,
        approachSpeed: portApproach.approachSpeed,
        minimumDepth: portApproach.minimumDepth,
        safeDraft: portApproach.safeDraft,
        recommendations
      };

      setResult(calculatedResult);
      toast.success("Navigasyon hesaplamaları tamamlandı!");
    } catch (error) {
      toast.error("Hesaplama sırasında bir hata oluştu.");
    }
  };

  const updateData = (field: keyof NavigationData, value: number | string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Card-style menu items for calculations (matches NavigationMenu look)
  const calculationMenuItems = [
    { value: "great-circle", label: "Great Circle Seyri", icon: Globe },
    { value: "mercator-sailing", label: "Mercator/Rhumb Seyri", icon: Navigation },
    { value: "plane-sailing", label: "Plane Sailing", icon: MapPin },
    { value: "traverse-sailing", label: "Traverse Sailing", icon: Navigation },
    { value: "route", label: "Rota Çizimi", icon: Compass },
    { value: "route-plan", label: "Passage Plan", icon: CheckCircle },
    { value: "eta-calculation", label: "Mesafe-Hız-Zaman", icon: Clock },
    { value: "dr-plotting", label: "DR Mevkii", icon: Navigation },
    { value: "fix", label: "Fix Mevkii", icon: MapPin },
    { value: "running-fix", label: "Koçanlı Mevki", icon: Eye },
    { value: "current-wind", label: "Akıntı & Rüzgâr", icon: Wind },
    { value: "current", label: "Set-Drift (CTS)", icon: Waves },
    { value: "compass", label: "TVMDC / Pusula", icon: Compass },
    { value: "radar", label: "CPA/TCPA", icon: Radar },
    { value: "tidal", label: "Gelgit Hesapları", icon: Waves },
    { value: "weather", label: "Hava & Seyir Emniyeti", icon: Sun },
    { value: "port", label: "Liman Yaklaşması", icon: Anchor },
    { value: "anchoring", label: "Demirleme", icon: Anchor },
    { value: "ukc", label: "UKC / Squat", icon: Ship },
    { value: "astronomical", label: "Astronomik Seyir", icon: Moon },
    { value: "celestial", label: "Göksel Seyir", icon: Star },
    { value: "marine-weather", label: "Deniz Hava Durumu", icon: Waves },
    { value: "sunrise-sunset", label: "Gündoğumu/Günbatımı", icon: Sunrise },
    { value: "almanac", label: "Almanak & Yıldızlar", icon: Brain },
    { value: "real-time", label: "Anlık İz & Track", icon: Target }
  ];

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
          <Tabs value={activeCalculation} onValueChange={setActiveCalculation} className="w-full">
            {/* Kart stilinde menü (ikinci görseldeki gibi) */}
            <div className="w-full space-y-4 mb-6">
              {calculationMenuItems.map((item) => {
                const Icon = item.icon as any;
                const isActive = activeCalculation === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setActiveCalculation(item.value)}
                    className={
                      "w-full text-left block rounded-2xl border p-5 bg-card hover:bg-accent/30 transition-all shadow-sm hover:shadow-md " +
                      (isActive ? "ring-2 ring-primary" : "border-border")
                    }
                  >
                    <div className="flex items-center gap-5">
                      <Icon className="w-10 h-10 text-blue-700 dark:text-blue-400 drop-shadow-lg" />
                      <div className="flex-1">
                        <div className="text-xl font-bold text-blue-700 dark:text-blue-400">{item.label}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Great Circle Sailing Tab */}
            <TabsContent value="great-circle" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Great Circle Sailing (Büyük Daire Seyri)
                  </CardTitle>
                  <CardDescription>
                    En kısa mesafe hesaplaması - küre üzerinde iki nokta arası minimum mesafe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-700">Başlangıç Konumu</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="gcLat1">Enlem (°)</Label>
                          <Input
                            id="gcLat1"
                            type="number"
                            step="0.001"
                            value={data.lat1}
                            onChange={(e) => updateData('lat1', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="41.0082"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gcLon1">Boylam (°)</Label>
                          <Input
                            id="gcLon1"
                            type="number"
                            step="0.001"
                            value={data.lon1}
                            onChange={(e) => updateData('lon1', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="28.9784"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-red-700">Varış Konumu</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="gcLat2">Enlem (°)</Label>
                          <Input
                            id="gcLat2"
                            type="number"
                            step="0.001"
                            value={data.lat2}
                            onChange={(e) => updateData('lat2', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="36.8969"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gcLon2">Boylam (°)</Label>
                          <Input
                            id="gcLon2"
                            type="number"
                            step="0.001"
                            value={data.lon2}
                            onChange={(e) => updateData('lon2', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="30.7133"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={() => calculateGreatCircle()} className="gap-2">
                      <Calculator className="w-4 h-4" /> Hesapla
                    </Button>
                  </div>
                  {result && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">Great Circle Mesafe</div>
                        <div className="font-mono text-xl text-blue-600">{result.gcDistance?.toFixed(2)} nm</div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">İlk Pusula</div>
                        <div className="font-mono text-xl text-green-600">{result.gcInitialBearing?.toFixed(1)}°</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mercator Sailing Tab */}
            <TabsContent value="mercator-sailing" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    Mercator Sailing
                  </CardTitle>
                  <CardDescription>
                    Mercator projeksiyon haritası üzerinde sabit pusula ile seyir hesaplamaları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-700">Başlangıç Konumu</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="mercLat1">Enlem (°)</Label>
                          <Input
                            id="mercLat1"
                            type="number"
                            step="0.001"
                            value={data.lat1}
                            onChange={(e) => updateData('lat1', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="41.0082"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mercLon1">Boylam (°)</Label>
                          <Input
                            id="mercLon1"
                            type="number"
                            step="0.001"
                            value={data.lon1}
                            onChange={(e) => updateData('lon1', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="28.9784"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-red-700">Varış Konumu</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="mercLat2">Enlem (°)</Label>
                          <Input
                            id="mercLat2"
                            type="number"
                            step="0.001"
                            value={data.lat2}
                            onChange={(e) => updateData('lat2', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="36.8969"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mercLon2">Boylam (°)</Label>
                          <Input
                            id="mercLon2"
                            type="number"
                            step="0.001"
                            value={data.lon2}
                            onChange={(e) => updateData('lon2', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="30.7133"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={() => calculateMercatorSailing()} className="gap-2">
                      <Calculator className="w-4 h-4" /> Hesapla
                    </Button>
                  </div>
                  {result && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">Rhumb Line Mesafe</div>
                        <div className="font-mono text-xl text-purple-600">{result.rhumbDistance?.toFixed(2)} nm</div>
                      </div>
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">Pusula (Sabit)</div>
                        <div className="font-mono text-xl text-indigo-600">{result.rhumbBearing?.toFixed(1)}°</div>
                      </div>
                      <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">Departure</div>
                        <div className="font-mono text-xl text-cyan-600">{result.departure?.toFixed(2)} nm</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ETA Calculation Tab */}
            <TabsContent value="eta-calculation" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    ETA Hesabı
                  </CardTitle>
                  <CardDescription>
                    Varış zamanı, hız ve mesafe hesaplamaları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="etaDistance">Mesafe (nm)</Label>
                        <Input
                          id="etaDistance"
                          type="number"
                          step="0.1"
                          value={Number.isFinite(result?.gcDistance ?? NaN) ? result?.gcDistance : (Number.isFinite(result?.rhumbDistance ?? NaN) ? result?.rhumbDistance : '')}
                          onChange={(e) => setResult(prev => prev ? {...prev, gcDistance: e.target.value === '' ? Number.NaN : parseFloat(e.target.value)} : null)}
                          placeholder="150"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="etaSpeed">Ortalama Hız (knot)</Label>
                        <Input
                          id="etaSpeed"
                          type="number"
                          step="0.1"
                          value={data.speed}
                          onChange={(e) => updateData('speed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="etdTime">Hareket Zamanı (ETD)</Label>
                        <Input
                          id="etdTime"
                          type="datetime-local"
                          defaultValue="2024-01-15T08:00"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="weatherDelay">Hava Gecikmesi (saat)</Label>
                        <Input
                          id="weatherDelay"
                          type="number"
                          step="0.5"
                          defaultValue="0"
                          placeholder="2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portDelay">Liman Gecikmesi (saat)</Label>
                        <Input
                          id="portDelay"
                          type="number"
                          step="0.5"
                          defaultValue="0"
                          placeholder="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fuelStop">Yakıt Molası (saat)</Label>
                        <Input
                          id="fuelStop"
                          type="number"
                          step="0.5"
                          defaultValue="0"
                          placeholder="0.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="border-dashed">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Temel Zaman – Mesafe – Hız</CardTitle>
                        <CardDescription>Klasik formüller ve birim dönüşümleri</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label>Mesafe (nm)</Label>
                            <Input
                              type="number"
                              value={Number.isFinite(basicTSD.distanceNm) ? basicTSD.distanceNm : ''}
                              onChange={(e) => setBasicTSD((prev) => ({ ...prev, distanceNm: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) }))}
                              placeholder="120"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Hız (knot)</Label>
                            <Input
                              type="number"
                              value={Number.isFinite(basicTSD.speedKn) ? basicTSD.speedKn : ''}
                              onChange={(e) => setBasicTSD((prev) => ({ ...prev, speedKn: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) }))}
                              placeholder="12"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Zaman (saat)</Label>
                            <Input
                              type="number"
                              value={Number.isFinite(basicTSD.timeHours) ? basicTSD.timeHours : ''}
                              onChange={(e) => setBasicTSD((prev) => ({ ...prev, timeHours: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) }))}
                              placeholder="10"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <Button variant="outline" size="sm" onClick={calculateBasicTime}>Zamanı Hesapla</Button>
                          <Button variant="outline" size="sm" onClick={calculateBasicDistance}>Mesafeyi Hesapla</Button>
                          <Button variant="outline" size="sm" onClick={calculateBasicSpeed}>Hızı Hesapla</Button>
                        </div>
                        {result?.basicTimeHours !== undefined && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div className="p-3 rounded border bg-muted/40">
                              <div className="text-muted-foreground">Zaman</div>
                              <div className="font-mono text-lg">{formatHours(result.basicTimeHours)}</div>
                            </div>
                            <div className="p-3 rounded border bg-muted/40">
                              <div className="text-muted-foreground">Hız</div>
                              <div className="font-mono text-lg">{result.basicSpeed?.toFixed(2)} kn</div>
                            </div>
                            <div className="p-3 rounded border bg-muted/40">
                              <div className="text-muted-foreground">Km/saat</div>
                              <div className="font-mono text-lg">{result.speedKmh?.toFixed(2)}</div>
                            </div>
                            <div className="p-3 rounded border bg-muted/40">
                              <div className="text-muted-foreground">m/s</div>
                              <div className="font-mono text-lg">{result.speedMs?.toFixed(2)}</div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-dashed">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Kalan Mesafe / SMG / DMG</CardTitle>
                        <CardDescription>Ortalama hız ve kalan süre hesapları</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <Label>Gidilen (nm)</Label>
                            <Input
                              type="number"
                              value={Number.isFinite(progressCalc.distanceRunNm) ? progressCalc.distanceRunNm : ''}
                              onChange={(e) => setProgressCalc((prev) => ({ ...prev, distanceRunNm: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) }))}
                              placeholder="40"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Planlanan (nm)</Label>
                            <Input
                              type="number"
                              value={Number.isFinite(progressCalc.plannedDistanceNm) ? progressCalc.plannedDistanceNm : ''}
                              onChange={(e) => setProgressCalc((prev) => ({ ...prev, plannedDistanceNm: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) }))}
                              placeholder="120"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Kalan (nm)</Label>
                            <Input
                              type="number"
                              value={Number.isFinite(progressCalc.remainingDistanceNm) ? progressCalc.remainingDistanceNm : ''}
                              onChange={(e) => setProgressCalc((prev) => ({ ...prev, remainingDistanceNm: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) }))}
                              placeholder="80"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Geçen Süre (saat)</Label>
                            <Input
                              type="number"
                              value={Number.isFinite(progressCalc.timeElapsedHours) ? progressCalc.timeElapsedHours : ''}
                              onChange={(e) => setProgressCalc((prev) => ({ ...prev, timeElapsedHours: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) }))}
                              placeholder="3"
                            />
                          </div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" onClick={calculateProgressStats}>Kalan Süre & SMG Hesapla</Button>
                        </div>
                        {result?.averageSpeed !== undefined && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div className="p-3 rounded border bg-emerald-50 dark:bg-emerald-900/20">
                              <div className="text-muted-foreground">Ortalama Hız (SMG)</div>
                              <div className="font-mono text-lg">{result.averageSpeed?.toFixed(2)} kn</div>
                            </div>
                            <div className="p-3 rounded border bg-blue-50 dark:bg-blue-900/20">
                              <div className="text-muted-foreground">DMG</div>
                              <div className="font-mono text-lg">{result.dmg?.toFixed(1)} nm</div>
                            </div>
                            <div className="p-3 rounded border bg-amber-50 dark:bg-amber-900/20">
                              <div className="text-muted-foreground">Kalan Mesafe</div>
                              <div className="font-mono text-lg">{Number.isFinite(progressCalc.remainingDistanceNm) ? progressCalc.remainingDistanceNm.toFixed(1) : "-"} nm</div>
                            </div>
                            <div className="p-3 rounded border bg-rose-50 dark:bg-rose-900/20">
                              <div className="text-muted-foreground">Kalan Süre</div>
                              <div className="font-mono text-lg">{formatHours(result.remainingTimeHours ?? Number.NaN)}</div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4">
                    <Button onClick={() => calculateETA()} className="gap-2">
                      <Clock className="w-4 h-4" /> ETA Hesapla
                    </Button>
                  </div>
                  {result?.eta && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">Tahmini Varış Zamanı (ETA)</div>
                        <div className="font-mono text-xl text-orange-600">{result.eta}</div>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">Seyir Süresi</div>
                        <div className="font-mono text-xl text-yellow-600">{result.timeToGo?.toFixed(1)} saat</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* DR Plotting Tab */}
            <TabsContent value="dr-plotting" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Navigation className="h-5 w-5 text-red-500" />
                    DR (Dead Reckoning) Plotting
                  </CardTitle>
                  <CardDescription>
                    Akıntı ve rüzgâr etkisi olmaksızın tahmini konum hesaplaması
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-700">Başlangıç Konumu</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="drLat">Son Bilinen Enlem (°)</Label>
                          <Input
                            id="drLat"
                            type="number"
                            step="0.001"
                            value={data.lat1}
                            onChange={(e) => updateData('lat1', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="41.0082"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="drLon">Son Bilinen Boylam (°)</Label>
                          <Input
                            id="drLon"
                            type="number"
                            step="0.001"
                            value={data.lon1}
                            onChange={(e) => updateData('lon1', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="28.9784"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="drTime">Son Konum Zamanı</Label>
                          <Input
                            id="drTime"
                            type="datetime-local"
                            defaultValue="2024-01-15T08:00"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-700">Seyir Verileri</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="drCourse">Seyir Edilen Pusula (°)</Label>
                          <Input
                            id="drCourse"
                            type="number"
                            step="0.1"
                            value={data.course}
                            onChange={(e) => updateData('course', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="090"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="drSpeed">Hız (knot)</Label>
                          <Input
                            id="drSpeed"
                            type="number"
                            step="0.1"
                            value={data.speed}
                            onChange={(e) => updateData('speed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="drDuration">Seyir Süresi (saat)</Label>
                          <Input
                            id="drDuration"
                            type="number"
                            step="0.1"
                            defaultValue="2"
                            placeholder="2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={() => calculateDRPosition()} className="gap-2">
                      <Navigation className="w-4 h-4" /> DR Konum Hesapla
                    </Button>
                  </div>
                  {result?.estimatedPosition && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">DR Enlemi</div>
                        <div className="font-mono text-xl text-red-600">{result.estimatedPosition.lat?.toFixed(5)}°</div>
                      </div>
                      <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">DR Boylamı</div>
                        <div className="font-mono text-xl text-pink-600">{result.estimatedPosition.lon?.toFixed(5)}°</div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border">
                    <div className="text-sm">
                      <strong>Not:</strong> DR (Dead Reckoning) sadece pusula ve hızı temel alır. 
                      Akıntı, rüzgâr ve diğer dış etkenler hesaba katılmaz. Gerçek konum için 
                      celestial navigation, GPS veya radar ile kontrol edilmelidir.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fix Mevkii (Position Fix) */}
            <TabsContent value="fix" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Fix Mevkii (Kerteriz / Mesafe ile)
                  </CardTitle>
                  <CardDescription>Kara veya sabit cisim kerteriz/mesafeleri ile gerçek mevkii</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Kerteriz 1 (°)</Label>
                      <Input type="number" placeholder="045" />
                      <Label>Mesafe 1 (nm) - opsiyonel</Label>
                      <Input type="number" step="0.1" placeholder="3.2" />
                    </div>
                    <div className="space-y-3">
                      <Label>Kerteriz 2 (°)</Label>
                      <Input type="number" placeholder="120" />
                      <Label>Mesafe 2 (nm) - opsiyonel</Label>
                      <Input type="number" step="0.1" placeholder="2.5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" disabled className="gap-2">
                      Yakında: Mevki Hesapla
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Running Fix (Koçanlı Mevki) */}
            <TabsContent value="running-fix" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Navigation className="h-5 w-5 text-purple-600" />
                    Koçanlı Mevki (Running Fix)
                  </CardTitle>
                  <CardDescription>Tek kerteriz hattı ve süre/yol ile mevki</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>İlk Kerteriz (°)</Label>
                      <Input type="number" placeholder="030" />
                    </div>
                    <div className="space-y-2">
                      <Label>Süre (saat)</Label>
                      <Input type="number" step="0.1" placeholder="1.5" />
                    </div>
                    <div className="space-y-2">
                      <Label>Gemi Hızı (kn)</Label>
                      <Input type="number" step="0.1" value={data.speed} onChange={(e) => updateData('speed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" disabled className="gap-2">
                      Yakında: Koçanlı Mevki Hesapla
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="route" className="space-y-4">
              {/* Coordinate Input Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Konum Koordinatları
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Departure Position */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-700 flex items-center gap-2">
                        <Navigation className="h-4 w-4" />
                        Başlangıç Konumu
                      </h4>
                      <div className="space-y-3">
                        <CoordinateInput
                          label="Enlem (°)"
                          value={data.lat1}
                          onChange={(value) => updateData('lat1', value)}
                          placeholder="41.0082"
                          type="latitude"
                        />
                        <CoordinateInput
                          label="Boylam (°)"
                          value={data.lon1}
                          onChange={(value) => updateData('lon1', value)}
                          placeholder="28.9784"
                          type="longitude"
                        />
                      </div>
                    </div>

                    {/* Arrival Position */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-red-700 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Varış Konumu
                      </h4>
                      <div className="space-y-3">
                        <CoordinateInput
                          label="Enlem (°)"
                          value={data.lat2}
                          onChange={(value) => updateData('lat2', value)}
                          placeholder="36.8969"
                          type="latitude"
                        />
                        <CoordinateInput
                          label="Boylam (°)"
                          value={data.lon2}
                          onChange={(value) => updateData('lon2', value)}
                          placeholder="30.7133"
                          type="longitude"
                        />
                      </div>
                    </div>
                  </div>
                 </CardContent>
               </Card>

                             {/* Ship Data */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Navigation className="h-5 w-5 text-info" />
                    Gemi Verileri
                  </CardTitle>
                </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="speed">Hız (knot)</Label>
                       <Input
                         id="speed"
                         type="number"
                         step="0.1"
                         value={data.speed}
                         onChange={(e) => updateData('speed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                         placeholder="12"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="course">Rota (°)</Label>
                       <Input
                         id="course"
                         type="number"
                         step="0.1"
                         value={data.course}
                         onChange={(e) => updateData('course', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                         placeholder="090"
                       />
                     </div>
                   </div>
                 </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="plane-sailing" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Navigation className="h-5 w-5 text-blue-500" />
                    Plane Sailing
                  </CardTitle>
                  <CardDescription>
                    Small area navigation calculations using plane trigonometry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="planeLat1">Başlangıç Enlemi (°)</Label>
                        <Input
                          id="planeLat1"
                          type="number"
                          step="0.001"
                          value={data.lat1}
                          onChange={(e) => updateData('lat1', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="41.0082"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="planeLon1">Başlangıç Boylamı (°)</Label>
                        <Input
                          id="planeLon1"
                          type="number"
                          step="0.001"
                          value={data.lon1}
                          onChange={(e) => updateData('lon1', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="28.9784"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="planeLat2">Varış Enlemi (°)</Label>
                        <Input
                          id="planeLat2"
                          type="number"
                          step="0.001"
                          value={data.lat2}
                          onChange={(e) => updateData('lat2', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="41.1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="planeLon2">Varış Boylamı (°)</Label>
                        <Input
                          id="planeLon2"
                          type="number"
                          step="0.001"
                          value={data.lon2}
                          onChange={(e) => updateData('lon2', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="29.0000"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Plane Sailing formulas moved to /navigation/formulas */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="traverse-sailing" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-green-500" />
                    Traverse Sailing
                  </CardTitle>
                  <CardDescription>
                    Multi-leg voyage calculations with different courses and distances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Ayaklar</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setData(prev => ({
                            ...prev,
                            traverseLegs: [...prev.traverseLegs, { course: 0, distance: 0 }]
                          }));
                        }}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" /> Ayak Ekle
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {data.traverseLegs.map((leg, idx) => (
                        <div key={idx} className="grid grid-cols-7 gap-2 items-end">
                          <div className="col-span-2 space-y-1">
                            <Label>Rota (°)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={leg.course}
                              onChange={(e) => {
                                const v = e.target.value === '' ? Number.NaN : parseFloat(e.target.value);
                                setData(prev => {
                                  const legs = [...prev.traverseLegs];
                                  legs[idx] = { ...legs[idx], course: v };
                                  return { ...prev, traverseLegs: legs };
                                });
                              }}
                              placeholder="090"
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label>Mesafe (nm)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={leg.distance}
                              onChange={(e) => {
                                const v = e.target.value === '' ? Number.NaN : parseFloat(e.target.value);
                                setData(prev => {
                                  const legs = [...prev.traverseLegs];
                                  legs[idx] = { ...legs[idx], distance: v };
                                  return { ...prev, traverseLegs: legs };
                                });
                              }}
                              placeholder="10"
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label>Hız (knot) - opsiyonel</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={leg.speed ?? ''}
                              onChange={(e) => {
                                const v = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                setData(prev => {
                                  const legs = [...prev.traverseLegs];
                                  legs[idx] = { ...legs[idx], speed: v };
                                  return { ...prev, traverseLegs: legs };
                                });
                              }}
                              placeholder={`${data.speed}`}
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setData(prev => ({
                                  ...prev,
                                  traverseLegs: prev.traverseLegs.filter((_, i) => i !== idx)
                                }));
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button type="button" onClick={calculateTraverseSailing} className="gap-2">
                        <Calculator className="w-4 h-4" /> Hesapla
                      </Button>
                    </div>

                    {traverseResult && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-card rounded border border-border">
                          <div className="text-sm text-muted-foreground">Toplam dLat (nm)</div>
                          <div className="font-mono text-lg">{traverseResult.totalDLat.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground mt-2">Toplam Departure (nm)</div>
                          <div className="font-mono text-lg">{traverseResult.totalDeparture.toFixed(2)}</div>
                        </div>
                        <div className="p-3 bg-card rounded border border-border">
                          <div className="text-sm text-muted-foreground">Toplam Mesafe (nm)</div>
                          <div className="font-mono text-lg">{traverseResult.totalDistance.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground mt-2">Toplam Rota (°)</div>
                          <div className="font-mono text-lg">{traverseResult.totalCourse.toFixed(1)}</div>
                        </div>
                        <div className="p-3 bg-card rounded border border-border">
                          <div className="text-sm text-muted-foreground">Son Enlem (°)</div>
                          <div className="font-mono text-lg">{traverseResult.finalLat.toFixed(5)}</div>
                          <div className="text-sm text-muted-foreground mt-2">Son Boylam (°)</div>
                          <div className="font-mono text-lg">{traverseResult.finalLon.toFixed(5)}</div>
                        </div>
                        <div className="p-3 bg-card rounded border border-border">
                          <div className="text-sm text-muted-foreground">Toplam Süre (saat)</div>
                          <div className="font-mono text-lg">{traverseResult.totalTime.toFixed(2)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Traverse formulas moved to /navigation/formulas */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="route-plan" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-purple-500" />
                    Route Planning
                  </CardTitle>
                  <CardDescription>
                    Comprehensive voyage planning with waypoints and ETA calculations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="departure">Çıkış Limanı</Label>
                        <Input
                          id="departure"
                          type="text"
                          defaultValue="İstanbul"
                          placeholder="İstanbul"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination">Varış Limanı</Label>
                        <Input
                          id="destination"
                          type="text"
                          defaultValue="İzmir"
                          placeholder="İzmir"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plannedSpeed">Planlanan Hız (knot)</Label>
                        <Input
                          id="plannedSpeed"
                          type="number"
                          step="0.1"
                          value={data.speed}
                          onChange={(e) => updateData('speed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="departureTime">Çıkış Zamanı</Label>
                        <Input
                          id="departureTime"
                          type="time"
                          defaultValue="08:00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fuelCapacity">Yakıt Kapasitesi (ton)</Label>
                        <Input
                          id="fuelCapacity"
                          type="number"
                          step="0.1"
                          defaultValue="50"
                          placeholder="50"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Waypoints</h4>
                      <div className="grid grid-cols-4 gap-2 text-sm font-medium">
                        <div>Waypoint</div>
                        <div>Enlem (°)</div>
                        <div>Boylam (°)</div>
                        <div>ETA</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <Input defaultValue="WP1" placeholder="WP1" />
                        <Input type="number" step="0.001" placeholder="41.0500" />
                        <Input type="number" step="0.001" placeholder="29.0000" />
                        <Input type="time" defaultValue="12:00" />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <Input defaultValue="WP2" placeholder="WP2" />
                        <Input type="number" step="0.001" placeholder="40.5000" />
                        <Input type="number" step="0.001" placeholder="28.0000" />
                        <Input type="time" defaultValue="18:00" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Route Planning Faktörleri:</h4>
                    <div className="text-sm space-y-1">
                      <p>• Hava durumu koşulları</p>
                      <p>• Trafik ayrımı şemaları</p>
                      <p>• Pilot biniş noktaları</p>
                      <p>• Yakıt tüketimi ve menzil</p>
                      <p>• Liman kısıtlamaları ve gelgit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="real-time" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Real Time Running
                  </CardTitle>
                  <CardDescription>
                    Live position updates and course adjustments during voyage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPosition">Mevcut Konum (GPS)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            step="0.0001"
                            value={data.lat1}
                            onChange={(e) => updateData('lat1', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="Enlem"
                          />
                          <Input
                            type="number"
                            step="0.0001"
                            value={data.lon1}
                            onChange={(e) => updateData('lon1', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="Boylam"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="actualSpeed">Gerçek Hız (SOG)</Label>
                        <Input
                          id="actualSpeed"
                          type="number"
                          step="0.1"
                          value={data.speed}
                          onChange={(e) => updateData('speed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="12.5"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="courseOverGround">Course Over Ground (°)</Label>
                        <Input
                          id="courseOverGround"
                          type="number"
                          step="0.1"
                          value={data.course}
                          onChange={(e) => updateData('course', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="090"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="heading">Heading (°)</Label>
                        <Input
                          id="heading"
                          type="number"
                          step="0.1"
                          defaultValue="092"
                          placeholder="092"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="setDrift">Set & Drift</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            step="1"
                            value={data.currentSet}
                            onChange={(e) => updateData('currentSet', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="Set (°)"
                          />
                          <Input
                            type="number"
                            step="0.1"
                            value={data.currentDrift}
                            onChange={(e) => updateData('currentDrift', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="Drift (kn)"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nextWaypoint">Sonraki Waypoint</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            step="0.001"
                            value={data.lat2}
                            onChange={(e) => updateData('lat2', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="Enlem"
                          />
                          <Input
                            type="number"
                            step="0.001"
                            value={data.lon2}
                            onChange={(e) => updateData('lon2', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="Boylam"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeToWaypoint">Waypoint'e Süre</Label>
                        <Input
                          id="timeToWaypoint"
                          type="text"
                          readOnly
                          defaultValue="02:30"
                          className="bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Real Time Monitoring:</h4>
                    <div className="text-sm space-y-1">
                      <p>• GPS pozisyon güncellemeleri</p>
                      <p>• Rota sapması uyarıları</p>
                      <p>• ETA revizyonları</p>
                      <p>• Hız optimizasyonu önerileri</p>
                      <p>• Otomatik log girişleri</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="current-wind" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wind className="h-5 w-5 text-cyan-500" />
                    Current & Wind Sailing
                  </CardTitle>
                  <CardDescription>
                    Combined effects of current and wind on vessel navigation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Waves className="h-4 w-4 text-blue-500" />
                          Akıntı Verileri
                        </h4>
                        <div className="space-y-2">
                          <Label htmlFor="currentDirection">Akıntı Doğrultusu (°)</Label>
                          <Input
                            id="currentDirection"
                            type="number"
                            step="1"
                            value={data.currentSet}
                            onChange={(e) => updateData('currentSet', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="090"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentRate">Akıntı Hızı (knot)</Label>
                          <Input
                            id="currentRate"
                            type="number"
                            step="0.1"
                            value={data.currentDrift}
                            onChange={(e) => updateData('currentDrift', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="2.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tidalState">Gelgit Durumu</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option value="flood">Flood Tide (Yükseliş)</option>
                            <option value="ebb">Ebb Tide (Alçalış)</option>
                            <option value="slack">Slack Water (Durgun)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Wind className="h-4 w-4 text-muted-foreground" />
                          Rüzgar Verileri
                        </h4>
                        <div className="space-y-2">
                          <Label htmlFor="windDir">Rüzgar Doğrultusu (°)</Label>
                          <Input
                            id="windDir"
                            type="number"
                            step="1"
                            value={data.windDirection}
                            onChange={(e) => updateData('windDirection', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="270"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="windSpd">Rüzgar Hızı (knot)</Label>
                          <Input
                            id="windSpd"
                            type="number"
                            step="1"
                            value={data.windSpeed}
                            onChange={(e) => updateData('windSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="15"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="leeway">Leeway Açısı (°)</Label>
                          <Input
                            id="leeway"
                            type="number"
                            step="0.1"
                            value={data.leewayAngle}
                            onChange={(e) => updateData('leewayAngle', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="3.0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vesselSpeed">Gemi Hızı (STW)</Label>
                        <Input
                          id="vesselSpeed"
                          type="number"
                          step="0.1"
                          value={data.speed}
                          onChange={(e) => updateData('speed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="12.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="desiredTrack">İstenen Track (°)</Label>
                        <Input
                          id="desiredTrack"
                          type="number"
                          step="0.1"
                          value={data.course}
                          onChange={(e) => updateData('course', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="090"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="courseToSteer">Steering Course (°)</Label>
                        <Input
                          id="courseToSteer"
                          type="number"
                          step="0.1"
                          readOnly
                          defaultValue="087"
                          className="bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Current & Wind triangle formulas moved to /navigation/formulas */}
                </CardContent>
              </Card>
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
                    onChange={(e) => updateData('currentSet', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentDrift">Akıntı Hızı (knot)</Label>
                  <Input
                    id="currentDrift"
                    type="number"
                    step="0.1"
                    value={data.currentDrift}
                    onChange={(e) => updateData('currentDrift', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windDirection">Rüzgar Doğrultusu (°)</Label>
                  <Input
                    id="windDirection"
                    type="number"
                    step="1"
                    value={data.windDirection}
                    onChange={(e) => updateData('windDirection', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windSpeed">Rüzgar Hızı (knot)</Label>
                  <Input
                    id="windSpeed"
                    type="number"
                    step="1"
                    value={data.windSpeed}
                    onChange={(e) => updateData('windSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
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
              </div>
            </TabsContent>

            <TabsContent value="compass" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Compass className="h-5 w-5 text-info" />
                    Pusula Düzeltmeleri
                  </CardTitle>
                  <CardDescription>
                    Manyetik sapma, pusula sapması ve gyro hatası değerleri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Magnetic Corrections with E-W Buttons */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-red-700 flex items-center gap-2 mb-4">
                      <Navigation className="h-4 w-4" />
                      Manyetik Düzeltmeler
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <DirectionInput
                        label="Manyetik Sapma (Variation)"
                        value={data.variation}
                        onChange={(value) => updateData('variation', value)}
                        placeholder="5.2"
                      />
                      <DirectionInput
                        label="Pusula Sapması (Deviation)"
                        value={data.deviation}
                        onChange={(value) => updateData('deviation', value)}
                        placeholder="2.1"
                      />
                    </div>
                  </div>

                  {/* Other Compass Errors */}
                  <div>
                    <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-4">
                      <Target className="h-4 w-4" />
                      Diğer Pusula Hataları
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gyroError">Gyro Hatası (°)</Label>
                        <Input
                          id="gyroError"
                          type="number"
                          step="0.1"
                          value={data.gyroError}
                          onChange={(e) => updateData('gyroError', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="0.5"
                          className="text-right"
                        />
                        <div className="text-xs text-muted-foreground">
                          Gyro compass hatası (pozitif/negatif)
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                    onChange={(e) => updateData('targetBearing', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetDistance">Hedef Mesafesi (nm)</Label>
                  <Input
                    id="targetDistance"
                    type="number"
                    step="0.1"
                    value={data.targetDistance}
                    onChange={(e) => updateData('targetDistance', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetSpeed">Hedef Hızı (knot)</Label>
                  <Input
                    id="targetSpeed"
                    type="number"
                    step="0.1"
                    value={data.targetSpeed}
                    onChange={(e) => updateData('targetSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetCourse">Hedef Rotası (°)</Label>
                  <Input
                    id="targetCourse"
                    type="number"
                    step="0.1"
                    value={data.targetCourse}
                    onChange={(e) => updateData('targetCourse', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={() => {
                  const arpa = calculateARPA();
                  setResult(prev => prev ? { ...prev, cpa: arpa.cpa, tcpa: arpa.tcpa, relativeSpeed: arpa.relativeSpeed, relativeBearing: arpa.relativeBearing } : {
                    // minimal result object when prev is null
                    gcDistance: 0, gcInitialBearing: 0, gcFinalBearing: 0, gcVertexLat: 0, gcWaypointDistances: [],
                    rhumbDistance: 0, rhumbBearing: 0, departure: 0, dLat: 0, mercatorDistance: 0,
                    spheroidalDistance: 0, spheroidalBearing: 0, reverseBearing: 0,
                    eta: '', etd: '', timeToGo: 0, fuelConsumption: 0, totalFuelCost: 0, alternateETA: '',
                    groundTrack: 0, groundSpeed: 0, driftAngle: 0, courseToSteer: 0, leewayCorrection: 0,
                    magneticBearing: 0, compassBearing: 0, trueBearing: 0, totalCompassError: 0,
                    cpa: arpa.cpa, tcpa: arpa.tcpa, relativeSpeed: arpa.relativeSpeed, relativeBearing: arpa.relativeBearing, collisionRisk: 'none', recommendedAction: '', bcpa: arpa.relativeBearing, dcpa: arpa.cpa,
                    currentTideHeight: 0, tideRange: 0, timeToHW: 0, timeToLW: 0, tidalStream: 0, tidalStreamDirection: 0, springNeapFactor: 0, tidalAcceleration: 0,
                    intercept: 0, positionLine: '', latitude: 0, longitude: 0, altitudeCorrection: 0, celestialCompassError: 0, estimatedPosition: { lat: 0, lon: 0 },
                    sunPosition: { altitude: 0, azimuth: 0, declination: 0 }, moonPosition: { altitude: 0, azimuth: 0, phase: 0 }, planetPositions: [], navigationStars: [],
                    twilightTimes: { sunrise: '', sunset: '', civilTwilightBegin: '', civilTwilightEnd: '', nauticalTwilightBegin: '', nauticalTwilightEnd: '', astronomicalTwilightBegin: '', astronomicalTwilightEnd: '', daylightDuration: 0, goldenHourBegin: '', goldenHourEnd: '', blueHourBegin: '', blueHourEnd: '' },
                    advance: 0, transfer: 0, tacticalDiameter: 0, finalDiameter: 0, wheelOverPoint: 0, turningRadius: 0,
                    optimumRoute: '', weatherDelay: 0, safeCourse: 0, seaState: 0, beaufortScale: 0,
                    pilotBoardingDistance: 0, pilotBoardingETA: '', approachSpeed: 0, minimumDepth: 0, safeDraft: 0,
                    recommendations: []
                  });
                }} className="gap-2">
                  <Radar className="w-4 h-4" /> CPA/TCPA Hesapla
                </Button>
              </div>
              {result?.cpa !== undefined && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border">
                    <div className="text-sm text-muted-foreground">CPA</div>
                    <div className="font-mono text-xl text-blue-600">{result.cpa.toFixed(2)} nm</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border">
                    <div className="text-sm text-muted-foreground">TCPA</div>
                    <div className="font-mono text-xl text-green-600">{result.tcpa.toFixed(1)} dk</div>
                  </div>
                </div>
              )}
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
                    onChange={(e) => updateData('highWaterHeight', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowWaterHeight">Alçak Su Yüksekliği (m)</Label>
                  <Input
                    id="lowWaterHeight"
                    type="number"
                    step="0.1"
                    value={data.lowWaterHeight}
                    onChange={(e) => updateData('lowWaterHeight', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
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
                <div className="space-y-2">
                  <Label htmlFor="springTideRange">Spring Gelgit Farkı (m)</Label>
                  <Input
                    id="springTideRange"
                    type="number"
                    step="0.1"
                    value={data.springTideRange}
                    onChange={(e) => updateData('springTideRange', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neapTideRange">Neap Gelgit Farkı (m)</Label>
                  <Input
                    id="neapTideRange"
                    type="number"
                    step="0.1"
                    value={data.neapTideRange}
                    onChange={(e) => updateData('neapTideRange', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wind className="h-5 w-5 text-blue-500" />
                    Hava Durumu Verileri
                  </CardTitle>
                  <CardDescription>
                    Rüzgar, dalga ve görüş mesafesi bilgilerini girin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="waveHeight">Dalga Yüksekliği (m)</Label>
                      <Input
                        id="waveHeight"
                        type="number"
                        step="0.1"
                        value={data.waveHeight}
                        onChange={(e) => updateData('waveHeight', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                        placeholder="1.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wavePeriod">Dalga Periyodu (s)</Label>
                      <Input
                        id="wavePeriod"
                        type="number"
                        step="0.1"
                        value={data.wavePeriod}
                        onChange={(e) => updateData('wavePeriod', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                        placeholder="6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="waveDirection">Dalga Doğrultusu (°)</Label>
                      <Input
                        id="waveDirection"
                        type="number"
                        step="1"
                        value={data.waveDirection}
                        onChange={(e) => updateData('waveDirection', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                        placeholder="270"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Görüş Mesafesi (nm)</Label>
                      <Input
                        id="visibility"
                        type="number"
                        step="0.1"
                        value={data.visibility}
                        onChange={(e) => updateData('visibility', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barometricPressure">Hava Basıncı (hPa)</Label>
                      <Input
                        id="barometricPressure"
                        type="number"
                        step="0.1"
                        value={data.barometricPressure}
                        onChange={(e) => updateData('barometricPressure', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                        placeholder="1013"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="port" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Anchor className="h-5 w-5 text-green-600" />
                    Liman Yaklaşım Verileri
                  </CardTitle>
                  <CardDescription>
                    Pilot alma noktası ve liman yaklaşım bilgileri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Pilot Boarding Position with N-S E-W Buttons */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-700 flex items-center gap-2 mb-4">
                      <Ship className="h-4 w-4" />
                      Pilot Alma Pozisyonu
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <CoordinateInput
                        label="Pilot Alma Enlemi"
                        value={data.pilotBoardingLat}
                        onChange={(value) => updateData('pilotBoardingLat', value)}
                        placeholder="41.1500"
                        type="latitude"
                      />
                      <CoordinateInput
                        label="Pilot Alma Boylamı"
                        value={data.pilotBoardingLon}
                        onChange={(value) => updateData('pilotBoardingLon', value)}
                        placeholder="29.1000"
                        type="longitude"
                      />
                    </div>
                  </div>

                  {/* Port Approach Parameters */}
                  <div>
                    <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-4">
                      <Anchor className="h-4 w-4" />
                      Yaklaşım Parametreleri
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="portApproachSpeed">Yaklaşım Hızı (knot)</Label>
                        <Input
                          id="portApproachSpeed"
                          type="number"
                          step="0.1"
                          value={data.portApproachSpeed}
                          onChange={(e) => updateData('portApproachSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="8"
                          className="text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requiredUKC">Gerekli UKC (m)</Label>
                        <Input
                          id="requiredUKC"
                          type="number"
                          step="0.1"
                          value={data.requiredUKC}
                          onChange={(e) => updateData('requiredUKC', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="2.0"
                          className="text-right"
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
                          placeholder="8.5"
                          className="text-right"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Demirleme Hesapları */}
            <TabsContent value="anchoring" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Anchor className="h-5 w-5 text-green-600" />
                    Demirleme Hesapları
                  </CardTitle>
                  <CardDescription>Su derinliği ve hava durumuna göre zincir boyu (scope)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Su Derinliği (m)</Label>
                      <Input id="anch-depth" type="number" step="0.1" defaultValue={10} />
                    </div>
                    <div className="space-y-2">
                      <Label>Serbest Borda + Baş Mesafesi (m)</Label>
                      <Input id="anch-freeboard" type="number" step="0.1" defaultValue={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>Rüzgar Hızı (knot)</Label>
                      <Input id="anch-wind" type="number" step="1" defaultValue={20} />
                    </div>
                    <div className="space-y-2">
                      <Label>Deniz Durumu (0-9)</Label>
                      <Input id="anch-seastate" type="number" min="0" max="9" step="1" defaultValue={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Gelgit Aralığı (m) - opsiyonel</Label>
                      <Input id="anch-tide" type="number" step="0.1" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Zemin Kalitesi</Label>
                      <select id="anch-ground" className="w-full p-2 border rounded-md">
                        <option value="good">İyi</option>
                        <option value="fair">Orta</option>
                        <option value="poor">Kötü</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Zincir Kalibre (mm) - opsiyonel</Label>
                      <Input id="anch-chain" type="number" step="1" placeholder="68" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button type="button" onClick={() => {
                      const depth = parseFloat((document.getElementById('anch-depth') as HTMLInputElement)?.value || '0') || 0;
                      const freeb = parseFloat((document.getElementById('anch-freeboard') as HTMLInputElement)?.value || '0') || 0;
                      const wind = parseFloat((document.getElementById('anch-wind') as HTMLInputElement)?.value || '0') || 0;
                      const ss = Math.max(0, Math.min(9, parseFloat((document.getElementById('anch-seastate') as HTMLInputElement)?.value || '0') || 0));
                      const tide = Math.max(0, parseFloat((document.getElementById('anch-tide') as HTMLInputElement)?.value || '0') || 0);
                      const ground = ((document.getElementById('anch-ground') as HTMLSelectElement)?.value || 'fair') as 'good' | 'fair' | 'poor';

                      // Effective depth with tide and waves
                      const waveHeight = ss * 0.5; // m
                      const tideMargin = 0.5 * tide; // m
                      const effectiveDepth = Math.max(1, depth + freeb + tideMargin + 0.5 * waveHeight);

                      // Base scope from wind
                      let baseScope: number;
                      if (wind <= 10) baseScope = 3; else if (wind <= 20) baseScope = 5; else if (wind <= 30) baseScope = 7; else baseScope = 10;
                      const seaStateFactor = 1 + 0.03 * ss;
                      const groundFactor = ground === 'good' ? 1.0 : ground === 'fair' ? 1.10 : 1.25;
                      const recommendedScope = Math.max(3, Math.min(12, baseScope * seaStateFactor * groundFactor));

                      const chainLen = effectiveDepth * recommendedScope;

                      setResult(prev => prev ? { ...prev, minimumDepth: effectiveDepth, safeDraft: chainLen } : {
                        // reuse fields to display numbers without adding new types
                        gcDistance: 0, gcInitialBearing: 0, gcFinalBearing: 0, gcVertexLat: 0, gcWaypointDistances: [],
                        rhumbDistance: 0, rhumbBearing: 0, departure: 0, dLat: 0, mercatorDistance: 0,
                        spheroidalDistance: 0, spheroidalBearing: 0, reverseBearing: 0,
                        eta: '', etd: '', timeToGo: 0, fuelConsumption: 0, totalFuelCost: 0, alternateETA: '',
                        groundTrack: 0, groundSpeed: 0, driftAngle: 0, courseToSteer: 0, leewayCorrection: 0,
                        magneticBearing: 0, compassBearing: 0, trueBearing: 0, totalCompassError: 0,
                        cpa: 0, tcpa: 0, relativeSpeed: 0, relativeBearing: 0, collisionRisk: 'none', recommendedAction: '', bcpa: 0, dcpa: 0,
                        currentTideHeight: 0, tideRange: 0, timeToHW: 0, timeToLW: 0, tidalStream: 0, tidalStreamDirection: 0, springNeapFactor: 0, tidalAcceleration: 0,
                        intercept: 0, positionLine: '', latitude: 0, longitude: 0, altitudeCorrection: 0, celestialCompassError: 0, estimatedPosition: { lat: 0, lon: 0 },
                        sunPosition: { altitude: 0, azimuth: 0, declination: 0 }, moonPosition: { altitude: 0, azimuth: 0, phase: 0 }, planetPositions: [], navigationStars: [],
                        twilightTimes: { sunrise: '', sunset: '', civilTwilightBegin: '', civilTwilightEnd: '', nauticalTwilightBegin: '', nauticalTwilightEnd: '', astronomicalTwilightBegin: '', astronomicalTwilightEnd: '', daylightDuration: 0, goldenHourBegin: '', goldenHourEnd: '', blueHourBegin: '', blueHourEnd: '' },
                        advance: 0, transfer: 0, tacticalDiameter: 0, finalDiameter: 0, wheelOverPoint: 0, turningRadius: 0,
                        optimumRoute: '', weatherDelay: 0, safeCourse: 0, seaState: 0, beaufortScale: 0,
                        pilotBoardingDistance: 0, pilotBoardingETA: '', approachSpeed: 0, minimumDepth: effectiveDepth, safeDraft: chainLen,
                        recommendations: []
                      });
                    }} className="gap-2">
                      <Anchor className="w-4 h-4" /> Zincir Boyu Hesapla
                    </Button>
                  </div>
                  {result && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">Toplam Derinlik</div>
                        <div className="font-mono text-xl text-blue-600">{result.minimumDepth.toFixed(1)} m</div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border">
                        <div className="text-sm text-muted-foreground">Tavsiye Zincir Boyu</div>
                        <div className="font-mono text-xl text-green-600">{result.safeDraft.toFixed(1)} m</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* UKC (Under Keel Clearance) Tab */}
            <TabsContent value="ukc" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Ship className="h-5 w-5 text-blue-600" />
                    UKC (Under Keel Clearance) Hesabı
                  </CardTitle>
                  <CardDescription>
                    Gemi su çekimi, gelgit ve güvenlik marjını dikkate alarak minimum gerekli su derinliği hesaplama
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Ship Parameters */}
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <Ship className="h-4 w-4" />
                        Gemi Parametreleri
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ukc-draft">Gemi Su Çekimi (Draft) (m)</Label>
                          <Input
                            id="ukc-draft"
                            type="number"
                            step="0.1"
                            value={data.shipDraft}
                            onChange={(e) => updateData('shipDraft', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="8.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ukc-squat">Squat Etkisi (m)</Label>
                          <Input
                            id="ukc-squat"
                            type="number"
                            step="0.1"
                            defaultValue="0.5"
                            placeholder="0.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ukc-trim">Trim Düzeltmesi (m)</Label>
                          <Input
                            id="ukc-trim"
                            type="number"
                            step="0.1"
                            defaultValue="0"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tidal Information */}
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <Waves className="h-4 w-4" />
                        Gelgit Bilgileri
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ukc-chart-datum">Kart Datumu Derinliği (m)</Label>
                          <Input
                            id="ukc-chart-datum"
                            type="number"
                            step="0.1"
                            defaultValue="10.0"
                            placeholder="10.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ukc-tide-height">Gelgit Yüksekliği (m)</Label>
                          <Input
                            id="ukc-tide-height"
                            type="number"
                            step="0.1"
                            defaultValue="2.0"
                            placeholder="2.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ukc-wave-allowance">Dalga İlavesi (m)</Label>
                          <Input
                            id="ukc-wave-allowance"
                            type="number"
                            step="0.1"
                            defaultValue="0.5"
                            placeholder="0.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Safety Margins */}
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Güvenlik Marjları
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ukc-min-clearance">Minimum UKC (m)</Label>
                          <Input
                            id="ukc-min-clearance"
                            type="number"
                            step="0.1"
                            value={data.requiredUKC}
                            onChange={(e) => updateData('requiredUKC', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            placeholder="2.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ukc-safety-factor">Güvenlik Faktörü (%)</Label>
                          <Input
                            id="ukc-safety-factor"
                            type="number"
                            step="5"
                            defaultValue="10"
                            placeholder="10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ukc-area-type">Bölge Tipi</Label>
                          <select id="ukc-area-type" className="w-full p-2 border rounded-md">
                            <option value="open">Açık Deniz</option>
                            <option value="coastal">Kıyı</option>
                            <option value="restricted">Kısıtlı Sular</option>
                            <option value="port">Liman</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Calculate Button */}
                    <div className="pt-2">
                      <Button
                        type="button"
                        onClick={() => {
                          const draft = parseFloat((document.getElementById('ukc-draft') as HTMLInputElement)?.value || '0') || 0;
                          const squat = parseFloat((document.getElementById('ukc-squat') as HTMLInputElement)?.value || '0') || 0;
                          const trim = parseFloat((document.getElementById('ukc-trim') as HTMLInputElement)?.value || '0') || 0;
                          const chartDatum = parseFloat((document.getElementById('ukc-chart-datum') as HTMLInputElement)?.value || '0') || 0;
                          const tideHeight = parseFloat((document.getElementById('ukc-tide-height') as HTMLInputElement)?.value || '0') || 0;
                          const waveAllowance = parseFloat((document.getElementById('ukc-wave-allowance') as HTMLInputElement)?.value || '0') || 0;
                          const minClearance = data.requiredUKC || 2.0;
                          const safetyFactor = parseFloat((document.getElementById('ukc-safety-factor') as HTMLInputElement)?.value || '0') || 10;
                          const areaType = (document.getElementById('ukc-area-type') as HTMLSelectElement)?.value || 'open';

                          // Calculate effective draft
                          const effectiveDraft = draft + squat + Math.abs(trim);
                          
                          // Calculate available water depth
                          const availableDepth = chartDatum + tideHeight - waveAllowance;
                          
                          // Calculate actual UKC
                          const actualUKC = availableDepth - effectiveDraft;
                          
                          // Area-specific minimum UKC
                          const areaMinUKC = areaType === 'port' ? minClearance * 0.8 : 
                                           areaType === 'restricted' ? minClearance * 1.0 :
                                           areaType === 'coastal' ? minClearance * 1.2 : 
                                           minClearance * 1.5;
                          
                          // Calculate required depth with safety margin
                          const safetyMargin = effectiveDraft * (safetyFactor / 100);
                          const requiredDepth = effectiveDraft + areaMinUKC + safetyMargin;
                          
                          // Determine safety status
                          const isSafe = actualUKC >= areaMinUKC;
                          const ukcMargin = actualUKC - areaMinUKC;

                          setResult(prev => prev ? {
                            ...prev,
                            minimumDepth: requiredDepth,
                            safeDraft: effectiveDraft,
                            currentTideHeight: actualUKC,
                            tidalStream: ukcMargin,
                            collisionRisk: isSafe ? 'none' : 'high',
                            recommendations: [
                              isSafe ? '✓ UKC güvenli sınırlar içinde' : '⚠ UKC yetersiz - GEÇİŞ TEHLİKELİ!',
                              `Efektif su çekimi: ${effectiveDraft.toFixed(2)} m`,
                              `Mevcut UKC: ${actualUKC.toFixed(2)} m`,
                              `Minimum gerekli UKC: ${areaMinUKC.toFixed(2)} m`,
                              `Güvenlik marjı: ${ukcMargin.toFixed(2)} m`,
                              areaType === 'port' ? 'Liman bölgesi - daha düşük UKC kabul edilebilir' :
                              areaType === 'restricted' ? 'Kısıtlı sular - standart UKC gerekli' :
                              areaType === 'coastal' ? 'Kıyı bölgesi - artırılmış UKC önerilir' :
                              'Açık deniz - maksimum güvenlik marjı önerilir'
                            ]
                          } : {
                            gcDistance: 0, gcInitialBearing: 0, gcFinalBearing: 0, gcVertexLat: 0, gcWaypointDistances: [],
                            rhumbDistance: 0, rhumbBearing: 0, departure: 0, dLat: 0, mercatorDistance: 0,
                            spheroidalDistance: 0, spheroidalBearing: 0, reverseBearing: 0,
                            eta: '', etd: '', timeToGo: 0, fuelConsumption: 0, totalFuelCost: 0, alternateETA: '',
                            groundTrack: 0, groundSpeed: 0, driftAngle: 0, courseToSteer: 0, leewayCorrection: 0,
                            magneticBearing: 0, compassBearing: 0, trueBearing: 0, totalCompassError: 0,
                            cpa: 0, tcpa: 0, relativeSpeed: 0, relativeBearing: 0, collisionRisk: isSafe ? 'none' : 'high', recommendedAction: '', bcpa: 0, dcpa: 0,
                            currentTideHeight: actualUKC, tideRange: 0, timeToHW: 0, timeToLW: 0, tidalStream: ukcMargin, tidalStreamDirection: 0, springNeapFactor: 0, tidalAcceleration: 0,
                            intercept: 0, positionLine: '', latitude: 0, longitude: 0, altitudeCorrection: 0, celestialCompassError: 0, estimatedPosition: { lat: 0, lon: 0 },
                            sunPosition: { altitude: 0, azimuth: 0, declination: 0 }, moonPosition: { altitude: 0, azimuth: 0, phase: 0 }, planetPositions: [], navigationStars: [],
                            twilightTimes: { sunrise: '', sunset: '', civilTwilightBegin: '', civilTwilightEnd: '', nauticalTwilightBegin: '', nauticalTwilightEnd: '', astronomicalTwilightBegin: '', astronomicalTwilightEnd: '', daylightDuration: 0, goldenHourBegin: '', goldenHourEnd: '', blueHourBegin: '', blueHourEnd: '' },
                            advance: 0, transfer: 0, tacticalDiameter: 0, finalDiameter: 0, wheelOverPoint: 0, turningRadius: 0,
                            optimumRoute: '', weatherDelay: 0, safeCourse: 0, seaState: 0, beaufortScale: 0,
                            pilotBoardingDistance: 0, pilotBoardingETA: '', approachSpeed: 0, minimumDepth: requiredDepth, safeDraft: effectiveDraft,
                            recommendations: [
                              isSafe ? '✓ UKC güvenli sınırlar içinde' : '⚠ UKC yetersiz - GEÇİŞ TEHLİKELİ!',
                              `Efektif su çekimi: ${effectiveDraft.toFixed(2)} m`,
                              `Mevcut UKC: ${actualUKC.toFixed(2)} m`,
                              `Minimum gerekli UKC: ${areaMinUKC.toFixed(2)} m`,
                              `Güvenlik marjı: ${ukcMargin.toFixed(2)} m`,
                              areaType === 'port' ? 'Liman bölgesi - daha düşük UKC kabul edilebilir' :
                              areaType === 'restricted' ? 'Kısıtlı sular - standart UKC gerekli' :
                              areaType === 'coastal' ? 'Kıyı bölgesi - artırılmış UKC önerilir' :
                              'Açık deniz - maksimum güvenlik marjı önerilir'
                            ]
                          });
                          
                          toast.success(isSafe ? 'UKC hesaplaması tamamlandı - Geçiş güvenli' : 'UKC yetersiz - Dikkatli olun!', {
                            description: `Mevcut UKC: ${actualUKC.toFixed(2)} m`
                          });
                        }}
                        className="gap-2"
                      >
                        <Calculator className="w-4 h-4" /> UKC Hesapla
                      </Button>
                    </div>

                    {/* Results Display */}
                    {result && result.recommendations && result.recommendations.length > 0 && (
                      <div className="space-y-4">
                        {/* Main Results */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className={`p-3 rounded border ${result.collisionRisk === 'none' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                            <div className="text-sm text-muted-foreground">Efektif Draft</div>
                            <div className={`font-mono text-lg ${result.collisionRisk === 'none' ? 'text-blue-600' : 'text-red-600'}`}>
                              {result.safeDraft.toFixed(2)} m
                            </div>
                          </div>
                          <div className={`p-3 rounded border ${result.collisionRisk === 'none' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                            <div className="text-sm text-muted-foreground">Mevcut UKC</div>
                            <div className={`font-mono text-lg ${result.collisionRisk === 'none' ? 'text-green-600' : 'text-orange-600'}`}>
                              {result.currentTideHeight.toFixed(2)} m
                            </div>
                          </div>
                          <div className={`p-3 rounded border ${result.tidalStream >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                            <div className="text-sm text-muted-foreground">Güvenlik Marjı</div>
                            <div className={`font-mono text-lg ${result.tidalStream >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {result.tidalStream.toFixed(2)} m
                            </div>
                          </div>
                          <div className={`p-3 rounded border ${result.collisionRisk === 'none' ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                            <div className="text-sm text-muted-foreground">Min. Gerekli Derinlik</div>
                            <div className={`font-mono text-lg ${result.collisionRisk === 'none' ? 'text-cyan-600' : 'text-yellow-600'}`}>
                              {result.minimumDepth.toFixed(2)} m
                            </div>
                          </div>
                        </div>

                        {/* Status and Recommendations */}
                        <div className={`p-4 rounded-lg border-2 ${result.collisionRisk === 'none' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-red-50 dark:bg-red-900/20 border-red-500'}`}>
                          <div className="flex items-start gap-3">
                            {result.collisionRisk === 'none' ? (
                              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                            ) : (
                              <Target className="h-6 w-6 text-red-600 mt-0.5" />
                            )}
                            <div className="flex-1 space-y-2">
                              <div className={`font-semibold text-lg ${result.collisionRisk === 'none' ? 'text-green-700' : 'text-red-700'}`}>
                                {result.recommendations[0]}
                              </div>
                              <div className="text-sm space-y-1">
                                {result.recommendations.slice(1).map((rec, idx) => (
                                  <div key={idx} className="text-gray-700 dark:text-gray-300">• {rec}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border">
                          <h5 className="font-semibold text-blue-700 mb-2">UKC Hesaplama Formülü:</h5>
                          <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                            <div>• <strong>Efektif Draft</strong> = Draft + Squat + |Trim|</div>
                            <div>• <strong>Mevcut Su Derinliği</strong> = Kart Datumu + Gelgit Yüksekliği - Dalga İlavesi</div>
                            <div>• <strong>Mevcut UKC</strong> = Mevcut Su Derinliği - Efektif Draft</div>
                            <div>• <strong>Minimum UKC</strong> = Bölge tipine göre değişir (Liman: %80, Kısıtlı: %100, Kıyı: %120, Açık: %150)</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="astronomical" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sun className="h-5 w-5 text-orange-600" />
                    Astronomik Hesaplamalar
                  </CardTitle>
                  <CardDescription>
                    Gündoğumu, günbatımı, alacakaranlık zamanları ve ay fazı hesaplamaları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Date and Time Settings */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4" />
                      Tarih ve Saat Ayarları
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Tarih</Label>
                        <Input
                          id="date"
                          type="date"
                          value={data.date}
                          onChange={(e) => updateData('date', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeZone">Saat Dilimi (UTC'den fark)</Label>
                        <Input
                          id="timeZone"
                          type="number"
                          step="0.5"
                          value={data.timeZone}
                          onChange={(e) => updateData('timeZone', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                          placeholder="3 (Türkiye)"
                          className="text-right"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Observer Position with N-S E-W Buttons */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-700 flex items-center gap-2 mb-4">
                      <Globe className="h-4 w-4" />
                      Gözlemci Pozisyonu
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CoordinateInput
                        label="Gözlemci Enlemi"
                        value={data.observerLatitude}
                        onChange={(value) => updateData('observerLatitude', value)}
                        placeholder="41.0082"
                        type="latitude"
                      />
                      <CoordinateInput
                        label="Gözlemci Boylamı"
                        value={data.observerLongitude}
                        onChange={(value) => updateData('observerLongitude', value)}
                        placeholder="28.9784"
                        type="longitude"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Astronomical Results */}
              {(() => {
                const selectedDate = new Date(data.date);
                const sunTimes = calculateSunriseSunset(selectedDate, data.observerLatitude, data.observerLongitude, data.timeZone);
                const moonPhase = calculateMoonPhase(selectedDate);
                const jd = calculateJulianDay(selectedDate);
                const sunPos = calculateSunPosition(jd, data.observerLatitude, data.observerLongitude);
                
                return (
                  <div className="space-y-4 mt-6">
                    {/* Sun Times */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Sun className="h-5 w-5 text-yellow-500" />
                          Güneş Zamanları
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">Gündoğumu:</span>
                              <Badge variant="outline" className="gap-1">
                                <Sunrise className="h-3 w-3" />
                                {sunTimes.sunrise}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Günbatımı:</span>
                              <Badge variant="outline" className="gap-1">
                                <Sunset className="h-3 w-3" />
                                {sunTimes.sunset}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Sivil Alacakaranlık:</span>
                              <span className="text-sm">{sunTimes.civilTwilightBegin} - {sunTimes.civilTwilightEnd}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Denizci Alacakaranlığı:</span>
                              <span className="text-sm">{sunTimes.nauticalTwilightBegin} - {sunTimes.nauticalTwilightEnd}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Astronomik Alacakaranlık:</span>
                              <span className="text-sm">{sunTimes.astronomicalTwilightBegin} - {sunTimes.astronomicalTwilightEnd}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Moon Phase */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Moon className="h-5 w-5 text-blue-400" />
                          Ay Fazı
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="text-center space-y-1">
                            <div className="text-xl sm:text-2xl font-semibold">{moonPhase.phaseName}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Faz Adı</div>
                          </div>
                          <div className="text-center space-y-1">
                            <div className="text-xl sm:text-2xl font-semibold">{moonPhase.phase}%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Tamamlanma</div>
                          </div>
                          <div className="text-center space-y-1">
                            <div className="text-xl sm:text-2xl font-semibold">{moonPhase.illumination}%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Aydınlanma</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sun Position */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Globe className="h-5 w-5 text-orange-500" />
                          Güneş Konumu
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">Yükseklik:</span>
                              <Badge variant="secondary">{sunPos.altitude.toFixed(2)}°</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Azimut:</span>
                              <Badge variant="secondary">{sunPos.azimuth.toFixed(2)}°</Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">Deklinasyon:</span>
                              <Badge variant="outline">{sunPos.declination.toFixed(2)}°</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Saat Açısı:</span>
                              <Badge variant="outline">{sunPos.hourAngle.toFixed(2)}°</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </TabsContent>

            <TabsContent value="celestial" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    Göksel Seyir Hesaplamaları / Almanac
                  </CardTitle>
                  <CardDescription>
                    Sextant ölçümleri ve gözlemci pozisyonu ile celestial navigation hesaplamaları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Observer Position */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-700 flex items-center gap-2 mb-4">
                      <Eye className="h-4 w-4" />
                      Gözlemci Pozisyonu
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CoordinateInput
                        label="Gözlemci Enlemi"
                        value={data.observerLatitude}
                        onChange={(value) => updateData('observerLatitude', value)}
                        placeholder="41.0082"
                        type="latitude"
                      />
                      <CoordinateInput
                        label="Gözlemci Boylamı"
                        value={data.observerLongitude}
                        onChange={(value) => updateData('observerLongitude', value)}
                        placeholder="28.9784"
                        type="longitude"
                      />
                    </div>
                  </div>

                  {/* Celestial Measurements */}
                  <div>
                    <h4 className="font-semibold text-purple-700 flex items-center gap-2 mb-4">
                      <Camera className="h-4 w-4" />
                      Sextant Ölçümleri
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="order-2 md:order-1 space-y-4">
                        <SextantCamera 
                          onHoMeasured={(deg) => updateData('altitude', deg)} 
                          observerPosition={{
                            latitude: data.observerLatitude,
                            longitude: data.observerLongitude
                          }}
                          timeZoneHours={data.timeZone}
                        />
                      </div>
                      <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="altitude">Sextant Yüksekliği (°)</Label>
                          <Input
                            id="altitude"
                            type="number"
                            step="0.1"
                            value={data.altitude}
                            onChange={(e) => updateData('altitude', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            className="text-right"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="azimuth">Azimut (°)</Label>
                          <Input
                            id="azimuth"
                            type="number"
                            step="0.1"
                            value={data.azimuth}
                            onChange={(e) => updateData('azimuth', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            className="text-right"
                          />
                        </div>
                        {(() => {
                          // Use UTC date (00:00Z) so Almanac lookup is unambiguous.
                          const selectedDateUtc = new Date(`${data.date}T00:00:00Z`);
                          const almanac = computeSunAlmanac(selectedDateUtc);
                          const gha = almanac.ghaSunDeg;
                          // East-positive lon convention: LHA = GHA - lonE
                          const lha = normalizeAngle(gha - data.observerLongitude);
                          const latRad = toRadians(data.observerLatitude);
                          const decRad = toRadians(almanac.decSunDeg);
                          const lhaRad = toRadians(lha);
                          const hcRad = Math.asin(Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad));
                          const hc = toDegrees(hcRad);
                          return (
                            <>
                              <div className="space-y-2">
                                <Label>GHA (Güneş) (°)</Label>
                                <div className="text-right py-2 px-3 rounded border bg-muted">{gha.toFixed(2)}</div>
                              </div>
                              <div className="space-y-2">
                                <Label>LHA (°)</Label>
                                <div className="text-right py-2 px-3 rounded border bg-muted">{lha.toFixed(2)}</div>
                              </div>
                              <div className="space-y-2">
                                <Label>Dekl. (°)</Label>
                                <div className="text-right py-2 px-3 rounded border bg-muted">{almanac.decSunDeg.toFixed(2)}</div>
                              </div>
                              <div className="space-y-2">
                                <Label>Hc (°)</Label>
                                <div className="text-right py-2 px-3 rounded border bg-muted">{hc.toFixed(2)}</div>
                              </div>
                              <div className="col-span-2 space-y-1">
                                <Label>Intercept (Ho - Hc)</Label>
                                <div className="text-right py-2 px-3 rounded border bg-muted">
                                  { (data.altitude - hc).toFixed(2) }°
                                </div>
                              </div>
                            </>
                          );
                        })()}
                        <div className="space-y-2">
                          <Label htmlFor="gha">GHA (°)</Label>
                          <Input
                            id="gha"
                            type="number"
                            step="0.1"
                            value={data.gha}
                            onChange={(e) => updateData('gha', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            className="text-right"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="declination">Deklinasyon (°)</Label>
                          <Input
                            id="declination"
                            type="number"
                            step="0.1"
                            value={data.declination}
                            onChange={(e) => updateData('declination', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                            className="text-right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Marine Weather Tab */}
            <TabsContent value="marine-weather" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-blue-500" />
                    Deniz Hava Durumu
                  </CardTitle>
                  <CardDescription>
                    Denizcilik için meteoroloji hesaplamaları ve hava durumu analizi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Wind Data */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Wind className="h-4 w-4 text-blue-500" />
                          Rüzgar Verileri
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="windDir">Rüzgar Yönü (°)</Label>
                            <Input
                              id="windDir"
                              type="number"
                              value={data.windDirection}
                              onChange={(e) => updateData('windDirection', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                              placeholder="270"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="windSpd">Rüzgar Hızı (knot)</Label>
                            <Input
                              id="windSpd"
                              type="number"
                              value={data.windSpeed}
                              onChange={(e) => updateData('windSpeed', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                              placeholder="15"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="barPressure">Hava Basıncı (hPa)</Label>
                            <Input
                              id="barPressure"
                              type="number"
                              value={data.barometricPressure}
                              onChange={(e) => updateData('barometricPressure', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                              placeholder="1013"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Wave Data */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Waves className="h-4 w-4 text-cyan-500" />
                          Dalga Verileri
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="waveHgt">Dalga Yüksekliği (m)</Label>
                            <Input
                              id="waveHgt"
                              type="number"
                              step="0.1"
                              value={data.waveHeight}
                              onChange={(e) => updateData('waveHeight', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                              placeholder="2.5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="wavePer">Dalga Periyodu (s)</Label>
                            <Input
                              id="wavePer"
                              type="number"
                              value={data.wavePeriod}
                              onChange={(e) => updateData('wavePeriod', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                              placeholder="6"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="waveDir">Dalga Yönü (°)</Label>
                            <Input
                              id="waveDir"
                              type="number"
                              value={data.waveDirection}
                              onChange={(e) => updateData('waveDirection', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                              placeholder="270"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Weather Analysis Results */}
                  {result && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-blue-50 dark:bg-blue-900/20">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {result.beaufortScale}
                            </div>
                            <div className="text-sm text-muted-foreground">Beaufort Skalası</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-cyan-50 dark:bg-cyan-900/20">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-600">
                              {result.seaState}
                            </div>
                            <div className="text-sm text-muted-foreground">Douglas Deniz Durumu</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-50 dark:bg-orange-900/20">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {result.weatherDelay}
                            </div>
                            <div className="text-sm text-muted-foreground">Hava Gecikmesi (saat)</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Weather Scales Reference */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Beaufort Rüzgar Skalası</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between"><span>0 (Sakin)</span><span>&lt; 1 knot</span></div>
                          <div className="flex justify-between"><span>1 (Hafif)</span><span>1-3 knot</span></div>
                          <div className="flex justify-between"><span>2 (Hafif)</span><span>4-6 knot</span></div>
                          <div className="flex justify-between"><span>3 (Hafif)</span><span>7-10 knot</span></div>
                          <div className="flex justify-between"><span>4 (Orta)</span><span>11-16 knot</span></div>
                          <div className="flex justify-between"><span>5 (Taze)</span><span>17-21 knot</span></div>
                          <div className="flex justify-between"><span>6 (Kuvvetli)</span><span>22-27 knot</span></div>
                          <div className="flex justify-between"><span>7 (Sert)</span><span>28-33 knot</span></div>
                          <div className="flex justify-between"><span>8 (Fırtına)</span><span>34-40 knot</span></div>
                          <div className="flex justify-between"><span>9+ (Şiddetli)</span><span>&gt; 41 knot</span></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Douglas Deniz Durumu Skalası</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between"><span>0 (Sakin)</span><span>&lt; 0.1m</span></div>
                          <div className="flex justify-between"><span>1 (Çok hafif)</span><span>0.1-0.5m</span></div>
                          <div className="flex justify-between"><span>2 (Hafif)</span><span>0.5-1.25m</span></div>
                          <div className="flex justify-between"><span>3 (Hafif)</span><span>1.25-2.5m</span></div>
                          <div className="flex justify-between"><span>4 (Orta)</span><span>2.5-4m</span></div>
                          <div className="flex justify-between"><span>5 (Kabaca)</span><span>4-6m</span></div>
                          <div className="flex justify-between"><span>6 (Çok kabaca)</span><span>6-9m</span></div>
                          <div className="flex justify-between"><span>7 (Yüksek)</span><span>9-14m</span></div>
                          <div className="flex justify-between"><span>8 (Çok yüksek)</span><span>&gt; 14m</span></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sunrise/Sunset Tab */}
            <TabsContent value="sunrise-sunset" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sunrise className="h-5 w-5 text-orange-500" />
                    Gündoğumu/Gün Batımı Tabloları
                  </CardTitle>
                  <CardDescription>
                    Astronomik twilight zamanları ve güneş konumu hesaplamaları
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location Input */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-500" />
                          Konum Bilgileri
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="obsLat">Gözlemci Enlemi (°)</Label>
                            <Input
                              id="obsLat"
                              type="number"
                              step="0.001"
                              value={data.observerLatitude}
                              onChange={(e) => updateData('observerLatitude', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                              placeholder="41.0082"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="obsLon">Gözlemci Boylamı (°)</Label>
                            <Input
                              id="obsLon"
                              type="number"
                              step="0.001"
                              value={data.observerLongitude}
                              onChange={(e) => updateData('observerLongitude', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                              placeholder="28.9784"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="calcDate">Tarih</Label>
                            <Input
                              id="calcDate"
                              type="date"
                              value={data.date}
                              onChange={(e) => updateData('date', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="timeZone">Saat Dilimi (UTC+)</Label>
                            <Input
                              id="timeZone"
                              type="number"
                              value={data.timeZone}
                              onChange={(e) => updateData('timeZone', e.target.value === '' ? Number.NaN : parseFloat(e.target.value))}
                              placeholder="3"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sun Times Results */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-500" />
                          Güneş Zamanları
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {result?.twilightTimes && (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                              <span className="flex items-center gap-2">
                                <Sunrise className="h-3 w-3" />
                                Gündoğumu
                              </span>
                              <span className="font-mono">{result.twilightTimes.sunrise}</span>
                            </div>
                            <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                              <span>Sivil Alacakaranlık Başı</span>
                              <span className="font-mono">{result.twilightTimes.civilTwilightBegin}</span>
                            </div>
                            <div className="flex justify-between p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                              <span>Denizcilik Alacakaranlık Başı</span>
                              <span className="font-mono">{result.twilightTimes.nauticalTwilightBegin}</span>
                            </div>
                            <div className="flex justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                              <span>Astronomik Alacakaranlık Başı</span>
                              <span className="font-mono">{result.twilightTimes.astronomicalTwilightBegin}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                              <span>Astronomik Alacakaranlık Sonu</span>
                              <span className="font-mono">{result.twilightTimes.astronomicalTwilightEnd}</span>
                            </div>
                            <div className="flex justify-between p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                              <span>Denizcilik Alacakaranlık Sonu</span>
                              <span className="font-mono">{result.twilightTimes.nauticalTwilightEnd}</span>
                            </div>
                            <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                              <span>Sivil Alacakaranlık Sonu</span>
                              <span className="font-mono">{result.twilightTimes.civilTwilightEnd}</span>
                            </div>
                            <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                              <span className="flex items-center gap-2">
                                <Sunset className="h-3 w-3" />
                                Gün Batımı
                              </span>
                              <span className="font-mono">{result.twilightTimes.sunset}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                              <span>Gündüz Süresi</span>
                              <span className="font-mono">{result.twilightTimes.daylightDuration.toFixed(1)} saat</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sun Position */}
                  {result?.sunPosition && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-500" />
                          Güneş Konumu (Şu Anki)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="text-xl font-bold text-yellow-600">
                              {result.sunPosition.altitude.toFixed(1)}°
                            </div>
                            <div className="text-sm text-muted-foreground">Yükseklik</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="text-xl font-bold text-orange-600">
                              {result.sunPosition.azimuth.toFixed(1)}°
                            </div>
                            <div className="text-sm text-muted-foreground">Azimut</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="text-xl font-bold text-red-600">
                              {result.sunPosition.declination.toFixed(1)}°
                            </div>
                            <div className="text-sm text-muted-foreground">Deklinasyon</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Information */}
                  <Card className="bg-muted/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Alacakaranlık Tanımları</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs">
                        <p><strong>Sivil Alacakaranlık:</strong> Güneş ufkunun 6° altında, normal dış mekan faaliyetleri mümkün</p>
                        <p><strong>Denizcilik Alacakaranlık:</strong> Güneş ufkunun 12° altında, deniz ufku görülebilir</p>
                        <p><strong>Astronomik Alacakaranlık:</strong> Güneş ufkunun 18° altında, gerçek gece karanlığı</p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>

                {/* Integrated Almanac Content */}
                <CardContent className="space-y-4">
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Nautical Almanac</h3>
                    <p className="text-sm text-muted-foreground">
                      Denizcilik hesaplamaları için astronomik veriler ve tablolar
                    </p>

                    {/* Almanac PDF Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-dashed">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            Nautical Almanac 2025
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            Güncel yıl için astronomi verileri, güneş, ay ve gezegen pozisyonları
                          </p>
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <a href="https://thenauticalalmanac.com/TNARegular/2025_Nautical_Almanac.pdf" target="_blank" rel="noopener noreferrer">
                              PDF İndir
                            </a>
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-dashed">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            Sight Reduction Tables
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            HO 229, HO 249 tabloları ve göksel navigasyon hesaplamaları
                          </p>
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <a href="/sight-reduction-guide.html" rel="noopener noreferrer">
                              İnteraktif Tablolar
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Reference Tables */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Hızlı Referans Tabloları</h4>
                      
                      {/* Dip Table */}
                      <Card className="bg-muted/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Dip (Ufuk Düzeltmesi) Tablosu</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="font-medium">Göz Yük. (m)</div>
                            <div className="font-medium">Dip (′)</div>
                            <div className="font-medium">Göz Yük. (m)</div>
                            <div className="font-medium">Dip (′)</div>
                            
                            <div>2.0</div><div>-2.5</div><div>10.0</div><div>-5.6</div>
                            <div>3.0</div><div>-3.0</div><div>15.0</div><div>-6.8</div>
                            <div>4.0</div><div>-3.5</div><div>20.0</div><div>-7.9</div>
                            <div>5.0</div><div>-3.9</div><div>25.0</div><div>-8.8</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>

              </Card>
            </TabsContent>

            {/* Almanac Tab */}
            <TabsContent value="almanac" className="space-y-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-500" />
                      Nautical Almanac
                    </CardTitle>
                    <CardDescription>
                      Denizcilik hesaplamaları için astronomik veriler ve tablolar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Almanac PDF Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="border-dashed">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            Nautical Almanac 2025
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            Güncel yıl için astronomi verileri, güneş, ay ve gezegen pozisyonları
                          </p>
                          <div className="space-y-2">
                            <Button asChild variant="outline" size="sm" className="w-full">
                              <a href="https://thenauticalalmanac.com/TNARegular/2025_Nautical_Almanac.pdf" target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4 mr-2" />
                                PDF İndir
                              </a>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="w-full">
                              <a href="https://aa.usno.navy.mil/publications/na" target="_blank" rel="noopener noreferrer">
                                <Sun className="h-4 w-4 mr-2" />
                                USNO Online Almanak
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-dashed">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-blue-500" />
                            Sight Reduction Tables
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            HO 229, HO 249 tabloları ve göksel navigasyon hesaplamaları
                          </p>
                          <div className="space-y-2">
                            <Button asChild variant="outline" size="sm" className="w-full">
                              <a href="/sight-reduction-guide.html" rel="noopener noreferrer">
                                <Calculator className="h-4 w-4 mr-2" />
                                İnteraktif Tablolar
                              </a>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="w-full">
                              <a href="https://thenauticalalmanac.com/HO249/2019/HO249Vol1.pdf" target="_blank" rel="noopener noreferrer">
                                <BookOpen className="h-4 w-4 mr-2" />
                                HO 249 (Tüm Ciltler)
                              </a>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="w-full">
                              <a href="https://thenauticalalmanac.com/HO229.html" target="_blank" rel="noopener noreferrer">
                                <BookOpen className="h-4 w-4 mr-2" />
                                HO 229 (Tüm Ciltler)
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-dashed">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Waves className="h-4 w-4 text-cyan-500" />
                            Tide Tables
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            Gelgit tahminleri, HW/LW saatleri ve yükseklikleri için referans tablolar
                          </p>
                          <div className="space-y-2">
                            <Button asChild variant="outline" size="sm" className="w-full">
                              <a href="https://tidesandcurrents.noaa.gov/noaatidepredictions.html" target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4 mr-2" />
                                NOAA Tide Predictions
                              </a>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="w-full">
                              <a href="https://www.admiralty.co.uk/information/admiralty-tide-tables" target="_blank" rel="noopener noreferrer">
                                <Anchor className="h-4 w-4 mr-2" />
                                Admiralty Tide Tables
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

                    {/* 2025 Almanac (Sun + Aries) - built-in table */}
                    {(() => {
                      const baseUtc = new Date(`${data.date}T00:00:00Z`);
                      const is2025 = baseUtc.getUTCFullYear() === 2025;
                      const rows = is2025 ? generateDailySunAlmanac(baseUtc) : [];

                      return (
                        <Card className="bg-muted/30">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Sun className="h-4 w-4 text-yellow-500" />
                              2025 Güneş Almanacı (UTC saatlik)
                            </CardTitle>
                            <CardDescription>
                              {is2025
                                ? "Uygulama içi 2025 tablosu (GHA Güneş, Dekl., GHA Aries)."
                                : "Bu tablo sadece 2025 yılı için dahili olarak mevcuttur."}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {is2025 ? (
                              <div className="max-h-80 overflow-auto rounded border">
                                <table className="w-full text-xs">
                                  <thead className="sticky top-0 bg-background">
                                    <tr className="text-left">
                                      <th className="p-2">UTC</th>
                                      <th className="p-2">GHA Aries (°)</th>
                                      <th className="p-2">GHA Güneş (°)</th>
                                      <th className="p-2">Dekl. (°)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rows.map((r) => (
                                      <tr key={r.utcHour} className="border-t">
                                        <td className="p-2 font-mono">{String(r.utcHour).padStart(2, "0")}:00</td>
                                        <td className="p-2 font-mono">{r.ghaAriesDeg.toFixed(2)}</td>
                                        <td className="p-2 font-mono">{r.ghaSunDeg.toFixed(2)}</td>
                                        <td className="p-2 font-mono">{r.decSunDeg.toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Tarih 2025'e alın.</div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })()}

                    {/* Quick Reference Tables */}
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Hızlı Referans Tabloları
                      </h4>
                      
                      {/* Dip Table */}
                      <Card className="bg-muted/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Dip (Ufuk Düzeltmesi) Tablosu</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="font-medium">Göz Yük. (m)</div>
                            <div className="font-medium">Dip (′)</div>
                            <div className="font-medium">Göz Yük. (m)</div>
                            <div className="font-medium">Dip (′)</div>
                            
                            <div>2.0</div><div>-2.5</div><div>10.0</div><div>-5.6</div>
                            <div>3.0</div><div>-3.0</div><div>15.0</div><div>-6.8</div>
                            <div>4.0</div><div>-3.5</div><div>20.0</div><div>-7.9</div>
                            <div>5.0</div><div>-3.9</div><div>25.0</div><div>-8.8</div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Refraction Table */}
                      <Card className="bg-muted/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Refraksiyon Düzeltmesi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="font-medium">Yükseklik (°)</div>
                            <div className="font-medium">Düzeltme (′)</div>
                            <div className="font-medium">Yükseklik (°)</div>
                            <div className="font-medium">Düzeltme (′)</div>
                            
                            <div>0°</div><div>-34.5</div><div>20°</div><div>-2.6</div>
                            <div>5°</div><div>-9.9</div><div>30°</div><div>-1.7</div>
                            <div>10°</div><div>-5.3</div><div>45°</div><div>-1.0</div>
                            <div>15°</div><div>-3.5</div><div>90°</div><div>0.0</div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Semi-diameter values */}
                      <Card className="bg-muted/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Güneş ve Ay Yarı Çapları</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="flex items-center gap-2">
                                <Sun className="h-3 w-3 text-yellow-500" />
                                Güneş SD
                              </span>
                              <span>15.7′ - 16.3′</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="flex items-center gap-2">
                                <Moon className="h-3 w-3 text-gray-400" />
                                Ay SD
                              </span>
                              <span>14.7′ - 16.8′</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

                    {/* Navigation to other tabs */}
                    <div className="space-y-3">
                      <h4 className="font-medium">İlgili Hesaplamalar</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const tabs = document.querySelector('[role="tablist"]');
                            const sunsetTab = tabs?.querySelector('[value="sunrise-sunset"]') as HTMLButtonElement;
                            if (sunsetTab) sunsetTab.click();
                          }}
                        >
                          <Sunrise className="h-4 w-4 mr-2" />
                          Gündoğumu/Batımı Tabloları
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const tabs = document.querySelector('[role="tablist"]');
                            const weatherTab = tabs?.querySelector('[value="marine-weather"]') as HTMLButtonElement;
                            if (weatherTab) weatherTab.click();
                          }}
                        >
                          <Wind className="h-4 w-4 mr-2" />
                          Deniz Hava Durumu
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Büyük Daire Mesafesi</Label>
                  <p className="text-xl sm:text-2xl font-bold text-info">{result.gcDistance.toFixed(1)} nm</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Loxodromik Mesafe</Label>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{result.rhumbDistance.toFixed(1)} nm</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">İlk Doğrultu</Label>
                  <p className="text-lg font-semibold">{result.gcInitialBearing.toFixed(1)}°</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Son Doğrultu</Label>
                  <p className="text-lg font-semibold">{result.gcFinalBearing.toFixed(1)}°</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">ETA</Label>
                  <p className="text-lg font-semibold">{result.eta}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Seyir Süresi</Label>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Yerüstü Rotası</Label>
                  <p className="text-lg font-semibold">{result.groundTrack.toFixed(1)}°</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Yerüstü Hızı</Label>
                  <p className="text-lg font-semibold">{result.groundSpeed.toFixed(1)} knot</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Sürüklenme Açısı</Label>
                  <p className="text-lg font-semibold">{result.driftAngle.toFixed(1)}°</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tutulacak Rota</Label>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">CPA</Label>
                  <p className="text-lg font-semibold">{result.cpa.toFixed(2)} nm</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">TCPA</Label>
                  <p className="text-lg font-semibold">{result.tcpa.toFixed(1)} dakika</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Çarpışma Riski</Label>
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
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Önerilen Eylem</Label>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Mevcut Gelgit Yüksekliği</Label>
                  <p className="text-lg font-semibold">{result.currentTideHeight.toFixed(1)} m</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gelgit Farkı</Label>
                  <p className="text-lg font-semibold">{result.tideRange.toFixed(1)} m</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Yüksek Suya Kalan Süre</Label>
                  <p className="text-lg font-semibold">{result.timeToHW.toFixed(1)} saat</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Alçak Suya Kalan Süre</Label>
                  <p className="text-lg font-semibold">{result.timeToLW.toFixed(1)} saat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Gelişmiş Hesaplamalar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Spheroidal Mesafe</Label>
                  <p className="text-lg font-semibold text-info">{result.spheroidalDistance.toFixed(3)} nm</p>
                  <p className="text-xs text-muted-foreground">WGS84 elipsoidi</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Yakıt Maliyeti</Label>
                  <p className="text-lg font-semibold text-green-600">${result.totalFuelCost.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Tahmini maliyet</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Hava Gecikmesi</Label>
                  <p className="text-lg font-semibold text-orange-600">{result.alternateETA}</p>
                  <p className="text-xs text-muted-foreground">Hava koşulları ile</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Hava Durumu Analizi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium text-muted-foreground">Beaufort Skalası</Label>
                  <p className="text-xl lg:text-2xl font-bold text-info">{result.beaufortScale}</p>
                  <p className="text-xs text-muted-foreground">Rüzgar şiddeti</p>
                </div>
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium text-muted-foreground">Deniz Durumu</Label>
                  <p className="text-xl lg:text-2xl font-bold text-green-600">{result.seaState}</p>
                  <p className="text-xs text-muted-foreground">Douglas skalası</p>
                </div>
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium text-muted-foreground">Hava Gecikmesi</Label>
                  <p className="text-lg font-semibold">{result.weatherDelay.toFixed(1)} saat</p>
                </div>
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium text-muted-foreground">Güvenli Rota</Label>
                  <p className="text-lg font-semibold">{result.safeCourse.toFixed(1)}°</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Gelişmiş Gelgit Analizi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Spring/Neap Faktörü</Label>
                  <p className="text-lg font-semibold">{result.springNeapFactor.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gelgit Akımı Doğrultusu</Label>
                  <p className="text-lg font-semibold">{result.tidalStreamDirection.toFixed(1)}°</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gelgit Değişim Hızı</Label>
                  <p className="text-lg font-semibold">{result.tidalAcceleration.toFixed(2)} m/sa</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gelgit Akımı</Label>
                  <p className="text-lg font-semibold">{result.tidalStream.toFixed(1)} knot</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Anchor className="h-5 w-5" />
                Liman Yaklaşım Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pilot Alma Mesafesi</Label>
                  <p className="text-lg font-semibold">{result.pilotBoardingDistance.toFixed(1)} nm</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pilot Alma ETA</Label>
                  <p className="text-lg font-semibold">{result.pilotBoardingETA}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Güvenli Draf</Label>
                  <p className="text-lg font-semibold">{result.safeDraft.toFixed(1)} m</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Minimum Derinlik</Label>
                  <p className="text-lg font-semibold">{result.minimumDepth.toFixed(1)} m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.navigationStars && result.navigationStars.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Görünür Navigasyon Yıldızları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.navigationStars.slice(0, 6).map((star, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted rounded-lg space-y-1 sm:space-y-0">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{star.name}</p>
                        <p className="text-sm text-muted-foreground">Mag: {star.magnitude.toFixed(1)}</p>
                      </div>
                      <div className="flex flex-col text-right flex-shrink-0">
                        <p className="text-sm">Alt: {star.altitude.toFixed(1)}°</p>
                        <p className="text-sm">Az: {star.azimuth.toFixed(1)}°</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {result.planetPositions && result.planetPositions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Gezegen Konumları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.planetPositions.map((planet, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted rounded-lg space-y-1 sm:space-y-0">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{planet.name}</p>
                        <p className="text-sm text-muted-foreground">Mag: {planet.magnitude.toFixed(1)}</p>
                      </div>
                      <div className="flex flex-col text-right flex-shrink-0">
                        <p className="text-sm">Alt: {planet.altitude.toFixed(1)}°</p>
                        <p className="text-sm">Az: {planet.azimuth.toFixed(1)}°</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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

      {/* Seyir Asistanı */}
      <Card className="shadow border border-emerald-200/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <Brain className="h-5 w-5" />
            Seyir Asistanı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NavigationAssistantPopup variant="inline" calculationContext={activeCalculation} />
        </CardContent>
      </Card>

    </div>
  );

  function renderCalculationsContent() {
    const navigationTopicGroups: Array<{ title: string; icon: React.ComponentType<{ className?: string }>; accent: string; items: string[] }>
      = [
        {
          title: "1️⃣ Zaman – Mesafe – Hız Hesapları (Temel Seyir)",
          icon: Clock,
          accent: "border-blue-200 bg-blue-50 dark:bg-blue-950",
          items: [
            "Hız = Mesafe / Zaman; Mesafe = Hız × Zaman; Zaman = Mesafe / Hız",
            "Knot ↔ km/s ↔ m/s dönüşümleri",
            "ETA / ETD; kalan zaman & mesafe; ortalama hız",
            "SMG (Speed Made Good) ve DMG (Distance Made Good)",
            "Remaining time/distance ve rota optimizasyonu"
          ]
        },
        {
          title: "2️⃣ Rota ve Kerteriz (Plane Sailing & Coastal Navigation)",
          icon: MapPin,
          accent: "border-cyan-200 bg-cyan-50 dark:bg-cyan-950",
          items: [
            "Düzlem seyri: Departure (Dep), D.Lat, rota (true/magnetic/compass)",
            "Distance = Dep / cos Lat hesapları",
            "Ortalama enlem (Middle Latitude) seyri ve Mean Lat",
            "Departure = D × cos Mean Lat, Boylam farkı (D.Long)",
            "Kıyı rota planlaması, pilotaj detayları"
          ]
        },
        {
          title: "3️⃣ Enlem – Boylam Hesapları",
          icon: Globe,
          accent: "border-amber-200 bg-amber-50 dark:bg-amber-950",
          items: [
            "D.Lat ve D.Long (Kuzey/Güney, Doğu/Batı)",
            "1° enlem = 60 NM ilişkisi",
            "Boylam → NM dönüşümü (cos φ)",
            "Enlem–boylamdan mevki bulma",
            "İki nokta arası mesafe (plane / mid-lat)"
          ]
        },
        {
          title: "4️⃣ Harita Üzerinde Yapılan Hesaplamalar",
          icon: Navigation,
          accent: "border-lime-200 bg-lime-50 dark:bg-lime-950",
          items: [
            "Ölçekten mesafe ölçümü, pergelle mesafe hesapları",
            "Paralel cetvel ile rota çizimi ve gerçek rota (True Course)",
            "Harita üzeri mesafe → zaman dönüşümü",
            "Chart correction sonrası rota kontrolü",
            "Pilot kartları ve görsel referanslarla doğrulama"
          ]
        },
        {
          title: "5️⃣ Manyetik ve Pusula Düzeltmeleri",
          icon: Compass,
          accent: "border-rose-200 bg-rose-50 dark:bg-rose-950",
          items: [
            "Variation (manyetik sapma) ve Deviation (pusula sapması)",
            "True → Magnetic → Compass dönüşümleri; TVMDC",
            "Compass Error = Variation + Deviation",
            "Doğu (+) / Batı (–) işaret kuralları",
            "Pusula kalibrasyonu ve kontrol listeleri"
          ]
        },
        {
          title: "6️⃣ Akıntı ve Rüzgâr Düzeltmeli Seyir (Current & Wind)",
          icon: Wind,
          accent: "border-indigo-200 bg-indigo-50 dark:bg-indigo-950",
          items: [
            "Set (akıntı yönü) ve Drift (akıntı hızı)",
            "Course to Steer (CTS) ve Speed over Ground (SOG)",
            "Leeway açısı ve rüzgâr etkisi",
            "Vector triangle (akıntı üçgeni)",
            "Akıntı etkisiyle ETA düzeltmesi"
          ]
        },
        {
          title: "7️⃣ Kerteriz Hesapları (Fixing Position)",
          icon: Eye,
          accent: "border-sky-200 bg-sky-50 dark:bg-sky-950",
          items: [
            "Tek/iki/üç kerterizle mevki",
            "Relative bearing → True bearing dönüşümü",
            "Leading line (Transit) kullanımı",
            "Running Fix (taşınmış kerteriz)",
            "EP (Estimated Position) ve DR (Dead Reckoning)"
          ]
        },
        {
          title: "8️⃣ Radar Seyri ve Radar Hesapları",
          icon: Radar,
          accent: "border-slate-200 bg-slate-50 dark:bg-slate-950",
          items: [
            "Radar mesafe ve kerteriz ölçümü (Relative/True)",
            "CPA ve TCPA analizleri",
            "Relative motion / True motion kıyasları",
            "Radar plotting (manual plot)",
            "Hedef hız/rota hesapları ve kaçınma"
          ]
        },
        {
          title: "9️⃣ COLREG Bağlantılı Seyir Hesapları",
          icon: Ship,
          accent: "border-orange-200 bg-orange-50 dark:bg-orange-950",
          items: [
            "Karşılaşma durumu tespiti ve çatışma riski",
            "CPA/TCPA sonrası manevra değerlendirmesi",
            "Manevra sonrası yeni CPA/TCPA hesapları",
            "Relative movement analizi",
            "Görüş koşullarına göre güvenli rota"
          ]
        },
        {
          title: "🔟 Great Circle & Rhumb Line Hesapları",
          icon: Globe,
          accent: "border-emerald-200 bg-emerald-50 dark:bg-emerald-950",
          items: [
            "Rhumb Line (Mercator Sailing) sabit rota hesapları",
            "D.Lat & D.Long kullanımı, Meridional Parts",
            "Great Circle: initial/final course, vertex latitude",
            "Great Circle distance ve composite çözümler",
            "Great Circle vs Rhumb Line mesafe farkı"
          ]
        },
        {
          title: "1️⃣1️⃣ Gelgit (Tides) Hesapları",
          icon: Waves,
          accent: "border-cyan-200 bg-cyan-50 dark:bg-cyan-950",
          items: [
            "HW/LW zamanı ve Height of Tide",
            "Rule of Twelfths uygulamaları",
            "Secondary port düzeltmeleri",
            "Neap/Spring tide farkları",
            "UKC, squat + tide + draft hesapları"
          ]
        },
        {
          title: "1️⃣2️⃣ Seyir Emniyeti Hesapları",
          icon: Anchor,
          accent: "border-fuchsia-200 bg-fuchsia-50 dark:bg-fuchsia-950",
          items: [
            "UKC ve squat hesapları",
            "Safe speed ve safe passing distance",
            "Wheel-over point (WOP) belirleme",
            "Turning circle: advance & transfer",
            "Cayma (abort) ve emniyet limitleri"
          ]
        },
        {
          title: "1️⃣3️⃣ Passage Plan Hesapları",
          icon: Navigation,
          accent: "border-green-200 bg-green-50 dark:bg-green-950",
          items: [
            "Toplam rota mesafesi ve leg bazlı ETA",
            "Wheel-over positions ve no-go area belirleme",
            "UKC kontrol noktaları ve TSS geçişleri",
            "Abort point / safe haven mesafeleri",
            "Yedek rota ve kontroller"
          ]
        },
        {
          title: "1️⃣4️⃣ Astronomik Seyir",
          icon: Sun,
          accent: "border-purple-200 bg-purple-50 dark:bg-purple-950",
          items: [
            "GHA / LHA ve declination hesapları",
            "Sextant correction (IC, Dip, Refraction)",
            "Altitude correction ve LOP (Line of Position)",
            "Noon sight → Latitude; sun/star fix",
            "Örnek: Güneş/yıldız gözlemleri ile mevki"
          ]
        },
        {
          title: "1️⃣5️⃣ Elektronik Seyir Sistemleri (ECDIS Bağlantılı)",
          icon: Target,
          accent: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950",
          items: [
            "Cross Track Distance (XTD) takibi",
            "Safety contour ve safety depth parametreleri",
            "Look-ahead time ve alarm yönetimi",
            "Route check hesapları ve doğrulama",
            "ECDIS entegrasyonu ile veri bütünlüğü"
          ]
        }
      ];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Seyir Hesaplamaları Menüsü
            </CardTitle>
            <CardDescription>
              Seyir hesaplamaları için kapsamlı hesaplama türleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {navigationTopicGroups.map((group, index) => (
                <Card key={index} className={`h-full ${group.accent}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <group.icon className="h-5 w-5" />
                      {group.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {group.items.map((item, itemIndex) => (
                        <li key={itemIndex}>• {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Hesaplama Türleri Seçimi */}
            <Card className="mt-6 border-green-200 bg-green-50 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  🎯 Hesaplama Türü Seçimi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-card rounded-lg border border-primary/30">
                    <h4 className="font-semibold text-primary mb-2">Düzlem Seyri</h4>
                    <p className="text-sm text-muted-foreground">
                      Harita üzerinde rota, mesafe, zaman hesaplamaları
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-card rounded-lg border border-accent/30">
                    <h4 className="font-semibold text-accent mb-2">Göksel Seyri</h4>
                    <p className="text-sm text-muted-foreground">
                      Güneş, ay, yıldız gözlemleri ile konum tespiti
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-card rounded-lg border border-success/30">
                    <h4 className="font-semibold text-success mb-2">Kombine</h4>
                    <p className="text-sm text-muted-foreground">
                      Düzlem ve göksel seyir kombinasyonu
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <div className="mt-6">
          <Button onClick={calculate} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Hesapla
          </Button>
        </div>
      </div>
    );
  }
};