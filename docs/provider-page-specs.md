# Provider Page Specs

These specs are the public-safe handoff for creating hosted newsletter, membership, and sponsor destinations. Use them in Beehiiv, Buttondown, Substack, ConvertKit, Stripe Payment Links, OpenCollective, Patreon, Airtable, HubSpot, Typeform, Calendly, or another hosted provider.

Keep provider API keys, webhook secrets, CRM tokens, payment credentials, fulfillment credentials, and database URLs out of these pages and out of `.env.public`.

The public app also exposes the same setup packet as machine-readable JSON at `/provider-handoff.json` for launch operators and distribution automation.

## Shared Requirements

- Each provider URL must be HTTPS and hosted outside this app.
- Do not point provider URLs to `/briefing`, `/membership`, `/sponsor`, `/sponsors`, `/media-kit`, `/go/*`, `/api/*`, `/v1/*`, `/launch.json`, `/runbook.json`, `/share-kit.json`, `/provider-handoff.json`, `/campaigns.json`, `/media-kit.json`, or `/sponsors.json`.
- Preserve these attribution parameters on the provider side: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
- Use the public distribution URLs in campaign copy: `/go/briefing`, `/go/membership`, and `/go/sponsor`.
- Keep all payment, email, CRM, webhook, and fulfillment automation behind the provider or an internal service.
- After setup, write only the hosted public URLs to `.env.public` as `NEXT_PUBLIC_NEWSLETTER_URL`, `NEXT_PUBLIC_MEMBERSHIP_URL`, and `NEXT_PUBLIC_SPONSOR_URL`.

## Newsletter Page

Environment variable: `NEXT_PUBLIC_NEWSLETTER_URL`

Stable distribution route: `/go/briefing`

Recommended provider types: Beehiiv, Buttondown, Substack, ConvertKit, Ghost, or any hosted newsletter form.

Page title:

```text
Join the Daily Briefing
```

Kicker:

```text
Town crier dispatch
```

Primary copy:

```text
Own the audience relationship with a concise briefing that sends readers back to the public ledger instead of trapping them in a feed.
```

Signup button:

```text
Join the briefing
```

Form fields:

- Email address, required
- Name, optional
- Source story or clip, hidden, populated from `utm_content` when the provider supports hidden fields
- Campaign source, hidden, populated from `utm_source`
- Campaign medium, hidden, populated from `utm_medium`
- Campaign name, hidden, populated from `utm_campaign`

Confirmation copy:

```text
You are on the briefing list. New clippings, verification notes, correction updates, and share-ready story atoms will point back to the public ledger.
```

Provider notes:

- Enable double opt-in if the provider supports it.
- Use the provider's keyless public form URL in `.env.public`.
- Keep newsletter API tokens and webhook signing secrets in the deployment secret manager or internal services.

Acceptance criteria:

- `/go/briefing?utm_source=launch&utm_medium=social&utm_campaign=public_open&utm_content=records-watch` redirects to the hosted newsletter page.
- The provider records the UTM values or at least preserves them in the signup session.
- The public app still passes `PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict`.

## Membership Page

Environment variable: `NEXT_PUBLIC_MEMBERSHIP_URL`

Stable distribution route: `/go/membership`

Recommended provider types: Stripe Payment Link, OpenCollective, Patreon, Ghost memberships, Memberful, or a hosted checkout page.

Page title:

```text
Become a Founding Member
```

Kicker:

```text
Reader-funded press
```

Primary copy:

```text
Fund the verification work directly: claims, evidence, corrections, and public-interest reporting that does not depend on ad inventory.
```

Checkout button:

```text
Start membership
```

Suggested tiers:

| Tier | Price | Purpose |
| --- | --- | --- |
| Reader | `$5/mo` | Keep the public ledger moving with the daily briefing, member notes, and correction-watch updates. |
| Sustainer | `$15/mo` | Fund primary-source reporting capacity and receive monthly evidence dockets. |
| Founding Press | `$50/mo` | Underwrite a verification-first newsroom spine with founding member recognition and quarterly ledger briefings. |

Checkout fields:

- Email address, required
- Name, optional
- Membership tier, required
- Campaign source, hidden or metadata, populated from `utm_source`
- Campaign medium, hidden or metadata, populated from `utm_medium`
- Campaign name, hidden or metadata, populated from `utm_campaign`
- Source story or clip, hidden or metadata, populated from `utm_content`

Confirmation copy:

```text
Thanks for backing reader-funded verification. Your membership helps pay for source collection, claim work, corrections, and public ledgers.
```

Provider notes:

- Use hosted checkout or provider-hosted membership pages for launch.
- Keep Stripe secret keys, webhook signing secrets, payout settings, and fulfillment credentials internal.
- If the provider supports metadata, map UTM values into checkout metadata for later attribution.

Acceptance criteria:

- `/go/membership?utm_source=launch&utm_medium=social&utm_campaign=public_open&utm_content=records-watch` redirects to the hosted checkout or membership page.
- The checkout can complete without the public app receiving payment credentials.
- The public app still passes `PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict`.

## Sponsor Page

Environment variable: `NEXT_PUBLIC_SPONSOR_URL`

Stable distribution route: `/go/sponsor`

Recommended provider types: HubSpot form, Airtable form, Typeform, Tally, Calendly, or a hosted sponsorship packet.

Page title:

```text
Sponsor a Public-Interest Beat
```

Kicker:

```text
Civic underwriting
```

Primary copy:

```text
Underwrite a reporting lane without buying editorial control: public records, local accountability, civic data, and explainers with visible verification.
```

CTA:

```text
Sponsor a beat
```

Suggested sponsorship notices:

| Notice | Price | Purpose |
| --- | --- | --- |
| Records Watch | `$500/mo` | Support a local public-records lane with public sponsor disclosure. |
| Civic Data | `$1,500/mo` | Fund structured explainers and reusable data notes without editorial control. |
| Investigation Pool | `$5,000/mo` | Underwrite deeper reporting capacity, primary-source collection, and verification dockets. |

Intake fields:

- Name, required
- Organization, required
- Email address, required
- Sponsorship interest, required
- Budget range, optional
- Beat or topic of interest, optional
- Firewall acknowledgement, required checkbox
- Public disclosure acknowledgement, required checkbox
- Campaign source, hidden, populated from `utm_source`
- Campaign medium, hidden, populated from `utm_medium`
- Campaign name, hidden, populated from `utm_campaign`
- Source story or clip, hidden, populated from `utm_content`

Required acknowledgement copy:

```text
I understand sponsorship does not buy editorial control, claim outcomes, story ranking, correction decisions, or private access to internal systems.
```

Confirmation copy:

```text
Thanks for the sponsorship inquiry. We will review fit, firewall terms, public disclosure, and reporting capacity before any sponsorship is accepted.
```

Provider notes:

- Host the intake form or calendar outside the public app.
- Keep CRM API tokens, calendar credentials, private sponsor notes, and contract workflows internal.
- Publish accepted sponsor relationships and firewall terms on the public site or in a public ledger before fulfillment.

Acceptance criteria:

- `/go/sponsor?utm_source=launch&utm_medium=social&utm_campaign=public_open&utm_content=records-watch` redirects to the hosted sponsor form or calendar.
- The form captures firewall and disclosure acknowledgement before submission.
- The public app still passes `PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict`.

## Final Verification

After all three provider pages exist:

```bash
PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict
PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://theactual.news pnpm launch:deployed
```

If the public app has not been deployed yet, run the no-Docker local gate:

```bash
pnpm launch:local
```
