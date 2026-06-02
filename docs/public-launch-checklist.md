# Public Launch Checklist

This checklist is the public-facing launch gate for The Actual News. It separates reader-visible configuration from internal credentials and keeps revenue/audience setup explicit.

## Launch Readiness Command

Run the non-strict readiness report while iterating:

```bash
pnpm launch:check
```

Run the required no-Docker local gate before deployment:

```bash
pnpm launch:local
```

Generate or refresh the operator handoff:

```bash
pnpm launch:report
```

Run strict mode before deploying a public domain:

```bash
PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict
```

After deployment, prove the live public origin:

```bash
PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://theactual.news pnpm launch:deployed
```

For the current Cloudflare Workers preview origin, prove the full dynamic public app without requiring final provider URLs:

```bash
pnpm cloudflare:build
pnpm cloudflare:preview
PUBLIC_WEB_BASE_URL=http://127.0.0.1:8787 pnpm smoke:public
pnpm cloudflare:deploy
pnpm cloudflare:smoke
```

Generate a public-only env template with:

```bash
pnpm public-env:template > .env.public
```

Or prefill known public values without exposing secrets:

```bash
PUBLIC_SITE_URL=https://theactual.news \
PUBLIC_API_URL=https://api.theactual.news \
NEWSLETTER_URL=https://newsletter-provider.example/form \
MEMBERSHIP_URL=https://membership-provider.example/the-actual-news \
SPONSOR_URL=https://crm-provider.example/sponsor-intake \
ANALYTICS_DOMAIN=theactual.news \
pnpm public-env:template > .env.public
```

Replace the provider example hosts with real hosted provider URLs before strict launch checks. The strict checker rejects blank, local, placeholder example hosts, and same-origin public app fallback routes such as `/briefing`, `/membership`, `/sponsor`, `/media-kit`, `/go/*`, `/api/*`, and `/v1/*`.

