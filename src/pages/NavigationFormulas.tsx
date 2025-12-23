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
        { id: "colreg", title: "COLREG Manevra" },
        { id: "position", title: "Konum Tespiti" },
        { id: "bearings", title: "Kerteriz Hesaplamaları" },
        { id: "distance", title: "Mesafe Hesaplamaları" },
        { id: "turning", title: "Dönüş Hesaplamaları" },
        { id: "safety", title: "Seyir Emniyeti" },
        { id: "passage", title: "Passage Plan" }
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
        { id: "sight", title: "Sight Reduction" },
        { id: "ecdis", title: "ECDIS Kontrolleri" }
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
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground hidden sm:flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Formüller Rehberi
            </div>
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

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Seyir Hesaplamaları Kapsamı (15 başlık)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ol className="list-decimal pl-4 space-y-2">
              <li><strong>Temel Seyir:</strong> hız–mesafe–zaman, knot ↔ km/h ↔ m/s dönüşümleri, ETA/ETD, kalan süre/mesafe, ortalama hız ve SMG/DMG hesapları.</li>
              <li><strong>Rota & Kerteriz:</strong> plane sailing, Departure, D.Lat/D.Long, middle latitude sailing, true/magnetic/compass course, chart ölçeği ve kerterizlerle rota doğrulaması.</li>
              <li><strong>Enlem–Boylam:</strong> dLat/dLong yön tayini, 1° = 60 NM ilişkisi, cos φ ile boylamdan NM dönüşümü, iki nokta arası mesafe.</li>
              <li><strong>Harita Üzeri:</strong> paralel cetvel/pergel kullanımı, gerçek rota ve mesafe → zaman dönüşümü, chart correction sonrası kontrol.</li>
              <li><strong>Manyetik & Pusula:</strong> variation, deviation, TVMDC (True–Variation–Magnetic–Deviation–Compass) zinciri, işaret kuralları ve pusula hatası.</li>
              <li><strong>Akıntı & Rüzgâr:</strong> set/drift, CTS, SOG, leeway, vektör üçgeni ve akıntı etkisiyle ETA düzeltmesi.</li>
              <li><strong>Kerteriz:</strong> tek/iki/üç kerteriz, relative → true bearing, transit hattı, running fix, DR ve EP.</li>
              <li><strong>Radar:</strong> radar mesafe/kerteriz, CPA/TCPA, relative & true motion, manuel radar plot, hedef sürat/rota çözümü.</li>
              <li><strong>COLREG bağlamı:</strong> karşılaşma tespiti, çatışma riski, manevra sonrası yeni CPA/TCPA ve relative movement analizi.</li>
              <li><strong>Great Circle & Rhumb Line:</strong> başlangıç/son kurs, vertex enlemi, GC vs RL mesafe farkı, composite great circle.</li>
              <li><strong>Gelgit:</strong> HW/LW zamanı ve yükseklik, Rule of Twelfths, secondary port düzeltmeleri, UKC/Squat + tide etkisi.</li>
              <li><strong>Seyir Emniyeti:</strong> UKC, squat, güvenli hız ve mesafe, WOP, dönüş dairesi, advance & transfer.</li>
              <li><strong>Passage Plan:</strong> toplam rota mesafesi, leg bazlı ETA, wheel-over pozisyonları, no-go area, TSS ve abort point hesapları.</li>
              <li><strong>Astronomik Seyir:</strong> GHA/LHA, declination, sextant/dip/refraction düzeltmeleri, LOP, noon sight, güneş/yıldız fix.</li>
              <li><strong>Elektronik Seyir (ECDIS):</strong> XTD, safety contour/depth, look-ahead time, rota kontrol konturları.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" /> Gerekli Tablolar ve Yayınlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Tide Tables & Tidal Stream Atlas:</strong> HW/LW zaman-yükseklik, secondary port farkları ve akıntı set/drift referansları.</li>
              <li><strong>Nautical Almanac:</strong> GHA/LHA, declination, refraction & parallax düzeltmeleri; sunrise/sunset ve meridian passage verileri.</li>
              <li><strong>Sight Reduction Tables (HO-249/HO-229):</strong> intercept/azimut çözümü için tablo kullanımı.</li>
              <li><strong>Deviation Card & Compass Error Log:</strong> manyetik/pusula düzeltmeleri ve TVMDC doğrulaması.</li>
              <li><strong>Chart Catalogue & Corrections:</strong> güncel harita/ENC listesi, NM/UWN/SNW bültenleri ve ECDIS route check çıktıları.</li>
              <li><strong>Current & Wind Reference Sheets:</strong> leeway açı katsayıları, manevra diyagramları, advance/transfer ve wheel-over tabloları.</li>
            </ul>
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

Son Kurs (θ_f):
θ_f = atan2(sinΔλ · cosφ₁, −cosφ₂ · sinφ₁ + sinφ₂ · cosφ₁ · cosΔλ)

Vertex Enlemi:
φ_vertex = arccos(|sinθ₀ · cosφ₁|)

