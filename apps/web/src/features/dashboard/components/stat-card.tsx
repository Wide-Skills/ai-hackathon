import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="border-border shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-muted-foreground text-sm">{label}</p>
            <p className="mt-1 font-bold text-3xl text-foreground">{value}</p>
            <p className="mt-1 text-muted-foreground/60 text-xs">{sublabel}</p>
          </div>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1 border-border border-t pt-4">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            <span className="font-medium text-success text-xs">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
