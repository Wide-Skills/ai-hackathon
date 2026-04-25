"use client";

import {
  RiCloseLine,
  RiFileLine,
  RiFileTextLine,
  RiLoader2Line,
  RiUploadCloud2Line,
} from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { QueryErrorState } from "@/components/data/query-state";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { invalidateHiringData, trpc } from "@/utils/trpc";

interface UploadResumeDialogProps {
  trigger?: React.ReactElement;
}

export function UploadResumeDialog({ trigger }: UploadResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [mode, setMode] = useState<"file" | "paste">("file");

  const [uploading, setUploading] = useState(false);
  const [parsingPdf, setParsingPdf] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const jobsQuery = useQuery(trpc.jobs.list.queryOptions());
  const jobs = jobsQuery.data ?? [];

  const ingestResume = useMutation(
    trpc.applicants.ingestFromResume.mutationOptions(),
  );

  const extractTextFromPdf = useCallback(async (file: File) => {
    try {
      setParsingPdf(true);

      const pdfjsLib = await import("pdfjs-dist");

      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += `${pageText}\n`;
      }
      setResumeText(fullText);
      setFileName(file.name);
      toast.success("PDF parsed successfully. Ready to import.");
    } catch (e) {
      console.error("PDF Parsing error:", e);
      toast.error("Failed to parse PDF file. Try pasting the text instead.");
    } finally {
      setParsingPdf(false);
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        extractTextFromPdf(file);
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumeText(e.target?.result as string);
          setFileName(file.name);
        };
        reader.readAsText(file);
      } else {
        toast.error("Please upload a PDF or TXT file");
      }
    },
    [extractTextFromPdf],
  );

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
    if (!selectedJobId || !firstName || !lastName || !email || !resumeText) {
      toast.error("Please fill in all required fields and provide resume text");
      return;
    }

    setUploading(true);
    try {
      await ingestResume.mutateAsync({
        jobId: selectedJobId,
        firstName,
        lastName,
        email,
        resumeText,
      });

      await invalidateHiringData(queryClient);
      toast.success(
        `Successfully imported and screened ${firstName} ${lastName}!`,
      );

      setOpen(false);
      reset();
    } catch (e: any) {
      toast.error(e.message || "Failed to import resume");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setResumeText("");
    setFileName("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setSelectedJobId("");
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
              <RiFileTextLine className="h-4 w-4" />
              Upload Resume
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto shadow-none sm:max-w-xl">
        <DialogHeader>
          <span className="mb-micro block font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.06em]">
            Single Import
          </span>
          <DialogTitle className="font-serif text-[28px] text-primary leading-tight">
            Import Profile
          </DialogTitle>
          <DialogDescription className="font-light font-sans text-[14px] text-ink-muted leading-relaxed">
            Upload or paste a resume to create a candidate profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-comfortable p-comfortable">
          <div className="grid grid-cols-2 gap-base">
            <div className="col-span-2 space-y-base">
              <Label className="ml-1 font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                Target Job <span className="text-status-error-text">*</span>
              </Label>
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
                  <SelectTrigger className="h-10 rounded-standard border-line bg-bg2 font-medium font-sans text-[13px] text-primary shadow-none">
                    <SelectValue placeholder="Select a job..." />
                  </SelectTrigger>
                  <SelectContent className="border-line bg-surface shadow-none">
                    {jobs.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-base">
              <Label className="ml-1 font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                First Name <span className="text-status-error-text">*</span>
              </Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Jane"
                className="h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] shadow-none"
              />
            </div>
            <div className="space-y-base">
              <Label className="ml-1 font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                Last Name <span className="text-status-error-text">*</span>
              </Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Doe"
                className="h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] shadow-none"
              />
            </div>
            <div className="col-span-2 space-y-base">
              <Label className="ml-1 font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                Professional Email{" "}
                <span className="text-status-error-text">*</span>
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] shadow-none"
              />
            </div>
          </div>

          <div className="space-y-comfortable border-line border-t pt-base">
            <div className="flex items-center justify-between">
              <Label className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                Source Document
              </Label>
              <div className="flex rounded-micro bg-bg-deep p-1">
                <button
                  className={`rounded-micro px-3 py-1 font-medium font-sans text-[10px] uppercase tracking-wider transition-all ${mode === "file" ? "bg-surface text-primary shadow-none" : "text-ink-faint hover:text-ink-muted"}`}
                  onClick={() => setMode("file")}
                >
                  File
                </button>
                <button
                  className={`rounded-micro px-3 py-1 font-medium font-sans text-[10px] uppercase tracking-wider transition-all ${mode === "paste" ? "bg-surface text-primary shadow-none" : "text-ink-faint hover:text-ink-muted"}`}
                  onClick={() => setMode("paste")}
                >
                  Text
                </button>
              </div>
            </div>

            {mode === "file" ? (
              !fileName ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-standard border border-dashed p-10 transition-all ${
                    dragOver
                      ? "border-primary bg-primary-alpha/10"
                      : "border-line bg-bg2 hover:border-primary/20 hover:bg-bg-alt/40"
                  }`}
                >
                  {parsingPdf ? (
                    <RiLoader2Line className="mb-comfortable size-6 animate-spin text-primary" />
                  ) : (
                    <RiUploadCloud2Line className="mb-comfortable size-6 text-ink-faint" />
                  )}
                  <p className="font-medium font-sans text-[13px] text-primary">
                    {parsingPdf
                      ? "Extracting info..."
                      : "Drop PDF or TXT resume here"}
                  </p>
                  <p className="mt-1 font-light font-sans text-[11px] text-ink-faint">
                    or click to browse your files
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-standard border border-line bg-bg2/40 px-base py-base">
                  <div className="flex items-center gap-base">
                    <div className="flex size-8 items-center justify-center rounded-micro border border-line bg-bg2">
                      <RiFileTextLine className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium font-sans text-[13px] text-primary leading-none">
                        {fileName}
                      </p>
                      <p className="mt-1 font-light font-sans text-[11px] text-ink-faint leading-none">
                        {resumeText.length.toLocaleString()} characters
                        extracted
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFileName("");
                      setResumeText("");
                    }}
                    className="flex size-8 items-center justify-center rounded-micro transition-colors hover:bg-bg-alt"
                  >
                    <RiCloseLine className="size-4 text-ink-faint" />
                  </button>
                </div>
              )
            ) : (
              <Textarea
                placeholder="Paste raw resume text here for AI analysis..."
                className="min-h-[180px] resize-none rounded-standard border-line bg-bg2 font-light font-sans text-[13px] outline-none transition-all focus:bg-surface focus:ring-Pa"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                variant="outline"
                size="default"
                className="h-9 rounded-standard border-line px-6 font-medium font-sans"
              >
                Cancel
              </Button>
            }
          />
          <Button
            onClick={handleUpload}
            disabled={
              uploading ||
              parsingPdf ||
              !resumeText ||
              !selectedJobId ||
              !firstName ||
              !email
            }
            className="h-9 rounded-standard px-6 font-medium font-sans"
          >
            {uploading ? (
              <>
                <RiLoader2Line className="mr-2 size-3.5 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <RiUploadCloud2Line className="mr-2 size-3.5" />
                Start Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
