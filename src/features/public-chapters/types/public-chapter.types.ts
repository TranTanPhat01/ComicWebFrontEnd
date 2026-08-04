/**
 * Public chapter DTOs.
 * These are the shapes returned by /api/v1/stories/{slug}/chapters (public).
 * Keep separate from admin-chapters DTOs.
 */

export interface PublicChapterListItemDto {
  id: string;
  title: string;
  slug: string;
  chapterNumber: number;
  publishedAt: string;
}

export interface PublicChapterDetailDto {
  id: string;
  title: string;
  slug: string;
  chapterNumber: number;
  content: string | null;
  publishedAt: string;
  isLocked: boolean;
  affiliateLink: string | null;
  /** Navigation */
  previousChapterSlug: string | null;
  nextChapterSlug: string | null;
}
