const tickerItems = [
  "Read all about it",
  "Claims split into public atoms",
  "Evidence travels with the story",
  "Corrections stay on the record",
  "Share the receipt, not just the headline"
];

export function TownCrierTicker() {
  const content = [...tickerItems, ...tickerItems];

  return (
    <div className="crier-strip" aria-label="Town crier ticker">
      <div className="crier-strip__track">
        {content.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
