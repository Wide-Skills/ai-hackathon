import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  trend?: string;
}

export function StatCard({ label, value, sublabel, trend }: StatCardProps) {
  return (
    <Card
      variant="premium"
      className="flex h-full flex-col justify-between p-8"
      size="none"
    >
      <div className="space-y-4">
        <p className="font-bold text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em]">
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-light text-[42px] text-foreground leading-none tracking-tighter">
            {value}
          </span>
        </div>
        <p className="font-medium text-[12px] text-muted-foreground/60 leading-snug tracking-tight">
          {sublabel}
        </p>
      </div>

      {trend && (
        <div className="mt-8 flex items-center gap-2.5 border-border/10 border-t pt-6">
          <div className="flex items-center gap-1 font-bold text-[11px] text-success/80 uppercase tracking-widest">
            {trend}
          </div>
          <span className="translate-y-[0.5px] font-medium text-[10px] text-muted-foreground/30 uppercase tracking-wider">
            Index
          </span>
        </div>
      )}
    </Card>
  );
}
