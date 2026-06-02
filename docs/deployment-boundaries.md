# Public and Internal Deployment Boundaries

The Actual News has two deployment surfaces:

1. **Public surface**: the reader-facing Next.js app and the reader-safe gateway endpoints it calls.
2. **Internal surface**: the database, reviewer workspace, ingestion services, model gateway, blob storage, service credentials, and operational queues.

## Cloudflare Public Worker

The full public app deploys to Cloudflare Workers through OpenNext. This is the preferred Cloudflare path for the dynamic Next.js surface because it preserves API routes, generated feeds, redirects, dynamic JSON artifacts, and generated social-card SVGs without requiring Docker.

The Worker is configured by:

- `apps/public-web/wrangler.jsonc`
- `apps/public-web/open-next.config.ts`
- `@opennextjs/cloudflare`
- `wrangler`

Current public Worker origin:

```text
https://the-actual-news-public.ivixivi.workers.dev
```

Public Worker deploy commands:

```bash
pnpm cloudflare:build
pnpm cloudflare:preview
PUBLIC_WEB_BASE_URL=http://127.0.0.1:8787 pnpm smoke:public
pnpm cloudflare:deploy
pnpm cloudflare:smoke
```

Only `NEXT_PUBLIC_*` values belong in `wrangler.jsonc`. These are browser-visible by design and must remain public-safe. Revenue provider URLs may be added there only after they point to real hosted provider destinations outside the public app fallback routes.

Provider URLs in `wrangler.jsonc` are not secrets; they are public hosted signup, checkout, and sponsor-intake destinations. Provider API keys, webhook signing secrets, CRM tokens, payment keys, private sponsor notes, and fulfillment credentials stay in provider dashboards or internal services.

The Cloudflare Pages project `the-actual-news` may host a static media-kit preview for partner sharing, but it is not the full application deployment target.

## Optional Public Container

Docker is optional. The public web app can deploy directly to a managed Next.js host from the same browser-safe environment boundary. When Docker is useful, build and run the public web app with:

```bash
make up-public
```

The public container is defined by:

- `apps/public-web/Dockerfile`
- `infra/docker-compose.public.yml`
- `.env.public.example`
- `.dockerignore`

Only `NEXT_PUBLIC_*` values belong in the public web app. These values are browser-visible by design:

