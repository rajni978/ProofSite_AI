import { DashboardIcon } from "./DashboardIcon";
import type { DashboardStat } from "@/types/dashboard";

export function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <article className="stat-card">
      <div className="stat-topline">
        <span className="stat-label">{stat.label}</span>
        <span className={`stat-icon stat-icon-${stat.tone ?? "neutral"}`}>
          <DashboardIcon name={stat.icon} />
        </span>
      </div>
      <div className="stat-value">{stat.value}</div>
      {stat.change && (
        <p className={`stat-change stat-change-${stat.tone ?? "neutral"}`}>
          {stat.tone === "positive" && (
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
              <path d="M3 11l4-4 3 3 4-5M10 5h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {stat.change}
        </p>
      )}
    </article>
  );
}
