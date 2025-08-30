import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";

const EmptyPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Maritime background image */}
      <div
        className="absolute inset-0 maritime-background opacity-50"
        style={{
          backgroundImage: "url('/maritime-background.svg')"
        }}
      />
      
      {/* Back button (top-left) */}
      <Link to="/" className="fixed left-6 top-6 z-20">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-2 border-white/30 transition-all duration-200"
          title="Geri Dön"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </Link>

      {/* Settings gear icon (top-right) */}
      <Link to="/settings" className="fixed right-6 top-6 z-20">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg border-2 border-white/30 transition-all duration-200"
          title="Ayarlar"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </Link>

      {/* Main content - centered and empty */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        <div className="mb-12">
          <h1 className="maritime-title text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span 
              className="block text-blue-600 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
            >
              Boş
            </span>
            <span 
              className="block text-blue-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
            >
              Sayfa
            </span>
          </h1>
          
          {/* Subtitle */}
          <p 
            className="maritime-subtitle text-lg md:text-xl text-black font-medium mt-6 drop-shadow-md" 
            style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.8)" }}
          >
            Bu sayfa henüz boş
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyPage;