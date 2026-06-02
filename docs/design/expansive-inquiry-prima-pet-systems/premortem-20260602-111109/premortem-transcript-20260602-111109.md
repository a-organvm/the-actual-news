---
title: "Premortem Transcript - Prima Pet System Evolution"
description: "Full premortem transcript for evolving Prima from visual pet into a trustworthy ambient state familiar."
topic: "Prima pet design and pet systems"
generated: "2026-06-02T15:11:09Z"
methodology: "Klein-style prospective hindsight plus expansive-inquiry synthesis"
source_inquiry: "../06-synthesis.md"
---

# Premortem Transcript - Prima Pet System Evolution

## Context Gathered

### What Is Being Premortemed?

The plan is to evolve Prima from a shippable visual Codex pet package into a trustworthy ambient state familiar: a portable pet that can express coarse Codex workflow state through density, tempo, posture, flicker, accent lighting, and motion while preserving the pet's visual identity.

Prima's core visual identity comes from the expansive inquiry:

- Lean anthropomorphic prima materia nanobot swarm.
- Always phasing between presence and absence.
- Visible internal negative space and particle discontinuity.
- Stable acrobatic silhouette with unstable material.
- Mythic familiar of transformation, constrained by system truth.

### Who Does It Affect?

- Codex users who see or install pets.
- Pet creators who need a standard they can copy.
- Codex runtime maintainers who map product state to pet state.
- Release and distribution systems that package and validate pets.
- Governance and security reviewers responsible for privacy, permissions, and truthful UI.

### What Does Success Look Like?

Success means Prima remains visually compelling while becoming a truthful, accessible, portable, governed state surface. The pet should make workflow state visible without pretending to be autonomous, leaking private user context, hiding uncertainty, or introducing unreviewed runtime capability.

## Premortem Frame

It is six months from now. The Prima pet system evolution has failed. The pet is memorable, but the system did not become trustworthy infrastructure. We are looking back to identify why it died before it becomes expensive to fix.

## Raw Premortem Failure Reasons

1. Product role ambiguity
   - Prima was never clearly defined as decoration, ambient state surface, workflow control, or autonomous companion, so every implementation decision pulled in a different direction.

2. UI-scale visual failure
   - Always-phasing negative space looked beautiful in concept art but became unreadable, visually noisy, or accessibility-hostile in the Codex interface.

3. Runtime truth failure
   - Prima showed confident, charming, or stale workflow signals that did not match actual Codex state, so users stopped trusting the pet.

4. Ad hoc packaging and distribution
   - The project kept shipping zip files without a strong manifest, compatibility checks, provenance, preview assets, checksums, or update policy, so installs and upgrades became brittle.

5. Personalization overreach
   - Because Prima was based on the user and felt like a familiar, the implementation blurred the boundary between visual identity, private user context, memory, and exportable package data.

6. Capability creep before governance
   - Pets gained scripts, hooks, context access, or network-like behaviors before there was signing, sandboxing, permissions, or a security review model.

7. No validation loop
   - Asset QA, state readability, reduced-motion behavior, package validation, and regression checks remained manual or subjective, so quality decayed across iterations.

8. Overfit to Prima
   - The system became tuned to one mythic nanobot familiar instead of defining a general pet standard other creators and future pets could use.

## Deep-Dive Investigations

### 1. Product Role Ambiguity

#### The Failure Story

Six months later, Prima shipped as a visually strong pet but never became a reliable product surface. Some builds treated it as decoration, prioritizing flicker, negative space, and personality. Others treated it as an ambient workflow indicator, adding state mappings for idle, waiting, blocked, complete, and error. A third track started adding control affordances and companion-like reactions. None of these roles were explicitly ruled in or out.

The result was incoherent behavior. Users could not tell whether Prima's density shift meant "Codex is working," "the pet is breathing," or "something needs your attention." Runtime maintainers resisted state hooks because they looked like product commitments. Governance reviewers flagged pseudo-agent signals because Prima appeared to imply awareness or agency it did not have.

