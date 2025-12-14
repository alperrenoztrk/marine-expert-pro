import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type CalculationCardProps = React.ComponentPropsWithoutRef<typeof Card>;

export function CalculationCard({ className, ...props }: CalculationCardProps) {
  return (
    <Card
      className={cn(
        "shadow-lg border-0 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

