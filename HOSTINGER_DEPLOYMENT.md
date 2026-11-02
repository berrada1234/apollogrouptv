# Deploying to Hostinger

> Status: **not deployed yet.** This guide describes how to deploy; nothing has been uploaded to Hostinger.

## 1. Check the plan supports it

This is a full-stack Next.js app. It needs a **persistent Node.js process** (server rendering, API routes, auth) and a **MySQL database**.

| Hostinger plan | Works? |
| --- | --- |
| Business Web Hosting, Cloud Startup/Professional/Enterprise | **Yes.** Node.js web apps are supported, with MySQL on the same server |
| Single / Premium Web Hosting (static + PHP only) | **No.** See §9 |
| VPS | Yes, but you manage Node, a process manager (PM2) and a reverse proxy yourself |

The account checked during development (`u610068862`) already runs a Node.js website (`iptvv.cloud`), so its plan supports Node.js apps.

**Pick the domain carefully.** `apollogrouptvi.com` and `apollo-grouptvs.com` currently run WordPress. Deploying this app to either one **replaces** that site. Back up first (§8) or use a new domain or subdomain.

## 2. Create the database

1. hPanel → **Websites → (your site) → Databases → MySQL Databases**.
2. Create a database and a user with a strong generated password. Note the full names (Hostinger prefixes them, e.g. `u610068862_apollo`).
3. The app's connection string (used **on the server**):
   ```
   DATABASE_URL="mysql://u610068862_user:URL_ENCODED_PASSWORD@127.0.0.1:3306/u610068862_apollo"
   ```
   Use `127.0.0.1`, not `localhost` (which may resolve to IPv6) and not the `srvNNNN.hstgr.io` host. URL-encode special characters in the password (`@` → `%40`, `#` → `%23`, `/` → `%2F`).

### Remote database for local development

1. hPanel → Databases → **Remote MySQL** → add your public IP (or `%` temporarily) for the database.
2. Locally, use the host shown there (e.g. `srv1234.hstgr.io`):
   ```
   DATABASE_URL="mysql://u610068862_user:PASSWORD@srv1234.hstgr.io:3306/u610068862_apollo"
   ```
3. Use a **separate development database**. Don't develop against production data.

## 3. Run migrations

Run once per release whenever `prisma/migrations` changes. Pick one option:

- **From your PC** (with Remote MySQL enabled for your IP):
  ```bash
  DATABASE_URL="mysql://…@srv1234.hstgr.io:3306/…" npx prisma migrate deploy
  ```
- **Over SSH** (hPanel → Advanced → SSH Access), in the app directory:
  ```bash
  npx prisma migrate deploy
  ```

Optional first-time seed (FAQ only; demo data is skipped in production):

```bash
NODE_ENV=production npm run db:seed
```

## 4. Create the Node.js app

hPanel → **Websites → Add website → Node.js app** (or, on an existing site, **Node.js** in the sidebar):

| Setting | Value |
| --- | --- |
| Source | **GitHub repository** (recommended: auto-deploys on push) or upload a ZIP of the project **without** `node_modules`, `.next` and `.env` |
| Node.js version | 22.x or 24.x (20.9+ minimum) |
| Framework | Next.js |
| Build command | `npm run build` |
| Start command | `npm start` |
| Install command | `npm ci` (or `npm install`) |

Dev dependencies (Prisma CLI, tsx) must be installed during the build, so don't use `--omit=dev`.

## 5. Environment variables

Set these in hPanel → Node.js → **Environment variables**. Never in a committed file.

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://your-domain.com`. Baked in at build time, so **rebuild after changing it** |
| `DATABASE_URL` | ✅ | §2 |
| `BETTER_AUTH_SECRET` | ✅ | 32+ random bytes: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `BETTER_AUTH_URL` | ✅ | Same as the site URL |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` | ✅ | Hostinger email: `smtp.hostinger.com`, port `465`. Create the mailbox in hPanel → Emails |
| `GOOGLE_SITE_VERIFICATION` | optional | Search Console HTML-tag token |
| `ALLOW_INDEXING` | optional | `false` on staging |
| `NEXT_PUBLIC_IMAGE_HOSTS` | optional | Comma-separated HTTPS hosts for channel logos |
| `PAYMENT_*` | later | See §10 |

Variables starting with `NEXT_PUBLIC_` are visible in the browser. **Never** put secrets in them.

## 6. Domain and HTTPS

1. Attach the domain to the Node.js website in hPanel (or point DNS: an `A` record to the server IP shown in hPanel, `www` as a `CNAME` to the root).
2. hPanel → **Security → SSL** → install the free SSL certificate and turn on **Force HTTPS**.
3. Make sure `NEXT_PUBLIC_SITE_URL` and `BETTER_AUTH_URL` use `https://` and the final domain, then redeploy.
4. Production cookies are `Secure`, so sign-in only works over HTTPS.

