---
title: "Prima Pet Evolutionary Implementation Plan"
date: "2026-06-02"
status: "in_progress"
source_inquiry: "../../docs/design/expansive-inquiry-prima-pet-systems/06-synthesis.md"
source_premortem: "../../docs/design/expansive-inquiry-prima-pet-systems/premortem-20260602-111109/premortem-transcript-20260602-111109.md"
---

# Prima Pet Evolutionary Implementation Plan

## North Star

Evolve Prima from a validated visual pet package into a trustworthy ambient state familiar.

Prima's surface can remain mythic: lean anthropomorphic prima materia, always phasing, visible internal voids, particles negotiating whether the body exists. The system underneath must be plain and strict: portable package, truthful state mapping, no hidden personalization, no unreviewed capability, and repeatable validation.

## Doctrine

1. Form is not state.
   - Form is who the pet is.
   - State is what the runtime knows.
   - Capability is what the pet is allowed to touch.

2. State expression must be honest.
   - The pet can only express authoritative runtime states.
   - Unknown and stale are real states, not fallback decoration.
   - Charm never outranks system truth.

3. Prima is an implementation of the pet standard, not the standard itself.
   - The standard speaks in generic state expression primitives.
   - Prima implements those primitives through phasing, density, coherence, negative space, and accent light.

4. Capability is deferred.
   - No scripts, event hooks, context reads, memory, network access, or remote-update behavior until signing, sandboxing, permissions, and security review exist.

## Inputs

- Expansive inquiry finding:
  - Prima succeeds when surface, behavior, and governance remain simultaneously visible.

- Premortem finding:
  - Prima fails if surface, behavior, and governance are allowed to evolve independently.

- Implementation consequence:
  - Each phase must add only one new class of power, and each class needs its own validation gate.

## Evolutionary Levels

### Level 0 - Shippable Visual Pet

Purpose: preserve Prima as a portable, validated pet package.

Scope:

- `pet.json`
- `spritesheet.webp`
- Preview/contact sheet
- Archive package
- Basic validation output

Non-goals:

- Runtime state semantics
- Personalization
- Scripts or hooks
- Context access

Exit gate:

- Package installs cleanly.
- Sprite dimensions and transparency validate.
- Contact sheet confirms all existing animation states render without detached artifacts or residue.
- Archive contains only expected files.

### Level 1 - Manifest-First Package Standard

Purpose: turn the pet package from "zip with assets" into a verifiable artifact.

Manifest fields:

- `schema_version`
- `pet_id`
- `name`
- `version`
- `description`
- `author`
- `license`
- `assets`
- `spritesheet`
- `frame_size`
- `animations`
- `supported_states`
- `compatibility`
- `provenance`
- `checksums`
- `preview`
- `capabilities`

Rules:

- `capabilities` must exist and be empty for Level 1.
- Unknown fields fail validation unless explicitly namespaced.
- No field may carry user history, memory, project affinity, inferred mood, or behavioral fingerprint data.

Exit gate:

- A validator can reject malformed packages.
- A runtime maintainer can know supported states and compatibility from the manifest alone.
- Repacking the same package produces the same checksums for unchanged assets.

### Level 2 - General State Expression Protocol

Purpose: define a pet-neutral state vocabulary before adding Prima-specific behavior.

Required states:

- `idle`
- `active`
- `waiting`
- `blocked`
- `complete`
- `error`
- `unknown`
- `stale`

State source rules:

- State comes from one authoritative runtime adapter.
- Visual state cannot be inferred from hidden local history.
- `complete` cannot display until completion is confirmed.
- `error` and `blocked` override decorative loops.
- `stale` displays when the pet has not received a valid transition within the runtime threshold.

Exit gate:

- A test fixture can replay state transitions and produce deterministic pet state.
- State transitions after cancellation, tool timeout, resume, and failure are covered.
- A second non-Prima pet can implement the same protocol.

### Level 3 - Prima State Mapping

Purpose: map the generic state protocol into Prima's material language.

Prima-specific expression map:

- `idle`
  - Low-density breathing flux; stable silhouette; visible inner voids.

- `active`
  - Higher particle density; faster edge phase; sharper lean posture.

- `waiting`
  - Attentive tilt; suspended particles; moderate coherence.

- `blocked`
  - Wider voids; fragmented outline; slower reassembly.

