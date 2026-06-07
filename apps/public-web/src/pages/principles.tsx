import Link from "next/link";
import { SiteShell } from "../components/SiteShell";

const principles = [
  {
    title: "Receipts travel with the headline",
    body: "Every public story is built as a shareable atom connected to narrative, claims, evidence edges, social cards, feeds, and correction history."
  },
  {
    title: "Funding does not buy conclusions",
    body: "Membership and sponsorship fund reporting capacity. They do not buy claims, rankings, corrections, story placement, or verification decisions."
  },
  {
    title: "Corrections stay visible",
    body: "The correction record is part of the product. Updates should move through the same public URL, feed item, and share packet."
  },
  {
    title: "Internal systems stay internal",
    body: "Reviewer queues, databases, provider keys, webhooks, CRM tokens, model services, and event buses belong behind authenticated internal boundaries."
  }
];

const publicArtifacts = [
  { label: "Launch ledger", href: "/launch" },
  { label: "Distribution kit", href: "/distribution" },
  { label: "Share kit JSON", href: "/share-kit.json" },
  { label: "RSS", href: "/feed.xml" },
  { label: "JSON Feed", href: "/feed.json" }
];

export default function PrinciplesPage() {
  return (
    <SiteShell
      title="Public Principles | Records Watch"
      description="The public editorial, funding, and internal-boundary principles behind Records Watch."
      path="/principles"
      imagePath="/api/social-card.svg?title=Public%20Principles&kicker=Town%20square%20desk"
    >
      <main className="content-page content-page--wide">
        <article className="offer-page">
          <div className="newspaper__dateline">
            <span>Public notice</span>
            <span>Editorial firewall</span>
            <span>Records Watch</span>
          </div>
          <section className="offer-page__hero">
            <p className="eyebrow">Public principles</p>
            <h1>Trust is the product</h1>
            <p className="lede">
              Records Watch is built to grow without selling the story to advertisers, sponsors, or private
              operational systems. The public surface is for readers; internal systems are for production work.
            </p>
            <div className="button-row">
              <Link className="button button--solid" href="/membership">
                Fund the record
              </Link>
              <Link className="button button--outline" href="/sponsor">
                Sponsor a beat
              </Link>
              <Link className="button button--outline" href="/distribution">
                Open distribution
              </Link>
            </div>
          </section>

          <section className="principles-ledger" aria-label="Public editorial principles">
            {principles.map((principle, index) => (
              <article className="principles-ledger__item" key={principle.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{principle.title}</h2>
                <p>{principle.body}</p>
              </article>
            ))}
          </section>

          <section className="boundary-note" aria-label="Public artifacts and internal boundary">
            <div>
              <h2>Public artifacts</h2>
              <p>These are designed to be shared, crawled, copied, and automated without leaking private operations.</p>
              <div className="artifact-links">
                {publicArtifacts.map((artifact) => (
                  <Link href={artifact.href} key={artifact.href}>
                    {artifact.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2>Internal boundary</h2>
              <p>
                Payment keys, provider API credentials, webhook signing secrets, CRM tokens, reviewer queues,
                database URLs, model gateway settings, and event bus credentials never belong in public routes.
              </p>
            </div>
          </section>
        </article>
      </main>
    </SiteShell>
  );
}
