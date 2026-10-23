type GameDescriptionProps = { description: string; className?: string };

function splitParagraphs(text: string) {
  return text.trim().split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
}

export function GameDescription({ description, className }: GameDescriptionProps) {
  const lines = description.split(/\r?\n/);
  const featureHeading = lines.findIndex((line) => /^Features:\s*$/i.test(line.trim()));
  const prose = featureHeading < 0 ? lines.join("\n") : lines.slice(0, featureHeading).join("\n");
  const features = featureHeading < 0
    ? []
    : lines.slice(featureHeading + 1).map((line) => line.trim()).filter((line) => line.startsWith("- ")).map((line) => line.slice(2).trim()).filter(Boolean);

  return <>
    {splitParagraphs(prose).map((paragraph, index) => <p key={`paragraph-${index}`}>{paragraph}</p>)}
    {features.length > 0 && <section className={className} aria-labelledby="game-features">
      <h3 id="game-features">Features</h3>
      <ul>{features.map((feature, index) => <li key={`feature-${index}`}>{feature}</li>)}</ul>
    </section>}
  </>;
}
