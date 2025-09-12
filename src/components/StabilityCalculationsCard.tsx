import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ship, ChevronDown, ChevronUp, Calculator, BarChart3, Droplets, Building } from "lucide-react";

// Import all calculation components
import { TrimListCalculations } from "./calculations/TrimListCalculations";
import { BallastCalculations } from "./calculations/BallastCalculations";
import { StructuralCalculations } from "./calculations/StructuralCalculations";

export const StabilityCalculationsCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full cursor-pointer transition-all duration-200 hover:shadow-lg dark:shadow-gray-900/50">
      <div onClick={() => setIsExpanded(!isExpanded)}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Ship className="w-6 h-6 text-primary" />
            Trim ve List
          </CardTitle>
          <CardDescription>
            Trim açısı, MCT, list hesaplamaları
          </CardDescription>
          <div className="flex justify-center mt-2">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
      </div>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <Tabs defaultValue="stability" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="stability" className="flex items-center gap-1">
                <Ship className="w-3 h-3" />
                <span className="hidden sm:inline">Trim & List</span>
              </TabsTrigger>
              <TabsTrigger value="ballast" className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span className="hidden sm:inline">Balast</span>
              </TabsTrigger>
              <TabsTrigger value="structural" className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                <span className="hidden sm:inline">Yapısal</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stability">
              <TrimListCalculations />
            </TabsContent>
            
            
            <TabsContent value="ballast">
              <BallastCalculations />
            </TabsContent>
            
            <TabsContent value="structural">
              <StructuralCalculations />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};