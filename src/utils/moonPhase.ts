// Moon Phase Calculator for 2025

export interface MoonPhase {
  phase: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 
         'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
  name: string;
  nameTr: string;
  illumination: number; // 0-100%
  age: number; // Days since new moon
  emoji: string;
}

// Known new moon dates for 2025 (approximate)
const NEW_MOONS_2025 = [
  new Date('2025-01-29T12:36:00Z'),
  new Date('2025-02-28T00:45:00Z'),
  new Date('2025-03-29T10:58:00Z'),
  new Date('2025-04-27T19:31:00Z'),
  new Date('2025-05-27T03:02:00Z'),
  new Date('2025-06-25T10:32:00Z'),
  new Date('2025-07-24T19:11:00Z'),
  new Date('2025-08-23T06:07:00Z'),
  new Date('2025-09-21T19:54:00Z'),
  new Date('2025-10-21T12:25:00Z'),
  new Date('2025-11-20T06:47:00Z'),
  new Date('2025-12-20T01:43:00Z'),
];

// Synodic month (new moon to new moon) average
const SYNODIC_MONTH = 29.53059;

export function getMoonPhase(date: Date): MoonPhase {
  // Find the most recent new moon before or on this date
  let lastNewMoon: Date | null = null;
  
  for (let i = NEW_MOONS_2025.length - 1; i >= 0; i--) {
    if (NEW_MOONS_2025[i] <= date) {
      lastNewMoon = NEW_MOONS_2025[i];
      break;
    }
  }
  
  // If date is before first new moon of 2025, use December 2024 new moon
  if (!lastNewMoon) {
    lastNewMoon = new Date('2024-12-30T22:27:00Z');
  }
  
  // Calculate days since last new moon
  const daysSinceNewMoon = (date.getTime() - lastNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const age = daysSinceNewMoon % SYNODIC_MONTH;
  
  // Calculate illumination (simplified cosine model)
  const illumination = Math.round((1 - Math.cos(2 * Math.PI * age / SYNODIC_MONTH)) / 2 * 100);
  
  // Determine phase based on age
  let phase: MoonPhase['phase'];
  let name: string;
  let nameTr: string;
  let emoji: string;
  
  if (age < 1.85) {
    phase = 'new';
    name = 'New Moon';
    nameTr = 'Yeni Ay';
    emoji = '🌑';
  } else if (age < 7.38) {
    phase = 'waxing-crescent';
    name = 'Waxing Crescent';
    nameTr = 'Hilal (Büyüyen)';
    emoji = '🌒';
  } else if (age < 9.23) {
    phase = 'first-quarter';
    name = 'First Quarter';
    nameTr = 'İlk Dördün';
    emoji = '🌓';
  } else if (age < 14.77) {
    phase = 'waxing-gibbous';
    name = 'Waxing Gibbous';
    nameTr = 'Şişkin Ay (Büyüyen)';
    emoji = '🌔';
  } else if (age < 16.61) {
    phase = 'full';
    name = 'Full Moon';
    nameTr = 'Dolunay';
    emoji = '🌕';
  } else if (age < 22.15) {
    phase = 'waning-gibbous';
    name = 'Waning Gibbous';
    nameTr = 'Şişkin Ay (Küçülen)';
    emoji = '🌖';
  } else if (age < 24.0) {
    phase = 'last-quarter';
    name = 'Last Quarter';
    nameTr = 'Son Dördün';
    emoji = '🌗';
  } else {
    phase = 'waning-crescent';
    name = 'Waning Crescent';
    nameTr = 'Hilal (Küçülen)';
    emoji = '🌘';
  }
  
  return {
    phase,
    name,
    nameTr,
    illumination,
    age: Math.round(age * 10) / 10,
    emoji
  };
}

// Get major moon phases for a given month in 2025
export interface MajorMoonPhase {
  date: Date;
  phase: 'new' | 'first-quarter' | 'full' | 'last-quarter';
  nameTr: string;
  emoji: string;
}

// 2025 Moon phases calendar (major phases only)
export const MOON_PHASES_2025: MajorMoonPhase[] = [
  // January
  { date: new Date('2025-01-06T23:56:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  { date: new Date('2025-01-13T22:27:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-01-21T20:31:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-01-29T12:36:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  // February
  { date: new Date('2025-02-05T08:02:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  { date: new Date('2025-02-12T13:53:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-02-20T17:33:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-02-28T00:45:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  // March
  { date: new Date('2025-03-06T16:32:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  { date: new Date('2025-03-14T06:55:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-03-22T11:30:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-03-29T10:58:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  // April
  { date: new Date('2025-04-05T02:15:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  { date: new Date('2025-04-13T00:22:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-04-21T01:36:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-04-27T19:31:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  // May
  { date: new Date('2025-05-04T13:52:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  { date: new Date('2025-05-12T16:56:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-05-20T11:59:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-05-27T03:02:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  // June
  { date: new Date('2025-06-03T03:41:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  { date: new Date('2025-06-11T07:44:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-06-18T19:19:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-06-25T10:32:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  // July
  { date: new Date('2025-07-02T19:30:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  { date: new Date('2025-07-10T20:37:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-07-18T00:38:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-07-24T19:11:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  // August
  { date: new Date('2025-08-01T12:41:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  { date: new Date('2025-08-09T07:55:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-08-16T05:12:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-08-23T06:07:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  { date: new Date('2025-08-31T06:25:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  // September
  { date: new Date('2025-09-07T18:09:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-09-14T10:33:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-09-21T19:54:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  { date: new Date('2025-09-29T23:54:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  // October
  { date: new Date('2025-10-07T03:48:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-10-13T18:13:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-10-21T12:25:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  { date: new Date('2025-10-29T16:21:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  // November
  { date: new Date('2025-11-05T13:19:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-11-12T05:28:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-11-20T06:47:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  { date: new Date('2025-11-28T06:59:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
  // December
  { date: new Date('2025-12-04T23:14:00Z'), phase: 'full', nameTr: 'Dolunay', emoji: '🌕' },
  { date: new Date('2025-12-11T20:52:00Z'), phase: 'last-quarter', nameTr: 'Son Dördün', emoji: '🌗' },
  { date: new Date('2025-12-20T01:43:00Z'), phase: 'new', nameTr: 'Yeni Ay', emoji: '🌑' },
  { date: new Date('2025-12-27T19:10:00Z'), phase: 'first-quarter', nameTr: 'İlk Dördün', emoji: '🌓' },
];

// Get upcoming moon phases from a given date
export function getUpcomingMoonPhases(fromDate: Date, count: number = 4): MajorMoonPhase[] {
  return MOON_PHASES_2025
    .filter(phase => phase.date >= fromDate)
    .slice(0, count);
}

// Get moon phases for a specific month
export function getMoonPhasesForMonth(year: number, month: number): MajorMoonPhase[] {
  return MOON_PHASES_2025.filter(phase => {
    const d = phase.date;
    return d.getFullYear() === year && d.getMonth() === month;
  });
}
