import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";
import type { UserRole } from "@/types/auth";
import { roleLabels } from "@/config/dashboard-navigation";
import { DashboardIcon } from "./DashboardIcon";

const roleDescriptions: Record<Exclude<UserRole, "ADMIN" | "WORKER">, string> = {
  SUBCONTRACTOR: "A focused view of your project commitments, field teams, and payment request workflow.",
  SUPERVISOR: "A field-ready view for reviewing attendance, safety checks, and daily progress.",
};

export function RoleOverview({
  role,
  fullName,
}: {
  role: Exclude<UserRole, "ADMIN" | "WORKER">;
  fullName: string;
}) {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  return (
    <div className="dashboard-overview role-overview">
      <PageHeader
        eyebrow={roleLabels[role]}
        title={`Good morning, ${firstName}`}
        description={roleDescriptions[role]}
      />
      <div className="role-overview-banner">
        <span className="role-banner-icon">
          <DashboardIcon name={role === "SUBCONTRACTOR" ? "projects" : "verification"} />
        </span>
        <div>
          <strong>Your workspace is ready</strong>
          <p>This overview is a preview. Live project records and workflow actions are not connected yet.</p>
        </div>
        <span className="sample-pill">Preview</span>
      </div>
      <div className="role-overview-empty-grid">
        <section className="dashboard-panel">
          <h2 className="section-title">
            {role === "SUBCONTRACTOR" ? "My projects" : "Assigned projects"}
          </h2>
          <EmptyState
            title="Project data will appear here"
            description="Project assignments will be shown when the project API is connected."
            icon={<DashboardIcon name="projects" />}
          />
        </section>
        <section className="dashboard-panel">
          <h2 className="section-title">
            {role === "SUBCONTRACTOR" ? "Payment requests" : "Verification tasks"}
          </h2>
          <EmptyState
            title="No live items to show"
            description="This preview does not create or submit any records."
            icon={<DashboardIcon name={role === "SUBCONTRACTOR" ? "payments" : "verification"} />}
          />
        </section>
      </div>
    </div>
  );
}
