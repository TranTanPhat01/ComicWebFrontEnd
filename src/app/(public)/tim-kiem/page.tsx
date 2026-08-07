"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { getPublicStoriesBrowser, getGenresBrowser } from "@/features/public-stories/api/public-stories-browser.api";
import { DEMO_STORIES } from "@/features/public-stories/demo/demo-stories";
import { StoryCard } from "@/features/public-stories/components/story-card";
import { parsePaginatedEnvelope } from "@/lib/api/parse-envelope";
import type { PublicStoryListItemDto, GenreOptionDto } from "@/features/public-stories/types/public-story.types";

const POPULAR_GENRES = ["Huyền Huyễn", "Đô Thị", "Tiên Hiệp", "Hệ Thống", "Xuyên Không", "Khoa Huyễn", "Đấu Khí", "Trùng Sinh"];
const STATUS_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "Đang ra", value: "Ongoing" },
  { label: "Hoàn thành", value: "Completed" },
];
const SORT_OPTIONS = [
  { label: "Mới cập nhật", value: "-updatedAt" },
  { label: "Mới đăng", value: "-publishedAt" },
  { label: "Tên truyện (A-Z)", value: "title" },
  { label: "Tên truyện (Z-A)", value: "-title" },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get("q") || searchParams.get("search") || "";
  const initialGenre = searchParams.get("genre") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialSort = searchParams.get("sort") || "-updatedAt";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [activeGenre, setActiveGenre] = useState(initialGenre);
  const [activeStatus, setActiveStatus] = useState(initialStatus);
  const [activeSort, setActiveSort] = useState(initialSort);
  
  const [results, setResults] = useState<PublicStoryListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Dynamic genres from BE
  const [genres, setGenres] = useState<GenreOptionDto[]>([]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();

    async function loadGenres() {
      try {
        const response = await getGenresBrowser();
        if (response.success && response.data) {
          setGenres(response.data.filter((g) => g.isActive));
        }
      } catch (err) {
        console.error("Failed to load dynamic genres:", err);
      }
    }
    loadGenres();
  }, []);

  const doSearch = useCallback(async (q: string, genre: string, status: string, sort: string, pageNum: number) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await getPublicStoriesBrowser({
        page: pageNum,
        pageSize: 12,
        query: q || undefined,
        genre: genre || undefined,
        status: status || undefined,
        sort: sort || undefined,
      });

      let list: PublicStoryListItemDto[] = [];
      let totalP = 1;
      let totalC = 0;

      if (response.success && response.data) {
        const parsed = parsePaginatedEnvelope<PublicStoryListItemDto>(response.data);
        list = parsed.items;
        totalP = parsed.totalPages;
        totalC = parsed.totalCount;
      }

      // Demo fallback
      if (list.length === 0) {
        const allFiltered = DEMO_STORIES.filter((s) => {
          const matchQ = !q || s.title.toLowerCase().includes(q.toLowerCase()) || s.description?.toLowerCase().includes(q.toLowerCase()) || s.authorName?.toLowerCase().includes(q.toLowerCase());
          const matchGenre = !genre || s.genres?.some(g => g.toLowerCase() === genre.toLowerCase());
          const matchStatus = !status || s.status === status;
          return matchQ && matchGenre && matchStatus;
        });

        totalC = allFiltered.length;
        totalP = Math.ceil(totalC / 12);
        list = allFiltered.slice((pageNum - 1) * 12, pageNum * 12);
      }

      setResults(list);
      setCurrentPage(pageNum);
      setTotalPages(totalP);
      setTotalCount(totalC);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run search on mount if params present
  useEffect(() => {
    if (initialQuery || initialGenre || initialStatus || initialSort !== "-updatedAt" || initialPage !== 1) {
      doSearch(initialQuery, initialGenre, initialStatus, initialSort, initialPage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUrlAndSearch = (q: string, genre: string, status: string, sort: string, pageNum: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (genre) params.set("genre", genre);
    if (status) params.set("status", status);
    if (sort !== "-updatedAt") params.set("sort", sort);
    if (pageNum !== 1) params.set("page", pageNum.toString());

    router.replace(`${ROUTES.search}?${params.toString()}`, { scroll: false });
    doSearch(q, genre, status, sort, pageNum);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlAndSearch(query, activeGenre, activeStatus, activeSort, 1);
  };

  const handleGenreClick = (genre: string) => {
    const newGenre = activeGenre === genre ? "" : genre;
    setActiveGenre(newGenre);
    updateUrlAndSearch(query, newGenre, activeStatus, activeSort, 1);
  };

  const handleStatusClick = (status: string) => {
    setActiveStatus(status);
    updateUrlAndSearch(query, activeGenre, status, activeSort, 1);
  };

  const handleSortClick = (sortVal: string) => {
    setActiveSort(sortVal);
    updateUrlAndSearch(query, activeGenre, activeStatus, sortVal, 1);
  };

  const handlePageChange = (pageNum: number) => {
    updateUrlAndSearch(query, activeGenre, activeStatus, activeSort, pageNum);
  };

  const genresToRender = genres.length > 0 ? genres.map((g) => g.name) : POPULAR_GENRES;

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <nav className="chapter-pagination" aria-label="Phân trang kết quả tìm kiếm" style={{ marginTop: "var(--space-8)", display: "flex", justifyContent: "center" }}>
        <ul className="chapter-pagination__list">
          {currentPage > 1 && (
            <li className="chapter-pagination__item">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                className="chapter-pagination__link chapter-pagination__link--nav"
                aria-label="Trang trước"
              >
                &lsaquo;
              </button>
            </li>
          )}
          {startPage > 1 && (
            <>
              <li className="chapter-pagination__item">
                <button type="button" onClick={() => handlePageChange(1)} className="chapter-pagination__link">
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="chapter-pagination__item chapter-pagination__ellipsis" aria-hidden="true">
                  ...
                </li>
              )}
            </>
          )}
          {pages.map((p) => (
            <li key={p} className="chapter-pagination__item">
              <button
                type="button"
                onClick={() => handlePageChange(p)}
                className={`chapter-pagination__link ${currentPage === p ? "chapter-pagination__link--active" : ""}`}
              >
                {p}
              </button>
            </li>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li className="chapter-pagination__item chapter-pagination__ellipsis" aria-hidden="true">
                  ...
                </li>
              )}
              <li className="chapter-pagination__item">
                <button type="button" onClick={() => handlePageChange(totalPages)} className="chapter-pagination__link">
                  {totalPages}
                </button>
              </li>
            </>
          )}
          {currentPage < totalPages && (
            <li className="chapter-pagination__item">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                className="chapter-pagination__link chapter-pagination__link--nav"
                aria-label="Trang sau"
              >
                &rsaquo;
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  };

  return (
    <div className="search-page">
      <div className="container search-page__container">
        {/* Breadcrumb */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <ol className="breadcrumbs__list">
            <li className="breadcrumbs__item">
              <Link href={ROUTES.home} className="breadcrumbs__link">Trang chủ</Link>
            </li>
            <li className="breadcrumbs__item breadcrumbs__item--active">
              <span className="breadcrumbs__current" aria-current="page">Tìm kiếm</span>
            </li>
          </ol>
        </nav>

        {/* Search Header */}
        <header className="search-page__header">
          <h1 className="search-page__title">Tìm Kiếm Truyện</h1>
          <p className="search-page__subtitle">Tìm kiếm theo tên, tác giả, thể loại hoặc nội dung</p>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="search-page__form">
          <div className="search-page__input-wrap">
            <svg className="search-page__input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              className="search-page__input"
              placeholder="Nhập tên truyện, tác giả..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Từ khóa tìm kiếm"
            />
            {query && (
              <button type="button" className="search-page__clear-btn" onClick={() => setQuery("")} aria-label="Xóa">
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-page__submit-btn">
            Tìm kiếm
          </button>
        </form>

        {/* Filters */}
        <div className="search-page__filters">
          {/* Genre filter */}
          <div className="search-page__filter-group">
            <span className="search-page__filter-label">Thể loại:</span>
            <div className="search-page__chips">
              {genresToRender.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`search-chip ${activeGenre === g ? "search-chip--active" : ""}`}
                  onClick={() => handleGenreClick(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div className="search-page__filter-group">
            <span className="search-page__filter-label">Trạng thái:</span>
            <div className="search-page__chips">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`search-chip ${activeStatus === opt.value ? "search-chip--active" : ""}`}
                  onClick={() => handleStatusClick(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort filter */}
          <div className="search-page__filter-group">
            <span className="search-page__filter-label">Sắp xếp:</span>
            <div className="search-page__chips">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`search-chip ${activeSort === opt.value ? "search-chip--active" : ""}`}
                  onClick={() => handleSortClick(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="search-page__results">
          {loading ? (
            <div className="search-page__loading">
              <div className="search-page__spinner" />
              <span>Đang tìm kiếm...</span>
            </div>
          ) : hasSearched ? (
            results.length === 0 ? (
              <div className="search-page__empty">
                <div className="search-page__empty-icon">🔍</div>
                <h3>Không tìm thấy kết quả</h3>
                <p>Hãy thử từ khóa khác hoặc thay đổi bộ lọc</p>
                <Link href={ROUTES.home} className="btn btn--primary">Về trang chủ</Link>
              </div>
            ) : (
              <>
                <p className="search-page__result-count">
                  Tìm thấy <strong>{totalCount}</strong> kết quả
                  {query && <> cho &ldquo;<em>{query}</em>&rdquo;</>}
                </p>
                <div className="search-results-grid">
                  {results.map((story) => (
                    <StoryCard key={story.id} story={story} badge={story.status === "Completed" ? "FULL" : "NEW"} />
                  ))}
                </div>
                {renderPagination()}
              </>
            )
          ) : (
            <div className="search-page__placeholder">
              <div className="search-page__placeholder-icon">📚</div>
              <h3>Bắt đầu tìm kiếm</h3>
              <p>Nhập từ khóa và nhấn <strong>Tìm kiếm</strong> để xem kết quả</p>
              <div className="search-page__suggestions">
                <span className="search-page__suggestions-label">Gợi ý:</span>
                {["Huyền Huyễn", "Hoàn thành", "Trùng Sinh"].map((s) => (
                  <button key={s} type="button" className="search-chip" onClick={() => { setQuery(s); updateUrlAndSearch(s, activeGenre, activeStatus, activeSort, 1); }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
