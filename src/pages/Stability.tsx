import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Anchor, Calculator, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CalculationHero } from "@/components/ui/calculation-hero";
import { StabilityCalculations } from "@/components/calculations/StabilityCalculations";
import cargoShipOcean from "@/assets/maritime/cargo-ship-ocean.jpg";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Stability = () => {
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

        {/* Hero Section */}
        <CalculationHero
          title="Stabilite Hesaplamaları"
          description="Gemi dengesi, metacenter ve stabilite analizi - IMO standartlarına uygun"
          imageSrc={cargoShipOcean}
          imageAlt="Cargo Ship on Ocean"
        />

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Anchor className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              Stabilite Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            IMO, SOLAS ve IS Code standartlarına uygun kapsamlı stabilite analizi
          </p>
        </div>

        {/* Stability Calculations */}
        <Card className="bg-white dark:bg-gray-800/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 shadow-xl dark:shadow-gray-900/50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Anchor className="h-8 w-8" />
              Stabilite Hesaplama Modülü
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <StabilityCalculations />
          </CardContent>
        </Card>

        {/* Stability Formulas Reference */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 cyberpunk:bg-gray-900/90 neon:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Stabilite Formülleri Referansı
            </CardTitle>
            <CardDescription>
              IMO, SOLAS ve IS Code standartlarına uygun stabilite formülleri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Temel Stabilite Formülleri */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                🎯 Temel Stabilite Formülleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>GM (Metacentric Height):</strong><br/>
                    GM = KM - KG
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>GM_corrected:</strong><br/>
                    GM_corrected = GM - FSC
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>KM:</strong><br/>
                    KM = KB + BM
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>KB:</strong><br/>
                    KB = T × (0.5 - (1/12) × (1 - CWP/CB))
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>BM:</strong><br/>
                    BM = I_waterplane / ∇
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>KG:</strong><br/>
                    KG = Σ(Wi × zi) / ΣWi
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* GZ Eğrisi ve Stabilite Kolu */}
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                🌊 GZ Eğrisi ve Stabilite Kolu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>GZ (Küçük açılar):</strong><br/>
                    GZ = GM × sin(φ)
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>GZ (Büyük açılar):</strong><br/>
                    GZ = (KM - KG) × sin(φ)
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Righting Moment:</strong><br/>
                    M_righting = GZ × Δ × g
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Dynamic Stability:</strong><br/>
                    Dynamic Stability = ∫GZ dφ
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Area Under Curve:</strong><br/>
                    Area = Σ(GZ_i × Δφ_i)
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Free Surface Effect */}
            <div>
              <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                🔄 Free Surface Effect
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Free Surface Correction:</strong><br/>
                    FSC = (Ixx × ρ_fluid) / Δ
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Ixx (Moment of Inertia):</strong><br/>
                    Ixx = (L_tank × B_tank³) / 12
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Total FSC:</strong><br/>
                    FSC_total = Σ(Ixx_i × ρ_i) / Δ
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Corrected GM:</strong><br/>
                    GM_corrected = GM - FSC_total
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Wind and Weather Stability */}
            <div>
              <h3 className="text-lg font-semibold text-orange-700 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                🌪️ Wind and Weather Stability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Wind Heel Angle:</strong><br/>
                    φ_wind = arctan(Wind_Moment / Righting_Moment)
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Wind Moment:</strong><br/>
                    Wind_Moment = P_wind × A_wind × h_wind
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Weather Criterion:</strong><br/>
                    φ_steady = φ_wind × 1.5
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Area Requirement:</strong><br/>
                    Area_30to40 ≥ 1.719 m.rad
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* IMO Stability Criteria */}
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                📊 IMO Stability Criteria
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Area 0-30°:</strong><br/>
                    Area_0to30 ≥ 3.151 m.rad
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Area 0-40°:</strong><br/>
                    Area_0to40 ≥ 5.157 m.rad
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Area 30-40°:</strong><br/>
                    Area_30to40 ≥ 1.719 m.rad
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Maximum GZ:</strong><br/>
                    GZ_max ≥ 0.20 m at φ ≥ 30°
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Initial GM:</strong><br/>
                    GM ≥ 0.15 m
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Range of Stability:</strong><br/>
                    Range ≥ 60°
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Critical Angles */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                🚨 Critical Angles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Angle of List:</strong><br/>
                    φ_list = arctan((LCG - LCB) / GM)
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Angle of Loll:</strong><br/>
                    φ_loll = arccos(-GM / BM)
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Vanishing Angle:</strong><br/>
                    φ_vanishing = φ where GZ = 0
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Deck Edge Angle:</strong><br/>
                    φ_deck = arctan(T / (B/2))
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Damage Stability */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                🛡️ Damage Stability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Flooded Volume:</strong><br/>
                    V_flooded = V_compartment × permeability
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>New KG after Flooding:</strong><br/>
                    KG_new = (KG_old × Δ_old + KG_flooded × Δ_flooded) / Δ_new
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Residual GM:</strong><br/>
                    GM_residual = KM_new - KG_new
                  </div>
                  <div className="font-mono bg-gray-50 cyberpunk:bg-gray-800 p-2 rounded text-sm">
                    <strong>Heel Angle:</strong><br/>
                    φ_heel = arctan(M_flooded / (Δ_new × GM_residual))
                  </div>
                </div>
              </div>
            </div>

            {/* Symbols Legend */}
            <div className="mt-6 p-4 bg-blue-50 cyberpunk:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2">📚 Semboller:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div><strong>GM:</strong> Metacentric height</div>
                <div><strong>KM:</strong> Metacentric height from keel</div>
                <div><strong>KG:</strong> Center of gravity height</div>
                <div><strong>KB:</strong> Center of buoyancy height</div>
                <div><strong>BM:</strong> Metacentric radius</div>
                <div><strong>GZ:</strong> Righting arm</div>
                <div><strong>φ:</strong> Heel angle</div>
                <div><strong>Δ:</strong> Displacement</div>
                <div><strong>FSC:</strong> Free surface correction</div>
                <div><strong>Ixx:</strong> Moment of inertia</div>
                <div><strong>ρ:</strong> Density</div>
                <div><strong>g:</strong> Gravitational acceleration</div>
                <div><strong>T:</strong> Draft</div>
                <div><strong>B:</strong> Breadth</div>
                <div><strong>L:</strong> Length</div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            IMO Resolution A.749(18), IS Code 2008, SOLAS Chapter II-1 uygunluğu
          </p>
        </div>

      </div>
    </div>
  );
};

export default Stability;