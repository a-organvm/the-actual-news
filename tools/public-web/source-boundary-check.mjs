import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);
const publicSourceRoot = path.join(root, "apps/public-web/src");

const allowedEnvKeys = new Set([
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
  "NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE"
]);

const forbiddenInternalNames = [
  "POSTGRES_URI",
  "POSTGRES_PASSWORD",
  "EVIDENCE_BLOB_STORE_ACCESS_KEY",
  "EVIDENCE_BLOB_STORE_SECRET_KEY",
  "MODEL_GATEWAY_URI",
  "EVENT_BUS_URI",
  "NEXT_PUBLIC_VERIFY_URI",
  "NEXT_PUBLIC_PUBLIC_GATEWAY_URI"
];

const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exitCode = 1;
}

for (const filePath of walk(publicSourceRoot)) {
  const relativePath = path.relative(root, filePath);
  const text = fs.readFileSync(filePath, "utf8");
  const envMatches = text.matchAll(/process\.env(?:\.([A-Z0-9_]+)|\[\s*["']([A-Z0-9_]+)["']\s*\])/g);

  for (const match of envMatches) {
    const key = match[1] ?? match[2];
    if (!allowedEnvKeys.has(key)) {
      fail(`${relativePath}: process.env.${key} is not allowed in the public web source boundary.`);
    }
  }

  for (const name of forbiddenInternalNames) {
    if (text.includes(name)) {
      fail(`${relativePath}: contains internal or deprecated public env name ${name}.`);
    }
  }
}

if (!process.exitCode) {
  console.log("[OK] public-web source uses only approved browser-safe env keys.");
  console.log("[OK] public-web source contains no forbidden internal env names.");
}
