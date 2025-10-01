import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Compass, FileText, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { calculateCompassTotalError, solveCurrentTriangle, calculateDoublingAngle } from "@/components/calculations/navigationMath";

export default function NavigationTopicsPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const isOpen = (id: string) => !!openSections[id];
  const toggle = (id: string) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  const open = (id: string) => setOpenSections(prev => (prev[id] ? prev : { ...prev, [id]: true }));

  // v1.1 mini calculators state
  const [compassInputs, setCompassInputs] = useState({ cc: "", variation: "", deviation: "" });
  const [compassCt, setCompassCt] = useState<string>("");

  const [currentInputs, setCurrentInputs] = useState({ tr: "", v: "", set: "", drift: "" });
  const [currentResult, setCurrentResult] = useState<{ cts?: number; sog?: number }>({});

  const [doublingInputs, setDoublingInputs] = useState({ angle: "", run: "" });
  const [doublingResult, setDoublingResult] = useState<string>("");

  const normalize360 = (deg: number) => {
    const x = deg % 360;
    return x < 0 ? x + 360 : x;
  };

  const handleCompassCalc = () => {
    const cc = parseFloat(compassInputs.cc);
    const variation = parseFloat(compassInputs.variation || "0");
    const deviation = parseFloat(compassInputs.deviation || "0");
    if (!isFinite(cc)) {
      setCompassCt("");
      return;
    }
    const { totalErrorDeg } = calculateCompassTotalError(variation, deviation, 0);
    const ct = normalize360(cc + totalErrorDeg);
    setCompassCt(ct.toFixed(1) + "°");
  };

  const handleCurrentCalc = () => {
    const tr = parseFloat(currentInputs.tr);
    const v = parseFloat(currentInputs.v);
    const setDeg = parseFloat(currentInputs.set);
    const drift = parseFloat(currentInputs.drift);
    if (![tr, v, setDeg, drift].every(isFinite)) {
      setCurrentResult({});
      return;
    }
    const r = solveCurrentTriangle({ courseDeg: tr, speedKn: v, setDeg, driftKn: drift });
    setCurrentResult({ cts: r.courseToSteerDeg, sog: r.groundSpeedKn });
  };

  const handleDoublingCalc = () => {
    const angle = parseFloat(doublingInputs.angle);
    const run = parseFloat(doublingInputs.run);
    if (![angle, run].every(isFinite)) {
      setDoublingResult("");
      return;
    }
    const r = calculateDoublingAngle(angle, run);
    setDoublingResult(r.distanceOffNm.toFixed(2) + " nm");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.slice(1);
      if (id) open(id);
    }
  }, []);

  const toc = [
    { id: "foundations", title: "Temel Kavramlar" },
    { id: "mini-tools", title: "Hızlı Mini Araçlar" },
    { id: "charts", title: "Haritalar ve Projeksiyonlar" },
    { id: "routes", title: "Rotalar: Büyük Daire, Rhumb, Plane" },
    { id: "dr", title: "Dead Reckoning (DR) ve Konum Güncelleme" },
    { id: "compass", title: "Pusula, Varyasyon, Deviasyon" },
    { id: "bearings", title: "Kerteriz, Kesim ve Hatalar" },
    { id: "tides", title: "Gelgit ve Akıntı Seyri" },
    { id: "current", title: "Akıntı Üçgeni ve Rüzgar Sapması" },
    { id: "pilotage", title: "Kıyı Seyri ve Yaklaşma Teknikleri" },
    { id: "radar", title: "Radar Seyri ve ARPA" },
    { id: "ais", title: "AIS ve Elektronik Seyir Yardımları" },
    { id: "ecdis", title: "ECDIS, ENC ve Emniyetli Navigasyon" },
    { id: "celestial", title: "Göksel Navigasyon (Özet)" },
    { id: "met", title: "Meteoroloji ve Görünürlük" },
    { id: "passage", title: "Passage Planning (Appraisal → Monitoring)" },
    { id: "brm", title: "Köprüüstü Kaynak Yönetimi (BRM)" },
    { id: "sar", title: "Arama Kurtarma Seyri (SAR)" },
    { id: "examples", title: "Örnek Çalışmalar ve Sınav Tipi Sorular" },
    { id: "glossary", title: "Sözlük" },
    { id: "refs", title: "Kaynakça ve İleri Okuma" }
  ];

  return (
    <MobileLayout>
      <div className="space-y-6 max-w-3xl mx-auto leading-relaxed break-words" data-no-translate>
        <div className="flex items-center justify-between">
          <Link to="/navigation">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Seyir
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Konu Anlatımı • v2.0
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Compass className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">Seyir Konu Anlatımı</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Temelden ileri düzeye kapsamlı bir seyir rehberi: tanımlar, yöntemler, prosedürler, örnekler ve iyi uygulamalar.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> İçindekiler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {toc.map(item => (
                <a key={item.id} href={`#${item.id}`}>
                  <Button variant="outline" size="sm" onClick={() => open(item.id)}>
                    {item.title}
                  </Button>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mini tools */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="mini-tools" className="scroll-mt-24">Hızlı Mini Araçlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Compass converter */}
              <div className="bg-muted/30 rounded p-3">
                <p className="font-semibold mb-2">Pusula Dönüşümü</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <Label htmlFor="mt-cc">Cc (°)</Label>
                    <Input id="mt-cc" type="number" value={compassInputs.cc} onChange={(e) => setCompassInputs({ ...compassInputs, cc: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="mt-var">Var (°)</Label>
                    <Input id="mt-var" type="number" value={compassInputs.variation} onChange={(e) => setCompassInputs({ ...compassInputs, variation: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="mt-dev">Dev (°)</Label>
                    <Input id="mt-dev" type="number" value={compassInputs.deviation} onChange={(e) => setCompassInputs({ ...compassInputs, deviation: e.target.value })} />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Button size="sm" onClick={handleCompassCalc}>Hesapla</Button>
                  <div className="text-xs text-muted-foreground">Ct: <span className="font-mono">{compassCt || '-'}</span></div>
                </div>
                <pre className="mt-2 font-mono text-[11px] leading-5">{`Kural: Ct = Cc + Var + Dev  (E +, W −)`}</pre>
              </div>
              {/* CTS/SOG */}
              <div className="bg-muted/30 rounded p-3">
                <p className="font-semibold mb-2">CTS / SOG (Özet)</p>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <Label htmlFor="mt-tr">TR (°)</Label>
                    <Input id="mt-tr" type="number" value={currentInputs.tr} onChange={(e) => setCurrentInputs({ ...currentInputs, tr: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="mt-v">V (kn)</Label>
                    <Input id="mt-v" type="number" value={currentInputs.v} onChange={(e) => setCurrentInputs({ ...currentInputs, v: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="mt-set">set (°)</Label>
                    <Input id="mt-set" type="number" value={currentInputs.set} onChange={(e) => setCurrentInputs({ ...currentInputs, set: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="mt-drift">c (kn)</Label>
                    <Input id="mt-drift" type="number" value={currentInputs.drift} onChange={(e) => setCurrentInputs({ ...currentInputs, drift: e.target.value })} />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Button size="sm" onClick={handleCurrentCalc}>Hesapla</Button>
                  <div className="text-xs text-muted-foreground">CTS: <span className="font-mono">{currentResult.cts?.toFixed?.(1) || '-' }°</span></div>
                  <div className="text-xs text-muted-foreground">SOG: <span className="font-mono">{currentResult.sog?.toFixed?.(2) || '-' } kn</span></div>
                </div>
                <pre className="mt-2 font-mono text-[11px] leading-5">{`sin(CTS−TR) = (c/V)·sin(set−TR)
SOG = V·cos(CTS−TR) + c·cos(set−TR)`}</pre>
              </div>
              {/* Doubling angle */}
              <div className="bg-muted/30 rounded p-3">
                <p className="font-semibold mb-2">Doubling Angle</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <Label htmlFor="mt-angle">A₁ (°)</Label>
                    <Input id="mt-angle" type="number" value={doublingInputs.angle} onChange={(e) => setDoublingInputs({ ...doublingInputs, angle: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="mt-run">s (nm)</Label>
                    <Input id="mt-run" type="number" value={doublingInputs.run} onChange={(e) => setDoublingInputs({ ...doublingInputs, run: e.target.value })} />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Button size="sm" onClick={handleDoublingCalc}>Hesapla</Button>
                  <div className="text-xs text-muted-foreground">Distance off: <span className="font-mono">{doublingResult || '-'}</span></div>
                </div>
                <pre className="mt-2 font-mono text-[11px] leading-5">{`A₂=2·A₁, Distance off ≈ s·sin(2A₁)/sin(A₂)`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Foundations */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('foundations')} className="cursor-pointer" aria-expanded={isOpen('foundations')}>
            <CardTitle id="foundations" className="scroll-mt-24 flex items-center justify-between">
              Temel Kavramlar
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('foundations') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('foundations') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p><strong>Referans Yönleri:</strong> True (T), Magnetic (M), Compass (C). Dönüşüm kuralı: E(+) W(−).</p>
              <p><strong>Temel Büyüklükler:</strong> Course/Heading, Bearing, Set/Drift, Speed/Velocity, SOG/COG.</p>
              <p><strong>Konum Notasyonu:</strong> Enlem (φ), Boylam (λ), dakika (′), saniye (″), ondalık dakikaya dönüştürme.</p>
              <p><strong>Harita Temelleri:</strong> Datums (WGS84), ölçek, izohips, izobat, kısaltmalar ve semboller.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Charts */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('charts')} className="cursor-pointer" aria-expanded={isOpen('charts')}>
            <CardTitle id="charts" className="scroll-mt-24 flex items-center justify-between">
              Haritalar ve Projeksiyonlar
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('charts') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('charts') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p><strong>Mercator:</strong> Rhumb line doğruları sabit kerterizdir; ölçek enleme göre değişir.</p>
              <p><strong>Gnomonik:</strong> Büyük daireler düz çizgi olur; uzun mesafe rota planlamada kullanılır.</p>
              <p><strong>Harita Türleri:</strong> General, Sailing, Coastal, Approach, Harbour; kullanım amaçları ve ölçekleri.</p>
              <p><strong>Yardımcı Yayınlar:</strong> Pilot books, List of Lights, Tide Tables, Notices to Mariners.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Routes */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('routes')} className="cursor-pointer" aria-expanded={isOpen('routes')}>
            <CardTitle id="routes" className="scroll-mt-24 flex items-center justify-between">
              Rotalar: Büyük Daire, Rhumb, Plane
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('routes') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('routes') && (
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <p className="font-semibold mb-1">Özet:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Büyük Daire: En kısa mesafe; değişken kerteriz; yüksek enlemlerde dikkat.</li>
                <li>Rhumb Line: Sabit kerteriz; uzun mesafede biraz daha uzun; Mercator ile kolay planlanır.</li>
                <li>Plane Sailing: Küçük mesafelerde düzlem yaklaşımı; dLat/Dep ilişkisi.</li>
              </ul>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-semibold mb-2">Şema (GC vs RL – Gnomonik ve Mercator):</p>
              <pre className="font-mono text-[11px] leading-5">{`Gnomonik (GC düz çizgi)           Mercator (RL düz çizgi)
   A———————·———————B                 A———————\\\\\\———————B
         GC noktaları →                GC noktaları ⟶ RL segmentlere
  (Ara noktaları Mercator'a          (Değişken kerteriz, segmentli rota)
   aktar ve RL segmentlerle bağla)`}</pre>
            </div>
            <div className="space-y-2">
              <p><strong>Uygulama:</strong> Gnomonik üzerinde GC çiz, uygun aralıklarla ara noktaları Mercator'a aktar, Rhumb segmentlerle birleştir.</p>
              <p><strong>Emniyet:</strong> Ice limits, TSS, derinlik kısıtları, hava ve akıntı tahminleri ile rota optimize edilir.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* DR */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('dr')} className="cursor-pointer" aria-expanded={isOpen('dr')}>
            <CardTitle id="dr" className="scroll-mt-24 flex items-center justify-between">
              Dead Reckoning (DR) ve Konum Güncelleme
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('dr') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('dr') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>DR: Son bilinen konumdan hız ve rota ile tahmini konum. EP: Set/Drift ve rüzgar etkisi ilavesi.</p>
              <p>Plot aralığı: açık denizde 1-2 saatte bir, kıyıda daha sık; log ve gyro karşılaştırması.</p>
              <p>GPS ile karşılaştır: Anomali tespiti için COG/SOG vs HDG/Speed farklarını izle.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Compass */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('compass')} className="cursor-pointer" aria-expanded={isOpen('compass')}>
            <CardTitle id="compass" className="scroll-mt-24 flex items-center justify-between">
              Pusula, Varyasyon, Deviasyon
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('compass') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('compass') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p><strong>Dönüşümler:</strong> Cm → Ct: Ct = Cc + Var + Dev; işaret kuralı E(+) W(−).</p>
              <p><strong>Deviasyon Eğrisi:</strong> Swing test; periyodik doğrulama ve kayıt.</p>
              <p><strong>Jiroskop:</strong> Latitude error, speed error; düzeltme kartları ve alarm yönetimi.</p>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-semibold mb-2">Çözümlü Örnek:</p>
              <pre className="font-mono text-[11px] leading-5">{`Verilen: Cc = 212°, Var = +3.0°, Dev = −1.5°
İstenen: Ct
Adımlar:
  1) Cc → Ct = Cc + Var + Dev
  2) Ct = 212 + 3.0 − 1.5 = 213.5°
Cevap: Ct ≈ 214°`}</pre>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Bearings */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('bearings')} className="cursor-pointer" aria-expanded={isOpen('bearings')}>
            <CardTitle id="bearings" className="scroll-mt-24 flex items-center justify-between">
              Kerteriz, Kesim ve Hatalar
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('bearings') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('bearings') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>Doubling angle, four/seven point methods; distance off ve emniyetli yaklaşım teknikleri.</p>
              <p>Hata kaynakları: paralaks, sapma, okuma hatası, işaret seçimi; en iyi uygulamalar.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Tides */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('tides')} className="cursor-pointer" aria-expanded={isOpen('tides')}>
            <CardTitle id="tides" className="scroll-mt-24 flex items-center justify-between">
              Gelgit ve Akıntı Seyri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('tides') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('tides') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>Rule of twelfths, harmonic constituents, secondary port yöntemleri ve örnek uygulama adımları.</p>
              <p>Akıntı atlaslarının kullanımı, set/drift tahmini ve ETA etkisi.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Current triangle */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('current')} className="cursor-pointer" aria-expanded={isOpen('current')}>
            <CardTitle id="current" className="scroll-mt-24 flex items-center justify-between">
              Akıntı Üçgeni ve Rüzgar Sapması
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('current') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('current') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>Vektör diyagramı ile CTS ve SOG hesap adımları; leeway tahmini ve düzeltme.</p>
              <p>Kıyı seyri için pratik tablo ve kurallar (yaklaşık yöntemler).</p>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-semibold mb-2">Şema (Akıntı Üçgeni):</p>
              <pre className="font-mono text-[11px] leading-5">{`           ↑ Y
           │        V (ship)
           │      ↗
           │   ↗  CTS
           │↗
   ←——— set/drift ———→ X
Ground vector = Ship vector + Current vector`}</pre>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-semibold mb-2">Çözümlü Örnek (CTS/SOG):</p>
              <pre className="font-mono text-[11px] leading-5">{`TR = 090°, V = 12 kn, set = 045°, c = 2 kn
Formül: sin(CTS−TR) = (c/V)·sin(set−TR)
  RHS = (2/12)·sin(−45°) = 0.1667·(−0.7071) = −0.1179
  CTS−TR = arcsin(−0.1179) ≈ −6.8° ⇒ CTS ≈ 083.2°
SOG = 12·cos(−6.8°) + 2·cos(−45°) ≈ 11.9 + 1.41 ≈ 13.3 kn`}</pre>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Pilotage */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('pilotage')} className="cursor-pointer" aria-expanded={isOpen('pilotage')}>
            <CardTitle id="pilotage" className="scroll-mt-24 flex items-center justify-between">
              Kıyı Seyri ve Yaklaşma Teknikleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('pilotage') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('pilotage') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>Clearing bearings, danger angles, transits, parallel indexing ile emniyetli geçiş.</p>
              <p>Yerel talimatlar, VTS, pilot talimatları, minimum under keel clearance hesapları.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Radar */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('radar')} className="cursor-pointer" aria-expanded={isOpen('radar')}>
            <CardTitle id="radar" className="scroll-mt-24 flex items-center justify-between">
              Radar Seyri ve ARPA
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('radar') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('radar') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>PI, EBL, VRM kullanımı; relative vs true motion farkları ve iz yönetimi.</p>
              <p>ARPA vektörlerinin yorumlanması; CPA/TCPA değerlendirmesi ve COLREG ile uyum.</p>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-semibold mb-2">Şema (PI ve EBL):</p>
              <pre className="font-mono text-[11px] leading-5">{`[Merkez Own Ship]
 ┌───────────────┐
 │   —— PI ——→   │ (Sabit offset çizgisi)
 │  ··EBL····    │ (Elektronik kerteriz çizgisi)
 │   ○ VRM       │ (Menzil halkası)
 └───────────────┘`}</pre>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-semibold mb-2">Çözümlü Örnek (CPA/TCPA):</p>
              <pre className="font-mono text-[11px] leading-5">{`R₀ = 5 nm @ 045°, Vₜ = 15 kn @ 270°, Vₒ = 12 kn @ 000°
X/Y eksenleri: X doğu, Y kuzey
R0x = 5·sin45 = 3.54, R0y = 5·cos45 = 3.54
Vtx = 15·sin270 = −15, Vty = 15·cos270 = 0
Vox = 12·sin0 = 0,   Voy = 12·cos0 = 12
Vrx = −15 − 0 = −15, Vry = 0 − 12 = −12
Vr² = 369, tCPA(h) = −(R·V / Vr²) = −((3.54·−15 + 3.54·−12)/369) ≈ 0.26 h ≈ 15.6 dk
CPA = |R0 + Vr·t| ≈ 1.9 nm`}</pre>
            </div>
          </CardContent>
          )}
        </Card>

        {/* AIS */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('ais')} className="cursor-pointer" aria-expanded={isOpen('ais')}>
            <CardTitle id="ais" className="scroll-mt-24 flex items-center justify-between">
              AIS ve Elektronik Seyir Yardımları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('ais') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('ais') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>AIS sınıfları, mesaj tipleri, veri doğrulama ve kısıtlar; hedef takibi ve alarm ayarları.</p>
              <p>GNSS hataları, RAIM ve bütünlük izleme; sensör füzyonu (GPS, gyro, log).</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* ECDIS */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('ecdis')} className="cursor-pointer" aria-expanded={isOpen('ecdis')}>
            <CardTitle id="ecdis" className="scroll-mt-24 flex items-center justify-between">
              ECDIS, ENC ve Emniyetli Navigasyon
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('ecdis') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('ecdis') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>ENC katmanları, CATZOC, SCAMIN; güvenlik derinliği ve konturleri ayarlama.</p>
              <p>Route check, anti-grounding alarmı, safety corridor; Passage plan entegrasyonu.</p>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-semibold mb-2">Şema (Safety Contours):</p>
              <pre className="font-mono text-[11px] leading-5">{`Derinlik (m)
  █ < safety depth (tehlike)
  ▒ ≈ güvenlik konturu
  · > safety depth (güvenli)
Safety corridor = rota etrafında tolerans bandı`}</pre>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Celestial */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('celestial')} className="cursor-pointer" aria-expanded={isOpen('celestial')}>
            <CardTitle id="celestial" className="scroll-mt-24 flex items-center justify-between">
              Göksel Navigasyon (Özet)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('celestial') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('celestial') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>Meridian passage, azimut ve sight reduction adımları; sextant düzeltmeleri (IE, dip, refraction vs.).</p>
              <p>Navigasyon yıldızları ve hızlı seçim ipuçları; pratik örnek akışı.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Meteorology */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('met')} className="cursor-pointer" aria-expanded={isOpen('met')}>
            <CardTitle id="met" className="scroll-mt-24 flex items-center justify-between">
              Meteoroloji ve Görünürlük
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('met') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('met') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>Rüzgar, dalga, akıntı tahmini kaynakları; sis ve az görüşte seyir teknikleri.</p>
              <p>Barometre eğilimleri, cephe geçişleri ve rota tercihlerine etkileri.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Passage Planning */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('passage')} className="cursor-pointer" aria-expanded={isOpen('passage')}>
            <CardTitle id="passage" className="scroll-mt-24 flex items-center justify-between">
              Passage Planning (Appraisal → Monitoring)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('passage') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('passage') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>Appraisal, Planning, Execution, Monitoring adımlarının kontrol listeleri ve teslim belgeleri.</p>
              <p>Kontenjan yakıt, speed profile, no-go areas, contingency tracks ve pilot card eşleştirmeleri.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* BRM */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('brm')} className="cursor-pointer" aria-expanded={isOpen('brm')}>
            <CardTitle id="brm" className="scroll-mt-24 flex items-center justify-between">
              Köprüüstü Kaynak Yönetimi (BRM)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('brm') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('brm') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>Rol ve sorumluluklar, challenge-and-response, closed-loop communication, fatigue yönetimi.</p>
              <p>Olay örneklerinden dersler: durum farkındalığı ve iş yükü dengelemesi.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* SAR */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('sar')} className="cursor-pointer" aria-expanded={isOpen('sar')}>
            <CardTitle id="sar" className="scroll-mt-24 flex items-center justify-between">
              Arama Kurtarma Seyri (SAR)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('sar') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('sar') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>Square/Sector search kalıpları, drift hesapları, OSC/SMC koordinasyonu ve raporlama.</p>
              <p>Emniyet mesajları, DSC, Mayday/Pan-Pan/Securité uygulaması ve kayıt tutma.</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Examples */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('examples')} className="cursor-pointer" aria-expanded={isOpen('examples')}>
            <CardTitle id="examples" className="scroll-mt-24 flex items-center justify-between">
              Örnek Çalışmalar ve Sınav Tipi Sorular
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('examples') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('examples') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p>GC vs RL rota karşılaştırması, akıntı üçgeni örneği, radar PI kurulumu ve CPA yorumu.</p>
              <p>Kısa cevaplı ve hesaplamalı 10+ örnek soru seti (ilerleyen sürümlerde genişletilecek).</p>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Glossary */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('glossary')} className="cursor-pointer" aria-expanded={isOpen('glossary')}>
            <CardTitle id="glossary" className="scroll-mt-24 flex items-center justify-between">
              Sözlük
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('glossary') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('glossary') && (
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p><strong>COG/SOG:</strong> Yer izindeki rota/sürat.</p>
                <p><strong>CTS:</strong> Akıntı etkileri dahil dümenlenecek rota.</p>
                <p><strong>PI:</strong> Parallel Index, radar referans çizgisi.</p>
              </div>
              <div>
                <p><strong>CATZOC:</strong> ENC veri güven kalitesi göstergesi.</p>
                <p><strong>SCAMIN:</strong> Sembol ölçek görünürlük parametresi.</p>
                <p><strong>DR/EP:</strong> Tahmini konum/etkilerle düzeltilmiş konum.</p>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* References */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('refs')} className="cursor-pointer" aria-expanded={isOpen('refs')}>
            <CardTitle id="refs" className="scroll-mt-24 flex items-center justify-between">
              Kaynakça ve İleri Okuma
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('refs') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('refs') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li>Bowditch – The American Practical Navigator [US NGA, ücretsiz PDF].</li>
              <li>IMO COLREGs – Denizde Çatışmayı Önleme Tüzüğü (özet ve uygulama örnekleri).</li>
              <li>IALA Maritime Buoyage System – Şamandıra ve işaretleme prensipleri.</li>
              <li>Admiralty Manual of Navigation – Rota planlama ve deniz seyri prensipleri.</li>
              <li>NGA Publication 1310 – Radar Navigation and Maneuvering Board Manual.</li>
            </ul>
            <p className="text-xs text-muted-foreground">Not: Resmi yayınların güncel baskılarını kullanın; yerel otorite duyurularını (NtM) takip edin.</p>
          </CardContent>
          )}
        </Card>

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">Sürüm: v1.0 • Planlanan: görsel şemalar, etkileşimli örnekler, daha fazla vaka.</div>
          <Button asChild variant="default" className="gap-2">
            <a href="#foundations">
              Başa Dön
            </a>
          </Button>
        </div>

        <Separator />
      </div>
    </MobileLayout>
  );
}

