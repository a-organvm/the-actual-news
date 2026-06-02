import {
  ANALYTICS_DOMAIN,
  ANALYTICS_SCRIPT_URL,
  ENABLE_VERIFIER_WORKSPACE,
  MEMBERSHIP_URL,
  NEWSLETTER_URL,
  PUBLIC_API_URI,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  SPONSOR_URL
} from "./env";
import { publicCampaignKit } from "./public-campaigns";
import { publicConversions } from "./public-conversions";
import { publicShareKit } from "./public-distribution";
import { absoluteUrl, publicFeedItems, publicSharePacket, socialCardPath } from "./public-feed";
import { publicMediaKit } from "./public-media-kit";
import { publicOfferList } from "./public-offers";
import { publicProviderHandoff } from "./public-provider-handoff";
import { publicSponsorRegistry } from "./public-sponsors";
import { hostedProviderUrlReady, publicUrlReady, trustedAnalyticsScriptUrlReady } from "./public-url";

export type LaunchCheck = {
  label: string;
  value: string;
  ready: boolean;
  action: string;
};

export const launchChecks: LaunchCheck[] = [
  {
    label: "Canonical domain",
    value: SITE_URL,
    ready: publicUrlReady(SITE_URL),
    action: "Set the public https origin for metadata, feeds, and social cards."
  },
  {
    label: "Reader-safe gateway",
    value: PUBLIC_API_URI,
    ready: publicUrlReady(PUBLIC_API_URI),
    action: "Point the public app at the deployed gateway that exposes published story routes only."
  },
  {
    label: "Newsletter capture",
    value: NEWSLETTER_URL || "Not configured",
    ready: hostedProviderUrlReady(NEWSLETTER_URL, SITE_URL),
    action: "Add the hosted newsletter signup URL outside this app's fallback routes."
  },
  {
    label: "Membership checkout",
    value: MEMBERSHIP_URL || "Not configured",
    ready: hostedProviderUrlReady(MEMBERSHIP_URL, SITE_URL),
    action: "Add the hosted membership or payment page URL outside this app's fallback routes."
  },
  {
    label: "Sponsor intake",
    value: SPONSOR_URL || "Not configured",
    ready: hostedProviderUrlReady(SPONSOR_URL, SITE_URL),
    action: "Add the hosted sponsor inquiry or CRM intake URL outside this app's fallback routes."
  },
  {
    label: "Audience analytics",
    value: ANALYTICS_DOMAIN || "Not configured",
    ready: Boolean(ANALYTICS_DOMAIN),
    action: "Set a keyless analytics domain for measuring public growth."
  },
  {
    label: "Analytics script",
    value: ANALYTICS_SCRIPT_URL,
    ready: trustedAnalyticsScriptUrlReady(ANALYTICS_SCRIPT_URL),
    action: "Use the CSP-allowed Plausible browser script URL for public analytics."
  },
  {
    label: "Verifier workspace",
    value: ENABLE_VERIFIER_WORKSPACE ? "Enabled" : "Disabled",
    ready: !ENABLE_VERIFIER_WORKSPACE,
    action: "Keep disabled in the public app; use a private authenticated deployment for reviewers."
  }
];

const publicPaths = [
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
  "/runbook.json",
  "/share-kit.json",
  "/sponsor",
  "/sponsors",
  "/sponsors.json",
  "/v1/feed",
  "/v1/story/:story_id",
  "/story/:story_id",
  "/verify"
];

export function publicGrowthCapabilities() {
  return {
    atom_count: publicFeedItems.length,
    atom_share_packets: publicFeedItems.every((item) => {
      const packet = publicSharePacket(item);
      return Boolean(packet.clip_url && packet.story_url && packet.social_card_url && packet.channels.x && packet.channels.linkedin && packet.channels.email);
    }),
    offer_count: publicOfferList.length,
    offer_packets: publicOfferList.every((offer) => offer.packages.length > 0 && Boolean(offer.distributionCopy)),
    structured_data: true,
    feeds: {
      rss: true,
      json: true
    },
    share_kit: publicShareKit().atoms.length === publicFeedItems.length,
    provider_handoff: publicProviderHandoff().provider_pages.length === publicOfferList.length,
    campaign_packets: publicCampaignKit().campaign_count > 0,
    media_kit: publicMediaKit().schema_version === "public-media-kit.v1",
    sponsor_registry: publicSponsorRegistry().schema_version === "public-sponsor-registry.v1",
    conversion_routes: publicConversions().every((conversion) => conversion.redirectPath.startsWith("/go/"))
  };
}

export function publicLaunchManifest() {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const readyCount = launchChecks.filter((check) => check.ready).length;

  return {
    schema_version: "public-launch.v1",
    generated_at: new Date().toISOString(),
    site: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: baseUrl,
      icon_url: `${baseUrl}/icon.svg`,
      manifest_url: `${baseUrl}/site.webmanifest`
    },
    readiness: {
      ready_count: readyCount,
      total_count: launchChecks.length,
      checks: launchChecks
    },
    public_routes: publicPaths.map((path) => ({
      path,
      url: `${baseUrl}${path}`
    })),
    feeds: [
      { type: "rss", url: `${baseUrl}/feed.xml` },
      { type: "json", url: `${baseUrl}/feed.json` }
    ],
    campaigns: publicCampaignKit().campaigns,
    media_kit: publicMediaKit(),
    sponsor_registry: publicSponsorRegistry(),
    growth_capabilities: publicGrowthCapabilities(),
    atoms: publicFeedItems.map((item) => ({
      id: item.id,
      title: item.title,
      kicker: item.kicker,
      summary: item.summary,
      clip_url: absoluteUrl(item.path),
      story_url: absoluteUrl(item.storyPath),
      social_card_url: absoluteUrl(socialCardPath({ ...item, state: "published" })),
      share_packet: publicSharePacket(item),
      published_at: item.publishedAt
    })),
    conversion_routes: publicConversions().map((conversion) => ({
      label: conversion.target,
      public_path: conversion.publicPath,
      redirect_path: conversion.redirectPath,
      provider_url_configured: conversion.providerConfigured
    })),
    offers: publicOfferList.map((offer) => ({
      id: offer.id,
      title: offer.title,
      path: offer.path,
      url: `${baseUrl}${offer.path}`,
      distribution_copy: offer.distributionCopy,
      conversion_steps: offer.conversionSteps,
      packages: offer.packages
    })),
    public_events: ["Hero CTA", "Revenue CTA", "Revenue Detail", "Atom Share"],
    internal_boundary: {
      verifier_workspace_publicly_enabled: ENABLE_VERIFIER_WORKSPACE,
      forbidden_public_values: [
        "database URLs",
        "payment keys",
        "newsletter API tokens",
        "CRM credentials",
        "reviewer queues",
        "model gateway URLs",
        "webhook secrets"
      ]
    }
  };
}
