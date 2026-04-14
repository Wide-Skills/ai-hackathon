import type { Applicant } from "@ai-hackathon/shared";
import {
  Briefcase,
  Code2,
  Globe,
  Mail,
  MapPin,
  Circle as XCircle,
  CircleCheck as CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ApplicantSidebarProps {
  applicant: Applicant;
  jobTitle?: string;
}

export function ApplicantSidebar({ applicant, jobTitle }: ApplicantSidebarProps) {
  return (
    <div className="space-y-5 lg:col-span-1">
      <Card className="border-border shadow-sm">
        <CardContent className="p-6 text-center">
          {applicant.avatarUrl ? (
            <img
              src={applicant.avatarUrl}
              alt={`${applicant.firstName} ${applicant.lastName}`}
              className="mx-auto h-20 w-20 rounded-full object-cover shadow-md ring-4 ring-primary/20"
            />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary font-bold text-2xl text-white shadow-md ring-4 ring-primary/20">
              {applicant.firstName[0]}
              {applicant.lastName[0]}
            </div>
          )}
          <h2 className="mt-4 font-bold text-foreground text-xl">
            {applicant.firstName} {applicant.lastName}
          </h2>
          <p className="mt-1 text-muted-foreground text-sm leading-snug">
            {applicant.headline}
          </p>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-muted-foreground/70 text-sm">
            <MapPin className="h-3.5 w-3.5" />
            {applicant.location}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            {applicant.socialLinks.linkedin && (
              <a
                href={applicant.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground/70 transition-colors hover:border-primary/20 hover:text-primary"
              >
                <Briefcase className="h-4 w-4" />
              </a>
            )}
            {applicant.socialLinks.github && (
              <a
                href={applicant.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground/70 transition-colors hover:border-border hover:text-foreground/90"
              >
                <Code2 className="h-4 w-4" />
              </a>
            )}
            {applicant.socialLinks.portfolio && (
              <a
                href={applicant.socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground/70 transition-colors hover:border-success/20 hover:text-success"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
            <a
              href={`mailto:${applicant.email}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground/70 transition-colors hover:border-destructive/20 hover:text-destructive"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-5 space-y-2 border-border/50 border-t pt-5">
            <Button className="h-9 w-full gap-2 rounded-lg bg-primary font-semibold text-sm text-white hover:bg-primary/90">
              <CheckCircle2 className="h-4 w-4" />
              Shortlist Candidate
            </Button>
            <Button
              variant="outline"
              className="h-9 w-full border-border text-sm transition-colors hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardContent className="space-y-3 p-5">
          <h3 className="font-semibold text-foreground text-sm">
            Application Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Applied to</span>
              <span className="max-w-[160px] text-right font-medium text-foreground/90">
                {jobTitle}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date applied</span>
              <span className="font-medium text-foreground/90">
                {new Date(applicant.appliedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Availability</span>
              <span className="font-medium text-foreground/90">
                {applicant.availability.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-semibold text-xs",
                  {
                    "bg-success/20 text-success":
                      applicant.status === "shortlisted",
                    "bg-primary/20 text-primary":
                      applicant.status === "screening",
                    "bg-muted text-muted-foreground":
                      applicant.status === "pending",
                    "bg-destructive/20 text-destructive":
                      applicant.status === "rejected",
                  },
                )}
              >
                {applicant.status.charAt(0).toUpperCase() +
                  applicant.status.slice(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardContent className="p-5">
          <h3 className="mb-3 font-semibold text-foreground text-sm">
            Languages
          </h3>
          <div className="space-y-2">
            {applicant.languages.map((lang) => (
              <div
                key={lang.name}
                className="flex items-center justify-between"
              >
                <span className="text-foreground/80 text-sm">
                  {lang.name}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                  {lang.proficiency}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