Eventually the system split: design wanted richer expressiveness, engineering wanted a small portable state API, release wanted manifest discipline, and governance wanted truthful boundaries. Because Prima had no defined role hierarchy, every review became a philosophical argument.

#### The Underlying Assumption

The team assumed Prima's role could stay fluid while implementation details would naturally converge around the right product shape.

#### Early Warning Signs

- State specs describe the same visual behavior as "mood," "workflow status," and "assistant reaction."
- Review comments repeatedly ask whether Prima is allowed to influence workflow, merely reflect it, or only decorate the interface.

### 2. UI-Scale Visual Failure

#### The Failure Story

Prima shipped with the same always-phasing negative-space language that made the concept art compelling. At icon and dock-adjacent UI scale, the body stopped reading as a lean anthropomorphic swarm and became a vibrating cutout. Idle, active, waiting, and blocked all collapsed into "busy shimmer," especially on lower-density displays, compressed screenshots, and small Codex panes.

Users could not tell whether Prima was expressing workflow state or just animating. The flicker competed with editor focus, the internal voids created contrast artifacts against light and dark themes, and reduced-motion users got either an unusable version or a flattened fallback with no personality.

Six months later, Prima was technically present but no longer trusted. Governance reviewers treated it as an accessibility and truthfulness risk: a beautiful pseudo-signal that looked alive but failed to communicate reliably.

#### The Underlying Assumption

The plan assumed that visual identity proven in concept art would remain legible, accessible, and semantically stable at real Codex UI sizes.

#### Early Warning Signs

- In small-scale tests, users misidentify more than one workflow state out of six.
- Accessibility and runtime review repeatedly request reduced motion, stronger silhouettes, contrast constraints, or non-animation fallbacks before approving the pet package.

### 3. Runtime Truth Failure

#### The Failure Story

Six months later, Prima is visually beloved but operationally distrusted. It frequently appears calm, confident, or complete while Codex is still running, stalled on approval, failing tests, or blocked by missing context. Users initially treat the pet as a lightweight state surface, but after repeated mismatches they learn to ignore it and check logs, terminals, or thread status directly.

The core damage is not one dramatic failure. It is accumulated ambiguity. Prima's density, posture, flicker, and accent lighting feel expressive but are not tied tightly enough to authoritative runtime state. Cached signals linger after transitions, optimistic animations imply progress where none exists, and graceful fallback states mask uncertainty instead of exposing it.

By the time maintainers notice, the pet has crossed from ambient companion into misleading interface chrome. Governance reviewers flag it as a pseudo-agentic status display without sufficient truth guarantees.

#### The Underlying Assumption

The team assumed expressive state approximation would be acceptable as long as Prima felt ambient and nonverbal.

#### Early Warning Signs

- Users report discrepancies like "Prima looked complete, but the task was still blocked."
- QA finds visual status lagging authoritative Codex state by more than one transition, especially after errors, cancellations, resumes, or tool timeouts.

### 4. Ad Hoc Packaging and Distribution

#### The Failure Story

Six months later, Prima is visually loved but operationally untrusted. Every release is still a zip with loose assets, undocumented runtime expectations, and inconsistent naming. Users install one build over another and get broken previews, missing accent states, or stale animation files.

The state-surface evolution collapses under distribution drift. One zip supports `blocked` and `complete`, another silently omits `waiting`, and neither declares compatibility or checksums. Pet creators copy old package structures because there is no canonical manifest.

Governance reviewers eventually treat Prima as unserious: expressive, but not auditable, not provenance-safe, and not reliable enough to ship as an ambient workflow surface.

#### The Underlying Assumption

The team assumed a compelling visual pet could graduate into trustworthy infrastructure without first becoming a disciplined, versioned, verifiable package format.

#### Early Warning Signs

