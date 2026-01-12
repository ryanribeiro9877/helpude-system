import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-helpude-purple-100 text-helpude-purple-700",
        secondary:
          "border-transparent bg-helpude-teal-100 text-helpude-teal-700",
        destructive:
          "border-transparent bg-red-100 text-red-700",
        success:
          "border-transparent bg-green-100 text-green-700",
        warning:
          "border-transparent bg-amber-100 text-amber-700",
        outline: "text-foreground border-border",
        level1: "border-blue-200 bg-blue-50 text-blue-700",
        level2: "border-helpude-purple-200 bg-helpude-purple-50 text-helpude-purple-700",
        level3: "border-helpude-teal-200 bg-helpude-teal-50 text-helpude-teal-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
