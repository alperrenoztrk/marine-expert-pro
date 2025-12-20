import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SectionConfig, SectionStatus } from "@/data/calculationCenterConfig";

type CardSize = "module" | "section";

const statusTokens: Record<SectionStatus, { label: string; className: string }> = {
  live: {
    label: "Hazır",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100",
  },
  info: {
    label: "Bilgi",
    className: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-100",
  },
  external: {
    label: "Harici",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-100",
  },
  upcoming: {
    label: "Yakında",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100",
  },
};

const sizeTokens: Record<CardSize, { padding: string; icon: string; title: string; subtitle: string }> = {
  module: { padding: "p-6 md:p-7", icon: "h-11 w-11", title: "text-2xl", subtitle: "text-base" },
  section: { padding: "p-5", icon: "h-9 w-9", title: "text-xl", subtitle: "text-sm" },
};

export interface ModuleCardProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
  status?: SectionStatus;
  badge?: string;
  to?: string;
  href?: string;
  ctaLabel?: string;
  sections?: SectionConfig[];
  size?: CardSize;
}

export const ModuleCard = React.forwardRef<HTMLAnchorElement, ModuleCardProps>(
  (
    {
      title,
      subtitle,
      icon: Icon,
      accent,
      status = "live",
      badge,
      to,
      href,
      ctaLabel = "Görüntüle",
      sections,
      size = "module",
      className,
      ...rest
    },
    ref,
  ) => {
    const statusMeta = statusTokens[status];
    const disabled = status === "upcoming";
    const sizeMeta = sizeTokens[size];
    const showExternal = status === "external" || (!!href && !to);

    const content = (
      <>
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", accent, "pointer-events-none")} aria-hidden />
        <div className="absolute inset-0 bg-card/80 backdrop-blur-md" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/60 via-white/20 to-transparent dark:from-white/10 dark:via-white/5" aria-hidden />
        <div className={cn("relative z-10 flex h-full flex-col gap-5", sizeMeta.padding)}>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "relative flex items-center justify-center rounded-2xl bg-white/80 p-3 text-foreground shadow-inner backdrop-blur-md dark:bg-black/30",
              )}
              aria-hidden
            >
              <Icon className={cn("text-primary", sizeMeta.icon)} strokeWidth={2.25} />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-white/0 opacity-0 transition group-hover:opacity-100 dark:from-white/10" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                {badge && <Badge variant="outline" className="border-white/50 bg-white/70 text-xs font-semibold backdrop-blur dark:border-white/10 dark:bg-white/5">{badge}</Badge>}
                <Badge className={cn("text-xs font-semibold", statusMeta.className)}>{statusMeta.label}</Badge>
              </div>
              <h3 className={cn("font-bold text-foreground drop-shadow-sm", sizeMeta.title)}>{title}</h3>
              <p className={cn("text-muted-foreground", sizeMeta.subtitle)}>{subtitle}</p>
            </div>
            {showExternal && <ExternalLink className="mt-1 h-4 w-4 text-muted-foreground" aria-hidden />}
          </div>

          {sections?.length ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="list">
              {sections.map((section) => {
                const childStatus = statusTokens[section.status ?? "live"];
                return (
                  <div
                    key={section.id}
                    className="flex items-start justify-between rounded-2xl border border-white/50 bg-white/70 p-3 text-sm shadow-sm backdrop-blur dark:border-white/5 dark:bg-white/5"
                    role="listitem"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{section.label}</p>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </div>
                    <Badge className={cn("text-[11px] font-semibold", childStatus.className)}>{section.badge ?? childStatus.label}</Badge>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span>{ctaLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </div>
        </div>
      </>
    );

    const sharedClassName = cn(
      "group relative block h-full overflow-hidden rounded-3xl border border-border/70 bg-card/80 backdrop-blur-md text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      disabled ? "pointer-events-none opacity-60" : "hover:-translate-y-0.5 hover:shadow-xl",
      className,
    );

    return (
      <div
        aria-label={`${title} - ${ctaLabel}`}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={sharedClassName}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
        {content}
      </div>
    );
  },
);

ModuleCard.displayName = "ModuleCard";
