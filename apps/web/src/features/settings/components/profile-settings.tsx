"use client";

import { Building, Camera, Save } from "lucide-react";
import { toast } from "sonner";

export function ProfileSettings() {
  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8 border-border/50 border-b pb-6">
          <h3 className="font-display font-light text-[20px] text-foreground uppercase tracking-[0.1em]">
            Organization Profile
          </h3>
          <p className="mt-1 font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
            Manage your team and company details
          </p>
        </div>

        <div className="mb-10 flex items-center gap-8">
          <div className="group relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-secondary shadow-sm">
              <Building className="h-8 w-8 text-foreground/30" />
            </div>
            <button className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-secondary">
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-[16px] text-foreground tracking-tight">
              Umurava Inc.
            </p>
            <p className="font-medium text-[13px] text-muted-foreground">
              Technology & AI Recruitment Solutions
            </p>
            <button className="mt-3 font-semibold text-[11px] text-info uppercase tracking-[0.1em] transition-colors hover:text-info/80">
              Update branding
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
          {[
            { label: "Account ID", val: "UM-90283", disabled: true },
            { label: "Role", val: "Recruitment Manager" },
            { label: "First Name", val: "HR" },
            { label: "Last Name", val: "Manager" },
            { label: "Work Email", val: "recruiter@umurava.com" },
            { label: "Timezone", val: "Eastern Time (GMT-5)" },
          ].map((field, i) => (
            <div key={i} className="space-y-2">
              <label className="ml-1 font-semibold text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em]">
                {field.label}
              </label>
              <input
                defaultValue={field.val}
                disabled={field.disabled}
                className={cn(
                  "h-11 w-full rounded-lg border border-border bg-foreground/[0.01] px-4 font-medium text-[14px] text-foreground tracking-tight transition-all focus:border-info/30 focus:outline-none focus:ring-1 focus:ring-info/20",
                  field.disabled &&
                    "cursor-not-allowed bg-secondary/30 opacity-50",
                )}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end border-border/50 border-t pt-8">
        <button
          onClick={handleSave}
          className="flex h-11 items-center gap-2 rounded-full bg-primary px-8 font-semibold text-[12px] text-primary-foreground uppercase tracking-[0.2em] shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Save className="h-4 w-4" />
          Update Profile
        </button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
