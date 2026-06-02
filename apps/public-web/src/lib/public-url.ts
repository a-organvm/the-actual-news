export function publicUrlReady(value: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !["localhost", "127.0.0.1", "::1"].includes(url.hostname) &&
      !placeholderHost(url.hostname)
    );
  } catch {
    return false;
  }
}

export function trustedAnalyticsScriptUrlReady(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "plausible.io" && url.pathname.startsWith("/js/");
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

function placeholderHost(hostname: string) {
  return (
    hostname === "example.com" ||
    hostname === "example.org" ||
    hostname === "example.net" ||
    hostname.endsWith(".example") ||
    hostname.includes("your-") ||
    hostname.includes("todo")
  );
}

export function hostedProviderUrlReady(value: string, siteUrl: string) {
  if (!publicUrlReady(value)) return false;

  try {
    const url = new URL(value);
    const canonicalSite = publicUrlReady(siteUrl) ? new URL(siteUrl) : null;
    return !(
      canonicalSite &&
      url.origin === canonicalSite.origin &&
      publicAppRoutePatterns.some((pattern) => pattern.test(url.pathname))
    );
  } catch {
    return false;
  }
}
