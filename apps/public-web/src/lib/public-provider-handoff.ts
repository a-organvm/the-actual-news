import { publicConversions, type ConversionTarget } from "./public-conversions";
import { SITE_URL } from "./env";
import { publicOfferList } from "./public-offers";

type ProviderSpec = {
  env_key: string;
  provider_types: string[];
  form_fields: string[];
  confirmation_copy: string;
  acceptance_criteria: string[];
};

const providerSpecs: Record<ConversionTarget, ProviderSpec> = {
  briefing: {
    env_key: "NEXT_PUBLIC_NEWSLETTER_URL",
    provider_types: ["Beehiiv", "Buttondown", "Substack", "ConvertKit", "Ghost", "hosted newsletter form"],
    form_fields: [
      "Email address, required",
      "Name, optional",
      "Source story or clip, hidden from utm_content when supported",
      "Campaign source, hidden from utm_source",
      "Campaign medium, hidden from utm_medium",
      "Campaign name, hidden from utm_campaign"
    ],
    confirmation_copy:
      "You are on the briefing list. New clippings, verification notes, correction updates, and share-ready story atoms will point back to the public ledger.",
    acceptance_criteria: [
      "/go/briefing redirects to the hosted newsletter page when configured",
      "The provider records or preserves utm_source, utm_medium, utm_campaign, and utm_content",
      "The public app passes strict launch checking with the hosted URL"
    ]
  },
  membership: {
    env_key: "NEXT_PUBLIC_MEMBERSHIP_URL",
    provider_types: ["Stripe Payment Link", "OpenCollective", "Patreon", "Ghost memberships", "Memberful", "hosted checkout page"],
    form_fields: [
      "Email address, required",
      "Name, optional",
      "Membership tier, required",
      "Campaign source, hidden or metadata from utm_source",
      "Campaign medium, hidden or metadata from utm_medium",
      "Campaign name, hidden or metadata from utm_campaign",
      "Source story or clip, hidden or metadata from utm_content"
    ],
    confirmation_copy:
      "Thanks for backing reader-funded verification. Your membership helps pay for source collection, claim work, corrections, and public ledgers.",
    acceptance_criteria: [
      "/go/membership redirects to the hosted checkout or membership page when configured",
      "Checkout can complete without the public app receiving payment credentials",
      "The public app passes strict launch checking with the hosted URL"
    ]
  },
  sponsor: {
    env_key: "NEXT_PUBLIC_SPONSOR_URL",
    provider_types: ["HubSpot form", "Airtable form", "Typeform", "Tally", "Calendly", "hosted sponsorship packet"],
    form_fields: [
      "Name, required",
      "Organization, required",
      "Email address, required",
      "Sponsorship interest, required",
      "Budget range, optional",
      "Beat or topic of interest, optional",
      "Firewall acknowledgement, required checkbox",
      "Public disclosure acknowledgement, required checkbox",
      "Campaign source, hidden from utm_source",
      "Campaign medium, hidden from utm_medium",
      "Campaign name, hidden from utm_campaign",
      "Source story or clip, hidden from utm_content"
    ],
    confirmation_copy:
      "Thanks for the sponsorship inquiry. We will review fit, firewall terms, public disclosure, and reporting capacity before any sponsorship is accepted.",
    acceptance_criteria: [
      "/go/sponsor redirects to the hosted sponsor form or calendar when configured",
      "The form captures firewall and disclosure acknowledgement before submission",
      "The public app passes strict launch checking with the hosted URL"
    ]
  }
};

export function publicProviderHandoff() {
  const conversions = publicConversions();

  return {
    schema_version: "public-provider-handoff.v1",
    generated_at: new Date().toISOString(),
    attribution_parameters: ["utm_source", "utm_medium", "utm_campaign", "utm_content"],
    provider_pages: publicOfferList.map((offer) => {
      const conversion = conversions.find((item) => item.target === offer.id);
      const spec = providerSpecs[offer.id];

      return {
        id: offer.id,
        title: offer.title,
        kicker: offer.kicker,
        env_key: spec.env_key,
        public_path: offer.path,
        stable_distribution_route: conversion?.redirectPath,
        provider_url_configured: conversion?.providerConfigured ?? false,
        provider_types: spec.provider_types,
        primary_copy: offer.description,
        cta_label: offer.primaryLabel,
        distribution_copy: offer.distributionCopy,
        form_fields: spec.form_fields,
        packages: offer.packages,
        conversion_steps: offer.conversionSteps,
        confirmation_copy: spec.confirmation_copy,
        acceptance_criteria: spec.acceptance_criteria
      };
    }),
    final_verification: [
      "PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict",
      `PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=${SITE_URL} pnpm launch:deployed`,
      "pnpm launch:local"
    ],
    internal_boundary: {
      publishable: [
        "hosted provider URLs",
        "public offer copy",
        "provider page fields",
        "UTM parameter names",
        "public conversion routes",
        "provider configured booleans"
      ],
      never_publish: [
        "payment processor secret keys",
        "webhook signing secrets",
        "newsletter API tokens",
        "CRM API tokens",
        "fulfillment credentials",
        "database URLs",
        "reviewer queues"
      ]
    }
  };
}
