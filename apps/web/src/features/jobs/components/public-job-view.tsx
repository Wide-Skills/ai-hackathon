"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  Upload,
} from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

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

  const jobQuery = useQuery(trpc.jobs.getPublicById.queryOptions({ id: jobId }));
  const applyMutation = useMutation(trpc.applicants.publicApply.mutationOptions());

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
        <h1 className="text-2xl font-bold">Job Not Found</h1>
        <p className="text-muted-foreground">The job listing you are looking for does not exist or has been closed.</p>
        <Button onClick={() => window.location.href = "/"}>Go Home</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-background p-10 rounded-3xl shadow-premium border border-border/50 text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-display font-light">Application Received!</h2>
          <p className="text-muted-foreground">
            Thank you for applying for the <span className="font-semibold text-foreground">{job.title}</span> position. 
            Our AI-powered screening engine will review your profile shortly.
          </p>
          <Button variant="outline" className="rounded-full px-8" onClick={() => window.location.href = "/"}>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 rounded-full px-4 py-1">
                {job.department}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-light tracking-tight leading-tight">
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
              <h3 className="text-xl font-display font-light text-foreground border-b border-border/50 pb-4">Description</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap pt-4">
                {job.description}
              </p>

              <h3 className="text-xl font-display font-light text-foreground border-b border-border/50 pb-4 mt-10">Requirements</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-display font-light text-foreground border-b border-border/50 pb-4 mt-10">Key Skills</h3>
              <div className="flex flex-wrap gap-2 pt-4">
                {job.skills.map((skill, i) => (
                  <Badge key={i} variant="outline" className="rounded-full px-4 py-1 border-border/50 bg-secondary/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-background border border-border/50 rounded-3xl p-8 shadow-premium space-y-6">
              <h3 className="text-xl font-display font-light">Apply Now</h3>
              
              <form onSubmit={handleApply} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">First Name</label>
                    <Input 
                      required 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="rounded-xl bg-secondary/30 border-border/50 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Last Name</label>
                    <Input 
                      required 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="rounded-xl bg-secondary/30 border-border/50 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Email Address</label>
                  <Input 
                    required 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@example.com"
                    className="rounded-xl bg-secondary/30 border-border/50 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Resume (PDF)</label>
                  <div 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      file ? 'border-primary/40 bg-primary/5' : 'border-border/50 hover:border-primary/20 hover:bg-secondary/20'
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
                        <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground/40 mb-2" />
                        <span className="text-sm text-muted-foreground text-center">Click to upload your resume</span>
                        <span className="text-[10px] text-muted-foreground/40 mt-1">PDF max 5MB</span>
                      </>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full h-12 rounded-full bg-primary text-white font-semibold text-[15px] shadow-premium hover:shadow-lift transition-all mt-4"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                
                <p className="text-[10px] text-center text-muted-foreground/40 leading-relaxed px-4">
                  By applying, you agree to our Terms of Service and Privacy Policy. 
                  Our AI will analyze your data for recruitment purposes only.
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
