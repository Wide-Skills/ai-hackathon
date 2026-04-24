"use client";

import { RiSaveLine } from "@remixicon/react";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export function AISettings() {
  const [autoScreen, setAutoScreen] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highScoreAlert, setHighScoreAlert] = useState(true);

  const handleSave = () => toast.success("AI configuration updated");

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8 flex items-end justify-between border-border/50 border-b pb-6">
          <div>
            <h3 className="font-display font-light text-[20px] text-foreground uppercase tracking-[0.1em]">
              Intelligence Core
            </h3>
            <p className="mt-1 font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
              Configure model behavior and thresholds
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-info/10 bg-info/5 px-3 py-1">
            <span className="font-semibold text-[10px] text-info uppercase tracking-widest">
              Gemini AI
            </span>
          </div>
        </div>

        <div className="group relative mb-10 overflow-hidden rounded-xl border border-border bg-secondary/40 p-6">
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-1.5 font-semibold text-[11px] text-foreground/40 uppercase tracking-widest">
                  Processing Credits
                </p>
                <p className="font-display font-light text-[24px] text-foreground leading-none tracking-tighter">
                  847{" "}
                  <span className="text-[14px] text-muted-foreground/40">
                    / 1,000
                  </span>
                </p>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full border border-border/10 bg-background">
              <div
                className="h-full rounded-full bg-info/40 transition-all duration-1000"
                style={{ width: "84.7%" }}
              />
            </div>
            <p className="mt-4 font-semibold text-[11px] text-muted-foreground/60 uppercase tracking-wider">
              Monthly quota resets in 12 days
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {[
            {
              label: "Autonomous Screening",
              desc: "Automatically evaluate candidates upon submission",
              state: autoScreen,
              set: setAutoScreen,
            },
            {
              label: "Reasoning Reports",
              desc: "Generate detailed natural-language justifications",
              state: emailAlerts,
              set: setEmailAlerts,
            },
            {
              label: "High-Confidence Alerts",
              desc: "Notify when a match score exceeds 85%",
              state: highScoreAlert,
              set: setHighScoreAlert,
            },
          ].map((item, i) => (
            <div key={i} className="group flex items-center justify-between">
              <div className="max-w-[420px]">
                <p className="mb-0.5 font-semibold text-[14px] text-foreground tracking-tight">
                  {item.label}
                </p>
                <p className="font-medium text-[13px] text-muted-foreground">
                  {item.desc}
                </p>
              </div>
              <Switch
                checked={item.state}
                onCheckedChange={item.set}
                className="data-[state=checked]:bg-info"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 border-border/50 border-t pt-8">
          <div className="flex items-center justify-between gap-10">
            <div className="max-w-[360px]">
              <p className="mb-1 font-semibold text-[14px] text-foreground tracking-tight">
                Match Threshold
              </p>
              <p className="font-medium text-[12px] text-muted-foreground leading-relaxed">
                Candidates scoring above this value will be marked for immediate
                review.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-1.5">
              <input
                type="number"
                defaultValue="75"
                className="h-8 w-16 bg-transparent text-center font-display font-light text-[18px] text-foreground focus:outline-none"
                min="0"
                max="100"
              />
              <span className="pr-2 font-display font-light text-[14px] text-muted-foreground/40">
                %
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end border-border/50 border-t pt-8">
        <button
          onClick={handleSave}
          className="flex h-11 items-center gap-2 rounded-full bg-primary px-8 font-semibold text-[12px] text-primary-foreground uppercase tracking-[0.2em] shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <RiSaveLine className="h-4 w-4" />
          Save Core Settings
        </button>
      </div>
    </div>
  );
}
