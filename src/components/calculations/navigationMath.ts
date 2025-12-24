// Core navigation calculation utilities extracted from assistant components.
// Keep these functions pure and UI-agnostic so multiple UIs can reuse them.

import { getSunAriesAlmanac2025Utc } from "@/utils/nauticalAlmanac2025";

export type CurrentTriangleInput = {
  courseDeg: number; // Intended track/course over ground to maintain (degrees)
  speedKn: number;   // Ship speed through water (knots)
  setDeg: number;    // Current direction towards which it flows (degrees)
  driftKn: number;   // Current rate (knots)
  leewayDeg?: number; // Optional leeway correction (degrees)
};

export type CurrentTriangleResult = {
  courseToSteerDeg: number; // Heading to steer to make good the intended track
  madeGoodCourseDeg: number; // Resulting course made good (should equal intended if solvable)
  groundSpeedKn: number; // Speed made good over ground
  driftAngleDeg: number; // Difference between CMG and original intended course
  feasible: boolean;     // Whether track is attainable given ship speed vs current
};

export type ARPAInput = {
  targetBearingDeg: number; // Relative bearing of target from own ship (deg)
  targetDistanceNm: number; // Range to target (nm)
  targetCourseDeg: number;  // Target course (deg)
  targetSpeedKn: number;    // Target speed (kn)
  ownCourseDeg?: number;    // Own ship course (deg) (optional)
  ownSpeedKn?: number;      // Own ship speed (kn) (optional)
};

export type ARPAResult = {
  cpaNm: number;      // Closest Point of Approach distance (nm)
  tcpaMin: number;    // Time to CPA (minutes)
  relativeSpeedKn: number; // Relative speed magnitude (kn)
  relativeBearingDeg: number; // Bearing of relative motion vector (deg)
};

export type PlaneSailingInput = {
  lat1Deg: number;
  lon1Deg: number;
  lat2Deg: number;
  lon2Deg: number;
};

export type PlaneSailingResult = {
  dLatMin: number;    // Difference of latitude in minutes
  depMin: number;     // Departure in minutes
  courseDeg: number;  // Course angle
  distanceNm: number; // Distance in nautical miles
};

export type SightReductionInput = {
  latDeg: number;     // Observer latitude
  decDeg: number;     // Celestial body declination
  lhaDeg: number;     // Local hour angle
};

export type SightReductionResult = {
  hcDeg: number;      // Calculated altitude
  azimuthDeg: number; // Azimuth
};

export type BearingCalculationInput = {
  initialBearingDeg: number;
  runNm: number;      // Distance run
  bearingFactor: number; // 2 for doubling angle, etc.
};

export type BearingCalculationResult = {
  distanceOffNm: number;
};

export type TideInput = {
  hour: number;        // Hour from LW/HW boundary (1..6)
  tidalRangeM: number; // Tidal range in meters
  phase?: 'rising' | 'falling'; // Optional: default rising
};

export type TideResult = {
  heightM: number;        // Tidal height change from the boundary (m)
  fractionOfRange: number; // Fraction of total range completed (0..1)
};

export type DistanceCalculationInput = {
  heightM: number;    // Height of eye or object in meters
  type: 'dip' | 'radar' | 'light';
  lightHeightM?: number; // For light visibility
};

export type DistanceCalculationResult = {
  distanceNm: number;
};

export type TurningCalculationInput = {
  shipLengthM: number;
  courseChangeDeg: number;
  speedKn: number;
};

export type TurningCalculationResult = {
  tacticalDiameterM: number;
  advanceM: number;
  transferM: number;
  rotDegPerMin: number;
  wheelOverPointM: number;
};

export type WeatherCalculationInput = {
  beaufortNumber?: number;
  windSpeedKn?: number;
  windAreaM2?: number;
  shipSpeedKn?: number;
};

export type WeatherCalculationResult = {
  windSpeedKn?: number;
  waveHeightM?: number;
  leewayAngleDeg?: number;
  windForceN?: number;
};

export type CelestialInput = {
  latDeg: number;
  decDeg: number;
  type: 'meridian' | 'amplitude' | 'sunrise';
};

export type CelestialResult = {
  latitudeDeg?: number;
  amplitudeDeg?: number;
  bearingDeg?: number;
};

export type EmergencyInput = {
  searchType: 'square' | 'sector';
  trackSpacingNm?: number;
  initialRadiusNm?: number;
  driftSpeedKn?: number;
  rescueSpeedKn?: number;
  distanceNm?: number;
};

export type EmergencyResult = {
  legDistanceNm?: number;
  newRadiusNm?: number;
  timeToRescueHours?: number;
  vhfRangeNm?: number;
};

const toRadians = (deg: number) => (deg * Math.PI) / 180;
const toDegrees = (rad: number) => (rad * 180) / Math.PI;
const normalizeAngle = (deg: number) => {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
};

export function calculateEtaHours(distanceNm: number, speedKn: number): number {
  if (!isFinite(distanceNm) || !isFinite(speedKn) || speedKn <= 0) {
    throw new Error("Invalid distance or speed for ETA calculation");
  }
  return distanceNm / speedKn;
}

export function calculateCompassTotalError(
  variationDeg: number = 0,
  deviationDeg: number = 0,
  gyroErrorDeg: number = 0
): { totalErrorDeg: number } {
  // Compass error calculation: Ct = Cc + Var + Dev
  // East is positive (+), West is negative (-)
  // The function assumes input values already have correct signs
  const totalErrorDeg = (variationDeg || 0) + (deviationDeg || 0) + (gyroErrorDeg || 0);
  return { totalErrorDeg };
}

export function solveCurrentTriangle(input: CurrentTriangleInput): CurrentTriangleResult {
  const { courseDeg, speedKn, setDeg, driftKn } = input;
  const leewayDeg = input.leewayDeg ?? 0;

  if (!(isFinite(courseDeg) && isFinite(speedKn) && isFinite(setDeg) && isFinite(driftKn))) {
    throw new Error("Invalid inputs for current triangle");
  }
  if (speedKn <= 0) {
    throw new Error("Ship speed must be > 0");
  }

  const desiredDeg = normalizeAngle(courseDeg);
  const desiredRad = toRadians(desiredDeg);

  const Cx = driftKn * Math.sin(toRadians(setDeg));
  const Cy = driftKn * Math.cos(toRadians(setDeg));

  // Solve sin(h - D) = (Cy*sinD - Cx*cosD) / V
  const sinD = Math.sin(desiredRad);
  const cosD = Math.cos(desiredRad);
  const rhs = (Cy * sinD - Cx * cosD) / speedKn; // = drift*sin(D - set)/V

  const feasible = Math.abs(rhs) <= 1;
  const clamped = Math.max(-1, Math.min(1, rhs));
  const headingRad = desiredRad + Math.asin(clamped);
  const headingDeg = normalizeAngle(toDegrees(headingRad) + leewayDeg);

  // Ground speed along desired track
  const dirX = Math.sin(desiredRad);
  const dirY = Math.cos(desiredRad);
  const vShipX = speedKn * Math.sin(toRadians(headingDeg));
  const vShipY = speedKn * Math.cos(toRadians(headingDeg));
  const groundX = vShipX + Cx;
  const groundY = vShipY + Cy;
  const groundSpeed = groundX * dirX + groundY * dirY; // projection on desired

  const madeGoodCourseDeg = normalizeAngle(toDegrees(Math.atan2(groundX, groundY)));
  const driftAngleDeg = normalizeAngle(madeGoodCourseDeg - courseDeg);

  return {
    courseToSteerDeg: headingDeg,
    madeGoodCourseDeg,
    groundSpeedKn: groundSpeed,
    driftAngleDeg,
    feasible,
  };
}

export function computeArpaCpaTcpa(input: ARPAInput): ARPAResult {
  const {
    targetBearingDeg,
    targetDistanceNm,
    targetCourseDeg,
    targetSpeedKn,
    ownCourseDeg = 0,
    ownSpeedKn = 0,
  } = input;

  if (!isFinite(targetBearingDeg) || !isFinite(targetDistanceNm) || targetDistanceNm < 0) {
    throw new Error("Invalid target bearing or distance");
  }
  if (!isFinite(targetCourseDeg) || !isFinite(targetSpeedKn) || targetSpeedKn < 0) {
    throw new Error("Invalid target course or speed");
  }

  // Initial relative position R0 in nm (X east, Y north)
  const R0x = targetDistanceNm * Math.sin(toRadians(targetBearingDeg));
  const R0y = targetDistanceNm * Math.cos(toRadians(targetBearingDeg));

  // Velocities in kn (nm/h)
  const Vtx = targetSpeedKn * Math.sin(toRadians(targetCourseDeg));
  const Vty = targetSpeedKn * Math.cos(toRadians(targetCourseDeg));
  const Vox = ownSpeedKn * Math.sin(toRadians(ownCourseDeg));
  const Voy = ownSpeedKn * Math.cos(toRadians(ownCourseDeg));

  const Vrx = Vtx - Vox;
  const Vry = Vty - Voy;
  const Vr2 = Vrx * Vrx + Vry * Vry;
  const relativeSpeedKn = Math.sqrt(Vr2);
  const relativeBearingDeg = normalizeAngle(toDegrees(Math.atan2(Vrx, Vry)));

  let tcpaHours = 0;
  if (Vr2 > 1e-9) {
    tcpaHours = -((R0x * Vrx + R0y * Vry) / Vr2);
  } else {
    tcpaHours = 0; // Near zero relative speed
  }
  if (tcpaHours < 0) tcpaHours = 0; // CPA in the past -> use now

  const cpaX = R0x + Vrx * tcpaHours;
  const cpaY = R0y + Vry * tcpaHours;
  const cpaNm = Math.sqrt(cpaX * cpaX + cpaY * cpaY);
  const tcpaMin = tcpaHours * 60;

  return { cpaNm, tcpaMin, relativeSpeedKn, relativeBearingDeg };
}

