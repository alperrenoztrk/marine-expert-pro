import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";

export default function StabilityStabilityPage(){
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="ghost" size="sm" className="gap-2" onClick={()=> navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>
      <HydrostaticsStabilityCalculations singleMode section="stability" />
    </div>
  );
}