Composite GC:
Kutuplara yaklaşmamak için yüksek enlemde GC leg + RL leg ile birleştir.

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
                <pre className="font-mono text-sm leading-6">{`dLat = 60 · Δφ (N/S yönü)
Dep = 60 · Δλ · cosφ̄ (E/W yönü)
Kurs = atan2(Dep, dLat)
Mesafe = √(dLat² + Dep²)

Middle Lat Sailing:
φ̄ = (φ₁ + φ₂) / 2
Departure = Mesafe × cosφ̄
D.Long (dakika) = Departure / cosφ̄
Course (RL): atan2(D.Long, dLat)`}</pre>
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
                <pre className="font-mono text-sm leading-6">{`Hız = Mesafe / Zaman
Zaman = Mesafe / Hız
Mesafe = Hız × Zaman

Hız dönüşümleri:
1 knot = 1 nm/sa = 1.852 km/sa = 0.5144 m/s

ETA = ETD + (Mesafe / Hız)
ETD = ETA − (Mesafe / Hız)
Remaining Time = Kalan Mesafe / Anlık SOG
Ortalama Hız = Toplam Mesafe / Toplam Süre
SMG = DMG / Geçen Süre
DMG = Σ leg mesafeleri
Kalan Mesafe = Planlanan Toplam Mesafe − DMG`}</pre>
                <div className="text-xs text-muted-foreground">SMG/DMG ve SOG/Course Made Good değerleri log/radar/GPS verileriyle doğrulanmalıdır.</div>
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
                <div className="text-xs text-muted-foreground">TR: istenen rota, V: gemi sürati, c/set: akıntı. ETA_düzeltilmiş = Mesafe_plan / SOG.</div>
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
                <pre className="font-mono text-sm leading-6">{`TVMDC zinciri:
True = Magnetic + Variation
Magnetic = Compass + Deviation
Compass Error = Variation + Deviation

Cm = Ct − Var
Cc = Cm − Dev
Ct = Cc + Var + Dev

Kural: East (+), West (−)`}</pre>
                <div className="text-xs text-muted-foreground">Deviation card ve manyetik yıllık değişim (annual change) değerlerini güncel tutun.</div>
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
            <CardHeader onClick={() => toggleSection('colreg')} className="cursor-pointer" aria-expanded={isOpen('colreg')}>
              <CardTitle id="colreg" className="scroll-mt-24 flex items-center justify-between">
                COLREG Manevra
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('colreg') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('colreg') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Çatışma Riski:
Relative bearing sabit, mesafe azalıyor → risk var

Yeni CPA/TCPA (manevra sonrası):
R' = R + V₁·t + V₂·t  (manevra yön/ hız vektörleriyle)
tCPA' = −(R' · Vrel') / |Vrel'|²
dCPA' = |R' + Vrel' · tCPA'|

Öneri: İdare manevrası → CPA artmalı, TCPA uzamalı, relative bearing değişmeli.`}</pre>
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
                <pre className="font-mono text-sm leading-6">{`1° Enlem = 60 NM (1' = 1 NM)
D.Lat (dakika) = 60 · Δφ
D.Long (dakika) = 60 · Δλ · cosφ̄
Mesafe (nm) ≈ √(D.Lat² + D.Long²)

Geographical (Horizon) Range:
d = 2.08 · √h_m  (nm, h metre)
veya d = 1.17 · √h_ft (nm, h feet)

Radar/VHF Horizon (refraksiyon dahil):
d = 2.23 · (√h₁ + √h₂)  (h metre)

Light Geographic Range (USCG Light List):
d = 2.08 · (√h_observer + √h_light)  (h metre)
Not: Luminous range; nominal ışık gücü ve meteorolojik görüşe bağlıdır.`}</pre>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('position')} className="cursor-pointer" aria-expanded={isOpen('position')}>
              <CardTitle id="position" className="scroll-mt-24 flex items-center justify-between">
                Konum Tespiti
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('position') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('position') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`DR (Dead Reckoning):
Δφ = (d · cosC) / 60
Δλ = (d · sinC) / (60 · cosφ̄)
Lat₂ = Lat₁ + Δφ, Lon₂ = Lon₁ + Δλ

EP (Estimated Position):
Set/Drift → vektörel ekleme: R_EP = R_DR + (c · t)

Running Fix:
1) İlk kerteriz konumu DR ile ileri taşınır
2) İkinci kerteriz çizgisi ile kesişim = Fix

DMG/SMG:
DMG = Σ √(Δφ² + Δλ²) (nm)
SMG = DMG / Geçen Süre`}</pre>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('bearings')} className="cursor-pointer" aria-expanded={isOpen('bearings')}>
              <CardTitle id="bearings" className="scroll-mt-24 flex items-center justify-between">
                Kerteriz Hesaplamaları
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('bearings') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('bearings') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Relative → True Bearing:
Brg_T = Heading_T + Brg_R (360° normalize)
Compass → Magnetic → True: Cc + Dev + Var = Ct

İki Kerteriz:
Hatların kesişimi = Fix, açı 30°-150° arası tercih

Üç Kerteriz:
En kesin hat ortada, sapmalar ±5° kontrol

Transit / Leading Line:
İki işaret aynı hizada → emniyet hattı

Running Fix (taşınmış kerteriz):
İlk kerteriz, aradan geçen zaman × hız kadar ileri taşınır.`}</pre>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('turning')} className="cursor-pointer" aria-expanded={isOpen('turning')}>
              <CardTitle id="turning" className="scroll-mt-24 flex items-center justify-between">
                Dönüş Hesaplamaları
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('turning') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('turning') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Rate of Turn (ROT):
ROT (°/dk) = (30 × V(kn)) / R(turning radius, m)

