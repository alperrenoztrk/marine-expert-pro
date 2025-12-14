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

  return (
    <div
      className="relative min-h-[100svh] overflow-hidden bg-gradient-to-br from-[#0b5f98] via-[#0fa3b6] to-[#2fe3d3]"
    >
      {/* Background texture/pattern (subtle icons/lines) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <svg viewBox="0 0 1200 800" className="h-full w-full">
          <g fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2">
            {/* Simple ship outline */}
            <path d="M130 205 h190 l-30 40 h-130 z" opacity="0.7" />
            <path d="M165 205 v-60 h85 v60" opacity="0.55" />
            <path d="M250 170 h35" opacity="0.55" />

            {/* Radar circles */}
            <circle cx="880" cy="160" r="40" opacity="0.55" />
            <circle cx="880" cy="160" r="70" opacity="0.35" />
            <circle cx="880" cy="160" r="100" opacity="0.25" />

            {/* A couple nautical glyphs */}
            <path d="M980 260 l30 -30 l30 30 l-30 30 z" opacity="0.35" />
            <path d="M990 510 q40 -40 80 0 q-40 40 -80 0 z" opacity="0.25" />
          </g>
        </svg>
      </div>

      {/* Soft highlight overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.14),transparent_60%)]" />

      {/* Waves */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-[42vh] w-full">
          <path
            fill="rgba(255,255,255,0.20)"
            d="M0,160L80,149.3C160,139,320,117,480,112C640,107,800,117,960,138.7C1120,160,1280,192,1360,208L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
          <path
            fill="rgba(255,255,255,0.10)"
            d="M0,200L80,181.3C160,163,320,125,480,128C640,131,800,175,960,197.3C1120,219,1280,219,1360,219L1440,219L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
          <path
            fill="rgba(0,70,130,0.16)"
            d="M0,256L80,256C160,256,320,256,480,245.3C640,235,800,213,960,197.3C1120,181,1280,171,1360,165.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-6 text-center">
        {/* Title */}
        <div className="pt-20">
          <h1
            className="select-none font-extrabold leading-[0.95] tracking-[0.12em] text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
            style={{ WebkitTextStroke: "2px rgba(0,0,0,0.18)" }}
          >
            <span className="block text-[clamp(3.2rem,10vw,6.2rem)]">MARINE</span>
            <span className="mt-3 block text-[clamp(3.2rem,10vw,6.2rem)]">EXPERT</span>
          </h1>
        </div>

        {/* Compass */}
        <div className="mt-14 grid place-items-center">
          <div className="relative h-[clamp(16rem,52vw,22rem)] w-[clamp(16rem,52vw,22rem)] drop-shadow-[0_22px_40px_rgba(0,0,0,0.35)]">
            <SplashCompassDial
            headingDeg={headingDeg ?? 0}
            className="h-full w-full select-none pointer-events-none"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-auto w-full pb-[max(2.25rem,env(safe-area-inset-bottom))]">
          <Link to="/calculations" className="inline-block w-full max-w-[28rem]" aria-label="Keşfetmeye Başla">
            <Button className="w-full rounded-full py-8 text-[clamp(1.75rem,5vw,2.6rem)] font-extrabold text-white shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] bg-gradient-to-r from-[#19e6e0] via-[#18d8e6] to-[#3be6ff] border border-white/30">
              Keşfetmeye Başla
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
