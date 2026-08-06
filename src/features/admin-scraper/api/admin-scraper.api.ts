import { browserPost } from "@/lib/api/browser-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type {
  ScrapedStoryMetadataDto,
  ScrapeMetadataRequestDto,
  ScrapeChapterRequestDto,
} from "../types/admin-scraper.types";

export async function getScrapedMetadata(
  payload: ScrapeMetadataRequestDto,
  accessToken?: string
): Promise<ApiResponse<ScrapedStoryMetadataDto>> {
  return browserPost(API_ROUTES.admin.scraper.metadata, payload, { accessToken });
}

export async function importScrapedChapter(
  storyId: number,
  payload: ScrapeChapterRequestDto,
  accessToken?: string
): Promise<ApiResponse<number>> {
  return browserPost(API_ROUTES.admin.scraper.importChapter(storyId), payload, { accessToken });
}
