import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityTurningHeelPage(){
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/stability');
  };
  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>
      {/* Use stability section as the turning heel will rely on GZ and heeling moments */}
      <HydrostaticsStabilityCalculations singleMode section="stability" />
      
      {/* Stabilite Asistanı */}
      <div className="mt-6">
        <StabilityAssistantPopup />
      </div>
    </div>
  );
}

