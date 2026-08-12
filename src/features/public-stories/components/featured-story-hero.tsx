"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { translateText } from "@/lib/utils";
import type { PublicStoryListItemDto } from "../types/public-story.types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useBookmarks } from "../hooks/use-bookmarks";

interface FeaturedStoryHeroProps {
  stories: PublicStoryListItemDto[];
}

// Map slugs to genres to reproduce high fidelity visual mockups
function getPlaceholderGenres(slug: string, status: string): string[] {
  const normalized = slug.toLowerCase();
  
  // Translate status to Vietnamese
  let statusLabel = "Truyện Tranh";
  const st = status.toLowerCase();
  if (st === "published" || st === "ongoing") {
    statusLabel = "Đang tiến hành";
  } else if (st === "completed") {
    statusLabel = "Hoàn thành";
  } else if (st === "draft") {
    statusLabel = "Bản nháp";
  } else if (st === "hidden") {
    statusLabel = "Tạm ẩn";
  }

  if (normalized.includes("toan-chuc-phap-su")) {
    return ["Huyền Huyễn", "Đô Thị", "Phương Tây"];
  }
  if (normalized.includes("dau-pha-thuong-khung")) {
    return ["Tiên Hiệp", "Huyền Huyễn", "Đấu Khí"];
  }
  if (normalized.includes("than-an-vuong-toa")) {
    return ["Huyền Huyễn", "Đấu Khí", "Phép Thuật"];
  }
  if (normalized.includes("vo-luyen-dinh-phong")) {
    return ["Huyền Huyễn", "Tu Chân", "Trùng Sinh"];
  }
  if (normalized.includes("mot-minh-ta-dau")) {
    return ["Huyền Huyễn", "Hệ Thống", "Hành Động"];
  }
  return [statusLabel, "Truyện Tranh"];
}



export function FeaturedStoryHero({ stories }: FeaturedStoryHeroProps) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Danh sách các slug truyện nổi bật mặc định cố định
  const heroStories = React.useMemo(() => {
    const FEATURED_SLUGS = [
      "chong-sach-se-dung-giay-tham-dau-cua-thu-ky-toi-sat-phat-quyet-doan",
      "phieu-an-nam-ngan-te",
      "bo-la-ma-vuong-sua-chua",
      "nam-sat-phong-than-nu-chinh-nguoc-van-khong-phuong-boi-nua",
      "truong-mau-giao-than-nui",
      "cong-tu-am-ve-cua-ngai-trom-nha-roi"
    ];

    if (!stories) return [];
    
    // Chỉ lấy những truyện nằm trong danh sách nổi bật mặc định
    const filtered = stories.filter((s) => FEATURED_SLUGS.includes(s.slug));
    
    // Nếu có truyện nổi bật mặc định, sắp xếp đúng thứ tự cấu hình và lấy tối đa 5 truyện
    if (filtered.length > 0) {
      return filtered
        .sort((a, b) => FEATURED_SLUGS.indexOf(a.slug) - FEATURED_SLUGS.indexOf(b.slug))
        .slice(0, 5);
    }
    
    // Fallback: nếu không có truyện nào trùng khớp (ví dụ DB rỗng), lấy 5 truyện đầu tiên
    return stories.slice(0, 5);
  }, [stories]);

  const currentStory = heroStories[activeIndex];
  const followed = currentStory ? isBookmarked(currentStory.id) : false;

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev === heroStories.length - 1 ? 0 : prev + 1));
    } else if (isRightSwipe) {
      setActiveIndex((prev) => (prev === 0 ? heroStories.length - 1 : prev - 1));
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev === 0 ? heroStories.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev === heroStories.length - 1 ? 0 : prev + 1));
  };

  const handleFocus = () => {
    setIsPaused(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Only resume autoplay if focus actually left the slide container entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsPaused(false);
    }
  };

  // Autoplay effect
  useEffect(() => {
    if (isPaused || heroStories.length <= 1) return;
    const interval = setInterval(() => {
      if (document.hidden) return; // Pause slide transitions if the browser tab is hidden
      setActiveIndex((prev) => (prev === heroStories.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, heroStories.length]);

  if (!stories || stories.length === 0) {
    return null;
  }

  const genres = getPlaceholderGenres(currentStory.slug, currentStory.status);

  return (
    <section className="hero-section" aria-label="Truyện nổi bật">
      <div
        className="hero-slide"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Cover Crossfade list */}
        <div className="hero-slide__background">
          {heroStories.map((story, index) => (
            <div
              key={story.id}
              className={`hero-slide__bg-wrapper ${
                index === activeIndex ? "hero-slide__bg-wrapper--active" : ""
              }`}
              style={{
                position: "absolute",
                inset: 0,
                opacity: index === activeIndex ? 1 : 0,
                transition: "opacity 500ms ease-in-out",
                zIndex: index === activeIndex ? 1 : 0,
              }}
            >
              <ImageWithFallback
                src={story.coverUrl}
                alt={story.title}
                fill
                priority={index === 0}
                className="hero-slide__bg-img"
                sizes="100vw"
              />
            </div>
          ))}
          <div className="hero-slide__overlay" style={{ zIndex: 2 }} />
        </div>

        {/* Hero Inner Layout: text left + cover right */}
        <div key={activeIndex} className="hero-slide__inner animate-hero-text" style={{ zIndex: 3 }}>
          {/* Left: Content Box */}
          <div className="hero-slide__content">
            <span className="hero-slide__badge">TRUYỆN NỔI BẬT</span>
            
            <h2 className="hero-slide__title">
              {translateText(currentStory.title)}
            </h2>

            <div className="hero-slide__tags" aria-label="Thể loại">
              {genres.map((genre) => (
                <span key={genre} className="hero-slide__tag">
                  {genre}
                </span>
              ))}
            </div>

            <p className="hero-slide__description">
              {translateText(currentStory.description) || 
                "Một thế giới đầy kịch tính đang chờ đợi bạn khám phá. Hãy theo dõi cuộc phiêu lưu đầy bất ngờ của nhân vật chính và những trận chiến huyền thoại."}
            </p>

            <div className="hero-slide__actions">
              <Link
                href={ROUTES.storyDetail(currentStory.slug)}
                className="hero-slide__btn hero-slide__btn--primary"
              >
                Đọc ngay
              </Link>
              <button
                type="button"
                className={`hero-slide__btn hero-slide__btn--secondary ${followed ? "hero-slide__btn--followed" : ""}`}
                onClick={() => toggleBookmark(currentStory)}
              >
                {followed ? "✓ Đã theo dõi" : "+ Theo dõi"}
              </button>
            </div>
          </div>

          {/* Right: Prominent Cover Image */}
          <div className="hero-slide__cover-showcase">
            <div className="hero-slide__cover-frame">
              <ImageWithFallback
                src={currentStory.coverUrl}
                alt={currentStory.title}
                fill
                priority
                className="hero-slide__cover-img"
                sizes="(max-width: 768px) 0px, 260px"
              />
              <div className="hero-slide__cover-glow" />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="hero-nav-arrow hero-nav-arrow--prev"
          aria-label="Truyện nổi bật trước"
          style={{ zIndex: 4 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="hero-nav-arrow hero-nav-arrow--next"
          aria-label="Truyện nổi bật tiếp theo"
          style={{ zIndex: 4 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicators */}
        <div className="hero-indicators" style={{ zIndex: 4 }}>
          {heroStories.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`hero-indicators__dot ${
                index === activeIndex ? "hero-indicators__dot--active" : ""
              }`}
              aria-label={`Chuyển đến slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedStoryHero;
