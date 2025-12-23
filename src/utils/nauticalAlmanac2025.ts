import almanac2025 from "@/data/almanac/sun_aries_2025_hourly.json";

type Almanac2025Payload = {
  header: {
    year: number;
    start_date: string;
    end_date: string;
    step: string;
    ephemeris: string;
    sidereal_time: string;
    units: string;
    records_per_day: number;
    record_fields: ["ghaSunDeg", "decSunDeg", "ghaAriesDeg"];
  };
  // index = dayOfYear(0-based) * 24 + utcHour(0..23)
  records: [number, number, number][];
};

const DATA = almanac2025 as unknown as Almanac2025Payload;

export type SunAriesAlmanacResult = {
  ghaSunDeg: number;
  decSunDeg: number;
  ghaAriesDeg: number;
  source: "nautical-almanac-2025-table";
};

function normalizeAngle360(deg: number): number {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpAngleDeg(aDeg: number, bDeg: number, t: number): number {
  // interpolate shortest direction around 0..360
  const a = normalizeAngle360(aDeg);
  const b = normalizeAngle360(bDeg);
  const delta = ((b - a + 540) % 360) - 180; // -180..+180
  return normalizeAngle360(a + delta * t);
}

function utcDayOfYear(d: Date): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  const cur = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0);
  return Math.floor((cur - start) / 86400000);
}

function recordAt(dayOfYear0: number, utcHour: number): [number, number, number] {
  const idx = dayOfYear0 * 24 + utcHour;
  const rec = DATA.records[idx];
  if (!rec) throw new Error("Almanac record out of range");
  return rec;
}

/**
 * Real (ephemeris-based) 2025 hourly almanac (Sun + Aries) with linear interpolation within the hour.
 * Returns null outside 2025.
 *
 * - lon convention is NOT applied here (this is pure GHA/Dec at Greenwich).
 * - LHA can be derived as LHA = GHA - lonE (east-positive lon).
 */
export function getSunAriesAlmanac2025Utc(dateUtc: Date): SunAriesAlmanacResult | null {
  const year = dateUtc.getUTCFullYear();
  if (year !== 2025) return null;

  const day = utcDayOfYear(dateUtc);
  const hour = dateUtc.getUTCHours();
  const minute = dateUtc.getUTCMinutes();
  const second = dateUtc.getUTCSeconds();
  const ms = dateUtc.getUTCMilliseconds();

  const t = (minute * 60 + second + ms / 1000) / 3600;
  const [ghaSun0, dec0, ghaAries0] = recordAt(day, hour);

  if (t <= 1e-12) {
    return {
      ghaSunDeg: ghaSun0,
      decSunDeg: dec0,
      ghaAriesDeg: ghaAries0,
      source: "nautical-almanac-2025-table",
    };
  }

  // Next hour (may roll to next day/year)
  const next = new Date(dateUtc.getTime());
  next.setUTCMinutes(0, 0, 0);
  next.setUTCHours(hour + 1);

  // If the "next" time rolls into 2026, we can't interpolate; just return the current hour.
  if (next.getUTCFullYear() !== 2025) {
    return {
      ghaSunDeg: ghaSun0,
      decSunDeg: dec0,
      ghaAriesDeg: ghaAries0,
      source: "nautical-almanac-2025-table",
    };
  }

  const day1 = utcDayOfYear(next);
  const hour1 = next.getUTCHours();
  const [ghaSun1, dec1, ghaAries1] = recordAt(day1, hour1);

  return {
    ghaSunDeg: lerpAngleDeg(ghaSun0, ghaSun1, t),
    decSunDeg: lerp(dec0, dec1, t),
    ghaAriesDeg: lerpAngleDeg(ghaAries0, ghaAries1, t),
    source: "nautical-almanac-2025-table",
  };
}

export type DailySunAriesAlmanacRow = {
  utcHour: number;
  ghaSunDeg: number;
  decSunDeg: number;
  ghaAriesDeg: number;
};

export function getDailySunAriesAlmanac2025Utc(dateUtc: Date): DailySunAriesAlmanacRow[] | null {
  if (dateUtc.getUTCFullYear() !== 2025) return null;
  const day = utcDayOfYear(dateUtc);
  const rows: DailySunAriesAlmanacRow[] = [];
  for (let h = 0; h < 24; h++) {
    const [ghaSunDeg, decSunDeg, ghaAriesDeg] = recordAt(day, h);
    rows.push({ utcHour: h, ghaSunDeg, decSunDeg, ghaAriesDeg });
  }
  return rows;
}

