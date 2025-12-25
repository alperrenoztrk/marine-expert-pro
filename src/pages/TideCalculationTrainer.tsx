import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Info, Waves } from "lucide-react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function fmt(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

function parseTimeHHMM(value: string): number | null {
  // Returns minutes since 00:00 (0..1439)
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isInteger(hh) || !Number.isInteger(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

function formatHHMMFromMinutes(totalMinutes: number): string {
  const minutes = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function minutesToHhMm(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? "-" : "";
  const abs = Math.abs(Math.round(totalMinutes));
  const hh = Math.floor(abs / 60);
  const mm = abs % 60;
  return `${sign}${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

type IntervalSolve = {
  mode: "rising" | "falling";
  startTimeMin: number; // absolute minutes with rollover (0..2879)
  endTimeMin: number; // > start
  queryTimeMin: number; // within [start,end]
  startHeightM: number;
  endHeightM: number;
  lwHeightM: number;
  hwHeightM: number;
  lwTimeMin: number;
  hwTimeMin: number;
  factor: number; // 0..1
  rangeM: number; // abs range
  deltaTMin: number;
  totalTMin: number;
  deltaHM: number;
  hotM: number;
};

function solveInterval(args: {
  lwTime: string;
  lwHeight: string;
  hwTime: string;
  hwHeight: string;
  desiredTime: string;
}): { ok: true; result: IntervalSolve } | { ok: false; error: string } {
  const lwT0 = parseTimeHHMM(args.lwTime);
  const hwT0 = parseTimeHHMM(args.hwTime);
  const qT0 = parseTimeHHMM(args.desiredTime);
  const lwH = Number(args.lwHeight);
  const hwH = Number(args.hwHeight);

  if (lwT0 == null || hwT0 == null || qT0 == null) {
    return { ok: false, error: "Lütfen LW/HW/Desired saatlerini HH:MM formatında girin." };
  }
  if (!Number.isFinite(lwH) || !Number.isFinite(hwH)) {
    return { ok: false, error: "Lütfen LW/HW yüksekliklerini (m) sayı olarak girin." };
  }

  // Candidate A: LW -> HW (rising)
  const lwA = lwT0;
  const hwA = hwT0 < lwA ? hwT0 + 1440 : hwT0;
  const qA = qT0 < lwA ? qT0 + 1440 : qT0;
  const fitsA = qA >= lwA && qA <= hwA && hwA > lwA;

  // Candidate B: HW -> LW (falling)
  const hwB = hwT0;
  const lwB = lwT0 < hwB ? lwT0 + 1440 : lwT0;
  const qB = qT0 < hwB ? qT0 + 1440 : qT0;
  const fitsB = qB >= hwB && qB <= lwB && lwB > hwB;

  if (!fitsA && !fitsB) {
    return {
      ok: false,
      error:
        "Desired time, verdiğiniz LW ile HW arasına düşmüyor. İpucu: Eğer olaylar gece yarısını aşıyorsa, uygulama otomatik +24h varsayar (örn. LW 23:30, HW 05:10).",
    };
  }

  // Pick the interval that contains the desired time (prefer shorter interval if both).
  const useA = fitsA && (!fitsB || hwA - lwA <= lwB - hwB);
  const mode = useA ? ("rising" as const) : ("falling" as const);

  const startTimeMin = useA ? lwA : hwB;
  const endTimeMin = useA ? hwA : lwB;
  const queryTimeMin = useA ? qA : qB;
  const startHeightM = useA ? lwH : hwH;
  const endHeightM = useA ? hwH : lwH;

  const totalTMin = endTimeMin - startTimeMin;
  const deltaTMin = queryTimeMin - startTimeMin;
  if (!(totalTMin > 0)) return { ok: false, error: "LW/HW zaman farkı 0 olamaz." };

  const t = clamp(deltaTMin, 0, totalTMin);
  const factor = (1 - Math.cos(Math.PI * (t / totalTMin))) / 2;
  const rangeM = Math.abs(hwH - lwH);
  const deltaHM = factor * rangeM;
  const hotM = startHeightM + (endHeightM - startHeightM) * factor;

  return {
    ok: true,
    result: {
      mode,
      startTimeMin,
      endTimeMin,
      queryTimeMin,
      startHeightM,
      endHeightM,
      lwHeightM: lwH,
      hwHeightM: hwH,
      lwTimeMin: lwT0,
      hwTimeMin: hwT0,
      factor,
      rangeM,
      deltaTMin,
      totalTMin,
      deltaHM,
      hotM,
    },
  };
}

function buildTenMinuteTable(s: IntervalSolve) {
  const rows: Array<{ time: string; factor: number; hotM: number }> = [];
  const step = 10;
  for (let m = s.startTimeMin; m <= s.endTimeMin; m += step) {
    const t = clamp(m - s.startTimeMin, 0, s.totalTMin);
    const factor = (1 - Math.cos(Math.PI * (t / s.totalTMin))) / 2;
    const hotM = s.startHeightM + (s.endHeightM - s.startHeightM) * factor;
    rows.push({ time: formatHHMMFromMinutes(m), factor, hotM });
  }
  return rows;
}

function SpringIntensityMeter(props: { intensity: number }) {
  const pct = clamp(props.intensity, 0, 1) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Neap (0)</span>
        <span className="font-mono">{fmt(props.intensity, 2)}</span>
        <span>Spring (1)</span>
      </div>
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-red-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Callout(props: { n: number; title: string; body: string; className?: string }) {
  return (
    <div className={`rounded-lg border bg-background/95 shadow-sm p-3 ${props.className ?? ""}`}>
      <div className="flex items-start gap-2">
        <div className="h-6 w-6 shrink-0 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
          {props.n}
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold">{props.title}</div>
          <div className="text-xs text-muted-foreground leading-5">{props.body}</div>
        </div>
      </div>
    </div>
  );
}

function TideCurveSvg(props: {
  solve: IntervalSolve;
  stepMode: boolean;
}) {
  const w = 860;
  const h = 300;
  const padL = 16;
  const padR = 60;
  const padT = 14;
  const padB = 34;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const xAt = (tMin: number) => padL + (tMin / props.solve.totalTMin) * innerW;
  const yAt = (factor: number) => padT + (1 - factor) * innerH;

  const points: Array<{ x: number; y: number }> = [];
  {
    const n = 180;
    for (let i = 0; i <= n; i++) {
      const t = (props.solve.totalTMin * i) / n;
      const f = (1 - Math.cos(Math.PI * (t / props.solve.totalTMin))) / 2;
      points.push({ x: xAt(t), y: yAt(f) });
    }
  }

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");

  // Illustrative reference curves (education-only): spring more “extreme”, neap flatter.
  const springPath = points
    .map((_p, i) => {
      const t = (props.solve.totalTMin * i) / 180;
      const f = (1 - Math.cos(Math.PI * (t / props.solve.totalTMin))) / 2;
      const f2 = clamp(0.5 + (f - 0.5) * 1.18, 0, 1);
      return `${i === 0 ? "M" : "L"} ${xAt(t).toFixed(2)} ${yAt(f2).toFixed(2)}`;
    })
    .join(" ");

  const neapPath = points
    .map((_p, i) => {
      const t = (props.solve.totalTMin * i) / 180;
      const f = (1 - Math.cos(Math.PI * (t / props.solve.totalTMin))) / 2;
      const f2 = clamp(0.5 + (f - 0.5) * 0.62, 0, 1);
      return `${i === 0 ? "M" : "L"} ${xAt(t).toFixed(2)} ${yAt(f2).toFixed(2)}`;
    })
    .join(" ");

  const desiredX = xAt(props.solve.deltaTMin);
  const desiredY = yAt(props.solve.factor);

  const tickCount = 6;
  const xTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const t = (props.solve.totalTMin * i) / tickCount;
    const x = xAt(t);
    const label = formatHHMMFromMinutes(props.solve.startTimeMin + t);
    return { x, label };
  });

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ y: yAt(f), label: String(f) }));

  return (
    <div className="relative w-full overflow-x-auto">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block w-full min-w-[860px]">
        {/* Plot area */}
        <rect x={padL} y={padT} width={innerW} height={innerH} fill="transparent" stroke="hsl(var(--border))" />

        {/* Reference curves */}
        <path d={springPath} fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.65" />
        <path d={neapPath} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.7" strokeDasharray="6 5" />

        {/* Main factor curve */}
        <path d={path} fill="none" stroke="hsl(var(--foreground))" strokeWidth="2.5" opacity="0.85" />

        {/* Desired vertical + point */}
        <line x1={desiredX} y1={padT} x2={desiredX} y2={padT + innerH} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
        <circle cx={desiredX} cy={desiredY} r="5" fill="hsl(var(--primary))" />

        {/* Axes labels */}
        <text x={padL} y={h - 8} fontSize="11" fill="hsl(var(--muted-foreground))">
          Zaman (HH:MM)
        </text>
        <text x={w - 8} y={padT - 2} fontSize="11" fill="hsl(var(--muted-foreground))" textAnchor="end">
          Factor (0..1)
        </text>

        {/* X ticks */}
        {xTicks.map((t) => (
          <g key={t.label}>
            <line x1={t.x} y1={padT + innerH} x2={t.x} y2={padT + innerH + 6} stroke="hsl(var(--border))" />
            <text x={t.x} y={padT + innerH + 20} fontSize="11" fill="hsl(var(--muted-foreground))" textAnchor="middle">
              {t.label}
            </text>
          </g>
        ))}

        {/* Y ticks (right) */}
        {yTicks.map((t) => (
          <g key={t.label}>
            <line x1={padL + innerW} y1={t.y} x2={padL + innerW + 6} y2={t.y} stroke="hsl(var(--border))" />
            <text x={padL + innerW + 10} y={t.y + 4} fontSize="11" fill="hsl(var(--muted-foreground))">
              {t.label}
            </text>
          </g>
        ))}
      </svg>

      {props.stepMode && (
        <>
          <div className="absolute left-3 top-3 max-w-[360px]">
            <Callout
              n={5}
              title="Grafikte neye bakıyoruz?"
              body="Bu grafik bir eğitim çizimi: Y ekseninde “factor (0..1)” var. Factor, LW→HW arasında gelgitin değişiminin sinüsoidal (cos) dağıldığını gösterir. Kırmızı/ mavi eğriler sadece “spring/neap” etkisini sezdiren referans çizgileridir."
            />
          </div>
          <div className="absolute right-3 bottom-10 max-w-[320px]">
            <Callout
              n={6}
              title="Desired time → HOT noktası"
              body="Dikey çizgi hedef zamanı gösterir. Noktanın factor değeriyle Range paylaştırılır ve bulunduğunuz andaki Height of Tide (HOT) elde edilir. HOT, charted depth’e eklenir."
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function TideCalculationTrainer() {
  const navigate = useNavigate();

  // Lesson 2: Spring/Neap concept
  const [phase, setPhase] = useState<"new" | "full" | "quarters">("new");
  const [daysSincePhase, setDaysSincePhase] = useState("2");
  const [lagDays, setLagDays] = useState(2);
  const [maxWindow, setMaxWindow] = useState("7");

  const intensity = useMemo(() => {
    const days = Number(daysSincePhase);
    const window = Number(maxWindow);
    if (!Number.isFinite(days) || !Number.isFinite(window) || window <= 0) return 0;

    // Provided teaching rule: “Springs occur N days after new/full moon”.
    // If user selects quarters, we map “days since full/new” ≈ 7 + days since quarter (quarter ~7 days after new/full).
    const daysSinceFullOrNew = phase === "quarters" ? 7 + days : days;
    return clamp(1 - Math.abs(daysSinceFullOrNew - lagDays) / window, 0, 1);
  }, [daysSincePhase, lagDays, maxWindow, phase]);

  // Lesson 3: Tide curve calculator
  const [lwTime, setLwTime] = useState("06:00");
  const [lwHeight, setLwHeight] = useState("1.2");
  const [hwTime, setHwTime] = useState("12:15");
  const [hwHeight, setHwHeight] = useState("4.8");
  const [desiredTime, setDesiredTime] = useState("09:30");
  const [chartedDepth, setChartedDepth] = useState("");
  const [draft, setDraft] = useState("");
  const [stepMode, setStepMode] = useState(false);

  const solved = useMemo(() => {
    return solveInterval({ lwTime, lwHeight, hwTime, hwHeight, desiredTime });
  }, [desiredTime, hwHeight, hwTime, lwHeight, lwTime]);

  const tenMinTable = useMemo(() => {
    if (!solved.ok) return [];
    return buildTenMinuteTable(solved.result);
  }, [solved]);

  const derived = useMemo(() => {
    if (!solved.ok) return null;
    const cd = Number(chartedDepth);
    const dr = Number(draft);
    const hasCD = Number.isFinite(cd);
    const hasDraft = Number.isFinite(dr);
    const actualDepth = hasCD ? cd + solved.result.hotM : null;
    const ukc = hasCD && hasDraft ? actualDepth! - dr : null;
    return { hasCD, hasDraft, actualDepth, ukc };
  }, [chartedDepth, draft, solved]);

  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Gelgit"
        title="Tide Calculation Trainer"
        subtitle="Canlı veri çekmez — amaç gelgit hesabını adım adım öğretmek."
      >
        <div className="pb-20 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="outline" className="gap-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4" />
              Bu sayfa eğitim amaçlıdır; resmî tide table yerine geçmez.
            </div>
          </div>

          <Tabs defaultValue="lesson1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lesson1">1) Tide Table</TabsTrigger>
              <TabsTrigger value="lesson2">2) Spring/Neap</TabsTrigger>
              <TabsTrigger value="lesson3">3) Tide Curve</TabsTrigger>
            </TabsList>

            <TabsContent value="lesson1" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-5 w-5 text-blue-500" />
                    Lesson: Tide Table (HW/LW, CD, Springs/Neaps)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-6">
                  <div className="rounded border bg-muted/30 p-3">
                    <div className="font-semibold mb-1">HW / LW satırları (neden önemli?)</div>
                    <div className="text-muted-foreground">
                      Tide table size iki “referans nokta” verir: <strong>Low Water (LW)</strong> ve <strong>High Water (HW)</strong>.
                      İstediğiniz saat bu iki noktanın arasında kalır; biz de “eğri üzerindeki konumu” bulup <strong>Height of Tide (HOT)</strong> hesaplarız.
                    </div>
                  </div>

                  <div className="rounded border bg-muted/30 p-3">
                    <div className="font-semibold mb-1">CD / Chart Datum (neden HOT eklenir?)</div>
                    <div className="text-muted-foreground">
                      Haritadaki derinlikler genellikle <strong>Chart Datum (CD)</strong> gibi düşük bir referansa göre verilir.
                      Bu yüzden gerçek su derinliği yaklaşık olarak:
                      <div className="font-mono mt-2">Actual depth ≈ Charted depth + HOT</div>
                      HOT burada “o andaki gelgit katkısıdır”.
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded border bg-muted/30 p-3">
                      <div className="font-semibold mb-1">Spring (Sizigi) – neden range büyür?</div>
                      <div className="text-muted-foreground">
                        Yeni ay / dolunay civarında Güneş ve Ay aynı hizaya gelir → etkiler “toplanır”.
                        Sonuç: <strong>HW daha yüksek</strong>, <strong>LW daha alçak</strong>, yani <strong>range büyür</strong>.
                      </div>
                    </div>
                    <div className="rounded border bg-muted/30 p-3">
                      <div className="font-semibold mb-1">Neap (Kuadratur) – neden range küçülür?</div>
                      <div className="text-muted-foreground">
                        İlk/son dördün civarında Güneş ve Ay yaklaşık 90° konumdadır → etkiler “zayıflar”.
                        Sonuç: <strong>range küçülür</strong> ve HOT değişimi daha sınırlı kalır.
                      </div>
                    </div>
                  </div>

                  <div className="rounded border p-3 text-xs text-muted-foreground">
                    Eğitim ipucu: Bir hesap problemi gördüğünüzde önce şunu sor: “Desired time, hangi iki olayın arasında (LW→HW mi, HW→LW mi)?”
                    Çünkü “yükseliş mi alçalış mı?” seçimi formülün yönünü belirler.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lesson2" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson: Spring/Neap concept (interaktif)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded border bg-muted/30 p-3 text-sm leading-6">
                    <div className="font-semibold">Cümleyi birlikte “hissettiriyoruz”</div>
                    <div className="text-muted-foreground">
                      “<strong>Springs occur N days after new/full moon</strong>”:
                      Yeni ay/dolunaydan hemen sonra değil, <strong>1–3 gün gecikmeyle</strong> en kuvvetli hale gelir.
                      Aşağıda gecikmeyi (lag) ayarlayıp “spring intensity” değerini gör.
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Moon phase</Label>
                        <Select
                          value={phase}
                          onValueChange={(v) => {
                            if (v === "new" || v === "full" || v === "quarters") setPhase(v);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New moon (🌑)</SelectItem>
                            <SelectItem value="full">Full moon (🌕)</SelectItem>
                            <SelectItem value="quarters">Quarters (🌓/🌗)</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="text-xs text-muted-foreground">
                          Neden sorusu: Springs new/full ile, neaps quarters ile ilişkilidir.
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Days since phase</Label>
                        <Input inputMode="decimal" value={daysSincePhase} onChange={(e) => setDaysSincePhase(e.target.value)} placeholder="Örn: 2" />
                        <div className="text-xs text-muted-foreground">
                          Eğer “quarters” seçtiysen, uygulama bunu eğitim amaçlı yaklaşık olarak “new/full’den ~7 gün sonra” diye yorumlar.
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Lag days (1–3 gün)</Label>
                        <div className="flex items-center gap-3">
                          <Slider value={[lagDays]} min={1} max={3} step={1} onValueChange={(v) => setLagDays(v[0] ?? 2)} />
                          <div className="font-mono text-sm w-10 text-right">{lagDays}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Neden: maksimum spring etkisi çoğu bölgede yeni/dolunaydan 1–3 gün sonra görülebilir.
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Max window (gün)</Label>
                        <Input inputMode="decimal" value={maxWindow} onChange={(e) => setMaxWindow(e.target.value)} placeholder="Örn: 7" />
                        <div className="text-xs text-muted-foreground">
                          Bu, “lag’dan uzaklaştıkça intensity ne kadar hızlı düşsün?” sorusunun ayarıdır (eğitim amaçlı).
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded border p-4">
                        <div className="text-xs text-muted-foreground mb-2">Spring intensity (0..1)</div>
                        <SpringIntensityMeter intensity={intensity} />
                      </div>

                      <div className="rounded border bg-muted/30 p-3 text-sm leading-6">
                        <div className="font-semibold mb-1">Hesap (neden böyle?)</div>
                        <div className="text-muted-foreground">
                          Biz burada basit bir öğretici model kullanıyoruz:
                          <div className="font-mono mt-2">
                            intensity = clamp(1 - abs(daysSinceFullOrNew - lagDays)/maxWindow, 0, 1)
                          </div>
                          Lag’a yaklaştıkça intensity 1’e yaklaşır; uzaklaştıkça 0’a iner. Amaç “kavramsal” sezgi kazandırmaktır.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lesson3" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson: Tide Curve Calculator (cos factor eğrisi)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                      Bu ders “Rule of Twelfths” yerine istenen cos‑factor eğrisini kullanır:
                      <span className="font-mono ml-2">factor(t)= (1 - cos(pi * t/T))/2</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-sm">Step-by-step mode</Label>
                      <Switch checked={stepMode} onCheckedChange={setStepMode} />
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="rounded border bg-muted/30 p-3 space-y-3 relative">
                        <div className="text-sm font-semibold">Girdiler</div>

                        {stepMode && (
                          <div className="mb-2">
                            <Callout
                              n={1}
                              title="Referans iki nokta seç"
                              body="Tide eğrisi tek başına bir “zaman‑yükseklik” fonksiyonudur. Bunun için iki uç noktayı (LW ve HW) bilmemiz gerekir. Neden: Range ve toplam süre (T) bu iki noktadan çıkar."
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>LW time</Label>
                            <Input value={lwTime} onChange={(e) => setLwTime(e.target.value)} placeholder="06:00" />
                          </div>
                          <div className="space-y-2">
                            <Label>LW height (m)</Label>
                            <Input inputMode="decimal" value={lwHeight} onChange={(e) => setLwHeight(e.target.value)} placeholder="1.2" />
                          </div>
                          <div className="space-y-2">
                            <Label>HW time</Label>
                            <Input value={hwTime} onChange={(e) => setHwTime(e.target.value)} placeholder="12:15" />
                          </div>
                          <div className="space-y-2">
                            <Label>HW height (m)</Label>
                            <Input inputMode="decimal" value={hwHeight} onChange={(e) => setHwHeight(e.target.value)} placeholder="4.8" />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label>Desired time</Label>
                            <Input value={desiredTime} onChange={(e) => setDesiredTime(e.target.value)} placeholder="09:30" />
                            <div className="text-xs text-muted-foreground">
                              Not: Eğer HW, LW’dan “daha erken saat” ise uygulama bunu ertesi gün varsayar (gece yarısı taşması).
                            </div>
                          </div>
                        </div>

                        {stepMode && (
                          <div className="pt-2">
                            <Callout
                              n={2}
                              title="Range’i hesapla"
                              body="Range = |HW − LW|. Neden: Gelgitin toplam değişimini (amplitüd paylaştırmanın temelini) verir."
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="space-y-2">
                            <Label>Charted depth (optional, m)</Label>
                            <Input inputMode="decimal" value={chartedDepth} onChange={(e) => setChartedDepth(e.target.value)} placeholder="Örn: 8.3" />
                          </div>
                          <div className="space-y-2">
                            <Label>Draft (optional, m)</Label>
                            <Input inputMode="decimal" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Örn: 7.1" />
                          </div>
                        </div>
                      </div>

                      <div className="rounded border bg-muted/30 p-3 space-y-3 relative">
                        <div className="text-sm font-semibold">Çıktılar (nedenleriyle)</div>

                        {!solved.ok ? (
                          <div className="text-sm text-red-600">{solved.error}</div>
                        ) : (
                          <>
                            {stepMode && (
                              <Callout
                                n={3}
                                title="Δt ve factor"
                                body="Δt = start (LW veya HW) ile desired arasındaki süredir. Neden: eğrideki yatay konum. Sonra factor(t) ile değişimin sinüsoidal dağıldığını varsayarız (daha gerçekçi bir öğretici model)."
                              />
                            )}

                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded border bg-background p-3">
                                <div className="text-xs text-muted-foreground">Mode</div>
                                <div className="font-mono text-lg">{solved.result.mode === "rising" ? "Rising (LW→HW)" : "Falling (HW→LW)"}</div>
                              </div>
                              <div className="rounded border bg-background p-3">
                                <div className="text-xs text-muted-foreground">Range</div>
                                <div className="font-mono text-lg">{fmt(solved.result.rangeM)} m</div>
                              </div>
                              <div className="rounded border bg-background p-3">
                                <div className="text-xs text-muted-foreground">Δt</div>
                                <div className="font-mono text-lg">
                                  {minutesToHhMm(solved.result.deltaTMin)} <span className="text-xs text-muted-foreground">({solved.result.deltaTMin} min)</span>
                                </div>
                              </div>
                              <div className="rounded border bg-background p-3">
                                <div className="text-xs text-muted-foreground">factor (0..1)</div>
                                <div className="font-mono text-lg">{fmt(solved.result.factor, 4)}</div>
                              </div>
                            </div>

                            {stepMode && (
                              <Callout
                                n={4}
                                title="ΔH ve HOT"
                                body="ΔH = factor × Range. Neden: Range’i zamana göre paylaştırıyoruz. HOT ise LW’ye eklenir (yükselişte) veya HW’den düşülür (alçalışta). Genel form: height = startHeight + (endHeight − startHeight) × factor."
                              />
                            )}

                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded border bg-background p-3">
                                <div className="text-xs text-muted-foreground">ΔH</div>
                                <div className="font-mono text-lg">{fmt(solved.result.deltaHM)} m</div>
                              </div>
                              <div className="rounded border bg-background p-3">
                                <div className="text-xs text-muted-foreground">HOT</div>
                                <div className="font-mono text-lg">{fmt(solved.result.hotM)} m</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded border bg-background p-3">
                                <div className="text-xs text-muted-foreground">Actual depth (charted + HOT)</div>
                                <div className="font-mono text-lg">{derived?.actualDepth == null ? "—" : `${fmt(derived.actualDepth)} m`}</div>
                              </div>
                              <div className="rounded border bg-background p-3">
                                <div className="text-xs text-muted-foreground">UKC (actual depth − draft)</div>
                                <div className="font-mono text-lg">{derived?.ukc == null ? "—" : `${fmt(derived.ukc)} m`}</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded border bg-muted/30 p-3 space-y-3">
                        <div className="text-sm font-semibold">Tide curve (eğitim grafiği)</div>
                        {!solved.ok ? (
                          <div className="text-sm text-muted-foreground">Önce geçerli girdiler girin (LW/HW/Desired).</div>
                        ) : (
                          <TideCurveSvg solve={solved.result} stepMode={stepMode} />
                        )}
                      </div>

                      <div className="rounded border bg-muted/30 p-3 space-y-3">
                        <div className="text-sm font-semibold">10 dk aralıklı tablo</div>
                        <div className="text-xs text-muted-foreground">
                          Neden: Hesabın sadece tek bir anda değil, aralık boyunca “nasıl değiştiğini” görerek öğrenmek.
                        </div>

                        {!solved.ok ? (
                          <div className="text-sm text-muted-foreground">Tablo için geçerli girdiler gerekli.</div>
                        ) : (
                          <ScrollArea className="h-[260px]">
                            <table className="w-full text-xs border-collapse">
                              <thead className="sticky top-0 bg-background">
                                <tr className="border-b">
                                  <th className="text-left p-2">time</th>
                                  <th className="text-right p-2">factor</th>
                                  <th className="text-right p-2">HOT (m)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tenMinTable.map((r) => (
                                  <tr key={r.time} className="border-b">
                                    <td className="p-2 font-mono">{r.time}</td>
                                    <td className="p-2 text-right font-mono">{fmt(r.factor, 4)}</td>
                                    <td className="p-2 text-right font-mono">{fmt(r.hotM)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </ScrollArea>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CalculationGridScreen>
    </MobileLayout>
  );
}

