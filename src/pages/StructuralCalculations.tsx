import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { StructuralCalculations } from "@/components/calculations/StructuralCalculations";

const StructuralCalculationsPage = () => {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Yapısal"
        title="Yapısal Hesaplamalar"
        subtitle="Mukavemet, gerilme ve yapısal analiz hesaplamalarınızı yapın"
      >
        <StructuralCalculations />
      </CalculationGridScreen>
    </MobileLayout>
  );
};

export default StructuralCalculationsPage;
