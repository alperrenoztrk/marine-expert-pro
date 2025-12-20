import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGrid, CalculationGridScreen, type CalculationGridItem } from "@/components/ui/calculation-grid";
import { Button } from "@/components/ui/button";
import { Anchor, ClipboardList, Droplets, Fuel, Gauge, Package, Scale, Ship, Sigma } from "lucide-react";
import { Link } from "react-router-dom";

const cargoItems: CalculationGridItem[] = [
  { id: "draft", title: "Draft Survey Hızlı", icon: Scale, to: "/cargo/calculations/draft-survey" },
  { id: "preloading", title: "Yükleme Öncesi Hazırlık", icon: ClipboardList, to: "/cargo/calculations/preloading" },
  { id: "intermediate", title: "Orta Safha Takibi", icon: Gauge, to: "/cargo/calculations/intermediate" },
  { id: "postdischarge", title: "Boşaltma Sonrası Kontrol", icon: Package, to: "/cargo/calculations/postdischarge" },
  { id: "comparative", title: "Draft Survey Karşılaştırma", icon: Ship, to: "/cargo/calculations/comparative" },
  { id: "ballast", title: "Balast & Trim Denge", icon: Anchor, to: "/cargo/calculations/ballast" },
  { id: "density", title: "Yoğunluk Düzeltmesi", icon: Droplets, to: "/cargo/calculations/density" },
  { id: "bunker", title: "Bunker ve Yakıt Farkı", icon: Fuel, to: "/cargo/calculations/bunker" },
];

export default function CargoCalculationsPage() {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Kargo & Operasyon"
        title="Kargo & Operasyon Araçları"
        subtitle="Draft survey, balast ve operasyonel yük hesaplarını aynı temada toplayın"
      >
        <div className="space-y-6">
          <div className="flex justify-end">
            <Link to="/cargo/formulas">
              <Button variant="secondary" size="sm" className="gap-2">
                <Sigma className="h-4 w-4" />
                Formüller
              </Button>
            </Link>
          </div>

          <CalculationGrid items={cargoItems} className="sm:grid-cols-2" />

          <p className="text-center text-sm text-slate-300" data-no-translate>
            Her hesaplama ayrı bir sayfada açılır
          </p>
        </div>
      </CalculationGridScreen>
    </MobileLayout>
  );
}
