"use client";

import { useState } from "react";
import { FormInput } from "./FormInput";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  error?: string;
  required?: boolean;
}

export function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete,
  error,
  required = true,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FormInput
      id={id}
      name={name}
      label={label}
      type={visible ? "text" : "password"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoComplete={autoComplete}
      required={required}
      error={error}
      trailing={
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
              <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M9.9 5.2A10.7 10.7 0 0112 5c5.4 0 9 5.2 9 7a8.6 8.6 0 01-2.2 3.4M6.2 6.3C3.9 7.8 3 10.5 3 12c0 1.8 3.6 7 9 7 1.1 0 2.1-.2 3-.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
              <path d="M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          )}
        </button>
      }
    />
  );
}
