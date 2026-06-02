---
title: "Logic - Prima Pet Systems"
description: "Rational system branches for Prima as pet, interface, package, and governed artifact."
topic: "Prima pet design and pet systems"
stage: "logic"
ai_role: "Logic AI"
stage_number: 1
total_stages: 6
inquiry_type: expansive_collaborative
generated: "2026-06-02T15:07:20Z"
tags:
  - expansive-inquiry
  - logic
  - prima-pet-systems
methodology: multi-lens-collaborative-inquiry
---

## Five Lines

1. What is the pet's product role?
2. What systems does a pet touch?
3. What should "dynamic phasing" mean in runtime terms?
4. What is the correct distribution model?
5. What boundaries keep the pet useful without becoming invasive?

## Recursive Tree

- Product role
  - Why does the pet exist?
    - It gives Codex a persistent ambient presence that can carry status, mood, context, and continuity without opening a separate dashboard.
      - What if it remains only decorative?
        - Then the pet is still valuable as identity and delight, but the system should avoid pretending it has operational meaning.
  - How should the user read it?
    - As a peripheral signal: visible enough to notice state changes, quiet enough not to compete with the primary task.
      - What if the pet becomes too expressive?
        - It risks becoming a distraction or a false authority, especially if it appears to judge, warn, or advise without a real system contract.
  - What is the minimum useful behavior?
    - Idle, active-thinking, waiting-on-user, blocked, completed, and error states.
      - What if every state is visually phasing?
        - The phasing becomes the invariant material condition; task states become overlays in posture, density, hue, or particle tempo.

- Systems touched
  - How does a pet enter the system?
    - As local packaged assets: `pet.json`, `spritesheet.webp`, install location, name, version, and sprite metadata.
      - What if pets become extensible?
        - Then package metadata must declare capabilities, permissions, runtime hooks, supported clients, and update provenance.
  - How does a pet run?
    - Through the Codex UI animation runtime, frame selection, scaling rules, transparency handling, and state mapping.
      - What if runtime state becomes semantic?
        - The pet needs a small protocol: state inputs, transition rules, accessibility alternatives, and fallback behavior.
  - How does a pet persist?
    - Through local user configuration and optional shared package artifacts.
      - What if the pet is personalized?
        - Personalization data should remain separate from the portable pet package unless the user explicitly exports it.

- Dynamic phasing
  - Why make it always dynamic?
    - Because Prima's identity is not a body with particles attached; it is particles negotiating whether a body exists.
      - What if the sprite runtime is frame-based?
        - Each animation set should encode internal negative space, edge dissolution, density shifts, and limb trails rather than relying on procedural effects.
  - How can phasing express state?
    - Through density, coherence, and particle velocity.
      - What if the system is blocked?
        - Prima becomes more discontinuous, with larger visible voids and slower reassembly.
  - What if future runtimes allow shaders?
    - Prima becomes a good candidate for procedural rendering: particle fields, signed-distance masks, shimmer, opacity noise, and quantum flicker.
      - What must stay stable?
        - The silhouette, name, and personality contract must remain legible even as the material surface changes.

- Distribution
  - How should the current pet ship?
    - As a zip containing a single folder with `pet.json` and `spritesheet.webp`.
      - What if it is published publicly?
        - Add version, license, preview image, changelog, validation result, and install instructions.
  - How should users verify it?
    - Check archive contents, sprite dimensions, metadata, transparency validation, and no extra files.
      - What if a pet package carries code?
        - It needs a stricter trust model, signing, sandboxing, and declared permissions.
  - How should updates work?
    - Increment versions and treat visual changes as releases, not silent replacement.
      - What if old clients load new metadata?
        - The package should degrade gracefully and keep required fields minimal.

- Boundaries
  - Why set boundaries?
    - A pet that appears alive can easily imply agency, memory, or endorsement it does not have.
      - What if it reflects user style?
        - It should reflect selected traits and explicit interactions, not infer private identity without consent.
  - How should it touch task data?
    - It can react to coarse workflow state, not read arbitrary content by default.
      - What if context-aware behavior is desired?
        - Require opt-in scopes: current task status, active tool, test outcome, repo state, or calendar state.
  - What safety rule is central?
    - No pet behavior should obscure system truth, fake completion, hide failure, or simulate authority beyond available evidence.

## Strongest Branch

The strongest branch is the distinction between visual pet and interface primitive. Prima should begin as a validated portable visual package, then become a state-bearing companion only where the runtime has explicit state inputs. That preserves the mythic material design while preventing premature claims of agency.
