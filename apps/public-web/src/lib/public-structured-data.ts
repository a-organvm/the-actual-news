import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "./env";
import type { PublicOfferPackage } from "./public-offers";

export type JsonLd = Record<string, unknown>;

const baseUrl = SITE_URL.replace(/\/$/, "");

export function publicOrganizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_TITLE,
    url: baseUrl,
    description: SITE_DESCRIPTION,
    publishingPrinciples: `${baseUrl}/launch`,
    sameAs: [`${baseUrl}/feed.xml`, `${baseUrl}/feed.json`]
  };
}

export function publicWebsiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: baseUrl,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "ReadAction",
      target: [`${baseUrl}/`, `${baseUrl}/distribution`, `${baseUrl}/feed.xml`]
    }
  };
}

export function newsArticleJsonLd({
  title,
  description,
  path,
  imagePath,
  publishedTime,
  modifiedTime
}: {
  title: string;
  description: string;
  path: string;
  imagePath: string;
  publishedTime: string;
  modifiedTime: string;
}): JsonLd {
  const url = `${baseUrl}${path}`;
  const image = imagePath.startsWith("http") ? imagePath : `${baseUrl}${imagePath}`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url,
    image,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    isAccessibleForFree: true,
    publisher: {
      "@type": "NewsMediaOrganization",
      name: SITE_TITLE,
      url: baseUrl
    }
  };
}

export function offerJsonLd({
  title,
  description,
  path,
  packages
}: {
  title: string;
  description: string;
  path: string;
  packages: PublicOfferPackage[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description,
    url: `${baseUrl}${path}`,
    brand: {
      "@type": "Brand",
      name: SITE_TITLE
    },
    offers: packages.map((offerPackage) => ({
      "@type": "Offer",
      name: offerPackage.name,
      description: offerPackage.summary,
      price: offerPackage.price,
      availability: "https://schema.org/InStock",
      url: `${baseUrl}${path}`
    }))
  };
}
