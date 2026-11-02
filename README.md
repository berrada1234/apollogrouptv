# Apollo Group TV

Website and dashboards for the Apollo Group TV platform: a public marketing site, a customer dashboard and a role-protected admin dashboard.

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| Styling | Tailwind CSS 4 with design tokens in `src/app/globals.css` |
| Database | MySQL / MariaDB (Hostinger) through Prisma 6 |
| Auth | Better Auth: email + password, email verification, password reset, database sessions, rate limiting |
| Forms | React Hook Form + Zod on the client; Zod validation again in every server action |
| Tests | Vitest (unit and integration) · Playwright (end-to-end) |

> **Why MySQL instead of PostgreSQL?** Hostinger's web/cloud plans ship with MySQL/MariaDB on the same server. Using it keeps everything on one plan with no extra service. Moving to PostgreSQL later only means changing `provider` in `prisma/schema.prisma` and regenerating migrations.

## Getting started (local)

Requirements: Node.js 20.9 or newer (developed on 24), and a MySQL database you can reach. There's no local DB on this PC, so use a Hostinger remote database (see [HOSTINGER_DEPLOYMENT.md § Remote database for local development](HOSTINGER_DEPLOYMENT.md#remote-database-for-local-development)).

```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run db:migrate          # apply migrations
npm run db:seed             # FAQ entries + clearly-labelled demo plans/channels
npm run dev                 # http://localhost:3000
```

Without SMTP settings in development, verification and reset emails are **printed to the terminal** (look for `[email:dev]`), so you can click the link from there.

### Create the first administrator

No default admin exists. That's deliberate, so there's never a known password.

1. Sign up on the website with the admin's real email and verify it.
2. On a machine that has `DATABASE_URL` set, run:
   ```bash
   npm run admin:create -- admin@your-domain.com
   ```
3. Sign out and back in, then open `/admin`. Further roles are assigned from **Admin → Users** (audit-logged).

Safeguards: the script only promotes an existing, email-verified account and never sets a password; the change is written to the audit log. In the admin, nobody can change their own role or suspend themselves, the last active administrator can't be demoted, and every admin operation re-checks the role on the server.

**Local testing only:** `AUTH_SKIP_EMAIL_VERIFICATION="true"` in `.env` lets new accounts sign in without the email step. It is ignored unless `BETTER_AUTH_URL` points at localhost.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Start the production server (honours `PORT`) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` | Unit tests; integration tests run too when `TEST_DATABASE_URL` is set |
| `npm run test:e2e` | Playwright journeys (needs a migrated and seeded DB, then builds and starts the app) |
| `npm run db:migrate` | Apply migrations (`prisma migrate deploy`) |
| `npm run db:migrate:dev` | Create a new migration after editing the schema |
| `npm run db:seed` | Seed FAQ and, outside production, demo data |
| `npm run admin:create -- <email>` | Promote a verified account to ADMIN |

## Project structure

```
prisma/              schema.prisma, migrations/, seed.ts
scripts/             create-admin.ts
src/proxy.ts         optimistic route guard, noindex headers, referral cookie
src/app/(marketing)  public pages: / product app plans channels reviews refer-a-friend faq account client-portal terms privacy
src/app/(auth)       sign-in create-account forgot-password reset-password verify-email
src/app/dashboard    customer dashboard (overview, profile, plan, subscription, billing, referrals, support, notifications, security)
src/app/admin        admin dashboard (users, plans, subscriptions, payments, channels, reviews, faq, referrals, support, messages, settings, seo, audit-logs)
src/app/api          auth handler, payment-webhook placeholder
src/actions          server actions (user.ts, admin.ts), each one authorizes on the server
src/components       UI primitives (ui/), marketing sections, dashboard shell, forms
src/lib              auth, db, session/RBAC, settings, validators, email, audit, rate-limit
tests/               unit/, integration/, e2e/
```

## Roles

| Role | Access |
| --- | --- |
| `USER` | Their own dashboard and data only |
| `SUPPORT` | Admin overview, support tickets, review moderation |
| `ADMIN` | Everything, including users, roles, plans, settings and audit logs |

Roles and account status are re-read from the database on every request, so changes and suspensions take effect immediately.

## Content rules built into the app

- **No made-up numbers.** Admin metrics, review averages and counts are computed from database rows.
- **No fake reviews.** Reviews require a signed-in account and moderation. "Verified customer" is set only when the reviewer has a subscription on record.
- **No invented prices or devices.** Plans and app platforms are managed in the admin. Empty states are shown until real data exists, and the seed's demo data is clearly labelled "Demo".
- **Referral rewards** are never advertised or issued until enabled in **Admin → Settings → Referral program**.
- **Catalog**: list only channels and logos you're licensed to show.

## Integrations that still need configuration

| Integration | Status | What's needed |
| --- | --- | --- |
| MySQL database | Code ready | Create the DB in hPanel, set `DATABASE_URL`, run migrations |
| Email (SMTP) | Code ready (nodemailer) | `SMTP_HOST/PORT/USER/PASSWORD`, `EMAIL_FROM`. **Required in production**: sign-up and reset fail with a clear error without it |
| Payment provider | **Not integrated**: checkout is disabled and labelled as such | Pick Stripe, Paddle or PayPal, implement an adapter and the webhook (see `src/lib/payments.ts` and `src/app/api/webhooks/payments/route.ts`). Until then admins activate plans manually from **Admin → Users → user** (audit-logged) |
| Google Search Console | Ready | Set `GOOGLE_SITE_VERIFICATION`, deploy, verify in Search Console, submit `/sitemap.xml` |
| Analytics | Not wired | Choose a provider. Add its script in `src/app/layout.tsx` and update the Privacy Policy and cookie consent accordingly |
| Legal pages | Templates | `/terms` and `/privacy` are marked "legal review required" |
| Brand assets | Placeholder logo | Replace `src/components/logo.tsx`, `src/app/icon.svg` and `src/app/opengraph-image.tsx` with final assets |

See also [HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md) and [SECURITY.md](SECURITY.md).
