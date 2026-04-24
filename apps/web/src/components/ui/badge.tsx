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
        default: "h-5 px-2 py-0.5 text-xs rounded-full",
        sm: "h-4 px-1.5 text-[10px] rounded-md",
        lg: "h-6 px-3 py-1 text-sm rounded-full",
        xs: "h-3.5 px-1 text-[9px] rounded-sm",
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
