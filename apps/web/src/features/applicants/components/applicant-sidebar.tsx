import type { Applicant } from "@ai-hackathon/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BrainCircuit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { invalidateHiringData, trpc } from "@/utils/trpc";

interface ApplicantSidebarProps {
  applicant: Applicant;
  jobTitle?: string;
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ApplicantSidebar({
  applicant,
  jobTitle,
}: ApplicantSidebarProps) {
  const queryClient = useQueryClient();
  const screenMutation = useMutation(
    trpc.screenings.generate.mutationOptions({
      onSuccess: () => {
        toast.success("AI Analysis complete");
        void invalidateHiringData(queryClient);
      },
      onError: (error) => {
        toast.error(error.message || "AI Analysis failed");
      },
    }),
  );

  const handleRunAnalysis = () => {
    screenMutation.mutate({
      applicantId: applicant.id,
      jobId: applicant.jobId,
    });
  };

  return (
    <div className="space-y-10 lg:col-span-1">
      <Card className="group relative overflow-hidden border-border/50 p-10 text-center shadow-lg">
        <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-secondary/30" />

        <div className="relative pt-4">
          {applicant.avatarUrl ? (
            <img
              src={applicant.avatarUrl}
              alt={`${applicant.firstName} ${applicant.lastName}`}
              className="mx-auto h-32 w-32 rounded-2xl border-4 border-background object-cover shadow-lg grayscale transition-all hover:grayscale-0"
            />
          ) : (
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-background bg-secondary/30 font-display font-light text-[32px] text-muted-foreground/30 uppercase shadow-md">
              {applicant.firstName[0]}
              {applicant.lastName[0]}
            </div>
          )}
          <h2 className="mt-10 font-display font-light text-[24px] text-foreground uppercase leading-tight tracking-tight tracking-widest">
            {applicant.firstName} {applicant.lastName}
          </h2>
          <p className="mt-2.5 font-medium text-[14px] text-muted-foreground/60 leading-relaxed tracking-tight">
            {applicant.headline}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 font-bold text-[10px] text-muted-foreground/30 uppercase tracking-[0.25em]">
            {applicant.location}
          </div>

          <div className="mt-12 flex items-center justify-center gap-3">
            {[
              { label: "LinkedIn", href: applicant.socialLinks.linkedin },
              { label: "GitHub", href: applicant.socialLinks.github },
              { label: "Portfolio", href: applicant.socialLinks.portfolio },
              { label: "Email", href: `mailto:${applicant.email}` },
            ].map(
              (link, i) =>
                link.href && (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-border/40 bg-background px-3 py-2 font-bold text-[10px] text-muted-foreground/30 uppercase tracking-widest shadow-md transition-all hover:border-primary/20 hover:text-foreground active:scale-[0.95]"
                  >
                    {link.label}
                  </a>
                ),
            )}
          </div>

          <div className="mt-14 space-y-3.5 border-border/10 border-t pt-12">
            <Button
              onClick={handleRunAnalysis}
              disabled={screenMutation.isPending}
              variant="default"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg disabled:opacity-50"
            >
              {screenMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BrainCircuit className="h-3.5 w-3.5" />
                  {applicant.screening ? "Re-Run Analysis" : "Process Analysis"}
                </>
              )}
            </Button>
            <Button
              render={<Link href="/dashboard/applicants">Decline Profile</Link>}
              variant="outline"
              className="rounded-full"
              size="lg"
            />
          </div>
        </div>
      </Card>

      <Card className="border-border/50 p-8 shadow-lg">
        <h3 className="mb-10 border-border/5 border-b pb-6 font-bold text-[10px] text-muted-foreground/30 uppercase tracking-[0.25em]">
          System Metadata
        </h3>
        <div className="space-y-6">
          {[
            { label: "Target Architecture", val: jobTitle },
            {
              label: "Applied On",
              val: new Date(applicant.appliedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            },
            { label: "Availability", val: applicant.availability.type },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-baseline justify-between gap-6 border-border/5 border-b pb-5 last:border-0 last:pb-0"
            >
              <span className="whitespace-nowrap font-bold text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">
                {item.label}
              </span>
              <span className="truncate text-right font-bold text-[13px] text-foreground/60 tracking-tight">
                {item.val}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">
              Current State
            </span>
            <Badge
              variant={
                applicant.status === "shortlisted"
                  ? "success"
                  : applicant.status === "screening"
                    ? "info"
                    : applicant.status === "rejected"
                      ? "destructive"
                      : "secondary"
              }
              className="shadow-md"
            >
              {applicant.status}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="border-border/50 p-8 shadow-lg">
        <h3 className="mb-8 border-border/5 border-b pb-6 font-bold text-[10px] text-muted-foreground/30 uppercase tracking-[0.25em]">
          Linguistic Mapping
        </h3>
        <div className="space-y-5">
          {applicant.languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center justify-between border-border/5 border-b pb-4 last:border-0 last:pb-0"
            >
              <span className="font-bold text-[13px] text-foreground/60 tracking-tight">
                {lang.name}
              </span>
              <Badge
                variant="secondary"
                size="xs"
                uppercase
                className="border-border/5 bg-secondary/20 px-2.5 py-1 text-muted-foreground/30 shadow-sm"
              >
                {lang.proficiency}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
