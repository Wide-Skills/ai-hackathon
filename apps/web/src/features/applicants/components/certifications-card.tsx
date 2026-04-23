import type { Certification } from "@ai-hackathon/shared";
import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CertificationsCardProps {
  certifications: Certification[];
}

export function CertificationsCard({
  certifications,
}: CertificationsCardProps) {
  if (certifications.length === 0) return null;

  return (
    <Card className="shadow-premium border-border/50 p-8">
      <div className="mb-10 flex items-center gap-3 border-b border-border/10 pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/30 border border-border/20 text-foreground/30 shadow-ethereal">
          <Award className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display text-[14px] font-light text-foreground uppercase tracking-[0.2em] opacity-60">Credentials</h3>
      </div>
      
      <div className="space-y-6">
        {certifications.map((cert, i) => (
          <div key={i} className="flex gap-4 group">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/30 border border-border/5 text-muted-foreground/30 shadow-ethereal transition-all group-hover:scale-[1.05]">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-foreground/80 text-[14px] tracking-tight group-hover:text-primary transition-colors">
                {cert.name}
              </p>
              <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">
                {cert.issuer} · {cert.issueDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
