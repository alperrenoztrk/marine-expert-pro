// Tide Calculator based on Moon and Sun positions
// Uses simplified luni-solar tidal model

import { getMoonPhase } from './moonPhase';

export interface TideEvent {
  time: Date;
  type: 'high' | 'low';
  height: number; // Relative height (0-100)
  lunarPhase: string;
}

export interface TideHeightPoint {
  time: Date;
  height: number; // Relative height (0-100)
  trend: 'rising' | 'falling' | 'slack';
}

export interface DailyTides {
  date: Date;
  events: TideEvent[];
  springTide: boolean; // Strong tides during new/full moon
  neapTide: boolean;   // Weak tides during quarter moons
  moonPhase: string;
  tidalRange: 'spring' | 'neap' | 'normal';
}

// Average time between successive high tides (lunar semidiurnal)
const TIDAL_PERIOD_HOURS = 12.42; // Hours between high tides
const LUNAR_DAY_HOURS = 24.84;    // Hours for moon to return to same position

// Moon's transit delay from previous day (approximately 50 minutes)
const DAILY_MOON_DELAY_MINUTES = 50;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getDayOfYear(date: Date) {
  return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
}

function getModelForDate(
  date: Date,
  highTideOffset: number,
  portFactor: number
): {
  startOfDay: Date;
  moonPhaseNameTr: string;
  isSpringTide: boolean;
  isNeapTide: boolean;
  tidalRange: 'spring' | 'neap' | 'normal';
  baseAmplitude: number;
  firstHighTideHours: number; // hours after startOfDay (normalized 0..TIDAL_PERIOD_HOURS)
} {
  const moonPhase = getMoonPhase(date);

  // Determine if spring or neap tide based on moon phase
  const isSpringTide =
    moonPhase.phase === 'new' ||
    moonPhase.phase === 'full' ||
    moonPhase.age < 2 ||
    (moonPhase.age > 13.5 && moonPhase.age < 16.5);
  const isNeapTide =
    moonPhase.phase === 'first-quarter' ||
    moonPhase.phase === 'last-quarter' ||
    (moonPhase.age > 6 && moonPhase.age < 9) ||
    (moonPhase.age > 21 && moonPhase.age < 24);

  // Calculate base amplitude based on lunar phase
  let baseAmplitude = 50; // Normal amplitude
  if (isSpringTide) {
    baseAmplitude = 75; // Higher during spring tides
  } else if (isNeapTide) {
    baseAmplitude = 30; // Lower during neap tides
  }

  // Apply port factor
  baseAmplitude *= portFactor;

  // Simplified moon transit time model
  const dayOfYear = getDayOfYear(date);
  const moonTransitMinutes = (dayOfYear * DAILY_MOON_DELAY_MINUTES) % (24 * 60);

  // First high tide of the day (relative to start of day)
  let firstHighTideHours = moonTransitMinutes / 60 + highTideOffset;

  // Normalize within one tidal period.
  while (firstHighTideHours < 0) firstHighTideHours += TIDAL_PERIOD_HOURS;
  while (firstHighTideHours >= TIDAL_PERIOD_HOURS) firstHighTideHours -= TIDAL_PERIOD_HOURS;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  return {
    startOfDay,
    moonPhaseNameTr: moonPhase.nameTr,
    isSpringTide,
    isNeapTide,
    tidalRange: isSpringTide ? 'spring' : isNeapTide ? 'neap' : 'normal',
    baseAmplitude,
    firstHighTideHours,
  };
}

function heightAtHoursSinceStart(
  hoursFromStart: number,
  baseAmplitude: number,
  firstHighTideHours: number
): { height: number; trend: 'rising' | 'falling' | 'slack' } {
  // Cosine model: peak at firstHighTideHours, trough half-period later.
  const x = (hoursFromStart - firstHighTideHours) / TIDAL_PERIOD_HOURS;
  const angle = 2 * Math.PI * x;
  const raw = 50 + baseAmplitude * Math.cos(angle);
  const height = clamp(raw, 0, 100);

  // derivative sign indicates rising/falling; around sin(angle)=0 it's slack.
  const s = Math.sin(angle);
  const eps = 1e-6;
  const trend: 'rising' | 'falling' | 'slack' = Math.abs(s) < eps ? 'slack' : s < 0 ? 'rising' : 'falling';

  return { height: Math.round(height), trend };
}

