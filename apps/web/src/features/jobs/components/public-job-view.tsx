"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  Upload,
} from "lucide-react";
import { useState } from "react";
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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const jobQuery = useQuery(
    trpc.jobs.getPublicById.queryOptions({ id: jobId }),
  );
  const applyMutation = useMutation(
    trpc.applicants.publicApply.mutationOptions(),
  );

  const job = jobQuery.data;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    if (!file) {
      toast.error("Please upload your resume");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload and parse resume
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/applicants/upload-resume`,
        {
          method: "POST",
          body: formData,
        },
      );

      const uploadData = await uploadResponse.json();
      if (uploadData.error) {
        throw new Error(uploadData.message || uploadData.error);
      }

      // 2. Submit application with extracted text
      await applyMutation.mutateAsync({
        jobId,
        firstName,
        lastName,
        email,
        resumeText: uploadData.text,
      });

      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setUploading(false);
    }
  };

  if (jobQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6 rounded-3xl border border-border/50 bg-background p-10 text-center shadow-premium"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="font-display font-light text-2xl">
            Application Received!
          </h2>
          <p className="text-muted-foreground">
            Thank you for applying for the{" "}
            <span className="font-semibold text-foreground">{job.title}</span>{" "}
            position. Our AI-powered screening engine will review your profile
            shortly.
          </p>
          <Button
            variant="outline"
            className="rounded-full px-8"
            onClick={() => (window.location.href = "/")}
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container-tight pt-32 pb-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Job Details */}
          <div className="space-y-10 lg:col-span-2">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="rounded-full border-primary/10 bg-primary/5 px-4 py-1 text-primary"
              >
                {job.department}
              </Badge>
              <h1 className="font-display font-light text-4xl leading-tight tracking-tight md:text-5xl">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {job.type}
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="border-border/50 border-b pb-4 font-display font-light text-foreground text-xl">
                Description
              </h3>
              <p className="whitespace-pre-wrap pt-4 text-muted-foreground leading-relaxed">
                {job.description}
              </p>

              <h3 className="mt-10 border-border/50 border-b pb-4 font-display font-light text-foreground text-xl">
                Requirements
              </h3>
              <ul className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
                {job.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-muted-foreground text-sm"
                  >
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {req}
                  </li>
                ))}
              </ul>

              <h3 className="mt-10 border-border/50 border-b pb-4 font-display font-light text-foreground text-xl">
                Key Skills
              </h3>
              <div className="flex flex-wrap gap-2 pt-4">
                {job.skills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="rounded-full border-border/50 bg-secondary/30 px-4 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 rounded-3xl border border-border/50 bg-background p-8 shadow-premium">
              <h3 className="font-display font-light text-xl">Apply Now</h3>

              <form onSubmit={handleApply} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-bold text-muted-foreground/60 text-xs uppercase tracking-wider">
                      First Name
                    </label>
                    <Input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="h-11 rounded-xl border-border/50 bg-secondary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold text-muted-foreground/60 text-xs uppercase tracking-wider">
                      Last Name
                    </label>
                    <Input
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="h-11 rounded-xl border-border/50 bg-secondary/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-muted-foreground/60 text-xs uppercase tracking-wider">
                    Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@example.com"
                    className="h-11 rounded-xl border-border/50 bg-secondary/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-muted-foreground/60 text-xs uppercase tracking-wider">
                    Resume (PDF)
                  </label>
                  <div
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all ${
                      file
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/50 hover:border-primary/20 hover:bg-secondary/20"
                    }`}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    {file ? (
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <span className="max-w-[150px] truncate font-medium text-sm">
                          {file.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="mb-2 h-6 w-6 text-muted-foreground/40" />
                        <span className="text-center text-muted-foreground text-sm">
                          Click to upload your resume
                        </span>
                        <span className="mt-1 text-[10px] text-muted-foreground/40">
                          PDF max 5MB
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={uploading}
                  className="mt-4 h-12 w-full rounded-full bg-primary font-semibold text-[15px] text-white shadow-premium transition-all hover:shadow-lift"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>

                <p className="px-4 text-center text-[10px] text-muted-foreground/40 leading-relaxed">
                  By applying, you agree to our Terms of Service and Privacy
                  Policy. Our AI will analyze your data for recruitment purposes
                  only.
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
