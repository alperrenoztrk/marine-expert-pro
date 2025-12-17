import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { EngineCalculations } from "@/components/calculations/EngineCalculations";
import { DiagramViewer } from "@/components/ui/diagram-viewer";
import shipBridge from "@/assets/maritime/ship-bridge.jpg";
import { CalculationLayout } from "@/components/layout/CalculationLayout";
import { CalculationCard } from "@/components/ui/calculation-card";
import { FormulaCard } from "@/components/ui/formula-card";

export default function MachineCalculationsPage() {
  return (
    <CalculationLayout
      title="Makine Hesaplamaları"
      description="Motor gücü, yakıt tüketimi ve performans hesaplamalarınızı yapın"
      icon={Wrench}
      hero={{
        title: "Makine Hesaplamaları",
        description: "Gemi makineleri ve güç sistemleri hesaplamaları",
        imageSrc: shipBridge,
        imageAlt: "Ship Bridge Control Panel",
      }}
      maxWidthClassName="max-w-6xl"
      rightRail={
        <FormulaCard
          description="Makine hesaplama formülleri"
          sections={[
            {
              title: "⚡ Güç Formülleri",
              accent: "blue",
              lines: [
                { label: "Fren Gücü", formula: "BHP = IHP × η_mech" },
                { label: "Şaft Gücü", formula: "SHP = BHP × η_trans" },
                { label: "Efektif Güç", formula: "EHP = SHP × η_prop" },
              ],
            },
            {
              title: "⛽ Yakıt Formülleri",
              accent: "green",
              lines: [
                { label: "SFOC Interpolasyon", formula: "SFOC = a × Load² + b × Load + c" },
                { label: "Yakıt Tüketimi", formula: "FC = Power × SFOC / 1000" },
                { label: "Günlük Tüketim", formula: "Daily = FC × 24" },
              ],
            },
            {
              title: "🌡️ Isı Transfer Formülleri",
              accent: "orange",
              lines: [
                { label: "Isı Değişim Alanı", formula: "A = Q / (U × LMTD)" },
                { label: "LMTD", formula: "LMTD = (ΔT₁ - ΔT₂) / ln(ΔT₁/ΔT₂)" },
                { label: "Isı Yükü", formula: "Q = m × cp × ΔT" },
              ],
            },
          ]}
          symbolsNote={
            <>
              <strong>Semboller:</strong>
              <br />
              P: güç, η: verimlilik, FC: yakıt tüketimi
              <br />
              Q: ısı, U: ısı transfer katsayısı, LMTD: log ort. sıc. farkı
            </>
          }
        />
      }
      below={
        <DiagramViewer
          title="Makine Sistemi Akış Diyagramı"
          description="AI destekli makine sistemi görselleştirmesi"
          data={{
            mcrPower: 8500,
            currentLoad: 75,
            fuelType: "HFO",
            seawaterInletTemp: 32,
          }}
          diagramType="engine"
          className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm"
        />
      }
    >
      <CalculationCard>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wrench className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            Makine Hesaplama Modülü
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EngineCalculations />
        </CardContent>
      </CalculationCard>
    </CalculationLayout>
  );
}
