import { OfferPage } from "../components/OfferPage";
import { OfferPackages } from "../components/OfferPackages";
import { NEWSLETTER_URL } from "../lib/env";
import { publicOffers } from "../lib/public-offers";

export default function BriefingPage() {
  const offer = publicOffers.briefing;

  return (
    <OfferPage
      path={offer.path}
      title={offer.title}
      kicker={offer.kicker}
      description={offer.description}
      primaryLabel={offer.primaryLabel}
      primaryHref={NEWSLETTER_URL || "/briefing"}
      conversionTarget={offer.id}
      fallbackNote={offer.fallbackNote}
    >
      <OfferPackages title={offer.packagesTitle} packages={offer.packages} />
      <div className="offer-grid">
        <section>
          <h2>What subscribers get</h2>
          <ul>
            <li>New public clippings as they publish</li>
            <li>Verification notes and correction updates</li>
            <li>Member-funded investigation calls</li>
          </ul>
        </section>
        <section>
          <h2>How it spreads</h2>
          <p>Every dispatch points to modular story atoms built to be shared with receipts attached.</p>
        </section>
      </div>
    </OfferPage>
  );
}
