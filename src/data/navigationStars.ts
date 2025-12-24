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

// Helper function to get planet position for a given date
export function getPlanetPosition(planetName: string, date: Date): PlanetPosition | null {
  const ephemeris = planetEphemeris2025.find(p => p.name === planetName);
  if (!ephemeris) return null;
  
  // Find the closest date
  const dateStr = date.toISOString().split('T')[0];
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
