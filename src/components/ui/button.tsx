import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useNeonSound } from "@/hooks/useNeonSound"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-button)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        calculator: "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground hover:from-primary-light hover:to-primary shadow-[var(--shadow-button)] hover:shadow-lg transform hover:scale-[1.02]",
        ocean: "bg-gradient-to-r from-accent to-secondary text-white hover:from-accent/90 hover:to-secondary/90 shadow-[var(--shadow-button)]",
      },
      size: {
        default: "h-[var(--control-height)] px-[var(--control-padding-x)] py-[var(--control-padding-y)]",
        sm: "h-[calc(var(--control-height)*0.9)] rounded-md px-[calc(var(--control-padding-x)*0.75)]",
        lg: "h-[calc(var(--control-height)*1.1)] rounded-md px-[calc(var(--control-padding-x)*1.5)]",
        icon: "h-[var(--control-height)] w-[var(--control-height)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, onMouseEnter, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const { playNeonClick, playNeonHover } = useNeonSound()
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playNeonClick()
      onClick?.(e)
    }
    
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      playNeonHover()
      onMouseEnter?.(e)
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
