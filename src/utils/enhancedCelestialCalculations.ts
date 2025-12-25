// Enhanced celestial calculations with constellation support and more features
import { 
  EnhancedStar, 
  Constellation, 
  DeepSkyObject, 
  enhancedStarCatalog, 
  constellations, 
  deepSkyObjects 
} from './enhancedStarDatabase';
import { 
  CelestialBody, 
  ObserverPosition, 
  calculateJulianDay, 
  calculateLST,
  calculateSunPosition,
  calculateMoonPosition,
  calculatePlanetPositions
} from './celestialCalculations';

// Extended celestial body interface
export interface EnhancedCelestialBody extends CelestialBody {
  constellation?: string;
  spectralClass?: string;
  distance?: number;
  description?: string;
  mythology?: string;
  hipId?: number;
  commonName?: string;
}

// Constellation line for drawing
export interface ConstellationLine {
  constellation: string;
  fromStar: EnhancedCelestialBody;
  toStar: EnhancedCelestialBody;
}

// Utility functions
const toRadians = (degrees: number) => degrees * Math.PI / 180;
const toDegrees = (radians: number) => radians * 180 / Math.PI;
const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

// Convert right ascension hours to degrees
const raToDegrees = (raHours: number): number => raHours * 15;

// Calculate enhanced star positions using the new database
export const calculateEnhancedStarPositions = (observer: ObserverPosition): EnhancedCelestialBody[] => {
  const jd = calculateJulianDay(observer.dateTime);
  const lst = calculateLST(jd, observer.longitude);
  
  return enhancedStarCatalog.map(star => {
    const raInDegrees = raToDegrees(star.rightAscension);
    const lha = normalizeAngle(lst - raInDegrees);
    const lhaRad = toRadians(lha);
    const latRad = toRadians(observer.latitude);
    const decRad = toRadians(star.declination);
    
    const altitude = Math.asin(Math.sin(latRad) * Math.sin(decRad) + 
                              Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad));
    
    const azimuth = Math.atan2(-Math.sin(lhaRad), 
                              Math.tan(decRad) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(lhaRad));
    
    const altDeg = toDegrees(altitude);
    
    return {
      name: star.name,
      commonName: star.commonName,
      type: 'star' as const,
      altitude: altDeg,
      azimuth: normalizeAngle(toDegrees(azimuth)),
      magnitude: star.magnitude,
      declination: star.declination,
      rightAscension: star.rightAscension,
      isVisible: altDeg > -5, // Show stars slightly below horizon for better experience
      color: star.color,
      constellation: star.constellation,
      spectralClass: star.spectralClass,
      distance: star.distance,
      description: star.description,
      mythology: star.mythology,
      hipId: star.hipId
    };
  });
};

// Calculate deep sky object positions
export const calculateDeepSkyObjectPositions = (observer: ObserverPosition): EnhancedCelestialBody[] => {
  const jd = calculateJulianDay(observer.dateTime);
  const lst = calculateLST(jd, observer.longitude);
  
  return deepSkyObjects.map(dso => {
    const raInDegrees = raToDegrees(dso.rightAscension);
    const lha = normalizeAngle(lst - raInDegrees);
    const lhaRad = toRadians(lha);
    const latRad = toRadians(observer.latitude);
    const decRad = toRadians(dso.declination);
    
    const altitude = Math.asin(Math.sin(latRad) * Math.sin(decRad) + 
                              Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad));
    
    const azimuth = Math.atan2(-Math.sin(lhaRad), 
                              Math.tan(decRad) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(lhaRad));
    
    const altDeg = toDegrees(altitude);
    
    return {
      name: dso.name,
      type: dso.type as unknown as EnhancedCelestialBody["type"], // Extended types
      altitude: altDeg,
      azimuth: normalizeAngle(toDegrees(azimuth)),
      magnitude: dso.magnitude,
      declination: dso.declination,
      rightAscension: dso.rightAscension,
      isVisible: altDeg > 0,
      color: dso.color,
      constellation: dso.constellation,
      distance: dso.distance,
      description: dso.description
    };
  });
};

// Get constellation lines for visible stars
export const getVisibleConstellationLines = (
  visibleStars: EnhancedCelestialBody[]
): ConstellationLine[] => {
  const lines: ConstellationLine[] = [];
  
  constellations.forEach(constellation => {
    constellation.lines.forEach(([fromStarName, toStarName]) => {
      const fromStar = visibleStars.find(star => star.name === fromStarName);
      const toStar = visibleStars.find(star => star.name === toStarName);
      
      if (fromStar && toStar && fromStar.isVisible && toStar.isVisible) {
        lines.push({
          constellation: constellation.name,
          fromStar,
          toStar
        });
      }
    });
  });
  
  return lines;
};

