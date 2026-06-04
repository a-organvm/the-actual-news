---
title: "Agent Handoff - The Actual News Strategy And Evolution Planning"
description: "Cross-agent continuity handoff for the Actual News inquiry, premortem, and implementation evolution planning work."
generated: "2026-06-02T12:15:00-04:00"
repo: "/Users/4jp/Code/organvm/the-actual-news"
branch: "chore/issue-28-dependency-posture"
phase: "plan-to-implementation-transition"
---

# Agent Handoff: The Actual News Strategy And Evolution Planning

**From:** Codex session | **Date:** 2026-06-02 | **Phase:** Plan-to-implementation transition

## Current State

Repository:

- Path: `/Users/4jp/Code/organvm/the-actual-news`
- Branch: `chore/issue-28-dependency-posture`
- Remote branch has been pushed to `origin/chore/issue-28-dependency-posture`.
- Current tracked plan commits:
  - `990ffb8 Add expansive inquiry for Actual News`
  - `e40a745 Add premortem for Actual News`
  - `48780ae Add Actual News implementation evolution plan`

Working tree warning:

- `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` are modified locally.
- Those modifications pre-existed this planning work and were intentionally left untouched.
- Do not revert, stage, or overwrite them unless the user explicitly asks.

Test/dependency state:

- `pnpm test` was attempted earlier and failed because `node_modules` is absent and `vitest` could not be found.
- No current runtime/test pass has been established.
- Before implementation, run `pnpm install`, then `pnpm test` and `pnpm typecheck`.

## Completed Work

- [x] Located the repo at `/Users/4jp/Code/organvm/the-actual-news`.
- [x] Confirmed the repo thesis from docs/specs/code: The Actual News is a verifiable news ledger/public-record substrate, not a normal news app.
- [x] Ran `expansive-inquiry` over the repo as ideal form, current state, current space, and what should exist.
- [x] Created and pushed the six-lens inquiry artifact set:
  - `.codex/plans/2026-06-02-expansive-inquiry-actual-news/00-scope.md`
  - `.codex/plans/2026-06-02-expansive-inquiry-actual-news/01-logic.md`
  - `.codex/plans/2026-06-02-expansive-inquiry-actual-news/02-mythos.md`
  - `.codex/plans/2026-06-02-expansive-inquiry-actual-news/03-bridge.md`
  - `.codex/plans/2026-06-02-expansive-inquiry-actual-news/04-meta.md`
  - `.codex/plans/2026-06-02-expansive-inquiry-actual-news/05-pattern.md`
  - `.codex/plans/2026-06-02-expansive-inquiry-actual-news/06-synthesis.md`
- [x] Ran `premortem` on the same Local Civic Record Node target.
- [x] Created and pushed:
  - `.codex/plans/2026-06-02-premortem-actual-news/premortem-report-20260602-114238.html`
  - `.codex/plans/2026-06-02-premortem-actual-news/premortem-transcript-20260602-114238.md`
- [x] Opened the HTML premortem report via the default browser.
- [x] Synthesized the expansive inquiry plus premortem through `project-alchemy-orchestrator`.
- [x] Created and pushed:
  - `.codex/plans/2026-06-02-actual-news-implementation-evolution.md`

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Treat The Actual News as a **conformance-backed civic record node** | This best preserves the repo's strongest distinction: protocol-backed story bundles, not news feeds, trust scores, or AI fact-checking. |
| Make one replayable local civic story bundle the controlling artifact | The premortem's most likely failure is improving architecture without ever proving a complete workflow. |
| Move minimum governance earlier than the existing roadmap implies | Public-service legitimacy cannot wait until late operations phases; the first demo bundle needs actor roles, reviewer identity, COI, and governance/funding notes. |
| Prioritize evidence byte hashing before model sophistication | Evidence is the trust root. If provenance is shallow, claim ledgers and publish gates become decorative. |
| Keep claim extraction human-governed | Model output should remain proposal-level until the manual claim/review workflow is proven. |
| Reframe UI around record inspection | A feed-shaped UI will teach users that this is another news site; story pages must foreground bundle integrity, gate metrics, evidence traversal, corrections, export, and replay. |
| Defer federation and public marketing until v0.1 bundle/replay works | Without a replayable artifact, external category positioning will collapse into "AI fact checker" or "transparent news site." |

## Critical Context

Core repo state:

- Phase 0 is marked complete in `specs/verifiable-news-platform/tasks.md`.
- Phase 1 is open:
  - real evidence service
  - model gateway claim extraction
  - verification task creation
  - review persistence
  - service-wired publish gate
  - end-to-end ingest -> extract -> verify -> publish -> correct test
