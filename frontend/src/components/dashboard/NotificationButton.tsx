"use client";

import { useEffect, useState } from "react";
import { DashboardIcon } from "./DashboardIcon";

const previewNotifications = [
  {
    id: "n-1",
    title: "Verification needs review",
    detail: "Northline Medical Center · 18 min ago",
    icon: "verification",
  },
  {
    id: "n-2",
    title: "Worker checked in",
    detail: "Riverside Commercial Tower · 8:42 AM",
    icon: "attendance",
  },
] as const;

export function NotificationButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="notification-control">
      <button
        className="notification-button"
        type="button"
        aria-label="Notifications (sample previews)"
        aria-expanded={open}
        aria-controls="notification-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
          <path d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="notification-count" aria-hidden="true">{previewNotifications.length}</span>
      </button>
      {open && (
        <section
          id="notification-panel"
          className="notification-panel"
          aria-label="Sample notifications"
        >
          <div className="notification-panel-heading">
            <div>
              <h2>Notifications</h2>
              <p>Illustrative activity only</p>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="notification-preview-note">Sample notifications · no live alerts</p>
          <div className="notification-list">
            {previewNotifications.map((notification) => (
              <article className="notification-item" key={notification.id}>
                <span className="notification-item-icon">
                  <DashboardIcon name={notification.icon} />
                </span>
                <div>
                  <h3>{notification.title}</h3>
                  <p>{notification.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
