"use client";

import { Shield, Save, Lock } from "lucide-react";
import { toast } from "sonner";

export function SecuritySettings() {
  const handleSave = () => toast.success("Security credentials updated");

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8 border-b border-border/50 pb-6 flex items-end justify-between">
          <div>
            <h3 className="font-display text-[20px] font-light text-foreground uppercase tracking-[0.1em]">Access & Security</h3>
            <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">Manage your credentials and session security</p>
          </div>
          <Shield className="h-5 w-5 text-foreground/20" />
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-[480px]">
          {[
            { label: "Current Password", placeholder: "••••••••" },
            { label: "New Password", placeholder: "••••••••" },
            { label: "Confirm New Password", placeholder: "••••••••" }
          ].map((field, i) => (
            <div key={i} className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                {field.label}
              </label>
              <div className="relative">
                <input 
                  type="password"
                  placeholder={field.placeholder}
                  className="w-full h-11 px-10 rounded-lg border border-border bg-foreground/[0.01] text-[14px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-info/20 focus:border-info/30 transition-all placeholder:text-muted-foreground/30"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/30" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-secondary/30 border border-border/50">
           <p className="text-[13px] text-foreground/70 font-medium leading-relaxed">
             Regularly updating your password ensures the security of your recruitment pipelines and sensitive candidate data.
           </p>
        </div>
      </section>

      <div className="pt-8 border-t border-border/50 flex justify-end">
        <button
          onClick={handleSave}
          className="h-11 px-8 rounded-full bg-primary text-primary-foreground text-[12px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
        >
          <Save className="h-4 w-4" />
          Update Credentials
        </button>
      </div>
    </div>
  );
}
