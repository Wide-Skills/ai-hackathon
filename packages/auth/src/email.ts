import { env } from "@ai-hackathon/env/server";
import { Resend } from "resend";
import { writeAuditLog } from "./audit";
import { buildMagicLinkEmail, buildWelcomeEmail } from "./email-templates";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendMagicLinkEmail(options: {
  email: string;
  url: string;
  requestId?: string;
}) {
  const { email, url, requestId } = options;

  const response = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [email],
    subject: "Your Umurava AI sign-in link",
    html: buildMagicLinkEmail({ email, url }),
  });

  if (response.error) {
    await writeAuditLog({
      level: "error",
      action: "auth.magic_link.send",
      source: "auth",
      status: "failure",
      message: "Failed to send magic link email",
      actorEmail: email,
      requestId,
      metadata: {
        error: response.error.message,
      },
    });
    throw new Error(response.error.message);
  }

  await writeAuditLog({
    level: "info",
    action: "auth.magic_link.send",
    source: "auth",
    status: "success",
    message: "Magic link email sent",
    actorEmail: email,
    requestId,
    metadata: {
      resendId: response.data?.id,
    },
  });
}

export async function sendWelcomeEmail(options: {
  email: string;
  name?: string;
  requestId?: string;
}) {
  const { email, name, requestId } = options;

  const response = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [email],
    subject: "Welcome to Umurava AI",
    html: buildWelcomeEmail({
      name,
      url: `${env.CORS_ORIGIN}/dashboard`,
    }),
  });

  if (response.error) {
    await writeAuditLog({
      level: "error",
      action: "auth.welcome_email.send",
      source: "auth",
      status: "failure",
      message: "Failed to send welcome email",
      actorEmail: email,
      requestId,
      metadata: {
        error: response.error.message,
      },
    });
    throw new Error(response.error.message);
  }

  await writeAuditLog({
    level: "info",
    action: "auth.welcome_email.send",
    source: "auth",
    status: "success",
    message: "Welcome email sent",
    actorEmail: email,
    requestId,
    metadata: {
      resendId: response.data?.id,
    },
  });
}
