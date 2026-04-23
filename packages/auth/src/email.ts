import { env } from "@ai-hackathon/env/server";
import { Resend } from "resend";
import { writeAuditLog } from "./audit";
import {
  buildApplicationReceivedEmail,
  buildMagicLinkEmail,
  buildScreeningCompletedEmail,
  buildWelcomeEmail,
} from "./email-templates";

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

export async function sendApplicationReceivedEmail(options: {
  email: string;
  firstName: string;
  jobTitle: string;
  requestId?: string;
}) {
  const { email, firstName, jobTitle, requestId } = options;

  const response = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [email],
    subject: `Application Received: ${jobTitle}`,
    html: buildApplicationReceivedEmail({ firstName, jobTitle }),
  });

  if (response.error) {
    await writeAuditLog({
      level: "error",
      action: "notification.application_received.send",
      source: "api",
      status: "failure",
      message: "Failed to send application confirmation email",
      actorEmail: email,
      requestId,
      metadata: { error: response.error.message },
    });
  }
}

export async function sendScreeningCompletedEmail(options: {
  email: string;
  recruiterName: string;
  applicantName: string;
  jobTitle: string;
  matchScore: number;
  applicantId: string;
  requestId?: string;
}) {
  const {
    email,
    recruiterName,
    applicantName,
    jobTitle,
    matchScore,
    applicantId,
    requestId,
  } = options;

  const response = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [email],
    subject: `AI Screening Complete: ${applicantName}`,
    html: buildScreeningCompletedEmail({
      recruiterName,
      applicantName,
      jobTitle,
      matchScore,
      url: `${env.CORS_ORIGIN}/dashboard/applicants/${applicantId}`,
    }),
  });

  if (response.error) {
    await writeAuditLog({
      level: "error",
      action: "notification.screening_completed.send",
      source: "api",
      status: "failure",
      message: "Failed to send screening completion email",
      actorEmail: email,
      requestId,
      metadata: { error: response.error.message },
    });
  }
}