// Great Circle calculations (comprehensive version with arrival bearing and vertex)
export function calculateGreatCircle(lat1Deg: number, lon1Deg: number, lat2Deg: number, lon2Deg: number) {
  // Input validation
  if (!isFinite(lat1Deg) || !isFinite(lon1Deg) || !isFinite(lat2Deg) || !isFinite(lon2Deg)) {
    throw new Error("Geçersiz koordinatlar");
  }
  if (Math.abs(lat1Deg) > 90 || Math.abs(lat2Deg) > 90) {
    throw new Error("Enlem -90° ile +90° arasında olmalıdır");
  }
  if (Math.abs(lon1Deg) > 180 || Math.abs(lon2Deg) > 180) {
    throw new Error("Boylam -180° ile +180° arasında olmalıdır");
  }

  const R = 3440.065; // nautical miles (Earth radius)
  const lat1Rad = toRadians(lat1Deg);
  const lat2Rad = toRadians(lat2Deg);
  const deltaLatRad = toRadians(lat2Deg - lat1Deg);
  const deltaLonRad = toRadians(lon2Deg - lon1Deg);

  // Haversine formula for distance
  const a = Math.sin(deltaLatRad/2) * Math.sin(deltaLatRad/2) + 
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
            Math.sin(deltaLonRad/2) * Math.sin(deltaLonRad/2);
  const c = 2 * Math.asin(Math.sqrt(a));
  const distance = R * c;

  // Initial bearing (forward azimuth)
  const y = Math.sin(deltaLonRad) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLonRad);
  const initialCourse = normalizeAngle(toDegrees(Math.atan2(y, x)));

  // Final bearing (arrival/back azimuth)
  const y2 = Math.sin(-deltaLonRad) * Math.cos(lat1Rad);
  const x2 = Math.cos(lat2Rad) * Math.sin(lat1Rad) - 
             Math.sin(lat2Rad) * Math.cos(lat1Rad) * Math.cos(-deltaLonRad);
  const finalCourse = normalizeAngle(toDegrees(Math.atan2(y2, x2)));

  // Vertex (maximum latitude point on great circle)
  let vertexLat = 0;
  let hasVertex = false;
  
  // Vertex only exists if initial course is not due N/S (between 0-180°)
  if (initialCourse > 0 && initialCourse < 180) {
    const sinVertexLat = Math.cos(lat1Rad) * Math.sin(toRadians(initialCourse));
    if (Math.abs(sinVertexLat) <= 1) {
      vertexLat = toDegrees(Math.asin(sinVertexLat));
      hasVertex = true;
    }
  }

  return { 
    distance, 
    initialCourse, 
    finalCourse,
    vertexLat: hasVertex ? vertexLat : null,
    distanceDeg: toDegrees(c) // Distance in degrees for reference
  };
}

export type GreatCircleWaypointInput = {
  start: LatLon;
  end: LatLon;
  // Either specify a fixed number of segments, or a step distance.
  segments?: number; // e.g. 10 => 11 points including endpoints
  stepNm?: number; // e.g. 60 => approximately 1° arc steps
};

export function generateGreatCircleWaypoints(input: GreatCircleWaypointInput): LatLon[] {
  const { start, end } = input;
  if (!isFinite(start.latDeg) || !isFinite(start.lonDeg) || !isFinite(end.latDeg) || !isFinite(end.lonDeg)) {
    throw new Error("Invalid waypoint coordinates");
  }
  const dist = calculateGreatCircle(start.latDeg, start.lonDeg, end.latDeg, end.lonDeg).distance;
  const seg = input.segments && input.segments > 0 ? Math.floor(input.segments) : input.stepNm && input.stepNm > 0 ? Math.max(1, Math.round(dist / input.stepNm)) : 10;

  const lat1 = toRadians(start.latDeg);
  const lon1 = toRadians(start.lonDeg);
  const lat2 = toRadians(end.latDeg);
  const lon2 = toRadians(end.lonDeg);

  // Convert to unit vectors.
  const v1 = {
    x: Math.cos(lat1) * Math.cos(lon1),
    y: Math.cos(lat1) * Math.sin(lon1),
    z: Math.sin(lat1),
  };
  const v2 = {
    x: Math.cos(lat2) * Math.cos(lon2),
    y: Math.cos(lat2) * Math.sin(lon2),
    z: Math.sin(lat2),
  };
  const dot = Math.max(-1, Math.min(1, v1.x * v2.x + v1.y * v2.y + v1.z * v2.z));
  const omega = Math.acos(dot);
  if (!isFinite(omega) || omega < 1e-12) return [start, end];

  const waypoints: LatLon[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const so = Math.sin(omega);
    const k1 = Math.sin((1 - t) * omega) / so;
    const k2 = Math.sin(t * omega) / so;
    const x = k1 * v1.x + k2 * v2.x;
    const y = k1 * v1.y + k2 * v2.y;
    const z = k1 * v1.z + k2 * v2.z;
    const lat = Math.atan2(z, Math.hypot(x, y));
    const lon = Math.atan2(y, x);
    waypoints.push({ latDeg: toDegrees(lat), lonDeg: toDegrees(lon) });
  }
  return waypoints;
}

// Rhumb Line calculations (matching formula exactly)
export function calculateRhumbLine(lat1Deg: number, lon1Deg: number, lat2Deg: number, lon2Deg: number) {
  const lat1Rad = toRadians(lat1Deg);
  const lat2Rad = toRadians(lat2Deg);
  const deltaLatRad = lat2Rad - lat1Rad;
  let deltaLonRad = toRadians(lon2Deg - lon1Deg);

  if (Math.abs(deltaLonRad) > Math.PI) {
    deltaLonRad = deltaLonRad > 0 ? -(2*Math.PI-deltaLonRad) : (2*Math.PI+deltaLonRad);
  }

  // Use the standard Mercator formula with robust handling of Δφ≈0 cases.
  // Δψ = ln( tan(π/4+φ₂/2) / tan(π/4+φ₁/2) )
  const deltaPsi = Math.log(Math.tan(Math.PI / 4 + lat2Rad / 2) / Math.tan(Math.PI / 4 + lat1Rad / 2));
  const q = Math.abs(deltaPsi) > 1e-12 ? deltaLatRad / deltaPsi : Math.cos(lat1Rad);

  const distance = 60 * Math.sqrt(Math.pow(toDegrees(deltaLatRad), 2) + Math.pow(q * toDegrees(deltaLonRad), 2));
  const course = normalizeAngle(toDegrees(Math.atan2(deltaLonRad, deltaPsi)));

  return { distance, course };
}

// Plane Sailing calculations
export function calculatePlaneSailing(input: PlaneSailingInput): PlaneSailingResult {
  const { lat1Deg, lon1Deg, lat2Deg, lon2Deg } = input;
  
  const dLatMin = 60 * (lat2Deg - lat1Deg);
  const meanLatRad = toRadians((lat1Deg + lat2Deg) / 2);
  const depMin = 60 * (lon2Deg - lon1Deg) * Math.cos(meanLatRad);
  
  const courseDeg = normalizeAngle(toDegrees(Math.atan2(depMin, dLatMin)));
  const distanceNm = Math.sqrt(dLatMin * dLatMin + depMin * depMin);

  return { dLatMin, depMin, courseDeg, distanceNm };
}

// Sight Reduction calculations
export function calculateSightReduction(input: SightReductionInput): SightReductionResult {
  const { latDeg, decDeg, lhaDeg } = input;
  
  const latRad = toRadians(latDeg);
  const decRad = toRadians(decDeg);
  const lhaRad = toRadians(lhaDeg);

  const sinHc = Math.sin(latRad) * Math.sin(decRad) + 
                Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad);
  const hcDeg = toDegrees(Math.asin(sinHc));

  const cosZ = (Math.sin(decRad) - Math.sin(latRad) * Math.sin(toRadians(hcDeg))) / 
               (Math.cos(latRad) * Math.cos(toRadians(hcDeg)));
  const azimuthDeg = normalizeAngle(toDegrees(Math.acos(Math.max(-1, Math.min(1, cosZ)))));

  return { hcDeg, azimuthDeg };
}

