import { Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function StabilityWindWeatherPage() {
  const [windSpeed, setWindSpeed] = useState<number>(0);
  const [projectedArea, setProjectedArea] = useState<number>(0);
  const [leverArm, setLeverArm] = useState<number>(0);
  const [displacement, setDisplacement] = useState<number>(0);

  const calculateWindHeelMoment = () => {
    if (windSpeed && projectedArea && leverArm) {
      const windPressure = 0.0613 * Math.pow(windSpeed, 2);
      const windForce = windPressure * projectedArea;
      const heelMoment = windForce * leverArm;
      return {
        windPressure: windPressure.toFixed(2),
        windForce: windForce.toFixed(2),
        heelMoment: heelMoment.toFixed(2),
      };
    }
    return null;
  };

  const result = calculateWindHeelMoment();

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
                value={windSpeed || ""}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectedArea">Projeksiyon Alanı (m²)</Label>
              <Input
                id="projectedArea"
                type="number"
                value={projectedArea || ""}
                onChange={(e) => setProjectedArea(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leverArm">Kol Uzunluğu (m)</Label>
              <Input
                id="leverArm"
                type="number"
                step="0.1"
                value={leverArm || ""}
                onChange={(e) => setLeverArm(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displacement">Deplasman (ton)</Label>
              <Input
                id="displacement"
                type="number"
                value={displacement || ""}
                onChange={(e) => setDisplacement(parseFloat(e.target.value))}
                placeholder="0"
              />
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
