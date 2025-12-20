import React from "react";
import { CalculationGridScreen, type CalculationGridItem } from "@/components/ui/calculation-grid";
import { Ruler } from "lucide-react";

export default function TankMenu() {
  const items: CalculationGridItem[] = [
    { to: "/tank", icon: Ruler, title: "Tank Hacmi" },
    { to: "/tank", icon: Ruler, title: "Kalibrasyon" },
  ];

  return (
    <CalculationGridScreen
      title="Tank Hesaplamaları"
      subtitle="Kapalı ve açık tank çözümlerine tek noktadan erişin"
      items={items}
    />
  );
}
