import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Sigma, Shield, Wind, Anchor, LineChart as LineChartIcon, Calculator } from "lucide-react";

export default function StabilityFormulasPage() {
  const sections = [
    { id: "gm-kg", title: "GM ve KG Temelleri" },
    { id: "gz", title: "Doğrultucu Kol (GZ) ve Moment (RM)" },
    { id: "free-surface", title: "Serbest Yüzey Düzeltmesi (FSC)" },
    { id: "trim-list", title: "Trim ve List Açıları" },
    { id: "loll", title: "Angle of Loll" },
    { id: "roll-period", title: "Yalpa Periyodu" },
    { id: "hydrostatic", title: "Hidrostatik Temeller (KB, BM, KM, Δ, ∇, TPC)" },
    { id: "imo", title: "IMO Kriterleri (Özet)" },
    { id: "wind", title: "Rüzgâr Heeling ve Weather Criterion" },
    { id: "inclination", title: "İnklinasyon Deneyi" }
  ];

  return (
    <MobileLayout>
      <div className="space-y-4" data-no-translate>
        <div className="flex items-center justify-between">
          <Link to="/stability">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Stabilite
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Formüller Rehberi
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sigma className="h-5 w-5" /> Stabilite Formülleri – İçindekiler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`}>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    {s.title}
                  </Button>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="gm-kg" className="scroll-mt-24">GM ve KG Temelleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`GM = KM − KG
KM = KB + BM
BM = I_T / ∇`}</pre>
            </div>
            <p>Uygulamada sık kullanılan eşdeğer ifade:</p>
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`GM = KB + BM − KG`}</pre>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>KB ≈ T · (0.53 + 0.085·C<sub>B</sub>) (yaklaşım)</li>
              <li>I<sub>T</sub> ≈ (L·B³·C<sub>W</sub>)/12 (su hattı ikinci momenti)</li>
              <li>∇ = L·B·T·C<sub>B</sub> (hacim deplasmanı)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="gz" className="scroll-mt-24">Doğrultucu Kol (GZ) ve Moment (RM)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Küçük açılar:   GZ ≈ GM · sin(φ)
Genel durumda: GZ(φ) = KN(φ) − KG · sin(φ)
Doğrultucu moment: RM = Δ · GZ`}</pre>
            </div>
            <p>Burada Δ deplasman (ton), GZ metre cinsindedir. RM genellikle kN·m olarak raporlanır.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="free-surface" className="scroll-mt-24">Serbest Yüzey Düzeltmesi (FSC)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`GM_düz = GM − ΣFSC
FSC = (ρ_tank / ρ_deniz) · (i_f / ∇)
i_f (dikdörtgen tank) = l · b³ / 12`}</pre>
            </div>
            <p>Birden fazla yarı dolu tank varsa FSC değerleri toplanır.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="trim-list" className="scroll-mt-24">Trim ve List Açıları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Trim açısı: φ_trim = arctan((T_aft − T_fwd)/L)
List açısı: φ_list = arctan((w · d)/(Δ · GM))
Düşey şift sonucu KG değişimi: ΔKG = w · h / Δ`}</pre>
            </div>
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Trim (moment yaklaşımı): Trim = Δ · (LCG − LCB) / MTC`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="loll" className="scroll-mt-24">Angle of Loll</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`φ_loll = arccos(KG / KM)
Yaklaşım: tan φ_loll ≈ √(−2 · GM / BM_T), GM < 0`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="roll-period" className="scroll-mt-24">Yalpa Periyodu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`T = 2π · k / √(g · GM_düz)`}</pre>
            </div>
            <p>k tipik olarak ~0.35·B alınabilir (yaklaşım).</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="hydrostatic" className="scroll-mt-24">Hidrostatik Temeller (KB, BM, KM, Δ, ∇, TPC)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`∇ = L · B · T · C_B
Δ = ∇ · ρ_deniz
WPA = L · B · C_W
I_T ≈ (L · B³ · C_W)/12
BM_T = I_T / ∇
KM_T = KB + BM_T
TPC = WPA · ρ_deniz / 100`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="imo" className="scroll-mt-24">IMO Kriterleri (Özet)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Alan (0–30°) ≥ 0.055 m·rad
Alan (0–40°) ≥ 0.090 m·rad
Alan (30–40°) ≥ 0.030 m·rad
Maksimum GZ ≥ 0.20 m (tepe ≥ 30°)
Başlangıç GM ≥ 0.15 m`}</pre>
            </div>
            <p>2008 IS Code (MSC.267(85)) tipik değerleridir; gemi tipine göre değişebilir.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="wind" className="scroll-mt-24">Rüzgâr Heeling ve Weather Criterion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Rüzgâr basıncı: q = 0.5 · ρ_hava · V²
Kuvvet: F = q · A
Devirme momenti: M_h = F · z
Heeling kolu: a_h = M_h / (Δ · g)`}</pre>
            </div>
            <p>Weather Criterion: Heeling alanı, GZ eğrisi altında kalan sağlama alanını aşmamalıdır (özet).</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="inclination" className="scroll-mt-24">İnklinasyon Deneyi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`GM_T = (w · l) / (Δ · tan φ)`}</pre>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button asChild variant="default" className="gap-2">
            <a href="#gm-kg">
              <Calculator className="h-4 w-4" /> Başa Dön
            </a>
          </Button>
        </div>

        <Separator />
      </div>
    </MobileLayout>
  );
}

