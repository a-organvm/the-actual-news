---
title: "Premortem Transcript - The Actual News Local Civic Record Node"
description: "Six-month failure analysis for the Actual News next milestone."
generated: "2026-06-02T11:42:38-04:00"
premortem_target: "The Actual News as a Local Civic Record Node"
methodology: "prospective-hindsight premortem"
---

# Premortem Transcript - The Actual News

## Context Gathered

What is it:

The plan is to turn `the-actual-news` from a strong Phase 0 protocol/design scaffold into a working Local Civic Record Node: one complete local civic story bundle with evidence ingestion, claim extraction, human verification, deterministic publication, visible correction, export, and independent replay.

Who it is for / who it affects:

- Readers who need inspectable civic information rather than engagement-ranked news.
- Reporters/publishers who need an evidence-first workflow.
- Verifiers who review claims and evidence gaps.
- Civic institutions such as libraries, cities, schools, local watchdog groups, and public-interest organizations.
- Third parties that may consume story bundles through APIs or federation.

Success criteria:

- A real or realistic local civic story can move through ingest -> evidence -> claim extraction -> verification -> publish -> correct.
- Evidence objects are durable and content-addressed.
- Claims are bound to story versions and connected to evidence edges.
- Human reviews persist.
- The publish gate is deterministic and service-wired.
- A reader can inspect narrative -> claim -> evidence -> correction in the public web UI.
- The story bundle can be exported and replayed through conformance checks.

Local repo evidence:

- Phase 0 is marked complete in `specs/verifiable-news-platform/tasks.md`.
- Phase 1 is still open: durable evidence service, model gateway claim extraction, verification task creation, review persistence, service-wired publish gate, and end-to-end test.
- `services/claim` and `services/evidence` are currently in-memory stubs.
- `services/gateway` contains the strongest runtime logic: feed/story/publish endpoints and transactional publish gate logic.
- `tools/conformance/run.mjs` tests gate/publish transaction behavior through fixtures.
- `pnpm test` did not run in the prior inquiry because `node_modules` was missing.

## Premortem Frame

It is December 2, 2026. The Local Civic Record Node plan failed. The project is not a credible public-service news substrate. It either stalled as a protocol document, drifted into a generic AI fact-checking/news app, or produced a demo that cannot survive real civic reporting, public scrutiny, or independent replay.

## Raw Failure Reasons

1. The project stayed protocol-rich but never produced one complete civic story bundle.
2. Evidence hashing and provenance stayed shallow, so the "verification spine" did not actually prove custody or integrity.
3. Claim extraction became an AI theater layer: impressive demos, weak claim granularity, and no reliable human review loop.
4. The publish gate became a brittle SQL demo instead of a policy-governed newsroom workflow.
5. The public UI stayed feed-shaped, so users treated it like another news site instead of an inspectable record.
6. The institutional model remained manifesto text; no real verifier roles, COI discipline, funding path, or governance proof emerged.
7. The project overbuilt microservices and underbuilt the one civic workflow that would make the concept legible.
8. The space moved faster in adjacent slices, and the project failed to claim a distinctive category before others framed it as "AI fact checking."

## Failure Investigator 1 - No Complete Civic Story Bundle

### The Failure Story

The team kept improving protocol language, OpenAPI contracts, and roadmap phrasing, but no one forced the system through one complete civic story. By August, the repo could still explain what a story bundle should contain, but could not produce one from a city council agenda, budget PDF, or public procurement notice. The demo remained seeded data and isolated service endpoints.

By October, every planning conversation returned to "we need the full loop," but the work kept splitting into smaller infrastructure tasks. The project had a plausible architecture, but no artifact a skeptical civic partner could inspect. The failure became obvious when the public web story page could show claims and edges only if the data had been hand-shaped first.

### The Underlying Assumption

You assumed that a strong protocol scaffold would naturally converge into a real story bundle without making the bundle the controlling artifact.

### Early Warning Signs

- No single fixture contains story version, evidence objects, claims, reviews, corrections, publish metrics, and export/replay.
- Weekly progress is mostly docs, contracts, or service scaffolding rather than one end-to-end civic record.

## Failure Investigator 2 - Shallow Evidence Provenance

### The Failure Story

The evidence service shipped quickly, but it hashed `blob_uri` or stored uploaded metadata without proving the actual content bytes, collection context, or chain of custody. The UI displayed confident "evidence" panels, but a reviewer could not tell whether a PDF had changed, whether a transcript was derived from original audio, or whether two "independent" sources were copies of the same upstream document.

