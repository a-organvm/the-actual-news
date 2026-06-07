# Civic Record Node - Canonical Bundle

This directory contains the canonical civic story bundle for Records Watch platform. The bundle represents a complete, replayable civic record that demonstrates the full verification spine: narrative, claims, evidence, corrections, and governance.

## Scenario

**City Council Budget Amendment for Riverside Park**

A city council meeting where a $2.3M budget amendment was approved for Riverside Park renovation. The story documents the vote, the funding sources, and a correction to the initial claim about the total project cost.

## Bundle Contents

- **Story**: City council budget amendment with one immutable version
- **Claims**: 6 atomic claims (factual, statistical, attribution types)
- **Evidence**: 4 evidence objects (primary records, dataset, secondary source)
- **Edges**: 7 claim-evidence relationships with strength values
- **Correction**: 1 correction (numerical correction on budget amount)
- **Actors**: 3 actors (reporter, verifier, editor) with roles
- **COI Disclosure**: 1 conflict-of-interest declaration
- **Verification Tasks**: 2 tasks (evidence gap, high-impact corroboration)
- **Reviews**: 1 structured review with verdict

## Usage

```bash
# Seed the canonical bundle into a clean database
pnpm civic:bundle:seed

# Verify the bundle against expected gate metrics
pnpm civic:bundle:verify

# Export current database state to canonical bundle JSON
pnpm civic:bundle:export

# Replay: import bundle into temp schema and validate invariants
pnpm civic:bundle:replay
```

`civic:bundle:verify` is an alias for `civic:bundle:replay`; both import the bundle into a temporary schema and validate the invariant set plus expected gate metrics.

## Schema

The bundle manifest follows `bundle-manifest.schema.json`. All objects are scoped to `platform_id: plf_local_01`.

## Invariants

The bundle must satisfy all 10 protocol invariants (I1-I10) after replay:

1. Published story versions are immutable
2. Evidence objects are immutable and content-addressed
3. Corrections are append-only
4. Claim text is stable once published
5. Publication gating is deterministic
6. Conformance tests pass independent of ingestion ordering
7. All objects share the same platform scope
8. Claims reference exactly one story version
9. Evidence edges reference existing objects
10. Corrections reference existing claims

## Expected Gate Metrics

| Metric | Value |
|--------|-------|
| Total claims | 6 |
| Unsupported claims | 0 |
| Contradicted claims | 0 |
| Primary-supported claims | 5 |
| Primary evidence ratio | 0.833 |
| Unsupported claim share | 0.0 |
| High-impact claims | 1 |
| High-impact corroborated | 1 |
| Corroboration OK | true |
| Publish gate pass | true |

The high-impact statistical claim ($2.3M budget) is corroborated by two independent sources (budget amendment document and council minutes).
