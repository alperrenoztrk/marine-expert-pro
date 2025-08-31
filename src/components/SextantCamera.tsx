import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SextantCameraProps {
  onHoMeasured?: (degrees: number) => void;
  className?: string;
}

// Simple dip correction: Dip (minutes) ≈ 1.76 * sqrt(heightOfEye_m)
const computeDipCorrectionDeg = (heightOfEyeMeters: number) => {
  if (!heightOfEyeMeters || heightOfEyeMeters <= 0) return 0;
  const dipMinutes = 1.76 * Math.sqrt(heightOfEyeMeters);
  return dipMinutes / 60;
};

export const SextantCamera: React.FC<SextantCameraProps> = ({ onHoMeasured, className = "" }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasOrientationPermission, setHasOrientationPermission] = useState<boolean>(false);
  const [pitchDeg, setPitchDeg] = useState<number>(0);
  const [horizonPitchDeg, setHorizonPitchDeg] = useState<number | null>(null);
  const [sunPitchDeg, setSunPitchDeg] = useState<number | null>(null);
  const [indexErrorMinutes, setIndexErrorMinutes] = useState<number>(0);
  const [heightOfEyeMeters, setHeightOfEyeMeters] = useState<number>(10);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      streamRef.current = stream;
      setIsStreaming(true);
    } catch (err) {
      console.error("Camera start failed", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => {
      // cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const requestOrientationPermission = useCallback(async () => {
    try {
      const w = window as any;
      if (typeof w.DeviceOrientationEvent !== "undefined" && typeof w.DeviceOrientationEvent.requestPermission === "function") {
        const res = await w.DeviceOrientationEvent.requestPermission();
        if (res === "granted") setHasOrientationPermission(true);
        else setHasOrientationPermission(false);
      } else {
        // Non iOS - assume available
        setHasOrientationPermission(true);
      }
    } catch (e) {
      setHasOrientationPermission(false);
    }
  }, []);

  useEffect(() => {
    if (!hasOrientationPermission) return;
    const handle = (ev: DeviceOrientationEvent) => {
      // beta: front-to-back tilt in degrees, -180..180. 0 means device flat. We use it as pitch.
      const beta = typeof ev.beta === "number" ? ev.beta : 0;
      setPitchDeg(beta);
    };
    window.addEventListener("deviceorientation", handle);
    return () => window.removeEventListener("deviceorientation", handle);
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
    const corrected = rawAltitudeDeg + indexErrorDeg - dipDeg;
    return Math.max(0, corrected);
  }, [rawAltitudeDeg, indexErrorMinutes, heightOfEyeMeters]);

  const handleUseHo = useCallback(() => {
    if (onHoMeasured) onHoMeasured(correctedAltitudeDeg);
  }, [onHoMeasured, correctedAltitudeDeg]);

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

      <div className="relative w-full rounded-lg overflow-hidden border bg-black aspect-[3/4]">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Crosshair */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white/60" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 border-t border-white/50" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 border-l border-white/50" />

          {/* Live pitch indicator */}
          <div className="absolute left-2 top-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Eğilme (pitch): {pitchDeg.toFixed(1)}°
          </div>
          {/* Captured markers */}
          <div className="absolute right-2 top-2 space-y-1">
            <Badge variant="secondary">Horizon: {horizonPitchDeg == null ? "-" : `${horizonPitchDeg.toFixed(1)}°`}</Badge>
            <Badge variant="secondary">Güneş: {sunPitchDeg == null ? "-" : `${sunPitchDeg.toFixed(1)}°`}</Badge>
          </div>
          {/* Measured altitude */}
          <div className="absolute left-2 bottom-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
            Ho (ham): {rawAltitudeDeg.toFixed(2)}°
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
    </div>
  );
};

export default SextantCamera;

