"use client";

import { ErrorState } from "@/components/feedback/error-state";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root error boundary.
 * Must be a Client Component.
 */
export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error("[RootError]", error);
  }, [error]);

  return (
    <ErrorState
      title="Đã xảy ra lỗi không mong muốn"
      message={error.message ?? "Vui lòng tải lại trang."}
      onRetry={reset}
    />
  );
}
