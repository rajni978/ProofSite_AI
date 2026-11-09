import type { ProjectStatus, VerificationStatus } from "@/types/dashboard";

type BadgeStatus = ProjectStatus | VerificationStatus | "In progress" | "To do" | "Pending";

export function StatusBadge({ status }: { status: BadgeStatus }) {
  const className = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-badge status-${className}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}
