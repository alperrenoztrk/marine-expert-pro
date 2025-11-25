import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, value, onChange, ...props }, ref) => {
    // Sanitize NaN numeric values to empty string so cleared inputs stay blank
    const sanitizedValue =
      typeof value === "number" && !Number.isFinite(value) ? "" : value;

    // Handle comma to period conversion for numeric inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if ((type === "number" || props.inputMode === "numeric" || props.inputMode === "decimal") && e.target.value.includes(',')) {
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            value: e.target.value.replace(',', '.')
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(newEvent);
      } else {
        onChange?.(e);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-[var(--control-height)] w-full rounded-md border border-input bg-background px-[var(--control-padding-x)] py-[var(--control-padding-y)] text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        value={sanitizedValue as any}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
