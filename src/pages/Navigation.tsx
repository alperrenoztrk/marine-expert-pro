import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGrid, CalculationGridScreen, type CalculationGridItem } from "@/components/ui/calculation-grid";
import { Button } from "@/components/ui/button";
import { Compass, Globe2, Map, Navigation as NavigationIcon, Radar, Route, Sigma, Waves, Wind } from "lucide-react";
import { Link } from "react-router-dom";

const navigationItems: CalculationGridItem[] = [
  { id: "gc", title: "Büyük Daire (Great Circle)", icon: Globe2, to: "/navigation/calc/gc" },
  { id: "rhumb", title: "Rhumb Line (Mercator)", icon: Map, to: "/navigation/calc/rhumb" },
  { id: "plane", title: "Plane Sailing", icon: Route, to: "/navigation/calc/plane" },
  { id: "eta", title: "Zaman ve ETA", icon: Compass, to: "/navigation/calc/eta" },
  { id: "current", title: "Akıntı Üçgeni (CTS)", icon: Waves, to: "/navigation/calc/current" },
  { id: "compass", title: "Pusula Dönüşümleri", icon: NavigationIcon, to: "/navigation/calc/compass" },
  { id: "cpa", title: "CPA / TCPA", icon: Radar, to: "/navigation/calc/cpa" },
  { id: "sight", title: "Sight Reduction", icon: Globe2, to: "/navigation/calc/sight" },
  { id: "bearings", title: "Kerteriz Hesaplamaları", icon: NavigationIcon, to: "/navigation/calc/bearings" },
  { id: "distance", title: "Mesafe Hesaplamaları", icon: Route, to: "/navigation/calc/distance" },
  { id: "tides", title: "Gelgit Hesaplamaları", icon: Waves, to: "/navigation/calc/tides" },
  { id: "turning", title: "Dönüş Hesaplamaları", icon: Route, to: "/navigation/calc/turning" },
  { id: "weather", title: "Hava Durumu", icon: Wind, to: "/navigation/calc/weather" },
  { id: "celestial", title: "Göksel Navigasyon", icon: Globe2, to: "/navigation/calc/celestial" },
  { id: "emergency", title: "Acil Durum", icon: Compass, to: "/navigation/calc/emergency" },
];

const Navigation = () => {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Seyir"
        title="Seyir Hesaplamaları"
        subtitle="Mesafe, hız, rota, konum ve zaman hesaplamalarınızı tek panelden yapın"
      >
        <div className="space-y-6">
          <div className="flex justify-end">
            <Link to="/navigation/formulas">
              <Button variant="secondary" size="sm" className="gap-2">
                <Sigma className="h-4 w-4" />
                Formüller
              </Button>
            </Link>
          </div>

          <CalculationGrid items={navigationItems} className="sm:grid-cols-2" />

          <p className="text-center text-sm text-slate-300" data-no-translate>
            Her hesaplama ayrı bir sayfada açılır
          </p>
        </div>
      </CalculationGridScreen>
    </MobileLayout>
  );
};

export default Navigation;