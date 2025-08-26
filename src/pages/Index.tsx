import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Shield, FileText, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/6600febe-17ab-46d7-b124-c43116e375e6.png"
          alt="Maritime background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Settings button */}
      <Link to="/settings" className="absolute top-8 right-8 z-20">
        <Button
          size="icon"
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary-dark text-primary-foreground shadow-lg"
          title="Ayarlar"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </Link>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Maritime
            </span>
            <span className="block bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="text-xl text-foreground/90 mt-6" data-translatable>
            Tüm denizciler için pratik hesaplama platformu
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <Link to="/formulas" className="w-full">
            <Button
              className="w-full h-12 bg-card/95 hover:bg-card text-card-foreground rounded-full gap-2 text-base font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span data-translatable>Regülasyon Rehberi: Mark</span>
            </Button>
          </Link>

          <div className="flex gap-4 w-full">
            <Link to="/regulations" className="flex-1">
              <Button
                className="w-full h-12 bg-card/95 hover:bg-card text-card-foreground rounded-full gap-2 text-base font-medium shadow-lg"
              >
                <Shield className="w-5 h-5" />
                <span data-translatable>Regülasyonlar</span>
              </Button>
            </Link>

            <Link to="/calculations" className="flex-1">
              <Button
                className="w-full h-12 bg-card/95 hover:bg-card text-card-foreground rounded-full gap-2 text-base font-medium shadow-lg"
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
