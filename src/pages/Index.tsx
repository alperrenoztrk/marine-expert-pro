import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MetalCompassDial from "@/components/ui/MetalCompassDial";
import { Settings } from "lucide-react";
// WeatherWidget anasayfadan kaldırıldı ve boş sayfaya taşındı

const Index = () => {
  const navigate = useNavigate();
  // Gesture tracking for progressive, momentum-like horizontal swipe
  const touchStartX = useRef<number | null>(null);
  const lastTouchX = useRef<number | null>(null);
  const lastTouchTime = useRef<number | null>(null);
  const velocityX = useRef<number>(0);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetRoute, setTargetRoute] = useState<string | null>(null);
  const totalPages = 2; // Ana sayfa ve sol sayfa (Pusula/Weather)

  // Compass state
  const [headingDeg, setHeadingDeg] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    touchStartX.current = x;
    lastTouchX.current = x;
    lastTouchTime.current = performance.now();
    velocityX.current = 0;
    setIsDragging(true);
    setIsAnimating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const x = e.touches[0].clientX;
    const now = performance.now();
    const delta = x - touchStartX.current;
    setTranslateX(delta);
    // velocity (px/ms)
    if (lastTouchX.current != null && lastTouchTime.current != null) {
      const dx = x - lastTouchX.current;
      const dt = Math.max(1, now - lastTouchTime.current);
      velocityX.current = dx / dt;
    }
    lastTouchX.current = x;
    lastTouchTime.current = now;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || lastTouchX.current === null) return;
    const distance = lastTouchX.current - touchStartX.current;
    const speed = velocityX.current; // px/ms
    const width = typeof window !== 'undefined' ? window.innerWidth : 360;
    const distanceThreshold = Math.min(180, Math.max(60, width * 0.14));
    const velocityThreshold = 0.35; // px/ms, daha hassas

    let navigateLeft = false;
    let navigateRight = false;

    if (distance <= -distanceThreshold || speed <= -velocityThreshold) {
      navigateLeft = true;
    } else if (distance >= distanceThreshold || speed >= velocityThreshold) {
      navigateRight = true;
    }

    setIsDragging(false);

    if (navigateLeft) {
      setIsAnimating(true);
      setTargetRoute('/empty-page');
      setTranslateX(-width);
    } else if (navigateRight) {
      // Sağ sayfa kaldırıldı, merkeze geri dön
      setIsAnimating(true);
      setTargetRoute(null);
      setTranslateX(0);
    } else {
      // Snap back to center
      setIsAnimating(true);
      setTargetRoute(null);
      setTranslateX(0);
    }

    // Reset refs
    touchStartX.current = null;
    lastTouchX.current = null;
    lastTouchTime.current = null;
    velocityX.current = 0;
  };

  const handleTransitionEnd = () => {
    if (isAnimating && targetRoute) {
      navigate(targetRoute);
    } else {
      setIsAnimating(false);
    }
  };

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

  

  const handleDotClick = (pageIndex: number) => {
    if (pageIndex === 0) {
      navigate('/');
    } else if (pageIndex === 1) {
      navigate('/empty-page');
    }
  };

  return (
    <div 
      className="relative min-h-screen overflow-hidden bg-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative h-full w-full"
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isAnimating && !isDragging ? 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          willChange: 'transform',
        }}
      >
      {/* Purple Settings gear icon (top-right) */}
      <Link to="/settings" className="fixed right-6 top-6 z-20">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg border-2 border-white/30 transition-all duration-200"
          title="Ayarlar"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </Link>

      {/* Page indicators - dots at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === 0 // Ana sayfa
                ? 'bg-white w-6 shadow-lg'
                : 'bg-white/50 w-2 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Main content - centered */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Title with maritime colors */}
        <div className="mb-12">
          <h1 className="maritime-title text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span 
              className="block text-blue-600 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
            >
              Marine
            </span>
            <span 
              className="block text-blue-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
            >
              Expert
            </span>
          </h1>
          
          {/* Subtitle */}
          <p 
            className="maritime-subtitle text-lg md:text-xl text-black font-medium mt-6 drop-shadow-md" 
            data-translatable
            style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.8)" }}
          >
            Tüm denizcilerin ortak uygulaması
          </p>
        </div>

        

        {/* Buttons with maritime styling */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Compass Menu Button with image dial and real heading */}
          <Link to="/calculations" className="relative w-fit mx-auto group" aria-label="Pusula ve Menü">
            <div className="relative h-44 w-44 md:h-52 md:w-52 transition-transform duration-200 hover:scale-105">
              <MetalCompassDial
                headingDeg={headingDeg ?? 0}
                className="h-full w-full select-none pointer-events-none drop-shadow-xl"
              />

              {/* Heading readout tag inside the dial bottom */}
              <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 text-xs md:text-sm font-semibold select-none bg-white/95 text-blue-700 rounded px-2 py-0.5 shadow">
                {headingDeg != null ? `${Math.round(headingDeg)}°` : "Pusula"}
              </div>
            </div>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Index;
