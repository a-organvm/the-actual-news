import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;

const POSTGRES_URI = process.env.POSTGRES_URI;
if (!POSTGRES_URI) {
  console.error("Missing $POSTGRES_URI");
  process.exit(2);
}

const HARNESS_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HARNESS_DIR, "..", "..");
const FIXTURES_DIR = path.join(HARNESS_DIR, "fixtures");
const SQL_DIR = path.join(HARNESS_DIR, "sql");
const SCHEMA_SQL = fs.readFileSync(path.join(SQL_DIR, "schema.sql"), "utf8");
const GATE_SQL = fs.readFileSync(path.join(SQL_DIR, "publish_gate.sql"), "utf8");
const PUBLISH_TXN_SQL = fs.readFileSync(path.join(SQL_DIR, "publish_txn.sql"), "utf8");

const FIXTURE_FILES = [
  "CT-01.json",
  "CT-02.json",
  "CT-03A.json",
  "CT-03B.json",
  "CT-04.json",
  "CT-05.json",
  "CT-06.json",
  "CT-07.json"
];

const BUNDLE_FIXTURE_DIR = path.join(ROOT, "fixtures", "civic-record-node");

function schemaName() {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  return `tmp_conformance_${t}_${r}`.replace(/[^a-zA-Z0-9_]/g, "_");
}

function round6(n) {
  if (n === null || n === undefined) return null;
  return Number(Number(n).toFixed(6));
}

function assertEq(label, got, exp) {
  if (typeof exp === "number") {
    const g = round6(got);
    const e = round6(exp);
    if (g !== e) throw new Error(`${label}: expected ${e} got ${g}`);
    return;
  }
  if (got !== exp) throw new Error(`${label}: expected ${exp} got ${got}`);
}

async function execInSchema(client, schema, sql) {
  await client.query(`SET search_path TO ${schema}, public;`);
  return client.query(sql);
}

async function insertRows(client, table, rows) {
  if (!rows || rows.length === 0) return;

  const cols = Object.keys(rows[0]);
  const colList = cols.map((c) => `"${c}"`).join(", ");

  for (const row of rows) {
    const vals = cols.map((c) => row[c]);
    const params = vals.map((_, i) => `$${i + 1}`).join(", ");
    const q = `INSERT INTO ${table} (${colList}) VALUES (${params})`;
    await client.query(q, vals);
  }
}

async function runFixture(pool, fixturePath) {
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const schema = schemaName();

  const client = await pool.connect();
  try {
    await client.query(`CREATE SCHEMA ${schema};`);
    await execInSchema(client, schema, SCHEMA_SQL);

    const ledger = fixture.ledger;

    await insertRows(client, "stories", ledger.stories ?? []);
    await insertRows(client, "story_versions", ledger.story_versions ?? []);
    await insertRows(client, "claims", (ledger.claims ?? []).map((c) => ({
      entities: JSON.stringify(c.entities ?? []),
      time_window: JSON.stringify(c.time_window ?? {}),
      jurisdiction: c.jurisdiction ?? null,
      confidence_model: c.confidence_model ?? null,
      confidence_review: c.confidence_review ?? null,
      ...c
    })));
    await insertRows(client, "evidence_objects", (ledger.evidence_objects ?? []).map((e) => ({
      extracted_text: e.extracted_text ?? null,
      provenance: JSON.stringify(e.provenance ?? {}),
      ...e
    })));
    await insertRows(client, "claim_evidence_edges", (ledger.claim_evidence_edges ?? []).map((e) => ({
      reviewer_actor_id: e.reviewer_actor_id ?? null,
      notes: e.notes ?? null,
      ...e
    })));
    await insertRows(client, "corrections", (ledger.corrections ?? []).map((c) => ({
      details: JSON.stringify(c.details ?? {}),
      ...c
    })));

    const P = fixture.policy_pack;
    const req = fixture.request;

    const gateArgs = [
      req.platform_id,
      req.story_id,
      req.story_version_id,
      P.evidence.primary_source_classes,
      P.evidence.independence_key_fields,
      P.claim.high_impact_claim_types,
      P.claim.high_impact_regexes,
      P.publish_gates.min_primary_evidence_ratio,
      P.publish_gates.max_unsupported_claim_share,
      P.publish_gates.max_contradicted_claims,
      P.publish_gates.require_high_impact_corroboration,
      P.publish_gates.high_impact_min_independent_sources
    ];

    const gateRes = await execInSchema(client, schema, { text: GATE_SQL, values: gateArgs });
    if (gateRes.rowCount !== 1) throw new Error(`Gate query returned ${gateRes.rowCount} rows`);

    const row = gateRes.rows[0];
    const exp = fixture.expected;

    assertEq("total_claims", Number(row.total_claims), exp.total_claims);
    assertEq("unsupported_claims", Number(row.unsupported_claims), exp.unsupported_claims);
    assertEq("contradicted_claims", Number(row.contradicted_claims), exp.contradicted_claims);
    assertEq("primary_supported_claims", Number(row.primary_supported_claims), exp.primary_supported_claims);

    assertEq("primary_evidence_ratio", Number(row.primary_evidence_ratio), exp.primary_evidence_ratio);
    assertEq("unsupported_claim_share", Number(row.unsupported_claim_share), exp.unsupported_claim_share);

    assertEq("high_impact_claims", Number(row.high_impact_claims), exp.high_impact_claims);
    assertEq("high_impact_corroborated", Number(row.high_impact_corroborated), exp.high_impact_corroborated);

    assertEq("corroboration_ok", Boolean(row.corroboration_ok), exp.corroboration_ok);
    assertEq("publish_gate_pass", Boolean(row.publish_gate_pass), exp.publish_gate_pass);

    // transactional publish assertions
    const publishArgs = [...gateArgs, P.policy_pack_version];

    if (exp.publish_gate_pass === true) {
      await client.query("BEGIN");
      const pubRes = await execInSchema(client, schema, { text: PUBLISH_TXN_SQL, values: publishArgs });
      await client.query("COMMIT");

      const st = String(pubRes.rows?.[0]?.story_state ?? "");
      const oc = Number(pubRes.rows?.[0]?.outbox_count ?? -1);
      assertEq("publish_txn.publish_gate_pass", Boolean(pubRes.rows?.[0]?.publish_gate_pass), true);
      assertEq("publish_txn.story_state", st, "published");
      assertEq("publish_txn.outbox_count", oc, 1);
    } else {
      await client.query("BEGIN");
      const check = await execInSchema(client, schema, { text: PUBLISH_TXN_SQL, values: publishArgs });
      await client.query("COMMIT");

      const st = String(check.rows?.[0]?.story_state ?? "");
      const oc = Number(check.rows?.[0]?.outbox_count ?? -1);

      const expectedInitialState = String((ledger.stories?.[0]?.state ?? "review"));
      assertEq("publish_txn.publish_gate_pass", Boolean(check.rows?.[0]?.publish_gate_pass), false);
      assertEq("publish_txn.story_state", st, expectedInitialState);
      assertEq("publish_txn.outbox_count", oc, 0);
    }

    await client.query(`DROP SCHEMA ${schema} CASCADE;`);
    return { fixture_id: fixture.fixture_id, ok: true };
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    try { await client.query(`DROP SCHEMA ${schema} CASCADE;`); } catch {}
    return { fixture_id: fixture.fixture_id, ok: false, error: String(err?.message ?? err) };
  } finally {
    client.release();
  }
}

