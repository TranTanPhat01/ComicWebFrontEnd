import { browserGet, browserPost, browserDelete, browserPut } from "@/lib/api/browser-api-client";
import type { ApiResponse } from "@/lib/api/api-response";
import type { CommentDto } from "@/features/public-stories/types/comment.types";

export interface CommentListResponse {
  items: CommentDto[];
  meta: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface RateStoryRequest {
  score: number;
}

export interface StoryRatingDto {
  storyId: number;
  score: number;
  updatedAt: string;
}

export interface RatingAggregateDto {
  averageRating: number;
  ratingCount: number;
  myRating: number | null;
}

/**
 * Fetch comments for a story (and optionally a specific chapter).
 */
export async function getStoryComments(
  storyId: number,
  chapterId?: number | null,
  page = 1,
  pageSize = 20
): Promise<ApiResponse<CommentListResponse>> {
  const params: Record<string, string | number> = { page, pageSize };
  if (chapterId) params.chapterId = chapterId;

  return browserGet<CommentListResponse>(`/api/v1/stories/${storyId}/comments`, params);
}

/**
 * Post a new comment or reply.
 */
export async function createStoryComment(
  storyId: number,
  chapterId: number | null,
  parentCommentId: number | null,
  content: string
): Promise<ApiResponse<CommentDto>> {
  return browserPost<CommentDto>(`/api/v1/stories/${storyId}/comments`, {
    chapterId,
    parentCommentId,
    content,
  });
}

/**
 * Edit an existing comment.
 */
export async function editStoryComment(
  storyId: number,
  commentId: number,
  content: string
): Promise<ApiResponse<CommentDto>> {
  return browserPut<CommentDto>(`/api/v1/stories/${storyId}/comments/${commentId}`, {
    content,
  });
}

/**
 * Delete a comment.
 */
export async function deleteStoryComment(
  storyId: number,
  commentId: number
): Promise<ApiResponse<string>> {
  return browserDelete<string>(`/api/v1/stories/${storyId}/comments/${commentId}`);
}

/**
 * Rate a story (1-5 stars).
 */
export async function rateStory(
  storyId: number,
  score: number
): Promise<ApiResponse<StoryRatingDto>> {
  return browserPost<StoryRatingDto>(`/api/v1/me/ratings/${storyId}`, { score });
}

/**
 * Get current reader's rating and overall story rating aggregate.
 */
export async function getMyStoryRating(
  storyId: number
): Promise<ApiResponse<RatingAggregateDto>> {
  return browserGet<RatingAggregateDto>(`/api/v1/me/ratings/${storyId}`);
}
