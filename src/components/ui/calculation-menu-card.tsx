import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export interface CalculationMenuCardProps {
  title: string;
  icon: LucideIcon;
  to?: string;
  href?: string;
  disabled?: boolean;
  className?: string;
}

export const CalculationMenuCard = React.forwardRef<HTMLAnchorElement, CalculationMenuCardProps>(
  ({ title, icon: Icon, to, href, disabled = false, className }, ref) => {
    const content = (
      <div className="flex items-center gap-4">
        {/* Icon Container */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-md">
          <Icon className="h-7 w-7" strokeWidth={2} />
        </div>
        {/* Title */}
        <h3 className="text-base font-bold text-blue-600 dark:text-blue-400 leading-tight">
          {title}
        </h3>
      </div>
    );

    const sharedClassName = cn(
      "group block rounded-2xl bg-white/90 dark:bg-slate-800/90 p-4 shadow-sm border border-blue-100/50 dark:border-blue-900/30 backdrop-blur-sm transition-all duration-200",
      disabled ? "pointer-events-none opacity-50" : "hover:shadow-lg hover:scale-[1.02] hover:bg-white dark:hover:bg-slate-800 cursor-pointer",
      className
    );

    if (to && !disabled) {
      return (
        <Link ref={ref} to={to} className={sharedClassName}>
          {content}
        </Link>
      );
    }

    if (href && !disabled) {
      return (
        <a ref={ref} href={href} target="_blank" rel="noreferrer" className={sharedClassName}>
          {content}
        </a>
      );
    }

    return (
      <div className={sharedClassName}>
        {content}
      </div>
    );
  }
);

CalculationMenuCard.displayName = "CalculationMenuCard";
