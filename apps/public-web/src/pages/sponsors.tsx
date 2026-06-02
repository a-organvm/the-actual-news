import Link from "next/link";
import { CopyButton } from "../components/CopyButton";
import { SiteShell } from "../components/SiteShell";
import { SITE_URL } from "../lib/env";
import { withUtm } from "../lib/public-analytics";
import { publicOffers } from "../lib/public-offers";
import { publicSponsorRegistry } from "../lib/public-sponsors";

export default function SponsorsPage() {
  const registry = publicSponsorRegistry();
  const canonical = SITE_URL.replace(/\/$/, "");
  const sponsorOffer = publicOffers.sponsor;
  const sponsorPath = withUtm("/go/sponsor", {
    source: "sponsor_registry",
    medium: "registry_cta",
    campaign: "sponsor_intake"
  });

  return (
    <SiteShell
      title="Sponsor Registry | The Actual News"
      description="Public sponsor disclosures, firewall rules, and sponsorship lanes for The Actual News."
      path="/sponsors"
      imagePath="/api/social-card.svg?title=Sponsor%20Registry&kicker=Public%20notice"
    >
      <main className="content-page content-page--wide">
        <article className="offer-page launch-page">
          <div className="newspaper__dateline">
            <span>Public notice</span>
            <span>Sponsor registry</span>
            <span>{registry.current_disclosures.length} active disclosures</span>
          </div>
          <div className="offer-page__hero">
            <p className="eyebrow">Civic underwriting</p>
            <h1>Public sponsor registry</h1>
            <p className="lede">
              Sponsorship can fund reporting capacity, but it does not buy claims, conclusions, ranking, correction
              decisions, or private access to internal systems.
            </p>
            <div className="button-row">
              <a className="button button--solid" href={sponsorPath}>
                Sponsor a beat
              </a>
              <Link className="button button--outline" href="/sponsors.json">
                Registry JSON
              </Link>
              <Link className="button button--outline" href="/principles">
                Principles
              </Link>
            </div>
          </div>

          <section className="boundary-note" aria-label="Current sponsor disclosures">
            <div>
              <h2>Current disclosures</h2>
              {registry.current_disclosures.length > 0 ? (
                <ul>
                  {registry.current_disclosures.map((disclosure) => (
                    <li key={`${disclosure.sponsor}-${disclosure.beat}`}>
                      {disclosure.sponsor}: {disclosure.beat} ({disclosure.amount})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No accepted sponsors are currently disclosed. The registry is ready before sponsor intake opens.</p>
              )}
            </div>
            <div>
              <h2>Public JSON</h2>
              <p>Automation can inspect accepted disclosures, sponsor lanes, firewall rules, and the internal boundary.</p>
              <code>{canonical}/sponsors.json</code>
              <CopyButton
                value={`${canonical}/sponsors.json`}
                label="Copy URL"
                eventLabel="sponsor_registry_json"
                eventContext={{ registry: "sponsors" }}
              />
            </div>
          </section>

          <section className="route-ledger" aria-label="Sponsorship lanes">
            <div className="section-header">
              <div>
                <h2>Sponsorship lanes</h2>
                <p>{sponsorOffer.description}</p>
              </div>
            </div>
            <div className="offer-ledger">
              {registry.proposed_lanes.map((lane) => (
                <article className="offer-ledger__item" key={lane.name}>
                  <div>
                    <span>{lane.price}</span>
                    <h3>{lane.name}</h3>
                    <p>{lane.summary}</p>
                  </div>
                  <div className="offer-ledger__packages" aria-label={`${lane.name} public terms`}>
                    {lane.public_terms.map((term) => (
                      <span key={term}>
                        <strong>Term</strong>
                        {term}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="route-ledger" aria-label="Sponsor firewall">
            <div className="section-header">
              <div>
                <h2>Firewall rules</h2>
                <p>These rules are public because sponsor money should be inspectable before it becomes influence.</p>
              </div>
            </div>
            <div className="launch-ledger">
              {registry.firewall_rules.map((rule) => (
                <article className="launch-ledger__row" key={rule}>
                  <div>
                    <span className="status-pill">public</span>
                    <h2>{rule}</h2>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="boundary-notice">
            <h2>Internal boundary</h2>
            <p>
              CRM tokens, payment keys, private sponsor notes, contracts, banking details, reviewer queues, and database
              URLs stay internal. This page publishes only disclosure-ready facts and public terms.
            </p>
          </section>
        </article>
      </main>
    </SiteShell>
  );
}
