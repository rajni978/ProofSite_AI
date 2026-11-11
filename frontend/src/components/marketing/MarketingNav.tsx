"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

function BrandMark() {
  return (
    <span className="landing-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="23" height="23" fill="none">
        <path d="M4.5 18.5V9.2L12 5l7.5 4.2v9.3H4.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 18.5v-5h6v5M7.5 10.5h.01M12 10.5h.01M16.5 10.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="m15.7 7.1 1.4 1.4 2.6-2.7" stroke="#13a89e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function MarketingNav() {
  const pathname = usePathname();

  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <Link className="landing-brand" href="/" aria-label="ProofSite AI home">
          <BrandMark />
          <span>ProofSite <strong>AI</strong></span>
        </Link>
        <nav className="landing-desktop-nav" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={pathname === item.href ? "is-current" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="landing-header-actions">
          <Link className="landing-login-link" href="/login">Login</Link>
          <Link className="landing-button landing-button-small" href="/login">
            Get started
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
              <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <details className="landing-mobile-menu">
            <summary aria-label="Open navigation menu">
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </summary>
            <nav aria-label="Mobile navigation">
              {navigationItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={pathname === item.href ? "is-current" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/login">Login</Link>
              <Link href="/login">Get started</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
