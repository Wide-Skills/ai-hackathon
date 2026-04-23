import { buildAuthEmailTemplate } from "./base";

interface WelcomeEmailProps {
  name?: string;
  url: string;
}

export function buildWelcomeEmail({
  name = "there",
  url,
}: WelcomeEmailProps) {
  return buildAuthEmailTemplate({
    preview: "Welcome to the Umurava AI recruiter platform",
    heading: `Welcome, ${name}`,
    intro:
      "Your recruiter account is ready. You can now manage jobs, upload applicants, and review AI screening results from one dashboard.",
    ctaLabel: "Open recruiter dashboard",
    ctaUrl: url,
    outro: "If you did not expect this account, you can ignore this email.",
  });
}
