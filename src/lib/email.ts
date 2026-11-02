import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { siteConfig } from "@/lib/site";

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.EMAIL_FROM);
}

let transporter: Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
  }
  return transporter;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function layout(heading: string, body: string, cta?: { label: string; url: string }) {
  const button = cta
    ? `<p style="margin:28px 0"><a href="${escapeHtml(cta.url)}" style="background:#22D3EE;color:#03141A;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600">${escapeHtml(cta.label)}</a></p>
       <p style="color:#A1A8B3;font-size:13px">If the button does not work, copy this link:<br>${escapeHtml(cta.url)}</p>`
    : "";
  return `<div style="background:#050607;padding:32px;font-family:Arial,sans-serif;color:#F4F6F8">
    <div style="max-width:520px;margin:auto;background:#0F1216;border:1px solid #1C2026;border-radius:14px;padding:32px">
      <p style="color:#22D3EE;font-weight:700;margin:0 0 16px">${escapeHtml(siteConfig.name)}</p>
      <h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(heading)}</h1>
      <p style="color:#CBD5E1;line-height:1.6">${escapeHtml(body)}</p>${button}
    </div></div>`;
}

type Mail = { to: string; subject: string; heading: string; body: string; cta?: { label: string; url: string } };

/**
 * Sends a transactional email. Without SMTP configuration the message is
 * printed to the server console in development and rejected in production,
 * so nothing is silently "sent".
 */
export async function sendEmail(mail: Mail) {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[email:dev] To: ${mail.to}\nSubject: ${mail.subject}\n${mail.body}${mail.cta ? `\n${mail.cta.url}` : ""}\n`);
      return;
    }
    throw new Error("Email delivery is not configured. Set SMTP_* and EMAIL_FROM environment variables.");
  }
  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: mail.to,
    subject: mail.subject,
    text: `${mail.heading}\n\n${mail.body}${mail.cta ? `\n\n${mail.cta.label}: ${mail.cta.url}` : ""}`,
    html: layout(mail.heading, mail.body, mail.cta),
  });
}
