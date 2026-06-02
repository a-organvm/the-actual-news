import type { PublicConversionStep } from "../lib/public-offers";

type OfferConversionStepsProps = {
  title: string;
  steps: PublicConversionStep[];
};

export function OfferConversionSteps({ title, steps }: OfferConversionStepsProps) {
  return (
    <section className="offer-conversion">
      <h2>{title}</h2>
      <div className="offer-conversion__grid">
        {steps.map((step, index) => (
          <article className="offer-conversion__step" key={step.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.label}</h3>
            <p>{step.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
