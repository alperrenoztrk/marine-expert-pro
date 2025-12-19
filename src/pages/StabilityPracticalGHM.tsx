import { MobileLayout } from "@/components/MobileLayout";
import { Wrench, BarChart3 } from "lucide-react";
import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";

export default function StabilityPracticalGHMPage() {
  return (
    <MobileLayout>
      <div className="space-y-4">

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Wrench className="h-5 w-5" />
            <h1 className="text-xl font-bold">GHM Hesaplama</h1>
          </div>
          <HydrostaticsStabilityCalculations singleMode section="practical" practicalCalc="ghm" />
        </div>
      </div>
    </MobileLayout>
  );
}
