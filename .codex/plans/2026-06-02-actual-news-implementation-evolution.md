---
title: "The Actual News - Full Implementation Evolution Plan"
description: "Synthesis of expansive inquiry and premortem into an implementation sequence for a conformance-backed civic record node."
generated: "2026-06-02T12:00:00-04:00"
source_artifacts:
  - ".codex/plans/2026-06-02-expansive-inquiry-actual-news/06-synthesis.md"
  - ".codex/plans/2026-06-02-premortem-actual-news/premortem-transcript-20260602-114238.md"
methodology:
  - expansive-inquiry-synthesis
  - prospective-hindsight-premortem
  - project-alchemy-orchestration
---

# The Actual News - Full Implementation Evolution Plan

## Executive Thesis

The Actual News must evolve as a **conformance-backed civic record node**, not as a conventional news app, balanced aggregator, credibility score, or AI fact-checking product.

The expansive inquiry establishes the ideal form: a public-record substrate with a news interface. The premortem establishes the killing failure: architecture and protocol keep improving, but no complete civic story bundle ever proves the system under real workflow pressure.

Therefore the controlling implementation invariant is:

> Every meaningful next task must make one canonical local civic story bundle more durable, inspectable, correctable, exportable, and replayable.

If a task does not improve that bundle or the conformance machinery around it, it is deferred.

## Alchemical Diagnosis

### Organ Placement

- **Primary organ:** Commerce-Applied Organ, because this must become working civic infrastructure with usable services, tests, and deployment behavior.
- **Secondary organ:** Conceptual-Symbolic Engine, because the protocol, invariants, policy packs, and conformance language are central to the moat.
- **Orchestration layer:** Mandatory, because the project is at risk of splitting into docs, services, UI, and governance text that do not metabolize into one artifact.
- **Public Process:** Useful only after the first replayable bundle exists. Before that, public-facing positioning will drift into "AI fact checker" or "transparent news site."
- **Community:** Do not simulate this with marketing. Real community begins with reviewers, civic partners, and institutions interacting with a specific record.

### Current Stage

The project is in **Albedo with Nigredo residue**.

- Albedo: the schemas, invariants, contracts, migrations, gateway gate logic, and conformance harness have clarified the essential structure.
- Nigredo residue: the repo still contains unresolved prima materia: in-memory service stubs, feed-shaped UI, absent end-to-end civic loop, weak evidence trust root, and aspirational institutional model.

### Required Operation

Perform **Separation -> Coagulation**.

- Separate the true product from adjacent temptations: feed, AI fact checker, trust label, generic local news app, microservice showcase.
- Coagulate around one complete civic record bundle and its replay.

## Target Form

The first serious product artifact is not "an MVP site." It is a **Local Civic Record Node v0.1**.

It must produce and expose one story bundle with:

- Story container and immutable story version.
- Evidence objects hashed from actual content bytes.
- Provenance with source class, collection time, source/publisher identity, URL/blob URI, license, media type, byte length, and derivation chain.
- Atomic claims bound to one story version.
- Claim review workflow with model proposals explicitly marked as proposals.
- Evidence edges with support, contradict, or context relation.
- Verification tasks and persisted reviews.
- Deterministic publish gate metrics and pass/fail result.
- Correction event that references a prior claim.
- Outbox event for publication and, eventually, correction.
- Public story page that leads with record integrity, not article/feed conventions.
- Export manifest and replay/conformance check from clean state.

## Strategic Non-Goals Until v0.1

- No generalized national news product.
- No engagement-ranking work.
- No marketing claims about "fixing news" without a replayable bundle.
- No production federation before bundle export and replay are stable.
- No model sophistication beyond reviewable claim proposals.
- No further service decomposition unless it directly reduces friction in the bundle loop.
- No governance manifesto expansion without a concrete role, COI, reviewer, or funding object in the demo bundle.

## Evolution Map

### Phase 0.5 - Bundle Control Plane

