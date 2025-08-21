import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Package, Truck, AlertTriangle, CheckCircle, Wheat, Boxes, DollarSign, Shield, LayoutGrid, FileDown, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { HydrostaticCalculations } from "@/services/hydrostaticCalculations";
import type { ShipGeometry } from "@/types/hydrostatic";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CargoData {
  // Ship particulars
  lightDisplacement: number; // Light ship displacement (tonnes)
  deadweight: number; // Deadweight capacity (tonnes)
  grossTonnage: number; // GT
  netTonnage: number; // NT
  
  // Cargo details
  cargoWeight: number; // Cargo weight (tonnes)
  cargoVolume: number; // Cargo volume (m³)
  stowageFactor: number; // Stowage factor (m³/tonne)
  
  // Hold data
  holdLength: number; // Hold length (m)
  holdBreadth: number; // Hold breadth (m)
  holdHeight: number; // Hold height (m)
  
  // Positions
  cargoLCG: number; // Cargo LCG from AP (m)
  cargoTCG: number; // Cargo TCG from CL (m)
  cargoVCG: number; // Cargo VCG from baseline (m)
}

interface DraftSurveyData {
  // Before loading
  draftForeBefore: number;
  draftMidBefore: number;
  draftAftBefore: number;
  
  // After loading
  draftForeAfter: number;
  draftMidAfter: number;
  draftAftAfter: number;
  
  // Corrections
  densityCorrection: number;
  trimCorrection: number;
  deformationCorrection: number;
}

interface CargoResult {
  loadedDisplacement: number;
  cargoCapacity: number;
  utilizationPercentage: number;
  stowageEfficiency: number;
  brokenStowage: number;
  
  // Stability effects
  newKG: number;
  newLCG: number;
  stabilityStatus: 'good' | 'acceptable' | 'poor';
  
  // Load planning
  recommendedSequence: string[];
  securityForces: {
    longitudinal: number;
    transverse: number;
    vertical: number;
  };
  
  recommendations: string[];
}

interface GrainStabilityData {
  grainType: string;
  angle_of_repose: number; // degrees
  volumetricWeight: number; // tonnes/m³
  shifting_moment: number; // tonne.m
  filled_volume: number; // m³
  void_spaces: number; // m³
}

interface DistributionItem {
  name: string;
  weight: number; // t
  lcg: number; // m
  tcg: number; // m
  vcg: number; // m
}

interface ContainerItem {
  id: string;
  type: '20' | '40';
  weight: number; // t (gross)
  bay: number;
  row: number;
  tier: number;
  vcg: number; // m (approx)
  tcg: number; // m (from CL)
  imdgClass?: string; // optional DG class for optimization checks
  isoCode?: string;
  reefer?: boolean;
  oog?: boolean;
  vgm?: number; // Verified Gross Mass
}

interface DangerousGoodsItem {
  id: string;
  un: string;
  cls: string; // IMDG class
  bay: number;
  subRisk?: string;
  segGroup?: string; // segregation group
  onDeckOnly?: boolean;
}

interface CostInputs {
  freightPerTon?: number;
  insurancePct?: number; // % of cargo value
  cargoValue?: number; // USD
  stevedoring?: number;
  handling?: number;
  storage?: number;
  documentation?: number;
  bafPct?: number; // Bunker adjustment factor %
  cafPct?: number; // Currency adjustment factor %
}

type CargoCalcProps = { initialTab?: string; singleMode?: boolean };

