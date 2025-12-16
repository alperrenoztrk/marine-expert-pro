import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityGMPage(){
  return (
    <div className="container mx-auto p-6 space-y-4">
<HydrostaticsStabilityCalculations singleMode section="stability" calc="gm" />
      
      {/* Stabilite Asistanı */}
      <div className="mt-6">
        <StabilityAssistantPopup />
      </div>
    </div>
  );
}