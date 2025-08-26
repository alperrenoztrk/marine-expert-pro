import React from "react";
import { Link } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Plus, Shield, FileText, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/lovable-uploads/c6c6ba44-f631-4adf-8900-c7b1c64e1f49.png"
          alt="Sea background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tl from-background/90 via-background/70 to-background/30" />
      </div>

      {/* Floating settings button */}
      <Link to="/settings" className="absolute right-6 top-1/3 sm:top-1/2 z-20">
        <Button
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
          title="Ayarlar"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </Link>

      {/* Content */}
      <MobileLayout className="relative bg-none">
        <div className="pt-16 pb-8">
          {/* Title */}
          <div className="text-left mb-6 sm:mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-none tracking-tight">
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Maritime
              </span>
              <span className="block mt-1 bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Calculator
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl" data-translatable>
              Tüm denizciler için pratik hesaplama platformu
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <Link to="/formulas">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-full px-4 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4" />
                  <span data-translatable>Regülasyon Rehberi: Mark</span>
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/regulations">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-full px-4 border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-gray-800"
                >
                  <Shield className="w-4 h-4" />
                  <span data-translatable>Regülasyonlar</span>
                </Button>
              </Link>

              <Link to="/calculations">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-full px-4 border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-gray-800"
                >
                  <FileText className="w-4 h-4" />
                  <span data-translatable>Hesaplamalar</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MobileLayout>

      {/* Decorative illustration (bottom-left) */}
      <img
        src="/maritime-logo.svg"
        alt="Maritime logo"
        className="pointer-events-none select-none absolute bottom-0 left-2 w-48 sm:w-64 opacity-90"
      />
    </div>
  );
};

export default Index;
