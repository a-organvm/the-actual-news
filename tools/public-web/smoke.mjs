const baseUrl = process.env.PUBLIC_WEB_BASE_URL ?? "http://127.0.0.1:3000";
const expectConversionsConfigured = process.env.PUBLIC_CONVERSIONS_EXPECT_CONFIGURED === "true";
const conversionStatusText = expectConversionsConfigured ? "true" : "false";

const requiredHeaders = [
  ["x-content-type-options", "nosniff"],
  ["referrer-policy", "strict-origin-when-cross-origin"],
  ["x-frame-options", "SAMEORIGIN"],
  ["permissions-policy", "camera=(), microphone=(), geolocation=(), payment=()"],
  ["content-security-policy", "default-src 'self'"]
];

const forbiddenResponsePatterns = [
  /postgres:\/\/[^:\s]+:[^@\s]+@/i,
  /\bPOSTGRES_(URI|PASSWORD)\b/,
  /\bMODEL_GATEWAY_URI\b/,
  /\bEVENT_BUS_URI\b/,
  /\bEVIDENCE_BLOB_STORE_(ACCESS_KEY|SECRET_KEY)\b/,
  /\b[A-Z0-9_]*(SECRET|TOKEN|API_KEY|ACCESS_KEY|PASSWORD)=[^\s<>"']+/,
  /sk_(live|test)_[A-Za-z0-9]+/,
  /xox[baprs]-[A-Za-z0-9-]+/,
  /ghp_[A-Za-z0-9]+/,
  /github_pat_[A-Za-z0-9_]+/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]+PRIVATE KEY-----/,
  /replace-with-[a-z0-9-]+/i
];

