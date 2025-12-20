import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { EngineCalculations } from "@/components/calculations/EngineCalculations";
import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { Card } from "@/components/ui/card";

export default function MachineCalculationsPage() {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Makine"
        title="Makine Hesaplamaları"
        subtitle="Motor gücü, yakıt tüketimi ve performans hesaplamalarınızı yapın"
      >
        <Card className="bg-white/90 border-white/60 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-[#2F5BFF]">
              <Wrench className="h-6 w-6" />
              Makine Hesaplama Modülü
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EngineCalculations />
          </CardContent>
        </Card>
      </CalculationGridScreen>
    </MobileLayout>
  );
}
