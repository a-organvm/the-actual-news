import type { GetServerSideProps } from "next";
import { publicFeedItems } from "../../lib/public-feed";

function PublicFeedApi() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  const limit = Number.parseInt(String(query.limit ?? publicFeedItems.length), 10);
  const items = publicFeedItems.slice(0, Number.isFinite(limit) ? limit : publicFeedItems.length).map((item) => ({
    story_id: item.id,
    title: item.title,
    state: "published",
    updated_at: item.publishedAt,
    summary: item.summary,
    path: `/story/${item.id}`
  }));

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=900");
  res.write(JSON.stringify({ items }));
  res.end();

  return { props: {} };
};

export default PublicFeedApi;
