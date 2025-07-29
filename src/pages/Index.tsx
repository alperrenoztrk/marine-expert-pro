import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, Ship, Compass, Waves, Cog, Package, Droplets, Building, Shield, Leaf, Cloud, Settings, BookmarkPlus, History } from "lucide-react";
import maritimeHero from "@/assets/maritime-hero.jpg";
import { AutoLanguageSelector } from "@/components/AutoLanguageSelector";
import { GoogleAuth } from "@/components/auth/GoogleAuth";
import { useAdManager, loadAdSenseScript } from "@/hooks/useAdManager";
import { useUserData } from "@/hooks/useUserData";
import { AdBannerMobile, AdBannerInline } from "@/components/ads/AdBanner";
import { NativeAd, MaritimeEquipmentAd, MaritimeSoftwareAd } from "@/components/ads/NativeAd";
import { toast } from "sonner";
import React from "react"; // Added missing import for React


// Removed calculation components - they are now on individual pages

const Index = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
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
  
  const safeUserData = (() => {
    try {
      return useUserData(currentUser?.id);
    } catch (error) {
      console.warn('UserData hook failed, using fallback:', error);
      return {
        calculationHistory: [],
        userStats: null,
        saveCalculation: () => Promise.resolve(),
        toggleFavorite: () => Promise.resolve(),
        getFavorites: () => [],
        getRecentCalculations: () => []
      };
    }
  })();

  const { shouldShowAd, trackInteraction } = safeAdManager;
  const { 
    calculationHistory, 
    userStats, 
    saveCalculation, 
    toggleFavorite, 
    getFavorites,
    getRecentCalculations 
  } = safeUserData;

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
    if (currentUser?.id) {
      try {
        await saveCalculation(calculationType, inputData, resultData);
        toast.success("Hesaplama kaydedildi!");
      } catch (error) {
        console.warn('Failed to save calculation:', error);
      }
    }
  };

  const handleToggleFavorite = async (calculationId: string) => {
    if (currentUser?.id) {
      try {
        await toggleFavorite(calculationId);
        toast.success("Favori durumu güncellendi!");
      } catch (error) {
        console.warn('Failed to toggle favorite:', error);
      }
    }
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
        
        <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200/50 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Ship className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900" data-translatable>
                  Denizcilik Hesaplayıcısı
                </h1>
                <p className="text-sm text-muted-foreground" data-translatable>
                  Profesyonel maritim hesaplamalar
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <AutoLanguageSelector />
              <GoogleAuth onAuthChange={setCurrentUser} />
            </div>
          </div>

          {/* User Stats (if logged in) */}
          {currentUser && userStats && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Settings className="w-4 h-4 text-blue-600" />
                    <span data-translatable>Toplam:</span> {userStats.total_calculations}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookmarkPlus className="w-4 h-4 text-purple-600" />
                    <span data-translatable>Favori:</span> {getFavorites().length}
                  </span>
                  <span className="flex items-center gap-1">
                    <History className="w-4 h-4 text-teal-600" />
                    <span data-translatable>Seviye:</span> {userStats.user_level}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <BookmarkPlus className="w-3 h-3 mr-1" />
                    <span data-translatable>Favoriler</span>
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <History className="w-3 h-3 mr-1" />
                    <span data-translatable>Geçmiş</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shadow-md">
              <img 
                src={maritimeHero} 
                alt="Maritime" 
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
                  <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50">
                    <Building className="w-4 h-4" />
                    <span data-translatable>Trim ve List</span>
                  </Button>
                </Link>
                <Link to="/stability">
                  <Button size="sm" variant="outline" className="gap-2 border-green-300 text-green-600 hover:bg-green-50">
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
                  <Button size="sm" variant="outline" className="gap-2 border-cyan-300 text-cyan-600 hover:bg-cyan-50">
                    <Waves className="w-4 h-4" />
                    <span data-translatable>Hidrodinamik</span>
                  </Button>
                </Link>
                <Link to="/engine">
                  <Button size="sm" variant="outline" className="gap-2 border-purple-300 text-purple-600 hover:bg-purple-50">
                    <Cog className="w-4 h-4" />
                    <span data-translatable>Makine</span>
                  </Button>
                </Link>
                <Link to="/cargo">
                  <Button size="sm" variant="outline" className="gap-2 border-amber-300 text-amber-600 hover:bg-amber-50">
                    <Package className="w-4 h-4" />
                    <span data-translatable>Kargo</span>
                  </Button>
                </Link>
                <Link to="/ballast">
                  <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50">
                    <Droplets className="w-4 h-4" />
                    <span data-translatable>Balast</span>
                  </Button>
                </Link>
                <Link to="/regulations">
                  <Button size="sm" variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50">
                    <Shield className="w-4 h-4" />
                    <span data-translatable>Regülasyonlar</span>
                  </Button>
                </Link>
                <Link to="/structural">
                  <Button size="sm" variant="outline" className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-50">
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
                  <Button size="sm" variant="outline" className="gap-2 border-green-300 text-green-600 hover:bg-green-50">
                    <Leaf className="w-4 h-4" />
                    <span data-translatable>Emisyon</span>
                  </Button>
                </Link>
                <Link to="/weather">
                  <Button size="sm" variant="outline" className="gap-2 border-sky-300 text-sky-600 hover:bg-sky-50">
                    <Cloud className="w-4 h-4" />
                    <span data-translatable>Meteoroloji</span>
                  </Button>
                </Link>
                <Link to="/special-ships">
                  <Button size="sm" variant="outline" className="gap-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50">
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

      {/* Quick Access Section */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900" data-translatable>
          Hızlı Erişim Hesaplama Modülleri
        </h2>
        <p className="text-gray-600" data-translatable>
          Profesyonel denizcilik hesaplamalarına tek tıkla erişin
        </p>
      </div>

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
