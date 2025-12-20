import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen, type CalculationGridItem } from "@/components/ui/calculation-grid";
import {
  Activity,
  Anchor,
  Beaker,
  Compass,
  Hourglass,
  Map,
  Navigation,
  Radar,
  ShipWheel,
  Sigma,
  Waves,
  Wind,
} from "lucide-react";
import { Link } from "react-router-dom";

const calculationMenuItems: CalculationGridItem[] = [
  { id: "gc", title: "Büyük Daire (Great Circle)", icon: Map, to: "/navigation/calc/gc" },
  { id: "rhumb", title: "Rhumb Line (Mercator)", icon: Compass, to: "/navigation/calc/rhumb" },
  { id: "plane", title: "Plane Sailing", icon: ShipWheel, to: "/navigation/calc/plane" },
  { id: "eta", title: "Zaman ve ETA", icon: Hourglass, to: "/navigation/calc/eta" },
  { id: "current", title: "Akıntı Üçgeni (CTS)", icon: Waves, to: "/navigation/calc/current" },
  { id: "compass", title: "Pusula Dönüşümleri", icon: Navigation, to: "/navigation/calc/compass" },
  { id: "cpa", title: "CPA / TCPA", icon: Radar, to: "/navigation/calc/cpa" },
  { id: "sight", title: "Sight Reduction", icon: Beaker, to: "/navigation/calc/sight" },
  { id: "bearings", title: "Kerteriz Hesaplamaları", icon: Anchor, to: "/navigation/calc/bearings" },
  { id: "distance", title: "Mesafe Hesaplamaları", icon: Activity, to: "/navigation/calc/distance" },
  { id: "tides", title: "Gelgit Hesaplamaları", icon: Waves, to: "/navigation/calc/tides" },
  { id: "turning", title: "Dönüş Hesaplamaları", icon: ShipWheel, to: "/navigation/calc/turning" },
  { id: "weather", title: "Hava Durumu", icon: Wind, to: "/navigation/calc/weather" },
  { id: "celestial", title: "Göksel Navigasyon", icon: Sigma, to: "/navigation/calc/celestial" },
  { id: "emergency", title: "Acil Durum", icon: Activity, to: "/navigation/calc/emergency" },
];

const Navigation = () => {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Seyir"
        title="Seyir Hesaplamaları"
        subtitle="Mesafe, hız, rota, konum ve zaman hesaplamalarınızı yapın"
        backHref="/navigation-menu"
        items={calculationMenuItems}
      >
        <div className="flex justify-center">
          <Link
            to="/navigation/formulas"
            className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#2F5BFF] shadow-sm ring-1 ring-inset ring-white/60 transition hover:-translate-y-0.5"
          >
            <Sigma className="h-4 w-4" />
            Formüller
          </Link>
        </div>
      </CalculationGridScreen>
    </MobileLayout>
  );
};

export default Navigation;