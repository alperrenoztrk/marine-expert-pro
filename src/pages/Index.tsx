import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Shield, FileText, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      {/* Settings button */}
      <Link to="/settings" className="absolute top-8 right-8 z-20">
        <Button
          size="icon"
          className="w-12 h-12 rounded-full bg-blue-600/80 hover:bg-blue-700 text-white shadow-lg border-2 border-blue-300/50"
          title="Ayarlar"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </Link>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-screen px-8 py-16">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="block bg-gradient-to-r from-blue-800 via-blue-700 to-teal-600 bg-clip-text text-transparent">
              Maritime
            </span>
            <span className="block bg-gradient-to-r from-blue-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="text-xl text-blue-900/90 mt-6 font-medium" data-translatable>
            Tüm denizciler için pratik hesaplama platformu
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-lg">
          <Link to="/formulas" className="w-full">
            <Button
              className="w-full h-14 bg-white/95 hover:bg-white text-blue-700 rounded-full gap-2 text-base font-semibold shadow-lg border border-white/50"
            >
              <Plus className="w-5 h-5" />
              <span data-translatable>Regülasyon Rehberi: Mark</span>
            </Button>
          </Link>

          <div className="flex gap-4 w-full">
            <Link to="/regulations" className="flex-1">
              <Button
                className="w-full h-14 bg-white/95 hover:bg-white text-blue-700 rounded-full gap-2 text-base font-semibold shadow-lg border border-white/50"
              >
                <Shield className="w-5 h-5" />
                <span data-translatable>Regülasyonlar</span>
              </Button>
            </Link>

            <Link to="/calculations" className="flex-1">
              <Button
                className="w-full h-14 bg-white/95 hover:bg-white text-blue-700 rounded-full gap-2 text-base font-semibold shadow-lg border border-white/50"
              >
                <FileText className="w-5 h-5" />
                <span data-translatable>Hesaplamalar</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Ship illustration */}
      <img
        src="/maritime-logo.svg"
        alt="Maritime logo"
        className="pointer-events-none select-none absolute bottom-0 left-8 w-48 sm:w-64 opacity-90"
      />
    </div>
  );
};

export default Index;
