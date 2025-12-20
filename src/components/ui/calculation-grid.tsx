import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CalculationGridItem = {
  id?: string;
  title: string;
  icon: LucideIcon;
  to?: string;
  href?: string;
  disabled?: boolean;
};

interface CalculationGridProps {
  items: CalculationGridItem[];
  className?: string;
}

const iconContainerStyle =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#5f7dff] via-[#3f66ff] to-[#2F5BFF] text-white shadow-[0_14px_30px_rgba(47,91,255,0.18)]";

export function CalculationGrid({ items, className }: CalculationGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5", className)}>
      {items.map((item) => (
        <CalculationMenuCard key={item.id ?? item.title} {...item} />
      ))}
    </div>
  );
}

export interface CalculationMenuCardProps extends CalculationGridItem {}

export function CalculationMenuCard({ title, icon: Icon, to, href, disabled }: CalculationMenuCardProps) {
  const content = (
    <div className="flex items-center gap-4">
      <div className={iconContainerStyle}>
        <Icon className="h-7 w-7" strokeWidth={2} />
      </div>
      <div className="flex-1">
        <p className="text-[17px] font-semibold leading-snug text-[#2F5BFF]">{title}</p>
      </div>
    </div>
  );

  const sharedClassName = cn(
    "group block rounded-[22px] border border-white/60 bg-white/90 p-4 shadow-[0_14px_40px_rgba(47,91,255,0.08)] transition-all duration-200",
    disabled
      ? "pointer-events-none opacity-60"
      : "hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(47,91,255,0.12)]",
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={sharedClassName} data-no-translate>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={sharedClassName} data-no-translate>
        {content}
      </a>
    );
  }

  return (
    <div className={sharedClassName} data-no-translate>
      {content}
    </div>
  );
}

interface CalculationGridScreenProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: CalculationGridItem[];
  backHref?: string;
  children?: ReactNode;
}

export function CalculationGridScreen({ title, subtitle, eyebrow, items, backHref, children }: CalculationGridScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-100 px-4 py-10 sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-8 h-60 w-60 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-24 right-4 h-72 w-72 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8">
        {backHref && (
          <div>
            <Link
              to={backHref}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#2F5BFF] shadow-sm ring-1 ring-inset ring-white/60 transition hover:-translate-y-0.5"
            >
              ← Geri
            </Link>
          </div>
        )}

        <header className="space-y-3 text-center">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2F5BFF]/70">{eyebrow}</p>
          )}
          <h1 className="text-3xl font-black leading-tight text-[#1d3e8a] sm:text-4xl md:text-[34px]">{title}</h1>
          {subtitle && <p className="text-base text-slate-600">{subtitle}</p>}
        </header>

        {children ?? <CalculationGrid items={items ?? []} />}
      </div>
    </div>
  );
}

