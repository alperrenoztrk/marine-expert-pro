import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calculator } from "lucide-react";
import { TrimListCalculations } from "@/components/calculations/TrimListCalculations";
import { Separator } from "@/components/ui/separator";
import { DiagramViewer } from "@/components/ui/diagram-viewer";

const TrimList = () => {
  return (
          <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 safe-area-inset">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <TrendingUp className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Trim ve List Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Gemi duruşu, trim açısı ve list düzeltme hesaplamalarınızı yapın
          </p>
        </div>

        {/* Trim Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border border-border bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Trim ve List Hesaplama Modülü
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrimListCalculations />
              </CardContent>
            </Card>
          </div>

          {/* Formüller Kutucuğu */}
          <div className="lg:col-span-1">
            <Card className="h-fit sticky top-4 shadow-lg border border-border bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Formüller
                </CardTitle>
                <CardDescription>
                  Trim ve draft hesaplama formülleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2">📐 Temel Trim Formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Trim Açısı:</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">θ = arctan((T_a - T_f) / L)</p>
                      <p><strong>MCT (Moment to Change Trim):</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">MCT = (Δ × GM_L × B²) / (12 × L)</p>
                      <p><strong>Trim Değişimi:</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">ΔT = (W × d) / MCT</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2">⚖️ Su çekimi survey formülleri</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Ortalama su çekimi:</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">T_mean = (T_f + 4×T_m + T_a) / 6</p>
                      <p><strong>Displacement:</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">Δ = V × ρ_sw</p>
                      <p><strong>TPC (Tonnes per cm):</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">TPC = (A_wp × ρ_sw) / 100</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2">📊 Bonjean Curves</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Su Altı Hacim:</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">V = ∫ A(x) dx</p>
                      <p><strong>LCB Hesabı:</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">LCB = ∫ x × A(x) dx / V</p>
                      <p><strong>Moment:</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">M = ∫ x² × A(x) dx</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2">🧮 Sounding Tabloları</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>Tank Hacmi (Dikdörtgen):</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">V = L × B × h</p>
                      <p><strong>Tank Hacmi (Silindirik):</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">V = π × r² × h</p>
                      <p><strong>Trim Düzeltmesi:</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">ΔV = A × tan(θ) × l</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2">🌊 List Hesaplamaları</h4>
                    <div className="space-y-1 text-xs">
                      <p><strong>List Açısı:</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">φ = arctan(W × d / (Δ × GM))</p>
                      <p><strong>List Moment:</strong></p>
                      <p className="font-mono bg-muted/40 border border-border p-1 rounded">M_list = W × d</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted/40 border border-border rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Semboller:</strong><br/>
                      T: draft, L: boy, W: ağırlık, Δ: deplasман<br/>
                      LCB: boyuna sürat merkezi, MCT: moment to change trim<br/>
                      φ: list açısı, θ: trim açısı, ρ: yoğunluk
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Diagram Section */}
        <DiagramViewer
          title="Trim ve Stabilite Diyagramı"
          description="Trim analizi - gemi profili, su hattı ve ağırlık dağılımı görselleştirmesi"
          data={{
            L: 180,
            draftForward: 8.5,
            draftAft: 9.2,
            displacement: 25000
          }}
          diagramType="trim"
          className="shadow-lg border border-border bg-card/80 backdrop-blur-sm"
        />



        {/* Info */}
        <div className="text-center text-sm text-muted-foreground">
          Gemi duruşu analizi, trim ve list hesaplamaları, yük dağılımı optimizasyonu
        </div>
      </div>
    </div>
  );
};

export default TrimList;