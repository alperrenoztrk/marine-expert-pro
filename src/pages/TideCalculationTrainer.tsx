import { useEffect, useMemo, useRef, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Info, Waves } from "lucide-react";
import {
  calculateHeightOfTideAtTime,
  calculateUKC,
  generateTrainerTideTableLWtoHW,
  type TrainerTideTableRow,
} from "@/utils/tideCalculator";

type FormState = {
  lwTime: string; // HH:MM
  lwHeightM: string;
  hwTime: string; // HH:MM
  hwHeightM: string;
  chartedDepthM: string;
  draftM: string;
  squatM: string;
  safetyMarginM: string;
};

type Scenario = {
  lwTimeUtc: Date;
  lwHeightM: number;
  hwTimeUtc: Date;
  hwHeightM: number;
  chartedDepthM: number;
  draftM: number;
  squatM: number;
  safetyMarginM: number;
  stepMinutes: number;
};

function parseTimeToMinutes(hhmm: string): number | null {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

function minutesToHHMM(totalMinutes: number): string {
  const x = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = String(Math.floor(x / 60)).padStart(2, "0");
  const mm = String(x % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function dateUtcAtMinutes(minFromMidnight: number, dayOffset: number = 0): Date {
  const base = Date.UTC(2000, 0, 1 + dayOffset, 0, 0, 0, 0);
  return new Date(base + minFromMidnight * 60 * 1000);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fmtM(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(2)} m`;
}

function fmtFactor(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(3);
}

function buildCurvePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  const [p0, ...rest] = points;
  return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} ${rest.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")}`;
}

export default function TideCalculationTrainer() {
  const [form, setForm] = useState<FormState>({
    lwTime: "06:00",
    lwHeightM: "0.8",
    hwTime: "12:10",
    hwHeightM: "4.8",
    chartedDepthM: "9.0",
    draftM: "8.2",
    squatM: "0.4",
    safetyMarginM: "0.5",
  });
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [stepMode, setStepMode] = useState<boolean>(true);
  const [desiredMinuteFromLW, setDesiredMinuteFromLW] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);

  const highlightedRowRef = useRef<HTMLTableRowElement | null>(null);

  const handleCalculate = () => {
    setError(null);

    const lwMin = parseTimeToMinutes(form.lwTime);
    const hwMinRaw = parseTimeToMinutes(form.hwTime);
    if (lwMin == null || hwMinRaw == null) {
      setError("LW/HW saat formatı geçersiz. Örn: 06:00");
      return;
    }

    const lwHeightM = Number(form.lwHeightM);
    const hwHeightM = Number(form.hwHeightM);
    const chartedDepthM = Number(form.chartedDepthM);
    const draftM = Number(form.draftM);
    const squatM = Number(form.squatM);
    const safetyMarginM = Number(form.safetyMarginM);

    const nums = [lwHeightM, hwHeightM, chartedDepthM, draftM, squatM, safetyMarginM];
    if (nums.some((n) => !Number.isFinite(n))) {
      setError("Sayısal değerlerden biri geçersiz.");
      return;
    }
    if (chartedDepthM < 0 || draftM < 0 || squatM < 0 || safetyMarginM < 0) {
      setError("Derinlik/draft/squat/emniyet payı negatif olamaz.");
      return;
    }

    // Allow HW next day (e.g., LW 23:30 -> HW 05:40).
    const hwMin = hwMinRaw <= lwMin ? hwMinRaw + 24 * 60 : hwMinRaw;
    const dtMin = hwMin - lwMin;
    if (dtMin < 30 || dtMin > 14 * 60) {
      setError("LW → HW aralığı çok kısa/uzun görünüyor. Eğitim için 0.5–14 saat aralığı önerilir.");
      return;
    }

    const lwTimeUtc = dateUtcAtMinutes(lwMin, 0);
    const hwTimeUtc = dateUtcAtMinutes(hwMinRaw, hwMinRaw <= lwMin ? 1 : 0);

    const nextScenario: Scenario = {
      lwTimeUtc,
      lwHeightM,
      hwTimeUtc,
      hwHeightM,
      chartedDepthM,
      draftM,
      squatM,
      safetyMarginM,
      stepMinutes: 10,
    };
    setScenario(nextScenario);
    setDesiredMinuteFromLW(Math.round(dtMin / 2));
  };

  const tableRows: TrainerTideTableRow[] = useMemo(() => {
    if (!scenario) return [];
    return generateTrainerTideTableLWtoHW({
      lowWaterTimeUtc: scenario.lwTimeUtc,
      lowWaterHeightM: scenario.lwHeightM,
      highWaterTimeUtc: scenario.hwTimeUtc,
      highWaterHeightM: scenario.hwHeightM,
      stepMinutes: scenario.stepMinutes,
    });
  }, [scenario]);

  const derived = useMemo(() => {
    if (!scenario) return null;
    const tLW = scenario.lwTimeUtc.getTime();
    const tHW = scenario.hwTimeUtc.getTime();
    const totalMin = Math.round((tHW - tLW) / (60 * 1000));
    const desiredMin = clamp(desiredMinuteFromLW, 0, totalMin);
    const queryTimeUtc = new Date(tLW + desiredMin * 60 * 1000);
    const hot = calculateHeightOfTideAtTime({
      lowWaterTimeUtc: scenario.lwTimeUtc,
      lowWaterHeightM: scenario.lwHeightM,
      highWaterTimeUtc: scenario.hwTimeUtc,
      highWaterHeightM: scenario.hwHeightM,
      queryTimeUtc,
    });
    const rangeM = scenario.hwHeightM - scenario.lwHeightM;
    const deltaHM = hot.fractionOfRange * rangeM;
    const ukc = calculateUKC({
      chartedDepthM: scenario.chartedDepthM,
      heightOfTideM: hot.heightM,
      draftM: scenario.draftM,
      squatM: scenario.squatM,
      safetyMarginM: scenario.safetyMarginM,
    });
    const actualDepthM = scenario.chartedDepthM + hot.heightM;

    // Find highlighted row index (nearest to slider time)
    let idx = 0;
    if (tableRows.length) {
      let best = Number.POSITIVE_INFINITY;
      const tq = queryTimeUtc.getTime();
      for (let i = 0; i < tableRows.length; i++) {
        const d = Math.abs(tableRows[i].timeUtc.getTime() - tq);
        if (d < best) {
          best = d;
          idx = i;
        }
      }
    }

    return {
      totalMin,
      desiredMin,
      queryTimeUtc,
      factor: hot.fractionOfRange,
      deltaHM,
      hotM: hot.heightM,
      rangeM,
      actualDepthM,
      ukcM: ukc.ukcM,
      ukcSafe: ukc.isSafe,
      highlightedIndex: idx,
    };
  }, [scenario, desiredMinuteFromLW, tableRows]);

  useEffect(() => {
    if (!derived) return;
    // Auto-scroll highlighted row into view
    highlightedRowRef.current?.scrollIntoView({ block: "center", inline: "nearest" });
  }, [derived]);

  // --- SVG curve geometry (responsive via viewBox)
  const svg = useMemo(() => {
    if (!scenario || !derived) return null;

    const W = 900;
    const H = 260;
    const padL = 52;
    const padR = 52;
    const padT = 18;
    const padB = 34;

    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    const minY = Math.min(scenario.lwHeightM, scenario.hwHeightM);
    const maxY = Math.max(scenario.lwHeightM, scenario.hwHeightM);
    const yMargin = Math.max(0.25, (maxY - minY) * 0.15);
    const yMin = minY - yMargin;
    const yMax = maxY + yMargin;

    const toX = (minuteFromLW: number) => padL + (minuteFromLW / derived.totalMin) * innerW;
    const toY = (heightM: number) => padT + (1 - (heightM - yMin) / (yMax - yMin)) * innerH;

    const pointsMain: Array<{ x: number; y: number }> = [];
    const pointsSpring: Array<{ x: number; y: number }> = [];
    const pointsNeap: Array<{ x: number; y: number }> = [];

    const N = 120;
    for (let i = 0; i <= N; i++) {
      const u = i / N; // 0..1
      const minute = u * derived.totalMin;
      const q = new Date(scenario.lwTimeUtc.getTime() + minute * 60 * 1000);
      const hot = calculateHeightOfTideAtTime({
        lowWaterTimeUtc: scenario.lwTimeUtc,
        lowWaterHeightM: scenario.lwHeightM,
        highWaterTimeUtc: scenario.hwTimeUtc,
        highWaterHeightM: scenario.hwHeightM,
        queryTimeUtc: q,
      });

      const factorBase = clamp(hot.fractionOfRange, 0, 1);
      const factorSpring = clamp(Math.pow(factorBase, 0.85), 0, 1);
      const factorNeap = clamp(Math.pow(factorBase, 1.15), 0, 1);

      const range = scenario.hwHeightM - scenario.lwHeightM;
      const hBase = scenario.lwHeightM + factorBase * range;
      const hSpring = scenario.lwHeightM + factorSpring * range;
      const hNeap = scenario.lwHeightM + factorNeap * range;

      pointsMain.push({ x: toX(minute), y: toY(hBase) });
      pointsSpring.push({ x: toX(minute), y: toY(hSpring) });
      pointsNeap.push({ x: toX(minute), y: toY(hNeap) });
    }

    const xDesired = toX(derived.desiredMin);
    const yDesired = toY(derived.hotM);

    // axis ticks
    const ticksY = 4;
    const tickYs = Array.from({ length: ticksY + 1 }, (_, i) => {
      const v = yMin + (i / ticksY) * (yMax - yMin);
      return { v, y: toY(v) };
    });

    return {
      W,
      H,
      padL,
      padR,
      padT,
      padB,
      innerW,
      innerH,
      yMin,
      yMax,
      toX,
      toY,
      pathMain: buildCurvePath(pointsMain),
      pathSpring: buildCurvePath(pointsSpring),
      pathNeap: buildCurvePath(pointsNeap),
      xDesired,
      yDesired,
      tickYs,
    };
  }, [scenario, derived]);

  const sliderLabel = useMemo(() => {
    if (!scenario || !derived) return null;
    const hh = derived.queryTimeUtc.getUTCHours();
    const mm = derived.queryTimeUtc.getUTCMinutes();
    const dayOffset = derived.queryTimeUtc.getUTCDate() - 1; // Jan 1 => 0
    const hhmm = minutesToHHMM(hh * 60 + mm);
    const daySuffix = dayOffset > 0 ? " (+1 gün)" : "";
    return `${hhmm}${daySuffix}`;
  }, [scenario, derived]);

  return (
    <MobileLayout>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-blue-500" />
              <h1 className="text-xl font-bold">Gelgit Hesabı Eğitimi (Tide Calculation Trainer)</h1>
              <Badge variant="outline">Eğitim</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Canlı veri yoktur. Amaç, <strong>tide hesabının nasıl yapıldığını</strong> simülasyonla öğretmektir.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Girdi Formu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="lw-time">LW Saati</Label>
                <Input id="lw-time" type="time" value={form.lwTime} onChange={(e) => setForm({ ...form, lwTime: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lw-height">LW Yüksekliği (m)</Label>
                <Input id="lw-height" type="number" step="0.01" value={form.lwHeightM} onChange={(e) => setForm({ ...form, lwHeightM: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hw-time">HW Saati</Label>
                <Input id="hw-time" type="time" value={form.hwTime} onChange={(e) => setForm({ ...form, hwTime: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hw-height">HW Yüksekliği (m)</Label>
                <Input id="hw-height" type="number" step="0.01" value={form.hwHeightM} onChange={(e) => setForm({ ...form, hwHeightM: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="charted-depth">Harita Derinliği (CD) (m)</Label>
                <Input id="charted-depth" type="number" step="0.01" value={form.chartedDepthM} onChange={(e) => setForm({ ...form, chartedDepthM: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="draft">Draft / Su çekimi (m)</Label>
                <Input id="draft" type="number" step="0.01" value={form.draftM} onChange={(e) => setForm({ ...form, draftM: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squat">Squat (m)</Label>
                <Input id="squat" type="number" step="0.01" value={form.squatM} onChange={(e) => setForm({ ...form, squatM: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="safety-margin">Emniyet Payı (m)</Label>
                <Input id="safety-margin" type="number" step="0.01" value={form.safetyMarginM} onChange={(e) => setForm({ ...form, safetyMarginM: e.target.value })} />
              </div>
            </div>

            <Button className="w-full" onClick={handleCalculate} type="button">
              Hesapla
            </Button>
          </CardContent>
        </Card>

        {/* Step-by-step Toggle */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="font-semibold">Adım Adım Mod</div>
                <div className="text-sm text-muted-foreground">Açıldığında grafikte numaralı oklar ve kısa açıklamalar görünür.</div>
              </div>
              <Switch checked={stepMode} onCheckedChange={setStepMode} />
            </div>
          </CardContent>
        </Card>

        {/* Tide Curve (SVG) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Gelgit Eğrisi (SVG)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!scenario || !derived || !svg ? (
              <div className="text-sm text-muted-foreground">
                Eğriyi görmek için yukarıdan değerleri girip <strong>Hesapla</strong>’ya basın.
              </div>
            ) : (
              <div className="w-full">
                <svg viewBox={`0 0 ${svg.W} ${svg.H}`} className="w-full h-auto">
                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                      <path d="M0,0 L9,3 L0,6 Z" fill="currentColor" />
                    </marker>
                  </defs>

                  {/* axes */}
                  <g stroke="currentColor" opacity={0.25}>
                    <line x1={svg.padL} y1={svg.padT} x2={svg.padL} y2={svg.H - svg.padB} />
                    <line x1={svg.W - svg.padR} y1={svg.padT} x2={svg.W - svg.padR} y2={svg.H - svg.padB} />
                    <line x1={svg.padL} y1={svg.H - svg.padB} x2={svg.W - svg.padR} y2={svg.H - svg.padB} />
                  </g>

                  {/* y ticks (height) */}
                  <g fill="currentColor" opacity={0.7} fontSize="12">
                    {svg.tickYs.map((t) => (
                      <g key={t.y}>
                        <line x1={svg.padL - 4} y1={t.y} x2={svg.padL} y2={t.y} stroke="currentColor" opacity={0.25} />
                        <text x={svg.padL - 8} y={t.y + 4} textAnchor="end" opacity={0.7}>
                          {t.v.toFixed(1)}
                        </text>
                      </g>
                    ))}
                    {[0, 0.5, 1].map((f) => {
                      const range = scenario.hwHeightM - scenario.lwHeightM;
                      const y = svg.toY(scenario.lwHeightM + f * range);
                      return (
                        <g key={`f-${f}`}>
                          <line x1={svg.W - svg.padR} y1={y} x2={svg.W - svg.padR + 4} y2={y} stroke="currentColor" opacity={0.25} />
                          <text x={svg.W - svg.padR + 8} y={y + 4} textAnchor="start" opacity={0.7}>
                            {f.toFixed(f === 0 || f === 1 ? 0 : 1)}
                          </text>
                        </g>
                      );
                    })}
                    <text x={svg.padL} y={14} textAnchor="start" opacity={0.7}>
                      Yükseklik (m)
                    </text>
                    <text x={svg.W - svg.padR} y={14} textAnchor="end" opacity={0.7}>
                      Factor (0–1)
                    </text>
                  </g>

                  {/* reference curves */}
                  <path d={svg.pathSpring} fill="none" stroke="#ef4444" strokeWidth={2.25} opacity={0.55} />
                  <path d={svg.pathNeap} fill="none" stroke="#3b82f6" strokeWidth={2.25} opacity={0.55} strokeDasharray="7 6" />

                  {/* main curve */}
                  <path d={svg.pathMain} fill="none" stroke="currentColor" strokeWidth={3} opacity={0.9} />

                  {/* LW / HW points */}
                  <g fill="currentColor">
                    <circle cx={svg.toX(0)} cy={svg.toY(scenario.lwHeightM)} r={4.5} />
                    <circle cx={svg.toX(derived.totalMin)} cy={svg.toY(scenario.hwHeightM)} r={4.5} />
                  </g>
                  <g fill="currentColor" fontSize="12" opacity={0.85}>
                    <text x={svg.toX(0) + 6} y={svg.toY(scenario.lwHeightM) - 8}>
                      LW ({form.lwTime}, {scenario.lwHeightM.toFixed(2)} m)
                    </text>
                    <text x={svg.toX(derived.totalMin) - 6} y={svg.toY(scenario.hwHeightM) - 8} textAnchor="end">
                      HW ({form.hwTime}
                      {parseTimeToMinutes(form.hwTime) != null && parseTimeToMinutes(form.lwTime) != null && (parseTimeToMinutes(form.hwTime)! <= parseTimeToMinutes(form.lwTime)! ? " +1g" : "")}
                      , {scenario.hwHeightM.toFixed(2)} m)
                    </text>
                  </g>

                  {/* desired time marker */}
                  <g>
                    <line x1={svg.xDesired} y1={svg.padT} x2={svg.xDesired} y2={svg.H - svg.padB} stroke="currentColor" opacity={0.18} />
                    <circle cx={svg.xDesired} cy={svg.yDesired} r={6} fill="#10b981" />
                    <circle cx={svg.xDesired} cy={svg.yDesired} r={10} fill="none" stroke="#10b981" opacity={0.5} />
                    <text x={svg.xDesired} y={svg.yDesired - 14} textAnchor="middle" fontSize="12" fill="currentColor" opacity={0.9}>
                      HOT
                    </text>
                  </g>

                  {/* Step-by-step overlay */}
                  {stepMode && (
                    <g fontSize="12" fill="currentColor">
                      {/* 1. HW/LW okuma */}
                      <g opacity={0.95}>
                        <circle cx={svg.toX(0) + 18} cy={svg.toY(scenario.lwHeightM) + 18} r={12} fill="currentColor" opacity={0.15} />
                        <circle cx={svg.toX(0) + 18} cy={svg.toY(scenario.lwHeightM) + 18} r={10} fill="#0ea5e9" />
                        <text x={svg.toX(0) + 18} y={svg.toY(scenario.lwHeightM) + 22} textAnchor="middle" fill="white">
                          1
                        </text>
                        <line
                          x1={svg.toX(0) + 28}
                          y1={svg.toY(scenario.lwHeightM) + 10}
                          x2={svg.toX(0) + 8}
                          y2={svg.toY(scenario.lwHeightM) + 2}
                          stroke="currentColor"
                          opacity={0.6}
                          markerEnd="url(#arrow)"
                        />
                        <text x={svg.toX(0) + 44} y={svg.toY(scenario.lwHeightM) + 22} opacity={0.85}>
                          HW/LW değerlerini oku
                        </text>
                      </g>

                      {/* 2. Range hesaplama */}
                      <g opacity={0.95}>
                        <circle cx={svg.toX(derived.totalMin / 2)} cy={svg.padT + 20} r={10} fill="#0ea5e9" />
                        <text x={svg.toX(derived.totalMin / 2)} y={svg.padT + 24} textAnchor="middle" fill="white">
                          2
                        </text>
                        <text x={svg.toX(derived.totalMin / 2) + 16} y={svg.padT + 24} opacity={0.85}>
                          Range = HW − LW
                        </text>
                      </g>

                      {/* 3. Δt belirleme */}
                      <g opacity={0.95}>
                        <circle cx={svg.toX(derived.totalMin / 2)} cy={svg.H - svg.padB + 16} r={10} fill="#0ea5e9" />
                        <text x={svg.toX(derived.totalMin / 2)} y={svg.H - svg.padB + 20} textAnchor="middle" fill="white">
                          3
                        </text>
                        <text x={svg.toX(derived.totalMin / 2) + 16} y={svg.H - svg.padB + 20} opacity={0.85}>
                          Δt: LW→istenen zaman
                        </text>
                      </g>

                      {/* 4. Tide curve’den factor okuma */}
                      <g opacity={0.95}>
                        <circle cx={svg.xDesired + 18} cy={svg.yDesired - 24} r={10} fill="#0ea5e9" />
                        <text x={svg.xDesired + 18} y={svg.yDesired - 20} textAnchor="middle" fill="white">
                          4
                        </text>
                        <text x={svg.xDesired + 34} y={svg.yDesired - 20} opacity={0.85}>
                          Eğriden factor oku
                        </text>
                      </g>

                      {/* 5. ΔH & HOT */}
                      <g opacity={0.95}>
                        <circle cx={svg.xDesired + 18} cy={svg.yDesired + 18} r={10} fill="#0ea5e9" />
                        <text x={svg.xDesired + 18} y={svg.yDesired + 22} textAnchor="middle" fill="white">
                          5
                        </text>
                        <text x={svg.xDesired + 34} y={svg.yDesired + 22} opacity={0.85}>
                          ΔH = factor×range → HOT
                        </text>
                      </g>

                      {/* 6. Actual depth & UKC */}
                      <g opacity={0.95}>
                        <circle cx={svg.W - svg.padR - 64} cy={svg.padT + 20} r={10} fill="#0ea5e9" />
                        <text x={svg.W - svg.padR - 64} y={svg.padT + 24} textAnchor="middle" fill="white">
                          6
                        </text>
                        <text x={svg.W - svg.padR - 50} y={svg.padT + 24} opacity={0.85}>
                          Actual depth & UKC
                        </text>
                      </g>
                    </g>
                  )}
                </svg>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>
                    <span className="inline-block w-3 h-0.5 bg-red-500 align-middle mr-2" />
                    Springs (kırmızı düz)
                  </span>
                  <span>
                    <span className="inline-block w-3 h-0.5 bg-blue-500 align-middle mr-2" style={{ borderTop: "2px dashed #3b82f6" }} />
                    Neaps (mavi kesik)
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Desired Time Slider */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">İstenen Zaman (Slider)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!scenario || !derived ? (
              <div className="text-sm text-muted-foreground">Önce Hesapla ile senaryoyu oluşturun.</div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="text-muted-foreground">
                    LW: <span className="font-mono">{form.lwTime}</span> → HW:{" "}
                    <span className="font-mono">
                      {form.hwTime}
                      {parseTimeToMinutes(form.hwTime) != null && parseTimeToMinutes(form.lwTime) != null && (parseTimeToMinutes(form.hwTime)! <= parseTimeToMinutes(form.lwTime)! ? " (+1 gün)" : "")}
                    </span>
                  </div>
                  <div>
                    Seçilen: <span className="font-mono font-semibold">{sliderLabel}</span>
                  </div>
                </div>
                <Slider
                  value={[derived.desiredMin]}
                  min={0}
                  max={derived.totalMin}
                  step={1}
                  onValueChange={(v) => setDesiredMinuteFromLW(v[0] ?? 0)}
                />

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Factor</div>
                    <div className="font-mono text-lg">{fmtFactor(derived.factor)}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">ΔH</div>
                    <div className="font-mono text-lg">{fmtM(derived.deltaHM)}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">HOT</div>
                    <div className="font-mono text-lg">{fmtM(derived.hotM)}</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Hareketli Tide Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Hareketli Tide Table</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!scenario || !derived ? (
              <div className="text-sm text-muted-foreground">Tablo için senaryo oluşturun.</div>
            ) : (
              <>
                <div className="text-xs text-muted-foreground">
                  Varsayılan aralık: <strong>{scenario.stepMinutes} dk</strong> • Tablo yalnızca senaryo değişince yeniden üretilir.
                </div>

                <ScrollArea className="h-[300px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-background/80 backdrop-blur border-b">
                        <tr>
                          <th className="text-left p-2 font-medium">Time</th>
                          <th className="text-right p-2 font-medium">Factor</th>
                          <th className="text-right p-2 font-medium">ΔH</th>
                          <th className="text-right p-2 font-medium">HOT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((r, i) => {
                          const isHL = i === derived.highlightedIndex;
                          const hh = r.timeUtc.getUTCHours();
                          const mm = r.timeUtc.getUTCMinutes();
                          const dayOffset = r.timeUtc.getUTCDate() - 1;
                          const label = minutesToHHMM(hh * 60 + mm);
                          const daySuffix = dayOffset > 0 ? " (+1g)" : "";
                          return (
                            <tr
                              key={r.timeUtc.toISOString()}
                              ref={isHL ? highlightedRowRef : undefined}
                              className={isHL ? "bg-emerald-500/10 border-y border-emerald-500/30" : "border-b border-border/50"}
                            >
                              <td className="p-2 font-mono">
                                {label}
                                <span className="text-muted-foreground">{daySuffix}</span>
                              </td>
                              <td className="p-2 text-right font-mono">{fmtFactor(r.factor)}</td>
                              <td className="p-2 text-right font-mono">{fmtM(r.deltaHM)}</td>
                              <td className="p-2 text-right font-mono">{fmtM(r.hotM)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sonuç Kartları */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sonuç Kartları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!scenario || !derived ? (
              <div className="text-sm text-muted-foreground">Sonuçlar için senaryo oluşturun.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-muted-foreground">HOT</div>
                  <div className="font-mono text-2xl">{fmtM(derived.hotM)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    (LW + ΔH) • factor: <span className="font-mono">{fmtFactor(derived.factor)}</span>
                  </div>
                </div>
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-muted-foreground">Actual Depth</div>
                  <div className="font-mono text-2xl">{fmtM(derived.actualDepthM)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Charted depth + HOT
                  </div>
                </div>
                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground">UKC</div>
                    <Badge variant="outline" className={derived.ukcSafe ? "text-emerald-500" : "text-red-500"}>
                      {derived.ukcSafe ? "Güvenli" : "Riskli"}
                    </Badge>
                  </div>
                  <div className="font-mono text-2xl">{fmtM(derived.ukcM)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    UKC = CD + HOT − Draft − Squat − Safety margin
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Eğitim metni: Springs info box */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4" />
              Eğitim Notu: Springs / Neaps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg border p-3 bg-muted/30">
              <p className="text-foreground font-medium mb-1">“Springs occur X days after full/new moon” ne demek?</p>
              <p>
                Spring (sizigi) gelgitleri genellikle <strong>yeni ay/dolunaydan yaklaşık 1–2 gün sonra</strong> en belirgin hale gelir.
                Bu bilgi, <strong>range’in (HW−LW) neden büyüyüp küçüldüğünü</strong> ve eğitim amaçlı “springs/neaps” eğrisi seçim mantığını açıklar.
              </p>
              <p className="mt-2">
                <strong>Açık uyarı:</strong> Bu bilgi <strong>anlık HW/LW hesabı yapmaz</strong>; sadece yorum içindir.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground py-4">
          Educational use only – Not for navigation
        </div>
      </div>
    </MobileLayout>
  );
}

