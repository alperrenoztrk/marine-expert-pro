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

  // Real-world buoy photos (fetched from Wikimedia Commons)
  type BuoyPhoto = {
    key: string;
    title: string;
    alt: string;
    src: string;
    pageUrl: string;
    credit: string;
  };
  const [buoyPhotos, setBuoyPhotos] = useState<BuoyPhoto[]>([]);
  const [buoyLoading, setBuoyLoading] = useState<boolean>(false);
  const [buoyLoadedOnce, setBuoyLoadedOnce] = useState<boolean>(false);
  const [buoyError, setBuoyError] = useState<string>("");

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

  // Helper: fetch one image from Wikimedia Commons by search query (File namespace)
  async function fetchCommonsImage(query: string): Promise<{ title?: string; url?: string; pageUrl?: string; credit?: string; }>
  {
    try {
      const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=1`;
      const searchRes = await fetch(searchUrl);
      const searchJson = await searchRes.json();
      const fileTitle: string | undefined = searchJson?.query?.search?.[0]?.title;
      if (!fileTitle) return {};
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=640&titles=${encodeURIComponent(fileTitle)}`;
      const infoRes = await fetch(infoUrl);
      const infoJson = await infoRes.json();
      const pages = infoJson?.query?.pages || {};
      const firstPage = Object.values(pages)[0] as any;
      const ii = firstPage?.imageinfo?.[0];
      const url: string | undefined = ii?.thumburl || ii?.url;
      const pageUrl: string | undefined = ii?.descriptionurl;
      const creditMeta = ii?.extmetadata?.Credit?.value || ii?.extmetadata?.Artist?.value || "Wikimedia Commons";
      return { title: fileTitle, url, pageUrl, credit: creditMeta };
    } catch (e) {
      return {};
    }
  }

  // Fetch buoy photos lazily when the section first opens
  useEffect(() => {
    const opened = isOpen('buoys');
    if (!opened || buoyLoadedOnce || buoyLoading) return;
    setBuoyLoading(true);
    setBuoyError("");
    const searches: Array<{ key: string; q: string; alt: string; }> = [
      { key: 'lateral-port', q: '"port hand buoy" OR "port lateral buoy" IALA A filetype:bitmap', alt: 'İskele lateral şamandıra (A Sistemi, kırmızı)' },
      { key: 'lateral-starboard', q: '"starboard hand buoy" OR "starboard lateral buoy" IALA A filetype:bitmap', alt: 'Sancak lateral şamandıra (A Sistemi, yeşil)' },
      { key: 'preferred-port', q: '"preferred channel to port" buoy filetype:bitmap', alt: 'Tercihli kanal iskele (preferred channel to port)' },
      { key: 'preferred-starboard', q: '"preferred channel to starboard" buoy filetype:bitmap', alt: 'Tercihli kanal sancak (preferred channel to starboard)' },
      { key: 'cardinal-north', q: '"north cardinal buoy" filetype:bitmap', alt: 'Kuzey kardinal şamandıra' },
      { key: 'cardinal-east', q: '"east cardinal buoy" filetype:bitmap', alt: 'Doğu kardinal şamandıra' },
      { key: 'cardinal-south', q: '"south cardinal buoy" filetype:bitmap', alt: 'Güney kardinal şamandıra' },
      { key: 'cardinal-west', q: '"west cardinal buoy" filetype:bitmap', alt: 'Batı kardinal şamandıra' },
      { key: 'isolated-danger', q: '"isolated danger mark" buoy filetype:bitmap', alt: 'İzole tehlike işareti' },
      { key: 'safe-water', q: '"safe water mark" buoy filetype:bitmap', alt: 'Emniyetli su işareti' },
      { key: 'special-mark', q: '"special mark" buoy filetype:bitmap', alt: 'Özel işaret (sarı)' },
      { key: 'emergency-wreck', q: '"emergency wreck marking buoy" filetype:bitmap', alt: 'Acil batık işaretleme şamandırası' },
    ];
    (async () => {
      try {
        const results = await Promise.all(searches.map(async s => {
          const info = await fetchCommonsImage(s.q);
          if (info?.url) {
            return {
              key: s.key,
              title: info.title || s.key,
              alt: s.alt,
              src: info.url,
              pageUrl: info.pageUrl || 'https://commons.wikimedia.org',
              credit: info.credit || 'Wikimedia Commons',
            } as BuoyPhoto;
          }
          return undefined;
        }));
        const filtered = results.filter(Boolean) as BuoyPhoto[];
        setBuoyPhotos(filtered);
        setBuoyLoadedOnce(true);
      } catch (err: any) {
        setBuoyError('Görseller yüklenemedi. İnternet bağlantısını veya ağ kısıtlarını kontrol edin.');
      } finally {
        setBuoyLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSections]);

  const toc = [
    { id: "foundations", title: "Temel Kavramlar" },
    { id: "mini-tools", title: "Hızlı Mini Araçlar" },
    { id: "buoys", title: "IALA Şamandıra Sistemi" },
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
                <p className="font-semibold mb-2">Doubling Angle (Genel)</p>
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
                <pre className="mt-2 font-mono text-[11px] leading-5">{`Genel: Distance off = s·sin(A₁)/sin(A₂−A₁)
Özel:  A₂ = 2·A₁ ⇒ Distance off = s`}</pre>
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
              <p><strong>Referans Yönleri:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>True (T):</strong> Gerçek kuzeye göre ölçülen yön (coğrafi kuzey).</li>
                <li><strong>Magnetic (M):</strong> Manyetik kuzeye göre ölçülen yön.</li>
                <li><strong>Compass (C):</strong> Geminin pusulasının gösterdiği yön.</li>
                <li><strong>Dönüşüm kuralı:</strong> Ct = Cc + Var + Dev; işaret kuralı E(doğu) +, W(batı) −</li>
                <li><strong>Varyasyon (Variation):</strong> Gerçek kuzey ile manyetik kuzey arasındaki açı; harita üzerinde işaretlidir.</li>
                <li><strong>Deviasyon (Deviation):</strong> Geminin demir yapısından kaynaklanan manyetik hatalar; deviasyon kartında gösterilir.</li>
              </ul>
              
              <p><strong>Temel Büyüklükler:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Course (Rota):</strong> Geminin gittiği yön (planlanan).</li>
                <li><strong>Heading (Baş):</strong> Geminin burnunun gösterdiği yön.</li>
                <li><strong>Bearing (Kerteriz):</strong> Bir nesnenin referans noktasına göre yönü.</li>
                <li><strong>Set:</strong> Akıntının yönü (derece cinsinden).</li>
                <li><strong>Drift:</strong> Akıntının hızı (knot cinsinden).</li>
                <li><strong>Speed:</strong> Geminin su içindeki hızı.</li>
                <li><strong>SOG (Speed Over Ground):</strong> Deniz dibine göre hız.</li>
                <li><strong>COG (Course Over Ground):</strong> Deniz dibine göre gerçek iz.</li>
              </ul>
              
              <p><strong>Konum Notasyonu:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Enlem (Latitude, φ):</strong> Ekvatora paralel, 0° (Ekvator) ile ±90° (kutuplar) arası. Kuzey (+), Güney (−).</li>
                <li><strong>Boylam (Longitude, λ):</strong> Meridyenler, 0° (Greenwich) ile ±180° arası. Doğu (+), Batı (−).</li>
                <li><strong>Format:</strong> DD°MM.mm' (derece ve ondalık dakika) veya DD°MM'SS" (derece, dakika, saniye).</li>
                <li><strong>Dönüşüm:</strong> 1° = 60', 1' = 60"; örnek: 41°00.5'N = 41°00'30"N.</li>
                <li><strong>Mesafe:</strong> 1 deniz mili = 1 enlem dakikası (≈1852 m).</li>
              </ul>
              
              <p><strong>Harita Temelleri:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Datums:</strong> WGS84 modern standart; eski haritalar ED50, NAD27 gibi datumlar kullanabilir.</li>
                <li><strong>Ölçek:</strong> 1:50,000 = haritada 1 cm gerçekte 500 m. Küçük ölçek (1:500,000) genel görünüm, büyük ölçek (1:10,000) detay için.</li>
                <li><strong>İzohips (Contour lines):</strong> Karada aynı yükseklikteki noktaları birleştiren eğriler.</li>
                <li><strong>İzobat (Depth contours):</strong> Aynı derinlikteki noktaları gösteren eğriler; emniyetli seyir planlaması için kritik.</li>
                <li><strong>Semboller:</strong> Fener, şamandıra, batık, kaya, kablo bölgeleri standart IHO sembolleriyle işaretlenir.</li>
              </ul>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Buoys (IALA) */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('buoys')} className="cursor-pointer" aria-expanded={isOpen('buoys')}>
            <CardTitle id="buoys" className="scroll-mt-24 flex items-center justify-between">
              IALA Şamandıra Sistemi
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('buoys') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('buoys') && (
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p><strong>Genel Bakış:</strong> IALA A/B sistemleri; kanal sınırları, tehlikeler ve güvenli su işaretleri için standart renk/şekil/tepelik ve ışık karakterleri.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Lateral (Yanlaç):</strong> Sistem A'da iskele kırmızı (silindir tepelik), sancak yeşil (koni tepelik). Girişte kırmızı iskelede, yeşil sancakta bırakılır.</li>
                <li><strong>Kardinal (Yönleç):</strong> Tehlikenin güvenli tarafından geçişi gösterir. Kuzey (▲▲), Doğu (▲▼), Güney (▼▼), Batı (▼▲) koni tepelikleri ve siyah/sarı bant kombinasyonları.</li>
                <li><strong>Tecrit (İzole) Tehlike:</strong> Kırmızı-siyah yatay bant; tepelik iki siyah küre; ışık: Fl(2).</li>
                <li><strong>Emniyetli Su:</strong> Kırmızı-beyaz dikey bant; tepelik kırmızı küre; ışık: Iso veya LFl10s.</li>
                <li><strong>Özel İşaret:</strong> Sarı gövde ve X tepelik; kablo/askeri alan vb. için bilgi işaretleri.</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <figure className="bg-muted/20 rounded p-3">
                <img alt="IALA Lateral Marks (A Sistemi) – Kırmızı iskele, yeşil sancak" className="w-full h-auto rounded" src="/src/assets/navigation/iala-lateral-marks.svg" loading="lazy" />
                <figcaption className="text-[11px] text-muted-foreground mt-1">Görsel: Wikimedia Commons (IALA A lateral işaretler)</figcaption>
              </figure>
              <figure className="bg-muted/20 rounded p-3">
                <img alt="Cardinal Marks – Kuzey, Doğu, Güney, Batı koni tepelikleri ve renkleri" className="w-full h-auto rounded" src="/src/assets/navigation/cardinal-marks.svg" loading="lazy" />
                <figcaption className="text-[11px] text-muted-foreground mt-1">Görsel: Wikimedia Commons (Kardinal işaretler)</figcaption>
              </figure>
              <figure className="bg-muted/20 rounded p-3">
                <img alt="Isolated Danger Mark – kırmızı siyah bantlı, iki siyah küre tepelikli" className="w-full h-auto rounded" src="/src/assets/navigation/isolated-danger-mark.svg" loading="lazy" />
                <figcaption className="text:[11px] text-muted-foreground mt-1">Görsel: Wikimedia Commons (Tecrit tehlike işareti)</figcaption>
              </figure>
              <figure className="bg-muted/20 rounded p-3">
                <img alt="Safe Water Mark – kırmızı beyaz dikey bantlı, kırmızı küre tepelikli" className="w-full h-auto rounded" src="/src/assets/navigation/safe-water-mark.svg" loading="lazy" />
                <figcaption className="text-[11px] text-muted-foreground mt-1">Görsel: Wikimedia Commons (Emniyetli su işareti)</figcaption>
              </figure>
            </div>
            <div className="mt-2">
              <p className="font-semibold mb-2">Gerçek Görseller</p>
              {buoyLoading && (
                <div className="text-xs text-muted-foreground">Fotoğraflar yükleniyor…</div>
              )}
              {buoyError && (
                <div className="text-xs text-red-500">{buoyError}</div>
              )}
              {!!buoyPhotos.length && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {buoyPhotos.map(photo => (
                    <figure key={photo.key} className="bg-muted/20 rounded p-3">
                      <img
                        alt={photo.alt}
                        className="w-full h-auto rounded"
                        src={photo.src}
                        loading="lazy"
                      />
                      <figcaption className="text-[11px] text-muted-foreground mt-1">
                        {photo.title} — Kaynak: <a className="underline" href={photo.pageUrl} target="_blank" rel="noopener noreferrer">{photo.credit.replace(/<[^>]*>/g, '')}</a>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Not: Yerel otorite yayınları ve NtM ile güncel işaretlemeleri teyit edin.</p>
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
              <p><strong>Mercator Projeksiyonu:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Özellikler:</strong> Silindirik projeksiyon; meridyenler ve paraleller dik açı yapar.</li>
                <li><strong>Rhumb Line (Loxodrome):</strong> Sabit kerterizli rotalar düz çizgi olarak görünür; seyir planlaması kolaydır.</li>
                <li><strong>Ölçek Değişimi:</strong> Ekvatorda doğru, kutuplara doğru artar; yüksek enlemlerde dikkatli kullanılmalı.</li>
                <li><strong>Avantaj:</strong> Açı ve yön korunur; kolay çizim ve ölçüm imkanı.</li>
                <li><strong>Dezavantaj:</strong> Büyük daire uzaklıkları doğru gösterilmez; alan bozulması vardır.</li>
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <figure className="bg-muted/20 rounded p-3">
                  <img
                    className="w-full h-auto rounded"
                    alt="Mercator projeksiyonunda dünya haritası"
                    src="/src/assets/navigation/mercator-projection.svg"
                    loading="lazy"
                  />
                  <figcaption className="text-[11px] text-muted-foreground mt-1">
                    Kaynak: Wikimedia Commons — Mercator Projection (SW), CC BY-SA
                  </figcaption>
                </figure>

                <figure className="bg-muted/20 rounded p-3">
                  <img
                    className="w-full h-auto rounded"
                    alt="Gnomonik projeksiyonda dünya haritası ve büyük daireler düz çizgi"
                    src="/src/assets/navigation/gnomonic-projection.svg"
                    loading="lazy"
                  />
                  <figcaption className="text-[11px] text-muted-foreground mt-1">
                    Kaynak: Wikimedia Commons — Gnomonic Projection (SW), CC BY-SA
                  </figcaption>
                </figure>
              </div>
              
              <p><strong>Gnomonik Projeksiyonu:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Özellikler:</strong> Merkezi projeksiyon; Dünya'nın merkezi izdüşüm noktasıdır.</li>
                <li><strong>Büyük Daire (Great Circle):</strong> İki nokta arası en kısa mesafe düz çizgi olarak görünür.</li>
                <li><strong>Kullanım:</strong> Uzun mesafe seyir planlaması; okyanus geçişlerinde tercih edilir.</li>
                <li><strong>Yöntem:</strong> Gnomonik'te GC çizilir, ara noktalar belirlenir, Mercator'a aktarılır ve RL segmentlerle bağlanır.</li>
                <li><strong>Kısıtlama:</strong> Ekvatoru ve antipodları (karşı nokta) gösteremez; sınırlı kapsama alanı.</li>
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <figure className="bg-muted/20 rounded p-3">
                  <img
                    className="w-full h-auto rounded"
                    alt="Mercator üzerinde rhumb line düz çizgi, great circle eğri"
                    src="/src/assets/navigation/great-circle-vs-rhumb.svg"
                    loading="lazy"
                  />
                  <figcaption className="text-[11px] text-muted-foreground mt-1">
                    Kaynak: Wikimedia Commons — Great circle vs rhumb line (Mercator), CC BY-SA
                  </figcaption>
                </figure>
                <figure className="bg-muted/20 rounded p-3">
                  <img
                    className="w-full h-auto rounded"
                    alt="Azimutal eşit uzaklık projeksiyonu (kutuplar merkezli örnek)"
                    src="/src/assets/navigation/azimuthal-projection.svg"
                    loading="lazy"
                  />
                  <figcaption className="text-[11px] text-muted-foreground mt-1">
                    Kaynak: Wikimedia Commons — Azimuthal Equidistant Projection (SW), CC BY-SA
                  </figcaption>
                </figure>
              </div>
              
              <p><strong>Harita Türleri ve Ölçekleri:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>General Charts:</strong> 1:1,500,000 veya daha küçük; okyanus geçişleri, genel planlama için.</li>
                <li><strong>Sailing Charts:</strong> 1:600,000 - 1:1,500,000; açık deniz seyri.</li>
                <li><strong>Coastal Charts:</strong> 1:50,000 - 1:600,000; kıyı seyri, landfall yapma.</li>
                <li><strong>Approach Charts:</strong> 1:25,000 - 1:50,000; liman yaklaşmaları.</li>
                <li><strong>Harbour/Berthing Plans:</strong> 1:25,000'den büyük; liman içi manevra ve yanaşma.</li>
              </ul>
              
              <p><strong>Yardımcı Denizcilik Yayınları:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Pilot Books (Sailing Directions):</strong> Kıyı özellikleri, liman bilgileri, yerel düzenlemeler, iklim ve akıntı bilgileri.</li>
                <li><strong>List of Lights:</strong> Fener karakteristikleri, konumları, menzilleri ve tanımlama bilgileri.</li>
                <li><strong>Tide Tables:</strong> Gelgit zamanları ve yükseklikleri; harmonic constants ve tahmin yöntemleri.</li>
                <li><strong>Tidal Stream Atlases:</strong> Akıntı setleri ve hızları; saatlik akıntı değişimleri.</li>
                <li><strong>Notices to Mariners (NtM):</strong> Haftalık harita düzeltmeleri; tehlike ve değişiklik bildirimleri.</li>
                <li><strong>Radio Signals:</strong> Navtex, DSC, coastal radio station bilgileri.</li>
                <li><strong>Symbols & Abbreviations:</strong> INT-1 standardı; uluslararası sembol ve kısaltmalar.</li>
              </ul>
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
              <p><strong>Dead Reckoning (DR) - Ölü Hesap:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Son bilinen kesin konumdan, geminin hızı ve rotası kullanılarak tahmini konumun hesaplanması.</li>
                <li><strong>Yöntem:</strong> Son fix konumundan itibaren, compass course ve log speed ile mesafe ve yön hesaplanır.</li>
                <li><strong>Sembol:</strong> DR konumu haritada yarım daire ile işaretlenir.</li>
                <li><strong>Amaç:</strong> Sürekli konum takibi; GPS arızasında yedek sistem; seyir güvenliği.</li>
                <li><strong>Hata Kaynakları:</strong> Log kalibrasyon hatası, gyro hatası, rüzgar/akıntı etkisi ihmal edilmesi.</li>
              </ul>
              
              <p><strong>Estimated Position (EP) - Tahmini Konum:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> DR konumuna set/drift (akıntı) ve leeway (rüzgar sapması) etkilerinin eklenmesiyle bulunan daha doğru tahmini konum.</li>
                <li><strong>Fark:</strong> DR sadece hız ve rotayı kullanır; EP dış etkileri de dikkate alır.</li>
                <li><strong>Sembol:</strong> EP haritada üçgen (△) ile gösterilir.</li>
                <li><strong>Uygulama:</strong> Akıntı atlaslarından veya tahminlerden set/drift bilgisi alınır, vektörel olarak DR'ye eklenir.</li>
              </ul>
              
              <p><strong>Plot (İşaretleme) Aralıkları ve İyi Uygulamalar:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Açık Deniz:</strong> Her 1-2 saatte bir DR/EP güncellemesi; daha az tehlike nedeniyle uzun aralık.</li>
                <li><strong>Kıyı Seyri:</strong> 15-30 dakikada bir veya daha sık; navigasyon tehlikelerine yakınlık.</li>
                <li><strong>Pilotage (Liman Yaklaşma):</strong> Sürekli konum güncellemesi; her major course change ve fix sonrası.</li>
                <li><strong>Kayıt:</strong> Log book'ta zaman, konum, hız, rota, akıntı/rüzgar bilgileri not edilmeli.</li>
                <li><strong>Karşılaştırma:</strong> Log speed ile SOG, compass course ile COG karşılaştırılmalı; farklar akıntı/rüzgar etkisini gösterir.</li>
              </ul>
              
              <p><strong>GPS ile DR/EP Karşılaştırması:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Amaç:</strong> Anomali tespiti; GPS arıza/hata kontrolü; set/drift doğrulama.</li>
                <li><strong>COG vs HDG:</strong> Fark akıntı/rüzgar sapmasını gösterir; büyük farklar analiz edilmeli.</li>
                <li><strong>SOG vs Speed:</strong> Akıntının gemiye etkisini gösterir; hız kaybı veya kazancı.</li>
                <li><strong>GPS Fix Güvenilirliği:</strong> HDOP, PDOP değerleri izlenmeli; satellite geometry ve signal quality önemli.</li>
                <li><strong>Bağımsız Doğrulama:</strong> GPS konumları radar, visual bearings veya celestial ile desteklenmeli.</li>
              </ul>
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
              <p><strong>Dönüşümler:</strong> Cc → Ct: Ct = Cc + Var + Dev; işaret kuralı E(+) W(−).</p>
              <p><strong>Deviasyon Eğrisi:</strong> Swing test; periyodik doğrulama ve kayıt. Not: Compass Error (CE) = Var + Dev; doğu (+), batı (−).</p>
              <p><strong>Jiroskop:</strong> Latitude error, speed error; düzeltme kartları ve alarm yönetimi.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <figure className="bg-muted/20 rounded p-3">
                <img
                  className="w-full h-auto rounded"
                  alt="Manyetik pusula ve bileşenleri"
                  src="/src/assets/navigation/compass.svg"
                  loading="lazy"
                />
                <figcaption className="text-[11px] text-muted-foreground mt-1">
                  Manyetik Pusula Bileşenleri
                </figcaption>
              </figure>
              
              <figure className="bg-muted/20 rounded p-3">
                <img
                  className="w-full h-auto rounded"
                  alt="Sekstant ve kullanımı"
                  src="/src/assets/navigation/sextant.svg"
                  loading="lazy"
                />
                <figcaption className="text-[11px] text-muted-foreground mt-1">
                  Sekstant ve Bileşenleri
                </figcaption>
              </figure>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="font-semibold mb-2">Çözümlü Örnek:</p>
              <pre className="font-mono text-[11px] leading-5">{`Verilen: Cc = 212°, Var = +3.0° (E), Dev = −1.5° (W)
İstenen: Ct ve Compass Error (CE)
Adımlar:
  1) CE = Var + Dev = +3.0 − 1.5 = +1.5° (E)
  2) Ct = Cc + CE = 212 + 1.5 = 213.5°
Cevap: CE = 1.5°E, Ct ≈ 214°`}</pre>
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
              <p><strong>Doubling the Angle (Açıyı İkiye Katlama):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Prensip:</strong> Bir işaretin bow açısı ölçülür (A₁), gemi ilerler, açı ikiye katlanınca (A₂ = 2×A₁) tekrar ölçülür.</li>
                <li><strong>Sonuç:</strong> İkinci ölçümdeki distance off, iki ölçüm arası koşulan mesafeye eşittir.</li>
                <li><strong>Formül:</strong> Distance off (2. ölçüm anı) = Run × sin(A₁) / sin(A₂ − A₁)</li>
                <li><strong>Özel:</strong> A₂ = 2×A₁ ⇒ Distance off = Run</li>
                <li><strong>Özel Durumlar:</strong> 22.5°-45° veya 45°-90° açılarında özel yöntemler mevcuttur.</li>
                <li><strong>Avantaj:</strong> Tek işaretle distance off bulunur; basit ve hızlıdır.</li>
                <li><strong>Dezavantaj:</strong> Sabit hız ve rota gerektirir; akıntı/rüzgar etkisi hata kaynağıdır.</li>
              </ul>
              
              <p><strong>Special Angle Bearing (22.5° - 45° Yöntemi):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>İlk Kerteriz:</strong> Pruva açısı 22.5° (geleneksel 2 points) olduğunda zaman ve konum not edilir.</li>
                <li><strong>İkinci Kerteriz:</strong> Pruva açısı 45° (4 points) olduğunda tekrar ölçülür.</li>
                <li><strong>Hesap:</strong> Distance off ≈ 0.707 × Run (trigonometrik).</li>
                <li><strong>Kullanım:</strong> Erken aşamada mesafe tahmini için kullanılır.</li>
              </ul>
              
              <p><strong>Four Point Bearing veya Bow and Beam Bearing (45° - 90° Yöntemi):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Klasik denizcilik yöntemi; pusula noktalarına dayalı (4 points = 45°, 8 points = 90°/abeam).</li>
                <li><strong>İlk Kerteriz:</strong> Pruva açısı 45° (4 points) olduğunda işaretlenir ve zaman kaydedilir.</li>
                <li><strong>İkinci Kerteriz:</strong> İşaret travese (abeam, 90° veya 8 points) geldiğinde ölçülür.</li>
                <li><strong>Hesap:</strong> Distance off abeam = Run (iki ölçüm arası koşulan mesafe).</li>
                <li><strong>Avantaj:</strong> Basit hesap; geminin abeam geçişi net; emniyet mesafesi kontrolü için ideal.</li>
                <li><strong>Not:</strong> 32 pusula noktası sisteminde (her nokta 11.25°) 4 point = 45°, 8 point = 90° demektir.</li>
              </ul>
              
              <p><strong>Running Fix (Koşan Fix):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Yöntem:</strong> Farklı zamanlarda alınan iki veya daha fazla kerteriz, geminin hareketi hesaplanarak ortak noktada kesiştirilir.</li>
                <li><strong>Adımlar:</strong> İlk kerteriz alınır ve çizilir; belirli süre sonra ikinci kerteriz alınır; ilk kerteriz geminin koştuğu mesafe kadar transfer edilir; kesişim noktası fix konumunu verir.</li>
                <li><strong>En İyi Açı:</strong> Kerterizler arası 30°-150° açı ideal; 90° civarı en iyisidir.</li>
              </ul>
              
              <p><strong>Hata Kaynakları ve Azaltma Teknikleri:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Paralaks Hatası:</strong> Gözlem açısı ve işaret yüksekliği kaynaklı; düşük ufuk ve yüksek yapılarda dikkat.</li>
                <li><strong>Sapma (Deviation):</strong> Pusula hatası; doğru deviasyon kartı kullanımı kritik.</li>
                <li><strong>Okuma Hatası:</strong> İnsan faktörü; birden fazla ölçüm alıp ortalama almak faydalı.</li>
                <li><strong>İşaret Seçimi:</strong> Net, kesin tanımlı, haritada doğru konumlanmış işaretler seçilmeli (fener, church spire, tangent points).</li>
                <li><strong>Zaman Senkronizasyonu:</strong> Kerterizler mümkünse aynı anda alınmalı (2-3 kişiyle); running fix'te zaman kaydı önemli.</li>
                <li><strong>Rota ve Hız Sabitliği:</strong> Doubling angle ve running fix sırasında değişikliklerden kaçınılmalı.</li>
              </ul>
              
              <p><strong>En İyi Uygulamalar:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Her fix sonrası DR/EP ile karşılaştır; büyük farkları araştır.</li>
                <li>Minimum 3 kerteriz al (cocked hat); küçük üçgen daha güvenilir.</li>
                <li>Kerteriz açıları 30°-150° arası olmalı; 60°-120° ideal.</li>
                <li>Haritada açık, sembolü net işaretler tercih et.</li>
                <li>Elektronik ve visual yöntemleri karşılaştır (radar range/bearing vs visual).</li>
              </ul>
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
              <figure className="bg-muted/20 rounded p-3">
                <img
                  className="w-full h-auto rounded"
                  alt="Gelgit eğrisi ve akıntı akışı"
                  src="/src/assets/navigation/tide-current.svg"
                  loading="lazy"
                />
                <figcaption className="text-[11px] text-muted-foreground mt-1">
                  Gelgit Eğrisi ve Akıntı Akışı - HW/LW Döngüsü ve Akıntı Etkisi
                </figcaption>
              </figure>
              
              <p><strong>Gelgit (Tide) Temelleri:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Ay ve Güneş'in çekim kuvvetlerinden kaynaklanan deniz seviyesi değişimleri.</li>
                <li><strong>Yükselme (High Water - HW):</strong> Gelgitin en yüksek seviyesi.</li>
                <li><strong>Alçalma (Low Water - LW):</strong> Gelgitin en düşük seviyesi.</li>
                <li><strong>Range:</strong> HW ile LW arasındaki fark; spring tide'da büyük, neap tide'da küçük.</li>
                <li><strong>Spring Tide:</strong> Dolunay ve yeni ay dönemlerinde; Ay ve Güneş hizalı; maksimum range.</li>
                <li><strong>Neap Tide:</strong> İlk ve son dördün; Ay ve Güneş dik açıda; minimum range.</li>
                <li><strong>Chart Datum:</strong> Harita derinliklerinin referansı; genellikle LAT (Lowest Astronomical Tide).</li>
              </ul>
              
              <p><strong>Rule of Twelfths (Onikide Bir Kuralı):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Prensip:</strong> Gelgit değişimi 6 saatte tamamlanır; her saatte farklı oranda yükselir/alçalır.</li>
                <li><strong>Dağılım:</strong> 1. saat: 1/12, 2. saat: 2/12, 3. saat: 3/12, 4. saat: 3/12, 5. saat: 2/12, 6. saat: 1/12 (toplam range'in).</li>
                <li><strong>Örnek:</strong> Range 6 m ise; 1. saat 0.5 m, 2. saat 1.0 m, 3. saat 1.5 m, 4. saat 1.5 m, 5. saat 1.0 m, 6. saat 0.5 m değişir.</li>
                <li><strong>Kullanım:</strong> Belirli bir zamandaki gelgit yüksekliğini tahmin etmek; liman giriş/çıkış zamanlaması.</li>
                <li><strong>Sınırlama:</strong> Yaklaşık yöntem; anomali bölgeler ve hava etkisi göz ardı edilir.</li>
              </ul>
              
              <p><strong>Harmonic Constituents (Harmonik Bileşenler):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Gelgiti oluşturan farklı periyodik kuvvetler (M2, S2, K1, O1 vb.).</li>
                <li><strong>M2:</strong> Ay'ın yarı günlük bileşeni (12.42 saat); en dominant faktör.</li>
                <li><strong>S2:</strong> Güneş'in yarı günlük bileşeni (12 saat).</li>
                <li><strong>Tahmin:</strong> Harmonik analiz ile gelgit yükseklikleri yüksek doğrulukla hesaplanır; Tide Tables bu yöntemle hazırlanır.</li>
                <li><strong>Avantaj:</strong> Uzun vadeli tahmin imkanı; bilgisayar programlarıyla entegrasyon.</li>
              </ul>
              
              <p><strong>Secondary Port Yöntemleri:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Standard Port:</strong> Ana liman; tam gelgit verileri mevcut (HW/LW zamanları ve yükseklikleri).</li>
                <li><strong>Secondary Port:</strong> Küçük liman/yer; standard port'a göre time ve height differences verilir.</li>
                <li><strong>Adımlar:</strong> 1) Standard port HW/LW bul, 2) Time difference ekle/çıkar, 3) Height difference ekle/çıkar, 4) Secondary port HW/LW elde et.</li>
                <li><strong>Örnek:</strong> Std port HW 12:00/4.5m; sec port diff: +0:25/+0.3m → Sec port HW 12:25/4.8m.</li>
              </ul>
              
              <p><strong>Akıntı Atlasları ve Set/Drift Tahmini:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tidal Stream Atlas:</strong> Saatlik akıntı yönü (set) ve hızı (drift); HW Dover, HW local port gibi referanslara göre.</li>
                <li><strong>Kullanım:</strong> Seyir planlamasında akıntı etkisini öngörmek; CTS/SOG hesaplarında kullanılır.</li>
                <li><strong>Interpolasyon:</strong> Springs/Neaps arası değerler linear olarak tahmin edilir.</li>
                <li><strong>Diamond Notasyonu:</strong> Haritada ◊ sembolü; tabloda o bölgenin saatlik set/drift verileri.</li>
                <li><strong>ETA Etkisi:</strong> Favorable tide (yardımcı akıntı) ETA'yı kısaltır; foul tide (zıt akıntı) uzatır; planlama sırasında akıntı pencereleri optimize edilir.</li>
              </ul>
              
              <p><strong>Under Keel Clearance (UKC) Hesabı:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Formül:</strong> UKC = (Chart depth + Tide height) - Draft - Safety margin.</li>
                <li><strong>Chart Depth:</strong> Haritadan okunan derinlik (datum'a göre).</li>
                <li><strong>Tide Height:</strong> O andaki gelgit yüksekliği (+ HW artı, − LW eksi olabilir).</li>
                <li><strong>Draft:</strong> Geminin su çekimi; load condition'a göre değişir.</li>
                <li><strong>Safety Margin:</strong> Squat, swell, wave action için yedek; genellikle 10-20% draft veya min 0.5-1.0m.</li>
                <li><strong>Kritik Noktalar:</strong> Liman girişi, sığ kanallar, bar geçişleri; tide window hesaplanmalı.</li>
              </ul>
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
              <p><strong>Kıyı Seyri (Pilotage) Tanımı:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Kıyıya yakın, tehlikeli sularda, liman yaklaşma ve iç sularda yapılan seyir; yüksek dikkat gerektirir.</li>
                <li><strong>Amaç:</strong> Emniyetli navigasyon; tehlikelerden kaçınma; doğru liman/rıhtım yaklaşımı.</li>
                <li><strong>Özellikler:</strong> Sık konum güncellemesi; visual ve radar kombinasyonu; yerel bilgi kritik.</li>
              </ul>
              
              <p><strong>Clearing Bearings (Emniyet Kerterizi):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Bir tehlikeden emniyetli mesafede kalmayı garanti eden kerteriz çizgisi.</li>
                <li><strong>Yöntem:</strong> Haritada tehlike belirlenir; emniyetli yan taraftan bir işaret seçilir; tehlike sınırına teğet bir kerteriz çizilir ve “not less than”/“not more than” kuralı uygulanır.</li>
                <li><strong>Örnek:</strong> Sağ tarafta bir kayalık var; sol taraftan fener alınır; kerteriz 045° olarak belirlenir; "fener kerterizi 045°'den büyük olmalı" kuralı uygulanır.</li>
                <li><strong>Avantaj:</strong> Tek ölçümle emniyet kontrolü; basit ve etkili.</li>
              </ul>

              <div className="bg-muted/20 rounded p-3">
                <p className="font-semibold mb-2">Fenerlerin Coğrafi Menzili</p>
                <pre className="font-mono text-[11px] leading-5">{`Coğrafi menzil (nm) ≈ 2.08·(√h_obs + √h_light)
Radar/VHF ≈ 2.23·(√h_tx + √h_rx)
Not: h metre cinsinden. Luminous range, meteorolojik görüşe bağlıdır.`}</pre>
              </div>
              
              <p><strong>Danger Angles (Tehlike Açıları):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Horizontal Danger Angle:</strong> İki işaret arası açı; geminin tehlikeli bölgede olup olmadığını gösterir.</li>
                <li><strong>Yöntem:</strong> İki işaret seçilir (A ve B); haritada tehlike sınırından geçen bir daire çizilir; daire üzerinde sextant açısı ölçülür; gemide ölçülen açı ile karşılaştırılır.</li>
                <li><strong>Kural:</strong> Ölçülen açı {'>'} danger açısı ise tehlikeli bölgedesiniz; {'<'} ise emniyetli.</li>
                <li><strong>Vertical Danger Angle:</strong> Bir yapının (fener, tepe) yüksekliği bilinir; sextant ile dikey açı ölçülür; mesafe hesaplanır; minimum mesafe kontrolü.</li>
                <li><strong>Formül:</strong> Distance (nm) ≈ Height (m) / (1852 × tan(angle)).</li>
              </ul>
              
              <p><strong>Transits (Hizalama/Transit Geçişleri):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> İki işaretin (fener, beacon, landmark) hizalanması; çok kesin konum çizgisi verir.</li>
                <li><strong>Kullanım:</strong> Kanal merkez çizgisi; tehlikeli geçiş rotası; liman yaklaşma hattı.</li>
                <li><strong>Avantaj:</strong> Pusula gerektirmez; çok yüksek doğruluk; görsel kontrol kolay.</li>
                <li><strong>Örnek:</strong> Ön ve arka fener hizalandığında gemi emniyetli kanalda; hizadan sapma hemen fark edilir.</li>
                <li><strong>Natural Transits:</strong> Doğal nesneler (tepe tepeleri, tangent noktalar) kullanılarak improvize edilebilir.</li>
              </ul>
              
              <p><strong>Parallel Indexing (PI - Paralel İndeksleme):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Radar ekranında sabit bir referans çizgisi; geminin rotasına paralel; belirli bir mesafede.</li>
                <li><strong>Kurulum:</strong> Planlanan rotaya paralel, emniyetli mesafede (örn. 0.5 nm) haritada çizgi çizilir; radar EBL/VRM ile bu çizgi simüle edilir; kıyı/işaret bu çizgi üzerinde hareket etmelidir.</li>
                <li><strong>Kullanım:</strong> Kanal seyri; dar geçitler; emniyet mesafesi kontrolü; rota sapması hemen tespit edilir.</li>
                <li><strong>Avantaj:</strong> Sürekli izleme; harita plot gerektirmez; hızlı tepki imkanı.</li>
                <li><strong>Örnek:</strong> Sancak tarafta 0.5 nm mesafede PI kurulur; radar echo bu çizgide ilerler; çizgiden sapma rota düzeltmesi gerektirir.</li>
              </ul>
              
              <p><strong>Yerel Talimatlar ve Prosedürler:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Pilot Books:</strong> Yerel tehlikeler, yaklaşma prosedürleri, liman düzenleri, iklim özellikleri.</li>
                <li><strong>VTS (Vessel Traffic Service):</strong> Liman otorite talimatları; trafik ayrım şemaları; yaklaşma izni ve slot zamanları.</li>
                <li><strong>Local Notices:</strong> Geçici tehlikeler; inşaat, dredging, wreck; updated chart bilgileri.</li>
                <li><strong>Pilot Onboard:</strong> Kılavuz kaptanın tavsiyeleri; yerel bilgi aktarımı; köprüüstü iletişimi ve coordination.</li>
              </ul>
              
              <p><strong>Minimum Under Keel Clearance (UKC):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Geminin omurgası ile deniz tabanı arası minimum güvenli mesafe.</li>
                <li><strong>Hesaplama:</strong> Gelgit bölümünde detaylı; UKC = (Chart depth + Tide) - Draft - Margin.</li>
                <li><strong>Squat Etkisi:</strong> Geminin hızından kaynaklanan su seviyesi düşüşü; sığ sularda artış gösterir; genellikle speed² ile orantılı.</li>
                <li><strong>Margin:</strong> Dalga, swell, bank effect için; genellikle 10-20% draft veya min 0.5-1.0m.</li>
                <li><strong>Kritik Bölgeler:</strong> Liman girişi barı; sığ kanallar; tide window hesaplanmalı; hız azaltma gerekebilir.</li>
              </ul>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Radar */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('radar')} className="cursor-pointer" aria-expanded={isOpen('radar')}>
            <CardTitle id="radar" className="scroll-mt-24 flex items-center justify-between">
              Radar Kullanımı ve ARPA Sistemleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('radar') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('radar') && (
          <CardContent className="space-y-6 text-sm">
            {/* Gerçek Radar Görselleri */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <img 
                  src="/navigation/bridge/radar-display.jpg" 
                  alt="Gerçek radar display ekranı" 
                  className="w-full rounded-lg shadow-lg"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center" data-translatable="true">
                  Modern radar ekranı: Hedefler, menzil halkaları ve navigasyon bilgileri
                </p>
              </div>
              <div>
                <img 
                  src="/navigation/bridge/navigation-console.jpg" 
                  alt="Navigasyon konsolu" 
                  className="w-full rounded-lg shadow-lg"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center" data-translatable="true">
                  Entegre navigasyon konsolu: Radar, ECDIS ve kontrol panelleri
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold" data-translatable="true">Radar Temelleri ve Çalışma Prensibi</h3>
              <p data-translatable="true">
                Radar (Radio Detection and Ranging), radyo dalgaları göndererek nesneleri tespit eden ve mesafelerini ölçen bir sistemdir.
                Gemilerde navigasyon ve çarpışma önleme için kritik öneme sahiptir.
              </p>
              
              <div className="bg-accent/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" data-translatable="true">Radar Frekans Bantları</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-primary mb-1">X-Band (9 GHz, 3 cm)</p>
                    <ul className="space-y-1 text-xs">
                      <li data-translatable="true">• Yüksek çözünürlük ve detay</li>
                      <li data-translatable="true">• Kısa menzil (32-48 nm)</li>
                      <li data-translatable="true">• Yağmur/denizden fazla etkilenir</li>
                      <li data-translatable="true">• Küçük hedefler için ideal</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-primary mb-1">S-Band (3 GHz, 10 cm)</p>
                    <ul className="space-y-1 text-xs">
                      <li data-translatable="true">• Uzun menzil (64-96 nm)</li>
                      <li data-translatable="true">• Kötü havada az etkilenir</li>
                      <li data-translatable="true">• Daha az sea/rain clutter</li>
                      <li data-translatable="true">• Açık deniz seyri için</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">Radar Display Modları</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-card border rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-2" data-translatable="true">Head-Up Mode</h4>
                  <ul className="space-y-1 text-xs">
                    <li data-translatable="true">• Gemi başı daima yukarıda</li>
                    <li data-translatable="true">• Rota değişince ekran döner</li>
                    <li data-translatable="true">• Göreceli hareket (relative motion)</li>
                    <li data-translatable="true">• Manevra için tercih edilir</li>
                  </ul>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-2" data-translatable="true">Course-Up Mode</h4>
                  <ul className="space-y-1 text-xs">
                    <li data-translatable="true">• Seçilen rota yönü yukarıda</li>
                    <li data-translatable="true">• Düz seyirde pratik</li>
                    <li data-translatable="true">• Kıyı seyri için uygun</li>
                    <li data-translatable="true">• Harita ile kolay karşılaştırma</li>
                  </ul>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-2" data-translatable="true">North-Up Mode</h4>
                  <ul className="space-y-1 text-xs">
                    <li data-translatable="true">• Kuzey daima yukarıda sabit</li>
                    <li data-translatable="true">• Harita ile aynı oryantasyon</li>
                    <li data-translatable="true">• True motion ile ideal</li>
                    <li data-translatable="true">• ARPA için tercih edilir</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">Radar Kontrolleri ve Optimizasyon</h3>
              <div className="space-y-3">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Gain (Kazanç) Ayarı</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Alıcının hassasiyetini kontrol eder. Zayıf sinyalleri görünür kılarken gürültüyü minimize eder.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Çok düşük:</strong> Zayıf hedefler kaybolur</li>
                    <li data-translatable="true">• <strong>Çok yüksek:</strong> Ekran gürültüyle dolar</li>
                    <li data-translatable="true">• <strong>Optimal:</strong> Hafif gürültü görününceye kadar artır, sonra azalt</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Sea Clutter (STC)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Deniz dalgalarının yansımalarını azaltır. Sensitivity Time Control kullanır.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• Yakın mesafeyi etkiler (0-3 nm)</li>
                    <li data-translatable="true">• Kaba denizde artırılır</li>
                    <li data-translatable="true">• ⚠️ Aşırı kullanım küçük hedefleri maskeler!</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Rain Clutter (FTC)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Yağmur, kar ve doludan kaynaklanan gürültüyü azaltır. Fast Time Constant kullanır.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• Tüm menzilleri etkiler</li>
                    <li data-translatable="true">• Sağanak yağmurda artırılır</li>
                    <li data-translatable="true">• ⚠️ Yağmur perdesindeki hedefleri zayıflatabilir!</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Range (Menzil) Seçimi</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Kıyı seyri:</strong> 3-6 nm (detay için)</li>
                    <li data-translatable="true">• <strong>Liman yaklaşması:</strong> 0.75-1.5 nm (hassas pozisyon)</li>
                    <li data-translatable="true">• <strong>Açık deniz:</strong> 12-24 nm (erken uyarı)</li>
                    <li data-translatable="true">• <strong>Dual range:</strong> Yakın + uzak menzili birlikte kullan</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">Parallel Indexing (PI)</h3>
              <p className="text-xs mb-3" data-translatable="true">
                Radar ekranında sabit bir referans çizgisi oluşturarak güvenli seyir mesafesini kontrol etme tekniği.
                Özellikle dar kanallarda ve kıyı seyirinde kritik öneme sahiptir.
              </p>
              
              <div className="bg-accent/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" data-translatable="true">PI Kurulum Adımları</h4>
                <ol className="text-xs space-y-2 ml-4 list-decimal">
                  <li data-translatable="true"><strong>Planlama:</strong> Haritada güvenli rotanızı çizin</li>
                  <li data-translatable="true"><strong>Paralel Çizgi:</strong> Rotanıza paralel, güvenli mesafede (ör. 0.5 nm) çizgi çizin</li>
                  <li data-translatable="true"><strong>Referans Nokta:</strong> Bu çizgi üzerinde sabit bir kıyı objesi seçin (burun, fener, vb.)</li>
                  <li data-translatable="true"><strong>Radar Setup:</strong> EBL'yi bu objeye çevirin, VRM'i mesafeye ayarlayın</li>
                  <li data-translatable="true"><strong>İzleme:</strong> Obje EBL/VRM kesişiminde kalmalı; sapma = rota hatası</li>
                </ol>
              </div>

              <div className="bg-card border rounded-lg p-4 mt-3">
                <p className="font-semibold mb-2" data-translatable="true">Pratik Örnek</p>
                <p className="text-xs" data-translatable="true">
                  Dar bir kanalda seyir: Sancak tarafta 0.5 nm minimum mesafe gerekli. Kıyıdaki belirgin bir burun seçin.
                  PI çizgisini 0.5 nm'de kurabilin. Burun bu çizgide ilerlemeli. Çizgiden yaklaşırsa → iskeleye dümene,
                  uzaklaşırsa → sancağa dümene.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">EBL ve VRM Kullanımı</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">EBL (Electronic Bearing Line)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Elektronik kerteriz çizgisi. Herhangi bir hedefe yönlendirilebilir.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• Hedef kerterizini ölçme</li>
                    <li data-translatable="true">• Parallel indexing için referans</li>
                    <li data-translatable="true">• Harita ile karşılaştırma</li>
                    <li data-translatable="true">• Çoklu EBL: farklı hedefler için</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">VRM (Variable Range Marker)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Değişken menzil halkası. İstenen mesafeye ayarlanabilir.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• Hedef mesafesini ölçme</li>
                    <li data-translatable="true">• Güvenlik mesafesi kontrolü</li>
                    <li data-translatable="true">• CPA tahmini</li>
                    <li data-translatable="true">• Çoklu VRM: farklı mesafeler için</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">ARPA (Automatic Radar Plotting Aid)</h3>
              <p className="text-xs mb-3" data-translatable="true">
                ARPA, hedefleri otomatik olarak izler, hızlarını ve rotalarını hesaplar, çarpışma riskini değerlendirir.
              </p>

              <div className="space-y-3">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Hedef Edinme (Target Acquisition)</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Manuel:</strong> Ekranda hedefe tıkla, ARPA takip başlat</li>
                    <li data-translatable="true">• <strong>Otomatik:</strong> Belirli CPA/TCPA sınırlarındaki hedefler otomatik edinilir</li>
                    <li data-translatable="true">• <strong>Acquisition Time:</strong> 1-3 dakika (hedef hız/rota hesabı için)</li>
                    <li data-translatable="true">• <strong>Lost Target:</strong> 3+ missed scan → hedef kaybedildi alarmı</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">ARPA Vektörleri</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Hedeflerin hareket yönü ve hızı vektörlerle gösterilir.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>True Vector:</strong> Gerçek rota ve hız (gerçek hareket yönü)</li>
                    <li data-translatable="true">• <strong>Relative Vector:</strong> Gemiye göre göreceli hareket</li>
                    <li data-translatable="true">• <strong>Vector Length:</strong> Belirli süredeki hareket mesafesi (ör. 6 dakika)</li>
                    <li data-translatable="true">• <strong>Vector Time:</strong> 3, 6, 12, 30 dakika seçilebilir</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">CPA/TCPA Alarmları</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>CPA:</strong> Closest Point of Approach (en yakın geçiş mesafesi)</li>
                    <li data-translatable="true">• <strong>TCPA:</strong> Time to CPA (en yakın geçişe kalan süre)</li>
                    <li data-translatable="true">• <strong>Tipik Limitler:</strong> CPA {'<'} 1 nm, TCPA {'<'} 12 dakika</li>
                    <li data-translatable="true">• <strong>Guard Zone:</strong> Belirlenen alan içine giren hedefler alarm verir</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Trial Maneuver</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Rota veya hız değişikliğinin etkisini önceden simüle etme.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• Yeni rota/hız gir → ARPA yeni CPA/TCPA hesaplar</li>
                    <li data-translatable="true">• Manevra öncesi güvenliği değerlendir</li>
                    <li data-translatable="true">• COLREG ile uyumlu manevra seç</li>
                    <li data-translatable="true">• ⚠️ Simülasyon: Gerçek manevra değil!</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">Radar Performans Kontrolü</h3>
              <div className="bg-accent/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" data-translatable="true">Günlük Kontroller</h4>
                <ul className="text-xs space-y-1">
                  <li data-translatable="true">• <strong>Performance Monitor:</strong> Gönderici gücü, gürültü seviyesi kontrolü</li>
                  <li data-translatable="true">• <strong>Test Target:</strong> Sistemin çalışır durumda olduğunu doğrula</li>
                  <li data-translatable="true">• <strong>Bearing Accuracy:</strong> Bilinen hedeflerle kerteriz doğruluğu testi</li>
                  <li data-translatable="true">• <strong>Range Accuracy:</strong> Bilinen mesafelerle menzil doğruluğu testi</li>
                  <li data-translatable="true">• <strong>Blind Sectors:</strong> Direk, baca gibi engellerden kaynaklanan kör sektörler</li>
                </ul>
              </div>
            </div>

            <figure className="bg-muted/20 rounded p-3">
              <img
                className="w-full h-auto rounded"
                alt="Radar ekranı diyagramı"
                src="/src/assets/navigation/radar-display.svg"
                loading="lazy"
              />
              <figcaption className="text-xs text-muted-foreground mt-1">
                Radar Ekranı Diyagramı - EBL, VRM, Hedefler ve Menzil Halkaları
              </figcaption>
            </figure>

            <div className="bg-muted/20 rounded p-3">
              <p className="font-semibold mb-2" data-translatable="true">Çözümlü Örnek (CPA/TCPA Hesaplama)</p>
              <pre className="font-mono text-[10px] leading-5 overflow-x-auto">{`Senaryo:
- Hedef başlangıç pozisyonu: R₀ = 5 nm @ 045° (sancak pruva)
- Hedef hız ve rota: Vₜ = 15 kn @ 270° (batıya gidiyor)
- Own ship: Vₒ = 12 kn @ 000° (kuzeye gidiyor)

Çözüm (Kartezyen koordinatlar):
1. Pozisyon: R0x = 5·sin(45°) = 3.54 nm, R0y = 5·cos(45°) = 3.54 nm
2. Hedef hız: Vtx = 15·sin(270°) = -15 kn, Vty = 15·cos(270°) = 0 kn
3. Own ship hız: Vox = 0 kn, Voy = 12 kn
4. Relative hız: Vrx = -15 - 0 = -15 kn, Vry = 0 - 12 = -12 kn
5. TCPA = -(R₀·Vr) / |Vr|² = -((3.54·-15 + 3.54·-12) / 369) ≈ 0.26 saat ≈ 15.6 dakika
6. CPA = |R₀ + Vr·TCPA| ≈ 1.9 nm

Sonuç: 15.6 dakika sonra hedef 1.9 nm mesafeden geçecek.
Action: CPA > 1 nm ve açık deniz → Güvenli, rotaya devam`}</pre>
            </div>

            <div className="bg-card border border-warning p-4 rounded-lg">
              <h4 className="font-semibold text-warning mb-2" data-translatable="true">⚠️ Radar Kısıtlamaları ve Dikkat Edilecekler</h4>
              <ul className="text-xs space-y-1">
                <li data-translatable="true">• Radar COLREG yerine geçmez - visual lookout şarttır</li>
                <li data-translatable="true">• Küçük hedefler (yelkenli, fiberglass) zayıf echo verir</li>
                <li data-translatable="true">• Kötü hava (yağmur, dalga) tespiti zorlaştırır</li>
                <li data-translatable="true">• Shadow sektörler (kör noktalar) kontrol edilmeli</li>
                <li data-translatable="true">• ARPA verisi 1-3 dakika gecikmeli - ani manevralar yanıltabilir</li>
                <li data-translatable="true">• Over-reliance riski: Radar + AIS + visual kombinasyonu kullan</li>
              </ul>
            </div>
          </CardContent>
          )}
        </Card>

        {/* AIS */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('ais')} className="cursor-pointer" aria-expanded={isOpen('ais')}>
            <CardTitle id="ais" className="scroll-mt-24 flex items-center justify-between">
              AIS (Automatic Identification System)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('ais') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('ais') && (
          <CardContent className="space-y-6 text-sm">
            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">AIS Nedir?</h3>
              <p className="text-xs mb-3" data-translatable="true">
                AIS (Automatic Identification System), gemiler arasında otomatik olarak kimlik, pozisyon, rota, hız ve diğer bilgileri paylaşan VHF tabanlı bir iletişim sistemidir. 
                SOLAS zorunluluğu kapsamında 300 GT üzeri tüm gemiler ve tüm yolcu gemilerinde bulunması şarttır.
              </p>

              <div className="bg-accent/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" data-translatable="true">AIS Sınıfları</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-primary mb-1">Class A (Ticari Gemiler)</p>
                    <ul className="space-y-1 text-xs">
                      <li data-translatable="true">• SOLAS gemilerinde zorunlu</li>
                      <li data-translatable="true">• 12W gönderici gücü (uzun menzil)</li>
                      <li data-translatable="true">• 2-10 saniye güncelleme aralığı</li>
                      <li data-translatable="true">• Tam veri seti (static, dynamic, voyage)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-primary mb-1">Class B (Küçük Tekneler)</p>
                    <ul className="space-y-1 text-xs">
                      <li data-translatable="true">• Ticari olmayan gemiler için</li>
                      <li data-translatable="true">• 2W gönderici gücü (kısa menzil)</li>
                      <li data-translatable="true">• 30 saniye güncelleme</li>
                      <li data-translatable="true">• Sınırlı veri (position, ID)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">AIS Mesaj Tipleri</h3>
              <div className="space-y-3">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Static Data (Statik Veri)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Gemiyle ilgili sabit bilgiler. Programlama sırasında girilir, nadiren değişir.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>MMSI:</strong> Maritime Mobile Service Identity (9 haneli benzersiz numara)</li>
                    <li data-translatable="true">• <strong>IMO Number:</strong> Gemi kayıt numarası</li>
                    <li data-translatable="true">• <strong>Call Sign:</strong> Telsiz çağrı işareti</li>
                    <li data-translatable="true">• <strong>Ship Name:</strong> Gemi ismi (20 karakter)</li>
                    <li data-translatable="true">• <strong>Ship Type:</strong> Gemi tipi kodu (tanker, cargo, passenger, vb.)</li>
                    <li data-translatable="true">• <strong>Dimensions:</strong> Boyutlar (boy, genişlik, GPS anteni pozisyonu)</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Dynamic Data (Dinamik Veri)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Geminin anlık durumu. GPS ve sensörlerden otomatik olarak alınır.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Position:</strong> Enlem/Boylam (GPS'ten)</li>
                    <li data-translatable="true">• <strong>COG:</strong> Course Over Ground (gerçek rota)</li>
                    <li data-translatable="true">• <strong>SOG:</strong> Speed Over Ground (gerçek hız)</li>
                    <li data-translatable="true">• <strong>Heading:</strong> Baş yönü (gyro compass'tan)</li>
                    <li data-translatable="true">• <strong>ROT:</strong> Rate of Turn (dönüş hızı, °/dakika)</li>
                    <li data-translatable="true">• <strong>Navigation Status:</strong> Under way, At anchor, Moored, vb.</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Voyage Data (Sefer Verisi)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Mevcut sefer bilgileri. Kalkış öncesi veya sefer sırasında manuel girilir.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Destination:</strong> Varış limanı (max 20 karakter)</li>
                    <li data-translatable="true">• <strong>ETA:</strong> Estimated Time of Arrival (UTC)</li>
                    <li data-translatable="true">• <strong>Draft:</strong> Maksimum draft (su çekimi, metre)</li>
                    <li data-translatable="true">• <strong>Cargo Type:</strong> Yük tipi (DG = Dangerous Goods varsa belirtilir)</li>
                    <li data-translatable="true">• <strong>Persons on Board:</strong> Gemideki kişi sayısı</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">AIS Kullanımı ve Yorumlama</h3>
              <div className="space-y-3">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Hedef Yönetimi</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Active Targets:</strong> Hareket halinde, sürekli güncellenen hedefler</li>
                    <li data-translatable="true">• <strong>Sleeping Targets:</strong> Demir/rıhtımdaki statik hedefler (güncelleme yavaş)</li>
                    <li data-translatable="true">• <strong>Lost Targets:</strong> 3+ dakika veri gelmemişse (menzil dışı veya cihaz arızası)</li>
                    <li data-translatable="true">• <strong>Selected Target:</strong> Detaylı bilgi görüntüleme için seçilen hedef</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">CPA/TCPA Alarmları</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    AIS otomatik olarak CPA/TCPA hesaplar ve alarm verir.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• Tipik limitler: CPA {'<'} 1 nm, TCPA {'<'} 12-20 dakika</li>
                    <li data-translatable="true">• Limitleri traffic density'ye göre ayarla</li>
                    <li data-translatable="true">• AIS + ARPA karşılaştırması: Hedefler eşleşmeli</li>
                    <li data-translatable="true">• ⚠️ Eğer eşleşmiyorsa: AIS olmayan hedef var demektir!</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">ECDIS/Radar Entegrasyonu</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• AIS hedefleri ECDIS haritası üzerinde gösterilir</li>
                    <li data-translatable="true">• Radar echo ile AIS hedefi korelasyonu kontrol edilir</li>
                    <li data-translatable="true">• Vector display: True motion gösterimi</li>
                    <li data-translatable="true">• Predicted track: Gelecekteki pozisyon tahmini</li>
                    <li data-translatable="true">• Tıkla → Gemi detayları (name, destination, ETA, vb.)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">GPS/GNSS Sistemleri</h3>
              <p className="text-xs mb-3" data-translatable="true">
                Modern gemilerde GPS (ABD), GLONASS (Rusya), Galileo (AB), BeiDou (Çin) sistemlerini birlikte kullanan multi-GNSS alıcılar bulunur.
              </p>

              <figure className="bg-muted/20 rounded p-3 mb-4">
                <img
                  className="w-full h-auto rounded"
                  alt="GPS uydu konumlandırması"
                  src="/src/assets/navigation/gps-satellites.svg"
                  loading="lazy"
                />
                <figcaption className="text-xs text-muted-foreground mt-1">
                  GPS Uydu Konumlandırması - En az 4 uydu ile 3D pozisyon belirlenir
                </figcaption>
              </figure>

              <div className="space-y-3">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Doğruluk Faktörleri</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>HDOP:</strong> Horizontal Dilution of Precision (yatay doğruluk bozulması)</li>
                    <li data-translatable="true">• <strong>PDOP:</strong> Position Dilution of Precision (3D pozisyon doğruluğu)</li>
                    <li data-translatable="true">• <strong>GDOP:</strong> Geometric DOP (uydu geometrisi etkisi)</li>
                    <li data-translatable="true">• <strong>İyi değer:</strong> DOP {'<'} 2 (excellent), DOP 2-5 (good)</li>
                    <li data-translatable="true">• <strong>Kötü değer:</strong> DOP {'>'} 10 (poor) → Pozisyon güvenilmez</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">RAIM (Receiver Autonomous Integrity Monitoring)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    GPS alıcısı, aldığı sinyalleri kendi içinde kontrol eder ve hatalı uydu sinyallerini tespit eder.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• En az 5 uydu gerekir (4 pozisyon + 1 kontrol)</li>
                    <li data-translatable="true">• Hatalı uydu tespit edilirse alarm verir</li>
                    <li data-translatable="true">• FDE (Fault Detection and Exclusion): Hatalı uyduyu çıkarır</li>
                    <li data-translatable="true">• ⚠️ RAIM unavailable → GPS güvenilmez, backup kullan</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">DGPS (Differential GPS)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Bilinen sabit bir istasyondan düzeltme sinyalleri alınarak GPS doğruluğu artırılır.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• Standart GPS doğruluğu: ±10-15 metre</li>
                    <li data-translatable="true">• DGPS doğruluğu: ±1-3 metre</li>
                    <li data-translatable="true">• SBAS (WAAS, EGNOS, MSAS): Uydu tabanlı augmentation</li>
                    <li data-translatable="true">• Coast stations: Kıyı istasyonları MF band üzerinden düzeltme yayınlar</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">GPS Hataları ve Etkiler</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Ionospheric delay:</strong> İyonosfer gecikmesi (gece/gündüz değişir)</li>
                    <li data-translatable="true">• <strong>Tropospheric delay:</strong> Troposfer gecikmesi (nem, basınç etkisi)</li>
                    <li data-translatable="true">• <strong>Multipath error:</strong> Sinyalin yansıması (yapılar, geminin üst yapısı)</li>
                    <li data-translatable="true">• <strong>Jamming:</strong> Sinyal bozucu cihazlar (savaş/güvenlik bölgelerinde)</li>
                    <li data-translatable="true">• <strong>Spoofing:</strong> Sahte GPS sinyali gönderme (yanlış pozisyon gösterme)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border border-warning p-4 rounded-lg">
              <h4 className="font-semibold text-warning mb-2" data-translatable="true">⚠️ AIS Kısıtlamaları</h4>
              <ul className="text-xs space-y-1">
                <li data-translatable="true">• AIS COLREG sorumlulukları ortadan kaldırmaz - visual lookout zorunludur</li>
                <li data-translatable="true">• Menzil: VHF range (~20-30 nm) - radar menzilinden kısa olabilir</li>
                <li data-translatable="true">• AIS olmayan hedefler: Küçük tekneler, yelkenliler, askeri gemiler görünmez</li>
                <li data-translatable="true">• Data accuracy: Yanlış girilmiş voyage data (destination, draft, vb.)</li>
                <li data-translatable="true">• Spoofing riski: Özellikle hassas bölgelerde sahte AIS sinyalleri</li>
                <li data-translatable="true">• Target overload: Yoğun trafikte ekran karmaşık, critical targets kaybolabilir</li>
                <li data-translatable="true">• Cihaz arızası: Hedefin AIS cihazı çalışmıyor olabilir</li>
                <li data-translatable="true">• <strong>Altın kural:</strong> AIS + Radar + Visual lookout kombinasyonu kullan!</li>
              </ul>
            </div>
          </CardContent>
          )}
        </Card>

        {/* ECDIS */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('ecdis')} className="cursor-pointer" aria-expanded={isOpen('ecdis')}>
            <CardTitle id="ecdis" className="scroll-mt-24 flex items-center justify-between">
              ECDIS (Electronic Chart Display and Information System)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('ecdis') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('ecdis') && (
          <CardContent className="space-y-6 text-sm">
            {/* ECDIS Gerçek Görsel */}
            <div className="mb-6">
              <img 
                src="/navigation/bridge/ecdis-screen.jpg" 
                alt="ECDIS elektronik harita sistemi" 
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center" data-translatable="true">
                ECDIS Ekranı: Elektronik harita, rota planlama ve navigasyon bilgileri
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">ECDIS Nedir?</h3>
              <p className="text-xs mb-3" data-translatable="true">
                ECDIS (Electronic Chart Display and Information System), kağıt haritaların yerini alabilen, 
                SOLAS onaylı elektronik harita sistemidir. 2012'den itibaren yeni gemilerde, 2018'e kadar mevcut 
                gemilerde kademeli olarak zorunlu hale gelmiştir.
              </p>

              <div className="bg-accent/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" data-translatable="true">ECDIS vs ECS Farkı</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-primary mb-1">ECDIS (Full System)</p>
                    <ul className="space-y-1 text-xs">
                      <li data-translatable="true">• IMO/IHO standartlarına uygun</li>
                      <li data-translatable="true">• ENC (resmi harita) kullanır</li>
                      <li data-translatable="true">• Kağıt harita yerine geçer</li>
                      <li data-translatable="true">• Type approval gerekir</li>
                      <li data-translatable="true">• Backup sistemi zorunlu</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-primary mb-1">ECS (Chart System)</p>
                    <ul className="space-y-1 text-xs">
                      <li data-translatable="true">• Standartlara tam uyumlu değil</li>
                      <li data-translatable="true">• RNC veya özel haritalar kullanabilir</li>
                      <li data-translatable="true">• Kağıt harita yerine GEÇMEZ</li>
                      <li data-translatable="true">• Planlama/yardımcı araç</li>
                      <li data-translatable="true">• Küçük tekneler için</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">ENC (Electronic Navigational Chart) Yapısı</h3>
              <div className="space-y-3">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">ENC Katmanları</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    ENC verisi vektör tabanlıdır (raster değil). Nesneler katmanlar halinde organize edilir.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Base Display:</strong> Zorunlu minimum bilgiler (derinlik konturu, kara, tehlikeler)</li>
                    <li data-translatable="true">• <strong>Standard Display:</strong> Normal seyir için yeterli bilgiler (şamandıralar, fenerler)</li>
                    <li data-translatable="true">• <strong>All Other Information:</strong> Tüm detaylar (deniz altı kabloları, balıkçılık bölgeleri, vb.)</li>
                    <li data-translatable="true">• <strong>Kullanıcı seçimi:</strong> Standart Display önerilir; All Other çok kalabalık olabilir</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">SENC (System ENC)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    ECDIS, ENC dosyalarını kendi formatına (SENC) çevirir ve kullanır.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• ENC: Orijinal harita verisi (IHO S-57 standardı)</li>
                    <li data-translatable="true">• SENC: ECDIS'in kullandığı işlenmiş veri</li>
                    <li data-translatable="true">• ENC güncellemesi → SENC otomatik yenilenir</li>
                    <li data-translatable="true">• SENC corrupt olursa → ENC'den yeniden oluşturulur</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">ENC Updates</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>New Edition:</strong> Haritanın tamamen yeni versiyonu (major changes)</li>
                    <li data-translatable="true">• <strong>Update:</strong> Mevcut harita üzerine düzeltmeler (weekly/monthly)</li>
                    <li data-translatable="true">• <strong>T&P NM (Temporary & Preliminary):</strong> Geçici değişiklikler (wreck, construction)</li>
                    <li data-translatable="true">• <strong>Permit:</strong> Harita lisans süresi (genellikle 1 yıl)</li>
                    <li data-translatable="true">• ⚠️ Update kontrolü: Haftalık yapılmalı, otomatik sistem önerilir</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">CATZOC (Category of Zone of Confidence)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Harita verisinin doğruluk ve güvenilirlik derecesini gösterir.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>A1:</strong> En yüksek doğruluk (± 5m pozisyon, ± 0.5m derinlik)</li>
                    <li data-translatable="true">• <strong>A2/B:</strong> İyi doğruluk (± 20-50m)</li>
                    <li data-translatable="true">• <strong>C:</strong> Orta doğruluk (± 500m)</li>
                    <li data-translatable="true">• <strong>D:</strong> Düşük doğruluk (± {'>'} 500m)</li>
                    <li data-translatable="true">• <strong>U:</strong> Unassessed (değerlendirilmemiş) - en az güvenilir</li>
                    <li data-translatable="true">• ⚠️ CATZOC C/D/U bölgelerde ekstra dikkat! Harita eski/güvenilmez olabilir</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">SCAMIN (Scale Minimum)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Haritadaki nesnelerin hangi zoom seviyesinde görüneceğini belirler.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• Zoom out yapınca detaylar kaybolur (ekran kalabalık olmasın diye)</li>
                    <li data-translatable="true">• Kritik objeler (kayalıklar, wreck) daha erken görünür</li>
                    <li data-translatable="true">• ⚠️ Over-zoom uyarısı: Harita detayı yetersiz, daha büyük scale harita gerekli</li>
                    <li data-translatable="true">• Under-scale uyarısı: Çok fazla detay, ekran kalabalık</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">Safety Settings (Güvenlik Ayarları)</h3>
              <div className="space-y-3">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Safety Depth (Güvenlik Derinliği)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Geminin draft'ına göre minimum güvenli derinlik. Bu değerden sığ alanlar vurgulanır.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• Hesaplama: Safety Depth = Draft + UKC margin + Squat + Waves</li>
                    <li data-translatable="true">• Örnek: Draft 10m, UKC 2m, Squat 0.5m → Safety Depth = 12.5m</li>
                    <li data-translatable="true">• Safety depth'ten sığ yerler kırmızı/orange ile gösterilir</li>
                    <li data-translatable="true">• ⚠️ Dikkat: Gelgit değişince safety depth değişmez, UKC değişir!</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Safety Contour (Güvenlik Konturu)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Haritada vurgulanan kritik derinlik çizgisi. Geminin bu çizginin derin tarafında kalması gerekir.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• Tipik değerler: Safety depth'e en yakın kontur (örn. 15m, 20m, 30m)</li>
                    <li data-translatable="true">• ECDIS otomatik seçer: Safety depth = 12.5m → Safety contour = 15m</li>
                    <li data-translatable="true">• Manuel ayarlanabilir (daha conservative seçilebilir)</li>
                    <li data-translatable="true">• Isolated danger sembolü: Safety contour içinde kalan tehlikeler</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Shallow Contour & Deep Contour</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Shallow Contour:</strong> Sığ suları ayıran çizgi (örn. 5m)</li>
                    <li data-translatable="true">• <strong>Deep Contour:</strong> Derin suları ayıran çizgi (örn. 30m)</li>
                    <li data-translatable="true">• Shallow-Safety-Deep contour sıralaması ile renkler değişir</li>
                    <li data-translatable="true">• Shallow: Kırmızı/Turuncu, Safety arası: Mavi, Deep: Koyu mavi</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">Route Planning ve Execution</h3>
              <div className="space-y-3">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Route Planning Adımları</h4>
                  <ol className="text-xs space-y-1 ml-4 list-decimal">
                    <li data-translatable="true"><strong>Waypoint Ekleme:</strong> Başlangıç/varış ve dönüş noktalarını işaretle</li>
                    <li data-translatable="true"><strong>Route Check:</strong> ECDIS otomatik güvenlik kontrolü yapar</li>
                    <li data-translatable="true"><strong>XTD (Cross Track Distance):</strong> Rota kenarına tolerans mesafesi (örn. 0.2 nm)</li>
                    <li data-translatable="true"><strong>Turn Radius:</strong> Waypoint'te dönüş yarıçapı (wheel over point)</li>
                    <li data-translatable="true"><strong>Safety Corridor:</strong> XTD ile oluşan rota koridoru</li>
                    <li data-translatable="true"><strong>Route Activation:</strong> Rotayı aktive et, monitoring başlat</li>
                  </ol>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Route Check (Otomatik Kontroller)</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Anti-grounding:</strong> Rota safety contour'u geçiyor mu?</li>
                    <li data-translatable="true">• <strong>Isolated dangers:</strong> Rota koridoru içinde tehlike var mı?</li>
                    <li data-translatable="true">• <strong>Navigation aids:</strong> Şamandıra, fener geçişleri</li>
                    <li data-translatable="true">• <strong>Restricted areas:</strong> TSS, yasak bölgeler, askeri alanlar</li>
                    <li data-translatable="true">• <strong>Overhead cables:</strong> Geminin yüksekliği köprü clearance'ından fazla mı?</li>
                    <li data-translatable="true">• ⚠️ Route check FAILED → Rotayı düzelt, tekrar kontrol et</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Wheel Over Point (WOP)</h4>
                  <p className="text-xs mb-2" data-translatable="true">
                    Waypoint'e yaklaşırken dönüşe başlama noktası. Turn radius'a bağlıdır.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• WOP = Waypoint'ten turn radius kadar önce</li>
                    <li data-translatable="true">• Turn radius ayarı: Geminin dönüş özelliklerine göre</li>
                    <li data-translatable="true">• Autopilot mod: Nav mode WOP'ta otomatik döner</li>
                    <li data-translatable="true">• ⚠️ Manuel mod: WOP'ta kendin dümene başla!</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">ECDIS Alarmları</h3>
              <div className="space-y-3">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Kritik Alarmlar</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>Anti-grounding alarm:</strong> Gemi safety contour'a yaklaşıyor</li>
                    <li data-translatable="true">• <strong>Deviation alarm:</strong> Rota koridorundan (XTD) çıkılmış</li>
                    <li data-translatable="true">• <strong>Approach to waypoint:</strong> Waypoint'e X nm kaldı (örn. 0.5 nm)</li>
                    <li data-translatable="true">• <strong>Passing waypoint:</strong> Waypoint geçildi, sonraki leg'e geçiliyor</li>
                    <li data-translatable="true">• <strong>Route crossing:</strong> Başka bir rota/trafik ile kesişme</li>
                    <li data-translatable="true">• <strong>Anchor watch alarm:</strong> Demir taşıyor (anchor drag)</li>
                  </ul>
                </div>

                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2" data-translatable="true">Sistem Alarmları</h4>
                  <ul className="text-xs space-y-1">
                    <li data-translatable="true">• <strong>GPS failure:</strong> Pozisyon kaynağı kayboldu</li>
                    <li data-translatable="true">• <strong>Gyro failure:</strong> Heading bilgisi alınamıyor</li>
                    <li data-translatable="true">• <strong>ENC not available:</strong> O bölgede ENC yok (kağıt harita kullan!)</li>
                    <li data-translatable="true">• <strong>Out of date ENC:</strong> Harita güncel değil (update gerekli)</li>
                    <li data-translatable="true">• <strong>System malfunction:</strong> ECDIS arızalı (backup sisteme geç)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" data-translatable="true">Backup Sistemleri</h3>
              <div className="bg-accent/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" data-translatable="true">ECDIS Backup Gereksinimleri (SOLAS)</h4>
                <p className="text-xs mb-2" data-translatable="true">
                  ECDIS kullanımı durumunda backup sistemi zorunludur. Üç seçenek:
                </p>
                <ul className="text-xs space-y-1">
                  <li data-translatable="true">• <strong>Option 1:</strong> İkinci bağımsız ECDIS sistemi (ayrı GPS, sensörler)</li>
                  <li data-translatable="true">• <strong>Option 2:</strong> ECDIS + Güncel kağıt haritalar (planned route için)</li>
                  <li data-translatable="true">• <strong>Option 3:</strong> ECDIS + Appropriate folio of paper charts</li>
                  <li data-translatable="true">• <strong>ENC Backup:</strong> Tüm ENC'lerin kopyası (USB, harddisk) gemide bulunmalı</li>
                  <li data-translatable="true">• ⚠️ ECDIS fail → Hemen backup sisteme geç, prosedür uygula</li>
                </ul>
              </div>
            </div>

            <figure className="bg-muted/20 rounded p-3">
              <img
                className="w-full h-auto rounded"
                alt="ECDIS ekranı diyagramı"
                src="/src/assets/navigation/ecdis-display.svg"
                loading="lazy"
              />
              <figcaption className="text-xs text-muted-foreground mt-1">
                ECDIS Ekranı Diyagramı - Rota, Waypoint, Safety Contour ve Derinlik Bilgileri
              </figcaption>
            </figure>

            <div className="bg-card border border-warning p-4 rounded-lg">
              <h4 className="font-semibold text-warning mb-2" data-translatable="true">⚠️ ECDIS Kullanımında Dikkat Edilecekler</h4>
              <ul className="text-xs space-y-1">
                <li data-translatable="true">• ECDIS navigasyon sorumluluğunu ortadan kaldırmaz - OOW dikkatli olmalı</li>
                <li data-translatable="true">• Safety settings'i her sefer başında kontrol et (draft değişir!)</li>
                <li data-translatable="true">• ENC güncellemelerini düzenli kontrol et (out of date = tehlikeli)</li>
                <li data-translatable="true">• CATZOC C/D/U bölgelerde ekstra lookout - harita güvenilmez olabilir</li>
                <li data-translatable="true">• Route check PASSED olsa bile, visual kontrol yap (hata olabilir)</li>
                <li data-translatable="true">• Alarm overload: Gereksiz alarmları kapat ama kritik alarmları ASLA susturma</li>
                <li data-translatable="true">• Over-reliance (aşırı güven): ECDIS + Radar + AIS + Visual kombinasyonu kullan</li>
                <li data-translatable="true">• Training: Generic ECDIS + Specific type training SOLAS zorunluluğu</li>
              </ul>
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
              <p><strong>BRM (Bridge Resource Management) Tanımı:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Köprüüstündeki tüm kaynakların (insan, ekipman, prosedür, bilgi) etkili ve güvenli kullanımı için yönetim sistemi.</li>
                <li><strong>Amaç:</strong> İnsan hatası azaltma; ekip çalışması optimizasyonu; güvenli seyir ve karar verme.</li>
                <li><strong>Kaynak:</strong> IMO Model Courses 1.22 (Proficiency in Bridge Resource Management); STCW Regulation II/1, II/2.</li>
              </ul>
              
              <p><strong>BRM Temel Prensipleri:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Situational Awareness (Durum Farkındalığı):</strong> Mevcut durumu anlama; gelişmeleri öngörme; değişiklikleri tespit etme.</li>
                <li><strong>Teamwork (Ekip Çalışması):</strong> Açık roller ve sorumluluklar; işbirliği ve destek; kolektif karar verme.</li>
                <li><strong>Communication (İletişim):</strong> Net, açık, zamanlı bilgi paylaşımı; closed-loop communication; challenge and response.</li>
                <li><strong>Decision Making:</strong> Bilgi toplama; alternatifleri değerlendirme; zamanında ve uygun karar; risk yönetimi.</li>
                <li><strong>Leadership:</strong> Master/OOW liderliği; otorite ve sorumluluk dengesi; ekibi motive etme.</li>
              </ul>
              
              <p><strong>Rol ve Sorumluluklar:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Master (Kaptan):</strong> Nihai sorumluluk; passage plan onayı; kritik kararlar; ekip denetimi; BRM kültürü oluşturma.</li>
                <li><strong>OOW (Officer of Watch - Vardiya Zabitı):</strong> Watch keeping; seyir güvenliği; alarm/sapma tespiti; Master'ı bilgilendirme.</li>
                <li><strong>Lookout:</strong> Görsel ve işitsel izleme; tehlike/hedef raporlama; sürekli dikkat.</li>
                <li><strong>Helmsman (Dümenci):</strong> Dümen kontrolü; rota/heading takibi; komutları tekrarlama ve uygulama.</li>
                <li><strong>Pilot (Kılavuz Kaptan):</strong> Yerel bilgi; tavsiye ve rehberlik; Master ile koordinasyon; Master-Pilot Information Exchange.</li>
              </ul>
              
              <p><strong>Closed-Loop Communication:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Komut/bilgi verme → Tekrarlama → Onay → Uygulama → Rapor döngüsü.</li>
                <li><strong>Örnek:</strong> OOW: "Steer 045°" → Helmsman: "Steer 045°, aye sir" → OOW: "Yes" → Helmsman uygular → Helmsman: "Steady on 045°" → OOW: "Very well".</li>
                <li><strong>Amaç:</strong> Yanlış anlamayı önleme; komut doğruluğunu teyit etme; accountability sağlama.</li>
                <li><strong>Kritik Durumlar:</strong> Course changes, speed alterations, engine orders, critical maneuvers.</li>
              </ul>
              
              <p><strong>Challenge and Response:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Alt rütbeli ekip üyesinin, hatalı veya tehlikeli gördüğü durumu sorgulaması ve dile getirmesi.</li>
                <li><strong>Önem:</strong> İnsan hatası azaltma; farklı bakış açıları; güvenlik kültürü.</li>
                <li><strong>Yöntem:</strong> Saygılı ama net ifade; alternatif önerme; sebep açıklama.</li>
                <li><strong>Örnek:</strong> 3rd Officer: "Sir, I observe target on port bow, CPA less than 0.5nm, should we alter course?" → OOW değerlendirir ve cevaplar.</li>
                <li><strong>Kültür:</strong> Challengeları teşvik etme; hatalar kabul edilebilir ortam; öğrenme kültürü.</li>
              </ul>
              
              <p><strong>Fatigue Management (Yorgunluk Yönetimi):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tanım:</strong> Uzun vardiyalar, uyku eksikliği, circadian rhythm bozulması kaynaklı performans düşüşü.</li>
                <li><strong>Etkiler:</strong> Yavaş tepki, dikkat eksikliği, kötü karar verme, hata artışı.</li>
                <li><strong>ISM Code & MLC:</strong> Rest hour requirements (min 10h/24h, min 77h/7 days); rest hour kayıt zorunluluğu.</li>
                <li><strong>Önlemler:</strong> Vardiya planlaması (2x4, 3x8 sistemleri); critical operation öncesi dinlenme; yeterli personel; fatigue signs izleme.</li>
                <li><strong>Self-Awareness:</strong> Ekip üyeleri kendi yorgunluklarını rapor etmeli; Master uygun önlem almalı.</li>
              </ul>
              
              <p><strong>Olay Örnekleri ve Dersler:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Costa Concordia (2012):</strong> Durum farkındalığı kaybı; yetersiz passage planning; challenge eksikliği; sonuç: 32 ölü.</li>
                <li><strong>Lesson:</strong> Passage plan'a uymak; tehlikeli manevralardan kaçınmak; ekip görüşlerini dinlemek.</li>
                <li><strong>Herald of Free Enterprise (1987):</strong> İletişim kopukluğu; rol belirsizliği; kontrol eksikliği; sonuç: 193 ölü.</li>
                <li><strong>Lesson:</strong> Net prosedürler; checklist kullanımı; ekip briefing; sorumluluk netliği.</li>
                <li><strong>Exxon Valdez (1989):</strong> Fatigue; tek kişiye bağımlılık; yetersiz gözetim; sonuç: büyük çevre felaketi.</li>
                <li><strong>Lesson:</strong> Fatigue management; backup sistemler; Master involvement kritik durumlarda.</li>
              </ul>
              
              <p><strong>İyi BRM Uygulamaları:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Düzenli ekip toplantıları ve briefing; passage plan review.</li>
                <li>Checklist kullanımı (departure, arrival, heavy weather, emergency).</li>
                <li>Simülasyon ve drilllerle ekip antrenmanı.</li>
                <li>Açık kapı politikası; challengeları teşvik; hatalardan öğrenme.</li>
                <li>Master'ı bilgilendirme kriterleri net tanımlı (COLREG, company SMS).</li>
                <li>Fatigue monitoring ve rest hour compliance.</li>
              </ul>
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
              <figure className="bg-muted/20 rounded p-3">
                <img
                  className="w-full h-auto rounded"
                  alt="Gemi güvenlik ekipmanları ve acil durum prosedürleri"
                  src="/src/assets/navigation/safety-equipment.svg"
                  loading="lazy"
                />
                <figcaption className="text-[11px] text-muted-foreground mt-1">
                  Gemi Güvenlik Ekipmanları - EPIRB, Can Yeleği, İşaret Fişeği ve Diğer Acil Durum Ekipmanları
                </figcaption>
              </figure>
              
              <p><strong>İAMSAR Çerçevesi ve Roller:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>SMC (SAR Mission Coordinator):</strong> Operasyonun genel koordinasyonu; görev atamaları, arama alanlarının tanımlanması ve rapor akışının yönetimi.</li>
                <li><strong>RCC/MRCC:</strong> Kurtarma Koordinasyon Merkezi; distress alarmlarının toplanması/dağıtımı, SMC ataması ve otoritelerle bağlantı.</li>
                <li><strong>OSC (On-Scene Coordinator):</strong> Olay sahasında birimlerin (SRU) yönetimi; arama kalıbı ve güvenlik koordinasyonu.</li>
                <li><strong>SRU (Search and Rescue Unit):</strong> Sahadaki arayan/yardım eden birimler (gemi, bot, helikopter, uçak).</li>
                <li><strong>ACO (Air Coordinator):</strong> Hava unsurları arasında dikey/zemin ayırmayı ve emniyeti koordine eder.</li>
              </ul>

              <p><strong>İlk Saatte Yapılacaklar (OOW/OSC bakışı):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Alarmı Al:</strong> Zamanı, LKP (Last Known Position), kaynak (DSC/Mayday/Pan-Pan/EPIRB) ve içerik ayrıntılarını kaydet.</li>
                <li><strong>GMDSS Prosedürü:</strong> VHF DSC distress (Ch70) için kıyı istasyonu cevap verene kadar DSC onayı yapma; makul süre içinde yanıt yoksa uygun onay ve Ch16 ses teyidi.</li>
                <li><strong>MRCC/SMC Bildir:</strong> Mevcut bilgiler, kendi konumun, imkan ve kabiliyetlerini (speed, sensors, medical) ilet; görevlendirme iste.</li>
                <li><strong>DR/Datum Hesabı:</strong> LKP'den itibaren rüzgar (leeway) ve akıntı (set/drift) vektörlerini topla; zamanla çarparak datum'u ve belirsizlik yarıçapını tahmin et.</li>
                <li><strong>Emniyet:</strong> Köprüüstü ekibini briefe et; lookout tahsisi, ışık/ses/flood light hazırlığı, fall overboard riskine karşı emniyet.</li>
                <li><strong>Kayıt:</strong> Tüm haberleşme ve manevraları logbook'a dakika-dakika yaz.</li>
              </ul>

              <p><strong>Datum, Drift ve Belirsizlik:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Vektörel Yaklaşım:</strong> <em>Drift vektörü</em> = Akıntı (set/drift) + Leeway (rüzgar etkisi).</li>
                <li><strong>Leeway Yaklaşıkları:</strong> PIW (suda kişi): rüzgar hızının ≈ %2–3'ü; can salı: ≈ %3–4 (rüzgar yönüne yakın sapar).</li>
                <li><strong>Datum(t):</strong> LKP + (drift vektörü × t). Belirsizlik yarıçapı R ≈ √(σ<sub>poz</sub>² + (σ<sub>hız</sub> × t)²).</li>
                <li><strong>Güncelleme:</strong> Yeni raporlar/izler geldikçe datum ve arama alanı merkez/yarıçapı revize edilir.</li>
              </ul>

              <p><strong>Standart Arama Kalıpları (IAMSAR):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Expanding Square (SS):</strong> Datum hatası küçük (≤ 2 nm) tek SRU için uygundur.</li>
                <li><strong>Sector Search (VS):</strong> Çok küçük alanlarda (MOB/ELT pinpoint) yüksek doğruluk; 6×60° veya 12×30° sektör.</li>
                <li><strong>Parallel Track (PS):</strong> Geniş alan ve/veya birden fazla SRU; eşit aralıklı paralel şeritler.</li>
                <li><strong>Creeping Line (CS):</strong> Kıyı/baseline boyunca; tehlike hattı veya drift hattı referanslı.</li>
              </ul>

              <div className="bg-muted/20 rounded p-3">
                <p className="font-semibold mb-2">Şema: Expanding Square (SS)</p>
                <pre className="font-mono text-[11px] leading-5">{`S = 0.5 nm, start 000°
    ↑ N
   ┌─┐→→
   │ │↑↑
←← └─┘
←←←←┌─────┐
    │     │↑
    └─────┘↑↑
Bacaklar: 1S,1S,2S,2S,3S,3S ... (her iki yönde S artar)`}</pre>
              </div>

              <div className="bg-muted/20 rounded p-3">
                <p className="font-semibold mb-2">Şema: Sector Search (VS)</p>
                <pre className="font-mono text-[11px] leading-5">{`Merkez = datum, 6 bacak × 60° (veya 12 × 30°)
      ↑ N
      │\
   ←──┼─→  Her bacak aynı mesafe (R)
      │/
      ↓
Dönüşler 60°; her bacak sonunda merkezden geçilir`}</pre>
              </div>

              <div className="bg-muted/20 rounded p-3">
                <p className="font-semibold mb-2">Şema: Parallel Track (PS) / Creeping Line (CS)</p>
                <pre className="font-mono text-[11px] leading-5">{`S = track spacing
┌──────────────────────┐
│→→→→→→→→→→→→→→→→→→→→→│  PS: uzun kenara paralel gidiş-dönüş
│←←←←←←←←←←←←←←←←←←←←←│
│→→→→→→→→→→→→→→→→→→→→→│  CS: baseline'a (kısa kenar) paralel
└──────────────────────┘`}</pre>
              </div>

              <p><strong>Tarama Parametreleri ve Kapsama:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Arama Hızı:</strong> Deniz durumu ve görüşe bağlı; küçük bot/gemi için gündüz görsel 8–12 kn, gece 5–8 kn.</li>
                <li><strong>Sweep Width (W) ve Track Spacing (S):</strong> Tek arayıcı için kabaca <em>S ≈ W</em>. PIW gündüz W ≈ 0.5–1.0 nm, gece ≈ 0.2–0.4 nm; can salı W daha büyük olabilir.</li>
                <li><strong>Kapsama Faktörü (C):</strong> Artan C için S azaltılır; hava/deniz kötüleştikçe S küçült.</li>
                <li><strong>Deconfliction:</strong> Çoklu SRU'da başlangıç noktaları/başlar farklı; OSC zaman ofseti ve menzil ayrımı uygular.</li>
              </ul>

              <p><strong>Sahada Emniyet (OSC Kontrolleri):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Çakışan rotalar ve yakın geçişlere karşı ayırma (mesafe/zaman); ortak rapor noktası.</li>
                <li>Hava unsurları için irtifa blokları; gemiler için hız limitleri ve dönüş kuralları.</li>
                <li>Görüş/sis durumunda ses işaretleri, projectör ve radar gözetlemesi.</li>
                <li>Yakıt/kalış süresi izleme; geri dönüş noktası ve emniyetli ayrılma planı.</li>
              </ul>

              <p><strong>Haberleşme ve Çağrı Örnekleri:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>MAYDAY:</strong> Can/tekne tehlikede; Ch16 ses, ardından çalışma kanalına geçiş talebi.</li>
                <li><strong>PAN-PAN:</strong> Aciliyet, tehlike değil; medikal tahliye vb.</li>
                <li><strong>SÉCURITÉ:</strong> Seyir/meteoroloji emniyet duyuruları.</li>
                <li><strong>DSC:</strong> Ch70 (VHF) / 2,187.5 kHz (MF); ardından ilgili ses kanalı.</li>
              </ul>
              <div className="bg-muted/20 rounded p-3">
                <p className="font-semibold mb-2">Ses/SITREP Şablonu</p>
                <pre className="font-mono text-[11px] leading-5">{`"MAYDAY, MAYDAY, MAYDAY"
THIS IS M/V EXAMPLE, CALLSIGN TXXX, MMSI 2710XXXXXX
POSITION 36°00'N 028°00'E, PERSON OVERBOARD, 1 POB MISSING
WIND 330/20 KN, CURRENT SET 090/1.5 KN, VIS 3 NM, SEA 3
TAKING ACTION: TURNING, LAUNCHING RESCUE BOAT, OSC IF REQUIRED
REQUEST ASSISTANCE AND COORDINATION BY MRCC
OVER

SITREP (OSC→SMC): TIME, DATUM, SEARCH PATTERN/PARAMETERS (S, SPEED),
UNITS ON SCENE, WX/SEA, AREA COVERED, NEGATIVE/ POSITIVE CONTACTS,
INTENTIONS/NEXT ACTIONS, FUEL/ENDURANCE, REQUESTS.`}</pre>
              </div>

              <p><strong>Çözümlü Örnek (Drift + SS Planı):</strong></p>
              <div className="bg-muted/20 rounded p-3">
                <pre className="font-mono text-[11px] leading-5">{`LKP: 36°00.0'N 028°00.0'E @ 1200Z
Rüzgar: 330°/20 kn (blows → 150°), Nesne: PIW (k≈0.03) → Leeway ≈ 0.6 kn @150°
Akıntı: 1.5 kn @090°
Birleşik drift ≈ 1.87 kn @106° (vektörel toplam)
t = 2 h → d ≈ 3.75 nm @106°
Datum ≈ 35°59.0'N, 028°04.5'E (yaklaşık)
Arama: SS, S=0.5 nm, start 000°, ilk bacak 0.5 nm
Kapsama: Gündüz görsel W≈0.6 nm ⇒ S≈0.5–0.6 nm`}</pre>
              </div>
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
              <li>Dutton's Nautical Navigation – Coastal ve celestial yöntemler, bearing teknikleri.</li>
              <li>UKHO Admiralty List of Lights & Fog Signals (ALRS) – Fener menzilleri ve tanımları.</li>
              <li>USCG Light List – Coğrafi ve ışıklı menzil kavramları, görünürlük.</li>
              <li>IAMSAR Manual Vol. II/III – Arama kalıpları ve tarama parametreleri.</li>
              <li>NP100 Admiralty Manual of Seamanship – Pilotage ve yaklaşma teknikleri.</li>
            </ul>
            <p className="text-xs text-muted-foreground">Not: Resmi yayınların güncel baskılarını kullanın; yerel otorite duyurularını (NtM) takip edin.</p>
          </CardContent>
          )}
        </Card>

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">Sürüm: v2.2 • Formül düzeltmeleri ve kaynakça genişletmesi uygulandı.</div>
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

