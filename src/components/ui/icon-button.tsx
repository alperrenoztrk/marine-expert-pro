import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { useNeonSound } from "@/hooks/useNeonSound";
import { cn } from "@/lib/utils";

type IconProp = React.ReactNode | LucideIcon;

function renderIcon(icon: IconProp, className: string) {
  if (typeof icon === "function") {
    const Icon = icon as LucideIcon;
    return <Icon className={className} strokeWidth={2} />;
  }

  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement, { className });
  }

  return icon;
}

const iconButtonVariants = cva(
  "group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm border border-white/60 dark:border-slate-800/60 p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:bg-white dark:hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "hover:shadow-blue-500/20",
        indigo: "hover:shadow-indigo-500/20",
        emerald: "hover:shadow-emerald-500/20",
        amber: "hover:shadow-amber-500/20",
        rose: "hover:shadow-rose-500/20",
        slate: "hover:shadow-slate-500/20",
        sky: "hover:shadow-sky-500/20",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const overlayVariants: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-blue-600/5",
  indigo:
    "bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5",
  emerald:
    "bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-sky-500/0 group-hover:from-emerald-500/5 group-hover:via-teal-500/5 group-hover:to-sky-500/5",
  amber:
    "bg-gradient-to-br from-amber-500/0 via-orange-500/0 to-rose-500/0 group-hover:from-amber-500/5 group-hover:via-orange-500/5 group-hover:to-rose-500/5",
  rose:
    "bg-gradient-to-br from-rose-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-rose-500/5 group-hover:via-orange-500/5 group-hover:to-amber-500/5",
  slate:
    "bg-gradient-to-br from-slate-500/0 via-zinc-500/0 to-slate-700/0 group-hover:from-slate-500/5 group-hover:via-zinc-500/5 group-hover:to-slate-700/5",
  sky:
    "bg-gradient-to-br from-sky-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-sky-500/5 group-hover:via-cyan-500/5 group-hover:to-blue-500/5",
};

const blobVariants: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  primary: "bg-blue-400/20 group-hover:bg-blue-500/30",
  indigo: "bg-indigo-400/20 group-hover:bg-indigo-500/30",
  emerald: "bg-emerald-400/20 group-hover:bg-emerald-500/30",
  amber: "bg-amber-400/20 group-hover:bg-amber-500/30",
  rose: "bg-rose-400/20 group-hover:bg-rose-500/30",
  slate: "bg-slate-400/20 group-hover:bg-slate-500/30",
  sky: "bg-sky-400/20 group-hover:bg-sky-500/30",
};

const iconGradientVariants: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  primary: "from-blue-500 to-indigo-600",
  indigo: "from-indigo-500 to-purple-600",
  emerald: "from-emerald-500 to-teal-600",
  amber: "from-amber-500 to-orange-600",
  rose: "from-rose-500 to-orange-600",
  slate: "from-slate-600 to-zinc-700",
  sky: "from-sky-500 to-cyan-600",
};

const textGradientVariants: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  primary: "bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700",
  indigo: "bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-700 group-hover:to-purple-700",
  emerald: "bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-emerald-700 group-hover:to-teal-700",
  amber: "bg-gradient-to-r from-amber-600 to-orange-600 group-hover:from-amber-700 group-hover:to-orange-700",
  rose: "bg-gradient-to-r from-rose-600 to-orange-600 group-hover:from-rose-700 group-hover:to-orange-700",
  slate: "bg-gradient-to-r from-slate-700 to-zinc-700 group-hover:from-slate-800 group-hover:to-zinc-800",
  sky: "bg-gradient-to-r from-sky-600 to-cyan-600 group-hover:from-sky-700 group-hover:to-cyan-700",
};

const bottomBarVariants: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  primary: "bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600",
  indigo: "bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500",
  emerald: "bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500",
  amber: "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500",
  rose: "bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500",
  slate: "bg-gradient-to-r from-slate-600 via-zinc-600 to-slate-800",
  sky: "bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500",
};

export interface IconButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onClick" | "onMouseEnter">,
    VariantProps<typeof iconButtonVariants> {
  icon: IconProp;
  label: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  showChevron?: boolean;
  iconClassName?: string;
  labelClassName?: string;
}

export function IconButton({
  icon,
  label,
  variant = "primary",
  to,
  href,
  className,
  style,
  onClick,
  onMouseEnter,
  showChevron = true,
  iconClassName,
  labelClassName,
  ...props
}: IconButtonProps) {
  const { playNeonClick, playNeonHover } = useNeonSound();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    playNeonClick();
    onClick?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    playNeonHover();
    onMouseEnter?.(e);
  };

  const commonProps = {
    className: cn(iconButtonVariants({ variant }), className),
    style,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    ...props,
  } as const;

  const content = (
    <>
      <div className={cn("absolute inset-0 transition-all duration-500", overlayVariants[variant])} />
      <div className={cn("absolute -top-8 -left-8 w-32 h-32 rounded-full blur-2xl transition-all duration-500", blobVariants[variant])} />

      <div className="relative flex items-center gap-6">
        <div className="flex-shrink-0 relative">
          <div
            className={cn(
              "absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500 bg-gradient-to-br",
              iconGradientVariants[variant]
            )}
          />
          <div
            className={cn(
              "relative p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 bg-gradient-to-br",
              iconGradientVariants[variant]
            )}
          >
            {renderIcon(icon, cn("w-10 h-10 text-white", iconClassName))}
          </div>
        </div>

        <div className="flex-1">
          <h2
            className={cn(
              "text-2xl font-bold bg-clip-text text-transparent transition-all duration-300",
              textGradientVariants[variant],
              labelClassName
            )}
          >
            {label}
          </h2>
        </div>

        {showChevron && (
          <div className="flex-shrink-0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br", iconGradientVariants[variant])}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left",
          bottomBarVariants[variant]
        )}
      />
    </>
  );

  if (to) {
    return (
      <Link to={to} {...(commonProps as unknown as React.ComponentProps<typeof Link>)}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} {...(commonProps as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" {...(commonProps as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}

