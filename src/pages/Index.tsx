import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2; // Ana sayfa ve sol sayfa (Pusula/Weather)

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
              Maritime
            </span>
            <span 
              className="block text-blue-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
            >
              Calculator
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
          {/* Compass Menu Button */}
          <Link to="/calculations" className="relative w-fit mx-auto group" aria-label="Menü (Pusula)">
            <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl border-4 border-white/30 transition-transform duration-200 hover:scale-105">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full ring-4 ring-white/30 ring-offset-2 ring-offset-blue-600 pointer-events-none"></div>
              {/* Inner ring */}
              <div className="absolute inset-4 rounded-full border-2 border-white/30"></div>
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center font-semibold text-lg md:text-xl select-none">
                Menü
              </div>
              {/* Direction labels */}
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs md:text-sm font-semibold text-blue-700 bg-white/90 rounded-full px-2 py-0.5 shadow">
                North - N
              </span>
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs md:text-sm font-semibold text-blue-700 bg-white/90 rounded-full px-2 py-0.5 shadow">
                South - S
              </span>
              <span className="absolute top-1/2 -right-9 -translate-y-1/2 text-xs md:text-sm font-semibold text-blue-700 bg-white/90 rounded-full px-2 py-0.5 shadow">
                East - E
              </span>
              <span className="absolute top-1/2 -left-9 -translate-y-1/2 text-xs md:text-sm font-semibold text-blue-700 bg-white/90 rounded-full px-2 py-0.5 shadow">
                West - W
              </span>
            </div>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Index;
