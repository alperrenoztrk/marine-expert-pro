import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Ship, Calculator } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { SpecialShipCalculations } from "@/components/calculations/SpecialShipCalculations";
import { DiagramViewer } from "@/components/ui/diagram-viewer";

const SpecialShipCalculationsPage = () => {
  return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-50 dark:hover:bg-gray-700 cyberpunk:hover:bg-gray-800 neon:hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Ana Sayfa</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Ship className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Özel Gemi Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tanker, konteyner, yolcu gemisi özel hesaplamalarını yapın
          </p>
        </div>

        {/* Special Ship Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Ship className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Özel Gemi Hesaplama Modülü
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpecialShipCalculations />
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
                  Özel gemi hesaplama formülleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-700 mb-2">🚢 Konteyner Gemisi</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>TEU Kapasitesi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">TEU = L × B × H / (6.1 × 2.44 × 2.59)</p>
                      <p><strong>Bay Sayısı:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Bays = (L - 2×E) / 6.1</p>
                      <p><strong>Stack Weight:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">W_stack = n × 30.48 tons</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-2">🛢️ Tanker Gemisi</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Kargo Kapasitesi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">DWT = Δ_loaded - Δ_light</p>
                      <p><strong>Tank Hacmi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">V_cargo = 0.98 × DWT / ρ_cargo</p>
                      <p><strong>İnert Gas:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">IG_rate = 125% × V_cargo_pump</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-purple-700 mb-2">⚓ Offshore Desteği</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>DP Capability:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">DP = √(F_thrust² + F_thruster²)</p>
                      <p><strong>ROV Kapasitesi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Depth_max = P_max / (ρ × g)</p>
                      <p><strong>Crane SWL:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">SWL = MBL / SF</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-orange-700 mb-2">🌉 RoRo Gemisi</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Lane Metre:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">LM = Σ(Lane_length × Lane_width / 2.5)</p>
                      <p><strong>Car Capacity:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Cars = Deck_area / (4.5 × 1.8)</p>
                      <p><strong>Ramp Load:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Load_max = σ_allow × A_ramp</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 cyberpunk:bg-gray-800 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Semboller:</strong><br/>
                      TEU: twenty-foot equivalent unit, DWT: deadweight<br/>
                      DP: dynamic positioning, SWL: safe working load<br/>
                      LM: lane metre, MBL: maximum breaking load
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Diagram Section */}
        <DiagramViewer
          title="Kargo Operasyon Akış Diyagramı"
          description="AI destekli kargo operasyonları - yükleme, boşaltma ve liman işlemleri akışı"
          data={{
            shipType: 'container',
            cargoCapacity: 14000,
            portOperations: 'loading',
            craneCapacity: 65
          }}
          diagramType="cargo"
          className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm"
        />

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Gemi tipine özel hesaplamalar, yük kapasitesi ve operasyonel analizler
        </div>
      </div>
    </div>
  );
};

export default SpecialShipCalculationsPage;