import type { NavigationItem } from "@/types/dashboard";
import type { UserRole } from "@/types/auth";

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Main contractor",
  SUBCONTRACTOR: "Subcontractor",
  SUPERVISOR: "Supervisor",
  WORKER: "Worker",
};

export const dashboardNavigation: Record<UserRole, NavigationItem[]> = {
  ADMIN: [
    { label: "Overview", section: null, icon: "overview" },
    { label: "Projects", section: "projects", icon: "projects" },
    { label: "Subcontractors", section: "subcontractors", icon: "subcontractors" },
    { label: "Workers", section: "workers", icon: "workers" },
    { label: "Attendance", section: "attendance", icon: "attendance" },
    { label: "Safety Verification", section: "safety-verification", icon: "safety" },
    { label: "Daily Reports", section: "daily-reports", icon: "reports" },
    { label: "AI Verification Center", section: "ai-verification", icon: "verification" },
    { label: "Milestones", section: "milestones", icon: "milestones" },
    { label: "Payments", section: "payments", icon: "payments" },
    { label: "Analytics", section: "analytics", icon: "analytics" },
    { label: "Settings", section: "settings", icon: "settings" },
  ],
  SUBCONTRACTOR: [
    { label: "Overview", section: null, icon: "overview" },
    { label: "My Projects", section: "my-projects", icon: "projects" },
    { label: "Workers", section: "workers", icon: "workers" },
    { label: "Attendance", section: "attendance", icon: "attendance" },
    { label: "Daily Reports", section: "daily-reports", icon: "reports" },
    { label: "Milestones", section: "milestones", icon: "milestones" },
    { label: "Payment Requests", section: "payment-requests", icon: "payments" },
    { label: "Settings", section: "settings", icon: "settings" },
  ],
  SUPERVISOR: [
    { label: "Overview", section: null, icon: "overview" },
    { label: "Assigned Projects", section: "assigned-projects", icon: "projects" },
    { label: "Attendance Review", section: "attendance-review", icon: "attendance" },
    { label: "Safety Inspections", section: "safety-inspections", icon: "safety" },
    { label: "Progress Reports", section: "progress-reports", icon: "reports" },
    { label: "Verification Tasks", section: "verification-tasks", icon: "verification" },
    { label: "Settings", section: "settings", icon: "settings" },
  ],
  WORKER: [
    { label: "Overview", section: null, icon: "overview" },
    { label: "My Attendance", section: "my-attendance", icon: "attendance" },
    { label: "Site Check-in", section: "site-check-in", icon: "checkin" },
    { label: "Safety Checklist", section: "safety-checklist", icon: "safety" },
    { label: "My Tasks", section: "my-tasks", icon: "tasks" },
    { label: "Settings", section: "settings", icon: "settings" },
  ],
};

export function dashboardPath(role: UserRole, section: string | null): string {
  const root = `/dashboard/${role.toLowerCase()}`;
  return section ? `${root}/${section}` : root;
}

export function getNavigationItem(
  role: UserRole,
  section: string | undefined,
): NavigationItem | undefined {
  return dashboardNavigation[role].find((item) => item.section === (section ?? null));
}