Purpose: make the canonical bundle the center of the repo.

Build:

- `fixtures/civic-record-node/` with one canonical civic story fixture.
- Bundle manifest schema: story, versions, evidence, claims, edges, tasks, reviews, corrections, events, policy pack, expected gate metrics.
- Bundle loader that seeds a clean database from the fixture.
- Bundle exporter that serializes current DB state back into canonical JSON.
- Replay command that imports the bundle into a temp schema/database and validates invariants.
- Conformance additions for bundle export/replay, not only publish gate.

Acceptance gate:

- A single command can seed -> gate -> publish -> correct -> export -> replay.
- The command fails if any required bundle object is absent.
- The canonical bundle becomes the default reference for docs, UI, and service tests.

Suggested command shape:

```bash
pnpm civic:bundle:seed
pnpm civic:bundle:verify
pnpm civic:bundle:export
pnpm civic:bundle:replay
```

Risk neutralized:

- Premortem failure 1: no complete civic story bundle.
- Premortem failure 7: architecture over workflow.

### Phase 1 - Evidence Trust Root

Purpose: make evidence identity real.

Build:

- PostgreSQL-backed evidence service.
- Actual byte hashing: `sha256:<hex>` over uploaded or registered content bytes, not URI strings.
- Content metadata: byte length, media type, collected_at, source class, source, publisher, URL, license, derivation chain.
- Derivative evidence support: transcript or extracted text references original evidence hash.
- Duplicate handling: same content hash returns existing evidence object within platform scope.
- Tests proving changed bytes change the hash and unchanged bytes preserve identity.
- A fixture with at least one primary record and one derivative artifact.

Acceptance gate:

- Evidence registration rejects missing provenance minimums.
- Evidence hash cannot be forged by changing URI only.
- Publish gate primary evidence ratio uses source class from persisted evidence.
- Bundle replay verifies evidence identity independently.

Risk neutralized:

- Premortem failure 2: shallow evidence provenance.

### Phase 2 - Human-Governed Claim Ledger

Purpose: prevent claim extraction from becoming AI theater.

Build:

- PostgreSQL-backed claim service.
- Extraction jobs persist as proposals, not final claims.
- Claim proposal lifecycle: proposed, accepted, edited, split, merged, rejected.
- Claim fields required before verification: claim type, text, story version, entities, time window where applicable, jurisdiction where applicable, interpretation/factual classification.
- Claim quality metrics: edit rate, reject rate, missing-scope rate.
- Manual claim creation for the canonical bundle so the workflow does not depend on model quality.
- Model gateway integration only after manual workflow proves schema ergonomics.

Acceptance gate:

- A reviewer can turn proposed claims into accepted ledger claims.
- The system can publish the canonical bundle with no model dependency.
- The system records extraction error rates when model proposals are used.

Risk neutralized:

- Premortem failure 3: AI claim extraction theater.

### Phase 3 - Verification Workflow And Remediation Gate

Purpose: turn deterministic gates into actionable newsroom workflow.

Build:

- PostgreSQL-backed verify service.
- Automatic task creation for unsupported claims, high-impact corroboration needs, contradictions, and COI checks.
- Review persistence with actor, verdict, notes, evidence edges, and created_at.
- Claim support status transitions driven by reviews and evidence edges.
- Publish gate response expanded with blocking claim IDs and remediation actions.
- Policy pack version included in every gate response and publish event.
- Category support for non-final states: developing record, evidence request, analysis, urgent public notice.

Acceptance gate:

- Failed gate response tells the publisher exactly which claims block publication and why.
- Review submission can create evidence edges and update support status.
- Canonical bundle includes at least one initially failing gate and one remediated passing gate.

Risk neutralized:

- Premortem failure 4: brittle publish gate.

### Phase 4 - Correction, Replay, And Event Discipline

Purpose: make correction visible and replayable, not just a table.

Build:

