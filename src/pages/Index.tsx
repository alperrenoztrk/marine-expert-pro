import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Shield, FileText, Settings, ChevronRight } from "lucide-react";
// WeatherWidget anasayfadan kaldırıldı ve boş sayfaya taşındı

const Index = () => {
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
    const isRightSwipe = distance > 100; // Minimum swipe distance for right swipe
    
    if (isRightSwipe) {
      navigate('/empty-page');
    }
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="relative min-h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Homepage background with ship image (zoomed out) */}
      <div className="absolute inset-0 homepage-ship-background homepage-ship-background--zoom-out" />
      {/* Right-side arrow to open Empty Page */}
      <Link to="/empty-page" className="fixed right-4 top-1/2 -translate-y-1/2 z-20">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-2 border-white/30 transition-all duration-200"
          title="Sağ sayfa"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </Link>
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
          {/* Top button - Hesaplamalar */}
          <Link to="/calculations" className="w-full">
            <Button className="w-full h-14 bg-white/95 hover:bg-white text-blue-700 rounded-2xl gap-3 text-base font-semibold shadow-lg border border-white/60 transition-all duration-200 hover:scale-105">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span data-translatable>Hesaplamalar</span>
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
