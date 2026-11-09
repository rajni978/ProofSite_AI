import { AuthButton } from "@/components/auth/AuthButton";
import type { AuthUser } from "@/types/auth";
import { roleLabels } from "@/config/dashboard-navigation";

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserProfileMenu({
  user,
  compact = false,
  showLogout = false,
}: {
  user: AuthUser;
  compact?: boolean;
  showLogout?: boolean;
}) {
  return (
    <div className={`profile-menu${compact ? " profile-menu-compact" : ""}`}>
      <div className="user-avatar" aria-hidden="true">
        {getInitials(user.fullName)}
      </div>
      <div className="profile-copy">
        <span className="profile-name">{user.fullName}</span>
        <span className="profile-role">{roleLabels[user.role]}</span>
      </div>
      {showLogout && (
        <AuthButton variant="quiet" logoutAction aria-label="Sign out of ProofSite AI">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
            <path d="M10 17l5-5-5-5M15 12H3M14 3h5a2 2 0 012 2v14a2 2 0 01-2 2h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </AuthButton>
      )}
    </div>
  );
}
