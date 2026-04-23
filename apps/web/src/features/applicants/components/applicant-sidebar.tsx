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

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ApplicantSidebar({
  applicant,
  jobTitle,
}: ApplicantSidebarProps) {
  return (
    <div className="space-y-10 lg:col-span-1">
      <Card className="p-10 text-center shadow-premium border-border/50 relative overflow-hidden group">
        <div className="absolute top-0 inset-x-0 h-32 bg-secondary/30 -z-10" />
        
        <div className="relative pt-4">
          {applicant.avatarUrl ? (
            <img
              src={applicant.avatarUrl}
              alt={`${applicant.firstName} ${applicant.lastName}`}
              className="mx-auto h-32 w-32 rounded-2xl object-cover shadow-premium grayscale hover:grayscale-0 transition-all border-4 border-background"
            />
          ) : (
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-secondary/30 border-4 border-background font-display text-[32px] font-light text-muted-foreground/30 uppercase shadow-ethereal">
              {applicant.firstName[0]}
              {applicant.lastName[0]}
            </div>
          )}
          <h2 className="mt-10 font-display text-[24px] font-light text-foreground tracking-tight leading-tight uppercase tracking-widest">
            {applicant.firstName} {applicant.lastName}
          </h2>
          <p className="mt-2.5 text-muted-foreground/60 text-[14px] font-medium leading-relaxed tracking-tight">
            {applicant.headline}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground/30 text-[10px] font-bold uppercase tracking-[0.25em]">
            {applicant.location}
          </div>

          <div className="mt-12 flex items-center justify-center gap-3">
            {[
              { label: "LinkedIn", href: applicant.socialLinks.linkedin },
              { label: "GitHub", href: applicant.socialLinks.github },
              { label: "Portfolio", href: applicant.socialLinks.portfolio },
              { label: "Email", href: `mailto:${applicant.email}` }
            ].map((link, i) => link.href && (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg border border-border/40 bg-background text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 transition-all hover:border-primary/20 hover:text-foreground active:scale-[0.95] shadow-ethereal"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-14 space-y-3.5 pt-12 border-t border-border/10">
            <button className="btn-pill-primary w-full h-11 text-[11px] font-bold uppercase tracking-[0.2em] shadow-ethereal">
              Shortlist Expert
            </button>
            <button
              className="btn-pill-outline w-full h-11 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 shadow-ethereal border-border/40"
            >
              Decline Profile
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-8 shadow-premium border-border/50">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/30 mb-10 border-b border-border/5 pb-6">
          System Metadata
        </h3>
        <div className="space-y-6">
          {[
            { label: "Target Architecture", val: jobTitle },
            { label: "Applied On", val: new Date(applicant.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
            { label: "Availability", val: applicant.availability.type },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-baseline gap-6 border-b border-border/5 pb-5 last:border-0 last:pb-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 whitespace-nowrap">{item.label}</span>
              <span className="text-[13px] font-bold text-foreground/60 text-right truncate tracking-tight">
                {item.val}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">Current State</span>
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
                className="shadow-ethereal"
              >
                {applicant.status}
              </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-8 shadow-premium border-border/50">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/30 mb-8 border-b border-border/5 pb-6">
          Linguistic Mapping
        </h3>
        <div className="space-y-5">
          {applicant.languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center justify-between border-b border-border/5 pb-4 last:border-0 last:pb-0"
            >
              <span className="text-[13px] font-bold text-foreground/60 tracking-tight">{lang.name}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 bg-secondary/20 px-2.5 py-1 rounded-lg border border-border/5">
                {lang.proficiency}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
