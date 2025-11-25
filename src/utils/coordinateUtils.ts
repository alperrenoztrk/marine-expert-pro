/**
 * Coordinate utilities for DMS (Degrees Minutes Seconds) format
 */

export interface DMSCoordinate {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: 'N' | 'S' | 'E' | 'W';
}

export interface LatLonDMS {
  latitude: DMSCoordinate;
  longitude: DMSCoordinate;
}

/**
 * Convert decimal degrees to DMS format
 */
export function decimalToDMS(decimal: number, isLatitude: boolean): DMSCoordinate {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesDecimal = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = Math.round((minutesDecimal - minutes) * 60 * 10) / 10; // Round to 1 decimal place
  
  let direction: 'N' | 'S' | 'E' | 'W';
  if (isLatitude) {
    direction = decimal >= 0 ? 'N' : 'S';
  } else {
    direction = decimal >= 0 ? 'E' : 'W';
  }
  
  return { degrees, minutes, seconds, direction };
}

/**
 * Convert DMS to decimal degrees
 */
export function dmsToDecimal(dms: DMSCoordinate): number {
  const { degrees, minutes, seconds, direction } = dms;
  const decimal = degrees + minutes / 60 + seconds / 3600;
  
  // Apply sign based on direction
  const multiplier = (direction === 'S' || direction === 'W') ? -1 : 1;
  return decimal * multiplier;
}

/**
 * Format DMS coordinate as string
 */
export function formatDMS(dms: DMSCoordinate, compact: boolean = false): string {
  const { degrees, minutes, seconds, direction } = dms;
  
  if (compact) {
    return `${degrees}°${minutes}'${seconds.toFixed(1)}"${direction}`;
  }
  
  return `${degrees}° ${minutes}' ${seconds.toFixed(1)}" ${direction}`;
}

/**
 * Format decimal degrees as DMS string
 */
export function formatDecimalAsDMS(decimal: number, isLatitude: boolean, compact: boolean = false): string {
  const dms = decimalToDMS(decimal, isLatitude);
  return formatDMS(dms, compact);
}

/**
 * Parse DMS string to decimal
 * Supports formats like: "41°00'49\"N", "41 00 49 N", "41° 00' 49\" N"
 */
export function parseDMSString(dmsString: string): number | null {
  // Remove extra spaces and normalize
  const normalized = dmsString.trim().toUpperCase();
  
  // Try to match DMS pattern
  const patterns = [
    /(\d+)[°\s]+(\d+)['\s]+(\d+(?:\.\d+)?)["\s]*([NSEW])/,
    /(\d+)[°\s]+(\d+)['\s]*([NSEW])/,
    /(\d+)[°\s]*([NSEW])/,
  ];
  
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      const degrees = parseInt(match[1]);
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const seconds = match[3] && match[4] ? parseFloat(match[3]) : 0;
      const direction = match[match.length - 1] as 'N' | 'S' | 'E' | 'W';
      
      return dmsToDecimal({ degrees, minutes, seconds, direction });
    }
  }
  
  // Try to parse as decimal
  const decimal = parseFloat(normalized);
  if (!isNaN(decimal)) {
    return decimal;
  }
  
  return null;
}

/**
 * Validate DMS coordinate values
 */
export function validateDMS(dms: DMSCoordinate, isLatitude: boolean): boolean {
  const { degrees, minutes, seconds, direction } = dms;
  
  // Check ranges
  if (minutes < 0 || minutes >= 60) return false;
  if (seconds < 0 || seconds >= 60) return false;
  
  // Check latitude bounds
  if (isLatitude) {
    if (degrees < 0 || degrees > 90) return false;
    if (direction !== 'N' && direction !== 'S') return false;
  } else {
    // Check longitude bounds
    if (degrees < 0 || degrees > 180) return false;
    if (direction !== 'E' && direction !== 'W') return false;
  }
  
  return true;
}

/**
 * Create empty DMS coordinate
 */
export function emptyDMS(isLatitude: boolean): DMSCoordinate {
  return {
    degrees: 0,
    minutes: 0,
    seconds: 0,
    direction: isLatitude ? 'N' : 'E',
  };
}
