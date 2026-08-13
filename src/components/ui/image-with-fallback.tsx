"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { resolveImageUrl } from "@/lib/utils";

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

  const getInitials = (text?: string) => {
    if (!text || typeof text !== "string") return "";
    return text
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word ? word[0] : "")
      .join("")
      .toUpperCase();
  };

  const resolved = resolveImageUrl(src);
  const hasImage = src && src.trim() !== "" && !error;



  return (
    <div className="image-container-wrapper" style={fill ? { position: "relative", width: "100%", height: "100%" } : undefined}>
      {hasImage ? (
        <img
          src={resolved}
          alt={alt}
          onError={() => {
            setError(true);
          }}
          className={className}
          style={fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, objectFit: "cover" } : undefined}
          {...(props as Record<string, unknown>)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/fallback-cover.jpg"
          alt={alt}
          className={className}
          style={fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, objectFit: "cover" } : undefined}
          {...(props as Record<string, unknown>)}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
}
export default ImageWithFallback;
