"use client";

import Link from "next/link";
import type { AuthUser } from "@/types/auth";
import { roleLabels } from "@/config/dashboard-navigation";
import { SidebarNavigation } from "./SidebarNavigation";
import { UserProfileMenu } from "./UserProfileMenu";

function BrandMark() {
  return (
    <span className="dashboard-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="23" height="23" fill="none">
        <path d="M4.5 18.5V9.2L12 5l7.5 4.2v9.3H4.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 18.5v-5h6v5M7.5 10.5h.01M12 10.5h.01M16.5 10.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="m15.7 7.1 1.4 1.4 2.6-2.7" stroke="#13a89e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function DashboardSidebar({
  user,
  collapsed,
  mobileOpen,
  onToggle,
  onClose,
}: {
  user: AuthUser;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={onClose}
        />
      )}
      <aside
        id="dashboard-sidebar"
        className={`dashboard-sidebar${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
        aria-label={`${roleLabels[user.role]} navigation`}
      >
        <div className="sidebar-brand-row">
          <Link className="dashboard-brand" href={`/dashboard/${user.role.toLowerCase()}`} onClick={onClose}>
            <BrandMark />
            <span className="dashboard-brand-name">
              ProofSite <strong>AI</strong>
            </span>
          </Link>
          <button
            className="sidebar-collapse-button"
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
              <path d={collapsed ? "M7 4l6 6-6 6" : "M13 4l-6 6 6 6"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="sidebar-mobile-close"
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className={`sidebar-role-chip${collapsed ? " is-collapsed" : ""}`}>
          <span className="sidebar-role-dot" />
          <span>{roleLabels[user.role]} workspace</span>
        </div>
        <SidebarNavigation
          role={user.role}
          collapsed={collapsed}
          onNavigate={onClose}
        />
        <div className="sidebar-profile">
          <UserProfileMenu user={user} compact={collapsed} showLogout />
        </div>
      </aside>
    </>
  );
}
