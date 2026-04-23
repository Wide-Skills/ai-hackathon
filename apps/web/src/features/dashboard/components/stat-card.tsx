import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  color,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-background rounded-lg border border-border p-6 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[32px] font-light text-foreground leading-none tracking-tight">{value}</span>
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground font-medium tracking-tight">{sublabel}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-foreground/40 shadow-[rgba(0,0,0,0.02)_0px_2px_4px]"
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-6 flex items-center gap-2 pt-4 border-t border-border/40">
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-success/5">
            <TrendingUp className="h-3 w-3 text-success/60" />
          </div>
          <span className="text-[12px] font-medium text-success/70 tracking-tight">{trend}</span>
        </div>
      )}
    </div>
  );
}