// Bearing calculations - Doubling the angle on bow
export function calculateDoublingAngle(initialAngleDeg: number, runNm: number): BearingCalculationResult {
  const finalAngleDeg = 2 * initialAngleDeg;
  const distanceOffNm = runNm * Math.sin(toRadians(2 * initialAngleDeg)) / Math.sin(toRadians(finalAngleDeg));
  return { distanceOffNm };
}

// Four point bearing (45° to 90° / Bow and Beam bearing)
export function calculateFourPointBearing(runNm: number): BearingCalculationResult {
  // From 45° (4 points) to 90° (8 points/abeam): distance off abeam = run
  const distanceOffNm = runNm;
  return { distanceOffNm };
}

// Special angle bearing (22.5° to 45°)
export function calculateSevenPointBearing(runNm: number): BearingCalculationResult {
  // From 22.5° (2 points) to 45° (4 points): distance = run * cos(22.5°) or approximately 0.707 * run
  // Trigonometric: Using sine rule, distance off ≈ 0.707 * run
  const distanceOffNm = runNm * 0.707;
  return { distanceOffNm };
}

// Distance calculations
export function calculateDistance(input: DistanceCalculationInput): DistanceCalculationResult {
  const { heightM, type, lightHeightM } = input;
  
  let distanceNm = 0;
  
  switch (type) {
    case 'dip':
      // Geographic range / distance to the horizon (nm), h in meters
      distanceNm = 2.08 * Math.sqrt(heightM);
      break;
    case 'radar':
      // Radar/VHF horizon with refraction allowance (nm), h in meters
      distanceNm = 2.23 * Math.sqrt(heightM);
      break;
    case 'light':
      if (lightHeightM !== undefined) {
        // Geographic range for observer + light (nm), h in meters
        distanceNm = 2.08 * (Math.sqrt(heightM) + Math.sqrt(lightHeightM));
      }
      break;
  }
  
  return { distanceNm };
}

// Tide calculations - Rule of Twelfths
export function calculateTide(input: TideInput): TideResult {
  const { hour, tidalRangeM, phase = 'rising' } = input;
  if (!isFinite(hour) || !isFinite(tidalRangeM) || hour < 0) {
    return { heightM: 0, fractionOfRange: 0 };
  }
  const h = Math.min(Math.max(Math.round(hour), 0), 6);
  const twelfths = [0, 1, 3, 6, 9, 11, 12];
  const tw = twelfths[h] / 12;
  const fractionOfRange = phase === 'rising' ? tw : 1 - tw;
  const heightM = fractionOfRange * tidalRangeM;
  return { heightM, fractionOfRange };
}

// Turning calculations
export function calculateTurning(input: TurningCalculationInput): TurningCalculationResult {
  const { shipLengthM, courseChangeDeg, speedKn } = input;
  
  const tacticalDiameterM = 3.5 * shipLengthM; // Average 3-4 × L
  const radiusM = tacticalDiameterM / 2;
  
  const courseChangeRad = toRadians(courseChangeDeg);
  const advanceM = radiusM * Math.sin(courseChangeRad / 2);
  const transferM = radiusM * (1 - Math.cos(courseChangeRad / 2));
  
  // ROT (deg/min) from speed and turning radius:
  // v(m/min) = V(kn) * 1852 / 60
  // ω(rad/min) = v / R, ROT(deg/min) = ω * 180/π
  const vMPerMin = (speedKn * 1852) / 60;
  const rotDegPerMin = (vMPerMin / radiusM) * (180 / Math.PI);
  const wheelOverPointM = advanceM / Math.sin(courseChangeRad / 2);
  
  return { tacticalDiameterM, advanceM, transferM, rotDegPerMin, wheelOverPointM };
}

// Weather calculations
export function calculateWeather(input: WeatherCalculationInput): WeatherCalculationResult {
  const { beaufortNumber, windSpeedKn, windAreaM2, shipSpeedKn } = input;
  
  const result: WeatherCalculationResult = {};
  
  if (beaufortNumber !== undefined) {
    result.windSpeedKn = 2 * Math.sqrt(Math.pow(beaufortNumber, 3));
    result.waveHeightM = 0.025 * Math.pow(result.windSpeedKn, 2);
  }
  
  if (windSpeedKn !== undefined && shipSpeedKn !== undefined) {
    const k = 0.15; // leeway factor
    result.leewayAngleDeg = k * Math.pow(windSpeedKn, 2) / Math.pow(shipSpeedKn, 2);
  }
  
  if (windSpeedKn !== undefined && windAreaM2 !== undefined) {
    result.windForceN = 0.00338 * Math.pow(windSpeedKn, 2) * windAreaM2;
  }
  
  return result;
}

// Celestial calculations
export function calculateCelestial(input: CelestialInput): CelestialResult {
  const { latDeg, decDeg, type } = input;
  
  const result: CelestialResult = {};
  
  switch (type) {
    case 'meridian':
      // Latitude = 90° - zenith distance ± declination
      result.latitudeDeg = 90 - Math.abs(latDeg - decDeg);
      break;
    case 'amplitude':
      {
        // A = arcsin(sin δ / cos φ)
        const latRad = toRadians(latDeg);
        const decRad = toRadians(decDeg);
        result.amplitudeDeg = toDegrees(Math.asin(Math.sin(decRad) / Math.cos(latRad)));
      }
      break;
    case 'sunrise':
      {
        // Bearing at sunrise/sunset
        const latRad2 = toRadians(latDeg);
        const decRad2 = toRadians(decDeg);
        result.bearingDeg = normalizeAngle(toDegrees(Math.acos(-Math.tan(latRad2) * Math.tan(decRad2))));
      }
      break;
  }
  
  return result;
}

// Emergency calculations
export function calculateEmergency(input: EmergencyInput): EmergencyResult {
  const { searchType, trackSpacingNm, initialRadiusNm, driftSpeedKn, rescueSpeedKn, distanceNm } = input;
  
  const result: EmergencyResult = {};
  
  switch (searchType) {
    case 'square':
      if (trackSpacingNm !== undefined) {
        result.legDistanceNm = 2 * trackSpacingNm;
      }
      break;
    case 'sector':
      if (initialRadiusNm !== undefined) {
        result.newRadiusNm = initialRadiusNm * Math.sqrt(2);
      }
      break;
  }
  
  if (distanceNm !== undefined && rescueSpeedKn !== undefined && driftSpeedKn !== undefined) {
    result.timeToRescueHours = distanceNm / (rescueSpeedKn + driftSpeedKn);
  }
  
  return result;
}

// -----------------------------
// Extended navigation utilities
// -----------------------------

export type SpeedUnit = "kn" | "kmh" | "ms";
export type DistanceUnit = "nm" | "km" | "m";
export type AngleSignConvention = "east-positive" | "west-positive";

export type LatLon = { latDeg: number; lonDeg: number }; // lon: East positive, West negative

export function knotsToKmh(kn: number): number {
  return kn * 1.852;
}

export function kmhToKnots(kmh: number): number {
  return kmh / 1.852;
}

export function knotsToMs(kn: number): number {
  return kn * 0.514444;
}

export function msToKnots(ms: number): number {
  return ms / 0.514444;
}

export function nmToKm(nm: number): number {
  return nm * 1.852;
}

export function kmToNm(km: number): number {
  return km / 1.852;
}

export function hoursToHhMm(hours: number): { hh: number; mm: number } {
  if (!isFinite(hours)) return { hh: 0, mm: 0 };
  const hh = Math.trunc(hours);
  const mm = Math.round((hours - hh) * 60);
  if (mm === 60) return { hh: hh + 1, mm: 0 };
  return { hh, mm };
}

// ---- Time helpers (GMT/UTC, Zone Time, Local Mean Time)
export function longitudeDegToTimeMinutes(lonDegEastPositive: number): number {
  if (!isFinite(lonDegEastPositive)) throw new Error("Invalid longitude");
  // 360° -> 24h => 15°/h => 1° -> 4 minutes
  return lonDegEastPositive * 4;
}

export function utcToZoneTime(dateUtc: Date, zoneOffsetHours: number): Date {
  if (!isFinite(zoneOffsetHours)) throw new Error("Invalid zone offset");
  return new Date(dateUtc.getTime() + zoneOffsetHours * 60 * 60 * 1000);
}

export function zoneTimeToUtc(dateZone: Date, zoneOffsetHours: number): Date {
  if (!isFinite(zoneOffsetHours)) throw new Error("Invalid zone offset");
  return new Date(dateZone.getTime() - zoneOffsetHours * 60 * 60 * 1000);
}

