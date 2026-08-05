import React from "react";
import { StoryGridSkeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="search-page">
      <div className="container" style={{ padding: "var(--space-8) var(--space-6)" }}>
        {/* Skeleton Breadcrumbs */}
        <div className="skeleton-breadcrumbs skeleton-shimmer" style={{ width: "240px", height: "16px", marginBottom: "var(--space-6)" }} />

        {/* Section Header */}
        <header className="search-page__header" style={{ marginBottom: "var(--space-8)" }}>
          <div className="skeleton-shimmer" style={{ width: "200px", height: "32px", marginBottom: "var(--space-2)" }} />
          <div className="skeleton-shimmer" style={{ width: "350px", height: "16px" }} />
        </header>

        {/* Search Input Skeleton */}
        <div className="skeleton-shimmer" style={{ width: "100%", height: "56px", borderRadius: "var(--radius-xl)", marginBottom: "var(--space-6)" }} />

        {/* Filters Group Skeleton */}
        <div className="search-page__filters" style={{ padding: "var(--space-5)", background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-xl)", marginBottom: "var(--space-8)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <div className="skeleton-shimmer" style={{ width: "120px", height: "16px", marginBottom: "var(--space-2)" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer" style={{ width: "80px", height: "32px", borderRadius: "var(--radius-full)" }} />
              ))}
            </div>
          </div>
          <div>
            <div className="skeleton-shimmer" style={{ width: "120px", height: "16px", marginBottom: "var(--space-2)" }} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer" style={{ width: "90px", height: "32px", borderRadius: "var(--radius-full)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Grid count placeholder */}
        <div className="skeleton-shimmer" style={{ width: "180px", height: "18px", marginBottom: "var(--space-6)" }} />

        {/* Story Grid Skeleton */}
        <StoryGridSkeleton count={8} />
      </div>
    </div>
  );
}