- Correction append endpoint.
- Correction event schema and outbox emission.
- Correction replay logic that reconstructs public claim state with original claim still readable.
- Correction reason codes with details payload.
- UI correction timeline tied to claim IDs.
- Conformance tests for append-only correction invariants.
- Export manifest includes correction chain and replay expectation.

Acceptance gate:

- Original claims remain visible after correction.
- A correction changes interpreted public state without deleting history.
- Replay from exported bundle reconstructs the same corrected state.

Risk neutralized:

- Expansive inquiry contradiction: corrections must be visible repairs, not hidden edits.

### Phase 5 - Record-First Public Web

Purpose: stop the UI from teaching users that this is just a feed.

Build:

- Story page leads with record integrity summary:
  - policy pack version
  - gate status and metrics
  - claim coverage
  - evidence ratio
  - high-impact corroboration
  - correction count/status
  - export/replay affordance
- Narrative and verification spine remain side by side or tightly linked.
- Claim table becomes claim cards with evidence traversal, provenance summary, reviewer status, and correction context.
- Feed becomes navigation only; it should display quality/record signals instead of article-card conventions.
- Add verifier-visible task queue and review detail screens backed by real persistence.

Acceptance gate:

- A reader can traverse narrative -> claim -> evidence -> reviewer note -> correction without leaving the page.
- The top viewport communicates "record bundle" before "article feed."
- The canonical bundle is inspectable through the UI.

Risk neutralized:

- Premortem failure 5: feed-shaped product drift.

### Phase 6 - Minimum Institutional Legitimacy

Purpose: make public-service claims concrete before scaling.

Build:

- Actor roles: reporter, editor, verifier, auditor, admin.
- COI disclosure display tied to actors and story/claim context.
- Audit fields for who created/accepted/reviewed/corrected each object.
- Demo funding/governance note for the canonical bundle.
- Reviewer provenance display in the UI.
- Role separation checks for high-impact review where feasible.

Acceptance gate:

- Canonical bundle includes named actor roles, reviewer identity, one COI disclosure, and governance/funding note.
- The UI can answer: who authored, who verified, who corrected, and what conflicts were disclosed?
- Public-service legitimacy exists as product data, not only docs.

Risk neutralized:

- Premortem failure 6: institutional model never becomes real.

### Phase 7 - External Category Proof

Purpose: prove distinction from AI fact-checking, credibility labels, and provenance-only tools.

Build:

- Public "what this is" page focused on conformance-backed civic record nodes.
- Export/replay demo documentation.
- Comparison matrix:
  - transparency standards
  - credibility ratings
  - claim verification tools
  - media provenance
  - Actual News record bundles
- C2PA/Project Origin compatibility note for evidence ingestion.
- Developer API documentation for story bundle export.

Acceptance gate:

- A third party can understand and run the export/replay path.
- The project can explain why it is not an AI fact checker in one technical paragraph.
- Public materials lead with conformance, bundle integrity, and civic record replay.

Risk neutralized:

- Premortem failure 8: category capture by adjacent products.

### Phase 8 - Federation And Institutional Deployment

Purpose: only after the local node works, make nodes interoperable.

Build:

- Bundle signing.
- Public transparency log or mirror strategy.
- Cross-node import/export validation.
- Archive export and cold-storage reader.
- Institutional deployment profile for library/city/school node.
- Federation conformance tests.

Acceptance gate:

- Two independent deployments exchange a published bundle and verify equivalent public state.
- A third party can reconstruct archive state from exported bundles.

Risk neutralized:

- Expansive inquiry ideal: trust cannot depend on one operator.

## First 30-Day Build Order

Week 1 - Freeze the canonical bundle target.

- Create `fixtures/civic-record-node/README.md`.
- Choose one concrete civic scenario: city council agenda item, procurement award, school board vote, or budget amendment.
- Define the canonical bundle manifest JSON schema.
- Add one seedable story version, two to five evidence objects, five to ten claims, evidence edges, one reviewer, one COI disclosure, one correction, and expected gate metrics.
- Add a failing test that asserts bundle replay is not yet implemented.

