import { CalculationGridScreen, type CalculationGridItem } from "@/components/ui/calculation-grid";
import {
  Anchor,
  Beaker,
  BookOpen,
  Clock3,
  Compass,
  Earth,
  Lighthouse,
  Navigation,
  Radar,
  Ship,
  ThermometerSun,
  Waves,
  Wind,
} from "lucide-react";

const navigationCalculationItems: CalculationGridItem[] = [
  { id: "gc", title: "Büyük Daire (Great Circle)", icon: Compass, to: "/navigation/calc/gc" },
  { id: "rhumb", title: "Rhumb Line (Mercator)", icon: Navigation, to: "/navigation/calc/rhumb" },
  { id: "plane", title: "Plane Sailing", icon: Anchor, to: "/navigation/calc/plane" },
  { id: "eta", title: "Zaman ve ETA", icon: Clock3, to: "/navigation/calc/eta" },
  { id: "current", title: "Akıntı Üçgeni (CTS)", icon: Waves, to: "/navigation/calc/current" },
  { id: "compass", title: "Pusula Dönüşümleri", icon: Ship, to: "/navigation/calc/compass" },
  { id: "cpa", title: "CPA / TCPA", icon: Radar, to: "/navigation/calc/cpa" },
  { id: "sight", title: "Sight Reduction", icon: Lighthouse, to: "/navigation/calc/sight" },
  { id: "bearings", title: "Kerteriz Hesaplamaları", icon: Beaker, to: "/navigation/calc/bearings" },
  { id: "distance", title: "Mesafe Hesaplamaları", icon: Earth, to: "/navigation/calc/distance" },
  { id: "tides", title: "Gelgit Hesaplamaları", icon: Waves, to: "/navigation/calc/tides" },
  { id: "turning", title: "Dönüş Hesaplamaları", icon: BookOpen, to: "/navigation/calc/turning" },
  { id: "weather", title: "Hava Durumu", icon: ThermometerSun, to: "/navigation/calc/weather" },
  { id: "celestial", title: "Göksel Navigasyon", icon: Wind, to: "/navigation/calc/celestial" },
  { id: "emergency", title: "Acil Durum", icon: Lighthouse, to: "/navigation/calc/emergency" },
];

export default function Navigation() {
  return (
    <CalculationGridScreen
      eyebrow="Seyir"
      title="Seyir Hesaplamaları"
      subtitle="Rota, konum, zaman ve seyir planlama hesaplarına tek menüden ulaşın"
      backHref="/navigation-menu"
      items={navigationCalculationItems}
    />
  );
}
