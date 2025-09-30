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
  const x = (beta || 0) * degToRad;
  const y = (gamma || 0) * degToRad;
  const z = (alpha || 0) * degToRad;

  const cX = Math.cos(x);
  const cY = Math.cos(y);
  const cZ = Math.cos(z);
  const sX = Math.sin(x);
  const sY = Math.sin(y);
  const sZ = Math.sin(z);

  // Based on W3C DeviceOrientation Event spec example
  const Vx = -cZ * sY - sZ * sX * cY;
  const Vy = -sZ * sY + cZ * sX * cY;

  let headingRad = Math.atan2(Vx, Vy);
  if (headingRad < 0) headingRad += 2 * Math.PI;
  const headingDeg = headingRad * (180 / Math.PI);

  // alpha already reported with respect to screen; do not add screen orientation to avoid double-rotation
  return normalizeAngle(headingDeg);
}

type DeviceOrientationEventWithWebkit = DeviceOrientationEvent & { webkitCompassHeading?: number };

export function computeHeadingFromEvent(ev: DeviceOrientationEvent): number | null {
  const wkev = ev as DeviceOrientationEventWithWebkit;
  if (typeof wkev.webkitCompassHeading === 'number' && isFinite(wkev.webkitCompassHeading)) {
    // iOS Safari provides magnetic heading directly
    return normalizeAngle(wkev.webkitCompassHeading);
  }

  if (typeof ev.alpha === 'number' && typeof ev.beta === 'number' && typeof ev.gamma === 'number') {
    return computeHeadingFromEuler(ev.alpha, ev.beta, ev.gamma);
  }

  if (typeof ev.alpha === 'number') {
    const orientation = getScreenOrientationAngle();
    const base = ev.absolute ? ev.alpha : 360 - ev.alpha;
    return normalizeAngle(base + orientation);
  }

  return null;
}

export function smoothAngle(previousDeg: number | null, nextDeg: number, smoothingFactor: number = 0.2): number {
  if (!isFinite(nextDeg)) return previousDeg == null ? 0 : previousDeg;
  if (previousDeg == null) return normalizeAngle(nextDeg);

  let delta = nextDeg - previousDeg;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  const clamped = Math.max(0, Math.min(1, smoothingFactor));
  const smoothed = previousDeg + delta * clamped;
  return normalizeAngle(smoothed);
}

