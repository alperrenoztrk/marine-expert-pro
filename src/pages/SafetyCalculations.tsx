import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Calculator } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { SafetyCalculations } from "@/components/calculations/SafetyCalculations";
import { DiagramViewer } from "@/components/ui/diagram-viewer";

const SafetyCalculationsPage = () => {
  return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50 dark:hover:bg-gray-700 cyberpunk:hover:bg-gray-800 neon:hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Ana Sayfa</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Güvenlik Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Can salı, yangın sistemi ve acil durum hesaplamalarınızı yapın
          </p>
        </div>

        {/* Safety Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Güvenlik Hesaplama Modülü
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SafetyCalculations />
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
                  Güvenlik hesaplama formülleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-700 mb-2">🛟 Can Kurtarma Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Can Salı Kapasitesi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Capacity = Persons × 105%</p>
                      <p><strong>Fırlatma Süresi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">T_launch = N_boats × 30 min</p>
                      <p><strong>Toplama Noktası:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Area = N_persons × 0.35 m²</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-red-700 mb-2">🔥 Yangın Güvenliği</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Söndürme Kapasitesi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Q = A × k × √h</p>
                      <p><strong>Sprinkler Debisi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">q = 5 L/min/m²</p>
                      <p><strong>Kaçış Süresi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">T_escape = Distance / V_walk</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-2">⚖️ Stabilite Güvenliği</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>GM Minimum:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">GM ≥ 0.15 m</p>
                      <p><strong>GZ Max Kriteri:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">GZ_max ≥ 0.20 m</p>
                      <p><strong>Area under GZ:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">∫GZ dφ ≥ 0.055 m·rad</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-purple-700 mb-2">🔒 Emniyet Faktörleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Yapısal Emniyet:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">SF_struct = σ_yield / σ_working ≥ 2.0</p>
                      <p><strong>Çapa Emniyeti:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">SF_anchor = MBL / WLL ≥ 5.0</p>
                      <p><strong>Halat Emniyeti:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">SF_rope = BL / SWL ≥ 6.0</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 cyberpunk:bg-gray-800 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Semboller:</strong><br/>
                      GM: metacentric height, GZ: righting arm<br/>
                      SF: güvenlik faktörü, MBL: maximum breaking load<br/>
                      WLL: working load limit, SWL: safe working load
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Diagram Section */}
        <DiagramViewer
          title="Acil Durum Tahliye Diyagramı"
          description="AI destekli güvenlik prosedürleri - acil durum akışı ve tahliye planları"
          data={{
            personCapacity: 450,
            lifeboatCount: 8,
            emergencyType: 'fire'
          }}
          diagramType="safety"
          className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm"
        />

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Can salı kapasitesi, yangın söndürme sistemleri ve acil durum ekipmanları
        </div>
      </div>
    </div>
  );
};

export default SafetyCalculationsPage;