// Get all enhanced celestial bodies
export const getAllEnhancedCelestialBodies = (
  observer: ObserverPosition,
  options: {
    includeStars?: boolean;
    includeDeepSky?: boolean;
    includePlanets?: boolean;
    includeSunMoon?: boolean;
    minimumMagnitude?: number;
    constellationFilter?: string[];
  } = {}
): EnhancedCelestialBody[] => {
  const {
    includeStars = true,
    includeDeepSky = false,
    includePlanets = true,
    includeSunMoon = true,
    minimumMagnitude = 6.0,
    constellationFilter = []
  } = options;
  
  const bodies: EnhancedCelestialBody[] = [];
  
  // Add Sun and Moon
  if (includeSunMoon) {
    const sun = calculateSunPosition(observer);
    const moon = calculateMoonPosition(observer);
    bodies.push(
      { ...sun, commonName: 'Güneş' },
      { ...moon, commonName: 'Ay' }
    );
  }
  
  // Add planets
  if (includePlanets) {
    const planets = calculatePlanetPositions(observer);
    bodies.push(...planets.map(planet => ({ ...planet })));
  }
  
  // Add enhanced stars
  if (includeStars) {
    const stars = calculateEnhancedStarPositions(observer)
      .filter(star => {
        // Filter by magnitude
        if (star.magnitude && star.magnitude > minimumMagnitude) return false;
        
        // Filter by constellation if specified
        if (constellationFilter.length > 0 && star.constellation) {
          return constellationFilter.includes(star.constellation);
        }
        
        return true;
      });
    
    bodies.push(...stars);
  }
  
  // Add deep sky objects
  if (includeDeepSky) {
    const dsos = calculateDeepSkyObjectPositions(observer);
    bodies.push(...dsos);
  }
  
  return bodies.filter(body => body.isVisible);
};

// Search celestial objects
export const searchCelestialObjects = (
  query: string,
  observer: ObserverPosition
): EnhancedCelestialBody[] => {
  const allBodies = getAllEnhancedCelestialBodies(observer, {
    includeStars: true,
    includeDeepSky: true,
    includePlanets: true,
    includeSunMoon: true,
    minimumMagnitude: 8.0
  });
  
  const lowercaseQuery = query.toLowerCase();
  
  return allBodies.filter(body => 
    body.name.toLowerCase().includes(lowercaseQuery) ||
    body.commonName?.toLowerCase().includes(lowercaseQuery) ||
    body.constellation?.toLowerCase().includes(lowercaseQuery)
  );
};

// Get constellation information
export const getConstellationInfo = (name: string): Constellation | undefined => {
  return constellations.find(constellation => 
    constellation.name.toLowerCase() === name.toLowerCase() ||
    constellation.abbreviation.toLowerCase() === name.toLowerCase()
  );
};

// Get stars in a specific constellation
export const getConstellationStars = (
  constellationName: string,
  observer: ObserverPosition
): EnhancedCelestialBody[] => {
  const allStars = calculateEnhancedStarPositions(observer);
  return allStars.filter(star => 
    star.constellation?.toLowerCase() === constellationName.toLowerCase()
  );
};

// Calculate best viewing time for a celestial object
export const calculateBestViewingTime = (
  objectName: string,
  observer: ObserverPosition,
  date: Date = new Date()
): { time: Date; altitude: number } | null => {
  const star = enhancedStarCatalog.find(s => s.name === objectName);
  if (!star) return null;
  
  let bestTime = new Date(date);
  let bestAltitude = -90;
  
  // Check every hour for 24 hours
  for (let hour = 0; hour < 24; hour++) {
    const testTime = new Date(date);
    testTime.setHours(hour);
    
    const testObserver = { ...observer, dateTime: testTime };
    const jd = calculateJulianDay(testTime);
    const lst = calculateLST(jd, observer.longitude);
    
    const raInDegrees = raToDegrees(star.rightAscension);
    const lha = normalizeAngle(lst - raInDegrees);
    const lhaRad = toRadians(lha);
    const latRad = toRadians(observer.latitude);
    const decRad = toRadians(star.declination);
    
    const altitude = Math.asin(Math.sin(latRad) * Math.sin(decRad) + 
                              Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad));
    
    const altDeg = toDegrees(altitude);
    
    if (altDeg > bestAltitude) {
      bestAltitude = altDeg;
      bestTime = new Date(testTime);
    }
  }
  
  return { time: bestTime, altitude: bestAltitude };
};

// Time travel: calculate positions for different dates
export const calculateCelestialBodiesForDate = (
  observer: ObserverPosition,
  targetDate: Date
): EnhancedCelestialBody[] => {
  const timeTravel = { ...observer, dateTime: targetDate };
  return getAllEnhancedCelestialBodies(timeTravel);
};