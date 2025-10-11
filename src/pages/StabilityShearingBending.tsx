import { useMemo, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ArrowLeft, Activity, Waves, LineChart, Plus, Trash2, Ruler } from "lucide-react";
import {
  computeBendingStressMPa,
  computeReactions,
  computeShearStressMPa,
  computeStillWaterBMEstimate,
  computeUniformDistributedLoadFromGeometry,
  computeWaveInducedBM,
  findCriticals,
  sampleSFBM,
  type PointLoad,
} from "@/utils/shearingBendingCalculations";
import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";

export default function StabilityShearingBendingPage() {
  // Geometry & global inputs
  const [length, setLength] = useState<string>("120");
  const [useGeometryForW, setUseGeometryForW] = useState<boolean>(true);
  const [breadth, setBreadth] = useState<string>("20");
  const [draft, setDraft] = useState<string>("9.5");
  const [cb, setCb] = useState<string>("0.72");
  const [uniformW, setUniformW] = useState<string>("0"); // kN/m if direct

  // Point loads
  const [loads, setLoads] = useState<PointLoad[]>([
    { id: "p1", positionMeters: 30, magnitudeKN: 1500, label: "Cargo 1" },
    { id: "p2", positionMeters: 85, magnitudeKN: 1800, label: "Cargo 2" },
  ]);

  // Wave induced inputs
  const [hogSag, setHogSag] = useState<"hog" | "sag">("hog");
  const [useMidshipBM, setUseMidshipBM] = useState<boolean>(true);
  const [waveCoeff, setWaveCoeff] = useState<string>("0.10"); // kN/m^3 (empirical)

  // Stress inputs
  const [sectionModulus, setSectionModulus] = useState<string>("5000"); // m^3
  const [shearArea, setShearArea] = useState<string>("12"); // m^2 (web area approximation)

  const L = parseFloat(length);
  const B = parseFloat(breadth);
  const T = parseFloat(draft);
  const Cb = parseFloat(cb);
  const wFromGeom = computeUniformDistributedLoadFromGeometry(B, T, Cb); // kN/m
  const w = useGeometryForW ? wFromGeom : parseFloat(uniformW) || 0;

  const { data, reactions } = useMemo(() => {
    const safeLoads = loads
      .filter((p) => isFinite(p.positionMeters) && isFinite(p.magnitudeKN))
      .map((p) => ({ ...p, positionMeters: Math.max(0, Math.min(p.positionMeters, isFinite(L) ? L : p.positionMeters)) }));
    return sampleSFBM(isFinite(L) ? L : 0, isFinite(w) ? w : 0, safeLoads, 241);
  }, [L, w, loads]);

  const crit = useMemo(() => findCriticals(data), [data]);

  const swbm = useMemo(() => computeStillWaterBMEstimate(data, useMidshipBM), [data, useMidshipBM]);
  const wibm = useMemo(() => computeWaveInducedBM(isFinite(L) ? L : 0, isFinite(B) ? B : 0, isFinite(Cb) ? Cb : 0, parseFloat(waveCoeff) || 0), [L, B, Cb, waveCoeff]);
  const totalBM = useMemo(() => (hogSag === "hog" ? swbm + wibm : swbm - wibm), [swbm, wibm, hogSag]);

  const bendingStressMPa = useMemo(() => computeBendingStressMPa(Math.abs(totalBM), parseFloat(sectionModulus) || 0), [totalBM, sectionModulus]);
  const shearStressMPa = useMemo(() => computeShearStressMPa(Math.abs(crit.maxAbsShear.value), parseFloat(shearArea) || 0), [crit.maxAbsShear.value, shearArea]);

  const addLoad = () => {
    const nextIndex = loads.length + 1;
    setLoads((prev) => [...prev, { id: `p${nextIndex}`, positionMeters: Math.max(0, Math.min(isFinite(L) ? L / 2 : 0, isFinite(L) ? L : 0)), magnitudeKN: 1000, label: `Load ${nextIndex}` }]);
  };
  const removeLoad = (id: string) => setLoads((prev) => prev.filter((p) => p.id !== id));
  const updateLoad = (id: string, field: keyof PointLoad, value: string) => {
    setLoads((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: field === "positionMeters" || field === "magnitudeKN" ? parseFloat(value) || 0 : value } : p)));
  };

  return (
    <MobileLayout>
      <div className="space-y-4" data-no-translate>
        <div className="flex items-center justify-between">
          <Link to="/stability/calculations#shearBending">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Stabilite
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" /> Shear Force & Bending Moment
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5" /> Overview — SF and BM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Shear Force V(x)</strong>: Net vertical force across a section at distance x.</li>
              <li><strong>Bending Moment M(x)</strong>: Moment causing bending; V(x)=dM/dx, M(x)=∫V(x)dx.</li>
              <li><strong>Hogging/Sagging</strong>: Orta kesitte yukarı (+) veya aşağı (−) eğilme. V=0 noktası genelde |M| maksimumudur.</li>
              <li><strong>Basit Model</strong>: UDL (w) + konsantre yükler ve uç mesnet reaksiyonları ile SF/BM diyagramı.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" /> Calculation — Beam Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="length">Uzunluk L (m)</Label>
                <Input id="length" type="number" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} />
              </div>
              <div className="md:col-span-3 flex items-end gap-2">
                <Button type="button" variant={useGeometryForW ? "default" : "outline"} onClick={() => setUseGeometryForW(true)}>
                  w from geometry (kN/m)
                </Button>
                <Button type="button" variant={!useGeometryForW ? "default" : "outline"} onClick={() => setUseGeometryForW(false)}>
                  direct w (kN/m)
                </Button>
                {!useGeometryForW && (
                  <div className="flex-1">
                    <Label htmlFor="w">w (kN/m)</Label>
                    <Input id="w" type="number" step="1" value={uniformW} onChange={(e) => setUniformW(e.target.value)} />
                  </div>
                )}
              </div>
            </div>

            {useGeometryForW && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="breadth">Breadth B (m)</Label>
                  <Input id="breadth" type="number" step="0.1" value={breadth} onChange={(e) => setBreadth(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="draft">Draft T (m)</Label>
                  <Input id="draft" type="number" step="0.1" value={draft} onChange={(e) => setDraft(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="cb">Cb</Label>
                  <Input id="cb" type="number" step="0.01" value={cb} onChange={(e) => setCb(e.target.value)} />
                </div>
                <div className="flex items-end">
                  <div className="w-full bg-primary/10 border border-primary/20 rounded p-2 text-sm">
                    w ≈ {wFromGeom.toFixed(1)} kN/m
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-2"><Ruler className="h-4 w-4" /> Point Loads</h4>
                <Button type="button" size="sm" className="gap-2" onClick={addLoad}><Plus className="h-4 w-4" /> Add</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
                {loads.map((p) => (
                  <div key={p.id} className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-4">
                      <Label>Label</Label>
                      <Input value={p.label ?? ""} onChange={(e) => updateLoad(p.id, "label", e.target.value)} />
                    </div>
                    <div className="md:col-span-4">
                      <Label>Position x (m)</Label>
                      <Input type="number" step="0.1" value={isFinite(p.positionMeters) ? p.positionMeters : 0}
                             onChange={(e) => updateLoad(p.id, "positionMeters", e.target.value)} />
                    </div>
                    <div className="md:col-span-3">
                      <Label>Magnitude (kN)</Label>
                      <Input type="number" step="1" value={isFinite(p.magnitudeKN) ? p.magnitudeKN : 0}
                             onChange={(e) => updateLoad(p.id, "magnitudeKN", e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                      <Button variant="ghost" size="icon" onClick={() => removeLoad(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shear Force Diagram V(x)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <RLineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="x" label={{ value: "x (m)", position: "insideBottom", offset: -5 }} />
                      <YAxis label={{ value: "V (kN)", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
                      {loads.map((p) => (
                        <ReferenceLine key={`lv-${p.id}`} x={p.positionMeters} stroke="#bbb" strokeDasharray="2 2" />
                      ))}
                      {crit.zeroShearAtX !== null && (
                        <ReferenceLine x={crit.zeroShearAtX} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "V=0", position: "top" }} />
                      )}
                      <Line type="monotone" dataKey="shearKN" name="V (kN)" stroke="#ef4444" dot={false} strokeWidth={2} />
                    </RLineChart>
                  </ResponsiveContainer>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>RA = {reactions.reactionA_KN.toFixed(1)} kN</div>
                    <div>RB = {reactions.reactionB_KN.toFixed(1)} kN</div>
                    <div>Vmax = {crit.maxAbsShear.value.toFixed(1)} kN @ x≈{crit.maxAbsShear.x.toFixed(1)} m</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bending Moment Diagram M(x)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <RLineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="x" label={{ value: "x (m)", position: "insideBottom", offset: -5 }} />
                      <YAxis label={{ value: "M (kN·m)", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
                      {loads.map((p) => (
                        <ReferenceLine key={`lm-${p.id}`} x={p.positionMeters} stroke="#bbb" strokeDasharray="2 2" />
                      ))}
                      <Line type="monotone" dataKey="momentKNm" name="M (kN·m)" stroke="#3b82f6" dot={false} strokeWidth={2} />
                    </RLineChart>
                  </ResponsiveContainer>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Mmax = {Math.max(Math.abs(crit.maxMoment.value), Math.abs(crit.minMoment.value)).toFixed(1)} kN·m</div>
                    <div>Midship M ≈ {swbm.toFixed(1)} kN·m</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="wave-coeff">Wave coefficient C (kN/m³)</Label>
                <Input id="wave-coeff" type="number" step="0.01" value={waveCoeff} onChange={(e) => setWaveCoeff(e.target.value)} />
              </div>
              <div className="flex items-end gap-2">
                <Button type="button" variant={hogSag === "hog" ? "default" : "outline"} onClick={() => setHogSag("hog")}>Hogging (+)</Button>
                <Button type="button" variant={hogSag === "sag" ? "default" : "outline"} onClick={() => setHogSag("sag")}>Sagging (−)</Button>
              </div>
              <div className="flex items-end gap-2">
                <Button type="button" variant={useMidshipBM ? "default" : "outline"} onClick={() => setUseMidshipBM(true)}>Midship BM</Button>
                <Button type="button" variant={!useMidshipBM ? "default" : "outline"} onClick={() => setUseMidshipBM(false)}>|M| Maximum</Button>
              </div>
            </div>
            <div className="bg-muted/30 rounded p-3 grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-sm">
              <div>SWBM ≈ {swbm.toFixed(1)} kN·m</div>
              <div>WIBM ≈ {wibm.toFixed(1)} kN·m</div>
              <div>Total BM ≈ {totalBM.toFixed(1)} kN·m</div>
              <div>V=0 @ x≈{crit.zeroShearAtX !== null ? crit.zeroShearAtX.toFixed(1) : "—"} m</div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="z">Section Modulus Z (m³)</Label>
                <Input id="z" type="number" step="1" value={sectionModulus} onChange={(e) => setSectionModulus(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="area">Shear Area A (m²)</Label>
                <Input id="area" type="number" step="0.1" value={shearArea} onChange={(e) => setShearArea(e.target.value)} />
              </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-3 bg-primary/10 border border-primary/20 rounded p-3 text-sm">
                <div>σ_bend ≈ {bendingStressMPa.toFixed(3)} MPa</div>
                <div>τ_shear ≈ {shearStressMPa.toFixed(3)} MPa</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}
