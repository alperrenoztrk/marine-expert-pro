// 2025 Navigation Stars - SHA and Declination values
// Based on Nautical Almanac 2025

export interface NavigationStar {
  name: string;
  sha: number; // Sidereal Hour Angle (degrees)
  dec: number; // Declination (degrees, North positive)
  magnitude: number;
  constellation: string;
}

export const navigationStars: NavigationStar[] = [
  // First magnitude stars
  { name: "Alpheratz", sha: 358.0, dec: 29.1, magnitude: 2.1, constellation: "Andromeda" },
  { name: "Ankaa", sha: 353.5, dec: -42.3, magnitude: 2.4, constellation: "Phoenix" },
  { name: "Schedar", sha: 350.0, dec: 56.5, magnitude: 2.2, constellation: "Cassiopeia" },
  { name: "Diphda", sha: 349.0, dec: -17.9, magnitude: 2.0, constellation: "Cetus" },
  { name: "Achernar", sha: 335.5, dec: -57.2, magnitude: 0.5, constellation: "Eridanus" },
  { name: "Hamal", sha: 328.0, dec: 23.5, magnitude: 2.0, constellation: "Aries" },
  { name: "Polaris", sha: 319.5, dec: 89.3, magnitude: 2.0, constellation: "Ursa Minor" },
  { name: "Acamar", sha: 315.5, dec: -40.3, magnitude: 3.2, constellation: "Eridanus" },
  { name: "Menkar", sha: 314.5, dec: 4.1, magnitude: 2.5, constellation: "Cetus" },
  { name: "Mirfak", sha: 309.0, dec: 49.9, magnitude: 1.8, constellation: "Perseus" },
  { name: "Aldebaran", sha: 291.0, dec: 16.5, magnitude: 0.9, constellation: "Taurus" },
  { name: "Rigel", sha: 281.5, dec: -8.2, magnitude: 0.1, constellation: "Orion" },
  { name: "Capella", sha: 280.5, dec: 46.0, magnitude: 0.1, constellation: "Auriga" },
  { name: "Bellatrix", sha: 278.5, dec: 6.4, magnitude: 1.6, constellation: "Orion" },
  { name: "Elnath", sha: 278.5, dec: 28.6, magnitude: 1.7, constellation: "Taurus" },
  { name: "Alnilam", sha: 276.0, dec: -1.2, magnitude: 1.7, constellation: "Orion" },
  { name: "Betelgeuse", sha: 271.0, dec: 7.4, magnitude: 0.5, constellation: "Orion" },
  { name: "Canopus", sha: 264.0, dec: -52.7, magnitude: -0.7, constellation: "Carina" },
  { name: "Sirius", sha: 258.5, dec: -16.7, magnitude: -1.5, constellation: "Canis Major" },
  { name: "Adhara", sha: 255.0, dec: -29.0, magnitude: 1.5, constellation: "Canis Major" },
  { name: "Procyon", sha: 245.0, dec: 5.2, magnitude: 0.4, constellation: "Canis Minor" },
  { name: "Pollux", sha: 243.5, dec: 28.0, magnitude: 1.1, constellation: "Gemini" },
  { name: "Avior", sha: 234.5, dec: -59.5, magnitude: 1.9, constellation: "Carina" },
  { name: "Suhail", sha: 223.0, dec: -43.4, magnitude: 2.2, constellation: "Vela" },
  { name: "Miaplacidus", sha: 221.5, dec: -69.8, magnitude: 1.7, constellation: "Carina" },
  { name: "Alphard", sha: 218.0, dec: -8.7, magnitude: 2.0, constellation: "Hydra" },
  { name: "Regulus", sha: 208.0, dec: 12.0, magnitude: 1.4, constellation: "Leo" },
  { name: "Dubhe", sha: 194.0, dec: 61.8, magnitude: 1.8, constellation: "Ursa Major" },
  { name: "Denebola", sha: 182.5, dec: 14.6, magnitude: 2.1, constellation: "Leo" },
  { name: "Gienah", sha: 176.0, dec: -17.5, magnitude: 2.6, constellation: "Corvus" },
  { name: "Acrux", sha: 173.5, dec: -63.1, magnitude: 0.8, constellation: "Crux" },
  { name: "Gacrux", sha: 172.0, dec: -57.1, magnitude: 1.6, constellation: "Crux" },
  { name: "Alioth", sha: 166.5, dec: 55.9, magnitude: 1.8, constellation: "Ursa Major" },
  { name: "Spica", sha: 158.5, dec: -11.2, magnitude: 1.0, constellation: "Virgo" },
  { name: "Alkaid", sha: 153.0, dec: 49.3, magnitude: 1.9, constellation: "Ursa Major" },
  { name: "Hadar", sha: 149.0, dec: -60.4, magnitude: 0.6, constellation: "Centaurus" },
  { name: "Menkent", sha: 148.5, dec: -36.4, magnitude: 2.1, constellation: "Centaurus" },
  { name: "Arcturus", sha: 146.0, dec: 19.2, magnitude: -0.1, constellation: "Boötes" },
  { name: "Rigil Kent", sha: 140.0, dec: -60.8, magnitude: -0.3, constellation: "Centaurus" },
  { name: "Zubenelgenubi", sha: 137.5, dec: -16.0, magnitude: 2.8, constellation: "Libra" },
  { name: "Kochab", sha: 137.5, dec: 74.2, magnitude: 2.1, constellation: "Ursa Minor" },
  { name: "Alphecca", sha: 126.5, dec: 26.7, magnitude: 2.2, constellation: "Corona Borealis" },
  { name: "Antares", sha: 112.5, dec: -26.4, magnitude: 1.0, constellation: "Scorpius" },
  { name: "Atria", sha: 108.0, dec: -69.0, magnitude: 1.9, constellation: "Triangulum Australe" },
  { name: "Sabik", sha: 102.5, dec: -15.7, magnitude: 2.4, constellation: "Ophiuchus" },
  { name: "Shaula", sha: 96.5, dec: -37.1, magnitude: 1.6, constellation: "Scorpius" },
  { name: "Rasalhague", sha: 96.0, dec: 12.6, magnitude: 2.1, constellation: "Ophiuchus" },
  { name: "Eltanin", sha: 91.0, dec: 51.5, magnitude: 2.2, constellation: "Draco" },
  { name: "Kaus Australis", sha: 84.0, dec: -34.4, magnitude: 1.8, constellation: "Sagittarius" },
  { name: "Vega", sha: 80.5, dec: 38.8, magnitude: 0.0, constellation: "Lyra" },
  { name: "Nunki", sha: 76.0, dec: -26.3, magnitude: 2.0, constellation: "Sagittarius" },
  { name: "Altair", sha: 62.5, dec: 8.9, magnitude: 0.8, constellation: "Aquila" },
  { name: "Peacock", sha: 53.5, dec: -56.7, magnitude: 1.9, constellation: "Pavo" },
  { name: "Deneb", sha: 49.5, dec: 45.3, magnitude: 1.3, constellation: "Cygnus" },
  { name: "Enif", sha: 34.0, dec: 9.9, magnitude: 2.4, constellation: "Pegasus" },
  { name: "Alnair", sha: 28.0, dec: -47.0, magnitude: 1.7, constellation: "Grus" },
  { name: "Fomalhaut", sha: 15.5, dec: -29.6, magnitude: 1.2, constellation: "Piscis Austrinus" },
  { name: "Markab", sha: 14.0, dec: 15.2, magnitude: 2.5, constellation: "Pegasus" },
];

