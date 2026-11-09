import type { SVGProps } from "react";
import type { DashboardIconName } from "@/types/dashboard";

const iconPaths: Record<DashboardIconName, string> = {
  overview: "M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 13h7v8H3z",
  projects: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M8 9h.01M12 9h.01M16 9h.01",
  subcontractors: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6",
  workers: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM16 3.2a4 4 0 010 7.6M22 21v-2a4 4 0 00-3-3.87",
  attendance: "M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 011 1v14H4V6a1 1 0 011-1zM8 14l2.5 2.5L16 11",
  safety: "M12 3 19 6v5.2c0 4.2-2.8 7.3-7 9.3-4.2-2-7-5.1-7-9.3V6l7-3zM9 12l2 2 4-4",
  reports: "M6 2h9l5 5v15H6a2 2 0 01-2-2V4a2 2 0 012-2zM14 2v6h6M8 13h8M8 17h8M8 9h2",
  verification: "M12 3 19 6v5.2c0 4.2-2.8 7.3-7 9.3-4.2-2-7-5.1-7-9.3V6l7-3zM8.5 12l2.2 2.2 4.8-4.8",
  milestones: "M4 20V4M5 5h13l-2.5 3L18 11H5M4 20h16",
  payments: "M3 6h18v13H3zM3 10h18M7 15h4M7 3h10",
  analytics: "M3 3v18h18M7 14l4-4 3 3 6-7M18 6h2v2",
  settings: "M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM19.4 15a1.7 1.7 0 00.34 1.87l.06.06-1.7 2.94-.08-.02a1.7 1.7 0 00-1.78.54l-.05.07h-3.4l-.05-.07a1.7 1.7 0 00-1.78-.54l-.08.02-1.7-2.94.06-.06A1.7 1.7 0 009.6 15l-.09-.04v-3.4l.09-.04a1.7 1.7 0 00-.34-1.87l-.06-.06 1.7-2.94.08.02a1.7 1.7 0 001.78-.54l.05-.07h3.4l.05.07a1.7 1.7 0 001.78.54l.08-.02 1.7 2.94-.06.06A1.7 1.7 0 0019.4 11l.09.04v3.4l-.09.56z",
  tasks: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  checkin: "M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12zM12 9a2 2 0 100 4 2 2 0 000-4z",
};

interface DashboardIconProps extends SVGProps<SVGSVGElement> {
  name: DashboardIconName;
}

export function DashboardIcon({
  name,
  ...props
}: DashboardIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
