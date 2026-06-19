# Blockchain Technology Implementation Exploration

Face: internal

## Status

Exploratory research note, 2026-06-02.

## Research Question

How, if at all, should `the-actual-news` use blockchain or adjacent decentralized technologies to strengthen a verifiable news ledger without weakening the existing protocol goals: deterministic publication gates, content-addressed evidence, append-only corrections, replayable public state, and low operational coupling?

## Current System Fit

The platform already has the primitives most blockchain pitches try to provide:

- Content-addressed evidence via `sha256:<hex>` identifiers.
- Immutable story versions.
- Append-only correction events.
- A deterministic publish gate.
- A PostgreSQL-backed outbox for replayable state changes.
- A protocol roadmap that includes federation, archival permanence, and public reconstruction.

That means the first blockchain use case should not be "put the ledger on-chain." The useful question is narrower: which public or shared-verifiability gaps remain after the local ledger is correct?

## Recommendation

Do not introduce blockchain as a core storage, publication, or workflow dependency in the MVP.

Use a staged approach:

1. Keep PostgreSQL as the canonical operational ledger.
2. Add canonical bundle serialization and Merkle-root computation for published story bundles.
3. Publish periodic transparency checkpoints outside the application boundary.
4. Only after that, evaluate public-chain anchoring, permissioned federation, or decentralized identity as optional verification layers.

The strongest initial blockchain-shaped implementation is a public anchoring layer: periodically commit a Merkle root of published story bundles and correction events to an external immutable medium. This gives third parties a way to detect retroactive tampering without forcing readers, publishers, or verifiers to depend on blockchain infrastructure at runtime.

## Candidate Patterns

| Pattern | What It Adds | Fit | Recommendation |
| --- | --- | --- | --- |
| Public-chain Merkle anchoring | External timestamp and tamper-evidence for batches of story/correction events | High | Explore after canonical bundle format exists |
| Permissioned consortium ledger | Shared institutional governance and replicated writes among known parties | Medium | Defer until Phase 5 federation or Phase 6 institutions |
| W3C DID and Verifiable Credentials | Portable actor, reviewer, issuer, and affiliation attestations | Medium-high | Explore for identity and reviewer trust, not as storage |
| C2PA Content Credentials | Signed provenance for media assets and AI/editorial transformations | High for media evidence | Adopt as evidence metadata integration candidate |
| IPFS/content-addressed distribution | External retrieval of immutable evidence or story bundles by content identifier | Medium | Optional archival/distribution layer, not source of truth |
| NFTs/tokens for stories or evidence | Ownership/market semantics | Low | Reject for core trust product |
| Smart-contract publish gate | On-chain gate logic | Low | Reject unless economics require on-chain settlement later |

## Architecture Option A: Public Transparency Anchoring

This is the best first exploration target.

### Flow

1. Publish succeeds through the existing SQL transaction.
2. The outbox emits `story.published.v1` or correction events.
3. A checkpoint worker builds a canonical batch:
   - story id
   - story version id
   - policy pack version
   - evidence hashes
   - claim hashes
   - correction event hashes
   - event outbox ids
4. The worker computes a Merkle root.
5. The root is written to a public checkpoint target.
6. The public API exposes:
   - checkpoint id
   - Merkle root
   - event range
   - inclusion proof for each story bundle

### Why It Fits

- Preserves existing deterministic publication logic.
- Adds independent tamper-evidence after publication.
- Avoids per-story gas costs if roots are batched.
- Lets external auditors reconstruct whether public history changed.
- Keeps failed or private drafts out of public chains.

### Open Implementation Choices

| Choice | Conservative Default |
| --- | --- |
| Batch cadence | Daily or every N published/corrected events |
| Canonicalization | JSON Canonicalization Scheme or a project-specific canonical JSON profile |
| Root target | Start with signed transparency log file; later public chain |
| Chain | If needed, use a low-cost EVM L2 only for checkpoints |
| Proof format | JSON inclusion proof attached to story bundle API |

## Architecture Option B: Permissioned Federation Ledger

Hyperledger Fabric and similar permissioned ledgers fit networks where known institutions share write authority and need policy-controlled membership. That could match later library/city/school deployments, but it is premature for this repo's current state.

Use this only when the product has multiple independent operators that need shared governance over a federated ledger. Until then, it creates operational burden without improving the single-platform MVP.

## Architecture Option C: Decentralized Identity and Verifiable Credentials

DIDs and Verifiable Credentials can help represent:

- reporter affiliation
- reviewer qualification
- conflict-of-interest declarations
- institutional publisher identity
- signed source attestations

This is a better fit than on-chain identity tables. Credentials can be verified by clients or auditors while the platform keeps local actor records for authorization and workflow.

The likely implementation path is:

1. Keep local `actors` and `coi_disclosures`.
2. Add optional credential references to actor profiles and reviews.
3. Verify credentials at ingestion/review time.
4. Store verification result and credential digest in the ledger.
5. Avoid putting personal identity data on-chain.

## Architecture Option D: C2PA for Media Evidence

C2PA is directly relevant for `primary_media` evidence. It provides signed provenance manifests for media assets and supports provenance/authenticity workflows. This maps cleanly to evidence object provenance:

