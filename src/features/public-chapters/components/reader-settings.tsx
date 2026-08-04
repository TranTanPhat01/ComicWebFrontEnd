"use client";

import React, { useEffect, useState } from "react";

export function ReaderSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("dark"); // default: dark for comic reader feel
  const [fitMode, setFitMode] = useState("width"); // default: width (width / viewport / original)
  const [spacing, setSpacing] = useState("none"); // default: none (none / narrow / wide)

  function applySettings(t: string, f: string, s: string) {
    const container = document.getElementById("chapter-reader-container");
    if (container) {
      // Apply theme class
      container.classList.remove("reader-theme--light", "reader-theme--sepia", "reader-theme--dark");
      container.classList.add(`reader-theme--${t}`);

      // Apply fit mode class
      container.classList.remove("reader-fit--width", "reader-fit--viewport", "reader-fit--original");
      container.classList.add(`reader-fit--${f}`);

      // Apply spacing class
      container.classList.remove("reader-spacing--none", "reader-spacing--narrow", "reader-spacing--wide");
      container.classList.add(`reader-spacing--${s}`);
    }
  }

  useEffect(() => {
    // Read from localStorage after mount
    const savedTheme = localStorage.getItem("reader-theme") || "dark";
    const savedFitMode = localStorage.getItem("reader-fit-mode") || "width";
    const savedSpacing = localStorage.getItem("reader-spacing") || "none";

    // Initializing state from localStorage post-mount is a standard client-side hydration pattern to avoid Next.js hydration mismatches
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);
    setFitMode(savedFitMode);
    setSpacing(savedSpacing);

    // Apply values to the DOM
    applySettings(savedTheme, savedFitMode, savedSpacing);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("reader-theme", newTheme);
    applySettings(newTheme, fitMode, spacing);
  };

  const handleFitModeChange = (newFitMode: string) => {
    setFitMode(newFitMode);
    localStorage.setItem("reader-fit-mode", newFitMode);
    applySettings(theme, newFitMode, spacing);
  };

  const handleSpacingChange = (newSpacing: string) => {
    setSpacing(newSpacing);
    localStorage.setItem("reader-spacing", newSpacing);
    applySettings(theme, fitMode, newSpacing);
  };

  return (
    <div className="reader-settings-wrapper">
      {/* Floating Gear Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="reader-settings-btn"
        aria-label="Cấu hình đọc truyện"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings Dropdown/Panel */}
      {isOpen && (
        <>
          <div className="reader-settings-backdrop" onClick={() => setIsOpen(false)} />
          <div className="reader-settings-panel" role="dialog" aria-label="Bảng cài đặt cấu hình đọc">
            <h4 className="reader-settings-panel__title">Cài đặt đọc truyện</h4>

            {/* Fit Mode Row */}
            <div className="reader-settings-panel__row">
              <span className="reader-settings-panel__label">Khung hình</span>
              <div className="reader-settings-panel__buttons-group">
                <button
                  onClick={() => handleFitModeChange("width")}
                  className={`reader-settings-panel__btn ${fitMode === "width" ? "reader-settings-panel__btn--active" : ""}`}
                >
                  Vừa Rộng
                </button>
                <button
                  onClick={() => handleFitModeChange("viewport")}
                  className={`reader-settings-panel__btn ${fitMode === "viewport" ? "reader-settings-panel__btn--active" : ""}`}
                >
                  Vừa Cao
                </button>
                <button
                  onClick={() => handleFitModeChange("original")}
                  className={`reader-settings-panel__btn ${fitMode === "original" ? "reader-settings-panel__btn--active" : ""}`}
                >
                  Gốc
                </button>
              </div>
            </div>

            {/* Spacing Row */}
            <div className="reader-settings-panel__row">
              <span className="reader-settings-panel__label">Khoảng cách trang</span>
              <div className="reader-settings-panel__buttons-group">
                <button
                  onClick={() => handleSpacingChange("none")}
                  className={`reader-settings-panel__btn ${spacing === "none" ? "reader-settings-panel__btn--active" : ""}`}
                >
                  Khít
                </button>
                <button
                  onClick={() => handleSpacingChange("narrow")}
                  className={`reader-settings-panel__btn ${spacing === "narrow" ? "reader-settings-panel__btn--active" : ""}`}
                >
                  Hẹp
                </button>
                <button
                  onClick={() => handleSpacingChange("wide")}
                  className={`reader-settings-panel__btn ${spacing === "wide" ? "reader-settings-panel__btn--active" : ""}`}
                >
                  Rộng
                </button>
              </div>
            </div>

            {/* Background Theme Color Row */}
            <div className="reader-settings-panel__row">
              <span className="reader-settings-panel__label">Giao diện đọc</span>
              <div className="reader-settings-panel__themes">
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`reader-settings-panel__theme-btn reader-settings-panel__theme-btn--light ${
                    theme === "light" ? "reader-settings-panel__theme-btn--active" : ""
                  }`}
                  aria-label="Giao diện Sáng"
                  title="Sáng"
                />
                <button
                  onClick={() => handleThemeChange("sepia")}
                  className={`reader-settings-panel__theme-btn reader-settings-panel__theme-btn--sepia ${
                    theme === "sepia" ? "reader-settings-panel__theme-btn--active" : ""
                  }`}
                  aria-label="Giao diện Cổ điển Sepia"
                  title="Sepia"
                />
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`reader-settings-panel__theme-btn reader-settings-panel__theme-btn--dark ${
                    theme === "dark" ? "reader-settings-panel__theme-btn--active" : ""
                  }`}
                  aria-label="Giao diện Tối"
                  title="Tối"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReaderSettings;
