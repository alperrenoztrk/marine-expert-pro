import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Compass, Calculator, Brain, BookOpen, Sigma, ListChecks } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";
import { NavigationCalculations } from "@/components/calculations/NavigationCalculations";
import { DiagramViewer } from "@/components/ui/diagram-viewer";

const NavigationCalculationsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || undefined;
  const navMenuItems = [
    { to: "/navigation-menu", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
    { to: "/regulations", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar" },
    { to: "/formulas", icon: <Sigma className="h-4 w-4" />, label: "Formüller" },
    { to: "/navigation", icon: <Calculator className="h-4 w-4" />, label: "Hesaplamalar" },
    { to: "/empty-page", icon: <ListChecks className="h-4 w-4" />, label: "Quiz" }
  ];

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
            <Compass className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              <span data-translatable>Seyir Hesaplamaları</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Mesafe, hız, rota, konum ve zaman hesaplamalarınızı yapın
          </p>
        </div>

        {/* Top Menu (Assistant, Rules, Formulas, Calculations, Quiz) */}
        <Card>
          <CardHeader>
            <CardTitle data-no-translate>Seyir Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 py-1">
              {navMenuItems.map((it) => (
                <Link key={it.to} to={it.to}>
                  <Button variant="outline" className="justify-start gap-2 whitespace-nowrap" data-no-translate>
                    {it.icon}
                    {it.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Compass className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Seyir Hesaplama Modülü
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NavigationCalculations initialTab={initialTab} />
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
                  Seyir hesaplama formülleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-700 mb-2">🧭 Great Circle</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Mesafe:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">d = acos(sin φ₁ × sin φ₂ + cos φ₁ × cos φ₂ × cos Δλ)</p>
                      <p><strong>İlk Rotası:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">θ = atan2(sin Δλ × cos φ₂, cos φ₁ × sin φ₂ - sin φ₁ × cos φ₂ × cos Δλ)</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-2">📐 Rhumb Line</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Mesafe:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">d = Δφ / cos θ</p>
                      <p><strong>Rota:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">θ = atan2(Δλ, ln(tan(π/4 + φ₂/2) / tan(π/4 + φ₁/2)))</p>
                      <p><strong>Departure:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Dep = Δλ × cos φₘ</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-purple-700 mb-2">🧭 Pusula Düzeltmeleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Gerçek Rota:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">T = M + Var</p>
                      <p><strong>Manyetik Rota:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">M = C + Dev</p>
                      <p><strong>Pusula Rotası:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">C = T - Var - Dev</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-orange-700 mb-2">🌊 Akıntı & Rüzgar</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Set & Drift:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">COG = HDG + Set</p>
                      <p><strong>Leeway:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">Track = Course ± Leeway</p>
                      <p><strong>SMG:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">SMG = √(STW² + Drift² + 2×STW×Drift×cos(Set))</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 cyberpunk:bg-gray-800 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Semboller:</strong><br/>
                      φ: enlem, λ: boylam, θ: rota<br/>
                      T: gerçek, M: manyetik, C: pusula<br/>
                      COG: zemin rotası, SOG: zemin hızı
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Diagram Section */}
        <DiagramViewer
          title="Seyir Sistemi Diyagramı"
          description="AI destekli seyir hesaplamaları - GPS, pusula ve radar entegrasyonu"
          data={{
            shipPosition: { lat: 41.0082, lon: 28.9784 },
            courseOverGround: 45,
            speedOverGround: 12.5,
            windDirection: 270
          }}
          diagramType="safety"
          className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        />

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Great Circle, Rhumb Line, Compass hesaplamaları ve daha fazlası
        </div>
      </div>
    </div>
  );
};

export default NavigationCalculationsPage;