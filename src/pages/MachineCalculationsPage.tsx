import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { EngineCalculations } from "@/components/calculations/EngineCalculations";
import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const onboardMachines = [
  {
    name: "Ana Makine (Sevk Sistemi)",
    detail: "Ana dizel makine, buhar/gaz türbini veya diesel-electric tahrik",
  },
  {
    name: "Yardımcı Makineler",
    detail: "Yardımcı dizel ve acil jeneratörler, ana şafttan tahrikli jeneratör",
  },
  {
    name: "Elektrik & Güç Sistemleri",
    detail: "Ana/acil switchboard, UPS, trafolar ve batarya grupları",
  },
  {
    name: "Yakıt & Yağ Sistemleri",
    detail: "Fuel/Lube oil separatörleri, günlük tanklar, transfer ve besleme pompaları",
  },
  {
    name: "Pompalar",
    detail: "Sintine, balast, yangın, soğutma suyu ve tatlı/deniz suyu pompaları",
  },
  {
    name: "Soğutma & HVAC",
    detail: "Merkezi soğutma devresi, HVAC, soğuk hava depoları ve reefer sistemleri",
  },
  {
    name: "Kazanlar (Boiler)",
    detail: "Auxiliary boiler ve EGB; ısıtma, yakıt viskozitesi ve buhar ihtiyacı",
  },
  {
    name: "Emniyet & Kontrol Sistemleri",
    detail: "Yangın algılama/CO₂, ECR operasyonu, alarm ve izleme sistemleri",
  },
  {
    name: "Güverte Makineleri",
    detail: "Irgat, mooring winch, kreyn, capstan ve Ro-Ro rampaları",
  },
];

export default function MachineCalculationsPage() {
  const [showMachines, setShowMachines] = useState(false);

  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Makine"
        title="Makine Hesaplamaları"
        subtitle="Motor gücü, yakıt tüketimi ve performans hesaplamalarınızı yapın"
      >
        <Card className="border-blue-100/70 bg-gradient-to-br from-blue-50 via-white to-slate-50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg text-[#2F5BFF]">
                <Wrench className="h-5 w-5" />
                Gemideki Makineler
              </CardTitle>
              <Button variant="outline" onClick={() => setShowMachines((prev) => !prev)}>
                {showMachines ? "Listeyi Gizle" : "Tüm Makineleri Göster"}
              </Button>
            </div>
          </CardHeader>
          {showMachines && (
            <CardContent className="pt-0">
              <div className="grid gap-3 md:grid-cols-2">
                {onboardMachines.map((machine) => (
                  <div
                    key={machine.name}
                    className="rounded-xl border border-blue-100 bg-white/80 px-4 py-3 shadow-[0_8px_24px_rgba(47,91,255,0.08)]"
                  >
                    <p className="text-sm font-semibold text-slate-900">{machine.name}</p>
                    <p className="text-xs text-slate-600">{machine.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="bg-white/90 border-white/60 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-[#2F5BFF]">
              <Wrench className="h-6 w-6" />
              Makine Hesaplama Modülü
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EngineCalculations />
          </CardContent>
        </Card>
      </CalculationGridScreen>
    </MobileLayout>
  );
}
