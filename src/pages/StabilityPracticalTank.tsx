import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Wrench, Anchor } from "lucide-react";
import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";

export default function StabilityPracticalTankPage() {
  return (
    <MobileLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/stability/practical">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Pratik Hesaplamalar
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Wrench className="h-5 w-5" />
            <h1 className="text-xl font-bold">Duba/Tank Hacmi ve Kütle</h1>
          </div>
          <HydrostaticsStabilityCalculations singleMode section="practical" practicalCalc="tank" />
        </div>
      </div>
    </MobileLayout>
  );
}