// 2025 Planet Data - Approximate positions for mid-year (updates needed for precise navigation)
export interface PlanetData {
  name: string;
  symbol: string;
  color: string;
}

export const planets: PlanetData[] = [
  { name: "Venus", symbol: "♀", color: "#E6E6FA" },
  { name: "Mars", symbol: "♂", color: "#FF6347" },
  { name: "Jupiter", symbol: "♃", color: "#F4A460" },
  { name: "Saturn", symbol: "♄", color: "#DEB887" },
];

// 2025 Planet GHA and Dec data (approximate daily values for selected dates)
export interface PlanetPosition {
  date: string; // YYYY-MM-DD
  gha: number; // Greenwich Hour Angle at 00:00 UT
  dec: number; // Declination
  hp?: number; // Horizontal Parallax (for Venus and Mars)
}

export interface PlanetEphemeris {
  name: string;
  positions: PlanetPosition[];
}

// Sample 2025 planet ephemeris data (first day of each month)
export const planetEphemeris2025: PlanetEphemeris[] = [
  {
    name: "Venus",
    positions: [
      { date: "2025-01-01", gha: 142.5, dec: -19.8, hp: 0.1 },
      { date: "2025-02-01", gha: 178.3, dec: -5.2, hp: 0.1 },
      { date: "2025-03-01", gha: 215.6, dec: 12.4, hp: 0.1 },
      { date: "2025-04-01", gha: 255.2, dec: 24.8, hp: 0.2 },
      { date: "2025-05-01", gha: 298.7, dec: 27.3, hp: 0.2 },
      { date: "2025-06-01", gha: 342.1, dec: 18.6, hp: 0.3 },
      { date: "2025-07-01", gha: 18.4, dec: 3.2, hp: 0.3 },
      { date: "2025-08-01", gha: 52.8, dec: -12.5, hp: 0.2 },
      { date: "2025-09-01", gha: 86.3, dec: -21.8, hp: 0.2 },
      { date: "2025-10-01", gha: 118.9, dec: -23.4, hp: 0.1 },
      { date: "2025-11-01", gha: 152.4, dec: -18.2, hp: 0.1 },
      { date: "2025-12-01", gha: 186.7, dec: -6.8, hp: 0.1 },
    ]
  },
  {
    name: "Mars",
    positions: [
      { date: "2025-01-01", gha: 285.3, dec: 23.6, hp: 0.1 },
      { date: "2025-02-01", gha: 318.7, dec: 21.2, hp: 0.1 },
      { date: "2025-03-01", gha: 352.4, dec: 14.8, hp: 0.1 },
      { date: "2025-04-01", gha: 25.6, dec: 5.2, hp: 0.1 },
      { date: "2025-05-01", gha: 58.9, dec: -5.8, hp: 0.1 },
      { date: "2025-06-01", gha: 92.3, dec: -15.4, hp: 0.1 },
      { date: "2025-07-01", gha: 125.8, dec: -21.6, hp: 0.1 },
      { date: "2025-08-01", gha: 159.2, dec: -23.8, hp: 0.1 },
      { date: "2025-09-01", gha: 192.7, dec: -21.4, hp: 0.1 },
      { date: "2025-10-01", gha: 226.1, dec: -14.8, hp: 0.1 },
      { date: "2025-11-01", gha: 259.6, dec: -4.6, hp: 0.1 },
      { date: "2025-12-01", gha: 293.2, dec: 7.2, hp: 0.1 },
    ]
  },
  {
    name: "Jupiter",
    positions: [
      { date: "2025-01-01", gha: 45.2, dec: 22.8 },
      { date: "2025-02-01", gha: 48.6, dec: 22.4 },
      { date: "2025-03-01", gha: 54.3, dec: 21.6 },
      { date: "2025-04-01", gha: 62.8, dec: 20.2 },
      { date: "2025-05-01", gha: 73.5, dec: 18.4 },
      { date: "2025-06-01", gha: 85.2, dec: 16.2 },
      { date: "2025-07-01", gha: 96.8, dec: 13.8 },
      { date: "2025-08-01", gha: 106.4, dec: 11.4 },
      { date: "2025-09-01", gha: 112.7, dec: 9.6 },
      { date: "2025-10-01", gha: 115.2, dec: 8.8 },
      { date: "2025-11-01", gha: 113.8, dec: 9.2 },
      { date: "2025-12-01", gha: 108.6, dec: 10.8 },
    ]
  },
  {
    name: "Saturn",
    positions: [
      { date: "2025-01-01", gha: 322.4, dec: -8.6 },
      { date: "2025-02-01", gha: 328.7, dec: -7.2 },
      { date: "2025-03-01", gha: 336.2, dec: -5.4 },
      { date: "2025-04-01", gha: 344.8, dec: -3.2 },
      { date: "2025-05-01", gha: 354.3, dec: -0.8 },
      { date: "2025-06-01", gha: 4.2, dec: 1.6 },
      { date: "2025-07-01", gha: 13.8, dec: 3.8 },
      { date: "2025-08-01", gha: 22.4, dec: 5.6 },
      { date: "2025-09-01", gha: 28.6, dec: 6.8 },
      { date: "2025-10-01", gha: 31.2, dec: 7.2 },
      { date: "2025-11-01", gha: 30.4, dec: 6.8 },
      { date: "2025-12-01", gha: 26.8, dec: 5.8 },
    ]
  },
];

