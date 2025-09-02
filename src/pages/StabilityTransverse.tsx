import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download } from "lucide-react";
import { HydrostaticCalculations } from "@/services/hydrostaticCalculations";
import { ShipGeometry } from "@/types/hydrostatic";

export default function StabilityTransverse() {
  const [geometry, setGeometry] = useState<ShipGeometry>({
    length: 120,
    breadth: 20,
    depth: 12,
    draft: 8,
    blockCoefficient: 0.75,
    waterplaneCoefficient: 0.85,
    midshipCoefficient: 0.98,
    prismaticCoefficient: 0.78,
    verticalPrismaticCoefficient: 0.85
  });

  const [kg, setKG] = useState<number>(8.5);
  const [w, setW] = useState<number>(50); // tonnes
  const [d, setD] = useState<number>(5); // meters
  const [deltaOverride, setDeltaOverride] = useState<string>("");
  const [pendulum, setPendulum] = useState({ deviation: 0.2, length: 3 });
  const [crane, setCrane] = useState({ hook: 16, load: 2 });
  const [dock, setDock] = useState({ mct1cm: 150, trimCm: 30, t: 10 });
  const [fsmRect, setFSMRect] = useState({ L: 10, B: 6, rho: 1.025 });
  const [angle, setAngle] = useState<number>(15);

  const displacement = useMemo(() => {
    const base = HydrostaticCalculations.calculateDisplacement(geometry).displacement;
    if (deltaOverride.trim().length === 0) return base;
    const v = parseFloat(deltaOverride);
    return Number.isFinite(v) && v > 0 ? v : base;
  }, [geometry, deltaOverride]);

  const centers = useMemo(() => HydrostaticCalculations.calculateCenterPoints(geometry, kg), [geometry, kg]);

  // 1) GM = KM - KG
  const gm = useMemo(() => centers.kmt - kg, [centers.kmt, kg]);

  // 2) GG1 = w*d/Δ
  const gg1 = useMemo(() => HydrostaticCalculations.calculateGG1(w, d, displacement), [w, d, displacement]);

  // 3) tanφ = GZ/GM and GZ (wall-sided) and KN-GZ relation
  const gz = useMemo(() => HydrostaticCalculations.calculateLargeAngleGZ(geometry, kg, angle), [geometry, kg, angle]);
  const heelFromGZ = useMemo(() => HydrostaticCalculations.calculateHeelAngleFromGZ(gz, Math.max(1e-6, gm)), [gz, gm]);
  const knApprox = useMemo(() => HydrostaticCalculations.calculateKNApprox(geometry, kg, angle), [geometry, kg, angle]);
  const gzFromKN = useMemo(() => HydrostaticCalculations.calculateGZFromKN(knApprox, kg, angle), [knApprox, kg, angle]);

  // 4) Pendulum
  const heelPendulum = useMemo(() => HydrostaticCalculations.calculatePendulumHeelAngle(pendulum.deviation, pendulum.length), [pendulum]);

  // 5) Crane/Derrick ΔKG
  const deltaKGCrane = useMemo(() => HydrostaticCalculations.calculateCraneDeltaKG(w, crane.hook, crane.load, displacement), [w, crane, displacement]);

  // 6) Dock critical GM
  const Pdock = useMemo(() => HydrostaticCalculations.calculateDockReactionP(dock.mct1cm, dock.trimCm, Math.max(1e-6, dock.t)), [dock]);
  const GMkritik = useMemo(() => HydrostaticCalculations.calculateCriticalGMDock(Pdock, centers.kmt, displacement), [Pdock, centers.kmt, displacement]);

  // 7) FSM and ΔKG
  const FSMrect = useMemo(() => HydrostaticCalculations.calculateFSMRectangularTank(fsmRect.L, fsmRect.B, fsmRect.rho), [fsmRect]);
  const dKG_FSM = useMemo(() => HydrostaticCalculations.calculateDeltaKGFromFSM(FSMrect, displacement), [FSMrect, displacement]);

  // 8) Roll period simplified: T = C · B / sqrt(GM)
  const Troll = useMemo(() => HydrostaticCalculations.calculateRollPeriodSimplified(geometry.blockCoefficient, geometry.breadth, Math.max(1e-6, gm)), [geometry, gm]);

  const downloadJSON = () => {
    const data = {
      geometry,
      kg,
      displacement,
      results: {
        KB: centers.kb,
        BM: centers.bmt,
        KM: centers.kmt,
        GM: gm,
        GG1: gg1,
        angle,
        GZ: gz,
        heelFromGZ,
        KNapprox: knApprox,
        GZfromKN: gzFromKN,
        heelPendulum,
        deltaKGCrane,
        dock: { Pdock, GMkritik },
        FSMrect,
        dKG_FSM,
        Troll
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transverse_stability_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4" data-no-translate>
      <Card>
        <CardHeader>
          <CardTitle>Enine Stabilite (Transverse Stability)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Gemi Geometrisi</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="L">L (m)</Label>
                  <Input id="L" type="number" value={geometry.length} onChange={e => setGeometry(g => ({ ...g, length: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label htmlFor="B">B (m)</Label>
                  <Input id="B" type="number" value={geometry.breadth} onChange={e => setGeometry(g => ({ ...g, breadth: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label htmlFor="D">D (m)</Label>
                  <Input id="D" type="number" value={geometry.depth} onChange={e => setGeometry(g => ({ ...g, depth: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label htmlFor="T">T (m)</Label>
                  <Input id="T" type="number" value={geometry.draft} onChange={e => setGeometry(g => ({ ...g, draft: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label htmlFor="Cb">Cb</Label>
                  <Input id="Cb" type="number" step="0.01" value={geometry.blockCoefficient} onChange={e => setGeometry(g => ({ ...g, blockCoefficient: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label htmlFor="Cw">Cw</Label>
                  <Input id="Cw" type="number" step="0.01" value={geometry.waterplaneCoefficient} onChange={e => setGeometry(g => ({ ...g, waterplaneCoefficient: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label htmlFor="Cm">Cm</Label>
                  <Input id="Cm" type="number" step="0.01" value={geometry.midshipCoefficient} onChange={e => setGeometry(g => ({ ...g, midshipCoefficient: parseFloat(e.target.value) }))} />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Durum Parametreleri</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="KG">KG (m)</Label>
                  <Input id="KG" type="number" value={kg} onChange={e => setKG(parseFloat(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="Delta">Δ (ton) override</Label>
                  <Input id="Delta" placeholder="opsiyonel" value={deltaOverride} onChange={e => setDeltaOverride(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="w">w (ton)</Label>
                  <Input id="w" type="number" value={w} onChange={e => setW(parseFloat(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="d">d (m)</Label>
                  <Input id="d" type="number" value={d} onChange={e => setD(parseFloat(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="angle">φ (deg)</Label>
                  <Input id="angle" type="number" value={angle} onChange={e => setAngle(parseFloat(e.target.value))} />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Metric title="KB (m)" value={centers.kb} digits={3} />
            <Metric title="BMt (m)" value={centers.bmt} digits={3} />
            <Metric title="KMt (m)" value={centers.kmt} digits={3} />
            <Metric title="GMt (m)" value={gm} digits={3} />
            <Metric title="Δ (ton)" value={displacement} digits={1} />
            <Metric title="GG₁ (m)" value={gg1} digits={4} subtitle="w·d/Δ" />
            <Metric title="GZ (m)" value={gz} digits={4} subtitle={`φ=${angle}°`} />
            <Metric title="φ (GZ'den)" value={heelFromGZ} digits={2} subtitle="tanφ = GZ/GM" />
            <Metric title="KN≈ (m)" value={knApprox} digits={4} />
            <Metric title="GZ(KN) (m)" value={gzFromKN} digits={4} subtitle="KN−KG·sinφ" />
            <Metric title="ΔKG (Kren) (m)" value={deltaKGCrane} digits={4} subtitle="w(h_hook−h_load)/Δ" />
            <Metric title="P (ton)" value={Pdock} digits={2} subtitle="MCT1cm·Trim/t" />
            <Metric title="GM_kritik (m)" value={GMkritik} digits={3} subtitle="(P·KM)/Δ" />
            <Metric title="FSM_rect (t·m)" value={FSMrect} digits={2} subtitle="L·B³/12·ρ" />
            <Metric title="ΔKG(FSM) (m)" value={dKG_FSM} digits={4} subtitle="FSM/Δ" />
            <Metric title="T (s)" value={Troll} digits={2} subtitle="C·B/√GM" />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Kren Operasyonu</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>h_hook (m)</Label>
                  <Input type="number" value={crane.hook} onChange={e => setCrane(c => ({ ...c, hook: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>h_load (m)</Label>
                  <Input type="number" value={crane.load} onChange={e => setCrane(c => ({ ...c, load: parseFloat(e.target.value) }))} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Havuz Hesabı</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>MCT1cm (t·m/cm)</Label>
                  <Input type="number" value={dock.mct1cm} onChange={e => setDock(x => ({ ...x, mct1cm: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>Trim (cm)</Label>
                  <Input type="number" value={dock.trimCm} onChange={e => setDock(x => ({ ...x, trimCm: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>t (m)</Label>
                  <Input type="number" value={dock.t} onChange={e => setDock(x => ({ ...x, t: parseFloat(e.target.value) }))} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Dikdörtgen Tank FSM</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>L (m)</Label>
                  <Input type="number" value={fsmRect.L} onChange={e => setFSMRect(x => ({ ...x, L: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>B (m)</Label>
                  <Input type="number" value={fsmRect.B} onChange={e => setFSMRect(x => ({ ...x, B: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <Label>ρ (t/m³)</Label>
                  <Input type="number" step="0.001" value={fsmRect.rho} onChange={e => setFSMRect(x => ({ ...x, rho: parseFloat(e.target.value) }))} />
                </div>
              </div>
            </div>
          </div>

          <Alert>
            <AlertTitle>Notlar</AlertTitle>
            <AlertDescription>
              GM = KM − KG; GG₁ = w·d/Δ; GZ ≈ GM·sinφ (küçük açı); KN→GZ: GZ = KN − KG·sinφ; FSM→ΔKG: FSM/Δ; Havuzda kritik GM: (P·KM)/Δ; Yalpa periyodu: T = C·B/√GM.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button onClick={downloadJSON} className="gap-2">
              <Download className="h-4 w-4" /> Sonuçları İndir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ title, value, digits = 2, subtitle }: { title: string; value: number; digits?: number; subtitle?: string }) {
  const v = Number.isFinite(value) ? value : 0;
  return (
    <div className="rounded-lg border p-3">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-xl font-semibold">{v.toFixed(digits)}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
    </div>
  );
}

