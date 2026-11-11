"use client";

import { useCallback, useState } from "react";
import { dashboardPreviewData } from "@/data/dashboard-mock-data";
import type { WorkerAttendancePreview, WorkerTaskPreview } from "@/types/dashboard";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { DashboardIcon } from "./DashboardIcon";
import { DataTable } from "./DataTable";
import { ProjectCard } from "./ProjectCard";
import { StatusBadge } from "./StatusBadge";
import { Toast } from "./Toast";

interface DialogContent {
  title: string;
  description: string;
}

export function WorkerOverview({ fullName }: { fullName: string }) {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";
  const todayAttendance = dashboardPreviewData.workerAttendance[0];
  const [dialog, setDialog] = useState<DialogContent | null>(null);
  const [projectDetailsOpen, setProjectDetailsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dismissToast = useCallback(() => setToastMessage(null), []);
  const closeDialog = useCallback(() => setDialog(null), []);
  const acknowledgePreview = useCallback(() => {
    setDialog(null);
    setToastMessage("Preview only — no attendance or task record was saved.");
  }, []);

  const attendanceColumns = [
    { key: "date", header: "Date", cell: (entry: WorkerAttendancePreview) => entry.date },
    { key: "in", header: "In", cell: (entry: WorkerAttendancePreview) => entry.checkIn },
    { key: "out", header: "Out", cell: (entry: WorkerAttendancePreview) => entry.checkOut },
    {
      key: "status",
      header: "Status",
      cell: (entry: WorkerAttendancePreview) => (
        <StatusBadge status={entry.status === "Verified" ? "Verified" : "Pending"} />
      ),
    },
  ];

  function showTaskDetails(task: WorkerTaskPreview) {
    setDialog({
      title: "Task details preview",
      description: `${task.title} for ${task.project}, due ${task.due}. This is illustrative task data; task updates are not connected.`,
    });
  }

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
            <span>Today&apos;s attendance · sample</span>
            <strong>Checked in · {todayAttendance.checkIn}</strong>
            <em>Preview status · not live</em>
          </span>
          <StatusBadge status={todayAttendance.status} />
        </div>
      </div>

      <section className="worker-checkin-card" aria-labelledby="worker-checkin-heading">
        <span className="worker-checkin-icon"><DashboardIcon name="checkin" /></span>
        <div className="worker-checkin-copy">
          <p className="page-eyebrow">Field action preview</p>
          <h2 id="worker-checkin-heading">Ready for your site check-in?</h2>
          <p>Check-in is not connected yet. No GPS location or attendance record will be collected.</p>
        </div>
        <button
          type="button"
          className="button-primary"
          onClick={() => setDialog({
            title: "Site check-in is not connected",
            description: "This control is a UI preview only. It will not request GPS access or create an attendance record.",
          })}
        >
          Preview check-in
          <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
            <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      <div className="worker-overview-grid">
        <section className="dashboard-panel worker-project-panel" aria-labelledby="assigned-project-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="assigned-project-heading" className="section-title">Assigned project</h2>
              <p className="section-caption">Your current site assignment · sample</p>
            </div>
            <span className="sample-pill">Preview</span>
          </div>
          <ProjectCard
            project={dashboardPreviewData.workerProject}
            onOpen={() => setProjectDetailsOpen((open) => !open)}
            expanded={projectDetailsOpen}
            detailsId="worker-project-details"
          />
          <div
            id="worker-project-details"
            className="worker-project-details"
            aria-live="polite"
            hidden={!projectDetailsOpen}
          >
            <div><span>Location</span><strong>{dashboardPreviewData.workerProject.location}</strong></div>
            <div><span>Project progress</span><strong>{dashboardPreviewData.workerProject.progress}%</strong></div>
            <div><span>Target completion</span><strong>{dashboardPreviewData.workerProject.completionDate}</strong></div>
            <p className="preview-note">Assignment details are illustrative only.</p>
          </div>
        </section>

        <section className="dashboard-panel safety-checklist-panel" aria-labelledby="safety-checklist-heading">
          <div className="panel-heading-row">
            <div>
              <h2 id="safety-checklist-heading" className="section-title">Safety checklist</h2>
              <p className="section-caption">Daily site-readiness preview</p>
            </div>
            <span className="safety-shield"><DashboardIcon name="safety" /></span>
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
            {dashboardPreviewData.workerSafetyItems.map((item) => (
              <li key={item.id}>
                <span className={`checklist-check${item.complete ? " is-complete" : ""}`}>
                  {item.complete && (
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
                      <path d="m3 8 3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span>{item.label}</span>
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
          <DataTable
            columns={attendanceColumns}
            rows={dashboardPreviewData.workerAttendance}
            getRowKey={(entry) => entry.date}
            label="Worker attendance preview history"
          />
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
                <button
                  type="button"
                  className="table-action"
                  onClick={() => showTaskDetails(task)}
                  aria-label={`View task details for ${task.title}`}
                >
                  Details
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
      <p className="dashboard-disclaimer">
        Attendance, project, safety, and task records are illustrative; no live action is connected.
      </p>
      <ConfirmationDialog
        open={dialog !== null}
        title={dialog?.title ?? ""}
        description={dialog?.description ?? ""}
        confirmLabel="Understood"
        onConfirm={acknowledgePreview}
        onClose={closeDialog}
      />
      {toastMessage && <Toast message={toastMessage} onDismiss={dismissToast} />}
    </div>
  );
}
