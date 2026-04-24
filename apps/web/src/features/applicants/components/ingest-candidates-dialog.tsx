"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BrainCircuit,
  FileSpreadsheet,
  FileText,
  Globe,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc";
import { UploadCandidatesDialog } from "./upload-candidates-dialog";
import { UploadResumeDialog } from "./upload-resume-dialog";

export function IngestCandidatesDialog() {
  const [open, setOpen] = useState(false);

  const methods = [
    {
      id: "resume" as const,
      title: "Neural Resume Import",
      description: "Extract full talent profiles from PDF/Text using deep semantic analysis.",
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/5",
      badge: "Deep Analysis",
      component: UploadResumeDialog,
    },
    {
      id: "csv" as const,
      title: "Batch CSV Protocol",
      description: "Import massive talent pools from structured data files for high-volume screening.",
      icon: FileSpreadsheet,
      color: "text-info",
      bg: "bg-info/5",
      badge: "Scale",
      component: UploadCandidatesDialog,
    },
    {
      id: "api" as const,
      title: "External API Node",
      description: "Connect Greenhouse, Lever, or custom endpoints for automated ingestion.",
      icon: Globe,
      color: "text-muted-foreground",
      bg: "bg-muted/5",
      badge: "Coming Soon",
      disabled: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 gap-2 bg-primary font-bold text-[11px] uppercase tracking-[0.2em] text-white shadow-premium transition-all hover:bg-primary/90 active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Ingest Talent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-border/40 p-0 overflow-hidden shadow-premium bg-background">
        <div className="grid grid-cols-1 md:grid-cols-5">
           <div className="md:col-span-2 bg-secondary/30 p-8 border-r border-border/10 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-ethereal">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-display text-xl font-light text-foreground uppercase tracking-widest mb-4">Ingestion Core</h2>
                <p className="text-[13px] font-medium text-muted-foreground/60 leading-relaxed tracking-tight">
                  Select your data intake protocol. Our neural engine will automatically extract, map, and score every candidate against your active job architectures.
                </p>
              </div>
              
              <div className="space-y-4">
                 <div className="p-4 rounded-xl border border-border/10 bg-background/50 backdrop-blur-sm">
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-2">Platform Status</p>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                        <span className="text-[11px] font-bold text-foreground/60 tracking-tight">AI Engine Online</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="md:col-span-3 p-8 space-y-4">
              <div className="mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/40 mb-2">Select Protocol</h3>
                <div className="h-1 w-12 bg-primary/20 rounded-full" />
              </div>

              {methods.map((method) => {
                const TriggerComponent = method.component;
                if (TriggerComponent) {
                    return (
                        <TriggerComponent 
                            key={method.id}
                            trigger={
                                <button
                                    className="group w-full flex items-start gap-4 p-5 rounded-2xl border border-border/10 hover:border-primary/20 hover:bg-primary/[0.02] transition-all text-left relative overflow-hidden active:scale-[0.99]"
                                >
                                    <div className={`h-10 w-10 rounded-xl ${method.bg} flex items-center justify-center shrink-0 border border-transparent group-hover:border-current transition-colors`}>
                                        <method.icon className={`h-5 w-5 ${method.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="font-bold text-[14px] text-foreground tracking-tight group-hover:text-primary transition-colors">{method.title}</span>
                                            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-pill bg-secondary/50 text-muted-foreground/60">{method.badge}</span>
                                        </div>
                                        <p className="text-[12px] font-medium text-muted-foreground/50 leading-snug">
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
                        className="group w-full flex items-start gap-4 p-5 rounded-2xl border border-border/10 opacity-50 cursor-not-allowed text-left grayscale"
                    >
                        <div className={`h-10 w-10 rounded-xl ${method.bg} flex items-center justify-center shrink-0 border border-transparent`}>
                            <method.icon className={`h-5 w-5 ${method.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-[14px] text-foreground tracking-tight">{method.title}</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-pill bg-secondary/50 text-muted-foreground/60">{method.badge}</span>
                            </div>
                            <p className="text-[12px] font-medium text-muted-foreground/50 leading-snug">
                                {method.description}
                            </p>
                        </div>
                    </button>
                );
              })}

              <div className="pt-4">
                 <p className="text-[10px] font-medium text-muted-foreground/40 text-center italic">
                    All processed data is encrypted and optimized for neural retrieval.
                 </p>
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
