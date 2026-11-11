"use client";

import { useEffect, useRef } from "react";
import { DashboardIcon } from "./DashboardIcon";

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = "Got it",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      className="dashboard-dialog"
      ref={dialogRef}
      aria-labelledby="dashboard-dialog-title"
      aria-describedby="dashboard-dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
    >
      <div className="dialog-content">
        <span className="dialog-icon" aria-hidden="true">
          <DashboardIcon name="verification" />
        </span>
        <h2 id="dashboard-dialog-title">{title}</h2>
        <p id="dashboard-dialog-description">{description}</p>
        <div className="dialog-actions">
          <button type="button" className="button-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
