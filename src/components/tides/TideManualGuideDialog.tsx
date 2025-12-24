import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleHelp, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

import tideTableExcerpt from "@/assets/tides/tide-table-excerpt.svg";
import ruleOfTwelfths from "@/assets/tides/rule-of-twelfths.svg";
import ukcStack from "@/assets/tides/ukc-stack.svg";

type Flow = "rising" | "falling";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Rule of twelfths cumulative fractions at each whole hour:
 * 0h:0/12, 1h:1/12, 2h:3/12, 3h:6/12, 4h:9/12, 5h:11/12, 6h:12/12
 * For partial hours, we linearly interpolate within that hour's "increment" (1,2,3,3,2,1)/12.
 */
function twelfthsCumulativeFraction(elapsedHours: number): number {
  const t = clamp(elapsedHours, 0, 6);
  const whole = Math.floor(t);
  const frac = t - whole;

  const cumulative = [0, 1, 3, 6, 9, 11, 12]; // /12
  const increments = [1, 2, 3, 3, 2, 1]; // /12 for each hour segment 0-1..5-6

  if (whole >= 6) return 1;

  const base = cumulative[whole] / 12;
  const inc = increments[whole] / 12;
  return base + inc * frac;
}

function fmt(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
}

export function TideManualGuideDialog() {
  const [step, setStep] = useState(0);

  // Mini demo inputs (teaching aid)
  const [flow, setFlow] = useState<Flow>("rising");
  const [lwHeight, setLwHeight] = useState("1.2");
  const [hwHeight, setHwHeight] = useState("4.8");
  const [elapsed, setElapsed] = useState("2.0");

  const demo = useMemo(() => {
    const lw = parseFloat(lwHeight);
    const hw = parseFloat(hwHeight);
    const t = parseFloat(elapsed);
    if (!Number.isFinite(lw) || !Number.isFinite(hw) || !Number.isFinite(t)) return null;

    const range = hw - lw;
    const f = twelfthsCumulativeFraction(t);
    const hot = flow === "rising" ? lw + range * f : hw - range * f;

    return { range, fraction: f, hot };
  }, [elapsed, flow, hwHeight, lwHeight]);

  const steps = useMemo(
    () => [
      {
        title: "1) Tide table’dan HW/LW değerlerini al",
        body: (
          <div className="space-y-3">
            <p>
              Hesap yapacağın <strong>liman/istasyon</strong> ve <strong>tarih</strong> için tide table’dan iki bilgi al:{" "}
              <strong>LW (alçak su)</strong> ve <strong>HW (yüksek su)</strong> saatleri + yükseklikleri.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hedef zamanın <strong>hangi iki event’in arasında</strong> kaldığını belirle (LW→HW veya HW→LW).</li>
              <li>Tablodaki saatler <strong>UTC</strong> ise, sen de hesabı UTC yap (gerekirse yerel saat dönüşümü).</li>
            </ul>
            <div className="rounded-lg border bg-muted/30 p-3">
              <img
                src={tideTableExcerpt}
                alt="Tide table excerpt"
                className="w-full h-auto rounded-md"
                loading="lazy"
              />
            </div>
          </div>
        ),
      },
      {
        title: "2) Range’i ve geçen süreyi bul",
        body: (
          <div className="space-y-3">
            <div className="rounded border bg-muted/30 p-3 space-y-2">
              <div className="font-semibold">Temel tanımlar</div>
              <div>
                <strong>Range (R)</strong> = HW yüksekliği − LW yüksekliği
              </div>
              <div>
                <strong>Geçen süre (t)</strong> = (Sorgu zamanı − başlangıç event’i) saat cinsinden (0–6 aralığına getir)
              </div>
            </div>
            <p>
              Ardından 12’de 1 kuralını kullan: 6 saatlik LW↔HW değişimi yaklaşık olarak <strong>1-2-3-3-2-1 / 12</strong>{" "}
              şeklinde dağılır.
            </p>
            <div className="rounded-lg border bg-muted/30 p-3">
              <img src={ruleOfTwelfths} alt="Rule of twelfths" className="w-full h-auto rounded-md" loading="lazy" />
            </div>
          </div>
        ),
      },
      {
        title: "3) Height of Tide (HoT) hesabını yap (manuel)",
        body: (
          <div className="space-y-3">
            <div className="rounded border bg-muted/30 p-3 space-y-2">
              <div className="font-semibold">Formül (yaklaşık)</div>
              <div>
                <strong>Yükseliyorsa (LW→HW)</strong>: HoT ≈ LW + R × (kümülatif pay)
              </div>
              <div>
                <strong>Alçalıyorsa (HW→LW)</strong>: HoT ≈ HW − R × (kümülatif pay)
              </div>
            </div>

            <div className="rounded border p-3 space-y-3">
              <div className="font-semibold">Mini Demo (öğretici)</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>Akış</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={flow === "rising" ? "default" : "outline"}
                      onClick={() => setFlow("rising")}
                      className="flex-1"
                    >
                      LW→HW
                    </Button>
                    <Button
                      type="button"
                      variant={flow === "falling" ? "default" : "outline"}
                      onClick={() => setFlow("falling")}
                      className="flex-1"
                    >
                      HW→LW
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>LW (m)</Label>
                  <Input value={lwHeight} onChange={(e) => setLwHeight(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>HW (m)</Label>
                  <Input value={hwHeight} onChange={(e) => setHwHeight(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>Geçen süre t (saat)</Label>
                  <Input value={elapsed} onChange={(e) => setElapsed(e.target.value)} inputMode="decimal" />
                  <div className="text-xs text-muted-foreground">0–6 aralığında (ör. 2.5)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Range (R)</div>
                  <div className="font-mono text-lg">{demo ? `${fmt(demo.range)} m` : "—"}</div>
                </div>
                <div className="rounded border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Kümülatif pay</div>
                  <div className="font-mono text-lg">{demo ? `${fmt(demo.fraction)} × R` : "—"}</div>
                </div>
                <div className="rounded border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">HoT (yaklaşık)</div>
                  <div className="font-mono text-lg">{demo ? `${fmt(demo.hot)} m` : "—"}</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Not: 12’de 1 kuralı <strong>yaklaşık</strong> bir yöntemdir. Gerçek dünyada harmonik bileşenler/port düzeltmeleri
              fark yaratabilir.
            </div>
          </div>
        ),
      },
      {
        title: "4) UKC’ye bağla (Charted Depth + HoT → Available Depth)",
        body: (
          <div className="space-y-3">
            <p>
              Artık HoT’yi buldun. Bunu charted depth ile birleştirip UKC kontrolü yaparsın:
            </p>
            <div className="rounded border bg-muted/30 p-3 space-y-2">
              <div className="font-semibold">Özet akış</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Available Depth</strong> ≈ Charted Depth + HoT − (dalga/allowance)
                </li>
                <li>
                  <strong>Effective Draft</strong> ≈ Draft + Squat (+ trim düzeltmesi)
                </li>
                <li>
                  <strong>UKC</strong> ≈ Available Depth − Effective Draft − Safety Margin
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <img src={ukcStack} alt="UKC stack diagram" className="w-full h-auto rounded-md" loading="lazy" />
            </div>
            <div className="rounded border p-3 text-sm">
              Bu ekranda:
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  “<strong>HW / LW → Height of Tide (UTC)</strong>” bölümüne tide table’dan aldığın değerleri gir.
                </li>
                <li>
                  Çıkan <strong>Height of Tide</strong> sonucunu “<strong>UKC</strong>” bölümündeki gelgit/HoT olarak kullan.
                </li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [demo, elapsed, flow, hwHeight, lwHeight]
  );

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Gelgit hesabı yardım" title="Gelgit hesabı yardım">
          <CircleHelp className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gelgit hesabı (tide table’dan manuel) – Adım Adım</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div>
                Adım <span className="font-mono">{step + 1}</span>/<span className="font-mono">{steps.length}</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => setStep(0)} type="button">
                <RotateCcw className="h-4 w-4" /> Baştan
              </Button>
            </div>
            <Progress value={progress} />
          </div>

          <div className="rounded-lg border p-4 bg-muted/20">
            <div className="text-lg font-semibold mb-2">{steps[step]?.title}</div>
            <div className="text-sm leading-6">{steps[step]?.body}</div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setStep((s) => clamp(s - 1, 0, steps.length - 1))}
              disabled={step === 0}
            >
              <ChevronLeft className="h-4 w-4" /> Geri
            </Button>
            <Button
              type="button"
              className="gap-2"
              onClick={() => setStep((s) => clamp(s + 1, 0, steps.length - 1))}
              disabled={step === steps.length - 1}
            >
              İleri <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

