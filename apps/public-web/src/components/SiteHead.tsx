import Head from "next/head";
import { ANALYTICS_DOMAIN, ANALYTICS_SCRIPT_URL, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../lib/env";
import { publicOrganizationJsonLd, publicWebsiteJsonLd, type JsonLd } from "../lib/public-structured-data";
import { trustedAnalyticsScriptUrlReady } from "../lib/public-url";

type SiteHeadProps = {
  title?: string;
  description?: string;
  path?: string;
  imagePath?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: JsonLd | JsonLd[];
};

export function SiteHead({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  path = "/",
  imagePath,
  ogType = "website",
  publishedTime,
  modifiedTime,
  structuredData
}: SiteHeadProps) {
  const canonicalUrl = `${SITE_URL.replace(/\/$/, "")}${path}`;
  const imageUrl =
    imagePath ??
    `/api/social-card.svg?title=${encodeURIComponent(title)}&kicker=${encodeURIComponent("Town crier ledger")}`;
  const absoluteImageUrl = imageUrl.startsWith("http") ? imageUrl : `${SITE_URL.replace(/\/$/, "")}${imageUrl}`;
  const jsonLd = [
    publicOrganizationJsonLd(),
    publicWebsiteJsonLd(),
    ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [])
  ];
  const analyticsReady = Boolean(ANALYTICS_DOMAIN) && trustedAnalyticsScriptUrlReady(ANALYTICS_SCRIPT_URL);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_TITLE} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:type" content="image/svg+xml" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="theme-color" content="#111111" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/icon.svg" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="alternate" type="application/rss+xml" title={`${SITE_TITLE} RSS`} href="/feed.xml" />
      <link rel="alternate" type="application/feed+json" title={`${SITE_TITLE} JSON Feed`} href="/feed.json" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")
        }}
      />
      {analyticsReady && (
        <script defer data-domain={ANALYTICS_DOMAIN} src={ANALYTICS_SCRIPT_URL} />
      )}
    </Head>
  );
}
