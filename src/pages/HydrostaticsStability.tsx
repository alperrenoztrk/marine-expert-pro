import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Ship, Waves, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const HydrostaticsStabilityPage = () => {
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
            <Ship className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              Hidrostatik ve Stabilite Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Gemi geometrisi, stabilite analizi, IMO kriterleri ve güvenlik hesaplamaları
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Formüller Bölümü */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Hidrostatik ve Stabilite Formülleri
                </CardTitle>
                <CardDescription>
                  Gemi güvenliği ve operasyonu için temel hesaplama formülleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Hidrostatik Temel Formüller */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <Waves className="h-5 w-5" />
                    Hidrostatik Temel Formüller
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">1. Deplasman ve Draft Hesaplamaları</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Deplasman (Δ):</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Δ = V × ρsw</p>
                        <p><strong>Draft (T):</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">T = V / Awp</p>
                        <p><strong>Ortalama Draft:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Tmean = (Tf + 4×Tm + Ta) / 6</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">2. Merkez Noktaları Hesaplamaları</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>LCB:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">LCB = ∫ x × A(x) dx / V</p>
                        <p><strong>VCB:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">VCB = ∫ z × A(z) dz / V</p>
                        <p><strong>KB (Dikdörtgen prizma):</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">KB = T / 2</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">3. TPC, MTC, LCF Hesaplamaları</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>TPC:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">TPC = Awp × ρsw / 100</p>
                        <p><strong>MTC:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">MTC = (Δ × GML × B²) / (12 × L)</p>
                        <p><strong>LCF:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">LCF = ∫ x × y(x) dx / Awp</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Stabilite Temel Formüller */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Stabilite Temel Formüller
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">4. Metacentric Yükseklik Hesaplamaları</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>GM:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">GM = KB + BM - KG</p>
                        <p><strong>KM:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">KM = KB + BM</p>
                        <p><strong>BM (Dikdörtgen prizma):</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">BM = B² / (12 × T)</p>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">5. GZ (Righting Arm) Hesaplamaları</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Küçük açılar (φ {'<'} 15°):</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">GZ = GM × sin(φ)</p>
                        <p><strong>Büyük açılar (φ {'>'} 15°):</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">GZ = KN - KG × sin(φ)</p>
                        <p><strong>Righting Moment:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Righting Moment = Δ × GZ</p>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">6. Free Surface Correction (FSC)</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>FSC:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">FSC = ρ × i / (Δ × GM)</p>
                        <p><strong>Tank atalet momenti (i):</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">i = L × B³ / 12</p>
                        <p><strong>Total FSC:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Total FSC = Σ FSCi</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* IMO Stabilite Kriterleri */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    IMO Stabilite Kriterleri
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">7. Area Under GZ Curve</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Area 0-30°:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Area 0-30° = ∫ GZ dφ (0° to 30°)</p>
                        <p><strong>Area 0-40°:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Area 0-40° = ∫ GZ dφ (0° to 40°)</p>
                        <p><strong>Area 30-40°:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Area 30-40° = ∫ GZ dφ (30° to 40°)</p>
                        <p><strong>Minimum GZ:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Minimum GZ = 0.20 m (φ {'>'} 30°)</p>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">8. Weather Criterion</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Wind Heel Angle:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Wind Heel Angle = arctan(Wind Moment / (Δ × GM))</p>
                        <p><strong>Wind Moment:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Wind Moment = 0.5 × ρair × v² × A × h</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Trim ve List Hesaplamaları */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                    <Waves className="h-5 w-5" />
                    Trim ve List Hesaplamaları
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">9. Trim Hesaplamaları</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Trim Açısı:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Trim Açısı = arctan((Ta - Tf) / L)</p>
                        <p><strong>Trim Değişimi:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Trim Değişimi = (W × d) / MCT</p>
                        <p><strong>MCT:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">MCT = (Δ × GML × B²) / (12 × L)</p>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">10. List Hesaplamaları</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>List Açısı:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">List Açısı = arctan(W × d / (Δ × GM))</p>
                        <p><strong>List Moment:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">List Moment = W × d</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Kritik Açılar */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Kritik Açılar
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">11. Angle of Loll</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>φloll:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">φloll = arccos(KG / KM)</p>
                        <p className="text-xs text-gray-600">GM {'<'} 0 durumunda</p>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">12. Vanishing Angle</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>φvanishing:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">φvanishing = arccos(KG / KM)</p>
                        <p className="text-xs text-gray-600">GZ = 0 olduğu açı</p>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">13. Deck Edge Angle</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>φdeck_edge:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">φdeck_edge = arctan(B/2 / (H - T))</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Hasar Stabilitesi */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Hasar Stabilitesi
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">14. Flooded Volume</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Vflooded:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Vflooded = Aflooded × hflooded</p>
                        <p><strong>New KG:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">New KG = (Δ × KG + Vflooded × ρsw × hflooded) / (Δ + Vflooded × ρsw)</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">15. Residual GM</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>GMresidual:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">GMresidual = KM - New KG</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">16. Cross Flooding Time</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>tcross:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">tcross = Vflooded / Qcross</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tahıl Stabilitesi */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <Waves className="h-5 w-5" />
                    Tahıl Stabilitesi (SOLAS Ch. VI)
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">17. Grain Shift Moment</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Mgrain:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Mgrain = Vgrain × ρgrain × hshift</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">18. Grain Heel Angle</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>φgrain:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">φgrain = arctan(Mgrain / (Δ × GM))</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">19. Grain Safety Factor</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>SF:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">SF = Righting Moment / Grain Shift Moment</p>
                        <p className="text-xs text-gray-600">SF {'>'} 1.06 (SOLAS gereksinimi)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Dinamik Stabilite */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Dinamik Stabilite
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">20. Rolling Period</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Troll:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Troll = 2π × √(k² / (g × GM))</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">21. Natural Period</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Tnatural:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Tnatural = 2π × √(I / (Δ × GM))</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">22. Energy to Heel</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Eheel:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Eheel = Δ × ∫ GZ dφ</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">23. Stability Index</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>SI:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">SI = Area under GZ curve / (Δ × GM × π/2)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* GZ Curve Generation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    GZ Curve Generation
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">24. Small Angles (φ {'<'} 15°)</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>GZ:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">GZ = GM × sin(φ)</p>
                      </div>
                    </div>

                    <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">25. Large Angles (φ {'>'} 15°)</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>GZ:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">GZ = KN - KG × sin(φ)</p>
                        <p className="text-xs text-gray-600">KN = Cross curves'den interpolasyon</p>
                      </div>
                    </div>

                    <div className="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">26. Area Calculation</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Area:</strong></p>
                        <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Area = ∫ GZ dφ</p>
                        <p className="text-xs text-gray-600">Numerical integration (Simpson's rule)</p>
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Semboller ve Açıklamalar */}
          <div className="lg:col-span-1">
            <Card className="h-fit sticky top-4 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Semboller ve Açıklamalar
                </CardTitle>
                <CardDescription>
                  Hidrostatik ve stabilite hesaplamalarında kullanılan semboller
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-700 mb-2">📐 Hidrostatik Semboller</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Δ:</strong> Deplasman (ton)</p>
                      <p><strong>V:</strong> Su altı hacim (m³)</p>
                      <p><strong>ρsw:</strong> Deniz suyu yoğunluğu (t/m³)</p>
                      <p><strong>T:</strong> Draft (m)</p>
                      <p><strong>Awp:</strong> Su hattı alanı (m²)</p>
                      <p><strong>TPC:</strong> Tonnes per cm</p>
                      <p><strong>MTC:</strong> Moment to Change Trim</p>
                      <p><strong>LCF:</strong> Longitudinal Center of Flotation</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-2">⚖️ Stabilite Semboller</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>GM:</strong> Metacentric height (m)</p>
                      <p><strong>KM:</strong> Metacentric height (m)</p>
                      <p><strong>KB:</strong> Center of buoyancy (m)</p>
                      <p><strong>BM:</strong> Metacentric radius (m)</p>
                      <p><strong>KG:</strong> Center of gravity (m)</p>
                      <p><strong>GZ:</strong> Righting arm (m)</p>
                      <p><strong>φ:</strong> Heel angle (derece)</p>
                      <p><strong>FSC:</strong> Free surface correction</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-purple-700 mb-2">📊 IMO Kriterleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Area 0-30°:</strong> GZ eğrisi altındaki alan (0-30°)</p>
                      <p><strong>Area 0-40°:</strong> GZ eğrisi altındaki alan (0-40°)</p>
                      <p><strong>Area 30-40°:</strong> GZ eğrisi altındaki alan (30-40°)</p>
                      <p><strong>Max GZ:</strong> Maksimum GZ değeri</p>
                      <p><strong>Min GZ:</strong> Minimum GZ değeri</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-red-700 mb-2">🚨 Kritik Açılar</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>φloll:</strong> Angle of loll</p>
                      <p><strong>φvanishing:</strong> Vanishing angle</p>
                      <p><strong>φdeck_edge:</strong> Deck edge angle</p>
                      <p><strong>φgrain:</strong> Grain heel angle</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-indigo-700 mb-2">📈 Dinamik Stabilite</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Troll:</strong> Rolling period (saniye)</p>
                      <p><strong>Tnatural:</strong> Natural period (saniye)</p>
                      <p><strong>Eheel:</strong> Energy to heel</p>
                      <p><strong>SI:</strong> Stability index</p>
                      <p><strong>k:</strong> Gyration radius</p>
                      <p><strong>I:</strong> Roll atalet momenti</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 cyberpunk:bg-gray-800 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Not:</strong><br/>
                      Tüm hesaplamalar IMO, SOLAS ve IS Code standartlarına uygun olarak yapılmalıdır.<br/>
                      Güvenlik faktörleri her zaman göz önünde bulundurulmalıdır.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          IMO Resolution A.749(18), IS Code 2008, SOLAS Chapter II-1 uygunluğu
        </div>
      </div>
    </div>
  );
};

export default HydrostaticsStabilityPage;