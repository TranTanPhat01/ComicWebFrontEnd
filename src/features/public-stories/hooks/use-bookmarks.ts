"use client";

import { useState, useEffect, useCallback } from "react";
import type { PublicStoryListItemDto } from "../types/public-story.types";

const LOCAL_STORAGE_KEY = "comic_web_bookmarks";

interface UseBookmarksOptions {
  /** Optional toast callback: called when bookmark state changes */
  onToast?: (message: string, variant: "success" | "info") => void;
}

export function useBookmarks(options?: UseBookmarksOptions) {
  const [bookmarks, setBookmarks] = useState<PublicStoryListItemDto[]>([]);

  // Function to load bookmarks from localStorage
  const loadBookmarks = useCallback(() => {
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
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBookmarks();

    // Listen to updates from other tabs or components
    window.addEventListener("bookmarks-updated", loadBookmarks);
    return () => {
      window.removeEventListener("bookmarks-updated", loadBookmarks);
    };
  }, [loadBookmarks]);

  const addBookmark = useCallback((story: PublicStoryListItemDto) => {
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
  }, [options]);

  const removeBookmark = useCallback((storyId: string | number) => {
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
  }, [options]);

  const toggleBookmark = useCallback((story: PublicStoryListItemDto) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === story.id);
      const next = exists ? prev.filter((b) => b.id !== story.id) : [...prev, story];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("bookmarks-updated"));
      } catch {}
      if (exists) {
        options?.onToast?.(`Đã xóa "${story.title}" khỏi tủ truyện`, "info");
      } else {
        options?.onToast?.(`Đã thêm "${story.title}" vào tủ truyện`, "success");
      }
      return next;
    });
  }, [options]);

  const isBookmarked = useCallback((storyId: string | number) => {
    return bookmarks.some((b) => b.id === storyId || String(b.id) === String(storyId));
  }, [bookmarks]);

  const clearAll = useCallback(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.dispatchEvent(new Event("bookmarks-updated"));
    } catch {}
    setBookmarks([]);
    options?.onToast?.("Đã xóa toàn bộ tủ truyện", "info");
  }, [options]);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAll,
  };
}
