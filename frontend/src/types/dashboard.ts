import type { UserRole } from "./auth";

export type DashboardIconName =
  | "overview"
  | "projects"
  | "subcontractors"
  | "workers"
  | "attendance"
  | "safety"
  | "reports"
  | "verification"
  | "milestones"
  | "payments"
  | "analytics"
  | "settings"
  | "tasks"
  | "checkin";

export interface NavigationItem {
  label: string;
  section: string | null;
  icon: DashboardIconName;
}

export interface DashboardStat {
  label: string;
  value: string;
  change?: string;
  tone?: "positive" | "warning" | "neutral";
  icon: DashboardIconName;
}

export type ProjectStatus = "On track" | "At risk" | "Completed";

export interface ProjectPreview {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  progress: number;
  subcontractors: number;
  completionDate: string;
  initials: string;
  accent: "blue" | "teal" | "amber";
}

export type VerificationStatus = "Verified" | "Flagged" | "Needs review" | "Incomplete";

export interface VerificationSummary {
  label: string;
  count: number;
  status: VerificationStatus;
}

export interface VerificationQueueItem {
  id: string;
  title: string;
  project: string;
  submittedBy: string;
  age: string;
  status: VerificationStatus;
}

export interface AttendanceTrendPoint {
  label: string;
  attendance: number;
}

export interface AttendanceOverview {
  onsite: number;
  scheduled: number;
  trend: AttendanceTrendPoint[];
}

export interface WorkerSafetyItem {
  id: string;
  label: string;
  complete: boolean;
}

export interface ActivityPreview {
  id: string;
  title: string;
  detail: string;
  time: string;
  icon: DashboardIconName;
  tone: "blue" | "teal" | "amber" | "navy";
}

export interface PendingActionPreview {
  id: string;
  title: string;
  project: string;
  age: string;
  kind: "safety" | "milestone" | "payment";
}

export interface WorkerAttendancePreview {
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Verified" | "Pending";
}

export interface WorkerTaskPreview {
  id: string;
  title: string;
  project: string;
  due: string;
  status: "In progress" | "To do";
}

export interface DashboardPreviewData {
  adminStats: DashboardStat[];
  projects: ProjectPreview[];
  verifications: VerificationSummary[];
  verificationQueue: VerificationQueueItem[];
  attendanceOverview: AttendanceOverview;
  activities: ActivityPreview[];
  pendingActions: PendingActionPreview[];
  workerAttendance: WorkerAttendancePreview[];
  workerTasks: WorkerTaskPreview[];
  workerSafetyItems: WorkerSafetyItem[];
  workerProject: ProjectPreview;
  workerSafetyComplete: number;
  workerSafetyTotal: number;
}

export interface RoleDashboardProps {
  role: UserRole;
  fullName: string;
}
