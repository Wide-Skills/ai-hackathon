import { RiLoaderLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

function Spinner({
  className,
  children,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <RiLoaderLine
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...(props as any)}
    />
  );
}

export { Spinner };
