import React from "react";
import { CalculationGridScreen, type CalculationGridItem } from "@/components/ui/calculation-grid";
import { Shield, FileText, Ship, AlertTriangle } from "lucide-react";

export default function SOLASMenu() {
  const items: CalculationGridItem[] = [
    { to: "/solas/regulations", icon: FileText, title: "SOLAS Düzenlemeleri" },
    { to: "/solas/certificates", icon: Shield, title: "Sertifikalar" },
    { to: "/solas/ship-requirements", icon: Ship, title: "Gemi Gereksinimleri" },
    { to: "/solas/safety-equipment", icon: AlertTriangle, title: "Güvenlik Ekipmanları" },
  ];

  return (
    <CalculationGridScreen
      eyebrow="Güvenlik"
      title="SOLAS"
      subtitle="Safety of Life at Sea"
      items={items}
    />
  );
}
