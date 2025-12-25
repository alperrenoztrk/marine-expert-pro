import React from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { CalculationHero } from "@/components/ui/calculation-hero";
import type { LucideIcon } from "lucide-react";

interface CalculationLayoutProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  hero?: {
    title?: string;
    description?: string;
    imageSrc: string;
    imageAlt: string;
  };
  actions?: React.ReactNode;
  rightRail?: React.ReactNode;
  below?: React.ReactNode;
  stickyHeader?: boolean;
  maxWidthClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export function CalculationLayout({
  title,
  description,
  icon,
  hero,
  actions,
  rightRail,
  below,
  stickyHeader = false,
  maxWidthClassName = "max-w-7xl",
  className,
  children,
}: CalculationLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen p-4 relative overflow-hidden",
        // Unified “marine” background (light/dark only).
        "bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800",
        // subtle “wave lights”
        "bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.14),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(20,184,166,0.12),transparent_50%)]",
        className
      )}
    >
      <div className={cn(maxWidthClassName, "mx-auto space-y-6")}>
        {stickyHeader ? (
          <div className="sticky top-0 z-40 -mx-4 px-4 py-3 bg-background/40 backdrop-blur-md border-b border-white/10">
            <PageHeader
              title={title}
              description={description}
              icon={icon}
              actions={actions}
              variant="compact"
            />
          </div>
        ) : null}

        {hero ? (
          <CalculationHero
            title={hero.title ?? title}
            description={hero.description ?? description}
            imageSrc={hero.imageSrc}
            imageAlt={hero.imageAlt}
            hideText
          />
        ) : null}

        {!stickyHeader ? (
          <PageHeader title={title} description={description} icon={icon} actions={actions} />
        ) : null}

        {rightRail ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 space-y-6">{children}</div>
              <aside className="lg:col-span-1">
                <div className="sticky top-4">{rightRail}</div>
              </aside>
            </div>
            {below ? <div className="space-y-6">{below}</div> : null}
          </>
        ) : (
          <div className="space-y-6">
            {children}
            {below}
          </div>
        )}
      </div>
    </div>
  );
}

