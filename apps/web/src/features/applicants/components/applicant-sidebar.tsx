import type { Applicant } from "@ai-hackathon/shared";
import {
  Briefcase,
  CircleCheck as CheckCircle2,
  Code2,
  Globe,
  Mail,
  MapPin,
  Circle as XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicantSidebarProps {
  applicant: Applicant;
  jobTitle?: string;
}

export function ApplicantSidebar({
  applicant,
  jobTitle,
}: ApplicantSidebarProps) {
  return (
    <div className="space-y-10 lg:col-span-1">
      <div className="bg-background rounded-lg border border-border p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.01)] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-28 bg-secondary/50 -z-10" />
        
        <div className="relative pt-4">
          {applicant.avatarUrl ? (
            <img
              src={applicant.avatarUrl}
              alt={`${applicant.firstName} ${applicant.lastName}`}
              className="mx-auto h-28 w-28 rounded-2xl object-cover shadow-sm grayscale hover:grayscale-0 transition-all border-4 border-background"
            />
          ) : (
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-secondary border-4 border-background font-display text-display-card font-light text-muted-foreground/60 uppercase shadow-sm">
              {applicant.firstName[0]}
              {applicant.lastName[0]}
            </div>
          )}
          <h2 className="mt-8 font-display text-display-card font-light text-foreground tracking-tight leading-tight uppercase tracking-widest">
            {applicant.firstName} {applicant.lastName}
          </h2>
          <p className="mt-2 text-muted-foreground text-[14px] font-medium leading-snug">
            {applicant.headline}
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-muted-foreground/50 text-[11px] font-bold uppercase tracking-[0.2em]">
            <MapPin className="h-3.5 w-3.5" />
            {applicant.location}
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            {[
              { icon: Briefcase, href: applicant.socialLinks.linkedin },
              { icon: Code2, href: applicant.socialLinks.github },
              { icon: Globe, href: applicant.socialLinks.portfolio },
              { icon: Mail, href: `mailto:${applicant.email}` }
            ].map((link, i) => link.href && (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground/40 transition-all hover:border-foreground/10 hover:text-foreground active:scale-[0.95] shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
              >
                <link.icon className="h-4.5 w-4.5 stroke-[1.5px]" />
              </a>
            ))}
          </div>

          <div className="mt-12 space-y-3 pt-10 border-t border-border/50">
            <button className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-[12px] font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all active:scale-[0.98]">
              <CheckCircle2 className="h-4 w-4" />
              Shortlist
            </button>
            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-background text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hover:bg-secondary transition-all active:scale-[0.98]"
            >
              <XCircle className="h-4 w-4" />
              Decline
            </button>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg border border-border p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/40 mb-8 border-b border-border/40 pb-4">
          Application Details
        </h3>
        <div className="space-y-6">
          {[
            { label: "Target Role", val: jobTitle },
            { label: "Date Applied", val: new Date(applicant.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
            { label: "Commitment", val: applicant.availability.type },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-baseline gap-4 border-b border-border/20 pb-4 last:border-0 last:pb-0">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 whitespace-nowrap">{item.label}</span>
              <span className="text-[13px] font-bold text-foreground/70 text-right truncate">
                {item.val}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">Current Status</span>
            <span
                className={cn(
                  "rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border",
                  {
                    "bg-success/5 text-success-foreground border-success/10": applicant.status === "shortlisted",
                    "bg-info/5 text-info-foreground border-info/10": applicant.status === "screening",
                    "bg-secondary text-muted-foreground border-border/50": applicant.status === "pending",
                    "bg-destructive/5 text-destructive-foreground border-destructive/10": applicant.status === "rejected",
                  },
                )}
              >
                {applicant.status}
              </span>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg border border-border p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/40 mb-6 border-b border-border/40 pb-4">
          Neural Languages
        </h3>
        <div className="space-y-4">
          {applicant.languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0 last:pb-0"
            >
              <span className="text-[13px] font-bold text-foreground/70">{lang.name}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 bg-secondary/50 px-2 py-0.5 rounded">
                {lang.proficiency}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