// 2025 Moon Ephemeris Data - Daily values with HP (Horizontal Parallax)
export interface MoonPosition {
  date: string;
  gha00: number; // GHA at 00:00 UT
  dec00: number; // Dec at 00:00 UT
  hp: number; // Horizontal Parallax in arc minutes
  sd: number; // Semi-diameter in arc minutes
  ghaDelta: number; // Hourly change in GHA (degrees)
  decDelta: number; // Hourly change in Dec (degrees)
}

// Moon data for first week of each month in 2025 (sample data)
export const moonEphemeris2025: MoonPosition[] = [
  // January 2025
  { date: "2025-01-01", gha00: 156.8, dec00: 18.4, hp: 54.2, sd: 14.8, ghaDelta: 14.32, decDelta: -0.42 },
  { date: "2025-01-02", gha00: 171.2, dec00: 14.8, hp: 54.6, sd: 14.9, ghaDelta: 14.35, decDelta: -0.48 },
  { date: "2025-01-03", gha00: 185.6, dec00: 10.2, hp: 55.1, sd: 15.0, ghaDelta: 14.38, decDelta: -0.52 },
  { date: "2025-01-04", gha00: 200.1, dec00: 5.4, hp: 55.6, sd: 15.2, ghaDelta: 14.42, decDelta: -0.54 },
  { date: "2025-01-05", gha00: 214.8, dec00: 0.2, hp: 56.2, sd: 15.3, ghaDelta: 14.46, decDelta: -0.52 },
  { date: "2025-01-06", gha00: 229.6, dec00: -4.8, hp: 56.8, sd: 15.5, ghaDelta: 14.50, decDelta: -0.48 },
  { date: "2025-01-07", gha00: 244.5, dec00: -9.6, hp: 57.4, sd: 15.6, ghaDelta: 14.54, decDelta: -0.42 },
  { date: "2025-01-15", gha00: 48.2, dec00: -25.4, hp: 60.8, sd: 16.6, ghaDelta: 14.82, decDelta: 0.28 },
  { date: "2025-01-22", gha00: 192.4, dec00: -8.2, hp: 58.2, sd: 15.9, ghaDelta: 14.58, decDelta: 0.52 },
  { date: "2025-01-29", gha00: 328.6, dec00: 22.4, hp: 54.8, sd: 14.9, ghaDelta: 14.28, decDelta: -0.32 },
  // February 2025
  { date: "2025-02-01", gha00: 12.4, dec00: 18.6, hp: 54.4, sd: 14.8, ghaDelta: 14.30, decDelta: -0.45 },
  { date: "2025-02-08", gha00: 118.6, dec00: -22.8, hp: 59.2, sd: 16.1, ghaDelta: 14.72, decDelta: 0.18 },
  { date: "2025-02-15", gha00: 228.4, dec00: 4.6, hp: 56.4, sd: 15.4, ghaDelta: 14.48, decDelta: 0.48 },
  { date: "2025-02-22", gha00: 342.8, dec00: 24.2, hp: 54.2, sd: 14.8, ghaDelta: 14.26, decDelta: -0.38 },
  // March 2025
  { date: "2025-03-01", gha00: 86.2, dec00: 12.4, hp: 55.8, sd: 15.2, ghaDelta: 14.42, decDelta: -0.52 },
  { date: "2025-03-08", gha00: 198.4, dec00: -18.6, hp: 58.6, sd: 16.0, ghaDelta: 14.68, decDelta: 0.24 },
  { date: "2025-03-15", gha00: 312.6, dec00: 12.8, hp: 55.2, sd: 15.0, ghaDelta: 14.38, decDelta: 0.42 },
  { date: "2025-03-22", gha00: 62.4, dec00: 22.6, hp: 54.6, sd: 14.9, ghaDelta: 14.32, decDelta: -0.42 },
  // April 2025
  { date: "2025-04-01", gha00: 168.2, dec00: 6.4, hp: 56.8, sd: 15.5, ghaDelta: 14.52, decDelta: -0.54 },
  { date: "2025-04-08", gha00: 282.6, dec00: -12.8, hp: 57.8, sd: 15.8, ghaDelta: 14.62, decDelta: 0.32 },
  { date: "2025-04-15", gha00: 38.4, dec00: 18.4, hp: 54.8, sd: 14.9, ghaDelta: 14.34, decDelta: 0.38 },
  { date: "2025-04-22", gha00: 148.6, dec00: 18.2, hp: 56.2, sd: 15.3, ghaDelta: 14.46, decDelta: -0.48 },
  // May 2025
  { date: "2025-05-01", gha00: 254.8, dec00: -2.4, hp: 57.4, sd: 15.6, ghaDelta: 14.56, decDelta: -0.52 },
  { date: "2025-05-08", gha00: 12.6, dec00: -6.8, hp: 56.8, sd: 15.5, ghaDelta: 14.52, decDelta: 0.42 },
  { date: "2025-05-15", gha00: 128.4, dec00: 22.4, hp: 55.2, sd: 15.0, ghaDelta: 14.38, decDelta: 0.28 },
  { date: "2025-05-22", gha00: 238.6, dec00: 12.6, hp: 57.2, sd: 15.6, ghaDelta: 14.54, decDelta: -0.52 },
  // June 2025
  { date: "2025-06-01", gha00: 342.4, dec00: -8.6, hp: 56.4, sd: 15.4, ghaDelta: 14.48, decDelta: -0.48 },
  { date: "2025-06-08", gha00: 98.6, dec00: 2.4, hp: 55.6, sd: 15.2, ghaDelta: 14.42, decDelta: 0.52 },
  { date: "2025-06-15", gha00: 212.4, dec00: 24.8, hp: 55.8, sd: 15.2, ghaDelta: 14.44, decDelta: 0.18 },
  { date: "2025-06-22", gha00: 324.6, dec00: 6.4, hp: 56.8, sd: 15.5, ghaDelta: 14.52, decDelta: -0.54 },
  // July 2025
  { date: "2025-07-01", gha00: 72.8, dec00: -14.2, hp: 55.4, sd: 15.1, ghaDelta: 14.40, decDelta: -0.42 },
  { date: "2025-07-08", gha00: 186.4, dec00: 8.6, hp: 56.2, sd: 15.3, ghaDelta: 14.46, decDelta: 0.48 },
  { date: "2025-07-15", gha00: 298.6, dec00: 26.2, hp: 56.4, sd: 15.4, ghaDelta: 14.48, decDelta: 0.08 },
  { date: "2025-07-22", gha00: 52.4, dec00: 0.2, hp: 56.2, sd: 15.3, ghaDelta: 14.46, decDelta: -0.52 },
  // August 2025
  { date: "2025-08-01", gha00: 162.6, dec00: -18.4, hp: 56.8, sd: 15.5, ghaDelta: 14.52, decDelta: -0.32 },
  { date: "2025-08-08", gha00: 274.8, dec00: 14.2, hp: 57.2, sd: 15.6, ghaDelta: 14.54, decDelta: 0.42 },
  { date: "2025-08-15", gha00: 28.4, dec00: 24.6, hp: 56.6, sd: 15.4, ghaDelta: 14.50, decDelta: -0.02 },
  { date: "2025-08-22", gha00: 142.6, dec00: -6.4, hp: 55.8, sd: 15.2, ghaDelta: 14.44, decDelta: -0.48 },
  // September 2025
  { date: "2025-09-01", gha00: 252.4, dec00: -22.6, hp: 58.2, sd: 15.9, ghaDelta: 14.64, decDelta: -0.18 },
  { date: "2025-09-08", gha00: 8.6, dec00: 18.4, hp: 57.8, sd: 15.8, ghaDelta: 14.62, decDelta: 0.32 },
  { date: "2025-09-15", gha00: 118.4, dec00: 20.2, hp: 56.4, sd: 15.4, ghaDelta: 14.48, decDelta: -0.12 },
  { date: "2025-09-22", gha00: 232.6, dec00: -12.8, hp: 56.2, sd: 15.3, ghaDelta: 14.46, decDelta: -0.42 },
  // October 2025
  { date: "2025-10-01", gha00: 342.8, dec00: -24.8, hp: 59.4, sd: 16.2, ghaDelta: 14.76, decDelta: -0.08 },
  { date: "2025-10-08", gha00: 98.4, dec00: 20.6, hp: 58.2, sd: 15.9, ghaDelta: 14.64, decDelta: 0.22 },
  { date: "2025-10-15", gha00: 208.6, dec00: 14.8, hp: 56.6, sd: 15.4, ghaDelta: 14.50, decDelta: -0.22 },
  { date: "2025-10-22", gha00: 322.4, dec00: -18.4, hp: 57.4, sd: 15.6, ghaDelta: 14.56, decDelta: -0.38 },
  // November 2025
  { date: "2025-11-01", gha00: 72.6, dec00: -24.2, hp: 60.2, sd: 16.4, ghaDelta: 14.84, decDelta: 0.02 },
  { date: "2025-11-08", gha00: 188.4, dec00: 22.4, hp: 58.6, sd: 16.0, ghaDelta: 14.68, decDelta: 0.12 },
  { date: "2025-11-15", gha00: 298.6, dec00: 8.2, hp: 56.4, sd: 15.4, ghaDelta: 14.48, decDelta: -0.32 },
  { date: "2025-11-22", gha00: 52.4, dec00: -22.6, hp: 58.8, sd: 16.0, ghaDelta: 14.70, decDelta: -0.28 },
  // December 2025
  { date: "2025-12-01", gha00: 162.8, dec00: -22.8, hp: 60.4, sd: 16.5, ghaDelta: 14.86, decDelta: 0.08 },
  { date: "2025-12-08", gha00: 278.6, dec00: 24.2, hp: 58.8, sd: 16.0, ghaDelta: 14.70, decDelta: 0.02 },
  { date: "2025-12-15", gha00: 28.4, dec00: 2.4, hp: 56.2, sd: 15.3, ghaDelta: 14.46, decDelta: -0.42 },
  { date: "2025-12-22", gha00: 142.6, dec00: -24.4, hp: 59.6, sd: 16.2, ghaDelta: 14.78, decDelta: -0.18 },
  { date: "2025-12-29", gha00: 252.4, dec00: -18.6, hp: 60.8, sd: 16.6, ghaDelta: 14.88, decDelta: 0.22 },
];

