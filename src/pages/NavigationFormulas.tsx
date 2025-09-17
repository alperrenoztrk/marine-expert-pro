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
    { id: "sight", title: "Sight Reduction" },
    { id: "position", title: "Konum Tespiti" },
    { id: "bearings", title: "Kerteriz Hesaplamaları" },
    { id: "distance", title: "Mesafe Hesaplamaları" },
    { id: "tides", title: "Gelgit Hesaplamaları" },
    { id: "radar", title: "Radar Hesaplamaları" },
    { id: "pilotage", title: "Kıyı Seyri" },
    { id: "turning", title: "Dönüş Hesaplamaları" },
    { id: "weather", title: "Hava Durumu" },
    { id: "celestial", title: "Göksel Navigasyon" },
    { id: "emergency", title: "Acil Durum" }
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
              <pre className="font-mono text-sm leading-6">{`tCPA = − (R · Vrel) / |Vrel|²
dCPA = |R + Vrel · tCPA|`}</pre>
              <div className="text-xs text-muted-foreground">tCPA (saat) → dakika için ×60</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="sight" className="scroll-mt-24">Sight Reduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Hesaplanan Yükseklik (Hc):
sin(Hc) = sinφ · sinδ + cosφ · cosδ · cos(LHA)

Azimut (Z):
cos(Z) = (sinδ − sinφ · sinHc) / (cosφ · cosHc)

Intercept:
a = Ho - Hc (toward/away)

LHA = GHA + Lon (W(-), E(+))`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="position" className="scroll-mt-24">Konum Tespiti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`İki Kerteriz Kesişimi:
tan(φ) = [tan(φ₁)·sin(B₂-λ) - tan(φ₂)·sin(B₁-λ)] / [sin(B₂-B₁)]

Üç Kerteriz (Cocked Hat):
En küçük alan merkezi → EP

Running Fix:
1. İlk kerteriz → zaman ve mesafe ile transfer
2. İkinci kerteriz → kesişim noktası

Cross Bearing Fix:
90° farkla alınan iki kerteriz → konum`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="bearings" className="scroll-mt-24">Kerteriz Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Doubling the Angle on Bow:
D₂ = D₁ · sin(2α₁) / sin(α₂)
(α₁ açısı ikiye katlandığında mesafe)

Four Point Bearing:
D = S · √2 (45° açısında)

Seven Point Bearing:
D = S (açı 30°'den 60°'ye çıktığında)

Relative Bearing → True Bearing:
TB = RB + Ship's Head`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="distance" className="scroll-mt-24">Mesafe Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Dip (Horizon) Distance:
d = 2.075 · √h (nm, h: metre)

Radar Horizon:
d = 2.35 · √h (radar)

Işık Görünürlük Mesafesi:
d = 1.17 · (√h₁ + √h₂ + √R)
R: ışık yüksekliği

Kavisli Yeryüzü Düzeltmesi:
d_corrected = d · √(1 + h/R_earth)`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="tides" className="scroll-mt-24">Gelgit Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Rule of Twelfths:
1. saat: 1/12 · TR
2. saat: 2/12 · TR  
3. saat: 3/12 · TR
4. saat: 3/12 · TR
5. saat: 2/12 · TR
6. saat: 1/12 · TR

Harmonik Analiz:
h(t) = M + Σ[Aᵢ · cos(ωᵢt + φᵢ)]

Secondary Port:
H₂ = H₁ + Diff
T₂ = T₁ + Time_Diff`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="radar" className="scroll-mt-24">Radar Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Radar Range:
R_max = 2.35 · (√h_radar + √h_target)

ARPA Vectors:
True Vector = Relative + Own Ship
Ground Track = √(Vₓ² + Vᵧ²)

Echo Ranging:
R = (c · t) / 2
c = 3×10⁸ m/s (radar)
c = 1500 m/s (sonar)

Parallel Index:
Sabit mesafe → güvenli geçiş`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="pilotage" className="scroll-mt-24">Kıyı Seyri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Clearing Bearing:
Safe bearing > Danger bearing

Danger Angle:
α = arcsin(d / D)
d: tehlikeli alan yarıçapı
D: gemiden mesafe

Transit/Range:
İki işaret çizgisi → güvenli rota

Sounding Pattern:
3-4-3 metre → konum onayı`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="turning" className="scroll-mt-24">Dönüş Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Tactical Diameter:
DT ≈ 3-4 × L (gemi boyu)

Advance:
A = R · sin(θ/2)

Transfer:
T = R · (1 - cos(θ/2))

Turning Rate:
ω = V / R (rad/s)
ROT = 3438 · V / R (°/min)

Wheel Over Point:
WOP = A / sin(course_change/2)`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="weather" className="scroll-mt-24">Hava Durumu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Beaufort Scale:
V (knot) = 2 · √(B³)
B: Beaufort number

Wave Height:
H₁/₃ = 0.025 · V² (fetch unlimited)

Leeway Angle:
β = k · V_wind² / V_ship²
k ≈ 0.1-0.2 (tip faktörü)

Wind Force:
F = 0.00338 · V² · A
A: rüzgar alan (m²)`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="celestial" className="scroll-mt-24">Göksel Navigasyon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Meridian Passage:
Lat = 90° - zenith_distance ± Dec

Polaris:
Lat ≈ Ho + corrections

Amplitude:
A = arcsin(sinδ / cosφ)

Time Sight:
Lon = GHA + LHA

Moon Distance:
Angular distance → longitude

Sun's Bearing at Sunrise/Sunset:
Brg = arccos(-tanφ · tanδ)`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="emergency" className="scroll-mt-24">Acil Durum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Search Pattern:
Square Search: Leg = 2 × track_spacing
Sector Search: R₂ = R₁ × √2

Drift Calculation:
Total Drift = Leeway + Current
Track Made Good = Course ± Drift

Time to Rescue:
t = d / (V_rescue + V_drift)

Emergency Position:
lat/lon → Degrees, Minutes, Seconds
Example: 41°05.25'N = 41° + 5.25/60

VHF Range:
d = 2.35 · (√h₁ + √h₂) nm`}</pre>
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