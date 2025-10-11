// Core navigation calculation utilities extracted from assistant components.
// Keep these functions pure and UI-agnostic so multiple UIs can reuse them.

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
  let headingRad = desiredRad + Math.asin(clamped);
  let headingDeg = normalizeAngle(toDegrees(headingRad) + leewayDeg);

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

// Great Circle calculations (matching formula exactly)
export function calculateGreatCircle(lat1Deg: number, lon1Deg: number, lat2Deg: number, lon2Deg: number) {
  const R = 3440.065; // nautical miles
  const lat1Rad = toRadians(lat1Deg);
  const lat2Rad = toRadians(lat2Deg);
  const deltaLatRad = toRadians(lat2Deg - lat1Deg);
  const deltaLonRad = toRadians(lon2Deg - lon1Deg);

  const a = Math.sin(deltaLatRad/2) * Math.sin(deltaLatRad/2) + 
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
            Math.sin(deltaLonRad/2) * Math.sin(deltaLonRad/2);
  const c = 2 * Math.asin(Math.sqrt(a));
  const distance = R * c;

  const y = Math.sin(deltaLonRad) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLonRad);
  const initialCourse = normalizeAngle(toDegrees(Math.atan2(y, x)));

  return { distance, initialCourse };
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

  const q = Math.log(Math.tan(Math.PI/4 + lat2Rad/2) / Math.tan(Math.PI/4 + lat1Rad/2)) / deltaLatRad;
  const qSafe = Math.abs(deltaLatRad) > 1e-12 ? q : Math.cos(lat1Rad);

  const distance = 60 * Math.sqrt(Math.pow(toDegrees(deltaLatRad), 2) + Math.pow(qSafe * toDegrees(deltaLonRad), 2));
  const course = normalizeAngle(toDegrees(Math.atan2(deltaLonRad, q * deltaLatRad)));

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
      distanceNm = 2.075 * Math.sqrt(heightM);
      break;
    case 'radar':
      distanceNm = 2.35 * Math.sqrt(heightM);
      break;
    case 'light':
      if (lightHeightM !== undefined) {
        distanceNm = 1.17 * (Math.sqrt(heightM) + Math.sqrt(lightHeightM));
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
  
  const rotDegPerMin = 3438 * (speedKn * 0.514444) / radiusM; // V in m/s, formula gives deg/min
  const wheelOverPointM = advanceM / Math.sin(courseChangeRad / 2);
  
  return { tacticalDiameterM, advanceM, transferM, rotDegPerMin, wheelOverPointM };
}

// Weather calculations
export function calculateWeather(input: WeatherCalculationInput): WeatherCalculationResult {
  const { beaufortNumber, windSpeedKn, windAreaM2, shipSpeedKn } = input;
  
  let result: WeatherCalculationResult = {};
  
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
  
  let result: CelestialResult = {};
  
  switch (type) {
    case 'meridian':
      // Latitude = 90° - zenith distance ± declination
      result.latitudeDeg = 90 - Math.abs(latDeg - decDeg);
      break;
    case 'amplitude':
      // A = arcsin(sin δ / cos φ)
      const latRad = toRadians(latDeg);
      const decRad = toRadians(decDeg);
      result.amplitudeDeg = toDegrees(Math.asin(Math.sin(decRad) / Math.cos(latRad)));
      break;
    case 'sunrise':
      // Bearing at sunrise/sunset
      const latRad2 = toRadians(latDeg);
      const decRad2 = toRadians(decDeg);
      result.bearingDeg = normalizeAngle(toDegrees(Math.acos(-Math.tan(latRad2) * Math.tan(decRad2))));
      break;
  }
  
  return result;
}

// Emergency calculations
export function calculateEmergency(input: EmergencyInput): EmergencyResult {
  const { searchType, trackSpacingNm, initialRadiusNm, driftSpeedKn, rescueSpeedKn, distanceNm } = input;
  
  let result: EmergencyResult = {};
  
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

