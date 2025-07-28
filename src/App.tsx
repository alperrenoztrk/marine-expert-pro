import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
