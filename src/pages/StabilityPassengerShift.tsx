import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityPassengerShiftPage(){
  return (
    <div className="container mx-auto p-6 space-y-4">
{/* Passenger/crew shift equivalent to list (weight shift) */}
      <HydrostaticsStabilityCalculations singleMode section="trimlist" calc="list" />
      
      {/* Stabilite Asistanı */}
      <div className="mt-6">
        <StabilityAssistantPopup />
      </div>
    </div>
  );
}

