import { Waves } from "lucide-react";
import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";
import { CalculationLayout } from "@/components/layout/CalculationLayout";
import yacht from "@/assets/maritime/yacht-clear-water.jpg";

export default function StabilityFreeSurfacePage(){
  return (
    <CalculationLayout
      title="Serbest Yüzey Etkisi"
      description="Tanklardaki serbest yüzeyin GM ve stabiliteye etkisi"
      icon={Waves}
      hero={{
        title: "Stabilite",
        description: "Serbest yüzey hesaplamaları ve açıklamalar",
        imageSrc: yacht,
        imageAlt: "Yacht in clear water",
      }}
      maxWidthClassName="max-w-6xl"
      below={
        <div className="mt-2">
          <StabilityAssistantPopup />
        </div>
      }
    >
      {/* Free surface calculation lives under stability section, in the extended block */}
      <HydrostaticsStabilityCalculations singleMode section="stability" />
    </CalculationLayout>
  );
}

