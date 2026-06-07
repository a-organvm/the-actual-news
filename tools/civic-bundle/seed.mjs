#!/usr/bin/env node

/**
 * Civic Bundle Seed
 * 
 * Seeds a clean database with the canonical civic story bundle.
 * Usage: node tools/civic-bundle/seed.mjs [--bundle <path>]
 * 
 * Environment:
 *   POSTGRES_URI - PostgreSQL connection string (required)
 *   PLATFORM_ID  - Platform namespace (default: from bundle)
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

const ROOT = process.cwd();
const SCHEMA_SQL_PATH = path.join(ROOT, "tools", "conformance", "sql", "schema.sql");

// Parse CLI args
const args = process.argv.slice(2);
let bundlePath = path.join(ROOT, "fixtures", "civic-record-node", "civic-council-budget-amendment.json");

for (let i = 2; i < args.length; i++) {
  if (args[i] === "--bundle" && args[i + 1]) {
    bundlePath = path.resolve(args[i + 1]);
    i++;
  }
}

if (!fs.existsSync(bundlePath)) {
  console.error(`Bundle not found: ${bundlePath}`);
  process.exit(2);
}

const bundle = JSON.parse(fs.readFileSync(bundlePath, "utf8"));

console.log(`Seeding bundle: ${bundle.bundle_id}`);
console.log(`Scenario: ${bundle.scenario?.title ?? "unknown"}`);
console.log(`Platform: ${bundle.platform_id}`);

async function main() {
  const pool = new Pool({ connectionString: POSTGRES_URI });
  const client = await pool.connect();

  try {
    // Use a dedicated schema for this bundle to avoid conflicts
    const schema = `bundle_${bundle.bundle_id.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`;

    console.log(`Creating schema: ${schema}`);
    await client.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
    await client.query(`CREATE SCHEMA ${schema}`);

    // Load base schema
    const schemaSql = fs.readFileSync(SCHEMA_SQL_PATH, "utf8");
    await client.query(`SET search_path TO ${schema}, public;`);
    await client.query(schemaSql);

    // Insert actors
    if (bundle.actors && bundle.actors.length > 0) {
      console.log(`Inserting ${bundle.actors.length} actors...`);
      for (const actor of bundle.actors) {
        await client.query(
          `INSERT INTO actors (actor_id, platform_id, display_name, role, created_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [actor.actor_id, actor.platform_id, actor.display_name, actor.role, actor.created_at]
        );
      }
    }

    // Insert COI disclosures
    if (bundle.coi_disclosures && bundle.coi_disclosures.length > 0) {
      console.log(`Inserting ${bundle.coi_disclosures.length} COI disclosures...`);
      for (const coi of bundle.coi_disclosures) {
        await client.query(
          `INSERT INTO coi_disclosures (disclosure_id, platform_id, actor_id, statement, valid_from, valid_to, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [coi.disclosure_id, coi.platform_id, coi.actor_id, coi.statement, coi.valid_from, coi.valid_to, coi.created_at]
        );
      }
    }

    // Insert stories
    console.log(`Inserting ${bundle.ledger.stories.length} stories...`);
    for (const story of bundle.ledger.stories) {
      await client.query(
        `INSERT INTO stories (story_id, platform_id, title, state, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [story.story_id, story.platform_id, story.title, story.state, story.created_at, story.updated_at]
      );
    }

    // Insert story versions
    console.log(`Inserting ${bundle.ledger.story_versions.length} story versions...`);
    for (const version of bundle.ledger.story_versions) {
      await client.query(
        `INSERT INTO story_versions (story_version_id, story_id, body_markdown, disclosure_markdown, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [version.story_version_id, version.story_id, version.body_markdown, version.disclosure_markdown, version.created_at]
      );
    }

    // Insert evidence objects
    console.log(`Inserting ${bundle.ledger.evidence_objects.length} evidence objects...`);
    for (const evidence of bundle.ledger.evidence_objects) {
      await client.query(
        `INSERT INTO evidence_objects (evidence_id_hash, platform_id, blob_uri, media_type, extracted_text, provenance, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          evidence.evidence_id_hash,
          evidence.platform_id,
          evidence.blob_uri,
          evidence.media_type,
          evidence.extracted_text,
          JSON.stringify(evidence.provenance),
          evidence.created_at
        ]
      );
    }

    // Insert claims
    console.log(`Inserting ${bundle.ledger.claims.length} claims...`);
    for (const claim of bundle.ledger.claims) {
      await client.query(
        `INSERT INTO claims (claim_id, story_id, story_version_id, claim_type, text, entities, time_window, jurisdiction, support_status, confidence_model, confidence_review, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          claim.claim_id,
          claim.story_id,
          claim.story_version_id,
          claim.claim_type,
          claim.text,
          JSON.stringify(claim.entities ?? []),
          JSON.stringify(claim.time_window ?? {}),
          claim.jurisdiction,
          claim.support_status,
          claim.confidence_model,
          claim.confidence_review,
          claim.created_at
        ]
      );
    }

    // Insert claim-evidence edges
    console.log(`Inserting ${bundle.ledger.claim_evidence_edges.length} claim-evidence edges...`);
    for (const edge of bundle.ledger.claim_evidence_edges) {
      await client.query(
        `INSERT INTO claim_evidence_edges (edge_id, claim_id, evidence_id_hash, relation, strength, reviewer_actor_id, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          edge.edge_id,
          edge.claim_id,
          edge.evidence_id_hash,
          edge.relation,
          edge.strength,
          edge.reviewer_actor_id,
          edge.notes,
          edge.created_at
        ]
      );
    }

    // Insert corrections
    if (bundle.ledger.corrections && bundle.ledger.corrections.length > 0) {
      console.log(`Inserting ${bundle.ledger.corrections.length} corrections...`);
      for (const correction of bundle.ledger.corrections) {
        await client.query(
          `INSERT INTO corrections (correction_id, platform_id, claim_id, reason, details, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            correction.correction_id,
            correction.platform_id,
            correction.claim_id,
            correction.reason,
            JSON.stringify(correction.details ?? {}),
            correction.created_at
          ]
        );
      }
    }

    // Insert verification tasks
    if (bundle.verification_tasks && bundle.verification_tasks.length > 0) {
      console.log(`Inserting ${bundle.verification_tasks.length} verification tasks...`);
      for (const task of bundle.verification_tasks) {
        await client.query(
          `INSERT INTO verification_tasks (task_id, platform_id, story_id, claim_id, task_type, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [task.task_id, task.platform_id, task.story_id, task.claim_id, task.task_type, task.status, task.created_at]
        );
      }
    }

    // Insert reviews
    if (bundle.reviews && bundle.reviews.length > 0) {
      console.log(`Inserting ${bundle.reviews.length} reviews...`);
      for (const review of bundle.reviews) {
        await client.query(
          `INSERT INTO reviews (review_id, task_id, actor_id, verdict, notes, evidence_edges, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            review.review_id,
            review.task_id,
            review.actor_id,
            review.verdict,
            review.notes,
            JSON.stringify(review.evidence_edges ?? []),
            review.created_at
          ]
        );
      }
    }

    // Insert event outbox entries
    if (bundle.ledger.event_outbox && bundle.ledger.event_outbox.length > 0) {
      console.log(`Inserting ${bundle.ledger.event_outbox.length} event outbox entries...`);
      for (const event of bundle.ledger.event_outbox) {
        await client.query(
          `INSERT INTO event_outbox (event_id, platform_id, event_type, event_version, payload, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            event.event_id,
            event.platform_id,
            event.event_type,
            event.event_version ?? "v1",
            JSON.stringify(event.payload),
            event.created_at
          ]
        );
      }
    }

    console.log("\n✓ Bundle seeded successfully");
    console.log(`  Schema: ${schema}`);
    console.log(`  Stories: ${bundle.ledger.stories.length}`);
    console.log(`  Claims: ${bundle.ledger.claims.length}`);
    console.log(`  Evidence: ${bundle.ledger.evidence_objects.length}`);
    console.log(`  Edges: ${bundle.ledger.claim_evidence_edges.length}`);
    console.log(`  Corrections: ${bundle.ledger.corrections?.length ?? 0}`);

  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
