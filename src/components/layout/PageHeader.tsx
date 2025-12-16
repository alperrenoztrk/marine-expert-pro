import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  className?: string;
  actions?: React.ReactNode;
  variant?: "default" | "compact";
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconClassName,
  className,
  actions,
  variant = "default",
}: PageHeaderProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4",
        isCompact ? "py-2" : "py-1",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("space-y-1", isCompact ? "" : "pt-1")}>
          <div className="flex items-center gap-3">
            {Icon ? (
              <Icon
                className={cn(
                  isCompact ? "h-6 w-6" : "h-10 w-10",
                  "text-sky-600 dark:text-sky-400",
                  iconClassName
                )}
              />
            ) : null}

            <h1
              className={cn(
                isCompact ? "text-lg" : "text-3xl sm:text-4xl",
                "font-bold bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent"
              )}
            >
              {title}
            </h1>
          </div>

          {description ? (
            <p
              className={cn(
                isCompact ? "text-xs" : "text-base sm:text-lg",
                "text-muted-foreground"
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