export function utcToLocalMeanTime(dateUtc: Date, lonDegEastPositive: number): Date {
  const minutes = longitudeDegToTimeMinutes(lonDegEastPositive);
  return new Date(dateUtc.getTime() + minutes * 60 * 1000);
}

export type SpeedDistanceTimeInput = {
  distanceNm?: number;
  speedKn?: number;
  timeHours?: number;
};

export type SpeedDistanceTimeResult = {
  distanceNm: number;
  speedKn: number;
  timeHours: number;
};

export function solveSpeedDistanceTime(input: SpeedDistanceTimeInput): SpeedDistanceTimeResult {
  const { distanceNm, speedKn, timeHours } = input;
  const known = [distanceNm, speedKn, timeHours].filter((v) => v !== undefined && isFinite(v as number)).length;
  if (known < 2) throw new Error("At least two values are required");

  let d = distanceNm;
  let v = speedKn;
  let t = timeHours;

  if (d === undefined || !isFinite(d)) {
    if (v === undefined || !isFinite(v) || v <= 0) throw new Error("Speed must be > 0");
    if (t === undefined || !isFinite(t) || t < 0) throw new Error("Time must be >= 0");
    d = v * t;
  } else if (v === undefined || !isFinite(v)) {
    if (t === undefined || !isFinite(t) || t <= 0) throw new Error("Time must be > 0");
    v = d / t;
  } else if (t === undefined || !isFinite(t)) {
    if (v <= 0) throw new Error("Speed must be > 0");
    t = d / v;
  }

  return { distanceNm: d, speedKn: v, timeHours: t };
}

export type EtaEtdInput = {
  distanceNm: number;
  speedKn: number;
  etdUtc: Date;
};

export function calculateEtaUtc({ distanceNm, speedKn, etdUtc }: EtaEtdInput): Date {
  const hours = calculateEtaHours(distanceNm, speedKn);
  return new Date(etdUtc.getTime() + hours * 60 * 60 * 1000);
}

export type RemainingInput = {
  plannedTotalDistanceNm: number;
  distanceMadeGoodNm: number;
  currentSogKn: number;
};

export type RemainingResult = {
  remainingDistanceNm: number;
  remainingTimeHours: number;
};

export function calculateRemaining(input: RemainingInput): RemainingResult {
  const remainingDistanceNm = Math.max(0, input.plannedTotalDistanceNm - input.distanceMadeGoodNm);
  const remainingTimeHours = input.currentSogKn > 0 ? remainingDistanceNm / input.currentSogKn : Infinity;
  return { remainingDistanceNm, remainingTimeHours };
}

export function calculateAverageSpeed(totalDistanceNm: number, totalTimeHours: number): number {
  if (!isFinite(totalDistanceNm) || !isFinite(totalTimeHours) || totalTimeHours <= 0) {
    throw new Error("Invalid total distance or time");
  }
  return totalDistanceNm / totalTimeHours;
}

export type DLatDLongResult = {
  dLatMin: number;
  dLongMinAtMeanLat: number;
  dLatDir: "N" | "S";
  dLongDir: "E" | "W";
  meanLatDeg: number;
};

export function computeDLatDLong(lat1Deg: number, lon1Deg: number, lat2Deg: number, lon2Deg: number): DLatDLongResult {
  const dLatDeg = lat2Deg - lat1Deg;
  const dLonDeg = lon2Deg - lon1Deg;
  const meanLatDeg = (lat1Deg + lat2Deg) / 2;
  const dLatMin = Math.abs(dLatDeg * 60);
  const dLongMinAtMeanLat = Math.abs(dLonDeg * 60 * Math.cos(toRadians(meanLatDeg)));
  return {
    dLatMin,
    dLongMinAtMeanLat,
    dLatDir: dLatDeg >= 0 ? "N" : "S",
    dLongDir: dLonDeg >= 0 ? "E" : "W",
    meanLatDeg,
  };
}

export type MiddleLatitudeSailingResult = {
  meanLatDeg: number;
  dLatMin: number;
  dLongMin: number;
  departureMin: number;
  courseDeg: number;
  distanceNm: number;
};

export function calculateMiddleLatitudeSailing(input: PlaneSailingInput): MiddleLatitudeSailingResult {
  const { lat1Deg, lon1Deg, lat2Deg, lon2Deg } = input;
  const dLatMinSigned = 60 * (lat2Deg - lat1Deg);
  const meanLatDeg = (lat1Deg + lat2Deg) / 2;
  const dLongMinSigned = 60 * (lon2Deg - lon1Deg);
  const departureMinSigned = dLongMinSigned * Math.cos(toRadians(meanLatDeg));
  const courseDeg = normalizeAngle(toDegrees(Math.atan2(departureMinSigned, dLatMinSigned)));
  const distanceNm = Math.sqrt(dLatMinSigned * dLatMinSigned + departureMinSigned * departureMinSigned);
  return {
    meanLatDeg,
    dLatMin: dLatMinSigned,
    dLongMin: dLongMinSigned,
    departureMin: departureMinSigned,
    courseDeg,
    distanceNm,
  };
}

export type DeadReckoningInput = {
  start: LatLon;
  courseTrueDeg: number;
  distanceNm: number;
};

export function calculateDeadReckoning(input: DeadReckoningInput): LatLon {
  const { start, courseTrueDeg, distanceNm } = input;
  if (!isFinite(start.latDeg) || !isFinite(start.lonDeg) || !isFinite(courseTrueDeg) || !isFinite(distanceNm)) {
    throw new Error("Invalid DR inputs");
  }

  const dLatDeg = (distanceNm * Math.cos(toRadians(courseTrueDeg))) / 60;
  const meanLatDeg = start.latDeg + dLatDeg / 2;
  const dLonDeg = (distanceNm * Math.sin(toRadians(courseTrueDeg))) / (60 * Math.cos(toRadians(meanLatDeg)));
  return { latDeg: start.latDeg + dLatDeg, lonDeg: start.lonDeg + dLonDeg };
}

export function relativeToTrueBearing(headingTrueDeg: number, relativeBearingDeg: number): number {
  return normalizeAngle(headingTrueDeg + relativeBearingDeg);
}

export type TVMDCInput = {
  courseDeg: number;
  variationDeg?: number; // East positive, West negative
  deviationDeg?: number; // East positive, West negative
};

export type TVMDCResult = {
  trueDeg: number;
  magneticDeg: number;
  compassDeg: number;
  compassErrorDeg: number; // Var + Dev
};

export function convertTVMDCFromCompass(input: TVMDCInput): TVMDCResult {
  const variationDeg = input.variationDeg ?? 0;
  const deviationDeg = input.deviationDeg ?? 0;
  const compassDeg = normalizeAngle(input.courseDeg);
  const magneticDeg = normalizeAngle(compassDeg + deviationDeg);
  const trueDeg = normalizeAngle(magneticDeg + variationDeg);
  return {
    trueDeg,
    magneticDeg,
    compassDeg,
    compassErrorDeg: variationDeg + deviationDeg,
  };
}

export function convertTVMDCFromTrue(input: TVMDCInput): TVMDCResult {
  const variationDeg = input.variationDeg ?? 0;
  const deviationDeg = input.deviationDeg ?? 0;
  const trueDeg = normalizeAngle(input.courseDeg);
  const magneticDeg = normalizeAngle(trueDeg - variationDeg);
  const compassDeg = normalizeAngle(magneticDeg - deviationDeg);
  return {
    trueDeg,
    magneticDeg,
    compassDeg,
    compassErrorDeg: variationDeg + deviationDeg,
  };
}

// Chart scale: 1 : scaleDenominator (e.g., 1:50000). Input length in cm.
export function chartCmToNm(lengthCm: number, scaleDenominator: number): number {
  if (!isFinite(lengthCm) || !isFinite(scaleDenominator) || scaleDenominator <= 0) throw new Error("Invalid chart scale inputs");
  // 1 nm = 185200 cm
  return (lengthCm * scaleDenominator) / 185200;
}

export function chartNmToCm(distanceNm: number, scaleDenominator: number): number {
  if (!isFinite(distanceNm) || !isFinite(scaleDenominator) || scaleDenominator <= 0) throw new Error("Invalid chart scale inputs");
  return (distanceNm * 185200) / scaleDenominator;
}

// ---- Fixing / LOP (local-plane approximation; suitable for coastal distances)
type XY = { xNm: number; yNm: number };

function latLonToLocalNm(origin: LatLon, p: LatLon): XY {
  const meanLatRad = toRadians((origin.latDeg + p.latDeg) / 2);
  const xNm = (p.lonDeg - origin.lonDeg) * 60 * Math.cos(meanLatRad);
  const yNm = (p.latDeg - origin.latDeg) * 60;
  return { xNm, yNm };
}

function localNmToLatLon(origin: LatLon, xy: XY): LatLon {
  const latDeg = origin.latDeg + xy.yNm / 60;
  const meanLatRad = toRadians((origin.latDeg + latDeg) / 2);
  const lonDeg = origin.lonDeg + xy.xNm / (60 * Math.cos(meanLatRad));
  return { latDeg, lonDeg };
}

