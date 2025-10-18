import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Wrench } from "lucide-react";
import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";

export default function StabilityPracticalPage() {
  return (
    <MobileLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/stability">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Stabilite
            </Button>
          </Link>
        </div>

        {/* Focused view: show only practical calculators block at bottom */}
        <div className="space-y-4">
          {/* Use the comprehensive page and allow scrolling to practical section */}
          <HydrostaticsStabilityCalculations singleMode section="hydrostatic" />
        </div>
      </div>
    </MobileLayout>
  );
}
