import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SplashCompassDial from "@/components/ui/SplashCompassDial";
import { createCompassListener, requestCompassPermission } from "@/utils/heading";

const Index = () => {
  // Compass state
  const [headingDeg, setHeadingDeg] = useState<number | null>(null);

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


  return (
    <div
      className="relative min-h-[100svh] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #2a4a5e 0%, #1e3a4a 30%, #1a3040 60%, #152535 100%)'
      }}
    >
      {/* Subtle texture overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-6 text-center">
        {/* Title */}
        <div className="pt-12 sm:pt-16">
          <h1 className="select-none font-black tracking-wider text-[#a8c4d4]">
            <span className="block text-[clamp(2.8rem,10vw,5rem)] leading-tight">MARINE</span>
            <span className="block text-[clamp(2.8rem,10vw,5rem)] leading-tight">EXPERT</span>
          </h1>
        </div>

        {/* Compass */}
        <div className="mt-8 flex-1 flex items-center justify-center">
          <div className="relative h-[clamp(12rem,40vw,16rem)] w-[clamp(12rem,40vw,16rem)]">
            <div className="relative h-full w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <SplashCompassDial
                headingDeg={headingDeg ?? 0}
                className="h-full w-full select-none pointer-events-none"
              />
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
