import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { HydrostaticUtils } from "@/utils/hydrostaticUtils";
import { ShipGeometry } from "@/types/hydrostatic";
import { HydrostaticCalculations } from "@/services/hydrostaticCalculations";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function StabilityLongitudinal() {
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
  const [kg, setKg] = useState<number>(12);
  const [angle, setAngle] = useState<number>(20);
  const [result, setResult] = useState<{ gz: number; rightingMoment: number; stabilityIndex: number } | null>(null);

  const handleChange = (key: keyof ShipGeometry) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setGeometry((prev) => ({ ...prev, [key]: isNaN(value) ? 0 : value }));
  };

  const handleCalculate = () => {
    const res = HydrostaticUtils.calculateLargeAngleStability(geometry, kg, angle);
    setResult(res);
  };

  const chartData = useMemo(() => {
    const points = HydrostaticCalculations.generateGZCurve(geometry, kg, 0, 90, 1);
    return points.map((p) => ({ angle: p.angle, gz: Number(p.gz.toFixed(3)) }));
  }, [geometry, kg]);

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/stability')}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Boyuna Stabilite (Büyük Açılar Yaklaşımı)</CardTitle>
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
              <Label>Cw</Label>
              <Input type="number" step="0.01" value={geometry.waterplaneCoefficient} onChange={handleChange('waterplaneCoefficient')} />
            </div>
            <div>
              <Label>Cm</Label>
              <Input type="number" step="0.01" value={geometry.midshipCoefficient} onChange={handleChange('midshipCoefficient')} />
            </div>
            <div>
              <Label>Cp</Label>
              <Input type="number" step="0.01" value={geometry.prismaticCoefficient} onChange={handleChange('prismaticCoefficient')} />
            </div>
            <div>
              <Label>Cvp</Label>
              <Input type="number" step="0.01" value={geometry.verticalPrismaticCoefficient} onChange={handleChange('verticalPrismaticCoefficient')} />
            </div>
            <div>
              <Label>KG (m)</Label>
              <Input type="number" step="0.01" value={kg} onChange={(e) => setKg(parseFloat(e.target.value))} />
            </div>
            <div>
              <Label>Açı (°)</Label>
              <Input type="number" step="1" value={angle} onChange={(e) => setAngle(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="calculator" onClick={handleCalculate}>Hesapla</Button>
            <Button variant="ghost" onClick={() => setResult(null)}>Temizle</Button>
          </div>

          <ChartContainer config={{ gz: { label: 'GZ', color: 'hsl(var(--primary))' } }} className="w-full h-56">
            <LineChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="angle" tickFormatter={(v) => `${v}°`} />
              <YAxis tickFormatter={(v) => `${v} m`} />
              <ChartTooltip content={<ChartTooltipContent labelKey="angle" nameKey="gz" />} />
              <Line type="monotone" dataKey="gz" stroke="var(--color-gz)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>

          {result && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">GZ</div>
                <div className="text-xl font-semibold">{result.gz.toFixed(3)} m</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Doğrultucu Moment</div>
                <div className="text-xl font-semibold">{result.rightingMoment.toFixed(0)} kNm</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Stabilite İndeksi</div>
                <div className="text-xl font-semibold">{result.stabilityIndex.toFixed(3)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}