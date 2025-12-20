import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { Anchor, Wind, Ship } from "lucide-react";

export default function SeamanshipCalculationsPage() {
  const [mooringInputs, setMooringInputs] = useState({ swl: "", safetyFactor: "0.55" });
  const [windInputs, setWindInputs] = useState({ cd: "1.2", area: "", velocity: "" });
  const [catenaryInputs, setCatenaryInputs] = useState({ weight: "", scope: "", depth: "" });

  const calculateMooringLoad = () => {
    const swl = parseFloat(mooringInputs.swl.replace(",", "."));
    const sf = parseFloat(mooringInputs.safetyFactor.replace(",", "."));
    if (isNaN(swl) || isNaN(sf)) return null;
    return ((swl * sf) / 1000).toFixed(2);
  };

  const calculateWindForce = () => {
    const cd = parseFloat(windInputs.cd.replace(",", "."));
    const area = parseFloat(windInputs.area.replace(",", "."));
    const velocity = parseFloat(windInputs.velocity.replace(",", "."));
    if (isNaN(cd) || isNaN(area) || isNaN(velocity)) return null;
    return (0.613 * cd * area * velocity * velocity / 1000).toFixed(2);
  };

  const calculateCatenaryLength = () => {
    const weight = parseFloat(catenaryInputs.weight.replace(",", "."));
    const scope = parseFloat(catenaryInputs.scope.replace(",", "."));
    const depth = parseFloat(catenaryInputs.depth.replace(",", "."));
    if (isNaN(weight) || isNaN(scope) || isNaN(depth)) return null;
    const chainLength = Math.sqrt(scope * scope + depth * depth);
    return chainLength.toFixed(2);
  };

  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Gemicilik"
        title="Gemicilik Hesaplamaları"
        subtitle="Palamar yükü, rüzgâr kuvveti ve katenary hesapları"
        backHref="/seamanship"
      >
        <div className="space-y-6">
          <Card className="bg-white/90 border-white/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
                <Anchor className="h-5 w-5" />
                Palamar Çalışma Yükü
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SWL (kg)</Label>
                <Input
                  placeholder="Güvenli çalışma yükü"
                  value={mooringInputs.swl}
                  onChange={(e) => setMooringInputs({ ...mooringInputs, swl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Güvenlik Katsayısı</Label>
                <Input
                  placeholder="0.55 - 0.60"
                  value={mooringInputs.safetyFactor}
                  onChange={(e) => setMooringInputs({ ...mooringInputs, safetyFactor: e.target.value })}
                />
              </div>
              {calculateMooringLoad() && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">Çalışma Yükü:</p>
                  <p className="text-2xl font-bold text-[#2F5BFF]">{calculateMooringLoad()} kN</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/90 border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
                  <Wind className="h-5 w-5" />
                  Rüzgâr Kuvveti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Sürtünme Katsayısı (Cd)</Label>
                  <Input
                    placeholder="1.0 - 1.3"
                    value={windInputs.cd}
                    onChange={(e) => setWindInputs({ ...windInputs, cd: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cephe Alanı (m²)</Label>
                  <Input
                    placeholder="Rüzgâra maruz alan"
                    value={windInputs.area}
                    onChange={(e) => setWindInputs({ ...windInputs, area: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rüzgâr Hızı (m/s)</Label>
                  <Input
                    placeholder="Rüzgâr hızı"
                    value={windInputs.velocity}
                    onChange={(e) => setWindInputs({ ...windInputs, velocity: e.target.value })}
                  />
                </div>
                {calculateWindForce() && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600">Rüzgâr Kuvveti:</p>
                    <p className="text-2xl font-bold text-[#2F5BFF]">{calculateWindForce()} kN</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
                  <Ship className="h-5 w-5" />
                  Katenary Hesabı
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Zincir Ağırlığı (kg/m)</Label>
                  <Input
                    placeholder="Zincir ağırlığı"
                    value={catenaryInputs.weight}
                    onChange={(e) => setCatenaryInputs({ ...catenaryInputs, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mendirek Mesafesi (m)</Label>
                  <Input
                    placeholder="Scope"
                    value={catenaryInputs.scope}
                    onChange={(e) => setCatenaryInputs({ ...catenaryInputs, scope: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Su Derinliği (m)</Label>
                  <Input
                    placeholder="Derinlik"
                    value={catenaryInputs.depth}
                    onChange={(e) => setCatenaryInputs({ ...catenaryInputs, depth: e.target.value })}
                  />
                </div>
                {calculateCatenaryLength() && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600">Zincir Uzunluğu:</p>
                    <p className="text-2xl font-bold text-[#2F5BFF]">{calculateCatenaryLength()} m</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CalculationGridScreen>
    </MobileLayout>
  );
}
