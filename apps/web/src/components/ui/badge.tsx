import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-pill border border-transparent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition-all shadow-ethereal",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary:
          "bg-secondary/40 text-muted-foreground border-border/20",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/10",
        outline:
          "border-border/50 text-foreground bg-background",
        success: "bg-success/5 text-success-foreground border-success/10",
        info: "bg-info/5 text-info-foreground border-info/10",
        warning: "bg-warning/5 text-warning-foreground border-warning/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
