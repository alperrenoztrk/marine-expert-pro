import { MobileLayout } from "@/components/MobileLayout";
import { StructuralCalculations } from "@/components/calculations/StructuralCalculations";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";

export default function StabilityShearingBendingPage() {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Stabilite"
        title="Shear Force & Bending Moment"
        subtitle="Boyuna yük dağılımını analiz edin ve kesme kuvveti ile eğilme momenti diyagramlarını oluşturun"
      >
        <StructuralCalculations initialTab="diagrams" />
      </CalculationGridScreen>
    </MobileLayout>
  );
}
