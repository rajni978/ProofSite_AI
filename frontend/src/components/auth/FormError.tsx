export function FormError({ message }: { message: string }) {
  return (
    <div className="form-error" role="alert">
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4.5M10 13.5h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
