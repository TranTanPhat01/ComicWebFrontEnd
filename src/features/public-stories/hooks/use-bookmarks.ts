"use client";

import { useState, useEffect } from "react";
import type { PublicStoryListItemDto } from "../types/public-story.types";

const LOCAL_STORAGE_KEY = "comic_web_bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<PublicStoryListItemDto[]>([]);

  // Function to load bookmarks from localStorage
  const loadBookmarks = () => {
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
  };

  // Load on mount
  useEffect(() => {
    loadBookmarks();

    // Listen to updates from other tabs or components
    const handleUpdate = () => {
      loadBookmarks();
    };

    window.addEventListener("bookmarks-updated", handleUpdate);
    return () => {
      window.removeEventListener("bookmarks-updated", handleUpdate);
    };
  }, []);

  const saveBookmarks = (newBookmarks: PublicStoryListItemDto[]) => {
    setBookmarks(newBookmarks);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newBookmarks));
      // Dispatch event to sync immediately across components
      window.dispatchEvent(new Event("bookmarks-updated"));
    } catch (e) {
      console.error("Error saving bookmarks to localStorage", e);
    }
  };

  const addBookmark = (story: PublicStoryListItemDto) => {
    if (bookmarks.some((b) => b.id === story.id)) return;
    const newBookmarks = [...bookmarks, story];
    saveBookmarks(newBookmarks);
  };

  const removeBookmark = (storyId: string) => {
    const newBookmarks = bookmarks.filter((b) => b.id !== storyId);
    saveBookmarks(newBookmarks);
  };

  const toggleBookmark = (story: PublicStoryListItemDto) => {
    if (bookmarks.some((b) => b.id === story.id)) {
      removeBookmark(story.id);
    } else {
      addBookmark(story);
    }
  };

  const isBookmarked = (storyId: string) => {
    return bookmarks.some((b) => b.id === storyId);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
  };
}
