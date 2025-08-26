import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Shield, FileText, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Soft ocean background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-200 via-sky-300 to-sky-500"
      />

      {/* Floating Settings button (center-right) */}
      <Link to="/settings" className="fixed right-16 top-1/2 -translate-y-1/2 z-20">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg border-2 border-white/40"
          title="Ayarlar"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </Link>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-screen px-8 md:px-16 lg:px-24">
        {/* Title */}
        <div className="mb-10 md:mb-12">
          <h1 className="text-[56px] md:text-[84px] lg:text-[110px] font-extrabold leading-[0.95] tracking-tight">
            <span className="block bg-gradient-to-r from-blue-900 via-blue-700 to-teal-600 bg-clip-text text-transparent">
              Maritime
            </span>
            <span className="block bg-gradient-to-r from-blue-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-slate-900/90 font-medium" data-translatable>
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

      {/* Ship illustration */}
      <img
        src="/maritime-logo.svg"
        alt="Maritime logo"
        className="pointer-events-none select-none absolute -bottom-4 left-8 md:left-16 w-[220px] sm:w-[280px] md:w-[340px] lg:w-[420px] opacity-95"
      />
    </div>
  );
};

export default Index;