function bearingToUnitVectorNm(bearingDeg: number): XY {
  // Bearing degrees: 0=N, 90=E (navigation convention)
  return { xNm: Math.sin(toRadians(bearingDeg)), yNm: Math.cos(toRadians(bearingDeg)) };
}

export type TwoBearingFixInput = {
  object1: LatLon;
  bearingToObject1TrueDeg: number; // observed bearing from ship to object1 (true)
  object2: LatLon;
  bearingToObject2TrueDeg: number; // observed bearing from ship to object2 (true)
};

export type TwoBearingFixResult = {
  fix: LatLon;
  intersectionAngleDeg: number; // acute angle between LOPs (good: ~30-150)
};

export function calculateFixFromTwoBearings(input: TwoBearingFixInput): TwoBearingFixResult {
  const { object1, object2, bearingToObject1TrueDeg, bearingToObject2TrueDeg } = input;
  const origin: LatLon = { latDeg: (object1.latDeg + object2.latDeg) / 2, lonDeg: (object1.lonDeg + object2.lonDeg) / 2 };
  const p1 = latLonToLocalNm(origin, object1);
  const p2 = latLonToLocalNm(origin, object2);

  // Reciprocal bearings (from object to ship)
  const brg1 = normalizeAngle(bearingToObject1TrueDeg + 180);
  const brg2 = normalizeAngle(bearingToObject2TrueDeg + 180);
  const d1 = bearingToUnitVectorNm(brg1);
  const d2 = bearingToUnitVectorNm(brg2);

  // Solve p1 + t*d1 = p2 + u*d2
  const det = d1.xNm * (-d2.yNm) - d1.yNm * (-d2.xNm); // det([d1, -d2])
  if (Math.abs(det) < 1e-9) {
    throw new Error("Bearings are nearly parallel; fix is ill-conditioned");
  }

  const rhsX = p2.xNm - p1.xNm;
  const rhsY = p2.yNm - p1.yNm;
  const t = (rhsX * (-d2.yNm) - rhsY * (-d2.xNm)) / det;

  const ix = p1.xNm + t * d1.xNm;
  const iy = p1.yNm + t * d1.yNm;

  const angle = Math.acos(
    Math.max(
      -1,
      Math.min(1, (d1.xNm * d2.xNm + d1.yNm * d2.yNm) / (Math.hypot(d1.xNm, d1.yNm) * Math.hypot(d2.xNm, d2.yNm)))
    )
  );
  const intersectionAngleDeg = Math.min(toDegrees(angle), 180 - toDegrees(angle));

  return { fix: localNmToLatLon(origin, { xNm: ix, yNm: iy }), intersectionAngleDeg };
}

export type RunningFixInput = {
  objectOld: LatLon;
  bearing1TrueDeg: number; // first observed bearing (ship->object) at t1
  objectNew: LatLon;
  bearing2TrueDeg: number; // second observed bearing (ship->object) at t2
  runCourseTrueDeg: number; // DR run between t1 and t2
  runDistanceNm: number;
};

export function calculateRunningFix(input: RunningFixInput): TwoBearingFixResult {
  // Advance the first LOP by the run, then intersect with second LOP.
  const origin: LatLon = { latDeg: (input.objectOld.latDeg + input.objectNew.latDeg) / 2, lonDeg: (input.objectOld.lonDeg + input.objectNew.lonDeg) / 2 };
  const p1 = latLonToLocalNm(origin, input.objectOld);
  const p2 = latLonToLocalNm(origin, input.objectNew);

  const brg1Rec = normalizeAngle(input.bearing1TrueDeg + 180);
  const brg2Rec = normalizeAngle(input.bearing2TrueDeg + 180);

  const d1 = bearingToUnitVectorNm(brg1Rec);
  const d2 = bearingToUnitVectorNm(brg2Rec);

  // Advance the whole first line by the run vector
  const run = bearingToUnitVectorNm(input.runCourseTrueDeg);
  const adv: XY = { xNm: run.xNm * input.runDistanceNm, yNm: run.yNm * input.runDistanceNm };
  const p1a: XY = { xNm: p1.xNm + adv.xNm, yNm: p1.yNm + adv.yNm };

  const det = d1.xNm * (-d2.yNm) - d1.yNm * (-d2.xNm);
  if (Math.abs(det) < 1e-9) throw new Error("Bearings are nearly parallel; fix is ill-conditioned");

  const rhsX = p2.xNm - p1a.xNm;
  const rhsY = p2.yNm - p1a.yNm;
  const t = (rhsX * (-d2.yNm) - rhsY * (-d2.xNm)) / det;
  const ix = p1a.xNm + t * d1.xNm;
  const iy = p1a.yNm + t * d1.yNm;

  const angle = Math.acos(
    Math.max(
      -1,
      Math.min(1, (d1.xNm * d2.xNm + d1.yNm * d2.yNm) / (Math.hypot(d1.xNm, d1.yNm) * Math.hypot(d2.xNm, d2.yNm)))
    )
  );
  const intersectionAngleDeg = Math.min(toDegrees(angle), 180 - toDegrees(angle));

  return { fix: localNmToLatLon(origin, { xNm: ix, yNm: iy }), intersectionAngleDeg };
}

// ---- Fixing helpers: 3 bearings, bearing+distance, two distances (mevki dairesi)
export type ThreeBearingFixInput = {
  object1: LatLon;
  bearingToObject1TrueDeg: number;
  object2: LatLon;
  bearingToObject2TrueDeg: number;
  object3: LatLon;
  bearingToObject3TrueDeg: number;
};

export type ThreeBearingFixResult = {
  fix: LatLon;
  // Least-squares residual (nm): 0 means perfect common intersection.
  residualNm: number;
  // Best-case acute intersection angle among any pair of LOPs (deg).
  bestIntersectionAngleDeg: number;
};

function solveLeastSquaresIntersection(lines: Array<{ p: XY; dir: XY }>): { x: XY; residual: number; bestAngleDeg: number } {
  // Each line defined by point p and direction dir (unit-ish).
  // Use normal form: n·x = n·p, where n is perpendicular to dir.
  // Solve x that minimizes ||A x - b|| in least squares.
  let a11 = 0, a12 = 0, a22 = 0;
  let b1 = 0, b2 = 0;
  let bestAngleDeg = 0;

  for (let i = 0; i < lines.length; i++) {
    const d = lines[i].dir;
    const n = { xNm: -d.yNm, yNm: d.xNm }; // perpendicular
    const nn = n.xNm * n.xNm + n.yNm * n.yNm;
    if (nn < 1e-12) continue;

    a11 += n.xNm * n.xNm;
    a12 += n.xNm * n.yNm;
    a22 += n.yNm * n.yNm;

    const bi = n.xNm * lines[i].p.xNm + n.yNm * lines[i].p.yNm;
    b1 += n.xNm * bi;
    b2 += n.yNm * bi;

    for (let j = i + 1; j < lines.length; j++) {
      const d2 = lines[j].dir;
      const dot = (d.xNm * d2.xNm + d.yNm * d2.yNm) / (Math.hypot(d.xNm, d.yNm) * Math.hypot(d2.xNm, d2.yNm));
      const ang = Math.acos(Math.max(-1, Math.min(1, dot)));
      const acuteDeg = Math.min(toDegrees(ang), 180 - toDegrees(ang));
      bestAngleDeg = Math.max(bestAngleDeg, acuteDeg);
    }
  }

  const det = a11 * a22 - a12 * a12;
  if (Math.abs(det) < 1e-12) {
    throw new Error("LOP geometry is ill-conditioned (nearly parallel bearings)");
  }
  const xNm = (b1 * a22 - b2 * a12) / det;
  const yNm = (a11 * b2 - a12 * b1) / det;

  // Residual: sqrt(mean squared perpendicular distance)
  let sse = 0;
  let m = 0;
  for (const l of lines) {
    const d = l.dir;
    const n = { xNm: -d.yNm, yNm: d.xNm };
    const denom = Math.hypot(n.xNm, n.yNm);
    if (denom < 1e-12) continue;
    const dist = (n.xNm * (xNm - l.p.xNm) + n.yNm * (yNm - l.p.yNm)) / denom;
    sse += dist * dist;
    m += 1;
  }
  const residual = m > 0 ? Math.sqrt(sse / m) : 0;

  return { x: { xNm, yNm }, residual, bestAngleDeg };
}

