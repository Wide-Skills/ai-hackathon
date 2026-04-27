import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex items-center justify-center gap-1 overflow-hidden font-medium font-sans shadow-none transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        secondary: "border border-line bg-bg2 text-ink-muted",
        destructive: "bg-destructive text-destructive-foreground",
        "destructive-subtle": "bg-error-bg text-error-text border-error-bg",
        outline: "border border-line bg-transparent text-ink-muted",
        ghost: "bg-primary-alpha text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success-bg text-success-text border-success-bg",
        "success-subtle": "bg-success-bg text-success-text border-success-bg",
        info: "bg-primary-alpha text-primary border-primary-alpha",
        warning: "bg-warning-bg text-warning-text border-warning-bg",
        "warning-subtle": "bg-warning-bg text-warning-text border-warning-bg",
      },
      size: {
        default:
          "h-[22px] rounded-micro px-2 py-0.5 text-[11px] tracking-[0.01em]",
        sm: "h-[18px] rounded-micro px-1.5 text-[10px] tracking-[0.01em]",
        lg: "h-[26px] rounded-micro px-3 py-1 text-[12px] tracking-[0.01em]",
        xs: "h-[16px] rounded-micro px-1 text-[9px] tracking-[0.01em]",
      },
      uppercase: {
        true: "uppercase tracking-[0.06em]",
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
