# ADR-004: Transparency Checkpoints Before Blockchain Anchoring

## Status

Accepted

## Date

2026-06-02

## Context

`the-actual-news` already uses content-addressed evidence, immutable story versions, append-only corrections, deterministic publish gates, and a PostgreSQL outbox. These primitives provide the operational ledger needed for the MVP.

The remaining trust gap is external tamper-evidence: a third party should be able to detect if published story history or correction history was retroactively rewritten after publication. Public blockchains can provide an external timestamping and anchoring surface, but adding blockchain as a runtime dependency would increase cost, complexity, privacy risk, and operational coupling before the local ledger format is stable.

## Decision

The platform will not use blockchain as core storage, publish-gate execution, or runtime workflow infrastructure.

The platform will first implement local transparency checkpoints:

- published story bundles are serialized into a canonical public form;
- each bundle receives a deterministic `bundle_hash`;
- public ledger events are batched after publication;
- each batch receives a Merkle root checkpoint;
- inclusion proofs can be exposed through the public API;
- external anchoring remains optional and chain-neutral.

Any future blockchain integration must anchor checkpoint roots only. It must not store drafts, raw evidence, reviewer notes, personal data, or mutable workflow state on-chain.

## Consequences

### Positive

- Preserves the current SQL-backed deterministic publish gate.
- Gives auditors a concrete path to reconstruct public state.
- Keeps story reading, publishing, and correction available without blockchain infrastructure.
- Avoids locking the protocol to a specific chain or vendor.
- Provides a migration path to signed static logs, public-chain anchoring, or institutional federation.

### Negative

- The MVP does not receive external timestamp guarantees until checkpoints are published outside the application boundary.
- Canonical JSON and Merkle proof behavior must be tested carefully because small serialization drift changes hashes.
- A local checkpoint is still operator-controlled until independently mirrored, signed, or anchored.

## Follow-up Work

- Add canonical bundle hash conformance fixtures.
- Add local checkpoint persistence and API responses.
- Publish signed checkpoint artifacts before considering public-chain anchoring.
- Evaluate C2PA for media provenance and DID/VC references for actor credentials separately from checkpoint anchoring.

## References

- `docs/research/blockchain-implementation-exploration.md`
- `specs/protocol/core-protocol-spec-v1.md`
