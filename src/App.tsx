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
import Index from "./pages/Index";
import Formulas from "./pages/Formulas";
import Regulations from "./pages/Regulations";
import Stability from "./pages/Stability";
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
import StabilityHydrostaticPage from "./pages/StabilityHydrostatic";
import StabilityStabilityPage from "./pages/StabilityStability";
import StabilityTrimListPage from "./pages/StabilityTrimList";
import StabilityAnalysisPage from "./pages/StabilityAnalysis";
import StabilityBonjeanPage from "./pages/StabilityBonjean";
import StabilityDraftPage from "./pages/StabilityDraft";
import StabilityDamagePage from "./pages/StabilityDamage";
import StabilityDisplacementPage from "./pages/StabilityDisplacement";
import StabilityTPCPage from "./pages/StabilityTPC";
import StabilityGMPage from "./pages/StabilityGM";
import StabilityGZPage from "./pages/StabilityGZ";
import StabilityTrimPage from "./pages/StabilityTrim";
import StabilityListPage from "./pages/StabilityList";
import StabilityLollPage from "./pages/StabilityLoll";
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
import StabilityRulesBasic from "./pages/StabilityRulesBasic";
import EconomicsMenu from "./pages/EconomicsMenu";

const queryClient = new QueryClient();

const App = () => {
  const hasLaunched = typeof window !== 'undefined' ? sessionStorage.getItem('hasLaunched') === 'true' : false;
  const [showSplash, setShowSplash] = useState(!hasLaunched);
  const { isNative, keyboardVisible } = useAndroidFeatures();
  const { frameRate } = useFrameRate(); // Initialize frame rate

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
                  <Route path="/stability/hydrostatic" element={<StabilityHydrostaticPage />} />
                  <Route path="/stability/stability" element={<StabilityStabilityPage />} />
                  <Route path="/stability/trimlist" element={<StabilityTrimListPage />} />
                  <Route path="/stability/analysis" element={<StabilityAnalysisPage />} />
                  <Route path="/stability/bonjean" element={<StabilityBonjeanPage />} />
                  <Route path="/stability/draft" element={<StabilityDraftPage />} />
                  <Route path="/stability/damage" element={<StabilityDamagePage />} />
                  <Route path="/stability/assistant" element={<StabilityAssistantPage />} />
                  <Route path="/stability/rules" element={<StabilityRules />} />
                  <Route path="/stability/rules-basic" element={<StabilityRulesBasic />} />
                  <Route path="/stability/displacement" element={<StabilityDisplacementPage />} />
                  <Route path="/stability/draft-calc" element={<StabilityDraftPage />} />
                  <Route path="/stability/tpc" element={<StabilityTPCPage />} />
                  <Route path="/stability/gm" element={<StabilityGMPage />} />
                  <Route path="/stability/gz" element={<StabilityGZPage />} />
                  <Route path="/stability/trim" element={<StabilityTrimPage />} />
                  <Route path="/stability/list" element={<StabilityListPage />} />
                  <Route path="/stability/loll" element={<StabilityLollPage />} />
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
                </Routes>
              </BrowserRouter>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
