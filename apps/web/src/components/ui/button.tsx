import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap outline-none transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 font-medium text-sm",
        outline:
          "rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground",
        secondary:
          "rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "rounded-lg hover:bg-muted hover:text-foreground",
        destructive:
          "rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
        auralis: "bg-auralis-surface text-auralis-neutral rounded-auralis-full hover:bg-auralis-surface/90 font-medium text-[14px] leading-[20px] p-[14px] px-8",
        "auralis-link": "text-auralis-text-primary rounded-auralis-md p-0 hover:text-auralis-text-secondary font-medium text-[14px] leading-[20px]",
      },
      size: {
        default: "h-8 px-2.5 text-sm",
        xs: "h-6 px-2 text-xs",
        sm: "h-7 px-2.5 text-[0.8rem]",
        lg: "h-9 px-2.5 text-sm",
        icon: "size-8",
        "icon-xs": "size-6",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
        auralis: "h-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
