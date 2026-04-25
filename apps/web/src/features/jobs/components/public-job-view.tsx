"use client";

import {
  RiBriefcaseLine,
  RiCheckboxCircleLine,
  RiFileTextLine,
  RiLoader2Line,
  RiMapPinLine,
  RiUploadCloud2Line,
} from "@remixicon/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";

interface PublicJobViewProps {
  jobId: string;
}

export function PublicJobView({ jobId }: PublicJobViewProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [parsingPdf, setParsingPdf] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const jobQuery = useQuery(
    trpc.jobs.getPublicById.queryOptions({ id: jobId }),
  );
  const applyMutation = useMutation(
    trpc.applicants.publicApply.mutationOptions(),
  );

  const job = jobQuery.data;

  const extractTextFromPdf = useCallback(async (file: File) => {
    try {
      setParsingPdf(true);

      // Dynamically import pdfjs-dist only on the client
      const pdfjsLib = await import("pdfjs-dist");

      // Configure worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
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
      toast.success("Resume parsed successfully!");
    } catch (e) {
      console.error("PDF Parsing error:", e);
      toast.error("Failed to parse PDF. Please try a different file.");
    } finally {
      setParsingPdf(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      extractTextFromPdf(file);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    if (!resumeText) {
      toast.error("Please upload your resume");
      return;
    }

    setSubmitting(true);
    try {
      await applyMutation.mutateAsync({
        jobId,
        firstName,
        lastName,
        email,
        resumeText,
      });

      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (jobQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <RiLoader2Line className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <h1 className="font-bold text-2xl">Job Not Found</h1>
        <p className="text-muted-foreground">
          The job listing you are looking for does not exist or has been closed.
        </p>
        <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg-alt/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-base rounded-card border border-line bg-surface p-comfortable text-center shadow-none"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-status-success-bg/20 bg-status-success-bg">
            <RiCheckboxCircleLine className="size-8 text-status-success-text" />
          </div>
          <h2 className="font-serif text-[28px] text-primary leading-tight">
            Application Received
          </h2>
          <p className="font-light font-sans text-[15px] text-ink-muted leading-relaxed">
            Thank you for applying for the{" "}
            <span className="font-medium text-primary">{job.title}</span>{" "}
            position. Our AI system will review your match score
            shortly.
          </p>
          <Button
            variant="outline"
            className="h-10 rounded-standard border-line px-8 font-medium font-sans"
            onClick={() => (window.location.href = "/")}
          >
            Return Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="container-tight pt-32 pb-24">
        <div className="grid grid-cols-1 gap-hero lg:grid-cols-3">
          {/* Job Details */}
          <div className="space-y-section-gap lg:col-span-2">
            <div className="space-y-base">
              <Badge
                variant="secondary"
                className="rounded-micro border-line bg-bg2 px-3 py-0.5 font-medium font-sans text-[10px] text-primary uppercase"
              >
                {job.department}
              </Badge>
              <h1 className="font-serif text-[42px] text-primary leading-[1.1] tracking-tight md:text-[56px]">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-base font-medium font-sans text-[12px] text-ink-faint uppercase tracking-wider">
                <div className="flex items-center gap-base">
                  <RiMapPinLine className="size-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-base">
                  <RiBriefcaseLine className="size-4" />
                  {job.type}
                </div>
              </div>
            </div>

            <div className="space-y-section-gap">
              <section>
                <h3 className="border-line border-b pb-base font-serif text-[22px] text-primary">
                  Description
                </h3>
                <p className="whitespace-pre-wrap pt-comfortable font-light font-sans text-[15px] text-ink-muted leading-relaxed">
                  {job.description}
                </p>
              </section>

              <section>
                <h3 className="border-line border-b pb-base font-serif text-[22px] text-primary">
                  Strategic Requirements
                </h3>
                <ul className="grid grid-cols-1 gap-base pt-comfortable md:grid-cols-2">
                  {job.requirements.map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-base font-light font-sans text-[14px] text-ink-muted leading-snug"
                    >
                      <div className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-primary/30" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="border-line border-b pb-base font-serif text-[22px] text-primary">
                  Key Expertise
                </h3>
                <div className="flex flex-wrap gap-small pt-comfortable">
                  {job.skills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="rounded-micro border-line bg-bg2 px-4 py-1 font-medium font-sans text-[12px] text-primary shadow-none"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-comfortable rounded-card border border-line bg-surface p-comfortable shadow-none">
              <div className="border-line border-b pb-base">
                <h3 className="font-serif text-[24px] text-primary">
                  Apply Now
                </h3>
              </div>

              <form onSubmit={handleApply} className="space-y-base">
                <div className="grid grid-cols-2 gap-base">
                  <div className="space-y-micro">
                    <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                      First Name
                    </label>
                    <Input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] shadow-none"
                    />
                  </div>
                  <div className="space-y-micro">
                    <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                      Last Name
                    </label>
                    <Input
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] shadow-none"
                    />
                  </div>
                </div>

                <div className="space-y-micro">
                  <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@example.com"
                    className="h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] shadow-none"
                  />
                </div>

                <div className="space-y-micro">
                  <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    Resume (PDF)
                  </label>
                  <div
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-standard border border-dashed p-8 transition-all ${
                      resumeText
                        ? "border-primary/20 bg-primary-alpha/5"
                        : "border-line bg-bg2 hover:border-primary/20 hover:bg-bg-alt/40"
                    }`}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {parsingPdf ? (
                      <div className="flex flex-col items-center gap-base">
                        <RiLoader2Line className="size-6 animate-spin text-primary" />
                        <span className="font-medium font-sans text-[13px] text-primary">
                          Analyzing...
                        </span>
                      </div>
                    ) : resumeText ? (
                      <div className="flex items-center gap-base">
                        <RiFileTextLine className="size-6 text-primary" />
                        <span className="max-w-[150px] truncate font-medium font-sans text-[13px] text-primary">
                          {fileName || "Profile Ready"}
                        </span>
                      </div>
                    ) : (
                      <>
                        <RiUploadCloud2Line className="mb-base size-6 text-ink-faint" />
                        <span className="text-center font-medium font-sans text-[13px] text-primary">
                          Upload Document
                        </span>
                        <span className="mt-1 font-light font-sans text-[11px] text-ink-faint">
                          PDF max 5MB
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || parsingPdf}
                  className="mt-base h-11 w-full rounded-standard bg-primary font-medium font-sans text-[14px] text-white shadow-none transition-all active:scale-[0.98]"
                >
                  {submitting ? (
                    <>
                      <RiLoader2Line className="mr-base size-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>

                <p className="px-base text-center font-light font-sans text-[10px] text-ink-faint italic leading-relaxed">
                  By applying, you agree to our terms. Data is processed with AI
                  analysis to determine fit.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}