export function calculateFixFromThreeBearings(input: ThreeBearingFixInput): ThreeBearingFixResult {
  const { object1, object2, object3, bearingToObject1TrueDeg, bearingToObject2TrueDeg, bearingToObject3TrueDeg } = input;
  const origin: LatLon = {
    latDeg: (object1.latDeg + object2.latDeg + object3.latDeg) / 3,
    lonDeg: (object1.lonDeg + object2.lonDeg + object3.lonDeg) / 3,
  };
  const p1 = latLonToLocalNm(origin, object1);
  const p2 = latLonToLocalNm(origin, object2);
  const p3 = latLonToLocalNm(origin, object3);

  const brg1Rec = normalizeAngle(bearingToObject1TrueDeg + 180);
  const brg2Rec = normalizeAngle(bearingToObject2TrueDeg + 180);
  const brg3Rec = normalizeAngle(bearingToObject3TrueDeg + 180);

  const d1 = bearingToUnitVectorNm(brg1Rec);
  const d2 = bearingToUnitVectorNm(brg2Rec);
  const d3 = bearingToUnitVectorNm(brg3Rec);

  const solved = solveLeastSquaresIntersection([
    { p: p1, dir: d1 },
    { p: p2, dir: d2 },
    { p: p3, dir: d3 },
  ]);

  return {
    fix: localNmToLatLon(origin, solved.x),
    residualNm: solved.residual,
    bestIntersectionAngleDeg: solved.bestAngleDeg,
  };
}

export type BearingDistanceFixInput = {
  object: LatLon;
  bearingToObjectTrueDeg: number; // ship -> object (true)
  distanceToObjectNm: number;
};

export type BearingDistanceFixResult = {
  fix: LatLon;
};

export function calculateFixFromBearingAndDistance(input: BearingDistanceFixInput): BearingDistanceFixResult {
  const { object, bearingToObjectTrueDeg, distanceToObjectNm } = input;
  if (!isFinite(bearingToObjectTrueDeg) || !isFinite(distanceToObjectNm) || distanceToObjectNm < 0) {
    throw new Error("Invalid bearing/distance inputs");
  }
  // Object -> ship is reciprocal bearing.
  const reciprocal = normalizeAngle(bearingToObjectTrueDeg + 180);
  const fix = calculateDeadReckoning({
    start: object,
    courseTrueDeg: reciprocal,
    distanceNm: distanceToObjectNm,
  });
  return { fix };
}

export type TwoDistanceFixInput = {
  object1: LatLon;
  distanceToObject1Nm: number;
  object2: LatLon;
  distanceToObject2Nm: number;
  // Optional approximate position to choose between the two intersections.
  approximate?: LatLon;
};

export type TwoDistanceFixResult = {
  // Chosen fix (closest to approximate if provided; otherwise the first solution).
  fix: LatLon;
  // Both candidates (can be 0/1/2 points depending on geometry).
  candidates: LatLon[];
};

export function calculateFixFromTwoDistances(input: TwoDistanceFixInput): TwoDistanceFixResult {
  const { object1, object2, distanceToObject1Nm: r1, distanceToObject2Nm: r2, approximate } = input;
  if (!isFinite(r1) || !isFinite(r2) || r1 < 0 || r2 < 0) throw new Error("Invalid distances");

  const origin: LatLon = { latDeg: (object1.latDeg + object2.latDeg) / 2, lonDeg: (object1.lonDeg + object2.lonDeg) / 2 };
  const c1 = latLonToLocalNm(origin, object1);
  const c2 = latLonToLocalNm(origin, object2);

  const dx = c2.xNm - c1.xNm;
  const dy = c2.yNm - c1.yNm;
  const d = Math.hypot(dx, dy);
  if (d < 1e-9) throw new Error("Objects too close (circle centers coincide)");

  // No intersection if circles are separate or one contains the other.
  if (d > r1 + r2 + 1e-9 || d < Math.abs(r1 - r2) - 1e-9) {
    return { fix: localNmToLatLon(origin, c1), candidates: [] };
  }

  // Compute intersection points in local plane.
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h2 = r1 * r1 - a * a;
  const h = h2 > 0 ? Math.sqrt(Math.max(0, h2)) : 0;

  const ux = dx / d;
  const uy = dy / d;
  const px = c1.xNm + a * ux;
  const py = c1.yNm + a * uy;

  const rx = -uy * h;
  const ry = ux * h;

  const pA: XY = { xNm: px + rx, yNm: py + ry };
  const pB: XY = { xNm: px - rx, yNm: py - ry };

  const cand = [localNmToLatLon(origin, pA)];
  if (h > 1e-9) cand.push(localNmToLatLon(origin, pB));

  let chosen = cand[0];
  if (approximate && cand.length > 1) {
    const axy = latLonToLocalNm(origin, approximate);
    const dA = Math.hypot(pA.xNm - axy.xNm, pA.yNm - axy.yNm);
    const dB = Math.hypot(pB.xNm - axy.xNm, pB.yNm - axy.yNm);
    chosen = dB < dA ? cand[1] : cand[0];
  }

  return { fix: chosen, candidates: cand };
}

// ---- Radar plotting (two plots -> target true course/speed)
export type RadarPlot = {
  bearingTrueDeg: number; // True bearing of target from own ship at plot time
  rangeNm: number;
  timeUtc: Date;
};

export type RadarTargetMotionInput = {
  plot1: RadarPlot;
  plot2: RadarPlot;
  ownCourseTrueDeg: number;
  ownSpeedKn: number;
};

export type RadarTargetMotionResult = {
  relativeCourseDeg: number;
  relativeSpeedKn: number;
  targetCourseTrueDeg: number;
  targetSpeedKn: number;
  cpaNm: number;
  tcpaMin: number;
};

export function computeTargetMotionFromTwoRadarPlots(input: RadarTargetMotionInput): RadarTargetMotionResult {
  const dtHours = (input.plot2.timeUtc.getTime() - input.plot1.timeUtc.getTime()) / (60 * 60 * 1000);
  if (!isFinite(dtHours) || dtHours <= 0) throw new Error("Plot2 time must be after Plot1 time");

  const r1x = input.plot1.rangeNm * Math.sin(toRadians(input.plot1.bearingTrueDeg));
  const r1y = input.plot1.rangeNm * Math.cos(toRadians(input.plot1.bearingTrueDeg));
  const r2x = input.plot2.rangeNm * Math.sin(toRadians(input.plot2.bearingTrueDeg));
  const r2y = input.plot2.rangeNm * Math.cos(toRadians(input.plot2.bearingTrueDeg));

  const vrx = (r2x - r1x) / dtHours;
  const vry = (r2y - r1y) / dtHours;
  const relativeSpeedKn = Math.hypot(vrx, vry);
  const relativeCourseDeg = normalizeAngle(toDegrees(Math.atan2(vrx, vry)));

  const vox = input.ownSpeedKn * Math.sin(toRadians(input.ownCourseTrueDeg));
  const voy = input.ownSpeedKn * Math.cos(toRadians(input.ownCourseTrueDeg));

  const vtx = vrx + vox;
  const vty = vry + voy;
  const targetSpeedKn = Math.hypot(vtx, vty);
  const targetCourseTrueDeg = normalizeAngle(toDegrees(Math.atan2(vtx, vty)));

  // CPA/TCPA computed at plot2 instant
  const arpa = computeArpaCpaTcpa({
    targetBearingDeg: input.plot2.bearingTrueDeg,
    targetDistanceNm: input.plot2.rangeNm,
    targetCourseDeg: targetCourseTrueDeg,
    targetSpeedKn: targetSpeedKn,
    ownCourseDeg: input.ownCourseTrueDeg,
    ownSpeedKn: input.ownSpeedKn,
  });

  return {
    relativeCourseDeg,
    relativeSpeedKn,
    targetCourseTrueDeg,
    targetSpeedKn,
    cpaNm: arpa.cpaNm,
    tcpaMin: arpa.tcpaMin,
  };
}

// ---- COLREG quick classification (heuristic, based on relative bearing)
export type ColregSituation =
  | "head-on"
  | "crossing-starboard"
  | "crossing-port"
  | "overtaking"
  | "unknown";

export type ColregAssessment = {
  situation: ColregSituation;
  isGiveWay: boolean | null;
  note: string;
};

export function assessColregSituation(relativeBearingDeg: number): ColregAssessment {
  const rb = normalizeAngle(relativeBearingDeg);
  // Convention: 0° = dead ahead, 90° = starboard beam, 180° = dead astern, 270° = port beam
  const within = (a: number, b: number, tol: number) => Math.min(normalizeAngle(a - b), normalizeAngle(b - a)) <= tol;

  if (within(rb, 0, 5) || within(rb, 360, 5)) {
    return { situation: "head-on", isGiveWay: true, note: "Head-on ihtimali: her iki gemi de sancağa dönerek geçiş yapmalı (Genel yaklaşım)." };
  }
  if (rb > 112.5 && rb < 247.5) {
    return { situation: "overtaking", isGiveWay: null, note: "Overtaking sektörü: yaklaşanın (overtaking) give-way olduğu durumlar olabilir; ışık/işaret ve gerçek hareketle teyit edin." };
  }
  if (rb > 0 && rb <= 112.5) {
    return { situation: "crossing-starboard", isGiveWay: true, note: "Hedef sancak tarafında: crossing durumda genellikle siz give-way olursunuz (duruma göre teyit)." };
  }
  if (rb >= 247.5 && rb < 360) {
    return { situation: "crossing-port", isGiveWay: false, note: "Hedef iskele tarafında: crossing durumda genellikle siz stand-on olursunuz (duruma göre teyit)." };
  }
  return { situation: "unknown", isGiveWay: null, note: "Sınıflama için yeterli veri yok." };
}

