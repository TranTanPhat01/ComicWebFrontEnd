"use client";

import React, { useEffect } from "react";
import { ChapterReaderHeader } from "./chapter-reader-header";
import { ChapterNavigation } from "./chapter-navigation";
import { ChapterContent } from "./chapter-content";
import { ReaderSettings } from "@/features/public-chapters/components/reader-settings";
import { ChapterKeyboardNavigation } from "./chapter-keyboard-navigation";
import { ReadingProgress } from "./reading-progress";
import { BackToTopButton } from "./back-to-top-button";
import { useReadingHistory } from "../hooks/use-reading-history";
import type { PublicChapterDetailDto } from "../types/public-chapter.types";

interface ChapterScreenProps {
  chapter: PublicChapterDetailDto;
  storySlug: string;
  storyTitle: string;
  coverUrl?: string;
}

export function ChapterScreen({
  chapter,
  storySlug,
  storyTitle,
  coverUrl,
}: ChapterScreenProps) {
  const { saveEntry } = useReadingHistory();

  // Save reading history when chapter mounts
  useEffect(() => {
    saveEntry({
      storySlug,
      storyTitle,
      coverUrl,
      chapterSlug: chapter.slug,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title ?? undefined,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.slug]);

  return (
    <div id="chapter-reader-container" className="chapter-reader-screen reader-theme--dark reader-fit--width reader-spacing--none">
      {/* Scroll Reading Progress Indicator */}
      <ReadingProgress />

      {/* Keyboard shortcuts controller */}
      <ChapterKeyboardNavigation
        storySlug={storySlug}
        previousSlug={chapter.previousChapter?.slug ?? null}
        nextSlug={chapter.nextChapter?.slug ?? null}
      />

      {/* Floating Gear Settings Control panel */}
      <ReaderSettings />

      {/* Top Reader Header */}
      <ChapterReaderHeader
        storyTitle={storyTitle}
        storySlug={storySlug}
        chapterTitle={chapter.title}
        chapterNumber={chapter.number}
        publishedAt={chapter.publishedAt}
      />

      <div className="container chapter-reader-screen__layout">
        {/* Main Text Content Article */}
        <div className="chapter-reader-screen__content-wrapper">
          {chapter.isLocked ? (
            <div
              className="chapter-lock-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "4rem 2rem",
                margin: "3rem auto",
                maxWidth: "640px",
                backgroundColor: "rgba(30, 41, 59, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(12px)",
                color: "#f8fafc",
              }}
            >
              <div
                className="chapter-lock-card__icon"
                style={{
                  fontSize: "4.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                🔒
              </div>
              <h2
                className="chapter-lock-card__title"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#f8fafc",
                }}
              >
                Chương Này Đang Được Khóa Bản Quyền
              </h2>
              <p
                className="chapter-lock-card__text"
                style={{
                  fontSize: "1.05rem",
                  lineHeight: "1.6",
                  color: "#cbd5e1",
                  marginBottom: "2.5rem",
                  maxWidth: "500px",
                }}
              >
                Để tiếp tục đọc chương truyện này và ủng hộ tác giả, vui lòng bấm vào nút bên dưới để đặt mua sách giấy chính hãng trên sàn Shopee.
              </p>
              {chapter.affiliateLink && (
                <a
                  href={chapter.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary btn--large"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "1rem 2.5rem",
                    fontSize: "1.15rem",
                    fontWeight: "bold",
                    borderRadius: "9999px",
                    backgroundColor: "#f97316", // Shopee Orange
                    color: "#ffffff",
                    textDecoration: "none",
                    boxShadow: "0 4px 14px 0 rgba(249, 115, 22, 0.4)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px 0 rgba(249, 115, 22, 0.6)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(249, 115, 22, 0.4)";
                  }}
                >
                  Mua Sách Ủng Hộ Tác Giả & Mở Khóa Trên Shopee 🛒
                </a>
              )}
            </div>
          ) : (
            <ChapterContent content={chapter.content} />
          )}
        </div>

        {/* Bottom Navigation */}
        <ChapterNavigation
          storySlug={storySlug}
          previousSlug={chapter.previousChapter?.slug ?? null}
          nextSlug={chapter.nextChapter?.slug ?? null}
          position="bottom"
        />
      </div>

      {/* Back To Top Action */}
      <BackToTopButton />
    </div>
  );
}

export default ChapterScreen;
