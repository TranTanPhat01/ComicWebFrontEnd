"use client";

import { useState, useEffect, useCallback } from "react";
import type { PublicStoryListItemDto } from "../types/public-story.types";
import {
  getFollowedStoriesBrowser,
  followStoryBrowser,
  unfollowStoryBrowser
} from "../api/user-activities-browser.api";

const LOCAL_STORAGE_KEY = "comic_web_bookmarks";

interface UseBookmarksOptions {
  /** Optional toast callback: called when bookmark state changes */
  onToast?: (message: string, variant: "success" | "info") => void;
}

export function useBookmarks(options?: UseBookmarksOptions) {
  const [bookmarks, setBookmarks] = useState<PublicStoryListItemDto[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.authenticated);
        }
      } catch {}
    }
    void checkAuth();
  }, []);

  // Function to load bookmarks from server or localStorage
  const loadBookmarks = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const res = await getFollowedStoriesBrowser(1, 100);
        if (res.success && res.data) {
          const items = (res.data as any).items || (res.data as any).data || [];
          const mapped: PublicStoryListItemDto[] = items.map((x: any) => ({
            id: x.storyId,
            title: x.title,
            slug: x.slug,
            coverUrl: x.coverImageUrl,
            authorName: x.authorName || undefined,
            description: "",
            status: "Published",
            chapterCount: 0,
            genres: x.genreNames ? x.genreNames.split(", ").map((n: string) => ({ name: n })) : []
          }));
          setBookmarks(mapped);
          return;
        }
      } catch (err) {
        console.error("Failed to load bookmarks from server", err);
      }
    }

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      } else {
        setBookmarks([]);
      }
    } catch (e) {
      console.error("Error reading bookmarks from localStorage", e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void loadBookmarks();

    // Listen to updates from other tabs or components
    window.addEventListener("bookmarks-updated", () => { void loadBookmarks(); });
    return () => {
      window.removeEventListener("bookmarks-updated", () => { void loadBookmarks(); });
    };
  }, [loadBookmarks]);

  const addBookmark = useCallback(async (story: PublicStoryListItemDto) => {
    if (isAuthenticated) {
      const res = await followStoryBrowser(Number(story.id));
      if (res.success) {
        setBookmarks((prev) => {
          if (prev.some((b) => b.id === story.id)) return prev;
          return [...prev, story];
        });
        options?.onToast?.(`Đã thêm "${story.title}" vào tủ truyện (Đồng bộ server)`, "success");
      } else {
        options?.onToast?.(res.error?.message || "Thao tác thất bại", "info");
      }
      return;
    }

    // Cục bộ
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === story.id)) return prev;
      const next = [...prev, story];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("bookmarks-updated"));
      } catch {}
      options?.onToast?.(`Đã thêm "${story.title}" vào tủ truyện`, "success");
      return next;
    });
  }, [isAuthenticated, options]);

  const removeBookmark = useCallback(async (storyId: string | number) => {
    if (isAuthenticated) {
      const res = await unfollowStoryBrowser(Number(storyId));
      if (res.success) {
        setBookmarks((prev) => {
          const target = prev.find((b) => b.id === storyId || String(b.id) === String(storyId));
          if (target) {
            options?.onToast?.(`Đã xóa "${target.title}" khỏi tủ truyện (Đồng bộ server)`, "info");
          }
          return prev.filter((b) => b.id !== storyId && String(b.id) !== String(storyId));
        });
      } else {
        options?.onToast?.(res.error?.message || "Thao tác thất bại", "info");
      }
      return;
    }

    // Cục bộ
    setBookmarks((prev) => {
      const target = prev.find((b) => b.id === storyId || String(b.id) === String(storyId));
      const next = prev.filter((b) => b.id !== storyId && String(b.id) !== String(storyId));
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("bookmarks-updated"));
      } catch {}
      if (target) {
        options?.onToast?.(`Đã xóa "${target.title}" khỏi tủ truyện`, "info");
      }
      return next;
    });
  }, [isAuthenticated, options]);

  const toggleBookmark = useCallback(async (story: PublicStoryListItemDto) => {
    const exists = bookmarks.some((b) => b.id === story.id || String(b.id) === String(story.id));
    if (exists) {
      await removeBookmark(story.id);
    } else {
      await addBookmark(story);
    }
  }, [bookmarks, addBookmark, removeBookmark]);

  const isBookmarked = useCallback((storyId: string | number) => {
    return bookmarks.some((b) => b.id === storyId || String(b.id) === String(storyId));
  }, [bookmarks]);

  const clearAll = useCallback(() => {
    if (isAuthenticated) {
      options?.onToast?.("Vui lòng bỏ theo dõi từng truyện trên server.", "info");
      return;
    }

    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.dispatchEvent(new Event("bookmarks-updated"));
    } catch {}
    setBookmarks([]);
    options?.onToast?.("Đã xóa toàn bộ tủ truyện cục bộ", "info");
  }, [isAuthenticated, options]);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAll,
  };
}
