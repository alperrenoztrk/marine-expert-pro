import { Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { stabilityInputConstraints } from "@/utils/validation/inputConstraints";
import { validateNumberInput } from "@/utils/validation/validateInput";

export default function StabilityWindWeatherPage() {
  const [windSpeed, setWindSpeed] = useState<string>("");
  const [projectedArea, setProjectedArea] = useState<string>("");
  const [leverArm, setLeverArm] = useState<string>("");
  const [displacement, setDisplacement] = useState<string>("");

  const validation = useMemo(() => ({
    windSpeed: validateNumberInput(windSpeed, stabilityInputConstraints.windWeather.windSpeed),
    area: validateNumberInput(projectedArea, stabilityInputConstraints.windWeather.area),
    lever: validateNumberInput(leverArm, stabilityInputConstraints.windWeather.lever),
    displacement: validateNumberInput(displacement, stabilityInputConstraints.windWeather.displacement)
  }), [windSpeed, projectedArea, leverArm, displacement]);

  const result = useMemo(() => {
    if (validation.windSpeed.error || validation.area.error || validation.lever.error) return null;
    if (validation.windSpeed.value === null || validation.area.value === null || validation.lever.value === null) return null;
    const windPressure = 0.0613 * Math.pow(validation.windSpeed.value, 2);
    const windForce = windPressure * validation.area.value;
    const heelMoment = windForce * validation.lever.value;
    return {
      windPressure: windPressure.toFixed(2),
      windForce: windForce.toFixed(2),
      heelMoment: heelMoment.toFixed(2),
    };
  }, [validation]);

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-6 w-6" />
            Wind and Weather Stability
          </CardTitle>
          <CardDescription>
            Rüzgar etkisiyle oluşan yatma momentini hesaplayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="windSpeed">Rüzgar Hızı (m/s)</Label>
              <Input
                id="windSpeed"
                type="number"
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
                placeholder="0"
              />
              {validation.windSpeed.error && (
                <p className="text-xs text-red-600">{validation.windSpeed.error}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectedArea">Projeksiyon Alanı (m²)</Label>
              <Input
                id="projectedArea"
                type="number"
                value={projectedArea}
                onChange={(e) => setProjectedArea(e.target.value)}
                placeholder="0"
              />
              {validation.area.error && (
                <p className="text-xs text-red-600">{validation.area.error}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="leverArm">Kol Uzunluğu (m)</Label>
              <Input
                id="leverArm"
                type="number"
                step="0.1"
                value={leverArm}
                onChange={(e) => setLeverArm(e.target.value)}
                placeholder="0"
              />
              {validation.lever.error && (
                <p className="text-xs text-red-600">{validation.lever.error}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displacement">Deplasman (ton)</Label>
              <Input
                id="displacement"
                type="number"
                value={displacement}
                onChange={(e) => setDisplacement(e.target.value)}
                placeholder="0"
              />
              {validation.displacement.error && (
                <p className="text-xs text-red-600">{validation.displacement.error}</p>
              )}
            </div>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold mb-3 text-primary">Hesaplama Sonuçları</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Rüzgar Basıncı:</strong> {result.windPressure} N/m²
                </p>
                <p>
                  <strong>Rüzgar Kuvveti:</strong> {result.windForce} N
                </p>
                <p>
                  <strong>Yatma Momenti:</strong> {result.heelMoment} N·m
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2 text-sm">Formüller:</h4>
            <p className="text-xs font-mono">P = 0.0613 × V²</p>
            <p className="text-xs font-mono mt-1">F = P × A</p>
            <p className="text-xs font-mono mt-1">M = F × h</p>
            <p className="text-xs text-muted-foreground mt-2">
              P: Rüzgar basıncı, V: Rüzgar hızı, A: Alan, h: Kol uzunluğu
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
