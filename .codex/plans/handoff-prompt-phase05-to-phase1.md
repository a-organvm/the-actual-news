# Session Handoff Prompt — The Actual News Phase 0.5+ 

## Instructions for New Session

When you receive this prompt, execute the following in order:

### Step 1: Containerize Previous Session into Worktree

```bash
# From the-actual-news repo root
git worktree add ../the-actual-news-phase05-complete wip/preserve-2026-06-07-actual-news-generated-shims
```

This creates a frozen worktree at `../the-actual-news-phase05-complete` containing all Phase 0.5 work.

### Step 2: Code-Review Previous Sessions

Read and verify these artifacts exist and are correct:

```bash
# Verify Phase 0.5 files exist
ls -la fixtures/civic-record-node/
ls -la tools/civic-bundle/
cat fixtures/civic-record-node/civic-council-budget-amendment.json | python3 -m json.tool > /dev/null && echo "JSON valid"
cat fixtures/civic-record-node/bundle-manifest.schema.json | python3 -m json.tool > /dev/null && echo "Schema valid"
node -c tools/civic-bundle/seed.mjs && echo "seed.mjs valid"
node -c tools/civic-bundle/export.mjs && echo "export.mjs valid"
node -c tools/civic-bundle/replay.mjs && echo "replay.mjs valid"

# Verify IRF state
grep -n "IRF-III-065" /Users/4jp/Code/organvm/organvm-corpvs-testamentvm/INST-INDEX-RERUM-FACIENDARUM.md

# Verify closeout exists
cat .codex/plans/closeout-2026-06-07-actual-news-phase05.md

# Verify git state
git log --oneline -5
git status
```

### Step 3: Review Prior Session Plans

Read these to understand full context:

```bash
cat .codex/plans/2026-06-02-actual-news-implementation-evolution.md
cat .codex/plans/2026-06-02-actual-news-cross-agent-handoff.md
cat .codex/plans/closeout-2026-06-02-actual-news.md
```

### Step 4: Verify IRF Parent Item

```bash
# Check IRF-III-059 (P1) — canonical launch cutover vacuum
grep -A5 "IRF-III-059" /Users/4jp/Code/organvm/organvm-corpvs-testamentvm/INST-INDEX-RERUM-FACIENDARUM.md
```

### Step 5: Commence Work Cycle

After verification, proceed with explore → plan → build → verify → learn:

**Explore:**
- Read `fixtures/civic-record-node/README.md` for fixture documentation
- Read `tools/civic-bundle/package.json` for tool configuration
- Check `Makefile` for available targets
- Check `package.json` scripts for civic bundle operations

**Plan:**
- Review IRF-III-059 requirements (canonical launch cutover)
- Identify next phase: Cloudflare zone/domain binding, provider URLs, deployment
- Create plan in `.codex/plans/2026-06-07-actual-news-phase1-launch.md`

**Build:**
- Execute plan steps
- Use `make civic-seed` to seed database from fixture
- Use `make civic-replay` to validate bundle invariants
- Use `make civic-export` to export DB state

**Verify:**
- Run `pnpm typecheck` (pre-existing failure expected — gateway missing `@types/pg`)
- Run `pnpm test` (pre-existing failure expected — gateway no test files)
- Run bundle tools to verify they work
- Verify IRF updates after completion

**Learn:**
- Document findings in session notes
- Update IRF with any new items
- Create closeout artifact when done

## Context Summary

### What Was Completed (Phase 0.5)
- `fixtures/civic-record-node/civic-council-budget-amendment.json` — canonical civic scenario (6 claims, 4 evidence objects, 7 edges, 1 correction, 3 actors, 1 COI disclosure, 2 verification tasks, 1 review)
- `fixtures/civic-record-node/bundle-manifest.schema.json` — canonical bundle JSON Schema
- `tools/civic-bundle/seed.mjs` — DB seeding from fixture
- `tools/civic-bundle/export.mjs` — DB state export to canonical JSON
- `tools/civic-bundle/replay.mjs` — bundle import + invariant validation
- CT-BUNDLE-01 conformance test in `tools/conformance/run.mjs`
- Makefile targets: `civic-seed`, `civic-export`, `civic-replay`
- package.json scripts: `civic:bundle:seed`, `civic:bundle:export`, `civic:bundle:replay`
- IRF-III-065 filed as P2 sub-atom of IRF-III-059

### What Remains Open (Phase 1+)
- **IRF-III-059 (P1)**: Canonical launch cutover vacuum
  - Decide product/domain (`Records Watch` on `recordswatch.org` recommended)
  - Register/delegate/bind domain
  - Configure external hosted provider URLs
  - Deploy via OpenNext/Wrangler
  - Prove with launch gate tests
- Pre-existing blockers (unrelated):
  - `pnpm test` fails — gateway no test files
  - `pnpm typecheck` fails — gateway missing `@types/pg`

### Git State
- Branch: `wip/preserve-2026-06-07-actual-news-generated-shims`
- Remote: `git@github.com:a-organvm/the-actual-news.git`
- Working tree: clean
- Local:remote parity: 1:1
- Last commit: `2c517ab` (closeout document)

### IRF State
- IRF-III-065 (P2): Phase 0.5 complete, filed and pushed
- IRF-III-059 (P1): Canonical launch cutover vacuum, remains open

## Success Criteria

After completing the work cycle:
1. All Phase 0.5 files verified present and correct
2. IRF-III-059 status updated with progress
3. New closeout artifact created
4. All work committed and pushed
5. Local:remote parity maintained at 1:1
