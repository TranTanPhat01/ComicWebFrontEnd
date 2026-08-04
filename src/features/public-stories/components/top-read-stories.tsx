import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import type { PublicStoryListItemDto } from "../types/public-story.types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface TopReadStoriesProps {
  stories: PublicStoryListItemDto[];
}

function getPlaceholderGenres(slug: string): string[] {
  const normalized = slug.toLowerCase();
  if (normalized.includes("toan-chuc-phap-su")) {
    return ["Huyền Huyễn", "Đô Thị"];
  }
  if (normalized.includes("dau-pha-thuong-khung")) {
    return ["Tiên Hiệp", "Huyền Huyễn"];
  }
  if (normalized.includes("than-an-vuong-toa")) {
    return ["Huyền Huyễn", "Đấu Khí"];
  }
  if (normalized.includes("vo-luyen-dinh-phong")) {
    return ["Huyền Huyễn", "Tu Chân"];
  }
  if (normalized.includes("mot-minh-ta-dau")) {
    return ["Huyền Huyễn", "Hệ Thống"];
  }
  return ["Hành Động", "Kịch Tính"];
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(0) + "K";
  }
  return String(views);
}

export function TopReadStories({ stories }: TopReadStoriesProps) {
  // Sort stories by viewCount desc, take top 5
  const topStories = [...stories]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  if (topStories.length === 0) {
    return null;
  }

  return (
    <section className="top-read" aria-label="Top truyện đọc nhiều">
      <div className="section-header">
        <h2 className="section-title">
          TOP TRUYỆN ĐỌC NHIỀU
        </h2>
        <Link href={ROUTES.home} className="section-header__link">
          Xem tất cả &rsaquo;
        </Link>
      </div>

      <ol className="top-read__list">
        {topStories.map((story, index) => {
          const rank = index + 1;
          const genres = getPlaceholderGenres(story.slug);
          return (
            <li key={story.id} className="top-read-item">
              <span className={`top-read-item__rank top-read-item__rank--${rank}`}>
                {rank}
              </span>
              <Link href={ROUTES.storyDetail(story.slug)} className="top-read-item__cover-link">
                <div className="top-read-item__cover-wrapper">
                  <ImageWithFallback
                    src={story.coverImageUrl}
                    alt={story.title}
                    fill
                    sizes="80px"
                    className="top-read-item__cover-img"
                  />
                </div>
              </Link>
              <div className="top-read-item__info">
                <h3 className="top-read-item__title">
                  <Link href={ROUTES.storyDetail(story.slug)} className="top-read-item__title-link">
                    {story.title}
                  </Link>
                </h3>
                <div className="top-read-item__tags">
                  {genres.slice(0, 2).map((g) => (
                    <span key={g} className="top-read-item__tag">
                      {g}
                    </span>
                  ))}
                </div>
                <div className="top-read-item__meta">
                  <span className="top-read-item__chapter">
                    Ch. {story.totalChapters}
                  </span>
                  <span className="top-read-item__views" title={`${story.viewCount} lượt xem`}>
                    🔥 {formatViews(story.viewCount)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default TopReadStories;
