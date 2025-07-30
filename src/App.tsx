import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SplashScreen } from "@/components/ui/splash-screen";
import { ThemeProvider } from "@/hooks/useTheme";
import { useState } from "react";
import Index from "./pages/Index";
import Formulas from "./pages/Formulas";
import Regulations from "./pages/Regulations";
import Stability from "./pages/Stability";
import Navigation from "./pages/Navigation";
import Hydrodynamics from "./pages/Hydrodynamics";
import Engine from "./pages/Engine";
import Cargo from "./pages/Cargo";
import Ballast from "./pages/Ballast";
import TrimList from "./pages/TrimList";
import AuthCallback from "./pages/AuthCallback";
import Economics from "./pages/Economics";
import StructuralCalculationsPage from "./pages/StructuralCalculations";
import SafetyCalculationsPage from "./pages/SafetyCalculations";
import EmissionCalculationsPage from "./pages/EmissionCalculations";
import WeatherCalculationsPage from "./pages/WeatherCalculations";
import SpecialShipCalculationsPage from "./pages/SpecialShipCalculations";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light">
          <LanguageProvider>
            <Toaster />
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
          <Route path="/ballast" element={<Ballast />} />
          <Route path="/trim-list" element={<TrimList />} />
          <Route path="/economics" element={<Economics />} />
          <Route path="/structural" element={<StructuralCalculationsPage />} />
          <Route path="/safety" element={<SafetyCalculationsPage />} />
          <Route path="/emissions" element={<EmissionCalculationsPage />} />
          <Route path="/weather" element={<WeatherCalculationsPage />} />
          <Route path="/special-ships" element={<SpecialShipCalculationsPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/settings" element={<Settings />} />
                  </Routes>
        </BrowserRouter>
      </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
