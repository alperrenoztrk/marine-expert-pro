import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DensityProvider } from "@/contexts/DensityContext";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { useNavigationHierarchy } from "@/hooks/useNavigationHierarchy";
import Index from "./pages/Index";
import CalculationsMenu from "./pages/CalculationsMenu";
import CalculationSectionPage from "./pages/CalculationSectionPage";
import StabilityMenu from "./pages/StabilityMenu";
import SafetyMenu from "./pages/SafetyMenu";
import WeatherMenu from "./pages/WeatherMenu";
import NavigationMenu from "./pages/NavigationMenu";
import EconomicsMenu from "./pages/EconomicsMenu";
import SeamanshipMenu from "./pages/SeamanshipMenu";
import SeamanshipTopicsPage from "./pages/SeamanshipTopics";
import SeamanshipTopicButtons from "./pages/SeamanshipTopicButtons";
import TankMenu from "./pages/TankMenu";
import SOLASMenu from "./pages/SOLASMenu";
import Navigation from "./pages/Navigation";
import NavigationCalculationPage from "./pages/NavigationCalculation";
// import NavigationCalculationsPage from "./pages/NavigationCalculationsPage";
import Economics from "./pages/Economics";
import StabilityAssistantPage from "./pages/StabilityAssistant";
import StabilityGZIMO from "./pages/StabilityGZIMO";
import StabilityRules from "./pages/StabilityRules";
import StabilityAdvancedPage from "./pages/StabilityAdvanced";
import StabilityDamagePage from "./pages/StabilityDamage";
import StabilityGrainPage from "./pages/StabilityGrain";
import StabilityGMPage from "./pages/StabilityGM";
import StabilityWeightShiftPage from "./pages/StabilityWeightShift";
import StabilityFreeSurfacePage from "./pages/StabilityFreeSurface";
import StabilityGZPage from "./pages/StabilityGZ";
import SailorKnotsPage from "./pages/SailorKnots";
import StabilityAnalysisPage from "./pages/StabilityAnalysis";
import StableTalesPage from "./pages/StableTales";
import EmptyPage from "./pages/EmptyPage";
import MoonPhases from "./pages/MoonPhases";
import Settings from "./pages/Settings";
import Formulas from "./pages/Formulas";
import Regulations from "./pages/Regulations";
import StabilityFormulasPage from "./pages/StabilityFormulas";
import StabilityTopicsPage from "./pages/StabilityTopics";
import StabilityFormulaDetailPage from "./pages/StabilityFormulaDetail";
import NavigationFormulasPage from "./pages/NavigationFormulas";
import NavigationTopicsPage from "./pages/NavigationTopics";
import DetailedMeteorology from "./pages/DetailedMeteorology";
import COLREGPresentation from "./pages/COLREGPresentation";
import StabilityCalculationsPage from "./pages/StabilityCalculations";
import StabilityQuizPage from "./pages/StabilityQuiz";
import StabilityShearingBendingPage from "./pages/StabilityShearingBending";
import NavigationQuizPage from "./pages/NavigationQuiz";
import NavigationAssistantPage from "./pages/NavigationAssistant";
import ClockPage from "./pages/Clock";
import AuthCallback from "./pages/AuthCallback";
import StabilityPracticalPage from "./pages/StabilityPractical";
import StabilityPracticalTankPage from "./pages/StabilityPracticalTank";
import StabilityPracticalFWAPage from "./pages/StabilityPracticalFWA";
import StabilityPracticalGHMPage from "./pages/StabilityPracticalGHM";
import StabilityGrainCalculationPage from "./pages/StabilityGrainCalculation";
import StabilityGZCurvePage from "./pages/StabilityGZCurve";
import StabilityWindWeatherPage from "./pages/StabilityWindWeather";
import StabilityIMOCriteriaPage from "./pages/StabilityIMOCriteria";
import SafetyCalculationsPage from "./pages/SafetyCalculations";
import WeatherCalculationsPage from "./pages/WeatherCalculations";
import TankCalculationsPage from "./pages/TankCalculations";
import BallastPage from "./pages/Ballast";
import EnginePage from "./pages/Engine";
import HydrodynamicsPage from "./pages/Hydrodynamics";
import StructuralCalculationsPage from "./pages/StructuralCalculations";
import SpecialShipCalculationsPage from "./pages/SpecialShipCalculations";
import EmissionCalculationsPage from "./pages/EmissionCalculations";
import SOLASRegulationsPage from "./pages/SOLASRegulations";
import SOLASCertificatesPage from "./pages/SOLASCertificates";
import SOLASShipRequirementsPage from "./pages/SOLASShipRequirements";
import SOLASSafetyEquipmentPage from "./pages/SOLASSafetyEquipment";
import WeatherForecast from "./pages/WeatherForecast";
import SunsetTimes from "./pages/SunsetTimes";
import SunriseTimes from "./pages/SunriseTimes";
import LocationSelector from "./pages/LocationSelector";
import DraftSurveyCalculator from "./pages/DraftSurveyCalculator";
import DraftSurveyStandard from "./pages/DraftSurveyStandard";
import CargoTopicsPage from "./pages/CargoTopics";
import CargoRulesPage from "./pages/CargoRules";
import CargoAssistantPage from "./pages/CargoAssistant";
import CargoQuizPage from "./pages/CargoQuiz";
import MeteorologyFormulasPage from "./pages/MeteorologyFormulas";
import MeteorologyRulesPage from "./pages/MeteorologyRules";
import MeteorologyAssistantPage from "./pages/MeteorologyAssistant";
import MeteorologyQuizPage from "./pages/MeteorologyQuiz";
import SeamanshipCalculationsPage from "./pages/SeamanshipCalculations";
import SeamanshipFormulasPage from "./pages/SeamanshipFormulas";
import SeamanshipRulesPage from "./pages/SeamanshipRules";
import SeamanshipAssistantPage from "./pages/SeamanshipAssistant";
import SeamanshipQuizPage from "./pages/SeamanshipQuiz";
import SafetyTopicsPage from "./pages/SafetyTopics";
import SafetyFormulasPage from "./pages/SafetyFormulas";
import SafetyRulesPage from "./pages/SafetyRules";
import SafetyAssistantPage from "./pages/SafetyAssistant";
import SafetyQuizPage from "./pages/SafetyQuiz";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Apply hierarchical navigation
  useNavigationHierarchy();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/calculations" element={<PageTransition><CalculationsMenu /></PageTransition>} />
        <Route path="/calculations/:categoryId/:sectionId" element={<PageTransition><CalculationSectionPage /></PageTransition>} />
        <Route path="/stability" element={<PageTransition><StabilityMenu /></PageTransition>} />
        {/* Stability sub-routes */}
        <Route path="/stability/assistant" element={<PageTransition><StabilityAssistantPage /></PageTransition>} />
        <Route path="/stability/rules" element={<PageTransition><StabilityRules /></PageTransition>} />
        <Route path="/stability/gz-imo" element={<PageTransition><StabilityGZIMO /></PageTransition>} />
        <Route path="/stability/advanced" element={<PageTransition><StabilityAdvancedPage /></PageTransition>} />
        <Route path="/stability/damage" element={<PageTransition><StabilityDamagePage /></PageTransition>} />
        <Route path="/stability/grain" element={<PageTransition><StabilityGrainPage /></PageTransition>} />
        <Route path="/stability/gm" element={<PageTransition><StabilityGMPage /></PageTransition>} />
        <Route path="/stability/weight-shift" element={<PageTransition><StabilityWeightShiftPage /></PageTransition>} />
        <Route path="/stability/free-surface" element={<PageTransition><StabilityFreeSurfacePage /></PageTransition>} />
        <Route path="/stability/gz" element={<PageTransition><StabilityGZPage /></PageTransition>} />
        <Route path="/stability/analysis" element={<PageTransition><StabilityAnalysisPage /></PageTransition>} />
        <Route path="/stability/stable-tales" element={<PageTransition><StableTalesPage /></PageTransition>} />
        <Route path="/stability/formulas" element={<PageTransition><StabilityFormulasPage /></PageTransition>} />
        <Route path="/stability/formulas/:id" element={<PageTransition><StabilityFormulaDetailPage /></PageTransition>} />
        <Route path="/stability/calculations" element={<PageTransition><StabilityCalculationsPage /></PageTransition>} />
        <Route path="/stability/practical" element={<PageTransition><StabilityPracticalPage /></PageTransition>} />
        <Route path="/stability/practical/tank" element={<PageTransition><StabilityPracticalTankPage /></PageTransition>} />
        <Route path="/stability/practical/fwa" element={<PageTransition><StabilityPracticalFWAPage /></PageTransition>} />
        <Route path="/stability/practical/ghm" element={<PageTransition><StabilityPracticalGHMPage /></PageTransition>} />
        <Route path="/stability/topics" element={<PageTransition><StabilityTopicsPage /></PageTransition>} />
        <Route path="/stability/quiz" element={<PageTransition><StabilityQuizPage /></PageTransition>} />
        <Route path="/stability/shearing-bending" element={<PageTransition><StabilityShearingBendingPage /></PageTransition>} />
        <Route path="/stability/grain-calculation" element={<PageTransition><StabilityGrainCalculationPage /></PageTransition>} />
        <Route path="/stability/gz-curve" element={<PageTransition><StabilityGZCurvePage /></PageTransition>} />
        <Route path="/stability/wind-weather" element={<PageTransition><StabilityWindWeatherPage /></PageTransition>} />
        <Route path="/stability/imo-criteria" element={<PageTransition><StabilityIMOCriteriaPage /></PageTransition>} />
        <Route path="/safety" element={<PageTransition><SafetyCalculationsPage /></PageTransition>} />
        <Route path="/weather" element={<PageTransition><WeatherCalculationsPage /></PageTransition>} />
        <Route path="/meteorology/topics" element={<PageTransition><DetailedMeteorology /></PageTransition>} />
        <Route path="/tank" element={<PageTransition><TankCalculationsPage /></PageTransition>} />
        <Route path="/cargo/calculations" element={<PageTransition><DraftSurveyCalculator /></PageTransition>} />
        <Route path="/cargo/formulas" element={<PageTransition><DraftSurveyStandard /></PageTransition>} />
        <Route path="/cargo/topics" element={<PageTransition><CargoTopicsPage /></PageTransition>} />
        <Route path="/cargo/rules" element={<PageTransition><CargoRulesPage /></PageTransition>} />
        <Route path="/cargo/assistant" element={<PageTransition><CargoAssistantPage /></PageTransition>} />
        <Route path="/cargo/quiz" element={<PageTransition><CargoQuizPage /></PageTransition>} />
        <Route path="/meteorology/formulas" element={<PageTransition><MeteorologyFormulasPage /></PageTransition>} />
        <Route path="/meteorology/rules" element={<PageTransition><MeteorologyRulesPage /></PageTransition>} />
        <Route path="/meteorology/assistant" element={<PageTransition><MeteorologyAssistantPage /></PageTransition>} />
        <Route path="/meteorology/quiz" element={<PageTransition><MeteorologyQuizPage /></PageTransition>} />
        <Route path="/ballast" element={<PageTransition><BallastPage /></PageTransition>} />
        <Route path="/engine" element={<PageTransition><EnginePage /></PageTransition>} />
        <Route path="/hydrodynamics" element={<PageTransition><HydrodynamicsPage /></PageTransition>} />
        <Route path="/structural" element={<PageTransition><StructuralCalculationsPage /></PageTransition>} />
        <Route path="/special-ships" element={<PageTransition><SpecialShipCalculationsPage /></PageTransition>} />
        <Route path="/emissions" element={<PageTransition><EmissionCalculationsPage /></PageTransition>} />
        <Route path="/solas/regulations" element={<PageTransition><SOLASRegulationsPage /></PageTransition>} />
        <Route path="/solas/certificates" element={<PageTransition><SOLASCertificatesPage /></PageTransition>} />
        <Route path="/solas/ship-requirements" element={<PageTransition><SOLASShipRequirementsPage /></PageTransition>} />
        <Route path="/solas/safety-equipment" element={<PageTransition><SOLASSafetyEquipmentPage /></PageTransition>} />
        <Route path="/safety-menu" element={<PageTransition><SafetyMenu /></PageTransition>} />
        <Route path="/weather-menu" element={<PageTransition><WeatherMenu /></PageTransition>} />
        <Route path="/navigation-menu" element={<PageTransition><NavigationMenu /></PageTransition>} />
        <Route path="/economics-menu" element={<PageTransition><EconomicsMenu /></PageTransition>} />
        <Route path="/seamanship-menu" element={<PageTransition><SeamanshipMenu /></PageTransition>} />
        <Route path="/seamanship/topics-menu" element={<PageTransition><SeamanshipTopicButtons /></PageTransition>} />
        <Route path="/seamanship/topics" element={<PageTransition><SeamanshipTopicsPage /></PageTransition>} />
        <Route path="/seamanship/knots" element={<PageTransition><SailorKnotsPage /></PageTransition>} />
        <Route path="/seamanship/calculations" element={<PageTransition><SeamanshipCalculationsPage /></PageTransition>} />
        <Route path="/seamanship/formulas" element={<PageTransition><SeamanshipFormulasPage /></PageTransition>} />
        <Route path="/seamanship/rules" element={<PageTransition><SeamanshipRulesPage /></PageTransition>} />
        <Route path="/seamanship/assistant" element={<PageTransition><SeamanshipAssistantPage /></PageTransition>} />
        <Route path="/seamanship/quiz" element={<PageTransition><SeamanshipQuizPage /></PageTransition>} />
        <Route path="/safety/topics" element={<PageTransition><SafetyTopicsPage /></PageTransition>} />
        <Route path="/safety/formulas" element={<PageTransition><SafetyFormulasPage /></PageTransition>} />
        <Route path="/safety/rules" element={<PageTransition><SafetyRulesPage /></PageTransition>} />
        <Route path="/safety/assistant" element={<PageTransition><SafetyAssistantPage /></PageTransition>} />
        <Route path="/safety/quiz" element={<PageTransition><SafetyQuizPage /></PageTransition>} />
        <Route path="/tank-menu" element={<PageTransition><TankMenu /></PageTransition>} />
        <Route path="/solas" element={<PageTransition><SOLASMenu /></PageTransition>} />
        <Route path="/navigation" element={<PageTransition><Navigation /></PageTransition>} />
        <Route path="/navigation/calc/:id" element={<PageTransition><NavigationCalculationPage /></PageTransition>} />
        <Route path="/navigation/formulas" element={<PageTransition><NavigationFormulasPage /></PageTransition>} />
        <Route path="/navigation/topics" element={<PageTransition><NavigationTopicsPage /></PageTransition>} />
        <Route path="/navigation/meteorology" element={<PageTransition><DetailedMeteorology /></PageTransition>} />
        <Route path="/navigation/colreg-presentation" element={<PageTransition><COLREGPresentation /></PageTransition>} />
        <Route path="/navigation/assistant" element={<PageTransition><NavigationAssistantPage /></PageTransition>} />
        <Route path="/navigation/quiz" element={<PageTransition><NavigationQuizPage /></PageTransition>} />
        <Route path="/economics" element={<PageTransition><Economics /></PageTransition>} />
        <Route path="/empty-page" element={<PageTransition><EmptyPage /></PageTransition>} />
        <Route path="/moon-phases" element={<PageTransition><MoonPhases /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="/formulas" element={<PageTransition><Formulas /></PageTransition>} />
        <Route path="/regulations" element={<PageTransition><Regulations /></PageTransition>} />
        <Route path="/clock" element={<PageTransition><ClockPage /></PageTransition>} />
        <Route path="/auth/callback" element={<PageTransition><AuthCallback /></PageTransition>} />
        <Route path="/weather-forecast" element={<PageTransition><WeatherForecast /></PageTransition>} />
        <Route path="/sunset-times" element={<PageTransition><SunsetTimes /></PageTransition>} />
        <Route path="/sunrise-times" element={<PageTransition><SunriseTimes /></PageTransition>} />
        <Route path="/location-selector" element={<PageTransition><LocationSelector /></PageTransition>} />
        <Route path="*" element={<PageTransition><Index /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

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
                    <AnimatedRoutes />
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