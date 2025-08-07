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
import { CargoCalculations as Cargo } from "./pages/Cargo";
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
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isNative, keyboardVisible } = useAndroidFeatures();
  const { frameRate } = useFrameRate(); // Initialize frame rate

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark" storageKey="maritime-ui-theme-v2">
          <LanguageProvider>
            <Toaster />
            <div className={`min-h-screen bg-background text-foreground ${keyboardVisible ? 'pb-16' : ''} ${isNative ? 'safe-area' : ''}`}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/formulas" element={<Formulas />} />
                  <Route path="/regulations" element={<Regulations />} />
                  <Route path="/stability" element={<Stability />} />
                  <Route path="/navigation" element={<Navigation />} />
                  <Route path="/hydrodynamics" element={<Hydrodynamics />} />
                  <Route path="/engine" element={<Engine />} />
                            <Route path="/cargo" element={<Cargo />} />
          <Route path="/hydrostatics" element={<Hydrostatics />} />
          <Route path="/tank" element={<Tank />} />
          <Route path="/ballast" element={<Ballast />} />
          <Route path="/trim-list" element={<TrimList />} />
                  <Route path="/economics" element={<Economics />} />
                  <Route path="/structural" element={<StructuralCalculationsPage />} />
                  <Route path="/safety" element={<SafetyCalculationsPage />} />
                  <Route path="/emissions" element={<EmissionCalculationsPage />} />
                  <Route path="/weather" element={<WeatherCalculationsPage />} />
                  <Route path="/special-ships" element={<SpecialShipCalculationsPage />} />
                  <Route path="/hydrostatics-stability" element={<HydrostaticsStabilityPage />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/settings" element={<Settings />} />
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
