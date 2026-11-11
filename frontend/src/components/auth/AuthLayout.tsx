import type { ReactNode } from "react";
import Link from "next/link";

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="ProofSite AI home"
      className={`brand${compact ? " mobile-brand" : ""}`}
    >
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
    </Link>
  );
}

export function AuthLayout({
  children,
  mode,
}: {
  children: ReactNode;
  mode: "login" | "register";
}) {
  const sections = (
    <>
      <aside className="auth-panel" aria-label="ProofSite AI platform introduction">
        <Brand />
        <div className="panel-content">
          <div className="panel-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Proof of work. Verified.
            </span>
            <h1 className="panel-headline">
              Verify the work before approving the payment.
            </h1>
            <p className="panel-description">
              Bring field evidence, project teams, and payment confidence
              together in one clear workflow.
            </p>
          </div>
          <div
            className="auth-visual"
            role="img"
            aria-label="Construction team working on a site"
          >
            <span className="visual-caption">ON-SITE WORKFLOW PREVIEW</span>
            <div className="visual-preview-card attendance-preview">
              <span className="preview-icon preview-icon-teal" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d="M12 12a3.25 3.25 0 100-6.5 3.25 3.25 0 000 6.5zM5.5 19c.8-3 3.2-4.5 6.5-4.5s5.7 1.5 6.5 4.5M18 7.5h3M19.5 6v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="preview-copy">
                <span>Attendance</span>
                <strong>Verification preview</strong>
              </span>
              <span className="preview-check" aria-hidden="true">✓</span>
            </div>
            <div className="visual-preview-card safety-preview">
              <span className="preview-icon preview-icon-blue" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d="M12 3.5 19 6v5.2c0 4.2-2.8 7.3-7 9.3-4.2-2-7-5.1-7-9.3V6l7-2.5zM9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="preview-copy">
                <span>Safety checklist</span>
                <strong>Compliance preview</strong>
              </span>
            </div>
            <div className="visual-progress-card">
              <div className="progress-card-heading">
                <span>Project progress</span>
                <span className="preview-tag">PREVIEW</span>
              </div>
              <div className="progress-track" aria-hidden="true">
                <span />
              </div>
              <span className="progress-card-caption">A clearer view of site updates</span>
            </div>
          </div>
        </div>
        <footer className="panel-footer">
          <span className="footer-status-dot" />
          <span>© {new Date().getFullYear()} ProofSite AI</span>
          <span className="footer-divider">·</span>
          <span>Construction, verified.</span>
        </footer>
      </aside>
      <section className={`auth-main auth-main-${mode}`}>
        <div className="auth-content">
          <Brand compact />
          <span className="auth-kicker">
            {mode === "login" ? "SECURE PROJECT ACCESS" : "GET STARTED"}
          </span>
          <h2 className="auth-heading">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="auth-subheading">
            {mode === "login"
              ? "Sign in to continue to your project workspace."
              : "Start building a clearer record of work on site."}
          </p>
          {mode === "register" && (
            <p className="account-type-note">
              Public registration creates a Worker account. You can join your
              project team after signing up.
            </p>
          )}
          {children}
        </div>
      </section>
    </>
  );

  return (
    <main className="auth-shell" data-mode={mode}>
      <div className="auth-background-shape auth-background-shape-one" aria-hidden="true" />
      <div className="auth-background-shape auth-background-shape-two" aria-hidden="true" />
      <div className="auth-card">{sections}</div>
    </main>
  );
}
