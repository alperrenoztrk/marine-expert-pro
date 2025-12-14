import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SplashCompassDial from "@/components/ui/SplashCompassDial";

const Index = () => {
  return (
    <div
      className="relative min-h-[100svh] overflow-hidden bg-[#03233a] text-white"
      style={{
        backgroundImage: "url('/marine-expert-hero.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Contrast overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/40" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-6 text-center">
        {/* Title */}
        <div className="pt-20">
          <h1
            className="select-none font-extrabold leading-[0.95] tracking-[0.12em] drop-shadow-[0_10px_26px_rgba(0,0,0,0.45)]"
            style={{ WebkitTextStroke: "2px rgba(0,0,0,0.22)" }}
          >
            <span className="block text-[clamp(3.2rem,10vw,6.2rem)]">MARINE</span>
            <span className="mt-3 block text-[clamp(3.2rem,10vw,6.2rem)]">EXPERT</span>
          </h1>
        </div>

        {/* Compass */}
        <div className="mt-14 grid place-items-center">
          <div className="relative h-[clamp(16rem,52vw,22rem)] w-[clamp(16rem,52vw,22rem)] drop-shadow-[0_22px_40px_rgba(0,0,0,0.45)]">
            <SplashCompassDial
              headingDeg={0}
              className="h-full w-full select-none pointer-events-none"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-auto w-full pb-[max(1.75rem,env(safe-area-inset-bottom))]">
          <Link to="/calculations" className="inline-block w-full max-w-[28rem]" aria-label="Keşfetmeye Başla">
            <Button className="h-14 w-full rounded-full bg-[#45d7d4] text-[clamp(1.05rem,4.6vw,1.35rem)] font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.35)] transition-colors hover:bg-[#35c7c4] active:bg-[#2fbdbb]">
              Keşfetmeye Başla
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
