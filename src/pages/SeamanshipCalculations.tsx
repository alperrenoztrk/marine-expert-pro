import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Anchor, Wind, Ship } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SeamanshipCalculationsPage() {
  const navigate = useNavigate();
  const [mooringInputs, setMooringInputs] = useState({ swl: "", safetyFactor: "0.55" });
  const [windInputs, setWindInputs] = useState({ cd: "1.2", area: "", velocity: "" });
  const [catenaryInputs, setCatenaryInputs] = useState({ weight: "", scope: "", depth: "" });

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/calculations");
  };

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Gemicilik Hesaplamaları
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
            Gemicilik Hesaplamaları
          </h1>
          <p className="text-muted-foreground mt-2">
            Palamar yükü, zincir katenary ve römorkör kuvvetleri
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
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
          </Card>

          <Card className="shadow-lg">
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
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Rüzgâr Kuvveti:</p>
                  <p className="text-2xl font-bold text-emerald-600">{calculateWindForce()} kN</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-emerald-600" />
                Zincir Uzunluğu (Basit)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Zincir Ağırlığı (kg/m)</Label>
                  <Input
                    placeholder="Birim uzunluk ağırlığı"
                    value={catenaryInputs.weight}
                    onChange={(e) => setCatenaryInputs({ ...catenaryInputs, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Yatay Mesafe (m)</Label>
                  <Input
                    placeholder="Gemi-demir mesafesi"
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
              </div>
              {calculateCatenaryLength() && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Minimum Zincir Uzunluğu:</p>
                  <p className="text-2xl font-bold text-emerald-600">{calculateCatenaryLength()} m</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
