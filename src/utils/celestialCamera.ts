// Centralized camera and device-orientation utilities for sextant/celestial features
// Note: Keep browser-only APIs isolated here for reuse across components
import { createCompassListener, smoothAngle, normalizeAngle } from './heading';

export type DeviceOrientationAngles = { alpha: number; beta: number; gamma: number };

export interface CameraSession {
  stream: MediaStream | null;
  isStreaming: boolean;
}

export interface StartCameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

export const startCameraStream = async (
  videoElement: HTMLVideoElement,
  options: StartCameraOptions = {}
): Promise<CameraSession> => {
  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: { ideal: options.facingMode ?? 'environment' },
      width: options.width,
      height: options.height,
    },
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  videoElement.srcObject = stream;
  await videoElement.play();
  return { stream, isStreaming: true };
};

export const stopCameraStream = (session: CameraSession | null, videoElement?: HTMLVideoElement | null) => {
  if (session?.stream) {
    session.stream.getTracks().forEach((t) => t.stop());
  }
  if (videoElement) {
    videoElement.srcObject = null;
  }
};

export const requestDeviceOrientationPermission = async (): Promise<boolean> => {
  try {
    // iOS (Safari) uses a non-standard permission request on the constructor.
    const doe = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof doe.requestPermission === 'function') {
      const res = await doe.requestPermission();
      return res === 'granted';
    }
    // Non-iOS: treat as granted if the API exists
    return true;
  } catch {
    return false;
  }
};

export const addDeviceOrientationListener = (
  handler: (angles: DeviceOrientationAngles, ev: DeviceOrientationEvent) => void
) => {
  let lastAlpha: number | null = null;
  let lastBeta: number | null = null;
  let lastGamma: number | null = null;
  
  // Use the unified compass listener for alpha (heading)
  const compassCleanup = createCompassListener((heading) => {
    lastAlpha = heading;
  }, 0.25);
  
  // Also listen for beta/gamma from regular deviceorientation
  const orientationHandler = (ev: DeviceOrientationEvent) => {
    const beta = typeof ev.beta === 'number' ? ev.beta : 0;
    const gamma = typeof ev.gamma === 'number' ? ev.gamma : 0;
    
    // Smooth beta and gamma as well for stable rendering
    lastBeta = lastBeta !== null ? smoothAngle(lastBeta, beta, 0.25) : beta;
    lastGamma = lastGamma !== null ? smoothAngle(lastGamma, gamma, 0.25) : gamma;
    
    // Use the heading from compass listener, fallback to event alpha
    const alpha = lastAlpha !== null ? lastAlpha : (typeof ev.alpha === 'number' ? normalizeAngle(ev.alpha) : 0);
    
    handler({ alpha, beta: lastBeta, gamma: lastGamma }, ev);
  };
  
  window.addEventListener('deviceorientation', orientationHandler, { passive: true });
  
  return () => {
    compassCleanup();
    window.removeEventListener('deviceorientation', orientationHandler);
  };
};

// Sextant dip correction (degrees) from eye height in meters
export const computeDipCorrectionDeg = (heightOfEyeMeters: number): number => {
  if (!heightOfEyeMeters || heightOfEyeMeters <= 0) return 0;
  const dipMinutes = 1.76 * Math.sqrt(heightOfEyeMeters);
  return dipMinutes / 60;
};