## 7. After the first deploy

1. Open the site and create your own account. Verify the email (this proves SMTP works).
2. Promote yourself: `npm run admin:create -- you@your-domain.com` (over SSH, or from your PC against the remote DB).
3. In **Admin**: create plans and channel categories, add licensed channels, review the FAQ, fill in **Settings** (support contact, app platforms, notifications).
4. Search Console: verify the property, then submit `https://your-domain.com/sitemap.xml`.
5. Smoke test: sign up, verify, sign in, open a ticket, reply as staff, and check `/robots.txt`, `/sitemap.xml` and a 404 page.

## 8. Backups and recovery

- **Before replacing an existing WordPress site:** hPanel → Files → **Backups**. Download a full backup (files and database).
- hPanel takes automatic backups (frequency depends on the plan). Restore from **Backups → Restore**.
- Manual DB export: hPanel → Databases → **phpMyAdmin → Export**, or `mysqldump` over SSH. Do this before every migration on production.
- Keep `.env` values in a password manager. If `BETTER_AUTH_SECRET` is lost or rotated, every user is signed out (no data loss).
- Recovery: restore the DB backup → redeploy the matching Git commit → run `npx prisma migrate deploy`.

## 9. If the plan is static/PHP only

A full-stack Next.js app **can't** be uploaded as static files on these plans. Sign-in, dashboards, admin, server actions and database access all need a running Node.js server. `next export` would drop every one of those features. The options are:

1. **Upgrade** to Business or Cloud hosting (simplest; no code changes).
2. **Split hosting:** run this app on a Node-capable host (Hostinger VPS or Cloud) and keep a static marketing site on the cheaper plan.
3. **VPS:** install Node 22+, run `npm ci && npm run build`, keep it alive with PM2 (`pm2 start npm --name apollo -- start`), and put Nginx in front with Let's Encrypt.

## 10. Enabling payments (later)

1. Choose a provider (Stripe, Paddle or PayPal) and create **test-mode** keys first.
2. Implement an adapter under `src/lib/payments/` that creates a checkout session for a `Plan`.
3. Implement `src/app/api/webhooks/payments/route.ts`: verify the signature with `PAYMENT_WEBHOOK_SECRET`, de-duplicate events, and write `Payment` and `Subscription` rows in one transaction.
4. Set `PAYMENT_PROVIDER`, `PAYMENT_SECRET_KEY` and `PAYMENT_WEBHOOK_SECRET`, then make `isCheckoutEnabled()` return true.
5. Register the webhook URL `https://your-domain.com/api/webhooks/payments` with the provider.

## 11. Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| Build fails at `prisma generate` | Dev dependencies weren't installed. Use `npm ci` without `--omit=dev` |
| `Can't reach database server` | Wrong host. On the server use `127.0.0.1`; locally use the `srvNNNN.hstgr.io` host with Remote MySQL enabled |
| `Access denied for user` | Password not URL-encoded, or user not attached to the DB in hPanel |
| `The table … does not exist` | Migrations not applied. Run `npx prisma migrate deploy` |
| Sign-in "works" but you stay signed out | Site served over HTTP, or `BETTER_AUTH_URL`/`NEXT_PUBLIC_SITE_URL` don't match the real domain |
| Sign-up says email isn't configured | `SMTP_*` / `EMAIL_FROM` missing |
| "Too many attempts" | Auth rate limit. Wait one minute; limits live in the `rate_limits` table |
| Changed `NEXT_PUBLIC_SITE_URL` but old URLs appear | Public variables are build-time. Trigger a rebuild |
| 502 / app not starting | Check the Node.js logs in hPanel. Confirm the start command is `npm start` and the Node version is 20.9+ |
