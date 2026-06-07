# Agent Handoff: Phase 1 Identity Cutover (Records Watch)

**From:** Session S-2026-06-07-records-watch-cutover | **Date:** 2026-06-07 | **Phase:** PROVE

## Current State
- **Branch**: `worktree-2026-06-07-14-15-20-108-ccnk` (Local:Remote = 1:1, pushed to `origin/codex/phase1-identity-cutover`).
- **Identity**: 100% transition to **Records Watch** (recordswatch.org) confirmed via global grep.
- **Narrative**: Pitch deck vacuums (Problem, Approach, Business Model) filled with concrete logic.
- **Integrity**: All local verification gates pass (Lint, Typecheck, Conformance Tests, Standalone Smoke).

## Completed Work
- [x] **Platform Branding**: Renamed "The Actual News" to "Records Watch" in 46+ files including UI, contracts, and docs.
- [x] **Domain Realignment**: Migrated all defaults and examples from `theactual.news` to `recordswatch.org`.
- [x] **Contract Refresh**: Updated all OpenAPI service titles to the new identity.
- [x] **Vacuum Remediation**: Replaced "coming soon" placeholders in `docs/pitch/index.html` with real value propositions.
- [x] **Tooling Update**: Refreshed `domain-doctor`, `smoke` tests, and environment templates.
- [x] **Final Prove**: Executed `pnpm launch:local` and confirmed 100% success on standalone production artifact.

## Key Decisions
| Decision | Rationale |
|----------|-----------|
| Shifted to `recordswatch.org` | Hall-monitor audit identified `theactualnews.org` as an active collision; `recordswatch.org` provides a cleaner, more authoritative namespace for civic reporting. |
| Filled pitch vacuums | The "none-knowledge" gaps created a trust vacuum; Phase 1 readiness requires a complete narrative as well as complete code. |
| Granular (line-by-line) replacements | Block replacements failed due to context drift; surgical line updates ensured 100% accuracy and avoided introduce unintended diffs. |

## Critical Context
- **IRF Tracking**: This work closes the repo-side requirements for **IRF-III-059** (canonical launch) and **IRF-III-065** (civic bundle).
- **Public/Internal Boundary**: Strictly maintained. No secrets added to public-web or docs.
- **CI Status**: Local gates are green; remote CI will run upon merge of the cutover branch.

## Next Actions
1. **Domain Acquisition**: Secure `recordswatch.org` and delegate nameservers to Cloudflare.
2. **Custom Domain Binding**: Run the `wrangler` commands listed in `docs/custom-domain-cutover.md` to bind the Worker to the new domain.
3. **Provider Setup**: Configure hosted destinations for Newsletter, Membership, and Sponsors (see `docs/revenue-provider-onboarding.md`).
4. **Strict Launch Gate**: Once provider URLs are ready, run `PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict`.
5. **DNS Proof**: Run `pnpm domain:doctor` to verify delegation and provider health.

## Risks & Warnings
- **DNS Propagation**: Custom-domain binding may take 1-2 hours to propagate after nameserver delegation.
- **Provider URL Format**: Strict gate rejects placeholder domains (e.g., `.example`) and same-origin routes; must use real external hosted URLs.
- **Memory Constraint**: 16GB RAM limit on host; avoid running parallel Docker builds during cutover.
