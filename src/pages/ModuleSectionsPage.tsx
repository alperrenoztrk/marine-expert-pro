import type { CategoryId, SectionId, SectionStatus } from "@/data/calculationCenterConfig";
import { calculationCategories, sectionIconMap } from "@/data/calculationCenterConfig";
import { Button } from "@/components/ui/button";
import { CalculationGridScreen, type CalculationGridItem } from "@/components/ui/calculation-grid";
import { Link } from "react-router-dom";

interface ModuleSectionsPageProps {
  categoryId: CategoryId;
}

export function ModuleSectionsPage({ categoryId }: ModuleSectionsPageProps) {
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
    <CalculationGridScreen
      eyebrow="Hesaplama Menüsü"
      title={category.title}
      subtitle={category.subtitle}
      items={category.sections.map((section) => {
        const Icon = sectionIconMap[section.id as SectionId];
        const status = section.status ?? "live";
        const target = section.href ?? `/calculations/${category.id}/${section.id}`;
        const isExternal = status === "external";
        const isUpcoming = status === "upcoming";

        return {
          id: section.id,
          title: section.label,
          icon: Icon,
          to: !isUpcoming && !isExternal ? target : undefined,
          href: !isUpcoming && isExternal ? target : undefined,
          disabled: isUpcoming,
        } satisfies CalculationGridItem;
      })}
    />
  );
}

export default ModuleSectionsPage;
