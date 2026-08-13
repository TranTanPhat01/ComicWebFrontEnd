"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChapterReaderHeader } from "./chapter-reader-header";
import { ChapterNavigation } from "./chapter-navigation";
import { ChapterContent } from "./chapter-content";
import { ReaderSettings } from "@/features/public-chapters/components/reader-settings";
import { ChapterKeyboardNavigation } from "./chapter-keyboard-navigation";
import { ReadingProgress } from "./reading-progress";
import { useReadingHistory } from "../hooks/use-reading-history";
import type { PublicChapterDetailDto } from "../types/public-chapter.types";
import { trackAffiliateClickBrowser } from "../api/public-chapters-browser.api";
import { resolveImageUrl } from "@/lib/utils";

interface ChapterScreenProps {
  chapter: PublicChapterDetailDto;
  storySlug: string;
  storyTitle: string;
  coverUrl?: string;
  allChapters?: { slug: string; number: number; title: string }[];
  currentChapterSlug?: string;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function ChapterScreen({
  chapter,
  storySlug,
  storyTitle,
  coverUrl,
  allChapters,
  currentChapterSlug,
}: ChapterScreenProps) {
  const { saveEntry } = useReadingHistory();
  const [isLocked, setIsLocked] = useState(chapter.isLocked);
  // dismissed = user clicked X on popup -> show locked-page instead of popup
  const [dismissed, setDismissed] = useState(false);

  const [isStopped, setIsStopped] = useState(false);
  const boundaryRef = useRef<HTMLDivElement>(null);

  // Bounded fixed navigation behavior
  useEffect(() => {
    const handleScrollAndResize = () => {
      if (!boundaryRef.current) return;
      const boundaryRect = boundaryRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;
      const fixedBottom = isMobile ? 24 : 80;
      const stoppedBottom = 24;
      const stopThreshold = window.innerHeight - fixedBottom + stoppedBottom;
      setIsStopped(boundaryRect.bottom <= stopThreshold);
    };

    // Initial check
    handleScrollAndResize();

    window.addEventListener("scroll", handleScrollAndResize, { passive: true });
    window.addEventListener("resize", handleScrollAndResize);

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize);
      window.removeEventListener("resize", handleScrollAndResize);
    };
  }, [chapter.id, chapter.slug, isLocked]);

  // Check localStorage on mount/chapter change
  useEffect(() => {
    try {
      // 1. Kiểm tra xem truyện này (storySlug) đã được mở khóa 24h chưa
      const unlockedStories = JSON.parse(localStorage.getItem("unlocked_stories_expiry") || "{}");
      let isStoryUnlocked = false;
      const storyUnlockTime = unlockedStories[storySlug];
      if (storyUnlockTime) {
        const isExpired = Date.now() - storyUnlockTime > ONE_DAY_MS;
        if (!isExpired) {
          isStoryUnlocked = true;
        } else {
          delete unlockedStories[storySlug];
          localStorage.setItem("unlocked_stories_expiry", JSON.stringify(unlockedStories));
        }
      }

      // 2. Kiểm tra xem chương này đã được mở khóa riêng lẻ chưa
      const unlockKey = `${storySlug}:${chapter.slug}`;
      const unlockedChaptersExpiry = JSON.parse(localStorage.getItem("unlocked_chapters_expiry") || "{}");
      let isChapterUnlocked = false;
      const chapterUnlockTime = unlockedChaptersExpiry[unlockKey];
      if (chapterUnlockTime) {
        const isExpired = Date.now() - chapterUnlockTime > ONE_DAY_MS;
        if (!isExpired) {
          isChapterUnlocked = true;
        } else {
          delete unlockedChaptersExpiry[unlockKey];
          localStorage.setItem("unlocked_chapters_expiry", JSON.stringify(unlockedChaptersExpiry));
        }
      }

      // 3. Fallback cho legacy non-expiring chapter ID
      const legacyUnlockedChapters = JSON.parse(localStorage.getItem("unlocked_chapters") || "[]");
      if (legacyUnlockedChapters.includes(chapter.id)) {
        isChapterUnlocked = true;
      }

      if (isStoryUnlocked || isChapterUnlocked) {
        setIsLocked(false);
      } else {
        setIsLocked(chapter.isLocked);
      }
    } catch (e) {
      console.error("Local storage error", e);
    }
    setDismissed(false);
  }, [chapter.id, chapter.slug, chapter.isLocked, storySlug]);

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

  const handleUnlock = () => {
    try {
      // 1. Mở khóa toàn bộ truyện này trong 24 giờ
      const unlockedStories = JSON.parse(localStorage.getItem("unlocked_stories_expiry") || "{}");
      unlockedStories[storySlug] = Date.now();
      localStorage.setItem("unlocked_stories_expiry", JSON.stringify(unlockedStories));

      // 2. Mở khóa riêng lẻ cho chương này (độc nhất theo slug)
      const unlockKey = `${storySlug}:${chapter.slug}`;
      const unlockedChaptersExpiry = JSON.parse(localStorage.getItem("unlocked_chapters_expiry") || "{}");
      unlockedChaptersExpiry[unlockKey] = Date.now();
      unlockedChaptersExpiry[chapter.id] = Date.now();
      localStorage.setItem("unlocked_chapters_expiry", JSON.stringify(unlockedChaptersExpiry));

      // 3. Legacy array
      const legacyUnlockedChapters = JSON.parse(localStorage.getItem("unlocked_chapters") || "[]");
      if (!legacyUnlockedChapters.includes(chapter.id)) {
        legacyUnlockedChapters.push(chapter.id);
        localStorage.setItem("unlocked_chapters", JSON.stringify(legacyUnlockedChapters));
      }
    } catch (e) {
      console.error(e);
    }
    setIsLocked(false);
  };

  // Click Shopee link -> unlock immediately (no countdown needed)
  const handleAffiliateClick = () => {
    void trackAffiliateClickBrowser(chapter.id);
    handleUnlock();
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

      <div ref={boundaryRef} className="chapter-reader-boundary" style={{ position: "relative" }}>
        <div className="container chapter-reader-screen__layout">
          {/* Main Text Content Article */}
          <div className="chapter-reader-screen__content-wrapper">
            {isLocked ? (
              dismissed ? (
                <div className="chapter-locked-notice">
                  <div className="chapter-locked-notice__icon">🔒</div>
                  <h2 className="chapter-locked-notice__title">Chương này đã bị khoá</h2>
                  <p className="chapter-locked-notice__desc">
                    Bạn vui lòng ấn vào link Shopee trên Popup để mở khoá nội dung.
                    <br />
                    Nếu lỡ ấn ✕, vui lòng tải lại trang hoặc bấm nút dưới đây để hiện lại popup mở khóa.
                  </p>
                  <button
                    className="chapter-locked-notice__reopen-btn"
                    onClick={() => setDismissed(false)}
                  >
                    🛒 Mở popup Shopee lại
                  </button>
                </div>
              ) : (
                <div className="chapter-content-placeholder" style={{ filter: "blur(12px)", opacity: 0.15, pointerEvents: "none", userSelect: "none", margin: "3rem auto", maxWidth: "800px" }}>
                  <p style={{ fontSize: "1.2rem", marginBottom: "1rem", lineHeight: "1.8" }}>Nội dung chương này đã bị ẩn đi. Vui lòng hoàn thành các bước trong popup để tiếp tục đọc truyện.</p>
                  <p style={{ fontSize: "1.1rem", marginBottom: "1rem", lineHeight: "1.8" }}>Đường đi dài hơn, những bước chân chậm rãi trên cát bụi thời gian. Nhìn về phía xa xăm, nơi chân trời giao thoa với đại dương...</p>
                  <p style={{ fontSize: "1.1rem", marginBottom: "1rem", lineHeight: "1.8" }}>Gió thổi qua hàng thông, tiếng xào xạc hòa cùng tiếng sóng biển vỗ rì rào. Một bóng người thầm lặng đứng đợi bóng tối buông xuống...</p>
                </div>
              )
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
              allChapters={allChapters}
              currentChapterSlug={currentChapterSlug ?? chapter.slug}
              position="bottom"
              isStopped={isStopped}
            />
          )}
        </div>
      </div>

      {/* -- Popup when LOCKED and not yet dismissed -- */}
      {isLocked && !dismissed && (
        <div className="affiliate-modal-overlay">
          <div className="affiliate-modal-card">
            {/* Close Button X */}
            <button
              className="affiliate-modal-close-btn"
              onClick={() => setDismissed(true)}
              title="Đóng popup"
            >
              ✕
            </button>

            {/* Title */}
            <h3 className="affiliate-modal-title">
              Mời bạn CLICK vào liên kết bên dưới và <span className="highlight-color">Mở Ứng Dụng Shopee</span> để mở khóa toàn bộ chương truyện!
            </h3>

            {/* Shopee Link */}
            <div className="affiliate-modal-link-container">
              👉 <a
                href={chapter.affiliateLink || "https://shopee.vn"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAffiliateClick}
                className="affiliate-modal-link"
              >
                {chapter.affiliateLink || "https://shopee.vn"}
              </a>
            </div>

            {/* Product Image */}
            {chapter.affiliateImage && chapter.affiliateImage.trim() !== "" && (
              <div className="affiliate-modal-image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveImageUrl(chapter.affiliateImage)}
                  alt="Sản phẩm Shopee"
                  className="affiliate-modal-image"
                  onError={(e) => {
                    // Hide the image container if it fails to load
                    (e.currentTarget.parentNode as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* CTA Button - clicking opens Shopee AND unlocks immediately */}
            <div className="affiliate-modal-action-area">
              <a
                href={chapter.affiliateLink || "https://shopee.vn"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAffiliateClick}
                className="affiliate-modal-btn affiliate-modal-btn--shopee"
              >
                🛒 Mở Ứng Dụng Shopee &amp; Mở Khóa
              </a>
            </div>

            {/* Note */}
            <p className="affiliate-modal-note">
              Lưu ý: Khi bấm mở khóa, toàn bộ chương của truyện này sẽ được mở khóa đọc tự do trong 24 giờ. Rất mong Quý độc giả ủng hộ.
            </p>

            {/* Footer */}
            <div className="affiliate-modal-footer">
              ComicWeb và đội ngũ Editor xin chân thành cảm ơn!
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ChapterScreen;
