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
    stories: {
      list: `${V1}/admin/stories`,
      detail: (storyId: string) => `${V1}/admin/stories/${storyId}`,
      create: `${V1}/admin/stories`,
      update: (storyId: string) => `${V1}/admin/stories/${storyId}`,
      delete: (storyId: string) => `${V1}/admin/stories/${storyId}`,
    },
    chapters: {
      list: (storyId: string) => `${V1}/admin/stories/${storyId}/chapters`,
      detail: (storyId: string, chapterId: string) =>
        `${V1}/admin/stories/${storyId}/chapters/${chapterId}`,
    },
    genres: {
      list: `${V1}/admin/genres`,
      create: `${V1}/admin/genres`,
      update: (genreId: number) => `${V1}/admin/genres/${genreId}`,
      delete: (genreId: number) => `${V1}/admin/genres/${genreId}`,
    },
    auditLogs: {
      list: `${V1}/admin/audit-logs`,
    },
  },
} as const;
