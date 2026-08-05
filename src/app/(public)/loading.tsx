import React from "react";
import { HeroSkeleton, StoryGridSkeleton } from "@/components/ui/skeleton";

export default function PublicHomeLoading() {
  return (
    <div className="public-home-loading" style={{ padding: "var(--space-6) 0 var(--space-12)" }}>
      {/* Skeleton Hero section */}
      <div className="container" style={{ marginBottom: "var(--space-8)" }}>
        <HeroSkeleton />
      </div>

      {/* Story grids section */}
      <div className="container">
        {/* Recommended list section skeleton */}
        <section style={{ marginBottom: "var(--space-10)" }}>
          <div className="section-header">
            <div className="skeleton-shimmer" style={{ width: "200px", height: "24px" }} />
            <div className="skeleton-shimmer" style={{ width: "80px", height: "16px" }} />
          </div>
          <StoryGridSkeleton count={6} />
        </section>

        {/* New updates list section skeleton */}
        <section>
          <div className="section-header">
            <div className="skeleton-shimmer" style={{ width: "220px", height: "24px" }} />
            <div className="skeleton-shimmer" style={{ width: "80px", height: "16px" }} />
          </div>
          <StoryGridSkeleton count={6} />
        </section>
      </div>
    </div>
  );
}
