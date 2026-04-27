"use client";

import {
  RiAtLine,
  RiBriefcaseLine,
  RiCheckboxCircleLine,
  RiFileTextLine,
  RiLoader2Line,
  RiMapPinLine,
  RiUploadCloud2Line,
  RiUserLine,
} from "@remixicon/react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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

  const jobQuery = useQuery({
    ...trpc.jobs.getPublicById.queryOptions({ id: jobId }),
    placeholderData: keepPreviousData,
  });
  const applyMutation = useMutation(
    trpc.applicants.publicApply.mutationOptions(),
  );

  const job = jobQuery.data;

  const extractTextFromPdf = useCallback(async (file: File) => {
    try {
      setParsingPdf(true);
      const pdfjsLib = await import("pdfjs-dist");
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
      console.error("pdf parsing error:", e);
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
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-base">
          <RiLoader2Line className="h-10 w-10 animate-spin text-primary opacity-20" />
          <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.1em]">
            Initializing Environment
          </span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas p-comfortable text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <h1 className="font-serif text-[42px] text-primary leading-tight">
            Job Not Found
          </h1>
          <p className="mt-base font-light font-sans text-[16px] text-ink-muted leading-relaxed">
            The position you are looking for may have been closed or the link
            has expired.
          </p>
          <Button
            variant="outline"
            className="mt-hero h-11 rounded-standard border-line px-10 font-medium font-sans"
            onClick={() => (window.location.href = "/")}
          >
            Return to Career Page
          </Button>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas p-comfortable">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-medium rounded-card border border-line bg-surface p-section-gap text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-status-success-bg/30 bg-status-success-bg/50">
            <RiCheckboxCircleLine className="size-10 text-status-success-text" />
          </div>
          <div className="space-y-base">
            <h2 className="font-serif text-[32px] text-primary leading-tight">
              Application Received
            </h2>
            <p className="font-light font-sans text-[15px] text-ink-muted leading-relaxed">
              Thank you for applying for the{" "}
              <span className="font-medium text-primary">{job.title}</span>{" "}
              position. Our AI-driven selection engine will analyze your profile
              and update you via email.
            </p>
          </div>
          <div className="pt-base">
            <Button
              variant="outline"
              className="h-11 w-full rounded-standard border-line font-medium font-sans"
              onClick={() => (window.location.href = "/")}
            >
              Finish and Return Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="container-meridian pt-32 pb-32">
        <div className="mx-auto max-w-4xl">
          {/* job details */}
          <div className="space-y-section-gap">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-base text-center"
            >
              <Badge
                variant="secondary"
                className="mx-auto rounded-micro border-line bg-bg2 px-3 py-0.5 font-medium font-sans text-[10px] text-primary uppercase tracking-[0.06em]"
              >
                {job.department}
              </Badge>
              <h1 className="mx-auto max-w-[800px] font-serif text-[42px] text-primary leading-[1.1] tracking-tight md:text-[64px]">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-x-hero gap-y-base font-medium font-sans text-[12px] text-ink-faint uppercase tracking-[0.1em]">
                <div className="flex items-center gap-base">
                  <RiMapPinLine className="size-4 opacity-40" />
                  {job.location}
                </div>
                <div className="flex items-center gap-base">
                  <RiBriefcaseLine className="size-4 opacity-40" />
                  {job.type}
                </div>
              </div>
            </motion.div>

            <div className="space-y-section-gap pt-hero">
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="mb-base border-line border-b pb-small">
                  <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
                    Context
                  </span>
                  <h3 className="mt-micro font-serif text-[22px] text-primary">
                    Position Architecture
                  </h3>
                </div>
                <Card
                  variant="default"
                  className="border-line bg-bg-alt/10 p-comfortable shadow-none"
                >
                  <p className="whitespace-pre-wrap font-light font-sans text-[15px] text-ink-muted leading-[1.7]">
                    {job.description}
                  </p>
                </Card>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-base border-line border-b pb-small">
                  <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
                    Benchmarking
                  </span>
                  <h3 className="mt-micro font-serif text-[22px] text-primary">
                    Strategic Requirements
                  </h3>
                </div>
                <Card
                  variant="default"
                  className="border-line bg-bg-alt/10 p-comfortable shadow-none"
                >
                  <ul className="grid grid-cols-1 gap-x-hero gap-y-base md:grid-cols-2">
                    {job.requirements.map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-base font-light font-sans text-[14px] text-ink-muted leading-relaxed"
                      >
                        <div className="mt-2 size-1 flex-shrink-0 rounded-full bg-primary/30" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="mb-base border-line border-b pb-small">
                  <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
                    Expertise
                  </span>
                  <h3 className="mt-micro font-serif text-[22px] text-primary">
                    Stack & Competencies
                  </h3>
                </div>
                <div className="flex flex-wrap gap-small pt-base">
                  {job.skills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="rounded-micro border-line bg-bg2 px-4 py-1 font-medium font-sans text-[12px] text-primary shadow-none"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* redesigned studio application form */}
            <div className="border-line border-t pt-hero">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mx-auto max-w-2xl"
              >
                <div className="mb-hero text-center">
                  <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.2em]">
                    Submission Portal
                  </span>
                  <h3 className="mt-micro font-serif text-[32px] text-primary leading-tight">
                    Submit Your Credentials
                  </h3>
                </div>

                <form onSubmit={handleApply} className="space-y-comfortable">
                  <div className="grid grid-cols-1 gap-comfortable md:grid-cols-2">
                    <div className="space-y-micro">
                      <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.15em]">
                        First Identity
                      </label>
                      <InputGroup className="h-11 overflow-hidden rounded-standard border-line bg-bg2 px-1 shadow-none transition-all focus-within:border-primary/20 focus-within:ring-Pa">
                        <InputGroupAddon align="inline-start" className="pl-3">
                          <RiUserLine className="h-3.5 w-3.5 text-ink-faint" />
                        </InputGroupAddon>
                        <InputGroupInput
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="e.g. Jane"
                          className="bg-transparent font-normal font-sans text-[13px]"
                        />
                      </InputGroup>
                    </div>
                    <div className="space-y-micro">
                      <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.15em]">
                        Last Identity
                      </label>
                      <InputGroup className="h-11 overflow-hidden rounded-standard border-line bg-bg2 px-1 shadow-none transition-all focus-within:border-primary/20 focus-within:ring-Pa">
                        <InputGroupAddon align="inline-start" className="pl-3">
                          <RiUserLine className="h-3.5 w-3.5 text-ink-faint" />
                        </InputGroupAddon>
                        <InputGroupInput
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="e.g. Doe"
                          className="bg-transparent font-normal font-sans text-[13px]"
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="space-y-micro">
                    <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.15em]">
                      Direct Channel
                    </label>
                    <InputGroup className="h-11 overflow-hidden rounded-standard border-line bg-bg2 px-1 shadow-none transition-all focus-within:border-primary/20 focus-within:ring-Pa">
                      <InputGroupAddon align="inline-start" className="pl-3">
                        <RiAtLine className="h-3.5 w-3.5 text-ink-faint" />
                      </InputGroupAddon>
                      <InputGroupInput
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane.doe@example.com"
                        className="bg-transparent font-normal font-sans text-[13px]"
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-micro pt-base">
                    <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.15em]">
                      Performance History
                    </label>
                    <div
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-card border transition-all ${
                        resumeText
                          ? "border-primary/20 bg-primary-alpha/5 p-8"
                          : "border-line border-dashed bg-bg2 p-12 hover:border-primary/20 hover:bg-bg-alt/40"
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
                          <RiLoader2Line className="size-7 animate-spin text-primary" />
                          <span className="font-medium font-sans text-[12px] text-primary uppercase tracking-widest">
                            Analyzing Portfolio...
                          </span>
                        </div>
                      ) : resumeText ? (
                        <div className="flex flex-col items-center gap-small text-center">
                          <div className="flex size-14 items-center justify-center rounded-micro border border-line bg-surface shadow-sm">
                            <RiFileTextLine className="size-7 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="max-w-[220px] truncate font-medium font-sans text-[14px] text-primary">
                              {fileName || "Profile Prepared"}
                            </p>
                            <p className="font-light font-sans text-[11px] text-status-success-text">
                              Intelligence Extracted • Ready
                            </p>
                          </div>
                          <span className="mt-base font-medium font-sans text-[10px] text-primary/40 uppercase tracking-widest underline-offset-4 hover:text-primary hover:underline">
                            Change File
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="mb-comfortable flex size-12 items-center justify-center rounded-full bg-white text-ink-faint shadow-sm transition-all group-hover:scale-105 group-hover:text-primary">
                            <RiUploadCloud2Line className="size-6" />
                          </div>
                          <span className="text-center font-medium font-sans text-[13px] text-primary uppercase tracking-widest">
                            Upload PDF Resume
                          </span>
                          <span className="mt-1 font-light font-sans text-[11px] text-ink-faint">
                            High-fidelity document max 5MB
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-hero">
                    <Button
                      type="submit"
                      disabled={submitting || parsingPdf}
                      className="h-14 w-full rounded-standard bg-primary font-medium font-sans text-[15px] text-white shadow-none transition-all hover:-translate-y-px hover:bg-primary-muted hover:shadow-[0_15px_30px_-10px_rgba(25,40,64,0.3)] active:scale-[0.98]"
                    >
                      {submitting ? (
                        <div className="flex items-center gap-base text-white/80">
                          <RiLoader2Line className="size-5 animate-spin" />
                          <span className="uppercase tracking-widest">
                            Syncing Profile...
                          </span>
                        </div>
                      ) : (
                        <span className="uppercase tracking-widest">
                          Finalize Application
                        </span>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-small text-center opacity-40">
                    <div className="h-px w-8 bg-line" />

                    <div className="h-px w-8 bg-line" />
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
