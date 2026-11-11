import Link from "next/link";

export function MarketingCTA({
  eyebrow = "BUILD WITH MORE CLARITY",
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="landing-final-cta">
      <div className="landing-container landing-final-cta-inner">
        <p className="landing-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link className="landing-button landing-button-light" href="/login">Get started</Link>
        <span className="landing-cta-footnote">Main contractor accounts are provisioned by an administrator. Public registration remains worker-only.</span>
      </div>
    </section>
  );
}
