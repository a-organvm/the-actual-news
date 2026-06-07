# The Actual News Persistence Audit

Face: internal

**Date:** 2026-06-07  
**Branch:** `codex/persistence-audit-2026-06-07`  
**Purpose:** hall-monitor audit, local-to-remote persistence, and add-only recovery of the 2026-06-06 full-suite closeout.

## Governing Finding

Nothing from the prior full-suite session appears lost, but the previous continuity receipts lived only in home scope:

- `/Users/4jp/.codex/plans/handoff-2026-06-06-the-actual-news-full-suite.md`
- `/Users/4jp/.codex/plans/closeout-2026-06-06-the-actual-news-full-suite.md`

This file makes that continuity repo-local and remote-pushable without overwriting the home artifacts.

## Verified State

- Original repo cwd started on `chore/issue-28-dependency-posture`, whose upstream branch is gone.
- Original repo cwd started dirty only with generated instruction shims: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`.
- That generated shim delta was preserved after this audit on remote branch `wip/preserve-2026-06-07-actual-news-generated-shims` at commit `2f09713`.
- Clean launch worktree before this audit was `/Users/4jp/.local/share/codex/worktrees/full-suite-ship-the-actual-news`.
- Clean launch worktree started at `9bc09a2`, aligned to `origin/main`.
- Live Worker responded on 2026-06-07: `https://the-actual-news-public.ivixivi.workers.dev/api/healthz` returned `ok: true` with `platform_id: plf_cloudflare_public_01`.
- Live feed responded on 2026-06-07: `/v1/feed?scope=local&state=published&limit=3` returned three published records; first record was `records-watch`.
- Cloudflare account read-only check found no `theactual.news` or `recordswatch.org` zone and no custom Worker domain for this app.
- `recordswatch.org` and `recordswatch.news` were available through Network Solutions on 2026-06-07, but neither was purchased.
- `theactualnews.org` is an active separate product, so the name-collision risk remains real.

## Vacuum Register

| Vacuum | Evidence | Disposition |
| --- | --- | --- |
| Canonical public domain not bound | `pnpm domain:doctor` fails DNS delegation for `theactual.news`; Cloudflare account has no matching zone. | Tracked as the canonical cutover blocker. |
| Hosted provider URLs missing | `pnpm domain:doctor` fails briefing/newsletter, membership, and sponsor provider configuration. | Must be filled with hosted external URLs, not same-origin fallbacks. |
| Repo-local receipt missing for 2026-06-06 closeout | Closeout was in `~/.codex/plans`, outside this repo. | This add-only audit file preserves the pointer in repo history. |
| Generated shim delta local-only | `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` were dirty in the stale original cwd. | Preserved on `origin/wip/preserve-2026-06-07-actual-news-generated-shims`; not mixed into the clean launch PR. |
| Seed and CLAUDE deployment descriptions stale | `seed.yaml` and `CLAUDE.md` still described Cloudflare Pages/static export as primary. | Updated in this branch to reflect Cloudflare Workers as the full public app path. |
| IRF item not specific enough | `IRF-OPS-092` tracks satellite dirtiness, but not the canonical domain/provider cutover. | Added `IRF-III-059` in corpvs branch `codex/irf-actual-news-cutover-2026-06-07`. |

## External Index Checklist

| Index | Result |
| --- | --- |
| IRF | P0/P1 checked. No working-domain P0 for this repo. New discovered cutover vacuum logged as `IRF-III-059` in corpvs branch `codex/irf-actual-news-cutover-2026-06-07`. |
| GitHub issues | No open issues in `a-organvm/the-actual-news`. Corpvs issue `a-organvm/organvm-corpvs-testamentvm#21` remains open and should not be closed until canonical launch is strict-ready. |
| Omega scorecard | `organvm omega status` reports 7/20 MET; this audit does not advance a criterion. |
| Inquiry log | Not SGO work; no inquiry-log update applicable. |
| Testament chain | No new production deploy occurred in this audit; no testament event emitted. |
| Concordance | `IRF-III-059` added to `docs/operations/concordance.md` in the corpvs branch. |
| Registry | No new repo or ownership/status edge introduced; repo `seed.yaml` updated instead. |
| Seed contract | Updated in this branch: deployment platform is Cloudflare Workers; Pages is secondary media-kit preview. |
| CLAUDE.md | Updated in this branch: OpenNext/Wrangler Worker path and launch commands are now explicit. |
| Companion indices | No Locorum/Nominum/Rerum companion index exists for this exact cutover yet; no new companion IDs introduced. |

## Add-Only Rule

No continuity artifact was overwritten. The recovery pattern used here is:

1. Preserve the original local receipts.
2. Add a repo-local pointer/proof artifact.
3. Push the repo-local branch to origin.
4. Let later audit/merge policy decide placement.

That satisfies the intended `local:remote = 1:1` persistence rule without destroying local evidence or pretending the canonical launch is complete.

## Next Required Action

The next operator must decide the public identity/domain before code cutover. Current strongest candidate remains:

- Product: `Records Watch`
- Canonical domain: `recordswatch.org`
- Defensive alias candidate: `recordswatch.news`

After that decision: add/bind the Cloudflare zone, configure hosted provider URLs, update canonical URL defaults, deploy, and rerun `pnpm launch:local`, `pnpm cloudflare:build`, `pnpm cloudflare:deploy`, `pnpm cloudflare:smoke`, `pnpm domain:doctor`, and the strict deployed launch gate.
