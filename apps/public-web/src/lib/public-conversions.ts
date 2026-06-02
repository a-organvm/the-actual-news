import { MEMBERSHIP_URL, NEWSLETTER_URL, SITE_URL, SPONSOR_URL } from "./env";
import { hostedProviderUrlReady } from "./public-url";

export type ConversionTarget = "briefing" | "membership" | "sponsor";

export type PublicConversion = {
  target: ConversionTarget;
  label: string;
  publicPath: string;
  redirectPath: string;
  providerUrl: string;
  providerConfigured: boolean;
};

const conversions: Record<ConversionTarget, Omit<PublicConversion, "providerConfigured">> = {
  briefing: {
    target: "briefing",
    label: "Briefing",
    publicPath: "/briefing",
    redirectPath: "/go/briefing",
    providerUrl: NEWSLETTER_URL
  },
  membership: {
    target: "membership",
    label: "Membership",
    publicPath: "/membership",
    redirectPath: "/go/membership",
    providerUrl: MEMBERSHIP_URL
  },
  sponsor: {
    target: "sponsor",
    label: "Sponsor",
    publicPath: "/sponsor",
    redirectPath: "/go/sponsor",
    providerUrl: SPONSOR_URL
  }
};

export function publicConversions(): PublicConversion[] {
  return (Object.keys(conversions) as ConversionTarget[]).map((target) => {
    const conversion = conversions[target];
    return {
      ...conversion,
      providerConfigured: hostedProviderUrlReady(conversion.providerUrl, SITE_URL)
    };
  });
}

export function conversionForTarget(target: string | undefined) {
  if (!target) return undefined;
  return publicConversions().find((conversion) => conversion.target === target);
}
