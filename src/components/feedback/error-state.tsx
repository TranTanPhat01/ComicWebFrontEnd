import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  className?: string;
  onRetry?: () => void;
}

/**
 * Generic error state component.
 * Used in error.tsx and when API calls fail.
 */
export function ErrorState({
  title = "Đã xảy ra lỗi",
  message = "Vui lòng thử lại sau.",
  className,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={cn("error-state", className)} role="alert">
      <div className="error-state__icon" aria-hidden="true" style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-4)" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ width: "4rem", height: "4rem", color: "var(--color-error, #ef4444)" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="error-state__title">{title}</h2>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="error-state__retry-btn"
          type="button"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
