"use client";
import type { Applicant, ApplicationStatus } from "@ai-hackathon/shared";
import { RiBrainLine, RiDeleteBin7Line, RiLoader2Line } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { invalidateHiringData, trpc } from "@/utils/trpc";

interface ApplicantSidebarProps {
  applicant: Applicant;
  jobTitle?: string;
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "screening", label: "Screening" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
];

export function ApplicantSidebar({
  applicant,
  jobTitle,
}: ApplicantSidebarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

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

  const deleteMutation = useMutation(
    trpc.applicants.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Applicant deleted successfully");
        void invalidateHiringData(queryClient);
        router.push("/dashboard/applicants");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete applicant");
        setIsDeleting(false);
      },
    }),
  );

  const updateStatusMutation = useMutation(
    trpc.applicants.update.mutationOptions({
      onSuccess: () => {
        toast.success("Status updated successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.applicants.getById.queryKey({ id: applicant.id }),
        });
        void invalidateHiringData(queryClient);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update status");
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
    <div className="space-y-comfortable lg:col-span-1">
      <Card
        variant="default"
        className="relative overflow-hidden p-comfortable text-center shadow-none"
        size="none"
      >
        <div className="absolute inset-x-0 top-0 -z-10 h-24 bg-bg2/40" />

        <div className="relative pt-2">
          {applicant.avatarUrl ? (
            <img
              src={applicant.avatarUrl}
              alt={`${applicant.firstName} ${applicant.lastName}`}
              className="mx-auto h-24 w-24 rounded-micro border-2 border-surface object-cover grayscale transition-all hover:grayscale-0"
            />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-micro border-2 border-surface bg-bg2 font-serif text-[28px] text-ink-faint uppercase">
              {applicant.firstName[0]}
              {applicant.lastName[0]}
            </div>
          )}
          <h2 className="mt-base font-serif text-[24px] text-primary leading-tight">
            {applicant.firstName} <br /> {applicant.lastName}
          </h2>
          <p className="mt-micro font-medium font-sans text-[13px] text-ink-muted leading-tight">
            {applicant.headline}
          </p>
          <div className="mt-base flex items-center justify-center">
            <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
              {applicant.location}
            </span>
          </div>

          <div className="mt-base flex flex-wrap items-center justify-center gap-base">
            {[
              { label: "LI", href: applicant.socialLinks.linkedin },
              { label: "GH", href: applicant.socialLinks.github },
              { label: "Port", href: applicant.socialLinks.portfolio },
              { label: "Mail", href: `mailto:${applicant.email}` },
            ].map(
              (link, i) =>
                link.href && (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                ),
            )}
          </div>

          <div className="mt-comfortable space-y-base border-line border-t pt-comfortable">
            <Button
              onClick={handleRunAnalysis}
              disabled={screenMutation.isPending}
              variant="default"
              className="h-9 w-full rounded-standard font-medium font-sans text-[12px] shadow-none"
            >
              {screenMutation.isPending ? (
                <>
                  <RiLoader2Line className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RiBrainLine className="mr-2 h-3.5 w-3.5" />
                  {applicant.screening ? "Refresh Logic" : "Analyze Fit"}
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    disabled={isDeleting}
                    variant="outline"
                    className="h-9 w-full rounded-standard border-line bg-transparent font-medium font-sans text-[12px] text-ink-faint shadow-none hover:border-status-error-text/30 hover:bg-status-error-bg hover:text-status-error-text"
                  />
                }
              >
                {isDeleting ? (
                  <>
                    <RiLoader2Line className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <RiDeleteBin7Line className="mr-2 h-3.5 w-3.5" />
                    Delete Profile
                  </>
                )}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Applicant Profile</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this applicant? This action
                    cannot be undone and all screening data will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setIsDeleting(true);
                      deleteMutation.mutate({ id: applicant.id });
                    }}
                    className="bg-status-error-bg text-status-error-text hover:bg-status-error-bg/80"
                  >
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>

      <Card
        variant="default"
        size="none"
        className="space-y-comfortable p-comfortable shadow-none"
      >
        <header className="border-line border-b pb-small">
          <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
            System Context
          </span>
        </header>
        <div className="space-y-base">
          {[
            { label: "Target Job", val: jobTitle },
            {
              label: "Applied Date",
              val: new Date(applicant.appliedAt || "").toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              ),
            },

            { label: "Availability", val: applicant.availability.type },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-micro border-line border-b pb-base last:border-0 last:pb-0"
            >
              <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                {item.label}
              </span>
              <span className="font-serif text-[16px] text-primary">
                {item.val}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-base">
            <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
              Current State
            </span>
            <Select
              value={applicant.status}
              onValueChange={(val) =>
                updateStatusMutation.mutate({
                  id: applicant.id,
                  data: { status: val as ApplicationStatus },
                })
              }
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="h-8 w-[120px] rounded-micro border-line bg-transparent font-medium font-sans text-[11px] uppercase shadow-none focus:ring-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-line bg-surface shadow-none">
                {statusOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="font-medium font-sans text-[11px] uppercase"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
}
