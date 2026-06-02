import { publicCampaignPackets } from "./public-campaigns";
import { publicFeedItems } from "./public-feed";
import { publicOffers } from "./public-offers";
import { publicSponsorRegistry } from "./public-sponsors";

export const mediaKitFacts = [
  "The Actual News turns reporting into shareable public atoms: clipping pages, story bundles, claim summaries, evidence edges, feeds, and correction history.",
  "The public app separates audience and revenue capture from internal reviewer, database, payment, email, CRM, and webhook systems.",
  "Reader funding, membership, and sponsorship support reporting capacity without buying claims, ranking, correction decisions, or internal access."
];

export const pressCopy = [
  {
    label: "One sentence",
    copy: "The Actual News is a newspaper-style public ledger where every story travels as shareable claim modules with receipts attached."
  },
  {
    label: "Short paragraph",
    copy:
      "The Actual News packages reporting for the town square: a front page, atomic clips, story bundles, RSS and JSON feeds, campaign packets, sponsor disclosures, and public launch artifacts that keep evidence and corrections attached as stories move."
  },
  {
    label: "Sponsor note",
    copy:
      "Sponsors can underwrite public-interest beats without buying editorial control; accepted sponsorships are disclosed through the public sponsor registry before fulfillment."
  }
];

export function publicMediaKit() {
  return {
    schema_version: "public-media-kit.v1",
    generated_at: new Date().toISOString(),
    positioning: {
      name: "The Actual News",
      tagline: "Read all about it, with receipts attached.",
      category: "verifiable public-service news ledger",
      audience: ["readers", "members", "civic sponsors", "local accountability partners", "distribution operators"]
    },
    facts: mediaKitFacts,
    proof_points: {
      public_atom_count: publicFeedItems.length,
      campaign_packet_count: publicCampaignPackets.length,
      briefing_offer: publicOffers.briefing.title,
      membership_offer: publicOffers.membership.title,
      sponsor_offer: publicOffers.sponsor.title,
      sponsor_registry_status: publicSponsorRegistry().status
    },
    press_copy: pressCopy,
    public_assets: [
      "/",
      "/distribution",
      "/campaigns.json",
      "/share-kit.json",
      "/provider-pages",
      "/provider-handoff.json",
      "/sponsors",
      "/sponsors.json",
      "/principles",
      "/launch",
      "/runbook.json",
      "/feed.xml",
      "/feed.json",
      "/icon.svg"
    ],
    internal_boundary: {
      publishable: ["positioning", "press copy", "public routes", "offer summaries", "sponsor disclosure terms"],
      never_publish: [
        "private traffic dashboards",
        "private audience exports",
        "ad account credentials",
        "newsletter API tokens",
        "payment keys",
        "CRM tokens",
        "webhook secrets",
        "database URLs",
        "reviewer queues"
      ]
    }
  };
}
