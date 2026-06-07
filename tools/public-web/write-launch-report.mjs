import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);
const envFile = process.env.PUBLIC_ENV_FILE ?? path.join(root, ".env.public.example");
const outputFile = process.env.LAUNCH_REPORT_FILE ?? path.join(root, "docs/public-launch-report.md");

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

function placeholderHost(hostname) {
  return (
    hostname === "example.com" ||
    hostname === "example.org" ||
    hostname === "example.net" ||
    hostname.endsWith(".example") ||
    hostname.includes("your-") ||
    hostname.includes("todo")
  );
}

function publicHttpsUrl(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !placeholderHost(url.hostname) &&
      !["localhost", "127.0.0.1", "::1"].includes(url.hostname)
    );
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
  /^\/provider-pages\/?$/,
  /^\/robots\.txt$/,
  /^\/runbook\.json$/,
  /^\/share-kit\.json$/,
  /^\/sitemap\.xml$/,
  /^\/sponsor\/?$/,
  /^\/sponsors(?:\.json|\/?)$/,
  /^\/v1(?:\/|$)/
];

function publicAppRoute(pathname) {
  return publicAppRoutePatterns.some((pattern) => pattern.test(pathname));
}

function hostedProviderUrl(value, siteUrl) {
  if (!publicHttpsUrl(value)) return false;

  try {
    const url = new URL(value);
    const canonicalSite = publicHttpsUrl(siteUrl) ? new URL(siteUrl) : null;
    return !(canonicalSite && url.origin === canonicalSite.origin && publicAppRoute(url.pathname));
  } catch {
    return false;
  }
}

function publicAnalyticsDomain(value) {
  if (!value) return false;
  if (value.startsWith("http://") || value.startsWith("https://")) return false;
  if (value.includes("/") || value.includes(":")) return false;
  return value.includes(".") && !placeholderHost(value);
}

function trustedAnalyticsScriptUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "plausible.io" && url.pathname.startsWith("/js/");
  } catch {
    return false;
  }
}

function valueFor(values, key) {
  return process.env[key] ?? values.get(key) ?? "";
}

function statusIcon(ok) {
  return ok ? "PASS" : "BLOCKED";
}

function normalizeGeneratedAt(text) {
  return text.replace(/^Generated: .+$/m, "Generated: <timestamp>");
}

const values = parseEnv(envFile);
const siteUrl = valueFor(values, "NEXT_PUBLIC_SITE_URL");
const publicApiUrl = valueFor(values, "NEXT_PUBLIC_PUBLIC_API_URI");
const newsletterUrl = valueFor(values, "NEXT_PUBLIC_NEWSLETTER_URL");
const membershipUrl = valueFor(values, "NEXT_PUBLIC_MEMBERSHIP_URL");
const sponsorUrl = valueFor(values, "NEXT_PUBLIC_SPONSOR_URL");
const analyticsDomain = valueFor(values, "NEXT_PUBLIC_ANALYTICS_DOMAIN");
const analyticsScriptUrl = valueFor(values, "NEXT_PUBLIC_ANALYTICS_SCRIPT_URL");
const verifierDisabled = valueFor(values, "NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE") !== "true";

const checks = [
  {
    label: "Canonical public site",
    status: publicHttpsUrl(siteUrl),
    action: "Set NEXT_PUBLIC_SITE_URL to the deployed public HTTPS origin."
  },
  {
    label: "Reader-safe public API",
    status: publicHttpsUrl(publicApiUrl),
    action: "Set NEXT_PUBLIC_PUBLIC_API_URI to the deployed reader-safe gateway."
  },
  {
    label: "Newsletter capture",
    status: hostedProviderUrl(newsletterUrl, siteUrl),
    action: "Set NEXT_PUBLIC_NEWSLETTER_URL to a hosted signup page outside this app's fallback routes."
  },
  {
    label: "Membership revenue",
    status: hostedProviderUrl(membershipUrl, siteUrl),
    action: "Set NEXT_PUBLIC_MEMBERSHIP_URL to hosted checkout or membership page outside this app's fallback routes."
  },
  {
    label: "Sponsor revenue",
    status: hostedProviderUrl(sponsorUrl, siteUrl),
    action: "Set NEXT_PUBLIC_SPONSOR_URL to hosted sponsor intake outside this app's fallback routes."
  },
  {
    label: "Audience analytics",
    status: publicAnalyticsDomain(analyticsDomain),
    action: "Set NEXT_PUBLIC_ANALYTICS_DOMAIN to a keyless analytics domain."
  },
  {
    label: "Analytics script",
    status: trustedAnalyticsScriptUrl(analyticsScriptUrl),
    action: "Use the CSP-allowed Plausible browser script URL."
  },
  {
    label: "Verifier boundary",
    status: verifierDisabled,
    action: "Keep NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE=false on the public deployment."
  }
];

