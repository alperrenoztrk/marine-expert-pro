import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MetalCompassDial from "@/components/ui/MetalCompassDial";
import { createCompassListener, requestCompassPermission } from "@/utils/heading";

const Index = () => {
  // Compass state
  const [headingDeg, setHeadingDeg] = useState<number | null>(null);

  // --- Compass logic using unified listener ---
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const initCompass = async () => {
      // Request permission on iOS
      const granted = await requestCompassPermission();
      if (!granted) {
        console.warn('Compass permission not granted');
      }
      
      // Start listening regardless (will work on Android without explicit permission)
      cleanup = createCompassListener((heading) => {
        setHeadingDeg(Math.round(heading));
      }, 0.3);
    };

    initCompass();

    return () => {
      if (cleanup) {
        cleanup();
      }
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

  const waveSvg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%230a75c6' fill-opacity='0.28' d='M0,256L80,240C160,224,320,192,480,186.7C640,181,800,203,960,186.7C1120,171,1280,117,1360,90.7L1440,64L1440,320L0,320Z'%3E%3C/path%3E%3C/svg%3E";

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#66cdf8] via-[#29b6f6] to-[#0f7ec7]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Floating glow accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute right-0 top-32 h-52 w-52 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute left-10 bottom-24 h-56 w-56 rounded-full bg-sky-300/25 blur-[120px]" />
      </div>

      {/* Wave pattern */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-80"
        style={{ backgroundImage: `url(${waveSvg})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Title */}
        <div className="mb-12 mt-12 sm:mt-16 md:mt-24">
          <p className="text-base md:text-lg font-semibold tracking-[0.35em] text-white/80 uppercase">Marine Expert</p>
          <h1 className="maritime-title font-extrabold leading-tight mb-4 text-white drop-shadow-lg">
            <span className="block text-6xl md:text-7xl lg:text-8xl">Marine</span>
            <span className="block text-6xl md:text-7xl lg:text-8xl">Expert</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium">Tüm denizcilerin ortak uygulaması</p>
        </div>

        {/* Compass */}
        <div className="relative mb-16 flex items-center justify-center">
          <div className="absolute h-64 w-64 md:h-72 md:w-72 rounded-full bg-white/15 blur-2xl" />
          <div className="relative h-56 w-56 md:h-64 md:w-64 rounded-full bg-gradient-to-b from-white/70 via-white/40 to-white/10 p-4 shadow-[0_25px_60px_rgba(9,98,164,0.35)] ring-4 ring-white/30 backdrop-blur-md">
            <div className="flex h-full items-center justify-center rounded-full bg-gradient-to-b from-[#1a365d] via-[#0f2a4a] to-[#061b34] shadow-inner">
              <MetalCompassDial
                headingDeg={headingDeg ?? 0}
                className="h-[92%] w-[92%] select-none pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link to="/calculations" className="z-20" aria-label="Keşfetmeye Başla">
          <Button className="animate-fade-in hover-scale rounded-full px-14 md:px-16 py-6 md:py-7 text-xl md:text-2xl font-bold bg-gradient-to-r from-[#18a0fb] to-[#0f80d6] hover:from-[#0f97f3] hover:to-[#0d75bd] text-white shadow-[0_20px_45px_rgba(10,118,198,0.4)] border border-white/30 transition-all duration-300 hover:shadow-[0_25px_55px_rgba(10,118,198,0.55)] animate-pulse-subtle">
            Keşfetmeye Başla
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
