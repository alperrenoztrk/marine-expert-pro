import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import WeatherWidget from "@/components/WeatherWidget";

const EmptyPage = () => {
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const distance = touchEndX.current - touchStartX.current;
    const isRightSwipe = distance > 100; // Sağ kaydırma
    
    if (isRightSwipe) {
      navigate('/');
    }
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <WeatherWidget />
    </div>
  );
};

export default EmptyPage;