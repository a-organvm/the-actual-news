import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);
const envFile = process.env.PUBLIC_ENV_FILE ?? path.join(root, ".env.public.example");
const strict = process.env.LAUNCH_CHECK_STRICT === "true" || process.argv.includes("--strict");

const checks = [];

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return new Map();

  const values = new Map();
  const text = fs.readFileSync(filePath, "utf8");

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
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

const fileValues = parseEnv(envFile);

function valueFor(key) {
  return process.env[key] ?? fileValues.get(key) ?? "";
}

function addCheck(level, label, detail) {
  checks.push({ level, label, detail });
}

function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !isPlaceholderHost(url.hostname);
  } catch {
    return false;
  }
}

function isPlaceholderHost(hostname) {
  return (
    hostname === "example.com" ||
    hostname === "example.org" ||
    hostname === "example.net" ||
    hostname.endsWith(".example") ||
    hostname.includes("your-") ||
    hostname.includes("todo")
  );
}

function isLocalUrl(value) {
  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

const publicAppRoutePatterns = [
  /^\/$/,
  /^\/api(?:\/|$)/,
  /^\/briefing\/?$/,
  /^\/campaigns\.json$/,
  /^\/distribution\/?$/,
  /^\/feed\.(?:json|xml)$/,
  /^\/go(?:\/|$)/,
  /^\/launch(?:\.json|\/?)$/,
  /^\/media-kit(?:\.json|\/?)$/,
  /^\/membership\/?$/,
  /^\/provider-handoff\.json$/,
  /^\/robots\.txt$/,
  /^\/runbook\.json$/,
  /^\/share-kit\.json$/,
  /^\/sitemap\.xml$/,
  /^\/sponsor\/?$/,
  /^\/sponsors(?:\.json|\/?)$/,
  /^\/v1(?:\/|$)/
];

function isPublicAppRoute(pathname) {
  return publicAppRoutePatterns.some((pattern) => pattern.test(pathname));
}

function providerUrlProblem(value) {
  if (!isHttpsUrl(value)) return "should be a real https URL for public launch";
  if (isLocalUrl(value)) return "must not point to a local URL";

  try {
    const url = new URL(value);
    const canonicalSite = isHttpsUrl(siteUrl) ? new URL(siteUrl) : null;
    if (canonicalSite && url.origin === canonicalSite.origin && isPublicAppRoute(url.pathname)) {
      return "must point to a hosted provider destination, not this app's public fallback routes";
    }
    return "";
  } catch {
    return "should be a real https URL for public launch";
  }
}

function requirePublicUrl(key, label) {
  const value = valueFor(key);
  if (!value) {
    addCheck(strict ? "fail" : "warn", label, `${key} is blank.`);
    return;
  }
  const problem = providerUrlProblem(value);
  if (problem) {
    addCheck(strict ? "fail" : "warn", label, `${key} ${problem}: ${value}`);
    return;
  }
  addCheck("pass", label, `${key} is configured.`);
}

function isPublicAnalyticsDomain(value) {
  if (!value) return false;
  if (value.startsWith("http://") || value.startsWith("https://")) return false;
  if (value.includes("/") || value.includes(":")) return false;
  return !isPlaceholderHost(value) && value.includes(".");
}

function isTrustedAnalyticsScriptUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "plausible.io" && url.pathname.startsWith("/js/");
  } catch {
    return false;
  }
}

const siteUrl = valueFor("NEXT_PUBLIC_SITE_URL");
const publicApiUri = valueFor("NEXT_PUBLIC_PUBLIC_API_URI");
const verifierEnabled = valueFor("NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE") === "true";
const analyticsDomain = valueFor("NEXT_PUBLIC_ANALYTICS_DOMAIN");
const analyticsScriptUrl = valueFor("NEXT_PUBLIC_ANALYTICS_SCRIPT_URL");

if (isHttpsUrl(siteUrl) && !isLocalUrl(siteUrl)) {
  addCheck("pass", "Canonical site URL", `NEXT_PUBLIC_SITE_URL=${siteUrl}`);
} else {
  addCheck(strict ? "fail" : "warn", "Canonical site URL", "Set NEXT_PUBLIC_SITE_URL to the real public https origin before launch.");
}

if (isHttpsUrl(publicApiUri) && !isLocalUrl(publicApiUri)) {
  addCheck("pass", "Public API URL", `NEXT_PUBLIC_PUBLIC_API_URI=${publicApiUri}`);
} else {
  addCheck(strict ? "fail" : "warn", "Public API URL", "Set NEXT_PUBLIC_PUBLIC_API_URI to the real public reader-safe gateway before launch.");
}

if (verifierEnabled) {
  addCheck("fail", "Verifier boundary", "NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE must be false in the public launch environment.");
} else {
  addCheck("pass", "Verifier boundary", "Internal verifier workspace is disabled for the public app.");
}

requirePublicUrl("NEXT_PUBLIC_NEWSLETTER_URL", "Audience capture");
requirePublicUrl("NEXT_PUBLIC_MEMBERSHIP_URL", "Membership revenue");
requirePublicUrl("NEXT_PUBLIC_SPONSOR_URL", "Sponsor revenue");

if (isPublicAnalyticsDomain(analyticsDomain)) {
  addCheck("pass", "Audience analytics", `NEXT_PUBLIC_ANALYTICS_DOMAIN=${analyticsDomain}`);
} else {
  addCheck(strict ? "fail" : "warn", "Audience analytics", "Set NEXT_PUBLIC_ANALYTICS_DOMAIN to a real keyless analytics domain.");
}

if (isTrustedAnalyticsScriptUrl(analyticsScriptUrl)) {
  addCheck("pass", "Analytics script", `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL=${analyticsScriptUrl}`);
} else {
  addCheck(strict ? "fail" : "warn", "Analytics script", "Use the CSP-allowed Plausible browser script URL.");
}

const secretLeakPattern = /(sk_live_|sk_test_|xox[baprs]-|ghp_|github_pat_|AKIA[0-9A-Z]{16}|-----BEGIN|postgres:\/\/[^:\s]+:[^@\s]+@)/;
for (const [key, value] of fileValues.entries()) {
  if (secretLeakPattern.test(value)) {
    addCheck("fail", "Public secret scan", `${key} looks like it contains a credential.`);
  }
}
if (!checks.some((check) => check.label === "Public secret scan" && check.level === "fail")) {
  addCheck("pass", "Public secret scan", `${path.relative(root, envFile)} has no obvious secret values.`);
}

const order = { fail: 0, warn: 1, pass: 2 };
checks.sort((a, b) => order[a.level] - order[b.level] || a.label.localeCompare(b.label));

for (const check of checks) {
  const prefix = check.level === "pass" ? "[PASS]" : check.level === "warn" ? "[WARN]" : "[FAIL]";
  console.log(`${prefix} ${check.label}: ${check.detail}`);
}

const failCount = checks.filter((check) => check.level === "fail").length;
const warnCount = checks.filter((check) => check.level === "warn").length;

console.log(`Launch readiness checked with ${failCount} failures and ${warnCount} warnings.`);
if (strict && warnCount > 0) {
  console.log("Strict mode treats warnings as launch blockers.");
  process.exit(1);
}
if (failCount > 0) process.exit(1);
