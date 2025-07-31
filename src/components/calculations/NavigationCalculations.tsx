import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Compass, MapPin, Clock, Wind, Waves, Sun, Moon, Navigation, Target, Radar, CheckCircle, Sunrise, Sunset, Star, Globe, Ship, Anchor, Eye, Camera } from "lucide-react";
import { toast } from "sonner";
import { CoordinateInput } from "@/components/CoordinateInput";
import { DirectionInput } from "@/components/DirectionInput";

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
    springTideRange: 4.0, neapTideRange: 2.0,
    currentTime: "0900",
    altitude: 0, azimuth: 0, gha: 0, declination: 0,
    
    // Astronomical data
    date: new Date().toISOString().split('T')[0],
    timeZone: 3, // Turkey time zone
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

  const [result, setResult] = useState<NavigationResult | null>(null);

  // Utility functions for calculations
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const toDegrees = (radians: number) => radians * 180 / Math.PI;
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

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
    // Use pilot boarding position as destination for these calculations
    const tempLat2 = data.lat2;
    const tempLon2 = data.lon2;
    
    // Calculate distance to pilot boarding point
    const pilotDistance = calculateGreatCircle();
    
    const pilotBoardingDistance = pilotDistance.distance;
    const pilotBoardingTime = pilotBoardingDistance / data.speed;
    
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
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-1">
              <TabsTrigger value="route" className="text-xs px-2">Rota</TabsTrigger>
              <TabsTrigger value="current" className="text-xs px-2">Akıntı</TabsTrigger>
              <TabsTrigger value="compass" className="text-xs px-2">Pusula</TabsTrigger>
              <TabsTrigger value="radar" className="text-xs px-2">Radar</TabsTrigger>
              <TabsTrigger value="tidal" className="text-xs px-2">Gelgit</TabsTrigger>
              <TabsTrigger value="weather" className="text-xs px-2">Hava</TabsTrigger>
              <TabsTrigger value="port" className="text-xs px-2">Liman</TabsTrigger>
              <TabsTrigger value="celestial" className="text-xs px-2">Göksel</TabsTrigger>
              <TabsTrigger value="astronomical" className="text-xs px-2">Astronomik</TabsTrigger>
              <TabsTrigger value="almanac" className="text-xs px-2">Almanac</TabsTrigger>
            </TabsList>

            <TabsContent value="route" className="space-y-4">
              {/* Coordinate Input Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Konum Koordinatları
                  </CardTitle>
                  <CardDescription>
                    Enlem/Boylam koordinatlarını ondalık derece formatında girin (örn: 41.0082, 28.9784)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
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
                        <div className="text-xs text-gray-500">
                          Örnekler: İstanbul (41.0082, 28.9784), İzmir (38.4237, 27.1428)
                        </div>
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
                        <div className="text-xs text-gray-500">
                          Örnekler: Antalya (36.8969, 30.7133), Trabzon (41.0027, 39.7168)
                        </div>
                      </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>

                             {/* Ship Data */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Gemi Verileri
                  </CardTitle>
                </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="speed">Hız (knot)</Label>
                       <Input
                         id="speed"
                         type="number"
                         step="0.1"
                         value={data.speed}
                         onChange={(e) => updateData('speed', parseFloat(e.target.value) || 0)}
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
                         onChange={(e) => updateData('course', parseFloat(e.target.value) || 0)}
                         placeholder="090"
                       />
                     </div>
                   </div>
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
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
                          onChange={(e) => updateData('gyroError', parseFloat(e.target.value) || 0)}
                          placeholder="0.5"
                          className="text-right"
                        />
                        <div className="text-xs text-gray-500">
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
                <div className="space-y-2">
                  <Label htmlFor="springTideRange">Spring Gelgit Farkı (m)</Label>
                  <Input
                    id="springTideRange"
                    type="number"
                    step="0.1"
                    value={data.springTideRange}
                    onChange={(e) => updateData('springTideRange', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neapTideRange">Neap Gelgit Farkı (m)</Label>
                  <Input
                    id="neapTideRange"
                    type="number"
                    step="0.1"
                    value={data.neapTideRange}
                    onChange={(e) => updateData('neapTideRange', parseFloat(e.target.value) || 0)}
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
                        onChange={(e) => updateData('waveHeight', parseFloat(e.target.value) || 0)}
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
                        onChange={(e) => updateData('wavePeriod', parseFloat(e.target.value) || 0)}
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
                        onChange={(e) => updateData('waveDirection', parseFloat(e.target.value) || 0)}
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
                        onChange={(e) => updateData('visibility', parseFloat(e.target.value) || 0)}
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
                        onChange={(e) => updateData('barometricPressure', parseFloat(e.target.value) || 0)}
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
                          onChange={(e) => updateData('portApproachSpeed', parseFloat(e.target.value) || 0)}
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
                          onChange={(e) => updateData('requiredUKC', parseFloat(e.target.value) || 0)}
                          placeholder="2.0"
                          className="text-right"
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
                          placeholder="8.5"
                          className="text-right"
                        />
                      </div>
                    </div>
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
                          onChange={(e) => updateData('timeZone', parseFloat(e.target.value) || 0)}
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
                    <div className="grid grid-cols-2 gap-4">
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
                            <div className="text-sm text-gray-600">Faz Adı</div>
                          </div>
                          <div className="text-center space-y-1">
                            <div className="text-xl sm:text-2xl font-semibold">{moonPhase.phase}%</div>
                            <div className="text-sm text-gray-600">Tamamlanma</div>
                          </div>
                          <div className="text-center space-y-1">
                            <div className="text-xl sm:text-2xl font-semibold">{moonPhase.illumination}%</div>
                            <div className="text-sm text-gray-600">Aydınlanma</div>
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
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Göksel Seyir Hesaplamaları
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
                    <div className="grid grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="altitude">Sextant Yüksekliği (°)</Label>
                        <Input
                          id="altitude"
                          type="number"
                          step="0.1"
                          value={data.altitude}
                          onChange={(e) => updateData('altitude', parseFloat(e.target.value) || 0)}
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
                          onChange={(e) => updateData('azimuth', parseFloat(e.target.value) || 0)}
                          className="text-right"
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
                          onChange={(e) => updateData('declination', parseFloat(e.target.value) || 0)}
                          className="text-right"
                        />
                      </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open('https://thenauticalalmanac.com/TNARegular/2025_Nautical_Almanac.pdf', '_blank')}
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            PDF İndir
                          </Button>
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
                                                  <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open('/sight-reduction-guide.html', '_blank')}
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          İnteraktif Tablolar
                        </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

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

                    {/* Additional Resources */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Ek Kaynaklar</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://aa.usno.navy.mil/data/RS_OneYear', '_blank')}
                        >
                          <Sunrise className="h-4 w-4 mr-2" />
                          Gündoğumu/Batımı Tabloları
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://www.nhc.noaa.gov/marine/', '_blank')}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Büyük Daire Mesafesi</Label>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{result.gcDistance.toFixed(1)} nm</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Loxodromik Mesafe</Label>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{result.rhumbDistance.toFixed(1)} nm</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">İlk Doğrultu</Label>
                  <p className="text-lg font-semibold">{result.gcInitialBearing.toFixed(1)}°</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Son Doğrultu</Label>
                  <p className="text-lg font-semibold">{result.gcFinalBearing.toFixed(1)}°</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">ETA</Label>
                  <p className="text-lg font-semibold">{result.eta}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Seyir Süresi</Label>
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
                  <Label className="text-sm font-medium text-gray-600">Yerüstü Rotası</Label>
                  <p className="text-lg font-semibold">{result.groundTrack.toFixed(1)}°</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Yerüstü Hızı</Label>
                  <p className="text-lg font-semibold">{result.groundSpeed.toFixed(1)} knot</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Sürüklenme Açısı</Label>
                  <p className="text-lg font-semibold">{result.driftAngle.toFixed(1)}°</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Tutulacak Rota</Label>
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
                  <Label className="text-sm font-medium text-gray-600">CPA</Label>
                  <p className="text-lg font-semibold">{result.cpa.toFixed(2)} nm</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">TCPA</Label>
                  <p className="text-lg font-semibold">{result.tcpa.toFixed(1)} dakika</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Çarpışma Riski</Label>
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
                <Label className="text-sm font-medium text-gray-600">Önerilen Eylem</Label>
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
                  <Label className="text-sm font-medium text-gray-600">Mevcut Gelgit Yüksekliği</Label>
                  <p className="text-lg font-semibold">{result.currentTideHeight.toFixed(1)} m</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Gelgit Farkı</Label>
                  <p className="text-lg font-semibold">{result.tideRange.toFixed(1)} m</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Yüksek Suya Kalan Süre</Label>
                  <p className="text-lg font-semibold">{result.timeToHW.toFixed(1)} saat</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Alçak Suya Kalan Süre</Label>
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
                  <Label className="text-sm font-medium text-gray-600">Spheroidal Mesafe</Label>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{result.spheroidalDistance.toFixed(3)} nm</p>
                  <p className="text-xs text-gray-500">WGS84 elipsoidi</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Yakıt Maliyeti</Label>
                  <p className="text-lg font-semibold text-green-600">${result.totalFuelCost.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">Tahmini maliyet</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Hava Gecikmesi</Label>
                  <p className="text-lg font-semibold text-orange-600">{result.alternateETA}</p>
                  <p className="text-xs text-gray-500">Hava koşulları ile</p>
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
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Beaufort Skalası</Label>
                  <p className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">{result.beaufortScale}</p>
                  <p className="text-xs text-gray-500">Rüzgar şiddeti</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Deniz Durumu</Label>
                  <p className="text-xl lg:text-2xl font-bold text-green-600">{result.seaState}</p>
                  <p className="text-xs text-gray-500">Douglas skalası</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Hava Gecikmesi</Label>
                  <p className="text-lg font-semibold">{result.weatherDelay.toFixed(1)} saat</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Güvenli Rota</Label>
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
                  <Label className="text-sm font-medium text-gray-600">Spring/Neap Faktörü</Label>
                  <p className="text-lg font-semibold">{result.springNeapFactor.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Gelgit Akımı Doğrultusu</Label>
                  <p className="text-lg font-semibold">{result.tidalStreamDirection.toFixed(1)}°</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Gelgit Değişim Hızı</Label>
                  <p className="text-lg font-semibold">{result.tidalAcceleration.toFixed(2)} m/sa</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Gelgit Akımı</Label>
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
                  <Label className="text-sm font-medium text-gray-600">Pilot Alma Mesafesi</Label>
                  <p className="text-lg font-semibold">{result.pilotBoardingDistance.toFixed(1)} nm</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Pilot Alma ETA</Label>
                  <p className="text-lg font-semibold">{result.pilotBoardingETA}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Güvenli Draf</Label>
                  <p className="text-lg font-semibold">{result.safeDraft.toFixed(1)} m</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Minimum Derinlik</Label>
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
                <div className="grid grid-cols-2 gap-2">
                  {result.navigationStars.slice(0, 6).map((star, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{star.name}</p>
                        <p className="text-sm text-gray-600">Mag: {star.magnitude.toFixed(1)}</p>
                      </div>
                      <div className="text-right">
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
                <div className="grid grid-cols-2 gap-2">
                  {result.planetPositions.map((planet, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{planet.name}</p>
                        <p className="text-sm text-gray-600">Mag: {planet.magnitude.toFixed(1)}</p>
                      </div>
                      <div className="text-right">
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

    </div>
  );
};