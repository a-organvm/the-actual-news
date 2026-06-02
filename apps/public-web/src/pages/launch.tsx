import Link from "next/link";
import { SiteShell } from "../components/SiteShell";
import { launchChecks } from "../lib/public-launch";
import { publicLaunchRunbook } from "../lib/public-runbook";

const readyCount = launchChecks.filter((check) => check.ready).length;
const launchRunbook = publicLaunchRunbook();
const launchArtifacts = [
  {
    label: "Launch JSON",
    href: "/launch.json",
    summary: "Readiness checks, public routes, feeds, atom packets, offer packets, conversion status, and boundary warnings."
  },
  {
    label: "Launch runbook JSON",
    href: "/runbook.json",
    summary: "Operator steps, launch commands, public artifacts, blockers, and secret-boundary notes."
  },
  {
    label: "Share kit JSON",
    href: "/share-kit.json",
    summary: "Launch copy, tracked routes, social cards, atom share packets, public offers, and conversion steps."
  },
  {
    label: "Provider handoff JSON",
    href: "/provider-handoff.json",
    summary: "Public-safe provider page copy, fields, attribution parameters, and acceptance criteria."
  },
  {
    label: "Campaigns JSON",
    href: "/campaigns.json",
    summary: "Public-safe campaign packets for recurring atom, briefing, membership, and sponsor distribution."
  },
  {
    label: "Sponsor registry",
    href: "/sponsors",
    summary: "Public disclosure registry, sponsor lanes, and firewall rules for civic underwriting."
  },
  {
    label: "Media kit",
    href: "/media-kit",
    summary: "Public positioning, proof points, press copy, partner links, and sponsor-safe boundary notes."
  },
  {
    label: "Distribution kit",
    href: "/distribution",
    summary: "Human-readable share copy, public routes, offer packets, and internal boundary guidance."
  },
  {
    label: "Feeds",
    href: "/feed.xml",
    summary: "RSS and JSON Feed endpoints for syndication, readers, and distribution automation."
  }
];

export default function LaunchPage() {
  return (
    <SiteShell
      title="Launch Status | The Actual News"
      description="Public-safe launch readiness for The Actual News audience, revenue, and internal boundary setup."
      path="/launch"
      imagePath="/api/social-card.svg?title=Launch%20Status&kicker=Public%20notice"
    >
      <main className="content-page content-page--wide">
        <article className="offer-page launch-page">
          <div className="newspaper__dateline">
            <span>Public notice</span>
            <span>Launch desk</span>
            <span>{readyCount}/{launchChecks.length} ready</span>
          </div>
          <div className="offer-page__hero">
            <p className="eyebrow">Launch status</p>
            <h1>Public readiness ledger</h1>
            <p className="lede">
              A reader-safe status page for the public launch surface: audience capture, membership revenue,
              sponsorship intake, analytics, and the boundary between public routes and internal secrets.
            </p>
            <div className="button-row">
              <Link className="button button--solid" href="/membership">
                Membership page
              </Link>
              <Link className="button button--outline" href="/sponsor">
                Sponsor page
              </Link>
              <Link className="button button--outline" href="/launch.json">
                Launch JSON
              </Link>
              <Link className="button button--outline" href="/share-kit.json">
                Share kit
              </Link>
            </div>
          </div>

          <section className="launch-ledger" aria-label="Public launch readiness">
            {launchChecks.map((check) => (
              <article className="launch-ledger__row" key={check.label}>
                <div>
                  <span className={`status-pill ${check.ready ? "" : "status-pill--draft"}`}>
                    {check.ready ? "ready" : "needs setup"}
                  </span>
                  <h2>{check.label}</h2>
                  <p>{check.action}</p>
                </div>
                <code>{check.value}</code>
              </article>
            ))}
          </section>

          <section className="launch-ledger" aria-label="Public launch artifacts">
            {launchArtifacts.map((artifact) => (
              <article className="launch-ledger__row" key={artifact.href}>
                <div>
                  <span className="status-pill">public</span>
                  <h2>{artifact.label}</h2>
                  <p>{artifact.summary}</p>
                </div>
                <Link className="button button--outline" href={artifact.href}>
                  Open
                </Link>
              </article>
            ))}
          </section>

          <section className="launch-ledger" aria-label="Public launch runbook">
            {launchRunbook.steps.map((step) => (
              <article className="launch-ledger__row" key={step.id}>
                <div>
                  <span className={`status-pill ${step.blocks_public_launch ? "status-pill--draft" : ""}`}>
                    {step.phase}
                  </span>
                  <h2>{step.title}</h2>
                  <p>{step.summary}</p>
                  {step.command ? <code>{step.command}</code> : null}
                </div>
                <Link className="button button--outline" href={step.public_artifacts[0] ?? "/launch"}>
                  Open
                </Link>
              </article>
            ))}
          </section>

          <section className="boundary-note" aria-label="Public and internal deployment boundary">
            <div>
              <h2>Public container</h2>
              <p>
                Ships the newspaper front page, shareable clips, feeds, social cards, health check, and conversion
                pages. Browser configuration is limited to public URLs and booleans.
              </p>
            </div>
            <div>
              <h2>Internal stack</h2>
              <p>
                Holds database access, reviewer operations, ingestion, blob storage, model services, event queues,
                payment webhooks, email credentials, and CRM tokens.
              </p>
            </div>
          </section>
        </article>
      </main>
    </SiteShell>
  );
}
