"use client";

import { RiLockLine, RiSaveLine, RiShieldLine } from "@remixicon/react";
import { toast } from "sonner";

export function SecuritySettings() {
  const handleSave = () => toast.success("Security credentials updated");

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8 flex items-end justify-between border-border/50 border-b pb-6">
          <div>
            <h3 className="font-display font-light text-[20px] text-foreground uppercase tracking-[0.1em]">
              Access & Security
            </h3>
            <p className="mt-1 font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
              Manage your credentials and session security
            </p>
          </div>
          <RiShieldLine className="h-5 w-5 text-foreground/20" />
        </div>

        <div className="grid max-w-[480px] grid-cols-1 gap-8">
          {[
            { label: "Current Password", placeholder: "••••••••" },
            { label: "New Password", placeholder: "••••••••" },
            { label: "Confirm New Password", placeholder: "••••••••" },
          ].map((field, i) => (
            <div key={i} className="space-y-2">
              <label className="ml-1 font-semibold text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em]">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder={field.placeholder}
                  className="h-11 w-full rounded-lg border border-border bg-foreground/[0.01] px-10 font-medium text-[14px] text-foreground transition-all placeholder:text-muted-foreground/30 focus:border-info/30 focus:outline-none focus:ring-1 focus:ring-info/20"
                />
                <RiLockLine className="absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/30" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border/50 bg-secondary/30 p-6">
          <p className="font-medium text-[13px] text-foreground/70 leading-relaxed">
            Regularly updating your password ensures the security of your
            recruitment pipelines and sensitive candidate data.
          </p>
        </div>
      </section>

      <div className="flex justify-end border-border/50 border-t pt-8">
        <button
          onClick={handleSave}
          className="flex h-11 items-center gap-2 rounded-full bg-primary px-8 font-semibold text-[12px] text-primary-foreground uppercase tracking-[0.2em] shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <RiSaveLine className="h-4 w-4" />
          Update Credentials
        </button>
      </div>
    </div>
  );
}