Week 2 - Implement evidence persistence and byte hashing.

- Move evidence service from in-memory map to PostgreSQL.
- Add actual byte-hash registration path.
- Add provenance validation.
- Add derivative evidence chain support.
- Update canonical bundle loader to seed evidence.
- Add tests for hash stability and provenance minimums.

Week 3 - Implement durable claims and verification tasks.

- Move claim service from in-memory map to PostgreSQL.
- Add manual claim creation and proposal lifecycle table or fields.
- Move verify service tasks/reviews to PostgreSQL.
- Auto-create evidence-gap tasks for unsupported accepted claims.
- Add review submission that creates or references evidence edges.

Week 4 - Wire the first full loop.

- Add bundle seed/export/replay commands.
- Expand publish gate response with blocking claims and remediation steps.
- Add correction append endpoint.
- Update story page to show record integrity summary and claim/evidence/correction traversal.
- Run the canonical end-to-end test from clean database.

## Implementation Workstreams

### Workstream A - Bundle And Conformance

Owner goal: make every other workstream answer to one artifact.

Deliverables:

- Canonical bundle schema.
- Fixture loader/exporter.
- Replay validator.
- Conformance tests for bundle integrity.
- CI job for bundle replay.

Dependencies:

- Can begin immediately.
- Needs migration updates from other workstreams as they land.

### Workstream B - Persistence And Services

Owner goal: remove in-memory stubs where they block the bundle.

Deliverables:

- PostgreSQL-backed evidence, claim, verify, and story paths where missing.
- Shared DB access conventions.
- Service tests against isolated database/schema.

Dependencies:

- Bundle schema for target object shape.

### Workstream C - Evidence And Provenance

Owner goal: establish trust root.

Deliverables:

- Byte hashing.
- Provenance validation.
- Derivation chain.
- Duplicate handling.
- C2PA compatibility plan.

Dependencies:

- DB schema changes.

### Workstream D - Gate And Workflow

Owner goal: make publish gates actionable.

Deliverables:

- Gate API with blocking claim details.
- Remediation tasks.
- Policy pack version propagation.
- Developing/evidence-request/analysis object status plan.

Dependencies:

- Claims, evidence, and verify persistence.

### Workstream E - Record-First UI

Owner goal: teach the record model through the interface.

Deliverables:

- Record integrity summary.
- Claim/evidence/correction traversal.
- Reviewer/provenance display.
- Feed reduced to navigation with quality/record signals.

Dependencies:

- Gateway story bundle response enriched with evidence objects, reviews, policy/gate metrics, and corrections.

### Workstream F - Institutional Legitimacy

Owner goal: make public service queryable.

Deliverables:

- Role model.
- COI display.
- Audit trail fields and UI affordances.
- Funding/governance note in canonical bundle.

Dependencies:

- Actor and review persistence.

## Data Model Evolution

Likely migrations:

- Add evidence content metadata:
  - `content_byte_length`
  - `content_sha256`
  - `derives_from_evidence_id_hash`
  - `provenance_validated_at`
- Add claim proposal lifecycle:
  - `claim_extraction_jobs`
  - `claim_proposals`
  - or proposal fields on `claims` if scope is kept tight.
- Add review-driven status history:
  - `claim_status_events`
  - `verification_task_events`
- Add gate evaluations:
  - `publish_gate_evaluations`
  - store metrics, policy pack version, blocking claim IDs, and pass/fail.
- Add bundle export/replay metadata:
  - `bundle_exports`
  - `bundle_manifest_hash`
- Add correction event detail:
  - reason code enum or validated reason strings.
- Add audit/governance fields:
  - actor role constraints
  - COI relation to story/claim where needed.

Principle:

Do not add tables because the architecture diagram wants them. Add tables when the canonical bundle cannot represent or replay a required fact without them.

