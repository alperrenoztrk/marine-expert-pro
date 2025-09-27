import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WeatherWidget from "@/components/WeatherWidget";
import DirectionWidget from "@/components/DirectionWidget";

const EmptyPage = () => {
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2; // Ana sayfa ve boş sayfa

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const distance = touchEndX.current - touchStartX.current;
    const isLeftSwipe = distance < -100; // Sol kaydırma
    const isRightSwipe = distance > 100; // Sağ kaydırma
    
    if (isRightSwipe && currentPage > 0) {
      navigate('/');
    }
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
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
      className="min-h-screen flex items-center justify-center px-6 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Page indicators - dots at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentPage === index 
                ? 'bg-gray-800 w-6 shadow-lg' 
                : 'bg-gray-400 w-2 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>
      
      <div className="w-full max-w-md space-y-6">
        <DirectionWidget />
        <WeatherWidget />
      </div>
    </div>
  );
};

export default EmptyPage;