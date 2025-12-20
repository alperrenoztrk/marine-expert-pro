import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { calculationCategories, sectionIconMap } from "@/data/calculationCenterConfig";
import { ChevronRight } from "lucide-react";
export default function CalculationsMenu() {
  const highRefreshRateStyles: CSSProperties = {
    // Ensure the calculations menu animates at 120Hz for ultra-smooth interactions
    ['--frame-rate' as string]: "120",
    ['--animation-duration' as string]: "8.33ms",
    ['--transition-duration' as string]: "16.67ms"
  };
  return <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4 py-8 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]" data-no-translate style={highRefreshRateStyles}>
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
        </header>

        {/* Categories with direct links */}
        <div className="flex flex-col gap-6">
          {calculationCategories.map(category => {
          const CategoryIcon = category.icon;
          return <section key={category.id} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${category.accent} text-white shadow-lg`}>
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  
                </div>

                {/* Section Links - Grid */}
                
              </section>;
        })}
        </div>
      </div>
    </div>;
}