import type { Certification } from "@ai-hackathon/shared";
import { RiAwardLine } from "@remixicon/react";
import { Card } from "@/components/ui/card";

interface CertificationsCardProps {
  certifications: Certification[];
}

export function CertificationsCard({
  certifications,
}: CertificationsCardProps) {
  if (certifications.length === 0) return null;

  return (
    <Card className="border-border/50 p-8 shadow-lg">
      <div className="mb-10 flex items-center gap-3 border-border/10 border-b pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/20 bg-secondary/30 text-foreground/30 shadow-md">
          <RiAwardLine className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display font-light text-[14px] text-foreground uppercase tracking-[0.2em] opacity-60">
          Credentials
        </h3>
      </div>

      <div className="space-y-6">
        {certifications.map((cert, i) => (
          <div key={i} className="group flex gap-4">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-border/5 bg-secondary/30 text-muted-foreground/30 shadow-md transition-all group-hover:scale-[1.05]">
              <RiAwardLine className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-[14px] text-foreground/80 tracking-tight transition-colors group-hover:text-primary">
                {cert.name}
              </p>
              <p className="mt-1 font-bold text-[11px] text-muted-foreground/40 uppercase tracking-widest">
                {cert.issuer} · {cert.issueDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
