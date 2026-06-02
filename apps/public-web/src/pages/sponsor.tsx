import { OfferPage } from "../components/OfferPage";
import { OfferPackages } from "../components/OfferPackages";
import { SPONSOR_URL } from "../lib/env";
import { publicOffers } from "../lib/public-offers";

export default function SponsorPage() {
  const offer = publicOffers.sponsor;

  return (
    <OfferPage
      path={offer.path}
      title={offer.title}
      kicker={offer.kicker}
      description={offer.description}
      primaryLabel={offer.primaryLabel}
      primaryHref={SPONSOR_URL || "/sponsor"}
      conversionTarget={offer.id}
      fallbackNote={offer.fallbackNote}
    >
      <OfferPackages title={offer.packagesTitle} packages={offer.packages} />
      <div className="offer-grid">
        <section>
          <h2>Public lanes</h2>
          <ul>
            <li>Local records watch</li>
            <li>Procurement and budget tracking</li>
            <li>Verification-first explainers</li>
          </ul>
        </section>
        <section>
          <h2>Editorial firewall</h2>
          <p>Sponsorship funds a beat. It does not buy claims, conclusions, ranking, or correction decisions.</p>
        </section>
      </div>
    </OfferPage>
  );
}
