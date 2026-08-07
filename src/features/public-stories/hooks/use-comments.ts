"use client";

import { useState, useEffect, useCallback } from "react";
import { getStoryComments, createStoryComment, deleteStoryComment } from "../api/engagement.api";
import type { CommentDto } from "@/features/public-stories/types/comment.types";

interface UseCommentsProps {
  storyId: number;
  chapterId?: number | null;
  onToast?: (message: string, variant: "success" | "error") => void;
}

export function useComments({ storyId, chapterId = null, onToast }: UseCommentsProps) {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchComments = useCallback(
    async (targetPage: number) => {
      setIsLoading(true);
      try {
        const response = await getStoryComments(storyId, chapterId, targetPage, 10);
        if (response.success) {
          setComments(response.data.items);
          setPage(response.data.meta.currentPage);
          setTotalPages(response.data.meta.totalPages);
          setTotalCount(response.data.meta.totalCount);
        } else {
          onToast?.(response.error.message || "Không thể tải bình luận.", "error");
        }
      } catch (err) {
        onToast?.("Lỗi kết nối máy chủ.", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [storyId, chapterId, onToast]
  );

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const addComment = useCallback(
    async (content: string, parentCommentId: number | null = null) => {
      if (stringIsEmpty(content)) return false;

      try {
        const response = await createStoryComment(storyId, chapterId, parentCommentId, content);
        if (response.success) {
          const newComment = response.data;
          
          if (parentCommentId === null) {
            // Add top-level comment
            setComments((prev) => [newComment, ...prev]);
            setTotalCount((prev) => prev + 1);
          } else {
            // Add reply comment nested
            setComments((prev) =>
              prev.map((c) => {
                if (c.id === parentCommentId) {
                  return {
                    ...c,
                    replies: [...(c.replies || []), newComment],
                  };
                }
                return c;
              })
            );
          }
          onToast?.("Đã đăng bình luận thành công!", "success");
          return true;
        } else {
          onToast?.(response.error.message || "Không thể đăng bình luận.", "error");
          return false;
        }
      } catch (err) {
        onToast?.("Lỗi kết nối máy chủ.", "error");
        return false;
      }
    },
    [storyId, chapterId, onToast]
  );

  const removeComment = useCallback(
    async (commentId: number, parentCommentId: number | null = null) => {
      try {
        const response = await deleteStoryComment(storyId, commentId);
        if (response.success) {
          if (parentCommentId === null) {
            // Remove top-level
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            setTotalCount((prev) => Math.max(0, prev - 1));
          } else {
            // Remove nested reply
            setComments((prev) =>
              prev.map((c) => {
                if (c.id === parentCommentId) {
                  return {
                    ...c,
                    replies: (c.replies || []).filter((r) => r.id !== commentId),
                  };
                }
                return c;
              })
            );
          }
          onToast?.("Bình luận đã được xóa.", "success");
          return true;
        } else {
          onToast?.(response.error.message || "Xóa bình luận thất bại.", "error");
          return false;
        }
      } catch (err) {
        onToast?.("Lỗi kết nối máy chủ.", "error");
        return false;
      }
    },
    [storyId, onToast]
  );

  return {
    comments,
    isLoading,
    page,
    totalPages,
    totalCount,
    addComment,
    removeComment,
    goToPage: fetchComments,
  };
}

function stringIsEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}
