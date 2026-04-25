"use client";

import { RiSaveLine } from "@remixicon/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function AISettings() {
  const [autoScreen, setAutoScreen] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highScoreAlert, setHighScoreAlert] = useState(true);

  const handleSave = () => toast.success("Configuration updated");

  return (
    <div className="space-y-section-gap">
      <section>
        <div className="mb-section-gap flex items-end justify-between border-line border-b pb-base">
          <div>
            <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
              Neural Config
            </span>
            <h3 className="font-serif text-[28px] text-primary leading-tight">
              Intelligence Core
            </h3>
          </div>
          <div className="flex items-center gap-base rounded-micro border border-line bg-bg2 px-3 py-1">
            <span className="font-medium font-sans text-[10px] text-primary uppercase tracking-widest">
              Gemini 1.5 Pro
            </span>
          </div>
        </div>

        <div className="group relative mb-section-gap overflow-hidden rounded-standard border border-line bg-bg-alt/30 p-comfortable shadow-none">
          <div className="relative z-10">
            <div className="mb-base flex items-center justify-between">
              <div>
                <p className="mb-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                  Operational Quota
                </p>
                <p className="font-serif text-[24px] text-primary leading-none">
                  847{" "}
                  <span className="text-[14px] text-ink-faint">
                    / 1,000 Credits
                  </span>
                </p>
              </div>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-pill bg-bg-deep">
              <div
                className="h-full bg-primary/60 transition-all duration-1000"
                style={{ width: "84.7%" }}
              />
            </div>
            <p className="mt-comfortable font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
              Neural resets in 12 days
            </p>
          </div>
        </div>

        <div className="space-y-comfortable">
          {[
            {
              label: "Autonomous Ingestion",
              desc: "Automatically evaluate candidates upon submission resonance.",
              state: autoScreen,
              set: setAutoScreen,
            },
            {
              label: "Neural Rationales",
              desc: "Generate high-fidelity natural-language justifications.",
              state: emailAlerts,
              set: setEmailAlerts,
            },
            {
              label: "Precision Threshold Alerts",
              desc: "Notify when a match resonance exceeds 85%.",
              state: highScoreAlert,
              set: setHighScoreAlert,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group flex items-center justify-between border-line border-b pb-comfortable last:border-0 last:pb-0"
            >
              <div className="max-w-[420px]">
                <p className="mb-0.5 font-medium font-sans text-[14px] text-primary tracking-tight">
                  {item.label}
                </p>
                <p className="font-light font-sans text-[13px] text-ink-muted">
                  {item.desc}
                </p>
              </div>
              <Switch checked={item.state} onCheckedChange={item.set} />
            </div>
          ))}
        </div>

        <div className="mt-section-gap border-line border-t pt-comfortable">
          <div className="flex items-center justify-between gap-hero">
            <div className="max-w-[360px]">
              <p className="mb-1 font-medium font-sans text-[14px] text-primary tracking-tight">
                Confidence Threshold
              </p>
              <p className="font-light font-sans text-[12px] text-ink-muted leading-relaxed">
                Candidates scoring above this neural value will be marked for
                immediate strategic review.
              </p>
            </div>
            <div className="flex items-center gap-base rounded-standard border border-line bg-bg2 p-2">
              <input
                type="number"
                defaultValue="75"
                className="h-8 w-12 bg-transparent text-center font-serif text-[20px] text-primary outline-none"
                min="0"
                max="100"
              />
              <span className="font-serif text-[16px] text-ink-faint">%</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end border-line border-t pt-section-gap">
        <Button
          onClick={handleSave}
          className="h-10 rounded-standard px-8 font-medium font-sans text-[13px]"
        >
          Update Core Logic
        </Button>
      </div>
    </div>
  );
}
