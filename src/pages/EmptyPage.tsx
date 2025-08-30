import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import WeatherWidget from "@/components/WeatherWidget";

const EmptyPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative homepage-ship-background">
      <Link to="/" className="fixed left-4 top-6 z-20">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-2 border-white/30 transition-all duration-200"
          title="Geri"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </Link>
      <div className="w-full max-w-md">
        <WeatherWidget />
      </div>
    </div>
  );
};

export default EmptyPage;