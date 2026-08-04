import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { timeAgo } from "@/lib/utils";
import type { PublicStoryListItemDto } from "../types/public-story.types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface StoryCardProps {
  story: PublicStoryListItemDto;
  badge?: "NEW" | "FULL" | null;
}

export function StoryCard({ story, badge }: StoryCardProps) {
  const detailUrl = ROUTES.storyDetail(story.slug);

  return (
    <article className="story-card">
      <Link href={detailUrl} className="story-card__link">
        <div className="story-card__cover-wrapper">
          <ImageWithFallback
            src={story.coverImageUrl}
            alt={story.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="story-card__cover-image"
            priority={false}
          />
          {badge && (
            <span className={`story-card__badge story-card__badge--${badge.toLowerCase()}`}>
              {badge}
            </span>
          )}
        </div>
        <div className="story-card__metadata">
          <h3 className="story-card__title" title={story.title}>
            {story.title}
          </h3>
          <div className="story-card__details">
            <span className="story-card__chapter">
              {story.totalChapters > 0 ? `Ch. ${story.totalChapters}` : "Chưa có chương"}
            </span>
            <span className="story-card__updated">
              {timeAgo(story.updatedAt)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default StoryCard;
