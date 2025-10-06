import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DensityProvider } from "@/contexts/DensityContext";
import Index from "./pages/Index";
import CalculationsMenu from "./pages/CalculationsMenu";
import StabilityMenu from "./pages/StabilityMenu";
import SafetyMenu from "./pages/SafetyMenu";
import NavigationMenu from "./pages/NavigationMenu";
import EconomicsMenu from "./pages/EconomicsMenu";
import SeamanshipMenu from "./pages/SeamanshipMenu";
import SeamanshipTopicsPage from "./pages/SeamanshipTopics";
import TankMenu from "./pages/TankMenu";
import Navigation from "./pages/Navigation";
// import NavigationCalculationsPage from "./pages/NavigationCalculationsPage";
import Economics from "./pages/Economics";
import StabilityAssistantPage from "./pages/StabilityAssistant";
import StabilityGZIMO from "./pages/StabilityGZIMO";
import StabilityRules from "./pages/StabilityRules";
import StabilityAdvancedPage from "./pages/StabilityAdvanced";
import StabilityDamagePage from "./pages/StabilityDamage";
import StabilityGrainPlaceholder from "./pages/StabilityGrainPlaceholder";
import StabilityGMPage from "./pages/StabilityGM";
import StabilityWeightShiftPage from "./pages/StabilityWeightShift";
import StabilityFreeSurfacePage from "./pages/StabilityFreeSurface";
import StabilityGZPage from "./pages/StabilityGZ";
import SailorKnotsPage from "./pages/SailorKnots";
import StabilityAnalysisPage from "./pages/StabilityAnalysis";
import StableTalesPage from "./pages/StableTales";
import EmptyPage from "./pages/EmptyPage";
import Settings from "./pages/Settings";
import Formulas from "./pages/Formulas";
import Regulations from "./pages/Regulations";
import StabilityFormulasPage from "./pages/StabilityFormulas";
import StabilityTopicExplanationPage from "./pages/StabilityTopicExplanation";
import NavigationFormulasPage from "./pages/NavigationFormulas";
import NavigationTopicsPage from "./pages/NavigationTopics";
import DetailedMeteorology from "./pages/DetailedMeteorology";
import StabilityCalculationsPage from "./pages/StabilityCalculations";
import StabilityQuizPage from "./pages/StabilityQuiz";
import NavigationQuizPage from "./pages/NavigationQuiz";
import NavigationAssistantPage from "./pages/NavigationAssistant";
import ClockPage from "./pages/Clock";
import AuthCallback from "./pages/AuthCallback";

import WeatherForecast from "./pages/WeatherForecast";
import LocationSelector from "./pages/LocationSelector";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <LanguageProvider>
          <TooltipProvider>
            <ThemeProvider defaultTheme="dark" storageKey="maritime-ui-theme-v2">
              <DensityProvider>
                <Toaster />
                <div className="min-h-screen bg-background text-foreground">
                  <BrowserRouter>
                    <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/calculations" element={<CalculationsMenu />} />
                     <Route path="/stability" element={<StabilityMenu />} />
                     {/* Stability sub-routes */}
                     <Route path="/stability/assistant" element={<StabilityAssistantPage />} />
                     <Route path="/stability/rules" element={<StabilityRules />} />
                    <Route path="/stability/gz-imo" element={<StabilityGZIMO />} />
                    <Route path="/stability/advanced" element={<StabilityAdvancedPage />} />
                    <Route path="/stability/damage" element={<StabilityDamagePage />} />
                    {/* Grain stability route removed; grain account remains within calculations */}
                    <Route path="/stability/gm" element={<StabilityGMPage />} />
                    <Route path="/stability/weight-shift" element={<StabilityWeightShiftPage />} />
                    <Route path="/stability/free-surface" element={<StabilityFreeSurfacePage />} />
                    <Route path="/stability/gz" element={<StabilityGZPage />} />
                    <Route path="/stability/analysis" element={<StabilityAnalysisPage />} />
                    <Route path="/stability/stable-tales" element={<StableTalesPage />} />
                     <Route path="/stability/formulas" element={<StabilityFormulasPage />} />
                     <Route path="/stability/topic-explanation" element={<StabilityTopicExplanationPage />} />
                     <Route path="/stability/calculations" element={<StabilityCalculationsPage />} />
                    <Route path="/stability/quiz" element={<StabilityQuizPage />} />
                    <Route path="/safety-menu" element={<SafetyMenu />} />
                    <Route path="/navigation-menu" element={<NavigationMenu />} />
                    <Route path="/economics-menu" element={<EconomicsMenu />} />
                    <Route path="/seamanship-menu" element={<SeamanshipMenu />} />
                    <Route path="/seamanship/topics" element={<SeamanshipTopicsPage />} />
                    <Route path="/seamanship/knots" element={<SailorKnotsPage />} />
                    <Route path="/tank-menu" element={<TankMenu />} />
                    <Route path="/navigation" element={<Navigation />} />
                    <Route path="/navigation/formulas" element={<NavigationFormulasPage />} />
                    <Route path="/navigation/topics" element={<NavigationTopicsPage />} />
                    <Route path="/navigation/detailed-meteorology" element={<DetailedMeteorology />} />
                    <Route path="/navigation/assistant" element={<NavigationAssistantPage />} />
                    <Route path="/navigation/quiz" element={<NavigationQuizPage />} />
                    <Route path="/economics" element={<Economics />} />
                    <Route path="/empty-page" element={<EmptyPage />} />
                    <Route path="/settings" element={<Settings />} />
                     <Route path="/formulas" element={<Formulas />} />
                     <Route path="/regulations" element={<Regulations />} />
                     <Route path="/clock" element={<ClockPage />} />
                     <Route path="/auth/callback" element={<AuthCallback />} />
                     
          <Route path="/weather-forecast" element={<WeatherForecast />} />
          <Route path="/location-selector" element={<LocationSelector />} />
                     <Route path="*" element={<Index />} />
                    </Routes>
                  </BrowserRouter>
                </div>
              </DensityProvider>
            </ThemeProvider>
          </TooltipProvider>
        </LanguageProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;