import React from "react";

export default function HotLoading() {
  return (
    <div className="hot-stories-page">
      <div className="container" style={{ padding: "var(--space-8) var(--space-6)" }}>
        {/* Skeleton Breadcrumbs */}
        <div className="skeleton-breadcrumbs skeleton-shimmer" style={{ width: "240px", height: "16px", marginBottom: "var(--space-6)" }} />

        {/* Section Header */}
        <header className="list-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-8)" }}>
          <div>
            <div className="skeleton-shimmer" style={{ width: "220px", height: "32px", marginBottom: "var(--space-2)" }} />
            <div className="skeleton-shimmer" style={{ width: "350px", height: "16px" }} />
          </div>
          <div className="skeleton-shimmer" style={{ width: "120px", height: "38px", borderRadius: "var(--radius-full)" }} />
        </header>

        {/* Hot List Rows */}
        <div className="hot-stories-list" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="hot-story-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                padding: "var(--space-4)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "var(--radius-xl)"
              }}
            >
              {/* Rank number box */}
              <div className="skeleton-shimmer" style={{ width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0 }} />
              {/* Cover image */}
              <div className="skeleton-shimmer" style={{ width: "55px", height: "75px", borderRadius: "var(--radius-md)", flexShrink: 0 }} />
              
              {/* Info block */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div className="skeleton-shimmer" style={{ width: "40%", height: "20px" }} />
                <div className="skeleton-shimmer" style={{ width: "25%", height: "14px" }} />
              </div>

              {/* Views */}
              <div className="skeleton-shimmer" style={{ width: "80px", height: "20px", borderRadius: "var(--radius-sm)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
