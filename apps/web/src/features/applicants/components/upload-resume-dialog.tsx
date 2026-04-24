"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileIcon, FileText, Loader2, Upload, X } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { QueryErrorState } from "@/components/data/query-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
              className="h-10 gap-2 border-border/50 rounded-full font-bold text-[11px] uppercase tracking-widest shadow-md hover:bg-secondary"
            >
              <FileText className="h-4 w-4" />
              Upload Resume
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-md">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-display font-light text-xl uppercase tracking-widest">
                Profile Ingestion
              </DialogTitle>
              <DialogDescription className="font-medium text-[13px] text-muted-foreground/60 leading-tight">
                Extract talent architecture from resume documentation.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label className="font-bold text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                Target Position <span className="text-destructive">*</span>
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
                  <SelectTrigger className="h-11 rounded-xl border-border/50 bg-secondary/30 font-medium text-[14px]">
                    <SelectValue placeholder="Select position architecture..." />
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

            <div className="space-y-1.5">
              <Label className="font-bold text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="h-11 rounded-xl border-border/50 bg-secondary/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="h-11 rounded-xl border-border/50 bg-secondary/30"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="font-bold text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="h-11 rounded-xl border-border/50 bg-secondary/30"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Resume Content <span className="text-destructive">*</span>
              </Label>
              <div className="flex rounded-lg bg-muted/50 p-1">
                <button
                  className={`rounded-md px-3 py-1 font-medium text-xs transition-colors ${mode === "file" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setMode("file")}
                >
                  File Upload
                </button>
                <button
                  className={`rounded-md px-3 py-1 font-medium text-xs transition-colors ${mode === "paste" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setMode("paste")}
                >
                  Paste Text
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
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  {parsingPdf ? (
                    <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                  ) : (
                    <Upload className="mb-3 h-8 w-8 text-muted-foreground/50" />
                  )}
                  <p className="font-medium text-foreground text-sm">
                    {parsingPdf
                      ? "Parsing PDF..."
                      : "Drop PDF or TXT file here"}
                  </p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    or click to browse
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
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {fileName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {resumeText.length} characters extracted
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFileName("");
                      setResumeText("");
                    }}
                    className="rounded-full p-1 hover:bg-muted"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              )
            ) : (
              <Textarea
                placeholder="Paste resume text here..."
                className="min-h-[150px] resize-y text-sm"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full border-border/50 font-bold text-[11px] uppercase tracking-widest"
            >
              Cancel
            </Button>
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
              className="h-11 gap-2.5 rounded-full bg-primary font-bold text-[11px] text-white uppercase tracking-[0.2em] shadow-lg transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Neural Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Initialize Import
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