// Calculate tide events for a given date and location
export function calculateDailyTides(
  date: Date,
  highTideOffset: number = 0, // Hours after moon transit for high tide
  portFactor: number = 1.0    // Port-specific amplitude factor
): DailyTides {
  const model = getModelForDate(date, highTideOffset, portFactor);

  // Generate tide events (2 high, 2 low)
  const events: TideEvent[] = [];
  for (let i = 0; i < 4; i++) {
    const isHigh = i % 2 === 0;
    const hoursFromStart = model.firstHighTideHours + (i * TIDAL_PERIOD_HOURS / 2);
    
    if (hoursFromStart < 24) {
      const eventTime = new Date(model.startOfDay);
      eventTime.setMinutes(eventTime.getMinutes() + Math.round(hoursFromStart * 60));
      
      const height = 50 + (isHigh ? model.baseAmplitude : -model.baseAmplitude);
      
      events.push({
        time: eventTime,
        type: isHigh ? 'high' : 'low',
        height: Math.round(clamp(height, 0, 100)),
        lunarPhase: model.moonPhaseNameTr
      });
    }
  }
  
  // Sort by time
  events.sort((a, b) => a.time.getTime() - b.time.getTime());
  
  return {
    date,
    events,
    springTide: model.isSpringTide,
    neapTide: model.isNeapTide,
    moonPhase: model.moonPhaseNameTr,
    tidalRange: model.tidalRange,
  };
}

// Relative tide height at an arbitrary time (same simplified model).
export function calculateTideHeightAt(
  dateTime: Date,
  highTideOffset: number = 0,
  portFactor: number = 1.0
): TideHeightPoint {
  const model = getModelForDate(dateTime, highTideOffset, portFactor);
  const hoursFromStart = (dateTime.getTime() - model.startOfDay.getTime()) / (1000 * 60 * 60);
  const { height, trend } = heightAtHoursSinceStart(hoursFromStart, model.baseAmplitude, model.firstHighTideHours);
  return { time: new Date(dateTime), height, trend };
}

// Hourly (or step-based) tide table for a given date.
export function generateTideTableForDay(
  date: Date,
  highTideOffset: number = 0,
  portFactor: number = 1.0,
  stepMinutes: number = 60
): TideHeightPoint[] {
  const model = getModelForDate(date, highTideOffset, portFactor);
  const step = Math.max(5, Math.round(stepMinutes));
  const points: TideHeightPoint[] = [];

  for (let minutes = 0; minutes < 24 * 60; minutes += step) {
    const t = new Date(model.startOfDay);
    t.setMinutes(t.getMinutes() + minutes);
    const hoursFromStart = minutes / 60;
    const { height, trend } = heightAtHoursSinceStart(hoursFromStart, model.baseAmplitude, model.firstHighTideHours);
    points.push({ time: t, height, trend });
  }

  return points;
}

// Calculate tides for a week
export function calculateWeeklyTides(
  startDate: Date,
  highTideOffset: number = 0,
  portFactor: number = 1.0
): DailyTides[] {
  const weekTides: DailyTides[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    weekTides.push(calculateDailyTides(date, highTideOffset, portFactor));
  }
  
  return weekTides;
}

// Common Turkish ports with their tidal characteristics
export interface PortInfo {
  name: string;
  highTideOffset: number; // Hours after moon transit
  tidalRange: string;     // Description
  factor: number;         // Amplitude factor
}

export const turkishPorts: PortInfo[] = [
  { name: "İstanbul Boğazı", highTideOffset: 2.5, tidalRange: "20-40 cm", factor: 0.4 },
  { name: "İzmir Körfezi", highTideOffset: 3.0, tidalRange: "15-30 cm", factor: 0.3 },
  { name: "Antalya", highTideOffset: 2.8, tidalRange: "20-35 cm", factor: 0.35 },
  { name: "Mersin", highTideOffset: 3.2, tidalRange: "15-25 cm", factor: 0.25 },
  { name: "Trabzon", highTideOffset: 2.0, tidalRange: "10-20 cm", factor: 0.2 },
  { name: "Çanakkale Boğazı", highTideOffset: 2.3, tidalRange: "25-45 cm", factor: 0.45 },
  { name: "Akdeniz (Genel)", highTideOffset: 3.0, tidalRange: "20-40 cm", factor: 0.4 },
  { name: "Karadeniz (Genel)", highTideOffset: 2.5, tidalRange: "10-25 cm", factor: 0.25 },
  { name: "Atlantik Kıyıları", highTideOffset: 1.5, tidalRange: "2-6 m", factor: 1.5 },
  { name: "Manş Denizi", highTideOffset: 1.0, tidalRange: "4-12 m", factor: 2.5 },
];

// Get next significant tide event
export function getNextTideEvent(fromDate: Date = new Date()): TideEvent | null {
  const today = calculateDailyTides(fromDate);
  const tomorrow = calculateDailyTides(new Date(fromDate.getTime() + 24 * 60 * 60 * 1000));
  
  const allEvents = [...today.events, ...tomorrow.events];
  
  for (const event of allEvents) {
    if (event.time > fromDate) {
      return event;
    }
  }
  
  return null;
}

