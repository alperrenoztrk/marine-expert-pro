import { MobileLayout } from "@/components/MobileLayout";
import { WeatherCalculations as WeatherCalcs } from "@/components/calculations/WeatherCalculations";
import { Button } from "@/components/ui/button";
import { CalculationGrid, CalculationGridScreen, type CalculationGridItem } from "@/components/ui/calculation-grid";
import { Compass, Droplets, Navigation, Sigma, Waves, Wind, Cloud } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const meteorologyItems: CalculationGridItem[] = [
  { id: "overview", title: "Meteoroloji Paneli", icon: Navigation, to: "/weather/calculations" },
  { id: "wind", title: "Rüzgar & Beaufort", icon: Wind, to: "/weather/calculations/wind" },
  { id: "waves", title: "Dalga & Douglas", icon: Waves, to: "/weather/calculations/waves" },
  { id: "current", title: "Akıntı ve Set/Drift", icon: Droplets, to: "/weather/calculations/current" },
  { id: "ship", title: "Gemi Tepkisi", icon: Compass, to: "/weather/calculations/ship" },
  { id: "environment", title: "Çevresel Etkiler", icon: Navigation, to: "/weather/calculations/environment" },
  { id: "clouds", title: "Bulut Tanıma", icon: Cloud, to: "/weather/calculations/clouds" },
];

const validTabs = new Set(meteorologyItems.map((item) => item.id).filter((id) => id !== "overview"));

const tabTitles: Record<string, string> = {
  wind: "Rüzgar ve Beaufort Analizi",
  waves: "Dalga ve Douglas Skalası",
  current: "Akıntı, Set ve Drift",
  ship: "Gemi Tepkisi ve Stabilite",
  environment: "Çevresel Etkiler ve Güvenlik",
  clouds: "Bulut Tanıma ve Hava Tahmini",
};

export function WeatherCalculationDetailPage() {
  const { tab } = useParams<{ tab?: string }>();
  const initialTab = tab && validTabs.has(tab) ? tab : "wind";
  const activeTitle = tab && tabTitles[tab] ? tabTitles[tab] : "Meteoroloji Hesaplamaları";

  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Meteoroloji"
        title={activeTitle}
        subtitle="Beaufort & Douglas skalaları, rüzgar/akıntı etkileri ve kuvvet analizi"
      >
        <WeatherCalcs initialTab={initialTab} />
      </CalculationGridScreen>
    </MobileLayout>
  );
}

const WeatherCalculationsPage = () => {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Meteoroloji"
        title="Meteoroloji Hesaplamaları"
        subtitle="Rüzgar, dalga, akıntı ve çevresel etkileri aynı temada toplayın"
      >
        <div className="space-y-6">
          <div className="flex justify-end">
            <Link to="/meteorology/formulas">
              <Button variant="secondary" size="sm" className="gap-2">
                <Sigma className="h-4 w-4" />
                Formüller
              </Button>
            </Link>
          </div>

          <CalculationGrid items={meteorologyItems} className="sm:grid-cols-2" />

          <p className="text-center text-sm text-slate-300" data-no-translate>
            Her hesaplama ayrı bir sayfada açılır
          </p>
        </div>
      </CalculationGridScreen>
    </MobileLayout>
  );
};

export default WeatherCalculationsPage;
