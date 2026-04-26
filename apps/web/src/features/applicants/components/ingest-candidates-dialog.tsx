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
import { cn } from "@/lib/utils";
import { SimulateCandidatesDialog } from "./cloud-import-dialog";
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
      disabled: false,
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
      disabled: false,
    },
    {
      id: "simulate" as const,
      title: "Cloud Talent Import",
      description:
        "Directly sync candidates from our secure global talent cloud into your active recruitment pipelines.",
      icon: RiGlobeLine,
      color: "text-primary",
      bg: "bg-primary/5",
      badge: "Direct Sync",
      component: SimulateCandidatesDialog,
      disabled: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <RiAddLine />
        Add Candidates
      </DialogTrigger>
      <DialogContent className="max-w-4xl! overflow-hidden border-line bg-surface p-0 shadow-none">
        <div className="grid min-h-[520px] grid-cols-1 md:grid-cols-5">
          <div className="flex flex-col justify-between border-line border-r bg-bg-alt/40 p-comfortable md:col-span-2">
            <div>
              <span className="mb-micro block font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.08em]">
                Import Method
              </span>
              <h2 className="mb-base font-serif text-[32px] text-primary leading-tight">
                Import Center
              </h2>
              <p className="font-light font-sans text-[15px] text-ink-muted leading-relaxed">
                Add talent pools from multiple sources. Our system summarizes
                candidate skills and experience automatically.
              </p>
            </div>

            <div className="space-y-base">
              <div className="rounded-standard border border-line bg-surface p-comfortable">
                <p className="mb-2.5 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.1em]">
                  System Status
                </p>
                <div className="flex items-center gap-base">
                  <span className="size-1.5 rounded-full bg-status-success-text shadow-[0_0_8px_rgba(26,112,85,0.4)]" />
                  <span className="font-medium font-sans text-[11px] text-primary/60">
                    AI Engine Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-comfortable p-comfortable md:col-span-3">
            <div className="mb-comfortable">
              <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.1em]">
                Select Method
              </span>
            </div>

            <div className="space-y-base">
              {methods.map((method) => {
                const TriggerComponent = method.component;
                if (TriggerComponent) {
                  return (
                    <TriggerComponent
                      key={method.id}
                      trigger={
                        <button className="group relative flex w-full items-start gap-comfortable overflow-hidden rounded-standard border border-line p-comfortable text-left transition-all hover:border-line-medium hover:bg-bg-alt/20 active:scale-[0.99]">
                          <div
                            className={cn(
                              "flex h-11 w-11 shrink-0 items-center justify-center rounded-micro border border-line bg-bg2 transition-colors group-hover:border-primary/20 group-hover:bg-surface",
                            )}
                          >
                            <method.icon className="size-5 text-ink-faint transition-colors group-hover:text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between gap-base">
                              <span className="font-serif text-[18px] text-primary transition-colors group-hover:text-primary-muted">
                                {method.title}
                              </span>
                              <Badge variant="secondary" size="sm" uppercase>
                                {method.badge}
                              </Badge>
                            </div>
                            <p className="font-light font-sans text-[13px] text-ink-muted leading-tight">
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
                    className="group flex w-full cursor-not-allowed items-start gap-comfortable rounded-standard border border-line p-comfortable text-left opacity-30 grayscale"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-micro border border-line bg-bg2">
                      <method.icon className="size-5 text-ink-faint" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-base">
                        <span className="font-serif text-[18px] text-primary">
                          {method.title}
                        </span>
                        <Badge variant="secondary" size="sm" uppercase>
                          {method.badge}
                        </Badge>
                      </div>
                      <p className="font-light font-sans text-[13px] text-ink-muted">
                        {method.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-base border-line border-t pt-base">
              <p className="text-center font-light font-sans text-[11px] text-ink-faint italic">
                Candidate data is reviewed and summarized automatically.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
