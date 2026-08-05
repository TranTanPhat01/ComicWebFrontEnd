import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { getPublicStories } from "../api/public-stories.api";
import { StoryGrid } from "./story-grid";
import { env } from "@/lib/env";
import { DEMO_STORIES } from "../demo/demo-stories";

import { parsePaginatedEnvelope } from "@/lib/api/parse-envelope";
import type { PublicStoryListItemDto } from "../types/public-story.types";

export async function CompletedStoriesSection() {
  let completedStories: PublicStoryListItemDto[] = [];

  const response = await getPublicStories({
    status: "Completed",
    pageSize: 10,
  });

  let hasData = false;

  if (response.success && response.data) {
    const items = parsePaginatedEnvelope<PublicStoryListItemDto>(response.data).items;
    completedStories = items.filter((s) => s.status === "Completed");

    if (completedStories.length > 0) {
      hasData = true;
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
        <Link href={ROUTES.completed} className="section-header__link">
          Xem tất cả &rsaquo;
        </Link>
      </div>

      <StoryGrid stories={displayStories} badgeType="FULL" />
    </section>
  );
}

export default CompletedStoriesSection;
