"use client";

import { RiNotification3Line } from "@remixicon/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  const handleSave = () => toast.success("Preferences updated");

  return (
    <div className="space-y-section-gap">
      <section>
        <div className="mb-section-gap flex items-end justify-between border-line border-b pb-base">
          <div>
            <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
              Channels
            </span>
            <h3 className="font-serif text-[28px] text-primary leading-tight">
              Alert Configuration
            </h3>
          </div>
          <RiNotification3Line className="size-5 text-primary/20" />
        </div>

        <div className="space-y-comfortable">
          {[
            {
              label: "Submission Alerts",
              desc: "Receive instant notifications for new technical expert applications.",
            },
            {
              label: "Screening Completion",
              desc: "Get notified when the neural engine finishes deep batch analysis.",
            },
            {
              label: "Quality Threshold Triggers",
              desc: "Immediate alert when a candidate resonance exceeds 90%.",
            },
            {
              label: "Intelligence Digest",
              desc: "Weekly summary of neural performance and latent insights.",
            },
          ].map((n, i) => (
            <div
              key={i}
              className="group flex items-center justify-between border-line border-b pb-comfortable last:border-0 last:pb-0"
            >
              <div className="max-w-[420px]">
                <p className="mb-0.5 font-medium font-sans text-[14px] text-primary tracking-tight">
                  {n.label}
                </p>
                <p className="font-light font-sans text-[13px] text-ink-muted">
                  {n.desc}
                </p>
              </div>
              <Switch defaultChecked={i < 3} />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end border-line border-t pt-section-gap">
        <Button
          onClick={handleSave}
          className="h-10 rounded-standard px-8 font-medium font-sans text-[13px]"
        >
          Update Preferences
        </Button>
      </div>
    </div>
  );
}
