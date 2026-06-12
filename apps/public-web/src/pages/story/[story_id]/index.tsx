import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicSharePanel } from "../../../components/PublicSharePanel";
import { SiteShell } from "../../../components/SiteShell";
import { PUBLIC_API_URI } from "../../../lib/env";
import { absoluteUrl, publicFeedItemById, publicSharePacket, publicStoryBundle, socialCardPath, type PublicSharePacket } from "../../../lib/public-feed";
import { newsArticleJsonLd } from "../../../lib/public-structured-data";

type StoryBundle = {
  story: {
    story_id: string;
    title: string;
    state: string;
    versions: { story_version_id: string; body_markdown: string; created_at: string }[];
  };
  claims: {
    claim_id: string;
    text: string;
    claim_type: string;
    support_status: string;
  }[];
  evidence_edges: {
    claim_id: string;
    evidence_id_hash: string;
    relation: string;
    strength: number;
  }[];
  corrections: {
    correction_id: string;
    claim_id: string;
    reason: string;
    created_at: string;
  }[];
};

type StoryPageProps = {
  initialBundle: StoryBundle | null;
  initialSharePacket: PublicSharePacket | null;
};

export default function StoryPage({ initialBundle, initialSharePacket }: StoryPageProps) {
  const router = useRouter();
  const { story_id } = router.query;
  const [bundle, setBundle] = useState<StoryBundle | null>(initialBundle);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!story_id || initialBundle?.story.story_id === story_id) return;
    fetch(`${PUBLIC_API_URI}/v1/story/${story_id}`)
      .then((r) => r.json())
      .then((data) => setBundle(data))
      .catch((e) => setError(String(e)));
  }, [initialBundle?.story.story_id, story_id]);

  if (error) {
    return (
      <SiteShell title="Story not found | Records Watch" path={story_id ? `/story/${story_id}` : "/story"}>
        <main className="content-page">
          <a className="back-link" href="/">Back to feed</a>
          <p className="error-state">Error: {error}</p>
        </main>
      </SiteShell>
    );
  }

  if (!bundle) {
    return (
      <SiteShell title="Loading story | Records Watch" path={story_id ? `/story/${story_id}` : "/story"}>
        <main className="content-page">
          <p className="empty-state">Loading story bundle...</p>
        </main>
      </SiteShell>
    );
  }

  const latestVersion = bundle.story.versions[0];
  const feedItem = publicFeedItemById(bundle.story.story_id);
  const description =
    feedItem?.summary ??
    latestVersion?.body_markdown.slice(0, 180) ??
    "A public story bundle with narrative, claims, evidence edges, and correction history.";
  const imagePath = socialCardPath({
    title: bundle.story.title,
    kicker: feedItem?.kicker ?? "Public story ledger",
    state: bundle.story.state
  });
  const publishedTime = latestVersion?.created_at ?? feedItem?.publishedAt ?? "2026-06-02T12:00:00.000Z";
  const sharePacket =
    initialSharePacket ??
    (feedItem
      ? publicSharePacket(feedItem)
      : {
          clip_url: absoluteUrl(`/clip/${bundle.story.story_id}`),
          story_url: absoluteUrl(`/story/${bundle.story.story_id}`),
          social_card_url: absoluteUrl(imagePath),
          share_text: `${bundle.story.title}: ${description}`,
          channels: {
            x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${bundle.story.title}: ${description}`)}&url=${encodeURIComponent(absoluteUrl(`/clip/${bundle.story.story_id}`))}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl(`/clip/${bundle.story.story_id}`))}`,
            email: `mailto:?subject=${encodeURIComponent(bundle.story.title)}&body=${encodeURIComponent(`${bundle.story.title}: ${description}`)}%0A%0A${encodeURIComponent(absoluteUrl(`/clip/${bundle.story.story_id}`))}`
          }
        });

  return (
    <SiteShell
      title={`${bundle.story.title} | Records Watch`}
      description={description}
      path={`/story/${bundle.story.story_id}`}
      imagePath={imagePath}
      ogType="article"
      publishedTime={publishedTime}
      modifiedTime={publishedTime}
      structuredData={newsArticleJsonLd({
        title: bundle.story.title,
        description,
        path: `/story/${bundle.story.story_id}`,
        imagePath,
        publishedTime,
        modifiedTime: publishedTime
      })}
    >
      <main className="content-page content-page--wide">
        <a className="back-link" href="/">Back to feed</a>
        <h1>{bundle.story.title}</h1>
        <p className="lede">Narrative, claim ledger, evidence edges, and correction history from the public gateway.</p>
        <span className={`status-pill status-pill--${bundle.story.state}`}>{bundle.story.state}</span>
        <PublicSharePanel title={bundle.story.title} atomId={bundle.story.story_id} packet={sharePacket} />

        {latestVersion && (
          <section className="panel">
            <h2>Narrative</h2>
            <div className="story-body">{latestVersion.body_markdown}</div>
          </section>
        )}

        <section className="panel">
          <h2>Verification spine</h2>
          <h3>Claims ({bundle.claims.length})</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim</th>
                <th>Type</th>
                <th>Status</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {bundle.claims.map((c) => {
                const edges = bundle.evidence_edges.filter((e) => e.claim_id === c.claim_id);
                return (
                  <tr key={c.claim_id}>
                    <td>{c.text}</td>
                    <td>{c.claim_type}</td>
                    <td>{c.support_status}</td>
                    <td>{edges.length} edge(s)</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {bundle.corrections.length > 0 && (
            <>
              <h3>Corrections ({bundle.corrections.length})</h3>
              <ul>
                {bundle.corrections.map((cor) => (
                  <li key={cor.correction_id}>
                    <strong>{cor.reason}</strong> - {new Date(cor.created_at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="border-t border-gray-100 px-4 py-3 sm:px-6">
            <Link href={`/story/${bundle.story.story_id}/simulation`} className="text-blue-600 hover:text-blue-800 font-medium">
              View Simulated Public Square Discussion &rarr;
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

export const getServerSideProps: GetServerSideProps<StoryPageProps> = async ({ params }) => {
  const storyId = Array.isArray(params?.story_id) ? params?.story_id[0] : params?.story_id;
  const initialBundle = publicStoryBundle(storyId ?? "") as StoryBundle | null;
  const feedItem = publicFeedItemById(storyId ?? "");

  return {
    props: {
      initialBundle,
      initialSharePacket: feedItem ? publicSharePacket(feedItem) : null
    }
  };
};
