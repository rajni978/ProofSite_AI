"use client";

import { useCallback, useMemo, useState } from "react";
import { dashboardPreviewData } from "@/data/dashboard-mock-data";
import type {
  ProjectPreview,
  VerificationQueueItem,
  VerificationStatus,
} from "@/types/dashboard";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { DashboardIcon } from "./DashboardIcon";
import { DataTable } from "./DataTable";
import { EmptyState } from "./EmptyState";
import { FilterDropdown } from "./FilterDropdown";
import { ProjectCard } from "./ProjectCard";
import { SearchInput } from "./SearchInput";
import { StatCard } from "./StatCard";
import { StatusBadge } from "./StatusBadge";
import { Tabs } from "./Tabs";
import { Toast } from "./Toast";

const verificationStyles: Record<VerificationStatus, string> = {
  Verified: "verification-verified",
  Flagged: "verification-flagged",
  "Needs review": "verification-review",
  Incomplete: "verification-incomplete",
};

const actionIcons = {
  safety: "safety",
  milestone: "milestones",
  payment: "payments",
} as const;

const verificationTabs: VerificationStatus[] = [
  "Needs review",
  "Flagged",
  "Incomplete",
  "Verified",
];

export function AdminOverview({ fullName }: { fullName: string }) {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatus, setProjectStatus] = useState("All statuses");
  const [activeVerification, setActiveVerification] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ProjectPreview | null>(null);
  const [selectedReview, setSelectedReview] = useState<VerificationQueueItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();
    return dashboardPreviewData.projects.filter((project) => {
      const matchesSearch = !query ||
        `${project.name} ${project.location}`.toLowerCase().includes(query);
      const matchesStatus = projectStatus === "All statuses" || project.status === projectStatus;
      return matchesSearch && matchesStatus;
    });
  }, [projectSearch, projectStatus]);

  const filteredVerifications = activeVerification === "All"
    ? dashboardPreviewData.verificationQueue
    : dashboardPreviewData.verificationQueue.filter((item) => item.status === activeVerification);

  const verificationTabItems = [
    { value: "All", label: "All", count: dashboardPreviewData.verificationQueue.length },
    ...verificationTabs.map((status) => ({
      value: status,
      label: status,
      count: dashboardPreviewData.verificationQueue.filter((item) => item.status === status).length,
    })),
  ];

  const dismissToast = useCallback(() => setToastMessage(null), []);
  const closeReview = useCallback(() => setSelectedReview(null), []);
  const confirmReviewPreview = useCallback(() => {
    setSelectedReview(null);
    setToastMessage("Preview only — no verification record was changed.");
  }, []);

  const verificationColumns = [
    {
      key: "submission",
      header: "Submission",
      cell: (item: VerificationQueueItem) => (
        <div className="table-primary-copy">
          <strong>{item.title}</strong>
          <span>{item.project}</span>
        </div>
      ),
    },
    {
      key: "submitted-by",
      header: "Submitted by",
      cell: (item: VerificationQueueItem) => item.submittedBy,
    },
    {
      key: "status",
      header: "Status",
      cell: (item: VerificationQueueItem) => <StatusBadge status={item.status} />,
    },
    {
      key: "age",
      header: "Received",
      cell: (item: VerificationQueueItem) => item.age,
    },
    {
      key: "action",
      header: "Action",
      cell: (item: VerificationQueueItem) => (
        <button
          type="button"
          className="table-action"
          onClick={() => setSelectedReview(item)}
          aria-label={`Open preview for ${item.title}`}
        >
          Preview
        </button>
      ),
    },
  ];

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
          <span className="sample-pill">Preview data</span>
        </div>
        <div className="project-toolbar">
          <SearchInput
            value={projectSearch}
            onChange={setProjectSearch}
            label="Search projects"
            placeholder="Search projects or locations"
          />
          <FilterDropdown
            label="Filter projects by status"
            value={projectStatus}
            onChange={setProjectStatus}
            options={[
              { value: "All statuses", label: "All statuses" },
              { value: "On track", label: "On track" },
              { value: "At risk", label: "At risk" },
              { value: "Completed", label: "Completed" },
            ]}
          />
        </div>
        {filteredProjects.length ? (
          <div className="project-grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="dashboard-panel">
            <EmptyState
              title="No projects match those filters"
              description="Try a different search or status. These results use illustrative preview data."
              icon={<DashboardIcon name="projects" />}
            />
          </div>
        )}
      </section>

      {selectedProject && (
        <section className="dashboard-panel project-detail-panel" aria-live="polite">
          <div className="panel-heading-row">
            <div>
              <p className="page-eyebrow">Project preview · sample data</p>
              <h2 className="section-title">{selectedProject.name}</h2>
              <p className="section-caption">{selectedProject.location}</p>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Close project details"
              onClick={() => setSelectedProject(null)}
            >
              <svg viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="project-detail-grid">
            <div><span>Status</span><StatusBadge status={selectedProject.status} /></div>
            <div><span>Progress</span><strong>{selectedProject.progress}%</strong></div>
            <div><span>Subcontractors</span><strong>{selectedProject.subcontractors}</strong></div>
            <div><span>Target completion</span><strong>{selectedProject.completionDate}</strong></div>
          </div>
          <p className="preview-note">Illustrative project details only. No live project record is connected.</p>
        </section>
      )}

      <div className="admin-analytics-grid">
        <section className="dashboard-panel" aria-labelledby="verification-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="verification-heading" className="section-title">Verification center</h2>
              <p className="section-caption">Sample submissions by review status</p>
            </div>
            <span className="panel-icon"><DashboardIcon name="verification" /></span>
          </div>
          <div className="verification-total">
            <strong>157</strong>
            <span>submissions this period <em>· sample</em></span>
          </div>
          <div className="verification-bar" role="img" aria-label="Sample verification distribution: 128 verified, 6 flagged, 9 need review, 14 incomplete">
            {dashboardPreviewData.verifications.map((item) => (
              <span
                key={item.status}
                className={verificationStyles[item.status]}
                style={{ width: `${(item.count / 157) * 100}%` }}
              />
            ))}
          </div>
          <div className="verification-legend">
            {dashboardPreviewData.verifications.map((item) => (
              <span key={item.status}>
                <i className={`verification-dot ${verificationStyles[item.status]}`} />
                {item.label} <strong>{item.count}</strong>
              </span>
            ))}
          </div>
          <Tabs
            tabs={verificationTabItems}
            value={activeVerification}
            onChange={setActiveVerification}
            label="Filter verification submissions"
            idPrefix="verification-tab"
          />
          <div
            id="verification-tab-panel"
            className="verification-table-panel"
            role="tabpanel"
            aria-labelledby={`verification-tab-${activeVerification.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            tabIndex={0}
          >
            {filteredVerifications.length ? (
              <DataTable
                columns={verificationColumns}
                rows={filteredVerifications}
                getRowKey={(item) => item.id}
                label="Verification submission preview queue"
              />
            ) : (
              <EmptyState
                title="No sample submissions in this category"
                description="Choose another verification tab to view the available preview records."
                icon={<DashboardIcon name="verification" />}
              />
            )}
          </div>
        </section>

        <section className="dashboard-panel attendance-analytics-panel" aria-labelledby="attendance-analytics-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="attendance-analytics-heading" className="section-title">Attendance overview</h2>
              <p className="section-caption">Portfolio attendance · illustrative sample</p>
            </div>
            <span className="panel-icon"><DashboardIcon name="attendance" /></span>
          </div>
          <div className="attendance-summary">
            <strong>{dashboardPreviewData.attendanceOverview.onsite}</strong>
            <span>of {dashboardPreviewData.attendanceOverview.scheduled} scheduled workers</span>
            <StatusBadge status="Verified" />
          </div>
          <p className="attendance-rate">
            {Math.round((dashboardPreviewData.attendanceOverview.onsite / dashboardPreviewData.attendanceOverview.scheduled) * 100)}%
            <span> checked in today · sample</span>
          </p>
          <div className="attendance-chart" role="img" aria-label="Illustrative weekly attendance: Monday 91%, Tuesday 94%, Wednesday 88%, Thursday 96%, Friday 92%, Saturday 76%, Sunday no data">
            {dashboardPreviewData.attendanceOverview.trend.map((point) => (
              <div className="attendance-chart-column" key={point.label}>
                <span className="attendance-chart-value">{point.attendance ? `${point.attendance}%` : "—"}</span>
                <div className="attendance-chart-track">
                  <span style={{ height: `${point.attendance}%` }} />
                </div>
                <span className="attendance-chart-label">{point.label}</span>
              </div>
            ))}
          </div>
          <p className="preview-note">No live attendance or worker location is shown.</p>
        </section>
      </div>

      <section className="dashboard-panel performance-panel" aria-labelledby="performance-heading">
        <div className="panel-heading-row">
          <div>
            <h2 id="performance-heading" className="section-title">Project performance</h2>
            <p className="section-caption">Illustrative completion progress across active projects</p>
          </div>
          <span className="sample-pill">Sample metrics</span>
        </div>
        <div className="performance-list">
          {dashboardPreviewData.projects.map((project) => (
            <div className="performance-row" key={project.id}>
              <div className="performance-project">
                <span className={`project-avatar project-avatar-${project.accent}`}>{project.initials}</span>
                <div><strong>{project.name}</strong><span>{project.location}</span></div>
              </div>
              <div
                className="performance-progress"
                role="progressbar"
                aria-label={`${project.name} completion`}
                aria-valuenow={project.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className={`progress-fill progress-fill-${project.accent}`} style={{ width: `${project.progress}%` }} />
              </div>
              <strong className="performance-percentage">{project.progress}%</strong>
              <StatusBadge status={project.status} />
            </div>
          ))}
        </div>
      </section>

      <div className="overview-two-column">
        <section className="dashboard-panel" aria-labelledby="pending-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="pending-heading" className="section-title">Pending actions</h2>
              <p className="section-caption">Items that may need your attention · sample</p>
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
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-panel activity-panel" aria-labelledby="activity-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="activity-heading" className="section-title">Recent activity</h2>
              <p className="section-caption">Latest updates from sample site activity</p>
            </div>
            <span className="sample-pill">Preview</span>
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
      </div>
      <p className="dashboard-disclaimer">
        <span className="sample-pill">Illustrative preview</span>
        All figures, queue items, and project activity on this screen are sample data.
      </p>
      <ConfirmationDialog
        open={selectedReview !== null}
        title="Verification preview"
        description={selectedReview
          ? `${selectedReview.title} from ${selectedReview.submittedBy} (${selectedReview.project}) is sample data. Review actions are not connected, and nothing will be approved or changed.`
          : ""}
        confirmLabel="Understood"
        onConfirm={confirmReviewPreview}
        onClose={closeReview}
      />
      {toastMessage && <Toast message={toastMessage} onDismiss={dismissToast} />}
    </div>
  );
}