When the first serious story used meeting minutes, a recording, and a vendor proposal, the system could not distinguish primary record, derivative transcript, cached mirror, and summary. The publish gate counted evidence edges, but the underlying evidence identity was too weak to support public scrutiny.

### The Underlying Assumption

You assumed content-addressed evidence is a simple storage feature rather than the trust root for the whole platform.

### Early Warning Signs

- Evidence hashes are computed from URI strings or metadata instead of actual bytes.
- Provenance records do not capture source class, collection time, license, derivation chain, and upstream identity consistently.

## Failure Investigator 3 - AI Claim Extraction Theater

### The Failure Story

Claim extraction was wired through a model gateway, and demos looked strong because the model produced tidy lists of claims from clean prose. In real civic material, it split claims badly, missed time bounds, over-tagged entities, and treated interpretations as factual statements. Reviewers spent more time repairing extraction output than verifying evidence.

The deeper failure was governance: model output looked authoritative in the UI. Reporters started drafting around what the extractor handled well, not around what the public needed to know. The "verification spine" became a machine-generated appendix rather than a disciplined ledger.

### The Underlying Assumption

You assumed claim extraction accuracy was mostly a model capability problem rather than a workflow, schema, and review ergonomics problem.

### Early Warning Signs

- Reviewers edit or discard more than 30 percent of extracted claims before verification can begin.
- Claims frequently lack usable time windows, jurisdiction, source type, or interpretation/factual distinction.

## Failure Investigator 4 - Brittle Publish Gate

### The Failure Story

The publish gate remained technically elegant but operationally awkward. It computed ratios and corroboration, but newsroom users did not understand what failed, what to fix next, or how urgent public-interest material should be represented before final verification. The result was gate avoidance: users either worked around it with hand-crafted data or waited until the story was already fully shaped elsewhere.

Policy packs existed, but they were not treated as governance artifacts with versioning, explanations, category-specific thresholds, and appeal paths. The gate became a pass/fail SQL object instead of a workflow that teaches reporters and verifiers how to improve the record.

### The Underlying Assumption

You assumed deterministic publication logic is enough if the algorithm is correct.

### Early Warning Signs

- Gate failures return metrics but not actionable remediation steps tied to specific claims.
- There is no object type for developing record, evidence request, analysis, or urgent public notice.

## Failure Investigator 5 - Feed-Shaped Product Drift

### The Failure Story

The public web UI was the easiest thing for outsiders to understand, so it started absorbing the product identity. The homepage became a feed, the story page became article-first, and the verification spine became an expandable panel for motivated readers. Most users never opened the evidence layer.

By launch, the platform looked like a principled news site with source links. That was not enough. Readers compared it to newsletters and local news sites; funders asked about audience growth; contributors optimized for narrative polish. The record substrate was still present, but it was no longer the center of gravity.

### The Underlying Assumption

You assumed users would understand the record model if the verification spine was available somewhere in the interface.

### Early Warning Signs

- Product screenshots lead with a feed and article cards rather than bundle integrity, claim status, and correction/replay affordances.
- User feedback talks about "articles" and "balanced coverage" more than inspectable records.

## Failure Investigator 6 - Institutional Model Never Becomes Real

### The Failure Story

The docs kept saying "news as a public service," but the product never encoded public-service governance. Actors had roles in the schema, COI disclosures existed as a table, and the roadmap mentioned civic procurement, but there was no live verifier onboarding, no conflict display, no audit trail for editorial versus verification decisions, and no funding mechanism detached from attention.

The failure surfaced when a potential civic partner asked who verifies disputed claims, who pays reviewers, what happens when a funder is implicated, and who controls corrections. The technical answer was strong; the institutional answer was aspirational.

### The Underlying Assumption

You assumed public-service legitimacy could be added after the technical substrate worked.

### Early Warning Signs

- COI, role separation, reviewer identity, and funding are treated as Phase 3+ concerns.
- Demo stories do not include conflicts, reviewer provenance, or governance decisions.

## Failure Investigator 7 - Architecture Over Workflow

### The Failure Story

The repo decomposed into services before the team had one proven manual workflow. Story, claim, evidence, verify, gateway, contracts, mocks, and conformance all looked professionally organized, but every small change required cross-service coordination. The system became expensive to reason about relative to the one thing it needed to prove.

This created false progress. Engineers could close tasks in individual services while the civic reporting loop remained broken. When the first end-to-end test was attempted, the gaps were not in one place; they were scattered across persistence, API contracts, UI assumptions, policy packs, and test fixtures.

### The Underlying Assumption

