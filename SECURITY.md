# Security

## Reporting a vulnerability

Email the address set in **Admin → Settings → Support email** with details and steps to reproduce. Please don't open public issues for security reports.

## What's implemented

### Authentication
- **Better Auth** handles credentials. Passwords are hashed with scrypt (salted) and never stored or logged in plain text.
- Password policy: 10–128 characters with upper and lowercase letters and a number, checked on the client and the server.
- **Email verification is required** before a session can be created.
- Password-reset tokens are single-use and expire after **30 minutes**. A reset revokes all existing sessions.
- Sessions are stored in the database. Users can list them and revoke one or all others (Dashboard → Security).
- Session cookies are `HttpOnly`, `SameSite=Lax` and `Secure` in production, under the prefix `agtv`.
- Forgot-password and resend-verification give the same response whether or not the account exists (no account enumeration).

### Authorization
- Roles are `USER`, `SUPPORT` and `ADMIN`. **Every** protected page, layout and server action re-checks the session and re-reads the role and status from the database (`src/lib/session.ts`). Nothing about roles, ownership, payment status or referral eligibility comes from the browser.
- `src/proxy.ts` is only an optimistic redirect for visitors with no session cookie. It's not the security boundary.
- Customer queries are always scoped by the authenticated `userId` (e.g. tickets use `findFirst({ id, userId })`).
- Admins can't change their own role or suspend themselves, and the last active admin can't be demoted.
- Suspending an account deletes its sessions immediately. Suspended users can't sign in.
- Payment records are read-only in the admin. Provider-managed subscriptions can't be edited by hand.

### Abuse protection
- Auth endpoints are rate-limited and stored in the database (sign-in 5/min, sign-up 5/5 min, password reset 3/5 min, verification 3/5 min, change password 5/5 min).
- Application actions are rate-limited per user (reviews 3/day, tickets 5/hour, replies 30/hour).
- CSRF: Better Auth checks the request origin against `trustedOrigins`. Next.js server actions only accept same-origin POSTs.

### Input and output
- Every server action validates input with **Zod**, including enum whitelists, lengths and URL protocols.
- Prisma uses parameterized queries. The app has no raw SQL.
- React escapes all rendered text. The only `dangerouslySetInnerHTML` is JSON-LD built from our own data and escaped (`<` → `<`).
- Redirect targets after sign-in are restricted to same-site relative paths (`safeRedirect`).
- No file uploads are implemented. Channel logos are URLs limited to `https://` or local `/public` paths.

### Headers
`X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · CSP `frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy` · `Cross-Origin-Opener-Policy` · HSTS in production. The `X-Powered-By` header is removed.

### Privacy and SEO
- Private areas send `X-Robots-Tag: noindex` and `robots` metadata, and are disallowed in `robots.txt`. This is **not** treated as access control.
- Public review authors are shown as "First L.". Emails are never displayed publicly.

### Secrets and logging
- Secrets come only from environment variables. `.env*` files are git-ignored (except `.env.example`, which holds placeholders).
- Only `NEXT_PUBLIC_*` variables reach the browser, and none of them are secrets.
- Audit logs record role changes, suspensions, plan, subscription and settings changes, moderation and referral decisions. Keys that look like secrets are redacted before writing (`src/lib/audit.ts`).
- Errors shown to users are generic. Details go to server logs only.

## Known gaps and recommendations before launch

- **No two-factor authentication yet.** Better Auth's `twoFactor` plugin is the recommended next step, at least for staff accounts.
- **Strict Content-Security-Policy** (script-src with nonces) isn't enabled, because it needs nonce plumbing through `proxy.ts`. Add it once third-party scripts such as analytics or payments are known.
- **Payments aren't integrated.** When adding them, verify webhook signatures and make webhook handling idempotent (see HOSTINGER_DEPLOYMENT.md §10).
- `npm audit` currently reports 3 high-severity advisories, all from `deepmerge-ts` inside Prisma 6's config loader (stack exhaustion on recursive objects). It runs only when Prisma loads its own config, never on user input, so practical risk is low. The fix is upgrading to Prisma 7 (a major version with driver adapters and `prisma.config.ts`). Plan that upgrade as a separate task.
- Run `npm audit` before each release and keep Next.js, Better Auth and Prisma patched. Hostinger's Node.js vulnerability scan can also flag issues.
- Use a dedicated SMTP mailbox with SPF, DKIM and DMARC configured for the sending domain.
