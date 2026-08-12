"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface ChapterNavItem {
  slug: string;
  number: number;
  title: string;
}

interface ChapterNavigationProps {
  storySlug: string;
  previousSlug: string | null;
  nextSlug: string | null;
  position?: "top" | "bottom";
  allChapters?: ChapterNavItem[];
  currentChapterSlug?: string;
}

export function ChapterNavigation({
  storySlug,
  previousSlug,
  nextSlug,
  position = "top",
  allChapters,
  currentChapterSlug,
}: ChapterNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isCleanPath = pathname ? pathname.includes("/chuong/") : false;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleChapterSelect = (slug: string) => {
    setDropdownOpen(false);
    const url = isCleanPath
      ? `/truyen/${storySlug}/chuong/${slug}`
      : `/truyen/${storySlug}?chuong-id=${slug}`;
    router.push(url);
  };

  return (
    <nav
      className={`chapter-navigation chapter-navigation--${position}`}
      aria-label={`Điều hướng chương (${position === "top" ? "trên" : "dưới"})`}
    >
      {/* Previous Chapter button */}
      {previousSlug ? (
        <Link
          href={
            isCleanPath
              ? `/truyen/${storySlug}/chuong/${previousSlug}`
              : `/truyen/${storySlug}?chuong-id=${previousSlug}`
          }
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

      {/* Chapter list / Dropdown button */}
      <div className="chapter-navigation__list-wrapper" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            if (allChapters && allChapters.length > 0) {
              setDropdownOpen((prev) => !prev);
            } else {
              router.push(`/truyen/${storySlug}`);
            }
          }}
          className="chapter-navigation__btn chapter-navigation__btn--list"
          aria-label="Xem danh sách chương"
          aria-expanded={dropdownOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="chapter-navigation__btn-text">Mục lục</span>
        </button>

        {/* Dropdown list */}
        {dropdownOpen && allChapters && allChapters.length > 0 && (
          <div className="chapter-navigation__dropdown" role="listbox" aria-label="Danh sách chương">
            <div className="chapter-navigation__dropdown-header">
              <span>Danh sách chương</span>
              <button
                type="button"
                className="chapter-navigation__dropdown-close"
                onClick={() => setDropdownOpen(false)}
                aria-label="Đóng mục lục"
              >
                ✕
              </button>
            </div>
            <div className="chapter-navigation__dropdown-list">
              {allChapters.map((ch) => (
                <button
                  key={ch.slug}
                  type="button"
                  role="option"
                  aria-selected={ch.slug === currentChapterSlug}
                  className={`chapter-navigation__dropdown-item${ch.slug === currentChapterSlug ? " chapter-navigation__dropdown-item--active" : ""}`}
                  onClick={() => handleChapterSelect(ch.slug)}
                >
                  <span className="chapter-navigation__dropdown-num">Chương {ch.number}</span>
                  {ch.title && ch.title !== `Chương ${ch.number}` && (
                    <span className="chapter-navigation__dropdown-title">{ch.title}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Chapter button */}
      {nextSlug ? (
        <Link
          href={
            isCleanPath
              ? `/truyen/${storySlug}/chuong/${nextSlug}`
              : `/truyen/${storySlug}?chuong-id=${nextSlug}`
          }
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
