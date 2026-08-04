import type React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
  action?: React.ReactNode;
}

/**
 * Generic empty state component.
 * Shown when a list returns zero results.
 */
export function EmptyState({
  title = "Không có dữ liệu",
  message = "Chưa có nội dung nào để hiển thị.",
  className,
  action,
}: EmptyStateProps) {
  return (
    <div className={cn("empty-state", className)}>
      <div className="empty-state__icon" aria-hidden="true" style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-4)" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ width: "3.5rem", height: "3.5rem", color: "var(--color-text-muted)" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.5A2.25 2.25 0 0 1 19.5 21h-15a2.25 2.25 0 0 1-2.25-2.25v-4.5a2.25 2.25 0 0 1 2.25-2.25m-18-9a2.25 2.25 0 0 1 2.25-2.25h15A2.25 2.25 0 0 1 21.75 6v6.75A2.25 2.25 0 0 1 19.5 15h-15a2.25 2.25 0 0 1-2.25-2.25V4.5z" />
        </svg>
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
