// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Haptics } from "@capacitor/haptics";

const CompassPage: React.FC = () => {
  const [heading, setHeading] = useState<number>(0); // smoothed magnetic heading
  const [rawHeading, setRawHeading] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<string>("unknown");
  const [needsCalibration, setNeedsCalibration] = useState<boolean>(false);

  // Display and control options
  const [smoothingFactor, setSmoothingFactor] = useState<number>(0.2); // 0..1
  const [freeze, setFreeze] = useState<boolean>(false);
  const [bigDigits, setBigDigits] = useState<boolean>(false);

  // True/Magnetic handling
  const [useTrue, setUseTrue] = useState<boolean>(false);
  const [variationDeg, setVariationDeg] = useState<number>(0); // East positive
  const [autoVariation, setAutoVariation] = useState<boolean>(false);
  const [isFetchingVariation, setIsFetchingVariation] = useState<boolean>(false);
  const [variationError, setVariationError] = useState<string>("");

  // Target and haptics
  const [enableTarget, setEnableTarget] = useState<boolean>(false);
  const [targetHeading, setTargetHeading] = useState<number>(0);
  const [targetThreshold, setTargetThreshold] = useState<number>(5); // degrees
  const onCourseRef = useRef<boolean>(false);

  // Wake Lock
  const [wakeLockEnabled, setWakeLockEnabled] = useState<boolean>(false);
  const wakeLockRef = useRef<any>(null);

  const cleanupRef = useRef<(() => void) | null>(null);
  const smoothingRef = useRef<number>(smoothingFactor);
  const freezeRef = useRef<boolean>(freeze);
  useEffect(() => { smoothingRef.current = smoothingFactor; }, [smoothingFactor]);
  useEffect(() => { freezeRef.current = freeze; }, [freeze]);

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

  const getCardinalDirection = (degrees: number): string => {
    const directions = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BBK', 'BK', 'KBK'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
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
      releaseWakeLock();
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
        setRawHeading(computedHeading);
        // Smooth the heading to behave like a physical needle
        setHeading((prev) => {
          if (freezeRef.current) return prev;
          const factor = Math.max(0, Math.min(1, smoothingRef.current ?? 0.2));
          return smoothAngle(prev, computedHeading as number, factor);
        });
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

  const displayedHeading = normalizeDegrees((useTrue ? heading + (variationDeg || 0) : heading));

  // Target lock and haptics feedback when on-course window is entered
  useEffect(() => {
    if (!enableTarget) return;
    const delta = Math.abs(shortestAngleDelta(displayedHeading, targetHeading || 0));
    const isOnCourse = delta <= (targetThreshold || 5);
    if (isOnCourse && !onCourseRef.current) {
      try { Haptics.impact({ style: 'medium' as any }); } catch {}
    }
    onCourseRef.current = isOnCourse;
  }, [displayedHeading, targetHeading, targetThreshold, enableTarget]);

  // Wake Lock handlers
  const acquireWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          wakeLockRef.current = null;
          setWakeLockEnabled(false);
        });
        document.addEventListener('visibilitychange', async () => {
          if (document.visibilityState === 'visible' && wakeLockEnabled && !(wakeLockRef.current)) {
            try { wakeLockRef.current = await (navigator as any).wakeLock.request('screen'); } catch {}
          }
        });
      }
    } catch (e) {
      // Ignore if not supported
    }
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release?.();
        wakeLockRef.current = null;
      }
    } catch {}
  };

  useEffect(() => {
    if (wakeLockEnabled) acquireWakeLock();
    else releaseWakeLock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wakeLockEnabled]);

  // Auto variation via geolocation + public API (graceful fallback)
  const fetchDeclination = async (lat: number, lon: number, date: string) => {
    // Try a public CORS-friendly endpoint first
    try {
      const url1 = `https://geomag.amentum.io/declination?latitude=${lat}&longitude=${lon}&date=${date}`;
      const r1 = await fetch(url1);
      if (r1.ok) {
        const j = await r1.json();
        // supports {declination: number} or {result: {declination}}
        const d = (j?.declination ?? j?.result?.declination);
        if (typeof d === 'number') return d;
      }
    } catch {}
    // Fallback to NOAA (may be blocked by CORS in some environments)
    try {
      const yy = new Date(date).getFullYear();
      const url2 = `https://www.ngdc.noaa.gov/geomag-web/calculators/calcDeclination?lat1=${lat}&lon1=${lon}&startYear=${yy}&resultFormat=json`;
      const r2 = await fetch(url2);
      if (r2.ok) {
        const j2 = await r2.json();
        const d2 = j2?.result?.[0]?.declination;
        if (typeof d2 === 'number') return d2;
      }
    } catch {}
    throw new Error('declination_unavailable');
  };

  const handleAutoVariation = async () => {
    setVariationError("");
    setIsFetchingVariation(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      await new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error('no_geolocation'));
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
      }).then(async (pos: any) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const date = new Date().toISOString().slice(0, 10);
        const dec = await fetchDeclination(lat, lon, date);
        setVariationDeg(dec);
      });
    } catch (e: any) {
      setVariationError('Otomatik varyasyon alınamadı');
    } finally {
      setIsFetchingVariation(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-black select-none">
      <div className="absolute inset-0 flex flex-col items-center justify-start px-6 py-6 gap-6">
        {/* Readout */}
        <div className="w-full max-w-md">
          <div className={`${bigDigits ? 'text-7xl' : 'text-6xl'} font-bold tracking-widest text-center`}>
            {Math.round(displayedHeading)}°
          </div>
          <div className="mt-1 text-sm text-black/60 text-center">
            {getCardinalDirection(Math.round(displayedHeading))}
            <span className="ml-2 text-xs text-black/40">{useTrue ? 'Gerçek' : 'Manyetik'}</span>
          </div>
          {needsCalibration && (
            <div className="mt-2 text-xs text-amber-600 text-center">Düşük doğruluk: cihazı 8 çizerek kalibre edin</div>
          )}
        </div>

        {/* Dial */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96">
          <div className="absolute left-1/2 -translate-x-1/2 -top-1">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[14px] border-l-transparent border-r-transparent border-b-red-500" />
          </div>
          <div
            className="absolute inset-0 rounded-full border border-black/15 bg-white backdrop-blur-sm"
            style={{ transform: `rotate(${displayedHeading}deg)` }}
          >
            {Array.from({ length: 24 }, (_, i) => i * 15).map((deg) => (
              <div key={`maj-${deg}`} className="absolute top-0 left-1/2" style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}>
                <div className="w-0.5 h-4 bg-black/70" />
                <div className="absolute -translate-x-1/2 mt-1 text-[10px] text-black/70" style={{ top: "18px", transform: `translateX(-50%) rotate(${-deg}deg)` }}>
                  {deg}
                </div>
              </div>
            ))}
            {Array.from({ length: 72 }, (_, i) => i * 5).map((deg) => (
              <div key={`min-${deg}`} className="absolute top-0 left-1/2" style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}>
                <div className={`bg-black/40 ${deg % 15 === 0 ? 'w-0.5 h-4' : 'w-0.5 h-2'}`} />
              </div>
            ))}
            <div className="absolute inset-0">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xl font-semibold text-red-600">K</div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xl font-semibold text-black/70">G</div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xl font-semibold text-black/70">D</div>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-semibold text-black/70">B</div>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black" />
        </div>

        {/* Controls */}
        <div className="w-full max-w-md space-y-5">
          {/* True/Magnetic + Variation */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={useTrue} onCheckedChange={setUseTrue} id="true-toggle" />
                <Label htmlFor="true-toggle">Gerçek (True) göster</Label>
              </div>
              <div className="text-xs text-black/40">Ham okuma: {Math.round(heading)}°M</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grow">
                <Label className="text-xs">Manyetik Sapma (Variation) — Doğu +, Batı −</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={Number.isFinite(variationDeg) ? String(variationDeg) : ''}
                  onChange={(e) => setVariationDeg(parseFloat(e.target.value || '0'))}
                  className="bg-black/5 border-black/10"
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Switch checked={autoVariation} onCheckedChange={(v) => { setAutoVariation(v); if (v) handleAutoVariation(); }} id="auto-var" />
                  <Label htmlFor="auto-var">Otomatik</Label>
                </div>
                <Button size="sm" variant="secondary" onClick={handleAutoVariation} disabled={isFetchingVariation}>
                  {isFetchingVariation ? 'Alınıyor…' : 'Konumdan Al'}
                </Button>
              </div>
            </div>
            {!!variationError && <div className="text-xs text-red-600">{variationError}</div>}
          </div>

          {/* Target heading */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2">
              <Switch checked={enableTarget} onCheckedChange={setEnableTarget} id="target" />
              <Label htmlFor="target">Hedef Kerteriz</Label>
              {enableTarget && (
                <span className={`ml-auto text-xs ${onCourseRef.current ? 'text-emerald-600' : 'text-black/50'}`}>
                  {onCourseRef.current ? 'Hatta' : 'Hattın Dışında'}
                </span>
              )}
            </div>
            {enableTarget && (
              <div className="flex items-center gap-3">
                <div className="grow">
                  <Label className="text-xs">Hedef (°)</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={359}
                    value={String(Math.round(targetHeading))}
                    onChange={(e) => setTargetHeading(normalizeDegrees(parseFloat(e.target.value || '0')))}
                    className="bg-black/5 border-black/10"
                  />
                </div>
                <div className="grow">
                  <Label className="text-xs">Eşik (°)</Label>
                  <Slider value={[targetThreshold]} min={1} max={20} step={1} onValueChange={(v) => setTargetThreshold(v?.[0] || 5)} />
                </div>
              </div>
            )}
          </div>

          {/* Smoothing / Freeze / Big digits / Wake lock */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <div className="grow">
                <Label className="text-xs">Yumuşatma</Label>
                <Slider value={[Math.round((smoothingFactor || 0) * 100)]} min={0} max={100} step={5} onValueChange={(v) => setSmoothingFactor(((v?.[0] || 0) / 100))} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={freeze} onCheckedChange={setFreeze} id="freeze" />
                <Label htmlFor="freeze">Dondur</Label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={bigDigits} onCheckedChange={setBigDigits} id="big" />
                <Label htmlFor="big">Büyük Rakamlar</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={wakeLockEnabled} onCheckedChange={setWakeLockEnabled} id="wakelock" />
                <Label htmlFor="wakelock">Ekranı Açık Tut</Label>
              </div>
            </div>
          </div>

          {/* Permissions and support states */}
          {!isSupported && (
            <div className="text-sm text-black/70">Bu cihaz pusula sensörünü desteklemiyor</div>
          )}
          {isSupported && permission === 'pending' && (
            <Button onClick={requestPermission} className="w-full">Pusulayı Etkinleştir</Button>
          )}
          {permission === 'denied' && (
            <div className="text-sm text-red-600">Pusula izni reddedildi. Ayarlardan izin verin.</div>
          )}

          {/* Technical details */}
          <div className="mt-2 text-[11px] text-black/40">
            Ham: {Math.round(rawHeading)}°M • Yön: {Math.round(heading)}°M • Varyasyon: {(variationDeg >= 0 ? '+' : '') + (variationDeg || 0)}° • Gösterim: {Math.round(displayedHeading)}°{useTrue ? 'T' : 'M'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompassPage;