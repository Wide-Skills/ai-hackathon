"use client";

import { Save, Bell } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  const handleSave = () => toast.success("Notification preferences saved");

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8 border-b border-border/50 pb-6 flex items-end justify-between">
          <div>
            <h3 className="font-display text-[20px] font-light text-foreground uppercase tracking-[0.1em]">Alert Configuration</h3>
            <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">Configure your workspace communication</p>
          </div>
          <Bell className="h-5 w-5 text-foreground/20" />
        </div>

        <div className="space-y-8">
          {[
            {
              label: "Submission Alerts",
              desc: "Receive instant notifications for new candidate applications",
            },
            {
              label: "Screening Completion",
              desc: "Get notified when the AI engine finishes batch analysis",
            },
            {
              label: "Quality Threshold Triggers",
              desc: "Alert when a candidate match score exceeds 90%",
            },
            {
              label: "Intelligence Digest",
              desc: "Weekly summary of pipeline performance and neural insights",
            },
          ].map((n, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="max-w-[420px]">
                <p className="text-[14px] font-bold text-foreground tracking-tight mb-0.5">{n.label}</p>
                <p className="text-[13px] text-muted-foreground font-medium">{n.desc}</p>
              </div>
              <Switch defaultChecked={i < 3} className="data-[state=checked]:bg-info" />
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
          Update Preferences
        </button>
      </div>
    </div>
  );
}
