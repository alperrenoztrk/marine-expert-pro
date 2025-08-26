import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SplashScreen } from "@/components/ui/splash-screen";
import { ThemeProvider } from "@/hooks/useTheme";
import { useAndroidFeatures } from "@/hooks/useAndroidFeatures";
import { useFrameRate } from "@/hooks/useFrameRate";
import { useState, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Formulas from "./pages/Formulas";
import Regulations from "./pages/Regulations";

import Navigation from "./pages/Navigation";
import Hydrodynamics from "./pages/Hydrodynamics";
import Engine from "./pages/Engine";
import { CargoCalculations as Cargo } from "./components/calculations/CargoCalculations";
import CargoMenu from "./pages/CargoMenu";
import { HydrostaticsCalculations as Hydrostatics } from "./pages/Hydrostatics";
import { TankCalculations as Tank } from "./pages/TankCalculations";
import Ballast from "./pages/Ballast";
import TrimList from "./pages/TrimList";
import AuthCallback from "./pages/AuthCallback";
import Economics from "./pages/Economics";
import StructuralCalculationsPage from "./pages/StructuralCalculations";
import SafetyCalculationsPage from "./pages/SafetyCalculations";
import EmissionCalculationsPage from "./pages/EmissionCalculations";
import WeatherCalculationsPage from "./pages/WeatherCalculations";
import SpecialShipCalculationsPage from "./pages/SpecialShipCalculations";
import HydrostaticsStabilityPage from "./pages/HydrostaticsStability";
import StabilityMenu from "./pages/StabilityMenu";
// Removed detailed stability pages
import Settings from "./pages/Settings";
import { LanguageRouteSync } from "@/components/LanguageRouteSync";
import CalculationsMenu from "./pages/CalculationsMenu";
import NavigationMenu from "./pages/NavigationMenu";
import HydrodynamicsMenu from "./pages/HydrodynamicsMenu";
import EngineMenu from "./pages/EngineMenu";
import BallastMenu from "./pages/BallastMenu";
import TankMenu from "./pages/TankMenu";
import StructuralMenu from "./pages/StructuralMenu";
import SafetyMenu from "./pages/SafetyMenu";
import EmissionsMenu from "./pages/EmissionsMenu";
import WeatherMenu from "./pages/WeatherMenu";
import SpecialShipsMenu from "./pages/SpecialShipsMenu";
import StabilityAssistantPage from "./pages/StabilityAssistant";
import StabilityRules from "./pages/StabilityRules";
// Removed StabilityRulesBasic and StabilityCalculatorPage imports
import EconomicsMenu from "./pages/EconomicsMenu";
import DraftSurveyStandard from "./pages/DraftSurveyStandard";
import DraftSurveyCargo from "./pages/DraftSurveyCargo";
import DraftSurveyBunker from "./pages/DraftSurveyBunker";
import DraftSurveyBallast from "./pages/DraftSurveyBallast";
import DraftSurveyPreloading from "./pages/DraftSurveyPreloading";
import DraftSurveyPostdischarge from "./pages/DraftSurveyPostdischarge";
import DraftSurveyIntermediate from "./pages/DraftSurveyIntermediate";
import DraftSurveyComparative from "./pages/DraftSurveyComparative";
import DraftSurveyDensity from "./pages/DraftSurveyDensity";
import DraftSurveyPort from "./pages/DraftSurveyPort";
import DraftSurveyAnalysis from "./pages/DraftSurveyAnalysis";
import DraftSurveyCalculator from "./pages/DraftSurveyCalculator";
// Stability2 removed
import StabilityAthwartship from "./pages/StabilityAthwartship";
import StabilityLongitudinal from "./pages/StabilityLongitudinal";
import StabilityGZIMO from "./pages/StabilityGZIMO";
import StabilityDamagePlaceholder from "./pages/StabilityDamagePlaceholder";
import StabilityGrainPlaceholder from "./pages/StabilityGrainPlaceholder";

const queryClient = new QueryClient();

const App = () => {
  const hasLaunched = typeof window !== 'undefined' ? sessionStorage.getItem('hasLaunched') === 'true' : false;
  const [showSplash, setShowSplash] = useState(!hasLaunched);
  const { isNative, keyboardVisible } = useAndroidFeatures();
  const { frameRate } = useFrameRate();

  useEffect(() => {
    const onBeforeUnload = () => console.info('[App] beforeunload fired');
    const onPageHide = () => console.info('[App] pagehide fired');
    const onVisibility = () => console.info('[App] visibilitychange:', document.visibilityState);
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('visibilitychange', onVisibility);
    console.info('[App] mounted');
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('visibilitychange', onVisibility);
      console.info('[App] unmounted');
    };
  }, []);

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem('hasLaunched', 'true');
    } catch {}
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
        <ThemeProvider defaultTheme="dark" storageKey="maritime-ui-theme-v2">
          <LanguageProvider>
            <Toaster />
            <div className={`min-h-screen bg-background text-foreground ${keyboardVisible ? 'pb-16' : ''} ${isNative ? 'safe-area' : ''}`}>
              <BrowserRouter>
                {/* Sync language on route changes */}
                <LanguageRouteSync />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/formulas" element={<Formulas />} />
                  <Route path="/regulations" element={<Regulations />} />
                  
                  <Route path="/navigation" element={<Navigation />} />
                  <Route path="/hydrodynamics" element={<Hydrodynamics />} />
                  <Route path="/engine" element={<Engine />} />
                  <Route path="/cargo" element={<CargoMenu />} />
                  <Route path="/cargo/distribution" element={<Cargo initialTab="distribution" singleMode />} />
                  <Route path="/cargo/containers" element={<Cargo initialTab="containers" singleMode />} />
                  <Route path="/cargo/securing" element={<Cargo initialTab="securing" singleMode />} />
                  <Route path="/cargo/planning" element={<Cargo initialTab="planning" singleMode />} />
                  <Route path="/cargo/grain" element={<Cargo initialTab="grain" singleMode />} />
                  <Route path="/cargo/survey" element={<Cargo initialTab="survey" singleMode />} />
                  <Route path="/cargo/costs" element={<Cargo initialTab="costs" singleMode />} />
                  <Route path="/hydrostatics" element={<Hydrostatics />} />
                  <Route path="/tank" element={<Tank />} />
                  <Route path="/ballast" element={<Ballast />} />
                  <Route path="/trim-list" element={<TrimList />} />
                  <Route path="/economics" element={<Economics />} />
                  <Route path="/economics-menu" element={<EconomicsMenu />} />
                  <Route path="/structural" element={<StructuralCalculationsPage />} />
                  <Route path="/safety" element={<SafetyCalculationsPage />} />
                  <Route path="/emissions" element={<EmissionCalculationsPage />} />
                  <Route path="/weather" element={<WeatherCalculationsPage />} />
                  <Route path="/special-ships" element={<SpecialShipCalculationsPage />} />
                  <Route path="/hydrostatics-stability" element={<HydrostaticsStabilityPage />} />
                  <Route path="/stability" element={<StabilityMenu />} />
                  <Route path="/calculations" element={<CalculationsMenu />} />
                  {/* Keep only Assistant and Rules under stability */}
                  <Route path="/stability/assistant" element={<StabilityAssistantPage />} />
                  <Route path="/stability/rules" element={<StabilityRules />} />
                  <Route path="/stability/athwartship" element={<StabilityAthwartship />} />
                  <Route path="/stability/longitudinal" element={<StabilityLongitudinal />} />
                  <Route path="/stability/gz-imo" element={<StabilityGZIMO />} />
                  <Route path="/stability/damage" element={<StabilityDamagePlaceholder />} />
                  <Route path="/stability/grain" element={<StabilityGrainPlaceholder />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/navigation-menu" element={<NavigationMenu />} />
                  <Route path="/hydrodynamics-menu" element={<HydrodynamicsMenu />} />
                  <Route path="/engine-menu" element={<EngineMenu />} />
                  <Route path="/ballast-menu" element={<BallastMenu />} />
                  <Route path="/tank-menu" element={<TankMenu />} />
                  <Route path="/structural-menu" element={<StructuralMenu />} />
                  <Route path="/safety-menu" element={<SafetyMenu />} />
                  <Route path="/emissions-menu" element={<EmissionsMenu />} />
                  <Route path="/weather-menu" element={<WeatherMenu />} />
                  <Route path="/special-ships-menu" element={<SpecialShipsMenu />} />
                  <Route path="/draft-survey-standard" element={<DraftSurveyStandard />} />
                  <Route path="/draft-survey-cargo" element={<DraftSurveyCargo />} />
                  <Route path="/draft-survey-bunker" element={<DraftSurveyBunker />} />
                  <Route path="/draft-survey-ballast" element={<DraftSurveyBallast />} />
                  <Route path="/draft-survey-preloading" element={<DraftSurveyPreloading />} />
                  <Route path="/draft-survey-postdischarge" element={<DraftSurveyPostdischarge />} />
                  <Route path="/draft-survey-intermediate" element={<DraftSurveyIntermediate />} />
                  <Route path="/draft-survey-comparative" element={<DraftSurveyComparative />} />
                  <Route path="/draft-survey-density" element={<DraftSurveyDensity />} />
                  <Route path="/draft-survey-port" element={<DraftSurveyPort />} />
                  <Route path="/draft-survey-analysis" element={<DraftSurveyAnalysis />} />
                  <Route path="/draft-survey-calculator" element={<DraftSurveyCalculator />} />
                  <Route path="*" element={<Index />} />
                </Routes>
              </BrowserRouter>
            </div>
          </LanguageProvider>
        </ThemeProvider>
        </TooltipProvider>
        </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;