const checks = [
  {
    path: "/api/healthz",
    contentType: "application/json",
    includes: [
      '"ok":true',
      '"service":"public-web"',
      `"newsletter_configured":${conversionStatusText}`,
      `"briefing_configured":${conversionStatusText}`,
      `"membership_configured":${conversionStatusText}`,
      `"sponsor_configured":${conversionStatusText}`,
      '"growth_capabilities"',
      '"atom_share_packets":true',
      '"offer_packets":true',
      '"structured_data":true',
      '"share_kit":true',
      '"provider_handoff":true',
      '"campaign_packets":true',
      '"media_kit":true',
      '"sponsor_registry":true',
      '"conversion_routes":true'
    ]
  },
  {
    path: "/v1/feed?scope=local&state=published&limit=3",
    contentType: "application/json",
    includes: ['"items"', '"records-watch"', '"published"']
  },
  {
    path: "/v1/story/records-watch",
    contentType: "application/json",
    includes: ['"story_id":"records-watch"', '"claims"', '"evidence_edges"', '"corrections"']
  },
  {
    path: "/",
    contentType: "text/html",
    includes: [
      "Town crier ledger",
      "Read all about it",
      "application/ld+json",
      "NewsMediaOrganization",
      "WebSite",
      "/icon.svg",
      "Built like a newspaper",
      "Every atom has its own clipping page",
      ...(expectConversionsConfigured ? [] : ["Provider pending"]),
      "Details",
      "Local public records watch",
      "/feed.xml",
      "/feed.json"
    ]
  },
  {
    path: "/membership",
    contentType: "text/html",
    includes: [
      "Membership editions",
      "Founding Press",
      "Conversion desk",
      "Report back",
      "Product",
      "Offer",
      "Start membership",
      ...(expectConversionsConfigured ? [] : ["Provider setup packet"]),
      ...(expectConversionsConfigured ? [] : ["Set NEXT_PUBLIC_MEMBERSHIP_URL"])
    ]
  },
  {
    path: "/briefing",
    contentType: "text/html",
    includes: [
      "Briefing editions",
      "Morning cry",
      "Conversion desk",
      "Capture",
      "Product",
      "Join the Daily Briefing",
      ...(expectConversionsConfigured ? [] : ["Provider setup packet"]),
      ...(expectConversionsConfigured ? [] : ["Set NEXT_PUBLIC_NEWSLETTER_URL"])
    ]
  },
  {
    path: "/sponsor",
    contentType: "text/html",
    includes: [
      "Sponsorship notices",
      "Records Watch",
      "Conversion desk",
      "Disclose",
      "Product",
      "Sponsor a Public-Interest Beat",
      ...(expectConversionsConfigured ? [] : ["Provider setup packet"]),
      ...(expectConversionsConfigured ? [] : ["Set NEXT_PUBLIC_SPONSOR_URL"])
    ]
  },
  {
    path: "/sponsors",
    contentType: "text/html",
    includes: [
      "Sponsor Registry",
      "Public sponsor registry",
      "Current disclosures",
      "No accepted sponsors are currently disclosed",
      "Sponsorship lanes",
      "Firewall rules",
      "Sponsor a beat",
      "/sponsors.json",
      "Internal boundary"
    ]
  },
  {
    path: "/distribution",
    contentType: "text/html",
    includes: [
      "Distribution Kit",
      "Public routes",
      "Shareable atoms",
      "Share kit JSON",
      "Principles",
      "Copy URL",
      "Copy text",
      "Copy packet",
      "Campaign queue",
      "Media kit",
      "Copy campaign",
      "Offer packets",
      "/clip/records-watch",
      "/story/records-watch",
      "Join the Daily Briefing",
      "Become a Founding Member",
      "Sponsor a Public-Interest Beat",
      "Sponsor registry",
      "offer_packet",
      "No secrets in the satchel",
      "Internal boundary"
    ]
  },
  {
    path: "/principles",
    contentType: "text/html",
    includes: [
      "Public Principles",
      "Trust is the product",
      "Funding does not buy conclusions",
      "Internal systems stay internal",
      "Public artifacts",
      "Editorial firewall"
    ]
  },
  {
    path: "/go/briefing?utm_source=smoke&utm_medium=redirect&utm_campaign=briefing",
    contentType: "text/html",
    redirectWhenConfigured: true,
    includes: ["Briefing editions", "Join the Daily Briefing", "Set NEXT_PUBLIC_NEWSLETTER_URL"]
  },
  {
    path: "/go/membership?utm_source=smoke&utm_medium=redirect&utm_campaign=membership",
    contentType: "text/html",
    redirectWhenConfigured: true,
    includes: ["Membership editions", "Become a Founding Member", "Set NEXT_PUBLIC_MEMBERSHIP_URL"]
  },
  {
    path: "/go/sponsor?utm_source=smoke&utm_medium=redirect&utm_campaign=sponsor",
    contentType: "text/html",
    redirectWhenConfigured: true,
    includes: ["Sponsorship notices", "Sponsor a Public-Interest Beat", "Set NEXT_PUBLIC_SPONSOR_URL"]
  },
  {
    path: "/launch",
    contentType: "text/html",
    includes: [
      "Public readiness ledger",
      "Newsletter capture",
      "Membership checkout",
      "Analytics script",
      "Public container",
      "Internal stack",
      "Launch JSON",
      "Launch runbook JSON",
      "Share kit JSON",
      "Provider handoff JSON",
      "Campaigns JSON",
      "Media kit",
      "Sponsor registry",
      "Run strict public env readiness",
      "Run the no-Docker local launch gate",
      "Distribution kit",
      "Public launch artifacts"
    ]
  },
  {
    path: "/launch.json",
    contentType: "application/json",
    includes: [
      '"schema_version": "public-launch.v1"',
      '"icon_url"',
      "icon.svg",
      '"manifest_url"',
      '"public_routes"',
      '"/runbook.json"',
      '"growth_capabilities"',
      '"atom_share_packets": true',
      '"offer_packets": true',
      '"structured_data": true',
      '"share_kit": true',
      '"provider_handoff": true',
      '"campaign_packets": true',
      '"media_kit": true',
      '"sponsor_registry": true',
      '"campaigns"',
      '"media_kit"',
      '"sponsor_registry"',
      '"morning-crier-briefing"',
      '"atoms"',
      '"clip_url"',
      "/clip/records-watch",
      '"social_card_url"',
      '"share_packet"',
      '"channels"',
      '"linkedin"',
      '"email"',
      '"conversion_routes"',
      '"/go/membership"',
      '"/principles"',
      '"Analytics script"',
      '"offers"',
      '"briefing"',
      '"membership"',
      '"sponsor"',
      '"/provider-handoff.json"',
      '"/provider-pages"',
      '"/campaigns.json"',
      '"/media-kit"',
      '"/media-kit.json"',
      '"/sponsors"',
      '"/sponsors.json"',
      '"distribution_copy"',
      '"conversion_steps"',
      '"packages"',
      '"price"',
      '"internal_boundary"'
    ]
  },
  {
    path: "/media-kit",
    contentType: "text/html",
    includes: [
      "Media Kit",
      "The Actual News",
      "Read all about it, with receipts attached.",
      "Press copy",
      "Proof points",
      "Public assets",
      "Media kit JSON",
      "Sponsor registry",
      "Internal boundary"
    ]
  },
  {
    path: "/media-kit.json",
    contentType: "application/json",
    includes: [
      '"schema_version": "public-media-kit.v1"',
      '"positioning"',
      "Read all about it, with receipts attached.",
      '"press_copy"',
      '"proof_points"',
      '"public_assets"',
      '"/distribution"',
      '"/provider-pages"',
      '"/provider-handoff.json"',
      '"/sponsors"',
      '"internal_boundary"',
      '"never_publish"',
      "private audience exports"
    ]
  },
  {
    path: "/runbook.json",
    contentType: "application/json",
    includes: [
      '"schema_version": "public-launch-runbook.v1"',
      '"provider_setup_required"',
      '"blockers"',
      '"provider_pages"',
      '"public-env-template"',
      '"hosted-provider-pages"',
      '"strict-public-env"',
      '"no-docker-local-gate"',
      '"deployed-origin-gate"',
      '"operate-distribution-loop"',
      '"pnpm launch:local"',
      '"PUBLIC_ENV_FILE=.env.public pnpm launch:check:strict"',
      '"internal_boundary"',
      '"never_publish"'
    ]
  },
  {
    path: "/campaigns.json",
    contentType: "application/json",
    includes: [
      '"schema_version": "public-campaign-kit.v1"',
      '"campaign_count"',
      '"campaigns"',
      '"morning-crier-briefing"',
      '"records-watch-atom"',
      '"member-funded-followup"',
      '"sponsor-civic-underwriting"',
      '"tracked_path"',
      "utm_source=campaign_queue",
      '"/go/briefing"',
      '"/go/membership"',
      '"/go/sponsor"',
      '"internal_boundary"',
      '"never_publish"'
    ]
  },
  {
    path: "/provider-handoff.json",
    contentType: "application/json",
    includes: [
      '"schema_version": "public-provider-handoff.v1"',
      '"attribution_parameters"',
      '"provider_pages"',
      '"NEXT_PUBLIC_NEWSLETTER_URL"',
      '"NEXT_PUBLIC_MEMBERSHIP_URL"',
      '"NEXT_PUBLIC_SPONSOR_URL"',
      '"stable_distribution_route"',
      '"/go/briefing"',
      '"/go/membership"',
      '"/go/sponsor"',
      '"form_fields"',
      '"acceptance_criteria"',
      '"final_verification"',
      '"internal_boundary"',
      '"never_publish"'
    ]
  },
  {
    path: "/provider-pages",
    contentType: "text/html",
    includes: [
      "Provider Pages",
      "Hosted conversion setup",
      "Setup packets",
      "Join the Daily Briefing",
      "Become a Founding Member",
      "Sponsor a Public-Interest Beat",
      "NEXT_PUBLIC_NEWSLETTER_URL",
      "NEXT_PUBLIC_MEMBERSHIP_URL",
      "NEXT_PUBLIC_SPONSOR_URL",
      "Copy setup packet",
      "Internal boundary",
      "webhook secrets"
    ]
  },
  {
    path: "/sponsors.json",
    contentType: "application/json",
    includes: [
      '"schema_version": "public-sponsor-registry.v1"',
      '"open_for_sponsors"',
      '"current_disclosures"',
      '"proposed_lanes"',
      '"firewall_rules"',
      '"Records Watch"',
      '"internal_boundary"',
      '"never_publish"',
      '"private sponsor notes"'
    ]
  },
  {
    path: "/share-kit.json",
    contentType: "application/json",
    includes: [
      '"schema_version": "public-share-kit.v1"',
      '"launch_messages"',
      '"public_routes"',
      '"tracked_path"',
      '"atoms"',
      '"share_packet"',
      '"social_card_path"',
      '"offers"',
      '"campaigns"',
      '"media_kit"',
      '"sponsor_registry"',
      '"campaign copy"',
      '"press copy"',
      '"conversion_steps"',
      '"internal_boundary"',
      '"never_publish"',
      "/clip/records-watch",
      "/story/records-watch",
      "/media-kit",
      "/media-kit.json",
      "/sponsors",
      "/sponsors.json"
    ]
  },
  {
    path: "/feed.xml",
    contentType: "application/rss+xml",
    includes: ["<rss", "Local public records watch", "/clip/records-watch"]
  },
  {
    path: "/feed.json",
    contentType: "application/feed+json",
    includes: ['"version": "https://jsonfeed.org/version/1.1"', '"Local public records watch"', "/clip/records-watch"]
  },
  {
    path: "/sitemap.xml",
    contentType: "application/xml",
    includes: [
      "/membership",
      "/feed.xml",
      "/launch",
      "/launch.json",
      "/media-kit",
      "/media-kit.json",
      "/sponsor",
      "/sponsors",
      "/sponsors.json",
      "/distribution",
      "/campaigns.json",
      "/principles",
      "/provider-handoff.json",
      "/provider-pages",
      "/runbook.json",
      "/share-kit.json",
      "/icon.svg",
      "/clip/records-watch",
      "/story/records-watch",
      "/go/membership",
      "<priority>"
    ]
  },
  {
    path: "/robots.txt",
    contentType: "text/plain",
    includes: ["Sitemap:", "RSS:", "JSON-Feed:", "Distribution-Kit:", "Principles:", "Launch-Manifest:", "Launch-Runbook:", "Share-Kit:", "Provider-Handoff:", "Provider-Pages:", "Campaigns:", "Media-Kit:", "Media-Kit-JSON:", "Sponsor-Registry:", "Sponsor-Registry-JSON:", "Icon:", "Health:"]
  },
  {
    path: "/site.webmanifest",
    contentType: "application/manifest+json",
    includes: ['"name": "The Actual News"', '"display": "standalone"', '"/icon.svg"', '"share_target"', '"shortcuts"']
  },
  {
    path: "/icon.svg",
    contentType: "image/svg+xml",
    includes: ["<svg", "The Actual News", "Receipts"]
  },
  {
    path: "/api/social-card.svg?title=Smoke%20Test&kicker=Town%20square&state=review",
    contentType: "image/svg+xml",
    includes: ["<svg", "Smoke", "The Actual News"]
  },
  {
    path: "/clip/smoke?title=Smoke%20Test&kicker=Town%20square&target=%2Fmembership",
    contentType: "text/html",
    includes: ["Smoke Test", "og:image", "NewsArticle", "Read the source", "Share this atom", "Copy URL", "Copy text"]
  },
  {
    path: "/clip/records-watch",
    contentType: "text/html",
    includes: [
      "Local public records watch",
      "Meeting agendas, procurement changes",
      "article:published_time",
      "og:type",
      "og:image",
      "NewsArticle",
      "/story/records-watch",
      "Share this atom",
      "Copy URL",
      "Copy text"
    ]
  },
  {
    path: "/story/records-watch",
    contentType: "text/html",
    includes: [
      "Local public records watch",
      "Meeting agendas, procurement changes",
      "article:published_time",
      "og:type",
      "og:image",
      "NewsArticle",
      "Verification spine",
      "supported",
      "Share this atom",
      "Copy URL",
      "Copy text"
    ]
  },
  {
    path: "/verify",
    contentType: "text/html",
    includes: ["Verification desk", "internal workspace", "Public boundary"]
  }
];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

