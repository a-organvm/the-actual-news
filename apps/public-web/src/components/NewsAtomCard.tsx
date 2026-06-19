import Link from "next/link";
import { SITE_URL } from "../lib/env";
import { trackPublicEvent, withUtm } from "../lib/public-analytics";

export type NewsAtom = {
  id: string;
  title: string;
  kicker: string;
  body: string;
  href: string;
  state: string;
  updatedAt: string;
  shareText?: string;
};

type NewsAtomCardProps = {
  atom: NewsAtom;
  priority?: boolean;
};

export function NewsAtomCard({ atom, priority = false }: NewsAtomCardProps) {
  const clipPath = atom.href.startsWith("/clip/") ? atom.href : `/clip/${encodeURIComponent(atom.id)}`;
  const trackedClipPath = withUtm(clipPath, {
    source: "site",
    medium: "share",
    campaign: "public_atoms",
    content: atom.id
  });
  const absoluteUrl = `${SITE_URL.replace(/\/$/, "")}${trackedClipPath}`;
  const cardUrl = `${SITE_URL.replace(/\/$/, "")}/api/social-card.svg?title=${encodeURIComponent(
    atom.title
  )}&kicker=${encodeURIComponent(atom.kicker)}&state=${encodeURIComponent(atom.state)}`;
  const shareText = atom.shareText ?? `${atom.title} - Records Watch`;
  const encodedUrl = encodeURIComponent(absoluteUrl);
  const encodedText = encodeURIComponent(shareText);

  return (
    <article className={`news-atom ${priority ? "news-atom--lead" : ""}`}>
      <div className="news-atom__meta">
        <span>{atom.kicker}</span>
        <span>{new Date(atom.updatedAt).toLocaleDateString()}</span>
      </div>
      <h3>
        <Link href={atom.href}>{atom.title}</Link>
      </h3>
      <p>{atom.body}</p>
      <div className="news-atom__signal" aria-label="Atom distribution path">
        <span>claim</span>
        <span>evidence</span>
        <span>clip</span>
        <span>share</span>
      </div>
      <div className="news-atom__footer">
        <span className={`status-pill status-pill--${atom.state}`}>{atom.state}</span>
        <div className="share-row" aria-label={`Share ${atom.title}`}>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
            onClick={() => trackPublicEvent("Atom Share", { channel: "x", atom_id: atom.id, state: atom.state })}
          >
            X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            onClick={() => trackPublicEvent("Atom Share", { channel: "linkedin", atom_id: atom.id, state: atom.state })}
          >
            in
          </a>
          <a
            href={`mailto:?subject=${encodedText}&body=${encodedUrl}`}
            onClick={() => trackPublicEvent("Atom Share", { channel: "email", atom_id: atom.id, state: atom.state })}
          >
            mail
          </a>
          <a
            href={cardUrl}
            onClick={() => trackPublicEvent("Atom Share", { channel: "social_card", atom_id: atom.id, state: atom.state })}
          >
            card
          </a>
        </div>
      </div>
    </article>
  );
}