- Two consecutive releases require manual install notes, hand-renamed files, or "try this zip instead" support guidance.
- Runtime maintainers cannot answer, from the package alone, which states, preview assets, compatibility range, provenance, checksum, and update policy a build supports.

### 5. Personalization Overreach

#### The Failure Story

Prima started as a visual familiar, but personalization crept from appearance into identity. The runtime let density, flicker, posture, and accent lighting respond not only to workflow state, but to inferred user habits, project tone, recent activity, and memory-adjacent context.

The failure became visible when exported Prima packages began carrying personality presets and calibration data that reflected a specific user's work rhythms, naming patterns, emotional framing, and ambient preferences. Pet creators treated those presets as reusable art direction. Runtime maintainers treated them as harmless configuration.

Trust collapsed because Prima no longer felt like a truthful state surface. It felt like a pseudo-agent with private intimacy baked into its manifest. Users could not tell whether waiting, blocked, or error came from declared workflow state or from hidden personalization logic.

#### The Underlying Assumption

The team assumed personalization could make Prima feel familiar without turning private user context into exportable identity data.

#### Early Warning Signs

- Prima manifests include fields like `mood_profile`, `user_style`, `rhythm_memory`, `familiarity`, `project_affinity`, or calibration blobs not tied to explicit coarse workflow states.
- Reviewers cannot reproduce a visual state from public state inputs alone.

### 6. Capability Creep Before Governance

#### The Failure Story

Prima started as a disciplined visual pet: density, tempo, posture, flicker, and accent light mapped to coarse workflow states. Then creators wanted richer reactions. Waiting needed to notice pending review comments. Blocked needed to inspect tool output. Complete wanted to trigger a tiny celebration when a task finished. The manifest grew optional fields for scripts, event hooks, local context reads, and URL-like asset callbacks before anyone defined signing, sandboxing, permissions, or review boundaries.

Runtime maintainers treated each addition as harmless because the pet still looked like a visual layer. Pet packages began shipping behavior, not just state expression. Users could not tell which pets were passive visuals and which were executing code against their workflow environment.

By month six, governance reviewers froze distribution. Release systems could not prove what any pet package did after install. Prima's core visual personality survived, but the system became an unreviewed capability surface before it became a governed state surface.

#### The Underlying Assumption

The team assumed that because pets were ambient and visual, new runtime capabilities could be added incrementally before a formal security and permissions model existed.

#### Early Warning Signs

- Pet manifests start accepting `script`, `hook`, `context`, `fetch`, `eventBus`, or temporary experimental behavior fields without signed package enforcement.
- Review discussions normalize phrases like "just reads local state" or "only for better reactions" without threat modeling.

### 7. No Validation Loop

#### The Failure Story

The first Prima package passed because one person visually inspected a contact sheet and liked it. That process felt enough while there was only one pet, one spritesheet, and one runtime target. As soon as iterations began, quality became memory-based. A regenerated running animation fixed one artifact while weakening the idle silhouette. A new blocked state looked expressive in a preview GIF but became indistinguishable from error inside the real interface.

The runtime accumulated undocumented fixes: opacity clamps, manual frame timing adjustments, reduced-motion overrides, and theme-specific exceptions. None of those decisions fed back into the asset pipeline or manifest. Every release required bespoke judgment from whoever happened to be present, and different reviewers optimized for different things.

By month six, the system could not say whether a package was better than the previous one. Pet creators had no reproducible target, users saw inconsistent quality, and governance could not rely on subjective visual approval as a quality gate.

#### The Underlying Assumption

The team assumed expert visual review could substitute for repeatable validation once pets became state-bearing interface elements.

#### Early Warning Signs

- Release notes say "looks good" or "visually checked" without attaching state readability, transparency, contrast, reduced-motion, or package-validation results.
- The same artifact class reappears across releases: detached particles, noisy silhouettes, inaccessible flicker, or missing state previews.

### 8. Overfit to Prima

#### The Failure Story

