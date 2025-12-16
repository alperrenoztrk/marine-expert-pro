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
  const touchStartY = useRef<number | null>(null);
  const touchLastX = useRef<number | null>(null);
  const touchLastY = useRef<number | null>(null);
  const didSwipeRef = useRef(false);

  // --- Compass logic using unified listener ---
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const initCompass = async () => {
      const granted = await requestCompassPermission();
      if (!granted) {
        console.warn('Compass permission not granted');
      }
      
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
    didSwipeRef.current = false;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchLastX.current = null;
    touchLastY.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchLastX.current = e.targetTouches[0].clientX;
    touchLastY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const endTouch = e.changedTouches[0];
    const endX = touchLastX.current ?? endTouch.clientX;
    const endY = touchLastY.current ?? endTouch.clientY;
    
    const dx = endX - touchStartX.current;
    const dy = endY - touchStartY.current;

    if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy)) {
      touchStartX.current = null;
      touchStartY.current = null;
      touchLastX.current = null;
      touchLastY.current = null;
      return;
    }

    const isLeftSwipe = dx < 0;
    const isRightSwipe = dx > 0;
    
    if (isLeftSwipe) {
      didSwipeRef.current = true;
      navigate('/widgets');
    }
    if (isRightSwipe) {
      didSwipeRef.current = true;
      navigate('/maritime-news');
    }
    
    touchStartX.current = null;
    touchStartY.current = null;
    touchLastX.current = null;
    touchLastY.current = null;
  };

  const handleTouchCancel = () => {
    touchStartX.current = null;
    touchStartY.current = null;
    touchLastX.current = null;
    touchLastY.current = null;
    didSwipeRef.current = false;
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      return;
    }

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
    
    if (clickY > screenHeight * 0.70) return;
    
    if (clickX < screenWidth * 0.35) {
      navigate('/maritime-news');
      return;
    }
    if (clickX > screenWidth * 0.65) {
      navigate('/widgets');
    }
  };

  // Outer decorative degree numbers
  const outerDegrees = [0, 20, 30, 90, 120, 130, 180, 210, 260, 270, 280, 300, 330, 350, 360];

  return (
    <div
      className="relative min-h-[100svh] overflow-hidden touch-auto cursor-pointer"
      style={{
        background: 'linear-gradient(180deg, #2a4a5e 0%, #1e3a4a 30%, #1a3040 60%, #152535 100%)'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={handleClick}
    >
      {/* Subtle texture overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Settings button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate('/settings');
        }}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Ayarlar"
      >
        <Settings className="w-6 h-6 text-white/70" />
      </button>

      {/* Left arrow indicator */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-30">
        <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg animate-pulse" />
      </div>

      {/* Right arrow indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-30">
        <ChevronRight className="w-6 h-6 text-white drop-shadow-lg animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-6 text-center">
        {/* Title */}
        <div className="pt-12 sm:pt-16">
          <h1 className="select-none font-black tracking-wider text-[#a8c4d4]">
            <span className="block text-[clamp(2.8rem,10vw,5rem)] leading-tight">MARINE</span>
            <span className="block text-[clamp(2.8rem,10vw,5rem)] leading-tight">EXPERT</span>
          </h1>
        </div>

        {/* Compass with outer decorative ring */}
        <div className="mt-8 flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Outer decorative degree ring */}
            <svg
              viewBox="0 0 400 400"
              className="absolute -inset-[25%] w-[150%] h-[150%] pointer-events-none"
              style={{ opacity: 0.25 }}
            >
              {outerDegrees.map((deg) => {
                const rad = (deg - 90) * Math.PI / 180;
                const r = 180;
                const x = 200 + Math.cos(rad) * r;
                const y = 200 + Math.sin(rad) * r;
                return (
                  <text
                    key={`outer-${deg}`}
                    x={x}
                    y={y}
                    fill="#8aa8b8"
                    fontFamily="Arial, sans-serif"
                    fontSize="14"
                    fontWeight="400"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {deg === 360 ? '' : deg}
                  </text>
                );
              })}
            </svg>

            {/* Main compass */}
            <div className="relative h-[clamp(16rem,55vw,22rem)] w-[clamp(16rem,55vw,22rem)]">
              <div className="relative h-full w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                <SplashCompassDial
                  headingDeg={headingDeg ?? 0}
                  className="h-full w-full select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="w-full pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-6">
          <Link to="/calculations" className="inline-block w-full max-w-[22rem]" aria-label="Keşfetmeye Başla">
            <Button 
              className="w-full rounded-full py-6 text-[clamp(1.3rem,4vw,1.6rem)] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(180deg, #35e0e0 0%, #20c5c5 50%, #18b0b0 100%)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              Keşfetmeye Başla
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
