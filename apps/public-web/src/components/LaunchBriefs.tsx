import { NewsAtomCard, type NewsAtom } from "./NewsAtomCard";
import { publicFeedItems } from "../lib/public-feed";

const launchBriefs: NewsAtom[] = publicFeedItems.map((item) => ({
  id: item.id,
  kicker: item.kicker,
  title: item.title,
  body: item.summary,
  href: item.path,
  state: item.id === "verification-explainers" ? "review" : "draft",
  updatedAt: item.publishedAt
}));

export function LaunchBriefs() {
  return (
    <div className="brief-grid" aria-label="Launch briefs">
      {launchBriefs.map((brief, index) => (
        <NewsAtomCard atom={brief} key={brief.id} priority={index === 0} />
      ))}
    </div>
  );
}
