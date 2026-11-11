import type { ReactNode } from "react";
import { MarketingFooter } from "./MarketingFooter";
import { MarketingNav } from "./MarketingNav";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="landing-page">
      <a className="landing-skip-link" href="#main-content">Skip to content</a>
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}
