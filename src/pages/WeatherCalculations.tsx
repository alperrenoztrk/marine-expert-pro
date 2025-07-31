import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cloud, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { WeatherCalculations as WeatherCalcs } from "@/components/calculations/WeatherCalculations";
import { Separator } from "@/components/ui/separator";

const WeatherCalculationsPage = () => {
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
            <Cloud className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Meteoroloji ve Oşinografi Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Beaufort & Douglas skalaları, rüzgar/akıntı etkileri ve kuvvet analizi
          </p>
        </div>

        {/* Weather Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Meteoroloji ve Oşinografi Hesaplama Modülü
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeatherCalcs />
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
                  Meteoroloji ve Oşinografi hesaplama formülleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-700 mb-2">🌬️ Rüzgar Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Beaufort Skalası:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">B = 0.8368 + 0.2649 × ln(v)</p>
                      <p><strong>Görülen Rüzgar:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">v_app = √(v_true² + v_ship² - 2×v_true×v_ship×cos(θ))</p>
                      <p><strong>Rüzgar Basıncı:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">P = 0.5 × ρ × v² × A × C_d</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-green-700 mb-2">🌊 Dalga Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Douglas Skalası:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">D = 0.55 × H_s^0.64</p>
                      <p><strong>Dalga Boyu:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">λ = 1.56 × T²</p>
                      <p><strong>Dalga Kuvveti:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">F = ρ × g × H² × B / 8</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-cyan-700 mb-2">🌊 Akıntı Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Akıntı Etkisi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">v_ground = v_ship + v_current</p>
                      <p><strong>Deriva Açısı:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">β = arcsin(v_c × sin(θ) / v_s)</p>
                      <p><strong>Akıntı Direnci:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">R = 0.5 × ρ × v² × S × C_d</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-purple-700 mb-2">⚖️ Gemi Kuvvet Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Hidrostatik Stabilite:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">GZ = GM × sin(φ)</p>
                      <p><strong>Dalga Etkisi:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">F_wave = ρ × g × ∇ × a × ω²</p>
                      <p><strong>Toplam Kuvvet:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">F_total = F_wind + F_wave + F_current</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-orange-700 mb-2">🌡️ Çevresel Faktörler</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Hava Yoğunluğu:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">ρ = P / (R × T)</p>
                      <p><strong>Su Yoğunluğu:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">ρ_sw = ρ_fw × (1 + S/1000)</p>
                      <p><strong>Görünürlük Faktörü:</strong></p>
                      <p className="font-mono bg-gray-50 p-1 rounded">V_factor = e^(-0.05 × distance)</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Semboller:</strong><br/>
                      v: hız, ρ: yoğunluk, P: basınç, T: sıcaklık<br/>
                      H_s: anlamlı dalga yüksekliği, λ: dalga boyu<br/>
                      φ: roll açısı, GM: metasantrik yükseklik
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Beaufort & Douglas skalaları, rüzgar/akıntı kuvvet analizi ve seyir düzeltmeleri
        </div>
      </div>
    </div>
  );
};

export default WeatherCalculationsPage;