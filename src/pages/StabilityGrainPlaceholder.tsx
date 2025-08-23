import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ShipGeometry } from "@/types/hydrostatic";
import { HydrostaticCalculations } from "@/services/hydrostaticCalculations";

export default function StabilityGrainPlaceholder() {
  const navigate = useNavigate();
  const [geometry, setGeometry] = useState<ShipGeometry>({
    length: 180,
    breadth: 30,
    depth: 18,
    draft: 10,
    blockCoefficient: 0.75,
    waterplaneCoefficient: 0.85,
    midshipCoefficient: 0.98,
    prismaticCoefficient: 0.77,
    verticalPrismaticCoefficient: 0.75,
  });

  const [grainShiftMoment, setGrainShiftMoment] = useState<number>(1200); // kNm ~ proxy
  const [grainHeelAngle, setGrainHeelAngle] = useState<number>(12); // °

  const [result, setResult] = useState<ReturnType<typeof HydrostaticCalculations.calculateGrainStability> | null>(null);

  const handleChange = (key: keyof ShipGeometry) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setGeometry((prev) => ({ ...prev, [key]: isNaN(value) ? 0 : value }));
  };

  const handleCalculate = () => {
    const res = HydrostaticCalculations.calculateGrainStability(geometry, grainShiftMoment, grainHeelAngle);
    setResult(res);
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/stability')}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Tahıl Stabilitesi (SOLAS VI)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <Label>Uzunluk LBP (m)</Label>
              <Input type="number" value={geometry.length} onChange={handleChange('length')} />
            </div>
            <div>
              <Label>Genişlik B (m)</Label>
              <Input type="number" value={geometry.breadth} onChange={handleChange('breadth')} />
            </div>
            <div>
              <Label>Derinlik D (m)</Label>
              <Input type="number" value={geometry.depth} onChange={handleChange('depth')} />
            </div>
            <div>
              <Label>Draft T (m)</Label>
              <Input type="number" value={geometry.draft} onChange={handleChange('draft')} />
            </div>
            <div>
              <Label>Cb</Label>
              <Input type="number" step="0.01" value={geometry.blockCoefficient} onChange={handleChange('blockCoefficient')} />
            </div>
            <div>
              <Label>Tahıl Kayma Momenti (kNm)</Label>
              <Input type="number" step="1" value={grainShiftMoment} onChange={(e) => setGrainShiftMoment(parseFloat(e.target.value))} />
            </div>
            <div>
              <Label>Tahıl Kayma Açısı (°)</Label>
              <Input type="number" step="0.5" value={grainHeelAngle} onChange={(e) => setGrainHeelAngle(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="calculator" onClick={handleCalculate}>Hesapla</Button>
            <Button variant="ghost" onClick={() => setResult(null)}>Temizle</Button>
          </div>

          {result && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Güvenlik Faktörü</div>
                <div className="text-xl font-semibold">{result.grainSafetyFactor.toFixed(2)}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">İzin Verilen Heel (°)</div>
                <div className="text-xl font-semibold">{result.grainAllowableHeel.toFixed(1)}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Kriter</div>
                <div className="text-xl font-semibold">{result.grainStabilityCriterion.toFixed(2)}</div>
              </div>
              <div className="rounded-md border p-3 sm:col-span-3">
                <div className="text-xs text-muted-foreground">Uygunluk</div>
                <div className="text-xl font-semibold">{result.compliance ? 'Uygun' : 'Uygun değil'}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}