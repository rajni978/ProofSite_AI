import type { ReactNode } from "react";

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand${compact ? " mobile-brand" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M4.5 18.5V9.2L12 5l7.5 4.2v9.3H4.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 18.5v-5h6v5M7.5 10.5h.01M12 10.5h.01M16.5 10.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="m15.7 7.1 1.4 1.4 2.6-2.7" stroke="#13a89e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="brand-name">
        ProofSite <span>AI</span>
      </span>
    </div>
  );
}

export function AuthLayout({
  children,
  mode,
}: {
  children: ReactNode;
  mode: "login" | "register";
}) {
  return (
    <main className="auth-shell">
      <aside className="auth-panel" aria-label="ProofSite AI platform introduction">
        <Brand />
        <div className="panel-content">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Proof of work. Verified.
          </span>
          <h1 className="panel-headline">
            Verify the work before approving the payment.
          </h1>
          <p className="panel-description">
            Bring field evidence, project teams, and payment confidence together
            in one clear workflow.
          </p>
          <div className="proof-card">
            <span className="proof-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M12 3.5 19 6v5.2c0 4.2-2.8 7.3-7 9.3-4.2-2-7-5.1-7-9.3V6l7-2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="proof-card-title">Built for accountable projects</p>
              <p className="proof-card-copy">
                A reliable record of completed work helps teams review with
                clarity and move forward with confidence.
              </p>
            </div>
          </div>
        </div>
        <footer className="panel-footer">
          © {new Date().getFullYear()} ProofSite AI · Construction, verified.
        </footer>
      </aside>
      <section className="auth-main">
        <div className="auth-content">
          <Brand compact />
          <h2 className="auth-heading">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="auth-subheading">
            {mode === "login"
              ? "Sign in to continue to your project workspace."
              : "Start building a clearer record of work on site."}
          </p>
          {children}
        </div>
      </section>
    </main>
  );
}
