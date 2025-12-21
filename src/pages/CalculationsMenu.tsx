import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { calculationCategories, sectionIconMap } from "@/data/calculationCenterConfig";
import { BookOpen, ChevronDown, ChevronRight, Map, Navigation, Radar, Radio, SatelliteDish, ScrollText, Waves } from "lucide-react";

export default function CalculationsMenu() {
  const [showLessons, setShowLessons] = useState(false);
  const [showCrew, setShowCrew] = useState(false);
  const [showBridgeDevices, setShowBridgeDevices] = useState(false);

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
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 text-white shadow group-hover:scale-105">
              <Radar className="h-4 w-4" />
            </span>
            <span>Köprüüstü Aygıtları</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${showBridgeDevices ? "rotate-180" : "rotate-0"}`}
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
                    className="rounded-xl border border-border/50 bg-gradient-to-br from-white/60 via-card to-slate-50/70 p-3 text-left shadow-sm dark:from-background dark:via-card dark:to-slate-900/40"
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
                        <div
                          key={role.rank}
                          className="rounded-lg border border-border/40 bg-background/80 px-3 py-2 text-sm shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-semibold text-foreground">{role.rank}</div>
                              <div className="text-xs text-muted-foreground">{role.responsibility}</div>
                            </div>
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              {role.reportsTo}
                            </span>
                          </div>
                        </div>
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
                <h2 className="text-lg font-bold text-foreground">Köprüüstü Aygıtları</h2>
                <p className="text-xs text-muted-foreground">
                  VHF, DSC, ECDIS, radar, NAVTEX ve diğer seyir/iletişim cihazları için hızlı erişim butonları.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {bridgeDevices.map((device) => {
                  const DeviceIcon = device.icon;
                  return (
                    <button
                      key={device.id}
                      type="button"
                      className="group flex h-full flex-col items-start gap-2 rounded-xl border border-border/50 bg-background/80 p-3 text-left shadow-sm transition hover:border-primary/40 hover:bg-card"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${device.accent} text-white shadow-sm transition-transform group-hover:scale-110`}>
                        <DeviceIcon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">{device.label}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{device.description}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                        {device.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

const bridgeDevices = [
  {
    id: "vhf",
    label: "VHF Telsiz",
    description: "CH16 dinleme, DSC çağrı alarmı ve günlük kayıt kontrolleri.",
    status: "GMDSS",
    icon: Radio,
    accent: "from-sky-500 via-cyan-500 to-emerald-500",
  },
  {
    id: "dsc",
    label: "DSC Konsolu",
    description: "MMSI doğrulama, test çağrısı ve distress/mayday prosedürleri.",
    status: "ALARM",
    icon: SatelliteDish,
    accent: "from-amber-500 via-orange-500 to-rose-500",
  },
  {
    id: "ecdis",
    label: "ECDIS",
    description: "Elektronik harita güncellemeleri, rota planı ve sensör overlay kontrolü.",
    status: "SEYİR",
    icon: Map,
    accent: "from-indigo-500 via-blue-600 to-sky-500",
  },
  {
    id: "radar",
    label: "Radar / ARPA",
    description: "CPA/TCPA izlemesi, guard zone ve yağmur/deniz clutter optimizasyonu.",
    status: "İZLEME",
    icon: Radar,
    accent: "from-purple-500 via-violet-500 to-indigo-500",
  },
  {
    id: "navtex",
    label: "NAVTEX",
    description: "MSI yayınları, kıyı istasyon seçimi ve otomatik kaydedilen mesajlar.",
    status: "MSI",
    icon: ScrollText,
    accent: "from-emerald-500 via-green-500 to-teal-500",
  },
  {
    id: "ais",
    label: "AIS",
    description: "Statik/voyage verileri, güvenlik mesajı (safety-related) gönderme ve hedef listesi.",
    status: "TRAFFIC",
    icon: Navigation,
    accent: "from-cyan-500 via-blue-500 to-slate-500",
  },
  {
    id: "gyro",
    label: "Gyro & Manyetik Pusula",
    description: "Error kontrolü, tekrar ayarı ve manyetik/gyro heading karşılaştırması.",
    status: "KOMPAS",
    icon: Waves,
    accent: "from-sky-600 via-blue-500 to-indigo-500",
  },
  {
    id: "gps",
    label: "GNSS Alıcısı",
    description: "Konum doğruluğu, HDOP/PDOP izlemesi ve bütünlük alarmlarının takibi.",
    status: "GPS",
    icon: Navigation,
    accent: "from-amber-400 via-yellow-500 to-lime-500",
  },
  {
    id: "vsat",
    label: "VSAT / İnternet",
    description: "Bağlantı durumu, bant genişliği kullanımı ve yedekleme (L-band/4G) geçişi.",
    status: "BAĞLANTI",
    icon: SatelliteDish,
    accent: "from-teal-500 via-cyan-500 to-blue-500",
  },
];

