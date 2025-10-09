import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BadgeCheck, PlusCircle, Trash2 } from "lucide-react";
import { EnhancedStabilityChart } from "@/components/stability/EnhancedStabilityChart";
import { GrainStabilityService } from "@/services/grainStability";
import { GrainLoadingPlan, GrainVesselData, GrainCargoType, GrainArrangement } from "@/types/hydrostatic";

export default function StabilityGrainPage() {
  const navigate = useNavigate();

  // Vessel basics
  const [L, setL] = useState(180);
  const [B, setB] = useState(30);
  const [D, setD] = useState(18);
  const [T, setT] = useState(10);
  const [Cb, setCb] = useState(0.75);
  const [Cw, setCw] = useState(0.85);
  const [Cm, setCm] = useState(0.98);
  const [Cp, setCp] = useState(0.77);
  const [Cvp, setCvp] = useState(0.75);

  const [LW, setLW] = useState(8000);
  const [LCG, setLCG] = useState(90);
  const [KG, setKG] = useState(7.5);
  const [KM, setKM] = useState(8.2);
  const [GMmin, setGMmin] = useState(0.30);
  const [FSC, setFSC] = useState(0); // Free surface correction (m)
  const [heelAngles, setHeelAngles] = useState<string>("5,10,12");

  // Grain cargo definition (single type quick input)
  const [grainName, setGrainName] = useState("Wheat");
  const [sf, setSF] = useState(1.35); // m3/t
  const [angle, setAngle] = useState(28); // deg

  // Holds model (multi-hold)
  type UIHold = {
    id: string;
    location: string;
    length: number;
    width: number;
    height: number;
    tonnage: number;
    arrangement: GrainArrangement;
    measures: { shiftingBoard: boolean; feeders: boolean; saucering: boolean; bundlingOrTrimming: boolean };
  };
  const [holds, setHolds] = useState<UIHold[]>([{
    id: "H1",
    location: "No.1 Hold",
    length: 40,
    width: 20,
    height: 12,
    tonnage: 8000,
    arrangement: "full",
    measures: { shiftingBoard: false, feeders: false, saucering: false, bundlingOrTrimming: true }
  }]);

  const addHold = () => {
    const nextIndex = holds.length + 1;
    setHolds(prev => ([...prev, {
      id: `H${nextIndex}`,
      location: `No.${nextIndex} Hold`,
      length: 30,
      width: 18,
      height: 12,
      tonnage: 5000,
      arrangement: "full",
      measures: { shiftingBoard: false, feeders: false, saucering: false, bundlingOrTrimming: false }
    }]));
  };

  const removeHold = (id: string) => {
    setHolds(prev => prev.filter(h => h.id !== id));
  };

  const vessel: GrainVesselData = useMemo(() => ({
    geometry: {
      length: L,
      breadth: B,
      depth: D,
      draft: T,
      blockCoefficient: Cb,
      waterplaneCoefficient: Cw,
      midshipCoefficient: Cm,
      prismaticCoefficient: Cp,
      verticalPrismaticCoefficient: Cvp,
    },
    lightweightTonnes: LW,
    LCGm: LCG,
    VCGm: KG,
    DWTcapacityTonnes: undefined,
    KMm: KM,
    GMm: KM - KG,
    tanks: [],
  }), [L,B,D,T,Cb,Cw,Cm,Cp,Cvp,LW,LCG,KG,KM]);

  const cargo: GrainCargoType = useMemo(() => ({
    name: grainName,
    stowageFactorM3PerT: sf,
    angleOfReposeDeg: angle,
  }), [grainName, sf, angle]);

  const plan: GrainLoadingPlan = useMemo(() => ({
    holds: holds.map(h => ({
      holdId: h.id,
      location: h.location,
      length: h.length,
      width: h.width,
      height: h.height,
      cargoTonnage: h.tonnage,
      arrangement: h.arrangement,
      cargo,
      measures: h.measures,
    }))
  }), [holds, cargo]);

  const result = useMemo(() => {
    const anglesParsed = heelAngles.split(',').map(s => parseFloat(s.trim())).filter(n => !Number.isNaN(n) && n >= 0);
    return GrainStabilityService.compute(vessel, plan, {
      gmMinRequiredM: GMmin,
      heelCheckAnglesDeg: anglesParsed.length ? anglesParsed : [5,10,12],
      freeSurfaceCorrectionM: FSC,
    });
  }, [vessel, plan, GMmin, FSC, heelAngles]);

  const chartData = useMemo(() => {
    return result.angles.map((a, idx) => ({
      angle: a,
      gz: result.gz[idx],
      rightingMoment: result.gz[idx] * result.displacementTonnes * 9.81 / 1000,
      windHeelingArm: result.heelingArm[idx],
      kn: undefined,
      net: result.netGZ[idx],
    }));
  }, [result]);

  const downloadReport = () => {
    const lines: string[] = [];
    lines.push("GRAIN STABILITY REPORT");
    lines.push("======================");
    lines.push("");
    lines.push(`Condition Summary:`);
    lines.push(`Δ: ${result.displacementTonnes.toFixed(1)} t`);
    lines.push(`KG: ${KG.toFixed(3)} m  KM: ${KM.toFixed(3)} m  GM(corr): ${result.gmCorrectedM.toFixed(3)} m`);
    lines.push(`Drafts: F ${result.draftFwdM.toFixed(2)} m  M ${result.draftMeanM.toFixed(2)} m  A ${result.draftAftM.toFixed(2)} m  Trim ${result.trimM.toFixed(2)} m`);
    lines.push("");
    lines.push(`GZ Areas (m·rad): 0-30 ${result.areaGZ_0_30.toFixed(3)} | 0-40 ${result.areaGZ_0_40.toFixed(3)} | 30-40 ${result.areaGZ_30_40.toFixed(3)}`);
    lines.push(`Net Areas (m·rad): 0-30 ${result.areaNet_0_30.toFixed(3)} | 0-40 ${result.areaNet_0_40.toFixed(3)} | 30-40 ${result.areaNet_30_40.toFixed(3)} | Residual φ_eq→40 ${result.residualAreaEq_40.toFixed(3)}`);
    lines.push(`Max GZ: ${result.maxGZ.toFixed(3)} m at ${result.maxGZAngleDeg}°  φ_eq: ${result.phiEquilibriumDeg.toFixed(1)}°`);
    lines.push("");
    lines.push("Check Angles:");
    result.checkAngles?.forEach(r => lines.push(` ${r.angle}°: GZ=${r.gz.toFixed(3)} m, Heel=${r.heeling.toFixed(3)} m, Net=${r.net.toFixed(3)} m`));
    lines.push("");
    lines.push("Criteria:");
    result.criteria.forEach(c => lines.push(` ${c.name}: ${c.value.toFixed(3)} / ${c.requirement.toFixed(3)}  ${c.passed ? 'PASS' : 'FAIL'}`));
    lines.push("");
    lines.push(`Compliance: ${result.compliant ? 'Meets the requirements of the International Grain Code (IMO Res. MSC.23(59))' : 'Does NOT meet the requirements of the International Grain Code (IMO Res. MSC.23(59))'}`);

    const blob = new Blob([lines.join("\n")], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grain_stability_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/stability')}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Tahıl Stabilitesi
            {result.compliant ? <BadgeCheck className="h-5 w-5 text-green-600" /> : null}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>L (m)</Label>
              <Input type="number" value={L} onChange={(e)=> setL(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>B (m)</Label>
              <Input type="number" value={B} onChange={(e)=> setB(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>D (m)</Label>
              <Input type="number" value={D} onChange={(e)=> setD(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>T (m)</Label>
              <Input type="number" value={T} onChange={(e)=> setT(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>Cb</Label>
              <Input type="number" step="0.01" value={Cb} onChange={(e)=> setCb(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>Cw</Label>
              <Input type="number" step="0.01" value={Cw} onChange={(e)=> setCw(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>Cm</Label>
              <Input type="number" step="0.01" value={Cm} onChange={(e)=> setCm(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>Cp</Label>
              <Input type="number" step="0.01" value={Cp} onChange={(e)=> setCp(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>Cvp</Label>
              <Input type="number" step="0.01" value={Cvp} onChange={(e)=> setCvp(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>LW (t)</Label>
              <Input type="number" value={LW} onChange={(e)=> setLW(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>LCG (m)</Label>
              <Input type="number" value={LCG} onChange={(e)=> setLCG(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>KG (m)</Label>
              <Input type="number" step="0.01" value={KG} onChange={(e)=> setKG(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>KM (m)</Label>
              <Input type="number" step="0.01" value={KM} onChange={(e)=> setKM(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>GM min (m)</Label>
              <Input type="number" step="0.01" value={GMmin} onChange={(e)=> setGMmin(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>Free surface corr. (m)</Label>
              <Input type="number" step="0.01" value={FSC} onChange={(e)=> setFSC(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>Check angles (°)</Label>
              <Input value={heelAngles} onChange={(e)=> setHeelAngles(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Tahıl türü</Label>
              <Input value={grainName} onChange={(e)=> setGrainName(e.target.value)} />
            </div>
            <div>
              <Label>Stowage factor (m³/t)</Label>
              <Input type="number" step="0.01" value={sf} onChange={(e)=> setSF(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <Label>Angle of repose (°)</Label>
              <Input type="number" step="0.1" value={angle} onChange={(e)=> setAngle(parseFloat(e.target.value)||0)} />
            </div>
          </div>

          {/* Holds editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">Ambarlar</div>
              <Button variant="outline" size="sm" onClick={addHold} className="gap-1"><PlusCircle className="h-4 w-4"/>Ambar Ekle</Button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {holds.map((h, idx) => (
                <div key={h.id} className="grid grid-cols-2 md:grid-cols-8 gap-2 items-end border rounded-md p-2">
                  <div>
                    <Label>Konum</Label>
                    <Input value={h.location} onChange={(e)=> setHolds(prev=> prev.map(x=> x.id===h.id?{...x, location: e.target.value}:x))} />
                  </div>
                  <div>
                    <Label>Tonaj (t)</Label>
                    <Input type="number" value={h.tonnage} onChange={(e)=> setHolds(prev=> prev.map(x=> x.id===h.id?{...x, tonnage: parseFloat(e.target.value)||0}:x))} />
                  </div>
                  <div>
                    <Label>L (m)</Label>
                    <Input type="number" value={h.length} onChange={(e)=> setHolds(prev=> prev.map(x=> x.id===h.id?{...x, length: parseFloat(e.target.value)||0}:x))} />
                  </div>
                  <div>
                    <Label>B (m)</Label>
                    <Input type="number" value={h.width} onChange={(e)=> setHolds(prev=> prev.map(x=> x.id===h.id?{...x, width: parseFloat(e.target.value)||0}:x))} />
                  </div>
                  <div>
                    <Label>H (m)</Label>
                    <Input type="number" value={h.height} onChange={(e)=> setHolds(prev=> prev.map(x=> x.id===h.id?{...x, height: parseFloat(e.target.value)||0}:x))} />
                  </div>
                  <div>
                    <Label>Düzen</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={h.arrangement}
                      onChange={(e)=> setHolds(prev=> prev.map(x=> x.id===h.id?{...x, arrangement: e.target.value as GrainArrangement}:x))}>
                      <option value="full">Full</option>
                      <option value="part">Part</option>
                      <option value="trimmed">Trimmed</option>
                      <option value="untrimmed">Untrimmed</option>
                    </select>
                  </div>
                  <div className="col-span-2 grid grid-cols-4 gap-2">
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" checked={h.measures.shiftingBoard} onChange={(e)=> setHolds(prev=> prev.map(x=> x.id===h.id?{...x, measures:{...x.measures, shiftingBoard: e.target.checked}}:x))} />
                      Shifting board
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" checked={h.measures.feeders} onChange={(e)=> setHolds(prev=> prev.map(x=> x.id===h.id?{...x, measures:{...x.measures, feeders: e.target.checked}}:x))} />
                      Feeders
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" checked={h.measures.saucering} onChange={(e)=> setHolds(prev=> prev.map(x=> x.id===h.id?{...x, measures:{...x.measures, saucering: e.target.checked}}:x))} />
                      Saucering
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" checked={h.measures.bundlingOrTrimming} onChange={(e)=> setHolds(prev=> prev.map(x=> x.id===h.id?{...x, measures:{...x.measures, bundlingOrTrimming: e.target.checked}}:x))} />
                      Bundling/Trimming
                    </label>
                  </div>
                  <div className="md:col-span-1 col-span-2 flex justify-end">
                    <Button variant="ghost" size="icon" onClick={()=> removeHold(h.id)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">GM (m)</div>
              <div className="text-xl font-semibold">{result.gmCorrectedM.toFixed(3)}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Max GZ (m)</div>
              <div className="text-xl font-semibold">{result.maxGZ.toFixed(3)}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Max GZ Açısı (°)</div>
              <div className="text-xl font-semibold">{result.maxGZAngleDeg}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Uygunluk</div>
              <div className="text-xl font-semibold">{result.compliant ? 'Uygun' : 'Uygun değil'}</div>
            </div>
          </div>

          <EnhancedStabilityChart
            data={chartData.map(d => ({ angle: d.angle, gz: d.gz, rightingMoment: d.rightingMoment, windHeelingArm: d.windHeelingArm, net: d.net }))}
            imoCriteria={{ area0to30: result.areaGZ_0_30, area0to40: result.areaGZ_0_40, area30to40: result.areaGZ_30_40, compliance: result.compliant }}
            title="GZ ve Tahıl Heeling Kolu"
            showWindHeeling
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>IMO Grain Code Kriterleri</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {result.criteria.map((c) => (
            <div key={c.name} className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">{c.name}</div>
              <div className="text-lg font-semibold">{c.value.toFixed(3)} / {c.requirement.toFixed(3)}</div>
              <div className="text-sm">{c.passed ? '✓' : '✗'}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Condition summary and report */}
      <Card>
        <CardHeader>
          <CardTitle>Condition Summary & Rapor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Δ (t)</div>
              <div className="text-lg font-semibold">{result.displacementTonnes.toFixed(1)}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">KG / KM / GM(corr) (m)</div>
              <div className="text-lg font-semibold">{KG.toFixed(2)} / {KM.toFixed(2)} / {result.gmCorrectedM.toFixed(2)}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Drafts (F/M/A) m</div>
              <div className="text-lg font-semibold">{result.draftFwdM.toFixed(2)} / {result.draftMeanM.toFixed(2)} / {result.draftAftM.toFixed(2)}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Trim (m)</div>
              <div className="text-lg font-semibold">{result.trimM.toFixed(2)}</div>
            </div>
          </div>

          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">Compliance</div>
            <div className="text-lg font-semibold">{result.compliant ? 'Meets the requirements of the International Grain Code (IMO Res. MSC.23(59))' : 'Does NOT meet the International Grain Code (IMO Res. MSC.23(59))'}</div>
          </div>

          <div className="flex gap-2">
            <Button onClick={downloadReport}>Raporu İndir</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
