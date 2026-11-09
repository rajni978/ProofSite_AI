import { dashboardPreviewData } from "@/data/dashboard-mock-data";
import { ProjectCard } from "./ProjectCard";
import { StatCard } from "./StatCard";
import { DashboardIcon } from "./DashboardIcon";

const verificationStyles = {
  Verified: "verification-verified",
  Flagged: "verification-flagged",
  "Needs review": "verification-review",
  Incomplete: "verification-incomplete",
} as const;

const actionIcons = {
  safety: "safety",
  milestone: "milestones",
  payment: "payments",
} as const;

export function AdminOverview({ fullName }: { fullName: string }) {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  return (
    <div className="dashboard-overview">
      <div className="overview-welcome">
        <div>
          <p className="preview-label">
            <span />
            Preview data · not connected to live projects
          </p>
          <h2>Good morning, {firstName}</h2>
          <p>Here&apos;s what&apos;s happening across your construction projects.</p>
        </div>
        <div className="welcome-date-chip">
          <DashboardIcon name="analytics" />
          <span>Portfolio overview</span>
        </div>
      </div>

      <section aria-labelledby="overview-stats-heading">
        <div className="section-heading">
          <div>
            <h2 id="overview-stats-heading" className="section-title">Portfolio overview</h2>
            <p className="section-caption">A high-level snapshot of your operations</p>
          </div>
          <span className="sample-pill">Sample metrics</span>
        </div>
        <div className="stats-grid">
          {dashboardPreviewData.adminStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      <section aria-labelledby="projects-heading">
        <div className="section-heading">
          <div>
            <h2 id="projects-heading" className="section-title">Project overview</h2>
            <p className="section-caption">Progress across active construction sites</p>
          </div>
          <span className="sample-pill">Preview</span>
        </div>
        <div className="project-grid">
          {dashboardPreviewData.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <div className="overview-two-column">
        <section className="dashboard-panel" aria-labelledby="verification-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="verification-heading" className="section-title">Verification overview</h2>
              <p className="section-caption">Submission review status</p>
            </div>
            <span className="panel-icon">
              <DashboardIcon name="verification" />
            </span>
          </div>
          <div className="verification-total">
            <strong>157</strong>
            <span>submissions this period <em>· sample</em></span>
          </div>
          <div className="verification-list">
            {dashboardPreviewData.verifications.map((item) => (
              <div className="verification-row" key={item.status}>
                <span className={`verification-dot ${verificationStyles[item.status]}`} />
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
          <div className="verification-bar" aria-label="Sample verification distribution">
            {dashboardPreviewData.verifications.map((item) => (
              <span
                key={item.status}
                className={verificationStyles[item.status]}
                style={{ width: `${(item.count / 157) * 100}%` }}
              />
            ))}
          </div>
        </section>

        <section className="dashboard-panel" aria-labelledby="pending-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="pending-heading" className="section-title">Pending actions</h2>
              <p className="section-caption">Items that may need your attention</p>
            </div>
            <span className="pending-count">{dashboardPreviewData.pendingActions.length}</span>
          </div>
          <div className="pending-list">
            {dashboardPreviewData.pendingActions.map((action) => (
              <article className="pending-item" key={action.id}>
                <span className={`pending-icon pending-icon-${action.kind}`}>
                  <DashboardIcon name={actionIcons[action.kind]} />
                </span>
                <div className="pending-copy">
                  <h3>{action.title}</h3>
                  <p>{action.project}</p>
                  <span>{action.age}</span>
                </div>
                <span className="pending-chevron" aria-hidden="true">›</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-panel activity-panel" aria-labelledby="activity-heading">
        <div className="panel-heading-row">
          <div>
            <h2 id="activity-heading" className="section-title">Recent activity</h2>
            <p className="section-caption">Latest updates from across your sites</p>
          </div>
          <span className="sample-pill">Sample activity</span>
        </div>
        <div className="activity-list">
          {dashboardPreviewData.activities.map((activity) => (
            <article className="activity-item" key={activity.id}>
              <span className={`activity-icon activity-icon-${activity.tone}`}>
                <DashboardIcon name={activity.icon} />
              </span>
              <div className="activity-copy">
                <h3>{activity.title}</h3>
                <p>{activity.detail}</p>
              </div>
              <time>{activity.time}</time>
            </article>
          ))}
        </div>
      </section>
      <p className="dashboard-disclaimer">
        <span className="sample-pill">Illustrative preview</span>
        All figures and project activity on this screen are illustrative preview data.
      </p>
    </div>
  );
}
