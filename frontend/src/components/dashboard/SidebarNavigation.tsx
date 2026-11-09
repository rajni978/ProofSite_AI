"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavigation, dashboardPath } from "@/config/dashboard-navigation";
import { DashboardIcon } from "./DashboardIcon";
import type { UserRole } from "@/types/auth";

export function SidebarNavigation({
  role,
  collapsed,
  onNavigate,
}: {
  role: UserRole;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const basePath = `/dashboard/${role.toLowerCase()}`;

  return (
    <nav className="sidebar-navigation" aria-label={`${role.toLowerCase()} dashboard`}>
      <span className="sidebar-section-label">
        {collapsed ? <span className="sidebar-section-rule" /> : "WORKSPACE"}
      </span>
      {dashboardNavigation[role].map((item) => {
        const href = dashboardPath(role, item.section);
        const active =
          item.section === null
            ? pathname === basePath
            : pathname === `${basePath}/${item.section}` ||
              pathname.startsWith(`${basePath}/${item.section}/`);

        return (
          <Link
            key={item.label}
            href={href}
            className={`sidebar-link${active ? " is-active" : ""}${collapsed ? " is-collapsed" : ""}`}
            aria-current={active ? "page" : undefined}
            title={collapsed ? item.label : undefined}
            onClick={onNavigate}
          >
            <DashboardIcon name={item.icon} />
            <span className="sidebar-link-label">{item.label}</span>
            {active && <span className="sidebar-active-mark" />}
          </Link>
        );
      })}
    </nav>
  );
}
