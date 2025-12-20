import type { CategoryId, SectionId, SectionStatus } from "@/data/calculationCenterConfig";
import { calculationCategories, sectionIconMap } from "@/data/calculationCenterConfig";
import { Button } from "@/components/ui/button";
import { CalculationMenuCard } from "@/components/ui/calculation-menu-card";
import { Link } from "react-router-dom";

interface ModuleSectionsPageProps {
  categoryId: CategoryId;
  backHref?: string;
}

export function ModuleSectionsPage({ categoryId, backHref = "/calculations" }: ModuleSectionsPageProps) {
  const category = calculationCategories.find((entry) => entry.id === categoryId);

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6">
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-8 sm:px-6 sm:py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full bg-indigo-300/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-sky-300/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black text-blue-700 dark:text-blue-400 sm:text-4xl">
            {category.title}
          </h1>
          {category.subtitle && (
            <p className="mt-2 text-muted-foreground">{category.subtitle}</p>
          )}
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {category.sections.map((section) => {
            const Icon = sectionIconMap[section.id as SectionId];
            const status = section.status ?? "live";
            const target = section.href ?? `/calculations/${category.id}/${section.id}`;
            const isExternal = status === "external";
            const isUpcoming = status === "upcoming";

            return (
              <CalculationMenuCard
                key={section.id}
                title={section.label}
                icon={Icon}
                to={!isUpcoming && !isExternal ? target : undefined}
                href={!isUpcoming && isExternal ? target : undefined}
                disabled={isUpcoming}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ModuleSectionsPage;
