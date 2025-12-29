import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { calculationFormulas } from "@/data/formulas/calculationFormulas";

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
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#5f7dff] via-[#3f66ff] to-[#2F5BFF] text-white shadow-[0_14px_30px_rgba(47,91,255,0.28)]";

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

export function CalculationMenuCard({ id, title, icon: Icon, to, href, disabled }: CalculationMenuCardProps) {
  const formulaMeta = id ? calculationFormulas[id] : undefined;
  const content = (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className={iconContainerStyle}>
          <Icon className="h-7 w-7" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p className="text-[17px] font-semibold leading-snug text-slate-100">{title}</p>
        </div>
      </div>
      {formulaMeta && (
        <div className="rounded-lg border border-slate-800/60 bg-slate-950/60 p-3 text-xs text-slate-200">
          <div className="font-medium text-slate-100">Formül</div>
          <div className="mt-1 leading-relaxed text-slate-300">{formulaMeta.formula}</div>
          <div className="mt-3 font-medium text-slate-100">Kaynak</div>
          {formulaMeta.sourceUrl ? (
            <a
              href={formulaMeta.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex text-sky-400 underline-offset-2 transition hover:text-sky-300 hover:underline"
            >
              {formulaMeta.source} — {formulaMeta.edition}
            </a>
          ) : (
            <div className="mt-1 text-slate-300">
              {formulaMeta.source} — {formulaMeta.edition}
            </div>
          )}
          <div className="mt-2 text-[11px] text-slate-400">Son güncelleme: {formulaMeta.lastUpdated}</div>
        </div>
      )}
    </div>
  );

  const sharedClassName = cn(
    "group block rounded-[22px] border border-slate-800/70 bg-slate-950/70 p-4 shadow-[0_14px_40px_rgba(47,91,255,0.18)] transition-all duration-200 backdrop-blur",
    disabled
      ? "pointer-events-none opacity-60"
      : "hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(47,91,255,0.22)]",
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
  children?: ReactNode;
}

export function CalculationGridScreen({ title, subtitle, eyebrow, items, children }: CalculationGridScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10 sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-8 h-60 w-60 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute top-24 right-4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-3 text-center">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/80">{eyebrow}</p>
          )}
          <h1 className="text-3xl font-black leading-tight text-slate-50 sm:text-4xl md:text-[34px]">{title}</h1>
          {subtitle && <p className="text-base text-slate-300">{subtitle}</p>}
        </header>

        {children ?? <CalculationGrid items={items ?? []} />}
      </div>
    </div>
  );
}