const publicRoutes = [
  "/",
  "/briefing",
  "/campaigns.json",
  "/clip/:clip_id",
  "/distribution",
  "/feed.json",
  "/feed.xml",
  "/go/briefing",
  "/go/membership",
  "/go/sponsor",
  "/launch",
  "/launch.json",
  "/media-kit",
  "/media-kit.json",
  "/membership",
  "/principles",
  "/provider-handoff.json",
  "/provider-pages",
  "/runbook.json",
  "/share-kit.json",
  "/sponsor",
  "/sponsors",
  "/sponsors.json",
  "/story/:story_id",
  "/v1/feed",
  "/v1/story/:story_id",
  "/verify"
];

const blocked = checks.filter((check) => !check.status);
const generatedAt = new Date().toISOString();
const relativeEnv = path.relative(root, envFile);
const cloudflareWorkerUrl = "https://the-actual-news-public.ivixivi.workers.dev";
const cloudflarePagesPreviewUrl = "https://the-actual-news.pages.dev";
const report = `# Public Launch Report

Generated: ${generatedAt}

Environment source: \`${relativeEnv}\`

## Verdict

${blocked.length === 0 ? "Public launch configuration is strict-ready." : `Public launch is not strict-ready. ${blocked.length} blocker(s) remain.`}

## Readiness

| Area | Status | Required action |
| --- | --- | --- |
${checks.map((check) => `| ${check.label} | ${statusIcon(check.status)} | ${check.status ? "No action." : check.action} |`).join("\n")}

## Public Surface

These routes are public-safe and covered by the public smoke gate:

${publicRoutes.map((route) => `- \`${route}\``).join("\n")}

## Current Cloudflare Deployment