// ---- Tides / UKC / Squat
export type HeightOfTideInput = {
  lowWaterTimeUtc: Date;
  lowWaterHeightM: number;
  highWaterTimeUtc: Date;
  highWaterHeightM: number;
  queryTimeUtc: Date;
};

export type HeightOfTideResult = {
  heightM: number;
  stage: "rising" | "falling";
  fractionOfRange: number; // 0..1 within the LW->HW or HW->LW segment
};

export type TidalStreamInput = {
  // Stage relative to slack
  stage: "flood" | "ebb";
  hourFromSlack: number; // 0..6 (rule-of-twelfths style)
  // Spring/neap max rates and ranges (for scaling)
  springMaxRateKn: number;
  neapMaxRateKn: number;
  springRangeM: number;
  neapRangeM: number;
  actualRangeM: number;
  // Directions for flood/ebb (deg true). If omitted, use flood+180 for ebb.
  floodSetDeg?: number;
  ebbSetDeg?: number;
};

export type TidalStreamResult = {
  setDeg: number;
  rateKn: number;
  maxRateKn: number;
  springNeapFactor: number; // 0..1
};

export function calculateTidalStream(input: TidalStreamInput): TidalStreamResult {
  const {
    stage,
    hourFromSlack,
    springMaxRateKn,
    neapMaxRateKn,
    springRangeM,
    neapRangeM,
    actualRangeM,
    floodSetDeg,
    ebbSetDeg,
  } = input;

  if (!isFinite(hourFromSlack) || hourFromSlack < 0) throw new Error("Invalid hour from slack");
  if (!isFinite(springMaxRateKn) || !isFinite(neapMaxRateKn) || springMaxRateKn < 0 || neapMaxRateKn < 0) throw new Error("Invalid rates");
  if (!isFinite(springRangeM) || !isFinite(neapRangeM) || !isFinite(actualRangeM)) throw new Error("Invalid ranges");

  const denom = springRangeM - neapRangeM;
  const rawFactor = Math.abs(denom) < 1e-9 ? 0.5 : (actualRangeM - neapRangeM) / denom;
  const springNeapFactor = Math.max(0, Math.min(1, rawFactor));
  const maxRateKn = neapMaxRateKn + springNeapFactor * (springMaxRateKn - neapMaxRateKn);

  // Simple sinusoidal approximation: 0 at slack (0,6), max at mid (3)
  const h = Math.max(0, Math.min(6, hourFromSlack));
  const shape = Math.sin((Math.PI * h) / 6);
  const rateKn = Math.max(0, maxRateKn * shape);

  const flood = normalizeAngle(floodSetDeg ?? 0);
  const ebb = normalizeAngle(ebbSetDeg ?? (flood + 180));
  const setDeg = stage === "flood" ? flood : ebb;

  return { setDeg, rateKn, maxRateKn, springNeapFactor };
}

function twelfthsFraction(u: number): number {
  // Map 0..1 to rule-of-twelfths cumulative fraction over 6 hours:
  // at hours 0..6: 0, 1/12, 3/12, 6/12, 9/12, 11/12, 12/12
  // Linear interpolation between points.
  const points = [
    { t: 0, f: 0 },
    { t: 1 / 6, f: 1 / 12 },
    { t: 2 / 6, f: 3 / 12 },
    { t: 3 / 6, f: 6 / 12 },
    { t: 4 / 6, f: 9 / 12 },
    { t: 5 / 6, f: 11 / 12 },
    { t: 1, f: 1 },
  ];
  const x = Math.max(0, Math.min(1, u));
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (x >= a.t && x <= b.t) {
      const k = (x - a.t) / (b.t - a.t);
      return a.f + k * (b.f - a.f);
    }
  }
  return 1;
}

export function calculateHeightOfTideAtTime(input: HeightOfTideInput): HeightOfTideResult {
  const { lowWaterTimeUtc, lowWaterHeightM, highWaterTimeUtc, highWaterHeightM, queryTimeUtc } = input;
  const tLW = lowWaterTimeUtc.getTime();
  const tHW = highWaterTimeUtc.getTime();
  const tq = queryTimeUtc.getTime();
  if (!(isFinite(lowWaterHeightM) && isFinite(highWaterHeightM))) throw new Error("Invalid tide heights");
  if (!(isFinite(tLW) && isFinite(tHW) && isFinite(tq))) throw new Error("Invalid times");
  if (tLW === tHW) throw new Error("LW and HW times must differ");

  const range = highWaterHeightM - lowWaterHeightM;
  const isRisingSegment = tLW < tHW;

  // Determine whether query is in the LW->HW segment or HW->LW segment by projecting onto a 12h cycle.
  // If query is outside LW->HW interval, assume it belongs to HW->LW following immediately after HW.
  let stage: "rising" | "falling";
  let startTime: number;
  let endTime: number;
  let startHeight: number;
  let endHeight: number;

  if (isRisingSegment) {
    if (tq >= tLW && tq <= tHW) {
      stage = "rising";
      startTime = tLW;
      endTime = tHW;
      startHeight = lowWaterHeightM;
      endHeight = highWaterHeightM;
    } else {
      stage = "falling";
      startTime = tHW;
      endTime = tHW + (tHW - tLW); // assume symmetric 6h
      startHeight = highWaterHeightM;
      endHeight = lowWaterHeightM;
    }
  } else {
    // If provided order is reversed, treat it accordingly
    if (tq >= tHW && tq <= tLW) {
      stage = "falling";
      startTime = tHW;
      endTime = tLW;
      startHeight = highWaterHeightM;
      endHeight = lowWaterHeightM;
    } else {
      stage = "rising";
      startTime = tLW;
      endTime = tLW + (tLW - tHW);
      startHeight = lowWaterHeightM;
      endHeight = highWaterHeightM;
    }
  }

  const u = (tq - startTime) / (endTime - startTime);
  const frac = twelfthsFraction(u);
  const heightM = startHeight + frac * (endHeight - startHeight);

  return {
    heightM,
    stage,
    fractionOfRange: frac,
  };
}

export type SecondaryPortCorrection = {
  timeDiffMin: number; // add to primary time
  heightDiffM: number; // add to primary height
};

export function applySecondaryPortCorrection(primaryTimeUtc: Date, primaryHeightM: number, corr: SecondaryPortCorrection): { timeUtc: Date; heightM: number } {
  return {
    timeUtc: new Date(primaryTimeUtc.getTime() + corr.timeDiffMin * 60 * 1000),
    heightM: primaryHeightM + corr.heightDiffM,
  };
}

export type SquatEnvironment = "open" | "confined";

export type SquatInput = {
  speedKn: number;
  blockCoefficient?: number; // typical 0.6..0.85
  environment?: SquatEnvironment;
};

export function estimateSquatBarrass(input: SquatInput): number {
  const V = input.speedKn;
  const Cb = input.blockCoefficient ?? 0.7;
  const env = input.environment ?? "open";
  if (!isFinite(V) || V < 0) throw new Error("Invalid speed");
  if (!isFinite(Cb) || Cb <= 0 || Cb > 1) throw new Error("Invalid block coefficient");
  // Simple Barrass-style approximation (meters)
  const k = env === "confined" ? 2 : 1;
  return (k * Cb * V * V) / 100;
}

export type UkcInput = {
  chartedDepthM: number;
  heightOfTideM: number;
  draftM: number;
  squatM?: number;
  safetyMarginM?: number;
};

export type UkcResult = {
  ukcM: number;
  isSafe: boolean;
};

export function calculateUKC(input: UkcInput): UkcResult {
  const squatM = input.squatM ?? 0;
  const safetyMarginM = input.safetyMarginM ?? 0;
  const ukcM = input.chartedDepthM + input.heightOfTideM - input.draftM - squatM - safetyMarginM;
  return { ukcM, isSafe: ukcM >= 0 };
}

// ---- ECDIS / Route check helpers
export type CrossTrackInput = {
  legStart: LatLon;
  legEnd: LatLon;
  position: LatLon;
};

export type CrossTrackResult = {
  xtdNm: number; // absolute cross track distance in NM
  side: "port" | "starboard" | "on-track";
  alongTrackNm: number; // projection from start along leg
};

