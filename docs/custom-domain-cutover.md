# Custom Domain Cutover

This is the public-safe path for moving The Actual News from the Workers preview origin to the canonical domain.

## Current Evidence

As of 2026-06-02, `theactual.news` is not delegated to Cloudflare. DNS currently publishes registrar-hosted nameservers and apex/www A records, so the Worker custom-domain cutover is not complete.

Verify at any time with:

```bash
pnpm domain:doctor
```

The doctor is read-only. It checks:

- `theactual.news` nameserver delegation
- apex and `www` DNS records
- live Worker `/api/healthz`
- whether newsletter, membership, and sponsor provider URLs are configured
- exact cutover commands to run after DNS and provider URLs are ready

## Required Public Values

Generate `.env.public` with real provider URLs before strict launch:

```bash
PUBLIC_SITE_URL=https://theactual.news \
PUBLIC_API_URL=https://theactual.news \
NEWSLETTER_URL=https://hosted-newsletter-provider.example/the-actual-news \
MEMBERSHIP_URL=https://hosted-membership-provider.example/the-actual-news \
SPONSOR_URL=https://hosted-sponsor-provider.example/the-actual-news \
ANALYTICS_DOMAIN=theactual.news \
pnpm public-env:template > .env.public
```

Replace the example provider hosts with real hosted pages. Do not put payment keys, newsletter tokens, CRM tokens, webhook secrets, database URLs, sponsor notes, contracts, or banking details in `.env.public`.

## DNS Cutover

1. Add `theactual.news` to the Cloudflare account if it is not already there.
2. Change nameservers at the registrar to the Cloudflare nameservers for the zone.
3. Wait until `pnpm domain:doctor` reports Cloudflare delegation.
4. Keep the public Worker healthy at the preview origin while DNS propagates.

## Worker Custom Domains

After DNS is delegated and `.env.public` is strict-ready:

```bash
pnpm cloudflare:build
pnpm --filter public-web exec wrangler deploy .open-next/worker.js --name the-actual-news-public --domain theactual.news
pnpm --filter public-web exec wrangler deploy .open-next/worker.js --name the-actual-news-public --domain www.theactual.news
```

Then prove the canonical origin:

```bash
PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://theactual.news pnpm launch:deployed
```

## What Remains Internal

Cloudflare account credentials, payment processor secrets, webhook signing secrets, email provider tokens, CRM tokens, database URLs, private audience exports, private sponsor notes, contracts, and banking details remain internal. The public app receives only hosted public URLs and keyless analytics configuration.