const crewHierarchy = [
  {
    department: "Köprüüstü / Operasyon",
    focus: "Seyir, emniyet ve yük operasyonu yönetimi",
    colorCode: "KAPTANLIK",
    roles: [
      {
        rank: "Kaptan (Master)",
        responsibility: "Geminin en üst amiri; seyir, güvenlik, yük ve idari tüm kararlar.",
        reportsTo: "Şirket",
      },
      {
        rank: "Birinci Zabit (Chief Officer)",
        responsibility: "Güverte departmanı yöneticisi; yük operasyonları, emniyet ekipmanları, ISM/ISPS kayıtları.",
        reportsTo: "Kaptan",
      },
      {
        rank: "İkinci Zabit (Second Officer)",
        responsibility: "Seyir planı, harita ve yayınların güncellemesi, köprüüstü vardiyaları, GMDSS sorumlusu.",
        reportsTo: "Kaptan",
      },
      {
        rank: "Üçüncü Zabit (Third Officer)",
        responsibility: "Emniyet ekipmanlarının günlük kontrolleri, köprüüstü vardiyaları ve mustering listeleri.",
        reportsTo: "Birinci Zabit",
      },
      {
        rank: "Reis / Bosun",
        responsibility: "Güverte tayfalarının lideri; bakım planlarının uygulanması ve güverte operasyonlarının koordinasyonu.",
        reportsTo: "Birinci Zabit",
      },
      {
        rank: "Usta Gemici & Gemiciler",
        responsibility: "Güverte vardiyaları, halat operasyonu, yük güverte güvenlik ve bakım işleri.",
        reportsTo: "Reis",
      },
      {
        rank: "Stajyer Zabiti / Güverte Stajyeri",
        responsibility: "Seyir ve operasyon süreçlerine destek; eğitim amaçlı görevler.",
        reportsTo: "Kaptan",
      },
    ],
  },
  {
    department: "Makine / Teknik",
    focus: "Ana makine, yardımcı sistemler ve enerji yönetimi",
    colorCode: "MAKİNE",
    roles: [
      {
        rank: "Baş Mühendis (Chief Engineer)",
        responsibility: "Makine departmanı amiri; enerji, bakım stratejisi ve emniyetli operasyon.",
        reportsTo: "Kaptan",
      },
      {
        rank: "İkinci Mühendis (Second Engineer)",
        responsibility: "Günlük makina operasyonu, PMS uygulamaları, yakıt transferi ve teknik raporlama.",
        reportsTo: "Baş Mühendis",
      },
      {
        rank: "Üçüncü/Dördüncü Mühendis",
        responsibility: "Aux makineler, kazan, safra ve seperatör bakımları; vardiya mühendisliği.",
        reportsTo: "İkinci Mühendis",
      },
      {
        rank: "Elektrik Zabiti (ETO)",
        responsibility: "Elektrik-elektronik sistemler, köprüüstü cihazları, alarm ve otomasyon bakımı.",
        reportsTo: "Baş Mühendis",
      },
      {
        rank: "Yağcı / Fitter / Silici",
        responsibility: "Makine dairesi vardiyaları, yağlama ve bakım işleri, kaynak ve metal işleri desteği.",
        reportsTo: "İkinci Mühendis",
      },
      {
        rank: "Makine Stajyeri",
        responsibility: "Makine vardiyalarına destek, sistem kontrolleri ve bakım süreçlerine katılım.",
        reportsTo: "Baş Mühendis",
      },
    ],
  },
  {
    department: "İkmal / Yaşam Mahalli",
    focus: "Kumanya, ikmal, gemi içi düzen ve mürettebat hizmetleri",
    colorCode: "IKMAL",
    roles: [
      {
        rank: "Aşçı (Cook)",
        responsibility: "Gemi kumanyasının yönetimi, yemeklerin hazırlanması ve gıda hijyeninin sağlanması.",
        reportsTo: "Kaptan",
      },
      {
        rank: "Kamarot / Steward",
        responsibility: "Yaşam mahalli düzeni, kumanya servisleri, vardiya ve temizlik planlarının uygulanması.",
        reportsTo: "Aşçı",
      },
      {
        rank: "Yağlı Vardiya Destekleri",
        responsibility: "Can salları, yangın ekipmanı ve acil durum istasyonları için ikmal desteği.",
        reportsTo: "Birinci Zabit",
      },
    ],
  },
];
