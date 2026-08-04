import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface StoryPaginationProps {
  currentPage: number;
  totalPages: number;
  genre?: string;
  search?: string;
}

export function StoryPagination({
  currentPage,
  totalPages,
  genre,
  search,
}: StoryPaginationProps) {
  if (totalPages <= 1) return null;

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) {
      params.set("page", String(page));
    }
    if (genre && genre !== "Tất cả") {
      params.set("genre", genre);
    }
    if (search) {
      params.set("search", search);
    }
    const qs = params.toString();
    return qs ? `${ROUTES.home}?${qs}` : ROUTES.home;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav className="pagination" aria-label="Phân trang danh sách truyện">
      {/* Nút Trước */}
      {currentPage > 1 ? (
        <Link href={buildPageUrl(currentPage - 1)} className="pagination__btn">
          &larr; Trước
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled">&larr; Trước</span>
      )}

      {/* Số trang */}
      <div className="pagination__pages">
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span key={`ellipse-${idx}`} className="pagination__ellipse">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={`page-${pageNum}`}
              href={buildPageUrl(pageNum)}
              className={`pagination__page-link ${
                isActive ? "pagination__page-link--active" : ""
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Nút Tiếp */}
      {currentPage < totalPages ? (
        <Link href={buildPageUrl(currentPage + 1)} className="pagination__btn">
          Tiếp &rarr;
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled">Tiếp &rarr;</span>
      )}
    </nav>
  );
}

export default StoryPagination;
