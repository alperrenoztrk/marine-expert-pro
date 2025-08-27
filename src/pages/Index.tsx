import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Shield, FileText, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Clean background - ready for new design */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-100" />
      
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
        {/* Title with cloud-themed colors */}
        <div className="mb-12">
          <h1 className="maritime-title text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span 
              className="block text-sky-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
            >
              Maritime
            </span>
            <span 
              className="block text-blue-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
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

        {/* Buttons with cloud-themed styling */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Top button - Hesaplamalar */}
          <Link to="/calculations" className="w-full">
            <Button className="w-full h-14 bg-sky-100/90 hover:bg-sky-200/95 text-sky-800 rounded-2xl gap-3 text-base font-semibold shadow-xl border-2 border-sky-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span data-translatable>Hesaplamalar</span>
            </Button>
          </Link>

          {/* Bottom buttons - side by side */}
          <div className="flex gap-4 w-full">
            <Link to="/regulations" className="flex-1">
              <Button className="w-full h-14 bg-blue-100/90 hover:bg-blue-200/95 text-blue-800 rounded-2xl gap-2 text-base font-semibold shadow-xl border-2 border-blue-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-blue-600" />
                </div>
                <span data-translatable>Regülasyonlar</span>
              </Button>
            </Link>

            <Link to="/formulas" className="flex-1">
              <Button className="w-full h-14 bg-indigo-100/90 hover:bg-indigo-200/95 text-indigo-800 rounded-2xl gap-2 text-base font-semibold shadow-xl border-2 border-indigo-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <FileText className="w-5 h-5 text-indigo-600" />
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
