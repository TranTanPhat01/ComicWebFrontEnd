"use client";

import React, { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollableHeight = docHeight - winHeight;

      if (scrollableHeight <= 0) {
        setProgress(0);
        ticking = false;
        return;
      }

      const scrolledPercentage = (scrollTop / scrollableHeight) * 100;
      setProgress(Math.min(100, Math.max(0, Math.round(scrolledPercentage))));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    
    // Initial run
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="reading-progress-container" aria-hidden="true">
      <div 
        className="reading-progress-bar" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}

export default ReadingProgress;
