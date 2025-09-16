import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Compass, Calculator } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { NavigationCalculations } from "@/components/calculations/NavigationCalculations";

const Navigation = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || undefined;
  return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
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

        {/* Navigation Calculations + Formulas Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NavigationCalculations initialTab={initialTab} />
          </div>

          {/* Formüller Kutucuğu */}
          <div className="lg:col-span-1">
            <Card className="h-fit sticky top-4 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 cyberpunk:bg-gray-900/90 neon:bg-slate-900/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Formüller
                </CardTitle>
                <CardDescription>
                  Seyir hesaplamaları için temel ve ileri formüller
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-700 mb-2">🧭 Great Circle (Büyük Daire) Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Mesafe (nm):</strong></p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">d = 2R × arcsin(√(sin²((φ₂−φ₁)/2) + cosφ₁ cosφ₂ sin²((λ₂−λ₁)/2)))</p>
                      <p className="text-[10px] text-muted-foreground">R ≈ 3440.065 nm</p>
                      <p><strong>İlk Kurs (θ₀):</strong></p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">θ₀ = atan2(sinΔλ · cosφ₂, cosφ₁ · sinφ₂ − sinφ₁ · cosφ₂ · cosΔλ)</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-2">📐 Rhumb Line (Mercator) Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>q katsayısı:</strong></p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">q = ln(tan(π/4 + φ₂/2) / tan(π/4 + φ₁/2)) / (φ₂ − φ₁)</p>
                      <p><strong>Mesafe (nm):</strong></p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">d = 60 × √((Δφ)² + (q · Δλ)²)</p>
                      <p><strong>Kurs:</strong></p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">Brg = atan2(Δλ, q · Δφ)</p>
                      <p className="text-[10px] text-muted-foreground">Yaklaşık: Departure = 60 · Δλ · cosφ̄, dLat = 60 · Δφ</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-purple-700 mb-2">✈️ Plane Sailing</h4>
                    <div className="space-y-1 text-xs">
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">dLat = 60 · Δφ</p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">Dep = 60 · Δλ · cosφ̄</p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">Kurs = atan2(Dep, dLat)</p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">Mesafe = √(dLat² + Dep²)</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-orange-700 mb-2">⏱️ Zaman ve ETA</h4>
                    <div className="space-y-1 text-xs">
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">t (saat) = d / V</p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">ETA = ETD + t</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-cyan-700 mb-2">🌊 Akıntı Üçgeni (Course to Steer)</h4>
                    <div className="space-y-1 text-xs">
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">sin(CTS − TR) = (c / V) · sin(set − TR)</p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">SOG = V · cos(CTS − TR) + c · cos(set − TR)</p>
                      <p className="text-[10px] text-muted-foreground">TR: istenen rota, V: gemi sürati, c/set: akıntı</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-rose-700 mb-2">🧭 Pusula Dönüşümleri</h4>
                    <div className="space-y-1 text-xs">
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">Cm = Ct − Var</p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">Cc = Cm − Dev</p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">Ct = Cc + Var + Dev</p>
                      <p className="text-[10px] text-muted-foreground">Kural: E(+) W(−)</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-teal-700 mb-2">📡 CPA / TCPA</h4>
                    <div className="space-y-1 text-xs">
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">t_CPA = − (R · V_rel) / |V_rel|²</p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">d_CPA = |R + V_rel · t_CPA|</p>
                      <p className="text-[10px] text-muted-foreground">t_CPA (saat) → dakika için ×60</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-amber-700 mb-2">☀️ Sight Reduction (Temel)</h4>
                    <div className="space-y-1 text-xs">
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">sin(Hc) = sinφ · sinδ + cosφ · cosδ · cos(LHA)</p>
                      <p className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-1 rounded">cos(Z) = (sinδ − sinφ · sinHc) / (cosφ · cosHc)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Great Circle, Rhumb Line, Compass, CPA/TCPA, Sight Reduction ve daha fazlası
        </div>
      </div>
    </div>
  );
};

export default Navigation;