import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  trend?: string;
}

export function StatCard({
  label,
  value,
  sublabel,
  trend,
}: StatCardProps) {
  return (
    <Card variant="ethereal" size="none" className="p-8 h-full flex flex-col justify-between">
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-[42px] font-light text-foreground leading-none tracking-tighter">{value}</span>
        </div>
        <p className="text-[12px] text-muted-foreground/60 font-medium tracking-tight leading-snug">{sublabel}</p>
      </div>
      
      {trend && (
        <div className="mt-8 flex items-center gap-2.5 pt-6 border-t border-border/10">
          <div className="flex items-center gap-1 text-[11px] font-bold text-success/80 tracking-widest uppercase">
            {trend}
          </div>
          <span className="text-[10px] text-muted-foreground/30 font-medium uppercase tracking-wider translate-y-[0.5px]">Index</span>
        </div>
      )}
    </Card>
  );
}