export const CargoCalculations = ({ initialTab, singleMode }: CargoCalcProps = {}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  
  const [cargoData, setCargoData] = useState<Partial<CargoData>>({});
  const [draftSurvey, setDraftSurvey] = useState<Partial<DraftSurveyData>>({});
  const [grainData, setGrainData] = useState<Partial<GrainStabilityData>>({});
  const [result, setResult] = useState<CargoResult | null>(null);
  const [activeTab, setActiveTab] = useState(initialTab || "distribution");

  // New states for extended cargo calculations
  const [distribution, setDistribution] = useState<DistributionItem[]>([
    { name: 'Hold#1', weight: 500, lcg: 30, tcg: 0, vcg: 4 },
    { name: 'Hold#2', weight: 700, lcg: 60, tcg: 0, vcg: 5 },
  ]);
  const [containers, setContainers] = useState<ContainerItem[]>([
    { id: 'C001', type: '20', weight: 24, bay: 3, row: 4, tier: 2, vcg: 8, tcg: 3 },
    { id: 'C002', type: '40', weight: 28, bay: 5, row: 6, tier: 3, vcg: 10, tcg: -2 }
  ]);
  const [dgList, setDgList] = useState<DangerousGoodsItem[]>([
    { id: 'DG1', un: '1203', cls: '3', bay: 3 },
    { id: 'DG2', un: '1942', cls: '5.1', bay: 3 }
  ]);
  const [costs, setCosts] = useState<CostInputs>({ freightPerTon: 35, insurancePct: 0.3, cargoValue: 500000, stevedoring: 4500, handling: 1200, storage: 800, documentation: 350 });

  // Lashing calculation state
  const [lashingMSL, setLashingMSL] = useState<number>(100); // kN per lashing
  const [lashingAngle, setLashingAngle] = useState<number>(0.8); // angle factor (cos)
  const [lashingWeight, setLashingWeight] = useState<number | undefined>(undefined); // t
  const [lashingRequired, setLashingRequired] = useState<number | null>(null);
  const [lashingChain, setLashingChain] = useState<{rod:number;turnbuckle:number;padeye:number;socket:number}>({rod:100,turnbuckle:100,padeye:120, socket:120});
  const [frictionMu, setFrictionMu] = useState<number>(0.3);
  const [bothSides, setBothSides] = useState<boolean>(true);

  // Quick stability geometry (optional)
  const [quickGeo, setQuickGeo] = useState<ShipGeometry>({
    length: 100, breadth: 20, depth: 10, draft: 6,
    blockCoefficient: 0.7, waterplaneCoefficient: 0.8,
    midshipCoefficient: 0.9, prismaticCoefficient: 0.65, verticalPrismaticCoefficient: 0.75
  });
  const [quickStab, setQuickStab] = useState<{gm:number; imoOK:boolean} | null>(null);

  // Tier permissible loads (t) simple inputs
  const [tierPermissible, setTierPermissible] = useState<{[tier:number]: number}>({1:90,2:80,3:70,4:60});

  const manifestSummary = (()=>{
    const total = containers.reduce((s,c)=>s+c.weight,0);
    const teu = containers.reduce((s,c)=> s + (c.type==='40'?2:1), 0);
    const dgCount = dgList.length;
    const cost = computeCosts(costs, cargoData.cargoWeight||0);
    return { total, teu, dgCount, costTotal: cost.total };
  })();

  const BayHeatmap: React.FC = () => {
    const stacks = computeContainerStacks(containers);
    const maxW = Math.max(1, ...stacks.map(s=>s.weight));
    const bays = [...new Set(containers.map(c=>c.bay))].sort((a,b)=>a-b);
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {bays.map((bay)=>{
          const w = stacks.find(s=>s.bay===bay)?.weight || 0;
          const intensity = Math.min(1, w/maxW);
          const bg = `rgba(99,102,241,${0.15 + intensity*0.65})`;
          return (
            <div key={bay} className="rounded p-2 text-center text-xs border" style={{ backgroundColor: bg }}>
              <div className="font-medium">Bay {bay}</div>
              <div className="font-mono">{w.toFixed(1)} t</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Helpers for new tabs
  const computeDistributionCG = (items: DistributionItem[]) => {
    const totalW = items.reduce((s, i) => s + (i.weight || 0), 0);
    if (totalW <= 0) return { totalW: 0, lcg: 0, tcg: 0, vcg: 0 };
    const lcg = items.reduce((s, i) => s + i.weight * i.lcg, 0) / totalW;
    const tcg = items.reduce((s, i) => s + i.weight * i.tcg, 0) / totalW;
    const vcg = items.reduce((s, i) => s + i.weight * i.vcg, 0) / totalW;
    return { totalW, lcg, tcg, vcg };
  };

  const computeContainerStacks = (list: ContainerItem[]) => {
    const byBay = new Map<number, number>();
    list.forEach(c => byBay.set(c.bay, (byBay.get(c.bay) || 0) + c.weight));
    return Array.from(byBay.entries()).map(([bay, wt]) => ({ bay, weight: wt }));
  };

  // Stowage plan: bay bazında adet, max tier ve toplam ağırlık
  const computeStowagePlan = (list: ContainerItem[]) => {
    const byBay = new Map<number, { count: number; maxTier: number; weight: number }>();
    list.forEach((c) => {
      const cur = byBay.get(c.bay) || { count: 0, maxTier: 0, weight: 0 };
      cur.count += 1;
      cur.maxTier = Math.max(cur.maxTier, c.tier);
      cur.weight += c.weight;
      byBay.set(c.bay, cur);
    });
    return Array.from(byBay.entries()).map(([bay, v]) => ({ bay, ...v }));
  };

  // Konteyner pozisyon/TCG dengesi
  const computeTCGBalance = (list: ContainerItem[]) => {
    const totalW = list.reduce((s, c) => s + (c.weight || 0), 0);
    const moment = list.reduce((s, c) => s + (c.weight || 0) * (c.tcg || 0), 0);
    const avgTCG = totalW > 0 ? moment / totalW : 0;
    return { totalW, moment, avgTCG };
  };

  const checkDGConflicts = (list: DangerousGoodsItem[]) => {
    // Simplified segregation: expand common IMDG conflicts per bay
    const warnings: string[] = [];
    const byBay = new Map<number, Set<string>>();
    const byBayDG: Record<number, DangerousGoodsItem[]> = {};
    list.forEach(d => {
      const set = byBay.get(d.bay) || new Set<string>();
      set.add(d.cls);
      byBay.set(d.bay, set);
      byBayDG[d.bay] = byBayDG[d.bay] || [];
      byBayDG[d.bay].push(d);
    });
    const conflictPairs: Array<[string, string, string]> = [
      ['3', '5.1', 'Class 3 ile 5.1 birlikte konulmamalı (oksitleyici ile yanıcı sıvı)'],
      ['2', '3', 'Class 2 (gazlar) ile Class 3 (yanıcı sıvılar) ayrı tutulmalı'],
      ['2', '5.1', 'Class 2 ile 5.1 birlikte istiflenmemeli (oksitleyici etki)'],
      ['4.1', '5.2', 'Class 4.1 ile 5.2 (organik peroksit) ayrı tutulmalı'],
      ['4.3', '5.1', 'Class 4.3 (su ile temas halinde tehlikeli gaz) ile 5.1 ayrı tutulmalı'],
      ['6.1', '3', 'Class 6.1 (zehirli) ile 3 ayrı tutulmalı (sızıntı riski)'],
      ['8', '5.1', 'Class 8 (aşındırıcı) ile 5.1 ayrı tutulmalı']
    ];
    byBay.forEach((classes, bay) => {
      for (const [a,b,msg] of conflictPairs) {
        if (classes.has(a) && classes.has(b)) {
          warnings.push(`Bay ${bay}: ${msg}`);
        }
      }
      if (classes.has('1')) warnings.push(`Bay ${bay}: Class 1 (patlayıcılar) özel ayrım gerektirir`);
      // On deck only
      const anyOnDeckOnly = (byBayDG[bay]||[]).some(d=> d.onDeckOnly);
      if (anyOnDeckOnly) warnings.push(`Bay ${bay}: On-deck-only DG tespit edildi (güverteye konumlandırın)`);
    });
    return warnings;
  };

  function computeCosts(c: CostInputs, cargoWeightTon?: number) {
    const freight = (c.freightPerTon || 0) * (cargoWeightTon || 0);
    const insurance = ((c.insurancePct || 0) / 100) * (c.cargoValue || 0);
    const baf = (c.bafPct || 0) / 100 * freight;
    const caf = (c.cafPct || 0) / 100 * freight;
    const other = (c.stevedoring || 0) + (c.handling || 0) + (c.storage || 0) + (c.documentation || 0);
    const total = freight + insurance + other + baf + caf;
    return { freight, insurance, other, total };
  }

  // Calculate deadweight utilization
  const calculateDWT = (cargoWeight: number, deadweight: number): number => {
    return (cargoWeight / deadweight) * 100;
  };

  // Calculate stowage factor
  const calculateStowageFactor = (volume: number, weight: number): number => {
    return volume / weight; // m³/tonne
  };

  // Calculate broken stowage (unusable space)
  const calculateBrokenStowage = (cargoVolume: number, holdVolume: number): number => {
    return ((holdVolume - cargoVolume) / holdVolume) * 100;
  };

  // Calculate new center of gravity after loading
  const calculateNewCG = (
    lightDisp: number,
    lightKG: number,
    cargoWeight: number,
    cargoVCG: number
  ): number => {
    const totalWeight = lightDisp + cargoWeight;
    return (lightDisp * lightKG + cargoWeight * cargoVCG) / totalWeight;
  };

  // Cargo securing force calculation - CSS Code requirements
  const calculateSecuringForces = (cargoWeight: number) => {
    // CSS Code - accelerations for general cargo
    const longitudinalAcc = 0.3; // 0.3g fore/aft
    const transverseAcc = 0.5; // 0.5g port/starboard  
    const verticalAcc = 1.0; // 1.0g upward

    return {
      longitudinal: cargoWeight * longitudinalAcc * 9.81, // kN
      transverse: cargoWeight * transverseAcc * 9.81, // kN
      vertical: cargoWeight * verticalAcc * 9.81 // kN
    };
  };

  // Lashing requirement: n >= Force / (SWL * efficiency * sin(angle))
  const calculateRequiredLashings = (
    force: number,
    swl: number,
    efficiency: number,
    angleDeg: number
  ): number => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const effective = Math.max(1e-6, swl * Math.max(0.1, efficiency) * Math.max(0.1, Math.sin(angleRad)));
    return Math.ceil(force / effective);
  };

  // Advanced lashing considering friction and both-sides distribution
  const calculateRequiredLashingsAdvanced = (
    forceKN: number,
    mslKN: number,
    efficiency: number,
    angleDeg: number,
    frictionMu: number,
    bothSides: boolean
  ): number => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const verticalComponentCapacity = mslKN * Math.max(0.1, efficiency) * Math.sin(angleRad);
    const frictionCapacity = frictionMu * (mslKN * Math.max(0.1, efficiency) * Math.cos(angleRad));
    const perLashingEffective = Math.max(1e-6, verticalComponentCapacity + frictionCapacity);
    const distributedForce = bothSides ? forceKN / 2 : forceKN;
    return Math.ceil(distributedForce / perLashingEffective);
  };

  // Simple stowage checks for containers
  const stowageChecks = () => {
    const stacks = computeContainerStacks(containers);
    const over = stacks.filter(s => s.weight > 220); // example limit per bay
    const byRowBalance = new Map<number, number>();
    containers.forEach(c => byRowBalance.set(c.row, (byRowBalance.get(c.row) || 0) + c.weight));
    const rowImbalance = Array.from(byRowBalance.entries()).sort((a,b)=>a[0]-b[0]);
    // tier stack simple limit check (e.g., 90 t per tier line per bay)
    const tierIssues: string[] = [];
    const byBayTierRow = new Map<string, number>();
    containers.forEach(c => {
      const key = `${c.bay}-${c.tier}-${c.row}`;
      byBayTierRow.set(key, (byBayTierRow.get(key) || 0) + c.weight);
    });
    byBayTierRow.forEach((w, key) => {
      const tierNum = parseInt(key.split('-')[1]);
      const limit = tierPermissible[tierNum] ?? 90;
      if (w > limit) tierIssues.push(`${key.split('-').join(' / ')}: ${w.toFixed(1)} t (limit >${limit}t)`);
    });
    // heavy-top rule: warn if upper tier > lower tier in same bay by >20%
    const byBayTier = new Map<string, number>();
    containers.forEach(c => {
      const k = `${c.bay}-${c.tier}`;
      byBayTier.set(k, (byBayTier.get(k) || 0) + c.weight);
    });
    const heavyTop: string[] = [];
    const tiers = new Set(containers.map(c=>c.tier));
    Array.from(new Set(containers.map(c=>c.bay))).forEach(bay => {
      Array.from(tiers).sort().forEach(t=>{
        const lower = byBayTier.get(`${bay}-${t}`) || 0;
        const upper = byBayTier.get(`${bay}-${t+1}`) || 0;
        if (upper > 0 && lower>0 && upper > lower*1.2) heavyTop.push(`Bay ${bay}: Tier ${t+1} (${upper.toFixed(1)}t) > Tier ${t} (${lower.toFixed(1)}t)`);
      });
    });
    return { over, rowImbalance, tierIssues, heavyTop };
  };

  // Simple loading/discharge sequences (heaviest first / reverse)
  const buildSequences = () => {
    const loadSeq = [...containers].sort((a,b)=> b.weight - a.weight).map(c=> `${c.id} (${c.weight.toFixed(1)}t) → Bay ${c.bay}/${c.row}/${c.tier}`);
    const dischargeSeq = [...containers].sort((a,b)=> a.weight - b.weight).map(c=> `${c.id} (${c.weight.toFixed(1)}t) ← Bay ${c.bay}/${c.row}/${c.tier}`);
    return { loadSeq, dischargeSeq };
  };

  const buildManifest = () => {
    const total = containers.reduce((s,c)=>s+c.weight,0);
    const teu = containers.reduce((s,c)=> s + (c.type==='40'?2:1), 0);
    const dgClasses = Array.from(new Set(dgList.map(d=>d.cls).filter(Boolean)));
    return {
      totalWeight: total,
      teu,
      count20: containers.filter(c=>c.type==='20').length,
      count40: containers.filter(c=>c.type==='40').length,
      dgClasses
    };
  };

  // Draft survey calculation
  const calculateDraftSurvey = (survey: DraftSurveyData, TPC: number = 25): number => {
    // Calculate mean drafts
    const meanDraftBefore = (survey.draftForeBefore + survey.draftMidBefore + survey.draftAftBefore) / 3;
    const meanDraftAfter = (survey.draftForeAfter + survey.draftMidAfter + survey.draftAftAfter) / 3;
    
    // Draft change
    const draftChange = meanDraftAfter - meanDraftBefore;
    
    // Apply corrections
    const correctedDraftChange = draftChange + 
      survey.densityCorrection + 
      survey.trimCorrection + 
      survey.deformationCorrection;
    
    // Calculate cargo weight
    return correctedDraftChange * TPC; // tonnes
  };

  // Grain stability calculation - IMO Grain Code
  const calculateGrainStability = (data: GrainStabilityData) => {
    // Shifting moment calculation
    const grainSurface = data.filled_volume / (data.volumetricWeight * 1000); // m²
    const shiftingMoment = grainSurface * Math.tan(data.angle_of_repose * Math.PI / 180) * 0.5;
    
    // Heeling moment due to grain shift
    const heelAngle = Math.atan(shiftingMoment / (data.volumetricWeight * 9.81));
    
    return {
      shiftingMoment,
      heelAngle: heelAngle * 180 / Math.PI,
      stabilityLoss: shiftingMoment * 0.1 // Simplified
    };
  };

  // Main cargo calculation
  const calculateCargo = () => {
    if (!cargoData.deadweight || !cargoData.cargoWeight) {
      toast({
        title: "Eksik Veri",
        description: "Lütfen gerekli değerleri girin.",
        variant: "destructive"
      });
      return;
    }

    const data = cargoData as CargoData;
    
    // Basic calculations
    const loadedDisplacement = (data.lightDisplacement || 5000) + data.cargoWeight;
    const utilizationPercentage = calculateDWT(data.cargoWeight, data.deadweight);
    
    // Volume calculations
    const stowageEfficiency = data.cargoVolume ? 
      (data.cargoWeight / data.cargoVolume) : 
      (1 / (data.stowageFactor || 1.5));
    
    const holdVolume = (data.holdLength || 30) * (data.holdBreadth || 20) * (data.holdHeight || 12);
    const brokenStowage = data.cargoVolume ? 
      calculateBrokenStowage(data.cargoVolume, holdVolume) : 15;
    
    // Center of gravity calculations
    const newKG = calculateNewCG(
      data.lightDisplacement || 5000,
      8.5, // Assumed light ship KG
      data.cargoWeight,
      data.cargoVCG || 6.0
    );
    
    const newLCG = ((data.lightDisplacement || 5000) * 70 + data.cargoWeight * (data.cargoLCG || 70)) / 
      loadedDisplacement;
    
    // Stability status
    let stabilityStatus: CargoResult['stabilityStatus'] = 'good';
    if (newKG > 9.5) stabilityStatus = 'poor';
    else if (newKG > 8.8) stabilityStatus = 'acceptable';
    
    // Securing forces
    const securityForces = calculateSecuringForces(data.cargoWeight);
    
    // Loading sequence recommendations
    const recommendedSequence = [
      "1. Düşük ağırlık merkezli yüklerden başla",
      "2. Ağır yükleri hold tabanına yerleştir", 
      "3. Stabiliteli kontrol et",
      "4. Trim dengeyi koru",
      "5. Securing işlemlerini tamamla"
    ];
    
    // Recommendations
    const recommendations: string[] = [];
    if (utilizationPercentage < 85) {
      recommendations.push("DWT kullanımı düşük - daha fazla yük alabilirsiniz");
    }
    if (brokenStowage > 20) {
      recommendations.push("Broken stowage yüksek - yük düzenini optimize edin");
    }
    if (stabilityStatus === 'poor') {
      recommendations.push("Stabilite riski - yük dağılımını yeniden düzenleyin");
    }
    if (securityForces.transverse > data.cargoWeight * 1000) {
      recommendations.push("Güçlendirme sistemlerini kontrol edin");
    }
    
    const result: CargoResult = {
      loadedDisplacement,
      cargoCapacity: data.deadweight,
      utilizationPercentage,
      stowageEfficiency,
      brokenStowage,
      newKG,
      newLCG,
      stabilityStatus,
      recommendedSequence,
      securityForces,
      recommendations
    };
    
    setResult(result);
    
    toast({
      title: "Kargo Hesaplandı",
      description: `DWT Kullanımı: ${utilizationPercentage.toFixed(1)}%`,
      variant: stabilityStatus === 'poor' ? "destructive" : "default"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'acceptable': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const chainMSLCapacity = (): number => {
    const minMSL = Math.min(lashingChain.rod, lashingChain.turnbuckle, lashingChain.padeye, lashingChain.socket);
    return minMSL;
  };

  const runQuickStability = async () => {
    try {
      // Compute KG from distribution or cargo inputs
      let kgVal = 0;
      const dist = computeDistributionCG(distribution);
      if (dist.totalW > 0) kgVal = dist.vcg; else kgVal = cargoData.cargoVCG || 6.0;
      const res = HydrostaticCalculations.performStabilityAnalysis(quickGeo, kgVal, [], []);
      setQuickStab({ gm: res.stability.gm, imoOK: !!res.imoCriteria?.compliance });
    } catch(e){ console.error(e); }
  };

  return (
    <div className="space-y-6">
      {/* KPI Summary Bar */}
      <Card className="bg-muted/40">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="text-xs">Kargo</Badge>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
              <div className="rounded bg-background p-3 text-center">
                <div className="text-lg font-bold font-mono">{manifestSummary.total.toFixed(1)} t</div>
                <div className="text-xs text-muted-foreground" data-translatable>Toplam Ağırlık</div>
              </div>
              <div className="rounded bg-background p-3 text-center">
                <div className="text-lg font-bold font-mono">{manifestSummary.teu}</div>
                <div className="text-xs text-muted-foreground">TEU</div>
              </div>
              <div className="rounded bg-background p-3 text-center">
                <div className="text-lg font-bold font-mono">{manifestSummary.dgCount}</div>
                <div className="text-xs text-muted-foreground">DG Kalem</div>
              </div>
              <div className="rounded bg-background p-3 text-center">
                <div className="text-lg font-bold font-mono">${manifestSummary.costTotal.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground">Tahmini Maliyet</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back controls */}
      <div className="flex items-center gap-3">
        {singleMode ? (
          <Button variant="ghost" size="sm" className="gap-2" onClick={()=> navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
            <span data-translatable>Geri Dön</span>
          </Button>
        ) : (
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Ana Sayfa</span>
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Yükleme ve Boşaltma Hesaplamaları
          </CardTitle>
          <CardDescription>
            IMO CSS Code, IMDG Code ve SOLAS Chapter VII standartlarına uygun kargo analizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {!singleMode && (
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="distribution"><LayoutGrid className="h-4 w-4 mr-1" />Dağılım</TabsTrigger>
                <TabsTrigger value="containers"><Boxes className="h-4 w-4 mr-1" />Konteyner</TabsTrigger>
                <TabsTrigger value="securing"><Shield className="h-4 w-4 mr-1" />Güçlendirme</TabsTrigger>
                <TabsTrigger value="grain"><Wheat className="h-4 w-4 mr-1" />Tahıl</TabsTrigger>
                <TabsTrigger value="survey"><Package className="h-4 w-4 mr-1" />Survey</TabsTrigger>
                <TabsTrigger value="planning"><Truck className="h-4 w-4 mr-1" />Yükleme Planı</TabsTrigger>
                <TabsTrigger value="costs"><DollarSign className="h-4 w-4 mr-1" />Maliyet</TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="loading" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadweight">Deadweight [ton]</Label>
                  <Input
                    id="deadweight"
                    type="number"
                    value={cargoData.deadweight || ''}
                    onChange={(e) => setCargoData({...cargoData, deadweight: parseFloat(e.target.value)})}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargoWeight">Kargo Ağırlığı [ton]</Label>
                  <Input
                    id="cargoWeight"
                    type="number"
                    value={cargoData.cargoWeight || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoWeight: parseFloat(e.target.value)})}
                    placeholder="12000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lightDisplacement">Light Ship [ton]</Label>
                  <Input
                    id="lightDisplacement"
                    type="number"
                    value={cargoData.lightDisplacement || ''}
                    onChange={(e) => setCargoData({...cargoData, lightDisplacement: parseFloat(e.target.value)})}
                    placeholder="5000"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargoVolume">Kargo Hacmi [m³]</Label>
                  <Input
                    id="cargoVolume"
                    type="number"
                    value={cargoData.cargoVolume || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoVolume: parseFloat(e.target.value)})}
                    placeholder="18000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stowageFactor">Stowage Factor [m³/ton]</Label>
                  <Input
                    id="stowageFactor"
                    type="number"
                    step="0.1"
                    value={cargoData.stowageFactor || ''}
                    onChange={(e) => setCargoData({...cargoData, stowageFactor: parseFloat(e.target.value)})}
                    placeholder="1.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grossTonnage">Gross Tonnage</Label>
                  <Input
                    id="grossTonnage"
                    type="number"
                    value={cargoData.grossTonnage || ''}
                    onChange={(e) => setCargoData({...cargoData, grossTonnage: parseFloat(e.target.value)})}
                    placeholder="8500"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargoLCG">Kargo LCG (Kıçtan) [m]</Label>
                  <Input
                    id="cargoLCG"
                    type="number"
                    value={cargoData.cargoLCG || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoLCG: parseFloat(e.target.value)})}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargoTCG">Kargo TCG (CL'den) [m]</Label>
                  <Input
                    id="cargoTCG"
                    type="number"
                    value={cargoData.cargoTCG || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoTCG: parseFloat(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargoVCG">Kargo VCG (Baseline'dan) [m]</Label>
                  <Input
                    id="cargoVCG"
                    type="number"
                    value={cargoData.cargoVCG || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoVCG: parseFloat(e.target.value)})}
                    placeholder="6.0"
                  />
                </div>
              </div>

              <Button onClick={calculateCargo} className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Kargo Hesapla
              </Button>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Kargo Sonuçları
                      <Badge className={getStatusColor(result.stabilityStatus)}>
                        {result.stabilityStatus.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.utilizationPercentage.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">DWT Kullanımı</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.loadedDisplacement.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">Yüklü Deplasman (ton)</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.brokenStowage.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Broken Stowage</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.newKG.toFixed(2)}m</div>
                        <div className="text-sm text-muted-foreground">Yeni KG</div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Güçlendirme Kuvvetleri (CSS Code)</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold">{(result.securityForces.longitudinal/1000).toFixed(0)} kN</div>
                          <div className="text-xs">Boyuna</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold">{(result.securityForces.transverse/1000).toFixed(0)} kN</div>
                          <div className="text-xs">Enine</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold">{(result.securityForces.vertical/1000).toFixed(0)} kN</div>
                          <div className="text-xs">Dikey</div>
                        </div>
                      </div>
                    </div>

                    {result.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Öneriler</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="survey" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Survey Hesaplaması</CardTitle>
                  <CardDescription>
                    Yükleme öncesi ve sonrası draft ölçümleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Yükleme Öncesi</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <Input placeholder="Baş" type="number" step="0.01" />
                          <Input placeholder="Orta" type="number" step="0.01" />
                          <Input placeholder="Kıç" type="number" step="0.01" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Yükleme Sonrası</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <Input placeholder="Baş" type="number" step="0.01" />
                          <Input placeholder="Orta" type="number" step="0.01" />
                          <Input placeholder="Kıç" type="number" step="0.01" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Düzeltmeler</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Yoğunluk Düzeltmesi</Label>
                        <Input type="number" step="0.001" placeholder="0.015" />
                      </div>
                      <div className="space-y-2">
                        <Label>Trim Düzeltmesi</Label>
                        <Input type="number" step="0.001" placeholder="0.008" />
                      </div>
                      <div className="space-y-2">
                        <Label>Deformasyon Düzeltmesi</Label>
                        <Input type="number" step="0.001" placeholder="0.005" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grain" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wheat className="h-5 w-5" />
                    Tahıl Stabilitesi
                  </CardTitle>
                  <CardDescription>
                    IMO Grain Code uygun hesaplamalar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tahıl Türü</Label>
                      <Input 
                        value={grainData.grainType || ''}
                        onChange={(e) => setGrainData({...grainData, grainType: e.target.value})}
                        placeholder="Buğday, Mısır, Soya vb."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Angle of Repose [°]</Label>
                      <Input 
                        type="number"
                        value={grainData.angle_of_repose || ''}
                        onChange={(e) => setGrainData({...grainData, angle_of_repose: parseFloat(e.target.value)})}
                        placeholder="25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Volumetrik Ağırlık [t/m³]</Label>
                      <Input 
                        type="number"
                        step="0.01"
                        value={grainData.volumetricWeight || ''}
                        onChange={(e) => setGrainData({...grainData, volumetricWeight: parseFloat(e.target.value)})}
                        placeholder="0.75"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dolu Hacim [m³]</Label>
                      <Input 
                        type="number"
                        value={grainData.filled_volume || ''}
                        onChange={(e) => setGrainData({...grainData, filled_volume: parseFloat(e.target.value)})}
                        placeholder="5000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Trimming/Levelling</Label>
                      <div className="flex gap-2 text-sm">
                        <Button variant="outline" size="sm" onClick={()=> setGrainData({...grainData, shifting_moment: (grainData.shifting_moment||0)*0.9 })}>Trimming</Button>
                        <Button variant="outline" size="sm" onClick={()=> setGrainData({...grainData, shifting_moment: (grainData.shifting_moment||0)*0.8 })}>Levelling</Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">IMO Grain Code Kriterleri</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Tahıl kayması hesabı zorunlu</li>
                      <li>• Shifting board veya trimming gerekli</li>
                      <li>• Heeling moment kontrolü</li>
                      <li>• Stabilite kitapçığında özel prosedür</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="securing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kargo Güçlendirme Sistemleri</CardTitle>
                  <CardDescription>CSS Code standartlarına uygun güçlendirme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <h4>CSS Code Accelerations:</h4>
                    <ul>
                      <li><strong>Longitudinal:</strong> 0.3g (fore/aft direction)</li>
                      <li><strong>Transverse:</strong> 0.5g (port/starboard)</li>
                      <li><strong>Vertical:</strong> 1.0g (upward direction)</li>
                    </ul>
                    
                    <h4>Güçlendirme Ekipmanları:</h4>
                    <ul>
                      <li><strong>Lashing points:</strong> SWL ≥ 1000 kg</li>
                      <li><strong>Turnbuckles:</strong> Adjustable tension</li>
                      <li><strong>Wire ropes:</strong> Stainless steel preferred</li>
                      <li><strong>Chain lashings:</strong> Heavy cargo securing</li>
                    </ul>
                    
                    <h4>Konteyner Güçlendirme:</h4>
                    <ul>
                      <li><strong>Twist locks:</strong> Corner fittings</li>
                      <li><strong>Bridge fittings:</strong> Container guides</li>
                      <li><strong>Lashing rods:</strong> Turnbuckle connections</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lashing Hesabı</CardTitle>
                  <CardDescription>Kuvvete göre gerekli lashing adedi (basit yaklaşım)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label>MSL [kN]</Label>
                      <Input type="number" value={lashingMSL} onChange={(e)=>setLashingMSL(parseFloat(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                      <Label>Açı Faktörü (cos)</Label>
                      <Input type="number" step="0.01" value={lashingAngle} onChange={(e)=>setLashingAngle(parseFloat(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                      <Label>Yük Ağırlığı [t] (opsiyonel)</Label>
                      <Input type="number" step="0.1" value={lashingWeight ?? ''} onChange={(e)=>setLashingWeight(parseFloat(e.target.value))} placeholder={`${cargoData.cargoWeight || ''}`} />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={()=>{
                        const w = (lashingWeight ?? cargoData.cargoWeight ?? 0);
                        const forces = calculateSecuringForces(w);
                        const transverseKN = forces.transverse / 1000;
                        const capacityPer = (lashingMSL || 0) * (lashingAngle || 1);
                        const req = capacityPer>0 ? Math.ceil(transverseKN / capacityPer) : 0;
                        setLashingRequired(req);
                        toast({ title:'Lashing Hesabı', description:`Enine kuvvet ≈ ${transverseKN.toFixed(1)} kN, Gerekli lashing ≈ ${req}` });
                      }}><Calculator className="h-4 w-4 mr-1" />Hesapla</Button>
                    </div>
                  </div>
                  {lashingRequired !== null && (
                    <div className="p-3 rounded bg-muted">
                      <div className="text-sm">Gerekli lashing adedi: <span className="font-semibold">{lashingRequired}</span></div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lashing chain and friction inputs */}
              <Card>
                <CardHeader>
                  <CardTitle>Gelişmiş Lashing Parametreleri</CardTitle>
                  <CardDescription>MSL zinciri ve sürtünme katsayısı</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
                  <div>
                    <Label>Rod MSL [kN]</Label>
                    <Input type="number" value={lashingChain.rod} onChange={(e)=>setLashingChain({...lashingChain, rod: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Turnbuckle MSL [kN]</Label>
                    <Input type="number" value={lashingChain.turnbuckle} onChange={(e)=>setLashingChain({...lashingChain, turnbuckle: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Padeye MSL [kN]</Label>
                    <Input type="number" value={lashingChain.padeye} onChange={(e)=>setLashingChain({...lashingChain, padeye: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Socket MSL [kN]</Label>
                    <Input type="number" value={lashingChain.socket} onChange={(e)=>setLashingChain({...lashingChain, socket: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>μ (Sürtünme)</Label>
                    <Input type="number" step="0.01" value={frictionMu} onChange={(e)=>setFrictionMu(parseFloat(e.target.value))} />
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={()=> toast({ title:'MSL Zinciri', description:`Etkin MSL ≈ ${chainMSLCapacity()} kN` })}>MSL Kontrol</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planning" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Yükleme Planlaması
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Stability Check */}
                  <div className="p-3 rounded bg-purple-50 dark:bg-gray-800">
                    <h4 className="font-semibold mb-2">Hızlı Stabilite Kontrolü</h4>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm mb-2">
                      <div><Label>L (m)</Label><Input aria-label="L (m)" type="number" value={quickGeo.length} onChange={(e)=>setQuickGeo({...quickGeo, length: parseFloat(e.target.value)})} /></div>
                      <div><Label>B (m)</Label><Input aria-label="B (m)" type="number" value={quickGeo.breadth} onChange={(e)=>setQuickGeo({...quickGeo, breadth: parseFloat(e.target.value)})} /></div>
                      <div><Label>T (m)</Label><Input aria-label="T (m)" type="number" value={quickGeo.draft} onChange={(e)=>setQuickGeo({...quickGeo, draft: parseFloat(e.target.value)})} /></div>
                      <div><Label>Cb</Label><Input aria-label="Cb" type="number" step="0.01" value={quickGeo.blockCoefficient} onChange={(e)=>setQuickGeo({...quickGeo, blockCoefficient: parseFloat(e.target.value)})} /></div>
                    </div>
                    <Button size="sm" onClick={runQuickStability}><Calculator className="h-4 w-4 mr-1" />Hızlı Kontrol</Button>
                    {quickStab && (
                      <div className="mt-2 text-sm">GM ≈ <span className="font-mono">{quickStab.gm.toFixed(3)} m</span> • IMO: <span className={quickStab.imoOK? 'text-green-600':'text-red-600'}>{quickStab.imoOK? 'Uygun':'Değil'}</span></div>
                    )}
                  </div>

                  {/* Bay Heatmap */}
                  <div>
                    <h4 className="font-semibold mb-2">Bay Isı Haritası</h4>
                    <BayHeatmap />
                  </div>

                  {result && (
                    <div>
                      <h4 className="font-semibold mb-3">Önerilen Yükleme Sırası</h4>
                      <div className="space-y-2">
                        {result.recommendedSequence.map((step, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Stowage & Sequences */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded bg-muted">
                      <h4 className="font-semibold mb-2">Stowage Kontrolleri</h4>
                      {(() => {
                        const sc = stowageChecks();
                        return (
                          <ul className="text-sm space-y-1">
                            {sc.over.length === 0 ? (
                              <li>Bay ağırlıkları limit dahilinde.</li>
                            ) : sc.over.map(s => (
                              <li key={s.bay}>Bay {s.bay}: {s.weight.toFixed(1)} t (yüksek)</li>
                            ))}
                            <li>Row dağılımı: {stowageChecks().rowImbalance.map(r=>`Row ${r[0]}=${r[1].toFixed(1)}t`).join(', ')}</li>
                            {sc.heavyTop.length>0 && (
                              <li className="text-orange-600">Heavy-top uyarıları: {sc.heavyTop.slice(0,3).join(' | ')}</li>
                            )}
                            {sc.tierIssues.length > 0 && (
                              <li className="text-red-600">Tier uyarıları: {sc.tierIssues.slice(0,4).join(' | ')}</li>
                            )}
                          </ul>
                        );
                      })()}
                    </div>
                    <div className="p-3 rounded bg-muted">
                      <h4 className="font-semibold mb-2">Loading Sequence</h4>
                      <ul className="text-sm space-y-1">
                        {buildSequences().loadSeq.slice(0,6).map((s,i)=>(<li key={i}>{s}</li>))}
                      </ul>
                    </div>
                    <div className="p-3 rounded bg-muted">
                      <h4 className="font-semibold mb-2">Discharge Sequence</h4>
                      <ul className="text-sm space-y-1">
                        {buildSequences().dischargeSeq.slice(0,6).map((s,i)=>(<li key={i}>{s}</li>))}
                      </ul>
                    </div>
                  </div>

                  {/* Manifest */}
                  <div className="p-3 rounded bg-blue-50 dark:bg-gray-800">
                    <h4 className="font-semibold mb-2">Cargo Manifest Özeti</h4>
                    {(() => {
                      const mf = buildManifest();
                      return (
                        <div className="text-sm grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>Toplam Ağırlık: <span className="font-mono">{mf.totalWeight.toFixed(1)} t</span></div>
                          <div>TEU: <span className="font-mono">{mf.teu}</span> (20': {mf.count20}, 40': {mf.count40})</div>
                          <div>DG Sınıfları: <span className="font-mono">{mf.dgClasses.join(', ') || '-'}</span></div>
                          <div>Bay sayısı: <span className="font-mono">{new Set(containers.map(c=>c.bay)).size}</span></div>
                        </div>
                      );
                    })()}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Bay Özetleri</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {computeContainerStacks(containers).map((s)=> (
                        <div key={s.bay} className="p-2 rounded bg-muted text-sm">
                          <div className="font-medium">Bay {s.bay}</div>
                          <div>{s.weight.toFixed(1)} t</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Stowage Planı</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {computeStowagePlan(containers).map((s)=> (
                        <div key={`sp-${s.bay}`} className="p-2 rounded bg-muted text-xs">
                          <div className="font-medium">Bay {s.bay}</div>
                          <div>Adet: {s.count}</div>
                          <div>Max Tier: {s.maxTier}</div>
                          <div>Ağırlık: {s.weight.toFixed(1)} t</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Pozisyon / TCG Kontrolü</h4>
                    {(() => { const b = computeTCGBalance(containers); return (
                      <div className="grid grid-cols-3 gap-2 text-sm p-2 bg-muted rounded">
                        <div>Toplam: <span className="font-medium">{b.totalW.toFixed(1)} t</span></div>
                        <div>TCG Moment: <span className="font-medium">{b.moment.toFixed(1)} t·m</span></div>
                        <div>Ort. TCG: <span className={`font-medium ${Math.abs(b.avgTCG) < 0.5 ? 'text-green-600' : 'text-red-600'}`}>{b.avgTCG.toFixed(2)} m</span></div>
                      </div>
                    ); })()}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Yükleme Sırası</h4>
                    <div className="space-y-1">
                      {[...containers]
                        .sort((a,b)=> (a.tier - b.tier) || (a.bay - b.bay))
                        .map((c)=> (
                          <div key={`load-${c.id}`} className="text-sm p-2 bg-muted rounded">#{c.id} — Bay {c.bay} Row {c.row} Tier {c.tier}</div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Boşaltma Sırası</h4>
                    <div className="space-y-1">
                      {[...containers]
                        .sort((a,b)=> (b.tier - a.tier) || (a.bay - b.bay))
                        .map((c)=> (
                          <div key={`dis-${c.id}`} className="text-sm p-2 bg-muted rounded">#{c.id} — Bay {c.bay} Row {c.row} Tier {c.tier}</div>
                        ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={()=>{
                      const manifest = { containers, dangerous_goods: dgList, costs, generated_at: new Date().toISOString() };
                      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = 'cargo-manifest.json'; a.click();
                      URL.revokeObjectURL(url);
                    }}>
                      <FileDown className="h-4 w-4 mr-1" /> Manifesti Dışa Aktar
                    </Button>
                    <Button variant="outline" onClick={()=>{
                      const header = 'ID,Type,Weight,Bay,Row,Tier,ISO,IMDG,VGM\n';
                      const rows = containers.map(c=>`${c.id},${c.type},${c.weight},${c.bay},${c.row},${c.tier},${c.isoCode||''},${c.imdgClass||''},${c.vgm||''}`).join('\n');
                      const blob = new Blob([header+rows], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a'); a.href=url; a.download='cargo-manifest.csv'; a.click(); URL.revokeObjectURL(url);
                    }}>
                      <FileDown className="h-4 w-4 mr-1" /> CSV İndir
                    </Button>
                    <Button onClick={()=>{ window.print(); }}>
                      <FileDown className="h-4 w-4 mr-1" /> Yazdır
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {(singleMode ? activeTab==='survey' : true) && (
            <TabsContent value="survey" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Survey Hesaplaması</CardTitle>
                  <CardDescription>
                    Yükleme öncesi ve sonrası draft ölçümleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Yükleme Öncesi</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <Input placeholder="Baş" type="number" step="0.01" />
                          <Input placeholder="Orta" type="number" step="0.01" />
                          <Input placeholder="Kıç" type="number" step="0.01" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Yükleme Sonrası</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <Input placeholder="Baş" type="number" step="0.01" />
                          <Input placeholder="Orta" type="number" step="0.01" />
                          <Input placeholder="Kıç" type="number" step="0.01" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Düzeltmeler</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Yoğunluk Düzeltmesi</Label>
                        <Input type="number" step="0.001" placeholder="0.015" />
                      </div>
                      <div className="space-y-2">
                        <Label>Trim Düzeltmesi</Label>
                        <Input type="number" step="0.001" placeholder="0.008" />
                      </div>
                      <div className="space-y-2">
                        <Label>Deformasyon Düzeltmesi</Label>
                        <Input type="number" step="0.001" placeholder="0.005" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            )}

            {(singleMode ? activeTab==='costs' : true) && (
            <TabsContent value="costs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" /> Kargo Maliyeti</CardTitle>
                  <CardDescription>Freight, sigorta ve operasyonel ücretler</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label>Freight [$/ton]</Label>
                      <Input type="number" step="0.01" value={costs.freightPerTon || ''} onChange={(e)=>setCosts({...costs, freightPerTon: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <Label>Sigorta [%]</Label>
                      <Input type="number" step="0.01" value={costs.insurancePct || ''} onChange={(e)=>setCosts({...costs, insurancePct: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <Label>Kargo Değeri [$]</Label>
                      <Input type="number" step="0.01" value={costs.cargoValue || ''} onChange={(e)=>setCosts({...costs, cargoValue: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <Label>BAF [%]</Label>
                      <Input type="number" step="0.01" value={costs.bafPct || ''} onChange={(e)=>setCosts({...costs, bafPct: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <Label>CAF [%]</Label>
                      <Input type="number" step="0.01" value={costs.cafPct || ''} onChange={(e)=>setCosts({...costs, cafPct: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <Label>Stevedoring [$]</Label>
                      <Input type="number" step="0.01" value={costs.stevedoring || ''} onChange={(e)=>setCosts({...costs, stevedoring: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <Label>Handling [$]</Label>
                      <Input type="number" step="0.01" value={costs.handling || ''} onChange={(e)=>setCosts({...costs, handling: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <Label>Storage [$]</Label>
                      <Input type="number" step="0.01" value={costs.storage || ''} onChange={(e)=>setCosts({...costs, storage: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <Label>Documentation [$]</Label>
                      <Input type="number" step="0.01" value={costs.documentation || ''} onChange={(e)=>setCosts({...costs, documentation: parseFloat(e.target.value)})} />
                    </div>
                  </div>
                  <Button onClick={()=>{
                    const totals=computeCosts(costs, cargoData.cargoWeight);
                    toast({ title:'Maliyet Özeti', description:`Freight $${totals.freight.toFixed(2)} | Sigorta $${totals.insurance.toFixed(2)} | Diğer $${totals.other.toFixed(2)} | Toplam $${totals.total.toFixed(2)}` });
                  }}><Calculator className="h-4 w-4 mr-1"/>Hesapla</Button>
                </CardContent>
              </Card>
            </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};