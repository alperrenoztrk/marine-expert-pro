/**
 * Tide Calculation Core Engine (NP 204 cosine curve approach)
 * -----------------------------------------------------------
 * Purpose:
 * - Teach tide calculation (university-level) with manual inputs.
 * - Pure TypeScript functions (UI independent).
 *
 * Method:
 * - Uses a cosine-based tidal curve factor:
 *   factor = (1 - cos(pi * t / T)) / 2
 *
 * Notes:
 * - Times are given as "HH:MM" and treated as within a 24h clock.
 * - If the LW->HW interval crosses midnight, it is supported via modular time arithmetic.
 * - For the falling phase (HW -> next LW), we assume symmetry: duration(HW->LW) = duration(LW->HW) = T.
 */
export type TideState = "rising" | "falling";

export type TideCalculationInput = {
  LW_time: string; // "hh:mm"
  LW_height: number; // meters (Chart Datum referenced)
  HW_time: string; // "hh:mm"
  HW_height: number; // meters (Chart Datum referenced)
  desired_time: string; // "hh:mm"
  charted_depth: number; // meters
  draft: number; // meters
  squat?: number; // meters (optional)
  safety_margin?: number; // meters (optional)
};

export type TideCalculationResult = {
  // Step outputs (teaching-friendly)
  tideState: TideState; // Step 1
  R: number; // Step 2 (range)
  T: number; // Step 3 (hours)
  t: number; // Step 3 (hours)
  factor: number; // Step 4
  deltaH: number; // Step 5
  HOT: number; // Step 6 (Height of Tide, meters above Chart Datum)
  actualDepth: number; // Step 7
  UKC: number; // Step 8

  // Helpful extras
  squatUsed: number;
  safetyMarginUsed: number;
  // Raw time geometry (minutes) for debugging/teaching
  lwMinutes: number;
  hwMinutes: number;
  desiredMinutes: number;
  T_minutes: number;
  t_minutes: number;
};

export type TideTableRow = TideCalculationResult & {
  desired_time: string;
};

export type TideTableInput = Omit<TideCalculationInput, "desired_time">;

export class TideCalculatorError extends Error {
  override name = "TideCalculatorError";
}

function assertFiniteNumber(name: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new TideCalculatorError(`${name} must be a finite number`);
  }
}

function assertNonNegative(name: string, value: number): void {
  assertFiniteNumber(name, value);
  if (value < 0) {
    throw new TideCalculatorError(`${name} must be >= 0`);
  }
}

/**
 * Parse "HH:MM" into minutes since 00:00 (0..1439).
 */
export function parseTimeToMinutes(hhmm: string): number {
  if (typeof hhmm !== "string") {
    throw new TideCalculatorError("Time must be a string in 'HH:MM' format");
  }
  const trimmed = hhmm.trim();
  const m = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!m) {
    throw new TideCalculatorError(`Invalid time format: '${hhmm}'. Expected 'HH:MM'`);
  }
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isInteger(hh) || !Number.isInteger(mm)) {
    throw new TideCalculatorError(`Invalid time value: '${hhmm}'`);
  }
  if (hh < 0 || hh > 23) {
    throw new TideCalculatorError(`Hour out of range in '${hhmm}' (0..23)`);
  }
  if (mm < 0 || mm > 59) {
    throw new TideCalculatorError(`Minute out of range in '${hhmm}' (0..59)`);
  }
  return hh * 60 + mm;
}

/**
 * Format minutes since 00:00 to "HH:MM" (wraps at 24h).
 */
