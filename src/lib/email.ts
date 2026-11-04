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

export type Mail = {
  to: string;
  subject: string;
  heading: string;
  /** Paragraphs are separated by a blank line. */
  body: string;
  cta?: { label: string; url: string };
  code?: string;
  /** Reminder emails carry a "stop these reminders" link and List-Unsubscribe headers. */
  unsubscribe?: { pageUrl: string; oneClickUrl: string };
};

function layout({ heading, body, cta, code, unsubscribe }: Mail) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => `<p style="color:#CBD5E1;line-height:1.6;margin:0 0 14px">${escapeHtml(p.trim())}</p>`)
    .join("");
  const codeBlock = code
    ? `<p style="margin:24px 0;text-align:center"><span style="display:inline-block;background:#050607;border:1px solid #1C2026;border-radius:12px;padding:14px 22px;font-family:Consolas,Menlo,monospace;font-size:32px;font-weight:700;letter-spacing:10px;color:#F4F6F8">${escapeHtml(code)}</span></p>`
    : "";
  const button = cta
    ? `<p style="margin:28px 0"><a href="${escapeHtml(cta.url)}" style="background:#22D3EE;color:#03141A;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600">${escapeHtml(cta.label)}</a></p>
       <p style="color:#A1A8B3;font-size:13px">If the button does not work, copy this link:<br>${escapeHtml(cta.url)}</p>`
    : "";
  const footer = unsubscribe
    ? `<p style="color:#7C8591;font-size:12px;line-height:1.5;margin:24px 0 0;border-top:1px solid #1C2026;padding-top:16px">You're receiving this because you created an account at ${escapeHtml(siteConfig.name)}. <a href="${escapeHtml(unsubscribe.pageUrl)}" style="color:#A1A8B3">Stop these reminders</a>.</p>`
    : "";
  return `<div style="background:#050607;padding:32px;font-family:Arial,sans-serif;color:#F4F6F8">
    <div style="max-width:520px;margin:auto;background:#0F1216;border:1px solid #1C2026;border-radius:14px;padding:32px">
      <p style="margin:0 0 24px"><img src="${escapeHtml(`${siteConfig.url}/brand/apollo-logo-email.png`)}" width="220" height="46" alt="${escapeHtml(siteConfig.name)}" style="display:block;border:0;height:auto;max-width:220px"></p>
      <h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(heading)}</h1>
      ${paragraphs}${codeBlock}${button}${footer}
    </div></div>`;
}

function plainText({ heading, body, cta, code, unsubscribe }: Mail) {
  return [heading, body, code, cta && `${cta.label}: ${cta.url}`, unsubscribe && `Stop these reminders: ${unsubscribe.pageUrl}`].filter(Boolean).join("\n\n");
}

/**
 * Sends a transactional email. Without SMTP configuration the message is
 * printed to the server console in development and rejected in production,
 * so nothing is silently "sent".
 */
export async function sendEmail(mail: Mail) {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[email:dev] To: ${mail.to}\nSubject: ${mail.subject}\n${plainText(mail)}\n`);
      return;
    }
    throw new Error("Email delivery is not configured. Set SMTP_* and EMAIL_FROM environment variables.");
  }
  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: mail.to,
    subject: mail.subject,
    text: plainText(mail),
    html: layout(mail),
    // RFC 8058 one-click unsubscribe, which Gmail and others show as an "Unsubscribe" button.
    headers: mail.unsubscribe
      ? { "List-Unsubscribe": `<${mail.unsubscribe.oneClickUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" }
      : undefined,
  });
}
