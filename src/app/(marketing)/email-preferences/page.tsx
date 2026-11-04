import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2, MailX } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/misc";
import { verifyReminderToken } from "@/lib/reminder-schedule";
import { optOutOfReminders } from "@/lib/reminders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Email Preferences",
  robots: { index: false, follow: false },
};

const secret = () => process.env.BETTER_AUTH_SECRET ?? "";

/** Server action: the button (not the link) does the opt-out, so mail scanners that open links can't unsubscribe anyone. */
async function stopReminders(formData: FormData) {
  "use server";
  const u = String(formData.get("u") ?? "");
  const t = String(formData.get("t") ?? "");
  if (!verifyReminderToken(u, t, secret())) redirect("/email-preferences?invalid=1");
  await optOutOfReminders(u);
  redirect("/email-preferences?done=1");
}

export default async function EmailPreferencesPage({ searchParams }: PageProps<"/email-preferences">) {
  const sp = await searchParams;
  const u = typeof sp.u === "string" ? sp.u : "";
  const t = typeof sp.t === "string" ? sp.t : "";
  const done = sp.done === "1";
  const valid = !done && verifyReminderToken(u, t, secret());

  return (
    <Container className="max-w-xl py-24 text-center">
      {done ? (
        <>
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
          <h1 className="mt-5 font-hero text-3xl font-medium tracking-[-0.035em] text-text">You won&apos;t get these reminders again</h1>
          <p className="mt-3 text-muted">
            We&apos;ve stopped the emails about finishing your sign-up. You&apos;ll still receive messages you need, like verification codes, invoices and replies to
            your tickets.
          </p>
          <ButtonLink href="/" variant="secondary" className="mt-8">
            Back to the website
          </ButtonLink>
        </>
      ) : valid ? (
        <>
          <MailX className="mx-auto h-12 w-12 text-accent" aria-hidden />
          <h1 className="mt-5 font-hero text-3xl font-medium tracking-[-0.035em] text-text">Stop reminder emails?</h1>
          <p className="mt-3 text-muted">
            These are the few emails we send to help you finish choosing a pack. Account emails like verification codes, invoices and ticket replies aren&apos;t
            affected.
          </p>
          <form action={stopReminders} className="mt-8">
            <input type="hidden" name="u" value={u} />
            <input type="hidden" name="t" value={t} />
            <Button type="submit" size="lg">
              Stop reminder emails
            </Button>
          </form>
        </>
      ) : (
        <>
          <MailX className="mx-auto h-12 w-12 text-muted" aria-hidden />
          <h1 className="mt-5 font-hero text-3xl font-medium tracking-[-0.035em] text-text">This link isn&apos;t valid</h1>
          <p className="mt-3 text-muted">Use the link at the bottom of the reminder email, or contact us and we&apos;ll stop them for you.</p>
          <ButtonLink href="/contact" variant="secondary" className="mt-8">
            Contact us
          </ButtonLink>
        </>
      )}
    </Container>
  );
}
