// Celestial navigation calculations for AR overlay
export interface CelestialBody {
  name: string;
  type: 'sun' | 'moon' | 'planet' | 'star';
  altitude: number; // degrees above horizon
  azimuth: number; // degrees from north
  magnitude?: number; // brightness
  declination?: number;
  rightAscension?: number;
  isVisible: boolean;
  color?: string;
}

export interface ObserverPosition {
  latitude: number;
  longitude: number;
  dateTime: Date;
  timeZone: number;
}

// Utility functions
const toRadians = (degrees: number) => degrees * Math.PI / 180;
const toDegrees = (radians: number) => radians * 180 / Math.PI;
const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

// Calculate Julian Day
export const calculateJulianDay = (date: Date): number => {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;
  return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
};

// Calculate Greenwich Sidereal Time
export const calculateGST = (jd: number): number => {
  const T = (jd - 2451545.0) / 36525;
  const gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
             0.000387933 * T * T - T * T * T / 38710000;
  return normalizeAngle(gst);
};

// Calculate Local Sidereal Time
export const calculateLST = (jd: number, longitude: number): number => {
  const gst = calculateGST(jd);
  return normalizeAngle(gst + longitude);
};

// Sun position calculation
export const calculateSunPosition = (observer: ObserverPosition): CelestialBody => {
  const jd = calculateJulianDay(observer.dateTime);
  const n = jd - 2451545.0;
  
  // Solar coordinates
  const L = normalizeAngle(280.460 + 0.9856474 * n);
  const g = toRadians(normalizeAngle(357.528 + 0.9856003 * n));
  const lambda = toRadians(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
  
  const alpha = Math.atan2(Math.cos(toRadians(23.439)) * Math.sin(lambda), Math.cos(lambda));
  const delta = Math.asin(Math.sin(toRadians(23.439)) * Math.sin(lambda));
  
  // Local hour angle
  const lst = calculateLST(jd, observer.longitude);
  const ha = toRadians(normalizeAngle(lst - toDegrees(alpha)));
  
  // Altitude and azimuth
  const latRad = toRadians(observer.latitude);
  const altitude = Math.asin(Math.sin(latRad) * Math.sin(delta) + 
                            Math.cos(latRad) * Math.cos(delta) * Math.cos(ha));
  
  const azimuth = Math.atan2(-Math.sin(ha), 
                            Math.tan(delta) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(ha));
  
  return {
    name: 'Güneş',
    type: 'sun',
    altitude: toDegrees(altitude),
    azimuth: normalizeAngle(toDegrees(azimuth)),
    declination: toDegrees(delta),
    rightAscension: toDegrees(alpha),
    isVisible: toDegrees(altitude) > -6, // Visible if above -6° (civil twilight)
    color: '#FFD700'
  };
};

// Moon position calculation
export const calculateMoonPosition = (observer: ObserverPosition): CelestialBody => {
  const jd = calculateJulianDay(observer.dateTime);
  const T = (jd - 2451545.0) / 36525;
  
  // Simplified lunar coordinates
  const L = normalizeAngle(218.316 + 481267.881 * T);
  const M = toRadians(normalizeAngle(134.963 + 477198.868 * T));
  const F = toRadians(normalizeAngle(93.272 + 483202.017 * T));
  
  const lambda = toRadians(L + 6.289 * Math.sin(M) - 1.274 * Math.sin(2 * toRadians(L) - M) + 
                          0.658 * Math.sin(2 * toRadians(L)));
  const beta = toRadians(5.128 * Math.sin(F));
  
  const alpha = Math.atan2(Math.sin(lambda) * Math.cos(toRadians(23.439)) - 
                          Math.tan(beta) * Math.sin(toRadians(23.439)), Math.cos(lambda));
  const delta = Math.asin(Math.sin(beta) * Math.cos(toRadians(23.439)) + 
                         Math.cos(beta) * Math.sin(toRadians(23.439)) * Math.sin(lambda));
  
  // Local hour angle
  const lst = calculateLST(jd, observer.longitude);
  const ha = toRadians(normalizeAngle(lst - toDegrees(alpha)));
  
  // Altitude and azimuth
  const latRad = toRadians(observer.latitude);
  const altitude = Math.asin(Math.sin(latRad) * Math.sin(delta) + 
                            Math.cos(latRad) * Math.cos(delta) * Math.cos(ha));
  
  const azimuth = Math.atan2(-Math.sin(ha), 
                            Math.tan(delta) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(ha));
  
  // Moon phase calculation
  const daysSinceNewMoon = (jd - 2451549.5) % 29.530588853;
  const phase = daysSinceNewMoon / 29.530588853;
  
  return {
    name: 'Ay',
    type: 'moon',
    altitude: toDegrees(altitude),
    azimuth: normalizeAngle(toDegrees(azimuth)),
    declination: toDegrees(delta),
    rightAscension: toDegrees(alpha),
    isVisible: toDegrees(altitude) > 0,
    color: '#C0C0C0'
  };
};

// Navigation stars database with current epoch coordinates
const navigationStars = [
  { name: 'Sirius', sha: 259, dec: -16.7, magnitude: -1.46, color: '#87CEEB' },
  { name: 'Canopus', sha: 264, dec: -52.7, magnitude: -0.74, color: '#F5F5DC' },
  { name: 'Arcturus', sha: 146, dec: 19.2, magnitude: -0.05, color: '#FFA500' },
  { name: 'Vega', sha: 81, dec: 38.8, magnitude: 0.03, color: '#E6E6FA' },
  { name: 'Capella', sha: 281, dec: 46.0, magnitude: 0.08, color: '#FFFF99' },
  { name: 'Rigel', sha: 282, dec: -8.2, magnitude: 0.13, color: '#4169E1' },
  { name: 'Procyon', sha: 245, dec: 5.2, magnitude: 0.34, color: '#F5F5DC' },
  { name: 'Betelgeuse', sha: 271, dec: 7.4, magnitude: 0.50, color: '#FF4500' },
  { name: 'Aldebaran', sha: 291, dec: 16.5, magnitude: 0.85, color: '#FF6347' },
  { name: 'Spica', sha: 159, dec: -11.2, magnitude: 0.97, color: '#4169E1' },
  { name: 'Antares', sha: 113, dec: -26.4, magnitude: 1.09, color: '#DC143C' },
  { name: 'Pollux', sha: 244, dec: 28.0, magnitude: 1.14, color: '#FFA500' },
  { name: 'Fomalhaut', sha: 16, dec: -29.6, magnitude: 1.16, color: '#F0F8FF' },
  { name: 'Deneb', sha: 49, dec: 45.3, magnitude: 1.25, color: '#F0F8FF' },
  { name: 'Regulus', sha: 208, dec: 12.0, magnitude: 1.35, color: '#87CEEB' }
];

// Calculate star positions
export const calculateStarPositions = (observer: ObserverPosition): CelestialBody[] => {
  const jd = calculateJulianDay(observer.dateTime);
  const lst = calculateLST(jd, observer.longitude);
  
  return navigationStars.map(star => {
    const lha = normalizeAngle(lst - star.sha);
    const lhaRad = toRadians(lha);
    const latRad = toRadians(observer.latitude);
    const decRad = toRadians(star.dec);
    
    const altitude = Math.asin(Math.sin(latRad) * Math.sin(decRad) + 
                              Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad));
    
    const azimuth = Math.atan2(-Math.sin(lhaRad), 
                              Math.tan(decRad) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(lhaRad));
    
    const altDeg = toDegrees(altitude);
    
    return {
      name: star.name,
      type: 'star' as const,
      altitude: altDeg,
      azimuth: normalizeAngle(toDegrees(azimuth)),
      magnitude: star.magnitude,
      declination: star.dec,
      isVisible: altDeg > 5, // Only show stars above 5° altitude
      color: star.color
    };
  }).filter(star => star.isVisible);
};

