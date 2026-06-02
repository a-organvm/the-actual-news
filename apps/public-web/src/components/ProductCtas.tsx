import { MEMBERSHIP_URL, NEWSLETTER_URL, SPONSOR_URL } from "../lib/env";
import { trackPublicEvent, withUtm } from "../lib/public-analytics";
import { ConversionLink } from "./ConversionLink";

type CtaLink = {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "solid" | "outline";
};

export function HeroCtas() {
  const candidateLinks: CtaLink[] = [
    { label: "Join the briefing", href: withUtm("/briefing", { source: "front_page", medium: "cta", campaign: "briefing" }), variant: "primary" },
    {
      label: "Become a founding member",
      href: withUtm("/membership", { source: "front_page", medium: "cta", campaign: "membership" }),
      variant: "secondary"
    }
  ];

  return (
    <div className="button-row">
      {candidateLinks.map((link) => (
        <a
          className={`button button--${link.variant}`}
          href={link.href}
          key={link.label}
          onClick={() => trackPublicEvent("Hero CTA", { label: link.label, href: link.href })}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export function RevenueCards() {
  const cards = [
    {
      title: "Reader membership",
      body: "Recurring support funds verification work instead of attention harvesting.",
      href: "/membership",
      externalHref: MEMBERSHIP_URL,
      conversionTarget: "membership" as const,
      label: "Start membership"
    },
    {
      title: "Daily briefing",
      body: "Build an owned audience with a concise newsletter that points back to the ledger.",
      href: "/briefing",
      externalHref: NEWSLETTER_URL,
      conversionTarget: "briefing" as const,
      label: "Subscribe"
    },
    {
      title: "Civic sponsorship",
      body: "Let aligned institutions underwrite public-interest beats without editorial control.",
      href: "/sponsor",
      externalHref: SPONSOR_URL,
      conversionTarget: "sponsor" as const,
      label: "Sponsor a beat"
    }
  ];

  return (
    <div className="revenue-grid" id="membership">
      {cards.map((card) => (
        <article className="revenue-card" key={card.title}>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
          <a
            className="button button--outline"
            href={withUtm(card.href, {
              source: "front_page",
              medium: "revenue_card_detail",
              campaign: card.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")
            })}
            onClick={() => trackPublicEvent("Revenue Detail", { title: card.title, href: card.href })}
          >
            Details
          </a>
          <ConversionLink
            href={card.externalHref}
            label={card.label}
            fallbackLabel="Provider pending"
            source="front_page"
            medium="revenue_card"
            campaign={card.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
            conversionTarget={card.conversionTarget}
            className="button button--solid"
          />
        </article>
      ))}
    </div>
  );
}
