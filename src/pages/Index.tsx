import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Shield, FileText, Settings, Star } from "lucide-react";
// WeatherWidget anasayfadan kaldırıldı ve boş sayfaya taşındı

const Index = () => {
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
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
    
    if (isLeftSwipe && currentPage < totalPages - 1) {
      if (currentPage === 0) {
        navigate('/empty-page');
      }
    } else if (isRightSwipe && currentPage > 0) {
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
      className="relative min-h-screen overflow-hidden bg-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              currentPage === index 
                ? 'bg-blue-600 w-6' 
                : 'bg-white/60 hover:bg-white/80'
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
            Tüm denizciler için pratik hesaplama platformu
          </p>
        </div>

        {/* Boş sayfa isteği gereği anasayfada widget bulunmuyor */}

        {/* Buttons with maritime styling */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Main button - Hesaplamalar */}
          <Link to="/calculations" className="w-full">
            <Button className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl gap-3 text-base font-semibold shadow-xl border-2 border-white/20 transition-all duration-200 hover:scale-105">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-bold">Hesaplamalar</div>
                <div className="text-xs text-blue-100">Tüm gemi hesaplama araçları</div>
              </div>
            </Button>
          </Link>

          {/* Bottom buttons - side by side */}
          <div className="flex gap-4 w-full">
            <Link to="/regulations" className="flex-1">
              <Button className="w-full h-14 bg-white/95 hover:bg-white text-blue-700 rounded-2xl gap-2 text-base font-semibold shadow-lg border border-white/60 transition-all duration-200 hover:scale-105">
                <div className="w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-blue-600" />
                </div>
                <span data-translatable>Regülasyonlar</span>
              </Button>
            </Link>

            <Link to="/formulas" className="flex-1">
              <Button className="w-full h-14 bg-white/95 hover:bg-white text-blue-700 rounded-2xl gap-2 text-base font-semibold shadow-lg border border-white/60 transition-all duration-200 hover:scale-105">
                <FileText className="w-5 h-5 text-blue-600" />
                <span data-translatable>Formüller</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
