import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { calculationCategories, sectionIconMap } from "@/data/calculationCenterConfig";
import { Anchor, BookOpen, ChevronDown, ChevronRight, Users2 } from "lucide-react";

const crewHierarchy = [
  {
    department: "Kaptan ve Güverte",
    accent: "from-sky-500 via-blue-500 to-indigo-500",
    icon: Anchor,
    roles: [
      { title: "Kaptan / Master", responsibility: "Gemide en yüksek otorite, emniyet ve sefer yönetimi." },
      { title: "1. Zabit (Chief Officer)", responsibility: "Güverte operasyonları, yük emniyeti ve güverte ekibi liderliği." },
      { title: "2. Zabit", responsibility: "Seyir planlama, köprüüstü vardiyası ve güvenlik ekipmanlarının takibi." },
      { title: "3. Zabit", responsibility: "Can kurtarma, yangın donanımı kontrolleri ve köprüüstü vardiyası." },
      { title: "Lostromo / Bosun", responsibility: "Güverte tayfalarının koordinasyonu ve bakım planlarının uygulanması." },
      { title: "Usta Gemici / Able Seafarer", responsibility: "Güverte operasyonları, manevra ve bakım faaliyetleri." },
      { title: "Güverte Gemici / OS", responsibility: "Güverte bakım işleri, raspa-boya ve temel vardiya görevleri." },
      { title: "Stajyer Güverte Zabiti", responsibility: "Vardiya eğitimleri ve seyir uygulamaları." }
    ]
  },
  {
    department: "Makine",
    accent: "from-amber-500 via-orange-500 to-rose-500",
    icon: Users2,
    roles: [
      { title: "Baş Mühendis (Chief Engineer)", responsibility: "Makine dairesi yönetimi, enerji ve bakım planlaması." },
      { title: "2. Mühendis", responsibility: "Ana makine, yardımcı makineler ve günlük bakım faaliyetlerinin takibi." },
      { title: "3. Mühendis", responsibility: "Jeneratörler, kazan ve yakıt sistemlerinin izlenmesi." },
      { title: "4. Mühendis", responsibility: "Yağlama, soğutma ve yardımcı ekipmanların bakımı." },
      { title: "Makine Lostromosu / Pumpman", responsibility: "Tankçi gemilerde pompa dairesi ve transfer operasyonları." },
      { title: "Yağcı / Oiler", responsibility: "Makine dairesi vardiyası, yağlama ve temizlik görevleri." },
      { title: "Makine Stajyeri", responsibility: "Makine vardiya eğitimi ve bakım destekleri." }
    ]
  },
  {
    department: "Gemi Hizmetleri ve Destek",
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    icon: Users2,
    roles: [
      { title: "Purser / İdari Sorumlu", responsibility: "Mürettebat idaresi, evrak işleri ve ikmal süreci yönetimi." },
      { title: "Aşçıbaşı / Chief Cook", responsibility: "Kambuza liderlik, menü planlama ve gıda güvenliği." },
      { title: "Aşçı Yardımcısı", responsibility: "Yemek hazırlığı, temizlik ve kiler düzeni." },
      { title: "Kamarot / Steward", responsibility: "Temizlik, çamaşırhane ve yaşam mahalleri düzeni." }
    ]
  }
];

export default function CalculationsMenu() {
  const [showLessons, setShowLessons] = useState(true);
  const [showCrew, setShowCrew] = useState(false);

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

          <button
            type="button"
            onClick={() => setShowCrew((prev) => !prev)}
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-500 text-white shadow group-hover:scale-105">
              <Users2 className="h-4 w-4" />
            </span>
            <span>Gemi Personeli</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${showCrew ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          {showCrew && (
            <div className="grid gap-4 sm:grid-cols-2">
              {crewHierarchy.map((group) => {
                const Icon = group.icon;
                return (
                  <section key={group.department} className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm backdrop-blur">
                    <div className="mb-3 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${group.accent} text-white shadow-lg`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{group.department}</h3>
                        <p className="text-xs text-muted-foreground">Hiyerarşi sıralamasına göre görevler</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {group.roles.map((role) => (
                        <div
                          key={role.title}
                          className="rounded-xl border border-border/40 bg-background/60 p-3 transition hover:border-primary/30 hover:shadow-sm"
                        >
                          <div className="text-sm font-semibold text-foreground">{role.title}</div>
                          <p className="text-xs text-muted-foreground">{role.responsibility}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