// Calculate planet positions (simplified)
export const calculatePlanetPositions = (observer: ObserverPosition): CelestialBody[] => {
  const jd = calculateJulianDay(observer.dateTime);
  const n = jd - 2451545.0;
  
  const planets = [
    {
      name: 'Venüs',
      meanLongitude: 181.979 + 1.602 * n,
      perihelion: 131.563 + 0.001 * n,
      eccentricity: 0.007,
      inclination: 3.395,
      magnitude: -4.0,
      color: '#FFC649'
    },
    {
      name: 'Mars',
      meanLongitude: 355.433 + 0.524 * n,
      perihelion: 336.060 + 0.001 * n,
      eccentricity: 0.093,
      inclination: 1.850,
      magnitude: 0.5,
      color: '#CD5C5C'
    },
    {
      name: 'Jüpiter',
      meanLongitude: 34.351 + 0.083 * n,
      perihelion: 14.331 + 0.001 * n,
      eccentricity: 0.048,
      inclination: 1.303,
      magnitude: -2.5,
      color: '#D2691E'
    },
    {
      name: 'Satürn',
      meanLongitude: 50.077 + 0.034 * n,
      perihelion: 93.057 + 0.001 * n,
      eccentricity: 0.056,
      inclination: 2.489,
      magnitude: 0.8,
      color: '#FAD5A5'
    }
  ];

  return planets.map(planet => {
    // Simplified planetary position calculation
    const M = toRadians(normalizeAngle(planet.meanLongitude - planet.perihelion));
    const E = M + planet.eccentricity * Math.sin(M);
    const lambda = normalizeAngle(planet.perihelion + toDegrees(E));
    
    // Convert to equatorial coordinates (simplified)
    const alpha = toRadians(lambda);
    const delta = Math.asin(Math.sin(toRadians(planet.inclination)) * Math.sin(toRadians(lambda)));
    
    // Local hour angle
    const lst = calculateLST(jd, observer.longitude);
    const ha = toRadians(normalizeAngle(lst - toDegrees(alpha)));
    
    // Altitude and azimuth
    const latRad = toRadians(observer.latitude);
    const altitude = Math.asin(Math.sin(latRad) * Math.sin(delta) + 
                              Math.cos(latRad) * Math.cos(delta) * Math.cos(ha));
    
    const azimuth = Math.atan2(-Math.sin(ha), 
                              Math.tan(delta) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(ha));
    
    const altDeg = toDegrees(altitude);
    
    return {
      name: planet.name,
      type: 'planet' as const,
      altitude: altDeg,
      azimuth: normalizeAngle(toDegrees(azimuth)),
      magnitude: planet.magnitude,
      isVisible: altDeg > 0,
      color: planet.color
    };
  }).filter(planet => planet.isVisible);
};

