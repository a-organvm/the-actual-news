import type { GetServerSideProps } from "next";
import Link from "next/link";
import { PublicSharePanel } from "../../components/PublicSharePanel";
import { SiteShell } from "../../components/SiteShell";
import { absoluteUrl, publicFeedItemById, publicSharePacket, socialCardPath, type PublicSharePacket } from "../../lib/public-feed";
import { newsArticleJsonLd } from "../../lib/public-structured-data";

type ClipPageProps = {
  clipId: string;
  title: string;
  kicker: string;
  description: string;
  target: string;
  publishedAt: string;
  sharePacket: PublicSharePacket;
};

export default function ClipPage({ clipId, title, kicker, description, target, publishedAt, sharePacket }: ClipPageProps) {
  const imagePath = socialCardPath({ title, kicker, state: "published" });

  return (
    <SiteShell
      title={`${title} | Records Watch`}
      description={description}
      path={`/clip/${clipId}`}
      imagePath={imagePath}
      ogType="article"
      publishedTime={publishedAt}
      modifiedTime={publishedAt}
      structuredData={newsArticleJsonLd({
        title,
        description,
        path: `/clip/${clipId}`,
        imagePath,
        publishedTime: publishedAt,
        modifiedTime: publishedAt
      })}
    >
      <main className="content-page">
        <article className="clip-page">
          <p className="eyebrow">{kicker}</p>
          <h1>{title}</h1>
          <p className="lede">
            This clipping is built for the public square: share the headline, then follow it back to the ledger.
          </p>
          <div className="button-row">
            <Link className="button button--solid" href={target}>
              Read the source
            </Link>
            <Link className="button button--outline" href="/">
              Front page
            </Link>
          </div>
          <PublicSharePanel title={title} atomId={clipId} packet={sharePacket} />
        </article>
      </main>
    </SiteShell>
  );
}

export const getServerSideProps: GetServerSideProps<ClipPageProps> = async ({ params, query }) => {
  const clipId = String(params?.clip_id ?? "front-page");
  const item = publicFeedItemById(clipId);
  const title = (item?.title ?? String(query.title ?? "Records Watch")).slice(0, 120);
  const kicker = (item?.kicker ?? String(query.kicker ?? "Town crier ledger")).slice(0, 80);
  const description = (
    item?.summary ?? "A shareable newspaper clipping from Records Watch with receipts attached."
  ).slice(0, 180);
  const target = item?.storyPath ?? String(query.target ?? "/");
  const publishedAt = item?.publishedAt ?? "2026-06-02T12:00:00.000Z";
  const socialCardUrl = absoluteUrl(socialCardPath({ title, kicker, state: "published" }));
  const clipUrl = absoluteUrl(`/clip/${clipId}`);
  const encodedClipUrl = encodeURIComponent(clipUrl);
  const shareText = `${title}: ${description}`;
  const encodedShareText = encodeURIComponent(shareText);
  const sharePacket =
    item
      ? publicSharePacket(item)
      : {
          clip_url: clipUrl,
          story_url: absoluteUrl(target.startsWith("/") ? target : "/"),
          social_card_url: socialCardUrl,
          share_text: shareText,
          channels: {
            x: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedClipUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedClipUrl}`,
            email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedShareText}%0A%0A${encodedClipUrl}`
          }
        };

  return {
    props: {
      clipId,
      title,
      kicker,
      description,
      target: target.startsWith("/") ? target : "/",
      publishedAt,
      sharePacket
    }
  };
};