- `complete`
  - Brief high-coherence pulse; then returns to idle flux.

- `error`
  - Unstable edge shimmer; restrained warning accent; no panic loop.

- `unknown`
  - Neutral low-contrast flux; no confident posture.

- `stale`
  - Desaturated, low-tempo coherence loss until authoritative state returns.

Exit gate:

- Small-scale reviewers identify at least five of six primary states correctly.
- Reduced-motion mode preserves state distinction without flicker.
- State remains readable across light and dark themes.
- Animation does not compete with primary editor/task focus.

### Level 4 - Validation and Regression Harness

Purpose: make pet quality repeatable.

Validation dimensions:

- Manifest schema.
- Required files.
- Archive shape.
- Checksums.
- Sprite dimensions.
- Transparency residue.
- Animation frame count.
- Preview generation.
- State inventory.
- Reduced-motion fallback.
- Theme contrast.
- Small-scale state recognition.
- No forbidden fields.
- No capability fields outside the allowed phase.

Artifacts per release:

- `validation.json`
- `contact-sheet.png`
- state preview GIFs or video strip
- `CHANGELOG.md`
- `checksums.txt`
- install note

Exit gate:

- Release cannot ship without validation artifacts.
- Regressions are compared against the previous package.
- At least one non-Prima fixture passes the same package validator.

### Level 5 - Distribution Discipline

Purpose: make installing, sharing, and upgrading safe.

Package contents:

- `prima/pet.json`
- `prima/spritesheet.webp`
- `prima/preview.png`
- `prima/CHANGELOG.md`
- `prima/validation.json`
- `prima/checksums.txt`

Release process:

1. Build package in a clean output directory.
2. Run validator.
3. Generate previews.
4. Create archive.
5. Verify archive contents.
6. Install into a clean local pet directory.
7. Confirm runtime can load it.
8. Record compatibility and known limitations.

Exit gate:

- A new user can install from the archive without hand-renaming files.
- Upgrade path is explicit.
- Old clients fail gracefully or reject the package with a clear reason.

### Level 6 - Pet Standard Generalization

Purpose: prevent the standard from overfitting to Prima.

Required fixtures:

- Prima: phasing nanobot familiar.
- Static-simple pet: minimal animation, no phasing.
- Geometric pet: abstract shape language.
- Operational pet: restrained work-focused style.

Standard vocabulary:

- Use `state`, `animation`, `timing`, `accent`, `fallback`, and `capability`.
- Avoid required Prima-specific terms such as `coherence`, `phasing`, `swarm_density`, or `void_ratio`.
- Permit Prima-specific terms only inside a namespaced extension such as `x-prima`.

Exit gate:

- All fixtures express the required workflow states.
- No fixture requires a special runtime exception.
- Pet creator documentation explains the generic state protocol before showing Prima examples.

### Level 7 - Capability Governance, Deferred

Purpose: define the requirements before pets can do more than express state.

Do not implement Level 7 until Levels 1-6 are stable.

Prerequisites:

- Signed packages.
- Permission declarations.
- Runtime sandbox.
- Security review checklist.
- Capability-specific test harness.
- User-facing permission prompts.
- Deny-by-default behavior.
- Package provenance and revocation path.

Capability classes:

- Local state read.
- Event subscription.
- Scripted animation logic.
- External asset fetch.
- Network communication.
- Memory access.
- User interaction callbacks.

Exit gate:

- Threat model approved.
- Sandbox tested.
- Permission prompts verified.
- Revocation tested.
- Passive pets and capability-bearing pets are visually and structurally distinguishable.

## Failure-to-Plan Mapping

| Premortem failure | Plan response |
| --- | --- |
| Product role ambiguity | Doctrine plus evolutionary levels define role hierarchy before implementation. |
| UI-scale visual failure | Level 3 requires state recognition, reduced-motion, theme, and focus checks. |
| Runtime truth failure | Level 2 binds visual state to authoritative runtime state and adds unknown/stale. |
| Ad hoc packaging | Level 1 and Level 5 make manifest, checksums, compatibility, and release process mandatory. |
| Personalization overreach | Level 1 forbids private user context in package fields; Level 2 forbids hidden state inputs. |
| Capability creep | Level 7 is explicitly deferred until signing, sandboxing, permissions, and review exist. |
| No validation loop | Level 4 creates repeatable validation artifacts and release gates. |
| Overfit to Prima | Level 6 requires non-Prima fixtures and generic vocabulary. |

