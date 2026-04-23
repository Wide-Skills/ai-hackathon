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
    <Card className="border-border shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-semibold text-foreground text-sm">
          <Award className="h-4 w-4 text-primary" /> Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {certifications.map((cert, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <Award className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {cert.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {cert.issuer} · {cert.issueDate}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