for (const check of checks) {
  const url = new URL(check.path, baseUrl);
  const expectRedirect = expectConversionsConfigured && check.redirectWhenConfigured;
  let response;
  try {
    response = await fetch(url, expectRedirect ? { redirect: "manual" } : undefined);
  } catch (error) {
    fail(`[FAIL] ${check.path}: request failed: ${error?.message ?? error}`);
    continue;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (expectRedirect) {
    const location = response.headers.get("location") ?? "";
    if (response.status < 300 || response.status >= 400) {
      fail(`[FAIL] ${check.path}: expected redirect, got ${response.status}`);
      continue;
    }
    if (!location.startsWith("https://")) {
      fail(`[FAIL] ${check.path}: expected public https redirect location, got ${JSON.stringify(location)}`);
      continue;
    }
    const redirectUrl = new URL(location);
    if (redirectUrl.origin === new URL(baseUrl).origin) {
      fail(`[FAIL] ${check.path}: expected hosted provider redirect, got same-origin ${location}`);
    }
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      if (!redirectUrl.searchParams.get(key)) {
        fail(`[FAIL] ${check.path}: redirect missing ${key}: ${location}`);
      }
    }
    if (!process.exitCode) {
      console.log(`[OK] ${check.path}`);
    }
    continue;
  }

  if (!response.ok) {
    fail(`[FAIL] ${check.path}: expected 2xx, got ${response.status}`);
    continue;
  }

  if (!contentType.includes(check.contentType)) {
    fail(`[FAIL] ${check.path}: expected content-type containing ${check.contentType}, got ${contentType}`);
  }

  for (const [header, expected] of requiredHeaders) {
    const actual = response.headers.get(header) ?? "";
    if (!actual.includes(expected)) {
      fail(`[FAIL] ${check.path}: expected ${header} containing ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }

  for (const expected of check.includes) {
    if (!body.includes(expected)) {
      fail(`[FAIL] ${check.path}: missing ${JSON.stringify(expected)}`);
    }
  }

  for (const pattern of forbiddenResponsePatterns) {
    if (pattern.test(body)) {
      fail(`[FAIL] ${check.path}: response matched forbidden public secret/internal pattern ${pattern}`);
    }
  }

  if (process.exitCode) {
    continue;
  }

  console.log(`[OK] ${check.path}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log(`Public web smoke checks passed for ${baseUrl}`);
