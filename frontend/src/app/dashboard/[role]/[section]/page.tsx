import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { getNavigationItem } from "@/config/dashboard-navigation";
import { getServerCurrentUser } from "@/lib/auth-proxy";

export default async function DashboardSectionPage({
  params,
}: {
  params: Promise<{ role: string; section: string }>;
}) {
  const [{ role: requestedRole, section }, user] = await Promise.all([
    params,
    getServerCurrentUser(),
  ]);
  if (!user) redirect("/login");

  const rolePath = user.role.toLowerCase();
  if (requestedRole !== rolePath) {
    redirect(`/dashboard/${rolePath}`);
  }

  const navigationItem = getNavigationItem(user.role, section);
  if (!navigationItem || !navigationItem.section) {
    redirect(`/dashboard/${rolePath}`);
  }

  return (
    <DashboardLayout user={user} title={navigationItem.label}>
      <div className="dashboard-overview placeholder-page">
        <PageHeader
          eyebrow="Workspace"
          title={navigationItem.label}
          description="This area is part of your role-specific workspace."
        />
        <section className="dashboard-panel placeholder-panel">
          <EmptyState
            title="This workspace is getting ready"
            description="This section is a navigation preview. No project records or workflow actions are connected yet."
            icon={<DashboardIcon name={navigationItem.icon} />}
          />
          <p className="preview-data-note">
            Your account role is checked on the server for this route. Backend permissions remain authoritative for future data and actions.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
