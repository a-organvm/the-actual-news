import { describe, expect, it } from "vitest";
import {
  canonicalJson,
  hashCanonical,
  merkleLeafHash,
  merkleProof,
  merkleRoot,
  verifyMerkleProof
} from "../transparency.js";

describe("canonicalJson", () => {
  it("sorts object keys recursively", () => {
    expect(canonicalJson({ b: 2, a: { d: 4, c: 3 } })).toBe('{"a":{"c":3,"d":4},"b":2}');
  });
});

describe("hashCanonical", () => {
  it("is stable for equivalent object key orderings", () => {
    const left = hashCanonical({ story_id: "S1", values: { b: 2, a: 1 } });
    const right = hashCanonical({ values: { a: 1, b: 2 }, story_id: "S1" });

    expect(left).toBe(right);
    expect(left).toMatch(/^sha256:[a-f0-9]{64}$/);
  });
});

describe("Merkle proofs", () => {
  it("verifies an inclusion proof against the root", () => {
    const leaves = [
      merkleLeafHash({ event_id: "E1", payload: { story_id: "S1" } }),
      merkleLeafHash({ event_id: "E2", payload: { story_id: "S2" } }),
      merkleLeafHash({ event_id: "E3", payload: { story_id: "S3" } })
    ];
    const root = merkleRoot(leaves);
    const proof = merkleProof(leaves, 2);

    expect(root).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(verifyMerkleProof(root, proof)).toBe(true);
  });
});
