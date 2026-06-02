import type { GetServerSideProps } from "next";
import { absoluteUrl, feedMetadata, publicFeedItems } from "../lib/public-feed";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function FeedXml() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const meta = feedMetadata();
  const latest = publicFeedItems[publicFeedItems.length - 1]?.publishedAt ?? new Date().toISOString();
  const items = publicFeedItems
    .map((item) => {
      const url = absoluteUrl(item.path);
      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(item.kicker)}</category>
      <description>${escapeXml(item.summary)}</description>
    </item>`;
    })
    .join("");

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.write(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${escapeXml(meta.homeUrl)}</link>
    <description>${escapeXml(meta.description)}</description>
    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(meta.feedUrl)}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`);
  res.end();

  return { props: {} };
};

export default FeedXml;
