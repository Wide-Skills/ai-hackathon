import { env } from "@ai-hackathon/env/server";
import nodemailer from "nodemailer";
import { writeAuditLog } from "./audit";
import {
  buildApplicationReceivedEmail,
  buildMagicLinkEmail,
  buildScreeningCompletedEmail,
  buildWelcomeEmail,
} from "./email-templates";

// brevo smtp transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export async function sendMagicLinkEmail(options: {
  email: string;
  url: string;
  requestId?: string;
}) {
  const { email, url, requestId } = options;

  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM_EMAIL,
      to: email,
      subject: "Your Umurava AI sign-in link",
      html: buildMagicLinkEmail({ email, url }),
    });

    await writeAuditLog({
      level: "info",
      action: "auth.magic_link.send",
      source: "auth",
      status: "success",
      message: "Magic link email sent",
      actorEmail: email,
      requestId,
      metadata: {
        messageId: info.messageId,
      },
    });
  } catch (error: any) {
    await writeAuditLog({
      level: "error",
      action: "auth.magic_link.send",
      source: "auth",
      status: "failure",
      message: "Failed to send magic link email",
      actorEmail: email,
      requestId,
      metadata: {
        error: error.message,
      },
    });
    throw error;
  }
}

export async function sendWelcomeEmail(options: {
  email: string;
  name?: string;
  requestId?: string;
}) {
  const { email, name, requestId } = options;

  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM_EMAIL,
      to: email,
      subject: "Welcome to Umurava AI",
      html: buildWelcomeEmail({
        name,
        url: `${env.CORS_ORIGIN}/dashboard`,
      }),
    });

    await writeAuditLog({
      level: "info",
      action: "auth.welcome_email.send",
      source: "auth",
      status: "success",
      message: "Welcome email sent",
      actorEmail: email,
      requestId,
      metadata: {
        messageId: info.messageId,
      },
    });
  } catch (error: any) {
    await writeAuditLog({
      level: "error",
      action: "auth.welcome_email.send",
      source: "auth",
      status: "failure",
      message: "Failed to send welcome email",
      actorEmail: email,
      requestId,
      metadata: {
        error: error.message,
      },
    });
    throw error;
  }
}

export async function sendApplicationReceivedEmail(options: {
  email: string;
  firstName: string;
  jobTitle: string;
  requestId?: string;
}) {
  const { email, firstName, jobTitle, requestId } = options;

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM_EMAIL,
      to: email,
      subject: `Application Received: ${jobTitle}`,
      html: buildApplicationReceivedEmail({ firstName, jobTitle }),
    });
  } catch (error: any) {
    await writeAuditLog({
      level: "error",
      action: "notification.application_received.send",
      source: "api",
      status: "failure",
      message: "Failed to send application confirmation email",
      actorEmail: email,
      requestId,
      metadata: { error: error.message },
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

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM_EMAIL,
      to: email,
      subject: `AI Screening Complete: ${applicantName}`,
      html: buildScreeningCompletedEmail({
        recruiterName,
        applicantName,
        jobTitle,
        matchScore,
        url: `${env.CORS_ORIGIN}/dashboard/applicants/${applicantId}`,
      }),
    });
  } catch (error: any) {
    await writeAuditLog({
      level: "error",
      action: "notification.screening_completed.send",
      source: "api",
      status: "failure",
      message: "Failed to send screening completion email",
      actorEmail: email,
      requestId,
      metadata: { error: error.message },
    });
  }
}
