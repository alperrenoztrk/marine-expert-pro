import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { SpecialShipCalculations } from "@/components/calculations/SpecialShipCalculations";

const SpecialShipCalculationsPage = () => {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Özel Gemiler"
        title="Özel Gemi Hesaplamaları"
        subtitle="Tanker, konteyner, yolcu gemisi özel hesaplamalarını yapın"
        backHref="/special-ships"
      >
        <SpecialShipCalculations />
      </CalculationGridScreen>
    </MobileLayout>
  );
};

export default SpecialShipCalculationsPage;
