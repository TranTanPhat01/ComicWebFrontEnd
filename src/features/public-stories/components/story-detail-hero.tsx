"use client";

import React from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { translateText } from "@/lib/utils";
import type { PublicStoryDetailDto, PublicStoryListItemDto } from "../types/public-story.types";
import { useBookmarks } from "../hooks/use-bookmarks";
import { useToast } from "@/providers/toast-provider";
import { useReadingHistory } from "@/features/public-chapters/hooks/use-reading-history";
import { StarRating } from "./star-rating";

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
  const { toast } = useToast();
  const { toggleBookmark, isBookmarked } = useBookmarks({
    onToast: (message, variant) => toast(message, variant),
  });
  const { getEntry } = useReadingHistory();
  const followed = isBookmarked(story.id);
  const readingEntry = getEntry(story.slug);

  // Format statistics
  const formattedDate = story.updatedAt
    ? new Date(story.updatedAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "Đang cập nhật";

  const handleFollowClick = () => {
    const listItemStory: PublicStoryListItemDto = {
      id: story.id,
      title: story.title,
      slug: story.slug,
      coverUrl: story.coverUrl,
      description: story.description,
      authorName: story.authorName,
      status: story.status,
      genres: story.genres,
      chapterCount: story.chapters?.length ?? 0,
      latestChapter: null,
      publishedAt: story.publishedAt,
      updatedAt: story.updatedAt,
    };
    toggleBookmark(listItemStory);
  };

  const coverUrl = story.coverUrl || null;
  const chapterCount = story.chapters?.length ?? 0;

  return (
    <div className="story-detail-hero">
      {/* Background Blur Cover */}
      <div className="story-detail-hero__bg-wrapper">
        <ImageWithFallback
          src={coverUrl}
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
              src={coverUrl}
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
              {(story.status as string) === "Ongoing" || (story.status as string) === "Published" ? "Đang tiến hành" : 
               (story.status as string) === "Completed" ? "Đã hoàn thành" : 
               (story.status as string) === "Hiatus" ? "Tạm ngưng" : "Đã hủy"}
            </span>
          </div>

          <h1 className="story-detail-hero__title">{translateText(story.title)}</h1>

          {/* Author/Artist */}
          <div className="story-detail-hero__meta-row">
            <span className="story-detail-hero__meta-item">
              <strong>Tác giả:</strong> {story.authorName || "Đang cập nhật"}
            </span>
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
              <span className="story-detail-hero__stat-value">{chapterCount}</span>
              <span className="story-detail-hero__stat-label">Chương</span>
            </div>
            <div className="story-detail-hero__stat-item">
              <span className="story-detail-hero__stat-value">
                {(story.viewCount ?? 0) >= 1000 ? `${((story.viewCount ?? 0) / 1000).toFixed(1)}k` : (story.viewCount ?? 0)}
              </span>
              <span className="story-detail-hero__stat-label">Lượt xem</span>
            </div>
            <div className="story-detail-hero__stat-item">
              <span className="story-detail-hero__stat-value">{formattedDate}</span>
              <span className="story-detail-hero__stat-label">Cập nhật</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="story-detail-hero__actions">
            {/* Continue Reading button — shows when user has history for this story */}
            {readingEntry && (
              <Link
                href={`/truyen/${story.slug}?chuong-id=${readingEntry.chapterSlug}`}
                className="story-detail-hero__btn story-detail-hero__btn--continue"
                title={`Tiếp tục đọc: Chương ${readingEntry.chapterNumber}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ĐỌC TIẾP CH.{readingEntry.chapterNumber}
              </Link>
            )}

            {hasChapters && firstChapterSlug ? (
              <Link
                href={`/truyen/${story.slug}?chuong-id=${firstChapterSlug}`}
                className="story-detail-hero__btn story-detail-hero__btn--primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ĐỌC NGAY
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
                href={`/truyen/${story.slug}?chuong-id=${latestChapterSlug}`}
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

            {/* Share buttons */}
            <div className="story-detail-hero__share">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href).then(() =>
                    toast("Đã sao chép link truyện!", "success")
                  );
                }}
                className="story-detail-hero__share-btn"
                title="Sao chép link"
                aria-label="Sao chép link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="story-detail-hero__share-btn story-detail-hero__share-btn--fb"
                title="Chia sẻ Facebook"
                aria-label="Chia sẻ Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(story.title + ' - Đọc truyện tranh online tại ComicWeb')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="story-detail-hero__share-btn story-detail-hero__share-btn--tw"
                title="Chia sẻ Twitter/X"
                aria-label="Chia sẻ Twitter/X"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryDetailHero;

