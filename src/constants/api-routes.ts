/**
 * Backend API route constants.
 * All paths are relative to the API base URL.
 */

const V1 = "/api/v1";

export const API_ROUTES = {
  // ── Public Stories ────────────────────────────────────────────────────────
  public: {
    stories: {
      list: `${V1}/stories`,
      detail: (storySlug: string) => `${V1}/stories/${storySlug}`,
      genres: `${V1}/stories/genres`,
      chapters: (storySlug: string) =>
        `${V1}/stories/${storySlug}/chapters`,
      chapterDetail: (storySlug: string, chapterSlug: string) =>
        `${V1}/stories/${storySlug}/chapters/${chapterSlug}`,
    },
  },

  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    login: `${V1}/auth/login`,
    refresh: `${V1}/auth/refresh`,
    logout: `${V1}/auth/logout`,
    me: `${V1}/auth/me`,
    changePassword: `${V1}/auth/change-password`,
  },

  // ── Admin Stories ─────────────────────────────────────────────────────────
  admin: {
    stats: "/api/admin/stats",
    stories: {
      list: `${V1}/admin/stories`,
      detail: (storyId: string | number) => `${V1}/admin/stories/${storyId}`,
      create: `${V1}/admin/stories`,
      update: (storyId: string | number) => `${V1}/admin/stories/${storyId}`,
      delete: (storyId: string | number) => `${V1}/admin/stories/${storyId}`,
      schedule: (storyId: string | number) => `${V1}/admin/stories/${storyId}/schedule`,
      restore: (storyId: string | number) => `${V1}/admin/stories/${storyId}/restore`,
      publish: (storyId: string | number) => `${V1}/admin/stories/${storyId}/publish`,
      unpublish: (storyId: string | number) => `${V1}/admin/stories/${storyId}/unpublish`,
      hide: (storyId: string | number) => `${V1}/admin/stories/${storyId}/hide`,
      complete: (storyId: string | number) => `${V1}/admin/stories/${storyId}/complete`,
    },
    chapters: {
      list: (storyId: string | number) => `${V1}/admin/stories/${storyId}/chapters`,
      detail: (storyId: string | number, chapterId: string | number) =>
        `${V1}/admin/stories/${storyId}/chapters/${chapterId}`,
      restore: (storyId: string | number, chapterId: string | number) =>
        `${V1}/admin/stories/${storyId}/chapters/${chapterId}/restore`,
      publish: (chapterId: string | number) =>
        `${V1}/admin/chapters/${chapterId}/publish`,
      unpublish: (chapterId: string | number) =>
        `${V1}/admin/chapters/${chapterId}/unpublish`,
      hide: (chapterId: string | number) =>
        `${V1}/admin/chapters/${chapterId}/hide`,
    },
    genres: {
      list: `${V1}/admin/genres`,
      create: `${V1}/admin/genres`,
      update: (genreId: number) => `${V1}/admin/genres/${genreId}`,
      delete: (genreId: number) => `${V1}/admin/genres/${genreId}`,
    },
    scraper: {
      metadata: `${V1}/admin/scraper/metadata`,
      importChapter: (storyId: string | number) => `${V1}/admin/scraper/stories/${storyId}/chapter`,
    },
    auditLogs: {
      list: `${V1}/admin/audit-logs`,
    },
  },
} as const;
