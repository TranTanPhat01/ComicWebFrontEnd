import React from "react";
import Link from "next/link";

interface ChapterPaginationProps {
  currentPage: number;
  totalPages: number;
  storySlug: string;
  currentSort: string;
}

export function ChapterPagination({
  currentPage,
  totalPages,
  storySlug,
  currentSort,
}: ChapterPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const getPageUrl = (pageNumber: number) => {
    return `/truyen/${storySlug}?page=${pageNumber}&sort=${currentSort}`;
  };

  return (
    <nav className="chapter-pagination" aria-label="Phân trang chương">
      <ul className="chapter-pagination__list">
        {/* Previous Button */}
        {currentPage > 1 && (
          <li className="chapter-pagination__item">
            <Link
              href={getPageUrl(currentPage - 1)}
              className="chapter-pagination__link chapter-pagination__link--nav"
              aria-label="Trang trước"
              scroll={false}
            >
              &lsaquo;
            </Link>
          </li>
        )}

        {/* First Page ellipsis */}
        {startPage > 1 && (
          <>
            <li className="chapter-pagination__item">
              <Link href={getPageUrl(1)} className="chapter-pagination__link" scroll={false}>
                1
              </Link>
            </li>
            {startPage > 2 && (
              <li className="chapter-pagination__item chapter-pagination__ellipsis" aria-hidden="true">
                ...
              </li>
            )}
          </>
        )}

        {/* Pages */}
        {pages.map((p) => (
          <li key={p} className="chapter-pagination__item">
            {p === currentPage ? (
              <span
                className="chapter-pagination__link chapter-pagination__link--active"
                aria-current="page"
              >
                {p}
              </span>
            ) : (
              <Link href={getPageUrl(p)} className="chapter-pagination__link" scroll={false}>
                {p}
              </Link>
            )}
          </li>
        ))}

        {/* Last Page ellipsis */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="chapter-pagination__item chapter-pagination__ellipsis" aria-hidden="true">
                ...
              </li>
            )}
            <li className="chapter-pagination__item">
              <Link href={getPageUrl(totalPages)} className="chapter-pagination__link" scroll={false}>
                {totalPages}
              </Link>
            </li>
          </>
        )}

        {/* Next Button */}
        {currentPage < totalPages && (
          <li className="chapter-pagination__item">
            <Link
              href={getPageUrl(currentPage + 1)}
              className="chapter-pagination__link chapter-pagination__link--nav"
              aria-label="Trang sau"
              scroll={false}
            >
              &rsaquo;
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default ChapterPagination;
