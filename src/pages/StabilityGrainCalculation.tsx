import { Button } from "@/components/ui/button";
import { ArrowLeft, Anchor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function StabilityGrainCalculationPage() {
  const navigate = useNavigate();
  const [grainVolume, setGrainVolume] = useState<number>(0);
  const [grainDensity, setGrainDensity] = useState<number>(0.8);
  const [holdVolume, setHoldVolume] = useState<number>(0);
  const [heelAngle, setHeelAngle] = useState<number>(0);

  const calculateGrainShift = () => {
    if (grainVolume && holdVolume && heelAngle) {
      const shiftVolume = grainVolume * 0.15 * Math.sin((heelAngle * Math.PI) / 180);
      const shiftMoment = shiftVolume * grainDensity * 9.81;
      return {
        shiftVolume: shiftVolume.toFixed(3),
        shiftMoment: shiftMoment.toFixed(2),
      };
    }
    return null;
  };

  const result = calculateGrainShift();

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/stability/calculations')}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-6 w-6" />
            Tahıl Hesabı (Grain Stability)
          </CardTitle>
          <CardDescription>
            Tahıl yükü kaymalarının stabiliteye etkisini hesaplayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grainVolume">Tahıl Hacmi (m³)</Label>
              <Input
                id="grainVolume"
                type="number"
                value={grainVolume || ""}
                onChange={(e) => setGrainVolume(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grainDensity">Tahıl Yoğunluğu (ton/m³)</Label>
              <Input
                id="grainDensity"
                type="number"
                step="0.1"
                value={grainDensity || ""}
                onChange={(e) => setGrainDensity(parseFloat(e.target.value))}
                placeholder="0.8"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="holdVolume">Ambar Hacmi (m³)</Label>
              <Input
                id="holdVolume"
                type="number"
                value={holdVolume || ""}
                onChange={(e) => setHoldVolume(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heelAngle">Yatma Açısı (derece)</Label>
              <Input
                id="heelAngle"
                type="number"
                value={heelAngle || ""}
                onChange={(e) => setHeelAngle(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold mb-3 text-primary">Hesaplama Sonuçları</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Kayma Hacmi:</strong> {result.shiftVolume} m³
                </p>
                <p>
                  <strong>Kayma Momenti:</strong> {result.shiftMoment} kN·m
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2 text-sm">Formül:</h4>
            <p className="text-xs font-mono">Kayma Hacmi = Tahıl Hacmi × 0.15 × sin(θ)</p>
            <p className="text-xs font-mono mt-1">Kayma Momenti = Kayma Hacmi × Yoğunluk × g</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
