export function NotificationButton() {
  return (
    <button
      className="notification-button"
      type="button"
      disabled
      aria-label="Notifications (no new notifications)"
      title="Notifications will be available soon"
    >
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
        <path d="M18 9a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
