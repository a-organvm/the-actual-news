# Revenue Provider Onboarding

This is the public-safe setup path for turning Records Watch from a launch surface into an audience and revenue system. Keep hosted provider URLs public. Keep provider API keys, webhook secrets, CRM tokens, and payment credentials internal.

## Required Public URLs

Create hosted destinations for these three browser-safe variables:

| Variable | Purpose | Hosted destination | Must not be |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_NEWSLETTER_URL` | Owned audience capture | Newsletter signup form or landing page | `/briefing`, `/go/briefing`, `/api/*`, `/v1/*`, `/runbook.json`, `/share-kit.json`, `/provider-handoff.json`, `/provider-pages`, `/campaigns.json`, `/media-kit`, `/media-kit.json`, `/sponsors.json` |
| `NEXT_PUBLIC_MEMBERSHIP_URL` | Reader revenue | Hosted checkout, membership page, OpenCollective, Patreon, or Stripe Payment Link | `/membership`, `/go/membership`, `/api/*`, `/v1/*`, `/runbook.json`, `/share-kit.json`, `/provider-handoff.json`, `/provider-pages`, `/campaigns.json`, `/media-kit`, `/media-kit.json`, `/sponsors.json` |
| `NEXT_PUBLIC_SPONSOR_URL` | Sponsor revenue | Sponsor intake form, CRM form, calendar, or sponsorship packet | `/sponsor`, `/sponsors`, `/go/sponsor`, `/api/*`, `/v1/*`, `/runbook.json`, `/share-kit.json`, `/provider-handoff.json`, `/provider-pages`, `/campaigns.json`, `/media-kit`, `/media-kit.json`, `/sponsors.json` |

The public app uses `/go/briefing`, `/go/membership`, and `/go/sponsor` as stable distribution links. Those routes preserve UTM parameters and redirect to the hosted provider URLs after configuration. Do not set the provider variables back to the public app's own fallback routes.

## Provider Setup Checklist

1. Create a hosted newsletter signup page.
2. Create a hosted membership or checkout page with the public offer copy from `/membership`.
3. Create a hosted sponsor intake page with the public offer copy from `/sponsor`.
4. Enable provider-side attribution for these query parameters:
   - `utm_source`
   - `utm_medium`
   - `utm_campaign`
   - `utm_content`
5. Store provider API keys, webhook secrets, CRM tokens, and payment credentials only in the deployment secret manager or internal services.
6. Put only the hosted public URLs in `.env.public`.
7. Run the strict launch check against the actual public env file.

Use `docs/provider-page-specs.md` for the exact page copy, required fields, attribution metadata, confirmation copy, and acceptance criteria for all three hosted provider destinations.
The same public-safe setup packet is exposed at `/provider-pages` for human operators and `/provider-handoff.json` for launch operators and distribution automation.
Use `/campaigns.json` after provider setup to feed recurring public campaign pushes for atom sharing, briefing capture, membership asks, and sponsor outreach.
Use `/provider-pages`, `/media-kit`, and `/media-kit.json` for public press, partner, and sponsor outreach context; do not use them as provider conversion destinations.
Use `/sponsors` and `/sponsors.json` to publish accepted sponsor disclosures and firewall terms before sponsor-funded work is fulfilled.

## Public Env Example

```bash
PUBLIC_SITE_URL=https://recordswatch.org \
PUBLIC_API_URL=https://recordswatch.org \
NEWSLETTER_URL=https://briefing-provider.example/records-watch \
MEMBERSHIP_URL=https://membership-provider.example/records-watch \
SPONSOR_URL=https://crm-provider.example/forms/records-watch-sponsor \
ANALYTICS_DOMAIN=recordswatch.org \
pnpm public-env:template > .env.public
```

Replace the example hosts with real hosted provider URLs. The strict checker rejects placeholder domains, local URLs, and same-origin fallback app routes.

The generated `.env.public` template includes inline guardrails for the provider URLs and public/internal boundary. Prefer regenerating it for deployment handoff instead of copying values by hand:

```bash
PUBLIC_SITE_URL=https://recordswatch.org \
PUBLIC_API_URL=https://recordswatch.org \
ANALYTICS_DOMAIN=recordswatch.org \
pnpm public-env:template > .env.public
```

Then fill only the three hosted provider URL values and run strict verification.

## Verification Commands

```bash
PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict
PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://recordswatch.org pnpm launch:deployed
```

For local source verification without a public deployment:

```bash
pnpm launch:local
```

For the current Cloudflare Worker before the final custom domain is attached:

```bash
pnpm cloudflare:build
pnpm cloudflare:deploy
pnpm cloudflare:smoke
```

When the three hosted provider destinations are ready, update only these public values in `apps/public-web/wrangler.jsonc`:

```json
{
  "NEXT_PUBLIC_NEWSLETTER_URL": "https://hosted-newsletter-provider.example/records-watch",
  "NEXT_PUBLIC_MEMBERSHIP_URL": "https://hosted-membership-provider.example/records-watch",
  "NEXT_PUBLIC_SPONSOR_URL": "https://hosted-sponsor-provider.example/records-watch"
}
```

Do not put API keys, webhook secrets, CRM tokens, payment credentials, private sponsor notes, or fulfillment settings in `wrangler.jsonc`.

## Secret Boundary

Public:

- Hosted signup, checkout, and intake URLs
- Public analytics domain
- UTM parameters
- Public offer copy

Internal:

- Payment processor secret keys
- Webhook signing secrets
- Newsletter API tokens
- CRM API tokens
- Fulfillment credentials
- Database URLs
- Reviewer queues and task operations
