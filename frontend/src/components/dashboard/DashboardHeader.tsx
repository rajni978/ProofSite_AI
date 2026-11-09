import { NotificationButton } from "./NotificationButton";
import { UserProfileMenu } from "./UserProfileMenu";
import type { AuthUser } from "@/types/auth";

export function DashboardHeader({
  user,
  title,
  onMenuClick,
  menuOpen,
}: {
  user: AuthUser;
  title: string;
  onMenuClick: () => void;
  menuOpen: boolean;
}) {
  return (
    <header className="dashboard-header">
      <div className="header-title-group">
        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          aria-controls="dashboard-sidebar"
          onClick={onMenuClick}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
        <div>
          <span className="header-breadcrumb">Workspace</span>
          <h1 className="header-title">{title}</h1>
        </div>
      </div>
      <div className="header-actions">
        <NotificationButton />
        <span className="header-divider" />
        <UserProfileMenu user={user} />
      </div>
    </header>
  );
}
