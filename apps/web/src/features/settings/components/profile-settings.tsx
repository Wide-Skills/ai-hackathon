"use client";

import { RiCameraLine } from "@remixicon/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ProfileSettings() {
  const handleSave = () => toast.success("Profile updated");

  return (
    <div className="space-y-section-gap">
      <section>
        <div className="mb-section-gap border-line border-b pb-base">
          <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
            Organization
          </span>
          <h3 className="font-serif text-[28px] text-primary leading-tight">
            Profile Details
          </h3>
        </div>

        <div className="mb-section-gap flex items-center gap-base">
          <div className="group relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-micro border border-line bg-bg2 font-serif text-[24px] text-ink-faint shadow-none transition-all group-hover:bg-bg-alt/40">
              UM
            </div>
            <button className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface shadow-none transition-all hover:bg-bg2 active:scale-90">
              <RiCameraLine className="size-3.5 text-ink-faint" />
            </button>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-[20px] text-primary leading-tight">
              Umurava Inc.
            </p>
            <p className="font-light font-sans text-[13px] text-ink-muted">
              Technology &amp; AI Recruitment Solutions
            </p>
            <button className="pt-1 font-medium font-sans text-[11px] text-primary/60 uppercase tracking-[0.06em] transition-colors hover:text-primary">
              Update branding
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-hero gap-y-base md:grid-cols-2">
          {[
            { label: "Account ID", val: "UM-90283", disabled: true },
            { label: "Operation Role", val: "Recruitment Manager" },
            { label: "Lead First Name", val: "HR" },
            { label: "Lead Last Name", val: "Manager" },
            { label: "Work Email", val: "recruiter@umurava.com" },
            { label: "Regional Timezone", val: "Eastern Time (GMT-5)" },
          ].map((field, i) => (
            <div key={i} className="space-y-micro">
              <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                {field.label}
              </label>
              <input
                defaultValue={field.val}
                disabled={field.disabled}
                className={cn(
                  "focus:ring- Pa h-10 w-full rounded-standard border border-line bg-bg2 px-4 font-normal font-sans text-[13px] text-primary outline-none transition-all focus:bg-surface",
                  field.disabled &&
                    "cursor-not-allowed bg-bg-deep/50 opacity-40 grayscale",
                )}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end border-line border-t pt-section-gap">
        <Button
          onClick={handleSave}
          className="h-10 rounded-standard px-8 font-medium font-sans text-[13px]"
        >
          Update Organization
        </Button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
