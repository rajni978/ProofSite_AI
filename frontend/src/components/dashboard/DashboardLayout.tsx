"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { AuthUser } from "@/types/auth";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({
  user,
  title,
  children,
}: {
  user: AuthUser;
  title: string;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  return (
    <div className={`dashboard-app${collapsed ? " sidebar-is-collapsed" : ""}`}>
      <DashboardSidebar
        user={user}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed((value) => !value)}
        onClose={() => setMobileOpen(false)}
      />
      <div className="dashboard-main">
        <DashboardHeader
          user={user}
          title={title}
          onMenuClick={() => setMobileOpen(true)}
          menuOpen={mobileOpen}
        />
        <main className="dashboard-page-content">{children}</main>
      </div>
    </div>
  );
}
