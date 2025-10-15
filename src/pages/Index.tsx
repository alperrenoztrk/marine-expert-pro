import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MetalCompassDial from "@/components/ui/MetalCompassDial";
import { Settings } from "lucide-react";
// WeatherWidget anasayfadan kaldırıldı ve boş sayfaya taşındı

const Index = () => {
  // Compass state (2D only)
  const [headingDeg, setHeadingDeg] = useState<number | null>(null);

  // --- Compass logic ---
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    // iOS Safari provides webkitCompassHeading (0..360, CW from North).
    const anyEvent: any = event as any;
    let heading: number | null = null;

    if (typeof anyEvent?.webkitCompassHeading === "number") {
      const h = anyEvent.webkitCompassHeading;
      if (Number.isFinite(h)) heading = h;
    } else if (typeof event.alpha === "number") {
      // Convert alpha (0..360, CCW from device z-axis) to compass heading
      // Many devices use alpha=0 at North when absolute; 360-alpha gives CW from North
      heading = 360 - (event.alpha ?? 0);
    }

    if (heading != null && Number.isFinite(heading)) {
      const normalized = ((heading % 360) + 360) % 360;
      setHeadingDeg(normalized);
    }
  };

  const startCompass = () => {
    try {
      window.addEventListener("deviceorientation", handleDeviceOrientation, true);
    } catch {}
  };

  const stopCompass = () => {
    try {
      window.removeEventListener("deviceorientation", handleDeviceOrientation, true);
    } catch {}
  };

  useEffect(() => {
    const initCompass = async () => {
      try {
        const anyDOE = DeviceOrientationEvent as any;
        if (typeof anyDOE?.requestPermission === "function") {
          try {
            const response = await anyDOE.requestPermission();
            if (response === "granted") {
              startCompass();
              return;
            }
          } catch {}
          // Fallback: attempt to start even if permission not explicitly granted
          startCompass();
        } else {
          // Non-iOS
          startCompass();
        }
      } catch {
        // Last resort, try to start listener
        startCompass();
      }
    };
    initCompass();
    return () => {
      stopCompass();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-sky-200 to-sky-400">
      {/* Top right settings button */}
      <div className="fixed right-6 top-6 z-20 flex items-center">
        <Link to="/settings">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-blue-600/90 hover:bg-blue-700 text-white shadow-lg border-2 border-white/30"
            title="Ayarlar"
            aria-label="Ayarlar"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      {/* Decorative ocean waves background */}
      <img
        src="/maritime-home-background.svg"
        alt=""
        className="pointer-events-none select-none absolute inset-x-0 bottom-0 w-full"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Title */}
        <div className="mb-10">
          <h1 className="maritime-title font-bold mb-3 leading-tight">
            <span
              className="block text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-blue-700 to-blue-500 drop-shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
            >
              Marine
            </span>
            <span
              className="block text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-blue-700 to-blue-500 drop-shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
            >
              Expert
            </span>
          </h1>
          <p
            className="maritime-subtitle text-lg md:text-xl text-slate-800/90 font-medium mt-4"
            data-translatable
          >
            Tüm denizcilerin ortak uygulaması
          </p>
        </div>

        {/* Compass */}
        <div className="relative w-56 h-56 md:w-64 md:h-64 drop-shadow-2xl">
          <MetalCompassDial
            headingDeg={headingDeg ?? 0}
            className="h-full w-full select-none pointer-events-none"
          />
        </div>

        {/* CTA Button */}
        <Link to="/calculations" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20" aria-label="Keşfetmeye Başla">
          <Button className="rounded-full px-8 md:px-12 py-6 text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl">
            Keşfetmeye Başla
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
