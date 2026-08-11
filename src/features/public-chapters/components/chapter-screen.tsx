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
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { saveEntry } = useReadingHistory();
  const [isLocked, setIsLocked] = useState(chapter.isLocked);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [clickedAffiliate, setClickedAffiliate] = useState(false);
  const [canConfirm, setCanConfirm] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  // Check localStorage on mount/change
  useEffect(() => {
    try {
      const unlockedChapters = JSON.parse(localStorage.getItem("unlocked_chapters") || "[]");
      const unlockedStories = JSON.parse(localStorage.getItem("unlocked_stories_expiry") || "{}");
      
      const isChapterUnlocked = unlockedChapters.includes(chapter.id);
      
      let isStoryUnlocked = false;
      const unlockTime = unlockedStories[storySlug];
      if (unlockTime) {
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const isExpired = Date.now() - unlockTime > SEVEN_DAYS_MS;
        if (!isExpired) {
          isStoryUnlocked = true;
        } else {
          // Clean up expired entry
          delete unlockedStories[storySlug];
          localStorage.setItem("unlocked_stories_expiry", JSON.stringify(unlockedStories));
        }
      }

      if (isChapterUnlocked || isStoryUnlocked) {
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
  }, [chapter.id, chapter.isLocked, storySlug]);

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
      // 1. Mở khóa riêng cho chương này (backwards compatibility)
      const unlockedChapters = JSON.parse(localStorage.getItem("unlocked_chapters") || "[]");
      if (!unlockedChapters.includes(chapter.id)) {
        unlockedChapters.push(chapter.id);
        localStorage.setItem("unlocked_chapters", JSON.stringify(unlockedChapters));
      }
      
      // 2. Mở khóa toàn bộ các chương khác của bộ truyện này trong 7 ngày
      const unlockedStories = JSON.parse(localStorage.getItem("unlocked_stories_expiry") || "{}");
      unlockedStories[storySlug] = Date.now();
      localStorage.setItem("unlocked_stories_expiry", JSON.stringify(unlockedStories));
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
            <div className="chapter-content-placeholder" style={{ filter: "blur(12px)", opacity: 0.15, pointerEvents: "none", userSelect: "none", margin: "3rem auto", maxWidth: "800px" }}>
              <p style={{ fontSize: "1.2rem", marginBottom: "1rem", lineHeight: "1.8" }}>Nội dung chương này đã bị ẩn đi. Vui lòng hoàn thành các bước trong popup để tiếp tục đọc truyện.</p>
              <p style={{ fontSize: "1.1rem", marginBottom: "1rem", lineHeight: "1.8" }}>Đường đi dài hơn, những bước chân chậm rãi trên cát bụi thời gian. Nhìn về phía xa xăm, nơi chân trời giao thoa với đại dương...</p>
              <p style={{ fontSize: "1.1rem", marginBottom: "1rem", lineHeight: "1.8" }}>Gió thổi qua hàng thông, tiếng xào xạc hòa cùng tiếng sóng biển vỗ rì rào. Một bóng người thầm lặng đứng đợi bóng tối buông xuống...</p>
            </div>
          ) : (
            <ChapterContent content={chapter.content} />
          )}
        </div>

        {/* Bottom Navigation */}
        {!isLocked && (
          <ChapterNavigation
            storySlug={storySlug}
            previousSlug={chapter.previousChapter?.slug ?? null}
            nextSlug={chapter.nextChapter?.slug ?? null}
            position="bottom"
          />
        )}
      </div>

      {/* Beautiful Modal Popup when Locked */}
      {isLocked && (
        <div className="affiliate-modal-overlay">
          <div className="affiliate-modal-card">
            {/* Close Button X at Top Right */}
            <button 
              className="affiliate-modal-close-btn" 
              onClick={() => router.push(`/truyen/${storySlug}`)}
              title="Quay lại danh sách chương"
            >
              ✕
            </button>

            {/* Top Text Content */}
            <h3 className="affiliate-modal-title">
              Mời bạn CLICK vào liên kết bên dưới và <span className="highlight-color">Mở Ứng Dụng Shopee</span> để mở khóa toàn bộ chương truyện!
            </h3>

            {/* Shopee Link */}
            <div className="affiliate-modal-link-container">
              👉 <a href={chapter.affiliateLink || "https://shopee.vn"} target="_blank" rel="noopener noreferrer" onClick={handleAffiliateClick} className="affiliate-modal-link">
                {chapter.affiliateLink || "https://shopee.vn"}
              </a>
            </div>

            {/* Product Image */}
            {chapter.affiliateImage && (
              <div className="affiliate-modal-image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={chapter.affiliateImage} 
                  alt="Sản phẩm Shopee" 
                  className="affiliate-modal-image"
                />
              </div>
            )}

            {/* Countdown / Unlock Action Area */}
            <div className="affiliate-modal-action-area">
              {!clickedAffiliate ? (
                <a
                  href={chapter.affiliateLink || "https://shopee.vn"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleAffiliateClick}
                  className="affiliate-modal-btn affiliate-modal-btn--shopee"
                >
                  🛒 Mở Ứng Dụng Shopee & Mở Khóa
                </a>
              ) : (
                <>
                  {countdown !== null && countdown > 0 ? (
                    <div className="affiliate-modal-countdown">
                      ⏳ Đang xác nhận chuyển hướng... Vui lòng đợi {countdown}s
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUnlock}
                      className="affiliate-modal-btn affiliate-modal-btn--unlock"
                    >
                      ✅ Xác nhận mở khóa chương
                    </button>
                  )}

                  {canSkip && (
                    <button
                      type="button"
                      onClick={handleUnlock}
                      className="affiliate-modal-skip-btn"
                    >
                      Bỏ qua quảng cáo và đọc trực tiếp
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Warning Note */}
            <p className="affiliate-modal-note">
              Lưu ý: Khi bấm mở khóa, toàn bộ chương của truyện sẽ được mở khóa đọc tự do trong 7 ngày. Rất mong Quý độc giả ủng hộ.
            </p>

            {/* Footer Thank You */}
            <div className="affiliate-modal-footer">
              Xó Truyện và đội ngũ Editor xin chân thành cảm ơn!
            </div>
          </div>
        </div>
      )}

      {/* Back To Top Action */}
      <BackToTopButton />
    </div>
  );
}

export default ChapterScreen;
