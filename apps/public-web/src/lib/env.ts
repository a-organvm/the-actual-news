export const PLATFORM_ID = process.env.NEXT_PUBLIC_PLATFORM_ID ?? "plf_public";
export const NEWSLETTER_URL = process.env.NEXT_PUBLIC_NEWSLETTER_URL ?? "";
export const MEMBERSHIP_URL = process.env.NEXT_PUBLIC_MEMBERSHIP_URL ?? "";
export const SPONSOR_URL = process.env.NEXT_PUBLIC_SPONSOR_URL ?? "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theactual.news";
export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE ?? "The Actual News";
export const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
  "Verifiable reporting with public claim ledgers, evidence graphs, and correction history.";
export const ANALYTICS_DOMAIN = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN ?? "";
export const ANALYTICS_SCRIPT_URL = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL ?? "https://plausible.io/js/script.js";
export const ENABLE_VERIFIER_WORKSPACE = process.env.NEXT_PUBLIC_ENABLE_VERIFIER_WORKSPACE === "true";
export const PUBLIC_API_URI = process.env.NEXT_PUBLIC_PUBLIC_API_URI ?? "";

export const PUBLIC_ENV_SUMMARY = {
  platformId: PLATFORM_ID,
  publicApiUri: PUBLIC_API_URI,
  siteUrl: SITE_URL,
  analyticsEnabled: Boolean(ANALYTICS_DOMAIN),
  verifierWorkspaceEnabled: ENABLE_VERIFIER_WORKSPACE
};
