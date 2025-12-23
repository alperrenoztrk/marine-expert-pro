import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { calculationCategories, sectionIconMap } from "@/data/calculationCenterConfig";
import { bridgeDevices } from "@/data/bridgeDevices";
import { crewHierarchy } from "@/data/crewHierarchy";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Anchor,
  Battery,
  Cog,
  Droplets,
  Factory,
  Flame,
  Gauge,
  ShieldCheck,
  Snowflake,
  Waves,
  ClipboardList,
  Scale
} from "lucide-react";

export default function CalculationsMenu() {
  const [showLessons, setShowLessons] = useState(false);
  const [showCrew, setShowCrew] = useState(false);
  const [showBridgeDevices, setShowBridgeDevices] = useState(false);
  const [showMachinery, setShowMachinery] = useState(false);
  const [showShipTasks, setShowShipTasks] = useState(false);
  const [showRegulations, setShowRegulations] = useState(false);

  const bridgeNavigationTasks = [
    { task: "Passage plan", responsible: "Master + 2/O", worker: "2/O", href: "/passage-plan" },
    { task: "Vardiya tutma", responsible: "Master", worker: "2/O – 3/O – 4/O" },
    { task: "Radar / ARPA takibi", responsible: "Vardiya zabiti", worker: "Vardiya zabiti" },
    { task: "COLREG uygulama", responsible: "Vardiya zabiti", worker: "Vardiya zabiti" },
    { task: "Kaptanı çağırma kararı", responsible: "Vardiya zabiti", worker: "Vardiya zabiti" },
    { task: "Logbook doldurma", responsible: "Vardiya zabiti", worker: "Vardiya zabiti" },
    { task: "Pilot embark/disembark", responsible: "Master", worker: "2/O–3/O" },
    { task: "Kısıtlı sularda seyir", responsible: "Master", worker: "Master + OOW" },
    { task: "GMDSS acil çağrı", responsible: "Master", worker: "2/O" },
    { task: "Köprüüstü disiplin", responsible: "Master", worker: "Tüm zabitler" },
  ];

  const machinerySystems = [
    {
      name: "Ana Makine (Sevk Sistemi)",
      description:
        "Ana dizel makine, türbin ve diesel-electric tahrik kombinasyonlarının devreye alma, yük paylaşımı ve seyir performansını izleme",
      icon: Cog,
    },
    {
      name: "Yardımcı Makineler",
      description:
        "Yardımcı dizel, acil durum ve ana şaft tahrikli jeneratörlerin paralel çalışma, senkronizasyon ve güç yönetimi",
      icon: Factory,
    },
    {
      name: "Elektrik & Güç Sistemleri",
      description:
        "Ana/acil switchboard, UPS, trafolar ve batarya gruplarının yük aktarımı, gerilim/frekans denetimi ve kesintisiz güç sürekliliği",
      icon: Battery,
    },
    {
      name: "Yakıt & Yağ Sistemleri",
      description:
        "Fuel/Lube oil separatörleri, günlük tanklar ve transfer/besleme pompalarının arıtma, ısıtma ve otomatik tank balansı",
      icon: Droplets,
    },
    {
      name: "Pompalar",
      description:
        "Sintine, balast, yangın ve soğutma suyu pompalarının otomatik start/stop, basınç koruma ve hat yedekliliği",
      icon: Gauge,
    },
    {
      name: "Soğutma & HVAC",
      description:
        "Merkezi soğutma, HVAC, soğuk hava depoları ve reefer devrelerinin ısı değiştirici kontrolü, fan/pompa kademesi ve nem-sıcaklık optimizasyonu",
      icon: Snowflake,
    },
    {
      name: "Kazanlar (Boiler)",
      description:
        "Auxiliary boiler ve EGB ile yakma hava ayarı, buhar basıncı regülasyonu ve ısıtma devrelerinin arıza/tekrar devreye alma işlemleri",
      icon: Flame,
    },
    {
      name: "Emniyet & Kontrol Sistemleri",
      description:
        "Yangın algılama/CO₂, ECR, alarm ve izleme sistemlerinin sensör doğrulama, arıza izolasyonu ve otomatik güvenlik müdahaleleri",
      icon: ShieldCheck,
    },
    {
      name: "Güverte Makineleri",
      description:
        "Irgat, mooring winch, kreyn, capstan ve Ro-Ro rampalarının yük limit kontrolü, hidrolik/elektrik tahrik gözetimi ve emniyet kilitlemeleri",
      icon: Anchor,
    },
  ];

  const machineryDetailSections = [
    {
      title: "Dizel Ana Makine (Slow/Medium/High-Speed)",
      summary:
        "Dizel çevrimli pistonlu motorlar; düşük devirde doğrudan şaft, orta/yüksek devirde redüksiyon dişlisiyle pervaneye güç aktarır.",
      bullets: [
        "Avantaj: Yüksek verim ve dayanıklılık, ağır yakıtla çalışabilme, geniş servis ağı.",
        "Dezavantaj: Ağırlık/hacim, titreşim ve emisyonlar için ek arıtma gerekebilir.",
        "Kullanım: Büyük ticari gemilerde slow-speed; Ro-Ro/feribotlarda medium-speed; küçük feribot/devriye botlarında high-speed.",
      ],
    },
    {
      title: "Dual-Fuel Dizel (DF) Ana Makine",
      summary:
        "Gaz modunda küçük pilot dizel püskürtmesiyle tutuşan dizel mimarisi; LNG/LPG/metanol + dizel yakıt esnekliği sunar.",
      bullets: [
        "Avantaj: SOx/PM emisyonlarında ciddi azalma, NOx uyumu kolay, yakıt seçeneği geniş.",
        "Dezavantaj: Gaz besleme ve güvenlik sistemleri karmaşık; LNG'de metan kayması konusu.",
        "Kullanım: LNG taşıyıcılar, çevreci feribotlar, yeni nesil konteyner ve offshore tedarik gemileri.",
      ],
    },
    {
      title: "Gaz Türbini Tahrik",
      summary:
        "Brayton çevrimiyle çalışan kompakt makineler; redüksiyon dişlisiyle pervane veya jeneratöre bağlanır.",
      bullets: [
        "Avantaj: Çok yüksek güç/ağırlık oranı, düşük titreşim, hızlı güç artışı.",
        "Dezavantaj: Kısmi yükte verim düşer, yakıt tüketimi dizelden yüksek, sıcak parça bakımı maliyetli.",
        "Kullanım: CODAG/CODLAG kombinasyonlu savaş gemileri, yüksek hızlı feribotlar, bazı yatlar.",
      ],
    },
    {
      title: "Buhar Türbini ve Kazan Sistemi",
      summary: "Kazanda üretilen buhar türbinde genişleyerek şaftı döndürür; kondenser ve besi suyu devresi kapalı çevrim sağlar.",
      bullets: [
        "Avantaj: Yüksek güçte titreşimsiz çalışma; LNG taşıyıcılarında boil-off gazı değerlendirebilir.",
        "Dezavantaj: Modern dizellere göre düşük verim, kazan/türbin ve su kimyası bakımı karmaşık.",
        "Kullanım: Eski nesil LNG tankerleri, bazı uçak gemileri, buz kıranlar, nükleer tahrikte ısı kaynağı olarak.",
      ],
    },
    {
      title: "Nükleer Tahrik (Buhar Türbini ile)",
      summary: "Reaktördeki fisyon ısısı buhar üretir ve türbinleri döndürür; çok uzun menzil ve yüksek sürekli güç sağlar.",
      bullets: [
        "Avantaj: Yakıt ikmaline düşük bağımlılık, uzun süre yüksek güç.",
        "Dezavantaj: Lisans/güvenlik gereksinimleri, ilk yatırım ve atık yönetimi maliyetli.",
        "Kullanım: Askerî uçak gemisi/denizaltı, bazı buz kıranlar.",
      ],
    },
    {
      title: "CODAD / CODAG / CODOG / CODLAG / IFEP",
      summary:
        "Dizel, gaz türbini ve elektrik motorlarının farklı hız/görev profilleri için kombinasyonlu kullanımı; esnek güç yönetimi sunar.",
      bullets: [
        "Avantaj: Ekonomik seyir için dizel, sprint için gaz türbini; CODLAG/IFEP ile sessiz seyir ve dağıtılabilir güç.",
        "Dezavantaj: Dişli/şaft ve kontrol sistemi karmaşıklığı, bakım ve eğitim ihtiyacı.",
        "Kullanım: Fırkateyn/muhrip, sessiz seyir isteyen denizaltı ve büyük yolcu/feribotlarda IFEP.",
      ],
    },
    {
      title: "Tam Elektrikli / Hibrit-Elektrikli Tahrik",
      summary:
        "Dizel jeneratörler (veya gaz türbini/nükleer) elektrik üretir; frekans dönüştürücülü motorlar pervaneyi döndürür, batarya destek verebilir.",
      bullets: [
        "Avantaj: Yerleşimde esneklik, düşük titreşim ve iyi manevra; batarya ile düşük yük verimi ve hızlı yanıt artar.",
        "Dezavantaj: Güç elektroniği soğutma/kablo ağırlığı, harmonik ve EMC yönetimi gereksinimi.",
        "Kullanım: Yolcu/gezinti gemileri, buz kıranlar, offshore inşaat/tedarik, DP gemileri ve feribotlar.",
      ],
    },
    {
      title: "Azipod / Pod Tahrik",
      summary:
        "Elektrik motoru ve pervane aynı döner gondol içinde; 360° dönebilme ile dümen ihtiyacını azaltır ve manevrayı güçlendirir.",
      bullets: [
        "Avantaj: Üstün manevra, kısalan şaft hattı, pulling tipte verim artışı, gürültü/titreşim azaltımı.",
        "Dezavantaj: Yatırım maliyeti ve sızdırmazlık/bakım hassasiyeti; güçlü elektrik altyapısı ister.",
        "Kullanım: Yolcu/gezinti gemileri, buz kıranlar, dinamik konumlamalı offshore gemileri, feribotlar.",
      ],
    },
    {
      title: "Pervane-Dışı Yüksek İtki Sistemleri",
      summary: "Waterjet, Voith-Schneider ve thruster çözümleri manevra ve hız odaklı itki seçenekleri sunar.",
      bullets: [
        "Waterjet: Yüksek hızda verimli, pervanesiz jet akışı; sığ su ve manevrada güçlü ama düşük hızda verimsiz.",
        "Voith-Schneider: Dikey dönen kanatlarla anında yönlenebilir itki; römorkör ve feribotlarda hassas manevra.",
        "Tunnel/azimuth thruster: Dinamik konumlama, yanaşma ve DP kabiliyeti için ek itki birimleri.",
      ],
    },
    {
      title: "Alternatif Yakıt ve Yeni Teknolojiler",
      summary:
        "Metanol, amonyak, hidrojen yakıt hücresi ve batarya çözümleri sıfıra yakın emisyon hedefleri için geliştiriliyor.",
      bullets: [
        "Metanol motorları: Düşük SOx/PM, güvenlik gereksinimli yakıt sistemi; dizel verimine yakın.",
        "Amonyak: Karbonsuz potansiyel, toksisite ve NOx kontrolü nedeniyle AR-GE aşamasında.",
        "Yakıt hücresi/batarya: Sessiz ve lokal emisyonsuz; şu an küçük güç/yardımcı tahrik ve kısa mesafe feribotlarda yaygın.",
      ],
    },
    {
      title: "Yardımcı Dizel Jeneratörler ve PTO/PTI",
      summary:
        "Elektrik üretimi ve şafttan güç alma/şafta güç verme sistemleri enerji yönetimini optimize eder.",
      bullets: [
        "Avantaj: Ana makine yüküne göre optimize enerji, limanda düşük emisyon için shore-power veya PTO desteği.",
        "Dezavantaj: Ek güç elektroniği, dişli ve kavrama karmaşıklığı; yük paylaşım algoritması gerektirir.",
        "Kullanım: Çoğu ticari gemide yardımcı/jeneratör seti, enerji verimliliği odaklı PTO/PTI konfigürasyonları.",
      ],
    },
    {
      title: "Yardımcı Kazanlar ve Isı Geri Kazanımı",
      summary:
        "Ana makine egzozu veya bağımsız yakma ile buhar/sıcak su üretip yakıt/yağ/kargo ısıtma ve yaşam mahalli konforu sağlar.",
      bullets: [
        "Avantaj: Economizer ile atık ısıdan yakıt tasarrufu, geniş kullanım yelpazesi.",
        "Dezavantaj: Kazan suyu kimyası, kurum/korozyon kontrolü ve termal şok riskleri dikkat ister.",
        "Kullanım: Çoğu ticari gemide yardımcı kazan; egzoz gazı kazanlarıyla kombine çözümler.",
      ],
    },
  ];

  const highRefreshRateStyles: CSSProperties = {
    // Ensure the calculations menu animates at 120Hz for ultra-smooth interactions
    ['--frame-rate' as string]: "120",
    ['--animation-duration' as string]: "8.33ms",
    ['--transition-duration' as string]: "16.67ms"
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4 py-8 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]"
      data-no-translate
      style={highRefreshRateStyles}
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6">
        {/* Header */}
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            Hesaplama Merkezi
          </div>
          <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl">
            Tüm Hesaplama Araçları
          </h1>
          <p className="text-sm text-muted-foreground">
            Merkezdeki tüm hesaplama içeriklerini tek bir dersler butonu altında toplayabilirsiniz.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowLessons((prev) => !prev)}
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow group-hover:scale-105">
              <BookOpen className="h-4 w-4" />
            </span>
            <span>Dersler</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${showLessons ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowCrew((prev) => !prev)}
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white shadow group-hover:scale-105">
              👥
            </span>
            <span>Gemi Personeli</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${showCrew ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowBridgeDevices((prev) => !prev)}
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white shadow group-hover:scale-105">
              📡
            </span>
            <span>Köprüüstü Aygıtları</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${showBridgeDevices ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowMachinery((prev) => !prev)}
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500 text-white shadow group-hover:scale-105">
              🛠️
            </span>
            <span>Gemi Makineleri</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${showMachinery ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowShipTasks((prev) => !prev)}
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow group-hover:scale-105">
              <ClipboardList className="h-4 w-4" />
            </span>
            <span>Gemide Yapılan Tüm İşler ve Sorumluları</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${showShipTasks ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowRegulations((prev) => !prev)}
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 text-white shadow group-hover:scale-105">
              <Scale className="h-4 w-4" />
            </span>
            <span>Regülasyonlar</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${showRegulations ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          {showLessons && (
            <div className="flex flex-col gap-6">
              {calculationCategories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <section key={category.id} className="space-y-3">
                    {/* Category Header */}
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${category.accent} text-white shadow-lg`}>
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{category.title}</h2>
                        <p className="text-xs text-muted-foreground">{category.subtitle}</p>
                      </div>
                    </div>

                    {/* Section Links - Grid */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                      {category.sections.map((section) => {
                        const SectionIcon = sectionIconMap[section.id];
                        return (
                          <Link
                            key={section.id}
                            to={section.href || "#"}
                            className="group flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-card/80 p-3 backdrop-blur transition-all hover:border-primary/30 hover:bg-card hover:shadow-md"
                          >
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${category.accent} text-white transition-transform group-hover:scale-110`}>
                              <SectionIcon className="h-4 w-4" />
                            </div>
                            <span className="text-center text-xs font-medium text-foreground">
                              {section.label}
                            </span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {showShipTasks && (
            <section className="space-y-6 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-1 text-center">
                <h2 className="text-lg font-bold text-foreground">Gemide Yapılan Tüm İşler ve Sorumluları</h2>
                <p className="text-xs text-muted-foreground">
                  Gemide düzenli olarak yapılan işler ve bunların asıl sorumlularıyla fiilen yapan personel
                </p>
              </div>

              {/* 1. Seyir & Köprüüstü İşleri */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚓</span>
                  <h3 className="font-bold text-foreground">1️⃣ SEYİR & KÖPRÜÜSTÜ İŞLERİ</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-left">
                        <th className="py-2 pr-4 font-semibold text-foreground">İş</th>
                        <th className="py-2 pr-4 font-semibold text-primary">Asıl Sorumlu</th>
                        <th className="py-2 font-semibold text-muted-foreground">Fiilen Yapan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {bridgeNavigationTasks.map(({ task, responsible, worker, href }) => (
                        <tr key={task}>
                          <td className="py-1.5 pr-4 text-foreground">
                            {href ? (
                              <Link
                                to={href}
                                className="text-primary underline decoration-dotted underline-offset-2 transition-colors hover:text-primary/80"
                              >
                                {task}
                              </Link>
                            ) : (
                              task
                            )}
                          </td>
                          <td className="py-1.5 pr-4 text-primary">{responsible}</td>
                          <td className="py-1.5 text-muted-foreground">{worker}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Navigasyon & Harita İşleri */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🗺️</span>
                  <h3 className="font-bold text-foreground">2️⃣ NAVİGASYON & HARİTA İŞLERİ</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-left">
                        <th className="py-2 pr-4 font-semibold text-foreground">İş</th>
                        <th className="py-2 font-semibold text-primary">Sorumlu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ["Harita düzeltmeleri", "2. Kaptan"],
                        ["ECDIS güncellemeleri", "2. Kaptan"],
                        ["Notice to Mariners", "2. Kaptan"],
                        ["Navigational warnings", "2. Kaptan"],
                        ["Gyro / manyetik pusula kontrolü", "2/O – 3/O"],
                        ["Draft & position plotting", "OOW"],
                        ["BNWAS / AIS kontrol", "OOW"],
                        ["Seyir cihazları bakımı", "2/O"],
                      ].map(([task, responsible]) => (
                        <tr key={task}>
                          <td className="py-1.5 pr-4 text-foreground">{task}</td>
                          <td className="py-1.5 text-primary">{responsible}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Yük Operasyonları */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📦</span>
                  <h3 className="font-bold text-foreground">3️⃣ YÜK OPERASYONLARI</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-left">
                        <th className="py-2 pr-4 font-semibold text-foreground">İş</th>
                        <th className="py-2 pr-4 font-semibold text-primary">Asıl Sorumlu</th>
                        <th className="py-2 font-semibold text-muted-foreground">Sahadaki</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ["Yük planı", "Chief Officer", "C/O"],
                        ["Loading / Discharging", "Chief Officer", "3/O"],
                        ["Draft survey", "C/O", "3/O"],
                        ["Tank sounding", "C/O", "3/O"],
                        ["Cargo watch", "3/O – 4/O", "3/O"],
                        ["Mooring / unmooring", "Master", "2/O–3/O"],
                        ["Hatch cover operasyonu", "C/O", "Bosun"],
                        ["Cargo damage takibi", "C/O", "3/O"],
                      ].map(([task, responsible, worker]) => (
                        <tr key={task}>
                          <td className="py-1.5 pr-4 text-foreground">{task}</td>
                          <td className="py-1.5 pr-4 text-primary">{responsible}</td>
                          <td className="py-1.5 text-muted-foreground">{worker}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Emniyet & ISM/ISPS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧯</span>
                  <h3 className="font-bold text-foreground">4️⃣ EMNİYET & ISM / ISPS</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-left">
                        <th className="py-2 pr-4 font-semibold text-foreground">İş</th>
                        <th className="py-2 font-semibold text-primary">Sorumlu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ["Safety Officer", "3. Kaptan"],
                        ["Yangın ekipmanları", "3/O"],
                        ["Can kurtarma araçları", "3/O"],
                        ["Weekly / Monthly checks", "3/O"],
                        ["Drill organizasyonu", "3/O"],
                        ["Muster list", "Master"],
                        ["ISM kayıtları", "Master + C/O"],
                        ["ISPS (güvenlik)", "Master"],
                        ["Security watch", "3/O – 4/O"],
                      ].map(([task, responsible]) => (
                        <tr key={task}>
                          <td className="py-1.5 pr-4 text-foreground">{task}</td>
                          <td className="py-1.5 text-primary">{responsible}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Güverte Bakım & Onarım */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔧</span>
                  <h3 className="font-bold text-foreground">5️⃣ GÜVERTE BAKIM & ONARIM</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-left">
                        <th className="py-2 pr-4 font-semibold text-foreground">İş</th>
                        <th className="py-2 pr-4 font-semibold text-primary">Sorumlu</th>
                        <th className="py-2 font-semibold text-muted-foreground">Yapan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ["Boya & pas", "C/O", "Bosun + AB"],
                        ["Güverte temizliği", "C/O", "AB"],
                        ["Halat – tel bakımı", "C/O", "Bosun"],
                        ["Vinç – capstan yağlama", "C/O", "AB"],
                        ["Güverte aydınlatma", "C/O", "AB"],
                        ["Fener & işaretler", "C/O", "AB"],
                      ].map(([task, responsible, worker]) => (
                        <tr key={task}>
                          <td className="py-1.5 pr-4 text-foreground">{task}</td>
                          <td className="py-1.5 pr-4 text-primary">{responsible}</td>
                          <td className="py-1.5 text-muted-foreground">{worker}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 6. Personel & Disiplin */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👥</span>
                  <h3 className="font-bold text-foreground">6️⃣ PERSONEL & DİSİPLİN</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-left">
                        <th className="py-2 pr-4 font-semibold text-foreground">İş</th>
                        <th className="py-2 font-semibold text-primary">Sorumlu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ["Günlük iş planı", "Chief Officer"],
                        ["Güverte personeli", "C/O"],
                        ["Disiplin", "Master"],
                        ["İş güvenliği", "3/O"],
                        ["Yeni personel oryantasyonu", "3/O"],
                        ["Eğitim", "Master + C/O"],
                      ].map(([task, responsible]) => (
                        <tr key={task}>
                          <td className="py-1.5 pr-4 text-foreground">{task}</td>
                          <td className="py-1.5 text-primary">{responsible}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 7. Dokümantasyon & Denetim */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📑</span>
                  <h3 className="font-bold text-foreground">7️⃣ DOKÜMANTASYON & DENETİM</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-left">
                        <th className="py-2 pr-4 font-semibold text-foreground">İş</th>
                        <th className="py-2 font-semibold text-primary">Sorumlu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ["PSC hazırlık", "Master + C/O + 3/O"],
                        ["Logbooks", "OOW"],
                        ["Checklists", "İlgili zabit"],
                        ["Certificates", "Master"],
                        ["Company reporting", "Master"],
                        ["Deficiency takibi", "C/O"],
                      ].map(([task, responsible]) => (
                        <tr key={task}>
                          <td className="py-1.5 pr-4 text-foreground">{task}</td>
                          <td className="py-1.5 text-primary">{responsible}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 8. Acil Durumlar */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚨</span>
                  <h3 className="font-bold text-foreground">8️⃣ ACİL DURUMLAR</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-left">
                        <th className="py-2 pr-4 font-semibold text-foreground">Durum</th>
                        <th className="py-2 font-semibold text-primary">Lider</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ["Yangın", "Master"],
                        ["Can kurtarma", "3/O"],
                        ["Adam denize", "Master"],
                        ["Collision", "Master"],
                        ["Grounding", "Master"],
                        ["Abandon ship", "Master"],
                        ["Medical emergency", "Master"],
                        ["Oil spill", "C/O"],
                      ].map(([situation, leader]) => (
                        <tr key={situation}>
                          <td className="py-1.5 pr-4 text-foreground">{situation}</td>
                          <td className="py-1.5 text-primary">{leader}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 9. Makine Dairesi İşleri */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚙️</span>
                  <h3 className="font-bold text-foreground">9️⃣ MAKİNE DAİRESİ İŞLERİ</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-left">
                        <th className="py-2 pr-4 font-semibold text-foreground">İş</th>
                        <th className="py-2 pr-4 font-semibold text-primary">Asıl Sorumlu</th>
                        <th className="py-2 font-semibold text-muted-foreground">Fiilen Yapan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ["Ana makine operasyonu", "Chief Engineer", "2/E – 3/E"],
                        ["Yardımcı makine bakımı", "2nd Engineer", "3/E – 4/E"],
                        ["Jeneratör operasyonu", "2nd Engineer", "3/E – Oiler"],
                        ["Yakıt transferi", "Chief Engineer", "3/E"],
                        ["Yağlama sistemi", "2nd Engineer", "4/E – Oiler"],
                        ["Soğutma sistemi", "2nd Engineer", "3/E"],
                        ["Balast operasyonu", "Chief Engineer", "3/E"],
                        ["Sintine pompası", "3rd Engineer", "4/E – Oiler"],
                        ["Separator çalıştırma", "3rd Engineer", "4/E"],
                        ["Kazan operasyonu", "2nd Engineer", "3/E"],
                        ["Kompresör bakımı", "3rd Engineer", "4/E"],
                        ["Pompa bakımları", "2nd Engineer", "3/E – 4/E"],
                        ["Elektrik sistemleri", "Electrician", "Electrician"],
                        ["Otomasyon sistemleri", "Chief Engineer", "Electrician"],
                        ["Spare parts yönetimi", "Chief Engineer", "2/E"],
                        ["Makine logbook", "Chief Engineer", "Vardiya mühendisi"],
                        ["PMS kayıtları", "2nd Engineer", "Tüm mühendisler"],
                        ["Bunkering operasyonu", "Chief Engineer", "2/E – 3/E"],
                        ["LO/FO analizleri", "Chief Engineer", "2/E"],
                        ["Makine dairesi temizliği", "Chief Engineer", "Oiler – Wiper"],
                        ["Emergency generator", "2nd Engineer", "3/E"],
                        ["Steering gear bakımı", "2nd Engineer", "3/E"],
                        ["Makine dairesi güvenliği", "Chief Engineer", "Tüm personel"],
                      ].map(([task, responsible, worker]) => (
                        <tr key={task}>
                          <td className="py-1.5 pr-4 text-foreground">{task}</td>
                          <td className="py-1.5 pr-4 text-primary">{responsible}</td>
                          <td className="py-1.5 text-muted-foreground">{worker}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {showCrew && (
            <section className="space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-1 text-center">
                <h2 className="text-lg font-bold text-foreground">Gemi Personeli Hiyerarşisi</h2>
                <p className="text-xs text-muted-foreground">
                  Köprüüstü, makine, güverte ve ikmal ekiplerini hiyerarşik sırayla görüntüleyin.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {crewHierarchy.map((group) => (
                  <div
                    key={group.department}
                    className="rounded-xl border border-border/50 bg-gradient-to-br from-white/60 via-card to-slate-50/70 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:from-background dark:via-card dark:to-slate-900/40"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{group.department}</h3>
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{group.focus}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                        {group.colorCode}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.roles.map((role) => (
                        <Link
                          key={role.slug}
                          to={`/crew/${role.slug}`}
                          className="group block rounded-lg border border-border/40 bg-background/80 px-3 py-2 text-sm shadow-xs transition hover:border-primary/40 hover:bg-card"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="font-semibold text-foreground">{role.rank}</div>
                                <span className="text-[10px] uppercase tracking-wide text-primary/80">Görev Detayı</span>
                              </div>
                              <div className="text-xs text-muted-foreground">{role.responsibility}</div>
                            </div>
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 transition group-hover:bg-primary/15 group-hover:text-primary dark:bg-slate-800 dark:text-slate-200">
                              {role.reportsTo}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {showBridgeDevices && (
            <section className="space-y-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-1 text-center">
                <h2 className="text-lg font-bold text-foreground">Köprüüstü Aygıtları Paneli</h2>
                <p className="text-xs text-muted-foreground">
                  VHF, DSC, ECDIS, radar, Navtex ve diğer tüm seyir cihazlarını ayrı ayrı açın.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {bridgeDevices.map((device) => {
                  const DeviceIcon = device.icon;
                  return (
                    <Link
                      key={device.id}
                      to={`/bridge/${device.id}`}
                      className="group flex h-full flex-col items-start gap-2 rounded-xl border border-border/50 bg-background/70 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${device.accent} text-white shadow`}>
                          <DeviceIcon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">{device.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{device.description}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                        Ayrı modül
                        <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {showMachinery && (
            <section className="space-y-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-1 text-center">
                <h2 className="text-lg font-bold text-foreground">Gemi Makineleri Paneli</h2>
                <p className="text-xs text-muted-foreground">
                  Jeneratör, separatör, kazan, kompresör ve diğer makineleri tek ekranda açın.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {machinerySystems.map((system) => {
                  const MachineryIcon = system.icon;
                  return (
                    <button
                      key={system.name}
                      type="button"
                      className="group flex h-full flex-col items-start gap-2 rounded-xl border border-border/50 bg-background/70 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500 text-white shadow">
                          <MachineryIcon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">{system.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{system.description}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                        Erişim
                        <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-xl border border-border/50 bg-background/60 p-4 shadow-inner">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Detaylı Makine Açıklamaları</h3>
                </div>
                <div className="space-y-3">
                  {machineryDetailSections.map((section) => (
                    <details
                      key={section.title}
                      className="group rounded-lg border border-border/40 bg-card/70 p-3 shadow-sm transition hover:border-primary/40"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-2 text-left">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-foreground">{section.title}</div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{section.summary}</p>
                        </div>
                        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                      </summary>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-foreground/90">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          )}

          {showRegulations && (
            <section className="space-y-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 text-white shadow-lg">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">📜 Denizcilik Regülasyonları</h2>
                  <p className="text-xs text-muted-foreground">Uluslararası ve ulusal denizcilik kuralları</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* IMO Conventions */}
                <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                  <h3 className="mb-3 font-bold text-foreground">🌐 IMO Sözleşmeleri</h3>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span><strong>SOLAS</strong> – Denizde Can Güvenliği</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span><strong>MARPOL</strong> – Deniz Kirliliğinin Önlenmesi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span><strong>STCW</strong> – Gemi Adamları Eğitim ve Belgelendirme</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span><strong>MLC</strong> – Denizcilik Çalışma Sözleşmesi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span><strong>COLREG</strong> – Denizde Çatışmayı Önleme Kuralları</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span><strong>Load Lines</strong> – Yükleme Hattı Sözleşmesi</span>
                    </li>
                  </ul>
                </div>

                {/* Safety Codes */}
                <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                  <h3 className="mb-3 font-bold text-foreground">🛡️ Emniyet Kodları</h3>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span><strong>ISM Code</strong> – Uluslararası Güvenlik Yönetimi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span><strong>ISPS Code</strong> – Gemi ve Liman Tesisi Güvenliği</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span><strong>IMDG Code</strong> – Tehlikeli Yükler</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span><strong>IMSBC Code</strong> – Katı Dökme Yükler</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span><strong>IGC Code</strong> – Gaz Taşıyıcı Gemiler</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span><strong>IBC Code</strong> – Kimyasal Tankerler</span>
                    </li>
                  </ul>
                </div>

                {/* Environmental */}
                <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                  <h3 className="mb-3 font-bold text-foreground">🌿 Çevresel Düzenlemeler</h3>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span><strong>BWM Convention</strong> – Balast Suyu Yönetimi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span><strong>AFS Convention</strong> – Zehirli Boya Sistemleri</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span><strong>Hong Kong Convention</strong> – Gemi Geri Dönüşümü</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span><strong>EEDI/EEXI</strong> – Enerji Verimliliği İndeksleri</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span><strong>CII</strong> – Karbon Yoğunluğu Göstergesi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span><strong>EU ETS</strong> – Emisyon Ticaret Sistemi</span>
                    </li>
                  </ul>
                </div>

                {/* Inspection & Surveys */}
                <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                  <h3 className="mb-3 font-bold text-foreground">🔍 Denetim & Sörvey</h3>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <span><strong>PSC</strong> – Liman Devleti Kontrolü</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <span><strong>FSC</strong> – Bayrak Devleti Kontrolü</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <span><strong>Class Survey</strong> – Klas Denetimleri</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <span><strong>Vetting</strong> – Tanker Denetimleri (SIRE, CDI)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <span><strong>ISM Audit</strong> – İç ve Dış Denetimler</span>
                    </li>
                  </ul>
                </div>

                {/* Certificates */}
                <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                  <h3 className="mb-3 font-bold text-foreground">📋 Gemi Sertifikaları</h3>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      <span><strong>SMC</strong> – Safety Management Certificate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      <span><strong>DOC</strong> – Document of Compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      <span><strong>ISSC</strong> – International Ship Security Certificate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      <span><strong>IOPP</strong> – Oil Pollution Prevention Certificate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      <span><strong>Load Line Certificate</strong> – Yükleme Hattı Belgesi</span>
                    </li>
                  </ul>
                </div>

                {/* Regional */}
                <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                  <h3 className="mb-3 font-bold text-foreground">🗺️ Bölgesel Düzenlemeler</h3>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                      <span><strong>Paris MoU</strong> – Avrupa PSC Rejimi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                      <span><strong>Tokyo MoU</strong> – Asya-Pasifik PSC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                      <span><strong>US USCG</strong> – ABD Sahil Güvenlik</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                      <span><strong>EU Regulations</strong> – AB Denizcilik Mevzuatı</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                      <span><strong>Black Sea MoU</strong> – Karadeniz PSC</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

