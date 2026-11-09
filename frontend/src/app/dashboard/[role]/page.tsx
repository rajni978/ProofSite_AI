import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerCurrentUser } from "@/lib/auth-proxy";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminOverview } from "@/components/dashboard/AdminOverview";
import { WorkerOverview } from "@/components/dashboard/WorkerOverview";
import { RoleOverview } from "@/components/dashboard/RoleOverview";

const roleTitles: Record<string, string> = {
  ADMIN: "Administrator",
  SUBCONTRACTOR: "Subcontractor",
  SUPERVISOR: "Supervisor",
  WORKER: "Worker",
};

export const metadata: Metadata = {
  title: "Workspace",
};

export default async function RoleWorkspacePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const [{ role: requestedRole }, user] = await Promise.all([
    params,
    getServerCurrentUser(),
  ]);
  if (!user) redirect("/login");

  const userRolePath = user.role.toLowerCase();
  if (requestedRole !== userRolePath) {
    redirect(`/dashboard/${userRolePath}`);
  }

  const roleTitle = roleTitles[user.role];
  if (!roleTitle) redirect("/dashboard");

  return (
    <DashboardLayout user={user} title="Overview">
      {user.role === "ADMIN" ? (
        <AdminOverview fullName={user.fullName} />
      ) : user.role === "WORKER" ? (
        <WorkerOverview fullName={user.fullName} />
      ) : (
        <RoleOverview role={user.role} fullName={user.fullName} />
      )}
    </DashboardLayout>
  );
}
