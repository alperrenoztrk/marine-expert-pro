import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

const iconButtonVariants = cva(
  "group relative overflow-hidden rounded-3xl backdrop-blur-sm border p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer animate-fade-in flex items-center gap-4 md:gap-6",
  {
    variants: {
      variant: {
        primary: "bg-card/80 border-border/60 hover:bg-card hover:shadow-blue-500/20",
        secondary: "bg-card/80 border-border/60 hover:bg-card hover:shadow-emerald-500/20",
        warning: "bg-card/80 border-border/60 hover:bg-card hover:shadow-amber-500/20",
        danger: "bg-card/80 border-border/60 hover:bg-card hover:shadow-red-500/20",
        purple: "bg-card/80 border-border/60 hover:bg-card hover:shadow-purple-500/20",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const iconContainerVariants = cva(
  "relative p-3 md:p-4 rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-br from-blue-500 to-indigo-600",
        secondary: "bg-gradient-to-br from-emerald-500 to-teal-600",
        warning: "bg-gradient-to-br from-amber-500 to-orange-600",
        danger: "bg-gradient-to-br from-red-500 to-rose-600",
        purple: "bg-gradient-to-br from-purple-500 to-violet-600",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const textVariants = cva(
  "text-xl md:text-2xl font-bold bg-clip-text text-transparent transition-all duration-300",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700",
        secondary: "bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-emerald-700 group-hover:to-teal-700",
        warning: "bg-gradient-to-r from-amber-600 to-orange-600 group-hover:from-amber-700 group-hover:to-orange-700",
        danger: "bg-gradient-to-r from-red-600 to-rose-600 group-hover:from-red-700 group-hover:to-rose-700",
        purple: "bg-gradient-to-r from-purple-600 to-violet-600 group-hover:from-purple-700 group-hover:to-violet-700",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const glowVariants = cva(
  "absolute -top-8 -left-8 w-32 h-32 rounded-full blur-2xl transition-all duration-500",
  {
    variants: {
      variant: {
        primary: "bg-blue-400/20 group-hover:bg-blue-500/30",
        secondary: "bg-emerald-400/20 group-hover:bg-emerald-500/30",
        warning: "bg-amber-400/20 group-hover:bg-amber-500/30",
        danger: "bg-red-400/20 group-hover:bg-red-500/30",
        purple: "bg-purple-400/20 group-hover:bg-purple-500/30",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const bottomLineVariants = cva(
  "absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600",
        secondary: "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600",
        warning: "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600",
        danger: "bg-gradient-to-r from-red-500 via-rose-500 to-red-600",
        purple: "bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600",
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
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  animationDelay?: number;
  showArrow?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  to,
  onClick,
  variant,
  className,
  animationDelay = 0,
  showArrow = true,
}) => {
    const content = (
      <>
        {/* Background glow */}
        <div className={cn(glowVariants({ variant }))} />
        
        {/* Icon container */}
        <div className="flex-shrink-0 relative">
          <div className={cn(
            "absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500",
            iconContainerVariants({ variant })
          )} />
          <div className={cn(iconContainerVariants({ variant }))}>
            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
          </div>
        </div>
        
        {/* Label */}
        <div className="flex-1">
          <h2 className={cn(textVariants({ variant }))}>
            {label}
          </h2>
        </div>

        {/* Arrow indicator */}
        {showArrow && (
          <div className="flex-shrink-0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              iconContainerVariants({ variant })
            )}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Bottom accent line */}
        <div className={cn(bottomLineVariants({ variant }))} />
      </>
    );

    const containerClassName = cn(iconButtonVariants({ variant, className }));
    const containerStyle = { animationDelay: `${animationDelay}ms` };

    if (to) {
      return (
        <Link to={to} className={containerClassName} style={containerStyle}>
          {content}
        </Link>
      );
    }

    return (
      <div onClick={onClick} className={containerClassName} style={containerStyle}>
        {content}
      </div>
    );
  };

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
