import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CelestialAROverlay } from "./CelestialAROverlay";
import { CelestialBodySelector } from "./CelestialBodySelector";
import { 
  getAllVisibleCelestialBodies, 
  calculateRefraction,
  ObserverPosition,
  CelestialBody,
  celestialToScreenCoordinates 
} from "@/utils/celestialCalculations";
import {
  startCameraStream,
  stopCameraStream,
  requestDeviceOrientationPermission,
  addDeviceOrientationListener,
  computeDipCorrectionDeg,
  type CameraSession,
} from "@/utils/celestialCamera";

interface SextantCameraProps {
  onHoMeasured?: (degrees: number) => void;
  className?: string;
  observerPosition?: {
    latitude: number;
    longitude: number;
  };
}

// Dip correction moved to utils

export const SextantCamera: React.FC<SextantCameraProps> = ({ 
  onHoMeasured, 
  className = "",
  observerPosition = { latitude: 41.0082, longitude: 28.9784 } // Default to Istanbul
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraSessionRef = useRef<CameraSession | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasOrientationPermission, setHasOrientationPermission] = useState<boolean>(false);
  const [pitchDeg, setPitchDeg] = useState<number>(0);
  const [horizonPitchDeg, setHorizonPitchDeg] = useState<number | null>(null);
  const [sunPitchDeg, setSunPitchDeg] = useState<number | null>(null);
  const [indexErrorMinutes, setIndexErrorMinutes] = useState<number>(0);
  const [heightOfEyeMeters, setHeightOfEyeMeters] = useState<number>(10);
  
  // AR overlay states
  const [showAROverlay, setShowAROverlay] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showOnlyNavigationStars, setShowOnlyNavigationStars] = useState<boolean>(false);
  const [minimumMagnitude, setMinimumMagnitude] = useState<number>(3.0);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 });
  const [selectedCelestialBody, setSelectedCelestialBody] = useState<CelestialBody | null>(null);
  const [autoIdentify, setAutoIdentify] = useState<boolean>(true);
  const [identifyThresholdPx, setIdentifyThresholdPx] = useState<number>(48);
  const [identifiedCelestial, setIdentifiedCelestial] = useState<(CelestialBody & { screenX: number; screenY: number }) | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (!videoRef.current) return;
      const session = await startCameraStream(videoRef.current, { facingMode: 'environment' });
      cameraSessionRef.current = session;
      setIsStreaming(session.isStreaming);
    } catch (err) {
      console.error("Camera start failed", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    stopCameraStream(cameraSessionRef.current, videoRef.current);
    cameraSessionRef.current = null;
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Update screen dimensions when video loads
  useEffect(() => {
    const updateDimensions = () => {
      if (videoRef.current) {
        setScreenDimensions({
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight
        });
      }
    };

    if (isStreaming && videoRef.current) {
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, [isStreaming]);

  const requestOrientationPermission = useCallback(async () => {
    const granted = await requestDeviceOrientationPermission();
    setHasOrientationPermission(granted);
  }, []);

  useEffect(() => {
    if (!hasOrientationPermission) return;
    const remove = addDeviceOrientationListener(({ alpha, beta, gamma }) => {
      setPitchDeg(beta);
      setDeviceOrientation({ alpha, beta, gamma });
    });
    return remove;
  }, [hasOrientationPermission]);

  // Raw measured angle between stored horizon pitch and stored sun pitch
  const rawAltitudeDeg = useMemo(() => {
    if (horizonPitchDeg == null || sunPitchDeg == null) return 0;
    return Math.abs(sunPitchDeg - horizonPitchDeg);
  }, [horizonPitchDeg, sunPitchDeg]);

  const correctedAltitudeDeg = useMemo(() => {
    // Apply index error (minutes, positive if off-the-arc) and dip (subtract)
    const indexErrorDeg = (indexErrorMinutes || 0) / 60;
    const dipDeg = computeDipCorrectionDeg(heightOfEyeMeters || 0);
    const refractionDeg = calculateRefraction(rawAltitudeDeg);
    const corrected = rawAltitudeDeg + indexErrorDeg - dipDeg - refractionDeg;
    return Math.max(0, corrected);
  }, [rawAltitudeDeg, indexErrorMinutes, heightOfEyeMeters]);

  // Calculate celestial bodies positions for AR overlay
  const celestialBodies = useMemo(() => {
    if (!hasOrientationPermission) return [];
    
    const observer: ObserverPosition = {
      latitude: observerPosition.latitude,
      longitude: observerPosition.longitude,
      dateTime: new Date(),
      timeZone: 3 // Turkey timezone
    };
    
    return getAllVisibleCelestialBodies(observer);
  }, [observerPosition, hasOrientationPermission]);

  const handleUseHo = useCallback(() => {
    if (onHoMeasured) onHoMeasured(correctedAltitudeDeg);
  }, [onHoMeasured, correctedAltitudeDeg]);

  // Project celestial bodies to screen coordinates for identification
  const bodiesInView = useMemo(() => {
    if (!isStreaming || !hasOrientationPermission || screenDimensions.width === 0 || screenDimensions.height === 0) return [] as (CelestialBody & { screenX: number; screenY: number; isInView: boolean })[];
    return celestialBodies
      .map((body) => {
        const pos = celestialToScreenCoordinates(
          body.altitude,
          body.azimuth,
          deviceOrientation,
          screenDimensions.width,
          screenDimensions.height
        );
        return { ...body, screenX: pos.x, screenY: pos.y, isInView: pos.isInView };
      })
      .filter((b) => b.isInView);
  }, [celestialBodies, deviceOrientation, screenDimensions, isStreaming, hasOrientationPermission]);

  // Auto-identify nearest celestial to the crosshair center
  useEffect(() => {
    if (!autoIdentify) {
      setIdentifiedCelestial(null);
      return;
    }
    if (bodiesInView.length === 0) {
      setIdentifiedCelestial(null);
      return;
    }
    const centerX = screenDimensions.width / 2;
    const centerY = screenDimensions.height / 2;
    let best: (CelestialBody & { screenX: number; screenY: number }) | null = null;
    let bestDist = Infinity;
    for (const b of bodiesInView) {
      const dx = b.screenX - centerX;
      const dy = b.screenY - centerY;
      const d = Math.hypot(dx, dy);
      if (d < bestDist) {
        bestDist = d;
        best = b;
      }
    }
    if (best && bestDist <= identifyThresholdPx) {
      setIdentifiedCelestial(best);
      setSelectedCelestialBody(best);
    } else {
      setIdentifiedCelestial(null);
    }
  }, [autoIdentify, bodiesInView, screenDimensions, identifyThresholdPx]);

  return (
    <div className={["w-full space-y-3", className].join(" ")}> 
      <div className="flex gap-2">
        {!isStreaming ? (
          <Button onClick={startCamera} className="w-full">Kamerayı Başlat</Button>
        ) : (
          <Button variant="destructive" onClick={stopCamera} className="w-full">Kamerayı Durdur</Button>
        )}
        <Button variant={hasOrientationPermission ? "outline" : "default"} onClick={requestOrientationPermission}>
          Sensör İzni
        </Button>
      </div>

      {/* AR Overlay Controls */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="showAR" className="text-sm font-medium">AR Gök Cismi Overlay</Label>
            <Switch
              id="showAR"
              checked={showAROverlay}
              onCheckedChange={setShowAROverlay}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="showLabels" className="text-sm">İsim Etiketleri</Label>
            <Switch
              id="showLabels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
              disabled={!showAROverlay}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoIdentify" className="text-sm">Otomatik Tanıma</Label>
            <Switch
              id="autoIdentify"
              checked={autoIdentify}
              onCheckedChange={setAutoIdentify}
              disabled={!showAROverlay}
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="navStarsOnly" className="text-sm">Sadece Seyir Yıldızları</Label>
            <Switch
              id="navStarsOnly"
              checked={showOnlyNavigationStars}
              onCheckedChange={setShowOnlyNavigationStars}
              disabled={!showAROverlay}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="magnitude" className="text-sm">Min. Parlaklık (mag)</Label>
            <Input
              id="magnitude"
              type="number"
              step="0.5"
              min="0"
              max="6"
              value={minimumMagnitude}
              onChange={(e) => setMinimumMagnitude(parseFloat(e.target.value) || 3.0)}
              disabled={!showAROverlay}
              className="text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identifyThreshold" className="text-sm">Tanıma Eşiği (px)</Label>
            <Input
              id="identifyThreshold"
              type="number"
              min="8"
              max="200"
              step="4"
              value={identifyThresholdPx}
              onChange={(e) => setIdentifyThresholdPx(parseFloat(e.target.value) || 48)}
              disabled={!showAROverlay || !autoIdentify}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      <div className="relative w-full rounded-lg overflow-hidden border bg-black aspect-[3/4]">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
        
        {/* AR Celestial Overlay */}
        {showAROverlay && isStreaming && hasOrientationPermission && screenDimensions.width > 0 && (
          <CelestialAROverlay
            celestialBodies={celestialBodies}
            deviceOrientation={deviceOrientation}
            screenWidth={screenDimensions.width}
            screenHeight={screenDimensions.height}
            showLabels={showLabels}
            showOnlyNavigationStars={showOnlyNavigationStars}
            minimumMagnitude={minimumMagnitude}
          />
        )}

        {/* Identified celestial highlight */}
        {identifiedCelestial && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute"
              style={{
                left: identifiedCelestial.screenX,
                top: identifiedCelestial.screenY,
                transform: "translate(-50%, -50%)"
              }}
            >
              <div className="w-16 h-16 rounded-full border-2 border-yellow-400 animate-pulse" />
            </div>
            <div
              className="absolute"
              style={{
                left: identifiedCelestial.screenX,
                top: identifiedCelestial.screenY + 40,
                transform: "translate(-50%, 0)"
              }}
            >
              <Badge variant="default" className="bg-yellow-500 text-black">
                {identifiedCelestial.name}
                {typeof identifiedCelestial.magnitude === "number" && (
                  <span className="ml-1">· mag {identifiedCelestial.magnitude.toFixed(1)}</span>
                )}
              </Badge>
            </div>
          </div>
        )}
        
        {/* Traditional Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Enhanced Crosshair with degree markings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Main crosshair circle */}
            <div className="w-40 h-40 rounded-full border-2 border-white/60" />
            
            {/* Degree markings around crosshair */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const x = Math.sin(angle) * 80;
              const y = -Math.cos(angle) * 80;
              return (
                <div
                  key={i}
                  className="absolute w-1 h-3 bg-white/70"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg)`
                  }}
                />
              );
            })}
            
            {/* Central crosshair lines */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 border-t border-white/50" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 border-l border-white/50" />
            
            {/* Center dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
          </div>

          {/* Live orientation indicators */}
          <div className="absolute left-2 top-2 space-y-1">
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              Pitch: {pitchDeg.toFixed(1)}°
            </div>
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              Azimuth: {deviceOrientation.alpha.toFixed(1)}°
            </div>
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              Roll: {deviceOrientation.gamma.toFixed(1)}°
            </div>
          </div>
          
          {/* Captured markers */}
          <div className="absolute right-2 top-2 space-y-1">
            <Badge variant="secondary">Horizon: {horizonPitchDeg == null ? "-" : `${horizonPitchDeg.toFixed(1)}°`}</Badge>
            <Badge variant="secondary">Güneş: {sunPitchDeg == null ? "-" : `${sunPitchDeg.toFixed(1)}°`}</Badge>
          </div>
          
          {/* Enhanced measurement display */}
          <div className="absolute left-2 bottom-2 space-y-1">
            <div className="bg-black/50 text-white text-sm px-2 py-1 rounded">
              Ho (ham): {rawAltitudeDeg.toFixed(2)}°
            </div>
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              Refraksiyon: -{calculateRefraction(rawAltitudeDeg).toFixed(2)}°
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => setHorizonPitchDeg(pitchDeg)} variant="outline">Ufku Ayarla</Button>
        <Button onClick={() => setSunPitchDeg(pitchDeg)} variant="outline">Güneşi Kilitle</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="indexError">İndeks Hatası (Dakika)</Label>
          <Input id="indexError" type="number" step="0.1" value={indexErrorMinutes}
                 onChange={(e) => setIndexErrorMinutes(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heightEye">Göz Yüksekliği (m)</Label>
          <Input id="heightEye" type="number" step="0.1" value={heightOfEyeMeters}
                 onChange={(e) => setHeightOfEyeMeters(parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          Ho (düzeltilmiş): <span className="font-semibold">{correctedAltitudeDeg.toFixed(2)}°</span>
        </div>
        <Button onClick={handleUseHo} disabled={!isFinite(correctedAltitudeDeg)}>Bu Ho Değerini Kullan</Button>
      </div>

      {/* Celestial Body Selector */}
      {showAROverlay && hasOrientationPermission && (
        <div className="mt-4">
          <CelestialBodySelector
            celestialBodies={celestialBodies}
            selectedBody={selectedCelestialBody}
            onSelectBody={setSelectedCelestialBody}
          />
        </div>
      )}
    </div>
  );
};

export default SextantCamera;

