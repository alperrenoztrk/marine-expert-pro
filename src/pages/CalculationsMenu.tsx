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
  Waves
} from "lucide-react";

export default function CalculationsMenu() {
  const [showLessons, setShowLessons] = useState(false);
  const [showCrew, setShowCrew] = useState(false);
  const [showBridgeDevices, setShowBridgeDevices] = useState(false);
  const [showMachinery, setShowMachinery] = useState(false);

  const machinerySystems = [
    {
      name: "Ana Makine (Sevk Sistemi)",
      description:
        "Ana dizel makine, türbin ve diesel-electric tahrik kombinasyonlarının devreye alma, yük paylaşımı ve seyir performansını izle",
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
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

