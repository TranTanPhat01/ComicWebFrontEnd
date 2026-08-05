import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { timeAgo, translateText } from "@/lib/utils";
import type { PublicStoryListItemDto } from "../types/public-story.types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface StoryCardProps {
  story: PublicStoryListItemDto;
  badge?: "NEW" | "FULL" | null;
}

export function StoryCard({ story, badge }: StoryCardProps) {
  const detailUrl = ROUTES.storyDetail(story.slug);
  const coverUrl = story.coverUrl || null;
  const chapterCount = story.chapterCount ?? 0;

  return (
    <article className="story-card">
      <Link href={detailUrl} className="story-card__link">
        <div className="story-card__cover-wrapper">
          <ImageWithFallback
            src={coverUrl}
            alt={story.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="story-card__cover-image"
            priority={false}
          />
          {badge && (
            <span className={`story-card__badge story-card__badge--${badge.toLowerCase()}`}>
              {badge === "NEW" ? "MỚI" : badge === "FULL" ? "TRỌN BỘ" : badge}
            </span>
          )}
        </div>
        <div className="story-card__metadata">
          <h3 className="story-card__title" title={translateText(story.title)}>
            {translateText(story.title)}
          </h3>
          <div className="story-card__details">
            <span className="story-card__chapter">
              {chapterCount > 0 ? `Ch. ${chapterCount}` : "Chưa có chương"}
            </span>
            <span className="story-card__updated">
              {story.updatedAt ? timeAgo(story.updatedAt) : "Đang cập nhật"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default StoryCard;
