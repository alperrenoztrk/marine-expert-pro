import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Moon } from "lucide-react";

const MoonPhases = () => {
  const [moonPhase, setMoonPhase] = useState<{
    phase: string;
    percentage: number;
    emoji: string;
  }>({ phase: "", percentage: 0, emoji: "" });

  useEffect(() => {
    calculateMoonPhase();
  }, []);

  const calculateMoonPhase = () => {
    const today = new Date();
    // Known new moon: January 6, 2000, 18:14 UTC
    const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
    const lunarCycle = 29.53058867; // days
    
    const daysSinceKnownNewMoon = (today.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const phasePosition = (daysSinceKnownNewMoon % lunarCycle) / lunarCycle;
    
    let phaseName = "";
    let emoji = "";
    
    if (phasePosition < 0.0625) {
      phaseName = "Yeni Ay";
      emoji = "🌑";
    } else if (phasePosition < 0.1875) {
      phaseName = "Hilal";
      emoji = "🌒";
    } else if (phasePosition < 0.3125) {
      phaseName = "İlk Dördün";
      emoji = "🌓";
    } else if (phasePosition < 0.4375) {
      phaseName = "Şişkin Ay";
      emoji = "🌔";
    } else if (phasePosition < 0.5625) {
      phaseName = "Dolunay";
      emoji = "🌕";
    } else if (phasePosition < 0.6875) {
      phaseName = "Küçülen Ay";
      emoji = "🌖";
    } else if (phasePosition < 0.8125) {
      phaseName = "Son Dördün";
      emoji = "🌗";
    } else if (phasePosition < 0.9375) {
      phaseName = "Son Hilal";
      emoji = "🌘";
    } else {
      phaseName = "Yeni Ay";
      emoji = "🌑";
    }
    
    setMoonPhase({
      phase: phaseName,
      percentage: Math.round(phasePosition * 100),
      emoji: emoji
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-black">
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 2 + 2 + "s",
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Navigate to home - right arrow */}
      <div className="fixed right-6 top-6 z-20">
        <Link to="/">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg border-2 border-white/30"
            title="Ana Sayfa"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Title */}
        <div className="mb-8">
          <Moon className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
            Ay Fazları
          </h1>
          <p className="text-lg text-white/80">
            Güncel ay fazı ve döngüsü
          </p>
        </div>

        {/* Moon Phase Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border-2 border-white/20 shadow-2xl max-w-md w-full">
          {/* Moon emoji - large */}
          <div className="text-9xl mb-6 animate-pulse">
            {moonPhase.emoji}
          </div>

          {/* Phase name */}
          <h2 className="text-3xl font-bold text-white mb-4">
            {moonPhase.phase}
          </h2>

          {/* Phase percentage */}
          <p className="text-lg text-white/80 mb-6">
            Döngü: %{moonPhase.percentage}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${moonPhase.percentage}%` }}
            />
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-white/70 text-sm max-w-md">
          <p>
            Ay, Dünya'nın etrafında yaklaşık 29.5 günde bir tam tur atar. 
            Bu süre zarfında farklı fazlardan geçer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoonPhases;
