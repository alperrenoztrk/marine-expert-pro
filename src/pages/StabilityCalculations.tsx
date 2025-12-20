import { MobileLayout } from "@/components/MobileLayout";
import { StabilityCalculations } from "@/components/calculations/StabilityCalculations";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";

export default function StabilityCalculationsPage() {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Stabilite"
        title="Stabilite Hesaplamaları"
        subtitle="Gemi stabilitesiyle ilgili tüm hesaplara tek şablondan erişin"
        backHref="/stability"
      >
        <StabilityCalculations />
      </CalculationGridScreen>
    </MobileLayout>
  );
}
