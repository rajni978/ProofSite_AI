"use client";

import type { KeyboardEvent } from "react";

function getTabId(prefix: string, value: string): string {
  return `${prefix}-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export interface DashboardTab {
  value: string;
  label: string;
  count?: number;
}

export function Tabs({
  tabs,
  value,
  onChange,
  label,
  idPrefix,
}: {
  tabs: DashboardTab[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  idPrefix: string;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = tabs.findIndex((tab) => tab.value === value);
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    onChange(nextTab.value);
    document.getElementById(getTabId(idPrefix, nextTab.value))?.focus();
  }

  return (
    <div className="dashboard-tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <button
          type="button"
          role="tab"
          id={getTabId(idPrefix, tab.value)}
          aria-selected={value === tab.value}
          aria-controls={`${idPrefix}-panel`}
          tabIndex={value === tab.value ? 0 : -1}
          className="dashboard-tab"
          key={tab.value}
          onClick={() => onChange(tab.value)}
          onKeyDown={handleKeyDown}
        >
          {tab.label}
          {tab.count !== undefined && <span>{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}
