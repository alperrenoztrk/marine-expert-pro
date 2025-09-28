import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Ship, Waves, Shield, AlertTriangle, CheckCircle, BarChart3, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

const HydrostaticsStabilityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/stability">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-50 dark:hover:bg-gray-700 cyberpunk:hover:bg-gray-800 neon:hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Geri</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Ship className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              Stabilite Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Gemi geometrisi, stabilite analizi, IMO kriterleri ve güvenlik hesaplamaları
          </p>
        </div>

        {/* Hızlı Butonlar */}
        <Card className="border-0 bg-white/70 dark:bg-gray-800/70">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <Link to="/stability/assistant"><Button variant="outline" className="w-full justify-start gap-2"><Shield className="h-4 w-4" /> Asistan</Button></Link>
              <Link to="/stability/assistant"><Button variant="outline" className="w-full justify-start gap-2"><BookOpen className="h-4 w-4" /> Asistan</Button></Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Stabilite Hesaplamaları
              </CardTitle>
              <CardDescription>
                Gemi güvenliği ve operasyonu için temel hesaplama formülleri ve interaktif hesaplamalar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calculations" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="calculations" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    İnteraktif Hesaplamalar
                  </TabsTrigger>
                  <TabsTrigger value="formulas" className="flex items-center gap-2">
                    <Ship className="w-4 h-4" />
                    Formül Referansları
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="calculations" className="mt-6">
                  <HydrostaticsStabilityCalculations />
                </TabsContent>
                
                <TabsContent value="formulas" className="mt-6">
                  <div className="space-y-6">
                    {/* Hidrostatik Temel Formüller */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <Waves className="h-5 w-5" />
                        Hidrostatik Temel Formüller
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                          <h4 className="font-semibold text-sm mb-2">1. Deplasman ve su çekimi hesaplamaları</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Deplasman (Δ):</strong></p>
                            <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">Δ = V × ρsw</p>
                            <p><strong>Su çekimi (T):</strong></p>
                            <p className="font-mono bg-white dark:bg-gray-600 p-2 rounded">T = V / Awp</p>
                            <p><strong>Ortalama su çekimi:</strong></p>
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

                    {/* IMO Stabilite Kriterleri */}
                    <Separator />
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
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          IMO Resolution A.749(18), IS Code 2008, SOLAS Chapter II-1 uygunluğu
        </div>
        <StabilityAssistantPopup />
      </div>
    </div>
  );
};

export default HydrostaticsStabilityPage;