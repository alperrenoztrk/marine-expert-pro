import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Shield, FileText, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Deep maritime background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark via-primary to-primary-light"
      />

      {/* Floating Settings button (top-right) */}
      <Link to="/settings" className="fixed right-8 top-8 z-20">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary-light text-white shadow-lg border-2 border-white/30"
          title="Ayarlar"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </Link>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-screen px-8 md:px-16 lg:px-24">
        {/* Title */}
        <div className="mb-10 md:mb-12">
          <h1 className="text-[56px] md:text-[84px] lg:text-[110px] font-extrabold leading-[0.95] tracking-tight">
            <span className="block text-blue-600 drop-shadow-lg">
              Maritime
            </span>
            <span className="block text-blue-500 drop-shadow-lg">
              Calculator
            </span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-white/80 font-medium drop-shadow-sm" data-translatable>
            Tüm denizciler için pratik hesaplama platformu
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-xl">
          <Link to="/formulas" className="w-full">
            <Button className="w-full h-14 md:h-16 bg-white/95 hover:bg-white text-blue-700 rounded-full gap-2 text-base md:text-lg font-semibold shadow-lg border border-white/60">
              <Plus className="w-5 h-5" />
              <span data-translatable>Regülasyon Rehberi: Mark</span>
            </Button>
          </Link>

          <div className="flex gap-4 w-full">
            <Link to="/regulations" className="flex-1">
              <Button className="w-full h-14 md:h-16 bg-white/95 hover:bg-white text-blue-700 rounded-full gap-2 text-base md:text-lg font-semibold shadow-lg border border-white/60">
                <Shield className="w-5 h-5" />
                <span data-translatable>Regülasyonlar</span>
              </Button>
            </Link>

            <Link to="/calculations" className="flex-1">
              <Button className="w-full h-14 md:h-16 bg-white/95 hover:bg-white text-blue-700 rounded-full gap-2 text-base md:text-lg font-semibold shadow-lg border border-white/60">
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
