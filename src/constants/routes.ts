/**
 * Application route constants.
 * Use these instead of hardcoding path strings in components and links.
 */

export const ROUTES = {
  // ── Public routes ─────────────────────────────────────────────────────────
  home: "/",
  storyDetail: (storySlug: string) => `/truyen/${storySlug}`,
  chapterDetail: (storySlug: string, chapterSlug: string) =>
    `/truyen/${storySlug}/chuong/${chapterSlug}`,

  // ── Auth routes ───────────────────────────────────────────────────────────
  adminLogin: "/admin/login",

  // ── Admin routes ──────────────────────────────────────────────────────────
  adminDashboard: "/admin",
  adminStories: "/admin/stories",
  adminStoryChapters: (storyId: string) => `/admin/stories/${storyId}/chapters`,
  adminGenres: "/admin/genres",
  adminAuditLogs: "/admin/audit-logs",
} as const;

// Type-safe route params
export type StorySlugParam = { storySlug: string };
export type ChapterSlugParam = { storySlug: string; chapterSlug: string };
