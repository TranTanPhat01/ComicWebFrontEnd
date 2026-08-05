import React from "react";
import { StoryGridSkeleton } from "@/components/ui/skeleton";

export default function NewUpdatesLoading() {
  return (
    <div className="new-updates-page">
      <div className="container" style={{ padding: "var(--space-8) var(--space-6)" }}>
        {/* Skeleton Breadcrumbs */}
        <div className="skeleton-breadcrumbs skeleton-shimmer" style={{ width: "240px", height: "16px", marginBottom: "var(--space-6)" }} />

        {/* Section Header */}
        <header className="list-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-6)" }}>
          <div>
            <div className="skeleton-shimmer" style={{ width: "260px", height: "32px", marginBottom: "var(--space-2)" }} />
            <div className="skeleton-shimmer" style={{ width: "380px", height: "16px" }} />
          </div>
          {/* Count Badge */}
          <div className="skeleton-shimmer" style={{ width: "120px", height: "38px", borderRadius: "var(--radius-full)" }} />
        </header>

        {/* Story Grid Skeleton */}
        <StoryGridSkeleton count={12} />
      </div>
    </div>
  );
}
