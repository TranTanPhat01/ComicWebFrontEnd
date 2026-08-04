"use client";

/**
 * Root provider wrapper.
 * Add context providers here as the app grows (e.g., React Query, Theme).
 * Keep this thin — no business logic.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