## API Evolution

Highest priority endpoint additions:

- `POST /v1/evidence` with actual content registration and provenance validation.
- `GET /v1/evidence/:evidence_id_hash` backed by database.
- `POST /v1/stories/:story_id/claims` for manual accepted claims.
- `POST /v1/extract` returns proposals, not accepted claims.
- `POST /v1/claims/:claim_id/evidence-edges`.
- `POST /v1/tasks` automatically generated but also manually creatable for demo.
- `POST /v1/tasks/:task_id/review` persists review and updates task/status.
- `GET /v1/story/:story_id` returns enriched bundle:
  - story
  - versions
  - claims
  - evidence objects
  - evidence edges
  - tasks/reviews
  - corrections
  - gate metrics
  - policy pack version
- `POST /v1/story/:story_id/publish/evaluate`.
- `POST /v1/story/:story_id/publish`.
- `POST /v1/claims/:claim_id/corrections`.
- `GET /v1/story/:story_id/export`.
- `POST /v1/bundles/replay` or CLI-only equivalent for v0.1.

## Testing Strategy

Test pyramid should be artifact-centered:

1. Unit tests for hashing, provenance validation, independence keys, claim high-impact detection, and remediation generation.
2. Service tests for evidence, claim, verify, correction, and gateway endpoints.
3. SQL conformance tests for publish gate and correction invariants.
4. Bundle conformance tests for seed/export/replay.
5. UI tests for the canonical bundle story page once dependencies are installed.
6. One CI path that runs from clean database and proves the lifecycle.

The most important test is not a service unit test. It is:

```text
clean database -> seed canonical bundle -> verify gate fails -> remediate via review/evidence -> gate passes -> publish -> append correction -> export -> replay -> assert equivalent public state
```

## Dependency And Environment Notes

Current `pnpm test` could not run because `node_modules` was absent during the prior inquiry. Before implementation, restore local dependency state:

```bash
pnpm install
pnpm test
pnpm typecheck
```

Use Docker Compose only for coordinated local services if needed. The home-level instruction says Docker is not the default; for this repo, Postgres plus app services is a valid two-plus coordinated case, but avoid leaving Docker Desktop running unnecessarily.

## Governance Of The Plan

This plan should supersede the current roadmap ordering where Phase 3 governance waits too long. Minimum governance must move into v0.1 because public-service legitimacy is part of the artifact.

Recommended roadmap rewrite:

- Phase 0.5: Canonical bundle and replay.
- Phase 1: Evidence trust root.
- Phase 2: Human-governed claims and verification.
- Phase 3: Publish/remediation/correction loop.
- Phase 4: Record-first UI.
- Phase 5: Minimum institutional legitimacy.
- Phase 6: External category proof.
- Phase 7: Federation.

## Cut Lines

If time compresses, cut in this order:

1. Model gateway sophistication.
2. Microservice purity.
3. Public marketing pages.
4. Federation.
5. Advanced contradiction detection.
6. Full auth implementation.

Do not cut:

- Byte-hashed evidence.
- Bundle export/replay.
- Human review persistence.
- Gate remediation details.
- Visible correction.
- Minimum actor/COI/governance data in the demo bundle.

## Definition Of v0.1 Done

v0.1 is done when:

- The canonical civic bundle exists on disk.
- It can be loaded into a clean database.
- It can produce a failing gate, then a passing gate after remediation.
- It can publish transactionally.
- It can append and display a correction.
- It can export to a manifest.
- The manifest can replay into equivalent public state.
- The public story page makes the record inspectable.
- The transcript of authorship, verification, correction, and governance is visible enough that a skeptical civic partner can audit it.

## The Alchemical Rule

Do not market Nigredo. Do not polish Albedo as if it were Rubedo.

The Actual News is ready for Coagulation only around one thing: the replayable civic story bundle. Everything else is either solvent, vessel, or ornament.
