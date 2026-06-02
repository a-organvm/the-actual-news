import { publicCampaignKit } from "./public-campaigns";
import { publicConversions } from "./public-conversions";
import { SITE_URL } from "./env";
import { publicProviderHandoff } from "./public-provider-handoff";
import { publicSponsorRegistry } from "./public-sponsors";
import { launchChecks } from "./public-launch";

function publicAnalyticsDomain() {
  try {
    return new URL(SITE_URL).hostname;
  } catch {
    return "";
  }
}

export type PublicRunbookStep = {
  id: string;
  phase: "prepare" | "wire" | "verify" | "publish" | "operate";
  title: string;
  summary: string;
  command?: string;
  public_artifacts: string[];
  blocks_public_launch: boolean;
};

export function publicLaunchRunbook() {
  const providerPages = publicProviderHandoff().provider_pages;
  const conversionBlockers = publicConversions().filter((conversion) => !conversion.providerConfigured);

  const steps: PublicRunbookStep[] = [
    {
      id: "public-env-template",
      phase: "prepare",
      title: "Generate the public env template",
      summary: "Create a browser-safe .env.public file and fill only public hosted URLs, domain values, and keyless analytics settings.",
      command: `PUBLIC_SITE_URL=${SITE_URL} PUBLIC_API_URL=${SITE_URL} ANALYTICS_DOMAIN=${publicAnalyticsDomain()} pnpm public-env:template > .env.public`,
      public_artifacts: ["/launch", "/launch.json"],
      blocks_public_launch: false
    },
    {
      id: "hosted-provider-pages",
      phase: "wire",
      title: "Create hosted provider pages",
      summary: "Create newsletter, membership, and sponsor destinations outside this app; keep provider keys and webhook secrets internal.",
      public_artifacts: ["/provider-handoff.json", "/briefing", "/membership", "/sponsor"],
      blocks_public_launch: conversionBlockers.length > 0
    },
    {
      id: "strict-public-env",
      phase: "verify",
      title: "Run strict public env readiness",
      summary: "Reject blank, placeholder, local, and same-origin provider URLs before deploying the public domain.",
      command: "PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict",
      public_artifacts: ["/launch.json"],
      blocks_public_launch: launchChecks.some((check) => !check.ready)
    },
    {
      id: "no-docker-local-gate",
      phase: "verify",
      title: "Run the no-Docker local launch gate",
      summary: "Verify env boundaries, source boundaries, optional container boundaries, typecheck, service tests, public smoke, conversions, and report generation.",
      command: "pnpm launch:local",
      public_artifacts: ["/api/healthz", "/sitemap.xml", "/robots.txt"],
      blocks_public_launch: false
    },
    {
      id: "deployed-origin-gate",
      phase: "publish",
      title: "Verify the deployed public origin",
      summary: "Smoke test the real HTTPS origin and require conversion redirects to hosted provider destinations with UTM preservation.",
      command: `PUBLIC_ENV_FILE=.env.public PUBLIC_WEB_BASE_URL=${SITE_URL} pnpm launch:deployed`,
      public_artifacts: ["/", "/go/briefing", "/go/membership", "/go/sponsor"],
      blocks_public_launch: true
    },
    {
      id: "operate-distribution-loop",
      phase: "operate",
      title: "Operate the distribution loop",
      summary: "Use campaign packets, share packets, feeds, and sponsor disclosures to keep public atoms moving after launch.",
      public_artifacts: ["/distribution", "/campaigns.json", "/share-kit.json", "/sponsors", "/sponsors.json"],
      blocks_public_launch: false
    }
  ];

  return {
    schema_version: "public-launch-runbook.v1",
    generated_at: new Date().toISOString(),
    verdict: conversionBlockers.length === 0 && launchChecks.every((check) => check.ready) ? "ready_for_deployed_gate" : "provider_setup_required",
    ready_count: launchChecks.filter((check) => check.ready).length,
    total_count: launchChecks.length,
    blockers: launchChecks.filter((check) => !check.ready).map((check) => ({
      label: check.label,
      action: check.action,
      value: check.value
    })),
    provider_pages: providerPages.map((page) => ({
      id: page.id,
      env_key: page.env_key,
      stable_distribution_route: page.stable_distribution_route,
      provider_url_configured: page.provider_url_configured
    })),
    campaigns_ready: publicCampaignKit().campaign_count,
    sponsor_registry_status: publicSponsorRegistry().status,
    steps,
    internal_boundary: {
      publishable: [
        "public launch status",
        "public commands",
        "public route list",
        "provider configured booleans",
        "campaign and sponsor registry status"
      ],
      never_publish: [
        "env files with secrets",
        "payment keys",
        "newsletter API tokens",
        "CRM tokens",
        "webhook secrets",
        "database URLs",
        "reviewer queues"
      ]
    }
  };
}
