import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-helpude-purple-600 text-white hover:bg-helpude-purple-700 shadow-lg shadow-helpude-purple-500/25 hover:shadow-xl hover:shadow-helpude-purple-500/30",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg",
        outline: "border-2 border-helpude-purple-300 bg-transparent text-helpude-purple-700 hover:bg-helpude-purple-50 hover:border-helpude-purple-400",
        secondary: "bg-helpude-teal-500 text-white hover:bg-helpude-teal-600 shadow-lg shadow-helpude-teal-500/25",
        ghost: "hover:bg-helpude-purple-100 hover:text-helpude-purple-700",
        link: "text-helpude-purple-600 underline-offset-4 hover:underline",
        gradient: "gradient-primary text-white shadow-lg shadow-helpude-purple-500/30 hover:shadow-xl hover:shadow-helpude-purple-500/40",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
