import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ArrowLeft, Sigma, BookOpen, Calculator, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function NavigationFormulasPage() {
  // Kategori başlıkları altında içerik TOC'u
  const tocGroups = [
    {
      header: "1. Seyir Hesaplamaları",
      items: [
        { id: "gc", title: "Büyük Daire (Great Circle)" },
        { id: "rhumb", title: "Rhumb Line (Mercator)" },
        { id: "plane", title: "Plane Sailing" },
        { id: "time-eta", title: "Zaman ve ETA" },
        { id: "current", title: "Akıntı Üçgeni (CTS)" },
        { id: "compass", title: "Pusula Dönüşümleri" },
        { id: "cpa", title: "CPA / TCPA" },
        { id: "position", title: "Konum Tespiti" },
        { id: "bearings", title: "Kerteriz Hesaplamaları" },
        { id: "distance", title: "Mesafe Hesaplamaları" },
        { id: "turning", title: "Dönüş Hesaplamaları" }
      ]
    },
    {
      header: "2. Anlık Bilgiler",
      items: [
        { id: "radar", title: "Radar Hesaplamaları" }
      ]
    },
    {
      header: "3. Meteoroloji ve Çevresel Faktörler",
      items: [
        { id: "weather", title: "Hava Durumu" },
        { id: "tides", title: "Gelgit Hesaplamaları" }
      ]
    },
    {
      header: "4. Liman ve Seyir Yardımları",
      items: [
        { id: "pilotage", title: "Kıyı Seyri" },
        { id: "celestial", title: "Göksel Navigasyon" },
        { id: "sight", title: "Sight Reduction" }
      ]
    },
    {
      header: "5. Acil Durum",
      items: [
        { id: "emergency", title: "Acil Durum Formülleri" }
      ]
    }
  ];

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const isOpen = (id: string) => !!openSections[id];
  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const openSection = (id: string) => {
    setOpenSections(prev => (prev[id] ? prev : { ...prev, [id]: true }));
  };
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.slice(1);
      if (id) openSection(id);
    }
  }, []);

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
            <div className="space-y-4">
              {tocGroups.map((group) => (
                <div key={group.header} className="space-y-2">
                  <div className="text-sm font-semibold text-primary px-1">{group.header}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((s) => (
                      <a key={s.id} href={`#${s.id}`} onClick={() => openSection(s.id)}>
                        <Button variant="outline" size="sm" className="whitespace-nowrap">
                          {s.title}
                        </Button>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 1. Seyir Hesaplamaları */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-primary px-1">1. Seyir Hesaplamaları</div>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('gc')} className="cursor-pointer" aria-expanded={isOpen('gc')}>
              <CardTitle id="gc" className="scroll-mt-24 flex items-center justify-between">
                Büyük Daire (Great Circle)
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('gc') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('gc') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Mesafe (nm):
d = 2R × arcsin(√(sin²((φ₂−φ₁)/2) + cosφ₁ · cosφ₂ · sin²((λ₂−λ₁)/2)))

İlk Kurs (θ₀):
θ₀ = atan2(sinΔλ · cosφ₂, cosφ₁ · sinφ₂ − sinφ₁ · cosφ₂ · cosΔλ)

R ≈ 3440.065 nm`}</pre>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('rhumb')} className="cursor-pointer" aria-expanded={isOpen('rhumb')}>
              <CardTitle id="rhumb" className="scroll-mt-24 flex items-center justify-between">
                Rhumb Line (Mercator)
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('rhumb') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('rhumb') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`q = ln(tan(π/4 + φ₂/2) / tan(π/4 + φ₁/2)) / (φ₂ − φ₁)
Mesafe (nm): d = 60 · √((Δφ)² + (q · Δλ)²)
Kurs: Brg = atan2(Δλ, q · Δφ)
Yaklaşık: Departure = 60 · Δλ · cosφ̄, dLat = 60 · Δφ`}</pre>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('plane')} className="cursor-pointer" aria-expanded={isOpen('plane')}>
              <CardTitle id="plane" className="scroll-mt-24 flex items-center justify-between">
                Plane Sailing
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('plane') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('plane') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`dLat = 60 · Δφ
Dep = 60 · Δλ · cosφ̄
Kurs = atan2(Dep, dLat)
Mesafe = √(dLat² + Dep²)`}</pre>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('time-eta')} className="cursor-pointer" aria-expanded={isOpen('time-eta')}>
              <CardTitle id="time-eta" className="scroll-mt-24 flex items-center justify-between">
                Zaman ve ETA
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('time-eta') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('time-eta') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`t (saat) = d / V
ETA = ETD + t`}</pre>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('current')} className="cursor-pointer" aria-expanded={isOpen('current')}>
              <CardTitle id="current" className="scroll-mt-24 flex items-center justify-between">
                Akıntı Üçgeni (CTS)
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('current') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('current') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`sin(CTS − TR) = (c / V) · sin(set − TR)
SOG = V · cos(CTS − TR) + c · cos(set − TR)`}</pre>
                <div className="text-xs text-muted-foreground">TR: istenen rota, V: gemi sürati, c/set: akıntı</div>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('compass')} className="cursor-pointer" aria-expanded={isOpen('compass')}>
              <CardTitle id="compass" className="scroll-mt-24 flex items-center justify-between">
                Pusula Dönüşümleri
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('compass') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('compass') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Cm = Ct − Var
Cc = Cm − Dev
Ct = Cc + Var + Dev`}</pre>
                <div className="text-xs text-muted-foreground">Kural: E(+) W(−)</div>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('cpa')} className="cursor-pointer" aria-expanded={isOpen('cpa')}>
              <CardTitle id="cpa" className="scroll-mt-24 flex items-center justify-between">
                CPA / TCPA
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('cpa') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('cpa') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`tCPA = − (R · Vrel) / |Vrel|²
dCPA = |R + Vrel · tCPA|`}</pre>
                <div className="text-xs text-muted-foreground">tCPA (saat) → dakika için ×60</div>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('distance')} className="cursor-pointer" aria-expanded={isOpen('distance')}>
              <CardTitle id="distance" className="scroll-mt-24 flex items-center justify-between">
                Mesafe Hesaplamaları
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('distance') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('distance') && (
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
            )}
          </Card>
        </div>

        {/* 2. Anlık Bilgiler */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-primary px-1">2. Anlık Bilgiler</div>
          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('radar')} className="cursor-pointer" aria-expanded={isOpen('radar')}>
              <CardTitle id="radar" className="scroll-mt-24 flex items-center justify-between">
                Radar Hesaplamaları
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('radar') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('radar') && (
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
            )}
          </Card>
        </div>

        {/* 3. Meteoroloji ve Çevresel Faktörler */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-primary px-1">3. Meteoroloji ve Çevresel Faktörler</div>
          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('weather')} className="cursor-pointer" aria-expanded={isOpen('weather')}>
              <CardTitle id="weather" className="scroll-mt-24 flex items-center justify-between">
                Hava Durumu
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('weather') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('weather') && (
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
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('tides')} className="cursor-pointer" aria-expanded={isOpen('tides')}>
              <CardTitle id="tides" className="scroll-mt-24 flex items-center justify-between">
                Gelgit Hesaplamaları
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('tides') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('tides') && (
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
            )}
          </Card>
        </div>

        {/* 4. Liman ve Seyir Yardımları */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-primary px-1">4. Liman ve Seyir Yardımları</div>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('pilotage')} className="cursor-pointer" aria-expanded={isOpen('pilotage')}>
              <CardTitle id="pilotage" className="scroll-mt-24 flex items-center justify-between">
                Kıyı Seyri
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('pilotage') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('pilotage') && (
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
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('celestial')} className="cursor-pointer" aria-expanded={isOpen('celestial')}>
              <CardTitle id="celestial" className="scroll-mt-24 flex items-center justify-between">
                Göksel Navigasyon
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('celestial') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('celestial') && (
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
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('sight')} className="cursor-pointer" aria-expanded={isOpen('sight')}>
              <CardTitle id="sight" className="scroll-mt-24 flex items-center justify-between">
                Sight Reduction
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('sight') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('sight') && (
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
            )}
          </Card>
        </div>

        {/* 5. Acil Durum */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-primary px-1">5. Acil Durum</div>
          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('emergency')} className="cursor-pointer" aria-expanded={isOpen('emergency')}>
              <CardTitle id="emergency" className="scroll-mt-24 flex items-center justify-between">
                Acil Durum
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('emergency') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('emergency') && (
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
            )}
          </Card>
        </div>

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