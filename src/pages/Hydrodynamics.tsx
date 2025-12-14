import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves } from "lucide-react";
import oceanWaves from "@/assets/maritime/ocean-waves.jpg";
import { HydrodynamicsCalculations } from "@/components/calculations/HydrodynamicsCalculations";
import { CalculationLayout } from "@/components/layout/CalculationLayout";
import { CalculationCard } from "@/components/ui/calculation-card";

const Hydrodynamics = () => {
  return (
    <CalculationLayout
      title="Hidrodinamik Hesaplamalar"
      description="Direnç, güç, itme ve dalga yük hesaplamalarınızı yapın"
      icon={Waves}
      hero={{
        title: "Hidrodinamik Hesaplamalar",
        description: "Gemi direnci, itme gücü ve dalga etkileşimleri",
        imageSrc: oceanWaves,
        imageAlt: "Ocean Waves",
      }}
      below={
        <div className="text-center text-sm text-muted-foreground">
          Su direnci, gemi güç gereksinimleri, dalga analizleri ve daha fazlası
        </div>
      }
    >
      <CalculationCard>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Waves className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            Hidrodinamik Hesaplama Modülü
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HydrodynamicsCalculations />
        </CardContent>
      </CalculationCard>
    </CalculationLayout>
  );
};

export default Hydrodynamics;