# Content verification checklist (owner)

Complete these before publishing. Most items are set in **Admin → Settings**, with no code changes needed.

## Business and legal (Admin → Settings → Legal & policies)

- [ ] Legal entity name and registered address.
- [ ] Governing law and venue for the Terms.
- [ ] **Refund rules**: window, eligibility and exclusions. The Refund Policy page shows a placeholder until you add them.
- [ ] DMCA designated agent name, email and postal address. If you operate in the US, consider registering the agent with the US Copyright Office.
- [ ] Official website domain (shown on About and Contact to help visitors spot lookalike sites).
- [ ] Name your service providers in the Privacy Policy: hosting (Hostinger), email delivery (your SMTP provider) and, later, the payment provider. Edit `src/content/legal.ts` if you want them named explicitly.
- [ ] Review the proposed liability cap in the Terms ("three months' fees").
- [ ] Have a qualified lawyer review all four policies, then tick **"approved"** and set "last updated". This removes the draft banner, makes the pages indexable and adds them to the sitemap.

## Statements the site makes that you must be able to stand behind

- [ ] "Only authorized, properly licensed content is listed." This appears on Home, Channels, Product, About, the FAQ and the legal explainer. If you can't confirm it for every channel, remove those channels or change the statement.
- [ ] Every channel and logo in the catalog is authorized for you to list and display.
- [ ] The legal explainer's commitments are true for your operation (copyright takedown process, official downloads only, published policies).

## Contact and support (Admin → Settings → Branding & contact)

- [ ] Support email, phone, hours and WhatsApp number. Each is shown only if you fill it in.
- [ ] SMTP configured (`SMTP_*`, `EMAIL_FROM`) so verification emails, contact notifications and ticket replies are actually delivered.
- [ ] Admin notification email (Settings → Staff notifications) to receive contact form alerts. Messages are also in **Admin → Messages**.
- [ ] No response-time promises are made anywhere. Add one only if you can meet it.

## Product data

- [ ] Replace the demo plans with your approved plans and prices (Admin → Plans). The "Demo" labels must not reach production.
- [ ] Replace the demo channels and categories with your real catalog (Admin → Channels).
- [ ] Add app platforms and tick **"Compatibility verified"** only after testing. Include the official download URL and numbered steps. Device guides at `/guides/<device>` are generated from this.
- [ ] Decide on referral rewards. Leave the program disabled until the rules are approved.

## Brand

- [ ] Confirm you have the right to use the "Apollo Group TV" name and logo in the markets you serve. Several unrelated sites use similar names.

## After deployment

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain and rebuild (canonicals and sitemap use it).
- [ ] Verify the domain in Google Search Console (`GOOGLE_SITE_VERIFICATION`) and submit `/sitemap.xml`.
- [ ] Run the homepage through the Rich Results Test (Organization and WebSite markup).
- [ ] Optional: run an external plagiarism check on the live copy.
