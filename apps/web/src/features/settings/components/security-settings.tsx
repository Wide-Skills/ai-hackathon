"use client";

import { RiLockLine, RiShieldLine } from "@remixicon/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SecuritySettings() {
  const handleSave = () => toast.success("Credentials updated");

  return (
    <div className="space-y-section-gap">
      <section>
        <div className="mb-section-gap flex items-end justify-between border-line border-b pb-base">
          <div>
            <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
              Access
            </span>
            <h3 className="font-serif text-[28px] text-primary leading-tight">
              Console Security
            </h3>
          </div>
          <RiShieldLine className="size-5 text-primary/20" />
        </div>

        <div className="grid max-w-[480px] grid-cols-1 gap-base">
          {[
            { label: "Current Password", placeholder: "••••••••" },
            { label: "New Password", placeholder: "••••••••" },
            { label: "Confirm New Password", placeholder: "••••••••" },
          ].map((field, i) => (
            <div key={i} className="space-y-micro">
              <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder={field.placeholder}
                  className="h-10 w-full rounded-standard border border-line bg-bg2 px-10 font-normal font-sans text-[13px] text-primary outline-none transition-all placeholder:text-ink-faint/30 focus:bg-surface focus:ring-Pa"
                />
                <RiLockLine className="absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-ink-faint/40" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-section-gap rounded-standard border border-line bg-bg-alt/30 p-comfortable">
          <p className="font-light font-sans text-[14px] text-ink-muted leading-relaxed">
            Regularly updating your password ensures the security of your
            candidate pipelines and prevents unauthorized access to your data.
          </p>
        </div>
      </section>

      <div className="flex justify-end border-line border-t pt-section-gap">
        <Button
          onClick={handleSave}
          className="h-10 rounded-standard px-8 font-medium font-sans text-[13px]"
        >
          Update Credentials
        </Button>
      </div>
    </div>
  );
}
