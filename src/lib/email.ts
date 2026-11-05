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
  /** A short list of labelled links, e.g. one setup guide per device. */
  links?: { label: string; url: string }[];
  /** A closing paragraph after the button, e.g. where to get help. */
  note?: string;
  /** Reminder emails carry a "stop these reminders" link and List-Unsubscribe headers. */
  unsubscribe?: { pageUrl: string; oneClickUrl: string };
};

/*
 * Email design. Built for email clients, not browsers: table layout, inline styles, system fonts, no external CSS.
 *   Midnight #0A0E27  header band (the logo is white on transparent)
 *   Spectrum          #46E0FF → #7B8CFF → #9D7BFF strip, the site's own gradient (solid cyan where gradients aren't supported)
 *   Paper    #FFFFFF  message card on Mist #EEF1F8
 *   Ink      #0F1530  headings · Slate #4A5272 body · Signal #3D5AFE buttons and links
 * Every email ends with the official-sender strip: copycat sites are the real risk for this business, so each
 * message names the address it came from and what we never ask for.
 */
const C = {
  midnight: "#0A0E27",
  mist: "#EEF1F8",
  paper: "#FFFFFF",
  ink: "#0F1530",
  slate: "#4A5272",
  faint: "#7A819C",
  line: "#E3E7F2",
  signal: "#3D5AFE",
  tint: "#F3F5FF",
  tintLine: "#DCE2FF",
  cyan: "#46E0FF",
};
const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
const MONO = `'SF Mono',SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace`;

/** First sentence of the body, shown by inboxes as the preview line after the subject. */
function preheaderFrom(body: string) {
  const first = body.trim().split(/\n\s*\n/)[0] ?? "";
  const sentence = first.match(/^.*?[.!?](\s|$)/)?.[0] ?? first;
  return sentence.trim().slice(0, 140);
}

/** Escapes text and turns web addresses into short links ("apollogroupr.tv/guides/…"), dropping wrapping brackets. */
function rich(text: string) {
  return escapeHtml(text).replace(/\(?(https?:\/\/[^\s<>()]+)\)?/g, (_m, raw: string) => {
    // Sentence punctuation right after an address belongs to the sentence, not the link.
    const trail = raw.match(/[.,;:!?]+$/)?.[0] ?? "";
    const url = trail ? raw.slice(0, -trail.length) : raw;
    const shown = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `<a href="${url}" style="color:${C.signal};text-decoration:underline">${shown}</a>${trail}`;
  });
}

