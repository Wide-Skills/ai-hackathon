import { env } from "@ai-hackathon/env/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import type React from "react";

// Initialize Nodemailer transporter with Brevo SMTP
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
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

/**
 * Send an email using Nodemailer (Brevo SMTP)
 */
export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, text, react, from, replyTo } = options;

  const fromAddress = from || env.SMTP_FROM_EMAIL;

  try {
    let emailHtml = html;
    let emailText = text;

    // If react element is provided, render it to HTML and Text
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

    console.log("Email sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

/**
 * Get the transporter instance for advanced usage
 */
export function getTransporter() {
  return transporter;
}

export { transporter };
