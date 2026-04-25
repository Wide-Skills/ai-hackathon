"use client";

import {
  RiAddLine,
  RiFileExcel2Line,
  RiFileTextLine,
  RiGlobeLine,
} from "@remixicon/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UploadCandidatesDialog } from "./upload-candidates-dialog";
import { UploadResumeDialog } from "./upload-resume-dialog";

export function IngestCandidatesDialog() {
  const [open, setOpen] = useState(false);

  const methods = [
    {
      id: "resume" as const,
      title: "AI Resume Import",
      description:
        "Automatically extract candidate profiles from PDF or text using AI analysis.",
      icon: RiFileTextLine,
      color: "text-primary",
      bg: "bg-primary/5",
      badge: "AI Powered",
      component: UploadResumeDialog,
    },
    {
      id: "csv" as const,
      title: "Batch CSV Import",
      description:
        "Upload multiple candidates at once from structured data files for rapid screening.",
      icon: RiFileExcel2Line,
      color: "text-info",
      bg: "bg-info/5",
      badge: "Bulk",
      component: UploadCandidatesDialog,
    },
    {
      id: "api" as const,
      title: "External ATS Sync",
      description:
        "Connect Greenhouse, Lever, or custom endpoints for automated candidate syncing.",
      icon: RiGlobeLine,
      color: "text-muted-foreground",
      bg: "bg-muted/5",
      badge: "Coming Soon",
      disabled: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="h-11 gap-2 bg-primary font-bold text-[11px] text-white uppercase tracking-[0.2em] shadow-lg transition-all hover:bg-primary/90 active:scale-[0.98]" />
        }
      >
        <RiAddLine className="h-4 w-4" />
        Add Candidates
      </DialogTrigger>
      <DialogContent className="max-w-4xl! overflow-hidden border-border/40 bg-background p-0">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="flex flex-col justify-between border-border/10 border-r bg-secondary/30 p-8 md:col-span-2">
            <div>
              <h2 className="mb-4 font-display font-light text-foreground text-xl uppercase tracking-widest">
                Import Center
              </h2>
              <p className="font-medium text-[13px] text-muted-foreground/60 leading-relaxed tracking-tight">
                Choose how you want to add candidates. Our AI engine will
                automatically extract details and match them against your job
                requirements.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border/10 bg-background/50 p-4 backdrop-blur-sm">
                <p className="mb-2 font-bold text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em]">
                  Platform Status
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  <span className="font-bold text-[11px] text-foreground/60 tracking-tight">
                    AI Engine Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-8 md:col-span-3">
            <div className="mb-6">
              <h3 className="mb-2 font-bold text-[10px] text-muted-foreground/40 uppercase tracking-[0.25em]">
                Select Import Method
              </h3>
              <div className="h-1 w-12 rounded-full bg-primary/20" />
            </div>

            {methods.map((method) => {
              const TriggerComponent = method.component;
              if (TriggerComponent) {
                return (
                  <TriggerComponent
                    key={method.id}
                    trigger={
                      <button className="group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border border-border/10 p-5 text-left transition-all hover:border-primary/20 hover:bg-primary/[0.02] active:scale-[0.99]">
                        <div
                          className={`h-10 w-10 rounded-xl ${method.bg} flex shrink-0 items-center justify-center border border-transparent transition-colors`}
                        >
                          <method.icon className={`h-5 w-5 ${method.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="font-bold text-[14px] text-foreground tracking-tight transition-colors group-hover:text-primary">
                              {method.title}
                            </span>
                            <Badge
                              variant="secondary"
                              size="xs"
                              uppercase
                              className="bg-secondary/50 text-muted-foreground/60 shadow-sm"
                            >
                              {method.badge}
                            </Badge>
                          </div>
                          <p className="font-medium text-[12px] text-muted-foreground/50 leading-snug">
                            {method.description}
                          </p>
                        </div>
                      </button>
                    }
                  />
                );
              }

              return (
                <button
                  key={method.id}
                  disabled={method.disabled}
                  className="group flex w-full cursor-not-allowed items-start gap-4 rounded-2xl border border-border/10 p-5 text-left opacity-50 grayscale"
                >
                  <div
                    className={`h-10 w-10 rounded-xl ${method.bg} flex shrink-0 items-center justify-center border border-transparent`}
                  >
                    <method.icon className={`h-5 w-5 ${method.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="font-bold text-[14px] text-foreground tracking-tight">
                        {method.title}
                      </span>
                      <Badge
                        variant="secondary"
                        size="xs"
                        uppercase
                        className="bg-secondary/50 text-muted-foreground/60 shadow-sm"
                      >
                        {method.badge}
                      </Badge>
                    </div>
                    <p className="font-medium text-[12px] text-muted-foreground/50 leading-snug">
                      {method.description}
                    </p>
                  </div>
                </button>
              );
            })}

            <div className="pt-4">
              <p className="text-center font-medium text-[10px] text-muted-foreground/40 italic">
                Candidate data is processed securely and matched using AI.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
