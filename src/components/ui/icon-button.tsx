import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

const iconButtonVariants = cva(
  "group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl p-4 md:p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in flex items-center gap-4",
  {
    variants: {
      variant: {
        primary: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-blue-500/10",
        secondary: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-emerald-500/10",
        warning: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-amber-500/10",
        danger: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-red-500/10",
        purple: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-purple-500/10",
        cyan: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-cyan-500/10",
        pink: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-pink-500/10",
      },
      size: {
        default: "p-4 md:p-5",
        sm: "p-3 md:p-4",
        lg: "p-5 md:p-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

const iconContainerVariants = cva(
  "relative p-3 md:p-4 rounded-xl shadow-md transition-all duration-300 group-hover:scale-105",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-br from-blue-500 to-blue-600",
        secondary: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        warning: "bg-gradient-to-br from-amber-500 to-amber-600",
        danger: "bg-gradient-to-br from-red-500 to-rose-600",
        purple: "bg-gradient-to-br from-purple-500 to-violet-600",
        cyan: "bg-gradient-to-br from-cyan-500 to-cyan-600",
        pink: "bg-gradient-to-br from-pink-500 to-pink-600",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const textVariants = cva(
  "text-lg md:text-xl font-bold transition-all duration-300",
  {
    variants: {
      variant: {
        primary: "text-blue-600 dark:text-blue-400",
        secondary: "text-emerald-600 dark:text-emerald-400",
        warning: "text-amber-600 dark:text-amber-400",
        danger: "text-red-600 dark:text-red-400",
        purple: "text-purple-600 dark:text-purple-400",
        cyan: "text-cyan-600 dark:text-cyan-400",
        pink: "text-pink-600 dark:text-pink-400",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const descriptionVariants = cva(
  "text-sm text-muted-foreground mt-1",
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        warning: "",
        danger: "",
        purple: "",
        cyan: "",
        pink: "",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface IconButtonProps extends VariantProps<typeof iconButtonVariants> {
  icon: LucideIcon;
  label: string;
  description?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  animationDelay?: number;
  showArrow?: boolean;
  iconClassName?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  description,
  to,
  href,
  onClick,
  variant,
  size,
  className,
  animationDelay = 0,
  showArrow = false,
  iconClassName,
}) => {
  const content = (
    <>
      {/* Icon container */}
      <div className="flex-shrink-0">
        <div className={cn(iconContainerVariants({ variant }))}>
          <Icon className={cn("w-6 h-6 md:w-7 md:h-7 text-white", iconClassName)} strokeWidth={2} />
        </div>
      </div>
      
      {/* Label and description */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(textVariants({ variant }))}>
          {label}
        </h3>
        {description && (
          <p className={cn(descriptionVariants({ variant }))}>
            {description}
          </p>
        )}
      </div>

      {/* Arrow indicator */}
      {showArrow && (
        <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
          <svg className={cn("w-5 h-5", textVariants({ variant }))} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </>
  );

  const containerClassName = cn(iconButtonVariants({ variant, size, className }));
  const containerStyle = animationDelay > 0 ? { animationDelay: `${animationDelay}ms` } : undefined;

  if (to) {
    return (
      <Link to={to} className={containerClassName} style={containerStyle}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={containerClassName} style={containerStyle} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <div onClick={onClick} className={containerClassName} style={containerStyle} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
      {content}
    </div>
  );
};

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants, iconContainerVariants, textVariants };
