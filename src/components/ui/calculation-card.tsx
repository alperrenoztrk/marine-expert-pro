import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type CalculationCardProps = React.ComponentPropsWithoutRef<typeof Card>;

export function CalculationCard({ className, ...props }: CalculationCardProps) {
  return (
    <Card
      className={cn(
        "shadow-lg bg-card/80 backdrop-blur-sm border border-border/40",
        className
      )}
      {...props}
    />
  );
}

