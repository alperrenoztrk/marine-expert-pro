// Centralized camera and device-orientation utilities for sextant/celestial features
// Note: Keep browser-only APIs isolated here for reuse across components
import { computeHeadingFromEvent, smoothAngle } from './heading';

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
    const w = window as any;
    if (typeof w.DeviceOrientationEvent !== 'undefined' && typeof w.DeviceOrientationEvent.requestPermission === 'function') {
      const res = await w.DeviceOrientationEvent.requestPermission();
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
  let lastHeading: number | null = null;
  const listener = (ev: DeviceOrientationEvent) => {
    const heading = computeHeadingFromEvent(ev);
    const beta = typeof ev.beta === 'number' ? ev.beta : 0;
    const gamma = typeof ev.gamma === 'number' ? ev.gamma : 0;
    const alpha = heading !== null ? smoothAngle(lastHeading, heading, 0.25) : (typeof ev.alpha === 'number' ? ev.alpha : 0);
    if (heading !== null) {
      lastHeading = alpha;
    }
    handler({ alpha, beta, gamma }, ev);
  };
  window.addEventListener('deviceorientation', listener, { passive: true });
  return () => window.removeEventListener('deviceorientation', listener);
};

// Sextant dip correction (degrees) from eye height in meters
export const computeDipCorrectionDeg = (heightOfEyeMeters: number): number => {
  if (!heightOfEyeMeters || heightOfEyeMeters <= 0) return 0;
  const dipMinutes = 1.76 * Math.sqrt(heightOfEyeMeters);
  return dipMinutes / 60;
};

