import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useNeonSound } from "@/hooks/useNeonSound"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-[1.02] hover:bg-primary/90 border border-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:scale-[1.02] hover:bg-destructive/90 border border-destructive/20",
        outline:
          "border-2 border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:border-primary/50 hover:scale-[1.02]",
        secondary:
          "bg-secondary/10 text-secondary-foreground border border-secondary/20 hover:bg-secondary/20 hover:scale-[1.02]",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
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
