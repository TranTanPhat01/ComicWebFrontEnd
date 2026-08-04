import React from "react";
import type { PublicStoryListItemDto } from "../types/public-story.types";
import { StoryCard } from "./story-card";

interface StoryGridProps {
  stories: PublicStoryListItemDto[];
  badgeType?: "NEW" | "FULL" | null;
}

export function StoryGrid({ stories, badgeType }: StoryGridProps) {
  return (
    <div className="story-grid">
      {stories.map((story, index) => (
        <div
          key={story.id}
          className="stagger-card-wrapper"
          style={{ "--stagger-index": index } as React.CSSProperties}
        >
          <StoryCard story={story} badge={badgeType} />
        </div>
      ))}
    </div>
  );
}

export default StoryGrid;
