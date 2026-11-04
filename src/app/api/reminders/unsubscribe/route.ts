import { NextResponse } from "next/server";
import { verifyReminderToken } from "@/lib/reminder-schedule";
import { optOutOfReminders } from "@/lib/reminders";

export const dynamic = "force-dynamic";

/**
 * RFC 8058 one-click unsubscribe target from the List-Unsubscribe header: mail providers POST here
 * when someone presses their "Unsubscribe" button. A plain visit is sent to the confirmation page instead.
 */
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get("u") ?? "";
  if (!verifyReminderToken(u, searchParams.get("t") ?? "", process.env.BETTER_AUTH_SECRET ?? "")) {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });
  }
  await optOutOfReminders(u);
  return NextResponse.json({ ok: true });
}

export function GET(req: Request) {
  const url = new URL(req.url);
  return NextResponse.redirect(new URL(`/email-preferences${url.search}`, url));
}
