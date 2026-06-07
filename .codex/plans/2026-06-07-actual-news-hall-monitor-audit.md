# The Actual News Hall-Monitor Audit - 2026-06-07

## Scope

User requested a hostile audit of the Phase 0.5/Phase 1 work: prove nothing was overwritten or lost, preserve local-only work remotely, treat N/A/missing data as vacuum, check IRF and external indices, then commit and push.

Parent registry item: `IRF-III-059` (canonical launch cutover vacuum). Phase 0.5 sub-item: `IRF-III-065`.

## Findings Caught

1. **Local-only branch data existed.**
   - `codex/persistence-audit-2026-06-07` had upstream `[gone]`; tip `8e0f0bc` was not reachable from any remote branch.
   - Fixed by pushing `origin/codex/persistence-audit-2026-06-07`.
   - `jules/issue-29-dependency-posture` tip `b5f3e4a` was local-only after prior remote deletion.
   - Fixed by pushing `origin/jules/issue-29-dependency-posture`.
   - After both pushes: `git log --oneline --decorate --branches --not --remotes` returned empty.

2. **Advertised civic command was missing.**
   - `fixtures/civic-record-node/README.md` documented `pnpm civic:bundle:verify`, but `package.json` had only seed/export/replay.
   - Fixed with `civic:bundle:verify` alias to `tools/civic-bundle/replay.mjs` in root and tool package scripts.

3. **Export success was not machine-parseable.**
   - `make civic-export > file` returned exit 0 but produced mixed stdout because Make echoed the command and `export.mjs` wrote status/summary to stdout.
   - Fixed by suppressing Make echo for `civic-export` and moving exporter status/summary lines to stderr, leaving stdout as canonical JSON.

4. **Lint boundary was wrong after build.**
   - `pnpm lint` scanned generated `apps/public-web/out/**` files after launch/build runs and failed on minified Next assets.
   - Fixed ESLint flat-config ignore with `**/out/**`.
   - Removed civic tool unused locals that added avoidable warnings.

5. **Session-review protocol has unrelated tooling gaps.**
   - `organvm session review --latest` failed on an unparsable Gemini temp session file.
   - `organvm prompts distill --dry-run` failed because `data/atoms/clipboard-prompts.json` was absent.
   - Existing registry coverage: `IRF-SYS-071` covers parser format drift; `IRF-SYS-241` covers clipboard/distill path mismatch. No duplicate IRF minted here.

## Verification

Passed:

- `git fetch --all --prune`
- `git status --short --branch`
- `git rev-list --left-right --count @{u}...HEAD`
- `git log --oneline --decorate --branches --not --remotes`
- `python3 -m json.tool fixtures/civic-record-node/civic-council-budget-amendment.json`
- `python3 -m json.tool fixtures/civic-record-node/bundle-manifest.schema.json`
- `node -c tools/civic-bundle/seed.mjs`
- `node -c tools/civic-bundle/export.mjs`
- `node -c tools/civic-bundle/replay.mjs`
- `pnpm install --frozen-lockfile`
- `POSTGRES_URI=... pnpm conformance:doctor`
- `POSTGRES_URI=... make civic-seed`
- `POSTGRES_URI=... make civic-replay`
- `POSTGRES_URI=... pnpm civic:bundle:verify`
- `POSTGRES_URI=... make civic-export > /tmp/the-actual-news-civic-export-hall-monitor.json`
- `python3 -m json.tool /tmp/the-actual-news-civic-export-hall-monitor.json`
- `pnpm typecheck`
- `POSTGRES_URI=... pnpm test`
- `pnpm lint`
- `pnpm launch:check`
- `pnpm launch:local`
- `pnpm cloudflare:build`
- `pnpm cloudflare:smoke`
- `organvm irf list --priority P0`
- `organvm irf list --priority P1`
- `organvm irf stats`
- `organvm omega status`
- `gh issue view 21 --repo a-organvm/organvm-corpvs-testamentvm`
- `gh issue list --repo a-organvm/the-actual-news --state open`

Expected blockers:

- `pnpm domain:doctor` for `theactual.news` still fails DNS delegation and hosted provider URL checks.
- `PUBLIC_DOMAIN=recordswatch.org PUBLIC_WORKER_URL=https://the-actual-news-public.ivixivi.workers.dev pnpm domain:doctor` still fails unpublished DNS and hosted provider URL checks.

## Export Count Proof

The parsed civic export contained:

- actors: 3
- COI disclosures: 1
- stories: 1
- story versions: 1
- claims: 6
- evidence objects: 4
- claim-evidence edges: 7
- corrections: 1
- verification tasks: 2
- reviews: 1
- publish gate: true

## External Index Sweep

| Index | Result |
|---|---|
| IRF | `IRF-III-059` remains open; `IRF-III-065` remains Phase 0.5 sub-item. Update required for audit findings. |
| GitHub issues | `a-organvm/the-actual-news` has no open issues. Corpvs GH#21 remains open and correctly blocked by human/domain/provider work. Do not close. |
| Omega scorecard | Checked with `organvm omega status`: 7/20 MET. No score movement; strict product polish/revenue/domain proof still absent. |
| SGO inquiry log | Not applicable; work is ORGAN-III, not SGO. |
| `seed.yaml` | No update required; no production edge or capability changed. Existing Worker deployment metadata still accurate. |
| `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` | Auto-generated context shims refreshed during `organvm` commands. Preserve as generator output; no manual architecture edit required. |
| Concordance | No new IRF/DONE IDs introduced; no concordance update required. |
| Plans/closeout | This audit plan records the found/fixed vacuums and verification evidence. |
| Branch/local-remote parity | Current branch clean before edits; two local-only historical branches pushed to origin; no local-only commits remain. |
| Session protocol | Two non-Actual-News tooling failures observed; covered by `IRF-SYS-071` and `IRF-SYS-241`. |

## Remaining Vacuum

`IRF-III-059` is still the governing vacuum. Repo-side launch proof is strong, but strict launch cannot be claimed until:

1. Product/domain decision is made.
2. Domain is registered or assigned.
3. DNS is delegated to Cloudflare.
4. Worker custom domain is bound.
5. Newsletter, membership, and sponsor provider URLs are hosted external destinations.
6. Strict deployed launch gate passes on the chosen canonical domain.
