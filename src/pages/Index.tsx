import { useState, useEffect, useRef } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, Ship, Compass, Waves, Cog, Package, Droplets, Building, Shield, Leaf, Cloud, Settings } from "lucide-react";




import { useAdManager, loadAdSenseScript } from "@/hooks/useAdManager";
import { useTheme } from "@/hooks/useTheme";

import { AdBannerMobile, AdBannerInline } from "@/components/ads/AdBanner";
import { NativeAd, MaritimeEquipmentAd, MaritimeSoftwareAd } from "@/components/ads/NativeAd";
import { toast } from "sonner";
import React from "react"; // Added missing import for React


// Removed calculation components - they are now on individual pages

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const neonTextRef = useRef<HTMLHeadingElement>(null);
  const { theme } = useTheme();
  
  // Safe hooks with error handling
  const safeAdManager = (() => {
    try {
      return useAdManager();
    } catch (error) {
      console.warn('AdManager hook failed, using fallback:', error);
      return { 
        shouldShowAd: () => false, 
        trackInteraction: () => {} 
      };
    }
  })();
  
  const { shouldShowAd, trackInteraction } = safeAdManager;

  // Mouse tracking for neon text
  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (theme === 'neon' && neonTextRef.current) {
      const rect = neonTextRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Ensure coordinates are within bounds
      const clampedX = Math.max(0, Math.min(x, rect.width));
      const clampedY = Math.max(0, Math.min(y, rect.height));
      
      setMousePosition({ x: clampedX, y: clampedY });
    }
  };

  const handleMouseEnter = () => {
    if (theme === 'neon') {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (theme === 'neon') {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    }
  };

  // Load AdSense script safely
  useEffect(() => {
    const loadAds = async () => {
      try {
        await loadAdSenseScript();
      } catch (error) {
        console.warn('AdSense loading failed:', error);
      }
    };
    loadAds();
    
    // Set loading to false after component mounts
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculation cards removed - using individual pages now

  const handleCalculationComplete = async (calculationType: string, inputData: any, resultData: any) => {
    // Temporarily disabled - authentication not implemented
    console.log('Calculation completed:', calculationType, inputData, resultData);
    toast.success("Hesaplama tamamlandı!");
  };

  const handleToggleFavorite = async (calculationId: string) => {
    // Temporarily disabled - authentication not implemented
    console.log('Toggle favorite:', calculationId);
    toast.success("Favori durumu güncellendi!");
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Maritime Calculator yükleniyor...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* Header Section */}
      <div className="relative mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-teal-600/20 rounded-xl"></div>
        
        <div className="relative bg-card/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-border shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
            {/* Logo - Hidden for neon theme */}
            {theme !== 'neon' && (
              <div className="flex-shrink-0">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="/lovable-uploads/c6c6ba44-f631-4adf-8900-c7b1c64e1f49.png" 
                    alt="Maritime Calculator Logo" 
                    className="maritime-logo w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 drop-shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}
            
            {/* Title with Neon Billboard Effect */}
            <div className="text-center">
              {theme === 'neon' ? (
                <div className="neon-billboard relative">
                  {/* Billboard Background */}
                  <div className="billboard-background absolute inset-0 bg-black/80 rounded-lg border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(0,255,255,0.5)]"></div>
                  
                  {/* New Pulse Rings Effect */}
                  <div className="billboard-pulse-rings">
                    <div className="billboard-pulse-ring"></div>
                    <div className="billboard-pulse-ring"></div>
                    <div className="billboard-pulse-ring"></div>
                  </div>
                  
                  {/* New Matrix Scanning Effect */}
                  <div className="billboard-matrix-scan"></div>
                  
                  {/* New Holographic Shimmer Effect */}
                  <div className="billboard-holographic-shimmer"></div>
                  
                  {/* New Corner Glitch Effects */}
                  <div className="billboard-corner-glitch top-left"></div>
                  <div className="billboard-corner-glitch top-right"></div>
                  <div className="billboard-corner-glitch bottom-left"></div>
                  <div className="billboard-corner-glitch bottom-right"></div>
                  
                  {/* Neon Text Container */}
                  <div className="relative z-10 p-4">
                    <h1 
                      ref={neonTextRef}
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold neon-text neon-text-interactive"
                      data-translatable
                      onMouseMove={handleMouseMove}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        '--mouse-x': `${mousePosition.x}px`,
                        '--mouse-y': `${mousePosition.y}px`,
                        '--is-hovering': isHovering ? '1' : '0'
                      } as React.CSSProperties}
                    >
                      Maritime Calculator
                    </h1>
                    <div className="mt-2 inline-block rounded-full px-3 py-1 text-xs bg-cyan-900/60 text-cyan-200 border border-cyan-500/40">Build v2.3.9</div>
                  </div>
                  
                  {/* Billboard Frame */}
                  <div className="billboard-frame absolute inset-0 border-4 border-cyan-400/30 rounded-lg"></div>
                  
                  {/* Neon Glow Effects */}
                  <div className="neon-glow-1 absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 blur-sm"></div>
                  <div className="neon-glow-2 absolute inset-0 rounded-lg bg-gradient-to-b from-cyan-400/10 to-transparent"></div>
                </div>
              ) : (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm" data-translatable>
                  Maritime Calculator
                </h1>
              )}
              {theme !== 'neon' && (
                <div className="mt-2 inline-block rounded-full px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border border-gray-300/60 dark:border-gray-600/60">Build v2.3.9</div>
              )}
            </div>
          </div>



          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed" data-translatable>
                Uzakyol zabitlerinden denizcilik öğrencilerine – tüm denizciler için pratik hesaplama platformu
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {/* First Row - Asistan and Regülasyonlar */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link to="/formulas">
                    <Button size="sm" variant="outline" className="gap-2 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-gray-700 cyberpunk:border-purple-400 cyberpunk:text-purple-400 cyberpunk:hover:bg-gray-800 nature:border-purple-400 nature:text-purple-600 nature:hover:bg-purple-50">
                      <Brain className="w-4 h-4" />
                      <span data-translatable>Soru Asistanı: Mark</span>
                    </Button>
                  </Link>
                  <Link to="/regulations">
                    <Button size="sm" variant="outline" className="gap-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-gray-700 cyberpunk:border-emerald-400 cyberpunk:text-emerald-400 cyberpunk:hover:bg-gray-800 nature:border-emerald-400 nature:text-emerald-600 nature:hover:bg-emerald-50">
                      <Shield className="w-4 h-4" />
                      <span data-translatable>Regülasyonlar</span>
                    </Button>
                  </Link>
                </div>
                
                {/* Second Row - Other buttons */}
                <div className="flex gap-2 flex-wrap">
                  {/* Trim ve List butonu kaldırıldı */}
                  <Link to="/hydrostatics-stability">
                    <Button size="sm" variant="outline" className="gap-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-gray-700 cyberpunk:border-indigo-400 cyberpunk:text-indigo-400 cyberpunk:hover:bg-gray-800 nature:border-indigo-400 nature:text-indigo-600 nature:hover:bg-indigo-50">
                      <Waves className="w-4 h-4" />
                      <span data-translatable>Hidrostatik & Stabilite</span>
                    </Button>
                  </Link>
                  <Link to="/navigation">
                    <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                      <Compass className="w-4 h-4" />
                      <span data-translatable>Seyir</span>
                    </Button>
                  </Link>
                  <Link to="/hydrodynamics">
                    <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                      <Waves className="w-4 h-4" />
                      <span data-translatable>Hidrodinamik</span>
                    </Button>
                  </Link>
                  <Link to="/engine">
                    <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                      <Cog className="w-4 h-4" />
                      <span data-translatable>Makine</span>
                    </Button>
                  </Link>
                  <Link to="/cargo">
                    <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                      <Package className="w-4 h-4" />
                      <span data-translatable>Kargo</span>
                    </Button>
                  </Link>
                  <Link to="/ballast">
                    <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                      <Droplets className="w-4 h-4" />
                      <span data-translatable>Balast</span>
                    </Button>
                  </Link>
                  <Link to="/tank">
                    <Button size="sm" variant="outline" className="gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-gray-700 cyberpunk:border-orange-400 cyberpunk:text-orange-400 cyberpunk:hover:bg-gray-800 nature:border-orange-400 nature:text-orange-600 nature:hover:bg-orange-50">
                      <Droplets className="w-4 h-4" />
                      <span data-translatable>Tank</span>
                    </Button>
                  </Link>
                  <Link to="/structural">
                    <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                      <Building className="w-4 h-4" />
                      <span data-translatable>Yapısal</span>
                    </Button>
                  </Link>
                  <Link to="/safety">
                    <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                      <Shield className="w-4 h-4" />
                      <span data-translatable>Güvenlik</span>
                    </Button>
                  </Link>
                  <Link to="/emissions">
                    <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                      <Leaf className="w-4 h-4" />
                      <span data-translatable>Emisyon</span>
                    </Button>
                  </Link>
                  <Link to="/weather">
                    <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                      <Cloud className="w-4 h-4" />
                      <span data-translatable>Meteoroloji</span>
                    </Button>
                  </Link>
                  <Link to="/special-ships">
                    <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                      <Ship className="w-4 h-4" />
                      <span data-translatable>Özel Gemiler</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Settings Button */}
            <div className="flex-shrink-0">
              <Link to="/settings">
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  title="Ayarlar"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Top Page Ad */}
      {shouldShowAd('top-page') && (
        <div className="mb-6">
          <AdBannerMobile />
        </div>
      )}



      {/* Bottom Page Ad */}
      {shouldShowAd('bottom-page') && (
        <div className="mt-8">
          <AdBannerInline />
        </div>
      )}

    </MobileLayout>
  );
};

export default Index;
