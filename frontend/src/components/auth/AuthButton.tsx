"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { logout as logoutService } from "@/services/auth.service";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingLabel?: string;
  logoutAction?: boolean;
  variant?: "primary" | "quiet";
}

export function AuthButton({
  children,
  loading = false,
  loadingLabel = "Please wait...",
  logoutAction = false,
  variant = "primary",
  className,
  onClick,
  disabled,
  type,
  ...props
}: AuthButtonProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const busy = loading || loggingOut;

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (logoutAction) {
      event.preventDefault();
      setLoggingOut(true);
      setLogoutError(false);
      try {
        await logoutService();
        router.replace("/login");
        router.refresh();
      } catch {
        setLogoutError(true);
        setLoggingOut(false);
      }
    }
  }

  return (
    <>
      <button
        {...props}
        type={type ?? (logoutAction ? "button" : "submit")}
        className={`auth-button${variant === "quiet" ? " logout-button" : ""}${className ? ` ${className}` : ""}`}
        disabled={disabled || busy}
        aria-busy={busy}
        onClick={handleClick}
      >
        {busy && <span className="spinner" aria-hidden="true" />}
        {busy ? (logoutAction ? "Signing out..." : loadingLabel) : children}
      </button>
      {logoutError && (
        <span className="field-hint" role="alert">
          Could not sign out. Please try again.
        </span>
      )}
    </>
  );
}
