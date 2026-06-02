import { SITE_URL } from "./env";

export type UtmParams = {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
};

export function withUtm(href: string, params: UtmParams) {
  if (!href) return href;

  const base = href.startsWith("http") ? href : `${SITE_URL.replace(/\/$/, "")}${href.startsWith("/") ? href : `/${href}`}`;
  const url = new URL(base);
  url.searchParams.set("utm_source", params.source);
  url.searchParams.set("utm_medium", params.medium);
  url.searchParams.set("utm_campaign", params.campaign);
  if (params.content) url.searchParams.set("utm_content", params.content);

  if (href.startsWith("http")) return url.toString();
  return `${url.pathname}${url.search}${url.hash}`;
}

type PublicEventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: PublicEventProps }) => void;
  }
}

export function trackPublicEvent(eventName: string, props: PublicEventProps = {}) {
  if (typeof window === "undefined" || typeof window.plausible !== "function") return;
  window.plausible(eventName, { props });
}