// Get Moon position for a specific date (finds closest available data)
export function getMoonPosition(date: Date): MoonPosition | null {
  const dateStr = date.toISOString().split('T')[0];
  
  // Try exact match first
  const exact = moonEphemeris2025.find(m => m.date === dateStr);
  if (exact) return exact;
  
  // Find closest date
  const targetTime = date.getTime();
  let closest: MoonPosition | null = null;
  let minDiff = Infinity;
  
  for (const pos of moonEphemeris2025) {
    const posTime = new Date(pos.date + 'T00:00:00Z').getTime();
    const diff = Math.abs(posTime - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = pos;
    }
  }
  
  return closest;
}

// Calculate Moon GHA for a specific hour
export function getMoonGhaAtHour(position: MoonPosition, hour: number): number {
  return (position.gha00 + position.ghaDelta * hour) % 360;
}

// Calculate Moon Dec for a specific hour
export function getMoonDecAtHour(position: MoonPosition, hour: number): number {
  return position.dec00 + position.decDelta * hour;
}

// Helper function to get planet position for a given date
export function getPlanetPosition(planetName: string, date: Date): PlanetPosition | null {
  const ephemeris = planetEphemeris2025.find(p => p.name === planetName);
  if (!ephemeris) return null;
  
  // Find the closest date
  const month = date.getMonth();
  
  // Get position for current month (simplified interpolation)
  if (month < ephemeris.positions.length) {
    return ephemeris.positions[month];
  }
  
  return ephemeris.positions[0];
}

// Format degrees to degrees/minutes format
export function formatDegMin(degrees: number): string {
  const absVal = Math.abs(degrees);
  const deg = Math.floor(absVal);
  const min = (absVal - deg) * 60;
  const sign = degrees >= 0 ? '' : '-';
  return `${sign}${deg}° ${min.toFixed(1)}'`;
}

// Format declination with N/S
export function formatDec(dec: number): string {
  const absVal = Math.abs(dec);
  const deg = Math.floor(absVal);
  const min = (absVal - deg) * 60;
  const dir = dec >= 0 ? 'N' : 'S';
  return `${deg}° ${min.toFixed(1)}' ${dir}`;
}
