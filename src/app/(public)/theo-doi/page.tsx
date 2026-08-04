"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useBookmarks } from "@/features/public-stories/hooks/use-bookmarks";
import { StoryGrid } from "@/features/public-stories/components/story-grid";

export default function BookcasePage() {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <div className="bookcase-page">
      <div className="container bookcase-page__container">
        {/* Breadcrumb path */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <ol className="breadcrumbs__list">
            <li className="breadcrumbs__item">
              <Link href={ROUTES.home} className="breadcrumbs__link">
                Trang chủ
              </Link>
            </li>
            <li className="breadcrumbs__item breadcrumbs__item--active">
              <span className="breadcrumbs__current" aria-current="page">
                Tủ truyện theo dõi
              </span>
            </li>
          </ol>
        </nav>

        {/* Section Title Header */}
        <header className="bookcase-page__header">
          <h1 className="bookcase-page__title">
            <svg
              className="bookcase-page__title-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            TỦ TRUYỆN CỦA BẠN
          </h1>
          <p className="bookcase-page__subtitle">
            Lưu giữ những bộ truyện tranh yêu thích của bạn. Dữ liệu được lưu trữ tự động trên trình duyệt.
          </p>
        </header>

        {/* Main Content Area */}
        {bookmarks.length === 0 ? (
          <div className="bookcase-empty">
            <div className="bookcase-empty__icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A9 9 0 0118 12v.75m-15.75 0a9.003 9.003 0 0015.75 0m-15.75 0h1.5m-1.5 0A2.25 2.25 0 014.5 10.5h15a2.25 2.25 0 012.25 2.25m-19.5 0v.75m19.5 0v-.75m-19.5 0h1.5"
                />
              </svg>
            </div>
            <h3 className="bookcase-empty__title">Tủ truyện của bạn đang trống</h3>
            <p className="bookcase-empty__message">
              Bạn chưa theo dõi bộ truyện nào. Hãy khám phá và thêm các bộ truyện yêu thích để theo dõi cập nhật chương mới nhanh nhất.
            </p>
            <Link href={ROUTES.home} className="btn btn--primary bookcase-empty__btn">
              Khám phá truyện ngay
            </Link>
          </div>
        ) : (
          <div className="bookcase-list">
            <div className="bookcase-list__meta">
              <span>Đang theo dõi <strong>{bookmarks.length}</strong> bộ truyện</span>
              <button 
                onClick={() => {
                  if (window.confirm("Bạn có chắc muốn xóa toàn bộ danh sách theo dõi?")) {
                    localStorage.removeItem("comic_web_bookmarks");
                    window.dispatchEvent(new Event("bookmarks-updated"));
                  }
                }}
                className="btn btn--ghost bookcase-list__clear-btn"
              >
                Xóa tất cả
              </button>
            </div>
            <StoryGrid stories={bookmarks} badgeType={null} />
          </div>
        )}
      </div>
    </div>
  );
}
