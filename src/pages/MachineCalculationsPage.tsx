import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { EngineCalculations } from "@/components/calculations/EngineCalculations";
import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { Card } from "@/components/ui/card";

export default function MachineCalculationsPage() {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Makine"
        title="Makine Hesaplamaları"
        subtitle="Motor gücü, yakıt tüketimi ve performans hesaplamalarınızı yapın"
      >
        <Card className="relative overflow-hidden rounded-[24px] border border-slate-800/70 bg-gradient-to-br from-slate-900/70 via-slate-950/80 to-slate-900/60 shadow-[0_18px_46px_rgba(47,91,255,0.18)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-12 left-6 h-32 w-32 rounded-full bg-sky-500/15 blur-3xl" />
            <div className="absolute top-16 right-10 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>

          <CardHeader className="relative z-10 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#5f7dff] via-[#3f66ff] to-[#2F5BFF] text-white shadow-[0_14px_30px_rgba(47,91,255,0.28)]">
                <Wrench className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold leading-tight text-slate-50">
                  Makine Hesaplama Modülü
                </CardTitle>
                <p className="text-sm text-slate-300">
                  Motor performansı, yakıt verimliliği ve emisyon analizi
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 rounded-[18px] bg-slate-950/40 p-4 text-slate-100 shadow-inner shadow-slate-950/30">
            <EngineCalculations />
          </CardContent>
        </Card>
      </CalculationGridScreen>
    </MobileLayout>
  );
}
