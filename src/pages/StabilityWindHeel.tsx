import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityWindHeelPage(){
  return (
    <div className="container mx-auto p-6 space-y-4">
{/* Wind effect is in the extended stability section */}
      <HydrostaticsStabilityCalculations singleMode section="stability" />
      
      {/* Stabilite Asistanı */}
      <div className="mt-6">
        <StabilityAssistantPopup />
      </div>
    </div>
  );
}

