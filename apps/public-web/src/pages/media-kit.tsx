import Link from "next/link";
import { CopyButton } from "../components/CopyButton";
import { SiteShell } from "../components/SiteShell";
import { SITE_URL } from "../lib/env";
import { pressCopy, publicMediaKit } from "../lib/public-media-kit";

export default function MediaKitPage() {
  const kit = publicMediaKit();
  const canonical = SITE_URL.replace(/\/$/, "");

  return (
    <SiteShell
      title="Media Kit | Records Watch"
      description="Public positioning, proof points, press copy, and sponsor-safe boundary notes for Records Watch."
      path="/media-kit"
      imagePath="/api/social-card.svg?title=Media%20Kit&kicker=Public%20notice"
    >
      <main className="content-page content-page--wide">
        <article className="offer-page launch-page">
          <div className="newspaper__dateline">
            <span>Public notice</span>
            <span>Media kit</span>
            <span>{kit.proof_points.public_atom_count} public atoms</span>
          </div>
          <div className="offer-page__hero">
            <p className="eyebrow">{kit.positioning.category}</p>
            <h1>{kit.positioning.name}</h1>
            <p className="lede">{kit.positioning.tagline}</p>
            <div className="button-row">
              <Link className="button button--solid" href="/distribution">
                Distribution kit
              </Link>
              <Link className="button button--outline" href="/media-kit.json">
                Media kit JSON
              </Link>
              <Link className="button button--outline" href="/sponsors">
                Sponsor registry
              </Link>
            </div>
          </div>

          <section className="route-ledger" aria-label="Press copy">
            <div className="section-header">
              <div>
                <h2>Press copy</h2>
                <p>Short public language for posts, pitches, newsletters, partner pages, and sponsor outreach.</p>
              </div>
            </div>
            <div className="distribution-grid">
              {pressCopy.map((item) => (
                <article className="copy-slip" key={item.label}>
                  <span>{item.label}</span>
                  <p>{item.copy}</p>
                  <CopyButton
                    value={item.copy}
                    label="Copy"
                    eventLabel="media_kit_copy"
                    eventContext={{ copy: item.label }}
                  />
                </article>
              ))}
            </div>
          </section>

          <section className="route-ledger" aria-label="Proof points">
            <div className="section-header">
              <div>
                <h2>Proof points</h2>
                <p>Public facts that can be repeated without exposing private audience, revenue, or operations data.</p>
              </div>
            </div>
            <div className="launch-ledger">
              {Object.entries(kit.proof_points).map(([label, value]) => (
                <article className="launch-ledger__row" key={label}>
                  <div>
                    <span className="status-pill">public</span>
                    <h2>{label.replace(/_/g, " ")}</h2>
                  </div>
                  <code>{String(value)}</code>
                </article>
              ))}
            </div>
          </section>

          <section className="route-ledger" aria-label="Public media assets">
            <div className="section-header">
              <div>
                <h2>Public assets</h2>
                <p>Routes that press, partners, sponsors, and distribution operators can inspect or cite.</p>
              </div>
            </div>
            <div className="route-list">
              {kit.public_assets.map((asset) => (
                <div className="route-list__item" key={asset}>
                  <Link href={asset}>
                    <span>{asset}</span>
                    <code>{canonical}{asset}</code>
                  </Link>
                  <CopyButton
                    value={`${canonical}${asset}`}
                    label="Copy URL"
                    eventLabel="media_kit_asset"
                    eventContext={{ asset }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="boundary-notice">
            <h2>Internal boundary</h2>
            <p>
              Private traffic dashboards, audience exports, ad account credentials, newsletter tokens, payment keys, CRM
              tokens, webhook secrets, database URLs, and reviewer queues stay internal.
            </p>
          </section>
        </article>
      </main>
    </SiteShell>
  );
}