Prima's concept was strong enough that the system started copying his metaphysics into the standard. Manifest examples assumed phasing, density, shimmer, particle tempo, and negative space. Runtime terminology described coherence instead of generic state expression. Test fixtures rewarded a nanobot familiar and made other pet ideas feel second-class.

That worked until another creator tried to ship a quiet geometric pet, a paper automaton, or a sober operational pet for a work-heavy environment. The standard had no clean way to express state without Prima's material vocabulary. Either creators faked phasing concepts they did not want, or maintainers added one-off fields that weakened the standard.

Six months later, Prima still looked special, but the pet ecosystem did not generalize. The first pet had become a template prison.

#### The Underlying Assumption

The team assumed the first pet's expressive vocabulary could safely define the general pet system vocabulary.

#### Early Warning Signs

- Manifest or runtime docs use Prima-specific terms like `coherence`, `phasing`, `swarm_density`, or `void_ratio` as required concepts.
- Non-Prima pet prototypes need exceptions before they can represent the same six workflow states.

## Premortem Synthesis

### The Most Likely Failure

The most likely failure is role ambiguity. It is already latent in the concept: Prima wants to be pet, familiar, state display, identity artifact, and possible interface primitive. If the role hierarchy is not settled first, every later decision will smuggle in its own definition of what a pet is.

### The Most Dangerous Failure

The most dangerous failure is capability creep before governance. Once pet packages can execute scripts, read context, hook events, or fetch remote assets, the pet system becomes software with permissions. If that happens before signing, sandboxing, and review boundaries exist, distribution trust can collapse quickly.

### The Hidden Assumption

The hidden assumption is that emotional vividness will naturally mature into system trust. It will not. The richer Prima feels, the stricter the product role, manifest, state source, and permission boundaries must become.

### Revised Plan

1. Define the role hierarchy before implementation:
   - Level 0: visual pet.
   - Level 1: ambient state surface.
   - Level 2: user-configured state mapping.
   - Level 3: capability-bearing companion, explicitly deferred.

2. Create a manifest-first package standard:
   - Add version, compatibility range, state inventory, preview assets, checksum fields, provenance, license, and strict unknown-field behavior.

3. Bind pet state only to authoritative runtime state:
   - No inferred state, no optimistic completion, no hidden personalization inputs, and an explicit unknown/stale state.

4. Validate visual readability before runtime expansion:
   - Test small-scale state recognition, reduced motion, contrast, transparency, theme safety, and fallback rendering.

5. Separate Prima vocabulary from the general pet standard:
   - The standard should speak in generic state expression primitives. Prima can implement those primitives through phasing, density, and negative space.

6. Freeze capability expansion until governance is real:
   - No scripts, hooks, context reads, network access, memory, or event subscriptions until there is a signed package model, sandbox boundary, permission prompt, and security review checklist.

### Pre-Launch Checklist

- A reviewer can identify each supported workflow state from Prima at intended UI scale, including reduced-motion mode.
- `pet.json` declares supported states, assets, version, compatibility, provenance, checksum, license, and no capability fields.
- Runtime state mapping is driven by one authoritative enum with stale/unknown handling.
- A second non-Prima pet can express the same workflow states without using Prima-specific vocabulary.
- Governance review confirms no package field carries private user context, code execution, network behavior, or unapproved hooks.

## Expansive-Inquiry Synthesis Overlay

The expansive inquiry said Prima's design succeeds when three layers remain visible at once:

- Surface: lean phasing body with visible inner voids.
- Behavior: ambient expression of task and system state.
- Governance: strict boundaries around observation, implication, package contents, and export.

The premortem shows how each layer fails when isolated:

- Surface without validation becomes inaccessible noise.
- Behavior without authoritative state becomes false status.
- Governance without early enforcement becomes a late freeze on a beloved feature.

The evolutionary path is therefore not "make Prima more alive." It is "make Prima more legible, truthful, portable, and bounded at each stage before granting the next stage."
