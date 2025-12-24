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
        title: "1) Gelgitin temeli: HW, LW ve Range",
        body: (
          <div className="space-y-3">
            <p>
              <strong>Gelgit (tide)</strong>, özellikle <strong>Ay</strong> ve <strong>Güneş</strong> çekim etkisiyle deniz seviyesinin periyodik
              yükselip alçalmasıdır. Hesap yaparken şu terimler net olmalı:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Yüksek su (High Water – HW)</strong>: suların en yüksek olduğu seviye/zaman
              </li>
              <li>
                <strong>Alçak su (Low Water – LW)</strong>: suların en alçak olduğu seviye/zaman
              </li>
              <li>
                <strong>Gelgit genliği / Range</strong>: <strong>HW − LW</strong> (seviye farkı)
              </li>
            </ul>
            <div className="rounded border bg-muted/30 p-3 text-sm">
              Hedef zamanın <strong>hangi iki olayın arasında</strong> kaldığını belirle (LW→HW veya HW→LW). Bu, hesabın “yükselme”
              mi “alçalma” mı olduğuna karar verir.
            </div>
          </div>
        ),
      },
      {
        title: "2) Ay evreleri: kuvvetli/zayıf gelgit + gelgit türleri",
        body: (
          <div className="space-y-3">
            <p>Gelgit şiddeti, Ay’ın evrelerine göre değişir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Kuvvetli gelgit (Spring / Sizigi)</strong>: yeni ay ve dolunay dönemleri → <strong>range artar</strong>
              </li>
              <li>
                <strong>Zayıf gelgit (Neap / Kuadratur)</strong>: ilk dördün ve son dördün → <strong>range azalır</strong>
              </li>
            </ul>
            <div className="rounded border bg-muted/30 p-3 text-sm space-y-2">
              <div className="font-semibold">Gelgit tipleri</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Günlük (Diurnal)</strong>: bir Ay gününde 1 HW + 1 LW (Ay günü ≈ 24s 50d)
                </li>
                <li>
                  <strong>Yarı günlük (Semi-diurnal)</strong>: bir Ay gününde 2 HW + 2 LW
                </li>
                <li>
                  <strong>Karışık (Mixed)</strong>: zaman aralıkları/tepe-dipler değişken olabilir
                </li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        title: "3) Tide Tables: Standart/Ana liman, İkincil/Tali liman, saat dilimi",
        body: (
          <div className="space-y-3">
            <p>
              Gelgit cetvellerinde (ör. <strong>Admiralty Tide Tables</strong>) iki referans tipi vardır:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Ana/Standart liman (Standard Port)</strong>: her gün için HW/LW <strong>zaman</strong> ve <strong>yükseklik</strong> verilir.
              </li>
              <li>
                <strong>Tali/İkincil liman (Secondary Port)</strong>: standart limana göre <strong>time differences</strong> ve{" "}
                <strong>height differences</strong> verilir; hesapta bunlar uygulanır.
              </li>
            </ul>
            <div className="rounded border bg-muted/30 p-3 text-sm space-y-2">
              <div className="font-semibold">Kontrol et</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Saat dilimi</strong>: tabloda yazan UTC/Zone neyse hesabı o zamanla yap.
                </li>
                <li>
                  <strong>Harita derinliği (chart datum)</strong>: derinliklerin LAT/MLWS/MLW vb. hangi seviyeye göre verildiğini chart notundan doğrula.
                </li>
              </ul>
            </div>
            <div className="rounded border p-3 text-sm">
              MEB kitabı (Ünite 4 – Gelgit):{" "}
              <a className="underline" href="/navigation/pdfs/DN2025SES1112.pdf#page=59" target="_blank" rel="noreferrer">
                PDF’yi aç
              </a>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <img src={tideTableExcerpt} alt="Tide table excerpt" className="w-full h-auto rounded-md" loading="lazy" />
            </div>
          </div>
        ),
      },
      {
        title: "4) Standart liman: istenen saat için gelgit yüksekliği (grafik mantığı)",
        body: (
          <div className="space-y-3">
            <div className="rounded border bg-muted/30 p-3 space-y-2">
              <div className="font-semibold">Kitaptaki (ATT) özet işlem basamakları</div>
              <ol className="list-decimal pl-5 space-y-1">
                <li>İstenen tarih ve hedef saat için en yakın <strong>HW</strong> ve <strong>LW</strong> zaman/yüksekliklerini oku.</li>
                <li>
                  Grafikte LW ve HW yüksekliğini işaretleyip birleştirerek <strong>gelgit yükseklik doğrusu</strong>nu oluştur.
                </li>
                <li>Alt ölçekten hedef saatten yukarı dik çık; eğriyi kesince yatay gidip gelgit doğrusunu kes.</li>
                <li>Kesişimden yukarı çıkarak ölçekten <strong>gelgit yüksekliğini</strong> oku.</li>
              </ol>
            </div>
            <div className="rounded border p-3 text-sm">
              Bu ekranda pratikte:
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  “<strong>HW / LW → Height of Tide (UTC)</strong>” bölümüne HW/LW zaman-yüksekliklerini gir.
                </li>
                <li>Çıkan <strong>Height of Tide</strong>, harita derinliğine eklenecek gelgit katkısıdır.</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        title: "5) Standart liman: istenen gelgit yüksekliği için zamanı bulma",
        body: (
          <div className="space-y-3">
            <div className="rounded border bg-muted/30 p-3 space-y-2">
              <div className="font-semibold">Kitaptaki (ATT) özet işlem basamakları</div>
              <ol className="list-decimal pl-5 space-y-1">
                <li>İstenen tarih ve döneme en yakın <strong>HW</strong> ve <strong>LW</strong> zaman/yüksekliklerini oku.</li>
                <li>HW–LW ile <strong>gelgit yükseklik doğrusu</strong>nu oluştur.</li>
                <li>İstenen gelgit yüksekliğinden aşağı dik inip gelgit doğrusuyla kesiştir.</li>
                <li>Kesişimden eğriye yatay git; eğriden aşağı dik inerek alt ölçekten <strong>saati</strong> oku.</li>
              </ol>
            </div>
          </div>
        ),
      },
      {
        title: "6) İkincil (tali) liman: time/height differences ile düzeltme",
        body: (
          <div className="space-y-3">
            <p>
              İkincil limanda hesap, standart liman değerlerine <strong>zaman</strong> ve <strong>yükseklik</strong> farklarının uygulanmasıyla
              başlar (gerekiyorsa enterpolasyon).
            </p>
            <div className="rounded border bg-muted/30 p-3 space-y-2">
              <div className="font-semibold">Özet işlem basamakları</div>
              <ol className="list-decimal pl-5 space-y-1">
                <li>İkincil limanı indeksten bul; bağlı olduğu <strong>standart limanı</strong> tespit et.</li>
                <li>Standart limanın ilgili tarihteki HW/LW zaman-yüksekliklerini al.</li>
                <li>İkincil limanın <strong>time/height differences</strong> değerlerini (gerekirse aralık içinde) hesapla.</li>
                <li>Farkları uygula → ikincil limanın HW/LW zaman-yükseklikleri.</li>
                <li>Sonrası standart liman hesabı gibi devam eder (istenen saat / istenen yükseklik).</li>
              </ol>
            </div>
          </div>
        ),
      },
      {
        title: "7) Geçiş/UKC: harita derinliği + gelgit → toplam derinlik",
        body: (
          <div className="space-y-3">
            <p>
              Kitaptaki temel yaklaşım: bulunan gelgit yüksekliği, harita derinliğinin üzerine eklenerek toplam su derinliği bulunur.
            </p>
            <div className="rounded border bg-muted/30 p-3 space-y-2">
              <div className="font-semibold">Formül mantığı</div>
              <div className="font-mono text-sm">Toplam derinlik ≈ Harita derinliği + Gelgit yüksekliği</div>
              <div className="font-mono text-sm">Emniyet ≈ (Harita derinliği + Gelgit) − Draft − Omurga altı emniyet payı</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <img src={ukcStack} alt="UKC stack diagram" className="w-full h-auto rounded-md" loading="lazy" />
            </div>
          </div>
        ),
      },
      {
        title: "8) Gelgit akıntısı (Tidal Stream): ebb/flood/slack ve atlas",
        body: (
          <div className="space-y-3">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Sahile akıntı (Flood Tide)</strong>: sular yükselirken açık denizden sahile/su yoluna
              </li>
              <li>
                <strong>Denize akıntı (Ebb Tide)</strong>: sular alçalırken sahilden/ağızdan açık denize
              </li>
              <li>
                <strong>Durgun su (Slack Water)</strong>: yön değişimine yakın, akıntının çok zayıf/0 olduğu an
              </li>
            </ul>
            <div className="rounded border bg-muted/30 p-3">
              <div className="font-semibold mb-2">Atlas ile pratik yöntem</div>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                <li>İlgili bölge için referans <strong>HW zamanı</strong>nı belirle (standart liman).</li>
                <li>İstediğin saat için <strong>HW’den kaç saat önce/sonra</strong> olduğunu bul (−6 … +6).</li>
                <li>Haritadaki kutu/harfe göre tabloda o saate ait <strong>yön</strong> ve <strong>hız</strong>ı oku.</li>
              </ol>
            </div>
          </div>
        ),
      },
      {
        title: "9) Hızlı yaklaşım: 12’de 1 kuralı ile HoT (öğretici demo)",
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
              <div className="text-sm text-muted-foreground">
                6 saatlik değişim yaklaşık olarak <strong>1-2-3-3-2-1 / 12</strong> paylarına dağılır.
              </div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <img src={ruleOfTwelfths} alt="Rule of twelfths" className="w-full h-auto rounded-md" loading="lazy" />
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
              Not: Bu yöntem <strong>yaklaşık</strong>tır. Standart/ikincil liman düzeltmeleri ve grafik/tablolar daha doğru sonuç verir.
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
          <DialogTitle>Gelgit hesabı (MEB Ünite 4 yaklaşımı) – Adım Adım</DialogTitle>
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