You assumed service decomposition would reduce complexity before the core workflow had been stabilized.

### Early Warning Signs

- More time is spent reconciling service boundaries than producing the first story bundle.
- Tests pass per service, but no single test executes ingest -> extract -> verify -> publish -> correct -> export.

## Failure Investigator 8 - Category Capture By Adjacent Products

### The Failure Story

While The Actual News refined its protocol, adjacent products improved their slices: claim verification tools marketed pre-publication workflows, credibility systems expanded labels, and provenance initiatives became a standard media-authenticity layer. Outsiders began describing The Actual News as "another AI fact checker" or "a transparent news site."

Because there was no conformance-backed local civic node to point to, the project could not defend its category. Its most original claim - public-interest verification infrastructure - remained a phrase, not an operational proof.

### The Underlying Assumption

You assumed the market would understand the distinction between a protocol-backed public record and adjacent trust tools without a working artifact.

### Early Warning Signs

- Landing copy or partner conversations center on "AI fact checking," "trust scores," or "balanced news."
- No export/replay/conformance demo exists to show the difference from tools that only label or verify claims.

## Synthesis

### The Most Likely Failure

The most likely failure is that the project remains protocol-rich but does not produce one complete civic story bundle. The repo already shows this risk: Phase 0 is strong, Phase 1 is open, and the runtime services beyond the gateway are still stubbed or in-memory. Without a controlling artifact, each improvement can be locally reasonable while the system still fails as a public-service news substrate.

### The Most Dangerous Failure

The most dangerous failure is shallow evidence provenance. If the evidence layer is weak, every other layer becomes decorative. A publish gate, claim ledger, correction log, and public UI all depend on evidence objects being durable, content-addressed, provenance-rich, and independently inspectable.

### The Hidden Assumption

The hidden assumption is that the system's truth value will emerge from architecture. It will not. It has to emerge from one narrow, disciplined civic workflow where every object is produced, inspected, corrected, exported, and replayed under pressure.

### The Revised Plan

1. Make the story bundle the controlling artifact.

   Create one canonical civic fixture containing story version, evidence objects, claims, evidence edges, verification tasks, reviews, gate result, correction event, outbox event, and export manifest. Every Phase 1 task should be judged by whether it improves that bundle.

2. Build evidence as the trust root first.

   Persist evidence in PostgreSQL, hash actual bytes, store source class, collection time, license, publisher/source URL, derivation chain, and content-length/media type. Add tests proving that changed content changes identity and that derivative artifacts point back to originals.

3. Keep claim extraction human-governed.

   Treat model output as proposals. Add review states for claim split/merge/edit/accept/reject before verification. Track extraction error rates as a product metric.

4. Turn gate failures into workflow tasks.

   For each failed metric, return the specific blocking claims and the smallest next action: add primary evidence, mark interpretation, request corroboration, resolve contradiction, or append correction.

5. Reframe the UI around record inspection.

   The story page should lead with bundle integrity: claim coverage, evidence ratio, correction status, policy pack version, export/replay controls, and reviewer/provenance indicators. The feed should be navigation, not the product metaphor.

6. Pull minimum governance forward.

   For the first story bundle, include actor roles, reviewer identity, COI disclosure display, and a funding/governance note. Do not wait for Phase 3 to prove legitimacy primitives.

7. Collapse service ambition until the loop works.

   It is acceptable for v1 to have a gateway-first or monolithic orchestration path if it produces the full loop. Preserve contracts, but optimize implementation around the first complete artifact.

8. Name and demonstrate the category.

   Use the phrase "conformance-backed civic record node" consistently. Demonstrate export/replay/conformance in public materials so the project is not confused with fact-checking or credibility scoring.

### Pre-Launch Checklist

- A single end-to-end test executes ingest -> extract -> review -> publish -> correct -> export -> replay from a clean database.
- Evidence hashes are computed from actual content bytes, and provenance includes source class, collection timestamp, source/publisher identity, license, and derivation chain.
- Gate failure responses identify blocking claim IDs and actionable remediation steps.
- The public story page exposes claim/evidence/correction traversal, policy pack version, and export/replay affordances without hiding them behind an optional panel.
- The demo story includes at least one reviewer, one COI/governance disclosure, one correction event, and one independently replayable bundle manifest.

## Concise Summary

Most likely failure: the repo keeps improving architecture but never produces one complete civic story bundle. Hidden assumption: truth will emerge from architecture rather than from a narrow workflow that produces, checks, corrects, exports, and replays real records. Single most important revision: make one end-to-end local civic story bundle the controlling artifact for every next task.
