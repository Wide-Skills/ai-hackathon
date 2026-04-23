import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ 
  className, 
  type, 
  variant = "default",
  ...props 
}: React.ComponentProps<"input"> & {
  variant?: "default" | "pill"
}) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-variant={variant}
      className={cn(
        "flex w-full min-w-0 border border-border/50 bg-background px-4 py-2 text-[14px] font-medium outline-none transition-all placeholder:text-muted-foreground/40 placeholder:font-normal focus-visible:border-primary/20 focus-visible:ring-3 focus-visible:ring-primary/5 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 shadow-ethereal hover:bg-secondary/[0.02]",
        variant === "default" && "h-11 rounded-lg",
        variant === "pill" && "h-11 rounded-pill px-6",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
