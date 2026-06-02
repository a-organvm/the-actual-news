import process from "node:process";
import { spawnSync } from "node:child_process";
import pg from "pg";

const { Pool } = pg;
const uri = process.env.POSTGRES_URI;

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`[OK] ${message}`);
}

const psqlCheck = spawnSync("psql", ["--version"], { encoding: "utf8" });
if (psqlCheck.status === 0) {
  ok(`psql client found: ${psqlCheck.stdout.trim()}`);
} else {
  fail("psql client is not on PATH.");
  console.error("Install a Postgres client before running migrations:");
  console.error("  brew install libpq");
  console.error('  export PATH="/opt/homebrew/opt/libpq/bin:$PATH"');
  console.error("Or install postgresql@16 and add its bin directory to PATH.");
}

if (!uri) {
  fail("POSTGRES_URI is not set.");
  console.error("Set POSTGRES_URI to a reachable Postgres database before running conformance:");
  console.error("  export POSTGRES_URI='postgres://USER:PASSWORD@HOST:5432/news_ledger?sslmode=disable'");
  console.error("Then run:");
  console.error("  bash tools/migrate.sh");
  console.error("  pnpm conformance:test");
  process.exit(process.exitCode);
}

let parsed;
try {
  parsed = new URL(uri);
} catch {
  fail("POSTGRES_URI is not a valid URL.");
  process.exit(process.exitCode);
}

if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
  fail("POSTGRES_URI must use postgres:// or postgresql://.");
}

if (!parsed.hostname) fail("POSTGRES_URI must include a host.");
if (!parsed.pathname || parsed.pathname === "/") fail("POSTGRES_URI must include a database name.");

const pool = new Pool({ connectionString: uri, connectionTimeoutMillis: 5000 });
try {
  const result = await pool.query("SELECT current_database() AS database, current_user AS user");
  const row = result.rows[0];
  ok(`Connected to database ${row.database} as ${row.user}.`);
} catch (error) {
  fail(`Could not connect to POSTGRES_URI: ${error?.message ?? error}`);
} finally {
  await pool.end().catch(() => {});
}

if (!process.exitCode) {
  ok("POSTGRES_URI and psql are ready for migrations and conformance tests.");
}
