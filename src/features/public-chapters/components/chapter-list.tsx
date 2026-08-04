import React from "react";
import { ChapterListToolbar } from "./chapter-list-toolbar";
import { ChapterListItem } from "./chapter-list-item";
import { ChapterPagination } from "./chapter-pagination";
import type { PublicChapterListItemDto } from "../types/public-chapter.types";

interface ChapterListProps {
  chapters: PublicChapterListItemDto[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  currentSort: string;
  storySlug: string;
  now: number;
}

export function ChapterList({
  chapters,
  totalCount,
  currentPage,
  totalPages,
  currentSort,
  storySlug,
  now,
}: ChapterListProps) {
  if (totalCount === 0 || chapters.length === 0) {
    return (
      <div className="chapter-list chapter-list--empty">
        <h3 className="chapter-list__empty-title">DANH SÁCH CHƯƠNG</h3>
        <div className="chapter-list__empty-box">
          <svg
            className="chapter-list__empty-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
          <p className="chapter-list__empty-text">Hiện tại chưa có chương truyện nào được phát hành.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chapter-list">
      <ChapterListToolbar
        totalCount={totalCount}
        currentSort={currentSort}
        storySlug={storySlug}
      />

      <div className="chapter-list__grid">
        {chapters.map((chapter) => (
          <ChapterListItem
            key={chapter.id}
            chapter={chapter}
            storySlug={storySlug}
            now={now}
          />
        ))}
      </div>

      <ChapterPagination
        currentPage={currentPage}
        totalPages={totalPages}
        storySlug={storySlug}
        currentSort={currentSort}
      />
    </div>
  );
}

export default ChapterList;
