import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useRef, useState } from "react";
import { ShipGeometry } from "@/types/hydrostatic";
import { HydrostaticCalculations } from "@/services/hydrostaticCalculations";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HydrostaticUtils } from "@/utils/hydrostaticUtils";
import { exportNodeToPng, exportToCsv } from "@/utils/exportUtils";

export default function StabilityGZIMO() {
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

  const [data, setData] = useState<ReturnType<typeof HydrostaticCalculations.calculateStabilityData> | null>(null);
  const [imo, setImo] = useState<ReturnType<typeof HydrostaticCalculations.calculateIMOStabilityCriteria> | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (key: keyof ShipGeometry) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setGeometry((prev) => ({ ...prev, [key]: isNaN(value) ? 0 : value }));
  };

  const handleCalculate = () => {
    const v = HydrostaticUtils.validateShipGeometry(geometry);
    setErrors(v.errors);
    if (!v.isValid) {
      setData(null);
      setImo(null);
      return;
    }
    const stability = HydrostaticCalculations.calculateStabilityData(geometry, kg);
    const imoCriteria = HydrostaticCalculations.calculateIMOStabilityCriteria(stability);
    setData(stability);
    setImo(imoCriteria);
  };

  const complianceText = useMemo(() => {
    if (!imo) return '';
    return imo.compliance ? 'Uygun' : 'Uygun değil';
  }, [imo]);

  const chartData = useMemo(() => {
    if (!data) return [] as { angle: number; gz: number }[];
    return data.angles.map((a, i) => ({ angle: a, gz: Number(data.gz[i].toFixed(3)) }));
  }, [data]);

  const handleExportPng = async () => {
    if (chartRef.current) await exportNodeToPng(chartRef.current, 'gz-curve.png');
  };

  const handleExportCsv = () => {
    if (!data) return;
    exportToCsv(data.angles.map((a, i) => ({ angle: a, gz: data.gz[i], moment_kNm: data.rightingMoment[i] / 1000 })), 'gz-curve.csv');
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/stability')}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>GZ Eğrisi ve IMO Kriterleri</CardTitle>
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
              <Label>KG (m)</Label>
              <Input type="number" step="0.01" value={kg} onChange={(e) => setKg(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="calculator" onClick={handleCalculate}>Hesapla</Button>
            <Button variant="outline" className="gap-2" onClick={handleExportPng}><Download className="h-4 w-4" /> PNG</Button>
            <Button variant="outline" className="gap-2" onClick={handleExportCsv}><Download className="h-4 w-4" /> CSV</Button>
            <Button variant="ghost" onClick={() => { setData(null); setImo(null); setErrors([]); }}>Temizle</Button>
          </div>

          {data && imo && (
            <div className="space-y-4">
              <div ref={chartRef}>
                <ChartContainer
                  config={{ gz: { label: 'GZ', color: 'hsl(var(--primary))' } }}
                  className="w-full h-60"
                >
                  <LineChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="angle" tickFormatter={(v) => `${v}°`} />
                    <YAxis tickFormatter={(v) => `${v} m`} />
                    <ChartTooltip content={<ChartTooltipContent labelKey="angle" nameKey="gz" />} />
                    <Line type="monotone" dataKey="gz" stroke="var(--color-gz)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Maks GZ</div>
                  <div className="text-xl font-semibold">{data.maxGz.toFixed(3)} m</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Maks GZ Açısı</div>
                  <div className="text-xl font-semibold">{data.maxGzAngle}°</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Vanishing Angle</div>
                  <div className="text-xl font-semibold">{data.vanishingAngle}°</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Alan (0–30°)</div>
                  <div className="text-xl font-semibold">{imo.area0to30.toFixed(3)} m·rad</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Alan (0–40°)</div>
                  <div className="text-xl font-semibold">{imo.area0to40.toFixed(3)} m·rad</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Alan (30–40°)</div>
                  <div className="text-xl font-semibold">{imo.area30to40.toFixed(3)} m·rad</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Uygunluk</div>
                  <div className="text-xl font-semibold">{complianceText}</div>
                </div>
              </div>

              {/* Basit GZ tablo önizlemesi */}
              <div className="rounded-md border p-3 overflow-auto max-h-80">
                <div className="text-sm font-semibold mb-2">GZ Eğrisi (0–90°)</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="text-left p-1">Açı (°)</th>
                      <th className="text-left p-1">GZ (m)</th>
                      <th className="text-left p-1">Moment (kNm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.angles.map((a, i) => (
                      <tr key={a} className="border-t">
                        <td className="p-1">{a}</td>
                        <td className="p-1">{data.gz[i].toFixed(3)}</td>
                        <td className="p-1">{(data.rightingMoment[i] / 1000).toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}