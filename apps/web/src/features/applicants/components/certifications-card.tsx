import type { Certification } from "@ai-hackathon/shared";
import { RiAwardLine } from "@remixicon/react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CertificationsCardProps {
  certifications: Certification[];
}

export function CertificationsCard({
  certifications,
}: CertificationsCardProps) {
  if (certifications.length === 0) return null;

  return (
    <Card variant="default" className="overflow-hidden shadow-none" size="none">
      <CardHeader>
        <CardDescription>Credentials</CardDescription>
        <CardTitle>Certifications</CardTitle>
      </CardHeader>

      <div className="space-y-comfortable p-comfortable">
        {certifications.map((cert, i) => (
          <div key={i} className="group flex gap-comfortable">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-micro border border-line bg-bg2 text-primary transition-all group-hover:scale-[1.05] group-hover:bg-bg-alt/40">
              <RiAwardLine className="size-5" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-medium font-sans text-[15px] text-primary tracking-tight transition-colors">
                {cert.name}
              </p>
              <p className="mt-0.5 font-medium font-sans text-[12px] text-ink-muted uppercase tracking-wider">
                {cert.issuer} · {cert.issueDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
