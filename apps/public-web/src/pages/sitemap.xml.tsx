import type { GetServerSideProps } from "next";
import { SITE_URL } from "../lib/env";
import { publicFeedItems } from "../lib/public-feed";
import { publicOfferList } from "../lib/public-offers";

type SitemapEntry = {
  path: string;
  lastmod?: string;
  changefreq: "hourly" | "daily" | "weekly" | "monthly";
  priority: string;
};

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "hourly", priority: "1.0" },
  { path: "/campaigns.json", changefreq: "daily", priority: "0.6" },
  { path: "/distribution", changefreq: "daily", priority: "0.9" },
  { path: "/principles", changefreq: "weekly", priority: "0.8" },
  { path: "/launch", changefreq: "daily", priority: "0.7" },
  { path: "/launch.json", changefreq: "daily", priority: "0.6" },
  { path: "/media-kit", changefreq: "weekly", priority: "0.7" },
  { path: "/media-kit.json", changefreq: "daily", priority: "0.5" },
  { path: "/provider-handoff.json", changefreq: "daily", priority: "0.6" },
  { path: "/provider-pages", changefreq: "weekly", priority: "0.7" },
  { path: "/runbook.json", changefreq: "daily", priority: "0.5" },
  { path: "/share-kit.json", changefreq: "daily", priority: "0.6" },
  { path: "/sponsors", changefreq: "weekly", priority: "0.7" },
  { path: "/sponsors.json", changefreq: "daily", priority: "0.5" },
  { path: "/feed.xml", changefreq: "hourly", priority: "0.8" },
  { path: "/feed.json", changefreq: "hourly", priority: "0.8" },
  { path: "/icon.svg", changefreq: "monthly", priority: "0.2" },
  { path: "/go/briefing", changefreq: "monthly", priority: "0.6" },
  { path: "/go/membership", changefreq: "monthly", priority: "0.6" },
  { path: "/go/sponsor", changefreq: "monthly", priority: "0.6" },
  { path: "/verify", changefreq: "monthly", priority: "0.3" }
];

function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const now = new Date().toISOString();
  const offerEntries = publicOfferList.map((offer): SitemapEntry => ({
    path: offer.path,
    changefreq: "weekly",
    priority: "0.8"
  }));
  const atomEntries = publicFeedItems.flatMap((item): SitemapEntry[] => [
    {
      path: item.path,
      lastmod: item.publishedAt,
      changefreq: "daily",
      priority: "0.9"
    },
    {
      path: item.storyPath,
      lastmod: item.publishedAt,
      changefreq: "daily",
      priority: "0.9"
    }
  ]);
  const entries = [...staticEntries, ...offerEntries, ...atomEntries];
  const urls = entries
    .map(
      (entry) => `
  <url>
    <loc>${baseUrl}${entry.path}</loc>
    <lastmod>${entry.lastmod ?? now}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("");

  res.setHeader("Content-Type", "application/xml");
  res.write(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`);
  res.end();

  return { props: {} };
};

export default Sitemap;
