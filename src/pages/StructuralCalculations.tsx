import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building, Calculator } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { StructuralCalculations } from "@/components/calculations/StructuralCalculations";
import { DiagramViewer } from "@/components/ui/diagram-viewer";

const StructuralCalculationsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50 dark:hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Ana Sayfa</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Building className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Yapısal Hesaplamalar
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Mukavemet, gerilme ve yapısal analiz hesaplamalarınızı yapın
          </p>
        </div>

        {/* Structural Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Yapısal Hesaplama Modülü
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StructuralCalculations />
              </CardContent>
            </Card>
          </div>

          {/* Formüller Kutucuğu */}
          <div className="lg:col-span-1">
            <Card className="h-fit sticky top-4 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Formüller
                </CardTitle>
                <CardDescription>
                  Yapısal hesaplama formülleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-700 mb-2">🏗️ Mukavemet Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Eğilme Gerilmesi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">σ = M × y / I</p>
                      <p><strong>Kesme Gerilmesi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">τ = V × Q / (I × t)</p>
                      <p><strong>Güvenlik Faktörü:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">SF = σ_yield / σ_working</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-2">⚡ Kiriş Hesaplamaları</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Maksimum Moment:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">M_max = w × L² / 8</p>
                      <p><strong>Sehim:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">δ = 5wL⁴ / (384EI)</p>
                      <p><strong>Atalet Momenti:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">I = b × h³ / 12</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-purple-700 mb-2">🔩 Bağlantı Elemanları</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Cıvata Kesme Kuvveti:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">V_bolt = π × d² × τ_allow / 4</p>
                      <p><strong>Kaynak Kesme Gerilmesi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">τ_weld = F / (0.707 × a × L)</p>
                      <p><strong>Plaka Taşıma Kuvveti:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">P = σ_allow × A_net</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-orange-700 mb-2">🌊 Yorulma Analizi</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>S-N Eğrisi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">N = A × S^(-m)</p>
                      <p><strong>Miner Kuralı:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Σ(n_i / N_i) ≤ 1</p>
                      <p><strong>Yorulma Sınırı:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">σ_endurance = 0.5 × σ_ultimate</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Semboller:</strong><br/>
                      σ: gerilme, τ: kesme gerilmesi, M: moment<br/>
                      I: atalet momenti, E: elastisite modülü<br/>
                      V: kesme kuvveti, δ: sehim, SF: güvenlik faktörü
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Diagram Section */}
        <DiagramViewer
          title="Yapısal Analiz Akış Diyagramı"
          description="AI destekli yapısal analiz - yük hesaplaması, gerilme analizi ve güvenlik değerlendirmesi"
          data={{
            beamLength: 12,
            loadType: 'distributed',
            materialGrade: 'AH36',
            safetyFactor: 2.0
          }}
          diagramType="structural"
          className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        />

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Mukavemet analizi, gerilme hesaplamaları ve yapısal dayanım değerlendirmeleri
        </div>
      </div>
    </div>
  );
};

export default StructuralCalculationsPage;