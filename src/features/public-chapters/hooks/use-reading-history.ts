"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getReadingHistoryBrowser,
  upsertReadingHistoryBrowser,
  deleteReadingHistoryBrowser
} from "@/features/public-stories/api/user-activities-browser.api";

const STORAGE_KEY = "comic_web_reading_history";
const MAX_HISTORY = 50;

export interface ReadingHistoryEntry {
  storyId?: number;
  storySlug: string;
  storyTitle: string;
  coverUrl?: string;
  chapterId?: number;
  chapterSlug: string;
  chapterNumber: number;
  chapterTitle?: string;
  readAt: string; // ISO string
}

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);
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

  const load = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const res = await getReadingHistoryBrowser(1, 50);
        if (res.success && res.data) {
          const items = (res.data as any).items || (res.data as any).data || [];
          const mapped: ReadingHistoryEntry[] = items.map((x: any) => ({
            storyId: x.storyId,
            storySlug: x.storySlug,
            storyTitle: x.storyTitle,
            coverUrl: x.coverImageUrl || undefined,
            chapterId: x.chapterId,
            chapterSlug: x.chapterSlug,
            chapterNumber: x.chapterNumber,
            chapterTitle: x.chapterTitle || undefined,
            readAt: x.lastReadAt
          }));
          setHistory(mapped);
          return;
        }
      } catch (err) {
        console.error("Failed to load reading history from server", err);
      }
    }

    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    void load();

    // Listen to updates from other tabs
    window.addEventListener("reading-history-updated", () => { void load(); });
    return () => {
      window.removeEventListener("reading-history-updated", () => { void load(); });
    };
  }, [load]);

  const saveEntry = useCallback(
    async (entry: Omit<ReadingHistoryEntry, "readAt">) => {
      if (isAuthenticated && entry.storyId && entry.chapterId) {
        // Lưu lên server
        const res = await upsertReadingHistoryBrowser(entry.storyId, entry.chapterId);
        if (res.success) {
          setHistory((prev) => {
            const filtered = prev.filter((e) => e.storySlug !== entry.storySlug);
            return [
              { ...entry, readAt: new Date().toISOString() },
              ...filtered,
            ].slice(0, MAX_HISTORY);
          });
        }
        return;
      }

      // Cục bộ
      setHistory((prev) => {
        const filtered = prev.filter((e) => e.storySlug !== entry.storySlug);
        const updated: ReadingHistoryEntry[] = [
          { ...entry, readAt: new Date().toISOString() },
          ...filtered,
        ].slice(0, MAX_HISTORY);

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          window.dispatchEvent(new Event("reading-history-updated"));
        } catch {}
        return updated;
      });
    },
    [isAuthenticated]
  );

  const getEntry = useCallback(
    (storySlug: string): ReadingHistoryEntry | null => {
      return history.find((e) => e.storySlug === storySlug) ?? null;
    },
    [history]
  );

  const clearHistory = useCallback(() => {
    if (isAuthenticated) {
      // Vì trên server không có API clear toàn bộ nhanh, ta chỉ xóa local hoặc bỏ qua
      // Để tránh mất mát, ta giữ nguyên trên server và cho phép xóa cục bộ
      setHistory([]);
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("reading-history-updated"));
    } catch {}
    setHistory([]);
  }, [isAuthenticated]);

  return { history, saveEntry, getEntry, clearHistory };
}
