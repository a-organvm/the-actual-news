import Link from "next/link";
import { CopyButton } from "../components/CopyButton";
import { SiteShell } from "../components/SiteShell";
import { SITE_URL } from "../lib/env";
import { publicProviderHandoff } from "../lib/public-provider-handoff";

export default function ProviderPages() {
  const handoff = publicProviderHandoff();
  const canonical = SITE_URL.replace(/\/$/, "");

  return (
    <SiteShell
      title="Provider Pages | The Actual News"
      description="Public-safe setup packet for newsletter, membership, and sponsor provider pages."
      path="/provider-pages"
      imagePath="/api/social-card.svg?title=Provider%20Pages&kicker=Public%20notice"
    >
      <main className="content-page content-page--wide">
        <article className="offer-page launch-page">
          <div className="newspaper__dateline">
            <span>Public notice</span>
            <span>Provider pages</span>
            <span>{handoff.provider_pages.length} conversion desks</span>
          </div>

          <div className="offer-page__hero">
            <p className="eyebrow">Hosted conversion setup</p>
            <h1>Provider Pages</h1>
            <p className="lede">
              Copy-ready instructions for setting up audience capture, membership checkout, and sponsor intake without
              putting payment keys, newsletter tokens, CRM credentials, or webhook secrets in the public app.
            </p>
            <div className="button-row">
              <Link className="button button--solid" href="/provider-handoff.json">
                Provider handoff JSON
              </Link>
              <Link className="button button--outline" href="/runbook.json">
                Launch runbook
              </Link>
              <Link className="button button--outline" href="/media-kit">
                Media kit
              </Link>
            </div>
          </div>

          <section className="route-ledger" aria-label="Provider page setup packets">
            <div className="section-header">
              <div>
                <h2>Setup packets</h2>
                <p>
                  Each packet is public-safe. Provider dashboards keep subscriber exports, checkout records, CRM notes,
                  webhook secrets, and payment credentials private.
                </p>
              </div>
            </div>

            <div className="provider-packet-grid">
              {handoff.provider_pages.map((page) => {
                const providerTypes = page.provider_types.join(", ");
                const fields = page.form_fields.join("\n");
                const packages = page.packages.map((pkg) => `${pkg.name} - ${pkg.price}: ${pkg.summary}`).join("\n");
                const packet = [
                  page.title,
                  `Public page: ${canonical}${page.public_path}`,
                  `Stable route: ${canonical}${page.stable_distribution_route}`,
                  `Env key: ${page.env_key}`,
                  `Provider types: ${providerTypes}`,
                  "",
                  "Primary copy:",
                  page.primary_copy,
                  "",
                  "CTA:",
                  page.cta_label,
                  "",
                  "Fields:",
                  fields,
                  "",
                  "Packages:",
                  packages,
                  "",
                  "Confirmation:",
                  page.confirmation_copy,
                  "",
                  "Acceptance criteria:",
                  page.acceptance_criteria.join("\n")
                ].join("\n");

                return (
                  <article className="provider-packet" key={page.id}>
                    <div>
                      <span className={page.provider_url_configured ? "status-pill" : "status-pill status-pill--muted"}>
                        {page.provider_url_configured ? "configured" : "provider needed"}
                      </span>
                      <h2>{page.title}</h2>
                      <p>{page.primary_copy}</p>
                    </div>

                    <dl className="provider-packet__ledger">
                      <div>
                        <dt>Public page</dt>
                        <dd>
                          <Link href={page.public_path}>{page.public_path}</Link>
                        </dd>
                      </div>
                      <div>
                        <dt>Stable route</dt>
                        <dd>
                          <code>{page.stable_distribution_route}</code>
                        </dd>
                      </div>
                      <div>
                        <dt>Public env key</dt>
                        <dd>
                          <code>{page.env_key}</code>
                        </dd>
                      </div>
                    </dl>

                    <div className="provider-packet__section">
                      <h3>Provider fit</h3>
                      <p>{providerTypes}</p>
                    </div>

                    <div className="provider-packet__section">
                      <h3>Fields</h3>
                      <ul>
                        {page.form_fields.map((field) => (
                          <li key={field}>{field}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="provider-packet__section">
                      <h3>Acceptance criteria</h3>
                      <ul>
                        {page.acceptance_criteria.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <CopyButton
                      value={packet}
                      label="Copy setup packet"
                      eventLabel="provider_page_packet"
                      eventContext={{ provider_page: page.id }}
                    />
                  </article>
                );
              })}
            </div>
          </section>

          <section className="boundary-notice">
            <h2>Internal boundary</h2>
            <p>
              Public pages may publish hosted URLs, offer copy, field names, UTM parameters, and acceptance criteria.
              Never publish provider API keys, webhook signing secrets, subscriber exports, payment credentials, CRM
              tokens, fulfillment credentials, database URLs, reviewer queues, private sponsor notes, contracts, or
              banking details.
            </p>
          </section>
        </article>
      </main>
    </SiteShell>
  );
}
