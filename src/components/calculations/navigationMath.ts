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

