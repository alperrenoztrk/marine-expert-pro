import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculationLayout } from "@/components/layout/CalculationLayout";
import { CalculationCard } from "@/components/ui/calculation-card";
import { Calculator, Anchor, Wind, Ship } from "lucide-react";

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
    <CalculationLayout
      title="Gemicilik Hesaplamaları"
      description="Palamar yükü, rüzgâr kuvveti ve katenary hesaplarını stabilite arayüzünde toplayın"
      icon={Calculator}
      actions={
        <Button variant="outline" asChild>
          <Link to="/seamanship">Gemicilik Modülüne Dön</Link>
        </Button>
      }
      maxWidthClassName="max-w-5xl"
    >
      <div className="space-y-6">
        <div className="text-sm text-muted-foreground flex items-center gap-2 justify-end">
          <Calculator className="h-4 w-4" />
          Gemicilik Hesaplamaları
        </div>

        <CalculationCard className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Anchor className="h-5 w-5 text-emerald-600" />
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
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Çalışma Yükü:</p>
                <p className="text-2xl font-bold text-emerald-600">{calculateMooringLoad()} kN</p>
              </div>
            )}
          </CardContent>
        </CalculationCard>

        <div className="grid gap-6 md:grid-cols-2">
          <CalculationCard className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-emerald-600" />
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
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Rüzgâr Kuvveti:</p>
                  <p className="text-2xl font-bold text-blue-600">{calculateWindForce()} kN</p>
                </div>
              )}
            </CardContent>
          </CalculationCard>

          <CalculationCard className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-emerald-600" />
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
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Zincir Uzunluğu:</p>
                  <p className="text-2xl font-bold text-purple-600">{calculateCatenaryLength()} m</p>
                </div>
              )}
            </CardContent>
          </CalculationCard>
        </div>
      </div>
    </CalculationLayout>
  );
}
