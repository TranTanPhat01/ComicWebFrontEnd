"use client";

import React, { useEffect, useState } from "react";
import { ChapterReaderHeader } from "./chapter-reader-header";
import { ChapterNavigation } from "./chapter-navigation";
import { ChapterContent } from "./chapter-content";
import { ReaderSettings } from "@/features/public-chapters/components/reader-settings";
import { ChapterKeyboardNavigation } from "./chapter-keyboard-navigation";
import { ReadingProgress } from "./reading-progress";
import { BackToTopButton } from "./back-to-top-button";
import { useReadingHistory } from "../hooks/use-reading-history";
import type { PublicChapterDetailDto } from "../types/public-chapter.types";
import { trackAffiliateClickBrowser } from "../api/public-chapters-browser.api";

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
  const [isLocked, setIsLocked] = useState(chapter.isLocked);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [clickedAffiliate, setClickedAffiliate] = useState(false);
  const [canConfirm, setCanConfirm] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  // Check localStorage on mount/change
  useEffect(() => {
    try {
      const unlocked = JSON.parse(localStorage.getItem("unlocked_chapters") || "[]");
      if (unlocked.includes(chapter.id)) {
        setIsLocked(false);
      } else {
        setIsLocked(chapter.isLocked);
      }
    } catch (e) {
      console.error("Local storage error", e);
    }
    setCountdown(null);
    setClickedAffiliate(false);
    setCanConfirm(false);
    setCanSkip(false);
  }, [chapter.id, chapter.isLocked]);

  // Save reading history when chapter mounts
  useEffect(() => {
    saveEntry({
      storyId: chapter.story?.id,
      storySlug,
      storyTitle,
      coverUrl,
      chapterId: chapter.id,
      chapterSlug: chapter.slug,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title ?? undefined,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.slug]);

  // Handle countdown timer
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCanConfirm(true);
      setCanSkip(true);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleAffiliateClick = () => {
    setClickedAffiliate(true);
    setCountdown(15);
    void trackAffiliateClickBrowser(chapter.id);
  };

  const handleUnlock = () => {
    try {
      const unlocked = JSON.parse(localStorage.getItem("unlocked_chapters") || "[]");
      if (!unlocked.includes(chapter.id)) {
        unlocked.push(chapter.id);
        localStorage.setItem("unlocked_chapters", JSON.stringify(unlocked));
      }
    } catch (e) {
      console.error(e);
    }
    setIsLocked(false);
  };

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
          {isLocked ? (
            <div
              className="chapter-lock-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "3.5rem 2rem",
                margin: "3rem auto",
                maxWidth: "640px",
                backgroundColor: "rgba(30, 41, 59, 0.75)",
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
                  fontSize: "4rem",
                  marginBottom: "1rem",
                }}
              >
                🔒
              </div>
              <h2
                className="chapter-lock-card__title"
                style={{
                  fontSize: "1.7rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#f8fafc",
                }}
              >
                Chương Này Đang Được Khóa
              </h2>
              <p
                className="chapter-lock-card__text"
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  color: "#cbd5e1",
                  marginBottom: "2rem",
                  maxWidth: "500px",
                }}
              >
                Để ủng hộ tác giả duy trì dịch truyện, vui lòng click link đặt mua sách giấy Shopee dưới đây để mở khoá trực tiếp chương này.
              </p>

              {chapter.affiliateLink && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", width: "100%" }}>
                  <a
                    href={chapter.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleAffiliateClick}
                    className="btn btn--primary btn--large"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "1rem 2.2rem",
                      fontSize: "1.1rem",
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
                    🛒 Đi Đến Shopee Mua Sách & Mở Khóa
                  </a>

                  {clickedAffiliate && countdown !== null && countdown > 0 && (
                    <div style={{ fontSize: "0.95rem", color: "#f97316", fontWeight: "500" }}>
                      ⏳ Đang xác thực chuyển hướng mua sách... Vui lòng đợi {countdown} giây
                    </div>
                  )}

                  {canConfirm && (
                    <button
                      type="button"
                      onClick={handleUnlock}
                      className="btn btn--secondary"
                      style={{
                        padding: "0.8rem 2rem",
                        borderRadius: "9999px",
                        fontWeight: "bold",
                        backgroundColor: "#22c55e",
                        borderColor: "#22c55e",
                        color: "#ffffff"
                      }}
                    >
                      ✅ Xác nhận mở khóa chương
                    </button>
                  )}

                  {clickedAffiliate && canSkip && (
                    <button
                      type="button"
                      onClick={handleUnlock}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        marginTop: "0.5rem"
                      }}
                    >
                      Bỏ qua quảng cáo và đọc trực tiếp
                    </button>
                  )}
                </div>
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
