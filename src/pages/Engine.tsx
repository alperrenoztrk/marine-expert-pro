import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cog, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { EngineCalculations } from "@/components/calculations/EngineCalculations";
import { Separator } from "@/components/ui/separator";
import { DiagramViewer } from "@/components/ui/diagram-viewer";
import { CalculationHero } from "@/components/ui/calculation-hero";
import shipBridge from "@/assets/maritime/ship-bridge.jpg";

const Engine = () => {
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

        {/* Hero Section */}
        <CalculationHero
          title="Makine Hesaplamaları"
          description="Gemi makineleri ve güç sistemleri hesaplamaları"
          imageSrc={shipBridge}
          imageAlt="Ship Bridge Control Panel"
        />

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Cog className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              Makine Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Motor gücü, yakıt tüketimi ve performans hesaplamalarınızı yapın
          </p>
        </div>

        {/* Engine Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Cog className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Makine Hesaplama Modülü
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EngineCalculations />
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
                  Makine hesaplama formülleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-700 mb-2">⚡ Güç Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Fren Gücü:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">BHP = IHP × η_mech</p>
                      <p><strong>Şaft Gücü:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">SHP = BHP × η_trans</p>
                      <p><strong>Efektif Güç:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">EHP = SHP × η_prop</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-2">⛽ Yakıt Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>SFOC Interpolasyon:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">SFOC = a × Load² + b × Load + c</p>
                      <p><strong>Yakıt Tüketimi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">FC = Power × SFOC / 1000</p>
                      <p><strong>Günlük Tüketim:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Daily = FC × 24</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-orange-700 mb-2">🌡️ Isı Transfer Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Isı Değişim Alanı:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">A = Q / (U × LMTD)</p>
                      <p><strong>LMTD:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">LMTD = (ΔT₁ - ΔT₂) / ln(ΔT₁/ΔT₂)</p>
                      <p><strong>Isı Yükü:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Q = m × cp × ΔT</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-red-700 mb-2">💨 Emisyon Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>NOx Emisyonu:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">NOx = EF × FC × CF</p>
                      <p><strong>SOx Emisyonu:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">SOx = FC × S% × 2</p>
                      <p><strong>CO₂ Emisyonu:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">CO₂ = FC × CF × 44/12</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-purple-700 mb-2">📊 Verimlilik Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Termal Verimlilik:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">η_th = P / (FC × LCV)</p>
                      <p><strong>Genel Verimlilik:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">η_total = η_th × η_mech × η_prop</p>
                      <p><strong>EEOI:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">EEOI = CO₂ / (Cargo × Distance)</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 cyberpunk:bg-gray-800 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Semboller:</strong><br/>
                      P: güç, η: verimlilik, FC: yakıt tüketimi<br/>
                      Q: ısı, U: ısı transfer katsayısı, LMTD: log ort. sıc. farkı<br/>
                      EF: emisyon faktörü, CF: karbon faktörü
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Diagram Section */}
        <DiagramViewer
          title="Makine Sistemi Akış Diyagramı"
          description="AI destekli makine sistemi görselleştirmesi - yakıt akışı, güç iletimi ve emisyon kontrolü"
          data={{
            mcrPower: 8500,
            currentLoad: 75,
            fuelType: 'HFO',
            seawaterInletTemp: 32
          }}
          diagramType="engine"
          className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm"
        />

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Motor performansı, yakıt verimlilik analizi ve güç hesaplamaları
        </div>
      </div>
    </div>
  );
};

export default Engine;