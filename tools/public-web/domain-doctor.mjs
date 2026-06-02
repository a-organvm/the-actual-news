import dns from "node:dns/promises";

const domain = process.env.PUBLIC_DOMAIN ?? "theactual.news";
const workerUrl = process.env.PUBLIC_WORKER_URL ?? "https://the-actual-news-public.ivixivi.workers.dev";
const expectedWorkerHost = new URL(workerUrl).hostname;

const failures = [];
const warnings = [];

function record(level, label, detail) {
  const prefix = level === "pass" ? "[PASS]" : level === "warn" ? "[WARN]" : "[FAIL]";
  console.log(`${prefix} ${label}: ${detail}`);
  if (level === "fail") failures.push(label);
  if (level === "warn") warnings.push(label);
}

async function resolveSafe(type, name) {
  try {
    return await dns.resolve(name, type);
  } catch (error) {
    if (error?.code === "ENODATA" || error?.code === "ENOTFOUND") return [];
    throw error;
  }
}

function cloudflareDelegated(nsRecords) {
  return nsRecords.length > 0 && nsRecords.every((value) => value.toLowerCase().endsWith(".ns.cloudflare.com"));
}

function pointsAtWorker(cnameRecords) {
  return cnameRecords.some((value) => value.replace(/\.$/, "").toLowerCase() === expectedWorkerHost.toLowerCase());
}

async function health(url) {
  const response = await fetch(`${url.replace(/\/$/, "")}/api/healthz`, {
    headers: { accept: "application/json" }
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

const nsRecords = await resolveSafe("NS", domain);
if (cloudflareDelegated(nsRecords)) {
  record("pass", "DNS delegation", `${domain} is delegated to Cloudflare nameservers.`);
} else {
  record(
    "fail",
    "DNS delegation",
    `${domain} nameservers are ${nsRecords.join(", ") || "not published"}; move DNS to Cloudflare before custom-domain launch.`
  );
}

const apexA = await resolveSafe("A", domain);
const apexCname = await resolveSafe("CNAME", domain);
const wwwA = await resolveSafe("A", `www.${domain}`);
const wwwCname = await resolveSafe("CNAME", `www.${domain}`);

if (pointsAtWorker(apexCname)) {
  record("pass", "Apex DNS", `${domain} CNAME points at ${expectedWorkerHost}.`);
} else {
  record("warn", "Apex DNS", `${domain} A=${apexA.join(", ") || "none"} CNAME=${apexCname.join(", ") || "none"}.`);
}

if (pointsAtWorker(wwwCname)) {
  record("pass", "WWW DNS", `www.${domain} CNAME points at ${expectedWorkerHost}.`);
} else {
  record("warn", "WWW DNS", `www.${domain} A=${wwwA.join(", ") || "none"} CNAME=${wwwCname.join(", ") || "none"}.`);
}

try {
  const workerHealth = await health(workerUrl);
  record("pass", "Worker health", `${workerUrl} reports service=${workerHealth.service}, ok=${workerHealth.ok}.`);
  const conversions = workerHealth.conversion_paths ?? {};
  const requiredProviders = [
    ["briefing/newsletter", Boolean(conversions.briefing_configured ?? conversions.newsletter_configured)],
    ["membership", Boolean(conversions.membership_configured)],
    ["sponsor", Boolean(conversions.sponsor_configured)]
  ];
  const missing = requiredProviders.filter(([, ready]) => ready !== true).map(([label]) => label);
  if (missing.length === 0) {
    record("pass", "Provider URLs", "Newsletter, membership, and sponsor conversions are configured.");
  } else {
    record("fail", "Provider URLs", `Missing hosted provider configuration: ${missing.join(", ")}.`);
  }
} catch (error) {
  record("fail", "Worker health", error?.message ?? String(error));
}

console.log("\nNext commands after DNS and provider URLs are ready:");
console.log(`PUBLIC_DOMAIN=${domain} PUBLIC_WORKER_URL=${workerUrl} pnpm domain:doctor`);
console.log("PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict");
console.log(`PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://${domain} pnpm launch:deployed`);
console.log(`pnpm --filter public-web exec wrangler deploy .open-next/worker.js --name the-actual-news-public --domain ${domain}`);
console.log(`pnpm --filter public-web exec wrangler deploy .open-next/worker.js --name the-actual-news-public --domain www.${domain}`);

if (failures.length > 0) {
  console.log(`\nDomain doctor found ${failures.length} blocking issue(s) and ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`\nDomain doctor passed with ${warnings.length} warning(s).`);