Advance & Transfer:
Advance ≈ V · t_align (rota değişene kadar alınan mesafe)
Transfer ≈ R × tan(ΔC / 2)

Wheel-Over Point:
WOP mesafesi = Transfer + güvenlik payı
WOP zamanı = WOP / SOG

Turning Circle:
Diameter ≈ 4-5 × ship L, taktikte katalog değerleri kullanılır.`}</pre>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('safety')} className="cursor-pointer" aria-expanded={isOpen('safety')}>
              <CardTitle id="safety" className="scroll-mt-24 flex items-center justify-between">
                Seyir Emniyeti
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('safety') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('safety') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`UKC = CD + HoT − Draft − Squat
Squat (open water) ≈ (V(kn)²) / (100 · beam_m)
Safe Speed: TSS/COG/SOG, görüş ve manevra mesafesine bağlı
Safe Passing Distance: dCPA > 1-2 NM (trafik durumuna göre)
Wheel-over mesafeleri: pilot card ve manevra el kitabı değerleri
No-Go Area: CD + HoT − UKC_lim < 0 → yasak bölge`}</pre>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('passage')} className="cursor-pointer" aria-expanded={isOpen('passage')}>
              <CardTitle id="passage" className="scroll-mt-24 flex items-center justify-between">
                Passage Plan
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('passage') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('passage') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Toplam Mesafe = Σ leg mesafeleri
Leg ETA = Mesafe_leg / SOG + ETD_leg
Wheel-Over noktası: WOP_time = (Transfer + emniyet) / SOG
Abort Point: t_abort = mesafe güvenli liman / SOG
TSS geçişi: XTD ≤ limit, hız ≤ sınır, VTS bildirimi
UKC kontrolü: HoT + CD − (Draft + Squat) ≥ güvenli pay`}</pre>
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

Relative / True Motion:
V_rel = V_target − V_own (vektörel)
Course/Speed Target = atan2(V_rel_y, V_rel_x), |V_rel|

Manual Plot Δt:
Relative displacement / Δt → V_rel; CPA/TCPA grafikle doğrula.

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
A: rüzgar alan (m²)

Rüzgâr/akıntı düzeltmesi:
SOG = V · cos(CTS − TR) + c · cos(set − TR)
CTS = TR + arcsin((c/V) · sin(set − TR))`}</pre>
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

Height of Tide:
H = Low + (Rule_of_Twelfths × Tidal_Range)
UKC = Charted_Depth + H − Draft − Squat

Harmonik Analiz:
h(t) = M + Σ[Aᵢ · cos(ωᵢt + φᵢ)]

Secondary Port:
H₂ = H₁ + Diff
T₂ = T₁ + Time_Diff

Kaynaklar: Admiralty Tide Tables, Tide/Stream Atlas, Tidal Curve.`}</pre>
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
3-4-3 metre → konum onayı

Harita üzeri mesafe:
Mesafe (nm) = Ölçek uzunluğu (cm) × ölçek katsayısı / 1.852e5
Paralel cetvel ile rota çiz, pergel ile mesafe ölç
Rota kontrolü: Chart correction + T/P+NM bülteni sonrası yeniden kontrol`}</pre>
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
Brg = arccos(-tanφ · tanδ)

Kaynaklar: Nautical Almanac (GHA/Dec), sextant düzeltmeleri (IC, dip, refraction, parallax), sunrise/sunset tabloları.`}</pre>
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
 
LHA = GHA + Lon (W(-), E(+))

Tablolar: HO-249/HO-229 sight reduction tabloları ve Nautical Almanac verileri.`}</pre>
              </div>
            </CardContent>
            )}
          </Card>

          <Card className="shadow">
            <CardHeader onClick={() => toggleSection('ecdis')} className="cursor-pointer" aria-expanded={isOpen('ecdis')}>
              <CardTitle id="ecdis" className="scroll-mt-24 flex items-center justify-between">
                ECDIS Kontrolleri
                <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('ecdis') ? "rotate-180" : "")} />
              </CardTitle>
            </CardHeader>
            {isOpen('ecdis') && (
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`XTD ≤ limit (genelde 0.5-1.0 NM)
Safety Contour = max(Chart Datum + UKC_pay, tavsiye edilen)
Safety Depth = Draft + Squat + UKC_pay
Look-ahead Time = t_look = mesafe alarm / SOG
Route Check: shallow contour, isolated danger, ENC güncelliği
BRM: anti-grounding alarm, cross-track alarm, ETA per leg`}</pre>
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