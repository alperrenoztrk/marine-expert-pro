import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Anchor, Waves, Wind, LifeBuoy, Ruler, Wrench, BookOpen, ChevronDown } from "lucide-react";

export default function SeamanshipTopicsPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const isOpen = (id: string) => !!openSections[id];
  const toggle = (id: string) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  const open = (id: string) => setOpenSections(prev => (prev[id] ? prev : { ...prev, [id]: true }));

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.slice(1);
      if (id) open(id);
    }
  }, []);

  const toc = [
    { id: "terminology", title: "Temel Kavramlar ve Terminoloji", icon: BookOpen },
    { id: "ship-types", title: "Gemi Tipleri ve Yapısı", icon: Anchor },
    { id: "rope-work", title: "Halat İşleri ve Düğümler", icon: Waves },
    { id: "anchoring", title: "Demirleme ve Şamandıra", icon: Anchor },
    { id: "mooring", title: "Yanaşma-Ayrılma Manevraları", icon: Waves },
    { id: "steering", title: "Dümen ve Manevra", icon: Wrench },
    { id: "heavy-weather", title: "Ağır Hava Gemiciliği", icon: Wind },
    { id: "navigation", title: "Seyir Temelleri", icon: BookOpen },
    { id: "compass", title: "Pusulalar ve Sapmalar", icon: Ruler },
    { id: "tides", title: "Akıntılar ve Gelgitler", icon: Waves },
    { id: "iala", title: "IALA Seyir Yardımcıları", icon: LifeBuoy },
    { id: "colreg", title: "COLREG Kuralları", icon: BookOpen },
    { id: "communication", title: "Haberleşme Sistemleri", icon: Waves },
    { id: "radar", title: "Radar, ARPA ve ECDIS", icon: Ruler },
    { id: "watchkeeping", title: "Vardiya Usulleri ve BRM", icon: Wrench },
    { id: "safety", title: "Emniyet Yönetimi", icon: LifeBuoy },
    { id: "lifesaving", title: "Can Kurtarma", icon: LifeBuoy },
    { id: "firefighting", title: "Yangınla Mücadele", icon: Wind },
    { id: "pollution", title: "Kirliliği Önleme", icon: Waves },
    { id: "stability", title: "Stabilite ve Yükleme", icon: Ruler },
    { id: "cargo", title: "Yük Operasyonları", icon: Anchor },
    { id: "deck-maintenance", title: "Güverte Bakımı", icon: Wrench },
    { id: "boat-ops", title: "Küçük Tekne Operasyonları", icon: Waves },
    { id: "sar", title: "Arama ve Kurtarma (SAR)", icon: LifeBuoy },
    { id: "human-factors", title: "İnsan Faktörleri ve İSG", icon: BookOpen },
    { id: "documentation", title: "Dokümantasyon ve Kayıtlar", icon: BookOpen },
    { id: "port-ops", title: "Liman Kuralları", icon: Anchor },
    { id: "special-nav", title: "Özel Seyrüsefer", icon: Wind },
    { id: "surveys", title: "Sörvey ve Muayeneler", icon: Ruler },
    { id: "efficiency", title: "Enerji Verimliliği", icon: Wrench },
  ];

  return (
    <MobileLayout>
      <div className="space-y-6 max-w-3xl mx-auto leading-relaxed break-words" data-no-translate>
        <div className="flex items-center justify-between">
          <Link to="/seamanship-menu">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Gemicilik
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Konu Anlatımı • v2.0
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Anchor className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">Gemicilik Konu Anlatımı</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Denizcilik kavramlarından enerji verimliliğine kadar 30 temel gemicilik konusu için kapsamlı rehber.
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

        {/* 1. Temel Kavramlar ve Terminoloji */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('terminology')} className="cursor-pointer" aria-expanded={isOpen('terminology')}>
            <CardTitle id="terminology" className="scroll-mt-24 flex items-center justify-between">
              Temel Denizcilik Kavramları ve Terminoloji
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('terminology') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('terminology') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Yönler:</strong> Pruva (baş), kıç, iskele, sancak, omurga, borda</li>
              <li><strong>Boyutlar:</strong> LOA, LBP, B (genişlik), T (draft), D (derinlik), freeboard</li>
              <li><strong>Hız ve Mesafe:</strong> Knot, deniz mili, kablo, log</li>
              <li><strong>Terimler:</strong> Amortisör, barbette, bulwark, fairlead, hawse pipe, bitts</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 2. Gemi Tipleri ve Yapısı */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('ship-types')} className="cursor-pointer" aria-expanded={isOpen('ship-types')}>
            <CardTitle id="ship-types" className="scroll-mt-24 flex items-center justify-between">
              Gemi Tipleri ve Temel Gemi Yapısı
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('ship-types') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('ship-types') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Gemi Tipleri:</strong> Tanker, konteyner, dökme yük, RoRo, kruvaziyer, balıkçı gemisi</li>
              <li><strong>Gövde Yapısı:</strong> Omurga (keel), bordalar, kaburga (frames), bulkheads</li>
              <li><strong>Güverte Teçhizatı:</strong> Vinç, ırgat, windlass, capstan, bollard, fairlead</li>
              <li><strong>Üstyapı:</strong> Köprüüstü, kamaralar, ambarcıklar, hava bacası</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 3. Halat İşleri */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('rope-work')} className="cursor-pointer" aria-expanded={isOpen('rope-work')}>
            <CardTitle id="rope-work" className="scroll-mt-24 flex items-center justify-between">
              Halat İşleri, Düğümler ve Splicing
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('rope-work') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('rope-work') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Halat Tipleri:</strong> Fiber (polyester, nylon, polypropylene), çelik halat, mixed rope</li>
              <li><strong>Düğümler:</strong> Bowline, clove hitch, sheet bend, rolling hitch, figure-eight</li>
              <li><strong>Splicing:</strong> Eye splice, back splice, short splice; wire rope splicing</li>
              <li><strong>Ekipman:</strong> Palanga (tackle), mapalar (shackle), vinç/ırgat kullanımı, güvenli yük limitleri</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 4. Demirleme */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('anchoring')} className="cursor-pointer" aria-expanded={isOpen('anchoring')}>
            <CardTitle id="anchoring" className="scroll-mt-24 flex items-center justify-between">
              Demirleme, Şamandıraya Bağlama ve Demir Taraması
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('anchoring') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('anchoring') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Hazırlık:</strong> Demir yeri seçimi, derinlik, zemin yapısı (kum, çamur, kaya), serbest salınım dairesi</li>
              <li><strong>Zincir Miktarı:</strong> Derinliğin 3–5 katı (hava/deniz durumuna göre artırılır), scope hesabı</li>
              <li><strong>Drop & Heave:</strong> Rüzgâr pruvada; demir bırakma, zincir kontrollü salma; tutuş teyidi</li>
              <li><strong>Şamandıra Bağlama:</strong> Mooring buoy ile bağlantı, bridle düzeni, emniyet kontrolleri</li>
              <li><strong>Demir Taraması:</strong> Batık demir kurtarma, dragging anchor prosedürleri, foul anchor durumları</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 5. Yanaşma-Ayrılma */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('mooring')} className="cursor-pointer" aria-expanded={isOpen('mooring')}>
            <CardTitle id="mooring" className="scroll-mt-24 flex items-center justify-between">
              Yanaşma–Ayrılma ve Rıhtım Manevraları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('mooring') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('mooring') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Halat Düzeni:</strong> Baş/kıç spring, head/stern lines, breast lines; simetrik yük paylaşımı</li>
              <li><strong>Yanaşma:</strong> Rüzgâr/akıntı hesabı, yaklaşma açısı, fender kullanımı, pilot koordinasyonu</li>
              <li><strong>İskoça Manevraları:</strong> Med-mooring, alongside berthing, trot mooring</li>
              <li><strong>Römorkörle Çalışma:</strong> Push/pull konfigürasyonu, tow line operasyonları, haberleşme</li>
              <li><strong>Emniyet:</strong> Snap-back bölgeleri, bight altında kalmama, chafe koruması, gelgit ayarları</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 6. Dümen ve Manevra */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('steering')} className="cursor-pointer" aria-expanded={isOpen('steering')}>
            <CardTitle id="steering" className="scroll-mt-24 flex items-center justify-between">
              Dümen Kullanımı, Sevk ve Manevra
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('steering') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('steering') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Pivot Noktası:</strong> Dönüş merkezi, forward/aft position, yükleme etkisi</li>
              <li><strong>Squat Effect:</strong> Sığ suda gemi batma etkisi, UKC hesabı, sürat azaltma</li>
              <li><strong>Bank Effect:</strong> Kanal kenarı etkisi, yaw moment, dümen kompanzasyonu</li>
              <li><strong>Dümen Tipleri:</strong> Rudder, azimuth thruster, bow thruster, steerable nozzle</li>
              <li><strong>Manevra Teknikleri:</strong> Kick ahead/astern, stemming, crabbing, backing and filling</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 7. Ağır Hava */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('heavy-weather')} className="cursor-pointer" aria-expanded={isOpen('heavy-weather')}>
            <CardTitle id="heavy-weather" className="scroll-mt-24 flex items-center justify-between">
              Ağır Hava Gemiciliği ve Fırtına İdaresi
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('heavy-weather') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('heavy-weather') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Rota/Sürat:</strong> Dalga gelişine göre başa/omağa alma; parametric/synchronous roll önleme</li>
              <li><strong>Hazırlık:</strong> Güverte emniyeti, sızdırmazlık kontrolleri, yük bağlama takviyesi</li>
              <li><strong>Makine Kullanımı:</strong> Standby hazır, dümen periyodik kontrol, pervane yükü izleme</li>
              <li><strong>Yolcu/Mürettebat:</strong> Sınırlı hareket, can yeleği hazırlığı, deniz tutması önlemi</li>
              <li><strong>İzleme:</strong> Su alma/sürüklenme takibi, yapısal hasar kontrolleri, hava durumu güncellemeleri</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 8. Seyir Temelleri */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('navigation')} className="cursor-pointer" aria-expanded={isOpen('navigation')}>
            <CardTitle id="navigation" className="scroll-mt-24 flex items-center justify-between">
              Seyir Temelleri: Harita Okuma ve Mevki Belirleme
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('navigation') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('navigation') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Harita Tipleri:</strong> Mercator, gnomonic, electronic (ENC/RNC), harbor charts</li>
              <li><strong>Harita Okuma:</strong> Lat/Long, sounding, contours, symbols, notices to mariners</li>
              <li><strong>Yayınlar:</strong> Sailing Directions, List of Lights, Tide Tables, ALRS, NP</li>
              <li><strong>Mevki Belirleme:</strong> GPS, visual fixes (bearing/range), celestial navigation temelleri</li>
              <li><strong>Rota Planlama:</strong> Passage planning, waypoints, wheel-over points, no-go areas</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 9. Pusulalar */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('compass')} className="cursor-pointer" aria-expanded={isOpen('compass')}>
            <CardTitle id="compass" className="scroll-mt-24 flex items-center justify-between">
              Pusulalar ve Sapmalar
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('compass') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('compass') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Manyetik Pusula:</strong> Variation (declination), deviation, compass error</li>
              <li><strong>Cayma Düzeltmeleri:</strong> Compass to True (C→M→T), deviation kartı kullanımı</li>
              <li><strong>Ciro Pusula (Gyro):</strong> Gyro error, azimuth check, amplitude check</li>
              <li><strong>Kontroller:</strong> Sun/star azimuth, terrestrial bearings, gyro vs magnetic karşılaştırma</li>
              <li><strong>Bakım:</strong> Deviation swing, compass adjustment, kayıt tutma</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 10. Akıntılar ve Gelgitler */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('tides')} className="cursor-pointer" aria-expanded={isOpen('tides')}>
            <CardTitle id="tides" className="scroll-mt-24 flex items-center justify-between">
              Akıntılar ve Gelgitler
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('tides') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('tides') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Gelgit Tipleri:</strong> Semi-diurnal, diurnal, mixed; spring/neap tides</li>
              <li><strong>Hesaplamalar:</strong> HW/LW zamanları, height of tide, tidal curve kullanımı</li>
              <li><strong>Akıntı:</strong> Tidal stream, ocean current, set and drift hesabı</li>
              <li><strong>Derinlik Ölçümü:</strong> Echo sounder, lead line, charted depth vs actual depth</li>
              <li><strong>Rota Planlama:</strong> UKC (Under Keel Clearance), tidal window, pilot boarding depth</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 11. IALA */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('iala')} className="cursor-pointer" aria-expanded={isOpen('iala')}>
            <CardTitle id="iala" className="scroll-mt-24 flex items-center justify-between">
              IALA Seyir Yardımcıları ve Şamandıra Sistemleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('iala') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('iala') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>IALA A Bölgesi:</strong> Kırmızı iskele, yeşil sancak (Avrupa, Afrika, Asya)</li>
              <li><strong>IALA B Bölgesi:</strong> Kırmızı sancak, yeşil iskele (Amerika)</li>
              <li><strong>Lateral Marks:</strong> Port/starboard buoys, preferred channel marks</li>
              <li><strong>Cardinal Marks:</strong> N, E, S, W işaretleri, top marks, light characteristics</li>
              <li><strong>Özel İşaretler:</strong> Isolated danger, safe water, special marks (yellow)</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 12. COLREG */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('colreg')} className="cursor-pointer" aria-expanded={isOpen('colreg')}>
            <CardTitle id="colreg" className="scroll-mt-24 flex items-center justify-between">
              COLREG (Denizde Çatışmayı Önleme Kuralları)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('colreg') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('colreg') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Temel Kurallar:</strong> Rule 5 (look-out), Rule 6 (safe speed), Rule 7 (risk of collision)</li>
              <li><strong>Yol Verme:</strong> Head-on, crossing, overtaking situations; power vs sail</li>
              <li><strong>Seyir Işıkları:</strong> Masthead, sidelights, sternlight, towing lights, NUC/RAM/CBD</li>
              <li><strong>İşaretler:</strong> Shapes (ball, cone, cylinder, diamond), day signals</li>
              <li><strong>Ses Sinyalleri:</strong> Whistle, bell, gong; fog signals, maneuvering signals</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 13. Haberleşme */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('communication')} className="cursor-pointer" aria-expanded={isOpen('communication')}>
            <CardTitle id="communication" className="scroll-mt-24 flex items-center justify-between">
              Haberleşme: VHF/DSC, GMDSS Temelleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('communication') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('communication') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>VHF:</strong> Ch 16 (distress/calling), Ch 13 (bridge-to-bridge), working channels</li>
              <li><strong>DSC:</strong> Digital Selective Calling, distress alert, MMSI kullanımı</li>
              <li><strong>GMDSS:</strong> A1/A2/A3/A4 alanları, EPIRB, SART, NAVTEX, Inmarsat</li>
              <li><strong>Işık/Ses İşaretleri:</strong> Morse (SOS), aldis lamp, whistle codes</li>
              <li><strong>Flama İşaretleri:</strong> International Code of Signals (ICS), single/double letter meanings</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 14. Radar ve ECDIS */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('radar')} className="cursor-pointer" aria-expanded={isOpen('radar')}>
            <CardTitle id="radar" className="scroll-mt-24 flex items-center justify-between">
              Radar, ARPA ve ECDIS'e Giriş
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('radar') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('radar') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Radar:</strong> Pulse length, PRF, range/bearing accuracy, clutter suppression (FTC/STC)</li>
              <li><strong>ARPA:</strong> Auto tracking, CPA/TCPA, trial maneuver, target swap, vector modes</li>
              <li><strong>ECDIS:</strong> ENC display, route planning, safety contour/depth, alarm management</li>
              <li><strong>Kör Seyir:</strong> Reduced visibility procedures, radar plotting, parallel indexing</li>
              <li><strong>Limitasyonlar:</strong> Radar shadow, false echoes, blind sectors, SART detection</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 15. Vardiya */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('watchkeeping')} className="cursor-pointer" aria-expanded={isOpen('watchkeeping')}>
            <CardTitle id="watchkeeping" className="scroll-mt-24 flex items-center justify-between">
              Vardiya Usulleri ve Köprüüstü Kaynak Yönetimi (BRM)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('watchkeeping') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('watchkeeping') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Vardiya Sistemi:</strong> 4-on 8-off, 6-on 6-off, watch handover prosedürü</li>
              <li><strong>STCW Gerekleri:</strong> Rest hours, fitness for duty, look-out requirements</li>
              <li><strong>BRM Prensipleri:</strong> Situational awareness, workload management, communication</li>
              <li><strong>Köprüüstü Ekip:</strong> Master-pilot relationship, OOW sorumlulukları, karar verme</li>
              <li><strong>Kayıtlar:</strong> Deck log, bell book, course recorder, BNWAS</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 16. Emniyet Yönetimi */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('safety')} className="cursor-pointer" aria-expanded={isOpen('safety')}>
            <CardTitle id="safety" className="scroll-mt-24 flex items-center justify-between">
              Emniyet Yönetimi: SOLAS, ISM, ISPS
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('safety') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('safety') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>SOLAS:</strong> Life-saving appliances, fire protection, radio, navigation safety</li>
              <li><strong>ISM Code:</strong> Safety Management System, DPA, internal audit, non-conformities</li>
              <li><strong>ISPS Code:</strong> Ship security plan, SSO, security levels 1/2/3, drills</li>
              <li><strong>Sertifikalar:</strong> SMC, DOC, ISSC, statutory certificates</li>
              <li><strong>Drill ve Eğitim:</strong> Fire, abandon ship, MOB, security drills; training records</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 17. Can Kurtarma */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('lifesaving')} className="cursor-pointer" aria-expanded={isOpen('lifesaving')}>
            <CardTitle id="lifesaving" className="scroll-mt-24 flex items-center justify-between">
              Can Kurtarma Araçları ve Tahliye Prosedürleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('lifesaving') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('lifesaving') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ekipman:</strong> Lifeboat, life raft, rescue boat, lifejacket, immersion suit</li>
              <li><strong>MOB Prosedürü:</strong> Alarm, Williamson/Anderson turn, rescue boat launch, recovery</li>
              <li><strong>Tahliye:</strong> Muster station, abandon ship signal, embarkation ladder, lifeboat davit</li>
              <li><strong>Acil Ekipman:</strong> EPIRB, SART, pyrotechnics (flares, smoke), GMDSS alerting</li>
              <li><strong>Bakım:</strong> Weekly/monthly inspections, davit tests, hydrostatic tests, inventory checks</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 18. Yangın */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('firefighting')} className="cursor-pointer" aria-expanded={isOpen('firefighting')}>
            <CardTitle id="firefighting" className="scroll-mt-24 flex items-center justify-between">
              Yangınla Mücadele
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('firefighting') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('firefighting') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Yangın Sınıfları:</strong> A (katı), B (sıvı), C (gaz), D (metal), E (elektrik)</li>
              <li><strong>Ekipman:</strong> Portable extinguisher (CO₂, foam, dry powder), fire hose, nozzle</li>
              <li><strong>Sabit Sistemler:</strong> Sprinkler, CO₂ flooding, foam, water mist, inert gas</li>
              <li><strong>Tatbikatlar:</strong> Fire drill scenarios, SCBA kullanımı, boundary cooling</li>
              <li><strong>Prosedürler:</strong> Fire detection, alarm, isolation, attack, boundary cooling, ventilation control</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 19. Kirliliği Önleme */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('pollution')} className="cursor-pointer" aria-expanded={isOpen('pollution')}>
            <CardTitle id="pollution" className="scroll-mt-24 flex items-center justify-between">
              Kirliliği Önleme: MARPOL Ekleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('pollution') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('pollution') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Annex I:</strong> Oil pollution; ODMCS, ORB, 15 ppm limit, special areas</li>
              <li><strong>Annex II:</strong> Noxious liquid substances (NLS); categories X/Y/Z</li>
              <li><strong>Annex IV:</strong> Sewage; treatment plant, holding tank, discharge criteria</li>
              <li><strong>Annex V:</strong> Garbage; plastic ban, food waste, Garbage Record Book</li>
              <li><strong>Annex VI:</strong> Air pollution; SOx/NOx limits, EEDI/EEXI/CII, fuel sulfur content</li>
              <li><strong>Balast Suyu:</strong> BWM Convention, D-1/D-2 standards, BWMS, BWM Record Book</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 20. Stabilite */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('stability')} className="cursor-pointer" aria-expanded={isOpen('stability')}>
            <CardTitle id="stability" className="scroll-mt-24 flex items-center justify-between">
              Stabilite ve Yükleme Temelleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('stability') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('stability') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Temel Kavramlar:</strong> G (gravity center), B (buoyancy center), M (metacenter)</li>
              <li><strong>Stabilite Kriterleri:</strong> GM (metacentric height), GZ (righting lever), IMO criteria</li>
              <li><strong>Serbest Yüzey Etkisi:</strong> FSM (free surface moment), tank doluluk oranı, ballasting</li>
              <li><strong>Yükleme:</strong> Trim, list, draft surveys, loading computer, stress calculations</li>
              <li><strong>İnklonometre:</strong> GM determination, inclining test, lightweight survey</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 21. Yük Operasyonları */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('cargo')} className="cursor-pointer" aria-expanded={isOpen('cargo')}>
            <CardTitle id="cargo" className="scroll-mt-24 flex items-center justify-between">
              Yük Operasyonları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('cargo') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('cargo') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Genel Yük:</strong> Break bulk, project cargo, heavy lift; securing, dunnage</li>
              <li><strong>Dökme Yük:</strong> Grain (angle of repose, shifting), ore, coal; hold preparation</li>
              <li><strong>Konteyner:</strong> TEU/FEU, stowage planning, lashing, stack weight, reefer containers</li>
              <li><strong>Tanker:</strong> Crude/product/chemical; COW, IGS, venting, static electricity, cargo compatibility</li>
              <li><strong>IMDG/IBC/IGC:</strong> Dangerous goods classes, segregation, stowage, documentation</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 22. Güverte Bakımı */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('deck-maintenance')} className="cursor-pointer" aria-expanded={isOpen('deck-maintenance')}>
            <CardTitle id="deck-maintenance" className="scroll-mt-24 flex items-center justify-between">
              Güverte Bakımı ve Bakım Planları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('deck-maintenance') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('deck-maintenance') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Pas ve Boya:</strong> Rust chipping, wire brushing, priming, topcoat; paint types</li>
              <li><strong>Zincir-Halat Bakımı:</strong> Cable inspection, lubrication, end-for-end, renewal criteria</li>
              <li><strong>Güverte Ekipmanı:</strong> Winch, windlass, crane, hatch cover; greasing, testing</li>
              <li><strong>PMS (Planned Maintenance):</strong> Running hours, calendar-based, critical equipment</li>
              <li><strong>Spare Parts:</strong> Critical spares inventory, ROB management, ordering procedures</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 23. Küçük Tekne */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('boat-ops')} className="cursor-pointer" aria-expanded={isOpen('boat-ops')}>
            <CardTitle id="boat-ops" className="scroll-mt-24 flex items-center justify-between">
              Küçük Tekne/Servis Botu Operasyonları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('boat-ops') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('boat-ops') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Pilot Transfer:</strong> Pilot ladder, combination ladder, lee side, transfer arrangements</li>
              <li><strong>Servis Botu:</strong> Davit/crane launch, outboard motor, fuel/safety checks</li>
              <li><strong>Kürek/Motor Kullanımı:</strong> Rowing technique, helm orders, emergency procedures</li>
              <li><strong>Emniyet:</strong> Lifejacket, man-ropes, lifebuoy, VHF handheld, distress signals</li>
              <li><strong>Bakım:</strong> Hull inspection, plug checks, painter/gripes, embarkation ladder</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 24. SAR */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('sar')} className="cursor-pointer" aria-expanded={isOpen('sar')}>
            <CardTitle id="sar" className="scroll-mt-24 flex items-center justify-between">
              Arama ve Kurtarma (SAR)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('sar') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('sar') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>IAMSAR:</strong> Search patterns (expanding square, sector, parallel track)</li>
              <li><strong>OSC/SMC:</strong> On-Scene Coordinator, SAR Mission Coordinator roles</li>
              <li><strong>Distress Signals:</strong> Mayday, DSC alert, EPIRB, pyrotechnics, SOS</li>
              <li><strong>Acil Haberleşme:</strong> Urgency (Pan-Pan), Safety (Securite), medical advice</li>
              <li><strong>Koordinasyon:</strong> MRCC, RCC, SAR units, helicopter operations, medical evacuation</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 25. İnsan Faktörleri */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('human-factors')} className="cursor-pointer" aria-expanded={isOpen('human-factors')}>
            <CardTitle id="human-factors" className="scroll-mt-24 flex items-center justify-between">
              İnsan Faktörleri, İSG ve PPE
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('human-factors') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('human-factors') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>İnsan Faktörleri:</strong> Fatigue, stress, situational awareness, decision making</li>
              <li><strong>İSG:</strong> Risk assessment, hazard identification, injury reporting, accident investigation</li>
              <li><strong>PPE:</strong> Hard hat, safety shoes, gloves, goggles, harness, lifejacket</li>
              <li><strong>Permit-to-Work:</strong> Hot work, confined space, working aloft, electrical isolation</li>
              <li><strong>Ergonomi:</strong> Manual handling, repetitive strain, noise exposure, vibration</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 26. Dokümantasyon */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('documentation')} className="cursor-pointer" aria-expanded={isOpen('documentation')}>
            <CardTitle id="documentation" className="scroll-mt-24 flex items-center justify-between">
              Dokümantasyon ve Kayıtlar
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('documentation') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('documentation') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Günlükler:</strong> Deck log, engine log, oil record book, garbage record book</li>
              <li><strong>Raporlar:</strong> Noon report, arrival/departure report, incident/accident report</li>
              <li><strong>Check-lists:</strong> Pre-departure, bridge/engine room rounds, cargo operations</li>
              <li><strong>Kayıtlar:</strong> Training records, drill records, maintenance logs, rest hour records</li>
              <li><strong>Elektronik:</strong> Voyage Data Recorder (VDR), ECDIS logs, AIS playback</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 27. Liman Operasyonları */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('port-ops')} className="cursor-pointer" aria-expanded={isOpen('port-ops')}>
            <CardTitle id="port-ops" className="scroll-mt-24 flex items-center justify-between">
              Liman Kuralları ve Mevzuat
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('port-ops') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('port-ops') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Liman Kuralları:</strong> Speed limits, VTS reporting, pilotage, tug requirements</li>
              <li><strong>Yerel Mevzuat:</strong> Port regulations, customs, immigration, health clearance</li>
              <li><strong>PSC (Port State Control):</strong> Inspection checklist, deficiencies, detention, NIL deficiency</li>
              <li><strong>Formaliteler:</strong> Arrival notice, SOF (Statement of Facts), NOR (Notice of Readiness)</li>
              <li><strong>Ücretler:</strong> Port dues, pilotage, towage, mooring, waste disposal</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 28. Özel Seyrüsefer */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('special-nav')} className="cursor-pointer" aria-expanded={isOpen('special-nav')}>
            <CardTitle id="special-nav" className="scroll-mt-24 flex items-center justify-between">
              Özel Seyrüsefer Durumları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('special-nav') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('special-nav') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dar Kanal:</strong> COLREG Rule 9, overtaking restrictions, traffic separation</li>
              <li><strong>Sığ Su:</strong> Squat effect, UKC management, speed reduction, bottom interaction</li>
              <li><strong>Buz:</strong> Ice navigation, ice classes, icebreaker assistance, hull damage risks</li>
              <li><strong>Sis ve Kısıtlı Görüş:</strong> Sound signals, radar navigation, safe speed, lookout</li>
              <li><strong>Özel Bölgeler:</strong> TSS (Traffic Separation Scheme), restricted areas, anchorage zones</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 29. Sörvey */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('surveys')} className="cursor-pointer" aria-expanded={isOpen('surveys')}>
            <CardTitle id="surveys" className="scroll-mt-24 flex items-center justify-between">
              Sörvey, Klas ve Muayeneler
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('surveys') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('surveys') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Klas Sörveyleri:</strong> Annual, intermediate, special, docking, renewal surveys</li>
              <li><strong>Bayrak Devleti:</strong> Flag state inspections, ISM/ISPS audits, statutory certificates</li>
              <li><strong>Tonaj:</strong> Gross tonnage (GT), net tonnage (NT), deadweight (DWT), displacement</li>
              <li><strong>Sertifikalar:</strong> Class certificate, IOPP, Safety Equipment, Load Line, PSPC</li>
              <li><strong>Hazırlık:</strong> Survey checklist, deficiency rectification, documentation readiness</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 30. Enerji Verimliliği */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('efficiency')} className="cursor-pointer" aria-expanded={isOpen('efficiency')}>
            <CardTitle id="efficiency" className="scroll-mt-24 flex items-center justify-between">
              Enerji Verimliliği ve Çevresel Yönetim
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('efficiency') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('efficiency') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>SEEMP:</strong> Ship Energy Efficiency Management Plan, fuel consumption monitoring</li>
              <li><strong>EEXI:</strong> Energy Efficiency Existing Ship Index, technical/operational measures</li>
              <li><strong>CII:</strong> Carbon Intensity Indicator (A/B/C/D/E rating), annual improvement</li>
              <li><strong>Optimizasyon:</strong> Weather routing, trim/ballast optimization, speed optimization</li>
              <li><strong>Alternatif Yakıtlar:</strong> LNG, methanol, ammonia, hydrogen; green shipping initiatives</li>
            </ul>
          </CardContent>
          )}
        </Card>

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">Sürüm: v2.0 • 30 kapsamlı gemicilik konusu eklendi.</div>
          <Button asChild variant="default" className="gap-2">
            <a href="#terminology">
              Başa Dön
            </a>
          </Button>
        </div>

        <Separator />
      </div>
    </MobileLayout>
  );
}
