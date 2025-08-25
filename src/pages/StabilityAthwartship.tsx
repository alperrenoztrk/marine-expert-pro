import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useRef, useState } from "react";
import { HydrostaticUtils } from "@/utils/hydrostaticUtils";
import { ShipGeometry } from "@/types/hydrostatic";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { exportNodeToPng, exportToCsv } from "@/utils/exportUtils";

export default function StabilityAthwartship() {
  const navigate = useNavigate();
  const chartRef = useRef<HTMLDivElement>(null);
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
  const [freeService, setFreeService] = useState<number>(0);
  const [result, setResult] = useState<{ gm: number; stabilityRange: number; naturalPeriod: number; deckEdgeAngle: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const handleChange = (key: keyof ShipGeometry) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setGeometry((prev) => ({ ...prev, [key]: isNaN(value) ? 0 : value }));
  };

  const handleCalculate = () => {
    const v = HydrostaticUtils.validateShipGeometry(geometry);
    setErrors(v.errors);
    if (!v.isValid) {
      setResult(null);
      return;
    }
    const res = HydrostaticUtils.calculateSmallAngleStability(geometry, kg - freeService);
    // Calculate deck edge immersion angle (simplified approximation)
    const deckEdgeAngle = Math.atan(geometry.breadth / (2 * geometry.draft)) * (180 / Math.PI);
    setResult({ ...res, deckEdgeAngle });
  };

  const chartData = useMemo(() => {
    if (!result) return [] as { angle: number; gz: number }[];
    const points: { angle: number; gz: number }[] = [];
    for (let a = 0; a <= 60; a += 1) {
      const rad = (a * Math.PI) / 180;
      // Small-angle approximation for <=15°, wall-sided like term for larger
      const gz = a <= 15
        ? result.gm * Math.sin(rad)
        : result.gm * Math.sin(rad) - 0.5 * geometry.breadth * Math.pow(Math.sin(rad), 2);
      points.push({ angle: a, gz: Math.max(0, Number(gz.toFixed(3))) });
    }
    return points;
  }, [result, geometry.breadth]);

  const handleExportPng = async () => {
    if (chartRef.current) await exportNodeToPng(chartRef.current, 'gz-athwartship.png');
  };

  const handleExportCsv = () => {
    if (!result) return;
    const rows = chartData.map((r) => ({ angle: r.angle, gz: r.gz }));
    exportToCsv(rows, 'gz-athwartship.csv');
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/stability')}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Enine Stabilite (Küçük Açılar)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!!errors.length && (
            <Alert variant="destructive">
              <AlertTitle>Girdi Hatası</AlertTitle>
              <AlertDescription>
                <ul className="list-disc ml-4">
                  {errors.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

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
              <Label>Serbest Yüzey Düzeltmesi (m)</Label>
              <Input type="number" step="0.01" value={freeService} onChange={(e) => setFreeService(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="calculator" onClick={handleCalculate}>Hesapla</Button>
            <Button variant="outline" className="gap-2" onClick={handleExportPng}><Download className="h-4 w-4" /> PNG</Button>
            <Button variant="outline" className="gap-2" onClick={handleExportCsv}><Download className="h-4 w-4" /> CSV</Button>
            <Button variant="ghost" onClick={() => { setResult(null); setErrors([]); }}>Temizle</Button>
            <Button variant="outline" onClick={() => setShowInfo(!showInfo)}>
              {showInfo ? 'Bilgiyi Gizle' : 'Bilgi ve Formüller'}
            </Button>
          </div>

          {showInfo && (
            <Alert>
              <AlertTitle>Enine Stabilite Formülleri ve Bilgileri</AlertTitle>
              <AlertDescription className="space-y-2 text-sm">
                <div><strong>GM:</strong> GM = KB + BM - KG - FSE</div>
                <div><strong>Doğal Periyot:</strong> T ≈ 2π√(k²/g·GM) veya T ≈ 0.8√(B/GM) (yaklaşık)</div>
                <div><strong>GZ (Küçük açılar):</strong> GZ ≈ GM × sin(φ)</div>
                <div><strong>Güverte Kenarı Dalma Açısı:</strong> φ ≈ arctan(B/2T)</div>
                <div><strong>Serbest Yüzey Etkisi:</strong> KG'yi arttırır, GM'yi azaltır</div>
                <div className="text-xs text-muted-foreground mt-2">
                  IMO kriterleri: GM ≥ 0.15m, GZ(30°) ≥ 0.20m, Maks GZ ≥ 25°'de
                </div>
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <div ref={chartRef}>
                <ChartContainer config={{ gz: { label: 'GZ', color: 'hsl(var(--primary))' } }} className="w-full h-56">
                  <LineChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="angle" tickFormatter={(v) => `${v}°`} />
                    <YAxis tickFormatter={(v) => `${v} m`} />
                    <ChartTooltip content={<ChartTooltipContent labelKey="angle" nameKey="gz" />} />
                    <Line type="monotone" dataKey="gz" stroke="var(--color-gz)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-2">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">GM</div>
                  <div className="text-xl font-semibold">{result.gm.toFixed(3)} m</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Pozitif Stabilite Aralığı</div>
                  <div className="text-xl font-semibold">{result.stabilityRange.toFixed(1)}°</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Doğal Periyot</div>
                  <div className="text-xl font-semibold">{result.naturalPeriod.toFixed(2)} s</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Güverte Kenarı Dalma</div>
                  <div className="text-xl font-semibold">{result.deckEdgeAngle.toFixed(1)}°</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}