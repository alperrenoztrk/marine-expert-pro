import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, ChevronDown, ChevronUp, Ship, Compass, Waves, Cog, Package, Droplets, Building, Shield, Leaf, Cloud, DollarSign, Settings, BookmarkPlus, History, Calculator } from "lucide-react";
import maritimeHero from "@/assets/maritime-hero.jpg";
import { AutoLanguageSelector } from "@/components/AutoLanguageSelector";
import { GoogleAuth } from "@/components/auth/GoogleAuth";
import { useAdManager, loadAdSenseScript } from "@/hooks/useAdManager";
import { useUserData } from "@/hooks/useUserData";
import { AdBannerMobile, AdBannerInline } from "@/components/ads/AdBanner";
import { NativeAd, MaritimeEquipmentAd, MaritimeSoftwareAd } from "@/components/ads/NativeAd";
import { toast } from "sonner";
import React from "react"; // Added missing import for React
import { TestCalculation } from "@/components/TestCalculation";
import { TestGeminiAI } from "@/components/TestGeminiAI";

// Import all calculation components with error boundary
const StabilityCalculations = React.lazy(() => 
  import("@/components/calculations/StabilityCalculations").then(module => ({
    default: module.StabilityCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const NavigationCalculations = React.lazy(() => 
  import("@/components/calculations/NavigationCalculations").then(module => ({
    default: module.NavigationCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const HydrodynamicsCalculations = React.lazy(() => 
  import("@/components/calculations/HydrodynamicsCalculations").then(module => ({
    default: module.HydrodynamicsCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const EngineCalculations = React.lazy(() => 
  import("@/components/calculations/EngineCalculations").then(module => ({
    default: module.EngineCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const CargoCalculations = React.lazy(() => 
  import("@/components/calculations/CargoCalculations").then(module => ({
    default: module.CargoCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const BallastCalculations = React.lazy(() => 
  import("@/components/calculations/BallastCalculations").then(module => ({
    default: module.BallastCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const TrimCalculations = React.lazy(() => 
  import("@/components/calculations/TrimCalculations").then(module => ({
    default: module.TrimCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const StructuralCalculations = React.lazy(() => 
  import("@/components/calculations/StructuralCalculations").then(module => ({
    default: module.StructuralCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const SafetyCalculations = React.lazy(() => 
  import("@/components/calculations/SafetyCalculations").then(module => ({
    default: module.SafetyCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const EmissionCalculations = React.lazy(() => 
  import("@/components/calculations/EmissionCalculations").then(module => ({
    default: module.EmissionCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const WeatherCalculations = React.lazy(() => 
  import("@/components/calculations/WeatherCalculations").then(module => ({
    default: module.WeatherCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const EconomicCalculations = React.lazy(() => 
  import("@/components/calculations/EconomicCalculations").then(module => ({
    default: module.EconomicCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

const SpecialShipCalculations = React.lazy(() => 
  import("@/components/calculations/SpecialShipCalculations").then(module => ({
    default: module.SpecialShipCalculations
  })).catch(() => ({ 
    default: () => <div className="p-4 text-muted-foreground">Hesaplama bileşeni yüklenemedi</div> 
  }))
);

interface CalculationCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  component: any;
}

const Index = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
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

  // Calculation cards configuration
  const calculationCards: CalculationCard[] = [
    {
      id: "stability",
      title: "Gemi Stabilitesi",
      description: "GM, GZ eğrisi, stabilite faktörleri ve heeling açısı hesaplamaları",
      icon: Ship,
      component: StabilityCalculations
    },
    {
      id: "navigation", 
      title: "Seyir Hesaplamaları",
      description: "Mesafe, hız, rota, konum ve zaman hesaplamaları",
      icon: Compass,
      component: NavigationCalculations
    },
    {
      id: "hydrodynamics",
      title: "Hidrodinamik",
      description: "Direnç, güç, itme ve dalga yük hesaplamaları",
      icon: Waves,
      component: HydrodynamicsCalculations
    },
    {
      id: "engine",
      title: "Makine Hesaplamaları", 
      description: "Motor gücü, yakıt tüketimi ve performans hesaplamaları",
      icon: Cog,
      component: EngineCalculations
    },
    {
      id: "cargo",
      title: "Kargo Operasyonları",
      description: "Yük hesaplamaları, istif planı ve ağırlık merkezi",
      icon: Package,
      component: CargoCalculations
    },
    {
      id: "ballast",
      title: "Balast Hesaplamaları",
      description: "Balast tankları, su transferi ve trim ayarları",
      icon: Droplets,
      component: BallastCalculations
    },
    {
      id: "trim",
      title: "Trim ve List",
      description: "Gemi duruşu, trim açısı ve list düzeltme hesaplamaları",
      icon: Building,
      component: TrimCalculations
    },
    {
      id: "structural",
      title: "Yapısal Hesaplamalar",
      description: "Mukavemet, gerilme ve yapısal analiz hesaplamaları", 
      icon: Building,
      component: StructuralCalculations
    },
    {
      id: "safety",
      title: "Güvenlik Hesaplamaları",
      description: "Can salı, yangın sistemi ve acil durum hesaplamaları",
      icon: Shield,
      component: SafetyCalculations
    },
    {
      id: "emission",
      title: "Emisyon Hesaplamaları",
      description: "CO2, NOx, SOx emisyon hesaplamaları ve çevre uyumu",
      icon: Leaf,
      component: EmissionCalculations
    },
    {
      id: "weather",
      title: "Hava Durumu",
      description: "Rota optimizasyonu, hava koşulları ve dalga hesaplamaları",
      icon: Cloud,
      component: WeatherCalculations
    },
    {
      id: "economic",
      title: "Ekonomik Hesaplamalar",
      description: "Maliyet analizi, yakıt ekonomisi ve verimlilik hesaplamaları",
      icon: DollarSign,
      component: EconomicCalculations
    },
    {
      id: "special",
      title: "Özel Gemi Hesaplamaları",
      description: "Tanker, konteyner, yolcu gemisi özel hesaplamaları",
      icon: Ship,
      component: SpecialShipCalculations
    },
    {
      id: "test",
      title: "Test Hesaplama",
      description: "Basit deplasman hesaplaması - test için",
      icon: Calculator,
      component: TestCalculation
    },
    {
      id: "ai-test",
      title: "AI Test Modu",
      description: "Gemini AI asistanını test edin - simülasyon",
      icon: Brain,
      component: TestGeminiAI
    }
  ];

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
    trackInteraction('card_toggle');
  };

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

  const getAdComponent = (index: number) => {
    switch (index % 3) {
      case 0:
        return <NativeAd className="my-4" />;
      case 1:
        return <MaritimeEquipmentAd />;
      case 2:
        return <MaritimeSoftwareAd />;
      default:
        return <NativeAd className="my-4" />;
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
                  AI destekli profesyonel maritim hesaplamalar
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
                AI asistanı ile detaylı açıklamalar ve profesyonel sonuçlar.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Link to="/formulas">
                  <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Brain className="w-4 h-4" />
                    <span data-translatable>AI Asistana Sor</span>
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

      {/* Calculation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {calculationCards.map((card, index) => {
          const IconComponent = card.icon;
          const CalculationComponent = card.component;
          const isExpanded = expandedCard === card.id;

          return (
            <React.Fragment key={card.id}>
              <Card className={`
                transition-all duration-300 hover:shadow-lg border-2
                ${isExpanded ? 'border-primary shadow-lg scale-[1.02]' : 'border-border hover:border-primary/50'}
              `}>
                <CardHeader 
                  className="cursor-pointer pb-3"
                  onClick={() => toggleCard(card.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base leading-tight line-clamp-2" data-translatable>
                          {card.title}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-tight line-clamp-2" data-translatable>
                    {card.description}
                  </CardDescription>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="border-t border-border/50 pt-4">
                      <React.Suspense 
                        fallback={
                          <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        }
                      >
                        <CalculationComponent onCalculationComplete={handleCalculationComplete} />
                      </React.Suspense>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Between cards ads */}
              {shouldShowAd('between-cards') && (index + 1) % 4 === 0 && (
                <div className="col-span-full my-4">
                  {getAdComponent(Math.floor(index / 4))}
                </div>
              )}
            </React.Fragment>
          );
        })}
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
