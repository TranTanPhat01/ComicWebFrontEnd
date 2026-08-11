/**
 * Public chapter DTOs.
 * These are the shapes returned by /api/v1/stories/{slug}/chapters (public).
 * Keep separate from admin-chapters DTOs.
 * Field names must match JSON serialised output from BE (camelCase).
 */

/** Navigation reference to adjacent chapter. Matches BE ChapterNavigationDto. */
export interface ChapterNavigationDto {
  slug: string;
  number: number;
  title: string;
}

/** Story reference embedded in chapter detail. Matches BE PublicStoryReferenceDto. */
export interface PublicStoryReferenceDto {
  id: number;
  slug: string;
  title: string;
}

/**
 * Chapter summary returned in list endpoint GET /api/v1/stories/{slug}/chapters.
 * Matches BE PublicChapterSummaryDto.
 */
export interface PublicChapterListItemDto {
  id: number;
  slug: string;
  /** BE field: number (not chapterNumber) */
  number: number;
  title: string;
  publishedAt: string | null;
}

/**
 * Chapter detail returned in GET /api/v1/stories/{slug}/chapters/{chapterSlug}.
 * Matches BE PublicChapterDetailDto.
 * NOTE: No isLocked or affiliateLink in public endpoint — those are admin-only fields.
 */
export interface PublicChapterDetailDto {
  id: number;
  /** Story reference — use story.slug for navigation. */
  story: PublicStoryReferenceDto;
  slug: string;
  /** BE field: number (not chapterNumber) */
  number: number;
  title: string;
  content: string | null;
  publishedAt: string | null;
  /** Navigation to previous chapter. BE returns object not slug string. */
  previousChapter: ChapterNavigationDto | null;
  /** Navigation to next chapter. BE returns object not slug string. */
  nextChapter: ChapterNavigationDto | null;
  /** Shopee lock monetization fields */
  isLocked?: boolean;
  affiliateLink?: string | null;
  affiliateImage?: string | null;
}
