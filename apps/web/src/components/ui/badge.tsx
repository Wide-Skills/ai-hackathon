import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex items-center justify-center gap-1 overflow-hidden transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        success: "text-success-foreground bg-success/10 border-success/20",
        info: "text-info-foreground bg-info/10 border-info/20",
        warning: "text-warning-foreground bg-warning/10 border-warning/20",
      },
      size: {
        default: "h-5 px-2 py-0.5 text-xs rounded-4xl",
        sm: "h-4 px-1.5 text-[10px] rounded-lg",
        lg: "h-6 px-3 py-1 text-sm rounded-4xl",
        pill: "h-7 px-4 text-[11px] font-bold uppercase tracking-[0.15em] rounded-pill border shadow-ethereal",
        technical: "px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em] border shadow-sm leading-none",
      },
      uppercase: {
        true: "uppercase tracking-widest",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      uppercase: false,
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  uppercase = false,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size, uppercase }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
      uppercase,
    },
  })
}

export { Badge, badgeVariants }
