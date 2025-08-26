import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Shield, FileText, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Maritime background image */}
      <div
        className="absolute inset-0 maritime-background"
        style={{
          backgroundImage: "url('/maritime-background.svg')"
        }}
      />
      
      {/* Dark blue overlay for better text readability */}
      <div className="absolute inset-0 bg-blue-900/40 z-0" />

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
        {/* Title with shadow effects */}
        <div className="mb-12">
          <h1 className="maritime-title text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            <span 
              className="block drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
            >
              Maritime Calculator
            </span>
          </h1>
          
          {/* Subtitle */}
          <p 
            className="maritime-subtitle text-lg md:text-xl text-white/80 font-medium mt-6 drop-shadow-md" 
            data-translatable
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
          >
            Tüm denizciler için pratik hesaplama platformu
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Top button - Regülasyon Rehberi: Mark */}
          <Link to="/formulas" className="w-full">
            <Button className="w-full h-14 bg-white/90 hover:bg-white text-blue-700 rounded-2xl gap-3 text-base font-semibold shadow-lg border border-white/60 transition-all duration-200 hover:scale-105">
              <Plus className="w-5 h-5" />
              <span data-translatable>Regülasyon Rehberi: Mark</span>
            </Button>
          </Link>

          {/* Bottom buttons - side by side */}
          <div className="flex gap-4 w-full">
            <Link to="/regulations" className="flex-1">
              <Button className="w-full h-14 bg-white/90 hover:bg-white text-blue-700 rounded-2xl gap-2 text-base font-semibold shadow-lg border border-white/60 transition-all duration-200 hover:scale-105">
                <Shield className="w-5 h-5" />
                <span data-translatable>Regülasyonlar</span>
              </Button>
            </Link>

            <Link to="/calculations" className="flex-1">
              <Button className="w-full h-14 bg-white/90 hover:bg-white text-blue-700 rounded-2xl gap-2 text-base font-semibold shadow-lg border border-white/60 transition-all duration-200 hover:scale-105">
                <FileText className="w-5 h-5" />
                <span data-translatable>Hesaplamalar</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
