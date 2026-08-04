import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * Generic loading state component.
 * Used as fallback in Suspense boundaries.
 */
export function LoadingState({
  message = "Đang tải...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn("loading-state", className)}
      role="status"
      aria-label={message}
    >
      <div className="loading-state__spinner" aria-hidden="true" />
      <p className="loading-state__message">{message}</p>
    </div>
  );
}
