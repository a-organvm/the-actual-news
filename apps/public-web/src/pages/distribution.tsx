import { ConversionLink } from "../components/ConversionLink";
import { CopyButton } from "../components/CopyButton";
import { SiteShell } from "../components/SiteShell";
import { MEMBERSHIP_URL, NEWSLETTER_URL, SITE_URL, SPONSOR_URL } from "../lib/env";
import { withUtm } from "../lib/public-analytics";
import { publicCampaignPackets } from "../lib/public-campaigns";
import { distributionRoutes, launchMessages } from "../lib/public-distribution";
import { publicFeedItems, publicSharePacket, socialCardPath } from "../lib/public-feed";
import { publicOfferList } from "../lib/public-offers";

export default function DistributionPage() {
  const title = "Distribution Kit";
  const description =
    "Public launch copy, feeds, and share routes for spreading The Actual News without exposing internal systems or secrets.";
  const canonical = SITE_URL.replace(/\/$/, "");

  return (
    <SiteShell title={`${title} | The Actual News`} description={description} path="/distribution">
      <main className="content-page content-page--wide">
        <article className="distribution-page">
          <div className="newspaper__dateline">
            <span>Public notice</span>
            <span>Town square distribution</span>
            <span>No secrets in the satchel</span>
          </div>
          <section className="distribution-hero">
            <p className="eyebrow">Read all about it</p>
            <h1>Distribution Kit</h1>
            <p className="lede">
              The public launch packet for people who want to spread the paper: share copy, feeds, conversion
              routes, and the boundary line between public links and internal operations.
            </p>
            <div className="button-row">
              <a
                className="button button--solid"
                href={withUtm("/#feed", { source: "distribution", medium: "cta", campaign: "read_atoms" })}
              >
                Read atoms
              </a>
              <a
                className="button button--outline"
                href={withUtm("/feed.xml", { source: "distribution", medium: "feed", campaign: "rss" })}
              >
                Open RSS
              </a>
            </div>
          </section>

          <section className="distribution-grid" aria-label="Launch messages">
            {launchMessages.map((message) => (
              <article className="copy-slip" key={message.channel}>
                <span>{message.channel}</span>
                <p>{message.copy}</p>
                <CopyButton
                  value={message.copy}
                  label="Copy"
                  eventLabel="launch_message"
                  eventContext={{ channel: message.channel }}
                />
              </article>
            ))}
          </section>

          <section className="route-ledger" aria-label="Public routes">
            <div className="section-header">
              <div>
                <h2>Public routes</h2>
                <p>These are safe to share. They contain public URLs, feeds, and conversion pages only.</p>
              </div>
            </div>
            <div className="route-list">
              {distributionRoutes.map((route) => (
                <div className="route-list__item" key={route.href}>
                  <a
                    href={withUtm(route.href, {
                      source: "distribution",
                      medium: "route_list",
                      campaign: route.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")
                    })}
                  >
                    <span>{route.label}</span>
                    <code>{canonical}{route.href}</code>
                  </a>
                  <CopyButton
                    value={`${canonical}${route.href}`}
                    label="Copy URL"
                    eventLabel="public_route"
                    eventContext={{ route: route.href }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="route-ledger" aria-label="Shareable story atoms">
            <div className="section-header">
              <div>
                <h2>Shareable atoms</h2>
                <p>Clean clipping URLs, source story URLs, and generated cards for social distribution.</p>
              </div>
            </div>
            <div className="atom-ledger">
              {publicFeedItems.map((item) => {
                const sharePacket = publicSharePacket(item);

                return (
                  <article className="atom-ledger__item" key={item.id}>
                    <div>
                      <span>{item.kicker}</span>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </div>
                    <div className="atom-ledger__links" aria-label={`${item.title} distribution links`}>
                      <a href={withUtm(item.path, { source: "distribution", medium: "atom", campaign: item.id })}>
                        Clip
                      </a>
                      <a href={withUtm(item.storyPath, { source: "distribution", medium: "story", campaign: item.id })}>
                        Story
                      </a>
                      <a href={socialCardPath({ ...item, state: "published" })}>
                        Card
                      </a>
                      <a href={sharePacket.channels.x}>
                        X
                      </a>
                      <a href={sharePacket.channels.linkedin}>
                        In
                      </a>
                      <a href={sharePacket.channels.email}>
                        Mail
                      </a>
                    </div>
                    <div className="atom-ledger__copy-tools">
                      <code>{sharePacket.clip_url}</code>
                      <CopyButton
                        value={sharePacket.clip_url}
                        label="Copy URL"
                        eventLabel="atom_clip_url"
                        eventContext={{ atom_id: item.id }}
                      />
                    </div>
                    <div className="atom-ledger__copy-tools atom-ledger__copy-tools--text">
                      <p className="atom-ledger__copy">{sharePacket.share_text}</p>
                      <CopyButton
                        value={sharePacket.share_text}
                        label="Copy text"
                        eventLabel="atom_share_text"
                        eventContext={{ atom_id: item.id }}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="route-ledger" aria-label="Campaign queue">
            <div className="section-header">
              <div>
                <h2>Campaign queue</h2>
                <p>Copy-ready public pushes that keep atoms, briefing capture, membership, and sponsorship moving.</p>
              </div>
            </div>
            <div className="offer-ledger">
              {publicCampaignPackets.map((campaign) => (
                <article className="offer-ledger__item" key={campaign.id}>
                  <div>
                    <span>{campaign.cadence} / {campaign.channel}</span>
                    <h3>{campaign.headline}</h3>
                    <p>{campaign.copy}</p>
                  </div>
                  <a className="button button--outline" href={campaign.tracked_path}>
                    {campaign.cta_label}
                  </a>
                  <div className="offer-ledger__packages" aria-label={`${campaign.headline} campaign metadata`}>
                    <span>
                      <strong>Lane</strong>
                      {campaign.lane}
                    </span>
                    {campaign.content_id ? (
                      <span>
                        <strong>Content</strong>
                        {campaign.content_id}
                      </span>
                    ) : null}
                  </div>
                  <code>{canonical}{campaign.tracked_path}</code>
                  <CopyButton
                    value={`${campaign.copy}\n\n${canonical}${campaign.tracked_path}`}
                    label="Copy campaign"
                    eventLabel="campaign_packet"
                    eventContext={{ campaign: campaign.id, lane: campaign.lane }}
                  />
                </article>
              ))}
            </div>
          </section>

          <section className="offer-grid">
            <div>
              <h2>Audience</h2>
              <p>Route casual readers into the owned briefing list instead of leaving them inside social feeds.</p>
              <ConversionLink
                href={NEWSLETTER_URL}
                label="Join the briefing"
                fallbackLabel="Provider pending"
                fallbackNote="Set NEXT_PUBLIC_NEWSLETTER_URL before public launch."
                source="distribution"
                medium="audience"
                campaign="briefing"
                conversionTarget="briefing"
              />
            </div>
            <div>
              <h2>Revenue</h2>
              <p>Route high-intent readers into membership and sponsors into a disclosed underwriting lane.</p>
              <div className="button-row">
                <ConversionLink
                  href={MEMBERSHIP_URL}
                  label="Start membership"
                  fallbackLabel="Membership pending"
                  source="distribution"
                  medium="revenue"
                  campaign="membership"
                  conversionTarget="membership"
                />
                <ConversionLink
                  href={SPONSOR_URL}
                  label="Sponsor a beat"
                  fallbackLabel="Sponsor intake pending"
                  source="distribution"
                  medium="revenue"
                  campaign="sponsor"
                  conversionTarget="sponsor"
                  className="button button--outline"
                />
              </div>
            </div>
          </section>

          <section className="route-ledger" aria-label="Public offer packets">
            <div className="section-header">
              <div>
                <h2>Offer packets</h2>
                <p>Public-safe audience and revenue offers for newsletters, social posts, partners, and sponsors.</p>
              </div>
            </div>
            <div className="offer-ledger">
              {publicOfferList.map((offer) => (
                <article className="offer-ledger__item" key={offer.id}>
                  <div>
                    <span>{offer.kicker}</span>
                    <h3>{offer.title}</h3>
                    <p>{offer.distributionCopy}</p>
                  </div>
                  <a
                    className="button button--outline"
                    href={withUtm(offer.path, {
                      source: "distribution",
                      medium: "offer_packet",
                      campaign: offer.id
                    })}
                  >
                    {offer.primaryLabel}
                  </a>
                  <div className="offer-ledger__packages" aria-label={`${offer.title} packages`}>
                    {offer.packages.map((offerPackage) => (
                      <span key={offerPackage.name}>
                        <strong>{offerPackage.name}</strong>
                        {offerPackage.price}
                      </span>
                    ))}
                  </div>
                  <code>{canonical}{offer.path}</code>
                  <CopyButton
                    value={`${offer.distributionCopy}\n\n${canonical}${offer.path}`}
                    label="Copy packet"
                    eventLabel="offer_packet"
                    eventContext={{ offer: offer.id }}
                  />
                </article>
              ))}
            </div>
          </section>

          <section className="boundary-notice">
            <h2>Internal boundary</h2>
            <p>
              Do not publish database URLs, payment keys, newsletter API tokens, CRM credentials, reviewer queues,
              model gateway URLs, or webhook secrets. The public kit links to hosted provider pages and public feeds.
            </p>
          </section>
        </article>
      </main>
    </SiteShell>
  );
}
