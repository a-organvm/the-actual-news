import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);
const publicEnvPath = path.join(root, ".env.public.example");
const internalEnvPath = path.join(root, ".env.internal.example");

const allowedPublicKeys = new Set([
  "NEXT_PUBLIC_PLATFORM_ID",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SITE_TITLE",
  "NEXT_PUBLIC_SITE_DESCRIPTION",
  "NEXT_PUBLIC_PUBLIC_API_URI",
  "NEXT_PUBLIC_ANALYTICS_DOMAIN",
  "NEXT_PUBLIC_ANALYTICS_SCRIPT_URL",
  "NEXT_PUBLIC_NEWSLETTER_URL",
  "NEXT_PUBLIC_MEMBERSHIP_URL",
  "NEXT_PUBLIC_SPONSOR_URL",
  "NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE",
  "PUBLIC_WEB_PORT"
]);

const requiredPublicKeys = [
  "NEXT_PUBLIC_PLATFORM_ID",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SITE_TITLE",
  "NEXT_PUBLIC_SITE_DESCRIPTION",
  "NEXT_PUBLIC_PUBLIC_API_URI",
  "NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE"
];

const requiredInternalKeys = [
  "PLATFORM_ID",
  "POSTGRES_PASSWORD",
  "POSTGRES_URI",
  "EVIDENCE_BLOB_STORE_ACCESS_KEY",
  "EVIDENCE_BLOB_STORE_SECRET_KEY",
  "MODEL_GATEWAY_URI",
  "EVENT_BUS_URI"
];

const secretNamePattern = /(SECRET|PASSWORD|TOKEN|PRIVATE|CREDENTIAL|ACCESS_KEY|API_KEY|WEBHOOK|DATABASE_URL|POSTGRES_URI)/i;
const secretValuePattern = /(sk_live_|sk_test_|xox[baprs]-|ghp_|github_pat_|AKIA[0-9A-Z]{16}|-----BEGIN|postgres:\/\/[^:\s]+:[^@\s]+@)/;

function parseEnv(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const values = new Map();

  for (const [index, rawLine] of text.split(/\r?\n/).entries()) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) {
      throw new Error(`${path.basename(filePath)}:${index + 1}: expected KEY=value`);
    }
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values.set(key, value);
  }

  return values;
}

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

function trustedAnalyticsScriptUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "plausible.io" && url.pathname.startsWith("/js/");
  } catch {
    return false;
  }
}

const publicEnv = parseEnv(publicEnvPath);
const internalEnv = parseEnv(internalEnvPath);

for (const key of publicEnv.keys()) {
  if (!allowedPublicKeys.has(key)) {
    fail(`Unexpected public env key ${key}. Public env should only contain browser-safe keys.`);
  }
  if (!key.startsWith("NEXT_PUBLIC_") && key !== "PUBLIC_WEB_PORT") {
    fail(`Public env key ${key} must be NEXT_PUBLIC_* or PUBLIC_WEB_PORT.`);
  }
  if (secretNamePattern.test(key)) {
    fail(`Public env key ${key} looks secret-bearing.`);
  }
}

for (const key of requiredPublicKeys) {
  if (!publicEnv.has(key)) {
    fail(`Missing required public env key ${key}.`);
  }
}

for (const [key, value] of publicEnv.entries()) {
  if (secretValuePattern.test(value)) {
    fail(`Public env value for ${key} looks like a secret or credential.`);
  }
}

const analyticsScriptUrl = publicEnv.get("NEXT_PUBLIC_ANALYTICS_SCRIPT_URL");
if (analyticsScriptUrl && !trustedAnalyticsScriptUrl(analyticsScriptUrl)) {
  fail("NEXT_PUBLIC_ANALYTICS_SCRIPT_URL must be a CSP-allowed Plausible browser script URL.");
}

for (const key of requiredInternalKeys) {
  if (!internalEnv.has(key)) {
    fail(`Missing required internal env key ${key}.`);
  }
}

for (const key of internalEnv.keys()) {
  if (key.startsWith("NEXT_PUBLIC_")) {
    fail(`Internal env key ${key} should not be NEXT_PUBLIC_*.`);
  }
}

if (!process.exitCode) {
  console.log("[OK] .env.public.example contains only allowed browser-safe keys.");
  console.log("[OK] .env.internal.example contains required internal keys.");
  console.log("[OK] No secret-looking values found in public env example.");
}
