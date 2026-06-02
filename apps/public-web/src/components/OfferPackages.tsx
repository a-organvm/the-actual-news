export type OfferPackage = {
  name: string;
  price: string;
  summary: string;
  bullets: string[];
};

type OfferPackagesProps = {
  title: string;
  packages: OfferPackage[];
};

export function OfferPackages({ title, packages }: OfferPackagesProps) {
  return (
    <section className="offer-packages" aria-label={title}>
      <h2>{title}</h2>
      <div className="offer-package-grid">
        {packages.map((pkg) => (
          <article className="offer-package" key={pkg.name}>
            <div className="offer-package__header">
              <h3>{pkg.name}</h3>
              <strong>{pkg.price}</strong>
            </div>
            <p>{pkg.summary}</p>
            <ul>
              {pkg.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
