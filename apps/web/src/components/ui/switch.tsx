"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-line outline-none transition-all focus-visible:ring-4 focus-visible:ring-primary-alpha/5 data-[size=default]:h-[20px] data-[size=sm]:h-[16px] data-[size=default]:w-[34px] data-[size=sm]:w-[26px] data-disabled:cursor-not-allowed data-checked:bg-primary data-checked:border-primary data-unchecked:bg-bg-deep data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-surface transition-transform group-data-[size=default]/switch:size-3.5 group-data-[size=sm]/switch:size-2.5 group-data-[size=default]/switch:data-checked:translate-x-[calc(34px-14px-4px)] group-data-[size=default]/switch:data-unchecked:translate-x-[3px] group-data-[size=sm]/switch:data-checked:translate-x-[calc(26px-10px-4px)] group-data-[size=sm]/switch:data-unchecked:translate-x-[3px]"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
