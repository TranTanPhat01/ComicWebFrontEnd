import React from "react";
import Link from "next/link";

interface ChapterNavigationProps {
  storySlug: string;
  previousSlug: string | null;
  nextSlug: string | null;
  position?: "top" | "bottom";
}

export function ChapterNavigation({
  storySlug,
  previousSlug,
  nextSlug,
  position = "top",
}: ChapterNavigationProps) {
  return (
    <nav
      className={`chapter-navigation chapter-navigation--${position}`}
      aria-label={`Điều hướng chương (${position === "top" ? "trên" : "dưới"})`}
    >
      {/* Previous Chapter button */}
      {previousSlug ? (
        <Link
          href={`/truyen/${storySlug}?chuong-id=${previousSlug}`}
          className="chapter-navigation__btn chapter-navigation__btn--prev"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="chapter-navigation__btn-text">Chương trước</span>
        </Link>
      ) : (
        <button
          disabled
          className="chapter-navigation__btn chapter-navigation__btn--prev chapter-navigation__btn--disabled"
          aria-disabled="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="chapter-navigation__btn-text">Chương trước</span>
        </button>
      )}

      {/* Chapters list button */}
      <Link
        href={`/truyen/${storySlug}`}
        className="chapter-navigation__btn chapter-navigation__btn--list"
        aria-label="Xem danh sách chương của truyện"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="chapter-navigation__btn-text">Mục lục</span>
      </Link>

      {/* Next Chapter button */}
      {nextSlug ? (
        <Link
          href={`/truyen/${storySlug}?chuong-id=${nextSlug}`}
          className="chapter-navigation__btn chapter-navigation__btn--next"
        >
          <span className="chapter-navigation__btn-text">Chương sau</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <button
          disabled
          className="chapter-navigation__btn chapter-navigation__btn--next chapter-navigation__btn--disabled"
          aria-disabled="true"
        >
          <span className="chapter-navigation__btn-text">Chương sau</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  );
}

export default ChapterNavigation;
