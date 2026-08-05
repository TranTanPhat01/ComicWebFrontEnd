"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "comic_web_reading_history";
const MAX_HISTORY = 50; // keep last 50 entries

export interface ReadingHistoryEntry {
  storySlug: string;
  storyTitle: string;
  coverUrl?: string;
  chapterSlug: string;
  chapterNumber: number;
  chapterTitle?: string;
  readAt: string; // ISO string
}

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const saveEntry = useCallback(
    (entry: Omit<ReadingHistoryEntry, "readAt">) => {
      setHistory((prev) => {
        // Remove existing entry for same story
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
    []
  );

  const getEntry = useCallback(
    (storySlug: string): ReadingHistoryEntry | null => {
      return history.find((e) => e.storySlug === storySlug) ?? null;
    },
    [history]
  );

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("reading-history-updated"));
    } catch {}
    setHistory([]);
  }, []);

  return { history, saveEntry, getEntry, clearHistory };
}
