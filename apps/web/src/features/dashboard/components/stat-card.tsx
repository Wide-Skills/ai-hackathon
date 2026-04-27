import React from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  trend?: string;
}

export const StatCard = React.memo(function StatCard({
  label,
  value,
  sublabel,
  trend,
}: StatCardProps) {
  return (
    <Card
      variant="default"
      className="flex h-full flex-col justify-between p-comfortable"
      size="none"
    >
      <div className="space-y-base">
        <p className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
          {label}
        </p>
        <div className="flex items-baseline gap-micro">
          <span className="font-serif text-[24px] text-primary leading-none sm:text-[32px]">
            {value}
          </span>
        </div>
        <p className="font-light font-sans text-[13px] text-ink-muted leading-tight">
          {sublabel}
        </p>
      </div>

      {trend && (
        <div className="mt-comfortable flex items-center gap-small border-line border-t pt-medium">
          <div className="flex items-center gap-micro font-medium font-sans text-[11px] text-status-success-text uppercase tracking-[0.01em]">
            {trend}
          </div>
          <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
            Growth
          </span>
        </div>
      )}
    </Card>
  );
});
