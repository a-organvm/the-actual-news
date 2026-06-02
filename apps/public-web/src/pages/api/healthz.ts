import type { NextApiRequest, NextApiResponse } from "next";
import {
  ANALYTICS_DOMAIN,
  ENABLE_VERIFIER_WORKSPACE,
  PLATFORM_ID,
  PUBLIC_API_URI,
  SITE_URL
} from "../../lib/env";
import { publicConversions } from "../../lib/public-conversions";
import { publicGrowthCapabilities } from "../../lib/public-launch";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const conversions = Object.fromEntries(
    publicConversions().map((conversion) => [`${conversion.target}_configured`, conversion.providerConfigured])
  );
  const newsletterConfigured = Boolean(conversions.briefing_configured);

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    ok: true,
    service: "public-web",
    platform_id: PLATFORM_ID,
    public_api_uri: PUBLIC_API_URI,
    site_url: SITE_URL,
    analytics_enabled: Boolean(ANALYTICS_DOMAIN),
    conversion_paths: {
      newsletter_configured: newsletterConfigured,
      ...conversions
    },
    growth_capabilities: publicGrowthCapabilities(),
    verifier_workspace_enabled: ENABLE_VERIFIER_WORKSPACE
  });
}
