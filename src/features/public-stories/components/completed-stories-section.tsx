import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { getPublicStories } from "../api/public-stories.api";
import { StoryGrid } from "./story-grid";
import { env } from "@/lib/env";
import { DEMO_STORIES } from "../demo/demo-stories";

export async function CompletedStoriesSection() {
  let completedStories: typeof DEMO_STORIES = [];

  const response = await getPublicStories({
    status: "Completed",
    pageSize: 10,
  });

  let hasData = false;

  if (response.success && response.data) {
    const rawData = response.data as unknown;
    if (rawData && typeof rawData === "object") {
      if ("data" in rawData && Array.isArray((rawData as { data: unknown }).data)) {
        const payload = rawData as { data: unknown[] };
        completedStories = payload.data as typeof DEMO_STORIES;
      } else if ("items" in rawData) {
        const paginated = rawData as { items: unknown[] };
        if (Array.isArray(paginated.items)) {
          completedStories = paginated.items as typeof DEMO_STORIES;
        }
      }
    } else if (Array.isArray(rawData)) {
      completedStories = rawData as typeof DEMO_STORIES;
    }

    if (completedStories.length > 0) {
      hasData = true;
      // In case backend status filter is not working/supported yet:
      const hasCompleted = completedStories.some(s => s.status === "Completed");
      if (!hasCompleted) {
        completedStories = completedStories.filter((s) => s.status === "Completed");
      }
    }
  }

  // Fallback to local high-fidelity demo stories in development mode when connection fails OR database is empty
  if (!hasData) {
    if (env.isDevelopment) {
      completedStories = DEMO_STORIES.filter((s) => s.status === "Completed");
    } else {
      return null; // Gracefully hide if backend fails in production
    }
  }

  // Display max 5 or 6 stories
  const displayStories = completedStories.slice(0, 5);

  if (displayStories.length === 0) {
    return null; // Hide section if no completed stories are found
  }

  return (
    <section className="completed-stories-section" aria-label="Truyện đã hoàn thành">
      <div className="section-header">
        <h2 className="section-title section-title--completed">
          <svg
            className="section-title__icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          TRUYỆN HOÀN THÀNH
        </h2>
        <Link href={ROUTES.home} className="section-header__link">
          Xem tất cả &rsaquo;
        </Link>
      </div>

      <StoryGrid stories={displayStories} badgeType="FULL" />
    </section>
  );
}

export default CompletedStoriesSection;
