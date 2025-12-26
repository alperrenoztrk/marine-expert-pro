import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { calculationCategories, sectionIconMap } from "@/data/calculationCenterConfig";
import { BookOpen, ChevronRight, ArrowLeft, GraduationCap } from "lucide-react";

export default function LessonsPage() {
  const highRefreshRateStyles: CSSProperties = {
    ["--frame-rate" as string]: "120",
    ["--animation-duration" as string]: "8.33ms",
    ["--transition-duration" as string]: "16.67ms",
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4 py-8 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]"
      data-no-translate
      style={highRefreshRateStyles}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6">
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            Hesaplama Merkezi
          </div>
          <h1 className="text-2xl font-bold text-foreground">Dersler</h1>
          <div className="flex justify-center">
            <Link
              to="/calculations"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Link>
          </div>
        </header>

        <div className="flex flex-col gap-6">
          {calculationCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <section key={category.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${category.accent} text-white shadow-lg`}
                  >
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{category.title}</h2>
                    <p className="text-xs text-muted-foreground">{category.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                  {/* Konu Anlatımı Butonu */}
                  <Link
                    to={`/lessons/${category.id}/topics`}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-card/80 p-3 backdrop-blur transition-all hover:border-primary/30 hover:bg-card hover:shadow-md"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${category.accent} text-white transition-transform group-hover:scale-110`}
                    >
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <span className="text-center text-xs font-medium text-foreground">Konu Anlatımı</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>

                  {category.sections.map((section) => {
                    const SectionIcon = sectionIconMap[section.id];
                    return (
                      <Link
                        key={`${category.id}-${section.id}`}
                        to={section.href || "#"}
                        className="group flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-card/80 p-3 backdrop-blur transition-all hover:border-primary/30 hover:bg-card hover:shadow-md"
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${category.accent} text-white transition-transform group-hover:scale-110`}
                        >
                          <SectionIcon className="h-4 w-4" />
                        </div>
                        <span className="text-center text-xs font-medium text-foreground">{section.label}</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-card/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
            <BookOpen className="h-4 w-4" />
            Ders modülleri ayrı sayfalarda açılır.
          </div>
        </div>
      </div>
    </div>
  );
}