async function runBundleReplayTest(pool) {
  const fixtureId = "CT-BUNDLE-01";
  const bundlePath = path.join(BUNDLE_FIXTURE_DIR, "civic-council-budget-amendment.json");

  if (!fs.existsSync(bundlePath)) {
    return { fixture_id: fixtureId, ok: false, error: "Bundle fixture not found" };
  }

  const bundle = JSON.parse(fs.readFileSync(bundlePath, "utf8"));
  const schema = schemaName();

  const client = await pool.connect();
  try {
    await client.query(`CREATE SCHEMA ${schema};`);
    await client.query(`SET search_path TO ${schema}, public;`);
    await client.query(SCHEMA_SQL);

    // Seed all bundle objects
    if (bundle.actors) await insertRows(client, "actors", bundle.actors);
    if (bundle.coi_disclosures) await insertRows(client, "coi_disclosures", bundle.coi_disclosures);

    await insertRows(client, "stories", bundle.ledger.stories);
    await insertRows(client, "story_versions", bundle.ledger.story_versions);
    await insertRows(client, "evidence_objects", bundle.ledger.evidence_objects.map((e) => ({
      ...e,
      provenance: JSON.stringify(e.provenance)
    })));
    await insertRows(client, "claims", bundle.ledger.claims.map((c) => ({
      ...c,
      entities: JSON.stringify(c.entities ?? []),
      time_window: JSON.stringify(c.time_window ?? {})
    })));
    await insertRows(client, "claim_evidence_edges", bundle.ledger.claim_evidence_edges);
    if (bundle.ledger.corrections) {
      await insertRows(client, "corrections", bundle.ledger.corrections.map((c) => ({
        ...c,
        details: JSON.stringify(c.details ?? {})
      })));
    }

    // Validate invariants
    // I8: Claims reference exactly one story version
    const claimsQ = await client.query(`SELECT claim_id, story_version_id FROM claims`);
    for (const claim of claimsQ.rows) {
      const versionExists = await client.query(
        `SELECT 1 FROM story_versions WHERE story_version_id = $1`,
        [claim.story_version_id]
      );
      if (versionExists.rowCount === 0) {
        throw new Error(`I8 violated: Claim ${claim.claim_id} references non-existent version ${claim.story_version_id}`);
      }
    }

    // I9: Evidence edges reference existing objects
    const edgesQ = await client.query(`SELECT edge_id, evidence_id_hash FROM claim_evidence_edges`);
    for (const edge of edgesQ.rows) {
      const evidenceExists = await client.query(
        `SELECT 1 FROM evidence_objects WHERE evidence_id_hash = $1`,
        [edge.evidence_id_hash]
      );
      if (evidenceExists.rowCount === 0) {
        throw new Error(`I9 violated: Edge ${edge.edge_id} references non-existent evidence ${edge.evidence_id_hash}`);
      }
    }

    // I10: Corrections reference existing claims
    const correctionsQ = await client.query(`SELECT correction_id, claim_id FROM corrections`);
    for (const corr of correctionsQ.rows) {
      const claimExists = await client.query(
        `SELECT 1 FROM claims WHERE claim_id = $1`,
        [corr.claim_id]
      );
      if (claimExists.rowCount === 0) {
        throw new Error(`I10 violated: Correction ${corr.correction_id} references non-existent claim ${corr.claim_id}`);
      }
    }

    // Run gate and verify expected metrics
    const story = bundle.ledger.stories[0];
    const storyVersion = bundle.ledger.story_versions[0];
    const P = bundle.policy_pack;

    const gateArgs = [
      bundle.platform_id,
      story.story_id,
      storyVersion.story_version_id,
      P.evidence.primary_source_classes,
      P.evidence.independence_key_fields,
      P.claim.high_impact_claim_types,
      P.claim.high_impact_regexes,
      P.publish_gates.min_primary_evidence_ratio,
      P.publish_gates.max_unsupported_claim_share,
      P.publish_gates.max_contradicted_claims,
      P.publish_gates.require_high_impact_corroboration,
      P.publish_gates.high_impact_min_independent_sources
    ];

    const gateRes = await execInSchema(client, schema, { text: GATE_SQL, values: gateArgs });
    if (gateRes.rowCount !== 1) throw new Error(`Gate query returned ${gateRes.rowCount} rows`);

    const gateRow = gateRes.rows[0];
    const expected = bundle.expected_gate;

    assertEq("total_claims", Number(gateRow.total_claims), expected.total_claims);
    assertEq("unsupported_claims", Number(gateRow.unsupported_claims), expected.unsupported_claims);
    assertEq("contradicted_claims", Number(gateRow.contradicted_claims), expected.contradicted_claims);
    assertEq("primary_supported_claims", Number(gateRow.primary_supported_claims), expected.primary_supported_claims);
    assertEq("primary_evidence_ratio", Number(gateRow.primary_evidence_ratio), expected.primary_evidence_ratio);
    assertEq("unsupported_claim_share", Number(gateRow.unsupported_claim_share), expected.unsupported_claim_share);
    assertEq("high_impact_claims", Number(gateRow.high_impact_claims), expected.high_impact_claims);
    assertEq("high_impact_corroborated", Number(gateRow.high_impact_corroborated), expected.high_impact_corroborated);
    assertEq("corroboration_ok", Boolean(gateRow.corroboration_ok), expected.corroboration_ok);
    assertEq("publish_gate_pass", Boolean(gateRow.publish_gate_pass), expected.publish_gate_pass);

    // Test publish transaction
    if (expected.publish_gate_pass) {
      const publishArgs = [...gateArgs, P.policy_pack_version];
      await client.query("BEGIN");
      const pubRes = await execInSchema(client, schema, { text: PUBLISH_TXN_SQL, values: publishArgs });
      await client.query("COMMIT");

      const pubRow = pubRes.rows[0];
      assertEq("publish.story_state", String(pubRow.story_state), "published");
      assertEq("publish.outbox_count", Number(pubRow.outbox_count), 1);
    }

    await client.query(`DROP SCHEMA ${schema} CASCADE;`);
    return { fixture_id: fixtureId, ok: true };
  } catch (err) {
    try { await client.query(`DROP SCHEMA ${schema} CASCADE;`); } catch {}
    return { fixture_id: fixtureId, ok: false, error: String(err?.message ?? err) };
  } finally {
    client.release();
  }
}

async function main() {
  const pool = new Pool({ connectionString: POSTGRES_URI });

  let failed = 0;
  for (const f of FIXTURE_FILES) {
    const fp = path.join(FIXTURES_DIR, f);
    const r = await runFixture(pool, fp);
    if (!r.ok) {
      failed += 1;
      console.error(`[FAIL] ${r.fixture_id}: ${r.error}`);
    } else {
      console.log(`[OK] ${r.fixture_id}`);
    }
  }

  // Bundle replay conformance test (CT-BUNDLE-01)
  const bundleReplayResult = await runBundleReplayTest(pool);
  if (!bundleReplayResult.ok) {
    failed += 1;
    console.error(`[FAIL] ${bundleReplayResult.fixture_id}: ${bundleReplayResult.error}`);
  } else {
    console.log(`[OK] ${bundleReplayResult.fixture_id}`);
  }

  await pool.end();

  if (failed > 0) process.exit(1);
  console.log("All conformance tests passed.");
}

main().catch((e) => {
  console.error(String(e?.message ?? e));
  process.exit(1);
});
