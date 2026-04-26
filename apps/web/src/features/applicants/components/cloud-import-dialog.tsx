"use client";

import { RiGlobeLine, RiLoader2Line } from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invalidateHiringData, trpc } from "@/utils/trpc";

interface SimulateCandidatesDialogProps {
  trigger?: React.ReactElement;
}

export function SimulateCandidatesDialog({
  trigger,
}: SimulateCandidatesDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const queryClient = useQueryClient();

  const jobsQuery = useQuery(
    trpc.jobs.list.queryOptions({ page: 1, limit: 100 }),
  );
  const jobs = jobsQuery.data?.items ?? [];

  const generateDummy = useMutation(
    trpc.applicants.generateDummy.mutationOptions(),
  );

  const handleGenerate = async () => {
    if (!selectedJobId) return;

    setGenerating(true);
    try {
      await generateDummy.mutateAsync({
        jobId: selectedJobId,
        count,
      });
      await invalidateHiringData(queryClient);
      toast.success(
        `Cloud sync complete. AI is now analyzing ${count} new profiles in the background.`,
      );
      setOpen(false);
    } catch (_e) {
      toast.error("Cloud synchronization failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto shadow-none sm:max-w-md">
        <DialogHeader>
          <span className="mb-micro block font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.06em]">
            Secure Integration
          </span>
          <DialogTitle className="font-serif text-[28px] text-primary leading-tight">
            Cloud Talent Import
          </DialogTitle>
          <DialogDescription className="font-light font-sans text-[14px] text-ink-muted leading-relaxed">
            Sync verified candidate profiles directly from our secure talent
            cloud into your recruitment pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-comfortable p-comfortable">
          <div className="space-y-base">
            <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
              Target Pipeline <span className="text-status-error-text">*</span>
            </label>
            <Select
              value={selectedJobId}
              onValueChange={(val) => setSelectedJobId(val ?? "")}
            >
              <SelectTrigger className="h-10 rounded-standard border-line bg-bg2 font-medium font-sans text-[13px] text-primary shadow-none">
                <SelectValue placeholder="Select a job...">
                  {jobs.find((j) => j.id === selectedJobId)?.title}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-line bg-surface shadow-none">
                {jobs.map((j) => (
                  <SelectItem key={j.id} value={j.id}>
                    {j.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-base">
            <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
              Sync Volume
            </label>
            <div className="flex rounded-micro bg-bg-deep p-1">
              {[5, 10, 20].map((c) => (
                <button
                  key={c}
                  className={`flex-1 rounded-micro py-1.5 font-medium font-sans text-[10px] uppercase transition-all ${count === c ? "bg-surface text-primary shadow-none" : "text-ink-faint hover:text-ink-muted"}`}
                  onClick={() => setCount(c)}
                >
                  {c} Profiles
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-base rounded-micro border border-line bg-bg-alt/30 p-base">
            <RiGlobeLine className="size-4 text-primary/40" />
            <p className="font-light font-sans text-[12px] text-ink-muted italic">
              AI screening and profile extraction will run automatically upon
              sync.
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                variant="outline"
                className="h-9 rounded-standard border-line font-medium font-sans text-[12px]"
              >
                Cancel
              </Button>
            }
          />
          <Button
            onClick={handleGenerate}
            disabled={generating || !selectedJobId}
            className="h-9 rounded-standard font-medium font-sans text-[12px]"
          >
            {generating ? (
              <>
                <RiLoader2Line className="mr-2 size-3.5 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RiGlobeLine className="mr-2 size-3.5" />
                Initialize Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
