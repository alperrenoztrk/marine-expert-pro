import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import CalculationsMenu from "./pages/CalculationsMenu";
import StabilityMenu from "./pages/StabilityMenu";
import StabilityTransversePage from "./pages/StabilityTransverse";
import SafetyMenu from "./pages/SafetyMenu";
import NavigationMenu from "./pages/NavigationMenu";
import EconomicsMenu from "./pages/EconomicsMenu";
import TankMenu from "./pages/TankMenu";
import CargoMenu from "./pages/CargoMenu";
import Navigation from "./pages/Navigation";
import Economics from "./pages/Economics";
import StabilityAssistantPage from "./pages/StabilityAssistant";
import StabilityRules from "./pages/StabilityRules";
import StabilityLongitudinal from "./pages/StabilityLongitudinal";
import StabilityGZIMO from "./pages/StabilityGZIMO";
import StabilityDamagePage from "./pages/StabilityDamage";
import StabilityGrainPlaceholder from "./pages/StabilityGrainPlaceholder";
import StabilityGMPage from "./pages/StabilityGM";
import StabilityWeightShiftPage from "./pages/StabilityWeightShift";
import StabilityFreeSurfacePage from "./pages/StabilityFreeSurface";
import StabilityGZPage from "./pages/StabilityGZ";
import StabilityAnalysisPage from "./pages/StabilityAnalysis";
import EmptyPage from "./pages/EmptyPage";
import Settings from "./pages/Settings";
import Formulas from "./pages/Formulas";
import Regulations from "./pages/Regulations";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <ThemeProvider defaultTheme="dark" storageKey="maritime-ui-theme-v2">
            <Toaster />
            <div className="min-h-screen bg-background text-foreground">
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/calculations" element={<CalculationsMenu />} />
                  <Route path="/stability" element={<StabilityMenu />} />
                  <Route path="/stability/transverse" element={<StabilityTransversePage />} />
                  {/* Stability sub-routes */}
                  <Route path="/stability/assistant" element={<StabilityAssistantPage />} />
                  <Route path="/stability/rules" element={<StabilityRules />} />
                  <Route path="/stability/longitudinal" element={<StabilityLongitudinal />} />
                  <Route path="/stability/gz-imo" element={<StabilityGZIMO />} />
                  <Route path="/stability/damage" element={<StabilityDamagePage />} />
                  <Route path="/stability/grain" element={<StabilityGrainPlaceholder />} />
                  <Route path="/stability/gm" element={<StabilityGMPage />} />
                  <Route path="/stability/weight-shift" element={<StabilityWeightShiftPage />} />
                  <Route path="/stability/free-surface" element={<StabilityFreeSurfacePage />} />
                  <Route path="/stability/gz" element={<StabilityGZPage />} />
                  <Route path="/stability/analysis" element={<StabilityAnalysisPage />} />
                  <Route path="/safety-menu" element={<SafetyMenu />} />
                  <Route path="/navigation-menu" element={<NavigationMenu />} />
                  <Route path="/economics-menu" element={<EconomicsMenu />} />
                  <Route path="/tank-menu" element={<TankMenu />} />
                  <Route path="/cargo" element={<CargoMenu />} />
                  <Route path="/navigation" element={<Navigation />} />
                  <Route path="/economics" element={<Economics />} />
                  <Route path="/empty-page" element={<EmptyPage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/formulas" element={<Formulas />} />
                  <Route path="/regulations" element={<Regulations />} />
                  <Route path="*" element={<Index />} />
                </Routes>
              </BrowserRouter>
            </div>
          </ThemeProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;