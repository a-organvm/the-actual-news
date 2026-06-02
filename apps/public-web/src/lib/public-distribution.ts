import { SITE_URL } from "./env";
import { withUtm } from "./public-analytics";
import { publicCampaignPackets } from "./public-campaigns";
import { publicFeedItems, publicSharePacket, socialCardPath } from "./public-feed";
import { publicMediaKit } from "./public-media-kit";
import { publicOfferList } from "./public-offers";
import { publicSponsorRegistry } from "./public-sponsors";

export type LaunchMessage = {
  channel: string;
  copy: string;
};

export type DistributionRoute = {
  label: string;
  href: string;
};

export const launchMessages: LaunchMessage[] = [
  {
    channel: "Short post",
    copy: "Read all about it: The Actual News turns stories into shareable claim modules with receipts attached."
  },
  {
    channel: "Newsletter blurb",
    copy: "The Actual News is building a public-service news ledger: narrative, claim ledger, evidence graph, and correction history in one public object."
  },
  {
    channel: "Sponsor note",
    copy: "Sponsor a public-interest beat without buying editorial control. Funding supports records watch, evidence collection, and verifiable explainers."
  }
];

export const distributionRoutes: DistributionRoute[] = [
  { label: "Front page", href: "/" },
  { label: "RSS feed", href: "/feed.xml" },
  { label: "JSON feed", href: "/feed.json" },
  { label: "Briefing signup", href: "/briefing" },
  { label: "Membership", href: "/membership" },
  { label: "Sponsor packet", href: "/sponsor" },
  { label: "Sponsor registry", href: "/sponsors" },
  { label: "Media kit", href: "/media-kit" },
  { label: "Principles", href: "/principles" },
  { label: "Launch ledger", href: "/launch" },
  { label: "Launch runbook JSON", href: "/runbook.json" },
  { label: "Media kit JSON", href: "/media-kit.json" },
  { label: "Share kit JSON", href: "/share-kit.json" },
  { label: "Provider handoff JSON", href: "/provider-handoff.json" },
  { label: "Campaigns JSON", href: "/campaigns.json" },
  { label: "Sponsors JSON", href: "/sponsors.json" }
];

function canonicalUrl(path: string) {
  return `${SITE_URL.replace(/\/$/, "")}${path}`;
}

function routeCampaign(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function publicShareKit() {
  const baseUrl = SITE_URL.replace(/\/$/, "");

  return {
    schema_version: "public-share-kit.v1",
    generated_at: new Date().toISOString(),
    source: {
      title: "The Actual News",
      url: baseUrl,
      distribution_url: canonicalUrl("/distribution")
    },
    launch_messages: launchMessages,
    public_routes: distributionRoutes.map((route) => ({
      label: route.label,
      path: route.href,
      url: canonicalUrl(route.href),
      tracked_path: withUtm(route.href, {
        source: "share_kit",
        medium: "route",
        campaign: routeCampaign(route.label)
      })
    })),
    atoms: publicFeedItems.map((item) => {
      const sharePacket = publicSharePacket(item);

      return {
        id: item.id,
        title: item.title,
        kicker: item.kicker,
        summary: item.summary,
        clip_path: item.path,
        story_path: item.storyPath,
        social_card_path: socialCardPath({ ...item, state: "published" }),
        share_packet: sharePacket
      };
    }),
    offers: publicOfferList.map((offer) => ({
      id: offer.id,
      title: offer.title,
      path: offer.path,
      url: canonicalUrl(offer.path),
      cta_label: offer.primaryLabel,
      distribution_copy: offer.distributionCopy,
      conversion_steps: offer.conversionSteps,
      packages: offer.packages
    })),
    campaigns: publicCampaignPackets,
    media_kit: publicMediaKit(),
    sponsor_registry: publicSponsorRegistry(),
    internal_boundary: {
      publishable: [
        "public routes",
        "clip URLs",
        "story URLs",
        "social-card URLs",
        "share text",
        "campaign copy",
        "press copy",
        "offer copy",
        "sponsor disclosure terms",
        "public package summaries"
      ],
      never_publish: [
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