- `provenance.chain` can include C2PA manifest references.
- `evidence_objects` can store manifest digests.
- verification tasks can flag missing, invalid, or untrusted manifests.
- story pages can expose media provenance without making C2PA a publication gate initially.

This should be explored before any custom media-provenance blockchain design.

## Architecture Option E: IPFS or Other Content-Addressed Distribution

The project already uses SHA-256 evidence ids. IPFS adds distributed retrieval via CIDs, not truth by itself. It may be useful for archive exports and federation bundles, but it should not replace internal blob storage or evidence hash verification.

Use it as an optional distribution layer:

- store internal blob URI as canonical operational location;
- store CID as an additional retrieval pointer;
- verify fetched content against the platform's evidence hash before trusting it.

## Rejected or Deferred Ideas

### On-chain Story Database

Rejected. Public chains are poor primary databases for editorial workflows, private drafts, reviewer notes, takedown-sensitive material, and high-volume evidence metadata. They also complicate privacy and correction semantics.

### On-chain Publish Gate

Rejected for now. The publish gate needs deterministic replay, but it does not need blockchain execution. SQL conformance tests are simpler, cheaper, and more inspectable. On-chain execution becomes relevant only if future payout or bounty settlement must trust gate results without trusting the platform operator.

### NFT Story Ownership

Rejected for the trust product. It adds market semantics that conflict with news as a public service and risks making attention economics re-enter through speculation.

## Risks

| Risk | Mitigation |
| --- | --- |
| Privacy leakage from permanent public records | Anchor only hashes/Merkle roots, never drafts, PII, raw reviewer notes, or sealed evidence |
| False sense of trust | Document that anchoring proves non-retroactive mutation, not factual truth |
| Operational complexity | Make anchoring asynchronous and non-blocking for publication |
| Vendor/chain lock-in | Keep checkpoint format chain-neutral |
| Canonicalization bugs | Build conformance tests before anchoring externally |
| Credential governance ambiguity | Separate local authorization from external credential verification |

## Implementation Roadmap

### Phase 0: No Blockchain Dependency

- Define canonical story bundle serialization.
- Add conformance fixtures for canonical hashes.
- Add `bundle_hash` or equivalent derived digest in story bundle responses.

### Phase 1: Local Transparency Log

- Add a checkpoint table that records event ranges and Merkle roots.
- Generate inclusion proofs locally.
- Expose checkpoint metadata through the public API.
- Add tests that reconstruct a root from fixtures.

### Phase 2: Signed Public Checkpoints

- Publish checkpoint files as signed static artifacts.
- Allow third-party reconstruction from exported bundles.
- Treat this as an archival/transparency feature, not a runtime dependency.

### Phase 3: External Anchoring Experiment

- Evaluate one public-chain checkpoint target and one non-chain transparency-log target.
- Compare cost, durability, client verification complexity, and governance fit.
- Keep the same checkpoint schema regardless of target.

### Phase 4: Federation and Identity Exploration

- Add optional DID/VC references for actors and institutional issuers.
- Add C2PA validation for `primary_media` evidence.
- Revisit permissioned ledgers only when there are multiple independent operating institutions.

## Decision Framework

Use blockchain only when all four conditions are true:

1. The data is already safe to make public forever as a digest or root.
2. The verification value comes from an external party not trusting the platform operator.
3. The same property cannot be achieved with simpler signed logs or reproducible exports.
4. The feature does not become a runtime dependency for reading, publishing, or correcting stories.

If any condition fails, keep the feature in the existing ledger and expose stronger cryptographic proofs instead.

## Source Notes

- C2PA specifications document signed manifests, content provenance, claims, assertions, and bindings to content. This supports media-provenance integration before custom blockchain design.
- W3C Verifiable Credentials Data Model 2.0 defines a credential/verifier model suitable for portable attestations about actors, roles, and qualifications.
- W3C DID Core defines decentralized identifier syntax, data model, DID documents, and controller concepts that can support credential subject/issuer identity.
- Ethereum proof-of-stake documentation describes transaction finality as economic finality backed by validator stake, which is enough for checkpoint anchoring but unnecessary for core editorial workflows.
- Hyperledger Fabric documentation frames Fabric as permissioned DLT for enterprise contexts with identity and policy-controlled governance, fitting later consortium/federation more than MVP.
- IPFS documentation frames CIDs as content-addresses based on cryptographic hashes; this is useful for retrieval and archival distribution but not a replacement for evidence validation.

## Sources

- C2PA Specifications: https://spec.c2pa.org/specifications/
- C2PA Technical Specification: https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html
- W3C Verifiable Credentials Data Model v2.0: https://www.w3.org/TR/vc-data-model-2.0/
- W3C Decentralized Identifiers v1.0: https://www.w3.org/TR/did-core/
- Ethereum Proof-of-Stake: https://ethereum.org/developers/docs/consensus-mechanisms/pos/
- Hyperledger Fabric Introduction: https://hyperledger-fabric.readthedocs.io/en/latest/whatis.html
- Hyperledger Fabric Security Model: https://hyperledger-fabric.readthedocs.io/en/release-2.5/security_model.html
- IPFS Content Addressing: https://docs.ipfs.tech/concepts/content-addressing/
