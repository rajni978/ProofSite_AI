export function SkeletonLoader({ label = "Loading dashboard" }: { label?: string }) {
  return (
    <div className="dashboard-skeleton" role="status" aria-label={label} aria-busy="true">
      <span className="sr-only">{label}</span>
      <div className="skeleton-heading skeleton-block" />
      <div className="skeleton-subheading skeleton-block" />
      <div className="skeleton-metrics">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="skeleton-metric skeleton-block" key={index} />
        ))}
      </div>
      <div className="skeleton-section-heading skeleton-block" />
      <div className="skeleton-projects">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="skeleton-project skeleton-block" key={index} />
        ))}
      </div>
      <div className="skeleton-panel skeleton-block" />
    </div>
  );
}
