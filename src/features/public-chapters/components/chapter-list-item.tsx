import React from "react";
import Link from "next/link";
import type { PublicChapterListItemDto } from "../types/public-chapter.types";

interface ChapterListItemProps {
  chapter: PublicChapterListItemDto;
  storySlug: string;
  now: number;
}

export function ChapterListItem({ chapter, storySlug, now }: ChapterListItemProps) {
  const publishedDate = chapter.publishedAt ? new Date(chapter.publishedAt) : null;
  const diffTime = publishedDate ? now - publishedDate.getTime() : Infinity;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const isNew = diffDays >= 0 && diffDays <= 3;

  const formattedDate = publishedDate
    ? publishedDate.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "Đang cập nhật";

  return (
    <div className="chapter-list-item">
      <Link
        href={`/truyen/${storySlug}/chuong/${chapter.slug}`}
        className="chapter-list-item__link"
      >
        <div className="chapter-list-item__left">
          <span className="chapter-list-item__number">
            Chương {chapter.number}
          </span>
          <span className="chapter-list-item__title" title={chapter.title}>
            {chapter.title ? `- ${chapter.title}` : ""}
          </span>
          {isNew && <span className="chapter-list-item__new-badge">Mới</span>}
        </div>
        <span className="chapter-list-item__date">{formattedDate}</span>
      </Link>
    </div>
  );
}

export default ChapterListItem;
