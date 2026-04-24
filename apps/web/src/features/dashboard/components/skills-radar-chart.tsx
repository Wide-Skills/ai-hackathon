"use client";

import type { Applicant } from "@ai-hackathon/shared";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface SkillsRadarChartProps {
  applicants: Applicant[];
}

export function SkillsRadarChart({ applicants }: SkillsRadarChartProps) {
  const screened = applicants.filter((a) => a.screening);

  const skillsMap = screened.reduce(
    (acc, a) => {
      for (const sb of a.screening?.skillBreakdown || []) {
        if (!acc[sb.skill]) acc[sb.skill] = { total: 0, count: 0 };
        acc[sb.skill].total += sb.score;
        acc[sb.skill].count += 1;
      }
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  const data = Object.entries(skillsMap)
    .map(([skill, { total, count }]) => ({
      skill,
      score: Math.round(total / count),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (data.length < 3) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center font-bold text-[10px] text-muted-foreground/30 uppercase tracking-widest">
        Insufficient Neural Data
      </div>
    );
  }

  return (
    <div className="h-full min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(0,0,0,0.05)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{
              fontSize: 10,
              fill: "var(--color-muted-foreground)",
              fontWeight: 600,
              letterSpacing: "0.05em",
              opacity: 0.5,
            }}
          />
          <Radar
            name="Proficiency"
            dataKey="score"
            stroke="var(--color-info)"
            fill="var(--color-info)"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
