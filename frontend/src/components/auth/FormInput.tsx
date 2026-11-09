import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  trailing?: React.ReactNode;
}

export function FormInput({
  label,
  error,
  hint,
  trailing,
  className,
  id,
  ...inputProps
}: FormInputProps) {
  const inputId = id ?? inputProps.name;
  const messageId = `${inputId}-message`;

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={inputId}>
        {label}
      </label>
      <div className="input-wrap">
        <input
          {...inputProps}
          id={inputId}
          className={`form-input${trailing ? " has-trailing" : ""}${className ? ` ${className}` : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? messageId : undefined}
        />
        {trailing}
      </div>
      {(error || hint) && (
        <p id={messageId} className={error ? "field-hint form-field-error" : "field-hint"}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
