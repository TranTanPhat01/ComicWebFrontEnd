"use client";

import React from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import type { PublicStoryDetailDto, PublicStoryListItemDto } from "../types/public-story.types";
import { useBookmarks } from "../hooks/use-bookmarks";

interface StoryDetailHeroProps {
  story: PublicStoryDetailDto;
  firstChapterSlug: string | null;
  latestChapterSlug: string | null;
}

export function StoryDetailHero({
  story,
  firstChapterSlug,
  latestChapterSlug,
}: StoryDetailHeroProps) {
  const hasChapters = !!firstChapterSlug;
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const followed = isBookmarked(story.id);

  // Format statistics
  const formattedViews = new Intl.NumberFormat("vi-VN").format(story.viewCount);
  const formattedDate = new Date(story.updatedAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleFollowClick = () => {
    const listItemStory: PublicStoryListItemDto = {
      id: story.id,
      title: story.title,
      slug: story.slug,
      coverImageUrl: story.coverImageUrl,
      description: story.description,
      authorName: story.authorName,
      status: story.status,
      genres: story.genres,
      totalChapters: story.totalChapters,
      viewCount: story.viewCount,
      updatedAt: story.updatedAt,
    };
    toggleBookmark(listItemStory);
  };

  return (
    <div className="story-detail-hero">
      {/* Background Blur Cover */}
      <div className="story-detail-hero__bg-wrapper">
        <ImageWithFallback
          src={story.coverImageUrl}
          alt={story.title}
          fill
          priority
          sizes="100vw"
          className="story-detail-hero__bg-image"
          fallbackText={story.title}
        />
        <div className="story-detail-hero__bg-overlay" />
      </div>

      {/* Main Content Card Container */}
      <div className="story-detail-hero__content-container">
        {/* Cover image card */}
        <div className="story-detail-hero__cover-card">
          <div className="story-detail-hero__cover-wrapper">
            <ImageWithFallback
              src={story.coverImageUrl}
              alt={story.title}
              fill
              priority
              sizes="(max-width: 768px) 150px, 220px"
              className="story-detail-hero__cover-image"
              fallbackText={story.title}
            />
          </div>
        </div>

        {/* Text info block */}
        <div className="story-detail-hero__info">
          <div className="story-detail-hero__status-row">
            <span className={`story-detail-hero__status-badge story-detail-hero__status-badge--${story.status.toLowerCase()}`}>
              {story.status === "Ongoing" ? "Đang tiến hành" : 
               story.status === "Completed" ? "Đã hoàn thành" : 
               story.status === "Hiatus" ? "Tạm ngưng" : "Đã hủy"}
            </span>
          </div>

          <h1 className="story-detail-hero__title">{story.title}</h1>

          {/* Author/Artist */}
          <div className="story-detail-hero__meta-row">
            <span className="story-detail-hero__meta-item">
              <strong>Tác giả:</strong> {story.authorName || "Đang cập nhật"}
            </span>
            {story.artistName && (
              <span className="story-detail-hero__meta-item">
                <strong>Họa sĩ:</strong> {story.artistName}
              </span>
            )}
          </div>

          {/* Genres / Tags */}
          {story.genres && story.genres.length > 0 && (
            <div className="story-detail-hero__genres">
              {story.genres.map((genre) => (
                <Link
                  key={genre}
                  href={`/?genre=${encodeURIComponent(genre)}`}
                  className="story-detail-hero__genre-tag"
                >
                  {genre}
                </Link>
              ))}
            </div>
          )}

          {/* Fast Stats */}
          <div className="story-detail-hero__stats">
            <div className="story-detail-hero__stat-item">
              <span className="story-detail-hero__stat-value">{story.totalChapters}</span>
              <span className="story-detail-hero__stat-label">Chương</span>
            </div>
            <div className="story-detail-hero__stat-item">
              <span className="story-detail-hero__stat-value">{formattedViews}</span>
              <span className="story-detail-hero__stat-label">Lượt xem</span>
            </div>
            <div className="story-detail-hero__stat-item">
              <span className="story-detail-hero__stat-value">{formattedDate}</span>
              <span className="story-detail-hero__stat-label">Cập nhật</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="story-detail-hero__actions">
            {hasChapters && firstChapterSlug ? (
              <Link
                href={`/truyen/${story.slug}/chuong/${firstChapterSlug}`}
                className="story-detail-hero__btn story-detail-hero__btn--primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ĐỌC TỪ ĐẦU
              </Link>
            ) : (
              <button
                disabled
                className="story-detail-hero__btn story-detail-hero__btn--primary story-detail-hero__btn--disabled"
              >
                CHƯA CÓ CHƯƠNG
              </button>
            )}

            {hasChapters && latestChapterSlug ? (
              <Link
                href={`/truyen/${story.slug}/chuong/${latestChapterSlug}`}
                className="story-detail-hero__btn story-detail-hero__btn--secondary"
              >
                MỚI NHẤT
              </Link>
            ) : (
              <button
                disabled
                className="story-detail-hero__btn story-detail-hero__btn--secondary story-detail-hero__btn--disabled"
              >
                CHƯA CÓ CHƯƠNG
              </button>
            )}

            <button
              onClick={handleFollowClick}
              className={`story-detail-hero__btn story-detail-hero__btn--outline ${followed ? "story-detail-hero__btn--followed" : ""}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={followed ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {followed ? "ĐÃ THEO DÕI" : "THEO DÕI"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryDetailHero;

