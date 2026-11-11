import Link from "next/link";

function BrandMark() {
  return (
    <span className="landing-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M4.5 18.5V9.2L12 5l7.5 4.2v9.3H4.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 18.5v-5h6v5m.7-11.4 1.4 1.4 2.6-2.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function MarketingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-container landing-footer-main">
        <Link className="landing-brand landing-footer-brand" href="/" aria-label="ProofSite AI home">
          <BrandMark />
          <span>ProofSite <strong>AI</strong></span>
        </Link>
        <p>A clearer view of construction progress, evidence, and review.</p>
        <nav aria-label="Footer links">
          <Link href="/features">Features</Link>
          <Link href="/login">Login</Link>
        </nav>
      </div>
      <div className="landing-container landing-footer-bottom">
        <span>© {new Date().getFullYear()} ProofSite AI</span>
      </div>
    </footer>
  );
}
