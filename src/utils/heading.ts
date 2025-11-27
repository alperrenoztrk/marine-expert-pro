export function normalizeAngle(degrees: number): number {
  const normalized = ((degrees % 360) + 360) % 360;
  return normalized;
}

export function getScreenOrientationAngle(): number {
  try {
    const screenOrientation = window.screen?.orientation;
    if (screenOrientation && typeof screenOrientation.angle === 'number') {
      return screenOrientation.angle;
    }
    // Some platforms expose window.orientation (deprecated)
    if (Object.prototype.hasOwnProperty.call(window, 'orientation')) {
      const w = window as Window & { orientation?: number };
      if (typeof w.orientation === 'number') return w.orientation;
    }
  } catch {
    // ignore if not in browser
  }
  return 0;
}

export function computeHeadingFromEuler(alpha: number, beta: number, gamma: number): number {
  const degToRad = Math.PI / 180;
  
  // Get screen orientation to apply proper correction
  const screenAngle = getScreenOrientationAngle();
  
  // Convert to radians
  const alphaRad = alpha * degToRad;
  const betaRad = beta * degToRad;
  const gammaRad = gamma * degToRad;

  // Apply rotation matrix calculation for compass heading
  // This accounts for device tilt (beta, gamma) when computing horizontal heading
  const cosAlpha = Math.cos(alphaRad);
  const sinAlpha = Math.sin(alphaRad);
  const cosBeta = Math.cos(betaRad);
  const sinBeta = Math.sin(betaRad);
  const cosGamma = Math.cos(gammaRad);
  const sinGamma = Math.sin(gammaRad);

  // Calculate the compass heading considering device orientation
  // Formula projects the device's Z-axis onto the horizontal plane
  const compassX = sinGamma * sinBeta * cosAlpha - cosGamma * sinAlpha;
  const compassY = -cosGamma * sinBeta * cosAlpha - sinGamma * sinAlpha;
  
  // Calculate heading from compass components
  let heading = Math.atan2(compassX, compassY) * (180 / Math.PI);
  
  // Apply screen orientation correction
  heading = heading - screenAngle;
  
  return normalizeAngle(heading);
}

type DeviceOrientationEventWithWebkit = DeviceOrientationEvent & { webkitCompassHeading?: number };

export function computeHeadingFromEvent(ev: DeviceOrientationEvent): number | null {
  const wkev = ev as DeviceOrientationEventWithWebkit;
  
  // iOS Safari provides true magnetic heading directly - most reliable
  if (typeof wkev.webkitCompassHeading === 'number' && isFinite(wkev.webkitCompassHeading)) {
    return normalizeAngle(wkev.webkitCompassHeading);
  }

  // If we have all orientation angles, use full 3D calculation
  if (typeof ev.alpha === 'number' && isFinite(ev.alpha) && 
      typeof ev.beta === 'number' && isFinite(ev.beta) && 
      typeof ev.gamma === 'number' && isFinite(ev.gamma)) {
    return computeHeadingFromEuler(ev.alpha, ev.beta, ev.gamma);
  }

  // Fallback to alpha-only with screen orientation correction
  if (typeof ev.alpha === 'number' && isFinite(ev.alpha)) {
    const screenAngle = getScreenOrientationAngle();
    // Most Android devices report alpha relative to magnetic north
    let heading = ev.alpha;
    
    // Apply screen orientation correction
    heading = heading - screenAngle;
    
    return normalizeAngle(heading);
  }

  return null;
}

export function smoothAngle(previousDeg: number | null, nextDeg: number, smoothingFactor: number = 0.2): number {
  if (!isFinite(nextDeg)) return previousDeg == null ? 0 : previousDeg;
  if (previousDeg == null) return normalizeAngle(nextDeg);

  // Calculate shortest angular distance
  let delta = nextDeg - previousDeg;
  
  // Normalize delta to [-180, 180] range
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  
  // Apply exponential moving average for smooth transitions
  const clamped = Math.max(0, Math.min(1, smoothingFactor));
  
  // For small changes (< 5 degrees), use full smoothing
  // For large changes (> 30 degrees), reduce smoothing to respond faster
  const absDelta = Math.abs(delta);
  let adjustedFactor = clamped;
  if (absDelta > 30) {
    adjustedFactor = Math.min(1, clamped * 3); // Faster response for big changes
  } else if (absDelta < 5) {
    adjustedFactor = clamped * 0.7; // Smoother for small jitter
  }
  
  const smoothed = previousDeg + delta * adjustedFactor;
  return normalizeAngle(smoothed);
}

