"use server";

import { headers } from "next/headers";
import type { z } from "zod";
import { db } from "@/lib/db";
import { fail, fromZod, handleActionError, success, type ActionState } from "@/lib/action";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { contactSchema } from "@/lib/validators";

export async function sendContactMessage(input: z.input<typeof contactSchema>): Promise<ActionState> {
  try {
    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) {
      // A filled honeypot means a bot: pretend success so it learns nothing.
      if (parsed.error.issues.some((i) => i.path[0] === "website")) return success("Thanks — your message has been sent.");
      return fromZod(parsed.error);
    }
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
    if (!(await rateLimit(`contact:${ip}`, 5, 60 * 60)).ok) return fail("Too many messages from your network. Please try again later.");

    const user = await getCurrentUser();
    const { name, email, topic, subject, message } = parsed.data;
    const data = { name, email, topic, subject, message };
    await db.contactMessage.create({ data: { ...data, userId: user?.id ?? null } });

    const settings = await getSettings();
    if (settings.notifications.adminEmail) {
      await sendEmail({
        to: settings.notifications.adminEmail,
        subject: `Contact form: ${data.subject}`,
        heading: `New message (${data.topic})`,
        body: `From ${data.name} <${data.email}>. Read and reply from Admin → Messages.`,
      }).catch((e) => console.error("[email]", e.message));
    }
    return success("Thanks — your message has been sent. We'll reply to the email address you provided.");
  } catch (error) {
    return handleActionError(error);
  }
}