- Full dynamic public app Worker: \`${cloudflareWorkerUrl}\`
- Partner-shareable static media-kit Pages preview: \`${cloudflarePagesPreviewUrl}/media-kit/\`
- Worker smoke command: \`pnpm cloudflare:smoke\`
- Worker build/deploy commands: \`pnpm cloudflare:build\`, \`pnpm cloudflare:preview\`, \`pnpm cloudflare:deploy\`
- Final custom-domain gate remains: \`PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://recordswatch.org pnpm launch:deployed\`

## Audience And Revenue

- Stable distribution URLs: \`/go/briefing\`, \`/go/membership\`, \`/go/sponsor\`
- Growth capability flags in \`/api/healthz\` and \`/launch.json\`: share packets, share kit, provider handoff, campaign packets, media kit, sponsor registry, offer packets, structured data, feeds, and conversion routes
- Public readiness ledger: \`/launch\` links operators to \`/launch.json\`, \`/runbook.json\`, \`/share-kit.json\`, \`/provider-handoff.json\`, \`/provider-pages\`, \`/campaigns.json\`, \`/media-kit\`, \`/distribution\`, and feed endpoints
- Public principles: \`/principles\` explains the editorial firewall, funding boundary, and public/internal separation
- Sponsor registry: \`/sponsors\` and \`/sponsors.json\` expose disclosure-ready sponsor status, sponsor lanes, and firewall rules
- Media kit: \`/media-kit\` and \`/media-kit.json\` expose public positioning, proof points, press copy, and sponsor-safe boundary notes
- Install metadata: \`/site.webmanifest\` and \`/icon.svg\` provide public-safe branded install/bookmark assets and shortcuts
- Discoverability endpoints: \`/sitemap.xml\` includes public offer, conversion, clip, story, sponsor registry, media-kit, share-kit, provider-handoff, provider-pages, and campaign URLs; \`/robots.txt\` advertises sitemap, RSS, JSON Feed, distribution kit, launch manifest, share kit, provider handoff, provider pages, campaigns, media kit, sponsor registry, and health
- Atom share packets in \`/distribution\` and \`/launch.json\`: clip URL, story URL, social-card URL, X share URL, LinkedIn share URL, and email share URL
- Viral entry pages: public clip and story pages expose X, LinkedIn, email, card, copy URL, and copy text controls
- Copy-ready distribution controls: \`/distribution\` exposes copy buttons for launch copy, public route URLs, atom URLs, atom text, and offer packets
- Machine-readable share kit: \`/share-kit.json\` exposes public launch copy, routes, atoms, campaign packets, offer packets, and the internal boundary for social automation
- Machine-readable media kit: \`/media-kit.json\` exposes public positioning, proof points, press copy, public assets, sponsor-safe notes, and the internal boundary for press, partner, and sponsor outreach
- Machine-readable provider handoff: \`/provider-handoff.json\` exposes public provider page copy, fields, attribution parameters, acceptance criteria, and internal-boundary warnings
- Human-readable provider pages: \`/provider-pages\` exposes copy-ready setup packets for newsletter, membership, and sponsor providers without publishing provider credentials or private records
- Machine-readable launch runbook: \`/runbook.json\` exposes operator steps, public commands, blockers, and boundary notes
- Machine-readable campaign kit: \`/campaigns.json\` exposes recurring public campaign packets for atom, briefing, membership, and sponsor distribution
- Machine-readable sponsor registry: \`/sponsors.json\` exposes disclosure-ready sponsor status, sponsor lanes, firewall rules, and public/internal boundary warnings
- Public offer packets in \`/distribution\`, \`/launch.json\`, and \`/share-kit.json\`: briefing, membership, and sponsor copy with public package/pricing summaries and conversion steps
- Browser-safe JSON-LD: public organization, website, story/article, clipping, and offer metadata
- Provider URLs belong in \`NEXT_PUBLIC_NEWSLETTER_URL\`, \`NEXT_PUBLIC_MEMBERSHIP_URL\`, and \`NEXT_PUBLIC_SPONSOR_URL\`
- Provider setup checklist: \`docs/revenue-provider-onboarding.md\`
- Provider page copy, fields, attribution, and acceptance criteria: \`docs/provider-page-specs.md\`
- Provider API keys, webhook secrets, CRM tokens, payment keys, and email-service credentials stay internal
- Sponsor CRM records, private sponsor notes, contracts, banking details, and payment credentials stay internal
- Public events: \`Hero CTA\`, \`Revenue CTA\`, \`Revenue Detail\`, \`Atom Share\`

## Public/Internal Boundary

Public configuration may contain only browser-safe URLs, display strings, booleans, and keyless analytics settings.

Internal-only values include:

- \`POSTGRES_URI\`
- \`POSTGRES_PASSWORD\`
- blob-store access keys
- model gateway configuration
- event bus credentials
- payment, email, CRM, and webhook secrets
- reviewer queues and task-assignment operations

## Required Commands

\`\`\`bash
PUBLIC_SITE_URL=https://recordswatch.org PUBLIC_API_URL=https://recordswatch.org ANALYTICS_DOMAIN=recordswatch.org pnpm public-env:template > .env.public
pnpm launch:local
PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict
pnpm cloudflare:build
pnpm cloudflare:preview
PUBLIC_WEB_BASE_URL=http://127.0.0.1:8787 pnpm smoke:public
pnpm cloudflare:deploy
pnpm cloudflare:smoke
PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=https://recordswatch.org pnpm launch:deployed
pnpm conformance:doctor
bash tools/migrate.sh
pnpm conformance:test
\`\`\`

## Notes

- Docker is optional for local public-web work and managed deployment.
- \`pnpm container:check\` audits optional Docker boundary files without Docker installed.
- DB-backed conformance requires \`POSTGRES_URI\` and a reachable PostgreSQL database.
`;

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
if (fs.existsSync(outputFile)) {
  const existingReport = fs.readFileSync(outputFile, "utf8");
  const existingGeneratedAt = existingReport.match(/^Generated: (.+)$/m)?.[1];
  if (existingGeneratedAt && normalizeGeneratedAt(existingReport) === normalizeGeneratedAt(report)) {
    fs.writeFileSync(outputFile, report.replace(/^Generated: .+$/m, `Generated: ${existingGeneratedAt}`));
  } else {
    fs.writeFileSync(outputFile, report);
  }
} else {
  fs.writeFileSync(outputFile, report);
}
console.log(`Wrote ${path.relative(root, outputFile)}`);
if (blocked.length > 0) {
  console.log(`Launch report contains ${blocked.length} blocker(s).`);
}