function layout({ heading, body, cta, code, links, note, unsubscribe }: Mail) {
  const host = new URL(siteConfig.url).host;
  const p = (text: string, extra = "") =>
    `<p class="txt" style="margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:26px;color:${C.slate};${extra}">${rich(text)}</p>`;

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((t) => p(t.trim()))
    .join("");

  const codeBlock = code
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px">
        <tr><td align="center" class="tile" style="background:${C.tint};border:1px solid ${C.tintLine};border-radius:14px;padding:22px 12px">
          <div style="font-family:${FONT};font-size:13px;line-height:18px;color:${C.faint};margin:0 0 8px">Your code</div>
          <div class="code ink" style="font-family:${MONO};font-size:36px;line-height:44px;font-weight:700;letter-spacing:12px;color:${C.ink};padding-left:12px">${escapeHtml(code)}</div>
        </td></tr>
      </table>`
    : "";

  const button = cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 12px">
        <tr><td align="center" class="btn" bgcolor="${C.signal}" style="border-radius:10px;background:${C.signal}">
          <a href="${escapeHtml(cta.url)}" style="display:inline-block;padding:14px 26px;font-family:${FONT};font-size:16px;line-height:20px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:10px">${escapeHtml(cta.label)}</a>
        </td></tr>
      </table>
      <p style="margin:0 0 20px;font-family:${FONT};font-size:13px;line-height:20px;color:${C.faint}">Button not working? Paste this into your browser:<br><a href="${escapeHtml(cta.url)}" style="color:${C.signal};word-break:break-all">${escapeHtml(cta.url)}</a></p>`
    : "";

  const linkList = links?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="rule" style="margin:4px 0 24px;border:1px solid ${C.line};border-radius:12px;border-collapse:separate">
        ${links
          .map(
            (l, i) => `<tr><td class="rule" style="padding:13px 16px;${i ? `border-top:1px solid ${C.line};` : ""}font-family:${FONT};font-size:15px;line-height:22px">
              <a href="${escapeHtml(l.url)}" class="ink" style="color:${C.ink};text-decoration:none;font-weight:600">${escapeHtml(l.label)}</a>
            </td><td align="right" class="rule" style="padding:13px 16px;${i ? `border-top:1px solid ${C.line};` : ""}font-family:${FONT};font-size:14px;line-height:22px;white-space:nowrap">
              <a href="${escapeHtml(l.url)}" style="color:${C.signal};text-decoration:none">Open guide</a>
            </td></tr>`,
          )
          .join("")}
      </table>`
    : "";

  const noteBlock = note
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 8px">
        <tr><td class="txt" style="border-left:3px solid ${C.cyan};padding:2px 0 2px 14px;font-family:${FONT};font-size:15px;line-height:24px;color:${C.slate}">${rich(note)}</td></tr>
      </table>`
    : "";

  const why = unsubscribe
    ? `You're getting this because you created an account at ${escapeHtml(siteConfig.name)}. <a href="${escapeHtml(unsubscribe.pageUrl)}" style="color:${C.faint};text-decoration:underline">Stop these reminders</a>.`
    : `This is a service email about your ${escapeHtml(siteConfig.name)} account.`;

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(heading)}</title>
<style>
  body { margin:0; padding:0; }
  a { text-decoration-thickness:1px; }
  @media (max-width:620px) {
    .shell { padding:16px 10px !important; }
    .pad { padding-left:22px !important; padding-right:22px !important; }
    .h1 { font-size:23px !important; line-height:30px !important; }
    .code { font-size:30px !important; letter-spacing:8px !important; }
  }
  @media (prefers-color-scheme: dark) {
    .mist { background:#05071A !important; }
    .card { background:#121733 !important; }
    .h1, .ink { color:#F2F4FF !important; }
    .txt { color:#C3C8E0 !important; }
    .tile { background:#1A2047 !important; border-color:#2E3770 !important; }
    .rule { border-color:#2A3158 !important; }
    .verify { background:#0D1230 !important; border-color:#2A3158 !important; }
    .btn { background:#3D5AFE !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.mist}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheaderFrom(body))}&#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;</div>
<table role="presentation" class="mist" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.mist}">
  <tr><td align="center" class="shell" style="padding:32px 16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">
      <tr><td bgcolor="${C.midnight}" style="background:${C.midnight};border-radius:16px 16px 0 0;padding:26px 36px" class="pad">
        <a href="${escapeHtml(siteConfig.url)}" style="text-decoration:none"><img src="${escapeHtml(`${siteConfig.url}/brand/apollo-logo-email.png`)}" width="200" height="41" alt="${escapeHtml(siteConfig.name)}" style="display:block;border:0;outline:none;width:200px;height:auto;color:#FFFFFF;font-family:${FONT};font-size:18px;font-weight:700"></a>
      </td></tr>
      <tr><td height="4" bgcolor="${C.cyan}" style="height:4px;line-height:4px;font-size:0;background:${C.cyan};background-image:linear-gradient(90deg,#46E0FF,#7B8CFF,#9D7BFF)">&nbsp;</td></tr>
      <tr><td class="card pad" bgcolor="${C.paper}" style="background:${C.paper};padding:36px 36px 20px">
        <h1 class="h1" style="margin:0 0 18px;font-family:${FONT};font-size:26px;line-height:33px;font-weight:700;letter-spacing:-0.3px;color:${C.ink}">${escapeHtml(heading)}</h1>
        ${paragraphs}${linkList}${codeBlock}${button}${noteBlock}
      </td></tr>
      <tr><td class="verify pad" bgcolor="${C.tint}" style="background:${C.tint};border-top:1px solid ${C.line};border-radius:0 0 16px 16px;padding:18px 36px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="top" style="padding:2px 12px 0 0"><div style="width:22px;height:22px;border-radius:11px;background:${C.signal};color:#FFFFFF;font-family:${FONT};font-size:13px;line-height:22px;text-align:center;font-weight:700">&#10003;</div></td>
          <td class="txt" style="font-family:${FONT};font-size:13px;line-height:20px;color:${C.slate}">
            <strong class="ink" style="color:${C.ink}">Sent from ${escapeHtml(host)}</strong>, the official ${escapeHtml(siteConfig.name)} website. We never ask for your password or card details by email.
          </td>
        </tr></table>
      </td></tr>
      <tr><td align="center" style="padding:22px 24px 8px;font-family:${FONT};font-size:12px;line-height:19px;color:${C.faint}">
        Need help? <a href="${escapeHtml(`${siteConfig.url}/contact`)}" style="color:${C.faint};text-decoration:underline">Contact support</a> or visit the <a href="${escapeHtml(`${siteConfig.url}/help`)}" style="color:${C.faint};text-decoration:underline">Help Center</a>.<br>
        ${why}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/** Renders the HTML for an email without sending it (used for previews). */
export function renderEmailHtml(mail: Mail) {
  return layout(mail);
}

function plainText({ heading, body, cta, code, links, note, unsubscribe }: Mail) {
  return [heading, body, links?.map((l) => `- ${l.label}: ${l.url}`).join("\n"), code, cta && `${cta.label}: ${cta.url}`, note, unsubscribe && `Stop these reminders: ${unsubscribe.pageUrl}`].filter(Boolean).join("\n\n");
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
