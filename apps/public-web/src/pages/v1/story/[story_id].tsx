import type { GetServerSideProps } from "next";
import { publicStoryBundle } from "../../../lib/public-feed";

function PublicStoryApi() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const storyId = Array.isArray(params?.story_id) ? params?.story_id[0] : params?.story_id;
  const bundle = publicStoryBundle(storyId ?? "");

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=900");

  if (!bundle) {
    res.statusCode = 404;
    res.write(JSON.stringify({
      error: "story_not_found",
      message: "No public story bundle exists for this story_id."
    }));
    res.end();
    return { props: {} };
  }

  res.write(JSON.stringify(bundle));
  res.end();

  return { props: {} };
};

export default PublicStoryApi;