Strict mode expects real public URLs for:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_PUBLIC_API_URI`
- `NEXT_PUBLIC_NEWSLETTER_URL`
- `NEXT_PUBLIC_MEMBERSHIP_URL`
- `NEXT_PUBLIC_SPONSOR_URL`
- `NEXT_PUBLIC_ANALYTICS_DOMAIN`

It also requires `NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE=false` and scans the public env file for obvious credential values.

## CI Gates

The `Public Launch Gates` workflow runs the launch-critical checks on pull requests and pushes:

- `pnpm env:check`
- `pnpm public-source:check`
- `pnpm launch:local`, including standalone route smoke and conversion redirect boundary smoke
- strict launch checking against a generated public-only env template
- `pnpm -r test` against an ephemeral Postgres service

It uploads two report artifacts:

- `public-launch-report-default`: current default/example-env blocker report
- `public-launch-report-strict-template`: report generated from the strict public env template used in CI

Local `pnpm -r test` still requires `POSTGRES_URI` because the conformance harness is intentionally database-backed.

The workflow also has an optional, non-blocking container build job for the public web image and each internal service image. Docker image builds are packaging validation only; they are not required for frontend work or for deploying to a managed platform.

Run `pnpm container:check` to audit optional Dockerfile and compose boundaries without installing Docker.
Run `pnpm conformance:doctor` before local conformance to verify both the `psql` client and `POSTGRES_URI`. The conformance harness creates isolated temporary schemas for its fixtures; `bash tools/migrate.sh` is still required when validating the application ledger schema itself.

The public smoke gate verifies response hardening headers on every launch-critical route:

- `Content-Security-Policy`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `X-Frame-Options`
- `Permissions-Policy`

It also scans route bodies for credential-like values and internal configuration names such as database URLs, private keys, service tokens, model gateway config, event bus config, and blob-store access keys.

The public smoke gate also verifies browser-safe JSON-LD structured data:

- `NewsMediaOrganization` and `WebSite` metadata on public pages
- `NewsArticle` metadata on story and clipping pages
- `Product`/`Offer` metadata on briefing, membership, and sponsor pages

The public source boundary gate verifies public-web source reads only approved browser-safe `process.env` keys and does not reference internal-only env names such as database, event bus, blob-store, model gateway, or verifier-service endpoints.

The conversion smoke gate verifies both revenue states:

- same-origin fallback provider URLs stay pending and redirect back to local offer pages
- hosted provider URLs mark health and launch JSON ready
- `/go/*` redirects preserve UTM parameters when sending readers to hosted provider destinations

## Public Surface

The reader-facing app should expose:

- `/` newspaper-style public front page
- `/membership` member conversion page
- `/briefing` audience capture page
- `/sponsor` sponsorship page
- `/sponsors` public sponsor disclosure registry and firewall page
- `/sponsors.json` public-safe machine-readable sponsor disclosure registry
- `/principles` public editorial firewall, funding boundary, and internal-boundary principles
- `/distribution` share copy, feed, and conversion launch kit
- `/campaigns.json` public-safe machine-readable campaign queue for recurring atom, briefing, membership, and sponsor distribution
- `/launch` public-safe launch readiness ledger and operator index for launch/share/feed artifacts
- `/launch.json` public-safe machine-readable launch/distribution manifest with growth capability flags, atom share packets, public offer packets, and conversion steps
- `/media-kit` public positioning, proof points, press copy, sponsor-safe boundary notes, and public asset links for press, partners, and sponsors
- `/media-kit.json` public-safe machine-readable media kit for distribution automation
- `/runbook.json` public-safe machine-readable launch runbook with operator steps, commands, blockers, and internal-boundary notes
- `/provider-handoff.json` public-safe machine-readable provider page handoff with copy, fields, attribution, acceptance criteria, and internal-boundary warnings
- `/share-kit.json` public-safe machine-readable share packet for social/POSSE automation with launch copy, atom packets, campaign packets, offer packets, and conversion steps
- `/go/briefing`, `/go/membership`, `/go/sponsor` stable conversion redirects
- `/v1/feed`, `/v1/story/:story_id` reader-safe public API routes
- `/clip/[clip_id]` shareable clipping pages for atomic modules
- `/api/social-card.svg` generated social preview cards
- `/feed.xml` RSS feed
- `/feed.json` JSON Feed
- `/sitemap.xml` with front page, offer pages, `/go/*`, media kit, clip URLs, story URLs, and public JSON artifacts
- `/robots.txt` with sitemap, RSS, JSON Feed, distribution kit, launch manifest, launch runbook, share kit, provider handoff, campaigns, media kit, sponsor registry, and health pointers
- `/api/healthz`

Verify local or deployed routes with:

```bash
PUBLIC_WEB_BASE_URL=http://127.0.0.1:3000 pnpm smoke:public
```

Verify the production standalone artifact without relying on an existing dev server:

```bash
pnpm launch:smoke
```

For a deployed origin:

```bash
PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://theactual.news pnpm launch:deployed
```

`pnpm launch:deployed` wraps strict public env validation and the deployed route smoke test. It rejects local, placeholder, and non-HTTPS origins and requires `PUBLIC_WEB_BASE_URL` to match `NEXT_PUBLIC_SITE_URL`.
Because strict mode requires hosted provider URLs, the deployed smoke runs with conversions expected to be configured and verifies `/go/*` redirects rather than pending fallback pages.

## Revenue And Audience Setup

Use hosted providers and put only their public landing URLs in the public environment:

- Newsletter: hosted form or newsletter landing page.
- Membership: hosted checkout, Patreon, OpenCollective, or member page.
- Sponsor: hosted sponsor inquiry or CRM intake form.

Do not put payment processor keys, webhook secrets, email provider tokens, CRM tokens, database URLs, or service credentials in `NEXT_PUBLIC_*`.

CTA and share clicks are instrumented only through a keyless, Plausible-compatible browser hook when `NEXT_PUBLIC_ANALYTICS_DOMAIN` is configured. `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` must remain on the CSP-allowed Plausible browser script URL. The links also carry UTM parameters so hosted provider pages can attribute newsletter, membership, and sponsor conversions without exposing private API credentials.

Use the stable `/go/*` routes in public distribution copy. They redirect to hosted provider URLs after `NEXT_PUBLIC_NEWSLETTER_URL`, `NEXT_PUBLIC_MEMBERSHIP_URL`, and `NEXT_PUBLIC_SPONSOR_URL` are configured, and otherwise fall back to the local public offer pages.

Do not set those environment variables to `/go/*` routes or to the app's own `/briefing`, `/membership`, or `/sponsor` pages. They must point to hosted provider destinations such as newsletter signup, checkout, membership, or CRM intake pages.

Use `docs/revenue-provider-onboarding.md` as the operator checklist for creating those hosted destinations and keeping provider secrets internal.
Use `docs/provider-page-specs.md` as the copy-and-field spec for the hosted newsletter, membership, and sponsor provider pages.
Use `/provider-handoff.json` as the public-safe machine-readable version of the provider setup packet.
Use `/runbook.json` as the public-safe machine-readable operator runbook for launch steps, commands, blockers, and artifact links.
Use `/campaigns.json` as the public-safe campaign queue for recurring atom pushes, briefing capture, membership asks, and sponsor outreach.
Use `/media-kit` and `/media-kit.json` as public-safe positioning, proof point, press copy, and partner/sponsor outreach material.
Use `/sponsors` and `/sponsors.json` as the public sponsor disclosure registry before accepting sponsor money.

## Internal Boundary

Keep the following in the internal environment or deployment secret manager:

- `POSTGRES_URI`
- `POSTGRES_PASSWORD`
- blob store access keys
- model gateway URLs and credentials
- event bus credentials
- webhook signing secrets
- email, payment, and CRM API tokens

The public app can link to hosted provider pages. It should not process private payment, email, CRM, or verification operations in the browser.

## Public Readiness Page

The `/launch` route renders the current public readiness state from browser-safe environment variables and links operators to `/launch.json`, `/runbook.json`, `/share-kit.json`, `/provider-handoff.json`, `/campaigns.json`, `/distribution`, and feed endpoints. It is intentionally safe to expose because it reports only public URLs, configured/not-configured status, artifact links, and high-level boundary categories. It must not include connection strings, tokens, secret names, or operational credentials.

The `/launch.json` route exposes the same launch state for automation. Distribution jobs may consume it for growth capability flags, public routes, feeds, atom share packets, public offer packets, conversion steps, conversion route status, campaign packets, media-kit data, and public event names. `/runbook.json` exposes public launch steps, commands, blockers, artifact links, and internal-boundary notes. `/share-kit.json` exposes the narrower public sharing packet for social/POSSE automation: launch copy, tracked public routes, atoms, share packets, social-card paths, campaign packets, media-kit data, offer packets, and conversion steps. `/provider-handoff.json` exposes the provider setup packets for hosted newsletter, membership, and sponsor pages: public copy, fields, UTM parameter names, acceptance criteria, and internal-boundary warnings. `/campaigns.json` exposes recurring public campaign packets with copy, cadence, channel, tracked path, content id, and conversion target. `/media-kit.json` exposes public positioning, proof points, press copy, public asset links, and boundary warnings. `/sponsors.json` exposes disclosure-ready sponsor status, public sponsor lanes, and firewall rules. These routes must stay browser-safe and must not include internal hostnames, database URLs, credentials, reviewer queues, private traffic dashboards, private audience exports, private sponsor notes, contracts, banking details, or user data.

## Docker Position

Docker is not required for the public website. It is optional for local frontend work and useful only as a deployment artifact because the public reader app and internal services can be built and run as separate surfaces:

```bash
make up-public
make up-internal
```

If the production platform is Vercel, Cloudflare, Render, Fly, or another managed host, keep the Docker files as portability artifacts and deploy from the same public/internal env boundary. For Cloudflare, the full dynamic Next.js app deploys through OpenNext to Workers; the static Cloudflare Pages media-kit preview is useful for partner sharing but is not the complete app surface.

CI builds the container images without pushing them in a non-blocking job. The build job exists to catch packaging drift and prove the public image and internal service images can be produced from checked-in source without adding local secrets to the image context.
