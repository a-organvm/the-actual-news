---
title: "Session Close-Out - Records Watch Identity Transition"
description: "Comprehensive transition from 'The Actual News' to 'Records Watch' across source, docs, contracts, and tools."
generated: "2026-06-07T14:45:00Z"
repo: "/Users/4jp/Code/organvm/the-actual-news"
branch: "codex/phase1-identity-cutover"
irf: "IRF-III-059"
---

# Session Close-Out - Records Watch Identity Transition

## Accomplishments

Successfully executed the identity transition plan for **Records Watch** on **recordswatch.org**.

1.  **Platform Branding**: Updated 20+ UI pages, components, and libraries in `apps/public-web/src/` to use "Records Watch".
2.  **Domain Realignment**: Changed canonical domain defaults and examples from `theactual.news` to `recordswatch.org`.
3.  **Contract Refresh**: Updated all OpenAPI service titles (Gateway, Claim, Evidence, Story, Verification) to reflect the new identity.
4.  **Operational Tools**: Updated environment templates, domain auditors, and smoke test suites to use the new identity and domain.
5.  **Documentation**: Refreshed README.md, architecture docs, and launch guides.
6.  **Verification**: Confirmed all changes pass the full gate suite:
    - `pnpm lint`: Pass (36 warnings, 0 errors).
    - `pnpm typecheck`: Pass.
    - `pnpm test`: Pass (9 services + conformance).
    - `pnpm launch:check`: Pass (3 warnings for missing provider URLs).
    - `pnpm launch:local`: Pass (full standalone smoke).

## Current State

- **Branch**: `worktree-2026-06-07-14-15-20-108-ccnk` (aligned with `origin/codex/phase1-launch-cutover`).
- **Identity**: Records Watch (recordswatch.org).
- **Integrity**: Green (all local gates pass).

## Remaining Blockers (IRF-III-059)

The following external actions are required to complete the Phase 1 cutover:

1.  **Domain**: Secure `recordswatch.org` (or `recordswatch.news` as defensive alias).
2.  **DNS**: Delegate nameservers to Cloudflare.
3.  **Wrangler**: Update `wrangler.jsonc` with the final custom-domain binding.
4.  **Providers**: Configure hosted destinations for Newsletter, Membership, and Sponsors.
5.  **Strict Gate**: Run `PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict` after values are populated.

## Handoff Note

The repository is now fully "Records Watch" branded. All future work should use the new identity. The `pnpm launch:report` tool has refreshed `docs/public-launch-report.md` with the new status.
