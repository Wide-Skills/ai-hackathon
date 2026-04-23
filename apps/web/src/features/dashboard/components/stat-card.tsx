import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  trend,
}: Omit<StatCardProps, "icon" | "color">) {
  return (
    <Card className="p-8 relative overflow-hidden border-border/50 shadow-ethereal hover:shadow-premium transition-all">
      <div className="flex flex-col">
        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.25em] mb-4">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[36px] font-light text-foreground leading-none tracking-tighter">{value}</span>
        </div>
        <p className="mt-4 text-[12px] text-muted-foreground/60 font-medium tracking-tight leading-relaxed">{sublabel}</p>
      </div>
      {trend && (
        <div className="mt-6 flex items-center gap-2 pt-6 border-t border-border/5">
          <span className="text-[11px] font-bold text-success/70 tracking-widest uppercase">{trend}</span>
          <span className="text-[10px] text-muted-foreground/30 font-medium lowercase">vs last month</span>
        </div>
      )}
    </Card>
  );
}