// Format time as HH:MM
export function formatTideTime(date: Date): string {
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

// Get tidal strength description
export function getTidalStrength(tidalRange: 'spring' | 'neap' | 'normal'): { label: string; color: string; description: string } {
  switch (tidalRange) {
    case 'spring':
      return {
        label: 'Sizigi (Güçlü)',
        color: 'text-red-500',
        description: 'Yeni ay veya dolunay döneminde en güçlü gelgitler oluşur'
      };
    case 'neap':
      return {
        label: 'Kuadratur (Zayıf)',
        color: 'text-blue-500',
        description: 'İlk veya son dördün döneminde zayıf gelgitler oluşur'
      };
    default:
      return {
        label: 'Normal',
        color: 'text-gray-500',
        description: 'Orta şiddette gelgit aktivitesi'
      };
  }
}

// -----------------------------------------------------------------------------
// Tide Calculation Trainer helpers (Educational / simulation)
// -----------------------------------------------------------------------------

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
  fractionOfRange: number; // 0..1 (factor)
};

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

/**
 * Height of Tide (HOT) at a query time based on the rule of twelfths.
 * Educational use: this is an approximation, not a harmonic prediction.
 */
export function calculateHeightOfTideAtTime(input: HeightOfTideInput): HeightOfTideResult {
  const { lowWaterTimeUtc, lowWaterHeightM, highWaterTimeUtc, highWaterHeightM, queryTimeUtc } = input;
  const tLW = lowWaterTimeUtc.getTime();
  const tHW = highWaterTimeUtc.getTime();
  const tq = queryTimeUtc.getTime();
  if (!(Number.isFinite(lowWaterHeightM) && Number.isFinite(highWaterHeightM))) throw new Error("Invalid tide heights");
  if (!(Number.isFinite(tLW) && Number.isFinite(tHW) && Number.isFinite(tq))) throw new Error("Invalid times");
  if (tLW === tHW) throw new Error("LW and HW times must differ");

  const isRisingSegment = tLW < tHW;

  // Determine whether query is in the LW->HW segment or HW->LW segment by assuming symmetry.
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
      endTime = tHW + (tHW - tLW);
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

export type TrainerTideTableRow = {
  timeUtc: Date;
  factor: number; // 0..1
  deltaHM: number; // m
  hotM: number; // m
};

export function generateTrainerTideTableLWtoHW(input: {
  lowWaterTimeUtc: Date;
  lowWaterHeightM: number;
  highWaterTimeUtc: Date;
  highWaterHeightM: number;
  stepMinutes?: number;
}): TrainerTideTableRow[] {
  const { lowWaterTimeUtc, lowWaterHeightM, highWaterTimeUtc, highWaterHeightM } = input;
  const stepMinutes = Math.max(1, Math.round(input.stepMinutes ?? 10));
  const tLW = lowWaterTimeUtc.getTime();
  const tHW = highWaterTimeUtc.getTime();
  if (!Number.isFinite(tLW) || !Number.isFinite(tHW)) throw new Error("Invalid times");
  if (!Number.isFinite(lowWaterHeightM) || !Number.isFinite(highWaterHeightM)) throw new Error("Invalid heights");
  if (tHW <= tLW) throw new Error("HW must be after LW for LW→HW table");

  const rangeM = highWaterHeightM - lowWaterHeightM;
  const rows: TrainerTideTableRow[] = [];
  for (let t = tLW; t <= tHW; t += stepMinutes * 60 * 1000) {
    const q = new Date(t);
    const res = calculateHeightOfTideAtTime({
      lowWaterTimeUtc,
      lowWaterHeightM,
      highWaterTimeUtc,
      highWaterHeightM,
      queryTimeUtc: q,
    });
    const factor = Math.max(0, Math.min(1, res.fractionOfRange));
    const deltaHM = factor * rangeM;
    const hotM = lowWaterHeightM + deltaHM;
    rows.push({ timeUtc: q, factor, deltaHM, hotM });
  }

  // Ensure the HW row exists exactly (for highlighting/slider mapping)
  if (rows.length === 0 || rows[rows.length - 1].timeUtc.getTime() !== tHW) {
    const q = new Date(tHW);
    const res = calculateHeightOfTideAtTime({
      lowWaterTimeUtc,
      lowWaterHeightM,
      highWaterTimeUtc,
      highWaterHeightM,
      queryTimeUtc: q,
    });
    const factor = Math.max(0, Math.min(1, res.fractionOfRange));
    rows.push({
      timeUtc: q,
      factor,
      deltaHM: factor * rangeM,
      hotM: lowWaterHeightM + factor * rangeM,
    });
  }

  return rows;
}
