import React from "react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

const CalendarSimple = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className }, ref) => {
    return (
      <div ref={ref} className={cn("p-3", className)}>
        <div className="text-center">Simple Calendar Component</div>
      </div>
    );
  }
);

CalendarSimple.displayName = "CalendarSimple";

export { CalendarSimple };