import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, Ship, Compass, Waves, Cog, Package, Droplets, Building, Shield, Leaf, Cloud, Settings } from "lucide-react";




import { useAdManager, loadAdSenseScript } from "@/hooks/useAdManager";

import { AdBannerMobile, AdBannerInline } from "@/components/ads/AdBanner";
import { NativeAd, MaritimeEquipmentAd, MaritimeSoftwareAd } from "@/components/ads/NativeAd";
import { toast } from "sonner";
import React from "react"; // Added missing import for React


// Removed calculation components - they are now on individual pages

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
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
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/c6c6ba44-f631-4adf-8900-c7b1c64e1f49.png" 
                  alt="Maritime Calculator Logo" 
                  className="maritime-logo w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 drop-shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm" data-translatable>
                Maritime Calculator
              </h1>
            </div>
          </div>



          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed" data-translatable>
                Uzakyol zabitlerinden denizcilik öğrencilerine – tüm denizciler için pratik hesaplama platformu
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Link to="/formulas">
                  <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 nature:from-green-600 nature:to-emerald-600 nature:hover:from-green-700 nature:hover:to-emerald-700">
                    <Brain className="w-4 h-4" />
                    <span data-translatable>Asistan</span>
                  </Button>
                </Link>
                <Link to="/trim-list">
                  <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                    <Building className="w-4 h-4" />
                    <span data-translatable>Trim ve List</span>
                  </Button>
                </Link>
                <Link to="/stability">
                  <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                    <Ship className="w-4 h-4" />
                    <span data-translatable>Stabilite</span>
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
                <Link to="/regulations">
                  <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-gray-700 cyberpunk:border-yellow-400 cyberpunk:text-yellow-400 cyberpunk:hover:bg-gray-800 nature:border-green-400 nature:text-green-600 nature:hover:bg-green-50">
                    <Shield className="w-4 h-4" />
                    <span data-translatable>Regülasyonlar</span>
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

      {/* Floating Settings Button */}
      <Link to="/settings" className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          title="Ayarlar"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </Link>

    </MobileLayout>
  );
};

export default Index;
