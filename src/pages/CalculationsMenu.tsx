import { useCallback, useRef } from "react";
import type { KeyboardEvent } from "react";
import { calculationCategories } from "@/data/calculationCenterConfig";
import { ModuleCard } from "@/components/ui/module-card";

export default function CalculationsMenu() {
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleKeyNavigation = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const focusable = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!focusable.length) return;
    const currentIndex = focusable.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = focusable[(currentIndex + 1 + focusable.length) % focusable.length];
      next?.focus();
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const previous = focusable[(currentIndex - 1 + focusable.length) % focusable.length];
      previous?.focus();
    }
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-6 py-12 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]"
      data-no-translate
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            Modül panosu
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black leading-tight text-foreground sm:text-5xl">Hesaplama Merkezi</h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Tüm stabilite, seyir, çevre, güvenlik ve operasyon modülleri tek sayfada. Kartlardaki rozetler durumunu, CTA’lar ise sizi doğrudan ilgili arayüze taşır.
            </p>
          </div>
        </header>

        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          role="list"
          aria-label="Hesaplama merkezindeki modüller"
          onKeyDown={handleKeyNavigation}
        >
          {calculationCategories.map((category, index) => (
            <div key={category.id} role="listitem">
              <ModuleCard
                ref={(el) => (cardRefs.current[index] = el)}
                title={category.title}
                subtitle={category.subtitle}
                icon={category.icon}
                accent={category.accent}
                status={category.status ?? "live"}
                badge={category.badge}
                sections={category.sections}
                to={`/hub/${category.id}`}
                ctaLabel={category.ctaLabel ?? "Modüle git"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
