"use client";

import { Building, Save, Camera } from "lucide-react";
import { toast } from "sonner";

export function ProfileSettings() {
  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8 border-b border-border/50 pb-6">
          <h3 className="font-display text-[20px] font-light text-foreground uppercase tracking-[0.1em]">Organization Profile</h3>
          <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">Manage your team and company details</p>
        </div>

        <div className="flex items-center gap-8 mb-10">
          <div className="relative group">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary border border-border shadow-sm">
              <Building className="h-8 w-8 text-foreground/30" />
            </div>
            <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center shadow-sm hover:bg-secondary transition-colors">
               <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <div>
            <p className="text-[16px] font-bold text-foreground tracking-tight">Umurava Inc.</p>
            <p className="text-[13px] text-muted-foreground font-medium">Technology & AI Recruitment Solutions</p>
            <button className="mt-3 text-[11px] font-bold text-info hover:text-info/80 transition-colors uppercase tracking-[0.1em]">
              Update branding
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          {[
            { label: "Account ID", val: "UM-90283", disabled: true },
            { label: "Role", val: "Recruitment Manager" },
            { label: "First Name", val: "HR" },
            { label: "Last Name", val: "Manager" },
            { label: "Work Email", val: "recruiter@umurava.com" },
            { label: "Timezone", val: "Eastern Time (GMT-5)" }
          ].map((field, i) => (
            <div key={i} className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                {field.label}
              </label>
              <input 
                defaultValue={field.val} 
                disabled={field.disabled}
                className={cn(
                  "w-full h-11 px-4 rounded-lg border border-border bg-foreground/[0.01] text-[14px] font-medium text-foreground tracking-tight focus:outline-none focus:ring-1 focus:ring-info/20 focus:border-info/30 transition-all",
                  field.disabled && "opacity-50 cursor-not-allowed bg-secondary/30"
                )}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="pt-8 border-t border-border/50 flex justify-end">
        <button
          onClick={handleSave}
          className="h-11 px-8 rounded-full bg-primary text-primary-foreground text-[12px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
        >
          <Save className="h-4 w-4" />
          Update Profile
        </button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
