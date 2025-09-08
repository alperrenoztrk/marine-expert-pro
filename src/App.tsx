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
                  <Route path="/safety-menu" element={<SafetyMenu />} />
                  <Route path="/navigation-menu" element={<NavigationMenu />} />
                  <Route path="/economics-menu" element={<EconomicsMenu />} />
                  <Route path="/tank-menu" element={<TankMenu />} />
                  <Route path="/cargo" element={<CargoMenu />} />
                  <Route path="/navigation" element={<Navigation />} />
                  <Route path="/economics" element={<Economics />} />
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