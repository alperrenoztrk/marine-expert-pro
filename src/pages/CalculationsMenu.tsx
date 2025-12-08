import type { ComponentType, SVGProps } from "react";
import { calculationCategories, type SectionId, type SectionStatus } from "@/data/calculationCenterConfig";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookOpen, Brain, Calculator, ChevronRight, ListChecks, Scale, Sigma } from "lucide-react";
import { Link } from "react-router-dom";

const sectionIconMap: Record<SectionId, ComponentType<SVGProps<SVGSVGElement>>> = {
  topics: BookOpen,
  calculations: Calculator,
  formulas: Sigma,
  rules: Scale,
  assistant: Brain,
  quiz: ListChecks,
};

const statusConfig: Record<SectionStatus, { label: string; className: string }> = {
  live: { label: "Hazır", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200" },
  info: { label: "Bilgi", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200" },
  external: { label: "Harici", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200" },
  upcoming: { label: "Yakında", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200" },
};

export default function CalculationsMenu() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      data-no-translate
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Hesaplama Merkezi
          </h1>
        </div>

        <div className="space-y-8">
          {calculationCategories.map((category, index) => (
            <section
              key={category.id}
              className="relative overflow-hidden rounded-3xl bg-white/85 dark:bg-slate-900/70 backdrop-blur-sm border border-white/60 dark:border-slate-800/60 p-8 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-blue-600/0 opacity-0 pointer-events-none transition-all duration-500 group-hover:opacity-100" />

              <div className="relative flex flex-col gap-4 md:flex-row md:items-center">
                <div className={cn("rounded-2xl p-4 shadow-lg text-white bg-gradient-to-br", category.accent)}>
                  <category.icon className="h-10 w-10" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Modül {index + 1}</p>
                  <h2 className="text-3xl font-bold text-foreground mt-1">{category.title}</h2>
                  <p className="text-muted-foreground mt-1">{category.subtitle}</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.sections.map((section) => {
                  const Icon = sectionIconMap[section.id];
                  const status: SectionStatus = section.status ?? "live";
                  const statusMeta = statusConfig[status];
                  const target = section.href ?? `/calculations/${category.id}/${section.id}`;

                  return (
                    <Link
                      key={`${category.id}-${section.id}`}
                      to={target}
                      className="group/link relative flex items-start gap-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/60 p-4 hover:border-blue-400/80 dark:hover:border-blue-500/60 transition-all duration-300"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{section.label}</p>
                          <Badge className={cn("text-xs font-semibold", statusMeta.className)}>{statusMeta.label}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                      </div>
                      <ChevronRight className="mt-1 h-5 w-5 text-slate-400 group-hover/link:text-blue-500 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