export function calculateCrossTrackDistance(input: CrossTrackInput): CrossTrackResult {
  const origin: LatLon = input.legStart;
  const a = latLonToLocalNm(origin, input.legStart);
  const b = latLonToLocalNm(origin, input.legEnd);
  const p = latLonToLocalNm(origin, input.position);
  const abx = b.xNm - a.xNm;
  const aby = b.yNm - a.yNm;
  const apx = p.xNm - a.xNm;
  const apy = p.yNm - a.yNm;
  const ab2 = abx * abx + aby * aby;
  if (ab2 < 1e-9) throw new Error("Leg start/end too close");

  const t = (apx * abx + apy * aby) / ab2;
  const projx = a.xNm + t * abx;
  const projy = a.yNm + t * aby;
  const dx = p.xNm - projx;
  const dy = p.yNm - projy;
  const xtdNmSigned = (abx * apy - aby * apx) / Math.sqrt(ab2); // + means left of track (port) in ENU convention
  const xtdNm = Math.hypot(dx, dy);

  let side: "port" | "starboard" | "on-track" = "on-track";
  if (Math.abs(xtdNmSigned) > 1e-6) side = xtdNmSigned > 0 ? "port" : "starboard";
  return { xtdNm, side, alongTrackNm: t * Math.sqrt(ab2) };
}

export type LookAheadResult = {
  lookAheadDistanceNm: number;
};

export function calculateLookAheadDistance(sogKn: number, lookAheadMinutes: number): LookAheadResult {
  if (!isFinite(sogKn) || !isFinite(lookAheadMinutes) || sogKn < 0 || lookAheadMinutes < 0) throw new Error("Invalid look-ahead inputs");
  return { lookAheadDistanceNm: sogKn * (lookAheadMinutes / 60) };
}

// ---- Astronomical navigation (Sun-focused almanac + sextant correction)
export type SunAlmanacResult = {
  ghaSunDeg: number;
  decSunDeg: number;
  ghaAriesDeg: number;
  gmstDeg: number;
};

function julianDateUtc(dateUtc: Date): number {
  // Unix epoch -> JD
  return dateUtc.getTime() / 86400000 + 2440587.5;
}

function gmstDegFromJulianDate(jd: number): number {
  // IAU 2006-ish: good enough for nav training use
  const T = (jd - 2451545.0) / 36525.0;
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  return normalizeAngle(gmst);
}

export function computeSunAlmanac(dateUtc: Date): SunAlmanacResult {
  const almanac2025 = getSunAriesAlmanac2025Utc(dateUtc);
  if (almanac2025) {
    // Keep gmstDeg for compatibility with existing callers, even though Aries here is from GAST.
    return {
      ghaSunDeg: almanac2025.ghaSunDeg,
      decSunDeg: almanac2025.decSunDeg,
      ghaAriesDeg: almanac2025.ghaAriesDeg,
      gmstDeg: almanac2025.ghaAriesDeg,
    };
  }

  const jd = julianDateUtc(dateUtc);
  const n = jd - 2451545.0;

  const L = normalizeAngle(280.460 + 0.9856474 * n); // mean longitude
  const g = normalizeAngle(357.528 + 0.9856003 * n); // mean anomaly
  const lambda = normalizeAngle(L + 1.915 * Math.sin(toRadians(g)) + 0.020 * Math.sin(toRadians(2 * g))); // ecliptic longitude
  const epsilon = 23.439 - 0.0000004 * n; // obliquity

  const sinLambda = Math.sin(toRadians(lambda));
  const cosLambda = Math.cos(toRadians(lambda));
  const cosEps = Math.cos(toRadians(epsilon));
  const sinEps = Math.sin(toRadians(epsilon));

  const raRad = Math.atan2(cosEps * sinLambda, cosLambda); // radians, -pi..pi
  const decRad = Math.asin(sinEps * sinLambda);

  const raDeg = normalizeAngle(toDegrees(raRad));
  const decSunDeg = toDegrees(decRad);

  const gmstDeg = gmstDegFromJulianDate(jd);
  const ghaAriesDeg = gmstDeg; // by definition: GHA Aries = GMST (deg)
  const ghaSunDeg = normalizeAngle(gmstDeg - raDeg);

  return { ghaSunDeg, decSunDeg, ghaAriesDeg, gmstDeg };
}

export type SextantCorrectionInput = {
  hsDeg: number; // Sextant altitude (degrees)
  indexCorrectionMin?: number; // minutes (IC), add algebraically
  heightOfEyeM?: number;
  pressureHPa?: number; // default 1010
  temperatureC?: number; // default 10
};

export type SextantCorrectionResult = {
  haDeg: number; // apparent altitude after IC + dip
  hoDeg: number; // observed altitude after refraction (simplified)
  dipMin: number;
  refractionMin: number;
};

export function correctSextantAltitude(input: SextantCorrectionInput): SextantCorrectionResult {
  const hs = input.hsDeg;
  if (!isFinite(hs) || hs < 0 || hs > 90) throw new Error("Invalid sextant altitude");

  const IC = input.indexCorrectionMin ?? 0;
  const HE = input.heightOfEyeM ?? 0;
  const P = input.pressureHPa ?? 1010;
  const T = input.temperatureC ?? 10;

  // Dip (minutes). Common approximation: dip' = 1.76 * sqrt(HE in meters)
  const dipMin = HE > 0 ? 1.76 * Math.sqrt(HE) : 0;

  // Apparent altitude Ha = Hs + IC - Dip
  const haDeg = hs + IC / 60 - dipMin / 60;

  // Refraction (minutes). Simple Bennett-style approximation, valid for Ha > ~5°.
  // R' ≈ (0.00452 * P) / ((273 + T) * tan(Ha))
  let refractionMin = 0;
  const haRad = toRadians(Math.max(0.5, haDeg));
  refractionMin = (0.00452 * P) / ((273 + T) * Math.tan(haRad));
  refractionMin = Math.max(0, Math.min(60, refractionMin)); // clamp

  const hoDeg = haDeg - refractionMin / 60;
  return { haDeg, hoDeg, dipMin, refractionMin };
}

export type InterceptSightInput = {
  assumedPosition: LatLon;
  dateUtc: Date;
  hoDeg: number; // corrected observed altitude
  body: "sun";
};

export type InterceptSightResult = {
  ghaDeg: number;
  decDeg: number;
  lhaDeg: number;
  hcDeg: number;
  znDeg: number;
  interceptNm: number; // Ho - Hc (nm)
  towardAway: "toward" | "away";
};

export function computeSunInterceptSight(input: InterceptSightInput): InterceptSightResult {
  const almanac = computeSunAlmanac(input.dateUtc);
  const lhaDeg = normalizeAngle(almanac.ghaSunDeg - input.assumedPosition.lonDeg); // lon East positive => LHA = GHA - lonE
  const sr = calculateSightReduction({
    latDeg: input.assumedPosition.latDeg,
    decDeg: almanac.decSunDeg,
    lhaDeg,
  });
  const interceptNm = (input.hoDeg - sr.hcDeg) * 60;
  return {
    ghaDeg: almanac.ghaSunDeg,
    decDeg: almanac.decSunDeg,
    lhaDeg,
    hcDeg: sr.hcDeg,
    znDeg: sr.azimuthDeg,
    interceptNm: Math.abs(interceptNm),
    towardAway: interceptNm >= 0 ? "toward" : "away",
  };
}

export type SightReductionTableRow = {
  lhaDeg: number;
  hcDeg: number;
  znDeg: number;
};

export function generateSightReductionTable(latDeg: number, decDeg: number, lhaStartDeg: number, lhaEndDeg: number, stepDeg: number): SightReductionTableRow[] {
  if (!isFinite(stepDeg) || stepDeg <= 0) throw new Error("Invalid step");
  const rows: SightReductionTableRow[] = [];
  const a = Math.min(lhaStartDeg, lhaEndDeg);
  const b = Math.max(lhaStartDeg, lhaEndDeg);
  for (let lha = a; lha <= b + 1e-9; lha += stepDeg) {
    const r = calculateSightReduction({ latDeg, decDeg, lhaDeg: lha });
    rows.push({ lhaDeg: normalizeAngle(lha), hcDeg: r.hcDeg, znDeg: r.azimuthDeg });
  }
  return rows;
}

export type DailySunAlmanacRow = {
  utcHour: number;
  ghaSunDeg: number;
  decSunDeg: number;
  ghaAriesDeg: number;
};

export function generateDailySunAlmanac(dateUtc: Date): DailySunAlmanacRow[] {
  const base = new Date(Date.UTC(dateUtc.getUTCFullYear(), dateUtc.getUTCMonth(), dateUtc.getUTCDate(), 0, 0, 0));
  const rows: DailySunAlmanacRow[] = [];
  for (let h = 0; h <= 23; h++) {
    const t = new Date(base.getTime() + h * 60 * 60 * 1000);
    const a = computeSunAlmanac(t);
    rows.push({ utcHour: h, ghaSunDeg: a.ghaSunDeg, decSunDeg: a.decSunDeg, ghaAriesDeg: a.ghaAriesDeg });
  }
  return rows;
}

