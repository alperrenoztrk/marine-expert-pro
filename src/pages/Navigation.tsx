import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGrid, CalculationGridScreen, type CalculationGridItem } from "@/components/ui/calculation-grid";
import { Button } from "@/components/ui/button";
import { Compass, Globe2, Map, Navigation as NavigationIcon, Radar, Route, Sigma, Waves, Wind, MapPinned, Shield, Sun, Monitor } from "lucide-react";
import { Link } from "react-router-dom";

const navigationItems: CalculationGridItem[] = [
  { id: "gc", title: "Büyük Daire (Great Circle)", icon: Globe2, to: "/navigation/great-circle" },
  { id: "rhumb", title: "Rhumb Line (Mercator)", icon: Map, to: "/navigation/calc/rhumb" },
  { id: "plane", title: "Plane Sailing", icon: Route, to: "/navigation/calc/plane" },
  { id: "eta", title: "Temel Seyir (Zaman–Mesafe–Hız)", icon: Compass, to: "/navigation/calc/eta" },
  { id: "current", title: "Akıntı Üçgeni (CTS)", icon: Waves, to: "/navigation/calc/current" },
  { id: "compass", title: "Pusula Dönüşümleri", icon: NavigationIcon, to: "/navigation/calc/compass" },
  { id: "cpa", title: "CPA / TCPA", icon: Radar, to: "/navigation/calc/cpa" },
  { id: "radar", title: "Radar Plot (Hedef Rota/Hız)", icon: Radar, to: "/navigation/calc/radar" },
  { id: "colreg", title: "COLREG Durum & Manevra", icon: Shield, to: "/navigation/calc/colreg" },
  { id: "sight", title: "Sight Reduction", icon: Globe2, to: "/navigation/calc/sight" },
  { id: "astro", title: "Astronomik Seyir (Almanac + LOP)", icon: Sun, to: "/navigation/calc/astro" },
  { id: "bearings", title: "Kerteriz Hesaplamaları", icon: NavigationIcon, to: "/navigation/calc/bearings" },
  { id: "fix", title: "Fixing Position (2/3 Kerteriz, Running, Mesafe)", icon: MapPinned, to: "/navigation/calc/fix" },
  { id: "position", title: "DR / Enlem-Boylam", icon: MapPinned, to: "/navigation/calc/position" },
  { id: "midlat", title: "Middle Latitude Sailing", icon: Route, to: "/navigation/calc/midlat" },
  { id: "chart", title: "Chart Ölçeği (cm ↔ NM)", icon: Map, to: "/navigation/calc/chart" },
  { id: "distance", title: "Mesafe Hesaplamaları", icon: Route, to: "/navigation/calc/distance" },
  { id: "tides", title: "Gelgit + UKC", icon: Waves, to: "/navigation/calc/tides" },
  { id: "tide-trainer", title: "Gelgit Hesabı Eğitimi (Trainer)", icon: Waves, to: "/navigation/tide-trainer" },
  { id: "safety", title: "Seyir Emniyeti (Squat/UKC)", icon: Shield, to: "/navigation/calc/safety" },
  { id: "passage", title: "Passage Plan (Leg ETA)", icon: Route, to: "/navigation/calc/passage" },
  { id: "ecdis", title: "ECDIS (XTD / Look-ahead)", icon: Monitor, to: "/navigation/calc/ecdis" },
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