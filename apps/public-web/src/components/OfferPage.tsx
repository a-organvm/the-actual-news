import { ReactNode } from "react";
import { ConversionLink } from "./ConversionLink";
import { OfferConversionSteps } from "./OfferConversionSteps";
import { SiteShell } from "./SiteShell";
import type { ConversionTarget } from "../lib/public-conversions";
import { publicOffers } from "../lib/public-offers";
import { offerJsonLd } from "../lib/public-structured-data";

type OfferPageProps = {
  path: string;
  title: string;
  kicker: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  conversionTarget: ConversionTarget;
  fallbackNote: string;
  children: ReactNode;
};

export function OfferPage({
  path,
  title,
  kicker,
  description,
  primaryLabel,
  primaryHref,
  conversionTarget,
  fallbackNote,
  children
}: OfferPageProps) {
  const imagePath = `/api/social-card.svg?title=${encodeURIComponent(title)}&kicker=${encodeURIComponent(kicker)}`;
  const campaign = path.replace(/^\//, "") || "home";
  const offer = publicOffers[conversionTarget];

  return (
    <SiteShell
      title={`${title} | Records Watch`}
      description={description}
      path={path}
      imagePath={imagePath}
      structuredData={offerJsonLd({
        title,
        description,
        path,
        packages: offer.packages
      })}
    >
      <main className="content-page content-page--wide">
        <article className="offer-page">
          <div className="newspaper__dateline">
            <span>Public notice</span>
            <span>{kicker}</span>
            <span>Records Watch</span>
          </div>
          <div className="offer-page__hero">
            <p className="eyebrow">{kicker}</p>
            <h1>{title}</h1>
            <p className="lede">{description}</p>
            <div className="button-row">
              <ConversionLink
                href={primaryHref}
                label={primaryLabel}
                fallbackLabel={`${primaryLabel} coming soon`}
                source="offer_page"
                medium="cta"
                campaign={campaign}
                conversionTarget={conversionTarget}
                fallbackNote={fallbackNote}
              />
              <a className="button button--outline" href="/">
                Return to front page
              </a>
            </div>
          </div>
          <OfferConversionSteps title="Conversion desk" steps={offer.conversionSteps} />
          {children}
        </article>
      </main>
    </SiteShell>
  );
}
