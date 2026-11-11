"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard route failed to render:", error);
  }, [error]);

  return (
    <main className="dashboard-page-content">
      <section className="dashboard-panel dashboard-error-state" role="alert">
        <span className="error-state-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path d="M12 3 2.8 19h18.4L12 3zM12 9v4m0 3h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1>We couldn&apos;t load this workspace</h1>
        <p>Something went wrong while displaying the dashboard. Try again, or return later.</p>
        <button type="button" className="button-primary" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
