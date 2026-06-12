---
title: "The Actual News Phase 1 Launch Cutover Plan"
description: "Phase 1 plan for joining the Phase 0.5 civic bundle work to the Cloudflare/domain launch surface tracked by IRF-III-059."
generated: "2026-06-07T13:55:00-04:00"
repo: "/Users/4jp/Code/organvm/the-actual-news"
branch: "codex/phase1-launch-cutover"
irf: "IRF-III-059"
---

# The Actual News Phase 1 Launch Cutover Plan

## Governing Item

IRF-III-059 remains the parent blocker: canonical launch cutover is not strict-ready until a public identity/domain is selected, delegated, bound to the Cloudflare Worker, provider URLs are configured, and deployed launch gates pass.

Phase 0.5 is complete and frozen in `../the-actual-news-phase05-complete`. This Phase 1 branch joins that civic-record-node bundle work to the current `origin/main` launch tooling so civic replay and public launch gates can be proven from one branch.

## Current Verified State

- Phase 0.5 fixture and civic bundle tools exist and parse.
- `origin/main` contains the Cloudflare/OpenNext launch surface: `pnpm launch:*`, `pnpm cloudflare:*`, `pnpm domain:doctor`, public/provider docs, `apps/public-web/wrangler.jsonc`.
- The Phase 0.5 branch was based before the launch surface and could not be used directly for cutover without dropping launch scripts.
- This branch preserves the `origin/main` launch commands and adds the civic bundle commands.
- External launch blockers remain outside this repo: registrar purchase/delegation, Cloudflare zone/custom domain binding, and hosted newsletter/membership/sponsor URLs.

## Public Identity Decision

Adopt the audit recommendation as the Phase 1 target unless the human overrides it:

- Product surface: `Records Watch`
- Canonical domain: `recordswatch.org`
- Defensive alias candidate: `recordswatch.news`

Rationale: `theactualnews.org` is an active separate product, and the audit found no Cloudflare zone for `theactual.news` or `recordswatch.org`. The repo must not claim strict canonical launch until the chosen domain is registered, delegated, bound, and proven.

## Work Plan

1. Preserve Phase 0.5.
   - Keep the detached worktree at `../the-actual-news-phase05-complete`.
   - Carry Phase 0.5 bundle fixtures, bundle tools, conformance test, closeout, and handoff into this launch-capable branch.

2. Restore command coherence.
   - Keep existing launch scripts from `origin/main`.
   - Add `civic:bundle:seed`, `civic:bundle:export`, `civic:bundle:replay`.
   - Keep `make up-public`, `make up-internal`, and add `make civic-seed`, `make civic-export`, `make civic-replay`.

3. Run local bundle verification.
   - Syntax: JSON/schema parse and `node -c` for bundle tools.
   - DB-backed: `make civic-seed`, `make civic-replay`, `make civic-export` when `POSTGRES_URI` is available.
   - If no local Postgres is running, record the blocker instead of faking success.

4. Run baseline repo verification.
   - `pnpm typecheck` - expected pre-existing gateway failure may remain until `@types/pg` is added or gateway typing is repaired.
   - `pnpm test` - expected pre-existing gateway no-test-files failure may remain.
   - `pnpm domain:doctor` - read-only current-state proof; expected to fail until DNS/provider setup is complete.
   - `pnpm launch:check` - non-strict public readiness proof.

5. External cutover steps after human/account work.
   - Register or assign `recordswatch.org`.
   - Add the zone to Cloudflare and delegate nameservers.
   - Set hosted public provider URLs for newsletter, membership, and sponsor destinations.
   - Update `.env.public` and `apps/public-web/wrangler.jsonc` with public-safe URLs only.
   - Run `PUBLIC_DOMAIN=recordswatch.org PUBLIC_WORKER_URL=https://the-actual-news-public.ivixivi.workers.dev pnpm domain:doctor`.
   - Run `PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict`.
   - Run `pnpm cloudflare:build`.
   - Deploy with Wrangler only after announcing the production-mutating step.
   - Prove with `pnpm cloudflare:smoke` and `PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://recordswatch.org pnpm launch:deployed`.

## Launch Gate Definition

Strict-ready means all of the following are true:

- `recordswatch.org` is delegated to Cloudflare nameservers.
- Apex and `www` are bound to the Cloudflare Worker.
- Worker `/api/healthz` is healthy.
- Newsletter, membership, and sponsor conversion URLs are hosted external provider destinations.
- No browser-exposed public env contains secrets or internal endpoints.
- Civic bundle replay passes from a clean database.
- Public route smoke passes on the deployed canonical origin.

## This Session's Target

This session can complete the repo-side merge and proof package. It cannot complete registrar purchase, Cloudflare account zone binding, or hosted provider creation without external account actions.

Deliverables for this session:

- Launch-capable branch with Phase 0.5 artifacts integrated.
- Verified command surface for civic bundle and launch gates.
- Current-state launch blockers documented with command output.
- IRF-III-059 updated with progress and remaining external blockers.
- New closeout artifact committed and pushed.
