---
title: "Session Close-Out - The Actual News Phase 1 Launch"
description: "Closeout summary for Phase 0.5 preservation, launch-branch integration, civic bundle verification, and current launch blockers."
generated: "2026-06-07T09:45:04-04:00"
repo: "/Users/4jp/Code/organvm/the-actual-news"
branch: "codex/phase1-launch-cutover"
irf: "IRF-III-059"
---

# Session Close-Out - 2026-06-07 (Phase 1 Launch)

## Outputs

- Created frozen Phase 0.5 worktree at `../the-actual-news-phase05-complete`.
  - The exact requested command could not be used because `wip/preserve-2026-06-07-actual-news-generated-shims` was already checked out in the main worktree.
  - Fallback used: detached worktree at `918184e`.
- Created launch-capable branch `codex/phase1-launch-cutover` from `origin/main`.
- Integrated Phase 0.5 civic bundle artifacts onto the launch-capable branch without dropping Cloudflare/domain launch scripts.
- Added `.codex/plans/2026-06-07-actual-news-phase1-launch.md`.
- Carried forward Phase 0.5 closeout and handoff prompt into repo-local history.
- Fixed Phase 0.5 tool issues found during verification:
  - Makefile recursive env declarations blocked make targets.
  - `tools/civic-bundle` was missing from `pnpm-workspace.yaml`.
  - `tools/conformance/sql/schema.sql` omitted actors, COI disclosures, verification tasks, and reviews.
  - Civic CLI arg parsing skipped real args.
  - `make civic-export` lacked default story/schema values.
  - Export dropped platform actors/COI disclosures.
  - Fixture expected gate metrics did not match gate logic.
- Updated IRF-III-059 in corpvs branch `codex/irf-actual-news-phase1-2026-06-07` with Phase 1 repo-side progress.

## Verification

- `pnpm install --frozen-lockfile` passed.
- JSON/schema syntax passed:
  - `fixtures/civic-record-node/civic-council-budget-amendment.json`
  - `fixtures/civic-record-node/bundle-manifest.schema.json`
- Node syntax passed:
  - `tools/civic-bundle/seed.mjs`
  - `tools/civic-bundle/export.mjs`
  - `tools/civic-bundle/replay.mjs`
  - `tools/conformance/run.mjs`
- Local Postgres proof passed with `POSTGRES_URI=postgres://news:news@127.0.0.1:5432/news_ledger?sslmode=disable`.
- `make civic-seed` passed.
- `make civic-replay` passed: 10/10 invariants, gate metrics match, publish transaction passed.
- `make civic-export` passed: 6 claims, 4 evidence objects, 7 edges, 1 correction, gate pass true.
- Temp export inspection confirmed 3 actors, 1 COI disclosure, 2 verification tasks, 1 review.
- `pnpm typecheck` passed.
- `pnpm test` passed, including `CT-BUNDLE-01`.
- `pnpm launch:check` passed with 0 failures and 3 warnings for blank provider URLs.
- `pnpm launch:local` passed.
- `pnpm cloudflare:build` passed.
- `pnpm cloudflare:smoke` passed against `https://the-actual-news-public.ivixivi.workers.dev`.
- `pnpm domain:doctor` failed as expected for `theactual.news`: DNS not delegated to Cloudflare and provider URLs missing.
- `PUBLIC_DOMAIN=recordswatch.org PUBLIC_WORKER_URL=https://the-actual-news-public.ivixivi.workers.dev pnpm domain:doctor` failed as expected: no published DNS records and provider URLs missing.

## Not Done

- No production deploy was run.
- No custom domain was bound.
- No registrar, Cloudflare zone, newsletter, membership, or sponsor provider account was mutated.

Reason: IRF-III-059 still has external blockers. Strict launch requires human/account action for product/domain decision, domain registration/delegation, Cloudflare zone/custom-domain binding, and hosted provider URLs.

## Pending

- Decide or confirm the public identity target.
  - Current recommendation remains `Records Watch` on `recordswatch.org` unless the human overrides it.
- Register/delegate/bind the chosen domain.
- Create hosted newsletter, membership, and sponsor provider URLs.
- Update public-safe env and `apps/public-web/wrangler.jsonc` after provider URLs exist.
- Run strict gates:
  - `PUBLIC_DOMAIN=recordswatch.org PUBLIC_WORKER_URL=https://the-actual-news-public.ivixivi.workers.dev pnpm domain:doctor`
  - `PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict`
  - `PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://recordswatch.org pnpm launch:deployed`
- Only then announce and run production-mutating Wrangler deploy commands.

## Hand-Off Note

Resume from `codex/phase1-launch-cutover`. The repo-side launch surface and civic bundle proof are now joined and green. The remaining cutover is not a coding mystery; it is external domain/provider setup plus strict deployed proof.
