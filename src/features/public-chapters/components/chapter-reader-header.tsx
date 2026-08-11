import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getCleanChapterTitle } from "../utils/chapter-utils";

interface ChapterReaderHeaderProps {
  storyTitle: string;
  storySlug: string;
  chapterTitle: string;
  chapterNumber: number;
  publishedAt: string | null;
}

export function ChapterReaderHeader({
  storyTitle,
  storySlug,
  chapterTitle,
  chapterNumber,
  publishedAt,
}: ChapterReaderHeaderProps) {
  const publishedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Đang cập nhật";

  const cleanTitle = getCleanChapterTitle(chapterNumber, chapterTitle);

  return (
    <header className="chapter-reader-header">
      <div className="container">
        {/* Breadcrumb path */}
        <Breadcrumbs
          items={[
            { label: "Truyện", url: "/" },
            { label: storyTitle, url: `/truyen/${storySlug}` },
            { label: `Chương ${chapterNumber}` },
          ]}
        />

        {/* Story details summary */}
        <div className="chapter-reader-header__info">
          <Link href={`/truyen/${storySlug}`} className="chapter-reader-header__story-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại chi tiết truyện
          </Link>
          <h1 className="chapter-reader-header__title">
            Chương {chapterNumber}
            {cleanTitle ? `: ${cleanTitle}` : ""}
          </h1>
          <div className="chapter-reader-header__meta">
            <span className="chapter-reader-header__story-name">{storyTitle}</span>
            <span className="chapter-reader-header__dot">&bull;</span>
            <span className="chapter-reader-header__published-date">Đăng ngày {publishedDate}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ChapterReaderHeader;
