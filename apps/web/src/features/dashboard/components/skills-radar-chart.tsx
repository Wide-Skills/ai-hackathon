"use client";

import type { Applicant } from "@ai-hackathon/shared";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillsRadarChartProps {
  applicants: Applicant[];
}

export function SkillsRadarChart({ applicants }: SkillsRadarChartProps) {
  const screened = applicants.filter((a) => a.screening);
  if (screened.length === 0) return null;

  // Aggregate skill scores from the best candidates
  const topCandidates = screened
    .sort((a, b) => (b.screening?.matchScore ?? 0) - (a.screening?.matchScore ?? 0))
    .slice(0, 5);

  const skillsMap: Record<string, number[]> = {};

  topCandidates.forEach((cand) => {
    cand.screening?.skillBreakdown.forEach((s) => {
      if (!skillsMap[s.skill]) skillsMap[s.skill] = [];
      skillsMap[s.skill].push(s.score);
    });
  });

  const data = Object.entries(skillsMap)
    .map(([skill, scores]) => ({
      skill,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }))
    .slice(0, 6); // Top 6 skills for radar clarity

  if (data.length < 3) return null;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-semibold text-sm">Talent Skill Matrix</CardTitle>
        <p className="text-muted-foreground text-xs">Average skill breakdown of top 5 match candidates</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              />
              <Radar
                name="Top Talent"
                dataKey="score"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