| Variable | Purpose | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_PLATFORM_ID` | Public platform identifier for display/debugging | No |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin for metadata and sitemap output | No |
| `NEXT_PUBLIC_SITE_TITLE` | Browser/search/social title | No |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Browser/search/social description | No |
| `NEXT_PUBLIC_PUBLIC_API_URI` | Reader-safe gateway base URL | No |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Optional privacy-safe analytics domain, for example Plausible | No |
| `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` | Optional analytics script URL; defaults to Plausible's public script | No |
| `NEXT_PUBLIC_NEWSLETTER_URL` | Newsletter subscription URL | No |
| `NEXT_PUBLIC_MEMBERSHIP_URL` | Membership/payment landing URL | No |
| `NEXT_PUBLIC_SPONSOR_URL` | Sponsorship inquiry URL | No |
| `NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE` | Enables reviewer UI in non-public deployments | No, but keep `false` publicly |

Public deployments should expose only:

- `GET /v1/feed`
- `GET /v1/story/:story_id`
- static/public web assets
- `GET /sitemap.xml`
- `GET /robots.txt`
- `GET /feed.xml`
- `GET /feed.json`
- `GET /api/healthz`
- `GET /go/briefing`
- `GET /go/membership`
- `GET /go/sponsor`
- `GET /briefing`
- `GET /membership`
- `GET /sponsor`
- `GET /sponsors`
- `GET /sponsors.json`
- `GET /campaigns.json`
- `GET /distribution`
- `GET /launch`
- `GET /launch.json`
- `GET /media-kit`
- `GET /media-kit.json`
- `GET /runbook.json`
- `GET /provider-handoff.json`
- `GET /provider-pages`
- `GET /share-kit.json`
- `GET /v1/feed`
- `GET /v1/story/:story_id`
- newsletter, membership, and sponsor links hosted by their providers

The public container includes a health check against `/api/healthz`. The response intentionally contains only public, browser-safe configuration status and growth capability flags. Internal service containers include health checks against `/v1/health`; Postgres uses `pg_isready`.

Public responses include security headers for content-type sniffing, framing, referrer policy, browser permissions, CSP, HSTS, and cross-origin opener policy. They also include browser-safe JSON-LD for the public organization, website, articles, clips, and offer pages. The launch smoke gate verifies the core headers, structured-data markers, and scans response bodies for secret-like values and internal configuration names.

The `/launch` route is a reader-safe readiness ledger for the public surface. It may show configured/not-configured status and public URLs, but it must not show internal hostnames, database URLs, tokens, webhook secrets, or service credentials.

The `/launch.json` route is the automation-safe equivalent for distribution systems. It can expose ready counts, growth capability flags, public routes, feed URLs, atom share packets, public offer packets, conversion steps, conversion route status, public campaign packets, media-kit data, public analytics event names, and internal-boundary warnings. The `/runbook.json` route can expose public launch steps, commands, blockers, artifact links, and boundary notes. The `/share-kit.json` route is the narrower social/POSSE sharing packet and can expose public launch copy, tracked public routes, atoms, social-card paths, share packets, campaign packets, media-kit data, offer packets, conversion steps, and boundary warnings. The `/provider-handoff.json` route can expose hosted provider setup copy, fields, UTM parameter names, acceptance criteria, provider configured booleans, and boundary warnings. The `/provider-pages` route can render that provider setup packet for human partner/operator setup. The `/campaigns.json` route can expose campaign copy, cadence, public tracked paths, content ids, conversion targets, and public boundary warnings. The `/media-kit.json` route can expose public positioning, proof points, press copy, public asset links, sponsor-safe boundary notes, and public boundary warnings. The `/sponsors.json` route can expose disclosure-ready sponsor status, accepted sponsor disclosures, sponsor lanes, and firewall rules. These routes may not expose secrets, internal network names, reviewer queues, user identifiers, private traffic dashboards, private audience exports, private sponsor notes, contracts, banking details, ad account credentials, or raw operational configuration.

The `/go/*` conversion routes are public and stable. They preserve attribution parameters and redirect only to configured public hosted provider URLs; until then, they fall back to local offer pages. They must not proxy private payment, email, CRM, or webhook operations.

The configured provider URLs must be hosted destinations, not same-origin app routes. `NEXT_PUBLIC_NEWSLETTER_URL`, `NEXT_PUBLIC_MEMBERSHIP_URL`, and `NEXT_PUBLIC_SPONSOR_URL` should not point to `/briefing`, `/membership`, `/sponsor`, `/sponsors`, `/media-kit`, `/provider-pages`, `/go/*`, `/api/*`, `/v1/*`, `/runbook.json`, `/share-kit.json`, `/provider-handoff.json`, `/campaigns.json`, `/media-kit.json`, or `/sponsors.json` on the public site.

The public app may serve the initial reader-safe API from the same origin at `/v1/feed` and `/v1/story/:story_id`. Those routes must expose only published public story bundles and must not expose draft content, reviewer assignments, ingestion state, database details, or internal service topology.

The CI public launch job uploads public launch reports for the default env and the strict generated public env template. The CI container build job validates this public image without pushing it, but it is non-blocking. Local Docker is optional for frontend iteration and not required for deploying the public app to a managed platform.

## Optional Internal Containers

Internal services should run on a private network with secrets supplied by the deployment environment. When Docker is useful locally or for packaging, build and run the internal stack with:

```bash
make up-internal
```

The internal stack is defined by:

- `services/Dockerfile`
- `infra/docker-compose.internal.yml`
- `.env.internal.example`
- `.dockerignore`

The optional internal compose file binds the gateway and service ports to `127.0.0.1` by default for local development. Production should place these services on a private network and expose only the intended public edge. Generated runtime state such as `data/` and local database volumes such as `postgres-data/` are excluded from Docker build contexts.

Keep these values internal and replace examples with real secrets in your deployment secret manager:

| Variable | Purpose | Secret? |
| --- | --- | --- |
| `POSTGRES_PASSWORD` | Database password | Yes |
| `POSTGRES_URI` | Database connection string | Yes |
| `EVIDENCE_BLOB_STORE_ACCESS_KEY` | Blob storage access key | Yes |
| `EVIDENCE_BLOB_STORE_SECRET_KEY` | Blob storage secret key | Yes |
| `MODEL_GATEWAY_URI` | Internal model gateway endpoint | Internal |
| `EVENT_BUS_URI` | Event bus connection string | Yes |

Internal services bind to localhost for local development, but production should place them on a private network behind the gateway.

## Audience and Revenue Configuration

The public app supports three revenue/audience loops without embedding provider secrets:

- `NEXT_PUBLIC_NEWSLETTER_URL`: hosted newsletter form or landing page
- `NEXT_PUBLIC_MEMBERSHIP_URL`: hosted Stripe Checkout, Patreon, OpenCollective, or custom membership page
- `NEXT_PUBLIC_SPONSOR_URL`: sponsor inquiry form or CRM intake URL

Payment processor keys, email provider API keys, CRM tokens, webhook signing secrets, and fulfillment credentials must stay server-side. The browser gets links, not credentials.

Public analytics should stay privacy-safe and keyless. The app can load a Plausible-style script when `NEXT_PUBLIC_ANALYTICS_DOMAIN` is set to the public site host, and `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` must remain on the CSP-allowed Plausible browser script URL. Share/conversion links carry UTM parameters so growth can be measured in hosted analytics, newsletters, payment pages, and CRM forms without exposing private tokens.

The public app emits only high-level browser events such as `Hero CTA`, `Revenue CTA`, `Revenue Detail`, and `Atom Share`. Event props are labels, channels, campaigns, atom IDs, and publication states; they must not include user identifiers, tokens, reviewer data, or internal hostnames.

Current public offer packaging is intentionally descriptive and keyless:

- Membership: Reader `$5/mo`, Sustainer `$15/mo`, Founding Press `$50/mo`
- Briefing: Morning cry `Free`, Weekly docket `Member-backed`, Breaking ledger `Launch lane`
- Sponsorship: Records Watch `$500/mo`, Civic Data `$1,500/mo`, Investigation Pool `$5,000/mo`

When real payment/newsletter/CRM providers are selected, keep the app's offer pages as the public copy layer and point their `NEXT_PUBLIC_*_URL` values to hosted provider pages. Do not point those variables back to the public app's fallback routes, and do not embed provider secrets in the public app.

See `docs/revenue-provider-onboarding.md` and `/provider-pages` for the provider setup checklist and the exact public/internal split for hosted checkout, newsletter, and CRM intake pages.

Use the launch readiness checker to make provider gaps explicit:

```bash
pnpm public-env:template > .env.public
pnpm launch:local
pnpm launch:report
pnpm launch:check
pnpm domain:doctor
pnpm container:check
pnpm launch:smoke
PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict
PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://theactual.news pnpm launch:deployed
```

See `docs/public-launch-checklist.md` for the public launch gate.

## Verifier Workspace

The verifier routes exist so the same app can be used in authenticated internal deployments, but they are disabled by default:

```env
NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE=false
```

Only set this to `true` behind authentication and a private network. Public readers should see the verification spine for published stories, not internal task assignment or review submission workflows.
