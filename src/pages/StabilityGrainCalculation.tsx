import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Anchor,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Package,
  BarChart3,
  Ship,
  RefreshCw,
  Calculator,
  Info,
  Download,
  PlayCircle,
  ShieldCheck,
  Activity,
  Waves,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

const REQUIRED_GZ_AREA = 0.075;

const statusPalette = {
  pass: {
    bg: "bg-[#20c997]/10",
    text: "text-[#0f5132]",
    border: "border-[#20c997]"
  },
  marginal: {
    bg: "bg-[#ffc107]/10",
    text: "text-[#8a6d1d]",
    border: "border-[#ffc107]"
  },
  fail: {
    bg: "bg-[#dc3545]/10",
    text: "text-[#842029]",
    border: "border-[#dc3545]"
  },
  neutral: {
    bg: "bg-muted/40",
    text: "text-muted-foreground",
    border: "border-dashed border-border"
  }
} as const;

type StatusKey = keyof typeof statusPalette;

const statusCopy: Record<StatusKey, string> = {
  pass: "PASS",
  marginal: "MARGINAL",
  fail: "FAIL",
  neutral: "—"
};

type StatusOptions = { type?: "min" | "max"; margin?: number };

const evaluateStatus = (value: number | null, limit: number, options: StatusOptions = {}): StatusKey => {
  if (value === null || Number.isNaN(value)) {
    return "neutral";
  }

  const { type = "min", margin = type === "min" ? 0.02 : 1 } = options;

  if (type === "min") {
    if (value >= limit) return "pass";
    if (value >= limit - margin) return "marginal";
    return "fail";
  }

  if (value <= limit) return "pass";
  if (value <= limit + margin) return "marginal";
  return "fail";
};

const formatValue = (value: number | null, digits = 2, unit?: string) => {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  const trimmed = value.toFixed(digits);
  return unit ? `${trimmed} ${unit}` : trimmed;
};

const cargoPresets = [
  { value: "custom", label: "Serbest / Manuel", density: undefined, stowageFactor: undefined },
  { value: "wheat", label: "Buğday (ρ 0.77)", density: 0.77, stowageFactor: 1.3 },
  { value: "corn", label: "Mısır (ρ 0.70)", density: 0.7, stowageFactor: 1.4 },
  { value: "barley", label: "Arpa (ρ 0.63)", density: 0.63, stowageFactor: 1.45 },
  { value: "soy", label: "Soya (ρ 0.75)", density: 0.75, stowageFactor: 1.25 },
  { value: "sunflower", label: "Ayçiçeği (ρ 0.62)", density: 0.62, stowageFactor: 1.5 }
] as const;

const vesselProfiles = [
  {
    value: "handysize-demo",
    label: "Handysize Demo (38k DWT)",
    data: {
      displacement: 42000,
      lightship: 8700,
      constant: 320,
      fuel: 1100,
      freshWater: 380,
      stores: 210,
      volume: 11800,
      weight: 9100,
      holdVolume: 16000,
      brokenStowage: 0,
      stowageFactor: 1.32,
      grainDensity: 0.77,
      shiftVolume: 560,
      deltaKG: 0.32,
      tpi: 22,
      mt1: 450,
      draftChange: 12,
      gm: 0.38,
      km: 8.6,
      kg: 8.2,
      kb: 4.6,
      fsmShiftArea: 510,
      fsmArm: 0.85,
      gzAreaMeasured: 0.078
    }
  },
  {
    value: "panamax-demo",
    label: "Panamax Demo (75k DWT)",
    data: {
      displacement: 78000,
      lightship: 18000,
      constant: 520,
      fuel: 2100,
      freshWater: 520,
      stores: 260,
      volume: 22000,
      weight: 16500,
      holdVolume: 31000,
      brokenStowage: 0.5,
      stowageFactor: 1.29,
      grainDensity: 0.75,
      shiftVolume: 920,
      deltaKG: 0.28,
      tpi: 38,
      mt1: 820,
      draftChange: 10,
      gm: 0.42,
      km: 9.2,
      kg: 8.8,
      kb: 5,
      fsmShiftArea: 880,
      fsmArm: 0.92,
      gzAreaMeasured: 0.082
    }
  }
] as const;

interface AutoResultFieldProps {
  label: string;
  value: number | null;
  unit?: string;
  precision?: number;
  formula?: string;
}

interface InfoLabelProps {
  label: string;
  hint?: string;
}

