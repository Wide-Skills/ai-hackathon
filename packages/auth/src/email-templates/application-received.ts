import { buildAuthEmailTemplate } from "./base";

interface ApplicationReceivedEmailProps {
  firstName: string;
  jobTitle: string;
}

export function buildApplicationReceivedEmail({
  firstName,
  jobTitle,
}: ApplicationReceivedEmailProps) {
  return buildAuthEmailTemplate({
    preview: `Application Received: ${jobTitle}`,
    heading: "Application Received",
    intro: `Hi ${firstName}, thank you for applying for the ${jobTitle} position. Our AI-powered screening assistant is currently reviewing your profile against the job requirements.`,
    ctaLabel: "View Application Status",
    ctaUrl: "#", // Placeholder until we have a candidate portal
    outro: "We will be in touch shortly with an update.",
  });
}
