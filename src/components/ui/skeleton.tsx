import React from "react";

interface StoryCardSkeletonProps {
  count?: number;
}

export function StoryCardSkeleton({ count = 8 }: StoryCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="story-card-skeleton" aria-hidden="true">
          <div className="story-card-skeleton__cover skeleton-shimmer" />
          <div className="story-card-skeleton__body">
            <div className="story-card-skeleton__title skeleton-shimmer" />
            <div className="story-card-skeleton__subtitle skeleton-shimmer" />
            <div className="story-card-skeleton__meta skeleton-shimmer" />
          </div>
        </div>
      ))}
    </>
  );
}

export function StoryGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="story-grid story-grid--skeleton">
      <StoryCardSkeleton count={count} />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="hero-skeleton" aria-hidden="true">
      <div className="hero-skeleton__bg skeleton-shimmer" />
      <div className="hero-skeleton__content">
        <div className="hero-skeleton__cover skeleton-shimmer" />
        <div className="hero-skeleton__info">
          <div className="hero-skeleton__badge skeleton-shimmer" />
          <div className="hero-skeleton__title skeleton-shimmer" />
          <div className="hero-skeleton__meta skeleton-shimmer" />
          <div className="hero-skeleton__actions">
            <div className="hero-skeleton__btn skeleton-shimmer" />
            <div className="hero-skeleton__btn skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
