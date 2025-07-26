import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background via-muted/30 to-background",
      "safe-area-inset",
      "overflow-x-hidden",
      className
    )}>
      <div className="container mx-auto px-2 py-3 xs:px-3 xs:py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 max-w-4xl">
        {children}
      </div>
    </div>
  );
};