export function formatMinutesToTime(minutes: number): string {
  if (!Number.isFinite(minutes)) {
    throw new TideCalculatorError("minutes must be a finite number");
  }
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/**
 * Forward difference in minutes on a 24h clock: from -> to, in [0..1439].
 */
export function forwardDiffMinutes(fromMinutes: number, toMinutes: number): number {
  if (!Number.isFinite(fromMinutes) || !Number.isFinite(toMinutes)) {
    throw new TideCalculatorError("forwardDiffMinutes inputs must be finite numbers");
  }
  const from = ((Math.round(fromMinutes) % 1440) + 1440) % 1440;
  const to = ((Math.round(toMinutes) % 1440) + 1440) % 1440;
  return (to - from + 1440) % 1440;
}

/**
 * Determine tide state using the provided LW and HW that are assumed to be adjacent.
 * - If desired is within the LW->HW forward interval, it's rising.
 * - Otherwise it's falling (in the HW->next LW interval), assuming symmetry (same duration T).
 */
export function determineTideState(
  lwMinutes: number,
  hwMinutes: number,
  desiredMinutes: number
): { tideState: TideState; T_minutes: number; t_minutes: number } {
  const T_minutes = forwardDiffMinutes(lwMinutes, hwMinutes);
  if (T_minutes === 0) {
    throw new TideCalculatorError("LW_time and HW_time must be different");
  }

  const lwToDesired = forwardDiffMinutes(lwMinutes, desiredMinutes);
  if (lwToDesired <= T_minutes) {
    // rising segment (LW -> HW)
    return { tideState: "rising", T_minutes, t_minutes: lwToDesired };
  }

  // falling segment (HW -> next LW), assume symmetry: duration = T_minutes
  const hwToDesired = forwardDiffMinutes(hwMinutes, desiredMinutes);
  if (hwToDesired <= T_minutes) {
    return { tideState: "falling", T_minutes, t_minutes: hwToDesired };
  }

  // desired is not within either adjacent half-cycle given only LW and HW
  throw new TideCalculatorError(
    "desired_time must be between LW and HW (rising) or between HW and next LW (falling) for the given pair of LW/HW"
  );
}

/**
 * Core calculation (NP 204 cosine curve approach).
 *
 * Calculation steps (MUST follow this order):
 * 1) Determine tide state (rising LW->HW or falling HW->LW)
 * 2) Range R = HW_height - LW_height
 * 3) Time differences: T (hours) and t (hours)
 * 4) Tide curve factor: (1 - cos(pi * t / T)) / 2
 * 5) Delta height: ΔH = factor * R
 * 6) Height of Tide (HOT)
 * 7) Actual Depth = charted_depth + HOT
 * 8) UKC = actualDepth - draft - squat - safety_margin
 */
export function calculateTide(input: TideCalculationInput): TideCalculationResult {
  // ---- Input validation (basic sanity)
  assertFiniteNumber("LW_height", input.LW_height);
  assertFiniteNumber("HW_height", input.HW_height);
  if (!(input.HW_height > input.LW_height)) {
    throw new TideCalculatorError("Validation failed: HW_height must be > LW_height");
  }

  assertNonNegative("charted_depth", input.charted_depth);
  assertNonNegative("draft", input.draft);
  const squatUsed = input.squat ?? 0;
  const safetyMarginUsed = input.safety_margin ?? 0;
  assertNonNegative("squat", squatUsed);
  assertNonNegative("safety_margin", safetyMarginUsed);

  const lwMinutes = parseTimeToMinutes(input.LW_time);
  const hwMinutes = parseTimeToMinutes(input.HW_time);
  const desiredMinutes = parseTimeToMinutes(input.desired_time);

  // 1) Determine tide state
  const { tideState, T_minutes, t_minutes } = determineTideState(lwMinutes, hwMinutes, desiredMinutes);

  // 2) Range
  const R = input.HW_height - input.LW_height;

  // 3) Time differences
  const T = T_minutes / 60;
  const t = t_minutes / 60;
  if (!(T > 0)) {
    throw new TideCalculatorError("Invalid T computed from LW_time and HW_time");
  }

  // 4) Tide curve factor (NP 204 approach)
  const factor = (1 - Math.cos((Math.PI * t) / T)) / 2;

  // 5) Delta height
  const deltaH = factor * R;

  // 6) Height of Tide (HOT)
  const HOT = tideState === "rising" ? input.LW_height + deltaH : input.HW_height - deltaH;

  // 7) Actual Depth
  const actualDepth = input.charted_depth + HOT;

  // 8) UKC
  const UKC = actualDepth - input.draft - squatUsed - safetyMarginUsed;

  return {
    tideState,
    R,
    T,
    t,
    factor,
    deltaH,
    HOT,
    actualDepth,
    UKC,
    squatUsed,
    safetyMarginUsed,
    lwMinutes,
    hwMinutes,
    desiredMinutes,
    T_minutes,
    t_minutes,
  };
}

/**
 * Generate a tide table by sampling every intervalMinutes within the computed tidal half-cycle.
 *
 * Behavior:
 * - Uses the same LW/HW pair and assumes symmetry for HW->LW duration.
 * - Produces rows from LW to LW+2T (i.e., one full cycle based on the given half-cycle duration),
 *   including both the rising (LW->HW) and falling (HW->next LW) segments.
 *
 * If you only want LW->HW, you can filter `row.tideState === "rising"`.
 */
export function generateTideTable(intervalMinutes: number, input: TideTableInput): TideTableRow[] {
  assertFiniteNumber("intervalMinutes", intervalMinutes);
  if (!Number.isInteger(intervalMinutes) || intervalMinutes <= 0) {
    throw new TideCalculatorError("intervalMinutes must be a positive integer");
  }

  // Validate fixed inputs once
  assertFiniteNumber("LW_height", input.LW_height);
  assertFiniteNumber("HW_height", input.HW_height);
  if (!(input.HW_height > input.LW_height)) {
    throw new TideCalculatorError("Validation failed: HW_height must be > LW_height");
  }
  assertNonNegative("charted_depth", input.charted_depth);
  assertNonNegative("draft", input.draft);
  const squatUsed = input.squat ?? 0;
  const safetyMarginUsed = input.safety_margin ?? 0;
  assertNonNegative("squat", squatUsed);
  assertNonNegative("safety_margin", safetyMarginUsed);

  const lwMinutes = parseTimeToMinutes(input.LW_time);
  const hwMinutes = parseTimeToMinutes(input.HW_time);
  const T_minutes = forwardDiffMinutes(lwMinutes, hwMinutes);
  if (T_minutes === 0) {
    throw new TideCalculatorError("LW_time and HW_time must be different");
  }

  // One full cycle for teaching purposes: LW -> (LW + 2T)
  const totalMinutes = 2 * T_minutes;
  const rows: TideTableRow[] = [];

  for (let offset = 0; offset <= totalMinutes; offset += intervalMinutes) {
    const desiredMinutes = lwMinutes + offset;
    const desired_time = formatMinutesToTime(desiredMinutes);

    const result = calculateTide({
      ...input,
      desired_time,
      squat: squatUsed,
      safety_margin: safetyMarginUsed,
    });

    rows.push({ ...result, desired_time });
  }

  return rows;
}

