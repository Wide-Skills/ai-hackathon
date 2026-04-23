"use client";

import { BrainCircuit, Save, Zap } from "lucide-react";
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
        <div className="mb-8 border-b border-border/50 pb-6 flex items-end justify-between">
          <div>
            <h3 className="font-display text-[20px] font-light text-foreground uppercase tracking-[0.1em]">Intelligence Core</h3>
            <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">Configure model behavior and thresholds</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-info/5 border border-info/10 flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-info animate-pulse" />
             <span className="text-[10px] font-bold text-info uppercase tracking-widest">Gemini 1.5 Pro</span>
          </div>
        </div>

        <div className="bg-secondary/40 rounded-xl border border-border p-6 mb-10 relative overflow-hidden group">
          <div className="relative z-10">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5">Processing Credits</p>
                   <p className="font-display text-[24px] font-light text-foreground leading-none tracking-tighter">847 <span className="text-[14px] text-muted-foreground/40">/ 1,000</span></p>
                </div>
                <Zap className="h-5 w-5 text-info opacity-40" />
             </div>
             <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border/10">
                <div className="h-full bg-info/40 rounded-full transition-all duration-1000" style={{ width: '84.7%' }} />
             </div>
             <p className="mt-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">Monthly quota resets in 12 days</p>
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
            <div key={i} className="flex items-center justify-between group">
              <div className="max-w-[420px]">
                <p className="text-[14px] font-bold text-foreground tracking-tight mb-0.5">{item.label}</p>
                <p className="text-[13px] text-muted-foreground font-medium">{item.desc}</p>
              </div>
              <Switch checked={item.state} onCheckedChange={item.set} className="data-[state=checked]:bg-info" />
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
           <div className="flex items-center justify-between gap-10">
              <div className="max-w-[360px]">
                 <p className="text-[14px] font-bold text-foreground tracking-tight mb-1">Match Threshold</p>
                 <p className="text-[12px] text-muted-foreground font-medium leading-relaxed">Candidates scoring above this value will be marked for immediate review.</p>
              </div>
              <div className="flex items-center gap-3 bg-secondary/30 p-1.5 rounded-lg border border-border">
                 <input 
                   type="number" 
                   defaultValue="75" 
                   className="w-16 h-8 bg-transparent text-center font-display text-[18px] font-light text-foreground focus:outline-none"
                   min="0" max="100"
                 />
                 <span className="text-[14px] text-muted-foreground/40 font-light font-display pr-2">%</span>
              </div>
           </div>
        </div>
      </section>

      <div className="pt-8 border-t border-border/50 flex justify-end">
        <button
          onClick={handleSave}
          className="h-11 px-8 rounded-full bg-primary text-primary-foreground text-[12px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
        >
          <Save className="h-4 w-4" />
          Save Core Settings
        </button>
      </div>
    </div>
  );
}
