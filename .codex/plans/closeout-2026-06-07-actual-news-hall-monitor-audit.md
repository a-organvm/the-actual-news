# Actual News Hall-Monitor Audit Closeout

Date: 2026-06-07
Session: Actual News Phase 1 launch cutover audit

## Scope

Strict reread of Phase 0.5/Phase 1 launch work under the rule that `N/A`, missing provider URLs, local-only refs, duplicate registry IDs, and mixed machine output are vacuums until researched, planned, or logged.

## Completed

- Preserved the Phase 0.5 worktree at `../the-actual-news-phase05-complete`.
- Preserved Actual News local-only branch tips by pushing `codex/persistence-audit-2026-06-07` and `jules/issue-29-dependency-posture`.
- Fixed civic bundle script drift by adding `pnpm civic:bundle:verify` as the documented replay alias.
- Fixed `make civic-export` so stdout is parseable canonical JSON and operational logs go to stderr.
- Fixed lint scope so generated OpenNext output under `**/out/**` is ignored.
- Removed unused civic replay/export locals caught by lint.
- Documented the audit in `.codex/plans/2026-06-07-actual-news-hall-monitor-audit.md`.
- Updated the universal IRF on branch `codex/irf-actual-news-phase1-2026-06-07` with progress on `IRF-III-059`.
- Added progress evidence to GitHub issue `a-organvm/organvm-corpvs-testamentvm#21`.
- Repaired unrelated duplicate `IRF-ATN-006` / `IRF-ATN-009` completion rows on branch `codex/irf-atn-duplicate-repair-2026-06-07`.

## Verification

- `python3 -m json.tool fixtures/civic-record-node/civic-council-budget-amendment.json`
- `python3 -m json.tool fixtures/civic-record-node/bundle-manifest.schema.json`
- `node -c tools/civic-bundle/seed.mjs`
- `node -c tools/civic-bundle/export.mjs`
- `node -c tools/civic-bundle/replay.mjs`
- `POSTGRES_URI=postgres://news:news@127.0.0.1:5432/news_ledger?sslmode=disable make civic-seed`
- `POSTGRES_URI=postgres://news:news@127.0.0.1:5432/news_ledger?sslmode=disable make civic-replay`
- `POSTGRES_URI=postgres://news:news@127.0.0.1:5432/news_ledger?sslmode=disable pnpm civic:bundle:verify`
- `POSTGRES_URI=postgres://news:news@127.0.0.1:5432/news_ledger?sslmode=disable pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm launch:check`
- `pnpm launch:local`
- `pnpm cloudflare:build`
- `pnpm cloudflare:smoke`

## Expected Blockers

- `pnpm domain:doctor` fails for `theactual.news` and `recordswatch.org` because the canonical domain, DNS delegation, Worker custom-domain binding, and external provider URLs are not yet configured.
- Launch cutover remains open under `IRF-III-059`.

## Residue

- The broader corpvs checkout has no local-only committed branch tips after preservation.
- The broader corpvs checkout still has 35 untracked prompt/session entries under `.claude/sessions/` and `data/prompt-registry/sessions/`, about 19 MB total.
- A bounded secret-pattern scan over those untracked files returned 1771 matching lines, so they were not committed or pushed blindly.
- Treat that untracked prompt/session material as a privacy-sensitive SYS/prompt-accountability lane, not as Actual News launch work.

## Final Git State

- Actual News branch `codex/phase1-launch-cutover` pushed to origin.
- Corpvs IRF branch `codex/irf-actual-news-phase1-2026-06-07` pushed to origin.
- Corpvs duplicate-repair branch `codex/irf-atn-duplicate-repair-2026-06-07` pushed to origin.
