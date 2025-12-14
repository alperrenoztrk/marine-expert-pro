import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SplashCompassDial from "@/components/ui/SplashCompassDial";
import { createCompassListener, requestCompassPermission } from "@/utils/heading";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  // Compass state
  const [headingDeg, setHeadingDeg] = useState<number | null>(null);

  // Swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

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

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const distance = touchEndX.current - touchStartX.current;
    const isLeftSwipe = distance < -100; // Sola kaydırma - ileri git
    
    if (isLeftSwipe) {
      navigate('/widgets');
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Click navigation for left and right zones
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return;
    }

    const clickX = e.clientX;
    const clickY = e.clientY;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Only navigate if click is above 70% of screen height (above the button area)
    if (clickY > screenHeight * 0.70) return;
    
    // Right 35% zone - go to widgets
    if (clickX > screenWidth * 0.65) {
      navigate('/widgets');
    }
  };

  return (
    <div
      className="relative min-h-[100svh] overflow-hidden bg-[url('/nautical-chart-background.svg')] bg-cover bg-center bg-no-repeat touch-auto cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Contrast overlay for readability on chart background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.10),rgba(0,0,0,0.55))]" />

      {/* Settings button - hidden to match the design */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate('/settings');
        }}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors opacity-50 hover:opacity-100"
        aria-label="Ayarlar"
      >
        <Settings className="w-5 h-5 text-white" />
      </button>

      {/* Right arrow indicator - subtle */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-30">
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-6 text-center">
        {/* Title */}
        <div className="pt-16">
          <h1
            className="select-none font-extrabold leading-[0.92] tracking-[0.08em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            style={{ 
              WebkitTextStroke: "1.5px rgba(0,0,0,0.15)",
              textShadow: "0 4px 12px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)"
            }}
          >
            <span className="block text-[clamp(3.5rem,11vw,7rem)] font-black">MARINE</span>
            <span className="mt-2 block text-[clamp(3.5rem,11vw,7rem)] font-black">EXPERT</span>
          </h1>
        </div>

        {/* Compass with glow effect */}
        <div className="mt-12 grid place-items-center flex-1 items-center">
          <div className="relative h-[clamp(15rem,48vw,20rem)] w-[clamp(15rem,48vw,20rem)]">
            {/* Glow effect behind compass */}
            <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl scale-110"></div>
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl scale-105"></div>
            
            <div className="relative h-full w-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]">
              <SplashCompassDial
                headingDeg={headingDeg ?? 0}
                className="h-full w-full select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="w-full pb-[max(3rem,env(safe-area-inset-bottom))] pt-8">
          <Link to="/calculations" className="inline-block w-full max-w-[26rem]" aria-label="Keşfetmeye Başla">
            <Button className="w-full rounded-full py-7 text-[clamp(1.6rem,4.5vw,2.2rem)] font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] active:scale-[0.98] bg-[#20d5d5] hover:bg-[#25e0e0] border-2 border-white/40">
              Keşfetmeye Başla
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
