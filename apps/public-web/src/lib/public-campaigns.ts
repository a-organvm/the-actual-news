import { withUtm } from "./public-analytics";
import { absoluteUrl, publicFeedItems, publicSharePacket } from "./public-feed";
import { publicOffers } from "./public-offers";

export type PublicCampaignPacket = {
  id: string;
  lane: "audience" | "atom" | "revenue" | "sponsor";
  cadence: string;
  channel: string;
  headline: string;
  copy: string;
  primary_path: string;
  tracked_path: string;
  primary_url: string;
  cta_label: string;
  content_id?: string;
  conversion_target?: string;
};

const leadAtom = publicFeedItems[0];
const memberAtom = publicFeedItems.find((item) => item.id === "member-investigations") ?? leadAtom;
const leadPacket = publicSharePacket(leadAtom);

export const publicCampaignPackets: PublicCampaignPacket[] = [
  {
    id: "morning-crier-briefing",
    lane: "audience",
    cadence: "weekday morning",
    channel: "newsletter and short social",
    headline: "Morning crier briefing",
    copy: `${publicOffers.briefing.distributionCopy} Start with ${leadAtom.title}.`,
    primary_path: "/go/briefing",
    tracked_path: withUtm("/go/briefing", {
      source: "campaign_queue",
      medium: "audience",
      campaign: "morning_crier_briefing",
      content: leadAtom.id
    }),
    primary_url: absoluteUrl("/go/briefing"),
    cta_label: publicOffers.briefing.primaryLabel,
    content_id: leadAtom.id,
    conversion_target: "briefing"
  },
  {
    id: "records-watch-atom",
    lane: "atom",
    cadence: "same day as update",
    channel: "X, LinkedIn, email forward",
    headline: "Push the public atom",
    copy: leadPacket.share_text,
    primary_path: leadAtom.path,
    tracked_path: withUtm(leadAtom.path, {
      source: "campaign_queue",
      medium: "atom",
      campaign: "records_watch_atom",
      content: leadAtom.id
    }),
    primary_url: leadPacket.clip_url,
    cta_label: "Read the atom",
    content_id: leadAtom.id
  },
  {
    id: "member-funded-followup",
    lane: "revenue",
    cadence: "after a useful atom moves",
    channel: "story footer, newsletter, social reply",
    headline: "Turn attention into member support",
    copy: `${publicOffers.membership.distributionCopy} Reader funding keeps source collection and correction work moving.`,
    primary_path: "/go/membership",
    tracked_path: withUtm("/go/membership", {
      source: "campaign_queue",
      medium: "revenue",
      campaign: "member_funded_followup",
      content: memberAtom.id
    }),
    primary_url: absoluteUrl("/go/membership"),
    cta_label: publicOffers.membership.primaryLabel,
    content_id: memberAtom.id,
    conversion_target: "membership"
  },
  {
    id: "sponsor-civic-underwriting",
    lane: "sponsor",
    cadence: "weekly partner outreach",
    channel: "partner email and sponsor packet",
    headline: "Civic underwriting note",
    copy: `${publicOffers.sponsor.distributionCopy} Sponsorship funds reporting capacity; it does not buy conclusions.`,
    primary_path: "/go/sponsor",
    tracked_path: withUtm("/go/sponsor", {
      source: "campaign_queue",
      medium: "sponsor",
      campaign: "civic_underwriting",
      content: leadAtom.id
    }),
    primary_url: absoluteUrl("/go/sponsor"),
    cta_label: publicOffers.sponsor.primaryLabel,
    content_id: leadAtom.id,
    conversion_target: "sponsor"
  }
];

export function publicCampaignKit() {
  return {
    schema_version: "public-campaign-kit.v1",
    generated_at: new Date().toISOString(),
    campaign_count: publicCampaignPackets.length,
    attribution_parameters: ["utm_source", "utm_medium", "utm_campaign", "utm_content"],
    campaigns: publicCampaignPackets,
    internal_boundary: {
      publishable: [
        "campaign copy",
        "public atom URLs",
        "public conversion routes",
        "UTM parameter names",
        "cadence labels",
        "channel labels"
      ],
      never_publish: [
        "ad account credentials",
        "newsletter API tokens",
        "CRM tokens",
        "payment keys",
        "private audience exports",
        "reviewer queues",
        "database URLs"
      ]
    }
  };
}
