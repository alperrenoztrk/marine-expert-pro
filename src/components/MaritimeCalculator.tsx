import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Ship, Waves, Settings, Package, Droplets, Building, AlertTriangle, Wheat, Compass } from "lucide-react";

// Import ALL calculation components
import { StabilityCalculations } from "./calculations/StabilityCalculations";
import { TrimCalculations } from "./calculations/TrimCalculations";
import { CargoCalculations } from "./calculations/CargoCalculations";
import { BallastCalculations } from "./calculations/BallastCalculations";
import { StructuralCalculations } from "./calculations/StructuralCalculations";
import { NavigationCalculations } from "./calculations/NavigationCalculations";
import { HydrodynamicsCalculations } from "./calculations/HydrodynamicsCalculations";
import { EngineCalculations } from "./calculations/EngineCalculations";
import { SafetyCalculations } from "./calculations/SafetyCalculations";
import { EmissionCalculations } from "./calculations/EmissionCalculations";
import { WeatherCalculations } from "./calculations/WeatherCalculations";
import { SpecialShipCalculations } from "./calculations/SpecialShipCalculations";

export const MaritimeCalculator = () => {
  const [activeModule, setActiveModule] = useState("stability");

  return (
    <div className="w-full space-y-4 md:space-y-6">
      <div className="text-center space-y-2 md:space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Ship className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Maritime Calculator</h1>
          <Waves className="w-5 h-5 md:w-6 md:h-6 text-accent" />
        </div>
        <p className="text-xs md:text-sm text-muted-foreground px-4">
          Tam özellikli maritime mühendisliği hesaplama sistemi - 13 aktif modül
        </p>
      </div>

      <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-8 h-auto p-1 gap-1">
          <TabsTrigger value="stability" className="text-xs flex-col gap-1 p-2">
            <Calculator className="w-3 h-3" />
            <span>Stabilite</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="text-xs flex-col gap-1 p-2">
            <Compass className="w-3 h-3" />
            <span>Seyir</span>
          </TabsTrigger>
          <TabsTrigger value="hydrodynamics" className="text-xs flex-col gap-1 p-2">
            <Waves className="w-3 h-3" />
            <span>Hidrodinamik</span>
          </TabsTrigger>
          <TabsTrigger value="engine" className="text-xs flex-col gap-1 p-2">
            <Settings className="w-3 h-3" />
            <span>Makine</span>
          </TabsTrigger>
          <TabsTrigger value="cargo" className="text-xs flex-col gap-1 p-2">
            <Package className="w-3 h-3" />
            <span>Kargo</span>
          </TabsTrigger>
          <TabsTrigger value="ballast" className="text-xs flex-col gap-1 p-2">
            <Droplets className="w-3 h-3" />
            <span>Balast</span>
          </TabsTrigger>
          <TabsTrigger value="trim" className="text-xs flex-col gap-1 p-2">
            <Building className="w-3 h-3" />
            <span>Trim</span>
          </TabsTrigger>
          <TabsTrigger value="structural" className="text-xs flex-col gap-1 p-2">
            <Building className="w-3 h-3" />
            <span>Yapısal</span>
          </TabsTrigger>
          <TabsTrigger value="safety" className="text-xs flex-col gap-1 p-2">
            <AlertTriangle className="w-3 h-3" />
            <span>Güvenlik</span>
          </TabsTrigger>
          <TabsTrigger value="emission" className="text-xs flex-col gap-1 p-2">
            <Wheat className="w-3 h-3" />
            <span>Emisyon</span>
          </TabsTrigger>
          <TabsTrigger value="weather" className="text-xs flex-col gap-1 p-2">
            <Waves className="w-3 h-3" />
            <span>Hava</span>
          </TabsTrigger>
          <TabsTrigger value="special" className="text-xs flex-col gap-1 p-2">
            <Ship className="w-3 h-3" />
            <span>Özel</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stability" className="mt-4">
          <StabilityCalculations />
        </TabsContent>
        
        <TabsContent value="navigation" className="mt-4">
          <NavigationCalculations />
        </TabsContent>
        
        <TabsContent value="hydrodynamics" className="mt-4">
          <HydrodynamicsCalculations />
        </TabsContent>
        
        <TabsContent value="engine" className="mt-4">
          <EngineCalculations />
        </TabsContent>
        
        <TabsContent value="cargo" className="mt-4">
          <CargoCalculations />
        </TabsContent>
        
        <TabsContent value="ballast" className="mt-4">
          <BallastCalculations />
        </TabsContent>
        
        <TabsContent value="trim" className="mt-4">
          <TrimCalculations />
        </TabsContent>
        
        <TabsContent value="structural" className="mt-4">
          <StructuralCalculations />
        </TabsContent>
        
        <TabsContent value="safety" className="mt-4">
          <SafetyCalculations />
        </TabsContent>
        
        <TabsContent value="emission" className="mt-4">
          <EmissionCalculations />
        </TabsContent>
        
        <TabsContent value="weather" className="mt-4">
          <WeatherCalculations />
        </TabsContent>
        
        <TabsContent value="special" className="mt-4">
          <SpecialShipCalculations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaritimeCalculator;