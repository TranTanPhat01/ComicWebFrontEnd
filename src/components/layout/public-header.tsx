"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { useBookmarks } from "@/features/public-stories/hooks/use-bookmarks";
import { getPublicStoriesBrowser, getGenresBrowser } from "@/features/public-stories/api/public-stories-browser.api";
import type { PublicStoryListItemDto } from "@/features/public-stories/types/public-story.types";
import { DEMO_STORIES } from "@/features/public-stories/demo/demo-stories";
import { useTheme } from "@/providers/theme-provider";
import {
  getUserNotificationsBrowser,
  markNotificationReadBrowser,
  markAllNotificationsReadBrowser,
  type UserNotificationDto
} from "@/features/public-stories/api/notifications-browser.api";

// ─── NavLinks sub-component ────────────────────────────────────────────────
// Separated so usePathname can be consumed in a dedicated component.
function NavLinks({ bookmarkCount, genres = [] }: { bookmarkCount: number; genres: string[] }) {
  const pathname = usePathname();

  // Determine which nav item is active based on current pathname
  const isHome = pathname === "/";
  const isGenre = pathname.startsWith("/the-loai");
  const isNewUpdates = pathname.startsWith("/moi-cap-nhat");
  const isHot = pathname.startsWith("/hot");
  const isCompleted = pathname.startsWith("/hoan-thanh");
  const isBookcase = pathname.startsWith("/theo-doi");

  const displayGenres = genres.length > 0 ? genres : ["Huyền Huyễn", "Đô Thị", "Hệ Thống", "Xuyên Không", "Tiên Hiệp", "Khoa Huyễn", "Đấu Khí", "Đấu Trí", "Lịch Sử", "Ngôn Tình", "Kinh Dị", "Hài Hước"];

  return (
    <nav className="public-header__nav" aria-label="Điều hướng chính">
      <Link
        href={ROUTES.home}
        className={`public-header__nav-link${isHome ? " public-header__nav-link--active" : ""}`}
      >
        Trang chủ
      </Link>
      
      <div className="public-header__nav-item--has-dropdown">
        <Link
          href={ROUTES.genres}
          className={`public-header__nav-link${isGenre ? " public-header__nav-link--active" : ""}`}
          style={{ display: "flex", alignItems: "center" }}
        >
          Thể loại
          <svg className="public-header__dropdown-caret" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        
        {/* Hover Dropdown Mega Menu */}
        <div className="public-header__genres-dropdown">
          {displayGenres.map((gName) => (
            <Link
              key={gName}
              href={`${ROUTES.search}?genre=${encodeURIComponent(gName)}`}
              className="public-header__genres-dropdown-item"
            >
              <span>{gName}</span>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href={ROUTES.newUpdates}
        className={`public-header__nav-link${isNewUpdates ? " public-header__nav-link--active" : ""}`}
      >
        Mới cập nhật
      </Link>
      <Link
        href={ROUTES.hot}
        className={`public-header__nav-link${isHot ? " public-header__nav-link--active" : ""}`}
      >
        Hot
      </Link>
      <Link
        href={ROUTES.completed}
        className={`public-header__nav-link${isCompleted ? " public-header__nav-link--active" : ""}`}
      >
        Hoàn thành
      </Link>
      <Link
        href={ROUTES.bookcase}
        className={`public-header__nav-link public-header__nav-link--bookcase${isBookcase ? " public-header__nav-link--active" : ""}`}
      >
        Tủ truyện {bookmarkCount > 0 && <span className="public-header__badge">{bookmarkCount}</span>}
      </Link>
    </nav>
  );
}

export function PublicHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookmarks } = useBookmarks();
  const [session, setSession] = useState<{ authenticated: boolean; user?: { username: string; role: string } } | null>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<UserNotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    if (!session?.authenticated) return;
    try {
      const response = await getUserNotificationsBrowser({ page: 1, pageSize: 10 });
      if (response.success && response.data) {
        const list = response.data.items || [];
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (session?.authenticated) {
      loadNotifications();
      interval = setInterval(loadNotifications, 30000); // Poll every 30s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session?.authenticated]);

  const handleMarkAllRead = async () => {
    try {
      const response = await markAllNotificationsReadBrowser();
      if (response.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const handleNotificationClick = async (notif: UserNotificationDto) => {
    setShowNotifications(false);
    if (!notif.isRead) {
      try {
        await markNotificationReadBrowser(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
  };

  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Vừa xong";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  }

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        } else {
          setSession({ authenticated: false });
        }
      } catch (err) {
        setSession({ authenticated: false });
      }
    }
    loadSession();
  }, []);

  const searchParamVal = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(searchParamVal);
  const [prevSearchVal, setPrevSearchVal] = useState(searchParamVal);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<PublicStoryListItemDto[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Genres state
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    async function loadGenres() {
      try {
        const response = await getGenresBrowser();
        if (response.success && response.data) {
          const list = Array.isArray(response.data)
            ? response.data.map((g) => g.name)
            : [];
          setGenres(list);
        }
      } catch (err) {
        console.error("Failed to load genres for dropdown", err);
      }
    }
    loadGenres();
  }, []);

  const searchContainerRef = React.useRef<HTMLFormElement>(null);
  const mobileSearchContainerRef = React.useRef<HTMLFormElement>(null);

  if (searchParamVal !== prevSearchVal) {
    setSearchQuery(searchParamVal);
    setPrevSearchVal(searchParamVal);
  }

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isOutsideDesktop = searchContainerRef.current && !searchContainerRef.current.contains(target);
      const isOutsideMobile = mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(target);
      if (isOutsideDesktop && isOutsideMobile) {
        setShowSuggestions(false);
      }

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query fetching
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }


    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await getPublicStoriesBrowser({
          pageNumber: 1,
          pageSize: 5,
          search: q,
        });

        let list: PublicStoryListItemDto[] = [];
        if (response.success && response.data) {
          const rawData = response.data as unknown;
          if (rawData && typeof rawData === "object") {
            if ("data" in rawData && Array.isArray((rawData as { data: unknown }).data)) {
              list = (rawData as { data: PublicStoryListItemDto[] }).data;
            } else if ("items" in rawData && Array.isArray((rawData as { items: unknown }).items)) {
              list = (rawData as { items: PublicStoryListItemDto[] }).items;
            }
          } else if (Array.isArray(rawData)) {
            list = rawData as PublicStoryListItemDto[];
          }
        }

        // Fallback to local demo stories if API returns no matches (Offline fallback)
        if (list.length === 0) {
          list = DEMO_STORIES.filter(
            (s) =>
              s.title.toLowerCase().includes(q.toLowerCase()) ||
              s.description?.toLowerCase().includes(q.toLowerCase())
          ).slice(0, 5) as unknown as PublicStoryListItemDto[];
        }

        setSuggestions(list);
        setShowSuggestions(list.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Search suggestion error", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Key navigation for suggestions dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev === suggestions.length - 1 ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[activeIndex];
        router.push(ROUTES.storyDetail(selected.slug));
        setShowSuggestions(false);
        setSearchQuery(selected.title);
        setMobileMenuOpen(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/?search=${encodeURIComponent(query)}`);
    } else {
      router.push(ROUTES.home);
    }
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <header className={`public-header ${isScrolled ? "public-header--scrolled" : ""}`}>
      <div className="public-header__container">
        {/* Left Brand Area */}
        <div className="public-header__brand-wrapper">
          <button
            onClick={toggleMobileMenu}
            className={`public-header__hamburger ${mobileMenuOpen ? "public-header__hamburger--open" : ""}`}
            aria-label="Menu"
            type="button"
          >
            <span className="public-header__hamburger-line" />
            <span className="public-header__hamburger-line" />
            <span className="public-header__hamburger-line" />
          </button>

          <Link href={ROUTES.home} className="public-header__logo" onClick={() => setMobileMenuOpen(false)}>
            <svg
              className="public-header__logo-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span>{siteConfig.name}</span>
          </Link>
        </div>

        {/* Center Navigation Links (Hidden on Mobile) */}
        <NavLinks bookmarkCount={bookmarks.length} genres={genres} />

        {/* Right Search & Utilities Area */}
        <div className="public-header__right">
          <form ref={searchContainerRef} onSubmit={handleSearchSubmit} className="public-header__search-form">
            <input
              type="search"
              placeholder="Tìm truyện, tác giả..."
              className="public-header__search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onKeyDown={handleKeyDown}
              aria-label="Tìm kiếm truyện"
            />
            <span className="public-header__search-shortcut">Ctrl /</span>
            <button type="submit" className="public-header__search-btn" aria-label="Tìm kiếm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Suggestions panel */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions-panel">
                {suggestions.map((story, idx) => (
                  <Link
                    key={story.id}
                    href={ROUTES.storyDetail(story.slug)}
                    className={`suggestion-item ${idx === activeIndex ? "suggestion-item--active" : ""}`}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery(story.title);
                    }}
                  >
                    {story.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={story.coverUrl}
                        alt={story.title}
                        className="suggestion-item__cover"
                      />
                    ) : (
                      <div className="suggestion-item__cover-placeholder">📚</div>
                    )}
                    <div className="suggestion-item__info">
                      <span className="suggestion-item__title">{story.title}</span>
                      <span className="suggestion-item__meta">
                        {story.authorName || "Đang cập nhật"} · {story.chapterCount ?? 0} chương
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={handleThemeToggle}
            className="public-header__util-btn"
            aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            title={isDark ? "Chế độ sáng" : "Chế độ tối"}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User Notifications Bell & Dropdown */}
          {session?.authenticated && (
            <div className="public-header__notification-container" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className={`public-header__util-btn public-header__notification-btn${showNotifications ? " public-header__notification-btn--active" : ""}`}
                aria-label="Thông báo"
                title="Thông báo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="public-header__notification-badge">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="public-header__notification-dropdown">
                  <div className="public-header__notification-dropdown-header">
                    <span className="public-header__notification-dropdown-title">Thông báo</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="public-header__notification-mark-all"
                        type="button"
                      >
                        Đánh dấu đã đọc tất cả
                      </button>
                    )}
                  </div>
                  <div className="public-header__notification-list">
                    {notifications.length === 0 ? (
                      <div className="public-header__notification-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2} className="w-12 h-12 text-muted">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.961 8.961 0 002.3-5.541V9a9 9 0 00-9-9 9 9 0 00-9 9v1.231c0 2.243-.69 4.324-1.872 6.046M12 17.082c-.933 0-1.849-.044-2.75-.13M12 17.082c.972 0 1.925-.049 2.857-.145m-2.857.145a23.864 23.864 0 005.455-1.31 8.961 8.961 0 002.3-5.541V9a9 9 0 00-9-9 9 9 0 00-9 9v1.231c0 2.243-.69 4.324-1.872 6.046M12 17.082V21m0-3.918a3 3 0 11-5.714 0M12 17.082a24.255 24.255 0 01-5.714 0" />
                        </svg>
                        <p>Không có thông báo nào</p>
                      </div>
                    ) : (
                      notifications.map(notif => {
                        const targetUrl = notif.storySlug
                          ? notif.chapterSlug
                            ? `/truyen/${notif.storySlug}/chuong/${notif.chapterSlug}`
                            : `/truyen/${notif.storySlug}`
                          : "#";

                        return (
                          <Link
                            key={notif.id}
                            href={targetUrl}
                            onClick={() => handleNotificationClick(notif)}
                            className={`public-header__notification-item${!notif.isRead ? " public-header__notification-item--unread" : ""}`}
                          >
                            <div className="public-header__notification-item-content">
                              <p className="public-header__notification-message">{notif.message}</p>
                              <span className="public-header__notification-time">{timeAgo(notif.createAt)}</span>
                            </div>
                            {!notif.isRead && (
                              <span className="public-header__notification-unread-dot" />
                            )}
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Button */}
          {session?.authenticated && session.user ? (
            <Link
              href="/profile"
              className="public-header__profile-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.2rem",
                height: "2.2rem",
                borderRadius: "50%",
                backgroundColor: "var(--color-primary, #f97316)",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "0.95rem",
                textDecoration: "none"
              }}
              title={`Tài khoản: ${session.user.username}`}
            >
              {session.user.username[0].toUpperCase()}
            </Link>
          ) : (
            <Link
              href={ROUTES.login}
              className="public-header__profile-btn"
              aria-label="Tài khoản"
              title="Đăng nhập / Đăng ký"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`public-header__mobile-menu ${mobileMenuOpen ? "public-header__mobile-menu--open" : ""}`}>
        <div className="public-header__mobile-container">
          <form ref={mobileSearchContainerRef} onSubmit={handleSearchSubmit} className="public-header__mobile-search">
            <input
              type="search"
              placeholder="Tìm truyện..."
              className="public-header__search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" className="public-header__search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Suggestions panel (Mobile version) */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions-panel search-suggestions-panel--mobile">
                {suggestions.map((story, idx) => (
                  <Link
                    key={story.id}
                    href={ROUTES.storyDetail(story.slug)}
                    className={`suggestion-item ${idx === activeIndex ? "suggestion-item--active" : ""}`}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery(story.title);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {story.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={story.coverUrl}
                        alt={story.title}
                        className="suggestion-item__cover"
                      />
                    ) : (
                      <div className="suggestion-item__cover-placeholder">📚</div>
                    )}
                    <div className="suggestion-item__info">
                      <span className="suggestion-item__title">{story.title}</span>
                      <span className="suggestion-item__meta">
                        {story.authorName || "Đang cập nhật"} · {story.chapterCount ?? 0} chương
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          <nav className="public-header__mobile-nav" aria-label="Điều hướng chính mobile">
            <Link
              href={ROUTES.home}
              className="public-header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href={ROUTES.genres}
              className="public-header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Thể loại
            </Link>
            <Link
              href={ROUTES.newUpdates}
              className="public-header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mới cập nhật
            </Link>
            <Link
              href={ROUTES.hot}
              className="public-header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hot
            </Link>
            <Link
              href={ROUTES.completed}
              className="public-header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hoàn thành
            </Link>
            <Link
              href={ROUTES.bookcase}
              className="public-header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tủ truyện {bookmarks.length > 0 && `(${bookmarks.length})`}
            </Link>
            <Link
              href={ROUTES.search}
              className="public-header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔍 Tìm kiếm nâng cao
            </Link>
            {session?.authenticated && session.user ? (
              <Link
                href="/profile"
                className="public-header__mobile-link"
                onClick={() => setMobileMenuOpen(false)}
                style={{ borderTop: "1px dashed var(--color-border)", marginTop: "var(--space-2)", paddingTop: "var(--space-2)", color: "var(--color-primary)" }}
              >
                👤 Cá nhân ({session.user.username})
              </Link>
            ) : (
              <Link
                href={ROUTES.login}
                className="public-header__mobile-link"
                onClick={() => setMobileMenuOpen(false)}
                style={{ borderTop: "1px dashed var(--color-border)", marginTop: "var(--space-2)", paddingTop: "var(--space-2)" }}
              >
                👤 Đăng nhập / Đăng ký
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;
