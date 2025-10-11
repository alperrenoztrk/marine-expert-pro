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
  // Redirect this legacy page into central calculations tab
  if (typeof window !== 'undefined') {
    window.location.replace('/stability/calculations#grainAccount');
  }
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

  return null;
}
