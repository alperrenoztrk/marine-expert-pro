import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves } from "lucide-react";
import BackButton from "@/components/BackButton";
import { CalculationHero } from "@/components/ui/calculation-hero";
import oceanWaves from "@/assets/maritime/ocean-waves.jpg";
import { HydrodynamicsCalculations } from "@/components/calculations/HydrodynamicsCalculations";

const Hydrodynamics = () => {
  return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <BackButton />
        </div>

        {/* Hero Section */}
        <CalculationHero
          title="Hidrodinamik Hesaplamalar"
          description="Gemi direnci, itme gücü ve dalga etkileşimleri"
          imageSrc={oceanWaves}
          imageAlt="Ocean Waves"
        />

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Waves className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              Hidrodinamik Hesaplamalar
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Direnç, güç, itme ve dalga yük hesaplamalarınızı yapın
          </p>
        </div>

        {/* Hydrodynamics Calculations */}
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Waves className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Hidrodinamik Hesaplama Modülü
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HydrodynamicsCalculations />
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Su direnci, gemi güç gereksinimleri, dalga analizleri ve daha fazlası
        </div>
      </div>
    </div>
  );
};

export default Hydrodynamics;