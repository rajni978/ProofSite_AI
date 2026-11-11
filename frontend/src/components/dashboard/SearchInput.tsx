"use client";

export function SearchInput({
  value,
  onChange,
  label = "Search",
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}) {
  return (
    <label className="dashboard-search">
      <span className="sr-only">{label}</span>
      <svg viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
        <circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" strokeWidth="1.6" />
        <path d="m13.2 13.2 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
