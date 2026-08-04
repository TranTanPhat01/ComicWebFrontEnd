import React from "react";
import Link from "next/link";

interface ChapterListToolbarProps {
  totalCount: number;
  currentSort: string;
  storySlug: string;
}

export function ChapterListToolbar({
  totalCount,
  currentSort,
  storySlug,
}: ChapterListToolbarProps) {
  const isDesc = currentSort === "desc";

  return (
    <div className="chapter-list-toolbar">
      <h3 className="chapter-list-toolbar__title">DANH SÁCH CHƯƠNG ({totalCount})</h3>
      <div className="chapter-list-toolbar__sort">
        <span className="chapter-list-toolbar__sort-label">Sắp xếp:</span>
        <div className="chapter-list-toolbar__sort-btns">
          <Link
            href={`/truyen/${storySlug}?sort=asc`}
            className={`chapter-list-toolbar__sort-btn ${
              !isDesc ? "chapter-list-toolbar__sort-btn--active" : ""
            }`}
            scroll={false}
          >
            Cũ nhất
          </Link>
          <Link
            href={`/truyen/${storySlug}?sort=desc`}
            className={`chapter-list-toolbar__sort-btn ${
              isDesc ? "chapter-list-toolbar__sort-btn--active" : ""
            }`}
            scroll={false}
          >
            Mới nhất
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChapterListToolbar;
