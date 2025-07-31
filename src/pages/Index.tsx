import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, Ship, Compass, Waves, Cog, Package, Droplets, Building, Shield, Leaf, Cloud, Settings } from "lucide-react";
import containerShipAerial from "@/assets/maritime/container-ship-aerial.jpg";




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
        
        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200/50 dark:border-blue-800/50 shadow-lg dark:shadow-gray-900/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100" data-translatable>
                Denizcilik Hesaplayıcısı
              </h1>
              <p className="text-sm text-muted-foreground" data-translatable>
                Profesyonel maritim hesaplamalar
              </p>
            </div>
            

          </div>



          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shadow-md">
              <img 
                src={containerShipAerial} 
                alt="Container Ship Aerial View" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed" data-translatable>
                Gemi mühendisliği, denizcilik ve maritime operasyonlar için kapsamlı hesaplama araçları. 
                Detaylı açıklamalar ve profesyonel sonuçlar.
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Link to="/formulas">
                  <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Brain className="w-4 h-4" />
                    <span data-translatable>Asistan</span>
                  </Button>
                </Link>
                <Link to="/trim-list">
                  <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700">
                    <Building className="w-4 h-4" />
                    <span data-translatable>Trim ve List</span>
                  </Button>
                </Link>
                <Link to="/stability">
                  <Button size="sm" variant="outline" className="gap-2 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700">
                    <Ship className="w-4 h-4" />
                    <span data-translatable>Stabilite</span>
                  </Button>
                </Link>
                <Link to="/navigation">
                  <Button size="sm" variant="outline" className="gap-2 border-orange-300 text-orange-600 hover:bg-orange-50">
                    <Compass className="w-4 h-4" />
                    <span data-translatable>Seyir</span>
                  </Button>
                </Link>
                <Link to="/hydrodynamics">
                  <Button size="sm" variant="outline" className="gap-2 border-cyan-300 dark:border-cyan-700 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-gray-700">
                    <Waves className="w-4 h-4" />
                    <span data-translatable>Hidrodinamik</span>
                  </Button>
                </Link>
                <Link to="/engine">
                  <Button size="sm" variant="outline" className="gap-2 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700">
                    <Cog className="w-4 h-4" />
                    <span data-translatable>Makine</span>
                  </Button>
                </Link>
                <Link to="/cargo">
                  <Button size="sm" variant="outline" className="gap-2 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-700">
                    <Package className="w-4 h-4" />
                    <span data-translatable>Kargo</span>
                  </Button>
                </Link>
                <Link to="/ballast">
                  <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700">
                    <Droplets className="w-4 h-4" />
                    <span data-translatable>Balast</span>
                  </Button>
                </Link>
                <Link to="/regulations">
                  <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700">
                    <Shield className="w-4 h-4" />
                    <span data-translatable>Regülasyonlar</span>
                  </Button>
                </Link>
                <Link to="/structural">
                  <Button size="sm" variant="outline" className="gap-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Building className="w-4 h-4" />
                    <span data-translatable>Yapısal</span>
                  </Button>
                </Link>
                <Link to="/safety">
                  <Button size="sm" variant="outline" className="gap-2 border-red-300 text-red-600 hover:bg-red-50">
                    <Shield className="w-4 h-4" />
                    <span data-translatable>Güvenlik</span>
                  </Button>
                </Link>
                <Link to="/emissions">
                  <Button size="sm" variant="outline" className="gap-2 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700">
                    <Leaf className="w-4 h-4" />
                    <span data-translatable>Emisyon</span>
                  </Button>
                </Link>
                <Link to="/weather">
                  <Button size="sm" variant="outline" className="gap-2 border-sky-300 dark:border-sky-700 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-gray-700">
                    <Cloud className="w-4 h-4" />
                    <span data-translatable>Meteoroloji</span>
                  </Button>
                </Link>
                <Link to="/special-ships">
                  <Button size="sm" variant="outline" className="gap-2 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700">
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
