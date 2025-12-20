import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { EmissionCalculations } from "@/components/calculations/EmissionCalculations";

const EmissionCalculationsPage = () => {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Emisyon"
        title="Emisyon Hesaplamaları"
        subtitle="CO2, NOx, SOx emisyon hesaplamaları ve çevre uyumu değerlendirmesi"
        backHref="/emissions"
      >
        <EmissionCalculations />
      </CalculationGridScreen>
    </MobileLayout>
  );
};

export default EmissionCalculationsPage;
