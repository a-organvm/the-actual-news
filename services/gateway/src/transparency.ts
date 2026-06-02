import { createHash } from "node:crypto";

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

export type MerkleProofStep = {
  side: "left" | "right";
  hash: string;
};

export type MerkleProof = {
  leaf_hash: string;
  leaf_index: number;
  proof: MerkleProofStep[];
};

export function normalizeJson(value: unknown): JsonValue {
  if (value === null || value === undefined) return null;

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value.map((item) => normalizeJson(item));
  }

  if (typeof value === "object") {
    const out: { [key: string]: JsonValue } = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      out[key] = normalizeJson(child);
    }
    return out;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    return value;
  }

  if (typeof value === "boolean" || typeof value === "string") return value;

  return String(value);
}

export function canonicalJson(value: unknown): string {
  return stringifyCanonical(normalizeJson(value));
}

export function sha256Hex(value: string): string {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

export function hashCanonical(value: unknown): string {
  return sha256Hex(canonicalJson(value));
}

export function merkleLeafHash(value: unknown): string {
  return sha256Hex(`leaf:${canonicalJson(value)}`);
}

export function merkleParentHash(left: string, right: string): string {
  return sha256Hex(`node:${left}:${right}`);
}

export function merkleRoot(leafHashes: string[]): string {
  if (leafHashes.length === 0) return sha256Hex("empty:");

  let level = [...leafHashes];
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      next.push(merkleParentHash(left, right));
    }
    level = next;
  }
  return level[0];
}

export function merkleProof(leafHashes: string[], leafIndex: number): MerkleProof {
  if (leafIndex < 0 || leafIndex >= leafHashes.length) {
    throw new Error(`leaf index ${leafIndex} out of range`);
  }

  const proof: MerkleProofStep[] = [];
  let index = leafIndex;
  let level = [...leafHashes];

  while (level.length > 1) {
    const isRight = index % 2 === 1;
    const pairIndex = isRight ? index - 1 : index + 1;
    const pairHash = level[pairIndex] ?? level[index];

    proof.push({
      side: isRight ? "left" : "right",
      hash: pairHash
    });

    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      next.push(merkleParentHash(left, right));
    }

    index = Math.floor(index / 2);
    level = next;
  }

  return {
    leaf_hash: leafHashes[leafIndex],
    leaf_index: leafIndex,
    proof
  };
}

export function verifyMerkleProof(root: string, proof: MerkleProof): boolean {
  let current = proof.leaf_hash;

  for (const step of proof.proof) {
    current =
      step.side === "left"
        ? merkleParentHash(step.hash, current)
        : merkleParentHash(current, step.hash);
  }

  return current === root;
}

function stringifyCanonical(value: JsonValue): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return JSON.stringify(value);
  if (typeof value === "string") return JSON.stringify(value);

  if (Array.isArray(value)) {
    return `[${value.map((item) => stringifyCanonical(item)).join(",")}]`;
  }

  const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries
    .map(([key, child]) => `${JSON.stringify(key)}:${stringifyCanonical(child)}`)
    .join(",")}}`;
}
