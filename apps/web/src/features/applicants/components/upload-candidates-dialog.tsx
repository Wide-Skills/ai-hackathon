"use client";

import {
  RiCheckboxCircleLine,
  RiCloseLine,
  RiFileExcel2Line,
  RiUploadCloud2Line,
} from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
import { invalidateHiringData, trpc } from "@/utils/trpc";

interface ParsedCandidate {
  firstName: string;
  lastName: string;
  email: string;
  headline?: string;
  location?: string;
  skills?: string[];
}

interface UploadCandidatesDialogProps {
  trigger?: React.ReactElement;
}

function parseCSV(text: string): ParsedCandidate[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));

  const emailIdx = headers.findIndex((h) =>
    ["email", "email_address", "e-mail"].includes(h),
  );
  const nameIdx = headers.findIndex((h) =>
    ["name", "full_name", "fullname", "full name"].includes(h),
  );
  const firstNameIdx = headers.findIndex((h) =>
    ["firstname", "first_name", "first name", "fname"].includes(h),
  );
  const lastNameIdx = headers.findIndex((h) =>
    ["lastname", "last_name", "last name", "lname"].includes(h),
  );

  if (emailIdx === -1) return [];

  const candidates: ParsedCandidate[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]
      .split(",")
      .map((v) => v.trim().replace(/^["']|["']$/g, ""));
    if (values.length < 2) continue;

    let firstName = "";
    let lastName = "";

    if (firstNameIdx >= 0 && lastNameIdx >= 0) {
      firstName = values[firstNameIdx] || "";
      lastName = values[lastNameIdx] || "";
    } else if (nameIdx >= 0) {
      const parts = (values[nameIdx] || "").split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || "";
    }

    const email = values[emailIdx] || "";
    if (!email || !firstName) continue;

    candidates.push({
      firstName,
      lastName: lastName || "Unknown",
      email,
    });
  }

  return candidates;
}

export function UploadCandidatesDialog({
  trigger,
}: UploadCandidatesDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [candidates, setCandidates] = useState<ParsedCandidate[]>([]);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const jobsQuery = useQuery(
    trpc.jobs.list.queryOptions({ page: 1, limit: 100 }),
  );
  const jobs = jobsQuery.data?.items ?? [];

  const ingestBatch = useMutation(
    trpc.applicants.ingestBatch.mutationOptions(),
  );

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        toast.error("Could not parse candidates. Check your CSV headers.");
        return;
      }
      setCandidates(parsed);
      toast.success(`Parsed ${parsed.length} candidates.`);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleUpload = async () => {
    if (!selectedJobId || candidates.length === 0) return;

    setUploading(true);
    try {
      await ingestBatch.mutateAsync({
        jobId: selectedJobId,
        candidates: candidates.map((c) => ({
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
        })),
      });
      await invalidateHiringData(queryClient);
      toast.success(`Successfully imported ${candidates.length} candidates!`);
      setOpen(false);
      setCandidates([]);
      setFileName("");
    } catch (_e) {
      toast.error("Batch upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto shadow-none sm:max-w-xl">
        <DialogHeader>
          <span className="mb-micro block font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.06em]">
            Bulk Import
          </span>
          <DialogTitle className="font-serif text-[28px] text-primary leading-tight">
            Batch Import
          </DialogTitle>
          <DialogDescription className="font-light font-sans text-[14px] text-ink-muted leading-relaxed">
            Import multiple candidate profiles from a CSV file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-comfortable p-comfortable">
          <div className="space-y-base">
            <label className="ml-1 font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
              Target Job <span className="text-status-error-text">*</span>
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

          {candidates.length === 0 ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-standard border border-dashed p-12 transition-all",
                dragOver
                  ? "border-primary bg-primary-alpha/10"
                  : "border-line bg-bg2 hover:border-primary/20 hover:bg-bg-alt/40",
              )}
            >
              <RiUploadCloud2Line className="mb-comfortable size-8 text-ink-faint" />
              <p className="font-medium font-sans text-[13px] text-primary">
                Drop CSV dataset here
              </p>
              <p className="mt-1 font-light font-sans text-[11px] text-ink-faint">
                or click to browse local storage
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          ) : (
            <div className="space-y-base">
              <div className="flex items-center justify-between rounded-standard border border-line bg-bg2/40 px-base py-base">
                <div className="flex items-center gap-base">
                  <div className="flex size-8 items-center justify-center rounded-micro border border-line bg-bg2">
                    <RiFileExcel2Line className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium font-sans text-[13px] text-primary leading-none">
                      {fileName}
                    </p>
                    <p className="mt-1 font-light font-sans text-[11px] text-ink-faint leading-none">
                      {candidates.length} candidates parsed
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCandidates([])}
                  className="flex size-8 items-center justify-center rounded-micro transition-colors hover:bg-bg-alt"
                >
                  <RiCloseLine className="size-4 text-ink-faint" />
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto rounded-standard border border-line bg-surface">
                <table className="w-full text-left">
                  <thead className="sticky top-0 border-line border-b bg-bg-alt/40">
                    <tr>
                      <th className="px-base py-2 font-medium font-sans text-[10px] text-ink-faint uppercase">
                        Name
                      </th>
                      <th className="px-base py-2 font-medium font-sans text-[10px] text-ink-faint uppercase">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {candidates.slice(0, 10).map((c, i) => (
                      <tr key={i}>
                        <td className="px-base py-2 font-medium font-sans text-[12px] text-primary">
                          {c.firstName} {c.lastName}
                        </td>
                        <td className="px-base py-2 font-light font-sans text-[11px] text-ink-muted">
                          {c.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center gap-base rounded-micro border border-status-success-bg/20 bg-status-success-bg p-base">
            <RiCheckboxCircleLine className="size-4 text-status-success-text" />
            <p className="font-medium font-sans text-[11px] text-status-success-text uppercase tracking-wider">
              Ready for AI screening
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
            onClick={handleUpload}
            disabled={uploading || candidates.length === 0 || !selectedJobId}
            className="h-9 rounded-standard font-medium font-sans text-[12px]"
          >
            {uploading ? "Importing..." : "Start Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
