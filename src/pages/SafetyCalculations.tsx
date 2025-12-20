import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { SafetyCalculations } from "@/components/calculations/SafetyCalculations";

const SafetyCalculationsPage = () => {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Güvenlik"
        title="Güvenlik Hesaplamaları"
        subtitle="Can salı, yangın sistemi ve acil durum hesaplamalarınızı yapın"
      >
        <SafetyCalculations />
      </CalculationGridScreen>
    </MobileLayout>
  );
};

export default SafetyCalculationsPage;
