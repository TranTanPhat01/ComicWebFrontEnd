"use client";

import React, { useState } from "react";
import { useRating } from "../hooks/use-rating";
import { useAuthSession } from "../hooks/use-auth-session";
import { useToast } from "@/providers/toast-provider";

interface StarRatingProps {
  storyId: number;
  initialAverageRating: number | null | undefined;
  initialRatingCount: number | undefined;
  initialMyRating: number | null | undefined;
}

export function StarRating({
  storyId,
  initialAverageRating,
  initialRatingCount,
  initialMyRating,
}: StarRatingProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuthSession();
  
  const {
    averageRating,
    ratingCount,
    myRating,
    submitRating,
    isSubmitting,
  } = useRating({
    storyId,
    initialAverageRating,
    initialRatingCount,
    initialMyRating,
    isLoggedIn: isAuthenticated,
    onToast: (msg, variant) => toast(msg, variant),
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleStarClick = (score: number) => {
    if (!isAuthenticated) {
      toast("Vui lòng đăng nhập để đánh giá truyện.", "error");
      return;
    }
    if (isSubmitting) return;
    submitRating(score);
  };

  return (
    <div className="star-rating-container">
      <div className="star-rating__stars">
        {[1, 2, 3, 4, 5].map((star) => {
          const isGold = hoverRating !== null ? star <= hoverRating : star <= (myRating || averageRating || 0);
          return (
            <button
              key={star}
              type="button"
              className={`star-rating__star-btn ${isGold ? "star-rating__star-btn--active" : ""}`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => isAuthenticated && setHoverRating(star)}
              onMouseLeave={() => isAuthenticated && setHoverRating(null)}
              disabled={isSubmitting}
              aria-label={`Đánh giá ${star} sao`}
            >
              <svg
                className="star-rating__star-icon"
                viewBox="0 0 24 24"
                fill={isGold ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.178 0l-3.97 2.883c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.772-.57-.373-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z"
                />
              </svg>
            </button>
          );
        })}
      </div>
      
      <div className="star-rating__stats">
        <span className="star-rating__avg-score">{averageRating ? averageRating.toFixed(1) : "0.0"}/5</span>
        <span className="star-rating__count">({ratingCount} đánh giá)</span>
        {myRating !== null && (
          <span className="star-rating__my-status">Bạn đã đánh giá: {myRating}⭐</span>
        )}
      </div>

      <style jsx global>{`
        .star-rating-container {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          background: rgba(255, 255, 255, 0.03);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          width: fit-content;
        }
        .star-rating__stars {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        .star-rating__star-btn {
          background: none;
          border: none;
          padding: 0;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: transform var(--transition-fast), color var(--transition-fast);
        }
        .star-rating__star-btn:hover {
          transform: scale(1.2);
        }
        .star-rating__star-btn--active {
          color: #f59e0b; /* Golden Yellow */
        }
        .star-rating__star-icon {
          width: 24px;
          height: 24px;
        }
        .star-rating__stats {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }
        .star-rating__avg-score {
          font-weight: bold;
          color: var(--color-text-primary);
        }
        .star-rating__count {
          color: var(--color-text-muted);
        }
        .star-rating__my-status {
          margin-left: var(--space-2);
          font-size: 0.85rem;
          background: rgba(54, 143, 139, 0.15);
          color: var(--color-primary-light);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
}
