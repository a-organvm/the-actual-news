#!/usr/bin/env node

/**
 * Civic Bundle Export
 * 
 * Exports the current database state for a story into a canonical bundle JSON.
 * Usage: node tools/civic-bundle/export.mjs --story-id <id> [--output <path>]
 * 
 * Environment:
 *   POSTGRES_URI - PostgreSQL connection string (required)
 *   PLATFORM_ID  - Platform namespace (default: plf_local_01)
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const POSTGRES_URI = process.env.POSTGRES_URI;
if (!POSTGRES_URI) {
  console.error("Missing $POSTGRES_URI");
  process.exit(2);
}

const PLATFORM_ID = process.env.PLATFORM_ID || "plf_local_01";
const DEFAULT_STORY_ID = process.env.CIVIC_STORY_ID || "01JCYSTORY00000000000001";
const DEFAULT_SCHEMA = process.env.CIVIC_BUNDLE_SCHEMA || "bundle_01jcycivic000000000000001";

// Parse CLI args
const args = process.argv.slice(2);
let storyId = DEFAULT_STORY_ID;
let schema = DEFAULT_SCHEMA;
let outputPath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--story-id" && args[i + 1]) {
    storyId = args[i + 1];
    i++;
  } else if (args[i] === "--schema" && args[i + 1]) {
    schema = args[i + 1];
    i++;
  } else if (args[i] === "--output" && args[i + 1]) {
    outputPath = path.resolve(args[i + 1]);
    i++;
  }
}

function assertSafeIdentifier(value, label) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    console.error(`${label} must be a safe SQL identifier: ${value}`);
    process.exit(2);
  }
}

assertSafeIdentifier(schema, "schema");

function ulidLike() {
  return (Date.now().toString(36).toUpperCase().padStart(10, "0") +
    Math.random().toString(36).slice(2, 18).toUpperCase()).slice(0, 26);
}

async function main() {
  const pool = new Pool({ connectionString: POSTGRES_URI });
  const client = await pool.connect();

  try {
    console.error(`Exporting story: ${storyId}`);
    await client.query(`SET search_path TO ${schema}, public;`);

    // Fetch story
    const storyQ = await client.query(
      `SELECT story_id, platform_id, title, state, created_at, updated_at
       FROM stories WHERE story_id = $1 AND platform_id = $2`,
      [storyId, PLATFORM_ID]
    );

    if (storyQ.rowCount === 0) {
      console.error(`Story not found: ${storyId}`);
      process.exit(1);
    }

    const story = storyQ.rows[0];

    // Fetch story versions
    const versionsQ = await client.query(
      `SELECT story_version_id, story_id, body_markdown, disclosure_markdown, created_at
       FROM story_versions WHERE story_id = $1 ORDER BY created_at ASC`,
      [storyId]
    );

    // Fetch claims
    const claimsQ = await client.query(
      `SELECT claim_id, story_id, story_version_id, claim_type, text, entities, time_window,
              jurisdiction, support_status, confidence_model, confidence_review, created_at
       FROM claims WHERE story_id = $1 ORDER BY created_at ASC`,
      [storyId]
    );

    const claims = claimsQ.rows.map((r) => ({
      ...r,
      entities: typeof r.entities === "string" ? JSON.parse(r.entities) : (r.entities ?? []),
      time_window: typeof r.time_window === "string" ? JSON.parse(r.time_window) : (r.time_window ?? {})
    }));

    // Fetch evidence objects referenced by this story's claims
    const claimIds = claims.map((c) => c.claim_id);
    let evidenceObjects = [];
    let evidenceEdges = [];

    if (claimIds.length > 0) {
      const edgesQ = await client.query(
        `SELECT edge_id, claim_id, evidence_id_hash, relation, strength, reviewer_actor_id, notes, created_at
         FROM claim_evidence_edges
         WHERE claim_id = ANY($1)
         ORDER BY created_at ASC`,
        [claimIds]
      );

      evidenceEdges = edgesQ.rows.map((r) => ({
        ...r,
        strength: Number(r.strength)
      }));

      const evidenceHashes = [...new Set(evidenceEdges.map((e) => e.evidence_id_hash))];

      if (evidenceHashes.length > 0) {
        const evidenceQ = await client.query(
          `SELECT evidence_id_hash, platform_id, blob_uri, media_type, extracted_text, provenance, created_at
           FROM evidence_objects
           WHERE evidence_id_hash = ANY($1)`,
          [evidenceHashes]
        );

        evidenceObjects = evidenceQ.rows.map((r) => ({
          ...r,
          provenance: typeof r.provenance === "string" ? JSON.parse(r.provenance) : r.provenance
        }));
      }
    }

    // Fetch corrections
    const correctionsQ = await client.query(
      `SELECT correction_id, platform_id, claim_id, reason, details, created_at
       FROM corrections
       WHERE platform_id = $1
         AND claim_id = ANY($2)
       ORDER BY created_at ASC`,
      [PLATFORM_ID, claimIds]
    );

    const corrections = correctionsQ.rows.map((r) => ({
      ...r,
      details: typeof r.details === "string" ? JSON.parse(r.details) : (r.details ?? {})
    }));

    // Fetch event outbox
    const outboxQ = await client.query(
      `SELECT event_id, platform_id, event_type, event_version, payload, created_at
       FROM event_outbox
       WHERE platform_id = $1
       ORDER BY created_at ASC`,
      [PLATFORM_ID]
    );

    const eventOutbox = outboxQ.rows.map((r) => ({
      ...r,
      payload: typeof r.payload === "string" ? JSON.parse(r.payload) : r.payload
    }));

    // Fetch actors and COI disclosures scoped to this bundle platform.
    const actorsQ = await client.query(
      `SELECT actor_id, platform_id, display_name, role, created_at
       FROM actors WHERE platform_id = $1
       ORDER BY created_at ASC, actor_id ASC`,
      [PLATFORM_ID]
    );
    const actors = actorsQ.rows;

    const coiQ = await client.query(
      `SELECT disclosure_id, platform_id, actor_id, statement, valid_from, valid_to, created_at
       FROM coi_disclosures WHERE platform_id = $1
       ORDER BY created_at ASC, disclosure_id ASC`,
      [PLATFORM_ID]
    );
    const coiDisclosures = coiQ.rows;

    // Fetch verification tasks
    const tasksQ = await client.query(
      `SELECT task_id, platform_id, story_id, claim_id, task_type, status, created_at
       FROM verification_tasks WHERE story_id = $1`,
      [storyId]
    );

    const verificationTasks = tasksQ.rows;

    // Fetch reviews
    const taskIds = verificationTasks.map((t) => t.task_id);
    let reviews = [];
    if (taskIds.length > 0) {
      const reviewsQ = await client.query(
        `SELECT review_id, task_id, actor_id, verdict, notes, evidence_edges, created_at
         FROM reviews WHERE task_id = ANY($1)`,
        [taskIds]
      );
      reviews = reviewsQ.rows.map((r) => ({
        ...r,
        evidence_edges: typeof r.evidence_edges === "string" ? JSON.parse(r.evidence_edges) : (r.evidence_edges ?? [])
      }));
    }

    // Compute expected gate metrics
    const unsupportedClaims = claims.filter((c) => c.support_status === "unsupported");
    const contradictedClaims = claims.filter((c) => c.support_status === "contradicted");

    // Count primary-supported claims
    const primarySourceClasses = new Set(["primary_record", "primary_media", "primary_dataset"]);
    const primaryEvidenceObjects = evidenceObjects.filter(
      (e) => primarySourceClasses.has(e.provenance?.source_class)
    );
    const primaryEvidenceHashes = new Set(primaryEvidenceObjects.map((e) => e.evidence_id_hash));

    const primarySupportedClaimIds = new Set();
    for (const edge of evidenceEdges) {
      if (edge.relation === "supports" && primaryEvidenceHashes.has(edge.evidence_id_hash)) {
        primarySupportedClaimIds.add(edge.claim_id);
      }
    }

    const primarySupportedClaims = claims.filter((c) => primarySupportedClaimIds.has(c.claim_id));
    const totalClaims = claims.length;
    const primaryEvidenceRatio = totalClaims > 0 ? primarySupportedClaims.length / totalClaims : 0;
    const unsupportedClaimShare = totalClaims > 0 ? unsupportedClaims.length / totalClaims : 0;

    // High-impact detection
    const highImpactTypes = new Set(["statistical"]);
    const highImpactRegexes = [
      /(accus|illegal|fraud|crime|charged|indict|lawsuit|killed|injur|shoot|arrest|explos|terror|abuse)/i
    ];

    const highImpactClaims = claims.filter(
      (c) =>
        highImpactTypes.has(c.claim_type) ||
        highImpactRegexes.some((re) => re.test(c.text))
    );

    // Check corroboration for high-impact claims
    const independenceKeyFields = ["source", "publisher", "url", "blob_uri"];
    let highImpactCorroborated = 0;

    for (const hic of highImpactClaims) {
      const supportingEdges = evidenceEdges.filter(
        (e) => e.claim_id === hic.claim_id && e.relation === "supports"
      );

      const independenceKeys = new Set();
      for (const edge of supportingEdges) {
        const evidenceObj = evidenceObjects.find((e) => e.evidence_id_hash === edge.evidence_id_hash);
        if (evidenceObj?.provenance) {
          const key = independenceKeyFields
            .map((f) => evidenceObj.provenance[f] ?? "")
            .join("|");
          independenceKeys.add(key);
        }
      }

      if (independenceKeys.size >= 2) {
        highImpactCorroborated++;
      }
    }

    const corroborationOk = highImpactClaims.length === 0 || highImpactCorroborated === highImpactClaims.length;

    // Build the bundle
    const bundle = {
      manifest_version: "1.0.0",
      bundle_id: ulidLike(),
      platform_id: PLATFORM_ID,
      created_at: new Date().toISOString(),
      scenario: {
        title: story.title,
        description: `Exported from story ${storyId}`,
        civic_context: "municipal_government",
        jurisdiction: "local"
      },
      policy_pack: {
        policy_pack_version: "v1.0.0",
        publish_gates: {
          min_primary_evidence_ratio: 0.50,
          max_unsupported_claim_share: 0.10,
          max_contradicted_claims: 0,
          require_high_impact_corroboration: true,
          high_impact_min_independent_sources: 2
        },
        evidence: {
          primary_source_classes: ["primary_record", "primary_media", "primary_dataset"],
          independence_key_fields: ["source", "publisher", "url", "blob_uri"]
        },
        claim: {
          high_impact_claim_types: ["statistical"],
          high_impact_regexes: [
            "(accus|illegal|fraud|crime|charged|indict|lawsuit|killed|injur|shoot|arrest|explos|terror|abuse)"
          ]
        }
      },
      actors,
      coi_disclosures: coiDisclosures,
      ledger: {
        stories: [story],
        story_versions: versionsQ.rows,
        claims,
        evidence_objects: evidenceObjects,
        claim_evidence_edges: evidenceEdges,
        corrections,
        event_outbox: eventOutbox
      },
      verification_tasks: verificationTasks,
      reviews,
      expected_gate: {
        total_claims: totalClaims,
        unsupported_claims: unsupportedClaims.length,
        contradicted_claims: contradictedClaims.length,
        primary_supported_claims: primarySupportedClaims.length,
        primary_evidence_ratio: Number(primaryEvidenceRatio.toFixed(6)),
        unsupported_claim_share: Number(unsupportedClaimShare.toFixed(6)),
        high_impact_claims: highImpactClaims.length,
        high_impact_corroborated: highImpactCorroborated,
        corroboration_ok: corroborationOk,
        publish_gate_pass:
          totalClaims > 0 &&
          contradictedClaims.length === 0 &&
          primaryEvidenceRatio >= 0.50 &&
          unsupportedClaimShare <= 0.10 &&
          corroborationOk
      },
      replay_invariants: [
        "I1: Published story versions are immutable",
        "I2: Evidence objects are immutable and content-addressed",
        "I3: Corrections are append-only",
        "I4: Claim text is stable once published",
        "I5: Publication gating is deterministic",
        "I7: All objects share the same platform scope",
        "I8: Claims reference exactly one story version",
        "I9: Evidence edges reference existing objects",
        "I10: Corrections reference existing claims"
      ]
    };

    // Output
    if (outputPath) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2) + "\n");
      console.error(`✓ Bundle exported to: ${outputPath}`);
    } else {
      console.log(JSON.stringify(bundle, null, 2));
    }

    console.error(`\nExport summary:`);
    console.error(`  Stories: 1`);
    console.error(`  Claims: ${claims.length}`);
    console.error(`  Evidence: ${evidenceObjects.length}`);
    console.error(`  Edges: ${evidenceEdges.length}`);
    console.error(`  Corrections: ${corrections.length}`);
    console.error(`  Gate pass: ${bundle.expected_gate.publish_gate_pass}`);

  } catch (err) {
    console.error("Export failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
