"use client";

import React, { useState } from "react";
import { ChapterReaderHeader } from "./chapter-reader-header";
import { ChapterNavigation } from "./chapter-navigation";
import { ChapterContent } from "./chapter-content";
import { ReaderSettings } from "@/features/public-chapters/components/reader-settings";
import { ChapterKeyboardNavigation } from "./chapter-keyboard-navigation";
import { ReadingProgress } from "./reading-progress";
import { BackToTopButton } from "./back-to-top-button";
import type { PublicChapterDetailDto } from "../types/public-chapter.types";

interface ChapterScreenProps {
  chapter: PublicChapterDetailDto;
  storySlug: string;
  storyTitle: string;
}

export function ChapterScreen({
  chapter,
  storySlug,
  storyTitle,
}: ChapterScreenProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [linkClicked, setLinkClicked] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleShopeeClick = () => {
    if (linkClicked) return;
    setLinkClicked(true);
    setCountdown(5);

    // Open affiliate link in new tab
    const url = chapter.affiliateLink || "https://shopee.vn";
    window.open(url, "_blank", "noopener,noreferrer");

    // Start countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsUnlocked(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };
  return (
    <div id="chapter-reader-container" className="chapter-reader-screen reader-theme--dark reader-fit--width reader-spacing--none">
      {/* Scroll Reading Progress Indicator */}
      <ReadingProgress />

      {/* Keyboard shortcuts controller */}
      <ChapterKeyboardNavigation
        storySlug={storySlug}
        previousSlug={chapter.previousChapterSlug}
        nextSlug={chapter.nextChapterSlug}
      />

      {/* Floating Gear Settings Control panel */}
      <ReaderSettings />

      {/* Top Reader Header */}
      <ChapterReaderHeader
        storyTitle={storyTitle}
        storySlug={storySlug}
        chapterTitle={chapter.title}
        chapterNumber={chapter.chapterNumber}
        publishedAt={chapter.publishedAt}
      />

      <div className="container chapter-reader-screen__layout">
        {/* Top Navigation */}
        <ChapterNavigation
          storySlug={storySlug}
          previousSlug={chapter.previousChapterSlug}
          nextSlug={chapter.nextChapterSlug}
          position="top"
        />

        {/* Main Text Content Article */}
        <div className="chapter-reader-screen__content-wrapper" style={{ position: "relative", minHeight: chapter.isLocked && !isUnlocked ? "400px" : "auto" }}>
          {chapter.isLocked && !isUnlocked ? (
            <div className="shopee-lock-panel" style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "3rem 2rem",
              background: "rgba(15, 23, 42, 0.45)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "var(--radius-2xl)",
              maxWidth: "600px",
              margin: "2rem auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}>
              <div className="shopee-lock-panel__icon" style={{
                fontSize: "3.5rem",
                marginBottom: "1.5rem",
                filter: "drop-shadow(0 0 12px rgba(249, 78, 47, 0.3))"
              }}>
                🔒
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>
                Chương Này Đang Tạm Khóa
              </h2>
              <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "420px", marginBottom: "2rem" }}>
                Ủng hộ chúng tôi bằng cách bấm vào liên kết Shopee tài trợ bên dưới để mở khóa đọc toàn bộ chương miễn phí.
              </p>

              <button
                onClick={handleShopeeClick}
                disabled={linkClicked}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "white",
                  background: linkClicked ? "var(--color-navy-muted)" : "linear-gradient(135deg, #f94e2f, #ff6600)",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  cursor: linkClicked ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  boxShadow: linkClicked ? "none" : "0 10px 20px rgba(249, 78, 47, 0.25)",
                  transition: "all var(--transition-fast)"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {linkClicked ? "Đang mở khóa..." : "BẤM VÀO ĐÂY ĐỂ MỞ KHÓA"}
              </button>

              {countdown !== null && (
                <div style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "#f94e2f", fontWeight: "bold" }}>
                  Đang kiểm tra click... Mở khóa sau {countdown} giây
                </div>
              )}
            </div>
          ) : (
            <>
              {chapter.isLocked && isUnlocked && (
                <div style={{
                  padding: "1.5rem",
                  border: "1px dashed var(--color-success)",
                  borderRadius: "var(--radius-xl)",
                  backgroundColor: "rgba(16, 185, 129, 0.08)",
                  textAlign: "center",
                  marginBottom: "2rem",
                  animation: "revealFadeIn 500ms ease"
                }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-success)" }}>🎉 Mở Khóa Thành Công!</span>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.35rem" }}>Cảm ơn bạn đã click link Shopee ủng hộ dịch giả. Dưới đây là nội dung chương truyện:</p>
                </div>
              )}
              <ChapterContent content={chapter.isLocked ? `<p style="text-align:center; font-style:italic;">[Nội dung giả lập của chương ${chapter.chapterNumber}: "${chapter.title}" đã được mở khóa trực quan và hiển thị thành công. Dữ liệu thực tế được quản lý trực tiếp từ backend C# thông qua trường AffiliateLink.]</p><p style="margin-top: 1.5rem;">Cảm ơn bạn đã theo dõi truyện trên website ComicWeb của chúng tôi. Hãy bookmark và chia sẻ truyện để nhận các bản dịch nhanh nhất!</p>` : chapter.content} />
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        <ChapterNavigation
          storySlug={storySlug}
          previousSlug={chapter.previousChapterSlug}
          nextSlug={chapter.nextChapterSlug}
          position="bottom"
        />
      </div>

      {/* Back To Top Action */}
      <BackToTopButton />
    </div>
  );
}

export default ChapterScreen;
