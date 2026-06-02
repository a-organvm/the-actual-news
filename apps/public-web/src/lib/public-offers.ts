import type { ConversionTarget } from "./public-conversions";

export type PublicOfferPackage = {
  name: string;
  price: string;
  summary: string;
  bullets: string[];
};

export type PublicConversionStep = {
  label: string;
  summary: string;
};

export type PublicOffer = {
  id: ConversionTarget;
  path: string;
  title: string;
  kicker: string;
  description: string;
  primaryLabel: string;
  fallbackNote: string;
  distributionCopy: string;
  packagesTitle: string;
  packages: PublicOfferPackage[];
  conversionSteps: PublicConversionStep[];
};

export const publicOffers: Record<ConversionTarget, PublicOffer> = {
  briefing: {
    id: "briefing",
    path: "/briefing",
    title: "Join the Daily Briefing",
    kicker: "Town crier dispatch",
    description:
      "Own the audience relationship with a concise briefing that sends readers back to the public ledger instead of trapping them in a feed.",
    primaryLabel: "Join the briefing",
    fallbackNote:
      "Set NEXT_PUBLIC_NEWSLETTER_URL to connect this page to Beehiiv, Buttondown, Substack, ConvertKit, or another hosted newsletter form.",
    distributionCopy:
      "Get the public square digest: new clippings, verification notes, correction updates, and the story atoms worth sharing.",
    packagesTitle: "Briefing editions",
    packages: [
      {
        name: "Morning cry",
        price: "Free",
        summary: "The public square digest.",
        bullets: ["New clippings", "Top verification notes", "RSS and JSON feed links"]
      },
      {
        name: "Weekly docket",
        price: "Member-backed",
        summary: "A slower, source-heavy round-up.",
        bullets: ["Evidence gaps", "Correction log", "What needs funding next"]
      },
      {
        name: "Breaking ledger",
        price: "Launch lane",
        summary: "Fast-moving stories with receipts attached.",
        bullets: ["Share-ready atoms", "Social clipping cards", "Canonical ledger links"]
      }
    ],
    conversionSteps: [
      {
        label: "Capture",
        summary: "Invite readers from clips, stories, RSS, JSON Feed, and social cards into the owned briefing list."
      },
      {
        label: "Return",
        summary: "Send every issue back to canonical atoms so subscribers keep sharing links with provenance attached."
      },
      {
        label: "Measure",
        summary: "Track joins through the /go/briefing route and keyless public events; provider analytics stay outside the app."
      }
    ]
  },
  membership: {
    id: "membership",
    path: "/membership",
    title: "Become a Founding Member",
    kicker: "Reader-funded press",
    description:
      "Fund the verification work directly: claims, evidence, corrections, and public-interest reporting that does not depend on ad inventory.",
    primaryLabel: "Start membership",
    fallbackNote:
      "Set NEXT_PUBLIC_MEMBERSHIP_URL to connect this page to Stripe Checkout, OpenCollective, Patreon, or another hosted membership provider.",
    distributionCopy:
      "Become a founding member and fund the verification work directly: claims, evidence, corrections, and public-interest reporting.",
    packagesTitle: "Membership editions",
    packages: [
      {
        name: "Reader",
        price: "$5/mo",
        summary: "Keep the public ledger moving.",
        bullets: ["Daily briefing", "Member notes", "Correction-watch updates"]
      },
      {
        name: "Sustainer",
        price: "$15/mo",
        summary: "Fund primary-source reporting capacity.",
        bullets: ["Everything in Reader", "Monthly evidence docket", "Vote on records-watch priorities"]
      },
      {
        name: "Founding Press",
        price: "$50/mo",
        summary: "Underwrite a verification-first newsroom spine.",
        bullets: ["Everything in Sustainer", "Founding member roll", "Quarterly ledger briefing"]
      }
    ],
    conversionSteps: [
      {
        label: "Convert",
        summary: "Route high-intent readers from viral atoms into the /go/membership route with UTM attribution preserved."
      },
      {
        label: "Fund",
        summary: "Explain exactly what membership pays for: source collection, claim work, corrections, and public ledgers."
      },
      {
        label: "Report back",
        summary: "Use member notes and public launch reports to show what reader funding moved forward."
      }
    ]
  },
  sponsor: {
    id: "sponsor",
    path: "/sponsor",
    title: "Sponsor a Public-Interest Beat",
    kicker: "Civic underwriting",
    description:
      "Underwrite a reporting lane without buying editorial control: public records, local accountability, civic data, and explainers with visible verification.",
    primaryLabel: "Sponsor a beat",
    fallbackNote: "Set NEXT_PUBLIC_SPONSOR_URL to connect this page to a CRM intake form, sponsorship packet, or calendar link.",
    distributionCopy:
      "Sponsor a public-interest beat without buying editorial control: records watch, civic data, and verification-first explainers.",
    packagesTitle: "Sponsorship notices",
    packages: [
      {
        name: "Records Watch",
        price: "$500/mo",
        summary: "Support a local public-records lane.",
        bullets: ["Agenda tracking", "Budget/procurement watch", "Public sponsor disclosure"]
      },
      {
        name: "Civic Data",
        price: "$1,500/mo",
        summary: "Fund structured explainers and datasets.",
        bullets: ["Evidence-backed explainers", "Reusable data notes", "No editorial control"]
      },
      {
        name: "Investigation Pool",
        price: "$5,000/mo",
        summary: "Underwrite deeper reporting capacity.",
        bullets: ["Primary-source collection", "Verification docket", "Transparent firewall terms"]
      }
    ],
    conversionSteps: [
      {
        label: "Qualify",
        summary: "Route sponsors through the /go/sponsor route into a hosted intake form or calendar, never an internal CRM route."
      },
      {
        label: "Disclose",
        summary: "Publish the funded beat and firewall terms so readers can inspect the relationship."
      },
      {
        label: "Fulfill",
        summary: "Use sponsor money for reporting capacity while keeping claims, ranking, and corrections editorially independent."
      }
    ]
  }
};

export const publicOfferList = [publicOffers.briefing, publicOffers.membership, publicOffers.sponsor];
