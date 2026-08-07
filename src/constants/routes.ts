/**
 * Application route constants.
 * Use these instead of hardcoding path strings in components and links.
 */

export const ROUTES = {
  // ── Public routes ─────────────────────────────────────────────────────────
  home: "/",
  genres: "/tim-kiem",
  newUpdates: "/moi-cap-nhat",
  hot: "/hot",
  completed: "/hoan-thanh",
  search: "/tim-kiem",
  bookcase: "/theo-doi",
  storyDetail: (storySlug: string) => `/truyen/${storySlug}`,
  chapterDetail: (storySlug: string, chapterSlug: string) =>
    `/truyen/${storySlug}/chuong/${chapterSlug}`,

  // ── Auth routes ───────────────────────────────────────────────────────────
  login: "/login",
  adminLogin: "/admin/login",

  // ── Admin routes ──────────────────────────────────────────────────────────
  adminDashboard: "/admin",
  adminStories: "/admin/stories",
  adminStoryChapters: (storyId: string) => `/admin/stories/${storyId}/chapters`,
  adminGenres: "/admin/genres",
  adminAuditLogs: "/admin/audit-logs",
  adminScraper: "/admin/scraper",
  adminSettings: "/admin/settings",
} as const;

// Type-safe route params
export type StorySlugParam = { storySlug: string };
export type ChapterSlugParam = { storySlug: string; chapterSlug: string };