- Current services beyond gateway are mostly in-memory stubs:
  - `services/story/src/server.ts`
  - `services/claim/src/server.ts`
  - `services/evidence/src/server.ts`
  - `services/verify/src/server.ts`
- Gateway currently has the strongest runtime logic:
  - `services/gateway/src/server.ts`
  - feed/story/publish endpoints
  - transactional publish gate logic
- Current conformance focus:
  - `tools/conformance/run.mjs`
  - `tools/conformance/sql/publish_gate.sql`
  - `tools/conformance/sql/publish_txn.sql`
  - fixtures `CT-01` through `CT-07`
- UI currently has feed/article-shaped scaffolding:
  - `apps/public-web/src/pages/index.tsx`
  - `apps/public-web/src/pages/story/[story_id].tsx`

External-space context already checked in the inquiry:

- The Trust Project: transparency indicators and partner standards.
- NewsGuard: publisher/site credibility ratings and nutrition labels.
- LaPruv: claim verification with evidence trails.
- Factward: pre-publication article claim verification.
- Project Origin/C2PA: media provenance/authenticity.

Strategic conclusion:

- The space already has standards, labels, claim tools, and provenance tools.
- The Actual News should not compete as any one of those.
- Its defensible category is integrated public-interest verification infrastructure: story bundles that can be inspected, corrected, exported, and replayed.

## Next Actions

Start implementation from the evolution plan, not from the older phase list alone.

1. Read `.codex/plans/2026-06-02-actual-news-implementation-evolution.md`.
2. Restore dependency state:
   - `pnpm install`
   - `pnpm test`
   - `pnpm typecheck`
3. Create Phase 0.5 bundle control plane:
   - `fixtures/civic-record-node/`
   - canonical bundle manifest schema
   - one civic scenario fixture
   - seed/export/replay command skeletons
   - failing conformance test for replay not yet implemented
4. Implement evidence trust root:
   - move evidence service from memory to PostgreSQL
   - hash actual content bytes
   - validate provenance minimums
   - add derivative evidence chain support
5. Implement durable claims and verification:
   - PostgreSQL-backed claim service
   - manual claim creation
   - proposal lifecycle for extraction output
   - PostgreSQL-backed verify tasks/reviews
6. Wire full loop:
   - gate evaluation with blocking claim IDs
   - remediation tasks
   - correction append endpoint
   - export/replay validation
7. Update public web:
   - story page leads with record integrity
   - claim/evidence/correction traversal
   - export/replay affordance
   - feed demoted to navigation with record signals
8. Pull minimum governance into v0.1:
   - actor roles
   - reviewer identity
   - COI disclosure display
   - governance/funding note in canonical bundle

## Risks And Warnings

- Do not let the project drift into "AI fact checker." The plan explicitly rejects that category.
- Do not build more microservice purity before one bundle works. Gateway-first orchestration is acceptable if it proves the lifecycle.
- Do not treat the feed as the product. It is navigation only.
- Do not hash only `blob_uri` or metadata. Evidence identity must be derived from actual bytes.
- Do not make model extraction authoritative. It must remain proposal-level until reviewed.
- Do not defer all governance. The first demo bundle must include public-service legitimacy primitives.
- Do not claim test success until dependencies are installed and tests actually run.
- Preserve the user's dirty instruction-file changes unless explicitly told otherwise.

## Conflict Zones

| Path | Rule |
|------|------|
| `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | Existing user/local modifications. Do not touch without explicit instruction. |
| `.codex/plans/` | Append-only planning/handoff artifacts. Do not overwrite existing plan files; use new dated filenames or `-v2`. |
| `db/migrations/` | Coordinate schema evolution carefully; migrations must remain ordered and idempotent. |
| `tools/conformance/` | Treat as the project proof layer; update fixtures and SQL deliberately. |
| `apps/public-web/src/pages/` | UI should shift toward record inspection, but avoid broad visual redesign before enriched bundle data exists. |

## Recovery Protocol

If a future agent resumes cold:

1. Run `git status --short` and confirm only expected local dirty files exist.
2. Read:
   - `.codex/plans/2026-06-02-actual-news-implementation-evolution.md`
   - `.codex/plans/2026-06-02-premortem-actual-news/premortem-transcript-20260602-114238.md`
   - `.codex/plans/2026-06-02-expansive-inquiry-actual-news/06-synthesis.md`
3. Check latest commits with `git log --oneline -5`.
4. Install deps if absent and run tests before implementation.
5. Continue from Phase 0.5: canonical bundle + replay.

## Minimal Continuity Summary

Continue The Actual News from the implementation evolution plan. The controlling artifact is one replayable local civic story bundle. Do not build generic app surface or AI fact-checking features first. Start with bundle seed/export/replay, byte-hashed evidence, durable claims/reviews, gate remediation, correction replay, and record-first UI.
