import type { GetServerSideProps } from "next";
import { absoluteUrl, feedMetadata, publicFeedItems } from "../lib/public-feed";

function FeedJson() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const meta = feedMetadata();
  const body = {
    version: "https://jsonfeed.org/version/1.1",
    title: meta.title,
    home_page_url: meta.homeUrl,
    feed_url: meta.jsonFeedUrl,
    description: meta.description,
    items: publicFeedItems.map((item) => ({
      id: absoluteUrl(item.path),
      url: absoluteUrl(item.path),
      title: item.title,
      summary: item.summary,
      date_published: item.publishedAt,
      tags: [item.kicker]
    }))
  };

  res.setHeader("Content-Type", "application/feed+json; charset=utf-8");
  res.write(JSON.stringify(body, null, 2));
  res.end();

  return { props: {} };
};

export default FeedJson;
