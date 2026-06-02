import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "./env";

export type PublicFeedItem = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  path: string;
  storyPath: string;
  publishedAt: string;
};

export type PublicSharePacket = {
  clip_url: string;
  story_url: string;
  social_card_url: string;
  share_text: string;
  channels: {
    x: string;
    linkedin: string;
    email: string;
  };
};

export const publicFeedItems: PublicFeedItem[] = [
  {
    id: "records-watch",
    title: "Local public records watch",
    kicker: "Town square desk",
    summary: "Meeting agendas, procurement changes, budgets, and correction-ready civic reporting as shareable evidence atoms.",
    path: "/clip/records-watch",
    storyPath: "/story/records-watch",
    publishedAt: "2026-06-02T12:00:00.000Z"
  },
  {
    id: "verification-explainers",
    title: "Verification-first explainers",
    kicker: "Crier notes",
    summary: "Short pieces that teach readers how a claim moves from narrative text into evidence-backed public ledger data.",
    path: "/clip/verification-explainers",
    storyPath: "/story/verification-explainers",
    publishedAt: "2026-06-02T12:05:00.000Z"
  },
  {
    id: "member-investigations",
    title: "Member-funded investigations",
    kicker: "Member bulletin",
    summary: "A transparent pipeline where reader support funds evidence collection, not ad inventory.",
    path: "/clip/member-investigations",
    storyPath: "/story/member-investigations",
    publishedAt: "2026-06-02T12:10:00.000Z"
  }
];

export function absoluteUrl(path: string) {
  return `${SITE_URL.replace(/\/$/, "")}${path}`;
}

export function feedMetadata() {
  return {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    homeUrl: absoluteUrl("/"),
    feedUrl: absoluteUrl("/feed.xml"),
    jsonFeedUrl: absoluteUrl("/feed.json")
  };
}

export function publicFeedItemById(itemId: string) {
  return publicFeedItems.find((feedItem) => feedItem.id === itemId) ?? null;
}

export function socialCardPath(item: Pick<PublicFeedItem, "title" | "kicker"> & { state?: string }) {
  const state = item.state ? `&state=${encodeURIComponent(item.state)}` : "";
  return `/api/social-card.svg?title=${encodeURIComponent(item.title)}&kicker=${encodeURIComponent(item.kicker)}${state}`;
}

export function publicSharePacket(item: PublicFeedItem): PublicSharePacket {
  const clipUrl = absoluteUrl(item.path);
  const storyUrl = absoluteUrl(item.storyPath);
  const socialCardUrl = absoluteUrl(socialCardPath({ ...item, state: "published" }));
  const shareText = `${item.title}: ${item.summary}`;
  const encodedClipUrl = encodeURIComponent(clipUrl);
  const encodedShareText = encodeURIComponent(shareText);

  return {
    clip_url: clipUrl,
    story_url: storyUrl,
    social_card_url: socialCardUrl,
    share_text: shareText,
    channels: {
      x: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedClipUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedClipUrl}`,
      email: `mailto:?subject=${encodeURIComponent(item.title)}&body=${encodedShareText}%0A%0A${encodedClipUrl}`
    }
  };
}

export function publicStoryBundle(storyId: string) {
  const item = publicFeedItemById(storyId);
  if (!item) return null;

  return {
    story: {
      story_id: item.id,
      title: item.title,
      state: "published",
      versions: [
        {
          story_version_id: `${item.id}-v1`,
          body_markdown: `${item.summary} This launch story is served from the reader-safe public web gateway and links readers back to public routes, not internal reviewer systems.`,
          created_at: item.publishedAt
        }
      ]
    },
    claims: [
      {
        claim_id: `${item.id}-claim-1`,
        text: item.summary,
        claim_type: "factual",
        support_status: "supported"
      },
      {
        claim_id: `${item.id}-claim-2`,
        text: "This public story bundle exposes only narrative, claims, evidence edges, and correction history.",
        claim_type: "interpretation",
        support_status: "supported"
      }
    ],
    evidence_edges: [
      {
        claim_id: `${item.id}-claim-1`,
        evidence_id_hash: `sha256:${item.id}-public-ledger`,
        relation: "supports",
        strength: 0.82
      },
      {
        claim_id: `${item.id}-claim-2`,
        evidence_id_hash: `sha256:${item.id}-public-boundary`,
        relation: "supports",
        strength: 0.76
      }
    ],
    corrections: []
  };
}
