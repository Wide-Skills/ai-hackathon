import { env } from "@ai-hackathon/env/server";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import type React from "react";
import logger from "./logger";

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

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  react?: React.ReactElement;
  from?: string;
  replyTo?: string;
}

/** send email via brevo */
export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, text, react, from, replyTo } = options;

  const fromAddress = from || env.SMTP_FROM_EMAIL;

  try {
    let emailHtml = html;
    let emailText = text;

    if (react) {
      emailHtml = await render(react);
      emailText = await render(react, { plainText: true });
    }

    const info = await transporter.sendMail({
      from: fromAddress,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html: emailHtml,
      text: emailText,
      replyTo,
    });

    logger.info(
      { messageId: info.messageId, to, subject },
      "Email sent successfully",
    );
    return { success: true, data: info };
  } catch (error) {
    logger.error({ error, to, subject }, "Email sending error");
    throw error;
  }
}

/** get transporter for advanced usage */
export function getTransporter() {
  return transporter;
}

export { transporter };
