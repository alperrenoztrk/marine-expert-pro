import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ArrowLeft, Sigma, BookOpen, Calculator } from "lucide-react";

export default function NavigationFormulasPage() {
  const sections = [
    { id: "gc", title: "Büyük Daire (Great Circle)" },
    { id: "rhumb", title: "Rhumb Line (Mercator)" },
    { id: "plane", title: "Plane Sailing" },
    { id: "time-eta", title: "Zaman ve ETA" },
    { id: "current", title: "Akıntı Üçgeni (CTS)" },
    { id: "compass", title: "Pusula Dönüşümleri" },
    { id: "cpa", title: "CPA / TCPA" },
    { id: "sight", title: "Sight Reduction (Temel)" }
  ];

  return (
    <MobileLayout>
      <div className="space-y-4" data-no-translate>
        <div className="flex items-center justify-between">
          <Link to="/navigation">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Seyir
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
              <Sigma className="h-5 w-5" /> Seyir Formülleri – İçindekiler
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
            <CardTitle id="gc" className="scroll-mt-24">Büyük Daire (Great Circle)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Mesafe (nm):
d = 2R × arcsin(√(sin²((φ₂−φ₁)/2) + cosφ₁ · cosφ₂ · sin²((λ₂−λ₁)/2)))

İlk Kurs (θ₀):
θ₀ = atan2(sinΔλ · cosφ₂, cosφ₁ · sinφ₂ − sinφ₁ · cosφ₂ · cosΔλ)

R ≈ 3440.065 nm`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="rhumb" className="scroll-mt-24">Rhumb Line (Mercator)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`q = ln(tan(π/4 + φ₂/2) / tan(π/4 + φ₁/2)) / (φ₂ − φ₁)
Mesafe (nm): d = 60 · √((Δφ)² + (q · Δλ)²)
Kurs: Brg = atan2(Δλ, q · Δφ)
Yaklaşık: Departure = 60 · Δλ · cosφ̄, dLat = 60 · Δφ`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="plane" className="scroll-mt-24">Plane Sailing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`dLat = 60 · Δφ
Dep = 60 · Δλ · cosφ̄
Kurs = atan2(Dep, dLat)
Mesafe = √(dLat² + Dep²)`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="time-eta" className="scroll-mt-24">Zaman ve ETA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`t (saat) = d / V
ETA = ETD + t`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="current" className="scroll-mt-24">Akıntı Üçgeni (CTS)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`sin(CTS − TR) = (c / V) · sin(set − TR)
SOG = V · cos(CTS − TR) + c · cos(set − TR)`}</pre>
              <div className="text-xs text-muted-foreground">TR: istenen rota, V: gemi sürati, c/set: akıntı</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="compass" className="scroll-mt-24">Pusula Dönüşümleri</CardTitle>
          </CardHeader>
        
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Cm = Ct − Var
Cc = Cm − Dev
Ct = Cc + Var + Dev`}</pre>
              <div className="text-xs text-muted-foreground">Kural: E(+) W(−)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="cpa" className="scroll-mt-24">CPA / TCPA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`t_CPA = − (R · V_rel) / |V_rel|²
d_CPA = |R + V_rel · t_CPA|`}</pre>
              <div className="text-xs text-muted-foreground">t_CPA (saat) → dakika için ×60</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="sight" className="scroll-mt-24">Sight Reduction (Temel)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`sin(Hc) = sinφ · sinδ + cosφ · cosδ · cos(LHA)
cos(Z) = (sinδ − sinφ · sinHc) / (cosφ · cosHc)`}</pre>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button asChild variant="default" className="gap-2">
            <a href="#gc">
              <Calculator className="h-4 w-4" /> Başa Dön
            </a>
          </Button>
        </div>

        <Separator />
      </div>
    </MobileLayout>
  );
}