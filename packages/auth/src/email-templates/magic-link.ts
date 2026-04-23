import { buildAuthEmailTemplate } from "./base";

interface MagicLinkEmailProps {
  email: string;
  url: string;
}

export function buildMagicLinkEmail({ email, url }: MagicLinkEmailProps) {
  return buildAuthEmailTemplate({
    preview: "Use this secure link to sign in to Umurava AI",
    heading: "Your secure sign-in link",
    intro: `A sign-in request was made for ${email}. Use the button below to access the recruiter dashboard.`,
    ctaLabel: "Sign in to Umurava AI",
    ctaUrl: url,
    outro:
      "This link expires shortly. If you did not request it, you can ignore this email.",
  });
}
