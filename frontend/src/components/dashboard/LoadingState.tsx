export function LoadingState({ label = "Loading workspace" }: { label?: string }) {
  return (
    <div className="dashboard-loading" role="status" aria-live="polite">
      <span className="dashboard-loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
