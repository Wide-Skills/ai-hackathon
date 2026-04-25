"use client";

import {
  RiAlertLine,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiFileExcel2Line,
  RiLoader2Line,
  RiUploadCloud2Line,
} from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { QueryErrorState } from "@/components/data/query-state";
import { Badge } from "@/components/ui/badge";
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

  const firstNameIdx = headers.findIndex((h) =>
    ["firstname", "first_name", "first name", "fname"].includes(h),
  );
  const lastNameIdx = headers.findIndex((h) =>
    ["lastname", "last_name", "last name", "lname"].includes(h),
  );
  const nameIdx = headers.findIndex((h) =>
    ["name", "full_name", "fullname", "full name"].includes(h),
  );
  const emailIdx = headers.findIndex((h) =>
    ["email", "email_address", "e-mail"].includes(h),
  );
  const headlineIdx = headers.findIndex((h) =>
    ["headline", "title", "job_title", "position", "role"].includes(h),
  );
  const locationIdx = headers.findIndex((h) =>
    ["location", "city", "country", "address"].includes(h),
  );
  const skillsIdx = headers.findIndex((h) =>
    ["skills", "technologies", "tech_stack"].includes(h),
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

    const candidate: ParsedCandidate = {
      firstName,
      lastName: lastName || "Unknown",
      email,
    };

    if (headlineIdx >= 0 && values[headlineIdx]) {
      candidate.headline = values[headlineIdx];
    }
    if (locationIdx >= 0 && values[locationIdx]) {
      candidate.location = values[locationIdx];
    }
    if (skillsIdx >= 0 && values[skillsIdx]) {
      candidate.skills = values[skillsIdx]
        .split(/[;|]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    candidates.push(candidate);
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

  const jobsQuery = useQuery(trpc.jobs.list.queryOptions());
  const jobs = jobsQuery.data ?? [];

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
        toast.error(
          "Could not parse candidates. Ensure your CSV has columns: first_name, last_name (or name), email",
        );
        return;
      }
      setCandidates(parsed);
      toast.success(`Found ${parsed.length} candidates in ${file.name}`);
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
    if (!selectedJobId) {
      toast.error("Please select a job position");
      return;
    }
    if (candidates.length === 0) {
      toast.error("No candidates to upload");
      return;
    }

    setUploading(true);
    let success = 0;
    let failed = 0;

    try {
      const result = await ingestBatch.mutateAsync({
        jobId: selectedJobId,
        candidates: candidates.map((c) => ({
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          headline: c.headline,
          location: c.location,
          skills: c.skills,
        })),
      });
      success = result.successCount;
      failed = result.failedCount;
    } catch (e) {
      console.error("Batch upload failed:", e);
      failed = candidates.length;
    }

    await invalidateHiringData(queryClient);

    setUploading(false);

    if (failed > 0) {
      toast.warning(`Uploaded ${success} candidates. ${failed} failed.`);
    } else {
      toast.success(`Successfully uploaded ${success} candidates!`);
    }

    setOpen(false);
    setCandidates([]);
    setFileName("");
    setSelectedJobId("");
  };

  const reset = () => {
    setCandidates([]);
    setFileName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          (trigger as React.ReactElement) || (
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 rounded-full border-border/50 font-bold text-[11px] uppercase tracking-widest shadow-md hover:bg-secondary"
            >
              <RiUploadCloud2Line className="h-4 w-4" />
              Upload CSV
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div>
              <DialogTitle className="font-display font-light text-xl uppercase tracking-widest">
                Ingestion Node
              </DialogTitle>
              <DialogDescription className="font-medium text-[13px] text-muted-foreground/60 leading-tight">
                Import talent architectures from structured CSV data.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <div className="space-y-1.5">
            <label className="font-medium text-sm">
              Target Position <span className="text-destructive">*</span>
            </label>
            {jobsQuery.isError ? (
              <QueryErrorState
                error={jobsQuery.error}
                title="Jobs couldn't be loaded"
                onRetry={() => jobsQuery.refetch()}
              />
            ) : (
              <Select
                value={selectedJobId}
                onValueChange={(val) => setSelectedJobId(val ?? "")}
              >
                <SelectTrigger className="h-11 rounded-xl border-border/50 bg-secondary/30 font-medium text-[14px]">
                  <SelectValue placeholder="Select position architecture...">
                    {selectedJobId &&
                      jobs.find((j) => j.id === selectedJobId)?.title}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/50"
              }`}
            >
              <RiUploadCloud2Line className="mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="font-medium text-foreground text-sm">
                Drop your CSV file here
              </p>
              <p className="mt-1 text-muted-foreground text-xs">
                or click to browse · Supports .csv files
              </p>
              <p className="mt-3 rounded-lg bg-muted px-3 py-1.5 text-muted-foreground text-xs">
                Required columns:{" "}
                <span className="font-semibold">
                  first_name, last_name, email
                </span>
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
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <RiFileExcel2Line className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {fileName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {candidates.length} candidates parsed
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="rounded-full p-1 hover:bg-muted"
                >
                  <RiCloseLine className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="max-h-52 overflow-y-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border border-b bg-muted/30">
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs">
                        Name
                      </th>
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs">
                        Email
                      </th>
                      <th className="hidden px-3 py-2 text-left font-semibold text-muted-foreground text-xs sm:table-cell">
                        Skills
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {candidates.slice(0, 20).map((c, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-medium text-foreground text-xs">
                          {c.firstName} {c.lastName}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground text-xs">
                          {c.email}
                        </td>
                        <td className="hidden px-3 py-2 sm:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {(c.skills || []).slice(0, 3).map((s) => (
                              <Badge
                                key={s}
                                variant="outline"
                                className="border-primary/20 bg-primary/10 px-1.5 py-0 text-[10px] text-primary"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {candidates.length > 20 && (
                  <p className="px-3 py-2 text-center text-muted-foreground text-xs">
                    ... and {candidates.length - 20} more
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
                <RiCheckboxCircleLine className="h-4 w-4 text-success" />
                <p className="font-medium text-sm text-success">
                  {candidates.length} candidates ready to import
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-8 gap-3 border-border/10 border-t pt-8">
            <DialogClose
              render={
                <Button
                  variant="outline"
                  className="rounded-full"
                  size={"lg"}
                />
              }
            >
              Cancel Protocol
            </DialogClose>
            <Button
              onClick={handleUpload}
              disabled={uploading || candidates.length === 0 || !selectedJobId}
              className="rounded-full"
              size={"lg"}
            >
              {uploading ? (
                <>
                  <RiLoader2Line className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RiUploadCloud2Line className="h-4 w-4" />
                  Initialize Batch Import
                </>
              )}
            </Button>
          </DialogFooter>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
            <RiAlertLine className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground/50" />
            <p className="text-muted-foreground text-xs leading-relaxed">
              Your CSV should have headers like{" "}
              <code className="rounded bg-muted px-1 text-[10px]">
                first_name
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1 text-[10px]">
                last_name
              </code>
              , <code className="rounded bg-muted px-1 text-[10px]">email</code>
              . Optional:{" "}
              <code className="rounded bg-muted px-1 text-[10px]">
                headline
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1 text-[10px]">
                location
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1 text-[10px]">skills</code>{" "}
              (semicolon-separated).
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
