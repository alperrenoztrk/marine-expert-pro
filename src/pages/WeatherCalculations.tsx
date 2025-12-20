import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { WeatherCalculations as WeatherCalcs } from "@/components/calculations/WeatherCalculations";

const WeatherCalculationsPage = () => {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Meteoroloji"
        title="Meteoroloji Hesaplamaları"
        subtitle="Beaufort & Douglas skalaları, rüzgar/akıntı etkileri ve kuvvet analizi"
        backHref="/weather"
      >
        <WeatherCalcs />
      </CalculationGridScreen>
    </MobileLayout>
  );
};

export default WeatherCalculationsPage;
