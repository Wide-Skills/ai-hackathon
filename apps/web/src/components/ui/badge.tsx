import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

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
        success: "border-success/20 bg-success/10 text-success-foreground",
        info: "border-info/20 bg-info/10 text-info-foreground",
        warning: "border-warning/20 bg-warning/10 text-warning-foreground",
      },
      size: {
        default: "h-5 rounded-4xl px-2 py-0.5 text-xs",
        sm: "h-4 rounded-lg px-1.5 text-[10px]",
        lg: "h-6 rounded-4xl px-3 py-1 text-sm",
        pill: "h-7 rounded-pill border px-4 font-bold text-[11px] uppercase tracking-[0.15em] shadow-ethereal",
        technical:
          "rounded-lg border px-2.5 py-0.5 font-bold text-[9px] uppercase leading-none tracking-[0.15em] shadow-sm",
      },
      uppercase: {
        true: "uppercase tracking-widest",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      uppercase: false,
    },
  },
);

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
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
      uppercase,
    },
  });
}

export { Badge, badgeVariants };
