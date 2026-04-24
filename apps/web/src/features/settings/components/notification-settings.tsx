"use client";

import { Bell, Save } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  const handleSave = () => toast.success("Notification preferences saved");

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8 flex items-end justify-between border-border/50 border-b pb-6">
          <div>
            <h3 className="font-display font-light text-[20px] text-foreground uppercase tracking-[0.1em]">
              Alert Configuration
            </h3>
            <p className="mt-1 font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
              Configure your workspace communication
            </p>
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
            <div key={i} className="group flex items-center justify-between">
              <div className="max-w-[420px]">
                <p className="mb-0.5 font-semibold text-[14px] text-foreground tracking-tight">
                  {n.label}
                </p>
                <p className="font-medium text-[13px] text-muted-foreground">
                  {n.desc}
                </p>
              </div>
              <Switch
                defaultChecked={i < 3}
                className="data-[state=checked]:bg-info"
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
          Update Preferences
        </button>
      </div>
    </div>
  );
}