const InfoLabel = ({ label, hint }: InfoLabelProps) => (
  <div className="flex items-center gap-1.5">
    <Label className="text-sm font-medium">{label}</Label>
    {hint ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs leading-relaxed">{hint}</TooltipContent>
      </Tooltip>
    ) : null}
  </div>
);

const AutoResultField = ({ label, value, unit, precision = 2, formula }: AutoResultFieldProps) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>{label}</span>
      {formula ? <span className="font-mono text-[10px]">{formula}</span> : null}
    </div>
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-muted bg-muted/60 px-3 py-2">
      <Calculator className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-semibold">
        {value !== null && value !== undefined ? formatValue(value, precision, unit) : "—"}
      </span>
    </div>
  </div>
);

export default function StabilityGrainCalculationPage() {
  const navigate = useNavigate();

  // 1. Stowage Factor Calculations
  const [volume, setVolume] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [stowageFactor, setStowageFactor] = useState<number>(1.35);

  // 2. Broken Stowage
  const [holdVolume, setHoldVolume] = useState<number>(0);
  const [brokenStowage, setBrokenStowage] = useState<number>(0);

  // 3. Loadable Cargo
  const [displacement, setDisplacement] = useState<number>(0);
  const [lightship, setLightship] = useState<number>(0);
  const [constant, setConstant] = useState<number>(0);
  const [fuel, setFuel] = useState<number>(0);
  const [freshWater, setFreshWater] = useState<number>(0);
  const [stores, setStores] = useState<number>(0);

  // 4. Draft Calculations
  const [tpi, setTpi] = useState<number>(0);
  const [mt1, setMt1] = useState<number>(0);
  const [draftChange, setDraftChange] = useState<number>(0);

  // 5. Grain Heeling Moment
  const [shiftVolume, setShiftVolume] = useState<number>(0);
  const [deltaKG, setDeltaKG] = useState<number>(0);
  const [grainDensity, setGrainDensity] = useState<number>(0.8);

  // 6. Stability Parameters
  const [gm, setGm] = useState<number>(0);
  const [kg, setKg] = useState<number>(0);
  const [km, setKm] = useState<number>(0);
  const [kb, setKb] = useState<number>(0);

  // 7. FSM for Grain
  const [fsmShiftArea, setFsmShiftArea] = useState<number>(0);
  const [fsmArm, setFsmArm] = useState<number>(0);

  // 8. Advanced helpers
  const [gzAreaMeasured, setGzAreaMeasured] = useState<number>(REQUIRED_GZ_AREA);
  const [desiredGM, setDesiredGM] = useState<number>(0.45);
  const [cargoType, setCargoType] = useState<string>("custom");
  const [selectedVesselProfile, setSelectedVesselProfile] = useState<string>("");

  useEffect(() => {
    if (cargoType === "custom") return;
    const preset = cargoPresets.find((item) => item.value === cargoType);
    if (!preset) return;

    if (preset.density) {
      setGrainDensity(preset.density);
    }
    if (preset.stowageFactor) {
      setStowageFactor(preset.stowageFactor);
    }
  }, [cargoType]);

  const setterMap: Record<string, (value: number) => void> = {
    volume: setVolume,
    weight: setWeight,
    stowageFactor: setStowageFactor,
    holdVolume: setHoldVolume,
    brokenStowage: setBrokenStowage,
    displacement: setDisplacement,
    lightship: setLightship,
    constant: setConstant,
    fuel: setFuel,
    freshWater: setFreshWater,
    stores: setStores,
    tpi: setTpi,
    mt1: setMt1,
    draftChange: setDraftChange,
    shiftVolume: setShiftVolume,
    deltaKG: setDeltaKG,
    grainDensity: setGrainDensity,
    gm: setGm,
    kg: setKg,
    km: setKm,
    kb: setKb,
    fsmShiftArea: setFsmShiftArea,
    fsmArm: setFsmArm,
    gzAreaMeasured: setGzAreaMeasured
  };

  const handleApplyVesselProfile = (value: string) => {
    if (value === "clear") {
      setSelectedVesselProfile("");
      return;
    }

    setSelectedVesselProfile(value);
    const profile = vesselProfiles.find((item) => item.value === value);
    if (!profile) return;

    Object.entries(profile.data).forEach(([key, val]) => {
      const setter = setterMap[key];
      if (setter) {
        setter(val as number);
      }
    });
  };

  const handleDemoFill = () => {
    const demo = {
      volume: 15000,
      weight: 11500,
      holdVolume: 21000,
      brokenStowage: 0.5,
      displacement: 65000,
      lightship: 15000,
      constant: 450,
      fuel: 1800,
      freshWater: 520,
      stores: 260,
      tpi: 32,
      mt1: 650,
      draftChange: 9,
      shiftVolume: 720,
      deltaKG: 0.34,
      grainDensity: 0.75,
      gm: 0.4,
      kg: 8.7,
      km: 9.1,
      kb: 4.9,
      fsmShiftArea: 760,
      fsmArm: 0.9,
      gzAreaMeasured: 0.081
    };

    Object.entries(demo).forEach(([key, val]) => {
      const setter = setterMap[key];
      if (setter) setter(val as number);
    });
    setCargoType("custom");
  };

  const handleReset = () => {
    Object.values(setterMap).forEach((setter) => setter(0));
    setStowageFactor(1.35);
    setGrainDensity(0.8);
    setGzAreaMeasured(REQUIRED_GZ_AREA);
    setDesiredGM(0.45);
    setCargoType("custom");
    setSelectedVesselProfile("");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Tahıl Stabilite Raporu", 14, 20);
    doc.setFontSize(11);
    doc.text(`GM (initial): ${formatValue(gm > 0 ? gm : km && kg ? km - kg : null, 3, "m")}`, 14, 35);
    doc.text(`GM (corrected): ${formatValue(correctedGM, 3, "m")}`, 14, 42);
    doc.text(`Heeling Angle: ${formatValue(heelingAngle, 2, "°")}`, 14, 49);
    doc.text(`GHM: ${formatValue(ghm, 2, "ton·m")}`, 14, 56);
    doc.text(`FSM: ${formatValue(fsm, 2, "ton·m")}`, 14, 63);
    doc.text(`IMO Check: ${imoStatus.toUpperCase()}`, 14, 70);
    doc.save("grain-stability-report.pdf");
  };

  const gmInitialValue = useMemo(() => {
    if (gm > 0) return parseFloat(gm.toFixed(3));
    if (km && kg) {
      const derived = km - kg;
      return derived ? parseFloat(derived.toFixed(3)) : null;
    }
    return null;
  }, [gm, km, kg]);

  const gmUsed = gmInitialValue ?? 0;

  const sfResult = useMemo(() => (volume && weight ? volume / weight : null), [volume, weight]);
  const requiredVolume = useMemo(() => (weight && stowageFactor ? weight * stowageFactor : null), [weight, stowageFactor]);
  const maxWeight = useMemo(() => (volume && stowageFactor ? volume / stowageFactor : null), [volume, stowageFactor]);
  const usableVolume = useMemo(
    () => (holdVolume ? holdVolume * (1 - brokenStowage / 100) : null),
    [holdVolume, brokenStowage]
  );
  const loadableResult = useMemo(() => {
    if (!displacement || !lightship) return null;
    const deadweight = displacement - lightship;
    const loadable = deadweight - (constant + fuel + freshWater + stores);
    return { deadweight, loadable };
  }, [displacement, lightship, constant, fuel, freshWater, stores]);

  const draftWeight = useMemo(() => (tpi && draftChange ? tpi * draftChange : null), [tpi, draftChange]);
  const trimMoment = useMemo(() => (mt1 && draftChange ? mt1 * (draftChange / 1) : null), [mt1, draftChange]);

  const ghm = useMemo(() => (shiftVolume && deltaKG && grainDensity ? shiftVolume * deltaKG * grainDensity : null), [
    shiftVolume,
    deltaKG,
    grainDensity
  ]);

  const heelingAngle = useMemo(() => {
    if (!ghm || !displacement || !gmUsed) return null;
    const tanTheta = ghm / (displacement * gmUsed);
    const theta = Math.atan(tanTheta) * (180 / Math.PI);
    return Number.isFinite(theta) ? theta : null;
  }, [ghm, displacement, gmUsed]);

  const fsm = useMemo(() => (fsmShiftArea && fsmArm && grainDensity ? grainDensity * fsmShiftArea * fsmArm : null), [
    fsmShiftArea,
    fsmArm,
    grainDensity
  ]);

  const correctedGM = useMemo(() => {
    if (!gmUsed || !fsm || !displacement) return null;
    const value = gmUsed - fsm / displacement;
    return Number.isFinite(value) ? value : null;
  }, [gmUsed, fsm, displacement]);

  const imoCriteria = useMemo(() => {
    const gmPass = correctedGM ? correctedGM >= 0.3 : false;
    const anglePass = heelingAngle ? heelingAngle <= 12 : false;
    return { gmPass, anglePass };
  }, [correctedGM, heelingAngle]);

  const gmInitialStatus = evaluateStatus(gmInitialValue, 0.3, { type: "min", margin: 0.02 });
  const gmCorrectedStatus = evaluateStatus(correctedGM, 0.3, { type: "min", margin: 0.02 });
  const heelStatus = evaluateStatus(heelingAngle, 12, { type: "max", margin: 1.5 });
  const gzStatus = evaluateStatus(gzAreaMeasured, REQUIRED_GZ_AREA, { type: "min", margin: 0.01 });
  const imoStatus: StatusKey = imoCriteria.gmPass && imoCriteria.anglePass
    ? "pass"
    : gmCorrectedStatus === "fail" || heelStatus === "fail"
      ? "fail"
      : "marginal";

  const validationWarnings = useMemo(() => {
    const warnings: string[] = [];

    if (grainDensity && (grainDensity < 0.7 || grainDensity > 0.85)) {
      warnings.push("Tahıl yoğunluğu 0.70-0.85 t/m³ dışında. IMO tablolarını teyit edin.");
    }
    if (stowageFactor && (stowageFactor < 1.2 || stowageFactor > 2)) {
      warnings.push("Stowage factor 1.2-2.0 aralığı dışında. Gerçek dışı olabilir.");
    }
    if (brokenStowage > 5) {
      warnings.push("Broken stowage genelde %0-2 olur. Değeri kontrol edin.");
    }
    if (displacement && lightship) {
      const consumables = constant + fuel + freshWater + stores;
      if (consumables > displacement - lightship) {
        warnings.push("Tüketim kalemleri deadweight'ten büyük olamaz.");
      }
    }
    if (gmInitialValue !== null && gmInitialValue < 0.25) {
      warnings.push("GM initial 0.25 m'nin altında. Ballast artırımı önerilir.");
    }

    return warnings;
  }, [grainDensity, stowageFactor, brokenStowage, displacement, lightship, constant, fuel, freshWater, stores, gmInitialValue]);

  const gzCurveData = useMemo(() => {
    const gmBase = gmInitialValue ?? 0.35;
    return Array.from({ length: 9 }).map((_, index) => {
      const angle = index * 5;
      const gz = Number((gmBase * Math.sin((angle * Math.PI) / 180)).toFixed(3));
      return { angle, gz: Number.isFinite(gz) ? gz : 0 };
    });
  }, [gmInitialValue]);

  const heelingAngleValue = heelingAngle ?? null;
  const gmBalanceData = useMemo(() => {
    if (!ghm && !fsm) return [];
    return [
      { name: "GHM", value: ghm ?? 0 },
      { name: "FSM", value: fsm ?? 0 }
    ];
  }, [ghm, fsm]);

  const heelVisualAngle = heelingAngleValue ? Math.max(Math.min(heelingAngleValue, 18), -18) : 0;

  const gmShortfall = correctedGM ? desiredGM - correctedGM : desiredGM - (gmInitialValue ?? 0);
  const ballastLever = kb && kg ? kb - kg : null;
  const ballastToMeetTarget = gmShortfall > 0 && displacement && ballastLever
    ? (gmShortfall * displacement) / Math.abs(ballastLever)
    : null;
  const gmGainPer200t = displacement && ballastLever ? (200 * Math.abs(ballastLever)) / displacement : null;
  const gmGainPer50t = displacement && ballastLever ? (50 * Math.abs(ballastLever)) / displacement : null;

  return (
    <TooltipProvider>
      <div className="container mx-auto space-y-6 px-4 py-6">
        <Button variant="ghost" size="sm" className="gap-2 w-fit" onClick={() => navigate("/stability/calculations")}>
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Button>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Anchor className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Tahıl Stabilite Hesapları (IMO Grain Code)</CardTitle>
                  <CardDescription>
                    Bölümlere ayrılmış kart hiyerarşisi, kritik değer paneli ve grafiklerle modernleştirildi.
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="secondary" className="bg-blue-50 text-blue-800 hover:bg-blue-50">
                  IMO Grain Code
                </Badge>
                <Badge variant="outline" className="border-dashed">
                  6 accordion adımı
                </Badge>
                <Badge className={imoStatus === "pass" ? "bg-green-100 text-green-800" : imoStatus === "fail" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>
                  {imoStatus === "pass" ? "Stabilite Uygun" : imoStatus === "fail" ? "İyileştirme Gerekli" : "Sınırda"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Select value={selectedVesselProfile} onValueChange={handleApplyVesselProfile}>
                  <SelectTrigger className="w-full sm:w-[260px]">
                    <SelectValue placeholder="Auto fill: Gemi profili" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Profilsiz</SelectItem>
                    {vesselProfiles.map((profile) => (
                      <SelectItem key={profile.value} value={profile.value}>
                        {profile.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleDemoFill}>
                  <PlayCircle className="h-4 w-4" />
                  Örnek Hesap
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPdf}>
                  <Download className="h-4 w-4" />
                  PDF Raporu
                </Button>
                <Button variant="ghost" size="sm" className="gap-2" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4" />
                  Temizle
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-l-4 border-primary/70 shadow-md lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Yükleme Sonuç Özeti
                </CardTitle>
                <CardDescription>GM, yatma açısı ve IMO kontrolleri her zaman görünür.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: "gm-initial", label: "GM (Initial)", value: gmInitialValue, unit: "m", status: gmInitialStatus },
                  { id: "gm-corrected", label: "GM (Corrected)", value: correctedGM, unit: "m", status: gmCorrectedStatus },
                  { id: "heel", label: "Heeling Angle", value: heelingAngleValue, unit: "°", status: heelStatus },
                  {
                    id: "gz-area",
                    label: "GZ Alanı",
                    value: gzAreaMeasured,
                    unit: "m·rad",
                    status: gzStatus
                  },
                  {
                    id: "overall",
                    label: "IMO Grain Check",
                    value: imoCriteria.gmPass && imoCriteria.anglePass ? 1 : null,
                    unit: undefined,
                    status: imoStatus,
                    customDisplay: imoStatus === "pass" ? "PASS" : imoStatus === "fail" ? "FAIL" : "MARGINAL"
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-lg border px-3 py-2",
                      statusPalette[item.status].bg,
                      statusPalette[item.status].text,
                      statusPalette[item.status].border
                    )}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide">{item.label}</p>
                    <p className="text-xl font-bold">
                      {item.customDisplay
                        ? item.customDisplay
                        : formatValue(item.value, item.id === "gm-corrected" ? 3 : 2, item.unit)}
                    </p>
                    <p className="text-[11px] font-medium">{statusCopy[item.status]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Mantık Kontrolleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validationWarnings.length > 0 ? (
                  <ul className="list-disc space-y-2 pl-5 text-sm text-amber-600">
                    {validationWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Tüm girdiler emniyetli aralıklarda görünüyor.</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-primary" />
                  GZ Eğrisi & Heel Grafiği
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gzCurveData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gzGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                      <XAxis dataKey="angle" tickFormatter={(val) => `${val}°`} fontSize={12} />
                      <YAxis tickFormatter={(val) => `${val.toFixed(2)}m`} fontSize={12} width={40} />
                      <Area type="monotone" dataKey="gz" stroke="#0284c7" fill="url(#gzGradient)" strokeWidth={2} />
                      {heelingAngleValue ? (
                        <ReferenceLine
                          x={heelingAngleValue}
                          stroke="#dc2626"
                          strokeDasharray="4 4"
                          label={{ value: `θ = ${heelingAngleValue.toFixed(2)}°`, position: "top", fill: "#dc2626" }}
                        />
                      ) : null}
                      <RechartsTooltip
                        contentStyle={{ fontSize: 12 }}
                        formatter={(value) => `${value} m`}
                        labelFormatter={(label) => `${label}°`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gmBalanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <RechartsTooltip formatter={(value) => `${value} ton·m`} />
                      <Bar dataKey="value" fill="#a855f7" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-xl border bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
                  <p className="text-sm text-slate-200">GHM / FSM Visual</p>
                  <div className="relative mt-3 h-36 overflow-hidden rounded-lg bg-blue-200/50">
                    <div className="absolute inset-x-4 bottom-3 h-4 rounded-full bg-gradient-to-r from-blue-300 to-blue-500" />
                    <div
                      className="absolute left-1/2 top-6 h-16 w-40 -translate-x-1/2 rounded-[999px] bg-white/90 shadow-lg"
                      style={{ transform: `translateX(-50%) rotate(${heelVisualAngle * -1}deg)`, transition: "transform 0.6s ease" }}
                    >
                      <div className="flex h-full items-center justify-center gap-2 text-slate-800">
                        <Ship className="h-5 w-5" />
                        <span className="text-sm font-semibold">Heel {formatValue(heelingAngleValue, 1, "°")}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-200">
                    Yatma açısı hesaplandığında gemi silüeti aynı açıyla animasyonlu olarak dönüyor.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-border/70 shadow-lg">
          <CardHeader>
            <CardTitle>Detaylı Hesap Motoru</CardTitle>
            <CardDescription>Accordion tarzı bölümlerle form elemanları konsolide edildi.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["cargo", "vessel", "draft", "ghm", "fsm", "imo"]} className="space-y-4">
              <AccordionItem value="cargo" className="rounded-xl border px-4">
                <AccordionTrigger className="text-left text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    1️⃣ Kargo Bilgileri
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pb-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border bg-card/60 p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Package className="h-4 w-4 text-primary" />
                        Stowage Factor
                      </div>
                      <Separator className="my-3" />
                      <div className="grid gap-3">
                        <div className="grid gap-2">
                          <InfoLabel label="Yük Hacmi (m³)" hint="Survey veya 3D tarama ile ölçülen toplam ambar hacmi." />
                          <Input
                            type="number"
                            value={volume || ""}
                            onChange={(e) => setVolume(parseFloat(e.target.value) || 0)}
                            placeholder="Örnek: 15000"
                          />
                        </div>
                        <div className="grid gap-2">
                          <InfoLabel label="Yük Ağırlığı (ton)" hint="Manifest ya da draft survey sonucunda bulunan toplam tahıl ağırlığı." />
                          <Input
                            type="number"
                            value={weight || ""}
                            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                            placeholder="Örnek: 11000"
                          />
                        </div>
                        <div className="grid gap-2">
                          <InfoLabel label="Kargo Tipi" hint="Seçtiğiniz tahıla göre yoğunluk ve SF otomatik doluyor." />
                          <Select value={cargoType} onValueChange={setCargoType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Tahıl seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {cargoPresets.map((preset) => (
                                <SelectItem key={preset.value} value={preset.value}>
                                  {preset.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <InfoLabel label="Stowage Factor (m³/ton)" hint="Ciddi sapmalarda surveyor ile teyit edin." />
                          <Input
                            type="number"
                            step="0.01"
                            value={stowageFactor || ""}
                            onChange={(e) => setStowageFactor(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <AutoResultField label="SF = V / W" value={sfResult} unit="m³/ton" precision={3} formula="SF = V/W" />
                        <AutoResultField label="Gereken Hacim" value={requiredVolume} unit="m³" precision={1} formula="V = W × SF" />
                        <AutoResultField label="Maksimum Yük" value={maxWeight} unit="ton" precision={1} formula="W = V / SF" />
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-card/60 p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Broken Stowage & Kullanılabilir Hacim
                      </div>
                      <Separator className="my-3" />
                      <div className="grid gap-3">
                        <div className="grid gap-2">
                          <InfoLabel label="Ambar Hacmi (m³)" hint="Tüm ambarların toplam 'grain space' hacmi." />
                          <Input
                            type="number"
                            value={holdVolume || ""}
                            onChange={(e) => setHoldVolume(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <InfoLabel label="Broken Stowage (%)" hint="Tahılda genelde %0 alınır. Paketli yüklerde %5'e çıkabilir." />
                          <Input
                            type="number"
                            step="0.1"
                            value={brokenStowage || ""}
                            onChange={(e) => setBrokenStowage(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <AutoResultField label="Kullanılabilir Hacim" value={usableVolume} unit="m³" precision={1} formula="V × (1 - BS%)" />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="vessel" className="rounded-xl border px-4">
                <AccordionTrigger className="text-left text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    2️⃣ Geminin Durumu
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="rounded-2xl border bg-card/60 p-4 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        { label: "Displacement (ton)", value: displacement, setter: setDisplacement, hint: "Loaded displacement değeri (Δ)." },
                        { label: "Lightship (ton)", value: lightship, setter: setLightship, hint: "Geminin boş ağırlığı." },
                        { label: "Constant (ton)", value: constant, setter: setConstant, hint: "Değişmeyen ağırlıklar, stores, lashing." },
                        { label: "Fuel (ton)", value: fuel, setter: setFuel, hint: "Toplam FO + DO" },
                        { label: "Fresh Water (ton)", value: freshWater, setter: setFreshWater, hint: "FW tanklarındaki miktar." },
                        { label: "Stores (ton)", value: stores, setter: setStores, hint: "Provisions + spares" }
                      ].map((field) => (
                        <div className="space-y-2" key={field.label}>
                          <InfoLabel label={field.label} hint={field.hint} />
                          <Input
                            type="number"
                            value={field.value || ""}
                            onChange={(e) => field.setter(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <AutoResultField
                      label="Yüklenebilir Tahıl"
                      value={loadableResult ? loadableResult.loadable : null}
                      unit="ton"
                      precision={1}
                      formula="Δ - (Lightship + tüketimler)"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="draft" className="rounded-xl border px-4">
                <AccordionTrigger className="text-left text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-primary" />
                    3️⃣ Draft & Trim
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="rounded-2xl border bg-card/60 p-4 shadow-sm space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <InfoLabel label="TPI (ton/inch)" hint="Tonnes per inch immersion" />
                        <Input type="number" value={tpi || ""} onChange={(e) => setTpi(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <InfoLabel label="MT1 (ton·m/cm)" hint="Trim değişimini hesaplamak için" />
                        <Input type="number" value={mt1 || ""} onChange={(e) => setMt1(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <InfoLabel label="Draft Değişimi" hint="inch/cm cinsinden" />
                        <Input type="number" value={draftChange || ""} onChange={(e) => setDraftChange(parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <AutoResultField label="Ağırlık Değişimi" value={draftWeight} unit="ton" precision={1} formula="ΔW = TPI × ΔT" />
                      <AutoResultField label="Trim Momenti" value={trimMoment} unit="ton·m" precision={1} formula="ΔM = MT1 × (ΔT/1m)" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ghm" className="rounded-xl border px-4">
                <AccordionTrigger className="text-left text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    4️⃣ GHM & Yatma Açısı
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-6">
                  <div className="rounded-2xl border bg-card/60 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Activity className="h-4 w-4 text-primary" />
                      Grain Heeling Moment
                    </div>
                    <Separator className="my-3" />
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-2">
                        <InfoLabel label="Shift Volume (m³)" hint="IMO Grain Code Tablo 8" />
                        <Input type="number" value={shiftVolume || ""} onChange={(e) => setShiftVolume(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <InfoLabel label="ΔKG (m)" hint="Tahıl kayması sonucu KG artışı" />
                        <Input type="number" value={deltaKG || ""} onChange={(e) => setDeltaKG(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <InfoLabel label="Yoğunluk (ton/m³)" hint="Cargo tipine göre otomatik doluyor." />
                        <Input type="number" step="0.01" value={grainDensity || ""} onChange={(e) => setGrainDensity(parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <AutoResultField label="GHM" value={ghm} unit="ton·m" precision={2} formula="Vol × ΔKG × ρ" />
                  </div>

                  <div className="rounded-2xl border bg-card/60 p-4 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Heeling Angle
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <InfoLabel label="GM (m)" hint="Gerekirse KM - KG ile otomatik hesaplanır." />
                        <Input type="number" value={gm || ""} onChange={(e) => setGm(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <InfoLabel label="Displacement (ton)" hint="Heeling formülü için" />
                        <Input type="number" value={displacement || ""} onChange={(e) => setDisplacement(parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>
                    <Alert className="bg-blue-50 text-blue-900">
                      <AlertDescription className="text-sm">
                        Heeling angle formula: θ = arctan(GHM / (Δ × GM))
                      </AlertDescription>
                    </Alert>
                    <AutoResultField label="θ" value={heelingAngle} unit="°" precision={2} formula="tanθ = GHM/(Δ×GM)" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="fsm" className="rounded-xl border px-4">
                <AccordionTrigger className="text-left text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Ship className="h-4 w-4 text-primary" />
                    5️⃣ FSM & GM Düzeltmesi
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-6">
                  <div className="rounded-2xl border bg-card/60 p-4 shadow-sm space-y-4">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-2">
                        <InfoLabel label="Shift Area (m²)" hint="IMO tabloları" />
                        <Input type="number" value={fsmShiftArea || ""} onChange={(e) => setFsmShiftArea(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <InfoLabel label="Kol (m)" hint="Shift area ile çarpılacak ram kolu." />
                        <Input type="number" value={fsmArm || ""} onChange={(e) => setFsmArm(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <InfoLabel label="Yoğunluk" hint="Tahıl için ρ" />
                        <Input type="number" value={grainDensity || ""} onChange={(e) => setGrainDensity(parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>
                    <Alert className="bg-blue-50 text-blue-900">
                      <AlertDescription className="text-sm">FSM = ρ × Area × Arm</AlertDescription>
                    </Alert>
                    <AutoResultField label="FSM" value={fsm} unit="ton·m" precision={2} formula="ρ × A × arm" />
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <InfoLabel label="KG (m)" hint="Ağırlık merkezinin yüksekliği" />
                        <Input type="number" value={kg || ""} onChange={(e) => setKg(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <InfoLabel label="KM (m)" hint="Metasentrik yükseklik" />
                        <Input type="number" value={km || ""} onChange={(e) => setKm(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <InfoLabel label="KB (m)" hint="Ballast hesapları için" />
                        <Input type="number" value={kb || ""} onChange={(e) => setKb(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <InfoLabel label="Hedef GM (m)" hint="Comfort GM" />
                        <Input type="number" step="0.01" value={desiredGM || ""} onChange={(e) => setDesiredGM(parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>
                    <AutoResultField label="GM (Corrected)" value={correctedGM} unit="m" precision={3} formula="GM - FSM/Δ" />
                  </div>

                  <div className="rounded-2xl border border-dashed bg-muted/40 p-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      İyileştirme Önerileri
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li>
                        💡 {ballastToMeetTarget ? `${Math.ceil(ballastToMeetTarget)} ton ballast ile GM ≈ ${formatValue(desiredGM, 2, "m")}` : "Ballast önerisi için KB, KG ve displacement girin."}
                      </li>
                      <li>
                        💧 {gmGainPer50t ? `50 ton FW discharge → GM +${gmGainPer50t.toFixed(2)} m` : "FW değişimi için geometrik veriler gerekli."}
                      </li>
                      <li>
                        ⚓ {gmGainPer200t ? `200 ton ballast eklenirse GM +${gmGainPer200t.toFixed(2)} m` : "Ballast etkisi için KB/KG girilmelidir."}
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="imo" className="rounded-xl border px-4">
                <AccordionTrigger className="text-left text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    6️⃣ IMO Criterion Check & GZ Area
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-semibold mb-2">IMO Grain Code kriterleri:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• GM (corrected) ≥ 0.30 m</li>
                        <li>• Heel angle ≤ 12°</li>
                        <li>• 0-40° arası GZ alanı ≥ 0.075 m·rad</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className={imoCriteria.gmPass ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          {imoCriteria.gmPass ? (
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                          ) : (
                            <XCircle className="h-8 w-8 text-red-600" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">GM Corrected</p>
                            <p className="text-2xl font-bold">{formatValue(correctedGM, 3, "m")}</p>
                            <p className="text-xs mt-1">{imoCriteria.gmPass ? "✓ ≥ 0.30 m" : "✗ < 0.30 m"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={imoCriteria.anglePass ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          {imoCriteria.anglePass ? (
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                          ) : (
                            <XCircle className="h-8 w-8 text-red-600" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Heeling Angle</p>
                            <p className="text-2xl font-bold">{formatValue(heelingAngle, 2, "°")}</p>
                            <p className="text-xs mt-1">{imoCriteria.anglePass ? "✓ ≤ 12°" : "✗ > 12°"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <InfoLabel label="GZ Alanı (m·rad)" hint="0-40° arası ölçülen alan" />
                      <Input
                        type="number"
                        step="0.001"
                        value={gzAreaMeasured || ""}
                        onChange={(e) => setGzAreaMeasured(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <AutoResultField label="Gerekli Alan" value={REQUIRED_GZ_AREA} unit="m·rad" precision={3} />
                    <div className="rounded-lg border border-dashed bg-muted/40 p-3 text-sm">
                      {gzStatus === "pass"
                        ? "✔️ Alan yeterli (≥ 0.075 m·rad)"
                        : gzStatus === "marginal"
                          ? "⚠️ Alan limitin hemen altında"
                          : "❌ Alan yetersiz, stok ayırıcıları kontrol edin"}
                    </div>
                  </div>

                  <Alert className={imoStatus === "pass" ? "bg-green-50 border-green-500" : imoStatus === "fail" ? "bg-red-50 border-red-500" : "bg-amber-50 border-amber-400"}>
                    <AlertDescription>
                      <div className="flex items-center gap-3">
                        {imoStatus === "pass" ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                        <div>
                          <p className="font-bold text-lg">
                            {imoStatus === "pass" ? "Stabilite Uygun" : imoStatus === "fail" ? "Stabilite Uygun Değil" : "Stabilite Sınırda"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {!imoCriteria.gmPass && "GM düşük. "}
                            {!imoCriteria.anglePass && "Yatma açısı yüksek. "}
                            Ballast veya yük dağılımı ile düzeltin.
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                    <p className="font-semibold mb-2">📋 Öneriler</p>
                    <ul className="space-y-1">
                      <li>• Tahıl shift tablolarını yükleme bilgisayarına kaydedin (auto fill).</li>
                      <li>• IMO formatında PDF raporu ekip ile paylaşın.</li>
                      <li>• "Örnek Hesap" ile eğitim/demolar yapın.</li>
                      <li>• Gemi silüeti ile anlık heel takibi yapın.</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
