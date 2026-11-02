import type { Metadata } from "next";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { ChangePasswordForm, PreferencesForm, ProfileForm, SessionsManager } from "@/components/forms/account-forms";
import { PageHero } from "@/components/marketing/sections";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await requireUser("/account");
  return (
    <>
      <PageHero
        title="Your account"
        description={`Signed in as ${user.email}. Manage your profile, preferences and security.`}
        crumbs={[{ href: "/account", label: "Account" }]}
      >
        <ButtonLink href="/dashboard" variant="secondary">
          Open full dashboard
        </ButtonLink>
      </PageHero>
      <Container className="grid gap-6 py-12 lg:grid-cols-2 [&>*]:min-w-0">
        <Card>
          <CardHeader title="Profile information" />
          <CardBody>
            <ProfileForm name={user.name} email={user.email} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Notification preferences" />
          <CardBody>
            <PreferencesForm marketingOptIn={user.marketingOptIn} productUpdatesOptIn={user.productUpdatesOptIn} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Change password" />
          <CardBody>
            <ChangePasswordForm />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Sessions" description="Devices currently signed in to your account." />
          <CardBody>
            <SessionsManager currentSessionId={user.sessionId} />
          </CardBody>
        </Card>
      </Container>
    </>
  );
}
