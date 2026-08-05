import React from "react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorState } from "@/components/feedback/error-state";
import { StoryDetailHero } from "./story-detail-hero";
import { StoryDescription } from "./story-description";
import { StoryInfoSidebar } from "./story-info-sidebar";
import { ChapterList } from "@/features/public-chapters/components/chapter-list";
import { env } from "@/lib/env";
import type { PublicStoryDetailDto } from "../types/public-story.types";
import type { PublicChapterListItemDto } from "@/features/public-chapters/types/public-chapter.types";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";

interface StoryDetailScreenProps {
  story: PublicStoryDetailDto;
  chaptersResponse: ApiResponse<PaginatedResponse<PublicChapterListItemDto>>;
  currentPage: number;
  currentSort: string;
  now: number;
}

export function StoryDetailScreen({
  story,
  chaptersResponse,
  currentPage,
  currentSort,
  now,
}: StoryDetailScreenProps) {
  const isFallbackMode = env.isDevelopment && (typeof story.id === "string" ? (story.id as string).startsWith("demo-story") : story.id <= 7);

  // Extract chapters list and paginated metadata
  let chaptersList: PublicChapterListItemDto[] = [];
  let totalChaptersCount = 0;
  let totalPages = 1;

  if (chaptersResponse.success && chaptersResponse.data) {
    const rawData = chaptersResponse.data as unknown;
    if (rawData && typeof rawData === "object") {
      if ("data" in rawData && Array.isArray((rawData as { data: unknown }).data)) {
        const payload = rawData as { data: PublicChapterListItemDto[]; meta?: { totalItems?: number; totalPages?: number } };
        chaptersList = payload.data;
        totalChaptersCount = payload.meta?.totalItems || chaptersList.length;
        totalPages = payload.meta?.totalPages || 1;
      } else if ("items" in rawData) {
        const paginated = rawData as { items: unknown[]; totalCount?: number; totalPages?: number };
        if (Array.isArray(paginated.items)) {
          chaptersList = paginated.items as PublicChapterListItemDto[];
          totalChaptersCount = paginated.totalCount || chaptersList.length;
          totalPages = paginated.totalPages || 1;
        }
      }
    } else if (Array.isArray(rawData)) {
      chaptersList = rawData as PublicChapterListItemDto[];
      totalChaptersCount = chaptersList.length;
      totalPages = 1;
    }
  }

  // Resolve reading buttons slugs
  let firstChapterSlug: string | null = null;
  let latestChapterSlug: string | null = null;

  if (isFallbackMode) {
    firstChapterSlug = "chuong-1";
    latestChapterSlug = `chuong-${totalChaptersCount}`;
  } else if (chaptersList.length > 0) {
    if (currentSort === "asc") {
      firstChapterSlug = chaptersList[0].slug;
      if (totalChaptersCount <= chaptersList.length) {
        latestChapterSlug = chaptersList[chaptersList.length - 1].slug;
      } else {
        latestChapterSlug = `chuong-${totalChaptersCount}`;
      }
    } else {
      latestChapterSlug = chaptersList[0].slug;
      if (totalChaptersCount <= chaptersList.length) {
        firstChapterSlug = chaptersList[chaptersList.length - 1].slug;
      } else {
        firstChapterSlug = "chuong-1";
      }
    }
  }

  return (
    <div className="story-detail-screen">
      {/* Breadcrumbs Navigation */}
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Truyện", url: "/" },
            { label: story.title },
          ]}
        />
      </div>

      {/* Story Detail Header Hero */}
      <StoryDetailHero
        story={story}
        firstChapterSlug={firstChapterSlug}
        latestChapterSlug={latestChapterSlug}
      />

      {/* Main Screen Layout Grid */}
      <div className="story-detail-screen__container container">
        {/* Offline Fallback Warning Box */}
        {isFallbackMode && (
          <div className="fallback-notice-box" role="alert" style={{ gridColumn: "1 / -1", marginTop: "0" }}>
            <div className="fallback-notice-box__icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="fallback-notice-box__content">
              <h4 className="fallback-notice-box__title">Chế độ Ngoại tuyến (Offline Fallback Mode)</h4>
              <p className="fallback-notice-box__desc">
                Không thể kết nối tới ComicWeb API tại <code>{env.apiBaseUrl}</code>. Đang hiển thị thông tin truyện và danh sách chương mô phỏng từ bộ ảnh demo của bạn.
              </p>
            </div>
          </div>
        )}

        <div className="story-detail-screen__main">
          {/* Synopsis Description */}
          <StoryDescription description={story.description} />

          {/* Chapter List Section */}
          {!chaptersResponse.success && !isFallbackMode ? (
            <div className="chapter-list-error">
              <ErrorState
                title="Không thể tải danh sách chương"
                message={chaptersResponse.error.message}
              />
            </div>
          ) : (
            <ChapterList
              chapters={chaptersList}
              totalCount={totalChaptersCount}
              currentPage={currentPage}
              totalPages={totalPages}
              currentSort={currentSort}
              storySlug={story.slug}
              now={now}
            />
          )}
        </div>

        {/* Right side info sidebar */}
        <aside className="story-detail-screen__sidebar">
          <StoryInfoSidebar story={story} />
        </aside>
      </div>
    </div>
  );
}

export default StoryDetailScreen;
