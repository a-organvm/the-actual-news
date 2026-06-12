# Public Launch Report

Generated: 2026-06-07T14:50:48.690Z

Environment source: `.env.public.example`

## Verdict

Public launch is not strict-ready. 3 blocker(s) remain.

## Readiness

| Area | Status | Required action |
| --- | --- | --- |
| Canonical public site | PASS | No action. |
| Reader-safe public API | PASS | No action. |
| Newsletter capture | BLOCKED | Set NEXT_PUBLIC_NEWSLETTER_URL to a hosted signup page outside this app's fallback routes. |
| Membership revenue | BLOCKED | Set NEXT_PUBLIC_MEMBERSHIP_URL to hosted checkout or membership page outside this app's fallback routes. |
| Sponsor revenue | BLOCKED | Set NEXT_PUBLIC_SPONSOR_URL to hosted sponsor intake outside this app's fallback routes. |
| Audience analytics | PASS | No action. |
| Analytics script | PASS | No action. |
| Verifier boundary | PASS | No action. |

## Public Surface

These routes are public-safe and covered by the public smoke gate:

- `/`
- `/briefing`
- `/campaigns.json`
- `/clip/:clip_id`
- `/distribution`
- `/feed.json`
- `/feed.xml`
- `/go/briefing`
- `/go/membership`
- `/go/sponsor`
- `/launch`
- `/launch.json`
- `/media-kit`
- `/media-kit.json`
- `/membership`
- `/principles`
- `/provider-handoff.json`
- `/provider-pages`
- `/runbook.json`
- `/share-kit.json`
- `/sponsor`
- `/sponsors`
- `/sponsors.json`
- `/story/:story_id`
- `/v1/feed`
- `/v1/story/:story_id`
- `/verify`

## Current Cloudflare Deployment

- Full dynamic public app Worker: `https://the-actual-news-public.ivixivi.workers.dev`
- Partner-shareable static media-kit Pages preview: `https://the-actual-news.pages.dev/media-kit/`
- Worker smoke command: `pnpm cloudflare:smoke`
- Worker build/deploy commands: `pnpm cloudflare:build`, `pnpm cloudflare:preview`, `pnpm cloudflare:deploy`
- Final custom-domain gate remains: `PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://recordswatch.org pnpm launch:deployed`

## Audience And Revenue

- Stable distribution URLs: `/go/briefing`, `/go/membership`, `/go/sponsor`
- Growth capability flags in `/api/healthz` and `/launch.json`: share packets, share kit, provider handoff, campaign packets, media kit, sponsor registry, offer packets, structured data, feeds, and conversion routes
- Public readiness ledger: `/launch` links operators to `/launch.json`, `/runbook.json`, `/share-kit.json`, `/provider-handoff.json`, `/provider-pages`, `/campaigns.json`, `/media-kit`, `/distribution`, and feed endpoints
- Public principles: `/principles` explains the editorial firewall, funding boundary, and public/internal separation
- Sponsor registry: `/sponsors` and `/sponsors.json` expose disclosure-ready sponsor status, sponsor lanes, and firewall rules
- Media kit: `/media-kit` and `/media-kit.json` expose public positioning, proof points, press copy, and sponsor-safe boundary notes
- Install metadata: `/site.webmanifest` and `/icon.svg` provide public-safe branded install/bookmark assets and shortcuts
- Discoverability endpoints: `/sitemap.xml` includes public offer, conversion, clip, story, sponsor registry, media-kit, share-kit, provider-handoff, provider-pages, and campaign URLs; `/robots.txt` advertises sitemap, RSS, JSON Feed, distribution kit, launch manifest, share kit, provider handoff, provider pages, campaigns, media kit, sponsor registry, and health
- Atom share packets in `/distribution` and `/launch.json`: clip URL, story URL, social-card URL, X share URL, LinkedIn share URL, and email share URL
- Viral entry pages: public clip and story pages expose X, LinkedIn, email, card, copy URL, and copy text controls
- Copy-ready distribution controls: `/distribution` exposes copy buttons for launch copy, public route URLs, atom URLs, atom text, and offer packets
- Machine-readable share kit: `/share-kit.json` exposes public launch copy, routes, atoms, campaign packets, offer packets, and the internal boundary for social automation
- Machine-readable media kit: `/media-kit.json` exposes public positioning, proof points, press copy, public assets, sponsor-safe notes, and the internal boundary for press, partner, and sponsor outreach
- Machine-readable provider handoff: `/provider-handoff.json` exposes public provider page copy, fields, attribution parameters, acceptance criteria, and internal-boundary warnings
- Human-readable provider pages: `/provider-pages` exposes copy-ready setup packets for newsletter, membership, and sponsor providers without publishing provider credentials or private records
- Machine-readable launch runbook: `/runbook.json` exposes operator steps, public commands, blockers, and boundary notes
- Machine-readable campaign kit: `/campaigns.json` exposes recurring public campaign packets for atom, briefing, membership, and sponsor distribution
- Machine-readable sponsor registry: `/sponsors.json` exposes disclosure-ready sponsor status, sponsor lanes, firewall rules, and public/internal boundary warnings
- Public offer packets in `/distribution`, `/launch.json`, and `/share-kit.json`: briefing, membership, and sponsor copy with public package/pricing summaries and conversion steps
- Browser-safe JSON-LD: public organization, website, story/article, clipping, and offer metadata
- Provider URLs belong in `NEXT_PUBLIC_NEWSLETTER_URL`, `NEXT_PUBLIC_MEMBERSHIP_URL`, and `NEXT_PUBLIC_SPONSOR_URL`
- Provider setup checklist: `docs/revenue-provider-onboarding.md`
- Provider page copy, fields, attribution, and acceptance criteria: `docs/provider-page-specs.md`
- Provider API keys, webhook secrets, CRM tokens, payment keys, and email-service credentials stay internal
- Sponsor CRM records, private sponsor notes, contracts, banking details, and payment credentials stay internal
- Public events: `Hero CTA`, `Revenue CTA`, `Revenue Detail`, `Atom Share`

## Public/Internal Boundary

Public configuration may contain only browser-safe URLs, display strings, booleans, and keyless analytics settings.

Internal-only values include:

- `POSTGRES_URI`
- `POSTGRES_PASSWORD`
- blob-store access keys
- model gateway configuration
- event bus credentials
- payment, email, CRM, and webhook secrets
- reviewer queues and task-assignment operations

## Required Commands

```bash
PUBLIC_SITE_URL=https://recordswatch.org PUBLIC_API_URL=https://recordswatch.org ANALYTICS_DOMAIN=recordswatch.org pnpm public-env:template > .env.public
pnpm launch:local
PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict
pnpm cloudflare:build
pnpm cloudflare:preview
PUBLIC_WEB_BASE_URL=http://127.0.0.1:8787 pnpm smoke:public
pnpm cloudflare:deploy
pnpm cloudflare:smoke
PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://recordswatch.org pnpm launch:deployed
pnpm conformance:doctor
bash tools/migrate.sh
pnpm conformance:test
```

## Notes

- Docker is optional for local public-web work and managed deployment.
- `pnpm container:check` audits optional Docker boundary files without Docker installed.
- DB-backed conformance requires `POSTGRES_URI` and a reachable PostgreSQL database.
