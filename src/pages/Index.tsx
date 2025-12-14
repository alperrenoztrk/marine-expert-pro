import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createCompassListener, requestCompassPermission } from "@/utils/heading";
import { Settings } from "lucide-react";

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

  const clampedHeading = Number.isFinite(headingDeg as number)
    ? (((headingDeg as number) % 360) + 360) % 360
    : 0;

  return (
    <div
      className="relative min-h-[100svh] overflow-hidden touch-auto cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{
        background: "linear-gradient(180deg, #0891b2 0%, #0e7490 15%, #155e75 35%, #164e63 55%, #134e4a 75%, #1e3a3a 100%)"
      }}
    >
      {/* Underwater background with light rays */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Light rays from above */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-[10%] w-[120px] h-[70%] bg-gradient-to-b from-cyan-300/60 via-cyan-400/20 to-transparent transform -skew-x-6" />
          <div className="absolute top-0 left-[25%] w-[80px] h-[60%] bg-gradient-to-b from-cyan-200/50 via-cyan-300/15 to-transparent transform skew-x-3" />
          <div className="absolute top-0 left-[45%] w-[100px] h-[65%] bg-gradient-to-b from-cyan-300/55 via-cyan-400/20 to-transparent transform -skew-x-2" />
          <div className="absolute top-0 right-[30%] w-[90px] h-[55%] bg-gradient-to-b from-cyan-200/45 via-cyan-300/15 to-transparent transform skew-x-6" />
          <div className="absolute top-0 right-[15%] w-[70px] h-[50%] bg-gradient-to-b from-cyan-300/40 via-cyan-400/10 to-transparent transform -skew-x-4" />
        </div>

        {/* Underwater particles/bubbles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/40"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 3 + 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Coral reef at bottom */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-[35%]"
          viewBox="0 0 400 140"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="coral1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id="coral2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="coral3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="seaweed1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <linearGradient id="seaweed2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="pink1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
          </defs>
          
          {/* Left side corals */}
          <ellipse cx="30" cy="130" rx="35" ry="25" fill="url(#coral1)" opacity="0.9" />
          <ellipse cx="25" cy="115" rx="20" ry="18" fill="url(#coral2)" opacity="0.85" />
          <ellipse cx="50" cy="120" rx="25" ry="20" fill="url(#coral3)" opacity="0.8" />
          
          {/* Left branching coral */}
          <path d="M15 140 Q20 100 15 70 Q10 60 20 55 M15 90 Q25 80 30 65 M15 110 Q5 100 10 85" 
                stroke="url(#pink1)" strokeWidth="4" fill="none" opacity="0.8" />
          
          {/* Left seaweed */}
          <path d="M60 140 Q55 110 65 80 Q70 60 60 45" stroke="url(#seaweed1)" strokeWidth="5" fill="none" opacity="0.7" />
          <path d="M75 140 Q80 115 70 90 Q65 75 75 55" stroke="url(#seaweed2)" strokeWidth="4" fill="none" opacity="0.6" />
          
          {/* Center-left corals */}
          <ellipse cx="100" cy="135" rx="30" ry="20" fill="url(#coral2)" opacity="0.85" />
          <path d="M90 140 Q85 120 95 95 Q100 85 90 75 M95 115 Q105 105 100 90" 
                stroke="url(#coral1)" strokeWidth="5" fill="none" opacity="0.75" />
          
          {/* Center corals - behind compass area */}
          <ellipse cx="200" cy="140" rx="45" ry="25" fill="url(#coral1)" opacity="0.6" />
          <ellipse cx="180" cy="130" rx="25" ry="18" fill="url(#coral3)" opacity="0.5" />
          <ellipse cx="220" cy="130" rx="28" ry="20" fill="url(#coral2)" opacity="0.5" />
          
          {/* Center-right corals */}
          <ellipse cx="300" cy="135" rx="32" ry="22" fill="url(#coral3)" opacity="0.85" />
          <path d="M290 140 Q295 115 285 90 Q280 80 295 70 M295 110 Q305 100 300 85" 
                stroke="url(#coral2)" strokeWidth="5" fill="none" opacity="0.8" />
          
          {/* Right seaweed */}
          <path d="M330 140 Q325 105 335 75 Q340 55 330 40" stroke="url(#seaweed1)" strokeWidth="5" fill="none" opacity="0.7" />
          <path d="M350 140 Q355 110 345 85 Q340 70 355 50" stroke="url(#seaweed2)" strokeWidth="4" fill="none" opacity="0.65" />
          
          {/* Right side corals */}
          <ellipse cx="370" cy="130" rx="35" ry="25" fill="url(#coral1)" opacity="0.9" />
          <ellipse cx="380" cy="115" rx="22" ry="18" fill="url(#coral2)" opacity="0.85" />
          <ellipse cx="355" cy="125" rx="20" ry="16" fill="url(#coral3)" opacity="0.8" />
          
          {/* Right branching coral */}
          <path d="M385 140 Q380 100 390 70 Q395 60 385 50 M390 95 Q375 85 370 70 M385 115 Q395 105 400 90" 
                stroke="url(#pink1)" strokeWidth="4" fill="none" opacity="0.8" />
          
          {/* Additional small elements */}
          <circle cx="140" cy="125" r="8" fill="url(#pink1)" opacity="0.6" />
          <circle cx="145" cy="130" r="6" fill="url(#pink1)" opacity="0.5" />
          <circle cx="260" cy="128" r="7" fill="url(#pink1)" opacity="0.6" />
          <circle cx="255" cy="132" r="5" fill="url(#pink1)" opacity="0.5" />
        </svg>
      </div>

      {/* Settings button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate('/settings');
        }}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        aria-label="Ayarlar"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>

      {/* Main content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-6 text-center">
        {/* Title */}
        <div className="pt-16">
          <h1
            className="select-none font-extrabold leading-[0.95] tracking-[0.08em] text-transparent bg-clip-text"
            style={{ 
              backgroundImage: "linear-gradient(180deg, #ffffff 0%, #67e8f9 50%, #22d3ee 100%)",
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              WebkitTextStroke: "1px rgba(255,255,255,0.3)"
            }}
          >
            <span className="block text-[clamp(2.8rem,9vw,5rem)] font-black">MARINE</span>
            <span className="mt-1 block text-[clamp(2.8rem,9vw,5rem)] font-black">EXPERT</span>
          </h1>
        </div>

        {/* Vintage Compass */}
        <div className="mt-8 flex-1 flex items-center justify-center">
          <div className="relative h-[clamp(14rem,45vw,20rem)] w-[clamp(14rem,45vw,20rem)] drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
            <svg
              viewBox="0 0 240 240"
              role="img"
              aria-label="Compass"
              style={{ display: "block", width: "100%", height: "100%" }}
            >
              <defs>
                {/* Brass/Gold gradients for vintage look */}
                <radialGradient id="brassRim" cx="30%" cy="25%">
                  <stop offset="0%" stopColor="#f5e6a3" />
                  <stop offset="20%" stopColor="#d4a84b" />
                  <stop offset="45%" stopColor="#b8860b" />
                  <stop offset="70%" stopColor="#cd9b1d" />
                  <stop offset="100%" stopColor="#8b6914" />
                </radialGradient>

                <radialGradient id="brassInner" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#dfc07f" />
                  <stop offset="50%" stopColor="#c4983e" />
                  <stop offset="100%" stopColor="#96712a" />
                </radialGradient>

                <radialGradient id="compassFace" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#faf3e0" />
                  <stop offset="60%" stopColor="#f5e6c8" />
                  <stop offset="100%" stopColor="#e8d5a3" />
                </radialGradient>

                <linearGradient id="needleRed" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#991b1b" />
                  <stop offset="50%" stopColor="#7f1d1d" />
                  <stop offset="100%" stopColor="#450a0a" />
                </linearGradient>

                <linearGradient id="needleBlack" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#374151" />
                  <stop offset="50%" stopColor="#1f2937" />
                  <stop offset="100%" stopColor="#111827" />
                </linearGradient>

                <filter id="compassShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                  <feOffset dx="0" dy="6" result="off" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.4" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer brass rim */}
              <g filter="url(#compassShadow)">
                <circle cx="120" cy="120" r="115" fill="url(#brassRim)" />
                <circle cx="120" cy="120" r="108" fill="url(#brassInner)" />
                <circle cx="120" cy="120" r="102" fill="none" stroke="rgba(139,105,20,0.5)" strokeWidth="1" />
              </g>

              {/* Inner decorative ring */}
              <circle cx="120" cy="120" r="100" fill="url(#brassRim)" opacity="0.8" />
              <circle cx="120" cy="120" r="95" fill="url(#compassFace)" />
              
              {/* Compass face aging texture */}
              <circle cx="120" cy="120" r="92" fill="none" stroke="rgba(139,105,20,0.2)" strokeWidth="0.5" />

              {/* Degree marks */}
              <g opacity="0.6" strokeLinecap="round">
                {Array.from({ length: 72 }, (_, i) => i * 5).map((angle) => {
                  const major = angle % 30 === 0;
                  const cardinal = angle % 90 === 0;
                  const outer = 88;
                  const inner = cardinal ? 68 : major ? 75 : 82;
                  const sw = cardinal ? 2 : major ? 1.2 : 0.6;
                  return (
                    <line
                      key={`t-${angle}`}
                      x1={120}
                      y1={120 - outer}
                      x2={120}
                      y2={120 - inner}
                      stroke="#5c4a1f"
                      strokeWidth={sw}
                      transform={`rotate(${angle} 120 120)`}
                    />
                  );
                })}
              </g>

              {/* Cardinal directions */}
              <g
                fill="#5c4a1f"
                fontFamily="Georgia, Times, serif"
                fontWeight="bold"
                fontSize="18"
              >
                <text x={120} y={48} textAnchor="middle" dominantBaseline="central" fontSize="20">N</text>
                <text x={192} y={122} textAnchor="middle" dominantBaseline="central">E</text>
                <text x={120} y={195} textAnchor="middle" dominantBaseline="central" fontSize="20">S</text>
                <text x={48} y={122} textAnchor="middle" dominantBaseline="central">W</text>
              </g>

              {/* Intercardinal directions */}
              <g
                fill="#8b7355"
                fontFamily="Georgia, Times, serif"
                fontWeight="normal"
                fontSize="12"
              >
                <text x={165} y={70} textAnchor="middle" dominantBaseline="central">NE</text>
                <text x={165} y={172} textAnchor="middle" dominantBaseline="central">SE</text>
                <text x={75} y={172} textAnchor="middle" dominantBaseline="central">SW</text>
                <text x={75} y={70} textAnchor="middle" dominantBaseline="central">NW</text>
              </g>

              {/* Ornate compass rose */}
              <g opacity="0.4">
                {/* 16-point star base */}
                {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((a, i) => {
                  const len = i % 2 === 0 ? (i % 4 === 0 ? 45 : 35) : 25;
                  return (
                    <line
                      key={`rose-${a}`}
                      x1={120}
                      y1={120}
                      x2={120}
                      y2={120 - len}
                      stroke="#8b7355"
                      strokeWidth={i % 4 === 0 ? 2 : 1}
                      transform={`rotate(${a} 120 120)`}
                    />
                  );
                })}
              </g>

              {/* Main compass needle - rotates with heading */}
              <g transform={`rotate(${-clampedHeading} 120 120)`}>
                {/* North pointer (red) */}
                <path 
                  d="M120 55 L113 118 L120 112 L127 118 Z" 
                  fill="url(#needleRed)"
                />
                {/* South pointer (black) */}
                <path 
                  d="M120 185 L113 122 L120 128 L127 122 Z" 
                  fill="url(#needleBlack)"
                />
                {/* Center pivot */}
                <circle cx="120" cy="120" r="8" fill="url(#brassRim)" />
                <circle cx="120" cy="120" r="5" fill="#5c4a1f" />
                <circle cx="118" cy="118" r="2" fill="rgba(255,255,255,0.4)" />
              </g>

              {/* Glass reflection effect */}
              <ellipse 
                cx="100" 
                cy="85" 
                rx="35" 
                ry="20" 
                fill="rgba(255,255,255,0.15)"
                transform="rotate(-15 100 85)"
              />
            </svg>
          </div>
        </div>

        {/* CTA Button */}
        <div className="w-full pb-[max(3rem,env(safe-area-inset-bottom))] pt-4">
          <Link to="/calculations" className="inline-block w-full max-w-[20rem]" aria-label="Keşfetmeye Başla">
            <Button 
              className="w-full rounded-xl py-6 text-[clamp(1.25rem,4vw,1.5rem)] font-bold text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #0891b2 0%, #0e7490 50%, #155e75 100%)",
                border: "2px solid rgba(255,255,255,0.3)"
              }}
            >
              Keşfetmeye Başla
            </Button>
          </Link>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-10px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default Index;
