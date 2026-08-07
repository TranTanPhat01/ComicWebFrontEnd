"use client";

import { useState, useEffect, useCallback } from "react";
import { rateStory, getMyStoryRating } from "../api/engagement.api";

interface UseRatingProps {
  storyId: number;
  initialAverageRating: number | null | undefined;
  initialRatingCount: number | undefined;
  initialMyRating: number | null | undefined;
  isLoggedIn: boolean;
  onToast?: (message: string, variant: "success" | "error") => void;
}

export function useRating({
  storyId,
  initialAverageRating,
  initialRatingCount,
  initialMyRating,
  isLoggedIn,
  onToast,
}: UseRatingProps) {
  const [averageRating, setAverageRating] = useState<number | null>(initialAverageRating ?? null);
  const [ratingCount, setRatingCount] = useState<number>(initialRatingCount ?? 0);
  const [myRating, setMyRating] = useState<number | null>(initialMyRating ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync myRating from server when user log in
  useEffect(() => {
    if (!isLoggedIn) {
      setMyRating(null);
      return;
    }

    let active = true;
    getMyStoryRating(storyId).then((res) => {
      if (active && res.success && res.data) {
        setMyRating(res.data.myRating);
        setAverageRating(res.data.averageRating);
        setRatingCount(res.data.ratingCount);
      }
    });

    return () => {
      active = false;
    };
  }, [storyId, isLoggedIn]);

  const submitRating = useCallback(
    async (score: number) => {
      if (!isLoggedIn) {
        onToast?.("Vui lòng đăng nhập để đánh giá truyện.", "error");
        return;
      }

      if (score < 1 || score > 5) return;

      setIsSubmitting(true);
      try {
        const response = await rateStory(storyId, score);
        if (response.success) {
          // Optimistically update rating aggregate on UI
          const oldRating = myRating;
          setMyRating(score);

          setRatingCount((prev) => (oldRating === null ? prev + 1 : prev));
          setAverageRating((prevAvg) => {
            const currentAvg = prevAvg ?? 0;
            const currentCount = ratingCount;
            if (oldRating === null) {
              const newTotal = currentAvg * currentCount + score;
              const newCount = currentCount + 1;
              return Math.round((newTotal / newCount) * 10) / 10;
            } else {
              const newTotal = currentAvg * currentCount - oldRating + score;
              return Math.round((newTotal / currentCount) * 10) / 10;
            }
          });

          onToast?.("Đánh giá của bạn đã được ghi nhận!", "success");
        } else {
          onToast?.(response.error.message || "Đánh giá thất bại.", "error");
        }
      } catch (err) {
        onToast?.("Không thể kết nối đến máy chủ.", "error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [storyId, isLoggedIn, myRating, ratingCount, onToast]
  );

  return {
    averageRating,
    ratingCount,
    myRating,
    submitRating,
    isSubmitting,
  };
}
