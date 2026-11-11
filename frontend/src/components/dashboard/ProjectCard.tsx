import type { ProjectPreview } from "@/types/dashboard";
import { StatusBadge } from "./StatusBadge";

export function ProjectCard({
  project,
  onOpen,
  expanded,
  detailsId,
}: {
  project: ProjectPreview;
  onOpen?: () => void;
  expanded?: boolean;
  detailsId?: string;
}) {
  return (
    <article className={`project-card${onOpen ? " is-interactive" : ""}`}>
      <div className="project-card-heading">
        <span className={`project-avatar project-avatar-${project.accent}`}>
          {project.initials}
        </span>
        <StatusBadge status={project.status} />
      </div>
      <h3 className="project-name">{project.name}</h3>
      <p className="project-location">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
          <path d="M13 6.7c0 3.8-5 7.5-5 7.5S3 10.5 3 6.7a5 5 0 1110 0zM8 8.5a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
        {project.location}
      </p>
      <div className="project-progress-heading">
        <span>Project progress</span>
        <strong>{project.progress}%</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={`${project.name} progress`}
        aria-valuenow={project.progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className={`progress-fill progress-fill-${project.accent}`} style={{ width: `${project.progress}%` }} />
      </div>
      <div className="project-card-footer">
        <span>{project.subcontractors} subcontractors</span>
        <span>Due {project.completionDate}</span>
      </div>
      {onOpen && (
        <button
          type="button"
          className="project-open-button"
          onClick={onOpen}
          aria-expanded={expanded}
          aria-controls={detailsId}
        >
          {expanded ? "Hide project details" : "View project details"}
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
            <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </article>
  );
}
