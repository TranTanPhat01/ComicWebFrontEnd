"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, "src" | "onError"> {
  src: string | null | undefined;
  fallbackText?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackText,
  className,
  fill,
  priority,
  sizes,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  const getInitials = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const sanitizedSrc = src
    ? src.replace(/^https?:\/\/localhost:\d+/, "").replace(/^https?:\/\/127\.0\.0\.1:\d+/, "")
    : src;

  const hasImage = sanitizedSrc && !error;



  return (
    <div className="image-container-wrapper">
      {hasImage ? (
        <img
          src={sanitizedSrc!}
          alt={alt}
          onError={() => {
            setError(true);
          }}
          className={className}
          style={fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, objectFit: "cover" } : undefined}
          {...(props as Record<string, unknown>)}
        />
      ) : (
        <div className="image-fallback-placeholder">
          <div className="image-fallback-placeholder__gradient" />
          <div className="image-fallback-placeholder__content">
            <svg
              className="image-fallback-placeholder__icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span className="image-fallback-placeholder__text">
              {fallbackText ? getInitials(fallbackText) : getInitials(alt)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
export default ImageWithFallback;
