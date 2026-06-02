import { publicOffers } from "./public-offers";

export type SponsorDisclosure = {
  sponsor: string;
  beat: string;
  amount: string;
  starts_at: string;
  ends_at: string;
  disclosure_url: string;
};

export const sponsorDisclosures: SponsorDisclosure[] = [];

export const sponsorFirewallRules = [
  "Sponsors do not receive editorial control, claim approval, placement guarantees, or correction vetoes.",
  "Accepted sponsorships are disclosed before fulfillment.",
  "Private sponsor notes, CRM records, contracts, invoices, and payment credentials stay internal.",
  "Funding supports reporting capacity; public claims and corrections remain inspectable."
];

export function publicSponsorRegistry() {
  return {
    schema_version: "public-sponsor-registry.v1",
    generated_at: new Date().toISOString(),
    status: sponsorDisclosures.length > 0 ? "active" : "open_for_sponsors",
    intake_path: "/go/sponsor",
    public_offer_path: publicOffers.sponsor.path,
    current_disclosures: sponsorDisclosures,
    proposed_lanes: publicOffers.sponsor.packages.map((offerPackage) => ({
      name: offerPackage.name,
      price: offerPackage.price,
      summary: offerPackage.summary,
      public_terms: offerPackage.bullets
    })),
    firewall_rules: sponsorFirewallRules,
    internal_boundary: {
      publishable: [
        "sponsor name after acceptance",
        "funded beat",
        "public amount or range",
        "disclosure period",
        "firewall terms"
      ],
      never_publish: [
        "CRM tokens",
        "payment keys",
        "private sponsor notes",
        "contract drafts",
        "banking details",
        "reviewer queues",
        "database URLs"
      ]
    }
  };
}
