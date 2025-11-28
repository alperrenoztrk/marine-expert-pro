import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MetalCompassDial from "@/components/ui/MetalCompassDial";
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";
import WeatherWidget from "@/components/WeatherWidget";
import MoonPhaseWidget from "@/components/MoonPhaseWidget";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  // --- Horizontal swipe navigation ---
  const navigate = useNavigate();
  const touchStartXRef = useRef<number | null>(null);
  const touchLastXRef = useRef<number | null>(null);
  const swipeThresholdPx = 60;

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartXRef.current = e.targetTouches[0]?.clientX ?? null;
    touchLastXRef.current = touchStartXRef.current;
  };

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchLastXRef.current = e.targetTouches[0]?.clientX ?? touchLastXRef.current;
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    const startX = touchStartXRef.current;
    const lastX = touchLastXRef.current;
    touchStartXRef.current = null;
    touchLastXRef.current = null;
    if (startX == null || lastX == null) return;

    const deltaX = lastX - startX;
    if (deltaX <= -swipeThresholdPx) {
      // Left swipe -> go to empty page to the right
      navigate("/empty-page");
    } else if (deltaX >= swipeThresholdPx) {
      // Right swipe -> go to settings
      navigate("/settings");
    }
  };

  // --- Click navigation for left and right zones ---
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Only navigate if click is above 70% of screen height (above the red line)
    if (clickY > screenHeight * 0.70) return;
    
    // Left 35% zone
    if (clickX < screenWidth * 0.35) {
      navigate("/settings");
    }
    // Right 35% zone
    else if (clickX > screenWidth * 0.65) {
      navigate("/empty-page");
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-300 via-sky-300 to-sky-400"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Title */}
        <div className="mb-12 mt-20">
          <h1 className="maritime-title font-extrabold leading-none mb-4">
            <span className="block text-7xl md:text-8xl lg:text-9xl text-blue-900">
              Marine
            </span>
            <span className="block text-7xl md:text-8xl lg:text-9xl text-blue-900">
              Expert
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-900 font-medium">
            Tüm denizcilerin ortak uygulaması
          </p>
        </div>

        {/* Compass */}
        <div className="relative w-56 h-56 md:w-64 md:h-64 mb-16 drop-shadow-2xl">
          <MetalCompassDial
            headingDeg={headingDeg ?? 0}
            className="h-full w-full select-none pointer-events-none"
          />
        </div>

        {/* CTA Button */}
        <Link to="/calculations" className="z-20" aria-label="Keşfetmeye Başla">
          <Button className="animate-fade-in hover-scale rounded-full px-12 md:px-16 py-7 text-2xl md:text-3xl font-bold bg-blue-800 hover:bg-blue-900 text-white shadow-2xl border-4 border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(30,64,175,0.5)]">
            Keşfetmeye Başla
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
