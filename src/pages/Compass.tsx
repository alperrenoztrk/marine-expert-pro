// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const CompassPage: React.FC = () => {
  const [heading, setHeading] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<string>("unknown");
  const [needsCalibration, setNeedsCalibration] = useState<boolean>(false);

  const cleanupRef = useRef<(() => void) | null>(null);

  const normalizeDegrees = (deg: number): number => {
    let d = deg % 360;
    if (d < 0) d += 360;
    return d;
  };

  const shortestAngleDelta = (from: number, to: number): number => {
    let delta = (to - from + 540) % 360 - 180; // range [-180, 180)
    return delta;
  };

  const smoothAngle = (current: number, target: number, factor: number): number => {
    const delta = shortestAngleDelta(current, target);
    const next = current + delta * factor;
    return normalizeDegrees(next);
  };

  const getScreenOrientationAngle = (): number => {
    // Try modern Screen Orientation API, fallback to legacy window.orientation
    const angle = (window.screen && (window.screen as any).orientation && (window.screen as any).orientation.angle) ?? (window as any).orientation ?? 0;
    return typeof angle === 'number' ? angle : 0;
  };

  useEffect(() => {
    document.title = "Pusula";
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setIsSupported(true);
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        setPermission("pending");
      } else {
        setPermission("granted");
        cleanupRef.current?.();
        cleanupRef.current = startCompass();
      }
    }

    return () => {
      cleanupRef.current?.();
    };
  }, []);

  const requestPermission = async () => {
    try {
      const response = await (DeviceOrientationEvent as any).requestPermission();
      setPermission(response);
      if (response === 'granted') {
        cleanupRef.current?.();
        cleanupRef.current = startCompass();
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      setPermission("denied");
    }
  };

  const startCompass = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let computedHeading: number | null = null;

      // iOS Safari provides webkitCompassHeading (magnetic heading)
      const webkitHeading = (event as any).webkitCompassHeading;
      if (typeof webkitHeading === 'number' && !isNaN(webkitHeading)) {
        computedHeading = normalizeDegrees(webkitHeading);
        const acc = (event as any).webkitCompassAccuracy;
        if (typeof acc === 'number') {
          // >20 degrees generally indicates poor accuracy
          setNeedsCalibration(isFinite(acc) && acc > 20);
        }
      } else if (event.alpha != null) {
        // Fallback for Android/others using alpha with screen orientation compensation
        const orientationAngle = getScreenOrientationAngle();
        const alpha = event.alpha; // 0..360
        const h = 360 - normalizeDegrees(alpha + orientationAngle);
        computedHeading = normalizeDegrees(h);
        if (typeof event.absolute === 'boolean') {
          setNeedsCalibration(!event.absolute);
        }
      }

      if (computedHeading != null) {
        // Smooth the heading to behave like a physical needle
        setHeading((prev) => smoothAngle(prev, computedHeading as number, 0.2));
      }
    };

    const useAbsolute = 'ondeviceorientationabsolute' in window;
    if (useAbsolute) {
      window.addEventListener('deviceorientationabsolute', handleOrientation as any);
    }
    window.addEventListener('deviceorientation', handleOrientation as any);

    const calibHandler = () => setNeedsCalibration(true);
    window.addEventListener('compassneedscalibration' as any, calibHandler as any);

    return () => {
      if (useAbsolute) window.removeEventListener('deviceorientationabsolute', handleOrientation as any);
      window.removeEventListener('deviceorientation', handleOrientation as any);
      window.removeEventListener('compassneedscalibration' as any, calibHandler as any);
    };
  };

  const getCardinalDirection = (degrees: number): string => {
    const directions = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BBK', 'BK', 'KBK'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="relative min-h-screen bg-black text-white select-none">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="mb-8 text-center">
          <div className="text-6xl font-bold tracking-widest">{Math.round(heading)}°</div>
          <div className="mt-2 text-sm text-white/60">{getCardinalDirection(Math.round(heading))}</div>
          {needsCalibration && (
            <div className="mt-2 text-xs text-amber-400">Düşük doğruluk: cihazı 8 çizerek kalibre edin</div>
          )}
        </div>

        <div className="relative w-80 h-80 sm:w-96 sm:h-96">
          {/* Fixed pointer at 12 o'clock */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-1">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[14px] border-l-transparent border-r-transparent border-b-red-500" />
          </div>

          {/* Dial (rotates with heading) */}
          <div
            className="absolute inset-0 rounded-full border border-white/15 bg-black/40 backdrop-blur-sm"
            style={{ transform: `rotate(${heading}deg)` }}
          >
            {/* Major ticks and labels */}
            {Array.from({ length: 24 }, (_, i) => i * 15).map((deg) => (
              <div key={`maj-${deg}`} className="absolute top-0 left-1/2" style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}>
                <div className="w-0.5 h-4 bg-white/70" />
                <div className="absolute -translate-x-1/2 mt-1 text-[10px] text-white/70" style={{ top: "18px", transform: `translateX(-50%) rotate(${-deg}deg)` }}>
                  {deg}
                </div>
              </div>
            ))}

            {/* Minor ticks */}
            {Array.from({ length: 72 }, (_, i) => i * 5).map((deg) => (
              <div key={`min-${deg}`} className="absolute top-0 left-1/2" style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}>
                <div className={`bg-white/40 ${deg % 15 === 0 ? 'w-0.5 h-4' : 'w-0.5 h-2'}`} />
              </div>
            ))}

            {/* Cardinal letters on the dial */}
            <div className="absolute inset-0">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xl font-semibold text-red-500">K</div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xl font-semibold text-white/70">G</div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xl font-semibold text-white/70">D</div>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-semibold text-white/70">B</div>
            </div>
          </div>

          {/* Center hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white" />
        </div>

        {/* Permissions and support states */}
        {!isSupported && (
          <div className="mt-6 text-sm text-white/70">Bu cihaz pusula sensörünü desteklemiyor</div>
        )}
        {isSupported && permission === 'pending' && (
          <Button onClick={requestPermission} className="mt-6 w-full max-w-xs">Pusulayı Etkinleştir</Button>
        )}
        {permission === 'denied' && (
          <div className="mt-6 text-sm text-red-400">Pusula izni reddedildi. Ayarlardan izin verin.</div>
        )}
      </div>
    </div>
  );
};

export default CompassPage;