// Get all visible celestial bodies
export const getAllVisibleCelestialBodies = (observer: ObserverPosition): CelestialBody[] => {
  const bodies: CelestialBody[] = [];
  
  // Add Sun
  bodies.push(calculateSunPosition(observer));
  
  // Add Moon
  bodies.push(calculateMoonPosition(observer));
  
  // Add planets
  bodies.push(...calculatePlanetPositions(observer));
  
  // Add stars
  bodies.push(...calculateStarPositions(observer));
  
  return bodies.filter(body => body.isVisible);
};

// Convert altitude/azimuth to screen coordinates
export const celestialToScreenCoordinates = (
  altitude: number, 
  azimuth: number, 
  deviceOrientation: { alpha: number; beta: number; gamma: number },
  screenWidth: number,
  screenHeight: number,
  fieldOfView: number = 60 // Camera field of view in degrees
): { x: number; y: number; isInView: boolean } => {
  
  // Convert device orientation to camera orientation
  const deviceAzimuth = normalizeAngle(deviceOrientation.alpha || 0);
  const devicePitch = deviceOrientation.beta || 0;
  const deviceRoll = deviceOrientation.gamma || 0;
  
  // Calculate relative position from device orientation
  const relativeAzimuth = normalizeAngle(azimuth - deviceAzimuth);
  const relativePitch = altitude - devicePitch;
  
  // Check if celestial body is within camera field of view
  const halfFOV = fieldOfView / 2;
  const isInView = Math.abs(relativeAzimuth) <= halfFOV && 
                   Math.abs(relativePitch) <= halfFOV;
  
  if (!isInView) {
    return { x: -1, y: -1, isInView: false };
  }
  
  // Convert to screen coordinates
  const x = (screenWidth / 2) + (relativeAzimuth / halfFOV) * (screenWidth / 2);
  const y = (screenHeight / 2) - (relativePitch / halfFOV) * (screenHeight / 2);
  
  return { 
    x: Math.max(0, Math.min(screenWidth, x)), 
    y: Math.max(0, Math.min(screenHeight, y)), 
    isInView: true 
  };
};

// Calculate refraction correction
export const calculateRefraction = (altitude: number, temperature: number = 15, pressure: number = 1013): number => {
  if (altitude <= 0) return 0;
  
  const altRad = toRadians(altitude);
  const R = 0.0167 / Math.tan(altRad + 7.31 / (altRad + 4.4));
  const tempCorrection = (pressure / 1010) * (283 / (273 + temperature));
  return R * tempCorrection; // Returns correction in degrees
};

// Check if it's nautical twilight (best time for star sights)
export const isNauticalTwilight = (sunAltitude: number): boolean => {
  return sunAltitude >= -12 && sunAltitude <= -6;
};

// Get magnitude-based size for display
export const getMagnitudeSize = (magnitude: number): number => {
  // Brighter stars (lower magnitude) get larger size
  return Math.max(8, 20 - magnitude * 3);
};

