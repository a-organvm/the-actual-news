const siteUrl = process.env.PUBLIC_SITE_URL ?? "https://recordswatch.org";
const publicApiUrl = process.env.PUBLIC_API_URL ?? siteUrl;
const newsletterUrl = process.env.NEWSLETTER_URL ?? "";
const membershipUrl = process.env.MEMBERSHIP_URL ?? "";
const sponsorUrl = process.env.SPONSOR_URL ?? "";
const analyticsDomain = process.env.ANALYTICS_DOMAIN ?? new URL(siteUrl).hostname;

const lines = [
  "# Public launch environment. Browser-safe values only.",
  "# Copy to .env.public and fill hosted provider URLs. Do not add secrets here.",
  "# Hosted provider URLs are public landing/checkout/intake destinations.",
  "# Never put API keys, webhook secrets, CRM tokens, database URLs, or reviewer endpoints here.",
  "NEXT_PUBLIC_PLATFORM_ID=plf_public_01",
  `NEXT_PUBLIC_SITE_URL=${siteUrl}`,
  "NEXT_PUBLIC_SITE_TITLE=Records Watch",
  "NEXT_PUBLIC_SITE_DESCRIPTION=Verifiable civic record platform with public claim ledgers, evidence graphs, and correction history.",
  `NEXT_PUBLIC_PUBLIC_API_URI=${publicApiUrl}`,
  `NEXT_PUBLIC_ANALYTICS_DOMAIN=${analyticsDomain}`,
  "# Must stay aligned with Content-Security-Policy script-src.",
  "NEXT_PUBLIC_ANALYTICS_SCRIPT_URL=https://plausible.io/js/script.js",
  "",
  "# Must be hosted destinations outside this app's /go/*, /briefing, /membership, /sponsor, /media-kit, /api/*, and /v1/* routes.",
  "# Examples: Beehiiv/Buttondown/Substack signup, Stripe Payment Link/OpenCollective/Patreon, CRM form/calendar/sponsor packet.",
  `NEXT_PUBLIC_NEWSLETTER_URL=${newsletterUrl}`,
  `NEXT_PUBLIC_MEMBERSHIP_URL=${membershipUrl}`,
  `NEXT_PUBLIC_SPONSOR_URL=${sponsorUrl}`,
  "",
  "# Keep false for the public website. Reviewer queues belong on an authenticated internal deployment.",
  "NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE=false",
  "PUBLIC_WEB_PORT=3000"
];

console.log(lines.join("\n"));
