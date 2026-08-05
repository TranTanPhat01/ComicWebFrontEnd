"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { getPublicStoriesBrowser } from "@/features/public-stories/api/public-stories-browser.api";
import { DEMO_STORIES } from "@/features/public-stories/demo/demo-stories";
import { StoryCard } from "@/features/public-stories/components/story-card";
import { parsePaginatedEnvelope } from "@/lib/api/parse-envelope";
import type { PublicStoryListItemDto } from "@/features/public-stories/types/public-story.types";

const POPULAR_GENRES = ["Huyền Huyễn", "Đô Thị", "Tiên Hiệp", "Hệ Thống", "Xuyên Không", "Khoa Huyễn", "Đấu Khí", "Trùng Sinh"];
const STATUS_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "Đang ra", value: "Ongoing" },
  { label: "Hoàn thành", value: "Completed" },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get("q") || searchParams.get("search") || "";
  const initialGenre = searchParams.get("genre") || "";
  const initialStatus = searchParams.get("status") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeGenre, setActiveGenre] = useState(initialGenre);
  const [activeStatus, setActiveStatus] = useState(initialStatus);
  const [results, setResults] = useState<PublicStoryListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doSearch = useCallback(async (q: string, genre: string, status: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await getPublicStoriesBrowser({
        page: 1,
        pageSize: 24,
        query: q || undefined,
        genre: genre || undefined,
        status: status || undefined,
      });

      let list: PublicStoryListItemDto[] = [];
      if (response.success && response.data) {
        list = parsePaginatedEnvelope<PublicStoryListItemDto>(response.data).items;
      }

      // Demo fallback
      if (list.length === 0) {
        list = DEMO_STORIES.filter((s) => {
          const matchQ = !q || s.title.toLowerCase().includes(q.toLowerCase()) || s.description?.toLowerCase().includes(q.toLowerCase());
          const matchGenre = !genre || s.genres?.includes(genre);
          const matchStatus = !status || s.status === status;
          return matchQ && matchGenre && matchStatus;
        });
      }

      setResults(list);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run search on mount if params present
  useEffect(() => {
    if (initialQuery || initialGenre || initialStatus) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      doSearch(initialQuery, initialGenre, initialStatus);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeGenre) params.set("genre", activeGenre);
    if (activeStatus) params.set("status", activeStatus);
    router.replace(`${ROUTES.search}?${params.toString()}`, { scroll: false });
    doSearch(query, activeGenre, activeStatus);
  };

  const handleGenreClick = (genre: string) => {
    const newGenre = activeGenre === genre ? "" : genre;
    setActiveGenre(newGenre);
    
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (newGenre) params.set("genre", newGenre);
    if (activeStatus) params.set("status", activeStatus);
    router.replace(`${ROUTES.search}?${params.toString()}`, { scroll: false });
    doSearch(query, newGenre, activeStatus);
  };

  const handleStatusClick = (status: string) => {
    setActiveStatus(status);
    
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeGenre) params.set("genre", activeGenre);
    if (status) params.set("status", status);
    router.replace(`${ROUTES.search}?${params.toString()}`, { scroll: false });
    doSearch(query, activeGenre, status);
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
              {POPULAR_GENRES.map((g) => (
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
                  Tìm thấy <strong>{results.length}</strong> kết quả
                  {query && <> cho &ldquo;<em>{query}</em>&rdquo;</>}
                </p>
                <div className="search-results-grid">
                  {results.map((story) => (
                    <StoryCard key={story.id} story={story} badge={story.status === "Completed" ? "FULL" : "NEW"} />
                  ))}
                </div>
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
                  <button key={s} type="button" className="search-chip" onClick={() => { setQuery(s); }}>
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
