import { OfferPage } from "../components/OfferPage";
import { OfferPackages } from "../components/OfferPackages";
import { MEMBERSHIP_URL } from "../lib/env";
import { publicOffers } from "../lib/public-offers";

export default function MembershipPage() {
  const offer = publicOffers.membership;

  return (
    <OfferPage
      path={offer.path}
      title={offer.title}
      kicker={offer.kicker}
      description={offer.description}
      primaryLabel={offer.primaryLabel}
      primaryHref={MEMBERSHIP_URL || "/membership"}
      conversionTarget={offer.id}
      fallbackNote={offer.fallbackNote}
    >
      <OfferPackages title={offer.packagesTitle} packages={offer.packages} />
      <div className="offer-grid">
        <section>
          <h2>What members fund</h2>
          <ul>
            <li>Primary-source evidence collection</li>
            <li>Claim extraction and public verification ledgers</li>
            <li>Append-only correction history</li>
          </ul>
        </section>
        <section>
          <h2>Why it matters</h2>
          <p>When readers fund the record, the product is trust that can be inspected, shared, and corrected.</p>
        </section>
      </div>
    </OfferPage>
  );
}
