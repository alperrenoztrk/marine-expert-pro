import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/hooks/useTheme";
import { useAndroidFeatures } from "@/hooks/useAndroidFeatures";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import CelestialCalculations from "./pages/CelestialCalculations";
import CalculationsMenu from "./pages/CalculationsMenu";
import StabilityMenu from "./pages/StabilityMenu";
import StabilityTransversePage from "./pages/StabilityTransverse";

const queryClient = new QueryClient();

const App = () => {
  const { isNative, keyboardVisible } = useAndroidFeatures();
  
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <ThemeProvider defaultTheme="dark" storageKey="maritime-ui-theme-v2">
            <LanguageProvider>
              <Toaster />
              <div className={`min-h-screen bg-background text-foreground ${keyboardVisible ? 'pb-16' : ''} ${isNative ? 'safe-area' : ''}`}>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/celestial" element={<CelestialCalculations />} />
                    <Route path="/calculations" element={<CalculationsMenu />} />
                    <Route path="/stability" element={<StabilityMenu />} />
                    <Route path="/stability/transverse" element={<StabilityTransversePage />} />
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