import { buildAuthEmailTemplate } from "./base";

interface ScreeningCompletedEmailProps {
  recruiterName: string;
  applicantName: string;
  jobTitle: string;
  matchScore: number;
  url: string;
}

export function buildScreeningCompletedEmail({
  recruiterName,
  applicantName,
  jobTitle,
  matchScore,
  url,
}: ScreeningCompletedEmailProps) {
  return buildAuthEmailTemplate({
    preview: `AI Screening Complete: ${applicantName}`,
    heading: "Screening Analysis Complete",
    intro: `Hi ${recruiterName}, our AI has finished analyzing ${applicantName} for the ${jobTitle} position. The analysis produced a Match Score of ${matchScore}%.`,
    ctaLabel: "View Full Report",
    ctaUrl: url,
    outro: "You can now review the detailed strengths, gaps, and final recommendation in your dashboard.",
  });
}
