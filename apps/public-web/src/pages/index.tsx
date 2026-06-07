import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroCtas, RevenueCards } from "../components/ProductCtas";
import { LaunchBriefs } from "../components/LaunchBriefs";
import { NewsAtomCard, type NewsAtom } from "../components/NewsAtomCard";
import { SiteShell } from "../components/SiteShell";
import { PUBLIC_API_URI, PUBLIC_ENV_SUMMARY } from "../lib/env";

const editionDate = "June 2, 2026";

type FeedItem = {
  story_id: string;
  title: string;
  state: string;
  updated_at: string;
};

export default function FeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${PUBLIC_API_URI}/v1/feed?scope=local&state=published&limit=12`)
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch((e) => setError(String(e)));
  }, []);

  const atoms: NewsAtom[] = items.map((item) => ({
    id: item.story_id,
    title: item.title,
    kicker: "Verified dispatch",
    body: "A shareable public story module with its verification spine attached.",
    href: `/story/${item.story_id}`,
    state: item.state,
    updatedAt: item.updated_at,
    shareText: `${item.title} - receipts included at Records Watch`
  }));

  return (
    <SiteShell path="/">
      <main>
        <section className="front-page">
          <div className="page-section newspaper">
            <div className="newspaper__dateline">
              <span>Vol. I</span>
              <span>Town square edition</span>
              <span>{editionDate}</span>
            </div>
            <div className="masthead">
              <p className="eyebrow">Town crier ledger</p>
              <h1>Records Watch</h1>
              <p>Read all about it. Every headline breaks into claim-sized modules that carry evidence, correction history, and share links wherever the story travels.</p>
            </div>
            <div className="front-grid">
              <article className="lead-column">
                <span className="status-pill status-pill--review">moving story</span>
                <h2>When a story moves, the receipts move with it.</h2>
                <p>
                  The front page is a public square: modular dispatches, each built to be quoted, linked, emailed,
                  posted, corrected, and traced back to the ledger.
                </p>
                <HeroCtas />
              </article>
              <aside className="crier-box" aria-label="Town crier notice">
                <strong>Hear ye</strong>
                <p>Atomic news modules are designed for social spread without losing provenance.</p>
                <span>Claim {"->"} evidence {"->"} correction {"->"} share</span>
              </aside>
            </div>
            <div className="pressline" aria-label="Live distribution model">
              <span>Hot type</span>
              <span>Every atom has its own clipping page</span>
              <span>Social cards generated on demand</span>
              <span>RSS and JSON feeds keep the town square moving</span>
            </div>
          </div>
        </section>

        <section className="section newspaper-band">
          <div className="page-section">
            <div className="section-header">
              <div>
                <h2>Built like a newspaper, wired like a network</h2>
                <p>
                  Each story atom is a small public object: headline, claim posture, timestamp, and social routes.
                  The page should feel alive without hiding the verification spine.
                </p>
              </div>
            </div>
            <div className="movement-rack" aria-label="Always moving distribution loop">
              <div>
                <span>1</span>
                <strong>Publish</strong>
                <p>A story appears as a broadsheet headline and a claim-sized public object.</p>
              </div>
              <div>
                <span>2</span>
                <strong>Clip</strong>
                <p>Readers share the atom, not a loose screenshot, so the source travels with it.</p>
              </div>
              <div>
                <span>3</span>
                <strong>Correct</strong>
                <p>Updates keep moving through the same URL, feed item, and social card route.</p>
              </div>
              <div>
                <span>4</span>
                <strong>Fund</strong>
                <p>Virality routes back into membership, briefing, and sponsor offers.</p>
              </div>
            </div>
            <div className="metric-grid" aria-label="Product principles">
              <div className="metric">
                <strong>3</strong>
                <span>Public layers: narrative, claims, evidence.</span>
              </div>
              <div className="metric">
                <strong>0</strong>
                <span>Ad slots required for the business model.</span>
              </div>
              <div className="metric">
                <strong>1</strong>
                <span>Public gateway for reader-safe API traffic.</span>
              </div>
              <div className="metric">
                <strong>{PUBLIC_ENV_SUMMARY.verifierWorkspaceEnabled ? "On" : "Off"}</strong>
                <span>Verifier workspace in this public build.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="feed">
          <div className="page-section">
            <div className="section-header">
              <div>
                <h2>Read all about it</h2>
                <p>Share-ready atomic modules from the public gateway.</p>
              </div>
              <Link className="button button--solid" href="/verify">
                Verification desk
              </Link>
            </div>

            {error && (
              <p className="error-state">
                The public gateway is not reachable yet. Showing launch briefs until the published ledger is online.
              </p>
            )}
            {items.length === 0 && !error && (
              <p className="empty-state">
                No published stories yet. The product shell is ready; publish through the gateway when the ledger is seeded.
              </p>
            )}
            {atoms.length > 0 ? (
              <div className="atom-grid">
                {atoms.map((atom, index) => (
                  <NewsAtomCard atom={atom} key={atom.id} priority={index === 0} />
                ))}
              </div>
            ) : (
              <LaunchBriefs />
            )}
          </div>
        </section>

        <section className="section section--white">
          <div className="page-section">
            <div className="section-header">
              <div>
                <h2>Audience and revenue loops</h2>
                <p>
                  These public calls to action are configured with browser-safe URLs only. Payment processors,
                  email provider keys, and sponsor operations remain server-side.
                </p>
              </div>
            </div>
            <RevenueCards />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