## Milestone Sequence

### Milestone A - Baseline Freeze

Deliverables:

- Record current Prima package path.
- Record archive contents.
- Attach existing validation result.
- Generate preview/contact sheet.
- Create `CHANGELOG.md` entry for the current baseline.

Acceptance:

- The current pet is reproducible from known files.
- No untracked generated artifact is required to install it.

### Milestone B - Manifest Schema Draft

Deliverables:

- Draft JSON schema for `pet.json`.
- Example manifest for Prima.
- Example manifest for a non-Prima fixture.
- Validator stub.

Acceptance:

- Validator accepts the baseline package.
- Validator rejects missing version, assets, states, compatibility, checksums, and forbidden private fields.

### Milestone C - State Protocol Draft

Deliverables:

- State enum.
- Transition precedence.
- Unknown/stale behavior.
- Runtime adapter contract.
- Replay fixture for state transitions.

Acceptance:

- State replay is deterministic.
- Error, blocked, cancellation, timeout, and completion transitions are covered.

### Milestone D - Prima State Redesign

Deliverables:

- State map for each Prima animation or overlay.
- Reduced-motion fallback.
- Theme-safe contrast note.
- Small-scale preview sheet.

Acceptance:

- Reviewers identify states at target UI size.
- Reduced-motion mode remains meaningful.
- No state relies on color alone.

### Milestone E - Validation Harness

Deliverables:

- Package validator.
- Preview generator.
- Archive verifier.
- Regression report format.

Acceptance:

- Release artifacts are produced by command, not memory.
- Failed checks block packaging.

### Milestone F - Distribution Release

Deliverables:

- Versioned zip.
- Checksums.
- Release notes.
- Install instructions.
- Compatibility note.

Acceptance:

- Clean install works.
- Upgrade from previous package works or fails with a clear reason.

### Milestone G - General Pet Standard

Deliverables:

- Non-Prima fixtures.
- Creator docs.
- Standard vocabulary.
- Namespaced extension guidance.

Acceptance:

- The standard can describe Prima without requiring every pet to be Prima-like.

## Metrics

- State recognition:
  - Target: reviewers correctly identify at least five of six primary states at target UI scale.

- State truth:
  - Target: no visual state lags authoritative runtime state by more than one transition in test replay.

- Package reliability:
  - Target: validator blocks malformed archive shape, missing fields, checksum mismatch, forbidden fields, and unknown unnamespaced fields.

- Accessibility:
  - Target: reduced-motion mode preserves all critical states; no critical state uses color as its only signal.

- Generality:
  - Target: at least three non-Prima fixtures pass the same manifest and state protocol.

- Governance:
  - Target: no package contains capability fields until Level 7 prerequisites are implemented.

## Open Questions

- What is the exact Codex runtime source of authoritative workflow state?
- Does the current pet runtime support state overlays, or only animation selection?
- Should `unknown` and `stale` be visible states or runtime-only fallbacks?
- Where should package validation live: pet skill, Codex runtime, repo tool, or all three?
- What license should exported pet packages carry by default?
- What compatibility range should `pet.json` declare against: Codex app version, pet runtime schema, or both?

## Immediate Next Step

Draft the Level 2 runtime state protocol adapter. Do not add behavior hooks, scripts, context reads, memory, network access, or personalization until the passive package and state protocol remain stable across a second non-Prima fixture.

## Implementation Log

### 2026-06-02 - Level 1 Package Discipline

Completed:

- Added `tools/pets/pet-manifest.schema.json`.
- Added `tools/pets/validate-pet-package.mjs`.
- Added root `pnpm pet:validate` script.
- Upgraded the installed Prima package manifest at `/Users/4jp/.codex/pets/prima/pet.json` while preserving legacy loader fields.
- Added live package artifacts: `preview.png`, `validation.json`, `CHANGELOG.md`, and `checksums.txt`.
- Rebuilt `/Users/4jp/.codex/pets/prima.zip`.
- Recorded validation evidence at `docs/design/expansive-inquiry-prima-pet-systems/implementation/level-1-validation-20260602-112355.json`.

Deferred:

- Runtime adapter implementation.
- Small-scale state recognition testing.
- Non-Prima fixture validation.
- Signing, sandboxing, permissions, scripts, hooks, context reads, memory, and network behavior.
