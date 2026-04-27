import { mergeProps, useRender } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap bg-clip-padding font-medium outline-none transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-standard bg-primary font-medium font-sans text-white tracking-[-0.01em] shadow-none hover:-translate-y-[1px] hover:bg-primary-muted",
        outline:
          "rounded-standard border border-line bg-transparent font-normal font-sans text-ink-muted shadow-none hover:border-line-emphasis hover:text-ink-full",
        secondary:
          "rounded-standard border border-line bg-transparent font-normal font-sans text-ink-muted shadow-none hover:border-line-emphasis hover:text-ink-full",
        destructive:
          "rounded-standard bg-destructive font-medium font-sans text-destructive-foreground shadow-none hover:bg-destructive/90 hover:-translate-y-[1px]",
        ghost:
          "rounded-standard bg-line font-normal font-sans text-ink-muted shadow-none hover:text-ink-full",
        link: "text-primary underline-offset-4 shadow-none hover:underline",
      },
      size: {
        default: "h-9 px-5 text-[13px]",
        xs: "h-6 px-2 text-[11px]",
        sm: "h-8 px-3 text-[12px]",
        lg: "h-11 px-6 text-[14px]",
        xl: "h-11 px-8 font-sans text-[13px] tracking-[-0.01em]",
        "2xl": "h-[52px] px-10 font-sans text-[14px] tracking-[-0.01em]",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-xs": "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends useRender.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  render,
  children,
  loading = false,
  disabled: disabledProp,
  ...props
}: ButtonProps): React.ReactElement {
  const isDisabled: boolean = Boolean(loading || disabledProp);
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    render ? undefined : "button";

  const defaultProps = {
    children: (
      <>
        {children}
        {loading && (
          <Spinner
            className="pointer-events-none absolute"
            data-slot="button-loading-indicator"
          />
        )}
      </>
    ),
    className: cn(buttonVariants({ className, size, variant })),
    "aria-disabled": loading || undefined,
    "data-loading": loading ? "" : undefined,
    "data-slot": "button",
    disabled: isDisabled,
    type: typeValue,
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}
