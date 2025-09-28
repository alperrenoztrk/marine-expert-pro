import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Calculator } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/BackButton";
import { EmissionCalculations } from "@/components/calculations/EmissionCalculations";
import { DiagramViewer } from "@/components/ui/diagram-viewer";

const EmissionCalculationsPage = () => {
  return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <BackButton />
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Leaf className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              Emisyon Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            CO2, NOx, SOx emisyon hesaplamaları ve çevre uyumu değerlendirmesi
          </p>
        </div>

        {/* Emission Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Leaf className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Emisyon Hesaplama Modülü
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmissionCalculations />
              </CardContent>
            </Card>
          </div>

          {/* Formüller Kutucuğu */}
          <div className="lg:col-span-1">
            <Card className="h-fit sticky top-4 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Formüller
                </CardTitle>
                <CardDescription>
                  Emisyon hesaplama formülleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-red-700 mb-2">💨 NOx Emisyonu</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>NOx Tier III:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">NOx ≤ 3.4 g/kWh</p>
                      <p><strong>NOx Hesabı:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">NOx = EF × FC × CF</p>
                      <p><strong>SCR Verimliliği:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">η_SCR = (NOx_in - NOx_out) / NOx_in</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-orange-700 mb-2">🟫 SOx Emisyonu</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>SOx Hesabı:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">SOx = FC × S% × 2</p>
                      <p><strong>EGCS Verimliliği:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">η_EGCS ≥ 98%</p>
                      <p><strong>Kükürt Limiti:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">S_fuel ≤ 0.50% m/m</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-2">🌍 CO₂ Emisyonu</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>CO₂ Hesabı:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">CO₂ = FC × CF × 44/12</p>
                      <p><strong>EEOI:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">EEOI = CO₂ / (Cargo × Distance)</p>
                      <p><strong>CII Rating:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">CII = CO₂ / (DWT × Distance)</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-purple-700 mb-2">🔢 MARPOL Annex VI</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>ECA SOx Limit:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">S_ECA ≤ 0.10% m/m</p>
                      <p><strong>PM Emisyonu:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">PM = FC × EF_PM</p>
                      <p><strong>ECA NOx Limit:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">NOx_ECA ≤ 2.0 g/kWh</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 cyberpunk:bg-gray-800 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Semboller:</strong><br/>
                      EF: emisyon faktörü, FC: yakıt tüketimi<br/>
                      CF: karbon faktörü, S%: kükürt oranı<br/>
                      EEOI: enerji verimliliği, CII: karbon yoğunluğu
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Diagram Section */}
        <DiagramViewer
          title="Emisyon Kontrol Sistemi Diyagramı"
          description="AI destekli emisyon kontrolü - SCR, EGCS ve MARPOL uyumluluk akışı"
          data={{
            enginePower: 8500,
            fuelSulfur: 0.5,
            noxTier: 'III',
            scrubberType: 'open-loop'
          }}
          diagramType="emission"
          className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm"
        />

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Çevreci gemi operasyonları, emisyon kontrolü ve sürdürülebilirlik analizi
        </div>
      </div>
    </div>
  );
};

export default EmissionCalculationsPage;