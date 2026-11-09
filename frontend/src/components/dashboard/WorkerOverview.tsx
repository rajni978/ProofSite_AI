import Link from "next/link";
import { dashboardPreviewData } from "@/data/dashboard-mock-data";
import { DashboardIcon } from "./DashboardIcon";
import { ProjectCard } from "./ProjectCard";
import { StatusBadge } from "./StatusBadge";

export function WorkerOverview({ fullName }: { fullName: string }) {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";
  const todayAttendance = dashboardPreviewData.workerAttendance[0];

  return (
    <div className="dashboard-overview worker-overview">
      <div className="overview-welcome worker-welcome">
        <div>
          <p className="preview-label">
            <span />
            Worker workspace · sample data
          </p>
          <h2>Good morning, {firstName}</h2>
          <p>Your day at Riverside Commercial Tower, at a glance.</p>
        </div>
        <div className="attendance-status-card">
          <span className="attendance-status-icon">
            <DashboardIcon name="attendance" />
          </span>
          <span className="attendance-status-copy">
            <span>Today&apos;s attendance</span>
            <strong>Checked in · {todayAttendance.checkIn}</strong>
            <em>Sample status · not live</em>
          </span>
          <StatusBadge status={todayAttendance.status} />
        </div>
      </div>
      <div className="worker-checkin-action">
        <p>Need to record a site visit?</p>
        <Link href="/dashboard/worker/site-check-in">
          Open site check-in
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="worker-overview-grid">
        <section className="dashboard-panel worker-project-panel" aria-labelledby="assigned-project-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="assigned-project-heading" className="section-title">Assigned project</h2>
              <p className="section-caption">Your current site assignment</p>
            </div>
            <span className="sample-pill">Sample</span>
          </div>
          <ProjectCard project={dashboardPreviewData.workerProject} />
        </section>

        <section className="dashboard-panel safety-checklist-panel" aria-labelledby="safety-checklist-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="safety-checklist-heading" className="section-title">Safety checklist</h2>
              <p className="section-caption">Daily site-readiness preview</p>
            </div>
            <span className="safety-shield">
              <DashboardIcon name="safety" />
            </span>
          </div>
          <div className="safety-score">
            <strong>{dashboardPreviewData.workerSafetyComplete}/{dashboardPreviewData.workerSafetyTotal}</strong>
            <span>items marked complete <em>· sample</em></span>
          </div>
          <div className="progress-track safety-progress">
            <span
              className="progress-fill progress-fill-teal"
              style={{ width: `${(dashboardPreviewData.workerSafetyComplete / dashboardPreviewData.workerSafetyTotal) * 100}%` }}
            />
          </div>
          <ul className="safety-checklist">
            {["Hard hat and high-visibility vest", "Eye and hand protection", "Work area hazard review"].map((item, index) => (
              <li key={item}>
                <span className={index < 2 ? "checklist-check is-complete" : "checklist-check"}>
                  {index < 2 ? "✓" : ""}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="preview-note">Checklist preview only. No safety records have been submitted.</p>
        </section>
      </div>

      <div className="worker-overview-grid worker-lower-grid">
        <section className="dashboard-panel" aria-labelledby="attendance-history-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="attendance-history-heading" className="section-title">Recent attendance</h2>
              <p className="section-caption">Recent site activity · sample history</p>
            </div>
          </div>
          <div className="compact-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">In</th>
                  <th scope="col">Out</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardPreviewData.workerAttendance.map((entry) => (
                  <tr key={entry.date}>
                    <td>{entry.date}</td>
                    <td>{entry.checkIn}</td>
                    <td>{entry.checkOut}</td>
                    <td><StatusBadge status={entry.status === "Verified" ? "Verified" : "Pending"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-panel" aria-labelledby="tasks-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="tasks-heading" className="section-title">Assigned tasks</h2>
              <p className="section-caption">Work items · sample preview</p>
            </div>
            <span className="sample-pill">Preview</span>
          </div>
          <div className="worker-task-list">
            {dashboardPreviewData.workerTasks.map((task) => (
              <article className="worker-task" key={task.id}>
                <span className="task-marker" />
                <div className="worker-task-copy">
                  <h3>{task.title}</h3>
                  <p>{task.project} <span>·</span> Due {task.due}</p>
                </div>
                <StatusBadge status={task.status} />
              </article>
            ))}
          </div>
        </section>
      </div>
      <p className="dashboard-disclaimer">
        Dashboard previews are illustrative only. Attendance, project, safety, and task records are not connected to live data.
      </p>
    </div>
  );
}
