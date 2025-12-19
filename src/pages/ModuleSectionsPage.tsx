import type { CategoryId, SectionId, SectionStatus } from "@/data/calculationCenterConfig";
import { calculationCategories, sectionIconMap } from "@/data/calculationCenterConfig";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "@/components/ui/module-card";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const statusCTA: Record<SectionStatus, string> = {
  live: "Aç",
  info: "Bilgi",
  external: "Harici sayfa",
  upcoming: "Yakında",
};

interface ModuleSectionsPageProps {
  categoryId: CategoryId;
  backHref?: string;
}

export function ModuleSectionsPage({ categoryId, backHref = "/calculations" }: ModuleSectionsPageProps) {
  const category = calculationCategories.find((entry) => entry.id === categoryId);

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-8 shadow-lg">
          <p className="text-lg font-semibold text-foreground">Modül bulunamadı</p>
          <p className="text-sm text-muted-foreground">İstediğiniz menü mevcut değil.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/calculations">Hesaplama Merkezine dön</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-6 py-12 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]"
      data-no-translate
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{category.badge ?? "Modül"}</p>
          <h1 className="text-4xl font-black leading-tight text-foreground sm:text-5xl">{category.title}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{category.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list" aria-label={`${category.title} bölümleri`}>
          {category.sections.map((section) => {
            const Icon = sectionIconMap[section.id as SectionId];
            const status = section.status ?? "live";
            const target = section.href ?? `/calculations/${category.id}/${section.id}`;
            const isExternal = status === "external";
            const isUpcoming = status === "upcoming";
            return (
              <div key={section.id} role="listitem">
                <ModuleCard
                  title={section.label}
                  subtitle={section.description}
                  icon={Icon}
                  accent={category.accent}
                  status={status}
                  badge={section.badge}
                  to={!isUpcoming && !isExternal ? target : undefined}
                  href={!isUpcoming && isExternal ? target : undefined}
                  ctaLabel={section.ctaLabel ?? statusCTA[status]}
                  size="section"
                  className={cn(status === "upcoming" && "opacity-70")}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ModuleSectionsPage;
